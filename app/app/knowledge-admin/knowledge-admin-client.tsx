

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Eye, Search, Filter, BookOpen, Users, FileText, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  sector: string
  keywords: string[]
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  creator: {
    name: string | null
    email: string
  }
}

interface Stats {
  total: number
  byStatus: { active: number; inactive: number }
  bySector: { [key: string]: number }
}

export default function KnowledgeAdminClient() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sector: '',
    keywords: '',
    tags: '',
    isActive: true
  })
  
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byStatus: { active: 0, inactive: 0 },
    bySector: {}
  })

  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, sectorFilter, statusFilter])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/knowledge/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
        calculateStats(data.articles)
      } else {
        toast.error('Erro ao carregar artigos')
      }
    } catch (error) {
      toast.error('Erro ao carregar artigos')
      console.error('Fetch articles error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (articles: KnowledgeArticle[]) => {
    const stats: Stats = {
      total: articles.length,
      byStatus: {
        active: articles.filter(a => a.isActive).length,
        inactive: articles.filter(a => !a.isActive).length
      },
      bySector: {}
    }

    articles.forEach(article => {
      stats.bySector[article.sector] = (stats.bySector[article.sector] || 0) + 1
    })

    setStats(stats)
  }

  const filterArticles = () => {
    let filtered = articles

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        article.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filtro por setor
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(article => article.sector === sectorFilter)
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(article => article.isActive === isActive)
    }

    setFilteredArticles(filtered)
  }

  const openCreateDialog = () => {
    setEditingArticle(null)
    setFormData({
      title: '',
      content: '',
      sector: '',
      keywords: '',
      tags: '',
      isActive: true
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (article: KnowledgeArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      sector: article.sector,
      keywords: article.keywords.join(', '),
      tags: article.tags.join(', '),
      isActive: article.isActive
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.sector) {
      toast.error('Título, conteúdo e setor são obrigatórios')
      return
    }

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      const url = editingArticle 
        ? `/api/knowledge/articles/${editingArticle.id}`
        : '/api/knowledge/articles'
      
      const method = editingArticle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(editingArticle ? 'Artigo atualizado!' : 'Artigo criado!')
        setIsDialogOpen(false)
        fetchArticles()
      } else {
        toast.error('Erro ao salvar artigo')
      }
    } catch (error) {
      toast.error('Erro ao salvar artigo')
      console.error('Save article error:', error)
    }
  }

  const handleDelete = async () => {
    if (!articleToDelete) return

    try {
      const response = await fetch(`/api/knowledge/articles/${articleToDelete}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Artigo excluído!')
        setIsDeleteDialogOpen(false)
        setArticleToDelete(null)
        fetchArticles()
      } else {
        toast.error('Erro ao excluir artigo')
      }
    } catch (error) {
      toast.error('Erro ao excluir artigo')
      console.error('Delete article error:', error)
    }
  }

  const getSectorLabel = (sector: string): string => {
    const labels = {
      'TI': '💻 TI',
      'SAC': '🛡️ SAC',
      'FINANCEIRO': '💰 Financeiro'
    }
    return labels[sector as keyof typeof labels] || sector
  }

  const getSectorColor = (sector: string): string => {
    const colors = {
      'TI': 'bg-blue-100 text-blue-800 border-blue-200',
      'SAC': 'bg-green-100 text-green-800 border-green-200',
      'FINANCEIRO': 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[sector as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando artigos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📚 Base de Conhecimento</h1>
          <p className="text-muted-foreground">Gerencie artigos, procedimentos e políticas da empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </Button>
          <Button onClick={openCreateDialog} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.byStatus.active} ativos, {stats.byStatus.inactive} inativos
            </p>
          </CardContent>
        </Card>

        {Object.entries(stats.bySector).map(([sector, count]) => (
          <Card key={sector}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getSectorLabel(sector)}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((count / stats.total) * 100)}% do total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título, conteúdo, palavras-chave ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Label htmlFor="sector">Setor</Label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  <SelectItem value="TI">💻 TI</SelectItem>
                  <SelectItem value="SAC">🛡️ SAC</SelectItem>
                  <SelectItem value="FINANCEIRO">💰 Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Artigos ({filteredArticles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {articles.length === 0 ? 'Nenhum artigo cadastrado ainda.' : 'Nenhum artigo encontrado com os filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 ${
                    !article.isActive ? 'opacity-60 bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        <Badge className={getSectorColor(article.sector)}>
                          {getSectorLabel(article.sector)}
                        </Badge>
                        {!article.isActive && (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {article.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.keywords.length - 3} mais
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Criado por: {article.creator.name || article.creator.email}</span>
                        <span>•</span>
                        <span>Atualizado: {new Date(article.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(article)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setArticleToDelete(article.id)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
            </DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Atualize as informações do artigo.' : 'Crie um novo artigo para a base de conhecimento.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Como resetar senha do sistema"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="sector">Setor *</Label>
              <Select
                value={formData.sector}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">💻 TI</SelectItem>
                  <SelectItem value="SAC">🛡️ SAC</SelectItem>
                  <SelectItem value="FINANCEIRO">💰 Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywords">Palavras-chave</Label>
              <Input
                id="keywords"
                placeholder="Ex: senha, password, resetar, login (separadas por vírgula)"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Palavras que ajudam na busca. Separe por vírgula.
              </p>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Ex: sistema, acesso, suporte (separadas por vírgula)"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tags para categorização. Separe por vírgula.
              </p>
            </div>

            <div>
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                placeholder="Digite o conteúdo completo do artigo. Use markdown para formatação (## títulos, **negrito**, etc.)"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suporte a Markdown: **negrito**, *itálico*, ## títulos, • listas, etc.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Artigo ativo (será exibido na busca)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
              <Save className="h-4 w-4 mr-2" />
              {editingArticle ? 'Atualizar' : 'Criar'} Artigo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

