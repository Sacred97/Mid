export function customerCreateString(customer: string,
                         requisites?: {company: string, inn: string, kpp?: string, companyAddress: string}): string {

    if (customer === 'Юр.лицо') {
        return 'Покупатель: \n' +
            'Организация - ' + requisites.company + ', \n' +
            'ИНН - ' + requisites.inn + ', \n' +
            'КПП - ' + (requisites.kpp ? requisites.kpp : 'Отсутствует') + ', \n' +
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
    return 'Контактные данные для связи: \n' +
        'ФИО - ' + fullName + ', \n' +
        'Телефон - ' + phone + ', \n' +
        'Email - ' + email  + (additionalPhone ?
        ', \n Доп. телефон - ' + additionalPhone : '') + '; \n' +
        customer +
        ' Способ оплаты: ' + payment + '; \n' +
        'Способ доставки: ' + delivery + '; \n'+
        'Адрес: ' + address + ';'
}

export function convertingNumbersToDigits (number: number) {
    return number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}
