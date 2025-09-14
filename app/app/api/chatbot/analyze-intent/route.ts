
import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { message } = await request.json()

    // Detecta se a mensagem é uma solicitação de criação de chamado
    const isTicketRequest = detectTicketIntent(message)
    
    return Response.json({ 
      isTicketRequest,
      message: message
    })

  } catch (error) {
    console.error('Intent analysis error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function detectTicketIntent(message: string): boolean {
  const ticketPhrases = [
    'quero fazer um chamado',
    'preciso abrir um chamado',
    'quero criar um chamado',
    'preciso criar um chamado',
    'abrir um ticket',
    'criar um ticket',
    'fazer um ticket'
  ]

  const messageLower = message.toLowerCase()
  
  return ticketPhrases.some(phrase => messageLower.includes(phrase))
}
