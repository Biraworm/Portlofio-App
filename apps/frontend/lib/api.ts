import axios from 'axios'
import { supabase } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      try {
        // Get the current session from Supabase
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`
        }
      } catch (error) {
        console.error('Error getting session for API request:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear session and redirect to login
      if (typeof window !== 'undefined') {
        await supabase.auth.signOut()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
