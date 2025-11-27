"use client"

export const dynamic = 'force-dynamic'

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { AssetsTable } from "@/components/portfolio/assets-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PortfolioPage() {
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await api.get("/portfolio")
      return response.data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const assets = portfolio?.assets || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Your investment portfolio</p>
      </div>

      <AssetsTable assets={assets} />
    </div>
  )
}

