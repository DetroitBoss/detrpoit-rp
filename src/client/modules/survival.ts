import {CustomEvent} from "./custom.event";
import {user} from "./user"
import {system} from "./system";
import {randomArrayElement} from "../../shared/arrays";
import {colshapes} from "./checkpoints";
import {doJobNow} from "./jobs";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {destroyDeathDialog, DialogAccept, DialogAcceptDestroyBig, openDeathDialog} from "./accept";
import {dispatch} from "./dispatch";
import {
    DO_JOB_FOOD_MULTIPLER,
    DO_JOB_WATER_MULTIPLER,
    HEAL_ZONE_POS,
    hospitalPos,
    HP_FOOD_RATE,
    HP_MINUS_RATE,
    HP_TOTAL_FOOD_WATER_RATE,
    HP_WATER_RATE,
    WATER_RATE
} from "../../shared/survival";
import {QUICK_HEAL_COST} from "../../shared/economy";
import {getIllConfig, HEAL_MEDIC_POSITION, illData, IllId} from "../../shared/ill";
import {MenuClass} from "./menu";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {anticheatProtect} from "./protection";
import {isOnAnyCargoBattle} from "./family.cargobattle";
import {gui} from "./gui";
import {getVipConfig} from "../../shared/vip";
import {guiNames} from "../../shared/gui";
import { cameraManager } from './camera'
import { CamerasManager } from './cameraManager'
import {HOSPITAL_TELEPORT_DIMENSION} from "../../shared/teleport.system";

const player = mp.players.local;
export const survival = {
    food: 0,
    water: 0,
}
let currentRespawnHash: string;
let currentRespawnHashCode = system.randomStr(10)

let currentHealHash: string;
let currentHealHashCode = system.randomStr(10)
CustomEvent.registerServer('survival:init', (food: number, water: number) => {
    survival.food = food;
    survival.water = water;
})

const selectIll = (heal: boolean = false): Promise<IllId> => {
    return new Promise((resolve) => {
        const m = new MenuClass('Выберите необходимую болезнь');
        m.onclose = () => {resolve(null);}

        m.workAnyTime = true;
        m.exitProtect = true;
        illData.map(ill => {
            m.newItem({
                name: ill.name,
                more: heal ? `$${system.numberFormat(ill.healByMedicCostPerOne)} за единицу` : '',
                onpress: () => {
                    m.close();
                    resolve(ill.id)
                }
            })

        })

        m.open();
    })
}

colshapes.new(HEAL_MEDIC_POSITION, 'Место для лечения болезней', () => {
    if(user.fraction != 16) return user.notify("Вы должны быть медиком чтобы лечить пациентов", 'error');
    const m = new MenuClass('Лечение от зависимостей');
    m.newItem({
        name: 'Обследование',
        desc: 'Выбрав этот пункт вы проведёте обследование пациента',
        onpress: () => {
            const target = user.getNearestPlayer();
            if(!target) return user.notify("Поблизости никого нет", 'error');
            CustomEvent.callServer('illdata:data', target.remoteId).then((res: {[p: string]: number}) => {
                if(!res) return;
                // const val = res[ill];
                // user.notify(`Текущее состояние болезни: ${val.toFixed(0)}% / ${data.max}%. Критическое значение: ${data.critical}%`, 'error');
                const s = new MenuClass('Информация');

                for(let q in res){
                    const data = getIllConfig(q as IllId);
                    if(data){
                        const val = res[q];
                        const valV = (val / 10).toFixed(0);
                        const valVM = (data.max / 10).toFixed(0);
                        const valVC = (data.critical / 10).toFixed(0);
                        const cost = data.healByMedicCostPerOne * val;
                        s.newItem({
                            name: `${data.name}`,
                            more: `${valV} / ${valVM} %`,
                            desc: `Текущее состояние болезни: ${valV}% / ${valVM}%. Критическое значение: ${valVC}%`,
                            onpress: () => {
                                DialogAccept(`Вылечить пациента за $${cost}.`, 'small', 20000).then(status => {
                                    if(!status) return;
                                    CustomEvent.triggerServer('illdata:heal', target.remoteId, data.id, cost);
                                })
                            }
                        })
                    }
                }

                s.open();
            })
        }
    })
    m.open()
})


