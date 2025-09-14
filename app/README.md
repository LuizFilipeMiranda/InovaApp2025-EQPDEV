
# 🎫 Case Flow - Sistema de Gerenciamento de Chamados

<p align="center">
  <img src="https://i.ytimg.com/vi/Ibq5dgjjtjI/maxresdefault.jpg" alt="Case Flow Logo" width="200"/>
</p>

<p align="center">
  <strong>Sistema profissional de gerenciamento de chamados com interface moderna e intuitiva</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Prisma-6-2d3748?style=flat-square&logo=prisma" alt="Prisma"/>
</p>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Contas de Teste](#-contas-de-teste)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **Case Flow** é um sistema completo de gerenciamento de chamados desenvolvido com tecnologias modernas. Foi projetado para empresas que precisam de uma solução eficiente para gerenciar tickets de suporte, com diferentes níveis de acesso e fluxos de trabalho organizados.

### ✨ Características Principais

- **Interface Moderna**: Design responsivo e intuitivo
- **Sistema de Roles**: Controle de acesso baseado em funções
- **Fluxo Kanban**: Visualização em colunas para melhor organização
- **Chatbot Integrado**: Criação de tickets via conversação natural
- **Animações Fluidas**: Experiência de usuário aprimorada
- **Sistema de Comentários**: Comunicação detalhada em cada ticket

## 🚀 Funcionalidades

### 👥 Gestão de Usuários
- **4 tipos de usuário**: Admin, TI, SAC, Financeiro
- **Autenticação segura** com NextAuth.js
- **Controle de permissões** granular por role

### 🎫 Gestão de Tickets
- **Dashboard Kanban** com 4 colunas: Novos, Em Progresso, Finalizados, Retornados
- **Criação de tickets** via chatbot inteligente
- **Sistema de prioridades**: Baixa, Média, Alta, Urgente
- **Categorização automática**: TI, SAC, Financeiro
- **Histórico completo** com comentários e logs

### 🤖 Chatbot Inteligente
- **Interpretação natural** de mensagens
- **Extração automática** de informações do ticket
- **Confirmação interativa** antes da criação
- **Interface conversacional** amigável

### 🔒 Funcionalidades Administrativas
- **Exclusão de tickets** (apenas admins)
- **Visão geral completa** de todos os chamados
- **Relatórios em tempo real** com estatísticas

### 📊 Analytics e Relatórios
- **Dashboard com métricas** em tempo real
- **Contadores por status** e categoria
- **Visualização gráfica** do fluxo de trabalho

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com SSR
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Framer Motion** - Animações e transições
- **Radix UI** - Componentes acessíveis

### Backend
- **Next.js API Routes** - Backend integrado
- **Prisma ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados principal
- **NextAuth.js** - Autenticação e autorização

### UI/UX
- **Shadcn/ui** - Sistema de componentes
- **Lucide React** - Ícones modernos
- **React Hook Form** - Gerenciamento de formulários
- **Date-fns** - Manipulação de datas

### DevTools
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior
- **Yarn** 1.22.x ou superior
- **PostgreSQL** 14.x ou superior
- **Git** para controle de versão

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/case-flow.git
cd case-flow/app
```

### 2. Instale as dependências
```bash
yarn install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

### 4. Configure o banco de dados
```bash
# Execute as migrações
yarn prisma migrate dev

# Seed inicial com dados de teste
yarn prisma db seed
```

### 5. Inicie o servidor de desenvolvimento
```bash
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/case_flow"

# NextAuth
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"

# LLM API (opcional - para chatbot)
ABACUSAI_API_KEY="sua-chave-api-aqui"
```

### Configuração do Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. O schema está em `prisma/schema.prisma`.

#### Modelos Principais:
- **User**: Usuários do sistema
- **Ticket**: Chamados/tickets
- **Comment**: Comentários nos tickets
- **ChatSession**: Sessões do chatbot
- **ChatMessage**: Mensagens do chat

## 📖 Como Usar

### 1. Acesso ao Sistema
Acesse `http://localhost:3000` e faça login com uma das contas de teste.

### 2. Dashboard Principal
- **Visão Kanban**: Veja todos os tickets organizados por status
- **Estatísticas**: Métricas em tempo real no topo
- **Filtros**: Por categoria, prioridade e responsável

### 3. Gestão de Tickets
- **Criar ticket**: Use o chatbot na seção correspondente
- **Aceitar ticket**: Clique em "Aceitar" nos tickets novos
- **Adicionar comentários**: Use a área de comentários
- **Finalizar**: Adicione um comentário obrigatório ao finalizar
- **Retornar**: Mova tickets finalizados de volta ao fluxo

### 4. Chatbot
- Acesse a seção "Chatbot" no menu
- Digite sua solicitação em linguagem natural
- Confirme os dados extraídos automaticamente
- O ticket será criado automaticamente

### 5. Funcionalidades de Admin
- **Excluir tickets**: Apenas admins podem excluir
- **Visualizar tudo**: Acesso completo a todos os chamados
- **Gerenciar usuários**: Controle de acesso

## 📁 Estrutura do Projeto

```
case-flow/app/
├── 📁 app/                     # App Router (Next.js 13+)
│   ├── 📁 api/                # API Routes
│   │   ├── 📁 auth/           # Autenticação
│   │   ├── 📁 tickets/        # Gestão de tickets
│   │   └── 📁 chatbot/        # Endpoints do chatbot
│   ├── 📁 dashboard/          # Dashboard principal
│   ├── 📁 chatbot/           # Interface do chatbot
│   ├── 📁 login/             # Página de login
│   └── 📄 layout.tsx         # Layout raiz
├── 📁 components/             # Componentes React
│   ├── 📁 ui/                # Componentes base (Shadcn)
│   ├── 📄 sidebar.tsx        # Menu lateral
│   ├── 📄 ticket-card.tsx    # Card do ticket
│   └── 📄 providers.tsx      # Context providers
├── 📁 lib/                   # Utilitários e configurações
│   ├── 📄 auth.ts           # Configuração NextAuth
│   ├── 📄 db.ts             # Cliente Prisma
│   └── 📄 utils.ts          # Funções utilitárias
├── 📁 prisma/               # Database schema e migrações
│   ├── 📄 schema.prisma     # Schema do banco
│   └── 📁 migrations/       # Migrações
├── 📁 public/               # Arquivos estáticos
├── 📁 styles/               # Estilos globais
└── 📄 package.json          # Dependências
```

## 🔗 API Endpoints

### Autenticação
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Sessão atual

### Tickets
- `GET /api/tickets` - Listar todos os tickets
- `POST /api/tickets` - Criar novo ticket
- `PUT /api/tickets/[id]` - Atualizar ticket
- `DELETE /api/tickets/[id]` - Excluir ticket (admin only)

### Comentários
- `POST /api/tickets/[id]/comments` - Adicionar comentário

### Chatbot
- `POST /api/chatbot/analyze-intent` - Analisar intenção
- `POST /api/chatbot/create-ticket` - Criar ticket via chat

## 👤 Contas de Teste

O sistema vem com contas pré-configuradas para teste:

| Role | Email | Senha | Permissões |
|------|-------|--------|------------|
| **Admin** | admin@admin.com | password | Acesso total + exclusão |
| **TI** | ti@empresa.com | password | Tickets de TI |
| **SAC** | sac@empresa.com | password | Tickets de SAC |
| **Financeiro** | financeiro@empresa.com | password | Tickets financeiros |

### Fluxo de Permissões
- **Admin**: Pode ver, editar e excluir qualquer ticket
- **TI/SAC/Financeiro**: Pode ver todos, mas só interagir com tickets da sua categoria
- **Criadores**: Podem comentar em seus próprios tickets

## 🎨 Temas e Personalização

O sistema suporta tema escuro/claro automático e pode ser personalizado através do Tailwind CSS:

- **Cores primárias**: Azul (#3B82F6)
- **Cores de status**: Verde, Laranja, Vermelho
- **Tipografia**: Sistema de fontes nativo
- **Responsividade**: Mobile-first design

## 🔄 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor de desenvolvimento
yarn build            # Build para produção
yarn start            # Inicia servidor de produção
yarn lint             # Executa linting

# Database
yarn prisma migrate dev    # Executa migrações
yarn prisma db seed       # Popula dados iniciais
yarn prisma studio       # Interface visual do banco
yarn prisma generate     # Gera cliente Prisma

# Testes
yarn test             # Executa testes (quando configurado)
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras plataformas
- **Netlify**: Suporte completo Next.js
- **Railway**: Deploy com PostgreSQL incluso
- **Heroku**: Com add-on PostgreSQL

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

### Padrões de Código
- Use **TypeScript** para tipagem
- Siga as regras do **ESLint**
- Documente funções complexas
- Teste suas mudanças

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte ou dúvidas:

- **Issues**: Use as issues do GitHub
- **Email**: suporte@caseflow.com
- **Documentação**: Consulte este README

## 🏆 Reconhecimentos

- **Next.js Team** - Framework incrível
- **Vercel** - Plataforma de deploy
- **Shadcn** - Sistema de componentes
- **Tailwind Labs** - Framework CSS
- **Prisma Team** - ORM fantástico

---

<p align="center">
  Feito com ❤️ pela equipe Case Flow
</p>

<p align="center">
  <a href="#-case-flow---sistema-de-gerenciamento-de-chamados">⬆️ Voltar ao topo</a>
</p>
