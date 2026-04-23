import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the backend
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Task Management Dashboard</h1>
      <hr />
      
      {tasks.length === 0 ? (
        <p>No tasks found. Time to relax! ☕</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9' 
            }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span style={{ 
                backgroundColor: task.priority === 'High' ? '#ff4d4d' : '#ffd633',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;