HEAL_ZONE_POS.map(item => {
    colshapes.new(item, 'Выписка из больницы $' + system.numberFormat(QUICK_HEAL_COST.AUTO), async () => {
        if (healTimer <= 0) return user.notify('Вам не требуется выписка', 'error');
        const sum = (await user.haveActiveLicense('med')) ? QUICK_HEAL_COST.AUTO_LICENSE : QUICK_HEAL_COST.AUTO;
        DialogAccept(`Вы хотите оплатить $${system.numberFormat(sum)} за ускореное лечение?`, 'big').then(status => {
            if(!status) return;
            if (healTimer <= 0) return user.notify('Вам не требуется выписка', 'error');
            if (user.money < sum) return user.notify('У вас недостаточно средств для оплаты', 'error');
            CustomEvent.callServer('heal:payauto').then(q => {
                if(!q) return;
                setHealTimer(0);
                user.notify('Вас выписали', 'success');
            })
        })
    }, {
        radius: MARKERS_SETTINGS.HEAL_ZONE.r,
        color: MARKERS_SETTINGS.HEAL_ZONE.color
    })
})

let exitHealtProtect = [
    new mp.Vector3(346.12, -592.85, 28.79),
    new mp.Vector3(350.62, -581.76, 28.79),
    new mp.Vector3(320.41, -561.42, 28.78),
]


exitHealtProtect.map(pos => {
    let shape = colshapes.new(pos, null, () => {
        if (healTimer <= 0) return;
        const pos = getNearestHealPoint()
        anticheatProtect('heal')
        CustomEvent.triggerServer('heal:tryrun', pos.x, pos.y, pos.z)
    }, {
        color: [0, 0, 0, 0],
        onenter: true
    })
})



const startTimer = 120;

CustomEvent.registerServer('hospital:healTimer', () => {
    return healTimer
})
CustomEvent.registerServer('hospital:clearHealTimer', () => {
    if(healTimer) user.notify('Вас выписали', 'success');
    setHealTimer(0);
    return true
})

export let hospitalTimer = -1;
let qs:string;

let triggerDeath = false;

CustomEvent.registerServer('player:dead', (killerName: string, killerId: number) => {
    if (mp.players.local.wasKilledByTakedown() && user.login && gui.currentGui !== "spawn") {
        setTimeout(() => callDeath(killerName, killerId), 3500)
    }else{
        callDeath(killerName, killerId);
    }
});


setInterval(() => {
    if(player.getHealth() > 0){
        triggerDeath = false;
    } else if(!triggerDeath){
        callDeath();
    }
}, 10000)


let deathWantedLevel = 0;

let lastKillerId: number = null;
let lastKillerName: string = null;
let isPopupWithMedics: boolean

mp.events.add('gui:menuClosed', async (menu: guiNames) => {
    if (player.isDead()) {
        await openDeathDialog(reviveTimer, lastKillerId, lastKillerName, true);
        CustomEvent.triggerCef('deathpopup:setType', isPopupWithMedics);
    }
});

const deathCamera = CamerasManager.hasCamera('death') ?
    CamerasManager.getCamera('death') :
    CamerasManager.createCamera('death',
    'default',
    mp.players.local.position,
    new mp.Vector3(-90, 0, 0),
    50)

const mouseSensitivity = 6;
mp.events.add('render', () => {
    if (deathCamera && deathCamera.isActive() && deathCamera.isRendering() && !mp.gui.cursor.visible) {
        mp.game.controls.disableAllControlActions(2);

        let x = (mp.game.controls.getDisabledControlNormal(7, 1) * mouseSensitivity);
        let y = (mp.game.controls.getDisabledControlNormal(7, 2) * mouseSensitivity);

        let currentRot = deathCamera.getRot(2);

        currentRot = new mp.Vector3(currentRot.x - y, 0, currentRot.z - x);

        deathCamera.setRot(currentRot.x, currentRot.y, currentRot.z, 2);
    }
})

