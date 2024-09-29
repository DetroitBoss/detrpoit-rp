import {CustomEvent} from "./custom.event";

import {
    BOX_GAME_MIN_PLAYERS_TO_START,
    BOX_GAME_POS_END,
    BOX_GAME_POS_START,
    BOX_GAME_START_TRY_INTERVAL,
    BOX_GAME_TIME_FOR_ROAD,
    BOX_GAME_TIME_FROM_START,
    BOX_GAME_WINS_VALUES
} from '../../shared/boxgame';
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {inventory} from "./inventory";
import {ItemEntity} from './typeorm/entities/inventory';
import {OWNER_TYPES} from "../../shared/inventory";
import {User} from "./user";
import {WinTaskCreate} from "./wintask";
import {DynamicBlip} from './dynamicBlip';

let boxGames: BoxGame[] = []


let minPlayersToStart = BOX_GAME_MIN_PLAYERS_TO_START

let sgTimeout: NodeJS.Timeout
const tryStartIntervalMins = (BOX_GAME_START_TRY_INTERVAL < 0) ? 0 : BOX_GAME_START_TRY_INTERVAL
let startGlobalTimeout = () => {
    if (!tryStartIntervalMins) return;
    sgTimeout = setTimeout(() => {
        if (mp.players.length >= minPlayersToStart && !BoxGame.isGameStarted) { // && system.randomArrayElement([1,2]) == 1) {
            (new BoxGame()).startCommand()
        }
        else startGlobalTimeout()
    }, 60000*tryStartIntervalMins);
}
startGlobalTimeout()



CustomEvent.registerClient('boxgame:bagEnd', (player: PlayerMp) => {
    if (!BoxGame.isGameStarted) return;
    boxGames.map((bg: BoxGame) => {
        if(bg.gameStarted) bg.onBagFinish(player)
    })
})

CustomEvent.register('player:teleport:start', (player: PlayerMp, x?:any, y?:any, z?:any, h?:any, d?:number) => {
    if (!BoxGame.isGameStarted) return;
    boxGames.map((bg: BoxGame) => {
        if(bg.gameStarted) bg.dropBag(player)
    })
})

CustomEvent.register('inventory:updateowner', (id:number) => {
    if (!BoxGame.isGameStarted) return;
    boxGames.map((bg: BoxGame) => {
        if(bg.gameStarted) bg.onItemOwnerUpdate(id)
    })
})

mp.events.add({
    'playerQuit': (player:PlayerMp) => {
        if (!BoxGame.isGameStarted) return;
        boxGames.map((bg: BoxGame) => {
            if(bg.gameStarted) bg.dropBag(player)
        })
    },
    'playerDeath': (player:PlayerMp) => {
        if (!BoxGame.isGameStarted) return;
        boxGames.map((bg) => {
            if(bg.gameStarted) bg.dropBag(player)
        })
    }
})



class BoxGame {


    static get isGameStarted(){
        return boxGames.find(q => q.gameStarted)
    }

    prop: ObjectMp = null
    colshape: colshapeHandle = null
    startTimer: NodeJS.Timeout = null
    startTime = BOX_GAME_TIME_FROM_START
    takingTime = 2
    startBlip: DynamicBlip = null
    roadTime = BOX_GAME_TIME_FOR_ROAD
    gameStarted = false
    takeTimer: number
    goingTimer: NodeJS.Timeout
    goingTimeout: NodeJS.Timeout

    isBoxTaking: PlayerMp = null

    endPosition: Vector3Mp = null
    
    currentBagItem: ItemEntity
    

    constructor() {
        boxGames.push(this)
    } 


    onItemOwnerUpdate(id:number) {
        if (!this.currentBagItem  || this.currentBagItem.id != id || this.currentBagItem.owner_type != OWNER_TYPES.PLAYER) return
        let target = User.get(this.currentBagItem.owner_id)
        if(target) this.setBoxEnd(target)
    }



