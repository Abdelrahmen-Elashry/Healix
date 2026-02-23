# Healix AI ChatBot - Integration Guide

## Overview
The AI ChatBot component is a modern, professional chat interface integrated into the Healix Dashboard. It features smooth animations, typing indicators, quick actions, and is ready for AI API integration.

## Features ✨

### 1. **Beautiful UI**
- Floating action button (FAB) with pulse animation
- Modern chat window with gradient header
- Smooth slide-in animations for messages
- Typing indicator with animated dots
- Professional color scheme matching Healix brand

### 2. **Interactive Elements**
- Quick action buttons for common tasks:
  - 📅 Book Appointment
  - 📊 View Records
  - 💊 Medication Info
  - ❓ Ask Question
- Attachment button (ready for file uploads)
- Send button with hover effects
- Minimize/close controls

### 3. **Responsive Design**
- Desktop: Floating card (420x650px)
- Tablet: Adjusted sizing
- Mobile: Full-screen overlay

### 4. **Animations**
- FAB entrance animation with rotation
- Chat window scale and slide transition
- Message slide-in effects
- Hover effects on all interactive elements
- Typing indicator animation
- Status pulse animation

## Current Implementation

### File Structure
```
src/
├── ChatBot.js        # Main component with state management
├── ChatBot.css       # Complete styling with animations
└── Dashboard.js      # Integrated into dashboard
```

### Component State
```javascript
- isOpen          // Chat window visibility
- messages        // Array of chat messages
- inputValue      // Current input text
- isTyping        // AI typing indicator
```

### Message Structure
```javascript
{
  id: timestamp,
  type: 'user' | 'bot',
  text: 'message content',
  timestamp: Date object
}
```

## API Integration Guide 🔌

### Step 1: Choose Your AI Service

**Option A: OpenAI GPT**
```bash
npm install openai
```

**Option B: Google Gemini**
```bash
npm install @google/generative-ai
```

**Option C: Custom API**
Use fetch or axios for your custom endpoint

### Step 2: Add API Configuration

Create `src/config/aiConfig.js`:
```javascript
export const AI_CONFIG = {
  provider: 'openai', // or 'gemini', 'custom'
  apiKey: process.env.REACT_APP_AI_API_KEY,
  model: 'gpt-4', // or 'gemini-pro'
  temperature: 0.7,
  maxTokens: 500,
  systemPrompt: `You are a helpful medical assistant for Healix, 
  a medical portal. Provide accurate, empathetic responses about 
  health topics, appointments, and medical records. Always remind 
  users to consult healthcare professionals for medical advice.`
};
```

### Step 3: Create AI Service

Create `src/services/aiService.js`:

#### For OpenAI:
```javascript
import OpenAI from 'openai';
import { AI_CONFIG } from '../config/aiConfig';

const openai = new OpenAI({
  apiKey: AI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true // Note: Better to use backend proxy
});

export const sendMessageToAI = async (message, conversationHistory = []) => {
  try {
    const messages = [
      { role: 'system', content: AI_CONFIG.systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};
```

#### For Google Gemini:
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '../config/aiConfig';

const genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);

export const sendMessageToAI = async (message, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: AI_CONFIG.systemPrompt
    });

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};
```

#### For Custom Backend API:
```javascript
import { AI_CONFIG } from '../config/aiConfig';

