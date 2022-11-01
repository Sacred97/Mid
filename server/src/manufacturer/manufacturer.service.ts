import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FilesService} from "../files/files.service";
import {CountryService} from "./country/country.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Manufacturer} from "./entity/manufacturer.entity";
import {ILike, IsNull, Not, Repository} from "typeorm";
import {ManufacturerCreateDto} from "./dto/manufacturer-create.dto";
import {ManufacturerUpdateDto} from "./dto/manufacturer-update.dto";
import {Express} from 'express'
import {PhotoCertificate} from "./entity/photoCertificate.entity";
import {PhotoCertificateDto} from "./dto/photo-certificate.dto";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {GET_MANUFACTURER_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {ManufacturerFilterDto} from "./dto/manufacturer-filter.dto";

@Injectable()
export class ManufacturerService {

    constructor(@InjectRepository(Manufacturer) private manufacturerRepository: Repository<Manufacturer>,
                @InjectRepository(PhotoCertificate) private photoCertificateRepository: Repository<PhotoCertificate>,
                private readonly filesService: FilesService,
                private readonly countryService: CountryService,
                private readonly redisCacheService: RedisCacheService) {
    }

    //-----------------------------------------Поиск по производителям--------------------------------------------------

    async searchManufacturer(search: string) {
        search = '%' + search + '%'
        return await this.manufacturerRepository.find({
            where: {shortName: ILike(search)},
            take: 10
        })
    }

    //-----------------------------------------Фильтры по производителю-------------------------------------------------

    async filterManufacturer(filter?: ManufacturerFilterDto, offset: number = 0, limit: number = 24) {

        if (!filter || (filter.region === 0 && filter.country === 0 && filter.letter === '')) {
            const itemWithoutFilter = await this.manufacturerRepository.query(
                'SELECT m.id, "nameCompany", m."shortName", "logoCompanyUrl", country."country", ' +
                'region."region" from manufacturer m ' +
                'left join country ON m."countryId" = country.id ' +
                'left join region on country."regionId" = region.id ' +
                'order by ' +
                'FIND_IN_SET(upper(left(m."nameCompany", 1)), \'А,Б,В,Г,Д,Е,Ё,Ж,З,И,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ч,Ш,Щ,Э,Ю,Я,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,!,-\'), m."nameCompany" ' +
                `LIMIT ${limit} OFFSET ${offset + 1}`)

            const countWithoutFilter = await this.manufacturerRepository.count()

            return {items: itemWithoutFilter, count: countWithoutFilter}
        }

        const query: string = (filter.region ? `region.id = ${filter.region}` : '') +
            (filter.region && filter.country ? ' AND ' : '') +
            (filter.country ? `country.id = ${filter.country}` : '') +
            ((filter.region || filter.country) && filter.letter ? ' AND ' : '') +
            (filter.letter ? `manufacturer.nameCompany ILIKE '${filter.letter}%'` : '')

        const [items, count] = await this.manufacturerRepository.createQueryBuilder('manufacturer')
            .leftJoinAndSelect('manufacturer.country', 'country')
            .leftJoinAndSelect('country.region', 'region')
            .where(query)
            .skip(offset)
            .take(limit)
            .orderBy('manufacturer.nameCompany', "ASC")
            .getManyAndCount()

        return {items, count}
    }

    async getFiltersByManufacturer(id: number) {
        const autoApplicability = await this.manufacturerRepository.query(
            'SELECT a_ap.id, a_ap."autoApplicabilityName" as label, COUNT(g_table."detailId") AS count_detail ' +
            'FROM auto_applicability a_ap ' +
            'LEFT JOIN detail_auto_applicability_auto_applicability g_table ' +
            'ON g_table."autoApplicabilityId" = a_ap.id ' +
            'LEFT JOIN detail dt ON dt."id" = g_table."detailId" ' +
            'LEFT JOIN manufacturer m ON m."id" = dt."manufacturerId" ' +
            'WHERE dt."isHide" != true AND m."id" = ' + id + ' ' +
            'GROUP BY a_ap.id ORDER BY a_ap.id'
        )

        const autoParts = await this.manufacturerRepository.query(
            'SELECT a_p.id, a_p."autoPartsName" as label, COUNT(g_table."detailId") AS count_detail ' +
            'FROM auto_parts a_p ' +
            'LEFT JOIN detail_auto_parts_auto_parts g_table ' +
            'ON g_table."autoPartsId" = a_p.id ' +
            'LEFT JOIN detail dt ON dt."id" = g_table."detailId" ' +
            'LEFT JOIN manufacturer m ON m."id" = dt."manufacturerId" ' +
            'WHERE dt."isHide" != true AND m."id" = ' + id + ' ' +
            'GROUP BY a_p.id ORDER BY a_p.id'
        )

        const category = await this.manufacturerRepository.query(
            'SELECT c.id, c."categoryName" as label, COUNT(d."categoryId") AS count_detail ' +
            'FROM category c ' +
            'LEFT JOIN detail d ON d."categoryId" = c.id ' +
            'LEFT JOIN manufacturer m ON m."id" = d."manufacturerId" ' +
            'WHERE d."isHide" != true AND m."id" = ' + id + ' ' +
            'GROUP BY c.id ORDER BY c.id'
        )

        return {autoApplicability, autoParts, category}
    }

    //------------------------------------------------------------------------------------------------------------------

    private getRelations(relations: boolean) {
        return relations ? ['country'] : []
    }

    async getRandomManufacturer() {
        const count = await this.manufacturerRepository.count({where: {logoCompanyUrl: true}})
        const offset = count <= 50 ? 0 : Math.round(Math.random() * (count - 50))
        return await this.manufacturerRepository.find({
            where: {logoCompanyUrl: Not(IsNull())},
            select: ['id', 'nameCompany', 'shortName', 'logoCompanyUrl'],
            take: 50,
            skip: offset
        })
    }

    async getAllWithLimit(offset: number = 0, limit: number = 20) {
        const query: string = 'detail.isHide != true'
        const [items, count] = await this.manufacturerRepository.createQueryBuilder('manufacturer')
            .leftJoinAndSelect('manufacturer.detail', 'detail')
            .leftJoinAndSelect('manufacturer.photoCertificate', 'photo_certificate')
            .leftJoinAndSelect('manufacturer.country', 'country')
            .where(query)
            .skip(offset)
            .take(limit)
            .getManyAndCount()

        return {items, count}
    }

    async getById(id: number, withRelations: boolean = false) {
        return await this.manufacturerRepository.findOne(id, {relations: this.getRelations(withRelations)})
    }

    async getByName(manufacturerName: string, withRelations: boolean = false) {
        return await this.manufacturerRepository.findOne({relations: this.getRelations(withRelations),
            where: {shortName: manufacturerName.toLowerCase()}
        })
    }

    async getAllWithoutCountry() {
        return await this.manufacturerRepository.find({
            where: {country: {id: null}},
            select: ['id', 'nameCompany', 'logoCompanyUrl']
        })
    }

    async getAllWithCountDetails() {
        const query: string = 'SELECT m.id, m."nameCompany" as label, COUNT(d."manufacturerId") AS count_detail ' +
            'FROM manufacturer m ' +
            'LEFT JOIN detail d ON d."manufacturerId" = m.id ' +
            'WHERE d."isHide" != true ' +
            'GROUP BY m.id ORDER BY label'
        return await this.manufacturerRepository.query(query)
    }

    async createManufacturer(createData: ManufacturerCreateDto) {
        await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
        let country = await this.countryService.getByName(createData.countryName)
        if (!country) {
            country = await this.countryService.createCountry({
                country: createData.countryName,
                regionName: createData.regionName
            })
        }
        const instanceEntity = await this.manufacturerRepository.create({
            ...createData,
            shortName: createData.nameCompany.toLowerCase(),
            country: country
        })
        return await this.manufacturerRepository.save(instanceEntity)
    }

    async updateManufacturer(updateData: ManufacturerUpdateDto, file?: Express.Multer.File) {
        const manufacturer = await this.getById(updateData.id)
        if (manufacturer) {
            if (file) {
                if (manufacturer.logoCompanyKey) {
                    await this.filesService.removeSelectel(manufacturer.logoCompanyKey)
                }
                const uploadedData = await this.filesService.uploadSelectel(
                    file.buffer, 'manufacturer', updateData.id.toString(), file.originalname
                )
                Object.assign(updateData, {
                    logoCompanyUrl: uploadedData.Location,
                    logoCompanyKey: uploadedData.Key
                })
            }
            if (updateData.countryId) {
                const country = await this.countryService.getById(updateData.countryId)
                if (country) Object.assign(updateData, {country: country})
                delete updateData.countryId
            }
            if (updateData.nameCompany) Object.assign(updateData, {
                shortName: updateData.nameCompany.toLowerCase()
            })

            await this.manufacturerRepository.update(updateData.id, {...updateData})
            await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
            return await this.getById(updateData.id, true)
        }
        throw new HttpException('Производитель не найден', HttpStatus.NOT_FOUND)
    }

    async deleteManufacturer(id: number) {
        const manufacturer = await this.getById(id)
        if (manufacturer) {
            if (manufacturer.photoCertificate.length > 0) {
                for (let certificate of manufacturer.photoCertificate) {
                    await this.filesService.removeSelectel(certificate.certificatePhotoKey)
                    await this.photoCertificateRepository.delete(certificate.id)
                }
            }
            if (manufacturer.logoCompanyKey) {
                await this.filesService.removeSelectel(manufacturer.logoCompanyKey)
            }
            await this.manufacturerRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
            return {message: `Производитель -  ${manufacturer.nameCompany} был удален`}
        }
        throw new HttpException('Производитель не найден', HttpStatus.NOT_FOUND)
    }

    async overWriteCountry() {
        const manufacturers = await this.manufacturerRepository.find({where: {country: {id: null}}})
        if (!manufacturers.length) return
        const notSpecifiedCountry = await this.countryService.getByName('Не указано')
        for (let manufacturer of manufacturers) {
            await this.manufacturerRepository.update(manufacturer.id, {country: notSpecifiedCountry})
        }
        await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
    }

    //------------------------------------Сертификаты производителя(PhotoCertificate)-------------------------------------------

    async uploadCertificate(createData: PhotoCertificateDto, files: Express.Multer.File[]) {
        const manufacturer = await this.getById(createData.manufacturerId)
        if (manufacturer) {
            for (let file of files) {
                const uploadedData = await this.filesService.uploadSelectel(
                    file.buffer, 'manufacturer', createData.manufacturerId.toString(), file.originalname
                )
                const newCertificate = await this.photoCertificateRepository.create({
                    certificatePhotoUrl: uploadedData.Location,
                    certificatePhotoKey: uploadedData.Key,
                    lowResolution: createData.lowResolution,
                    relations: createData.relations,
                    manufacturer: manufacturer
                })
                await this.photoCertificateRepository.save(newCertificate)
            }
            await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
            return await this.getById(createData.manufacturerId)
        }
        throw new HttpException('Невозможно добавить фотографии сертификатов производителю, которого не существует',
            HttpStatus.NOT_FOUND)
    }

    async deleteCertificate(id: number) {
        const certificate = await this.photoCertificateRepository.findOne(id, {relations: ['manufacturer']})
        if (certificate) {
            await this.filesService.removeSelectel(certificate.certificatePhotoKey)
            await this.photoCertificateRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_MANUFACTURER_CACHE_KEY)
            return await this.getById(certificate.manufacturer.id)
        }
        throw new HttpException('Сертификат не найден', HttpStatus.NOT_FOUND)
    }

}
