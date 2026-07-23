import React from 'react';
import '../styles/Header.css';

function Header({ onToggleSidebar, selectedModel, onModelChange }) {
  const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet'];

  return (
    <header className="header">
      <button className="menu-btn" onClick={onToggleSidebar}>☰</button>
      <h1>College AI Chatbot</h1>
      <div className="model-selector">
        <label>Model: </label>
        <select value={selectedModel} onChange={(e) => onModelChange(e.target.value)}>
          {models.map(model => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Header;