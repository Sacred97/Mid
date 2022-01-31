import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss']
})
export class CityModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>()

  // @ts-ignore
  @ViewChild('searchInputElement') inputEl: ElementRef

  city: {city: string, cityTo: string, startLetter?: string}[] = [
    {city: 'А', cityTo: 'А', startLetter: 'А'},
    {city: 'Абакан', cityTo: 'Абакан'},
    {city: 'Адлер', cityTo: 'Адлер'},
    {city: 'Архангельск', cityTo: 'Архангельск'},
    {city: 'Астрахань', cityTo: 'Астрахань'},
    {city: 'Б', cityTo: 'Б', startLetter: 'Б'},
    {city: 'Балаково', cityTo: 'Балаково'},
    {city: 'Барнаул', cityTo: 'Барнаул'},
    {city: 'Белгород', cityTo: 'Белгород'},
    {city: 'Бийск', cityTo: 'Бийск'},
    {city: 'Благовещенск', cityTo: 'Благовещенск'},
    {city: 'Братск', cityTo: 'Братск'},
    {city: 'Брянск', cityTo: 'Брянск'},
    {city: 'Бугульма', cityTo: 'Бугульму'},
    {city: 'В', cityTo: 'Б', startLetter: 'В'},
    {city: 'Великие Луки', cityTo: 'Великие Луки'},
    {city: 'Великий Новгород', cityTo: 'Великий Новгород'},
    {city: 'Владивосток', cityTo: 'Владивосток'},
    {city: 'Владимир', cityTo: 'Владимир'},
    {city: 'Волгоград', cityTo: 'Волгоград'},
    {city: 'Волгодонск', cityTo: 'Волгодонск'},
    {city: 'Волжский', cityTo: 'Волжский'},
    {city: 'Вологда', cityTo: 'Вологду'},
    {city: 'Воронеж', cityTo: 'Воронеж'},
    {city: 'Д', cityTo: 'Д', startLetter: 'Д'},
    {city: 'Дзержинск', cityTo: 'Дзержинск'},
    {city: 'Димитровград', cityTo: 'Димитровград'},
    {city: 'Е', cityTo:'Е', startLetter: 'Е'},
    {city: 'Екатеринбург', cityTo: 'Екатеринбург'},
    {city: 'Ж', cityTo:'Ж', startLetter: 'Ж'},
    {city: 'Железнодорожный', cityTo: 'Железнодорожный'},
    {city: 'З', cityTo:'З', startLetter: 'З'},
    {city: 'Забайкальск', cityTo: 'Забайкальск'},
    {city: 'И', cityTo:'И', startLetter: 'И'},
    {city: 'Иваново', cityTo: 'Иваново'},
    {city: 'Ижевск', cityTo: 'Ижевск'},
    {city: 'Иркутск', cityTo: 'Иркутск'},
    {city: 'Й', cityTo:'Й', startLetter: 'Й'},
    {city: 'Йошкар-Ола', cityTo: 'Йошкар-Олу'},
    {city: 'К', cityTo:'К', startLetter: 'К'},
    {city: 'Казань', cityTo: 'Казань'},
    {city: 'Калининград', cityTo: 'Калининград'},
    {city: 'Калуга', cityTo: 'Калугу'},
    {city: 'Камышин', cityTo: 'Камышино'},
    {city: 'Кемерово', cityTo: 'Кемерово'},
    {city: 'Киров', cityTo: 'Киров'},
    {city: 'Коломна', cityTo: 'Коломну'},
    {city: 'Кострома', cityTo: 'Кострому'},
    {city: 'Котлас', cityTo: 'Котлас'},
    {city: 'Краснодар', cityTo: 'Краснодар'},
    {city: 'Красноярск', cityTo: 'Красноярск'},
    {city: 'Курган', cityTo: 'Курган'},
    {city: 'Курск', cityTo: 'Курск'},
    {city: 'Л', cityTo: 'Л', startLetter: 'Л'},
    {city: 'Липецк', cityTo: 'Липецк'},
    {city: 'М', cityTo: 'М', startLetter: 'М'},
    {city: 'Магнитогорск', cityTo: 'Магнитогорск'},
    {city: 'Миасс', cityTo: 'Миасс'},
    {city: 'Москва', cityTo: 'Москву'},
    {city: 'Мурманск', cityTo: 'Мурманск'},
    {city: 'Н', cityTo: 'Н', startLetter: 'Н'},
    {city: 'Набережные Челны', cityTo: 'Набережные Челны'},
    {city: 'Нижневартовск', cityTo: 'Нижневартовск'},
    {city: 'Нижний Новгород', cityTo: 'Нижний Новгород'},
    {city: 'Нижний Тагил', cityTo: 'Нижний Тагил'},
    {city: 'Новокузнецк', cityTo: 'Новокузнецк'},
    {city: 'Новомосковск', cityTo: 'Новомосковск'},
    {city: 'Новороссийск', cityTo: 'Новороссийск'},
    {city: 'Новосибирск', cityTo: 'Новосибирск'},
    {city: 'Ногинск', cityTo: 'Ногинск'},
    {city: 'О', cityTo: 'О', startLetter: 'О'},
    {city: 'Обнинск', cityTo: 'Обнинск'},
    {city: 'Омск', cityTo: 'Омск'},
    {city: 'Орел', cityTo: 'Орел'},
    {city: 'Оренбург', cityTo: 'Оренбург'},
    {city: 'Орск', cityTo: 'Орск'},
    {city: 'П', cityTo: 'П', startLetter: 'П'},
    {city: 'Пенза', cityTo: 'Пензу'},
    {city: 'Пермь', cityTo: 'Пермь'},
    {city: 'Петрозаводск', cityTo: 'Петрозаводск'},
    {city: 'Подольск', cityTo: 'Подольск'},
    {city: 'Псков', cityTo: 'Псков'},
    {city: 'Пушкино', cityTo: 'Пушкино'},
    {city: 'Р', cityTo: 'Р', startLetter: 'Р'},
    {city: 'Ростов-на-Дону', cityTo: 'Ростов-на-Дону'},
    {city: 'Рыбинск', cityTo: 'Рыбинск'},
    {city: 'Рязань', cityTo: 'Рязань'},
    {city: 'С', cityTo: 'С', startLetter: 'С'},
    {city: 'Самара', cityTo: 'Самару'},
    {city: 'Санкт-Петербург', cityTo: 'Санкт-Петербург'},
    {city: 'Саранск', cityTo: 'Саранск'},
    {city: 'Саратов', cityTo: 'Саратов'},
    {city: 'Северодвинск', cityTo: 'Северодвинск'},
    {city: 'Серпухов', cityTo: 'Серпухов'},
    {city: 'Смоленск', cityTo: 'Смоленск'},
    {city: 'Солнечногорск', cityTo: 'Солнечногорск'},
    {city: 'Сочи', cityTo: 'Сочи'},
    {city: 'Ставрополь', cityTo: 'Ставрополь'},
    {city: 'Старый Оскол', cityTo: 'Старый Оскол'},
    {city: 'Стерлитамак', cityTo: 'Стерлитамак'},
    {city: 'Сургут', cityTo: 'Сургут'},
    {city: 'Сызрань', cityTo: 'Сызрань'},
    {city: 'Сыктывкар', cityTo: 'Сыктывкар'},
    {city: 'Т', cityTo: 'Т', startLetter: 'Т'},
    {city: 'Тамбов', cityTo: 'Тамбов'},
    {city: 'Тверь', cityTo: 'Тверь'},
    {city: 'Тольятти', cityTo: 'Тольятти'},
    {city: 'Томилино', cityTo: 'Томилино'},
    {city: 'Томск', cityTo: 'Томск'},
    {city: 'Тула', cityTo: 'Тулу'},
    {city: 'Тюмень', cityTo: 'Тюмень'},
    {city: 'У', cityTo: 'У', startLetter: 'У'},
    {city: 'Улан-Удэ', cityTo: 'Улан-Удэ'},
    {city: 'Ульяновск', cityTo: 'Ульяновск'},
    {city: 'Уфа', cityTo: 'Уфу'},
    {city: 'Ухта', cityTo: 'Ухту'},
    {city: 'Х', cityTo: 'Х', startLetter: 'Х'},
    {city: 'Хабаровск', cityTo: 'Хабаровск'},
    {city: 'Ч', cityTo: 'Ч', startLetter: 'Ч'},
    {city: 'Чебоксары', cityTo: 'Чебоксары'},
    {city: 'Челябинск', cityTo: 'Челябинск'},
    {city: 'Череповец', cityTo: 'Череповец'},
    {city: 'Чита', cityTo: 'Читу'},
    {city: 'Э', cityTo: 'Э', startLetter: 'Э'},
    {city: 'Энгельс', cityTo: 'Энгельс'},
    {city: 'Я', cityTo: 'Я', startLetter: 'Я'},
    {city: 'Ярославль', cityTo: 'Ярославль'}
  ]

  resultSearch: {city: string, cityTo: string, startLetter?: string}[] = []

  getCity: {city: string, cityTo: string} = localStorage.getItem('city')?
    JSON.parse(localStorage.getItem('city')!):{city: 'Выберите город', cityTo: 'Ваш город'}

  constructor() { }

  ngOnInit(): void {
    // const fil = this.city.filter(item => item.city.toLocaleLowerCase().includes('Вел'.toLocaleLowerCase()))
    // console.log(fil);
  }

  chooseCity(city: string, cityTo: string) {
    localStorage.setItem('city', JSON.stringify({city: city, cityTo: cityTo}))
    this.close.emit()
  }

  searchCity(event: Event) {
    const queryString: string = (event.target as HTMLInputElement).value
    if (!queryString) {
      this.resultSearch = []
      return
    }
    const result: {city: string, cityTo: string, startLetter?: string}[] =
      this.city.filter(item => item.city.toLocaleLowerCase().includes(queryString.toLocaleLowerCase()))
    if (result.length >= 10) {
      this.resultSearch = result.slice(0, 11)
    } else {
      this.resultSearch = result
    }
  }

  onChooseInSearch(value: string) {
    this.resultSearch = []
    this.inputEl.nativeElement.value = value
  }



}
