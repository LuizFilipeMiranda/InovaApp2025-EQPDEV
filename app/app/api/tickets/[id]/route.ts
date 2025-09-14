
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, comment } = await request.json()
    const ticketId = params.id
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 })
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { creator: true, assignee: true }
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    let updateData: any = {}
    
    switch (action) {
      case 'accept':
        if (userRole !== 'ADM' && userRole !== ticket.category) {
          return NextResponse.json({ error: "Unauthorized action" }, { status: 403 })
        }
        updateData = {
          status: 'IN_PROGRESS',
          assignedTo: userId
        }
        break
      
      case 'finish':
        if (!comment) {
          return NextResponse.json({ error: "Comment required to finish ticket" }, { status: 400 })
        }
        updateData = { status: 'FINISHED' }
        break
      
      case 'return':
        updateData = { status: 'RETURNED' }
        break
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        creator: {
          select: { name: true, email: true, role: true }
        },
        assignee: {
          select: { name: true, email: true, role: true }
        }
      }
    })

    // Add comment if provided
    if (comment) {
      await prisma.comment.create({
        data: {
          content: comment,
          ticketId,
          userId
        }
      })
    }

    return NextResponse.json({ ticket: updatedTicket })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    
    // Only admins can delete tickets
    if (userRole !== 'ADM') {
      return NextResponse.json({ error: "Forbidden - Only admins can delete tickets" }, { status: 403 })
    }

    const ticketId = params.id

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 })
    }

    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Delete the ticket (comments will be deleted automatically due to CASCADE)
    await prisma.ticket.delete({
      where: { id: ticketId }
    })

    return NextResponse.json({ message: "Ticket deleted successfully" })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
