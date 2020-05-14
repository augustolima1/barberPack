import axios from 'axios';
 

const api = axios.create({
  baseURL: 'http://localhost:3333',
  responseType: 'json',
  headers: {
    Accept: 'application/json',
  },
});

export default api;
