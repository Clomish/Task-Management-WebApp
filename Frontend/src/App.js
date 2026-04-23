import React from 'react';
import Login from './Login'; // This imports the Login.js you just moved

function App() {
  return (
    <div className="App">
      {/* This line actually puts the Login form on the screen */}
      <Login />
    </div>
  );
}

export default App;