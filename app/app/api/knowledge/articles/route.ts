

import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TicketCategory } from "@prisma/client"

// GET - Lista todos os artigos (para admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // Verifica se é admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true }
    })

    if (user?.role !== 'ADM') {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 })
    }

    const articles = await prisma.knowledgeArticle.findMany({
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return Response.json({ articles })

  } catch (error) {
    console.error('Get articles error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Cria novo artigo (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // Verifica se é admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true }
    })

    if (user?.role !== 'ADM') {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 })
    }

    const { title, content, sector, keywords, tags } = await request.json()

    // Validações
    if (!title || !content || !sector) {
      return new Response(JSON.stringify({ error: "Title, content and sector are required" }), { status: 400 })
    }

    if (!Object.values(TicketCategory).includes(sector)) {
      return new Response(JSON.stringify({ error: "Invalid sector" }), { status: 400 })
    }

    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        content,
        sector: sector as TicketCategory,
        keywords: keywords || [],
        tags: tags || [],
        createdBy: (session.user as any).id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return Response.json({ success: true, article })

  } catch (error) {
    console.error('Create article error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

