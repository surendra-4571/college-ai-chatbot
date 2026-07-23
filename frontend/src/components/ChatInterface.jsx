import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import InputBox from './InputBox';
import '../styles/ChatInterface.css';

const API_BASE = 'http://localhost:5000/api';

function ChatInterface({ sessionId, model, onSessionCreated }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      loadChatHistory(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/chat/history/${id}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSendMessage = async (message) => {
    setError(null);
    
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        message,
        sessionId,
        model
      });

      if (!sessionId && response.data.sessionId) {
        onSessionCreated(response.data.sessionId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteCode = async (code, language) => {
    try {
      const response = await axios.post(`${API_BASE}/execute`, {
        code,
        language
      });
      
      const result = {
        role: 'system',
        content: `Code Output (${language}):\n${response.data.output || response.data.error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, result]);
    } catch (err) {
      setError(err.response?.data?.error || 'Error executing code');
    }
  };

  return (
    <div className="chat-interface">
      {error && <div className="error-banner">{error}</div>}
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <InputBox 
        onSendMessage={handleSendMessage}
        onExecuteCode={handleExecuteCode}
        loading={loading}
      />
    </div>
  );
}

export default ChatInterface;
