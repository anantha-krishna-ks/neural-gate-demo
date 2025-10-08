import { LayoutDashboard, Sparkles, BookOpen, BarChart3, Users, LogOut, Menu } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: Sparkles,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Collaboration",
    url: "/collaboration",
    icon: Users,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard"
    }
    return currentPath === path
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...")
  }

  return (
    <div className="fixed left-0 top-0 h-full w-52 bg-white/95 backdrop-blur-xl border-r border-border/20 shadow-xl z-40 hidden lg:block">
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center gap-3">
          
          <img 
            src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
            alt="AI-Levate" 
            className="h-8 w-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">Dashboard</p>
      </div>
      
      <div className="px-4 py-6">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10 hover:scale-105 ${
                isActive(item.url) 
                  ? 'bg-primary/15 text-primary shadow-lg border border-primary/20' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}