
import AppLayout from '@/components/app-layout'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout className="overflow-y-auto">
      {children}
    </AppLayout>
  )
}
