import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/sessions');
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:5000/api/chat/session/${sessionId}`, {
        method: 'DELETE'
      });
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
      <div className="main-container">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
        <ChatInterface 
          sessionId={currentSessionId}
          model={selectedModel}
          onSessionCreated={(newSessionId) => {
            setCurrentSessionId(newSessionId);
            loadSessions();
          }}
        />
      </div>
    </div>
  );
}

export default App;
