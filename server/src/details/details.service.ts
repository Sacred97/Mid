import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Express} from 'express'
import {InjectRepository} from '@nestjs/typeorm';
import {getRepository, Repository} from 'typeorm';
import {FilesService} from '../files/files.service';
import {ProductGroupService} from "../category/product-group/product-group.service";
import {CategoryService} from "../category/category.service";
import {ManufacturerService} from "../manufacturer/manufacturer.service";
import {Detail} from './entity/detail.entity';
import {PhotoDetail} from './entity/photoDetail.entity';
import {AdditionalVendorCode} from "./entity/additional-vendor-code.entity";
import {AlternativeName} from "./entity/alternative-name.entity";
import {DetailCreateDto} from './dto/detail-create.dto';
import {DetailUpdateDto} from './dto/detail-update.dto';
import {DetailPatchDto} from "./dto/detail-patch.dto";
import {FilterDto} from './dto/filter.dto';
import {DetailIdDto} from "../shared-dto/detail-id.dto";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {GET_DETAILS_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {KeyWordsService} from "../key-words/key-words.service";
import {AutoPartsService} from "../auto-parts/auto-parts.service";
import {AutoApplicabilityService} from "../auto-applicability/auto-applicability.service";
import {AlternativeNameUpdateDto} from "./dto/alternative-name-update.dto";
import {AlternativeNameCreateDto} from "./dto/alternative-name-create.dto";
import {AdditionalCodeUpdateDto} from "./dto/additional-code-update.dto";
import {AdditionalCodeCreateDto} from "./dto/additional-code-create.dto";
import {DetailPhotoUpdateDto} from "./dto/detail-photo-update.dto";
import {DetailPhotoCreateDto} from "./dto/detail-photo-create.dto";


@Injectable()
export class DetailsService {
  constructor(@InjectRepository(Detail) private detailRepository: Repository<Detail>,
              @InjectRepository(PhotoDetail) private photoDetailRepository: Repository<PhotoDetail>,
              @InjectRepository(AdditionalVendorCode) private additionalVendorCodeRepository: Repository<AdditionalVendorCode>,
              @InjectRepository(AlternativeName) private alternativeNameRepository: Repository<AlternativeName>,
              private readonly productGroupService: ProductGroupService,
              private readonly categoryService: CategoryService,
              private readonly manufacturerService: ManufacturerService,
              private readonly partsService: AutoPartsService,
              private readonly applicabilityService: AutoApplicabilityService,
              private readonly keyWordsService: KeyWordsService,
              private readonly filesService: FilesService,
              private readonly redisCacheService: RedisCacheService) {
  }

  async getAllHiddenDetails() {
    return await this.detailRepository.createQueryBuilder('d')
        .leftJoinAndSelect('d.manufacturer', 'm')
        .leftJoinAndSelect('m.country', 'c')
        .leftJoinAndSelect('c.region', 'r')
        .where(' d.isHide = true')
        .getMany()
  }

  //----------------------------------------------------------Фильтр-----------------------------------------------------------------

  async getDetailsWithFilter(filter: FilterDto[], sort: string, order: "ASC" | "DESC",
                             availability: boolean, recent: boolean, sale: boolean, popular: boolean,
                             letter?: string, word?: string, limit = 10, offset = 0) {
    const parts: number[] = []
    const applicability: number[] = []
    const category: string[] = []
    const manufacturer: number[] = []
    for (let f of filter) {
      switch (f.type) {
        case 'parts': parts.push(+f.value)
          break;
        case 'applicability': applicability.push(+f.value)
          break;
        case 'category': category.push(`'${f.value}'`)
          break;
        case 'manufacturer': manufacturer.push(+f.value)
          break;
      }
    }

    let query: string = 'detail.isHide != true AND ' +
      (parts.length ? `auto_parts.id IN (${parts.toString()}) `:'') +
      (parts.length && applicability.length ? 'AND ' : '') +
      (applicability.length ? `auto_applicability.id IN (${applicability.toString()}) ` : '') +
      ((parts.length || applicability.length) && category.length ? 'AND ' : '') +
      (category.length ? `category.id IN (${category.toString()}) ` : '') +
      ((parts.length || applicability.length || category.length) && manufacturer.length ? 'AND ' : '') +
      (manufacturer.length ? `manufacturer.id IN (${manufacturer.toString()}) ` : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length) && !!letter ? 'AND ' : '') +
      (!!letter ? `detail.name ILIKE '${letter.length === 1 ? letter : '%' + letter}%' ` : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length || !!letter) && recent ? 'AND ' : '') +
      (recent ? 'detail.isNewDetail = true ' : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length || !!letter || recent) && popular ? 'AND ' : '') +
      (popular ? 'detail.isPopular = true ' : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length || !!letter || recent || popular) && sale ? 'AND ' : '') +
      (sale ? 'detail.isSale = true ' : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length || !!letter || recent || popular || sale) && availability ? 'AND ' : '') +
      (availability ? '(detail.storageGES >= 0 OR detail.storageOrlovka >= 0 OR detail.storageGarage2000 >= 0) ' : '') +
      ((parts.length || applicability.length || category.length || manufacturer.length || !!letter || recent || popular || sale || availability) && !!word ? 'AND ' : '') +
      (!!word?`key_words.shortName = '${word.toLocaleLowerCase()}' ` : '')

    const [items, count] = await getRepository(Detail).createQueryBuilder('detail')
        .leftJoinAndSelect('detail.autoParts', 'auto_parts')
        .leftJoinAndSelect('detail.autoApplicability', 'auto_applicability')
        .leftJoinAndSelect('detail.category', 'category')
        .leftJoinAndSelect('detail.manufacturer', 'manufacturer')
        .leftJoinAndSelect('detail.photoDetail', 'photo_detail')
        .leftJoinAndSelect('detail.alternativeName', 'alternative_name')
        .leftJoinAndSelect('detail.additionalVendorCode', 'additional_vendor_code')
        .leftJoinAndSelect('detail.keyWords', 'key_words')
        .where(query)
        .orderBy('detail.' + sort, order)
        .skip(offset)
        .take(limit)
        .getManyAndCount()

    items.forEach(item => {
      if (item.photoDetail.length>0) item.photoDetail
          .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)
    })

    return {items, count}
  }

  async getRandomDetailsByManufacturer(manufacturerId: number) {
    const query: string = `detail.isHide != true AND manufacturer.id = ${manufacturerId}`

    const count = await this.detailRepository.createQueryBuilder('detail')
        .leftJoinAndSelect('detail.manufacturer', 'manufacturer')
        .where(query)
        .getCount()
    const randomOffset: number = count<=10?0:Math.round(Math.random()*(count-10))

    const items =  await this.detailRepository.createQueryBuilder('detail')
        .leftJoinAndSelect('detail.manufacturer', 'manufacturer')
        .leftJoinAndSelect('detail.photoDetail', 'photo_detail')
        .leftJoinAndSelect('detail.additionalVendorCode', 'additional_vendor_code')
        .where(query)
        .take(10)
        .skip(randomOffset)
        .getMany()

    items.forEach(item => {
      if (item.photoDetail.length>0) item.photoDetail
          .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)
    })

    return items
  }

  async getRandomDetailsForHomePage() {
    const saleCount = await this.detailRepository.count({where: {isSale: true}})
    const saleRandomOffset = saleCount <= 10 ? 0 : Math.round(Math.random() * (saleCount - 10))
    const saleDetails = await this.detailRepository.find({
      where: {isSale: true},
      skip: saleRandomOffset,
      take: 10
    })

    const recentCount = await this.detailRepository.count({where: {isPopular: true}})
    const recentRandomOffset = recentCount <= 10 ? 0 : Math.round(Math.random() * (recentCount - 10))
    const recentDetails = await this.detailRepository.find({
      where: {isPopular: true},
      skip: recentRandomOffset,
      take: 10
    })

    const newCount = await this.detailRepository.count({where: {isNewDetail: true}})
    const newRandomOffset = newCount <= 10 ? 0 : Math.round(Math.random() * (newCount - 10))
    const newDetails = await this.detailRepository.find({
      where: {isNewDetail: true},
      skip: newRandomOffset,
      take: 10
    })

    return {new: newDetails, recent: recentDetails, sale: saleDetails}
  }

  //--------------------------------------------------Автомат фильтра---------------------------------------------------------------

  async getFiltersWithCount() {

    const manufacturer = await this.manufacturerService.getAllWithCountDetails()

    const category = await this.categoryService.getAllWithCountDetails()

    const autoApplicability = await this.applicabilityService.getFiltersAndCount()

    const autoParts = await this.partsService.getFiltersAndCount()

    return {manufacturer, category, autoApplicability, autoParts}
  }

  //-------------------------------------------------Поиск------------------------------------------------------------------------

  async getSearchedDetail(queryRequest: string, limit: number = 10, offset: number = 0) {

    const query: string = `detail.isHide = false AND (
      detail.name ILIKE '%${queryRequest}%' OR 
      detail.vendorCode ILIKE '%${queryRequest}%' OR 
      alternative_name.shortName ILIKE '%${queryRequest}%' OR 
      additional_vendor_code.shortName ILIKE '%${queryRequest}%' OR 
      key_words.shortName ILIKE '%${queryRequest}%'
      )`

    const [items, count] = await getRepository(Detail).createQueryBuilder('detail')
        .leftJoinAndSelect('detail.photoDetail', 'photo_detail')
        .leftJoinAndSelect('detail.alternativeName', 'alternative_name')
        .leftJoinAndSelect('detail.additionalVendorCode', 'additional_vendor_code')
        .leftJoinAndSelect('detail.manufacturer', 'manufacturer')
        .leftJoinAndSelect('detail.keyWords', 'key_words')
        .where(query)
        .skip(offset)
        .take(limit)
        .getManyAndCount()

    items.forEach(item => {
      if (item.photoDetail.length>0) item.photoDetail
          .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)
    })

    return {items, count}
  }

  //-------------------------------------------------CRUD Деталей (Detail)------------------------------------------------------------

  async getAllDetail(sortBy: 'name' | 'price', orderBy: "ASC" | "DESC", limit= 20, offset = 0) {

    const sort: {[key: string]: "ASC" | "DESC"} = {}
    sort[sortBy] = orderBy

    const [items, count] = await this.detailRepository.findAndCount({
      relations: ['category', 'autoApplicability', 'autoParts'],
      where: {isHide: false},
      order: {...sort},
      take: limit,
      skip: offset
    })

    items.forEach(item => {
      if (item.photoDetail.length>0) item.photoDetail
          .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)
    })

    return {items, count}
  }

  async getDetailsByIds(ids: DetailIdDto[]) {
    const details = await this.detailRepository.findByIds(ids)
    details.forEach(item => {
      if (item.photoDetail.length>0) item.photoDetail
          .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)
    })
    return details
  }

  async getDetailById(id: string, isAdmin: boolean = false) {
    const detail = await this.detailRepository.findOne(id, {
      relations: ['category', 'autoApplicability', 'autoParts', 'keyWords']
    })
    if (!!detail && detail.photoDetail.length > 0) detail.photoDetail
        .sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)

    if (isAdmin) {
      return detail
    }
    if (detail.isHide) throw new HttpException('Невозможно получить товар', HttpStatus.FORBIDDEN)
    return detail
  }

  async createDetail(createData: DetailCreateDto) {
    const detail = await this.detailRepository.findOne(createData.id)
    let category = await this.categoryService.getById(createData.categoryId)

    if (!category) {
      if (createData.categoryId && createData.categoryName) {
        if (createData.productGroupId && createData.productGroupName) {
          let productGroup = await this.productGroupService.getById(createData.productGroupId)
          if (!productGroup) {
            productGroup = await this.productGroupService.createProductGroup({
              id: createData.productGroupId,
              productGroup: createData.productGroupName
            })
          }
          category = await this.categoryService.createCategory({
            id: createData.categoryId,
            categoryName: createData.categoryName,
            productGroupId: productGroup.id
          })
        } else {
          category = await this.categoryService.createCategory({
            id: createData.categoryId,
            categoryName: createData.categoryName,
            productGroupId: '404'
          })
        }
      } else {
        category = await this.categoryService.getById('404')
      }
    }
    Object.assign(createData, {category: category})

    if (createData.manufacturerName) {
      let manufacturer = await this.manufacturerService.getByName(createData.manufacturerName)
      if (!manufacturer) {
        manufacturer = await this.manufacturerService.createManufacturer({
          nameCompany: createData.manufacturerName,
          countryName: createData.country || 'Не указано',
          regionName: createData.region || 'Не указано'
        })
      }
      Object.assign(createData, {manufacturer: manufacturer})
    }

    if (createData.autoPartsString) {
      const autoPartsArray: string[] = createData.autoPartsString.split(';')
          .map(item => item.trim())
      const autoParts = await this.partsService.findMany(autoPartsArray)
      const ids: { id: number }[] = autoParts.map(item => {
        return {id: item.id}
      })
      Object.assign(createData, {autoParts: ids})
    } else {
      Object.assign(createData, {autoParts: []})
    }

    if (createData.autoApplicabilityString) {
      const autoApplicabilityArray: string[] = createData.autoApplicabilityString.split(';')
          .map(item => item.trim())
      const applicability = await this.applicabilityService.findMany(autoApplicabilityArray)
      const ids: { id: number }[] = applicability.map(item => {
        return {id: item.id}
      })
      Object.assign(createData, {autoApplicability: ids})
    } else {
      Object.assign(createData, {autoApplicability: []})
    }

    if (createData.keyWordsString) {
      const keyWordsArray: string[] = createData.keyWordsString.split(';')
          .map(item => item.trim())
      const keyWordsIds: {id: number}[] = []
      for (let word of keyWordsArray) {
        let keyWord = await this.keyWordsService.findByKeyWord(word)
        if (!keyWord) keyWord = await this.keyWordsService.createKeyWord({keyWord: word})
        keyWordsIds.push({id: keyWord.id})
      }
      Object.assign(createData, {keyWords: keyWordsIds})
    } else {
      Object.assign(createData, {keyWords: []})
    }

    const newDetail = await this.detailRepository.create({...createData})
    const savedDetail = await this.detailRepository.save(newDetail)

    if (createData.additionalVendorCodeString) {
      const addVendorCodeArray: {shortName: string, additionalCode: string}[] = createData.additionalVendorCodeString
          .split(';')
          .map(item => {
            return {shortName: item.toLowerCase().trim(), additionalCode: item.trim()}
          })

      if (detail && detail.additionalVendorCode.length > 0) {
        const onDelete = this.filterArrays(detail.additionalVendorCode, addVendorCodeArray)
        const onSave = this.filterArrays(addVendorCodeArray, detail.additionalVendorCode)
        for (let deleteItem of onDelete) {
          await this.deleteAdditionalVendorCode(deleteItem.id)
        }
        for (let saveItem of onSave) {
          await this.createAdditionalVendorCode({
            additionalCode: saveItem.additionalCode, detailId: savedDetail.id
          })
        }
      } else {
        for (let vendorCode of addVendorCodeArray) {
          await this.createAdditionalVendorCode({
            additionalCode: vendorCode.additionalCode, detailId: savedDetail.id
          })
        }
      }
    }

    if (createData.alternativeNameString) {
      const alternativeNameArray: {shortName: string, alternativeName: string}[] = createData.alternativeNameString
          .split(';')
          .map(item => {
            return {shortName: item.toLowerCase().trim(), alternativeName: item.trim()}
          })

      if (detail && detail.alternativeName.length > 0) {
        const onDelete = this.filterArrays(detail.alternativeName, alternativeNameArray)
        const onSave = this.filterArrays(alternativeNameArray, detail.alternativeName)
        for (let deleteItem of onDelete) {
          await this.deleteAlternativeName(deleteItem.id)
        }
        for (let saveItem of onSave) {
          await this.createAlternativeName({
            alternativeName: saveItem.alternativeName, detailId: savedDetail.id
          })
        }
      } else {
        for (let altName of alternativeNameArray) {
          await this.createAlternativeName({
            alternativeName: altName.alternativeName, detailId: savedDetail.id
          })
        }
      }
    } else if (!createData.alternativeNameString && detail && detail.alternativeName.length > 0) {
      for (let alt of detail.alternativeName) {
        await this.deleteAlternativeName(alt.id)
      }
    }

    await this.redisCacheService.deleteCacheKey(GET_DETAILS_CACHE_KEY)
    return await this.detailRepository.findOne(savedDetail.id,
        {
          relations: [
            'category', 'autoApplicability', 'autoParts', 'keyWords'
          ]
        }
    )
  }

  async updateDetail(updateData: DetailUpdateDto) {
    const detail = await this.detailRepository.findOne(updateData.id, {loadEagerRelations: false})
    if (detail) {
      if (updateData.categoryId) {
        const category = await this.categoryService.getById(updateData.categoryId)
        if (category) Object.assign(updateData, {category: category})
      }
      if (updateData.manufacturerId) {
        const manufacturer = await this.manufacturerService.getById(updateData.manufacturerId)
        if (manufacturer) Object.assign(updateData, {manufacturer: manufacturer})
      }
      const updateDataEntity = await this.detailRepository.create(updateData)
      await this.detailRepository.save(updateDataEntity)
      await this.redisCacheService.deleteCacheKey(GET_DETAILS_CACHE_KEY)
      return await this.getDetailById(updateData.id)
    }
    throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND)
  }

  async fastUpdateDetail(updateData: DetailPatchDto) {
    const detail = await this.detailRepository.findOne(updateData.id)
    if (detail) {
      await this.detailRepository.update(updateData.id, {...updateData})
      await this.redisCacheService.deleteCacheKey(GET_DETAILS_CACHE_KEY)
      return await this.detailRepository.findOne(updateData.id, {loadEagerRelations: false})
    }
    return null
  }

  async deleteDetail(id: string) {
    const detail = await this.detailRepository.findOne(id)
    if (detail) {
      if (detail.photoDetail.length > 0) {
        for (let photo of detail.photoDetail) {
          await this.filesService.removeSelectel(photo.key)
          await this.photoDetailRepository.delete(photo.id)
        }
      }
      await this.detailRepository.delete(detail.id)
      await this.redisCacheService.deleteCacheKey(GET_DETAILS_CACHE_KEY)
      return {message: `Товар ${detail.name} с id ${id} удален`}
    }
    throw new HttpException("Товар не найден", HttpStatus.NOT_FOUND)
  }

  private filterArrays(arr: any[], filter:any[]) {
    return arr.filter(el1 => {
      return !filter.find(el2 => {
        return el1.shortName === el2.shortName;
      });
    });
  }

  //------------------------------------------------ CRUD Фото Деталей (PhotoDetail) ----------------------------------------

  async getAllPhotoDetails() {
    return await this.photoDetailRepository.find({relations: ['detail']})
  }

  async getPhotoDetailById(id: number) {
    return await this.photoDetailRepository.findOne(id,{relations: ['detail']})
  }

  async uploadPhotoDetail(uploadData: any) {
    const detail = await this.detailRepository.findOne(uploadData.id)

    if (detail) {

      if (detail.photoDetail && detail.photoDetail.length > 0) {
        for (let item of detail.photoDetail) {
          await this.filesService.removeSelectel(item.key)
          await this.photoDetailRepository.delete(item.id)
        }
      }
      let quantityKeys = Object.keys(uploadData).length
      let photo: PhotoDetail[] = []
      for (let i = 1; i < quantityKeys; i++) {
        let imageData: any = Object.values(uploadData)[i]
        console.log(imageData);
        let buffer = Buffer.from(imageData.img, 'base64')
        let uploadedImage = await this.filesService.uploadSelectel(buffer,'details', detail.id, imageData.fileName)
        let instanceEntity = await this.photoDetailRepository.create({
          url: uploadedImage.Location,
          key: uploadedImage.Key,
          isMain: imageData.bim,
          detail: detail
        })
        let uploadedPhoto = await this.photoDetailRepository.save(instanceEntity)
        photo.push(uploadedPhoto)
      }
      return photo
    }
    // Не выдавать ошибку, просто пропусти и продолжить дальше
    return null
  }

  async adminUploadPhotoDetail(data: DetailPhotoCreateDto, file: Express.Multer.File) {
    const detail = await this.detailRepository.findOne(data.detailId)
    if (detail) {
      if (data.isMain) {
        for (let p of detail.photoDetail) {
          await this.photoDetailRepository.update(p.id, {isMain: false})
        }
      }

      let uploadedData = await this.filesService
          .uploadSelectel(file.buffer, 'details', data.detailId, file.originalname)
      const photoInstance = await this.photoDetailRepository.create({
        url: uploadedData.Location,
        key: uploadedData.Key,
        isMain: data.isMain,
        detail: detail
      })
      await this.photoDetailRepository.save(photoInstance)
      return await this.detailRepository.findOne(data.detailId).then(data => data.photoDetail)
    }
    throw new HttpException('Товар не нашелся, фотографию не к чему прикрепить', HttpStatus.CONFLICT)
  }

  async adminUpdatePhotoDetail(data: DetailPhotoUpdateDto) {
    const photoDetail = await this.photoDetailRepository.findOne(data.id)
    const detail = await this.detailRepository.findOne(data.detailId)
    if (photoDetail && detail) {
      for (let p of detail.photoDetail) {
        await this.photoDetailRepository.update(p.id, {isMain: false})
      }
      await this.photoDetailRepository.update(data.id, {isMain: true})
      return await this.photoDetailRepository.findOne(data.id)
    }
    throw new HttpException('Фотография не найдена', HttpStatus.NOT_FOUND)
  }

  async deletePhotoDetail(id: number) {
    const photoDetail = await this.photoDetailRepository.findOne(id)
    if (photoDetail) {
      await this.filesService.removeSelectel(photoDetail.key)
      await this.photoDetailRepository.delete(id)
      return {message: 'Фотография удалена'}
    }
    throw new HttpException('Фотография не найдена', HttpStatus.NOT_FOUND)
  }

  //----------------------------------------------CRUD Доп.Артикула(Additional-Vendor-Code)-------------------------------------

  async getNotBindingCodes() {
    return await this.additionalVendorCodeRepository.find({
      where: {detail: {id: null}}
    })
  }

  async getAllAdditionalVendorCode() {
    return await this.additionalVendorCodeRepository.find({relations: ['detail']})
  }

  async getAdditionalVendorCodeById(id: number) {
    return await this.additionalVendorCodeRepository.findOne(id,{relations: ['detail']})
  }

  async createAdditionalVendorCode(createData: AdditionalCodeCreateDto) {
    const detail = await this.detailRepository.findOne(createData.detailId, {loadEagerRelations: false})
    if (!detail) throw new HttpException('Товар не найден, нужна привязка к товару', HttpStatus.NOT_FOUND)
    const instanceEntity = await this.additionalVendorCodeRepository.create({
      additionalCode: createData.additionalCode,
      shortName: createData.additionalCode.toLowerCase(),
      detail: detail
    })
    return await this.additionalVendorCodeRepository.save(instanceEntity)
  }

  async updateAdditionalVendorCode(updateData: AdditionalCodeUpdateDto) {
    const additionalCode = await this.additionalVendorCodeRepository.findOne(updateData.id)
    if (additionalCode) {
      if (updateData.additionalCode) {
        Object.assign(updateData, {shortName: updateData.additionalCode.toLowerCase()})
      }
      if (updateData.detailId) {
        const detail = await this.detailRepository.findOne(updateData.detailId, {loadEagerRelations: false})
        if (detail) Object.assign(updateData, {detail: detail})
        delete updateData.detailId
      }
      await this.additionalVendorCodeRepository.update(updateData.id, {...updateData})
      return await this.additionalVendorCodeRepository.findOne(updateData.id, {relations: ['detail']})
    }
    throw new HttpException('Доп. артикул не найден', HttpStatus.NOT_FOUND)
  }

  async deleteAdditionalVendorCode(id: number) {
    const additionalCode = await this.additionalVendorCodeRepository.findOne(id)
    if (additionalCode) {
      await this.additionalVendorCodeRepository.delete(id)
      return {message: `'Доп. артикул ${additionalCode.additionalCode} удалён'`}
    }
    throw new HttpException('Доп. артикул не найден', HttpStatus.NOT_FOUND)
  }

  //----------------------------------------------CRUD Альт.Наименование(AlternativeName)-----------------------------------------

  async getNotBindingNames() {
    return await this.alternativeNameRepository.find({
      where: {detail: {id: null}}
    })
  }

  async getAllAlternativeName() {
    return await this.alternativeNameRepository.find({relations: ['detail']})
  }

  async getAlternativeNameById(id: number) {
    return await this.alternativeNameRepository.findOne(id, {relations: ['detail']})
  }

  async createAlternativeName(createData: AlternativeNameCreateDto) {
    const detail = await this.detailRepository.findOne(createData.detailId, {loadEagerRelations: false})
    if (!detail) throw new HttpException('Товар не найден, нужна привязка к товару', HttpStatus.NOT_FOUND)
    const instanceEntity = await this.alternativeNameRepository.create({
      alternativeName: createData.alternativeName,
      shortName: createData.alternativeName.toLowerCase(),
      detail: detail
    })
    return await this.alternativeNameRepository.save(instanceEntity)
  }

  async updateAlternativeName(updateData: AlternativeNameUpdateDto) {
    const alternativeName = await this.alternativeNameRepository.findOne(updateData.id)
    if (alternativeName) {
      if (updateData.alternativeName) {
        Object.assign(updateData, {shortName: updateData.alternativeName.toLowerCase()})
      }
      if (updateData.detailId) {
        const detail = await this.detailRepository.findOne(updateData.detailId, {loadEagerRelations: false})
        if (detail) Object.assign(updateData, {detail: detail})
        delete updateData.detailId
      }
      await this.alternativeNameRepository.update(updateData.id, {...updateData})
      return await this.alternativeNameRepository.findOne(updateData.id, {relations: ['detail']})
    }
    throw new HttpException('Доп. наименование не найдено', HttpStatus.NOT_FOUND)
  }

  async deleteAlternativeName(id: number) {
    const alternativeName = await this.alternativeNameRepository.findOne(id)
    if (alternativeName) {
      await this.alternativeNameRepository.delete(id)
      return {message: `Доп. наименование ${alternativeName.alternativeName} удалено`}
    }
    throw new HttpException('Доп. наименование не найдено', HttpStatus.NOT_FOUND)
  }

}
