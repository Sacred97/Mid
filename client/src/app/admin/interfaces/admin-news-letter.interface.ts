export interface AdminNewsLetter {
  id: number
  name: string
  subscriptions: AdminSubscriptions[]
}

export interface AdminSubscriptions {
  id: number
  email: string
}

export interface AdminUpdateNewsLetter {
  id: number
  name: string
}

export interface AdminSubscribers {
  id: number
  email: string
  newsLetter: {id: number, name: string}
  user: {id: number, email: string}
}
