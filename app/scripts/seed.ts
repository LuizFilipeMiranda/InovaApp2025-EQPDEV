
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create the 4 predefined users
  const users = [
    {
      email: 'cleitinho@caseflow.com',
      name: 'Cleitinho',
      role: 'ADM' as const,
      password: '1234'
    },
    {
      email: 'joao_ti@caseflow.com',
      name: 'João Silva',
      role: 'TI' as const,
      password: '1234'
    },
    {
      email: 'maria_sac@caseflow.com',
      name: 'Maria Santos',
      role: 'SAC' as const,
      password: '1234'
    },
    {
      email: 'carlos_fin@caseflow.com',
      name: 'Carlos Oliveira',
      role: 'FINANCEIRO' as const,
      password: '1234'
    }
  ]

  // Create users
  const createdUsers = []
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword
      }
    })
    
    createdUsers.push(user)
    console.log(`Created user: ${user.name} (${user.role})`)
  }

  // Sample tickets data
  const sampleTickets = [
    {
      title: 'Sistema lento na filial Norte',
      description: 'O sistema está apresentando lentidão excessiva na filial Norte, principalmente ao acessar relatórios financeiros. Usuários relatam demora de mais de 5 minutos para carregar páginas.',
      category: 'TI' as const,
      status: 'NEW' as const,
      priority: 'HIGH' as const,
      createdByEmail: 'maria_sac@caseflow.com'
    },
    {
      title: 'Cliente não consegue acessar conta online',
      description: 'Cliente João da Silva (CPF: 123.456.789-00) não consegue fazer login no sistema desde ontem. Já tentou recuperar senha mas não está recebendo o email.',
      category: 'SAC' as const,
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      createdByEmail: 'cleitinho@caseflow.com'
    },
    {
      title: 'Divergência no fechamento mensal',
      description: 'Foi identificada uma divergência de R$ 2.547,80 no fechamento do mês de outubro. Precisa ser investigado com urgência antes do envio do relatório para a matriz.',
      category: 'FINANCEIRO' as const,
      status: 'NEW' as const,
      priority: 'URGENT' as const,
      createdByEmail: 'joao_ti@caseflow.com'
    },
    {
      title: 'Impressora não funciona no setor comercial',
      description: 'A impressora HP LaserJet do setor comercial parou de funcionar. Já verificamos conexões e cartuchos, mas não conseguimos identificar o problema.',
      category: 'TI' as const,
      status: 'FINISHED' as const,
      priority: 'LOW' as const,
      createdByEmail: 'maria_sac@caseflow.com'
    },
    {
      title: 'Solicitação de reembolso em análise',
      description: 'Cliente solicita reembolso de compra realizada no valor de R$ 1.299,00. Produto apresentou defeito dentro do prazo de garantia. Protocolo: RB-2024-0891.',
      category: 'SAC' as const,
      status: 'RETURNED' as const,
      priority: 'MEDIUM' as const,
      createdByEmail: 'carlos_fin@caseflow.com'
    },
    {
      title: 'Conciliação bancária pendente',
      description: 'Conciliação bancária do Banco XYZ apresenta diferenças que precisam ser analisadas. Total de R$ 15.847,32 em movimentações não identificadas.',
      category: 'FINANCEIRO' as const,
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      createdByEmail: 'cleitinho@caseflow.com'
    },
    {
      title: 'Backup do servidor falhou',
      description: 'O backup automático do servidor principal falhou nas últimas 3 tentativas. Necessário verificar espaço em disco e integridade dos dados.',
      category: 'TI' as const,
      status: 'NEW' as const,
      priority: 'URGENT' as const,
      createdByEmail: 'maria_sac@caseflow.com'
    },
    {
      title: 'Treinamento para nova funcionalidade',
      description: 'Equipe do SAC solicita treinamento para nova funcionalidade de chat online que será implementada no próximo mês.',
      category: 'SAC' as const,
      status: 'FINISHED' as const,
      priority: 'LOW' as const,
      createdByEmail: 'joao_ti@caseflow.com'
    }
  ]

  // Create sample tickets
  for (const ticketData of sampleTickets) {
    const creator = createdUsers.find(user => user.email === ticketData.createdByEmail)
    if (!creator) continue

    let assignedTo = null
    if (ticketData.status === 'IN_PROGRESS' || ticketData.status === 'FINISHED') {
      // Assign to a user of the same category or admin
      const categoryUser = createdUsers.find(user => user.role === ticketData.category)
      assignedTo = categoryUser?.id || createdUsers.find(user => user.role === 'ADM')?.id
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        status: ticketData.status,
        priority: ticketData.priority,
        createdBy: creator.id,
        assignedTo: assignedTo,
      }
    })

    // Add some sample comments for tickets that are in progress or finished
    if (ticketData.status === 'IN_PROGRESS' || ticketData.status === 'FINISHED' || ticketData.status === 'RETURNED') {
      await prisma.comment.create({
        data: {
          content: ticketData.status === 'IN_PROGRESS' 
            ? 'Iniciando análise do problema. Vou investigar as possíveis causas.'
            : ticketData.status === 'FINISHED'
            ? 'Problema resolvido com sucesso. Testado e funcionando normalmente.'
            : 'Retornando para reavaliação. Necessário mais informações do solicitante.',
          ticketId: ticket.id,
          userId: assignedTo || creator.id
        }
      })
    }

    console.log(`Created ticket: ${ticket.title} (${ticket.status})`)
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
