import { useState } from "react"

export default function Process() {
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (!files || files.length === 0) return

    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }

    setIsLoading(true)
    setResults([])

    try {
      const response = await fetch(
        "http://localhost:8000/process-invoice/",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Error processing invoices")
    }

    setIsLoading(false)
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-semibold mb-6">
        Batch Invoice Processing
      </h2>

      {/* Upload Section */}
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 hover:border-indigo-500 transition-all duration-300">
        <div className="flex flex-col items-center gap-6">

          <label className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center animate-pulse">
              <span className="text-indigo-400 text-2xl">⬆</span>
            </div>

            <span className="text-gray-400 text-sm">
              Click to upload multiple invoice PDFs
            </span>

            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <p className="text-sm text-indigo-400">
              {files.length} file(s) selected
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 transform transition-all duration-300 px-8 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Upload & Process"
            )}
          </button>

        </div>
      </div>

      {/* Results Table */}
      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-8 bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Batch Results
          </h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-slate-700">
              <tr>
                <th className="text-left p-3">Vendor</th>
                <th className="text-left p-3">Invoice #</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Tax</th>
                <th className="text-left p-3">Confidence</th>
              </tr>
            </thead>

            <tbody>
              {results.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="p-3">{item.vendor}</td>
                  <td className="p-3">{item.invoice_number}</td>
                  <td className="p-3">{item.invoice_date}</td>
                  <td className="p-3 font-medium">
                    ${item.amount?.toLocaleString()}
                  </td>
                  <td className="p-3">
                    ${item.tax?.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          item.confidence >= 0.8
                            ? "bg-green-600"
                            : item.confidence >= 0.6
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }
                      `}
                    >
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}