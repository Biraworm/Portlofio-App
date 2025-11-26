"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import { DonutChart } from "@/components/charts/donut-chart"

export default function DashboardPage() {
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await api.get("/portfolio")
      return response.data
    },
  })

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transactions")
      return response.data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const totalValue = portfolio?.totalValue || 0
  const totalProfit = portfolio?.totalProfit || 0
  const profitPercent = portfolio?.profitPercent || 0

  // Mock data for charts (replace with real data from API)
  const portfolioHistory = [
    { date: "Jan", value: 10000 },
    { date: "Feb", value: 12000 },
    { date: "Mar", value: 11500 },
    { date: "Apr", value: 13000 },
    { date: "May", value: 12500 },
    { date: "Jun", value: 14000 },
  ]

  const assetDistribution = portfolio?.assets?.map((asset: any) => ({
    name: asset.ticker,
    value: asset.totalValue,
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
              {profitPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio History</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={portfolioHistory}
              dataKey="value"
              xAxisKey="date"
              lines={[{ key: "value", name: "Portfolio Value", color: "#8884d8" }]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {assetDistribution.length > 0 ? (
              <DonutChart data={assetDistribution} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

