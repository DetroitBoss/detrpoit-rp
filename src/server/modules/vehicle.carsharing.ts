import { colshapes } from './checkpoints'
import { CAR_SHARING_POS, SHARING_DURATION } from '../../shared/vehicle.carsharing'
import { system } from './system'
import {menu, MenuClass} from './menu'
import { CustomEvent } from './custom.event'
import { Vehicle } from './vehicles'
import {User} from "./user";
import {UserStatic} from "./usermodule/static";

class CarSharingManager {
    public init(): void {
        colshapes.new(new mp.Vector3(CAR_SHARING_POS.x, CAR_SHARING_POS.y, CAR_SHARING_POS.z), "Каршеринг", player => {
            if (!player.user) return;
            
            const m = new MenuClass(player, 'Каршеринг');
            m.newItem({
                name: 'Взять ТС в аренду',
                onpress: () => {
                    if (!player.user) return

                    let vehRentedByPlayer: Vehicle = null;
                    const availableToRentVehicles: Array<{id: number, name: string, cost: number}> = []
                    Vehicle.list.forEach(veh => {
                        if (!vehRentedByPlayer && veh.rentedBy == player.user)
                            vehRentedByPlayer = veh
                        if (!veh.rentedBy && veh.data.carSharing)
                            availableToRentVehicles.push({ id: veh.data.id, name: veh.model, cost: veh.data.carSharing.sharingCost })
                    })
                    
                    player.user.setGui("carSharing")
                    CustomEvent.triggerCef(player, 'carSharing:open', availableToRentVehicles, vehRentedByPlayer ? { id: vehRentedByPlayer.data.id, name: vehRentedByPlayer.model, cost: vehRentedByPlayer.data.carSharing.sharingCost } : null)
                }
            })
            
            m.newItem({
                name: 'Сдать свое ТС в аренду',
                onpress: () => {
                    const availableToRentVehicles = player.user.myVehicles
                        ?.filter(veh => !veh.data.carSharing && veh.data.cost > 0)
                    
                    if (!availableToRentVehicles?.length)
                        return player.notify('У вас нет ТС доступных для аренды')
                    
                    const m = new MenuClass(player, 'Выбор ТС');
                    availableToRentVehicles.forEach(veh => {
                        m.newItem({
                            name: `${veh.name} (${veh.number})`,
                            onpress: async () => {
                                const maxPrice = veh.data.cost > 5000000 ? 50000 : 30000
                                const price = Number(await menu.input(
                                    player,
                                    `Цена аренды в час (макс. ${maxPrice})`,
                                ))
                                if (isNaN(price) || price <= 0 || price > maxPrice)
                                    return player.notify('Ошибка ввода')
                                
                                veh.data.carSharing = {
                                    earnedMoney: 0,
                                    sharedTime: system.timestamp,
                                    sharingCost: price
                                }
                                
                                await veh.data.save();
                                m.close()
                            }
                        })
                    })
                    m.open();
                }
            })
            m.newItem({
                name: 'Снять ТС с аренды',
                onpress: () => {
                    const vehicles = player.user.myVehicles?.filter(veh => veh.data.carSharing)

                    if (!vehicles)
                        return player.notify('У вас нет ТС здесь')

                    const m = new MenuClass(player, 'Выбор ТС');
                    vehicles.forEach(veh => {
                        m.newItem({
                            name: `${veh.name} (${veh.number})`,
                            onpress: async () => {
                                if (veh.rentedBy) return player.notify("ТС находится в использовании", "error")
                                await this.cancelRent(veh)
                                m.close()
                            }
                        })
                    })
                    m.open();
                }
            })
            m.open()
        })
    }
    
    public async cancelRent(vehicle: Vehicle): Promise<void> {
        await UserStatic.addMoney(vehicle.owner, vehicle.data.carSharing.earnedMoney, "Заработано своем ТС в каршеринге")
        vehicle.data.carSharing = null
        vehicle.respawn()

        await vehicle.data.save()
    }
}

CustomEvent.register("newHour", () => {
    Vehicle.list.forEach(async veh => {
        if (veh.data?.carSharing?.sharedTime && system.timestamp > veh.data?.carSharing?.sharedTime + SHARING_DURATION * 60 * 60 * 1000) {
            veh.rentedBy = null
            await carsharingManager.cancelRent(veh)
        } else if (veh.rentedBy && veh.data?.carSharing?.sharedTime + 60 * 60 * 1000 < system.timestamp) {// Если прошел час с момента аренды
            if (veh.rentedBy.money < veh.data.carSharing.sharingCost || !veh.rentedBy.removeMoney(veh.data.carSharing.sharingCost, true, "Оплата каршеринга")) {
                veh.rentedBy = null
            } else {
                veh.data.carSharing = { ...veh.data.carSharing, earnedMoney: veh.data.carSharing.earnedMoney + veh.data.carSharing.sharingCost }
                await veh.data.save()
            }
        }
    })
})

mp.events.add('playerQuit', player => {
    if (!player.user) return;
    Vehicle.list.forEach(async veh => {
        if (veh.rentedBy == player.user) {
            veh.rentedBy = null
        }
    })
})

CustomEvent.registerCef("carSharing:rent", async (player, id: number) => {
    if (!player.user) return
    const veh = Vehicle.get(id)
    
    if (!veh || veh.rentedBy || !veh.data.carSharing) {
        return player.notify("ТС уже арендовано")
    }
    if (veh.rentedBy == player.user) {
        return player.notify("Это ТС принадлежит вам, откройте меню еще раз чтобы отменить аренду")
    }

    if (player.user.money < veh.data.carSharing.sharingCost) {
        return player.notify('У вас недостаточно средств для оплаты', 'error')
    }

    if (!player.user.removeMoney(veh.data.carSharing.sharingCost, true, "Оплата каршеринга")) {
        return player.notify("Недостаточно средств")
    }

    player.user.setGui(null);

    Vehicle.teleport(veh.vehicle, player.position, 0, 0)
    veh.rentedBy = player.user;
    veh.data.carSharing = { ...veh.data.carSharing, earnedMoney: veh.data.carSharing.earnedMoney + veh.data.carSharing.sharingCost }
    await veh.data.save()
})

CustomEvent.registerCef("carSharing:stopRent", async (player, id: number) => {
    if (!player.user) return
    const veh = Vehicle.get(id)

    if (!veh || veh.rentedBy != player.user) {
        return player.notify("Невозможно", "error")
    }

    veh.rentedBy = null
    veh.respawn()
    player.user.setGui(null)
})

export interface ICarSharingVehicleData {
    sharingCost: number
    sharedTime: number
    earnedMoney: number
}

const carsharingManager = new CarSharingManager()
carsharingManager.init()