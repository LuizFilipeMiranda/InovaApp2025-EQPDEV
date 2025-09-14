
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TicketCategory, Priority } from "@prisma/client"

interface TicketAnalysis {
  title: string
  description: string
  category: TicketCategory
  priority: Priority
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { message, conversationHistory } = await request.json()

    // Analisa a mensagem para extrair informações do chamado
    const analysis = await analyzeMessage(message, conversationHistory)
    
    if (!analysis) {
      return Response.json({ error: "Não foi possível analisar a mensagem" }, { status: 400 })
    }

    // Cria o chamado no banco de dados
    const ticket = await prisma.ticket.create({
      data: {
        title: analysis.title,
        description: analysis.description,
        category: analysis.category,
        priority: analysis.priority,
        createdBy: (session.user as any).id!,
        status: 'NEW'
      },
      include: {
        creator: true,
        assignee: true
      }
    })

    // Salva o histórico da conversa como comentário inicial
    if (conversationHistory && conversationHistory.length > 0) {
      const conversationText = conversationHistory
        .map((msg: any) => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n\n')

      await prisma.comment.create({
        data: {
          content: `Histórico da conversa do chatbot:\n\n${conversationText}`,
          ticketId: ticket.id,
          userId: (session.user as any).id!
        }
      })
    }

    return Response.json({ 
      success: true, 
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status
      },
      analysis
    })

  } catch (error) {
    console.error('Create ticket error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function analyzeMessage(message: string, conversationHistory: any[]): Promise<TicketAnalysis | null> {
  try {
    const analysisPrompt = `
Analise a seguinte mensagem e o histórico da conversa para extrair informações de um chamado de suporte.

Mensagem atual: "${message}"

Histórico da conversa:
${conversationHistory.map((msg: any) => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`).join('\n')}

Baseado na análise, extraia as seguintes informações:

1. TÍTULO: Um resumo curto e claro do problema (máximo 60 caracteres)
2. DESCRIÇÃO: Uma descrição detalhada do problema baseada na conversa
3. CATEGORIA: Determine a categoria mais apropriada:
   - TI: problemas com sistemas, computadores, impressoras, rede, email, senhas, softwares
   - SAC: questões relacionadas a clientes, reclamações, atendimento, produtos, entregas
   - FINANCEIRO: questões sobre reembolsos, pagamentos, faturas, cobranças, descontos
4. PRIORIDADE: Determine a prioridade:
   - URGENT: servidor parado, sistema fora do ar, não consegue acessar sistemas críticos
   - HIGH: problemas que afetam diretamente o trabalho
   - MEDIUM: problemas importantes mas não críticos
   - LOW: troca de tinta, limpeza, treinamento, dúvidas simples

Responda APENAS no formato JSON:
{
  "title": "título extraído",
  "description": "descrição detalhada",
  "category": "TI|SAC|FINANCEIRO",
  "priority": "LOW|MEDIUM|HIGH|URGENT",
  "confidence": 0.95
}
`

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de chamados de suporte. Responda sempre em formato JSON válido.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze message')
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content

    if (!analysisText) {
      return null
    }

    // Parse do JSON retornado pela IA
    const analysis = JSON.parse(analysisText)
    
    // Validação dos campos
    if (!analysis.title || !analysis.description || !analysis.category || !analysis.priority) {
      return null
    }

    return {
      title: analysis.title,
      description: analysis.description,
      category: analysis.category as TicketCategory,
      priority: analysis.priority as Priority,
      confidence: analysis.confidence || 0.8
    }

  } catch (error) {
    console.error('Analysis error:', error)
    return null
  }
}
