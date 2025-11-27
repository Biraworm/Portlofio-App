import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Reduzido para 5 segundos para resposta mais rápida
})

// Cache para verificação de backend (evita múltiplas requisições)
let backendCheckCache: { timestamp: number; isRunning: boolean } | null = null
const BACKEND_CHECK_CACHE_DURATION = 3000 // 3 segundos

// Função para verificar se o backend está rodando
async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now()
  
  // Usar cache se ainda válido
  if (backendCheckCache && (now - backendCheckCache.timestamp) < BACKEND_CHECK_CACHE_DURATION) {
    return backendCheckCache.isRunning
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 2000,
    })
    const isRunning = response.data.status === 'ok'
    backendCheckCache = { timestamp: now, isRunning }
    return isRunning
  } catch {
    backendCheckCache = { timestamp: now, isRunning: false }
    return false
  }
}

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Não verificar health para requisições de health check
    if (config.url?.includes('/health')) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    }

    // Verificar backend apenas para requisições importantes (não para todas)
    // Isso evita sobrecarga
    if (config.url?.includes('/auth/') || config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      const isBackendRunning = await checkBackendHealth()
      if (!isBackendRunning) {
        const error = new Error(
          'Backend não está rodando. Por favor, inicie o backend primeiro:\n\ncd apps/backend && npm run start:dev\n\nOu use: npm run start (na raiz do projeto)'
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
  (response) => {
    // Limpar cache se backend respondeu
    if (response.config.url?.includes('/health')) {
      backendCheckCache = { timestamp: Date.now(), isRunning: true }
    }
    return response
  },
  async (error) => {
    // Network error (backend não está rodando ou não consegue conectar)
    if (!error.response) {
      let errorMessage = 'Não foi possível conectar ao servidor.'
      
      if (error.name === 'BackendNotRunning') {
        errorMessage = error.message
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = `Não foi possível conectar ao servidor em ${API_BASE_URL}.\n\nPor favor, verifique se o backend está rodando:\n\ncd apps/backend && npm run start:dev\n\nOu use: npm run start (na raiz do projeto)`
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
