import {HttpErrorResponse} from "@angular/common/http";

export class TrackBy {
  static index(index: number): number {
    return index
  }
}

export function maxRatio(...value: number[]): number {
  const max = Math.max(...value)
  return max >= 0 ? max > 9 ? max : 5 : 0
}

export function toCurrency(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(price)
}

export function toFormatDate(date: string) {
  let correct = new Date(date)
  const options: Intl.DateTimeFormatOptions  = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }
  return correct.toLocaleString('ru', options)
}

export function errorHandler(error: HttpErrorResponse) {
  if (error.error.statusCode === 500) {
    return 'Соединение с сервером было разорвано, проверьте соединение с интернетом'
  } else {
    return 'Произошла какая-то ошибка, повторите действие заново. ' +
      'Если ошибка повторилась, просьба сообщить нам, мы устраним ее как можно скорее.'
  }
}
