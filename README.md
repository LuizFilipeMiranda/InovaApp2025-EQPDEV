
# 🎯 Case Flow - Sistema Avançado de Gerenciamento de Chamados

Sistema profissional de gerenciamento de chamados baseado no design Figma, desenvolvido com Next.js 14, TypeScript e tecnologias modernas. Oferece uma experiência completa de gestão de tickets com chatbot inteligente, dashboard interativo e controle de acesso por níveis.

## ✨ Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Login seguro com NextAuth.js
- Controle de acesso baseado em roles (Admin, IT, SAC, Financeiro)
- Middleware de proteção de rotas
- Gerenciamento de sessões otimizado

### 📊 **Dashboard Interativo**
- **4 Colunas de Kanban**:
  - 📋 Novos Chamados
  - 🔄 Em Andamento  
  - ⏸️ Aguardando
  - ✅ Finalizados
- **Ação "Call"**: Move chamados automaticamente para "Em Andamento"
- **Animações suaves** para interações de usuário
- **Filtros avançados** por categoria, prioridade e status
- **Responsivo** para todos os dispositivos

### 🤖 **Chatbot Inteligente com IA**
- **Criação Automática de Tickets**:
  - Interpretação inteligente de mensagens
  - Análise de intenção com IA
  - Extração automática de título, descrição, categoria e prioridade
  - Fluxo de confirmação interativo
- **Interface Responsiva**:
  - Histórico de conversas (desktop)
  - Chat otimizado para mobile
  - Experiência fluida em todos os dispositivos
- **Integração com Dashboard**: Tickets criados aparecem automaticamente

### 🎫 **Gerenciamento Completo de Tickets**
- **Criação via Chatbot**: Sistema inteligente de interpretação
- **Visualização por Status**: Organização em colunas Kanban
- **Comentários e Atualizações**: Sistema de notas e progresso
- **Exclusão Controlada**: Apenas administradores podem deletar
- **Histórico Completo**: Rastreamento de todas as ações

### 👥 **Controle de Acesso Multi-Nível**

#### 🔧 **Admin**
- ✅ Acesso total ao sistema
- ✅ Gerenciar todos os chamados
- ✅ Deletar chamados
- ✅ Visualizar relatórios completos
- ✅ Configurações do sistema

#### 💻 **IT (Técnico)**
- ✅ Gerenciar chamados de TI
- ✅ Atualizar status e comentários
- ✅ Visualizar dashboard de TI
- ❌ Não pode deletar chamados

#### 📞 **SAC (Atendimento)**
- ✅ Gerenciar chamados de atendimento
- ✅ Criar e atualizar tickets de clientes
- ✅ Acessar histórico de atendimentos
- ❌ Acesso limitado a chamados SAC

#### 💰 **Financeiro**
- ✅ Gerenciar chamados financeiros
- ✅ Processar reembolsos e pagamentos
- ✅ Visualizar relatórios financeiros
- ❌ Acesso limitado ao departamento

### 📱 **Design Responsivo**
- **Mobile-First**: Interface otimizada para dispositivos móveis
- **Sidebar Adaptável**: Menu que se retrai automaticamente em mobile
- **Chat Responsivo**: Histórico oculto em dispositivos pequenos
- **Experiência Consistente**: Funciona perfeitamente em qualquer tela

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Shadcn/UI** - Componentes modernos
- **Lucide Icons** - Ícones vetoriais

### **Backend & Database**
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação completa
- **API Routes** - Endpoints RESTful

### **IA & Chat**
- **Abacus.AI** - Processamento de linguagem natural
- **Streaming API** - Respostas em tempo real
- **Intent Recognition** - Análise inteligente de intenções

### **DevOps & Deployment**
- **Vercel/Railway** - Deploy automatizado
- **Environment Variables** - Configuração segura
- **Middleware** - Proteção de rotas

## 🚀 Instalação e Configuração

### **Pré-requisitos**
```bash
Node.js 18+
PostgreSQL
Yarn ou NPM
```

### **1. Clonagem e Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd case_flow

# Entre na pasta da aplicação
cd app

# Instale as dependências
yarn install
```

### **2. Configuração do Banco de Dados**
```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Configure sua DATABASE_URL no .env:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/case_flow"

# Execute as migrações
yarn prisma migrate dev

# Gere o cliente Prisma
yarn prisma generate

# Popule o banco com dados iniciais
yarn prisma db seed
```

### **3. Variáveis de Ambiente**
Configure no arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/case_flow"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"

# Abacus AI (para chatbot)
ABACUSAI_API_KEY="sua-chave-aqui"
```