    dropBag(player: PlayerMp, x?:any, y?:any, z?:any, h?:any, d?:number) {
        if (!player.user || !this.currentBagItem) return;
        if (this.currentBagItem.owner_type == OWNER_TYPES.PLAYER && this.currentBagItem.owner_id == player.user.id) {
            if (mp.players.exists(player)) {
                player.notify('Вы уронили сумку', 'error')
                player.user.boxgame_owner = false
                CustomEvent.triggerClient(player, "boxgame:stopBag")
            }
            inventory.placeItemOnGround(this.currentBagItem, player.user.dropPos, player.heading, player.dimension, false)
        }
    }

    /** Завершение игры при отвозе сумки игроком */
    onBagFinish(player: PlayerMp) {
        const user = player.user;
        if(!user) return;
        if(!this.currentBagItem) return system.debug.debug('No this.currentBagItem');
        const item = user.allMyItems.find(q => q.id === this.currentBagItem.id);
        if(!item) return system.debug.debug('No item in inventory');
        let wins = BOX_GAME_WINS_VALUES

        player.user.boxgame_owner = false
        inventory.deleteItem(item)
        this.currentBagItem = null;
        // let randomWinName = system.randomArrayElement(Object.keys(wins)) as keyof typeof wins

        let winNames: string[] = [];
        Object.values(wins).map((winValues,i) => {
            winNames.push( ...Array(winValues.percent).fill(Object.keys(wins)[i]) )           
        })
        let randomWinName = system.randomArrayElement(winNames) as keyof typeof wins


        this.destroyStartMisc()

        mp.players.toArray().filter(p => p.user && p.user.load && p.user.alertsEnabled.boxgame).map((pl) => {
            CustomEvent.triggerClient(pl, 'boxgame:readyStart', 3, `${user.name}`)
        })
        setTimeout(() => {
            CustomEvent.triggerClients('boxgame:readyStart', 0)
            this.gameStarted = false;
            startGlobalTimeout()
        }, 15000)
        WinTaskCreate(player, 'Доставить сумку', randomWinName, system.randomArrayElement(wins[randomWinName].items))
        if(this.goingTimeout) {
            clearTimeout(this.goingTimeout)
            this.goingTimeout = null;
        }

    }

    /** Запуск игры */
    startCommand() {
        mp.players.toArray().filter(p => p.user && p.user.load && p.user.alertsEnabled.boxgame).map((pl) => {
            CustomEvent.triggerClient(pl, 'boxgame:readyStart', 1, '', this.startTime) 
        })
        let randPos = BOX_GAME_POS_START[Math.floor(Math.random() * BOX_GAME_POS_START.length)] 
        this.prop = mp.objects.new('xm_prop_x17_bag_01d', new mp.Vector3(randPos.x, randPos.y, randPos.z-1), {
            dimension: 0
        })

        this.gameStarted = true;
    

        /** Таймер истекает в случае если никто не взял сумку с первого появления */
        this.startTimer = setTimeout(() => {
            CustomEvent.triggerClients('boxgame:readyStart', 0)
            this.destroyStartMisc()
            this.gameStarted = false;
            startGlobalTimeout()
        }, this.startTime * 1000);
    

     
        this.colshape = colshapes.new(new mp.Vector3(randPos.x, randPos.y, randPos.z), "Взять сумку", (player) => {
            const user = player.user
            if (player.vehicle) {
                user.notify('Вы должны быть не в транспорте', 'error')
            }
            else if (this.isBoxTaking) {
                if(this.isBoxTaking != player) user.notify('Кто-то из игроков уже поднимает сумку', 'error')
            } 
            else {
                this.isBoxTaking = player
                setTimeout(() => {
                    this.isBoxTaking = null
                }, this.takingTime*1000);
                user.playAnimationWithResult(['anim@heists@money_grab@duffel', 'loop'], this.takingTime, "Поднимаем сумку").then(isDone => {
                    if(!isDone) return;
                    if(!mp.players.exists(player)) return;
                    if (!this.colshape) user.notify('Сумку уже забрали', 'error')
                    else if(isDone) this.takeBox(player)
                    else user.notify('Вы не смогли поднять сумку', 'error')
                })
            }
        }, { color: [0, 0, 0, 0] , radius: 2})
        
        this.startBlip = system.createDynamicBlip('boxgame', 586, 48, new mp.Vector3(randPos.x, randPos.y, randPos.z), 'Сумка', {
            isForBoxGame: true,
            shortRange: false
        })
    }

