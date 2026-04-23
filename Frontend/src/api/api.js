import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// This part makes sure your token is sent automatically once you log in
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = token;
    }
    return req;
});

export default API;