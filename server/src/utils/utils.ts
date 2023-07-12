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

export function telegramMessageCreator(orderNumber: string, orderCost: number,
                                       {fullName, phone, email, additionalPhone,
                                           customer, payment, delivery, address}: commentType) {
    const api = 'https://api.telegram.org/bot6138554914:AAGfTnU2lPctBpD0aBVjYDk4Dn8A0tyoOG8/sendmessage?chat_id=412775877'
    let query = '?chat_id=412775877'

    let order = 'Заказ №' + orderNumber + '\n'
        + 'Сумма заказа: ' + convertingNumbersToDigits(orderCost) + '\n'
        + '\n'
        + 'Контактные данные для связи: \n'
        + 'ФИО - ' + fullName + '\n'
        + 'Телефон - ' + phone + '\n'
        + 'Email - ' + email + '\n'
        + (additionalPhone ? 'Доп. телефон - ' + additionalPhone + '\n\n' : '\n')
        + customer + '\n\n'
        + 'Способ оплаты: ' + payment + '\n'
        + 'Способ доставки: ' + delivery + '\n'
        + 'Адрес: ' + address

    order = encodeURI(order)
    order = order.replace(/[#]/g, '%23')

    query = query + '&text=' + order
    return api + query
}
