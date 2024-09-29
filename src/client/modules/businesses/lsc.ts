import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {
    LSC_WHEEL_COLOR_MODS,
    LSC_WHEELS,
    lscBrakeUpgrades,
    lscEngineUpgrades,
    lscNumberUpgrades,
    lscSuspensionUpgrades,
    lscTintUpgrades,
    lscTransmissionUpgrades,
    lscUpgrade,
    lscXenonColorUpgrades, vehicleModItemBase,
} from "../../../shared/lsc";
import {gui} from "../gui";
import {is_drift_model} from "../../../shared/drift";

const player = mp.players.local;

let lscConfig: vehicleModItemBase[] = []

export const getVehicleMod = (id: number) => {
    return lscConfig.find(q => q.id === id);
}

CustomEvent.registerServer('lsc:load', (configFromServer: vehicleModItemBase[]) => {
    lscConfig = configFromServer
})

CustomEvent.registerServer('lsc:updateCost', (slotId: number, newValue: number) => {
    if (newValue < 0 || newValue > 9999999) return
    lscConfig.find(c => c.id == slotId).cost = newValue
})

let isLocal = false
mp.events.add('setLogin', (a,b,ip) => {
    if(ip == '127.0.0.1') isLocal = true
})

let lscOpened = false;
let addVehicle:VehicleMp = null

let lscShopID: number;
let lscVehicleID: number;
let lscPosition: Vector3Mp;

let healthed = false

let phi = 25,
    theta = -15,
    phim = 0,
    thetam = 0,
    lastX = 0,
    lastY = 0;


const degToRad = Math.PI/180;

let camera: CameraMp;

if(!camera || !mp.cameras.exists(camera)) {
    camera = mp.cameras.new('lsc', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 40)
}



const switchTuningColor = (vehicle:VehicleMp, elementID:number, r:number, g:number, b:number) => {
    let element = lscConfig.find(e => e.id == elementID)
    if(!element || !vehicle || !mp.vehicles.exists(vehicle) || !vehicle.handle) return;
    if(elementID == 1000) vehicle.setCustomPrimaryColour(r, g, b)
    if(elementID == 1001) vehicle.setCustomSecondaryColour(r, g, b)
    if(elementID == 4004) vehicle.setNeonLightsColour(r, g, b)
    if(elementID == 3002) vehicle.setTyreSmokeColor(r, g, b)
}


const switchTuning = (vehicle:VehicleMp, elementID:number, value:number) => {
    let element = lscConfig.find(e => e.id == elementID)
    if(!element || !vehicle || !mp.vehicles.exists(vehicle) || !vehicle.handle) return;
    if(elementID >= 0 && elementID <= 62) {
        vehicle.setMod(elementID, value);
        if (elementID == 14 && vehicle) setTimeout( async() => {
            if(addVehicle && addVehicle.handle) {
                addVehicle.setMod(elementID, value);
                addVehicle.startHorn(3000, mp.game.joaat("HELDDOWN"), false)
            }
        }, 100)
    }
    // if(elementID == 1002) {
    //     addVehicle.setMod(48, value);
    // }
    if(elementID == 4000) vehicle.setNeonLightEnabled(0, value != -1)
    if(elementID == 4001) vehicle.setNeonLightEnabled(1, value != -1)
    if(elementID == 4002) vehicle.setNeonLightEnabled(2, value != -1)
    if(elementID == 4003) vehicle.setNeonLightEnabled(3, value != -1)

    if(elementID == 1007) vehicle.setNumberPlateTextIndex(value)
    if(elementID == 55) vehicle.setWindowTint(value)
    if(elementID == 1008) mp.game.invoke("0xE41033B25D003A07", vehicle.handle, value) // _SET_HEADLIGHT_COLOR
    let colours = vehicle.getColours(0,0)
    if(elementID == 1000 || elementID == 1005) vehicle.setColours(value, colours.colorSecondary)
    if(elementID == 1001 || elementID == 1006) vehicle.setColours(colours.colorPrimary, value)
    if(elementID == 3000) vehicle.setExtraColours(0, value)
    if(elementID == 2999) vehicle.setWheelType(value)
    if(elementID == 3001) vehicle.toggleMod(20, value != -1)
}

mp.events.add('lsc:switchTuningColor', (elementID, r, g, b) => {
    switchTuningColor(player.vehicle, elementID, r, g, b)
})

mp.events.add('lsc:switchTuningColorMod', (elementID, value: number) => {
    switchTuning(player.vehicle, elementID, value)
})

