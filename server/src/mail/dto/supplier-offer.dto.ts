import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class SupplierOfferDto {

    @IsNotEmpty()
    @IsString()
    companyName: string

    @IsNotEmpty()
    @IsNumber()
    inn: number

    @IsNotEmpty()
    @IsNumber()
    kpp: number

    @IsNotEmpty()
    @IsString()
    address: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsString()
    aboutCompany: string

    @IsNotEmpty()
    @IsString()
    activity: string

}
