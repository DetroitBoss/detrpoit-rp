import {IPrisonData} from "../../../shared/prison/IPrisonData";
import {CustomEvent} from "../custom.event";
import {TextTimerBar} from "../bars/classes/TextTimerBar";
import {system} from "../system";
import {PRISON_CENTER_POSITION, PRISON_ENTER_MENU_COORDS, PRISON_RADIUS} from "../../../shared/prison/config";
import './hospital';
import './tasks';

let prisonData: IPrisonData | null = null;
let blockText: TextTimerBar | null = null;
let teleportTimer: number = 0;
let blockTeleport = false;

mp.markers.new(1, PRISON_ENTER_MENU_COORDS, 1, {
    dimension: 0,
    color: [0, 255, 0, 255]
})


CustomEvent.registerServer('prison:sync', (data: IPrisonData) => {
    prisonData = data;
    blockTeleport = true;
    setTimeout(() => {
        blockTeleport = false;
    }, 4000);
})

CustomEvent.registerServer('prison:sync:time', (time) => {
    if (prisonData.time - time <= 10) {
        prisonData.time = 10;
    }else{
        prisonData.time -= time;
    }
})

CustomEvent.registerServer('prison:clear', () => {
    prisonData = null;
    if (blockText && blockText.exists) blockText.destroy();
    blockText = null;
    CustomEvent.triggerCef('prison:task:update', null);
})

setInterval(() => {
    if (prisonData === null) return;

    prisonData.time -= 1;

    if (system.distanceToPos(mp.players.local.position, PRISON_CENTER_POSITION) > PRISON_RADIUS && teleportTimer === 0 && blockTeleport === false) {
        teleportTimer = 1;
        return CustomEvent.triggerServer("prison:runaway", prisonData);
    }
    else if (teleportTimer > 0 && teleportTimer < 3) {
        teleportTimer += 1;
    }
    else if (teleportTimer >= 3) {
        teleportTimer = 0;
    }


    if (blockText && blockText.exists){
        blockText.title = `Заключение в тюрьме ${prisonData.reason}${prisonData.adminName ? ` [${prisonData.adminName}]` : ""}`;
        blockText.text = system.secondsToString(prisonData.time);
    } else {
        blockText = new TextTimerBar(
            `Заключение в тюрьме ${prisonData.reason}${prisonData.adminName ? ` [${prisonData.adminName}]` : ""}`,
            system.secondsToString(prisonData.time)
        );
    }

    if (prisonData.time % 60 === 0) CustomEvent.triggerServer("prison:sync:time", prisonData.time);
}, 1000);