mp.events.add('lsc:switchTuning', (elementID, value) => {
    switchTuning(player.vehicle, elementID, value)
})

mp.events.add('lsc:switchWheel', (type, wheel) => {
    switchTuning(player.vehicle, 2999, type)
    switchTuning(player.vehicle, 62, wheel)
})

mp.events.add('lsc:stop', (sendServer) => {
    stopLsc(sendServer)
})

mp.events.add('lsc:switchTuningContainWheel', (elementID:number, lastWheelType:number, lastWheel:number) => {
    switchTuning(player.vehicle, 2999, lastWheelType)
    // switchTuning(player.vehicle, 62, lastWheel)
    newContain(elementID, 62, lastWheel)
})

const newContain = (elementID:number, lastElementID:number, lastElementValue:number, colorR?:number, colorG?:number, colorB?:number, colorMod?:number) => {
    const vehicle = player.vehicle
    if(!vehicle) return;
    const lastVehMod = lscConfig.find(q => q.id == lastElementID)
    if(lastVehMod) {
        if(lastVehMod.isColor) {
            switchTuningColor(player.vehicle, lastElementID, colorR, colorG, colorB)
            if(lastVehMod.isColorMod) switchTuning(player.vehicle, lastElementID, colorMod)
        }
        else switchTuning(player.vehicle, lastElementID, lastElementValue)
    }

    if(lastElementID == 5 || (lastElementID >= 27 && lastElementID <= 35)) {
        vehicle.setDoorShut(0, false)
        vehicle.setDoorShut(1, false)
    }
    if( (lastElementID >= 39 && lastElementID <= 41)) {
        vehicle.setDoorShut(4, false)
    }
    if(lastElementID == 42 || lastElementID == 22 || lastElementID == 1008) {
        vehicle.setLights(0)
    }

    if(elementID == 5 || (elementID >= 27 && elementID <= 35)) {
        vehicle.setDoorOpen(0, false, false)
        vehicle.setDoorOpen(1, false, false)
    }
    if((elementID >= 39 && elementID <= 41)) {
        vehicle.setDoorOpen(4, false, false)
    }
    if(elementID == 42 || elementID == 22 || elementID == 1008) {
        vehicle.setLights(2)
    }
}

mp.events.add('lsc:switchTuningContain', (elementID, lastElementID, lastElementValue, colorR?:number, colorG?:number, colorB?:number, colorMod?:number) => {
    newContain(elementID, lastElementID, lastElementValue, colorR, colorG, colorB, colorMod)
})


mp.events.add('lsc:healthed', () => {
    healthed = true
})

export const stopLsc = (sendServer?:boolean) => {
    if (lscOpened) {
        mp.players.local.vehicle?.freezePosition(false);
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        lscOpened = false
        if (addVehicle && addVehicle.handle && addVehicle.dimension == player.dimension) addVehicle.destroy()
        if (sendServer) CustomEvent.triggerServer('lsc:exit', lscShopID, lscVehicleID, healthed)
        else CustomEvent.triggerServer('lsc:release', lscShopID)
    }
}

