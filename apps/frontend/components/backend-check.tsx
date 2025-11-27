"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BackendCheck() {
  const [isBackendRunning, setIsBackendRunning] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkBackend()
    // Verificar a cada 5 segundos
    const interval = setInterval(checkBackend, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkBackend = async () => {
    try {
      const response = await api.get('/health')
      setIsBackendRunning(response.data.status === 'ok')
    } catch {
      setIsBackendRunning(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isBackendRunning === null || isChecking) {
    return null
  }

  if (!isBackendRunning) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-96 border-red-500 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">
              ⚠️ Backend não está rodando
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-300">
              O servidor backend não está acessível
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-red-700 dark:text-red-300">
              Para iniciar o backend, execute:
            </p>
            <code className="block p-2 bg-red-100 dark:bg-red-900 rounded text-xs text-red-800 dark:text-red-200">
              cd apps/backend && npm run start:dev
            </code>
            <Button
              onClick={checkBackend}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Verificar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

