import { NavLink } from "react-router-dom"

function Sidebar() {
  const base =
    "block px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
  const active =
    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
  const inactive =
    "text-slate-400 hover:bg-slate-800 hover:text-white"

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        AI Invoice
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/process"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Process Invoice
        </NavLink>

        <NavLink
          to="/logs"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Invoice Logs
        </NavLink>
      </nav>
    </div>
  )
}

export default Sidebar