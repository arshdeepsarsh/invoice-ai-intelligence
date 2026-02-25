import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Dashboard() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    avgConfidence: 0,
  })

  useEffect(() => {
    fetch("https://invoice-ai-intelligence.onrender.com/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data)

        const totalInvoices = data.length
        const totalAmount = data.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        )
        const avgConfidence =
          totalInvoices > 0
            ? data.reduce(
                (sum, item) => sum + (item.confidence || 0),
                0
              ) / totalInvoices
            : 0

        setStats({
          totalInvoices,
          totalAmount,
          avgConfidence,
        })
      })
  }, [])

  // Revenue Trend (group by date)
  const revenueByDate = Object.values(
    logs.reduce((acc, item) => {
      const date = item.timestamp?.split(" ")[0]
      if (!acc[date]) {
        acc[date] = { date, revenue: 0 }
      }
      acc[date].revenue += item.amount || 0
      return acc
    }, {})
  )

  // Vendor Revenue
  const vendorRevenue = Object.values(
    logs.reduce((acc, item) => {
      const vendor = item.vendor || "Unknown"
      if (!acc[vendor]) {
        acc[vendor] = { vendor, revenue: 0 }
      }
      acc[vendor].revenue += item.amount || 0
      return acc
    }, {})
  )

  // Confidence Data
  const confidenceData = logs.map((item, index) => ({
    name: `Inv ${index + 1}`,
    confidence: (item.confidence || 0) * 100,
  }))

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">
            Total Invoices Processed
          </p>
          <h3 className="text-2xl font-bold">
            {stats.totalInvoices}
          </h3>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">
            Total Amount Processed
          </p>
          <h3 className="text-2xl font-bold">
            ${stats.totalAmount.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">
            Average Confidence
          </p>
          <h3 className="text-2xl font-bold">
            {(stats.avgConfidence * 100).toFixed(0)}%
          </h3>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8">
        <h3 className="mb-4 font-semibold">
          Revenue Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Revenue Chart */}
      <div className="bg-slate-800 p-6 rounded-xl mb-8">
        <h3 className="mb-4 font-semibold">
          Revenue by Vendor
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Chart */}
      <div className="bg-slate-800 p-6 rounded-xl">
        <h3 className="mb-4 font-semibold">
          Confidence per Invoice
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="confidence" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}