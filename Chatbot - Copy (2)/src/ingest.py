import os
import re
from typing import List
from langchain_community.document_loaders import PyPDFLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from cleantext import clean
from src.utils import setup_logging

logger = setup_logging()

def clean_text_content(text: str) -> str:
    """
    Cleans the text content by removing headers/footers, normalizing whitespace, etc.
    """
    # Basic cleaning using clean-text library
    cleaned = clean(text, 
        fix_unicode=True, 
        to_ascii=True, 
        lower=False, 
        no_line_breaks=False,
        no_urls=False, 
        no_emails=False, 
        no_phone_numbers=False, 
        no_numbers=False, 
        no_digits=False, 
        no_currency_symbols=False, 
        no_punct=False, 
        replace_with_url="<URL>", 
        replace_with_email="<EMAIL>", 
        replace_with_phone_number="<PHONE>", 
        replace_with_number="<NUMBER>", 
        replace_with_digit="0", 
        replace_with_currency_symbol="<CUR>",
        lang="en"
    )
    
    # Custom cleaning for headers/footers (heuristic: short lines at start/end of pages)
    # This is rudimentary; sophisticated cleaning requires visual layout analysis.
    lines = cleaned.split('\n')
    # Remove very short lines that might be page numbers or headers
    filtered_lines = [line for line in lines if len(line.strip()) > 3 or line.strip() == ""]
    return "\n".join(filtered_lines)

def determine_metadata(file_path: str):
    """
    Determines metadata based on filename heuristics.
    Returns: type, rank
    Rank 1: Guideline (Highest priority)
    Rank 2: Textbook
    Rank 3: FAQ / Other
    """
    filename = os.path.basename(file_path).lower()
    
    if 'guideline' in filename:
        return 'guideline', 1
    elif 'textbook' in filename:
        return 'textbook', 2
    elif 'faq' in filename or file_path.endswith('.csv'):
        return 'faq', 3
    else:
        return 'textbook', 2 # Default to textbook

def ingest_documents(data_dir: str) -> List[Document]:
    """
    Loads all PDFs and CSVs from the data directory, cleans them, and chunks them.
    """
    documents = []
    
    if not os.path.exists(data_dir):
        logger.error(f"Data directory {data_dir} does not exist.")
        return []

    for filename in os.listdir(data_dir):
        file_path = os.path.join(data_dir, filename)
        doc_type, rank = determine_metadata(file_path)
        
        loaded_docs = []
        try:
            print(f"  Loading: {filename}...", end=" ", flush=True)
            if filename.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
                loaded_docs = loader.load()
            elif filename.endswith('.csv'):
                loader = CSVLoader(file_path, encoding="utf-8")
                loaded_docs = loader.load()
            else:
                continue # Skip unsupported files
            
            print(f"{len(loaded_docs)} pages/rows loaded.")
            # Sanitize filename for logging to avoid UnicodeEncodeError on some Windows consoles
            safe_filename = filename.encode('ascii', 'replace').decode('ascii')
            logger.info(f"Loaded {len(loaded_docs)} pages/rows from {safe_filename}")

            for doc in loaded_docs:
                # Clean content
                doc.page_content = clean_text_content(doc.page_content)
                
                # Update metadata
                doc.metadata['source'] = filename
                doc.metadata['type'] = doc_type
                doc.metadata['rank'] = rank
                # Ensure page number exists (CSV loader might not have it)
                if 'page' not in doc.metadata:
                    doc.metadata['page'] = 'N/A' # CSV row usually
                
                documents.append(doc)
                
        except Exception as e:
            logger.error(f"Error loading {filename}: {e}")

    # Chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000, # Approx 600-800 tokens (1 token ~ 4 chars)
        chunk_overlap=200, # Approx 50 tokens
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunked_docs = text_splitter.split_documents(documents)
    print(f"  Chunking complete: {len(chunked_docs)} chunks created.")
    logger.info(f"Total chunks created: {len(chunked_docs)}")
    
    return chunked_docs

if __name__ == "__main__":
    # Test run
    docs = ingest_documents('data')
    if docs:
        print(f"Sample chunk: {docs[0].page_content[:200]}")
        print(f"Metadata: {docs[0].metadata}")
