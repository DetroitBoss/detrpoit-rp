import {AntiCheatUserData, weapon_hashes} from "../../shared/anticheat";
import {clearAllWeapons, myWeapons, myWeaponsHash, myWeaponsHashStr, nowPutIntoVehicle, user} from "./user";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {blockShootSaveZoneStatus} from "./savezone";

const player = mp.players.local

let vehicles: VehicleMp[];
let players: PlayerMp[];

setInterval(() => {
    vehicles = mp.vehicles.toArray().filter(veh => veh.handle && veh.getSpeed() > 3);
    players = mp.players.toArray().filter(q => q.handle && q != player && !q.vehicle)
    players.map(player => player.setSuffersCriticalHits(false))
    player.setSuffersCriticalHits(false)
}, 300)


mp.events.add('render', () => {
    if(player.dimension) return;
    vehicles?.map(veh => {
        if(!mp.vehicles.exists(veh) || !veh.handle) return;
        mp.game.invoke('0xA53ED5520C07654A', player.handle, veh.handle, true)
        mp.game.invoke('0xA53ED5520C07654A', veh.handle, player.handle, true)
    })
    players?.map(player => {
        if(!mp.players.exists(player) || !player.handle) return;
        vehicles.map(veh => {
            if(!mp.vehicles.exists(veh) || !veh.handle) return;
            mp.game.invoke('0xA53ED5520C07654A', player.handle, veh.handle, true)
            mp.game.invoke('0xA53ED5520C07654A', veh.handle, player.handle, true)
        })
    });
})

let anticheatProtectList: AntiCheatUserData = {}

let lastTeleportPos: Vector3Mp;

let lastPosition: Vector3Mp;

let lastTeleportTime = 0;



mp.events.add('teleport', (x: number, y: number, z: number) => {
    teleportAnticheat(x,y,z)
})

mp.events.add('teleportVisible', (h?: number, pos?: [number, number, number]) => {
    if(!pos) return;
    teleportAnticheat(...pos)
})

export const teleportAnticheat = (x: number, y: number, z: number) => {
    lastTeleportTime = system.timestamp;
    lastTeleportPos = new mp.Vector3(x,y,z);
    const q = {...lastTeleportPos}
    setTimeout(() => {
        if(!lastTeleportPos) return;
        if(lastTeleportPos.x !== q.x || lastTeleportPos.y !== q.y) return;
        lastTeleportPos = null;
    }, system.TELEPORT_TIME + 1000)
}

// let lastVehiclesPos = new Map<number, Vector3Mp>()
//
// setInterval(() => {
//     if(!user.login) return;
//     if(sendAnticheat) return;
//     mp.vehicles.forEachInStreamRange(vehicle => {
//         if(!vehicle.handle) return;
//         if(player.vehicle === vehicle) return;
//         const max = vehicle.getMaxNumberOfPassengers();
//         let free = true;
//         for(let seat = -1; seat < max; seat++){
//             if(free && !vehicle.isSeatFree(seat)) free = false;
//         }
//         if(!free) return;
//         const id = vehicle.remoteId;
//         const position = vehicle.position;
//
//         if(lastVehiclesPos.has(id) && system.distanceToPos(lastVehiclesPos.get(id), position) > 50){
//             if(!sendAnticheat){
//                 CustomEvent.triggerServer('anticheat:vehicletp', id)
//                 sendAnticheat = true;
//                 setTimeout(() => {
//                     sendAnticheat = false;
//                 }, 1000)
//             }
//         }
//
//
//         lastVehiclesPos.set(id, position)
//     })
// }, 500)


let lastVehicle: VehicleMp;
// @ts-ignore
setInterval(() => {
    const veh = player.vehicle
    if(veh == lastVehicle) return;
    if(!veh && lastVehicle) return lastVehicle = null;
    if(!lastVehicle && veh){
        lastVehicle = veh;
        const locked = veh.getVariable('locked')
        if(locked){
            if(!nowPutIntoVehicle){
                if(veh.lastLockedTime && system.timestamp - veh.lastLockedTime < 2) return;
                user.cheatDetect('entervehicle', `Попал в закрытый ТС`);
            }
        }
    }
}, 100)

export const anticheatProtect = (key: keyof AntiCheatUserData, time: number = 5000) => {
    if(!anticheatProtectList[key]) anticheatProtectList[key] = 0;
    anticheatProtectList[key]++;
    setTimeout(() => {
        anticheatProtectList[key]--;
    }, time)
}

CustomEvent.registerServer('anticheatProtect', (key: keyof AntiCheatUserData, time: number) => {
    anticheatProtect(key, time);
})

