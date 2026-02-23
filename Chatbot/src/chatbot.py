from typing import List, Tuple
from langchain_core.messages import HumanMessage, AIMessage
from src.rag_engine import get_rag_chain
from src.utils import setup_logging

logger = setup_logging()

class MedicalChatbot:
    def __init__(self):
        self.chain = get_rag_chain()
        self.chat_history: List[Tuple[str, str]] = [] # List of (human, ai) tuples
        logger.info("Medical Chatbot initialized.")

    def get_answer(self, query: str) -> str:
        """
        Processes the query and returns the answer.
        """
        if not query:
            return ""

        logger.info(f"Processing query: {query}")
        
        # Convert history format for LangChain
        # LangChain expects a list of BaseMessage objects
        lc_history = []
        for h_msg, ai_msg in self.chat_history:
            lc_history.append(HumanMessage(content=h_msg))
            lc_history.append(AIMessage(content=ai_msg))
        
        try:
            response = self.chain.invoke({
                "input": query,
                "chat_history": lc_history
            })
            
            answer = response["answer"]
            
            # Update history
            self.chat_history.append((query, answer))
            
            # Retrieve source documents from response if needed for detailed inspection
            # context = response.get("context", [])
            # for doc in context:
            #     logger.info(f"Used source: {doc.metadata.get('source')}")

            return answer
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return "I apologize, but I encountered an error while processing your request. Please try again."

    def clear_history(self):
        self.chat_history = []
        logger.info("Chat history cleared.")
