import { Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import Process from "./pages/Process"
import Logs from "./pages/Logs"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/process" element={<Process />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </MainLayout>
  )
}

export default App