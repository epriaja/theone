"use client"

import { useState, useEffect } from "react"
import { useApp } from "./context/AppContext"
import { Login } from "./components/Login"
import { Header } from "./components/Header"
import { PublicTracking } from "./components/PublicTracking"
import { AdminDashboard } from "./components/dashboards/AdminDashboard"
import { TUDashboard } from "./components/dashboards/TUDashboard"
import { CoordinatorDashboard } from "./components/dashboards/CoordinatorDashboard"
import { StaffDashboard } from "./components/dashboards/StaffDashboard"
import { Home, Users, FileText, Clipboard, CheckSquare } from "lucide-react"

function App() {
  const { state, dispatch } = useApp()
  const [showPublicTracking, setShowPublicTracking] = useState(false)

  useEffect(() => {
    const handleShowPublicTracking = () => {
      setShowPublicTracking(true)
    }

    window.addEventListener("showPublicTracking", handleShowPublicTracking)
    return () => {
      window.removeEventListener("showPublicTracking", handleShowPublicTracking)
    }
  }, [])

  if (!state.currentUser && !showPublicTracking) {
    return <Login />
  }

  if (showPublicTracking) {
    return (
      <div>
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => setShowPublicTracking(false)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg font-medium"
          >
            <Home className="w-5 h-5" />
            Kembali ke Login
          </button>
        </div>
        <PublicTracking />
      </div>
    )
  }

  const getDashboardComponent = () => {
    if (!state.currentUser) {
      return <div>Loading...</div>
    }

    switch (state.currentUser.role) {
      case "Admin":
        return <AdminDashboard />
      case "TU":
        return <TUDashboard />
      case "Koordinator":
        return <CoordinatorDashboard />
      case "Staff":
        return <StaffDashboard />
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Tidak Dikenal</h3>
              <p className="text-gray-600 mb-4">Role "{state.currentUser.role}" tidak dikenal dalam sistem.</p>
              <button
                onClick={() => dispatch({ type: "LOGOUT" })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        )
    }
  }

  const getDashboardIcon = () => {
    switch (state.currentUser?.role) {
      case "Admin":
        return Users
      case "TU":
        return FileText
      case "Koordinator":
        return Clipboard
      case "Staff":
        return CheckSquare
      default:
        return Home
    }
  }

  const Icon = getDashboardIcon()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50">
      <Header
        userName={state.currentUser?.name || "User"}
        userRole={state.currentUser?.role || "Role"}
        userTitle={state.currentUser?.role || "Title"}
      />
      <main className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">{getDashboardComponent()}</main>
    </div>
  )
}

export default App
