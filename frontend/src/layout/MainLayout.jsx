import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout