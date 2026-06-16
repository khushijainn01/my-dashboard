import { useState, type ReactNode } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 pt-12">
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <main
          className={`flex-1 bg-muted/30 p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Breadcrumbs />
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
