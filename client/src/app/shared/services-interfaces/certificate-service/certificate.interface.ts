export interface CertificateInterface {
  id: number
  serialNumber: number
  url: string
}

export interface CertificatesAndCountInterface {
  certificates: CertificateInterface[],
  count: number
}
