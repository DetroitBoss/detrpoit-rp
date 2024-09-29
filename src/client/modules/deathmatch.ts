import {CustomEvent} from "./custom.event";
import {CaptureType, DEATHMATCH_COLOR, DeathMathPlayerBase} from "../../shared/deathmatch";
import {system} from "./system";
import {user} from "./user";
import {disableControlGroup} from "./controls";
import {hudBar} from "./hudBar";
import {GANGWAR_RADIUS} from "../../shared/gangwar";

const player = mp.players.local

let team1: DeathMathPlayerBase[] = [];
let team2: DeathMathPlayerBase[] = [];
let team1_name: string;
let team2_name: string;
let team1_image: string;
let team2_image: string;
let name: string;
let center: Vector3Mp;
let radius: number;
let dimension: number;
let marker: MarkerMp;
let blipitem: BlipMp;
let blip: number;
let disableShoot = false;
let enable = false;
let spectator = false;
let time: number;
let isCapture: boolean;

CustomEvent.registerServer('deathmath:stop', (full = true) => {
    enable = false;
    isCapture = false;
    if(!full) {
        setTimeout(() => {
            CustomEvent.triggerCef('capture:stop');
        }, 5000)
        return;
    }
    CustomEvent.triggerCef('capture:stop');
    if(marker && mp.markers.exists(marker)) marker.destroy()
    marker = null;
    if(blipitem){
        if(mp.blips.exists(blipitem)) blipitem.destroy()
        blipitem = null;
    }
    blip = null;
});
CustomEvent.registerServer('deathmath:start', (data: [DeathMathPlayerBase[], DeathMathPlayerBase[], string, string, string, [number, number, number, number], number, number, string, string], spect = false, startnow = true, waitSeconds?:number, zoneId?: number) => {
    team1 = data[0];
    team2 = data[1];
    team1_name = data[2]
    team2_name = data[3]
    name = data[4]
    center = new mp.Vector3(data[5][0], data[5][1], data[5][2])
    radius = data[5][3];
    dimension = data[6];
    marker = mp.markers.new(1, new mp.Vector3(center.x, center.y, center.z - 20), radius * 2, {
        color: DEATHMATCH_COLOR,
        dimension,
    })
    isCapture = !!zoneId
    // Если не капт
    if (!isCapture) {
        blipitem = mp.blips.new(4, new mp.Vector3(center.x, center.y, center.z),
            {
                color: 1,
                rotation: 0,
                dimension,
                radius,
            });
        blip = blipitem.handle
        mp.game.invoke('0xDF735600A4696DAF', blip, 4) // Sprite
        mp.game.invoke('0x03D7FB09E75D6B7E', blip, 1) // Color
    }

    time = data[7];
    team1_image = data[8]
    team2_image = data[9]
    disableShoot = true;
    if(!startnow) {
        if(waitSeconds){
            hudBar.timer('Начало боя', waitSeconds)
        }
        return;
    }
    let send: CaptureType = {
        show: true,
        type: name,
        capture: [
            {name: team1_name, image: team1_image, score: 0},
            {name: team2_name, image: team2_image, score: 0},
        ],
        killist: [],
        time,
        start: false
    }

    CustomEvent.triggerCef('capture:update', send);
    spectator = spect
    disableShoot = false;
    setTimeout(() => {
        enable = true;
    }, 5000);
})

let notifyNearest = false;

setInterval(() => {
    if(!enable) return;
    if (isCapture) return;
    if(spectator) return;
    const dist = system.distanceToPos(player.position, center);
    const nearest = dist > (radius - 10);
    const outside = dist > radius
    if(nearest && !outside){
        if(notifyNearest){
            notifyNearest = true;
            user.notify('Осторожно, вы находитесь рядом с границей игровой зоны. Её запрещено покидать', 'error');
        }
    } else {
        notifyNearest = false;
    }
    if(dist < radius) return;
    if(player.getHealth() <= 0) return;
    user.notify('Вы покинули игровую зону', 'error')
    player.setHealth(0);
}, 400)

mp.events.add('render', () => {
    if(disableShoot){
        disableControlGroup.saveZone();
    }
})