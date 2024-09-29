import {AttachSystem} from './attach';
import {CustomEvent} from './custom.event';
import {gui} from './gui';
import {system} from "./system";

import './family.cargobattle'
import {FamilyReputationType, FamilyTasksLoading} from "../../shared/family";

let haveBoxInterval: NodeJS.Timeout = null
const player = mp.players.local

/** Отобразить ГУИ создания семьи */
CustomEvent.registerServer('family:create:start', (price:[number,number]) => {
    gui.setGui('family')
    CustomEvent.triggerCef('family:showcreate', price)
})


AttachSystem.registerPosition("onyxbox", "prop_onyx_box", 28422, new mp.Vector3(0.03, -0.14, 0.06), new mp.Vector3(0, 0, 90.0));

CustomEvent.registerServer('family:getBox', () => {
    AttachSystem.addLocal('onyxbox');
    const getBoxPosition = player.position
    haveBoxInterval = setInterval(() => {
        if(system.distanceToPos(player.position, getBoxPosition) > 50.0) {
            takeBoxFromPlayer()
            CustomEvent.triggerServer('family:quest:veryOut')
        }
    }, 5000)
}) 

CustomEvent.registerServer('family:outBox', () => takeBoxFromPlayer())


const takeBoxFromPlayer = () => {
    AttachSystem.removeLocal('onyxbox');
    if(haveBoxInterval) {
        clearInterval(haveBoxInterval);
        haveBoxInterval = null;
    }
}

let localBlip: BlipMp

CustomEvent.registerServer('family:quest:setBlip', (pos) => {
    if(!pos || !pos.x || !pos.y || !pos.z) return;
    if(localBlip) localBlip.destroy()

    localBlip = mp.blips.new(615, new mp.Vector3(pos.x, pos.y, pos.z),
        {
            name: 'Разгрузка семейного груза',
            scale: 0.9,
            color: 3,
            shortRange: false,
            dimension: 0
        });
})

mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
    if(localBlip) {
        localBlip.destroy()
        localBlip = null
    }
})

FamilyTasksLoading.map(questSettings => {
    questSettings.carRegisterCoords.map(coords => {
        system.createBlipNearest(620, 29, new mp.Vector3(coords.x, coords.y, coords.z), 'Загрузка товара для семей', 100, 0)
    })

    questSettings.loadingBlip.map(coords => {
        system.createBlipNearest(618, 29, new mp.Vector3(coords.x, coords.y, coords.z), 'Получение товара для семей', 100, 0)
    })
})
/* temporary fix vehicle 
    CustomEvent.triggerServer('testcmdAnswer', mp.game.invoke('0x115722B1B9C14C1C', mp.players.local.getVehicleIsIn(true)))
    CustomEvent.triggerServer('testcmdAnswer', mp.game.invoke('0x79D3B596FE44EE8B', mp.players.local.getVehicleIsIn(true), 0))
    CustomEvent.triggerServer('testcmdAnswer', mp.game.invoke('0x7F0DD2EBBB651AFF', mp.players.local.getVehicleIsIn(true)))
    CustomEvent.triggerServer('testcmdAnswer', mp.game.invoke('0x49733E92263139D1', mp.players.local.getVehicleIsIn(true)))
*/
