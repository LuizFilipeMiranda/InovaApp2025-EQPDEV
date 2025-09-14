
'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function AppLayout({ children, className = '' }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content */}
      <main className={`flex-1 w-full md:ml-64 ${className}`}>
        <div className="pt-16 md:pt-0 h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
