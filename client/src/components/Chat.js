import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history on mount
    fetch('http://localhost:5000/history')
      .then(res => res.json())
      .then(data => setChat(data))
      .catch(() => setChat([]));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    const userMsg = { question, answer: null };
    setChat(prev => [...prev, userMsg]);
    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      setChat(prev => prev.map((msg, i) => i === prev.length - 1 ? { ...msg, answer: data.answer } : msg));
      setQuestion('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '40px auto',
      padding: 32,
      borderRadius: 18,
      boxShadow: '0 8px 32px rgba(249, 6, 6, 0.1)',
      background: 'linear-gradient(135deg, #f8fbff 0%, #e3f0ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      minHeight: 400,
    }}>
      <h2 style={{ fontWeight: 800, marginBottom: 24, color: '#1976d2', letterSpacing: 1 }}>Ask Questions About Your PDF</h2>
      <div style={{
        border: '1.5px solid #90caf9',
        borderRadius: 12,
        padding: 20,
        minHeight: 220,
        background: '#f4f8fb',
        marginBottom: 20,
        maxHeight: 340,
        overflowY: 'auto',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.04)',
      }}>
        {chat.length === 0 && <div style={{ color: '#90caf9', fontWeight: 500 }}>No conversation yet.</div>}
        {chat.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 18 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                color: '#fff',
                borderRadius: '18px 18px 4px 18px',
                padding: '10px 18px',
                maxWidth: '75%',
                fontWeight: 500,
                fontSize: 15,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
              }}>
                {msg.question}
              </div>
            </div>
            {msg.answer && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginTop: 6,
              }}>
                <div style={{
                  background: '#fff',
                  color: '#1976d2',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '10px 18px',
                  maxWidth: '75%',
                  fontWeight: 500,
                  fontSize: 15,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                  border: '1px solid #e3f0ff',
                }}>
                  {msg.answer}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          style={{
            width: '80%',
            padding: '12px 14px',
            borderRadius: 8,
            border: '1.5px solid #90caf9',
            fontSize: 15,
            marginRight: 10,
            outline: 'none',
            transition: 'border 0.2s',
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: loading || !question.trim() ? '#b3c6e6' : 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => {
            if (!loading && question.trim()) e.target.style.background = 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)';
          }}
          onMouseOut={e => {
            if (!loading && question.trim()) e.target.style.background = 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)';
          }}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      {error && <div style={{ color: '#d32f2f', marginTop: 14, fontWeight: 600 }}>{error}</div>}
    </div>
  );
};

export default Chat; 