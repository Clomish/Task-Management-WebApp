import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setIsLoggedIn(true);
        fetchTasks();
      } else { alert("Login Failed"); }
    } catch (err) { alert("Backend Error"); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc, priority: newPriority }),
      });
      if (response.ok) {
        setNewTitle('');
        setNewDesc('');
        fetchTasks();
      }
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const toggleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      {!isLoggedIn ? (
        <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Task Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{width:'100%', marginBottom:'10px'}} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{width:'100%', marginBottom:'10px'}} />
            <button type="submit" style={{width:'100%', padding:'10px'}}>Log In</button>
          </form>
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Dashboard</h1>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
          
<div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
  <div style={{ padding: '10px 20px', background: '#e7f3ff', borderRadius: '10px', color: '#007bff' }}>
    <strong>{pendingTasks}</strong> Tasks Pending
  </div>
  <div style={{ padding: '10px 20px', background: '#e6f4ea', borderRadius: '10px', color: '#28a745' }}>
    <strong>{completedTasks}</strong> Completed
  </div>
</div>

          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>Add New Task</h3>
            <form onSubmit={addTask}>
              <input value={newTitle} placeholder="Task Title" onChange={(e) => setNewTitle(e.target.value)} required style={{width:'100%', marginBottom:'10px'}} /><br/>
              <textarea value={newDesc} placeholder="Description" onChange={(e) => setNewDesc(e.target.value)} style={{width:'100%', marginBottom:'10px'}} /><br/>
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={{marginBottom:'10px'}}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select><br/>
              <button type="submit" style={{background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Save Task</button>
            </form>
          </div>

          <hr />
          <h3>Current Task List</h3>
          {tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: task.status === 'completed' ? '#f0f2f5' : '#ffffff' }}>
              <div style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? '#888' : '#000' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                <p style={{ margin: '0', fontSize: '14px' }}>{task.description}</p>
                <small>Priority: <strong>{task.priority}</strong></small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => toggleComplete(task.id, task.status)} style={{ background: task.status === 'completed' ? '#6c757d' : '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                  {task.status === 'completed' ? 'Undo' : 'Done'}
                </button>
                <button onClick={() => deleteTask(task.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;