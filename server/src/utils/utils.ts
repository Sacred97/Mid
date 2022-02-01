export function customerCreateString(customer: string,
                         requisites?: {company: string, inn: string, kpp: string, companyAddress: string}): string {

    if (customer === 'Юр.лицо') {
        return 'Покупатель: ' +
            'Организация - ' + requisites.company + ', ' +
            'ИНН - ' + requisites.inn + ', ' +
            'КПП - ' + requisites.kpp + ', ' +
            'Юр. адрес - ' + requisites.companyAddress + ';'
    } else if (customer === 'Физ.лицо') {
        return 'Покупатель: Физ.лицо;'
    }
}

type commentType = {
    fullName: string,
    phone: string,
    email: string,
    additionalPhone?: string,
    customer: string,
    payment: string,
    delivery: string,
    address: string
}

export function commentCreateString({fullName, phone, email, additionalPhone,
                                  customer, payment, delivery, address}: commentType): string {
    return 'Контактные данные для связи: ' +
        'ФИО - ' + fullName + ', ' +
        'Телефон - ' + phone + ', ' +
        'Email - ' + email + (additionalPhone ?
        ', Доп. телефон - ' + additionalPhone : '') + '; ' +
        customer +
        ' Способ оплаты: ' + payment + '; ' +
        'Способ доставки: ' + delivery + '; '+
        'Адрес: ' + address + ';'
}

export function convertingNumbersToDigits (number: number) {
    return number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}
