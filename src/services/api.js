import axios from 'axios';

const api = axios.create({
    baseURL: 'https://advertiseimage.herokuapp.com'
});

export default api;