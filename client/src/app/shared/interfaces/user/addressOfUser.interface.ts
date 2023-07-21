export interface AddressOfUserInterface {
  id: number
  deliveryMethod: string
  deliveryAddress: string
  transportCompany: string | null
  addressName: string
  isMain: boolean
}
