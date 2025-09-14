
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        creator: {
          select: { name: true, email: true, role: true }
        },
        assignee: {
          select: { name: true, email: true, role: true }
        },
        comments: {
          include: {
            user: {
              select: { name: true, role: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, priority } = await request.json()

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority: priority || 'MEDIUM',
        createdBy: (session.user as any).id
      },
      include: {
        creator: {
          select: { name: true, email: true, role: true }
        },
        assignee: {
          select: { name: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
