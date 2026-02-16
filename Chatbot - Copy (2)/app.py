from fastapi import FastAPI
from pydantic import BaseModel
from src.chatbot import MedicalChatbot
from src.utils import load_env_vars

load_env_vars()



app = FastAPI()
bot = MedicalChatbot()

from fastapi.middleware.cors import CORSMiddleware




@app.get("/")
def root():
    return {"message": "HealixAI backend is running"}

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(request: ChatRequest):
    answer = bot.get_answer(request.question)
    return {"answer": answer}

@app.post("/clear")
def clear_history():
    bot.clear_history()
    return {"status": "history cleared"}