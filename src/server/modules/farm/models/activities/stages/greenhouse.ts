import { menu } from '../../../../menu'
import { GreenhouseStage, SUPPLIES_LIST } from '../../../../../../shared/farm/config'
import { inventoryShared, OWNER_TYPES } from '../../../../../../shared/inventory'
import { ItemEntity } from '../../../../typeorm/entities/inventory'
import { CustomEvent } from '../../../../custom.event'
import { inventory } from '../../../../inventory'
import { Greenhouse } from '../greenhouse'
import { getLandingTime } from '../../../../../../shared/farm/helpers'
import { IFarmStage } from '../../farm'
import {FARM_COLLECT_EVENT} from "../../../events";
import {FARM_TASK_MANAGER_EVENT} from "../../../../battlePass/tasks/farmTaskManager";

export interface IGreenhouseStage extends IFarmStage {
    type: GreenhouseStage
}

export class Landing implements IGreenhouseStage {
    public type: GreenhouseStage = GreenhouseStage.Landing

    constructor(private readonly _greenhouse: Greenhouse) {}

    private async suggestSelectSupply(player: PlayerMp): Promise<ItemEntity> {
        return new Promise(async (resolve, reject) => {
            const m = menu.new(player, '', 'Выберите семена для посадки');
            m.sprite = 'farm'
            m.onclose = () => {
                resolve(null)
            }
            player.user.inventory
                .filter(i => SUPPLIES_LIST
                .filter(s => s.type == 'greenhouse' || s.type == 'all')
                .map(s => s.inventoryItemId).includes(i.item_id)).map(inventoryItem => {
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
        const inventoryItem = await this.suggestSelectSupply(player)
        if (!inventoryItem) return false

        const gameTime = getLandingTime(player.farmWorker.level)
        CustomEvent.triggerCef(player, 'hud:farmJobStart', gameTime)
        const gameCompleted = await player.user.waitTimer(1, gameTime, `Сажаем ${inventoryShared.get(inventoryItem.item_id).name.toLowerCase()}`, ["anim@heists@money_grab@duffel", "loop", true])

        if (!gameCompleted) {
            CustomEvent.triggerCef(player, 'hud:farmJobStop')
            return false
        }

        mp.events.call(FARM_TASK_MANAGER_EVENT, player, inventoryItem.item_id, true);
        inventoryItem.useCount(1, player)

        const obj = mp.objects.new(SUPPLIES_LIST.find(s => s.inventoryItemId == inventoryItem.item_id).seedModel,
            player.position.subtract(new mp.Vector3(0, 0, 1)))
        obj.farmSupplyId = SUPPLIES_LIST.findIndex(s => s.inventoryItemId == inventoryItem.item_id)

        this._greenhouse.objects.set(pointIdx, obj)

        return true
    }
}

export class Water implements IGreenhouseStage {
    public type: GreenhouseStage = GreenhouseStage.Water
    private _waitGame: (player: PlayerMp) => Promise<boolean>
    private _resolve: Map<PlayerMp, (value?: boolean) => void> = new Map<PlayerMp, (value?: boolean) => void>()
    
    constructor(private readonly _greenhouse: Greenhouse) {
        this._waitGame = (player: PlayerMp): Promise<boolean> => {
            return new Promise<boolean>(resolve => {
                this._resolve.set(player, resolve)
            })
        }

        
    }

    public async startGameWithResult(player: PlayerMp, pointIdx: number): Promise<boolean> {
        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'can')
        CustomEvent.triggerCef(player, 'game:speed', pointIdx, 2 * player.farmWorker.level)
        
        return false
    }
}

export class Collection implements IGreenhouseStage {
    public type: GreenhouseStage = GreenhouseStage.Collection

    constructor(private readonly _greenhouse: Greenhouse) {
        this._greenhouse.objects.forEach(o => {
            o.model = mp.joaat(SUPPLIES_LIST[o.farmSupplyId].vegModel)
        })
    }
    
    public async startGameWithResult(player: PlayerMp, pointIdx: number): Promise<boolean> {
        this._greenhouse.objects.get(pointIdx)?.destroy()
        const supplyModel = SUPPLIES_LIST[this._greenhouse.objects.get(pointIdx).farmSupplyId]

        await this._greenhouse.stock.addItem(supplyModel.vegInventoryItemId)
        mp.events.call(FARM_COLLECT_EVENT, player, supplyModel.vegInventoryItemId)
        mp.events.call(FARM_TASK_MANAGER_EVENT, player, supplyModel.vegInventoryItemId, false)

        return true
    }
}

export const createGreenhouseStage = (greenhouse: Greenhouse, stageType: GreenhouseStage): IGreenhouseStage => {
    switch (stageType) {
        case GreenhouseStage.Water:
            return new Water(greenhouse)
        case GreenhouseStage.Collection:
            return new Collection(greenhouse)
        case GreenhouseStage.Landing:
            return new Landing(greenhouse)
    }
}