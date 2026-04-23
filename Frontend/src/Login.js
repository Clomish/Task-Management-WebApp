import React, { useState } from 'react';
import API from './api/api'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            alert('Login Successful!');
        } catch (err) {
            alert('Login failed. Check your credentials.');
        }
    };

    return (
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <h2>Task Manager Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;