    destroyStartMisc() {
        if (this.colshape) {
            this.colshape.destroy()
            this.colshape = null
        }
        if (this.prop) {
            this.prop.destroy()
            this.prop = null
        }
        if (this.startBlip) {
            this.startBlip.destroy()
            this.startBlip = null
        }
        if (this.startTimer) {
            clearTimeout(this.startTimer)
            this.startTimer = null
        }
        if (this.goingTimer) {
            clearInterval(this.goingTimer)
            this.goingTimer = null
        }
    }

    /** Запускается при первом поднятии сумки каким либо игроком */
    takeBox(player: PlayerMp) {
        const user = player.user
        if (!user) return;

        this.destroyStartMisc()


        /** Игра закончится по истечению таймаута
         * Таймаут включается при первом поднятии коробки каким либо игроком
         */
        this.goingTimeout = setTimeout(() => {
            startGlobalTimeout()
            CustomEvent.triggerClients('boxgame:readyStart', 0)
            this.destroyStartMisc()
            this.gameStarted = false;

            
            let item = this.currentBagItem
            if (item) {
                const target = User.get(item.owner_id)
                if (item.owner_type == OWNER_TYPES.PLAYER && target) {
                    CustomEvent.triggerClient(target, "boxgame:stopBag")
                    target.user.boxgame_owner = false
                }
                inventory.deleteItem(item)
                this.currentBagItem = null;

                this.gameStarted = false;
            }


        }, this.roadTime * 1000);

        mp.players.toArray().filter(p => p.user && p.user.load && p.user.alertsEnabled.boxgame).map((pl) => CustomEvent.triggerClient(pl, 'boxgame:readyStart', 2, '', this.roadTime))

        this.startGoingInterval()
        this.setBoxEnd(player)
    }

    updateBlip() {
        let pos = {x:0, y:0, z:0}
        if (this.currentBagItem.owner_type == OWNER_TYPES.WORLD) {
            pos.x = this.currentBagItem.x
            pos.y = this.currentBagItem.y
            pos.z = this.currentBagItem.z
        }
        else if (this.currentBagItem.owner_type == OWNER_TYPES.PLAYER) {
            if (!User.get(this.currentBagItem.owner_id)) return
            pos = User.get(this.currentBagItem.owner_id).position
        }
        else return;

        if (this.startBlip) this.startBlip.position = new mp.Vector3(pos.x, pos.y, pos.z)
        else {
            this.startBlip = system.createDynamicBlip('boxgame', 586, 48, new mp.Vector3(pos.x, pos.y, pos.z), 'Сумка', {
                isForBoxGame: true,
                shortRange: false
            })
        }
    }

    startGoingInterval() {
        this.goingTimer = setInterval(() => {
            this.updateBlip()
        }, 10000)
    }

    setBoxEnd(player: PlayerMp) {
        let user = player.user
        user.boxgame_owner = true

        if(!this.currentBagItem) {
            user.giveItem(863, true).then((item) => {
                this.currentBagItem = item
            })
        }

        player.user.notify('Доставьте сумку в место, указанное на карте')
        if (!this.endPosition) {
            let randPos = system.randomArrayElement(BOX_GAME_POS_END.filter(q => system.distanceToPos(q, player.position) > 200))
            this.endPosition = new mp.Vector3(randPos.x, randPos.y, randPos.z)
        }
        CustomEvent.triggerClient(player, "boxgame:takeBag", this.endPosition)
    }

}

export const BoxGameCreateAndRun = () => {
    if (BoxGame.isGameStarted) return;
    if (sgTimeout) {
        clearTimeout(sgTimeout)
        sgTimeout = null
    }
    new BoxGame().startCommand()
} 