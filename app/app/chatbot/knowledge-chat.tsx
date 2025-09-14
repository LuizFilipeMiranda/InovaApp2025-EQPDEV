

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, BookOpen, ArrowLeft, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  articles?: KnowledgeArticle[]
  isTicketOffered?: boolean
}

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  sector: string
  keywords: string[]
  tags: string[]
  similarityScore?: number
}

interface KnowledgeChatProps {
  onBack: () => void
}

export default function KnowledgeChat({ onBack }: KnowledgeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession() || {}
  const router = useRouter()

  useEffect(() => {
    // Mensagem de boas-vindas para o modo base de conhecimento
    const welcomeMessage: Message = {
      id: 'welcome-knowledge',
      content: `Olá, ${session?.user?.name}! 📚\n\nVocê está no modo **Base de Conhecimento**.\n\nAqui você encontrará respostas específicas sobre:\n• **Produtos** (monitores, mouses, teclados)\n• **Procedimentos** técnicos e administrativos\n• **Políticas** da empresa\n• **Soluções** para problemas comuns\n\n💡 **Como usar:** Digite sua dúvida naturalmente e encontrarei os artigos mais relevantes em nossa base de conhecimento.\n\nEm que posso ajudá-lo?`,
      role: 'assistant',
      timestamp: new Date()
    }
    
    setMessages([welcomeMessage])
    scrollToBottom()
  }, [session?.user?.name])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userInput = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Busca na base de conhecimento
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userInput
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to search knowledge base')
      }

      const { articles } = await response.json()

      if (articles && articles.length > 0) {
        if (articles.length === 1) {
          // Uma resposta encontrada - mostra diretamente
          showSingleArticle(articles[0])
        } else {
          // Múltiplas respostas - pergunta qual o usuário prefere
          showMultipleArticles(articles)
        }
      } else {
        // Nenhuma resposta encontrada - oferece criar chamado
        showNoResultsFound(userInput)
      }

    } catch (error) {
      console.error('Knowledge search error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao buscar na base de conhecimento. Tente novamente.',
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const showSingleArticle = (article: KnowledgeArticle) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `📚 **Encontrei isso na nossa base de conhecimento:**\n\n${article.content}`,
      role: 'assistant',
      timestamp: new Date(),
      articles: [article]
    }

    setMessages(prev => [...prev, assistantMessage])
    
    // Pergunta se resolveu o problema
    setTimeout(() => {
      const followUpMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: '✅ Esta informação resolveu sua dúvida?\n\nSe não resolveu completamente, posso criar um chamado para que nossa equipe entre em contato com você.',
        role: 'assistant',
        timestamp: new Date(),
        isTicketOffered: true
      }
      setMessages(prev => [...prev, followUpMessage])
    }, 1000)
  }

  const showMultipleArticles = (articles: KnowledgeArticle[]) => {
    const topArticles = articles.slice(0, 3) // Mostra até 3 mais relevantes
    
    const articlesList = topArticles.map((article, index) => 
      `**${index + 1}. ${article.title}** (${getSectorLabel(article.sector)})`
    ).join('\n')

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `🔍 **Encontrei ${articles.length} artigos relacionados à sua dúvida:**\n\n${articlesList}\n\n💡 Digite o **número** da opção que mais se relaciona com sua dúvida (1, 2 ou 3), ou digite "nenhuma" se nenhuma opção atende.`,
      role: 'assistant',
      timestamp: new Date(),
      articles: topArticles
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  const showNoResultsFound = (userQuery: string) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `🤔 **Não encontrei informações específicas sobre sua dúvida na nossa base de conhecimento.**\n\nPosso criar um chamado para que nossa equipe especializada possa ajudá-lo com:\n"${userQuery}"\n\n📋 Quer que eu crie um chamado para você?`,
      role: 'assistant',
      timestamp: new Date(),
      isTicketOffered: true
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  const handleArticleSelection = (selectedNumber: number, articles: KnowledgeArticle[]) => {
    if (selectedNumber >= 1 && selectedNumber <= articles.length) {
      const article = articles[selectedNumber - 1]
      showSingleArticle(article)
    }
  }

  const handleTicketCreation = async (userQuery: string) => {
    setIsCreatingTicket(true)

    try {
      const response = await fetch('/api/chatbot/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Dúvida não encontrada na base de conhecimento: ${userQuery}`,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create ticket')
      }

      const { ticket } = await response.json()

      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ **Chamado criado com sucesso!**\n\n🎫 **ID:** ${ticket.id}\n📋 **Título:** ${ticket.title}\n🏢 **Departamento:** ${ticket.category}\n⚡ **Prioridade:** ${getPriorityLabel(ticket.priority)}\n\nSeu chamado foi adicionado à nossa fila de atendimento. Nossa equipe entrará em contato em breve.\n\n🔄 Quer fazer outra consulta?`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, successMessage])

      toast.success('Chamado criado com sucesso!')

      // Redireciona para o dashboard após 3 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (error) {
      console.error('Create ticket error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '❌ Erro ao criar o chamado. Tente novamente ou entre em contato conosco.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsCreatingTicket(false)
    }
  }

  const getSectorLabel = (sector: string): string => {
    const labels = {
      'TI': '💻 TI',
      'SAC': '🛡️ SAC',
      'FINANCEIRO': '💰 Financeiro'
    }
    return labels[sector as keyof typeof labels] || sector
  }

  const getPriorityLabel = (priority: string): string => {
    const labels = {
      'LOW': '🟢 Baixa',
      'MEDIUM': '🟡 Média',
      'HIGH': '🟠 Alta',
      'URGENT': '🔴 Urgente'
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickResponse = (response: string) => {
    const lastMessage = messages[messages.length - 1]
    
    if (lastMessage?.isTicketOffered) {
      const userQuery = messages.find(m => m.role === 'user')?.content || input
      
      if (response.toLowerCase().includes('sim') || response.toLowerCase().includes('criar')) {
        handleTicketCreation(userQuery)
        return
      }
    }

    if (lastMessage?.articles && /^[1-3]$/.test(response)) {
      handleArticleSelection(parseInt(response), lastMessage.articles)
      return
    }

    // Para outras respostas, trata como nova busca
    setInput(response)
    sendMessage()
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Base de Conhecimento</h2>
              <p className="text-sm text-muted-foreground">
                Respostas específicas da empresa
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <BookOpen className="h-3 w-3 mr-1" />
            Modo Fechado
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] sm:max-w-[70%] ${
                message.role === 'user' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted'
              } rounded-2xl px-4 py-2`}>
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {message.articles && (
                  <div className="mt-3 space-y-2">
                    {message.articles.map((article, index) => (
                      <div key={article.id} className="bg-background/10 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {getSectorLabel(article.sector)}
                          </Badge>
                          {article.similarityScore && (
                            <span className="text-xs opacity-60">
                              {Math.round(article.similarityScore * 100)}% relevante
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className={`text-xs mt-1 opacity-70 ${
                  message.role === 'user' ? 'text-green-100' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {(isLoading || isCreatingTicket) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {isCreatingTicket ? 'Criando chamado...' : 'Buscando na base de conhecimento...'}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      {messages.length > 1 && messages[messages.length - 1]?.role === 'assistant' && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1]?.isTicketOffered && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickResponse('Sim, criar chamado')}
                  disabled={isLoading || isCreatingTicket}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sim, criar chamado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickResponse('Não, tentar novamente')}
                  disabled={isLoading || isCreatingTicket}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Tentar novamente
                </Button>
              </>
            )}
            
            {messages[messages.length - 1]?.articles && messages[messages.length - 1].articles!.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickResponse('1')}
                  disabled={isLoading || isCreatingTicket}
                >
                  1️⃣ Primeira opção
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickResponse('2')}
                  disabled={isLoading || isCreatingTicket}
                >
                  2️⃣ Segunda opção
                </Button>
                {messages[messages.length - 1].articles!.length >= 3 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickResponse('3')}
                    disabled={isLoading || isCreatingTicket}
                  >
                    3️⃣ Terceira opção
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickResponse('Nenhuma opção resolve')}
                  disabled={isLoading || isCreatingTicket}
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Nenhuma resolve
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua dúvida sobre produtos, procedimentos ou políticas..."
            className="flex-1 min-h-[50px] resize-none"
            disabled={isLoading || isCreatingTicket}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || isCreatingTicket}
            size="icon"
            className="bg-green-500 hover:bg-green-600 h-[50px] w-[50px]"
          >
            {(isLoading || isCreatingTicket) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

