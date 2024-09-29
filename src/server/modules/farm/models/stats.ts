import { IBestFarmer } from '../../../../shared/farm/dtos'
import { UserEntity } from '../../typeorm/entities/user'
import { dbconnection } from '../../typeorm'

export default class FarmStats {
    public firstPlace: IBestFarmer
    public secondPlace: IBestFarmer
    public thirdPlace: IBestFarmer
    
    
    public async init(): Promise<void> {
        await this.updateRating()
    }
    
    public async updateRating(): Promise<void> {
        const query = await dbconnection.createQueryBuilder(UserEntity, 'user_entity')
            .orderBy('user_entity.farmerExp', 'DESC')
            .take(3)
        
        const res = await query.execute()
        
        if (res.length < 3) return
        
        this.firstPlace = {
            name: res[0]['user_entity_rp_name'],
            id: res[0]['user_entity_id'],
            exp: res[0]['user_entity_farmerExp']
        }
        this.secondPlace = {
            name: res[1]['user_entity_rp_name'],
            id: res[1]['user_entity_id'],
            exp: res[1]['user_entity_farmerExp']
        }

        this.thirdPlace = {
            name: res[2]['user_entity_rp_name'],
            id: res[2]['user_entity_id'],
            exp: res[2]['user_entity_farmerExp']
        }
    }
}

export const stats = new FarmStats()
setTimeout(() => stats.init(), 5000)
setInterval(() => stats.updateRating(), 6 * 60000)// 6 минут