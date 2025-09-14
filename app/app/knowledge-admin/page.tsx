

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import KnowledgeAdminClient from './knowledge-admin-client'

export default async function KnowledgeAdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  // Verifica se é admin
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true }
  })

  if (user?.role !== 'ADM') {
    redirect('/dashboard')
  }

  return <KnowledgeAdminClient />
}

