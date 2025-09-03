"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the App component to avoid SSR issues
const App = dynamic(() => import("../src/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
})

const AppProvider = dynamic(() => import("../src/context/AppContext").then(mod => ({ default: mod.AppProvider })), {
  ssr: false,
})
export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}
