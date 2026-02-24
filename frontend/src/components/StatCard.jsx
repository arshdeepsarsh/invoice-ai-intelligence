function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  )
}

export default StatCard