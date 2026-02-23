import logging
import os
import sys

def setup_logging(log_file='logs/app.log'):
    """
    Sets up logging configuration.
    """
    if not os.path.exists('logs'):
        os.makedirs('logs')

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

def load_env_vars():
    """
    Loads environment variables from .env file.
    """
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ["GOOGLE_API_KEY", "HUGGINGFACEHUB_API_TOKEN"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logging.warning(f"Missing environment variables: {', '.join(missing_vars)}. Make sure they are set in .env or the system environment.")
    else:
        logging.info("Environment variables loaded successfully.")
