import React, { useState } from 'react';
import ChatBox from './ChatBox'; // your existing ChatBox component
import { MessageCircle, X } from 'lucide-react'; // Icons

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Add animation styles
  const animationStyles = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  return (
    <div style={styles.wrapper}>
      <style>{animationStyles}</style>
      {isOpen && (
        <div style={styles.chatContainer}>
          <div style={styles.header}>
            <h4 style={styles.title}>EduBot</h4>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <ChatBox />
        </div>
      )}
      <button style={styles.floatingButton} onClick={() => setIsOpen(!isOpen)}>
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
  floatingButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    width: '350px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    marginBottom: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    animation: 'slideIn 0.3s ease-out',
  },
  header: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.75rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
};

export default FloatingChatWidget;
