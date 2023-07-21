export interface SubscriptionOfUserInterface {
  id: number
  email: string
  newsLetter: NewsLetterOfSubscriptionInterface[]
  notice: string
}

export interface NewsLetterOfSubscriptionInterface {
  id: number
  name: string
}
