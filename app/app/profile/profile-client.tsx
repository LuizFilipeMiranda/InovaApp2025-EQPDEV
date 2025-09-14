
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, Edit3, Save, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const roleLabels = {
  ADM: 'Administrador',
  TI: 'Tecnologia da Informação',
  SAC: 'Suporte ao Cliente',
  FINANCEIRO: 'Financeiro'
}

const roleColors = {
  ADM: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  TI: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  SAC: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  FINANCEIRO: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
}

export default function ProfileClient() {
  const { data: session } = useSession() || {}
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(session?.user?.name || '')

  const handleSave = () => {
    // In a real app, you would save the changes to the backend
    console.log('Saving profile changes:', { name: editedName })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(session?.user?.name || '')
    setIsEditing(false)
  }

  const userRole = (session?.user as any)?.role as keyof typeof roleLabels

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Perfil do Usuário</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de conta.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <CardTitle className="text-xl">
                {session?.user?.name || 'Usuário'}
              </CardTitle>
              <Badge className={`mx-auto mt-2 ${roleColors[userRole] || 'bg-gray-100 text-gray-800'}`}>
                {roleLabels[userRole] || 'Usuário'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{session?.user?.email || 'email@exemplo.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Nível: {roleLabels[userRole] || 'Usuário'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membro desde 2024</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm bg-muted rounded-md p-2 mt-1">
                      {session?.user?.name || 'Não informado'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <p className="text-sm bg-muted rounded-md p-2 mt-1">
                    {session?.user?.email || 'Não informado'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div>
                  <Label htmlFor="role">Função</Label>
                  <p className="text-sm bg-muted rounded-md p-2 mt-1">
                    {roleLabels[userRole] || 'Não informado'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A função é definida pelo administrador
                  </p>
                </div>

                <div>
                  <Label htmlFor="status">Status da Conta</Label>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Ativa
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sua conta está ativa e funcionando normalmente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Estatísticas da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">0</div>
                    <div className="text-sm text-muted-foreground">Chamados Criados</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <div className="text-sm text-muted-foreground">Chamados Resolvidos</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <div className="text-sm text-muted-foreground">Conversas no Chat</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