### **4. Execução**
```bash
# Desenvolvimento
yarn dev

# Produção
yarn build
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

## 👤 Contas de Teste

### **Administrador**
- **Email**: `admin@caseflow.com`
- **Senha**: `admin123`
- **Permissões**: Acesso total

### **Técnico IT**
- **Email**: `it@caseflow.com`
- **Senha**: `it123`
- **Permissões**: Chamados de TI

### **Atendimento SAC**
- **Email**: `sac@caseflow.com`
- **Senha**: `sac123`
- **Permissões**: Chamados de clientes

### **Financeiro**
- **Email**: `financeiro@caseflow.com`
- **Senha**: `financeiro123`
- **Permissões**: Chamados financeiros

## 📁 Estrutura do Projeto

```
case_flow/
├── app/                          # Pasta principal da aplicação
│   ├── app/                      # App Router do Next.js
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/            # Autenticação
│   │   │   ├── chat/            # Chatbot endpoint
│   │   │   ├── chatbot/         # IA e criação de tickets
│   │   │   └── tickets/         # CRUD de tickets
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── chatbot/            # Interface do chatbot
│   │   ├── login/              # Página de login
│   │   ├── profile/            # Perfil do usuário
│   │   └── settings/           # Configurações
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── sidebar.tsx         # Menu lateral
│   │   └── app-layout.tsx      # Layout principal
│   ├── lib/                    # Utilitários
│   │   ├── auth.ts            # Configuração NextAuth
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── utils.ts           # Funções auxiliares
│   ├── prisma/                 # Schema e migrações
│   │   ├── schema.prisma       # Modelo do banco
│   │   └── seed.ts            # Dados iniciais
│   └── middleware.ts           # Proteção de rotas
└── README.md                   # Este arquivo
```

## 🔄 Fluxo de Trabalho dos Chamados

### **1. Criação via Chatbot**
1. Usuário inicia conversa no chatbot
2. Descreve o problema naturalmente
3. IA interpreta e extrai informações
4. Sistema sugere categoria e prioridade
5. Usuário confirma a criação
6. Ticket aparece automaticamente no dashboard

### **2. Processamento no Dashboard**
1. **Novos Chamados**: Tickets recém-criados
2. **Call Action**: Admin/Técnico move para "Em Andamento"
3. **Aguardando**: Para tickets que dependem de terceiros
4. **Finalizados**: Chamados resolvidos

### **3. Colaboração**
- Comentários em tempo real
- Atualizações de status
- Notificações automáticas
- Histórico completo de ações

## 🎨 Recursos de Design

### **Interface Moderna**
- Design baseado no Figma fornecido
- Paleta de cores consistente
- Tipografia otimizada
- Microinterações suaves

### **Acessibilidade**
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado
- Textos descritivos

### **Performance**
- Lazy loading de componentes
- Otimização de imagens
- Caching inteligente
- Bundle size otimizado

## 🚀 APIs Principais

### **Autenticação**
```bash
POST /api/auth/signin      # Login
POST /api/auth/signout     # Logout
GET  /api/auth/session     # Sessão atual
```

### **Tickets**
```bash
GET    /api/tickets        # Listar tickets
POST   /api/tickets        # Criar ticket
PUT    /api/tickets/[id]   # Atualizar ticket
DELETE /api/tickets/[id]   # Deletar ticket (admin)
```

### **Chatbot**
```bash
POST /api/chat                    # Conversa normal
POST /api/chatbot/analyze-intent  # Analisar intenção
POST /api/chatbot/create-ticket   # Criar ticket via IA
```

### **Comentários**
```bash
GET  /api/tickets/[id]/comments   # Listar comentários
POST /api/tickets/[id]/comments   # Criar comentário
```

## 🧪 Testando a Aplicação

### **1. Teste Manual**
1. Faça login com uma das contas teste
2. Explore o dashboard e mova tickets
3. Use o chatbot para criar novos chamados
4. Teste a responsividade em diferentes dispositivos

### **2. Funcionalidades do Chatbot**
```text
Exemplos de comandos para teste:
- "Quero fazer um chamado sobre problema na impressora"
- "Preciso abrir um chamado para reembolso"
- "Quero fazer um chamado sobre sistema fora do ar"
```

### **3. Teste de Responsividade**
- Desktop: Todas as funcionalidades visíveis
- Tablet: Layout adaptado com sidebar retrátil
- Mobile: Chat sem histórico, interface otimizada

## 🔧 Personalização

### **Cores e Tema**
Edite `tailwind.config.js` para personalizar:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Azul principal
      secondary: '#6366F1',   // Azul secundário
      accent: '#8B5CF6',      // Roxo de destaque
    }
  }
}
```

### **Adicionando Novos Departamentos**
1. Atualize o enum no `schema.prisma`
2. Execute `yarn prisma migrate dev`
3. Atualize os filtros no dashboard
4. Configure permissões no `auth.ts`

### **Customizando o Chatbot**
Edite `/api/chatbot/analyze-intent` para:
- Adicionar novas categorias
- Modificar lógica de priorização
- Integrar outros serviços de IA

## 🐛 Solução de Problemas

### **Erro de Conexão com Banco**
```bash
# Verifique se o PostgreSQL está rodando
sudo service postgresql start

# Teste a conexão
yarn prisma studio
```

### **Problemas de Autenticação**
```bash
# Regenere o NEXTAUTH_SECRET
openssl rand -base64 32

# Limpe o cache do NextAuth
rm -rf .next
yarn dev
```

### **Chatbot não Responde**
1. Verifique a `ABACUSAI_API_KEY`
2. Confirme a conectividade com a API
3. Analise os logs no console

## 📊 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Relatórios avançados com gráficos
- [ ] Notificações push em tempo real
- [ ] Integração com email (SMTP)
- [ ] Sistema de anexos para tickets
- [ ] Dashboard analytics
- [ ] Exportação de dados
- [ ] API webhooks
- [ ] Aplicativo mobile nativo

### **Otimizações Técnicas**
- [ ] Cache Redis para performance
- [ ] CDN para assets estáticos
- [ ] Testes automatizados (Jest/Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento de logs
- [ ] Backup automatizado

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: support@caseflow.com
- **Documentation**: [Wiki do Projeto](wiki-link)
- **Issues**: [GitHub Issues](issues-link)

---

**Case Flow** - Sistema Profissional de Gerenciamento de Chamados
Desenvolvido com ❤️ usando Next.js, TypeScript e tecnologias modernas.
