import { useEffect, useState } from "react"

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetch("http://localhost:8000/logs")
      .then(res => res.json())
      .then(data => {
        setLogs(data)
        setFilteredLogs(data)
      })
      .catch(err => console.error("Error fetching logs:", err))
  }, [])

  useEffect(() => {
    let updated = [...logs]

    // Search filter
    if (search) {
      updated = updated.filter(log =>
        log.vendor?.toLowerCase().includes(search.toLowerCase()) ||
        log.invoice_number?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sorting
    updated.sort((a, b) => {
      if (sortKey === "amount" || sortKey === "confidence") {
        return sortOrder === "asc"
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey]
      }

      return sortOrder === "asc"
        ? String(a[sortKey]).localeCompare(String(b[sortKey]))
        : String(b[sortKey]).localeCompare(String(a[sortKey]))
    })

    setFilteredLogs(updated)
  }, [search, sortKey, sortOrder, logs])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-semibold mb-6">
        Invoice Logs
      </h2>

      {/* Search + Export */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by vendor or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={() =>
            window.open("http://localhost:8000/export-csv", "_blank")
          }
          className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 rounded-lg hover:scale-105 transition font-semibold"
        >
          Export CSV
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-gray-400">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort("timestamp")}>
                Timestamp
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort("vendor")}>
                Vendor
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort("invoice_number")}>
                Invoice #
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort("amount")}>
                Amount
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort("confidence")}>
                Confidence
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log, index) => (
              <tr
                key={index}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="p-4">{log.timestamp}</td>
                <td className="p-4">{log.vendor}</td>
                <td className="p-4">{log.invoice_number}</td>
                <td className="p-4 font-medium">
                  ${log.amount?.toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      log.confidence >= 0.8
                        ? "bg-green-600"
                        : log.confidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }
                  `}
                  >
                    {(log.confidence * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No logs found
          </div>
        )}
      </div>
    </div>
  )
}