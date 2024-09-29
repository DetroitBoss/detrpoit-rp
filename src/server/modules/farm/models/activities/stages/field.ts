import { Field, } from '../field'
import { menu } from '../../../../menu'
import { FieldStage, SUPPLIES_LIST } from '../../../../../../shared/farm/config'
import { inventoryShared } from '../../../../../../shared/inventory'
import { ItemEntity } from '../../../../typeorm/entities/inventory'
import { CustomEvent } from '../../../../custom.event'
import { getLandingTime } from '../../../../../../shared/farm/helpers'
import { IFarmStage } from '../../farm'
import { system } from '../../../../system'
import {FARM_LAND_EVENT} from "../../../events";
import {FARM_TASK_MANAGER_EVENT} from "../../../../battlePass/tasks/farmTaskManager";

export interface IFieldStage extends IFarmStage {
    type: FieldStage
}

export class Landing implements IFieldStage {
    public type: FieldStage = FieldStage.Landing
    
    constructor(private readonly _field: Field) {}

    private async suggestSelectSupply(player: PlayerMp): Promise<ItemEntity> {
        return new Promise(async (resolve, reject) => {
            const m = menu.new(player, '', 'Выберите семена для посадки');
            m.sprite = 'farm'
            m.onclose = () => {
                resolve(null)
            }
            player.user.inventory
                .filter(i => SUPPLIES_LIST.filter(s => s.type == 'field' || s.type == 'all')
                .map(s => s.inventoryItemId).includes(i.item_id))
                .map(inventoryItem => {
                    m.newItem({
                        name: `${inventoryShared.get(inventoryItem.item_id).name} (${inventoryItem.count} шт.)`,
                        type: 'select',
                        icon: `Item_${inventoryItem.item_id}`,
                        onpress: item => {
                            m.close()
                            resolve(inventoryItem)
                        }
                    })
            })
            await m.open()
        })
    }
    
    public async startGameWithResult(player: PlayerMp, pointIdx: number): Promise<boolean> {
        if (player.vehicle) return false
        const inventoryItem = await this.suggestSelectSupply(player)
        if (!inventoryItem) return false

        const gameTime = getLandingTime(player.farmWorker.level)
        CustomEvent.triggerCef(player, 'hud:farmJobStart', gameTime)
        const gameCompleted = await player.user.waitTimer(1, gameTime, `Сажаем ${inventoryShared.get(inventoryItem.item_id).name.toLowerCase()}`, ["anim@heists@money_grab@duffel", "loop", true])
        
        if (!gameCompleted) {
            CustomEvent.triggerCef(player, 'hud:farmJobStop')
            return false
        }

        mp.events.call(FARM_LAND_EVENT, player, inventoryItem.item_id);
        mp.events.call(FARM_TASK_MANAGER_EVENT, player, inventoryItem.item_id, true);
        inventoryItem.useCount(1, player)
        
        const obj = mp.objects.new(SUPPLIES_LIST.find(s => s.inventoryItemId == inventoryItem.item_id).seedModel,
                player.position.subtract(new mp.Vector3(0, 0, 1)))
        obj.farmSupplyId = SUPPLIES_LIST.findIndex(s => s.inventoryItemId == inventoryItem.item_id)
        
        this._field.objects.set(pointIdx, obj)
        
        return true
    }
}

export class Cultivation implements IFieldStage {
    public type: FieldStage = FieldStage.Cultivation

    constructor(private readonly _field: Field) {
        _field.vehicles.map((veh, idx) => {
            veh.position = system.getVector3Mp(_field.spot.vehicleSpawnPoints[idx][0])
            veh.rotation = new mp.Vector3(0, 0, _field.spot.vehicleSpawnPoints[idx][1])
        })
    }

    public startGameWithResult(player: PlayerMp): boolean {
        return player.vehicle?.getVariable('farm') == this._field.id// && !!player.vehicle.trailer
    }
}

export class Collection implements IFieldStage {
    public type: FieldStage = FieldStage.Collection
    
    constructor(private readonly _field: Field) {
        this._field.objects.forEach(o => {
            o.model = mp.joaat(SUPPLIES_LIST[o.farmSupplyId].vegModel)
        })
    }

    public async startGameWithResult(player: PlayerMp, pointIdx: number): Promise<boolean> {
        const totalDots = 20 - (player.farmWorker.level * 2)
        const supplyModel = SUPPLIES_LIST[this._field.objects.get(pointIdx).farmSupplyId]

        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'dots')
        CustomEvent.triggerCef(player, 'dotsGame:init', pointIdx, totalDots, supplyModel.vegInventoryItemId)
        
        return false
    }
}

export const createFieldStage = (field: Field, stageType: FieldStage): IFieldStage => {
    switch (stageType) {
        case FieldStage.Cultivation:
            return new Cultivation(field)
        case FieldStage.Landing:
            return new Landing(field)
        case FieldStage.Collection:
            return new Collection(field)
    }
}