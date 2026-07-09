import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (statusFilter = null) => {
  const params = {};
  if (statusFilter && statusFilter !== 'all') {
    params.status = statusFilter;
  }
  const response = await api.get('/tasks/', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks/', taskData);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/`, { status });
  return response.data;
};

export default api;