export const sendMessageToAI = async (message, conversationHistory = []) => {
  try {
    const response = await fetch(`${AI_CONFIG.apiEndpoint}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
        userId: localStorage.getItem('user_id')
      })
    });

    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};
```

### Step 4: Update ChatBot Component

Modify `src/ChatBot.js` - Replace the `handleSendMessage` function:

```javascript
import { sendMessageToAI } from './services/aiService';

const handleSendMessage = async (e) => {
  e.preventDefault();
  
  if (!inputValue.trim()) return;

  // Add user message
  const userMessage = {
    id: Date.now(),
    type: 'user',
    text: inputValue,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    // Call AI API with conversation history
    const aiResponse = await sendMessageToAI(
      inputValue, 
      messages.slice(1) // Exclude initial greeting
    );

    // Add AI response
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: aiResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    // Error handling
    const errorMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};
```

### Step 5: Environment Variables

Create `.env` in your project root:
```env
REACT_APP_AI_API_KEY=your_api_key_here
REACT_APP_AI_PROVIDER=openai
REACT_APP_AI_MODEL=gpt-4
```

**Important**: Add `.env` to `.gitignore` to keep your API key secure!

### Step 6: Enhanced Features (Optional)

#### A. Add Patient Context
Pass patient data to AI for personalized responses:

```javascript
const getPatientContext = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return `Patient Name: ${user.first_name} ${user.last_name}
Age: ${user.age || 'N/A'}
Blood Type: ${user.blood_type || 'N/A'}`;
};

// Include in system prompt or conversation context
```

#### B. Add Medical Records Integration
```javascript
const handleQuickAction = async (action) => {
  if (action === 'records') {
    // Fetch records from your backend
    const records = await fetch('/api/patient-records').then(r => r.json());
    setInputValue(`Show me my recent medical records. I have ${records.length} records.`);
  }
};
```

#### C. Add Voice Input (Optional)
```javascript
const handleVoiceInput = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.onresult = (event) => {
    setInputValue(event.results[0][0].transcript);
  };
  recognition.start();
};
```

#### D. Add File Attachments
```javascript
const handleFileAttachment = async (file) => {
  // Upload file to backend
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { fileUrl } = await response.json();
  // Include fileUrl in message to AI
};
```

## Security Best Practices 🔒

### 1. **Never Expose API Keys in Frontend**
Use a backend proxy:
```javascript
// Backend (Node.js/Express example)
app.post('/api/chat', authenticateUser, async (req, res) => {
  const { message } = req.body;
  const aiResponse = await callAIService(message);
  res.json({ response: aiResponse });
});

// Frontend
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message }),
  credentials: 'include' // Send cookies
});
```

### 2. **Rate Limiting**
Implement rate limiting on backend to prevent abuse

### 3. **Input Sanitization**
Sanitize user input before sending to AI:
```javascript
const sanitizeInput = (text) => {
  return text.trim().substring(0, 1000); // Limit length
};
```

### 4. **Content Filtering**
Filter inappropriate content or medical advice that requires professional consultation

## Testing Checklist ✅

- [ ] Chat window opens/closes smoothly
- [ ] Messages display correctly
- [ ] Typing indicator shows during AI response
- [ ] Quick actions work
- [ ] Input field accepts text
- [ ] Send button disabled when input empty
- [ ] Responsive design on mobile
- [ ] Animations smooth on all devices
- [ ] AI responses are relevant
- [ ] Error handling works
- [ ] Conversation history maintained
- [ ] Scroll to bottom on new messages

## Troubleshooting 🔧

### Issue: "API key not found"
**Solution**: Check `.env` file and restart dev server

### Issue: "CORS error"
**Solution**: Use backend proxy or enable CORS on your API

### Issue: "Chat window not appearing"
**Solution**: Check z-index conflicts in CSS

### Issue: "Messages not scrolling"
**Solution**: Verify `messagesEndRef` is properly implemented

### Issue: "Animations laggy"
**Solution**: Check browser performance, reduce animation complexity

## Future Enhancements 💡

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Image analysis (for medical images)
- [ ] Appointment booking through AI
- [ ] Prescription reminders
- [ ] Health tips based on patient data
- [ ] Export chat history
- [ ] Share chat with doctor
- [ ] Dark mode toggle
- [ ] Custom chat themes

## Support

For issues or questions, contact the development team or check the Healix documentation.

---

**Built with ❤️ for Healix Medical Portal**
