import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, sessions, currentSessionId, onNewChat, onSelectSession, onDeleteSession }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Conversations</h2>
      </div>
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>
      <div className="sessions-list">
        {sessions.length === 0 ? (
          <p className="no-sessions">No conversations yet</p>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
            >
              <div 
                className="session-content"
                onClick={() => onSelectSession(session.id)}
              >
                <h4>{session.model}</h4>
                <p>{session.messageCount || 0} messages</p>
                <small>{new Date(session.updatedAt).toLocaleDateString()}</small>
              </div>
              <button
                className="delete-btn"
                onClick={() => onDeleteSession(session.id)}
                title="Delete session"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;