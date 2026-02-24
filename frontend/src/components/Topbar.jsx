function Topbar() {
  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950">
      <h2 className="text-lg font-semibold text-slate-300">
        AI Invoice Intelligence Platform
      </h2>

      <div className="text-sm text-slate-500">
        Production Mode
      </div>
    </div>
  )
}

export default Topbar