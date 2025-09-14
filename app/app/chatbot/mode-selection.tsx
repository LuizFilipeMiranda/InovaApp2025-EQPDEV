

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, BookOpen, Sparkles, MessageSquare, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ModeSelectionProps {
  onModeSelect: (mode: 'ai' | 'knowledge') => void
  userName: string | null | undefined
}

export default function ModeSelection({ onModeSelect, userName }: ModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<'ai' | 'knowledge' | null>(null)

  const handleModeSelect = (mode: 'ai' | 'knowledge') => {
    setSelectedMode(mode)
    // Pequena animação antes de confirmar
    setTimeout(() => {
      onModeSelect(mode)
    }, 300)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Olá, {userName || 'usuário'}! 👋
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha como você quer conversar com nosso assistente especializado em suporte técnico:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Modo IA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedMode === 'ai' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'hover:border-blue-300 hover:shadow-lg'
              }`}
              onClick={() => handleModeSelect('ai')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">🤖 Assistente com IA</CardTitle>
                    <CardDescription>Conversas abertas e inteligentes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Converse naturalmente sobre qualquer dúvida relacionada a TI, SAC e Financeiro. 
                    A IA pode criar chamados automaticamente quando necessário.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      ✅ Funcionalidades:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Respostas personalizadas e contextuais</li>
                      <li>• Criação inteligente de chamados</li>
                      <li>• Suporte para problemas complexos</li>
                      <li>• Conversação natural em português</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-muted-foreground">
                      Ideal para questões diversas
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-colors ${
                      selectedMode === 'ai' ? 'text-blue-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modo Base de Conhecimento */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedMode === 'knowledge' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                  : 'hover:border-green-300 hover:shadow-lg'
              }`}
              onClick={() => handleModeSelect('knowledge')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">📚 Base de Conhecimento</CardTitle>
                    <CardDescription>Respostas específicas da empresa</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Acesse informações precisas sobre produtos, procedimentos e políticas da empresa. 
                    Respostas rápidas baseadas em nossa documentação interna.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      ✅ Inclui:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Soluções para problemas técnicos</li>
                      <li>• Políticas e procedimentos internos</li>
                      <li>• FAQs sobre produtos e serviços</li>
                      <li>• Guias passo-a-passo</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-muted-foreground">
                      Respostas oficiais da empresa
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-colors ${
                      selectedMode === 'knowledge' ? 'text-green-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Dica:</strong> Você pode escolher o modo mais adequado para cada tipo de dúvida. 
            Não é possível alterar durante a conversa.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

