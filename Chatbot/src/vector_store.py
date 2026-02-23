import os
import shutil
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
from typing import List, Optional
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEndpointEmbeddings, HuggingFaceEmbeddings
from langchain_core.documents import Document
from src.utils import setup_logging, load_env_vars

logger = setup_logging()
load_env_vars()

# Persistence directory for Chroma
PERSIST_DIRECTORY = os.path.join(os.getcwd(), "chroma_db")

def get_embeddings():
    """
    Returns the BGE-M3 embeddings.
    Tries to use the Inference API if token is present, else falls back to local.
    """
    api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    model_name = "BAAI/bge-m3"
    
    if api_token:
        logger.info(f"Using HuggingFace Endpoint Embeddings for {model_name}")
        return HuggingFaceEndpointEmbeddings(
            model=model_name,
            huggingfacehub_api_token=api_token
        )
    else:
        logger.warning("HUGGINGFACEHUB_API_TOKEN not found. Falling back to local BGE-M3 (this may be slow to download).")
        return HuggingFaceEmbeddings(model_name=model_name)

def get_vector_store():
    """
    Returns the existing Chroma vector store.
    """
    embeddings = get_embeddings()
    if os.path.exists(PERSIST_DIRECTORY):
        logger.info(f"Loading existing vector store from {PERSIST_DIRECTORY}")
        return Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)
    else:
        logger.info("No existing vector store found. Creating new one.")
        return Chroma(embedding_function=embeddings, persist_directory=PERSIST_DIRECTORY)

def index_documents(documents: List[Document]):
    """
    Adds documents to the Chroma vector store.
    """
    if not documents:
        logger.warning("No documents to index.")
        return

    print(f"  Indexing {len(documents)} chunks into vector database...")
    logger.info(f"Indexing {len(documents)} documents...")
    embeddings = get_embeddings()
    
    # Batch size for embedding to avoid API timeouts
    BATCH_SIZE = 32
    
    total_docs = len(documents)
    total_batches = (total_docs + BATCH_SIZE - 1) // BATCH_SIZE
    for i in range(0, total_docs, BATCH_SIZE):
        batch = documents[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        print(f"  Batch {batch_num}/{total_batches} ({len(batch)} docs)...", end=" ", flush=True)
        logger.info(f"Indexing batch {batch_num}/{total_batches} ({len(batch)} docs)")
        
        try:
            # Create or update the vector store with the batch
            if i == 0 and not os.path.exists(PERSIST_DIRECTORY):
                 vector_store = Chroma.from_documents(
                    documents=batch,
                    embedding=embeddings,
                    persist_directory=PERSIST_DIRECTORY
                )
            else:
                vector_store = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)
                vector_store.add_documents(batch)
            print("done.")
                
        except Exception as e:
            logger.error(f"Error indexing batch {i}: {e}")
            # Simple retry logic could be added here
            import time
            time.sleep(5)
            try:
                logger.info("Retrying batch...")
                vector_store = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)
                vector_store.add_documents(batch)
            except Exception as e2:
                logger.error(f"Failed retry for batch {i}: {e2}")

    print("  Indexing complete!")
    logger.info("Indexing complete.")

def clear_vector_store():
    """
    Clears the existing vector store by removing the persistence directory.
    """
    if os.path.exists(PERSIST_DIRECTORY):
        shutil.rmtree(PERSIST_DIRECTORY)
        logger.info("Vector store cleared.")

if __name__ == "__main__":
    # Test
    # This assumes some documents are passed, or just testing init
    get_vector_store()
