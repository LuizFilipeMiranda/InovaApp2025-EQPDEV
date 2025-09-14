

import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 })
    }

    // Busca artigos por similaridade de texto
    const articles = await searchArticles(query)
    
    return Response.json({ articles })

  } catch (error) {
    console.error('Knowledge search error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function searchArticles(query: string) {
  // Normaliza a query removendo acentos e convertendo para minúsculas
  const normalizedQuery = normalizeText(query)
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 2)

  // Busca todos os artigos ativos
  const allArticles = await prisma.knowledgeArticle.findMany({
    where: {
      isActive: true
    },
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

  // Calcula score de similaridade para cada artigo
  const articlesWithScore = allArticles.map(article => {
    const score = calculateSimilarityScore(normalizedQuery, queryWords, article)
    return {
      ...article,
      similarityScore: score
    }
  })

  // Filtra artigos com score acima do threshold e ordena por relevância
  const relevantArticles = articlesWithScore
    .filter(article => article.similarityScore > 0.1)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 5) // Retorna até 5 artigos mais relevantes

  return relevantArticles
}

function calculateSimilarityScore(normalizedQuery: string, queryWords: string[], article: any): number {
  const normalizedTitle = normalizeText(article.title)
  const normalizedContent = normalizeText(article.content)
  const normalizedKeywords = article.keywords.map((k: string) => normalizeText(k)).join(' ')
  const normalizedTags = article.tags.map((t: string) => normalizeText(t)).join(' ')

  let score = 0
  
  // Combina todo o texto do artigo para busca
  const fullText = `${normalizedTitle} ${normalizedContent} ${normalizedKeywords} ${normalizedTags}`
  
  // Score por correspondência exata de palavras
  queryWords.forEach(word => {
    if (word.length < 3) return // Ignora palavras muito curtas
    
    // Busca exata no título (peso maior)
    if (normalizedTitle.includes(word)) {
      score += 10
    }
    
    // Busca exata nas palavras-chave (peso alto)
    if (normalizedKeywords.includes(word)) {
      score += 8
    }
    
    // Busca exata nas tags (peso médio-alto)  
    if (normalizedTags.includes(word)) {
      score += 6
    }
    
    // Busca exata no conteúdo (peso médio)
    if (normalizedContent.includes(word)) {
      score += 4
    }
  })

  // Score por correspondência parcial (substring)
  queryWords.forEach(word => {
    if (word.length < 4) return // Só para palavras maiores
    
    // Busca parcial no título
    const titleMatches = (normalizedTitle.match(new RegExp(word, 'g')) || []).length
    score += titleMatches * 2
    
    // Busca parcial no conteúdo
    const contentMatches = (normalizedContent.match(new RegExp(word, 'g')) || []).length
    score += contentMatches * 1
  })

  // Score por correspondência da query completa
  if (fullText.includes(normalizedQuery)) {
    score += 15
  }

  // Normaliza o score (0-1)
  return Math.min(score / 50, 1)
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim()
}