const callDeath = async (killerName?: string,  killerId?: number) => {
    if (!user.login) return;
    if (gui.currentGui === "spawn") return;

    if (triggerDeath) return;
    triggerDeath = true;

    CustomEvent.triggerServer('death:toggle', true);

    setDeathTimer(300)
    let qs2 = system.randomStr(10);
    qs = qs2+"";

    if (!player.dimension && !isOnAnyCargoBattle()) {
        deathCamera.setCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 1)
        CamerasManager.setActiveCamera(deathCamera, true)

        const status = await openDeathDialog(reviveTimer, killerId, killerName);
        isPopupWithMedics = status;

        // wtf???
        if (qs !== qs2) return;
        if (!status) {
            if (hospitalTimer < 60) setDeathTimer(60);
            dispatch.call(16, `Срочная реанимация`, true, hospitalTimer);
        } else if (hospitalTimer > 60) {
            const vipConfig = getVipConfig(player.getVariable('vip'));
            const deathTime = (vipConfig?.deathScreenTime) ? vipConfig.deathScreenTime / 1000 : 180;
            setDeathTimer(deathTime)
        }

        while (player.isDead()) await system.sleep(100);

        CamerasManager.setActiveCamera(deathCamera, false)
        destroyDeathDialog();
    } else {
        setDeathTimer(5)
    }
}

export let healTimer = 0;
CustomEvent.registerServer('heal:start', (time: number) => {
    healTimer = time;
    currentHealHash = system.encryptCodes(healTimer.toString(), currentHealHashCode)
    user.notify("Не покидайте палату на время прохождения лечения, швы могут разойтись", "info", null, 12000);
})

setInterval(() => {
    if (!user.login) return;
    if (!player.isDead() && deathCamera.isActive() && reviveTimer === 0) {
        CamerasManager.setActiveCamera(deathCamera, false)
        CustomEvent.triggerCef('deathpopup:show', false);
    }
    if (healTimer <= 0) return;
    setHealTimer(healTimer - 1);
    const vipdata = user.vipData;
    if (!vipdata || !vipdata.healmultipler) return;
    if (healTimer <= 5) return;
    setTimeout(() => {
        if (healTimer <= 5) return;
        setHealTimer(healTimer - 1);
    }, 500)
}, 1000)

export const getNearestHealPoint = () => {
    let posid: number = 0;
    let posvec: Vector3Mp;
    hospitalPos.map((item, index) => {
        if (!index) {
            posvec = randomArrayElement(item)
        } else if (system.distanceToPos2D(item[0], player.position) < system.distanceToPos2D(posvec, player.position)) {
            posvec = randomArrayElement(item);
            posid = index;
        }
    })
    return posvec
}
let healerTimer = new TextTimerBar("Время до выписки", "");
healerTimer.hidden = true;
const setHealTimer = (time: number) => {
    let hack = false;
    if(currentHealHash && healTimer){
        if(currentHealHash != system.encryptCodes(healTimer.toString(), currentHealHashCode)){
            healTimer = 1000
            hack = true;
            user.cheatDetect('memory', 'Подмена срока лечения в больнице')
            CustomEvent.triggerServer('heal:setTime', healTimer);
        }
    }
    if(!hack) healTimer = time;
    currentHealHash = system.encryptCodes(healTimer.toString(), currentHealHashCode)
    if (healTimer == 0) {
        healerTimer.hidden = true;
        user.notify("Вы успешно прошли лечение", "success");
        currentHealHash = null;
        CustomEvent.triggerServer('heal:end');
        return;
    } else if (healTimer % 30 === 0) {
        CustomEvent.triggerServer('heal:setTime', healTimer);
    }
    const pos = getNearestHealPoint()
    if (system.distanceToPos2D(player.position, pos) > 200 || !user.inInterrior) {
        anticheatProtect('heal')
        CustomEvent.triggerServer('heal:tryrun', pos.x, pos.y, pos.z)
    }
    healerTimer.text = system.secondsToString(time)
    healerTimer.hidden = false;
}

/** Текущее время до возрождения */
let reviveTimer: number = 0;

/**
 * Установить время возрождения
 * @param time Время до возрождения в секундах
 */
