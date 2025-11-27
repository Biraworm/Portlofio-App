import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Função para verificar se o backend está rodando
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 2000,
    })
    return response.data.status === 'ok'
  } catch {
    return false
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Interceptor para verificar backend antes de fazer requisições
api.interceptors.request.use(
  async (config) => {
    // Só verifica health em requisições que não são health check
    if (!config.url?.includes('/health')) {
      const isBackendRunning = await checkBackendHealth()
      if (!isBackendRunning) {
        const error = new Error(
          'Backend não está rodando. Por favor, inicie o backend primeiro:\n\ncd apps/backend && npm run start:dev'
        )
        error.name = 'BackendNotRunning'
        return Promise.reject(error)
      }
    }

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
      let errorMessage = 'Não foi possível conectar ao servidor.'
      
      if (error.name === 'BackendNotRunning') {
        errorMessage = error.message
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = `Não foi possível conectar ao servidor em ${API_BASE_URL}.\n\nPor favor, verifique se o backend está rodando:\n\ncd apps/backend && npm run start:dev`
      } else {
        errorMessage = `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_BASE_URL}`
      }
      
      const networkError = new Error(errorMessage)
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
