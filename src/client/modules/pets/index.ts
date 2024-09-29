import { Pet } from './pet'
import { IPetFullData, PetState } from '../../../shared/pets'
import { CustomEvent } from '../custom.event'
import { user } from '../user'
import { currentMenu, MenuClass } from '../menu'
import { system } from '../system'
import { inputOnFocus, terminalOpened } from '../gui'

CustomEvent.register('petControl', () => {
    if (!user.login) return
    if (currentMenu) return
    if (terminalOpened) return
    if (inputOnFocus) return
    
    if (!pets.find(pet => pet.data.controllerId === mp.players.local.remoteId))
        return user.notify('Сначала создайте собаку (Использовать предмет в инвентаре)', 'info')
    
    let m = new MenuClass('Управление питомцем', 'Действия')
    m.newItem({
        name: 'Сидеть',
        onpress: () => {
            const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
            pet?.changeCurrentState(PetState.Sit)
        }
    })
    m.newItem({
        name: 'Стоять',
        onpress: () => {
            const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
            pet?.changeCurrentState(PetState.Stand)
        }
    })
    m.newItem({
        name: 'Бежать за мной',
        onpress: () => {
            const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
            pet?.changeCurrentState(PetState.Follow)
        }
    })

    // m.newItem({
    //     name: 'Выслеживать добычу',
    //     onpress: () => {
    //         let nearestAnimal: EntityMp = null
    //         mp.peds.forEach(entity => {
    //             if (system.distanceToPos(entity.position, mp.players.local.position) > 200) {
    //                 return
    //             }
    //             if (!entity.getVariable('hunting'))
    //                 return
    //            
    //             if (system.distanceToPos(entity.position, mp.players.local.position) < system.distanceToPos(nearestAnimal?.position, mp.players.local.position)) {
    //                 nearestAnimal = entity
    //             }
    //         })
    //         if (!nearestAnimal && !nearestAnimal?.doesExist())
    //             return
    //        
    //         const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    //         pet?.followEntity(nearestAnimal)
    //        
    //         setTimeout(() => {
    //             pet.clearTasks()
    //             user.notify('Потерял след', 'info', 'CHAR_CHOP')
    //         }, 7000)
    //     }
    // })
    //
    m.newItem({
        name: 'Убрать',
        onpress: () => {
            const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
            
            if (!pet) 
                return

            pet.data.position = pet.coords
            
            CustomEvent.triggerServer('pet:delete', pet.data)
        }
    })
    
    m.open()
})

const pets: Array<Pet> = []

CustomEvent.registerServer('pet:create', async (data: IPetFullData, vehicleId: number, seat: number) => {
    const petToCreate = new Pet(data)
    await petToCreate.create()
    if (!vehicleId) {
        petToCreate.handleCurrentState()
    } else {
        petToCreate.putIntoAVehicle(mp.vehicles.atRemoteId(vehicleId), seat)
    } 
    
    pets.push(petToCreate)
})

CustomEvent.registerServer('pet:delete', async (data: IPetFullData) => {
    const pet = pets.find(p => p.data.id == data.id)
    
    if (!pet)
        return
    
    pet?.destroy()
    pets.splice(pets.indexOf(pet), 1)
})

CustomEvent.registerServer('pet:changeState', (petId: number, newState: PetState) => {
    const pet = pets.find(p => p.data.id === petId)
    
    if (!pet)
        return
    
    if (pet.data.controllerId == mp.players.local.remoteId)
        return
    
    pet.changeCurrentState(newState)
})

CustomEvent.registerServer('pet:setIntoVehicle', (petId: number, vehicleId: number, seat: number) => {
    const pet = pets.find(p => p.data.id === petId)

    if (!pet)
        return

    if (pet.data.controllerId == mp.players.local.remoteId)
        return

    const veh = mp.vehicles.atRemoteId(vehicleId)
    if (!veh)
        return
    
    pet.putIntoAVehicle(veh, seat)
})

CustomEvent.registerServer('pet:kickFromVehicle', (petId: number, vehicleId: number) => {
    const pet = pets.find(p => p.data.id === petId)

    if (!pet)
        return

    if (pet.data.controllerId == mp.players.local.remoteId)
        return

    const veh = mp.vehicles.atRemoteId(vehicleId)
    if (!veh)
        return

    pet.kickFromVehicle(veh)
})

mp.events.add('entityStreamIn', async (player: PlayerMp) => {
    if (!mp.players.exists(player))
        return
    
    // Собакен которым владеет игрок
    const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    if (!pet)
        return
    
    const vehicle = mp.vehicles.atHandle(pet.vehicle)
    
    pet.data.position = pet.coords
    CustomEvent.triggerServer('pet:loadForPlayer', player.remoteId, pet.data, vehicle ? vehicle.remoteId : 0, pet.lastVehicleSeat)
})

mp.events.add('entityStreamOut', async (player: PlayerMp) => {
    if (!mp.players.exists(player))
        return
    
    // Собакен которым владеет игрок
    const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    if (!pet)
        return
    
    CustomEvent.triggerServer('pet:deleteForPlayer', player.remoteId, pet.data.id)
})

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number) => {
    if (!mp.vehicles.exists(vehicle)) return

    const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    if (!pet)
        return
    
    pet.putIntoAVehicle(vehicle, seat + 1)
})

mp.events.add('playerLeaveVehicle', (vehicle) => {
    if (!mp.vehicles.exists(vehicle)) return

    const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    if (!pet)
        return
    
    pet.kickFromVehicle(vehicle)
})

let lastDim = 0
setInterval(() => {
    if (!user.login) 
        return
    
    const pet = pets.find(pet => pet.data.controllerId === mp.players.local.remoteId)
    if (!pet)
        return
    
    if (system.distanceToPos(pet.coords, mp.players.local.position) >= 100 || mp.players.local.dimension != lastDim) {
        
        pet.data.position = pet.coords
        
        CustomEvent.triggerServer('pet:delete', pet.data)
        
        pet?.destroy()
        pets.splice(pets.indexOf(pet), 1)
        
        user.notify('Ваш питомец потерялся', 'error', 'CHAR_CHOP')
    }
    lastDim = mp.players.local.dimension
}, 1000)