"use client"

export const dynamic = 'force-dynamic'

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DividendsPage() {
  const { data: dividends, isLoading } = useQuery({
    queryKey: ["dividends"],
    queryFn: async () => {
      const response = await api.get("/dividends")
      return response.data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Mock data for chart
  const dividendHistory = [
    { month: "Jan", amount: 100 },
    { month: "Feb", amount: 150 },
    { month: "Mar", amount: 120 },
    { month: "Apr", amount: 200 },
    { month: "May", amount: 180 },
    { month: "Jun", amount: 250 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dividends</h1>
        <p className="text-muted-foreground">Track your dividend income</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dividend History</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={dividendHistory}
              dataKey="amount"
              xAxisKey="month"
              lines={[{ key: "amount", name: "Dividend Amount", color: "#00C49F" }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Dividends</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dividends?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No dividends found
                    </TableCell>
                  </TableRow>
                ) : (
                  dividends?.map((dividend: any) => (
                    <TableRow key={dividend.id}>
                      <TableCell>{new Date(dividend.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{dividend.ticker}</TableCell>
                      <TableCell>${dividend.amount.toFixed(2)}</TableCell>
                      <TableCell>{dividend.type}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

