export interface CharCodeInterface {
  start: number
  end: number
  exceptions: number[]
}

export interface SearchDetailInterface {

  id: string
  productCode: string
  name: string
  vendorCode: string
  price: number
  manufacturer: number | null

}

export interface LogisticIframe {
  src: string
  width: number
  height: number
  scrolling: string
  frameborder: number
}
