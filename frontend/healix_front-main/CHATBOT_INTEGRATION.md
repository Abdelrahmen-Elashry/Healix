# 🤖 Healix AI Chatbot - Integration Guide

## 📋 Overview
ChatBot الموجود في React دلوقتي متربط بالـ FastAPI backend اللي عامله زميلك.

---

## 🚀 How to Run Everything

### 1️⃣ تشغيل FastAPI Backend (AI Chatbot API)

#### المتطلبات:
```bash
python 3.8+
fastapi
uvicorn
python-dotenv
```

#### خطوات التشغيل:
1. **روح لمجلد الـ backend** (اللي فيه `main.py`):
   ```bash
   cd path/to/healix-ai-backend
   ```

2. **نصب الـ dependencies**:
   ```bash
   pip install fastapi uvicorn python-dotenv
   ```

3. **شغل الـ server**:
   ```bash
   python main.py
   ```
   
   أو استخدم uvicorn مباشرة:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

4. **تأكد إن الـ server شغال**:
   - افتح: http://localhost:8001
   - المفروض تشوف: `{"message": "HealixAI backend is running"}`

---

### 2️⃣ تشغيل Laravel Backend (Medical Records API) - Port 8000

```bash
cd path/to/laravel-backend
php artisan serve
```

---

### 3️⃣ تشغيل React Frontend

```bash
cd C:\Users\ziko-\my-project\my-react-app
npm start
```

---

## 🔗 API Endpoints

### FastAPI Backend (Port 5000):

#### 1. Chat Endpoint
```http
POST http://localhost:5000/chat
Content-Type: application/json

{
  "question": "What are the symptoms of diabetes?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Diabetes symptoms include...",
  "timestamp": null
}
```

#### 2. Clear History
```http
POST http://localhost:5000/clear
```

**Response:**
```json
{
  "status": "success",
  "message": "Chat history cleared"
}
```

#### 3. Health Check
```http
GET http://localhost:5000/health
```

---

## ⚙️ Configuration

### في FastAPI Backend (main.py):
تأكد إن CORS مفعّل للـ React:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### في React Frontend (ChatBot.js):
الـ API URL موجود في:
```javascript
const response = await fetch('http://localhost:5000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ question: questionText })
});
```

---

## 🧪 Testing the Integration

### 1. Test FastAPI Directly:
```bash
# Using curl
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is hypertension?"}'

# Using PowerShell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/chat" `
  -ContentType "application/json" `
  -Body '{"question":"What is hypertension?"}'
```

### 2. Test from React:
1. شغل React app (npm start)
2. اضغط على ChatBot icon (الأيقونة العائمة)
3. اكتب أي سؤال طبي
4. المفروض يرد عليك من الـ AI

---

## 🐛 Troubleshooting

### مشكلة: "couldn't connect to the AI service"
**الحل:**
- تأكد إن FastAPI شغال على port 5000
- شوف الـ terminal بتاع FastAPI فيه errors
- تأكد من CORS settings

### مشكلة: CORS Error
**الحل:**
- تأكد إن `CORSMiddleware` موجود في `main.py`
- تأكد إن `allow_origins` فيه `http://localhost:3000`

### مشكلة: Backend مش راد
**الحل:**
- تأكد إن كل الـ dependencies منصبة:
  ```bash
  pip install -r requirements.txt
  ```
- تأكد إن ملف `.env` موجود لو محتاج environment variables

---

## 📊 Running All Services Together

### PowerShell Script (Windows):
```powershell
# Terminal 1: Laravel Backend
cd C:\path\to\laravel
php artisan serve

# Terminal 2: FastAPI Backend  
cd C:\path\to\healix-ai-backend
python main.py

# Terminal 3: React Frontend
cd C:\Users\ziko-\my-project\my-react-app
npm start
```

### Expected Ports:
- ✅ Laravel: http://localhost:8000
- ✅ FastAPI: http://localhost:5000  
- ✅ React: http://localhost:3000

---

## 🔄 Chat Flow

```
User types question in ChatBot
         ↓
React sends POST to /chat (port 5000)
         ↓
FastAPI processes with AI model
         ↓
Returns answer in JSON
         ↓
React displays answer in chat
```

---

## 📝 Notes

- الـ ChatBot بيستخدم port **5000** للـ AI Backend
- Laravel بيستخدم port **8000** للـ Medical Records
- React بيستخدم port **3000**
- كل الـ services محتاجة تكون شغالة في نفس الوقت
- لو غيرت port الـ FastAPI، غير الـ URL في `ChatBot.js`

---

## 🎯 Next Steps

1. ✅ شغّل FastAPI backend
2. ✅ تأكد إنه شغال: `curl http://localhost:5000`
3. ✅ شغّل React app
4. ✅ افتح ChatBot واكتب سؤال
5. ✅ تأكد إن الـ AI بيرد

---

**تم التعديل بنجاح! ChatBot دلوقتي متربط بـ FastAPI backend 🚀**
