import axios from 'axios';

// 環境変数を使用するように変更
const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL || 'http://127.0.0.1:8000/api/auth';


interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  user_type: 'student' | 'teacher';
  student_id?: string;
  grade?: string;
}

interface User {
  user_id: number;
  username: string;
  user_type: 'student' | 'teacher';
  student_id?: string;
  grade?: string;
  token: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/login/`, credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/register/`, data);
    return response.data;
  },

  logout: async (token: string): Promise<void> => {
    await axios.post(`${AUTH_API_BASE_URL}/logout/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
  }
};

// ローカルストレージでのトークン管理
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  setUser: (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem('currentUser');
  }
};
