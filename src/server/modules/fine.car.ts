import {FINE_AIR_POS, FINE_CAR_POS} from "../../shared/fine.car";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {houses} from "./houses";
import {parking} from "./businesses/parking";
import {PARKING_START_COST} from "../../shared/parking";
import {Vehicle} from "./vehicles";
import {distinctArray} from "../../shared/arrays";

setTimeout(() => {
    FINE_CAR_POS.map(q => {
        system.createBlip(100, 28, q, 'Штрафстоянка')
    })
    FINE_AIR_POS.map(q => {
        system.createBlip(307, 28, q, 'Авиа Штрафстоянка')
    })
}, 1000)

const fineMenu = (player: PlayerMp, index: number, air = false) => {
    const user = player.user;
    if (!user) return;
    const poss = air ? FINE_AIR_POS : FINE_CAR_POS
    const cars = distinctArray(
        [...user.myVehicles, ...Vehicle.getVehiclesByPlayerKeys(player)],
        (vehicle) => vehicle.id).filter(q => q.onParkingFine && q.avia === air)
    if (user.family && user.family.house){
        let familyCars = user.family.cars.filter(q => q.onParkingFine && q.avia === air)
        if(familyCars.length > 0) cars.push(...familyCars)
    }
    if(cars.length === 0) return player.notify("У вас нет транспорта на штрафстоянке", "error");
    const m = menu.new(player, "Штрафстоянка");
    cars.map(veh => {
        m.newItem({
            name: `${veh.name}`,
            more: `$${system.numberFormat(veh.fine)}`,
            desc: `${veh.data.fine_reason || "Причина не известна"}`,
            onpress: async () => {
                if(veh.fine){
                    if(!(await user.tryPayment(veh.fine, 'card', () => veh.fine !== 0, 'Оплата штрафстоянки '+veh.name, 'Штрафстоянка'))) return;
                    else if(mp.players.exists(player)) player.notify("Штрафстоянка оплачена", "success");
                    veh.fine = 0;
                }
                veh.selectParkPlace(player).then(async place => {
                    if (!veh.onParkingFine) return;
                    if(!place) return player.notify("Чтобы забрать транспорт со штрафстоянки необходимо иметь парковочное место либо дом", "error");
                    const selectPlace = () => {
                        if(place.type === "house"){
                            return houses.getFreeVehicleSlot(place.id, veh.avia)
                        } else {
                            return parking.getFreeSlot(place.id)
                        }
                    }
                    if(place.type === "parking"){
                        await system.sleep(500);
                        if(!mp.players.exists(player)) return;
                        if (!(await user.tryPayment(PARKING_START_COST, 'card', () => !!selectPlace(), 'Оплата парковочного места ' + veh.name, 'Парковка '+place.id))) return player.notify('Необходимо оплатить парковку', 'error');
                        else if (mp.players.exists(player)) player.notify("Парковка оплачена", "success");
                    }
                    const pos = selectPlace();
                    veh.position = {
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                        d: pos.d,
                        h: pos.h,
                    }
                    if (!mp.vehicles.exists(veh.vehicle)) return;
                    if(!mp.players.exists(player)) return veh.respawn();
                    Vehicle.teleport(veh.vehicle, poss.map(q => new mp.Vector3(q.x, q.y, q.z + 1))[index], poss[index].h, player.dimension)
                    setTimeout(() => {
                        if (!mp.vehicles.exists(veh.vehicle)) return;
                        // Vehicle.teleport(veh.vehicle, poss.map(q => new mp.Vector3(q.x, q.y, q.z + 1))[index], poss[index].h, player.dimension)
                        if(!mp.players.exists(player)) return;
                        player.user.putIntoVehicle(veh.vehicle, 0);
                    }, 1000)

                })
            }
        })
    })
    m.open();
}

colshapes.new(FINE_CAR_POS.map(q => new mp.Vector3(q.x, q.y, q.z)), "Штрафстоянка", (player, index) => {
    fineMenu(player, index)
}, {
    type: 27,
    radius: 3,
    color: [207, 171, 23, 200]
})
colshapes.new(FINE_AIR_POS.map(q => new mp.Vector3(q.x, q.y, q.z)), "Штрафстоянка", (player, index) => {
    fineMenu(player, index, true)
}, {
    type: 27,
    radius: 5,
    color: [207, 171, 23, 200]
})