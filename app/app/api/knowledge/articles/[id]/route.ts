

import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TicketCategory } from "@prisma/client"

// PUT - Atualiza artigo (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { title, content, sector, keywords, tags, isActive } = await request.json()

    const article = await prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: {
        title,
        content,
        sector: sector as TicketCategory,
        keywords: keywords || [],
        tags: tags || [],
        isActive: isActive !== undefined ? isActive : true,
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
    console.error('Update article error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Exclui artigo (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.knowledgeArticle.delete({
      where: { id: params.id }
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error('Delete article error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

