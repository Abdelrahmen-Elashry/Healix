import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your Healix AI Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    const questionText = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call FastAPI backend
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.success ? data.answer : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I couldn\'t connect to the AI service. Please make sure the backend is running on port 5000.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { icon: '📅', text: 'Book Appointment', action: 'book' },
    { icon: '📊', text: 'View Records', action: 'records' },
    { icon: '💊', text: 'Medication Info', action: 'meds' },
    { icon: '❓', text: 'Ask Question', action: 'question' }
  ];

  const handleQuickAction = (action) => {
    const actionMessages = {
      book: 'I want to book an appointment',
      records: 'Show me my medical records',
      meds: 'Tell me about my medications',
      question: 'I have a medical question'
    };

    setInputValue(actionMessages[action]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chat-fab ${isOpen ? 'chat-fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
      >
        <i className="fas fa-robot"></i>
        {!isOpen && <span className="chat-fab-pulse"></span>}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'chat-window-open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <i className="fas fa-robot"></i>
              <span className="chat-status-dot"></span>
            </div>
            <div className="chat-header-text">
              <h3 className="chat-title">Healix AI Assistant</h3>
              <p className="chat-subtitle">
                <span className="status-indicator"></span>
                Online • Ready to help
              </p>
            </div>
          </div>
          <button 
            className="chat-minimize"
            onClick={() => setIsOpen(false)}
            aria-label="Minimize chat"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="chat-quick-actions">
            <p className="quick-actions-title">Quick Actions:</p>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <span className="quick-action-icon">{action.icon}</span>
                  <span className="quick-action-text">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.type === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
            >
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              {message.type === 'user' && (
                <div className="message-avatar message-avatar-user">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message chat-message-bot">
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="chat-input-wrapper">
            <button 
              type="button" 
              className="chat-attachment-btn"
              aria-label="Attach file"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="chat-input-footer">
            <span className="chat-powered">
              <i className="fas fa-brain"></i>
              Powered by AI
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default ChatBot;
