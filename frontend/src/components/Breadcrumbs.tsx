import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export default function Breadcrumbs() {
  const location = useLocation()

  if (location.pathname === "/dashboard") {
    return null
  }

  const paths = location.pathname.split("/").filter(Boolean)

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Link to="/dashboard" className="font-medium hover:text-primary">
        Home
      </Link>

      {paths.map((path, index) => {
        const routeTo = "/" + paths.slice(0, index + 1).join("/")

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight size={16} />
            <Link to={routeTo} className="hover:text-primary">
              {path.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
