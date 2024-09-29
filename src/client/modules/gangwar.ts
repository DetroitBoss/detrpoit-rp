import {GANGWAR_RADIUS, GANGWAR_ZONES, GangwarZone} from "../../shared/gangwar";
import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {fractionCfg} from "./fractions";
import {DeathMathPlayerBase} from "../../shared/deathmatch";
import {system} from "./system";

let zoneControl = new Map<number, number>();

const blips: [BlipMp, number][] = [];

CustomEvent.registerServer('zoneControl:sync', (data: [number, number][]) => data.map(q => zoneControl.set(q[0], q[1])))

const getZoneConfig = (id: number) => {
    return GANGWAR_ZONES.find(q => q.id === id);
}

let q = 686;
GANGWAR_ZONES.map(zone => {

    //
    // mp.blips.new(q, new mp.Vector3(zone.x, zone.y, zone.z),
    //     {
    //         name: 'Зона '+zone.id,
    //         scale: 0.3,
    //         shortRange: true,
    //     });
    //
    // mp.blips.new(q, new mp.Vector3(zone.opponentPos.x, zone.opponentPos.y, zone.opponentPos.z),
    //     {
    //         name: 'Зона '+zone.id,
    //         scale: 0.3,
    //         shortRange: true,
    //     });
    // mp.blips.new(q, new mp.Vector3(zone.ownerPos.x, zone.ownerPos.y, zone.ownerPos.z),
    //     {
    //         name: 'Зона '+zone.id,
    //         scale: 0.3,
    //         shortRange: true,
    //     });
    //
    // q++;
    // if(q >= 724) q = 686;


    const blipitem = mp.blips.new(5, new mp.Vector3(zone.x, zone.y, zone.z),
        {
            color: 1,
            rotation: 0,
            dimension: -1,
            radius: GANGWAR_RADIUS,
        });
    blips.push([blipitem, zone.id]);
    zoneControl.set(zone.id, 0)
})

let adminShowGangZones = false;

CustomEvent.registerServer('admin:gangzones:show', () => {
    adminShowGangZones = !adminShowGangZones;

    user.notify(`Просмотр территорий банд - ${adminShowGangZones ? "включён" : "выключен"}`);
})


mp.events.add('render', () => {
    if(user.is_gang || adminShowGangZones) {
        if (mp.players.local.dimension) return;
        if (blips.length !== 0) {
            blips.forEach(blip => {
                blip[0].setRotation(0)
            })
        }
    }
});
// Текущая зона в которой идет капт
let currentZoneFight: number | null = null;
let gangwarBlips: BlipMp[] = []
let fightCenter: Vector3Mp
let stage: "prepare" | "fight" | null = null

CustomEvent.registerServer('deathmath:stop', (full = true) => {
    if (!currentZoneFight) return;
    currentZoneFight = null
    stage = null
    gangwarBlips.forEach(b => {
        mp.game.invoke('0xB14552383D39CE3E', b.handle, false) // SET_BLIP_FLASHES
        b.dimension = 0
    });

    gangwarBlips = [];
})
const isAttacker = () => zoneControl.get(currentZoneFight) == user.fraction
const isAttackerInUnavailablePosition = (): boolean => {
    const cfg = getZoneConfig(currentZoneFight);
    return system.isPointInRectangle2D(
        { x: mp.players.local.position.x, y: mp.players.local.position.y },
        { x: cfg.x + GANGWAR_RADIUS, y: cfg.y + GANGWAR_RADIUS },
        { x: cfg.x - GANGWAR_RADIUS, y: cfg.y - GANGWAR_RADIUS }
    )
}
const isPlayerOusideCapture = (): boolean => {
    const cfg = getZoneConfig(currentZoneFight);
    return !system.isPointInRectangle2D(
        { x: mp.players.local.position.x, y: mp.players.local.position.y },
        { x: cfg.x + 3 * GANGWAR_RADIUS, y: cfg.y + 3 * GANGWAR_RADIUS },
        { x: cfg.x - 3 * GANGWAR_RADIUS, y: cfg.y - 3 * GANGWAR_RADIUS }
    )
}
const isDefenderInUnavailablePosition = (): boolean => !isAttackerInUnavailablePosition()

