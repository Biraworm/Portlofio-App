"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LineChartProps {
  data: Array<Record<string, any>>
  dataKey: string
  xAxisKey: string
  lines?: Array<{ key: string; name: string; color?: string }>
}

export function LineChart({ data, dataKey, xAxisKey, lines = [] }: LineChartProps) {
  const defaultLines = lines.length > 0 
    ? lines 
    : [{ key: dataKey, name: dataKey, color: "#8884d8" }]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {defaultLines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color || "#8884d8"}
            name={line.name}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}


