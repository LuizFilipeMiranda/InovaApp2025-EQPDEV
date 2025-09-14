
export interface User {
  id: string
  name: string | null
  email: string
  role: 'ADM' | 'TI' | 'SAC' | 'FINANCEIRO'
  image?: string | null
}

export interface Session {
  user: User
  expires: string
}
