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
        // const accessKey = await this.accessKeyRepository.findOne({where: {access: 'one_c'}})
        const headerOptions = {
            // 'Authorization': '',
            'Content-Type': 'application/json; charset=utf-8'
        }

        const ipVnutrenii: string = '172.16.1.35:3000'
        let ipVneshnii = '95.78.124.135:3000'

        await this.http.post('http://95.78.124.135:3000', order, {headers: headerOptions})
            .toPromise().catch((error) => {
                console.log(error);
            })
    }

    async getAccessForOneC() {
        return await this.accessKeyRepository.findOne({where: {access: 'one_c_ip'}})
    }

}