const setDeathTimer = (time: number) => {
    let hack = false;
    if (hospitalTimer && currentRespawnHash){
        if (currentRespawnHash != system.encryptCodes(hospitalTimer.toString(), currentRespawnHashCode)) {
            user.cheatDetect('memory', 'Подмена срока возрождения')
            hospitalTimer = 1000;
            hack = true
        }
    }
    if (!hack) hospitalTimer = time;
    currentRespawnHash = system.encryptCodes(hospitalTimer.toString(), currentRespawnHashCode)
    if (time <= 0) {
        if (!reviveTimer) destroyDeathDialog();
        CamerasManager.setActiveCamera(deathCamera, false)
        reviveTimer = 0;
    }
    else reviveTimer = time;
    CustomEvent.triggerCef('deathpopup:setTime', reviveTimer)
    mp.game.gameplay.disableAutomaticRespawn(true);
    mp.game.gameplay.ignoreNextRestart(true);
    mp.game.gameplay.setFadeInAfterDeathArrest(true);
    mp.game.gameplay.setFadeOutAfterDeath(false);
}

setInterval(() => {
    if (!user.login) return;
    if (hospitalTimer <= 0) return;
    if (!user.dead) {
        reviveTimer = 0;
        hospitalTimer = 0;
        return;
    }
    setDeathTimer(hospitalTimer - 1);
    if (hospitalTimer > 0) return;
    let posvec = getNearestHealPoint();
    if (!player.isDead()) CustomEvent.triggerCef('deathpopup:show', false);
    reviveTimer = 0;
    anticheatProtect('heal')
    CustomEvent.triggerServer('survival:death', posvec.x, posvec.y, posvec.z);
    CustomEvent.triggerServer('death:toggle', false);
    hospitalTimer = -1;
    currentRespawnHash = null;
}, 1000)


setInterval(() => {
    if (!user.login) return;
    if (user.isAdminNow()) return;
    let waterMinus = .01;
    let foodMinus = .01;
    if (player.isSprinting()) waterMinus += WATER_RATE.SPRINTING
    if (player.isRunning()) waterMinus += WATER_RATE.RUNNING
    if (player.isStrafing()) waterMinus += WATER_RATE.STRAFING
    if (player.isSwimming()) waterMinus += WATER_RATE.SWIMMING
    if (player.isSwimmingUnderWater()) waterMinus += WATER_RATE.DIVING

    if (survival.water < 0) survival.water = 0;


    if (player.isSprinting()) foodMinus += WATER_RATE.SPRINTING
    if (player.isRunning()) foodMinus += WATER_RATE.RUNNING
    if (player.isStrafing()) foodMinus += WATER_RATE.STRAFING
    if (player.isSwimming()) foodMinus += WATER_RATE.SWIMMING
    if (player.isSwimmingUnderWater()) foodMinus += WATER_RATE.DIVING

    if (doJobNow) {
        waterMinus *= DO_JOB_WATER_MULTIPLER
        foodMinus *= DO_JOB_FOOD_MULTIPLER
    }
    survival.water -= waterMinus;
    survival.food -= foodMinus;
    if (survival.water < 0) survival.water = 0;
    if (survival.food < 0) survival.food = 0;
}, 1000)

setInterval(() => {
    try {
        if (!user.login) return;
        if (user.isAdminNow()) return;
        let hp = 0;
        if (survival.water == 0) hp += HP_WATER_RATE;
        if (survival.food == 0) hp += HP_FOOD_RATE;
        if (survival.water == 0 && survival.food == 0) hp += HP_TOTAL_FOOD_WATER_RATE;
        if (hp == 0) return;
        player.setHealth(Math.trunc(100 + player.getHealth() - hp))
    }
    catch (err) {
        let hp = 0;
        if (survival.water == 0) hp += HP_WATER_RATE;
        if (survival.food == 0) hp += HP_FOOD_RATE;
        if (survival.water == 0 && survival.food == 0) hp += HP_TOTAL_FOOD_WATER_RATE;
        if (hp == 0) return;
        CustomEvent.triggerServer('srv:log', 'HP: ' + Math.trunc(100 + player.getHealth() - hp))
    }
}, HP_MINUS_RATE * 1000)

setInterval(() => {
    if (!user.login) return;
    if (user.isAdminNow()) return;
    CustomEvent.triggerServer('survival:sync', survival.food, survival.water)
}, 120000)

let hp = mp.players.local.getHealth();

CustomEvent.registerServer('survival:setHP', (count: number) => {
    mp.players.local.setHealth(count + 100);
})

setInterval(() => {
    const health = mp.players.local.getHealth()
    if (hp === health) return;
    CustomEvent.triggerServer('survival:updateHealth', health);
    hp = health;
}, 100);