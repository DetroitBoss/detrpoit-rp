import { IPetFullData, petsConfig, PetState } from '../../../shared/pets'
import { User } from '../user'
import { CustomEvent } from '../custom.event'
import { system } from '../system'
import { registerHookHandler } from '../../../shared/hooks'
import { INVENTORY_USE_ITEM_HOOK } from '../inventory'
import { ItemEntity } from '../typeorm/entities/inventory'
import { itemConfig } from '../../../shared/inventory'

class Pet {
    constructor(public data: IPetFullData) {
    }
}

class PetController {
    private _idCounter: number = 0
    public pets: Array<Pet> = []
    
    constructor() {
        registerHookHandler(INVENTORY_USE_ITEM_HOOK, (player: PlayerMp, item: ItemEntity, itemConfig: itemConfig) => {
            const petConf = petsConfig.find(p => p.itemId === itemConfig.item_id) 
            if (!petConf)
                return
            
            if (this.pets.find(p => p.data.controllerId == player.id))
                return player.user.notify('Вы уже управляете другой собакой')

            this.createPet(player, {
                controllerId: player.id,
                position: player.position.add(new mp.Vector3(1, 0, -0.51)),
                model: mp.joaat(petConf.modelHash),
                id: this._idCounter++,
                currentState: PetState.Stand
            })
        })

        mp.events.add("playerQuit", (player: PlayerMp, exitType: string, reason: string) => {
            if (!player.user) 
                return
            
            const controlledPet = this.pets.find(p => p.data.controllerId == player.id)
            if (!controlledPet)
                return

            mp.players
                .toArray()
                .filter(p => system.distanceToPos(p.position, controlledPet.data.position) <= 250)
                .forEach(p => CustomEvent.triggerClient(p, 'pet:delete', controlledPet.data))

            this.pets.splice(this.pets.indexOf(controlledPet), 1)
        })
        
        CustomEvent.registerClient('pet:loadForPlayer', (_, targetId: number, data: IPetFullData, vehicleId: number, seatIndex: number) => {
            const targetPlayer = mp.players.at(targetId)
            const pet = this.pets.find(p => p.data.id === data.id)
            
            pet.data.position = data.position
            
            if (!pet || !targetPlayer)
                return console.log(`Cannot create pet ${data.id} for player ${targetId}`)
            
            CustomEvent.triggerClient(targetPlayer, 'pet:create', pet.data, vehicleId, seatIndex)
        })

        CustomEvent.registerClient('pet:deleteForPlayer', (_, targetId: number, petId: number) => {
            const targetPlayer = mp.players.at(targetId)
            const pet = this.pets.find(p => p.data.id === petId)

            if (!pet || !targetPlayer)
                return console.log(`Cannot delete pet ${petId} for player ${targetId}`)

            CustomEvent.triggerClient(targetPlayer, 'pet:delete', pet.data)
        })

        CustomEvent.registerClient('pet:setIntoVehicle', (player, data: IPetFullData, vehicleId: number, seat: number) => {
            const pet = this.pets.find(p => p.data.id === data.id)

            if (!pet)
                return

            mp.players
                .toArray()
                .filter(p => p.user && p.dist(player.position) <= 250)
                .forEach(pl => CustomEvent.triggerClient(pl, 'pet:setIntoVehicle', data.id, vehicleId, seat))
        })

        CustomEvent.registerClient('pet:kickFromVehicle', (player, data: IPetFullData, vehicleId: number) => {
            const pet = this.pets.find(p => p.data.id === data.id)

            if (!pet)
                return

            mp.players
                .toArray()
                .filter(p => p.user && p.dist(player.position) <= 250)
                .forEach(pl => CustomEvent.triggerClient(pl, 'pet:kickFromVehicle', data.id, vehicleId))
        })

        CustomEvent.registerClient('pet:create', (player, data: IPetFullData) => {
            this.createPet(player, data)
        })
        
        CustomEvent.registerClient('pet:changeState', (player, petId: number, newState: PetState) => {
            const pet = this.pets.find(p => p.data.id === petId)
            
            pet.data.currentState = newState
            
            if (!pet) 
                return
            
            mp.players
                .toArray()
                .filter(p => p.user && p.dist(player.position) <= 250)
                .forEach(pl => CustomEvent.triggerClient(pl, 'pet:changeState', petId, newState))
        })

        CustomEvent.registerClient('pet:delete', (player, data: IPetFullData) => {
            const pet = this.pets.find(p => p.data.id === data.id)

            if (!pet)
                return

            mp.players
                .toArray()
                .filter(p => system.distanceToPos(p.position, data.position) <= 250)
                .forEach(p => CustomEvent.triggerClient(p, 'pet:delete', pet.data))
            
            this.pets.splice(this.pets.indexOf(pet), 1)
        })
    }
    
    public createPet(player: PlayerMp, data: IPetFullData): void {
        this.pets.push(new Pet(data))
        
        mp.players
            .toArray()
            .filter(p => system.distanceToPos(p.position, player.position) <= 250)
            .forEach(p => CustomEvent.triggerClient(p, 'pet:create', data))
    }
}

const petController = new PetController()