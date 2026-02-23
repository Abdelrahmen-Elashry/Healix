import argparse
import os
import sys
import warnings
import logging

# ── Silence noisy libraries ──────────────────────────────────────
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"           # Suppress TensorFlow C++ logs
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"           # Suppress oneDNN notice
warnings.filterwarnings("ignore")                    # Suppress Python warnings (deprecation, etc.)

# Set all loggers to ERROR so only real problems show up
logging.basicConfig(level=logging.ERROR)
for _name in ["tensorflow", "tf_keras", "httpx", "chromadb",
               "google_genai", "langchain", "sentence_transformers",
               "root", "src.utils"]:
    logging.getLogger(_name).setLevel(logging.ERROR)
# ─────────────────────────────────────────────────────────────────

from src.ingest import ingest_documents
from src.vector_store import index_documents, clear_vector_store
from src.chatbot import MedicalChatbot
from src.utils import setup_logging, load_env_vars

logger = setup_logging()

def main():
    parser = argparse.ArgumentParser(description="Medical Assistant Chatbot CLI")
    parser.add_argument('--ingest', action='store_true', help='Ingest documents from data folder')
    parser.add_argument('--clear-db', action='store_true', help='Clear the vector database')
    parser.add_argument('--chat', action='store_true', help='Start chat mode')
    parser.add_argument('--data-dir', type=str, default='data', help='Directory for data ingestion')

    args = parser.parse_args()
    
    # Load environment variables
    load_env_vars()

    if args.clear_db:
        clear_vector_store()
        print("Vector database cleared.")

    if args.ingest:
        print(f"Ingesting documents from {args.data_dir}...")
        docs = ingest_documents(args.data_dir)
        if docs:
            index_documents(docs)
            print(f"Successfully indexed {len(docs)} chunks.")
        else:
            print("No documents found or failed to load.")

    if args.chat:
        bot = MedicalChatbot()
        print("\n=== HealixAI Chatbot ===")
        print("HealixAI: Hi there! I'm HealixAI, your medical assistant. How can I help you today?")
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                if user_input.lower() in ('q', 'quit'):
                    print("Goodbye!")
                    break
                if user_input.lower() == 'c':
                    bot.clear_history()
                    print("History cleared.")
                    continue
                
                if not user_input:
                    continue
                
                print("HealixAI is thinking...", end='\r')
                response = bot.get_answer(user_input)
                print(f"HealixAI: {response}\n")
                
            except KeyboardInterrupt:
                print("\nGoodbye!")
                break
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                print("\nAn error occurred. Check logs for details.")

    if not any([args.ingest, args.clear_db, args.chat]):
        parser.print_help()

if __name__ == "__main__":
    main()
