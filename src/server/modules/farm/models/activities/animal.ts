import BaseActivity from './baseActivity'
import { ActivityType, FarmAnimal, FEED_LIST, IActivitySpot } from '../../../../../shared/farm/config'
import { system } from '../../../system'
import { CustomEvent } from '../../../custom.event'
import { FarmAnimalState, IAnimalWorkData, IFarmAnimal } from '../../../../../shared/farm/dtos'
import { ItemEntity } from '../../../typeorm/entities/inventory'
import { menu } from '../../../menu'
import { inventoryShared } from '../../../../../shared/inventory'
import { EXP_PER_ACTION, SALARY_PER_ACTION } from '../../../../../shared/farm/progress.config'
import {FARM_COLLECT_EVENT} from "../../events";
import {FARM_TASK_MANAGER_EVENT} from "../../../battlePass/tasks/farmTaskManager";

/**
 * Загон с животными на ферме
 */
export class Animal extends BaseActivity {
    private _animals: Array<IFarmAnimal> = []
    private _peds: Array<[number, PedMp]> = []
    
    constructor(spot: IActivitySpot) {
        super(ActivityType.Animal, spot)

        this.spot.animalPoints.map((point, idx) => {
            const animalModel = point[2] == FarmAnimal.Pig ? 'a_c_pig' : 'a_c_cow'
            this._peds.push([idx, system.createPed(system.getVector3Mp(point[0]), point[1], animalModel)])
            this._animals.push({
                id: idx,
                state: FarmAnimalState.Feed,
                feedCount: 0
            })
        })

        CustomEvent.registerCef('waterGame:finish', async (player, result: boolean, id: number) => {
            if (!this.workers.includes(player)) return
            if (!result) return
            const animal = this._animals.find(a => a.id == id)
            if (!animal) return

            const item_id = 9000
            await this.stock.addItem(item_id)
            mp.events.call(FARM_COLLECT_EVENT, player, item_id)
            mp.events.call(FARM_TASK_MANAGER_EVENT, player, item_id, false)

            player.farmWorker.addExp(EXP_PER_ACTION)
            player.farmWorker.addSalary(SALARY_PER_ACTION)

            animal.state = FarmAnimalState.Idle
            animal.feedCount = 0
            this._peds.find(p => p[0] == animal.id)[1]?.setVariable('cowGrease', 1)
            
            setTimeout(() => {
                if (animal.feedCount >= 100) {
                    animal.state = FarmAnimalState.Use
                } else {
                    animal.state = FarmAnimalState.Feed
                }
                this.updateAnimalData(animal)
            }, 15000)
        })
    }

    private async suggestFeed(player: PlayerMp): Promise<ItemEntity> {
        return new Promise(async (resolve, reject) => {
            const m = menu.new(player, '', 'Выберите корм');
            m.sprite = 'farm'
            m.onclose = () => {
                resolve(null)
            }
            player.user.inventory
                .filter(i => FEED_LIST.map(s => s.inventoryItemId).includes(i.item_id))
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
    
    public async onPlayerEnterWorkPoint(player: PlayerMp, id: number): Promise<void> {
        const animal = this._animals.find(a => a.id == id)
        if (!animal || animal.state == FarmAnimalState.Idle) 
            return player.notify('Животное не готово', 'error')
        
        switch (animal.state) {
            case FarmAnimalState.Feed:
                const feed = await this.suggestFeed(player)
                if (!feed) return
                
                const gameCompleted = await player.user.waitTimer(1, 5, `Используем ${inventoryShared.get(feed.item_id).name.toLowerCase()}`, ["anim@heists@money_grab@duffel", "loop", true])
                
                if (!gameCompleted) return

                mp.events.call(FARM_TASK_MANAGER_EVENT, player, 9101, true);
                
                animal.feedCount += FEED_LIST.find(f => f.inventoryItemId == feed.item_id)?.power ?? 10

                player.farmWorker.addExp(EXP_PER_ACTION)
                player.farmWorker.addSalary(SALARY_PER_ACTION)
                
                feed.useCount(1, player)
                animal.state = FarmAnimalState.Idle

                setTimeout(() => {
                    if (animal.feedCount >= 100) {
                        animal.state = FarmAnimalState.Use
                    } else {
                        animal.state = FarmAnimalState.Feed
                    }
                    this.updateAnimalData(animal)
                }, 15000)
                break;
            case FarmAnimalState.Use:
                player.user.setGui('farm')
                CustomEvent.triggerCef(player, 'farm:setComponent', 'milk')
                CustomEvent.triggerCef(player, 'game:speed', id, 2 * player.farmWorker.level)
                
                
                break;
        }
        this.updateAnimalData(animal)
        
        
    }

    private updateAnimalData(animal: IFarmAnimal): void {
        this.workers.map(worker => {
            CustomEvent.triggerClient(worker, 'farm:animal:update', animal)
        })
    }
    
    protected onPlayerStartedWork(player: PlayerMp): void {
        this.sendStageData([player])
    }

    private sendStageData(players: PlayerMp[]): void {
        players.forEach(player => {
            CustomEvent.triggerClient(player, 'farm:work:start', {
                id: this.id,
                animals: this._animals,
                type: this.type,
                points: this.spot.animalPoints.map(p => {
                    return {
                        pos: p[0],
                        processed: false
                    }
                })
            } as IAnimalWorkData)
        })
    }
    
    protected populatePoints(): void {
    }
}