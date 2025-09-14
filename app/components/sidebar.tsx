
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  BookOpen
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const getMenuItems = (userRole: string | undefined) => {
  const baseItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chatbot', href: '/chatbot' },
    { icon: User, label: 'Perfil', href: '/profile' },
    { icon: Settings, label: 'Configurações', href: '/settings' },
  ]
  
  // Adiciona Base de Conhecimento apenas para admins
  if (userRole === 'ADM') {
    baseItems.splice(2, 0, { 
      icon: BookOpen, 
      label: 'Base de Conhecimento', 
      href: '/knowledge-admin' 
    })
  }
  
  return baseItems
}

interface SidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { data: session } = useSession() || {}
  const pathname = usePathname()
  const router = useRouter()

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobileMenuOpen])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false) // Fechar menu em mobile após navegação
  }

  return (
    <>
      {/* Desktop Sidebar - sempre visível */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r border-border z-30">
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 mt-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-foreground">Case Flow</h1>
          </div>

          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {(session?.user as any)?.role || 'Usuário'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {getMenuItems((session?.user as any)?.role).map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11",
                        isActive 
                          ? "bg-blue-500 text-white hover:bg-blue-600" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => handleNavClick(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 mt-4 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-background border-r border-border md:hidden"
            >
              <div className="flex flex-col h-full p-4">
                {/* Mobile Header com botão fechar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-8 w-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-foreground">Case Flow</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="bg-muted/50 rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session?.user?.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {(session?.user as any)?.role || 'Usuário'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1">
                  <ul className="space-y-2">
                    {getMenuItems((session?.user as any)?.role).map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 h-11",
                              isActive 
                                ? "bg-blue-500 text-white hover:bg-blue-600" 
                                : "hover:bg-muted"
                            )}
                            onClick={() => handleNavClick(item.href)}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 mt-4 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
