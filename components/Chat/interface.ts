export interface ChatMessage {
  content: string
  role: ChatRole
  transactionHash?: string
}

export interface Persona {
  id?: string
  role: ChatRole
  avatar_url?: string
  name?: string
  prompt?: string
  key?: string
  description?: string
  isDefault?: boolean
}

export interface Chat {
  id: string
  persona?: Persona
  messages?: ChatMessage[]
  chatId?: number
}

export type ChatRole = 'assistant' | 'user' | 'system'
