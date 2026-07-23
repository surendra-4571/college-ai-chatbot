import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/Message.css';

function Message({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'}`}>
      <div className="message-content">
        {isUser || isSystem ? (
          <pre>{message.content}</pre>
        ) : (
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
      {message.timestamp && (
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

export default Message;