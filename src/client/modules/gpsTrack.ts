import {user} from "./user";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {systemUtil} from "../../shared/system";
import {wantedViewZones} from "../../shared/wantedViewZones";

let trackingBlips = new Map<number, BlipMp>();

let myTrackingList:number[] = [];

CustomEvent.registerServer('faction:gpsTracking', (value: number[]) => {
    myTrackingList = value;
})

mp.events.add('tablet:suspect:track', (id: number) => {
    user.trackSuspect = id
})

setInterval(() => {
    if(!user.login) return;
    if (!user.fraction || mp.players.local.dimension){
        trackingBlips.forEach((_, id) => removeBlip(id));
        return;
    }
    mp.players.forEach(target => {
        const id: number = target.getVariable('id');
        // console.log(`${user.trackSuspect == id} ${user.is_police} ${!target.dimension} ${!!target.getVariable('suspectGPS_position')}`)
        if (haveAccess(target)){
            const pos = JSON.parse(target.getVariable('gpsTrackPos'))
            if (!trackingBlips.has(id)){
                const blip = system.createBlip(pos.v ? 225 : 280, 1, pos, `GPS Метка: ${target.getVariable('name')} #${id}`, 0)
                trackingBlips.set(id, blip);
                blip.setRoute(true);
                blip.setRouteColour(59)
            } else {
                const blip = trackingBlips.get(id)
                blip.setSprite(pos.v ? 225 : 280)
                blip.setRoute(false);
                blip.setPosition(pos.x, pos.y, pos.z);
                blip.setRoute(true);
                blip.setRouteColour(59)
            }
        }
        else if(user.trackSuspect == id && user.is_police && !target.dimension && !!target.getVariable('suspectGPS_position')) {
            const pos = JSON.parse(target.getVariable('suspectGPS_position'))
            const inZone = wantedViewZones.map(vz => {
                return systemUtil.isPointInRectangle2D({x: pos.x, y: pos.y}, { x: vz[0].x, y: vz[0].y }, { x: vz[1].x, y: vz[1].y })
            }).includes(true)

            if(system.distanceToPos2D(mp.players.local.position, {x: pos.x, y: pos.y}) < 500.0) {
                if(system.timestamp - user.trackSuspectLastTime < 15) return;
            }
            else if(!inZone || system.timestamp - user.trackSuspectLastTime < 60) return;


            if (!trackingBlips.has(id)){
                const blip = system.createBlip(pos.v ? 645 : 458, 59, pos, `Отслеживаемый преступник ${target.getVariable('name')} #${id}`, 0)
                trackingBlips.set(id, blip);
                blip.setRoute(true);
                blip.setRouteColour(59)
            } else {
                const blip = trackingBlips.get(id)
                blip.setSprite(pos.v ? 645 : 458)
                blip.setRoute(false);
                blip.setColour(59)
                blip.setPosition(pos.x, pos.y, pos.z);
                blip.setRoute(true);
                blip.setRouteColour(59)
            }
            user.trackSuspectLastTime = system.timestamp
        }
        else {
            removeBlip(id)
        }
        
    })
}, 2000)

const haveAccess = (data: PlayerMp | number) => {
    const target = typeof data === "number" ? mp.players.toArray().find(q => q.getVariable('id') === data) : data;
    if (!target || !mp.players.exists(target)) return false;
    if (target.dimension) return false;
    const id: number = typeof data === "number" ? data : target.getVariable('id');
    if (!myTrackingList.includes(id)) return false;
    if (user.fraction !== target.getVariable('fraction')) return false;
    if (!target.getVariable('gpsTrack')) return false;
    if (!target.getVariable('gpsTrackPos')) return false;
    return true;
}
const removeBlip = (id: number) => {
    let blip = trackingBlips.get(id);
    if(!blip) return;
    if(user.trackSuspect == id) user.trackSuspect = -1
    blip.destroy();
    trackingBlips.delete(id);
}
const createBlip = (id: number) => {
    let blip = trackingBlips.get(id);
    if(!blip) return;
    blip.destroy();
    trackingBlips.delete(id);
}

let blips: [BlipMp, number, {x: number, y: number}][] = []

setInterval(() => {
    if(!user.login) return;
    const mypos = mp.players.local.position
    blips.map(([blip, dist, pos], id) => {
        if(!blip || !mp.blips.exists(blip)) return blips.splice(id, 1);
        if(system.distanceToPos2D(pos, mypos) <= dist){
            blip.destroy()
            blips.splice(id, 1);
        }
    })
}, 1000)

CustomEvent.registerServer('gps:blips', (list: {x: number, y: number, name: string, shortRange: boolean, distDestroy: number, type: number, color: number}[]) => {
    blips.map(([blip, dist, pos], id) => {
        if(!blip || !mp.blips.exists(blip)) return;
        blip.destroy()
    })
    blips = [];
    list.map(item => {
        blips.push([system.createBlip(item.type, item.color, {x: item.x, y: item.y, z: 0}, item.name, 0, !!item.shortRange), item.distDestroy, {x: item.x, y: item.y}])
    })
})