CustomEvent.registerServer('anticheatProtects', (keys: (keyof AntiCheatUserData)[], time: number) => {
    keys.map(key=> {
        if(!anticheatProtectList[key]) anticheatProtectList[key] = 0;
        anticheatProtectList[key]++;
        setTimeout(() => {
            anticheatProtectList[key]--;
        }, time)
    })

    setTimeout(() => {
        keys.map(key=> {
            anticheatProtectList[key]--;
        })
    }, time)
})


setInterval(() => {
    if(!user.login) return;
    let tm = system.timestamp
    setTimeout(() => {
        let tm2 = system.timestamp
        if(tm2 - tm < 4.3) user.cheatDetect('memory', `Увеличение скорости всех ресурсов игры через CheatEngine или подобное`)
    }, 5000)
}, 10000)

let lastHp = 100;
let lastArmour = 100;
setInterval(() => {
    if(!user.login) return;

    const newposition = player.position;

    if(anticheatProtectList.teleport || user.isAdminNow() || !lastPosition || (player.vehicle && player.vehicle.getPedInSeat(-1) && player.vehicle.getPedInSeat(-1) != player.handle) || (player.vehicle && player.vehicle.autosalon)) {
        lastPosition = newposition;
    } else {
        const dist = lastPosition.z < -100 ? system.distanceToPos2D(lastPosition, newposition) : system.distanceToPos(lastPosition, newposition)
        if(dist > 100){
            if(!lastTeleportPos || system.distanceToPos(newposition, lastTeleportPos) > 50){
                user.cheatDetect('teleport', `С ${lastPosition.x.toFixed(0)} ${lastPosition.y.toFixed(0)} ${lastPosition.z.toFixed(0)} на ${newposition.x.toFixed(0)} ${newposition.y.toFixed(0)} ${newposition.z.toFixed(0)}. Расстояние ${dist.toFixed(0)}м. Последняя телепортация была ${lastTeleportTime ? `${system.timestamp - lastTeleportTime} сек. назад` : 'не было'}`);
            }
        }
        lastPosition = newposition;
    }

    // Health check
    let current = player.getHealth()
    if(current < 0) current = 0;
    const superLastHp = lastHp
    if(current > lastHp) {
        setTimeout(() => {
            if(anticheatProtectList.heal) return;
            user.cheatDetect('heal', `Было ${superLastHp}HP стало ${current}HP`);
        }, 1000)
    }
    lastHp = current



    // Armour check
    const currentArmour = player.getArmour()
    const superLastArmour = lastArmour
    if(currentArmour > lastArmour && !anticheatProtectList.armour) {
        setTimeout(() => {
            if(anticheatProtectList.armour) return;
            user.cheatDetect('armour', `Было ${superLastArmour}AP стало ${currentArmour}AP`);
        }, 3000)
    }
    lastArmour = currentArmour
}, 200);


mp.events.add('render', () => {
    if(!user.login) return;
    const current = mp.game.invoke('0x0A6DB4965674D243', player.handle);
    if(!weapon_hashes.find(q => q[1] == current)){
        if(player.isUsingAnyScenario()) return;
        if(myWeapons) return;
        player.removeAllWeapons();
        player.giveWeapon(-1569615261, 1, true);
    } else {
        if(current !== -1569615261 && !player.isUsingAnyScenario() && myWeapons != current) {
            user.cheatDetect('weapon', current);
            clearAllWeapons();
        } else if(current === -1569615261 && myWeapons){
            player.giveWeapon(myWeapons, 0, true)
        } else if(myWeaponsHash && myWeaponsHash != system.encryptCodes(myWeapons.toString(), myWeaponsHashStr)){
            user.cheatDetect( 'memory', "Подмена данных оружия");
            clearAllWeapons();
        } else {
            if(blockShootSaveZoneStatus() && player.isShooting()){
                user.cheatDetect( 'weapon', 'Стрельба в ЗЗ без доступа');
                clearAllWeapons();
            }
        }
    }

})

mp.events.add('render', () => {
    const veh = player.vehicle;
    if(veh){
        const engine = veh.getVariable('engine');
        if (!engine && !veh.autosalon) {
            if(veh.getIsEngineRunning()){
                veh.setEngineOn(false, true, false)
                veh.setUndriveable(true)
                setTimeout(() => {
                    if(mp.vehicles.exists(veh) && veh.handle && !veh.getVariable('engine') && veh.getIsEngineRunning()){
                        user.cheatDetect('vehicleengine', 'Взлом двигателя ТС')
                    }
                }, 800)
            }
        }
    }
})