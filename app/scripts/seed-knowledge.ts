

import { PrismaClient, TicketCategory } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const knowledgeArticles = [
  // Artigos de TI
  {
    title: "Como Resetar Senha do Sistema",
    content: `## Como Resetar sua Senha

**Passo a passo:**

1. **Acesse a página de login** do sistema
2. **Clique em "Esqueci minha senha"** 
3. **Digite seu e-mail corporativo** cadastrado
4. **Verifique sua caixa de entrada** - você receberá um link em até 5 minutos
5. **Clique no link** recebido por e-mail
6. **Digite sua nova senha** (mínimo 8 caracteres, com letras e números)
7. **Confirme a nova senha** e clique em "Salvar"

**Importante:**
- A nova senha deve ter pelo menos 8 caracteres
- Use letras maiúsculas, minúsculas e números
- Não use senhas já utilizadas anteriormente

**Ainda com problemas?**
Se não receber o e-mail em 10 minutos, verifique a pasta de spam ou entre em contato com o suporte de TI.`,
    sector: "TI",
    keywords: ["resetar", "senha", "password", "esqueci", "login", "acesso", "email"],
    tags: ["senha", "login", "acesso", "email", "sistema"]
  },
  {
    title: "Problemas com Monitor - Não Liga ou Sem Imagem",
    content: `## Solucionando Problemas de Monitor

### **Monitor não liga:**
1. **Verifique a alimentação:** Certifique-se que o cabo de força está bem conectado
2. **Teste outro cabo:** Tente outro cabo de força se disponível
3. **Verifique o botão power:** Pressione firmemente o botão de ligar/desligar
4. **LED indicador:** Observe se há alguma luz indicativa (azul, verde ou vermelha)

### **Monitor liga mas não mostra imagem:**
1. **Verifique os cabos:** Certifique-se que o cabo HDMI/VGA/DisplayPort está bem conectado
2. **Teste outra entrada:** Se o monitor tem múltiplas entradas, teste outras (HDMI1, HDMI2, VGA)
3. **Reinicie o computador:** Às vezes é necessário reiniciar após conectar
4. **Teste com outro dispositivo:** Conecte um notebook para testar se o monitor funciona

### **Configurações importantes:**
- **Resolução recomendada:** 1920x1080 (Full HD) para monitores de 21" a 27"
- **Taxa de atualização:** 60Hz para uso geral, 144Hz para gaming
- **Brilho e contraste:** Ajuste conforme o ambiente

**Monitores disponíveis em nossa loja:**
- Monitores LED 21" a 32"
- Monitores Gaming até 240Hz
- Monitores Ultrawide 34"`,
    sector: "TI",
    keywords: ["monitor", "tela", "display", "imagem", "liga", "cabo", "hdmi", "vga", "resolucao"],
    tags: ["monitor", "hardware", "display", "cabo", "conectividade"]
  },
  {
    title: "Configuração de Mouse e Teclado",
    content: `## Configuração de Mouse e Teclado

### **Problemas com Mouse:**

**Mouse não funciona:**
1. **USB:** Conecte em outra porta USB
2. **Pilhas:** Se for wireless, verifique/troque as pilhas  
3. **Driver:** Vá em Configurações > Dispositivos > Mouse
4. **Superfície:** Use mousepad adequado (evite vidro ou superfícies reflexivas)

**Configurações do Mouse:**
- **Velocidade do cursor:** Configurações > Dispositivos > Mouse > Velocidade adicional do ponteiro
- **Botões:** Configurações > Dispositivos > Mouse > Selecionar botão principal
- **Roda do mouse:** Ajustar quantas linhas rolar por vez

### **Problemas com Teclado:**

**Teclado não funciona:**
1. **Conexão:** Verifique se está bem conectado (USB ou PS/2)
2. **Wireless:** Troque pilhas e verifique receptor USB
3. **Num Lock:** Certifique-se que está ativado para números
4. **Idioma:** Verifique layout (ABNT2 para português)

**Atalhos úteis:**
- **Windows + L:** Bloquear tela
- **Ctrl + C:** Copiar
- **Ctrl + V:** Colar
- **Alt + Tab:** Alternar entre programas

### **Produtos em nossa loja:**
- **Mouse:** Óptico, Laser, Gaming, Ergonômico
- **Teclado:** Mecânico, Membrane, Gaming, Sem fio
- **Combo:** Mouse + Teclado sem fio`,
    sector: "TI",
    keywords: ["mouse", "teclado", "keyboard", "wireless", "usb", "driver", "configuracao", "atalho"],
    tags: ["mouse", "teclado", "perifericos", "configuracao", "hardware"]
  },

  // Artigos de SAC
  {
    title: "Política de Garantia e Troca de Produtos",
    content: `## Política de Garantia

### **Prazo de Garantia:**
- **Monitores:** 12 meses
- **Mouse e Teclado:** 6 meses  
- **Cabos e Acessórios:** 3 meses
- **Produtos Gaming:** 24 meses (linha premium)

### **Cobertura da Garantia:**
✅ **Coberto:**
- Defeitos de fabricação
- Mau funcionamento sem causa externa
- Problemas elétricos internos
- Desgaste normal dos componentes

❌ **Não coberto:**
- Danos por queda ou impacto
- Danos por líquidos
- Uso inadequado ou sobrecarga
- Modificações não autorizadas

### **Como solicitar garantia:**
1. **Entre em contato** através do SAC ou site
2. **Envie a nota fiscal** e fotos do problema
3. **Aguarde análise** (até 2 dias úteis)
4. **Autorização concedida:** Envie o produto via Correios
5. **Reparo ou troca:** Até 30 dias úteis

### **Troca por Arrependimento:**
- **Prazo:** 7 dias após recebimento
- **Condições:** Produto lacrado/novo, com nota fiscal
- **Frete:** Por conta do cliente
- **Reembolso:** Até 10 dias úteis após recebimento

**Importante:** Guarde sempre a nota fiscal e embalagem original.`,
    sector: "SAC",
    keywords: ["garantia", "troca", "defeito", "nota fiscal", "reparo", "reembolso", "prazo"],
    tags: ["garantia", "troca", "política", "defeito", "devolução"]
  },
  {
    title: "Como Fazer uma Reclamação ou Sugestão",
    content: `## Canal de Atendimento ao Cliente

### **Canais disponíveis:**

📧 **E-mail:** sac@empresa.com.br
📞 **Telefone:** 0800-123-4567 (segunda a sexta, 8h às 18h)
💬 **Chat online:** Através do site (8h às 17h)
📱 **WhatsApp:** (11) 99999-9999 (8h às 17h)

### **Para fazer uma reclamação:**

1. **Reúna as informações:**
   - Número do pedido
   - Nota fiscal
   - Descrição detalhada do problema
   - Fotos (se aplicável)

2. **Escolha o canal** de sua preferência

3. **Aguarde resposta:**
   - E-mail: até 24h
   - Telefone: imediato
   - Chat/WhatsApp: até 30 minutos

### **Para sugestões:**
Adoramos feedback! Envie suas sugestões de:
- Novos produtos
- Melhorias no atendimento  
- Funcionalidades do site
- Experiência de compra

### **Acompanhamento:**
- Toda reclamação recebe um **número de protocolo**
- Você pode acompanhar pelo site na seção "Meus Protocolos"
- Enviaremos updates por e-mail sobre o andamento

### **Nosso compromisso:**
🎯 **Primeira resposta:** Até 24h
🔄 **Resolução média:** 3 dias úteis  
📊 **Satisfação:** Meta de 95% de clientes satisfeitos

**Sua opinião é muito importante para nós!**`,
    sector: "SAC",
    keywords: ["reclamacao", "sugestao", "sac", "atendimento", "protocolo", "telefone", "email", "chat"],
    tags: ["atendimento", "reclamação", "sugestão", "contato", "protocolo"]
  },
  {
    title: "Política de Entrega e Prazos",
    content: `## Informações sobre Entrega

### **Prazos de Entrega:**

**📍 Região Sudeste:**
- Capitais: 1-2 dias úteis
- Interior: 2-4 dias úteis

**📍 Região Sul/Nordeste:**  
- Capitais: 2-3 dias úteis
- Interior: 3-5 dias úteis

**📍 Região Norte/Centro-Oeste:**
- Capitais: 3-5 dias úteis  
- Interior: 5-8 dias úteis

### **Modalidades de Entrega:**

🚚 **Frete Grátis:**
- Compras acima de R$ 199,00
- Prazo normal de entrega
- Rastreamento incluído

⚡ **Entrega Expressa:**
- Até 1 dia útil (regiões metropolitanas)
- Taxa adicional de R$ 25,00
- Disponível até 15h para envio no mesmo dia

🏪 **Retirada na Loja:**
- Gratuita
- Disponível em 2h após confirmação do pagamento
- Horário: Segunda a sexta 8h-18h, Sábado 8h-13h

### **Rastreamento:**
- Código de rastreamento enviado por e-mail
- Acompanhe no site dos Correios ou transportadora
- Notificações automáticas de status

### **Importante:**
- Confira sempre o endereço de entrega
- Alguém deve estar presente para receber
- Guarde a embalagem por 7 dias (garantia)
- Em caso de avaria, recuse a entrega e nos contate

**Entregas apenas em dias úteis, exceto frete expresso.**`,
    sector: "SAC",
    keywords: ["entrega", "frete", "prazo", "rastreamento", "correios", "transportadora", "gratis", "expressa"],
    tags: ["entrega", "frete", "prazo", "logística", "rastreamento"]
  },

  // Artigos de FINANCEIRO
  {
    title: "Como Solicitar Reembolso",
    content: `## Processo de Reembolso

### **Quando solicitar:**
- Produto com defeito fora do prazo de troca
- Cobrança indevida
- Cancelamento de pedido autorizado
- Devolução por arrependimento

### **Documentos necessários:**
📄 **Obrigatórios:**
- Nota fiscal original
- CPF/CNPJ do comprador  
- Dados bancários (conta corrente ou poupança)
- Comprovante de devolução do produto (se aplicável)

### **Como solicitar:**

1. **Acesse** "Minha Conta" no site
2. **Vá em** "Solicitar Reembolso"  
3. **Preencha** o formulário com:
   - Número do pedido
   - Motivo do reembolso
   - Valor solicitado
   - Dados bancários

4. **Anexe** os documentos necessários
5. **Aguarde** análise (até 5 dias úteis)

### **Prazos:**
⏱️ **Análise:** 3-5 dias úteis
💰 **Crédito na conta:** 5-10 dias úteis após aprovação
🔄 **Estorno no cartão:** 1-2 faturas (conforme operadora)

### **Formas de reembolso:**
- **Transferência bancária:** Mais rápida
- **Estorno no cartão:** Aparece na próxima fatura
- **PIX:** Disponível para valores até R$ 5.000

### **Acompanhamento:**
- Status em tempo real na sua conta
- E-mail com atualizações automáticas
- Número de protocolo para consultas

**Valores parciais podem ser reembolsados (ex: frete quando produto tem defeito).**`,
    sector: "FINANCEIRO",
    keywords: ["reembolso", "devolucao", "estorno", "dinheiro", "conta", "cartao", "pix", "transferencia"],
    tags: ["reembolso", "devolução", "financeiro", "pagamento", "estorno"]
  },
  {
    title: "Formas de Pagamento e Parcelamento",
    content: `## Opções de Pagamento

### **💳 Cartão de Crédito:**
- **Bandeiras aceitas:** Visa, Mastercard, Elo, American Express
- **Parcelamento:** Até 12x sem juros*
- **Aprovação:** Imediata na maioria dos casos
- **Segurança:** Certificado SSL e antifraude

### **💰 Cartão de Débito:**  
- **Bandeiras:** Visa Débito, Mastercard Débito
- **Aprovação:** Imediata
- **Desconto:** 5% para pagamento à vista no débito

### **📱 PIX:**
- **Desconto:** 8% para pagamento via PIX  
- **Aprovação:** Imediata
- **Disponível:** 24/7
- **Limite:** Até R$ 20.000 por transação

### **🧾 Boleto Bancário:**
- **Prazo:** 3 dias úteis para pagamento
- **Desconto:** 3% para pagamento à vista
- **Vencimento:** Após vencimento, gere novo boleto

### **💸 Parcelamento:**

**Sem Juros:**
- 2x a 6x: Todos os produtos  
- 7x a 12x: Compras acima de R$ 500

**Com Juros:**
- 13x a 18x: Taxa de 2,99% ao mês
- 19x a 24x: Taxa de 3,99% ao mês

### **🛡️ Segurança:**
- Site certificado SSL
- Dados não armazenados  
- Sistema antifraude 24/7
- Conformidade com PCI DSS

**Sua compra é 100% segura e garantida!**

*Parcelamento sem juros sujeito à análise de crédito.`,
    sector: "FINANCEIRO",
    keywords: ["pagamento", "cartao", "pix", "boleto", "parcelamento", "juros", "desconto", "debito"],
    tags: ["pagamento", "cartão", "pix", "boleto", "parcelamento", "financeiro"]
  },
  {
    title: "Dúvidas sobre Cobrança e Fatura",
    content: `## Esclarecimentos sobre Cobrança

### **📋 Entendendo sua fatura:**

**Valores que podem aparecer:**
- **Produto:** Valor unitário x quantidade
- **Frete:** Calculado por peso e distância  
- **Desconto:** Cupons, promoções, pagamento à vista
- **Juros:** Se parcelamento com juros
- **Seguro:** Opcional para produtos acima de R$ 1.000

### **❓ Dúvidas comuns:**

**"Não reconheço esta cobrança"**
- Verifique se não foi compra de familiar
- Confira o CNPJ: 12.345.678/0001-90
- Nome fantasia: TechPro Equipamentos

**"Valor diferente do site"**  
- Preços podem variar entre sessões
- Frete não incluído no valor do produto
- Promoção pode ter expirado

**"Cobrança em duplicidade"**
- Entre em contato imediatamente  
- Estorno automático em até 5 dias úteis
- Guarde comprovantes

### **🔍 Como contestar:**

1. **Acesse** sua conta no site
2. **Vá em** "Minhas Compras"  
3. **Clique** em "Contestar Cobrança"
4. **Descreva** o motivo detalhadamente
5. **Anexe** comprovantes (se houver)

### **📞 Contato Financeiro:**
- **E-mail:** financeiro@empresa.com.br
- **Telefone:** 0800-123-4567 (opção 2)
- **Horário:** Segunda a sexta, 8h às 17h

### **⏱️ Prazos:**
- **Resposta:** Até 2 dias úteis
- **Resolução:** Até 7 dias úteis  
- **Estorno:** Até 10 dias úteis (se procedente)

**Mantemos total transparência em nossas cobranças!**`,
    sector: "FINANCEIRO",
    keywords: ["cobranca", "fatura", "valor", "preco", "contestar", "duplicidade", "desconto", "juros"],
    tags: ["cobrança", "fatura", "contestação", "valor", "financeiro"]
  }
]

