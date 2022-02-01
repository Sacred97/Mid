export interface GuestOrderInterface {

    orderNumber: string,
    orderCost: number,
    orderWeight: number,
    contactFullName: string
    contactEmail: string
    contactPhone: string
    contactAdditionalPhone?: string
    customer: string,
    inn: string,
    company: string,
    kpp: string,
    companyAddress: string,
    paymentMethod: string,
    deliveryMethod: string,
    deliveryAddress: string

}
