import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from src.vector_store import get_vector_store
from src.utils import setup_logging, load_env_vars

logger = setup_logging()
load_env_vars()


def format_docs(docs):
    """
    Formats retrieved documents into a string with metadata citations.
    """
    formatted_docs = []
    for doc in docs:
        source = doc.metadata.get('source', 'Unknown')
        page = doc.metadata.get('page', 'N/A')
        doc_type = doc.metadata.get('type', 'General')
        rank = doc.metadata.get('rank', 2)
        content = doc.page_content.replace("\n", " ")

        formatted_docs.append(
            f"Source: {source} (Page {page}) [Type: {doc_type}, Rank: {rank}]\n"
            f"Content: {content}\n"
        )

    return "\n\n".join(formatted_docs)


def get_rag_chain():
    """
    Creates a conversational RAG chain that handles follow-up questions.
    Uses only langchain_core primitives (no langchain_classic dependency).
    """
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        convert_system_message_to_human=True
    )

    # ── Step 1: History-aware question rephraser ──────────────────────────
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, formulate a standalone question "
        "which can be understood without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )

    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])

    # Chain that rephrases the question, then retrieves docs
    rephrase_chain = contextualize_q_prompt | llm | StrOutputParser()

    def _history_aware_retrieve(inp: dict) -> List:
        """If there is chat history, rephrase the question first; then retrieve."""
        chat_history = inp.get("chat_history", [])
        question = inp["input"]

        if chat_history:
            # Rephrase the question so it is self-contained
            question = rephrase_chain.invoke({
                "input": question,
                "chat_history": chat_history,
            })

        return retriever.invoke(question)

    # ── Step 2: QA answer prompt ──────────────────────────────────────────
    qa_system_prompt = """You are a highly reliable Medical Assistant Chatbot.
    Your goal is to answer medical questions based ONLY on the provided context.

    Instructions:
    1. Answer the user's question clearly and accurately using the context.
    2. Cite your sources for every key statement using the format (Source: filename, Page: X).
    3. If the context contains conflicting information (e.g., between a Guideline and a Textbook), explicitly mention the conflict. Prioritize "Guideline" (Rank 1) over "Textbook" (Rank 2) over "FAQ" (Rank 3) if you must choose, but state the discrepancy.
    4. If the answer is not in the context exactly, try to infer the answer from the context from your general knowledge as a LLM.
    5. If the question implies a medical emergency, warn the user to seek immediate professional help.
    6. Support both English and Arabic questions. Answer in the same language as the question.
    7. Remove the double astrisks in any output you make

    Context:
    {context}
    """

    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])

    answer_chain = qa_prompt | llm | StrOutputParser()

    # ── Step 3: Full RAG chain combining retrieval + answering ────────────
    def _full_chain(inp: dict) -> dict:
        """
        End-to-end RAG pipeline.
        Returns {"input": ..., "chat_history": ..., "context": [docs], "answer": str}
        """
        # Retrieve relevant documents (with optional question rephrasing)
        docs = _history_aware_retrieve(inp)

        # Format docs into a single context string
        context_str = format_docs(docs)

        # Generate the answer
        answer = answer_chain.invoke({
            "input": inp["input"],
            "chat_history": inp.get("chat_history", []),
            "context": context_str,
        })

        return {
            "input": inp["input"],
            "chat_history": inp.get("chat_history", []),
            "context": docs,
            "answer": answer,
        }

    # Wrap in a RunnableLambda so it behaves like a normal LangChain Runnable
    # (supports .invoke(), .batch(), .stream(), etc.)
    return RunnableLambda(_full_chain)


if __name__ == "__main__":
    # Test
    try:
        chain = get_rag_chain()
        print("RAG Chain initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize RAG Chain: {e}")

