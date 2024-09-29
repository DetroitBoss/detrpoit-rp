import {GANGWAR_EXIT_TIMEOUT_MINUTES, GANGWAR_MINUTES, GANGWAR_RADIUS, GANGWAR_ZONES} from "../../shared/gangwar";
import {GangWarEntity} from "./typeorm/entities/gangwar";
import {CustomEvent} from "./custom.event";
import {saveEntity} from "./typeorm";
import {DeathMath} from "./deadmatch";
import {User} from "./user";
import {system} from "./system";
import {Family} from "./families/family";
import { fractionCfg } from "./fractions/main";
import {gui} from "./gui";
import {FractionGarage} from "./fraction.garages";
import {GangwarGarage} from "./gangwar.garages";

let zoneControl = new Map<number, number>();
let zoneFight = new Map<number, boolean>();

GANGWAR_ZONES.map(zone => {
    zoneControl.set(zone.id, zone.default)
    zoneFight.set(zone.id, false)
})

const zoneDatas = new Map<number, GangWarEntity>()

export function zoneControlData(){
    return [...zoneControl]
}

const syncZoneControl = () => {
    CustomEvent.triggerClients('zoneControl:sync', zoneControlData())
}

export const getZoneConf = (zone: number) => {
    return GANGWAR_ZONES.find(q => q.id === zone);
}

export const getZoneOwner = (zone: number) => {
    return zoneControl.get(zone)
}

export const getZonesByOwner = (owner: number): number[] => {
    return [...zoneDatas].map(q => q[1]).filter(q => q.owner === owner).map(q => q.zone)
}

export const getZoneAtPosition = (pos: Vector3Mp) => {
    const cfg = GANGWAR_ZONES.find(q => system.distanceToPos(q, pos) <= GANGWAR_RADIUS);
    return cfg ? cfg.id : null
}

export let currentFight: {zone: number, owner: number, opponent: number};

export const canFight = (zone: number, opponent: number) => {
    if(currentFight) return false;

    return true;
}

export const clearGangZone = () => {
    GANGWAR_ZONES.map(zone => {
        zoneControl.set(zone.id, zone.default)
        zoneDatas.get(zone.id).owner = zone.default;
    });
    GangWarEntity.save([...zoneDatas].map(q => q[1]));
    syncZoneControl()
}

// gui.chat.registerCommand('capt', player => {
//     startFight(getZoneAtPosition(player.position), 22)
// })

export const startFight = (zone: number, opponent: number) => {
    if(!canFight(zone, opponent)) return;
    zoneFight.set(zone, true)
    const owner = getZoneOwner(zone);
    const cfg = getZoneConf(zone);
    if(!cfg) return;
    const pos = new mp.Vector3(cfg.x, cfg.y, cfg.z)
    const targets = mp.players.toArray().filter(target => mp.players.exists(target) && !target.dimension && target.user && !target.user.isAdminNow() && [owner, opponent].includes(target.user.fraction) && system.distanceToPos(target.position, pos) < GANGWAR_RADIUS);
    const team1 = targets.filter(q => q.user.fraction === opponent)
    const team2 = targets.filter(q => q.user.fraction === owner)
    const dm = new DeathMath(new mp.Vector3(cfg.x, cfg.y, cfg.z), GANGWAR_RADIUS * 3)
    team1.map(q => dm.insertPlayer(q, 1))
    team2.map(q => dm.insertPlayer(q, 2))
    dm.name = `Война за территорию #${cfg.id}`;
    dm.team1_name = fractionCfg.getFractionName(opponent)
    dm.team2_name = fractionCfg.getFractionName(owner)
    dm.team1_image = `f${opponent}`
    dm.team2_image = `f${owner}`
    mp.players.toArray().filter(target => mp.players.exists(target) && !target.dimension && target.user && target.user.isAdminNow() && system.distanceToPos(target.position, pos) < GANGWAR_RADIUS).map(target => dm.insertSpectator(target))

    //dm.team1_start = { x: cfg.x, y: cfg.y, z: cfg.z + 1, r: 5, h: 0 }
    //const gangSpawnPoint = GANGWAR_ZONES.find(z => z.spawn && z.default == owner)
    const gangSpawnPoint = fractionCfg.getFraction(owner).spawn
    dm.team2_start = { x: gangSpawnPoint.x, y: gangSpawnPoint.y, z: gangSpawnPoint.z, r: 1, h: 0 }

    const tempGarage = new GangwarGarage(dm.dimension + 2, owner, team2.length)
    tempGarage.create()

    dm.exitTimeout = GANGWAR_EXIT_TIMEOUT_MINUTES * 60;
    dm.time = GANGWAR_MINUTES * 60
    dm.hospital = true;
    dm.wait = 3 * 60;
    dm.wait_freeze = false;
    dm.handler((winner) => {
        tempGarage.delete()
        if(winner == 1) setZoneControl(zone, opponent)
        else syncZoneControl();
        zoneFight.set(zone, false)
        mp.players.toArray().filter(target => mp.players.exists(target) && target.user && [owner, opponent].includes(target.user.fraction)).map(target => {
            if(winner == 1) target.notify(`Территория #${zone} теперь принадлежит ${fractionCfg.getFractionName(opponent)}`)
            else target.notify(`Территория #${zone} осталась под контролем ${fractionCfg.getFractionName(owner)}`)
        })
    })
    dm.startCapture(zone)
}

export const setZoneControl = (zone: number, fraction: number) => {
    zoneControl.set(zone, fraction)
    zoneDatas.get(zone).owner = fraction;
    saveEntity(zoneDatas.get(zone))
    syncZoneControl();
}

export const loadGangZone = () => {
    GangWarEntity.find().then(items => {
        items.map(zone => {
            zoneControl.set(zone.zone, zone.owner)
            zoneFight.set(zone.zone, false)
            zoneDatas.set(zone.zone, zone);
        })
        const newZones = GANGWAR_ZONES.map(q => q.id).filter(q => !items.find(s => s.zone === q)).map(q => {
            const item = new GangWarEntity();
            item.zone = q;
            item.owner = GANGWAR_ZONES.find(z => z.id === q).default;
            return item;
        })
        if(newZones.length > 0) GangWarEntity.save(newZones).then(list => list.map(zone => zoneDatas.set(zone.zone, zone)));
    })
}