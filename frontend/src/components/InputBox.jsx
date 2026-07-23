import React, { useState } from 'react';
import '../styles/InputBox.css';

function InputBox({ onSendMessage, onExecuteCode, loading }) {
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const languages = ['python', 'javascript', 'java', 'cpp', 'c', 'bash'];

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleExecute = () => {
    if (input.trim() && !loading) {
      onExecuteCode(input, selectedLanguage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleExecute();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask me anything about programming... (Shift+Enter for new line)"
        disabled={loading}
        rows="3"
      />
      <div className="input-controls">
        <div className="language-selector">
          <button 
            onClick={() => setShowLanguageSelect(!showLanguageSelect)}
            title="Select programming language for code execution"
          >
            {selectedLanguage} ▼
          </button>
          {showLanguageSelect && (
            <div className="language-dropdown">
              {languages.map(lang => (
                <button 
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageSelect(false);
                  }}
                  className={lang === selectedLanguage ? 'active' : ''}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={handleExecute}
          disabled={loading || !input.trim()}
          className="execute-btn"
          title="Execute code (Ctrl+Enter)"
        >
          {loading ? 'Processing...' : '▶ Execute'}
        </button>
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default InputBox;