const lscOpen = async (vehicleCost: number, currentTuning: [number,number][], businessItems: { item: number, price: number, count: number, max_count: number }[]) => {
    if(!player.vehicle) return
    if(lscOpened) return
    const veh = player.vehicle
    veh.freezePosition(true);

    if(!mp.vehicles.exists(addVehicle) || !addVehicle || !addVehicle.handle) {
        const createVehicle = async () => {
            addVehicle =  mp.vehicles.new(veh.model, new mp.Vector3(veh.position.x, veh.position.y+4, veh.position.z), {
                dimension: player.dimension
            })
            while(!addVehicle.handle) {
                await system.sleep(50)
            }
            addVehicle.setAlpha(0)
            addVehicle.setNoCollision(player.vehicle.handle, false)
        }
        createVehicle()
    }

    let lscUpgrade:lscUpgrade[] = []
    let WHEELS = -1
    let WHEELS_TYPE = null
    let wheelMultiplier = 1000
    lscConfig.map(vm => {
        if(vm.target == 'bike' && !mp.game.vehicle.isThisModelABike(player.vehicle.model)) return;
        if(vm.target == 'car' && !mp.game.vehicle.isThisModelACar(player.vehicle.model)) return;
        if(vm.id == 3004 && !is_drift_model(veh.getVariable('modelname'))) return
        let elements = [ ]

        const bizItem = businessItems.find(i => i.item == vm.id)
        const currentTuningItem = currentTuning.find(ct => ct[0] == vm.id)

        const pushDefault = (elms: {name: string, value: number, percent: number}[], def: number) => {
            elms.map(t => {
                elements.push({
                    id: t.value,
                    name: t.name,
                    percent: t.percent,
                    isUsed: currentTuningItem ? currentTuningItem[1] == t.value : (t.value == def)
                })
            })
        }


        if(vm.id == 55) pushDefault([...lscTintUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), -1) // тонировка
        //else if(vm.id == 16 && veh.getNumMods(16)) pushDefault(lscArmourUpgrades, -1) // броня
        else if(vm.id == 15) pushDefault([...lscSuspensionUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), -1)  // ПОДВЕСКА
        else if(vm.id == 13) pushDefault([...lscTransmissionUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), -1)
        else if(vm.id == 12) pushDefault([...lscBrakeUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), -1)
        else if(vm.id == 11) {
            pushDefault([...lscEngineUpgrades].map(el => {
                return {...el, percent: el.percent + bizItem.price}
            }), -1)}
        else if(vm.id == 1007) pushDefault([...lscNumberUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), 0)
        else if(vm.id == 1008) pushDefault([...lscXenonColorUpgrades].map(el => {
            return {...el, percent: el.percent + bizItem.price}
        }), -1)

        else if(vm.id == 14 && veh.getNumMods(14)) {
            elements.push({
                id: -1,
                name: 'Стандартный',
                percent: Math.round( bizItem.price / 2),
                isUsed: currentTuningItem ? currentTuningItem[1] == -1 : true
            })
            for(let i=0, l = veh.getNumMods(14); i<l; i++) {
                elements.push({
                    id: i,
                    name: `Клаксон ${i+1}`,
                    percent: bizItem.price,
                    isUsed: currentTuningItem ? currentTuningItem[1] == i : false
                }) //
            }
        }

        else if(vm.id == 2999) {
            WHEELS_TYPE = currentTuningItem && LSC_WHEELS.find(w => w.type == currentTuningItem[1]) ? currentTuningItem[1] : 0
            return
        }
        else if(vm.id == 62) {
            WHEELS = currentTuningItem && LSC_WHEELS.find(w => w.type == (currentTuning.find(ct => ct[0] == 2999) ? currentTuning.find(ct => ct[0] == 2999)[1] : 0)) &&
            LSC_WHEELS.find(w => w.type == (currentTuning.find(ct => ct[0] == 2999) ? currentTuning.find(ct => ct[0] == 2999)[1] : 0)).elements.find(wh => wh[1] == currentTuningItem[1]) ? currentTuningItem[1] : -1
            wheelMultiplier = bizItem.price
            return
        }
        else if(vm.id == 3000) {
            LSC_WHEEL_COLOR_MODS.map(t => {
                elements.push({
                    id: t.index,
                    name: t.name,
                    percent: bizItem.price,
                    isUsed: currentTuningItem ? currentTuningItem[1] == t.index : (t.index == 0)
                })
            })
        }

        else if(veh.getNumMods(vm.id) == 1 || vm.id == 22 || vm.id == 18 || vm.id == 4000 || vm.id == 4001 || vm.id == 4002 || vm.id == 4003 || vm.id == 3001 || vm.id == 3004) {
            let isUsed = currentTuningItem ? currentTuningItem[1] != -1 : false

            elements.push({
                id: -1,
                name: 'Отключено',
                isUsed: isUsed == false,
                percent: Math.round( bizItem.price / 2)
            })
            elements.push({
                id: 0,
                isUsed: isUsed == true,
                name: 'Включено',
                percent: bizItem.price
            })
        }
        else {
            for (let q = 0, l = veh.getNumMods(vm.id); q < l; q++) {
                const label = veh.getModTextLabel(vm.id, q);
                if (!label || label.toUpperCase() == "NULL") continue;
                let rulabel = mp.game.ui.getLabelText(label);
                if (!rulabel || rulabel.toUpperCase() == "NULL") rulabel = `Вариант ${q+1}`
                elements.push({
                    id: q,
                    name: rulabel.replace(/"/g, '').replace(/'/g, ''),
                    percent: bizItem.price,
                    isUsed: currentTuningItem ? currentTuningItem[1] == q : (q == -1)
                })
            }
            if(elements.length) {
                elements.unshift({
                    id: -1,
                    name: 'Стандарт',
                    percent: Math.round(bizItem.price / 2),
                    isUsed: currentTuningItem ? currentTuningItem[1] == -1 : true
                })
            }
        }
        if(vm.isColor) elements = [ {id: 0, name: 'Цвет', percent: bizItem.price} ]
        if(!elements.length) return;
        let arrayToPush:any = {
            id: vm.id,
            name: vm.name,
            section_type: vm.sector,
            elements: elements,
            isColor: vm.isColor,
            isWheelType: vm.isWheelType,
            isWheelTypeValue: vm.isWheelTypeValue,
            isColorMod: vm.isColorMod,
            bizItemPrice: bizItem.price,
            available: bizItem.count > 0
        }
        if(vm.isColorMod) {
            if(vm.id == 1000) arrayToPush.colorMod = currentTuning.find(ct => ct[0] == 1005) ? currentTuning.find(ct => ct[0] == 1005)[1] : 0
            else if(vm.id == 1001) arrayToPush.colorMod = currentTuning.find(ct => ct[0] == 1006) ? currentTuning.find(ct => ct[0] == 1006)[1] : 0
        }
        if(vm.isColor) {
            if(vm.id == 1000) arrayToPush.color = veh.getVariable('primaryColor') ? {r: veh.getVariable('primaryColor')[0], g: veh.getVariable('primaryColor')[1], b: veh.getVariable('primaryColor')[2]} : veh.getCustomPrimaryColour(0, 0, 0)
            else if(vm.id == 1001) arrayToPush.color = veh.getVariable('secondaryColor') ? {r: veh.getVariable('secondaryColor')[0], g: veh.getVariable('secondaryColor')[1], b: veh.getVariable('secondaryColor')[2]} : veh.getCustomSecondaryColour(0, 0, 0)
            else if(vm.id == 4004) {
                arrayToPush.color = veh.getVariable('neonColor') ? {r: veh.getVariable('neonColor')[0], g: veh.getVariable('neonColor')[1], b: veh.getVariable('neonColor')[2]} : veh.getNeonLightsColour(0, 0, 0)
            }
            else if(vm.id == 3002) arrayToPush.color = veh.getVariable('tyreSmokeColor') ? {r: veh.getVariable('tyreSmokeColor')[0], g: veh.getVariable('tyreSmokeColor')[1], b: veh.getVariable('tyreSmokeColor')[2]} : veh.getTyreSmokeColor(0, 0, 0)
            else arrayToPush.color = {r:0,g:0,b:0}
        }
        lscUpgrade.push( arrayToPush)
    })

    gui.setGui('lsc')

    const need_repair = veh.isDamaged()
    healthed = !need_repair;
    CustomEvent.triggerCef('lsc:start', lscUpgrade,  veh.getVariable('modelname')||'', lscShopID, lscVehicleID, vehicleCost, WHEELS_TYPE, WHEELS, need_repair, wheelMultiplier)
    lscOpened = true
    camera?.pointAt(player.vehicle.handle, 0, 0, 0, true)
}

mp.events.add('entityStreamIn', (entity:EntityMp) => {
    if(entity.isAVehicle()) {
        newTuningData(<VehicleMp>entity, entity.getVariable('tuningData'))
    }
});


mp.events.addDataHandler('tuningData', function (entity:VehicleMp, value, oldValue) {
    if (entity.handle && entity.isAVehicle()) {
        newTuningData(entity, value)
    }
})



const newTuningData = (vehicle:VehicleMp, elements:[number,number][]) => {
    if(!vehicle) return;
    if(mp.game.vehicle.isThisModelABike(vehicle.getModel())) switchTuning(vehicle, 2999, 6)
    if(!elements || !elements.length) return;
    switchTuning(vehicle, 4000,-1)
    switchTuning(vehicle, 4001,-1)
    switchTuning(vehicle,4002, -1)
    switchTuning(vehicle, 4003,-1)
    for(let i = 0, l = elements.length; i < l; i++) {
        switchTuning(vehicle, elements[i][0], elements[i][1])
    }
    if(elements.find(e => e[0] == 62)) switchTuning(vehicle, 62, elements.find(e => e[0] == 62)[1])

    setTimeout(() => {
        if(!vehicle || !mp.vehicles.exists(vehicle) || !vehicle.handle) return;
        let tyreSmokeColor = vehicle.getVariable('tyreSmokeColor')
        if(tyreSmokeColor && tyreSmokeColor.length == 3) {
            switchTuningColor(vehicle, 3002, tyreSmokeColor[0], tyreSmokeColor[1], tyreSmokeColor[2])
        }
        let neonColor = vehicle.getVariable('neonColor')
        if(neonColor && neonColor.length == 3) {
            switchTuningColor(vehicle, 4004, neonColor[0], neonColor[1], neonColor[2])
        }
    }, 2000)
}


let leftDown = false
let rightDown = false
let downPos = [0, 0]

setInterval(() => {
    if(!lscOpened) return;

    mp.game.cam.renderScriptCams(true, false, 0, false, false);
    camera.setActive(true)
    const cursorPos = mp.gui.cursor.position
    const resolution = mp.game.graphics.getScreenActiveResolution(0,0)

    if(!mp.keys.isDown(0x02)) {
        if (rightDown) rightDown = false
    }
    else {
        if(!player.vehicle) return;
        if(!rightDown) {
            if(!(mp.gui.cursor.position[0]*100/resolution.x >= 27 && mp.gui.cursor.position[0]*100/resolution.x < 78) || !(mp.gui.cursor.position[1]*100/resolution.y <= 90)) return;
            rightDown = true
            downPos = mp.gui.cursor.position
        }
        if(!rightDown) return;
        if(cursorPos[0] != lastX || cursorPos[1] != lastY) {
            //cursorPos[0]-lastX
            let newFov = system.smallestNumber( system.biggestNumber(10, camera.getFov() + (cursorPos[1]-lastY)*0.3), 80)
            camera.setFov(newFov)
        }
    }


    if(!mp.keys.isDown(0x01)) {
        if (leftDown) leftDown = false
    }
    else {
        if(!player.vehicle) return;
        if(!leftDown) {
            if(!(mp.gui.cursor.position[0]*100/resolution.x >= 27 && mp.gui.cursor.position[0]*100/resolution.x < 78) || !(mp.gui.cursor.position[1]*100/resolution.y <= 90)) return;
            leftDown = true
            downPos = mp.gui.cursor.position
            thetam = theta;
            phim = phi;
        }
        if(!leftDown) return;
        if(cursorPos[0] != lastX || cursorPos[1] != lastY) {

            thetam = theta;
            phim = phi;

            phi = -(cursorPos[0]-lastX) * 0.1 + phim;
            theta = -(cursorPos[1]-lastY) * 0.1 + thetam;
            if(theta > 90) theta = 90
            else if(theta < 65) theta = 65

            const distance = 10
            const newCoord = [
                distance * Math.sin(theta * degToRad) * Math.cos(phi * degToRad),
                distance * Math.sin(theta * degToRad) * Math.sin(phi * degToRad),
                distance * Math.cos(theta * degToRad)
            ]

            camera.setCoord(player.vehicle.position.x + newCoord[0], player.vehicle.position.y + newCoord[1], player.vehicle.position.z+newCoord[2])
            camera.pointAt(player.vehicle.handle, 0, 0, 0, true)
        }
    }
    lastX = cursorPos[0]
    lastY = cursorPos[1]
}, 10)

CustomEvent.registerServer('business:lsc:open', (shopId: number, vehicleCost: number, startTuning: [number,number][], businessItems: { item: number, price: number, count: number, max_count: number }[]) => {
    lscShopID = shopId
    lscVehicleID = player.vehicle.remoteId
    lscPosition = player.position;
    lscOpen(vehicleCost, startTuning, businessItems)
})

// function DrawVehicleBoneText()
// {
//     let currentVeh = player.vehicle;
//     for(let i=0,l=bones.length, bone=bones[0]; i<l; i++, bone = bones[i]) {
//         mp.labels.new(bone, currentVeh.getWorldPositionOfBone(currentVeh.getBoneIndexByName(bone)),
//             {
//                 los: false,
//                 font: 0,
//                 drawDistance: 5,
//                 color: [255, 255, 255, 255],
//                 dimension: 0
//             });
//     }
// }

// TODO vanityPlates? (26)
// TODO modSpeakers? (36)
// TODO modTrunk? (37)
// TODO modTank? бензобак или что? (45)


/* Данные машины
    lscSpeed = (mp.game.vehicle.getVehicleModelMaxSpeed(global.localplayer.vehicle.model) / 1.2).toFixed();
    lscBrakes = global.localplayer.vehicle.getMaxBraking() * 100;
    lscBoost = global.localplayer.vehicle.getAcceleration() * 100;
    lscСlutch = global.localplayer.vehicle.getMaxTraction() * 10;
 */