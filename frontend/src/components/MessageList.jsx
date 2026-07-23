import React from 'react';
import Message from './Message';
import '../styles/MessageList.css';

function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <h1>Welcome to College AI Chatbot 🤖</h1>
        <p>Start a conversation by typing your question below.</p>
        <div className="suggestions">
          <p>Suggested topics:</p>
          <ul>
            <li>"Help me with Java programming"</li>
            <li>"Explain quicksort algorithm"</li>
            <li>"Debug this Python code"</li>
            <li>"Design a database schema"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
