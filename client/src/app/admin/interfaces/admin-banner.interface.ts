export interface AdminBannerUpload {
    serialNumber: number
    homePage: boolean
    pageReference?: string
}

export interface AdminBannerUpdate {
    id: number
    serialNumber?: number
    homePage?: boolean
}

export interface BannerTest {
    id: number
    url: string
    serialNumber: number
    homePage: boolean
    pageReference?: string
}