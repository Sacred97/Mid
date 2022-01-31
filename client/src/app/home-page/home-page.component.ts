import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  firstBtn: boolean = true
  secondBtn: boolean = false
  thirdBtn: boolean = false
  fourth: boolean = false
  fifth: boolean = false
  defaultSrc: string = "../../assets/home/logo-on-details.jpg"

  companyOne: string = '../../assets/home/company-1.png'
  companyTwo: string = '../../assets/home/company-2.png'
  companyThree: string = '../../assets/home/company-3.png'

  constructor() { }

  ngOnInit(): void {
  }

  slides = [
    {img: "../../assets/slide-1.jpg"},
    {img: "../../assets/slide-1.jpg"},
    {img: "../../assets/slide-1.jpg"},
    {img: "../../assets/slide-1.jpg"}
  ];
  mainSliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": true,
    "infinite": true,
    "centerMode": true,
    "variableWidth": true,
    "autoplay": true
  };

  sliderFirstConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": true,
    "variableWidth": true,
    //"centerMode": true,
    "autoplay": true
  }
  slidesOnFirstSlider = [
    {src: this.defaultSrc, company: this.companyOne,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc, company: this.companyThree,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc, company: this.companyTwo,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc, company: this.companyThree,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc, company: this.companyTwo,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc, company: this.companyOne,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"},
    {src: this.defaultSrc,
      title: "Болт М10х70 / ZF (0736300123 / 0736010180)", vendorCode: "0736 300 123 / 0736 010 180", price: "63,80"}
  ]

  addClassToggled(number: string) {
    switch (number) {
      case 'first':
        this.firstBtn = true
        this.secondBtn = false
        this.thirdBtn = false
        this.fourth = false
        this.fifth = false
        break;
      case 'second':
        this.firstBtn = false
        this.secondBtn = true
        this.thirdBtn = false
        this.fourth = false
        this.fifth = false
        break;
      case 'third':
        this.firstBtn = false
        this.secondBtn = false
        this.thirdBtn = true
        this.fourth = false
        this.fifth = false
        break;
      case 'fourth':
        this.firstBtn = false
        this.secondBtn = false
        this.thirdBtn = false
        this.fourth = true
        this.fifth = false
        break;
      case 'fifth':
        this.firstBtn = false
        this.secondBtn = false
        this.thirdBtn = false
        this.fourth = false
        this.fifth = true
        break;
    }
  }
}
