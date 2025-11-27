"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Asset {
  ticker: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  profit: number
  profitPercent: number
}

interface AssetsTableProps {
  assets: Asset[]
}

export function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Profit/Loss</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell className="font-medium">{asset.ticker}</TableCell>
                  <TableCell>{asset.quantity}</TableCell>
                  <TableCell>${asset.averagePrice.toFixed(2)}</TableCell>
                  <TableCell>${asset.currentPrice.toFixed(2)}</TableCell>
                  <TableCell>${asset.totalValue.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      asset.profit >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${asset.profit.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={
                      asset.profitPercent >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {asset.profitPercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


