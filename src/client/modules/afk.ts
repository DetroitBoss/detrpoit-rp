import {system} from "./system";
import {user} from "./user";
import {BASE_AFK_TIME} from "../../shared/afk";

let afktime = 0;

let voiceCount = 0;
let positionCount = 0;
let headingCount = 0;
let headingCamCount = 0;
let forvardCount = 0;
let keyPressCount = 0;
let cameraMoveCount = 0;
let lastKeyPressed: number[] = []
let lastPosition: Vector3Mp = new mp.Vector3(0, 0, 0);
let lastHeading: number = 0;
let lastHeadingCam: number = 0;

const pointForAfk = 100;

const player = mp.players.local;
const gameplayCam = mp.cameras.new('gameplay');

function unique<T>(arr: T[]): T[] {
    let result: T[] = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    return result;
}
setInterval(() => {
    if (!user.login) return;
    let currentPosition: Vector3Mp = player.position

    let currentHeading: number = player.getHeading();
    if (mp.game.cam.getGameplayCamRelativeHeading() - lastHeadingCam > -2 && mp.game.cam.getGameplayCamRelativeHeading() - lastHeadingCam < 2) headingCamCount++;
    else {
        lastHeadingCam = mp.game.cam.getGameplayCamRelativeHeading();
        headingCamCount = 0;
    }
    if (system.distanceToPos(lastPosition, currentPosition) < 1) positionCount++;
    else {
        lastPosition = currentPosition;
        positionCount = 0;
    }
    if (currentHeading < lastHeading + 1 && currentHeading > lastHeading - 1) headingCount++;
    else {
        lastHeading = currentHeading;
        headingCount = 0;
    }
    if (mp.voiceChat.muted) voiceCount++;
    else voiceCount = 0

    if (chanceIsAfk() < pointForAfk){
        afktime = 0;
        if (user.afk) user.afk = false;
    }
}, 1000)

setInterval(() => {
    if (chanceIsAfk() >= pointForAfk) afktime++;
}, 60000)



setInterval(() => {
    if (!user.login) return;
    // let canBeAfk = 1;
    let canBeAfk = BASE_AFK_TIME;
    
    const vipdata = user.vipData;
    if(vipdata){
        if (vipdata.afkminutes) canBeAfk = vipdata.afkminutes
    }
    // user.notify(afktime + " / " + canBeAfk + " / " + pointForAfk + " / " + chanceIsAfk())
    if (afktime > canBeAfk) {
        if (!user.afk) user.afk = true;
    } else {
        if (user.afk) user.afk = false;
    }
}, 1000)



function unicKeys() {
    return unique(lastKeyPressed).length
}

function chanceIsAfk() {
    if (mp.game.ui.isPauseMenuActive()) return 100;
    // if (!mp.system.isFocused) return 100;
    let chance = 0;
    let voiceChance = voiceCount / 100;
    if (voiceChance > 30) voiceChance = 30;
    chance += voiceChance
    chance += positionCount / 50
    chance += headingCount / 50
    chance += forvardCount / 50
    chance += cameraMoveCount
    let keychance = 100 - unicKeys() * 20
    if (keychance < 0) keychance = 0;
    chance += keychance

    if (chance > 100) chance = 100;
    // user.notify(`Chance ${chance}, voiceChance ${voiceChance} positionCount ${positionCount} headingCount ${headingCount} forvardCount ${forvardCount} cameraMoveCount ${cameraMoveCount} keychance ${keychance}`)
    // mp.gui.chat.push(`Chance ${chance}, voiceChance ${voiceChance} positionCount ${positionCount} headingCount ${headingCount} forvardCount ${forvardCount} cameraMoveCount ${cameraMoveCount} keychance ${keychance}`)
    return chance
}


for (let id = 1; id < 120; id++) {
    mp.keys.bind(id, true, function () {
        if (lastKeyPressed.length >= 100) lastKeyPressed.splice(0, 1);
        lastKeyPressed.push(id)
    });
}

setInterval(() => {
    if (!user.login) return;
    lastKeyPressed = []
}, 60000)