
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, MessageSquare, Clock, CheckCircle, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ModeSelection from './mode-selection'
import KnowledgeChat from './knowledge-chat'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  ticketSummary?: TicketSummary
  isTicketConfirmation?: boolean
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface TicketSummary {
  title: string
  description: string
  category: string
  priority: string
  confidence: number
}

export default function ChatbotClient() {
  const [chatMode, setChatMode] = useState<'ai' | 'knowledge' | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [pendingTicket, setPendingTicket] = useState<TicketSummary | null>(null)
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession() || {}
  const router = useRouter()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Conversa ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date()
    }
    
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Olá, ${session?.user?.name}! 👋\n\nSou seu assistente especializado em suporte técnico. Posso ajudá-lo com questões relacionadas a TI, SAC e Financeiro.\n\n📋 **Para criar um chamado:**\nCaso queira criar um chamado só digitar "quero fazer um chamado (motivo do chamado)", mas em casos de dúvidas comuns pode conversar tranquilamente.\n\n✨ Como posso ajudá-lo hoje?`,
      role: 'assistant',
      timestamp: new Date()
    }
    
    setSessions(prev => [newSession, ...prev])
    setCurrentSession(newSession.id)
    setMessages([welcomeMessage])
    setPendingTicket(null)
    setIsAwaitingConfirmation(false)
  }

  const loadSession = (sessionId: string) => {
    const sessionData = sessions.find(s => s.id === sessionId)
    if (sessionData) {
      setCurrentSession(sessionId)
      setMessages(sessionData.messages)
    }
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
      // Verifica se o usuário quer cancelar um chamado
      if (isAwaitingConfirmation && userInput.toLowerCase().includes('cancele esse chamado')) {
        await handleCancelTicket()
        return
      }

      // Verifica se há um ticket pendente de confirmação
      if (isAwaitingConfirmation && pendingTicket) {
        await handleTicketConfirmationResponse(userInput)
        return
      }

      // Verifica se é uma solicitação de criação de chamado
      const isTicketRequest = detectTicketIntent(userInput)
      
      if (isTicketRequest) {
        await handleTicketCreationFlow(userInput)
        return
      }

      // Conversa normal
      await handleNormalChat(userInput)

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const detectTicketIntent = (message: string): boolean => {
    const ticketPhrases = [
      'quero fazer um chamado',
      'preciso abrir um chamado'
    ]
    
    const messageLower = message.toLowerCase()
    return ticketPhrases.some(phrase => messageLower.includes(phrase))
  }

  const handleTicketCreationFlow = async (userInput: string) => {
    setIsCreatingTicket(true)
    
    try {
      // Mostra o indicador de processamento
      const processingMsgId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, {
        id: processingMsgId,
        content: '',
        role: 'assistant',
        timestamp: new Date()
      }])

      // Simula o processamento
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Analisa a mensagem para criar o resumo do chamado
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/chatbot/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: conversationHistory
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze ticket')
      }

      const { analysis } = await response.json()
      
      if (!analysis) {
        // Se não conseguiu analisar, pede esclarecimentos
        setMessages(prev => prev.map(msg => 
          msg.id === processingMsgId 
            ? { 
                ...msg, 
                content: 'Não consegui entender completamente sua solicitação. Qual departamento deveria atender seu chamado?\n\n🔧 **TI** - Problemas com sistemas, computadores, impressoras, rede\n💼 **SAC** - Questões de clientes, reclamações, atendimento\n💰 **FINANCEIRO** - Reembolsos, pagamentos, faturas\n\nPor favor, me dê mais detalhes sobre o problema.' 
              }
            : msg
        ))
        return
      }

      setPendingTicket(analysis)
      setIsAwaitingConfirmation(true)

      // Mostra o resumo do chamado
      const summaryMessage = `📋 **Resumo do Chamado**\n\n**Título:** ${analysis.title}\n**Descrição:** ${analysis.description}\n**Departamento:** ${analysis.category}\n**Prioridade:** ${getPriorityLabel(analysis.priority)}\n\n✅ Posso criar este chamado para você?\n❌ Digite "não" se quiser alterar algo`

      setMessages(prev => prev.map(msg => 
        msg.id === processingMsgId 
          ? { 
              ...msg, 
              content: summaryMessage,
              ticketSummary: analysis,
              isTicketConfirmation: true
            }
          : msg
      ))

    } catch (error) {
      console.error('Ticket creation flow error:', error)
      setMessages(prev => prev.map(msg => 
        msg.id === (Date.now() + 1).toString()
          ? { 
              ...msg, 
              content: 'Ocorreu um erro ao processar seu chamado. Tente novamente mais tarde.' 
            }
          : msg
      ))
    } finally {
      setIsCreatingTicket(false)
    }
  }

  const handleTicketConfirmationResponse = async (userInput: string) => {
    const isPositive = ['sim', 'confirmo', 'ok', 'confirmar', 'criar', 'pode criar'].some(word => 
      userInput.toLowerCase().includes(word)
    )
    
    const isNegative = ['não', 'nao', 'alterar', 'mudar', 'cancelar'].some(word => 
      userInput.toLowerCase().includes(word)
    )

    if (isPositive && pendingTicket) {
      await createTicket()
    } else if (isNegative) {
      await handleTicketModification()
    } else {
      // Resposta ambígua
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: 'Por favor, responda com "sim" para confirmar a criação do chamado ou "não" se quiser alterar algo.\n\nO que gostaria de alterar no chamado? (título, descrição, categoria)',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }
  }

  const createTicket = async () => {
    if (!pendingTicket) return

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/chatbot/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Criar chamado: ${pendingTicket.title}`,
          conversationHistory: conversationHistory
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create ticket')
      }

      const { ticket } = await response.json()

      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ **Chamado criado com sucesso!**\n\n🎫 **ID:** ${ticket.id}\n📋 **Título:** ${ticket.title}\n🏢 **Departamento:** ${ticket.category}\n⚡ **Prioridade:** ${getPriorityLabel(ticket.priority)}\n\nSeu chamado foi adicionado à coluna "Novos chamados" e será atendido em breve.\n\n❓ Tem mais alguma dúvida que posso ajudar?`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, successMessage])

      // Limpa os estados
      setPendingTicket(null)
      setIsAwaitingConfirmation(false)

      // Mostra notificação
      toast.success('Chamado criado com sucesso!')

      // Redireciona para o dashboard após 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
        // Fecha o chat após redirecionar
        setTimeout(() => {
          setMessages([])
          setCurrentSession(null)
        }, 1000)
      }, 2000)

    } catch (error) {
      console.error('Create ticket error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Erro ao criar o chamado. Tentando novamente...',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      // Tenta novamente após 3 segundos
      setTimeout(() => createTicket(), 3000)
    }
  }

  const handleTicketModification = async () => {
    const modificationMessage: Message = {
      id: Date.now().toString(),
      content: 'Entendi! O que gostaria de alterar no chamado?\n\n📝 **Título/Descrição:** Explique melhor o problema\n🏢 **Departamento:** Especifique TI, SAC ou FINANCEIRO\n⚡ **Prioridade:** Me diga se é urgente ou pode esperar\n\nDescreva as alterações que gostaria de fazer:',
      role: 'assistant',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, modificationMessage])
    setIsAwaitingConfirmation(false)
    setPendingTicket(null)
  }

  const handleCancelTicket = async () => {
    const cancelMessage: Message = {
      id: Date.now().toString(),
      content: '❌ Chamado cancelado! \n\nSe precisar de ajuda ou quiser criar outro chamado, é só falar comigo.\n\n😊 Em que mais posso ajudá-lo?',
      role: 'assistant',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, cancelMessage])
    setIsAwaitingConfirmation(false)
    setPendingTicket(null)
  }

  const handleNormalChat = async (userInput: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            {
              role: 'user',
              content: userInput
            }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      const assistantMsgId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        content: '',
        role: 'assistant',
        timestamp: new Date()
      }])

      while (true) {
        const { done, value } = await reader?.read() || { done: true }
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              
              if (content) {
                assistantMessage += content
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ))
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Update session with new messages
      if (currentSession) {
        setSessions(prev => prev.map(session => 
          session.id === currentSession
            ? {
                ...session,
                messages: [...session.messages, {
                  id: Date.now().toString(),
                  content: userInput,
                  role: 'user',
                  timestamp: new Date()
                }, {
                  id: assistantMsgId,
                  content: assistantMessage,
                  role: 'assistant',
                  timestamp: new Date()
                }]
              }
            : session
        ))
      }

    } catch (error) {
      console.error('Normal chat error:', error)
      throw error
    }
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

  // Renderização condicional baseada no modo selecionado
  if (!chatMode) {
    return (
      <div className="flex h-screen">
        <ModeSelection 
          onModeSelect={setChatMode}
          userName={session?.user?.name}
        />
      </div>
    )
  }

  if (chatMode === 'knowledge') {
    return (
      <div className="flex h-screen">
        <KnowledgeChat onBack={() => setChatMode(null)} />
      </div>
    )
  }

  // Modo IA (funcionamento original)
  return (
    <div className="flex h-screen">
      {/* Chat History Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-80 border-r border-border bg-muted/30 p-4">
        <div className="mb-4">
          <Button 
            onClick={createNewSession}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Histórico de Conversas (IA)
          </h3>
          
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma conversa ainda.<br/>
              Inicie uma nova conversa!
            </p>
          ) : (
            sessions.map((sessionData) => (
              <Button
                key={sessionData.id}
                variant={currentSession === sessionData.id ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => loadSession(sessionData.id)}
              >
                <div className="text-left">
                  <p className="text-sm font-medium truncate">
                    {sessionData.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground">
                      {sessionData.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setChatMode(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Assistente Case Flow</h2>
                <p className="text-sm text-muted-foreground">
                  Especialista em suporte técnico e chamados
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Modo IA
              </Badge>
              
              {/* Nova Conversa button for mobile */}
              <div className="lg:hidden">
                <Button 
                  onClick={createNewSession}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {messages.length === 0 && !currentSession ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Olá, {session?.user?.name}!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Sou seu assistente especializado em suporte técnico. Posso ajudá-lo com questões relacionadas a TI, SAC e Financeiro. Como posso ajudá-lo hoje?
                </p>
                <Button 
                  onClick={createNewSession}
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  Iniciar Conversa
                </Button>
              </motion.div>
            ) : (
              messages.map((message) => (
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
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] sm:max-w-[70%] ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.isTicketConfirmation 
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-muted'
                  } rounded-2xl px-3 sm:px-4 py-2`}>
                    {message.isTicketConfirmation && message.ticketSummary ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            Confirmação de Chamado
                          </span>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              Título
                            </span>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {message.ticketSummary.title}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              Descrição
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {message.ticketSummary.description}
                            </p>
                          </div>
                          
                          <div className="flex gap-4">
                            <div>
                              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Departamento
                              </span>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {message.ticketSummary.category}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Prioridade
                              </span>
                              <p className="text-sm font-medium">
                                {getPriorityLabel(message.ticketSummary.priority)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          ✅ Posso criar este chamado para você?
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Responda "sim" para confirmar ou "não" se quiser alterar algo
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
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
              ))
            )}
          </AnimatePresence>

          {(isLoading || isCreatingTicket) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {isCreatingTicket ? 'Analisando e criando chamado...' : 'Digitando...'}
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentSession && (
          <div className="border-t border-border p-2 sm:p-4 bg-background">
            {isAwaitingConfirmation && (
              <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⏳ Aguardando sua confirmação para criar o chamado. 
                  Responda "sim" para confirmar, "não" para alterar, ou "cancele esse chamado" para cancelar.
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isAwaitingConfirmation 
                    ? 'Responda "sim" para confirmar ou "não" para alterar...' 
                    : 'Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)'
                }
                className="flex-1 min-h-[50px] resize-none"
                disabled={isLoading || isCreatingTicket}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || isCreatingTicket}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 h-[50px] w-[50px]"
              >
                {(isLoading || isCreatingTicket) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
