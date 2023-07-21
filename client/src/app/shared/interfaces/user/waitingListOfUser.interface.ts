export interface WaitingListOfUserInterface {
  id: number
  emails: string
  waitingItem: {id:number, detail: {id: number}}
}
