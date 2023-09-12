import { api, removeTokenAxios, setTokenAxios } from './axiosConfig';

const usersApi = {
  setToken: (token: string) => {
    setTokenAxios(token);
  },
  removeToken: () => {
    removeTokenAxios();
  },
  login: async (email: string, password: string, needToRemember: boolean) => {
    const response = await api.post('/login', {
      email,
      password,
      needToRemember,
    });
    return response.data;
  },
  register: async (email: string, username: string, password: string) => {
    const response = await api.post('/register', {
      email,
      username,
      password,
    });
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getbyId: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  update: async (
    email: string,
    username: string,
    oldPassword: string,
    newPassword: string | undefined
  ) => {
    const response = await api.put(`/me`, {
      email,
      username,
      oldPassword,
      newPassword,
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
  generateSession: async (programId: string) => {
    const response = await api.post('/usersessions', { programId });
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/usersessions');
    return response.data;
  },
  getSessionById: async (id: string | number) => {
    const response = await api.get(`/usersessions/${id}`);
    return response.data;
  },
  deleteSession: async () => {
    const response = await api.delete(`/usersessions`);
    return response.data;
  },
  deleteMe: async () => {
    const response = await api.delete(`/me`);
    return response.data;
  },
};

export default usersApi;