async function seedKnowledgeArticles() {
  try {
    console.log('🌱 Iniciando seed da base de conhecimento...')

    // Busca um usuário admin para ser o criador dos artigos
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADM'
      }
    })

    if (!adminUser) {
      console.error('❌ Nenhum usuário admin encontrado. Execute o seed principal primeiro.')
      return
    }

    console.log(`👤 Usando admin: ${adminUser.name} (${adminUser.email})`)

    // Limpa artigos existentes
    await prisma.knowledgeArticle.deleteMany()
    console.log('🧹 Artigos existentes removidos')

    // Cria os novos artigos
    for (const article of knowledgeArticles) {
      await prisma.knowledgeArticle.create({
        data: {
          ...article,
          sector: article.sector as TicketCategory,
          createdBy: adminUser.id
        }
      })
      console.log(`✅ Criado: ${article.title}`)
    }

    console.log(`🎉 Seed concluído! ${knowledgeArticles.length} artigos criados.`)

    // Estatísticas
    const stats = await prisma.knowledgeArticle.groupBy({
      by: ['sector'],
      _count: {
        id: true
      }
    })

    console.log('\n📊 Estatísticas:')
    stats.forEach(stat => {
      console.log(`   ${stat.sector}: ${stat._count.id} artigos`)
    })

  } catch (error) {
    console.error('❌ Erro no seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executa o seed se chamado diretamente
if (require.main === module) {
  seedKnowledgeArticles()
}

export default seedKnowledgeArticles

