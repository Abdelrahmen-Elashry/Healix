import os
import sys
from src.chatbot import MedicalChatbot
from src.utils import setup_logging, load_env_vars

logger = setup_logging()

def run_tests():
    print("=== Running Verification Tests ===")
    load_env_vars()
    
    # Ensure keys are present (basic check)
    if not os.getenv("GOOGLE_API_KEY"):
        print("ERROR: GOOGLE_API_KEY not found. Cannot run tests.")
        return
    if not os.getenv("HUGGINGFACEHUB_API_TOKEN"):
        print("WARNING: HUGGINGFACEHUB_API_TOKEN not found. Using local embeddings (slow).")

    try:
        bot = MedicalChatbot()
    except Exception as e:
        print(f"FAILED to initialize chatbot: {e}")
        return

    test_questions = [
        "What are the symptoms of diabetes?",
        "How do I treat a mild headache? (Check if guidelines mention it)",
        "Is there a conflict between the guideline and the textbook regarding hypertension targets?"
    ]

    for i, q in enumerate(test_questions, 1):
        print(f"\nTest Question {i}: {q}")
        try:
            answer = bot.get_answer(q)
            print(f"Answer:\n{answer}")
            print("-" * 50)
        except Exception as e:
            print(f"ERROR answering question {i}: {e}")

if __name__ == "__main__":
    run_tests()
