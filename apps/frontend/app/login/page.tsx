"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      if (response.data.accessToken) {
        // Salvar token no localStorage
        localStorage.setItem('auth_token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toast.success("Login realizado com sucesso!")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Token não recebido. Tente novamente.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      let errorMessage = "Falha ao fazer login. Verifique suas credenciais."
      
      if (error.name === 'NetworkError' || error.message?.includes('conectar')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:4000"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos")
      return
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/register', {
        email: email.trim(),
        password,
      })

      if (response.data.accessToken) {
        // Salvar token no localStorage
        localStorage.setItem('auth_token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toast.success("Conta criada com sucesso!")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Conta criada mas nenhum token recebido. Faça login.")
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      
      let errorMessage = "Falha ao criar conta. Tente novamente."
      
      if (error.name === 'NetworkError' || error.message?.includes('conectar')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:4000"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Portfolio App</CardTitle>
          <CardDescription>
            {isSignUp ? "Criar uma nova conta" : "Entre na sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-4"
            onSubmit={isSignUp ? handleSignUp : handleLogin}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setEmail("")
                  setPassword("")
                }}
                disabled={isLoading}
                className="flex-1"
              >
                {isSignUp ? "Voltar ao Login" : "Criar Conta"}
              </Button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Ou use o usuário de teste: test@example.com / test123456
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
