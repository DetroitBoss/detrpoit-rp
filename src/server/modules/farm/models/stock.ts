import { ItemEntity } from '../../typeorm/entities/inventory'
import { OWNER_TYPES } from '../../../../shared/inventory'
import { inventory } from '../../inventory'
import { systemUtil } from '../../../../shared/system'
import BaseActivity from './activities/baseActivity'

export class FarmActivityStock {
    public static stocks: Array<FarmActivityStock> = []
    public readonly items: Array<ItemEntity> = []
    
    constructor(public readonly activity: BaseActivity) {
        FarmActivityStock.stocks.push(this)
    }
    
    public async addItem(itemId: number): Promise<void> {
        await inventory.createItem({
            item_id: itemId,
            owner_type: OWNER_TYPES.FARM_STOCK,
            owner_id: this.activity.id,
            count: 1,
        })
    }
    
    public open(player: PlayerMp): void {
        if (player.farmWorker?.activity.id != this.activity.id) return
        
        inventory.openInventory(player);
        //inventory.inventory_blocks.set(`${OWNER_TYPES.FARM_STOCK}_${this.activity.id}`, []);
    }
    
    public static getNearestInventory(player: PlayerMp): { owner_type: OWNER_TYPES, owner_id: number, have_access: boolean } {
        const stock = FarmActivityStock.stocks.find(stock => stock.activity.id == player.farmWorker?.activity?.id &&
            systemUtil.distanceToPos(stock.activity.spot.storagePos, player.position) < 3)
        if (!stock) return null;
        
        return { owner_type: OWNER_TYPES.FARM_STOCK, owner_id: stock.activity.id, have_access: true };
    }
}