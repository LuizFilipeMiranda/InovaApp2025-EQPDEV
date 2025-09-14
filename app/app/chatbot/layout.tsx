
import AppLayout from '@/components/app-layout'

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout className="overflow-hidden">
      {children}
    </AppLayout>
  )
}
