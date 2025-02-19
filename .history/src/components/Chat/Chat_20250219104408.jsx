import React, { useState } from 'react';
import './Chat.scss';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // burada serverə mesaj göndərilə bilər və ya sənədlənməş cavab əlavə edilə bilər
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Mesajınızı daxil edin..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Göndər</button>
      </form>
    </div>
  );
}

export default Chat;