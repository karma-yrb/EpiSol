import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

const setTokenAxios = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeTokenAxios = () => {
  delete api.defaults.headers.common['Authorization'];
};

export { api, setTokenAxios, removeTokenAxios };
