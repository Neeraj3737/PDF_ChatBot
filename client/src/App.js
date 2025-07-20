import React from 'react';
import Upload from './components/Upload';
import Chat from './components/Chat';
import './App.css';

function App() {
  // Optionally, you can use state to trigger refresh in Chat after upload
  // For now, just render both components
  return (<div>
    <div style={{
      padding: 12,
      marginLeft: 550,
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <h1 style={{
        fontSize: 36,
        fontWeight: 800,
        color: '#222',
        letterSpacing: 1,
        marginBottom: 40,
        textAlign: 'left',
      }}>PDF Q&A Chatbot</h1></div>
      <div>
      <Upload />
      <Chat />
    </div></div>
  );
}

export default App;
