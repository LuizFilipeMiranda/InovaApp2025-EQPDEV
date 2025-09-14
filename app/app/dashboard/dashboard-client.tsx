
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  AlertCircle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TicketCard from '@/components/ticket-card'

interface Ticket {
  id: string
  title: string
  description: string
  category: 'TI' | 'SAC' | 'FINANCEIRO'
  status: 'NEW' | 'IN_PROGRESS' | 'FINISHED' | 'RETURNED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
  creator: {
    name: string
    email: string
    role: string
  }
  assignee?: {
    name: string
    email: string
    role: string
  }
  comments?: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      name: string
      role: string
    }
  }>
}

const statusConfig = {
  NEW: {
    title: 'Novos Chamados',
    icon: Plus,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  IN_PROGRESS: {
    title: 'Em Progresso',
    icon: Clock,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  FINISHED: {
    title: 'Finalizados',
    icon: CheckCircle,
    color: 'bg-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  RETURNED: {
    title: 'Retornados',
    icon: RotateCcw,
    color: 'bg-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
    borderColor: 'border-red-200 dark:border-red-800'
  }
}

export default function DashboardClient() {
  const { data: session } = useSession() || {}
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTicketUpdate = async (ticketId: string, action: string, comment?: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, comment })
      })
      
      if (response.ok) {
        await fetchTickets() // Refresh tickets
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const handleTicketDelete = async (ticketId: string) => {
    // Confirmação antes de excluir
    if (!confirm('Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchTickets() // Refresh tickets
        alert('Chamado excluído com sucesso!')
      } else {
        const errorData = await response.json()
        alert(`Erro ao excluir chamado: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert('Erro ao excluir chamado. Tente novamente.')
    }
  }

  const getTicketsByStatus = (status: string) => {
    return tickets?.filter(ticket => ticket?.status === status) || []
  }

  const getStats = () => {
    const total = tickets?.length || 0
    const newCount = getTicketsByStatus('NEW').length
    const inProgressCount = getTicketsByStatus('IN_PROGRESS').length
    const finishedCount = getTicketsByStatus('FINISHED').length
    const returnedCount = getTicketsByStatus('RETURNED').length

    return { total, newCount, inProgressCount, finishedCount, returnedCount }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo, {session?.user?.name || 'Usuário'}!
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus chamados de forma eficiente e organizada.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Todos os chamados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              Chamados sendo processados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.finishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Chamados concluídos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retornados</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returnedCount}</div>
            <p className="text-xs text-muted-foreground">
              Chamados retornados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {Object.entries(statusConfig).map(([status, config], index) => {
          const statusTickets = getTicketsByStatus(status)
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${config.color} rounded-lg`}>
                  <config.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {config.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {statusTickets.length} chamado{statusTickets.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Tickets */}
              <div className="space-y-3">
                {statusTickets.length > 0 ? (
                  statusTickets.map((ticket, ticketIndex) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * ticketIndex }}
                    >
                      <TicketCard
                        ticket={ticket}
                        onUpdate={handleTicketUpdate}
                        onDelete={handleTicketDelete}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                      <config.icon className="w-full h-full" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nenhum chamado {config.title.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
