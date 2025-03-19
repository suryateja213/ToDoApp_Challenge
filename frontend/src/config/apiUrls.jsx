
const BASE_URL = "http://localhost:5000/api";

const API_URLS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  TASKS: `${BASE_URL}/tasks`,
  TASK_TOGGLE: (id) => `${BASE_URL}/tasks/${id}/toggle`,
  TASK_UPDATE: (id) => `${BASE_URL}/tasks/${id}`,
  TASK_DELETE: (id) => `${BASE_URL}/tasks/${id}`,
};

export default API_URLS;
