import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação e rede
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Network error (backend não está rodando ou não consegue conectar)
    if (!error.response) {
      const networkError = new Error(
        'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:4000'
      )
      networkError.name = 'NetworkError'
      return Promise.reject(networkError)
    }

    // Unauthorized - clear session and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)
