
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  Plus,
  X,
  MessageSquare,
  Calendar,
  Trash2
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader } from './ui/card'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

interface TicketCardProps {
  ticket: Ticket
  onUpdate: (ticketId: string, action: string, comment?: string) => void
  onDelete: (ticketId: string) => void
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const categoryColors = {
  TI: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  SAC: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  FINANCEIRO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
}

export default function TicketCard({ ticket, onUpdate, onDelete }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [comment, setComment] = useState('')
  const [newComment, setNewComment] = useState('')
  const { data: session } = useSession() || {}
  
  const userRole = (session?.user as any)?.role
  const canInteract = userRole === 'ADM' || userRole === ticket.category
  const isAdmin = userRole === 'ADM'

  const handleAction = async (action: string) => {
    if (action === 'finish' && !comment) {
      alert('Comentário obrigatório para finalizar chamado')
      return
    }
    
    await onUpdate(ticket.id, action, comment || undefined)
    setComment('')
    setIsExpanded(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })
      
      if (response.ok) {
        setNewComment('')
        // Trigger refresh
        window.location.reload()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm line-clamp-2 flex-1">
                {ticket.title}
              </h3>
              <Badge className={cn("text-xs", priorityColors[ticket.priority])}>
                {ticket.priority}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className={cn("text-xs", categoryColors[ticket.category])}>
                {ticket.category}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {ticket.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{ticket.creator.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(ticket.createdAt), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}</span>
              </div>
            </div>
            
            {ticket.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <User className="h-3 w-3" />
                <span>Responsável: {ticket.assignee.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 90 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={cn("text-xs", categoryColors[ticket.category])}>
                        {ticket.category}
                      </Badge>
                      <Badge className={cn("text-xs", priorityColors[ticket.priority])}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline">
                        ID: {ticket.id.slice(-6)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {ticket.description}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Criado por</h4>
                    <p className="text-sm text-muted-foreground">{ticket.creator.name}</p>
                    <p className="text-xs text-muted-foreground">{ticket.creator.email}</p>
                  </div>
                  {ticket.assignee && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Responsável</h4>
                      <p className="text-sm text-muted-foreground">{ticket.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">{ticket.assignee.email}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm mb-1">Criado em</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Última atualização</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                {ticket.comments && ticket.comments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comentários ({ticket.comments.length})
                    </h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {ticket.comments.map((comment) => (
                        <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Comment */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Adicionar Comentário</h3>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite seu comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                {canInteract && (
                  <div className="space-y-4">
                    {ticket.status === 'IN_PROGRESS' && (
                      <div>
                        <h3 className="font-medium mb-2">Finalizar Chamado</h3>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Comentário obrigatório para finalizar..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                          />
                          <Button 
                            onClick={() => handleAction('finish')}
                            className="w-full bg-green-500 hover:bg-green-600"
                            disabled={!comment.trim()}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Finalizar Chamado
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {ticket.status === 'NEW' && (
                        <Button 
                          onClick={() => handleAction('accept')}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Aceitar
                        </Button>
                      )}

                      {(ticket.status === 'FINISHED' || ticket.status === 'IN_PROGRESS') && (
                        <Button 
                          onClick={() => handleAction('return')}
                          variant="outline"
                          className="border-orange-500 text-orange-500 hover:bg-orange-50"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retornar
                        </Button>
                      )}
                    </div>

                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <div className="pt-4 border-t border-muted">
                        <Button 
                          onClick={() => {
                            setIsExpanded(false)
                            onDelete(ticket.id)
                          }}
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Chamado
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          ⚠️ Esta ação não pode ser desfeita
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
