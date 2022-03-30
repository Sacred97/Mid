import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AccessKeys} from "./entity/access-keys.entity";
import {OrderOneCInterface} from "./interfaces/orderOneC.interface";
import {AccessDto} from "./access.dto";

@Injectable()
export class OneCService {

    constructor(@InjectRepository(AccessKeys) private accessKeyRepository: Repository<AccessKeys>,
                private http: HttpService) {
    }

    async changeAccessKey(data: AccessDto): Promise<void> {
        const access = await this.accessKeyRepository.findOne({where: {access: data.access}})
        if (access) {
            await this.accessKeyRepository.update(access.id, data)
            return
        }
        throw new HttpException(`Доступ не найден`, HttpStatus.NOT_FOUND)
    }

    async sendOrderToOneC(order: OrderOneCInterface): Promise<void> {
        const accessKey = await this.accessKeyRepository.findOne({where: {access: 'one_c'}})
        const headerOptions = {
            'Authorization': accessKey.key,
            'Content-Type': 'application/json; charset=utf-8'
        }

        const ipVnutrenii: string = '172.16.1.35:8787'
        let ipVneshnii = '95.78.125.227:8787'

        await this.http.post('http://95.78.125.227:8787/midkam/hs/ExchangeSite/CreatingOrders', order, {headers: headerOptions})
            .toPromise().catch((error) => {
                console.log(error);
            })
    }

    async getAccessForOneC() {
        return await this.accessKeyRepository.findOne({where: {access: 'one_c_ip'}})
    }

}
