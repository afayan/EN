import React, { useState } from 'react';
import ChatMessage from './ChatMessage';

const MAX_INPUT_LENGTH = 200;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        text: 'Sorry, something went wrong. Please try again.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        <div className="education-header">
          <h2>Educational Assistant</h2>
          <p>I am your Assistant</p>
        </div>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && <div className="loading-indicator">Responding...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
            placeholder="What's on your mind?"
            maxLength={MAX_INPUT_LENGTH}
            disabled={isLoading}
          />
          <div className="char-counter">{input.length}/{MAX_INPUT_LENGTH}</div>
        </div>
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