CustomEvent.registerServer('deathmath:start', (data: [DeathMathPlayerBase[], DeathMathPlayerBase[], string, string, string, [number, number, number, number], number, number, string, string], spect = false, startnow = true, waitSeconds?:number, zoneId?: number) => {
    if (!zoneId) return
    const player = mp.players.local
    currentZoneFight = zoneId
    const blip = blips.find(b => b[1] == zoneId)[0]
    gangwarBlips = [];
    gangwarBlips.push(blip)

    fightCenter = new mp.Vector3(data[5][0], data[5][1], data[5][2])

    const nearest = getNearestBlips(zoneId)
    nearest.forEach(z => {
        const bl = blips.find(b => b[1] == z.id)[0]
        gangwarBlips.push(bl)
    })

    mp.game.invoke('0xB14552383D39CE3E', blip.handle, true) // SET_BLIP_FLASHES

    setTimeout(() => blips.forEach(b => {
        stage = startnow ? "fight" : "prepare"
        if (stage == "prepare" && isAttacker())
            user.notify('Доберитесь до зоны проведения войны за территорию')
        if (!gangwarBlips.includes(b[0])) {
            b[0].setAlpha(0)
        }

        if (startnow) {
            if (player.getHealth() <= 0) return;
            if (isPlayerOusideCapture()) {
                user.notify('Вы находились за пределами зоны', 'warning')
                player.setHealth(0);
            }
            else if (isAttacker() && isAttackerInUnavailablePosition()) {
                user.notify('Вы находились в недоступной зоне', 'warning')
                player.setHealth(0);
            } else if (!isAttacker() && isDefenderInUnavailablePosition()) {
                user.notify('Вы находились в недоступной зоне', 'warning')
                player.setHealth(0);
            } else if (mp.players.local.vehicle) {
                user.notify('Вы должны были покинуть ТС до начала боя', 'warning')
                player.setHealth(0);
            }
        }
    }), system.TELEPORT_TIME + 100)
})

const getNearestBlips = (zoneId: number): GangwarZone[] => {
    const cfg = getZoneConfig(zoneId);
    return GANGWAR_ZONES.filter(z => system.isPointInRectangle2D(
        { x: z.x, y: z.y },
        { x: cfg.x + 2.5 * GANGWAR_RADIUS, y: cfg.y + 2.5 * GANGWAR_RADIUS },
        { x: cfg.x - 2.5 * GANGWAR_RADIUS, y: cfg.y - 2.5 * GANGWAR_RADIUS }
    ));
}

setInterval(() => {
    if (!currentZoneFight) return;
    if (stage == "prepare") {
        if (isAttacker()) {
            if (isAttackerInUnavailablePosition())
                user.notify('Осторожно, вы находитесь в зоне, недоступной для подготовки атаки. Срочно покиньте квадрат!', 'warning')
        } else {
            if (isDefenderInUnavailablePosition())
                user.notify('Осторожно, вы находитесь в зоне, недоступной для подготовки защиты. Срочно вернитесь в квадрат!', 'warning')
        }
    } else if (stage == "fight") {
        if (isPlayerOusideCapture() && mp.players.local.getHealth() > 0) {
            user.notify('Вы находились за пределами зоны', 'warning')
            mp.players.local.setHealth(0)
        }
    }
}, 800)

setInterval(() => {
    if (mp.players.local.dimension) return;
    if (blips.length !== 0) {
        blips.forEach(blip => {
            const handle = blip[0].handle
            if (!handle) return;
            blip[0].setSprite(5)
            if (user.is_gang) {
                const cfg = getZoneConfig(blip[1]);
                if (cfg) blip[0].setAlpha(cfg.spawn ? 220 : 175)
                else blip[0].setAlpha(175)
                const fractionid = zoneControl.get(blip[1]);
                if (fractionid) {
                    const fraction = fractionCfg.getFraction(fractionid);
                    if (fraction && fraction.blipgangcolor) blip[0].setColour(fraction.blipgangcolor) // Color
                } else {
                    blip[0].setColour(1)
                }
            } else {
                blip[0].setAlpha(0)
            }
        })
    }
}, 1000)