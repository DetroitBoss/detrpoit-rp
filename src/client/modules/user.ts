import {GLOBAL_DIMENSION, system} from "./system";
import {cameraManager} from "./camera";
import {CharacterSkinData, defaultCharacterData} from "../../shared/character";
import {CustomEvent} from "./custom.event";
import {AlertType, DEFAULT_ALERT_TIME} from "../../shared/alert";
import {permissions} from "../../shared/permissions";
import {hospitalTimer} from "./survival";
import {myLastAnimUpper, myLastAnimUpperClear, playAnims} from "./anim";
import {gui, hideHudStatus} from "./gui";
import {disableAllControlSystemStatus, tempCursorStatus} from "./controls";
import {nonHiddenMasksIds} from "../../shared/masks";
import {ANTICHEAT_TYPE, weapon_hashes} from "../../shared/anticheat";
import {getVipConfig, VipId} from "../../shared/vip";
import {adminDataDrawPlayers, adminDataDrawRange, adminDataDrawVehicles, inSpectatorMode} from "./admin";
import {LicenceType} from "../../shared/licence";
import {AFTER_DEATH_RANGE} from "../../shared/survival";
import {driftMapLoaded} from "./drift";
import {inCasinoRoulette} from "./casino/roulette";
import {inDiceGame} from "./casino/dice";
import {currentSlotData} from "./casino/slots";
import {ENTER_ANIM, EXIT_ANIM} from "../../shared/casino/main";
import {PayData, PayType} from "../../shared/pay";
import {fractionCfg} from "./fractions";
import {NAILS_COMPONENT_ID, nailsConfig} from "../../shared/barbershop";

const player = mp.players.local

let characterLocalSkinData: CharacterSkinData = { ...defaultCharacterData }

export function setAllLocalSkinData(val: CharacterSkinData){
    characterLocalSkinData = val;
}

setInterval(() => {
    mp.game.stats.statSetInt(mp.game.joaat("SP0_STAMINA"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_STRENGTH"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_LUNG_CAPACITY"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_WHEELIE_ABILITY"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_FLYING_ABILITY"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_SHOOTING_ABILITY"), 100, false);
    mp.game.stats.statSetInt(mp.game.joaat("SP0_STEALTH_ABILITY"), 100, false);
}, 20000)

let sendEventsCheat = new Map<ANTICHEAT_TYPE, boolean>()

CustomEvent.registerServer('start:textshow', () => {
    gui.setGui('greeting');
})

CustomEvent.registerServer('spawn:select', (...params:any[]) => {
    gui.setGui('spawn');
    CustomEvent.triggerCef('spawn:select', ...params)
})


CustomEvent.registerServer('cef:alert:setHelpKey', (key: string, text: string) => {
    user.setHelpKey(key, text)
})


function getLocalSkinData(param: "FACE_SPECIFICATIONS"): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
function getLocalSkinData(param: keyof CharacterSkinData): number;
function getLocalSkinData(param: keyof CharacterSkinData): CharacterSkinData[keyof CharacterSkinData] {
    return characterLocalSkinData[param]
}
function setLocalSkinData(param: "FACE_SPECIFICATIONS", value: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]): void;
function setLocalSkinData(param: keyof CharacterSkinData, value: number): void;
function setLocalSkinData(param: keyof CharacterSkinData, value: any): void {
    characterLocalSkinData[param] = value;
    user.updateCharacterFace(true);
}

let screenEffects:[string, number][] = [];

setInterval(() => {
    screenEffects.map((item, index) => {
        item[1]-=2;
        if(item[1] <= 0){
            mp.game.graphics.stopScreenEffect(item[0]);
            screenEffects.splice(index, 1)
        }
    })
}, 2000)


let drugScreenTimer = 0;
let alcoControlTimer = 0;

CustomEvent.registerServer('drug:clean', () => {
    if(alcoControlTimer) alcoControlTimer = 1;
    if(drugScreenTimer) drugScreenTimer = 1;
})

CustomEvent.registerServer("drug:use", (time: number, alco = false) => {
    if(alco){
        alcoControlTimer += time;
        return;
    }
    if (drugScreenTimer){
        drugScreenTimer += time;
        return;
    }
    drugScreenTimer += time;
    if (mp.game.graphics.getScreenEffectIsActive('DrugsMichaelAliensFightOut')) mp.game.graphics.stopScreenEffect('DrugsMichaelAliensFightOut')
    mp.game.graphics.startScreenEffect('DrugsMichaelAliensFightIn', 0, true);
})
let currentShakeCam = 0.0
setInterval(() => {
    if (alcoControlTimer){
        alcoControlTimer--;
        if (alcoControlTimer){
            let style = "";
            if (alcoControlTimer > 60) style = "drunk@moderatedrunk_head_up"
            else if (alcoControlTimer > 30) style = "drunk@slightlydrunk"
            else style = "drunk@moderatedrunk_head_up"
            user.setTempWalkStyle((user.isMale() ? "move_m@" : "move_f@")+style)
            let time = 0;
            if (drugScreenTimer > 60) time = 1.0
            else if (drugScreenTimer > 30) time = 1.5
            else time = 2.0
            if (time !== currentShakeCam){
                currentShakeCam = time;
                mp.game.cam.shakeGameplayCam("DRUNK_SHAKE", time)
                player.setMotionBlur(true)
            }
            randomControlVeh(alcoControlTimer)
        } else {
            mp.game.cam.shakeGameplayCam("DRUNK_SHAKE", 0.0)
            currentShakeCam = 0.0
            player.setMotionBlur(false)
        }
    }
    if (!drugScreenTimer) return;
    drugScreenTimer--;
    if (drugScreenTimer && !mp.game.graphics.getScreenEffectIsActive('DrugsMichaelAliensFightIn')){
        drugScreenTimer = 0;
        return;
    }
    if(drugScreenTimer){
        randomControlVeh(drugScreenTimer)
    }
    if (!drugScreenTimer){
        mp.game.graphics.stopScreenEffect('DrugsMichaelAliensFightIn');
        mp.game.graphics.startScreenEffect('DrugsMichaelAliensFightOut', 0, true);
        setTimeout(() => {
            if (drugScreenTimer) return;
            mp.game.graphics.stopScreenEffect('DrugsMichaelAliensFightOut')
        }, 5000)
    }
}, 1000)


const VFX_MODE_DEFAULT = 0;
const VFX_MODE_ALIEN = 1;
const VFX_MODE_CLOWN = 2;

async function requestNamedPtfxAssetAsync(ptfxAssetName: string) {
    mp.game.streaming.requestNamedPtfxAsset(ptfxAssetName);

    while (!mp.game.streaming.hasNamedPtfxAssetLoaded(ptfxAssetName)) {
        await system.sleep(100)
    }
}

Object.defineProperty(mp.game.graphics, "bloodVfxMode", {
    get() {
        return this._vfxMode || VFX_MODE_DEFAULT;
    },

    async set(value) {
        switch (value) {
            case VFX_MODE_ALIEN:
                await requestNamedPtfxAssetAsync("scr_rcbarry1");

                mp.game.graphics.enableClownBloodVfx(false);
                mp.game.graphics.enableAlienBloodVfx(true);
                break;

            case VFX_MODE_CLOWN:
                await requestNamedPtfxAssetAsync("scr_rcbarry2");

                mp.game.graphics.enableAlienBloodVfx(false);
                mp.game.graphics.enableClownBloodVfx(true);
                break;

            default:
                value = VFX_MODE_DEFAULT;

                mp.game.graphics.enableAlienBloodVfx(false);
                mp.game.graphics.enableClownBloodVfx(false);
                break;
        }

        this._vfxMode = value;
    }
});

let drugChangedModel = false;
setInterval(() => {
    if (!drugScreenTimer && !drugChangedModel) return;
    if(drugScreenTimer){
        drugChangedModel = true;
        // mp.players.forEach(target => {
        //     if(!target.handle) return;
        //     if(target.id === player.id) return;
        //     const arr: string[] = ["ig_johnnyklebitz", "s_m_m_movalien_01", "ig_orleans", "u_m_y_rsranger_01", "a_c_chimp"];
        //     target.model = mp.game.joaat(system.randomArrayElement(arr)) as number;
        // })
        mp.game.graphics.bloodVfxMode = VFX_MODE_CLOWN;
    } else {
        drugChangedModel = false;
        // mp.players.forEach(target => {
        //     if (!target.handle) return;
        //     if (target.id === player.id) return;
        //     target.model = mp.game.joaat(target.getVariable('currentModel')) as number;
        // })
        mp.game.graphics.bloodVfxMode = VFX_MODE_DEFAULT;
    }
}, 1000);


const randomControlVeh = (effect: number) => {
    const veh = player.vehicle;
    if (veh) {
        if (user.isDriver && veh.getSpeed() * 3.6 > 20 && veh.getSpeedVector(true).y > 0) {
            const vehClass = veh.getClass();
            if (![15, 16, 21, 13].includes(vehClass)) {
                const randInt = system.randomArrayElement([
                    { interaction: 27, time: 1500 },
                    { interaction: 6, time: 1000 },
                    { interaction: 7, time: 800 }, //turn left and accel
                    { interaction: 8, time: 800 }, //turn right and accel
                    { interaction: 10, time: 800 }, //turn left and restore wheel pos
                    { interaction: 11, time: 800 }, //turn right and restore wheel pos
                    { interaction: 23, time: 2000 }, // accel fast
                    { interaction: 31, time: 2000 } // accel fast and then handbrake 
                ])
                let time = 0;
                if (effect > 60) time = 1
                else if (effect > 30) time = 0.5
                else time = .2
                player.taskVehicleTempAction(veh.handle, randInt.interaction, randInt.time * time)
            }
        }
    }
}

let RandomVehicleInteraction = [
    { interaction: 27, time: 1500 },
    { interaction: 6, time: 1000 },
    { interaction: 7, time: 800 }, //turn left and accel
    { interaction: 8, time: 800 }, //turn right and accel
    { interaction: 10, time: 800 }, //turn left and restore wheel pos
    { interaction: 11, time: 800 }, //turn right and restore wheel pos
    { interaction: 23, time: 2000 }, // accel fast
    { interaction: 31, time: 2000 } // accel fast and then handbrake 
]

mp.events.add('playerDeath', () => {
    mp.game.invoke('0xB4EDDC19532BFB85')
    if(player.vehicle) player.setCoords(player.position.x, player.position.y, player.position.z, true, true, true, false)
    screenEffects = [];
});


CustomEvent.registerServer('addScreenEffect', (name: string, time: number) => {
    let item = screenEffects.find(q => q[0] === name);
    if(item){
        item[1] += time;
    } else {
        screenEffects.push([name, time]);
        mp.game.graphics.startScreenEffect(name, 0, true);
    }
})
CustomEvent.registerServer('showLoadDisplay', (time?: number) => {
    user.showLoadDisplay(time)
})
CustomEvent.registerServer('hideLoadDisplay', (time?: number) => {
    user.hideLoadDisplay(time)
})

CustomEvent.registerServer('playScenario', (name: string, x?: number, y?: number, z?: number, h?: number, teleport?: boolean) => {
    user.playScenario(name, x, y, z, h, teleport);
})

CustomEvent.registerServer('loadDating', (data: [number, string][]) => {
    user.myDating = data;
})
CustomEvent.registerServer('newDating', (data: [number, string]) => {
    const have = user.myDating.findIndex(q => q[0] === data[0]);
    if(have > -1){
        const q = [...user.myDating]
        q.splice(have, 1);
        user.myDating = [...q, data]
    } else {
        user.myDating.push(data);
    }
})
// CustomEvent.registerServer('clearDating', (data: [number, string]) => {
//     user.myDating.push(data);
// })
CustomEvent.registerServer('turnToFace', (targetid: number, duration: number = -1) => {
    const target = mp.players.atRemoteId(targetid);
    if (!target.handle) return;
    user.stopAnim();
    player.taskTurnToFace(target.handle, duration);
})
CustomEvent.registerServer('goToCoord', (x: number, y: number, z: number, h?: number, slide: number = 0) => {
    player.taskTurnToFaceCoord(x, y, z, 100);
    player.taskGoStraightToCoord(x, y, z, 1.0, -1, typeof h === "number" ? h : player.getHeading(), slide);
})

CustomEvent.register('cef:getIsMale', () => {
    return user.isMale();
});

mp.events.addDataHandler("fraction", async (target: PlayerMp, val: number) => {
    if (target.type != "player") return;
    if (target.remoteId !== player.remoteId) return;
    CustomEvent.triggerCef('user:fraction', val)
});
// mp.events.addDataHandler("family", async (target: PlayerMp, value: number[]) => {
//     if (target.type != "player") return;
//     if (target.remoteId !== player.remoteId) return;
//     CustomEvent.triggerCef('user:family', value[0], value[1])
// });
mp.events.addDataHandler("rank", async (target: PlayerMp, val: number) => {
    if (target.type != "player") return;
    if (target.remoteId !== player.remoteId) return;
    CustomEvent.triggerCef('user:rank', val)
});
mp.events.addDataHandler("tag", async (target: PlayerMp, val: string) => {
    if (target.type != "player") return;
    if (target.remoteId !== player.remoteId) return;
    CustomEvent.triggerCef('user:tag', val)
});

const maxDistance = 350;
const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255, 255, 255, 255];

mp.nametags.enabled = false;

setInterval(() => {
    mp.game.player.setHealthRechargeMultiplier(0.0)
}, 500)

export function drawSprite(
    dict: string, 
    name: string, 
    scale: Array<number>,
    heading: number, 
    colour: {r: number, g: number, b: number,  a: number},
    x: number, 
    y: number, 
    layer: number = 0
) {
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0),
        textureResolution = mp.game.graphics.getTextureResolution(dict, name),
        textureScale = [scale[0] * textureResolution.x / resolution.x, scale[1] * textureResolution.y / resolution.y];

    if (mp.game.graphics.hasStreamedTextureDictLoaded(dict)) {
        if (typeof layer === 'number') mp.game.graphics.set2dLayer(layer);
        mp.game.graphics.drawSprite(dict, name, x, y, textureScale[0], textureScale[1], heading, colour.r, colour.g, colour.b, colour.a);
    } 
    else mp.game.graphics.requestStreamedTextureDict(dict, true);
}

mp.events.add('render', (nametags) => {
    mp.game.player.setHealthRechargeMultiplier(0.0)
    if (!user.login) return;
    // @ts-ignore
    if (gui.currentGui && gui.currentGui != 'deathpopup') return;

    if(mp.game.invoke('0x475768A975D5AD17', player.handle, 6)){
        mp.game.controls.disableControlAction(1, 140, true)
        mp.game.controls.disableControlAction(1, 141, true)
        mp.game.controls.disableControlAction(1, 142, true)
    }
    
    // mp.game.controls.disableControlAction(0, 347, true)
    // mp.game.controls.disableControlAction(1, 347, true)
    mp.game.controls.disableControlAction(27, 346, true)
    mp.game.controls.disableControlAction(27, 347, true)

    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution(0, 0);

    if(adminDataDrawVehicles && !hideHudStatus){
        mp.vehicles.forEachInStreamRange((veh) => {
            if(system.distanceToPos(veh.position, player.position) < (50 * adminDataDrawRange)){
                let speed = Math.floor(veh.getSpeed() * 3.6);
                gui.drawText3D(`ID: ${veh.remoteId} DIM: ${veh.dimension} ${veh.getVariable('modelname')} ${veh.getVariable('fraction') ? `| F: ${veh.getVariable('fraction')}` : ''}\n${speed > 20 ? `Speed: ${speed}kmh` : ''}`, veh.position.x, veh.position.y, veh.position.z);
            }
        })
    }
    if(hideHudStatus) return;
    
    //const frameTime = mp.game.invoke('0x15C40837039FFAF7');
    
    mp.game.invoke('0xFF0B610F6BE0D7AF');// clear draw origin

    const localPlayerFamily = mp.players.local.getVariable('family');
    nametags.forEach(nametag => {
        let [player, x, y, distance] = nametag;
        if (x < 0.2 || x > 0.8) return;
        // if(y < 0.2 || y > 0.8) return;
        if (player.getAlpha() < 10 && !user.isAdminNow()) return;
        const maxDist = user.isAdminNow() ? maxDistance * adminDataDrawRange : maxDistance;
        if (distance <= maxDist) {
            const id = player.getVariable('id')
            if (!id) return;
            if (!user.isAdminNow() && !mp.players.local.hasClearLosTo(player.handle, 17)) return;
            let scale = (distance / maxDistance);
            if (scale < 0.6) scale = 0.6;
            
            let health = player.getVariable("customHealth") / 100;

            let armour = player.getArmour() / 100;

            y -= scale * (0.005 * (screenRes.y / 1080));

            let text = '';

            if (player.getVariable('enabledAdmin')) text += `~r~ADMIN~w~ `;
            if (player.getVariable('afk')) text += `~r~AFK~w~ `;
            let inMask = !nonHiddenMasksIds.includes(player.getDrawableVariation(1));

            const targetFraction = player.getVariable('fraction');
            if (targetFraction !== 0
                && targetFraction === mp.players.local.getVariable('fraction')) {
                inMask = false;// Костыль, исправить
            }

            const targetFamily = player.getVariable('family');
            const localFamily = mp.players.local.getVariable('family');
            if (targetFamily && targetFamily[0] && localFamily && localFamily[0]
                && targetFamily[0] == localFamily[0]) {
                inMask = false;
            }
            const poss: [number, number, number, number][] = player.getVariable('deathLog')
            if (user.isAdminNow() && poss) {
                const posss = poss.map(q => {
                    return {
                        x: q[0],
                        y: q[1],
                        z: q[2],
                    }
                })
                const pos = posss.find(q => system.distanceToPos(q, player.position) <= AFTER_DEATH_RANGE)
                if (pos) {
                    text += `~r~DEATH ${system.distanceToPos(pos, player.position).toFixed(0)}m~w~ `
                }
            }
            if ((mp.game.player.isFreeAimingAtEntity(player.handle))) text += '\n';
            let muted = !!player.getVariable('muted:chat') || !!player.getVariable('muted:voice')
            if (!inMask || user.isAdminNow()) {
                text += `\n${muted ? '~c~' : ''}(${id}) ${user.getDating(id, player)}${muted ? '~w~' : ''}`;
            } else {
                text += `\n${muted ? '~c~' : ''}(${id})${muted ? '~w~' : ''}`;
            }
            const f = player.getVariable('fraction');
            const g = player.getVariable('family');
            if (user.isAdminNow() && (adminDataDrawPlayers || (inSpectatorMode() == player)) && (f || (g && g[0]))) text += `\n${f ? `F: ${f}  R: ${player.getVariable('rank')} ` : ``}${g && g[0] ? ` G: ${g[0]}` : ``}`;
            if (user.isAdminNow() && (adminDataDrawPlayers || (inSpectatorMode() == player))) text += `\nHP: ${player.getVariable("customHealth")}${player.getArmour() ? `AP: ${player.getArmour()}` : ''}`;

            if (player.vehicle) {
                const screenCoords = mp.game.graphics.world3dToScreen2d(
                    player.position.x,
                    player.position.y,
                    player.position.z + 1.2
                );
                if (!screenCoords) return;
                
                if (player.isVoiceActive)
                    drawSprite("mpleaderboard", 'leaderboard_audio_3', [0.9, 0.9], 0,
                        {r: 255, g: 255, b: 255, a: 255}, screenCoords.x, screenCoords.y - 0.01);

                mp.game.graphics.drawText(text,
                    [screenCoords.x, screenCoords.y],
                    {
                        font: 4,
                        color: [255, 255, 255, 255],
                        scale: [0.4, 0.4],
                        outline: true,
                        centre: true
                    });

                if (user.family != 0 && player.getVariable('family') && player.getVariable('family')[0] == user.family)
                    drawSprite("Mpleaderboard", "leaderboard_friends_icon", [0.9, 0.8], 0, {r: 255, g: 20, b: 10, a: 220}, screenCoords.x,  screenCoords.y + 0.06)
            }
            else {
                if (player.isVoiceActive)
                    drawSprite("mpleaderboard", 'leaderboard_audio_3', [0.9, 0.9], 0,
                        {r: 255, g: 255, b: 255, a: 255}, x, y - 0.01);
                
                mp.game.graphics.drawText(text,
                    [x, y],
                    {
                        font: 4,
                        color: [255, 255, 255, 255],
                        scale: [0.4, 0.4],
                        outline: true,
                        centre: true
                    });

                if (user.family != 0 && player.getVariable('family') && player.getVariable('family')[0] == user.family)
                    drawSprite("Mpleaderboard", "leaderboard_friends_icon", [0.9, 0.8], 0, {r: 255, g: 20, b: 10, a: 220}, x,  y + 0.06)
            }

            if (mp.game.player.isFreeAimingAtEntity(player.handle)) {
                let y2 = y + 0.042;

                if (armour > 0) {
                    let x2 = x - width / 2 - border / 2;

                    graphics.drawRect(x2, y2, width + border * 2, 0.0085, 0, 0, 0, 200);
                    graphics.drawRect(x2, y2, width, height, 150, 150, 150, 255);
                    graphics.drawRect(x2 - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);

                    x2 = x + width / 2 + border / 2;

                    graphics.drawRect(x2, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
                    graphics.drawRect(x2, y2, width, height, 41, 66, 78, 255);
                    graphics.drawRect(x2 - width / 2 * (1 - armour), y2, width * armour, height, 48, 108, 135, 200);
                } else {
                    graphics.drawRect(x, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
                    graphics.drawRect(x, y2, width, height, 150, 150, 150, 255);
                    graphics.drawRect(x - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);
                }
            }
        }
    })
})

// onclickEntity((entity: PlayerMp) => {
//     if (entity.type !== "player") return;
//     CustomEvent.triggerServer('player:interaction', entity.remoteId);
// })
// onclickEntity((entity: VehicleMp) => {
//     if (entity.type !== "vehicle") return;
//     CustomEvent.triggerServer('vehicle:interaction', entity.remoteId);
// })

CustomEvent.registerServer('vip:data', (vip: VipId, vipend: number) => {
    user.vip = vip;
    user.vip_end = vipend;
})

let money: number;
let chips: number;
let bank_money: number;

CustomEvent.registerServer('setMoney', (val) => { money = val; CustomEvent.triggerCef('cef:hud:setMoney', val);})
CustomEvent.registerServer('setChips', (val) => { chips = val; CustomEvent.triggerCef('cef:hud:setChips', val);})
CustomEvent.registerServer('setBankMoney', (val) => { bank_money = val; CustomEvent.triggerCef('cef:hud:setMoneyBank', val);})
CustomEvent.registerServer('cef:showHelp', (text: string) => {
    user.showHelp(text)
})

let showHelpText: string;

CustomEvent.registerServer('getAmmo', () => {
    return user.currentAmmo
})

CustomEvent.registerServer('tpWaypoint', () => {
    user.teleportWaypoint()
})

CustomEvent.registerServer('verifyVehModel', (model: string) => {
    return mp.game.streaming.isModelAVehicle(mp.game.joaat(model))
})



let helpKey:string;
let helpKeyText:string;

const setNailsOverlay = (index: number, user: any, defaultOpacity = 1.0) => {
    const overlayValue = user.getLocalSkinData(`NAILS`);
    const nailsData = nailsConfig.find(data => data.Id === overlayValue);
    mp.console.logInfo(`nailsData ${nailsData}`);
    mp.console.logInfo(`overlayValue ${overlayValue}`);
    if (nailsData !== undefined && overlayValue !== -1) {
        player.setComponentVariation(NAILS_COMPONENT_ID, nailsData.Drawable, nailsData.Texture, 2);
        mp.console.logInfo(`NAILS_COMPONENT_ID ${NAILS_COMPONENT_ID}`);
        mp.console.logInfo(`nailsData.Drawable ${nailsData.Drawable}`);
        mp.console.logInfo(`nailsData.Texture ${nailsData.Texture}`);
    }
};

export const user = {
    get chips(){
      return chips
    },
    get inDriftMap(){
      return driftMapLoaded
    },
    openLogs: (ids: string, name: string) => {
        CustomEvent.triggerServer('logs:open', ids, name)
    },
    haveActiveLicense: async (lic: LicenceType): Promise<boolean> => {
        return await CustomEvent.callServer('haveActiveLicense', lic)
    },
    get cuffed(){
        return !!player.getVariable('cuffed');
    },
    get currentAmmo(){
        let ammo = mp.players.local.getAmmoInClip(mp.players.local.weapon);
        if(ammo == 65535) ammo = 0
        return ammo;
    },
    getNearestPed(r = 5, onlyVisible = true) {
        return user.getNearestPeds(r, onlyVisible)[0]
    },
    getNearestPeds(r = 5, onlyVisible = true) {
        return mp.peds.toArray().filter(ped => ped.dimension == player.dimension
            && system.distanceToPos(ped.getCoordsAutoAlive(), player.position) <= r
            && (!onlyVisible || ped.getAlpha() > 20)).sort((a, b) => {

            return system.distanceToPos(a.getCoordsAutoAlive(), player.position) - system.distanceToPos(b.getCoordsAutoAlive(), player.position)
        });
    },
    getNearestPlayer(r = 5, onlyVisible = true) {
        return user.getNearestPlayers(r, onlyVisible)[0]
    },
    getNearestPlayers(r = 5, onlyVisible = true) {
        return mp.players.toArray().filter(tPlayer => tPlayer.dimension == player.dimension
            && tPlayer.id != player.id && system.distanceToPos(tPlayer.getCoordsAutoAlive(), player.position) <= r
            && (!onlyVisible || tPlayer.getAlpha() > 20)).sort((a, b) => {
            return system.distanceToPos(a.getCoordsAutoAlive(), player.position) - system.distanceToPos(b.getCoordsAutoAlive(), player.position)
        });
    },
    getNearestPlayersInCoord(position: Vector3Mp, dimension = 0, r = 5, onlyVisible = true) {
        return mp.players.toArray().filter(tPlayer => tPlayer.dimension == dimension
            && system.distanceToPos(tPlayer.getCoordsAutoAlive(), position) <= r
            && (!onlyVisible || tPlayer.getAlpha() > 20)).sort((a, b) => {
            return system.distanceToPos(a.getCoordsAutoAlive(), position) - system.distanceToPos(b.getCoordsAutoAlive(), position)
        });
    },
    isVehicleInSameDimension(vehicle: VehicleMp): boolean {
        if (vehicle.dimension == GLOBAL_DIMENSION) return true;
        return vehicle.dimension == player.dimension;
    },
    getNearestVehicle(r = 5) {
        let vehs = mp.vehicles
            .toArray()
            .filter(veh =>
                this.isVehicleInSameDimension(veh) && system.distanceToPos(veh.getCoordsAutoAlive(), player.position) <= r && !veh.autosalon)
            .sort((a, b) => {
                return system.distanceToPos(a.getCoordsAutoAlive(), player.position) - system.distanceToPos(b.getCoordsAutoAlive(), player.position)
        });
        if(vehs.length > 0) return vehs[0]
    },
    getNearestVehicles(r = 5) {
        return mp.vehicles
            .toArray()
            .filter(veh => 
                veh.dimension == player.dimension && system.distanceToPos(veh.getCoordsAutoAlive(), player.position) <= r && !veh.autosalon)
            .sort((a, b) => {
            return system.distanceToPos(a.getCoordsAutoAlive(), player.position) - system.distanceToPos(b.getCoordsAutoAlive(), player.position)
        })
    },
    setBlur: (status: boolean, transitionTime = 1000) => {
        if (status) mp.game.graphics.transitionToBlurred(transitionTime);
        else mp.game.graphics.transitionFromBlurred(transitionTime);
    },
    get showHelpText(){
        return showHelpText;
    },
    showHelp: (text: string) => {
        // if (text) mp.game.audio.playSound(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
        if (showHelpText !== text) CustomEvent.triggerCef('cef:showHelp', text)
        showHelpText = text;
    },
    get name():string{
        return player.getVariable('name');
    },
    get money(){
        return money
    },
    get money_bank(){
        return bank_money
    },
    get walkingWithObject():boolean {
        return player.getVariable('walkingWithObject')
    },
    teleportWaypoint: () => {
        try {
            let entity = mp.players.local.vehicle && mp.players.local.vehicle.getPedInSeat(-1) == mp.players.local.handle ? mp.players.local.vehicle : mp.players.local
            let pos = system.getWaypointPosition();
            if (pos.x != 0) {
                user.teleport(pos.x, pos.y, pos.z);
                setTimeout(async () => {
                    let fnd = false
                    for (let q = -40; q < 500 && !fnd; q += 100){
                        if (!fnd){
                            mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, q);
                            entity.setCoordsNoOffset(
                                pos.x,
                                pos.y,
                                q,
                                false,
                                false,
                                false
                            );
                            const z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, q, 0.0, false);
                            if(z){
                                fnd = true;
                                entity.setCoordsNoOffset(
                                    pos.x,
                                    pos.y,
                                    z,
                                    false,
                                    false,
                                    false
                                );
                            } else {
                                await system.sleep(100)
                            }
                        }
                    }
                }, system.TELEPORT_TIME+200)
            }
        } catch (e) {
            mp.console.logError(e);
        }
    },
    get isDriver(){
        const veh = player.vehicle;
        if(!veh) return false;
        if(veh.getPedInSeat(-1) !== player.handle) return false;
        return true
    },
    get myWalkstyle(){
        return 0;
    },
    get walkStyle():string{
        return player.getVariable('walkstyle')
    },
    set walkStyle(val){

    },
    setTempWalkStyle(val: string){
        if(user.walkStyle == val) return;
        CustomEvent.triggerServer('setWalkstyle', val)
    },
    get afk(): boolean{
        return !!player.getVariable('afk');
    },
    set afk(val){
        CustomEvent.triggerServer('afk:status', val)
    },
    /** Текущая випка */
    vip: <VipId> null,
    /** Окончание текущей випки */
    vip_end: 0,
    /** Данные по текущей випке */
    get vipData() {
        if (!user.vip) return null;
        if (system.timestamp > user.vip_end) return null;
        const cfg = getVipConfig(this.vip);
        if (!cfg) return null;
        /** Срок окончания випки */
        const end = user.vip_end;
        return {
            ...cfg, end
        }
    },
    get free() {
        if (user.dead) return false;
        if (!user.login) return false;
        if (player.isUsingAnyScenario()) return false
        // @ts-ignore
        if (player.isReloading()) return false
        return true;
    },
    copyText: (text: string) => {
        CustomEvent.triggerCef('cef:copytext', text)
    },
    cheatDetect: (type: ANTICHEAT_TYPE, reason: string) => {
        // if(type.includes('vehicle')){
        //     const pos = player.position;
        //     player.setCoords(pos.x, pos.y, pos.z, true, true, true, true);
        // }
        if(sendEventsCheat.has(type)) return;
        sendEventsCheat.set(type, true);
        setTimeout(() => {
            sendEventsCheat.delete(type)
        }, 3000)
        CustomEvent.triggerServer('anticheat:detect', type, reason)
    },
    myDating: <[number, string][]>[],
    getDating: (id: number, target?: PlayerMp) => {
        if (!target) return
        const targetFraction = target.getVariable('fraction');
        const targetRank = target.getVariable('rank')
        const targetFamily = target.getVariable('family')
        const isTargetMedia = target.getVariable('media')

        const localPlayerFamily = mp.players.local.getVariable('family');

        if (target && user.isAdminNow()) {
            if (target.getVariable('enabledAdmin') && target.getVariable('adminName'))
                return target.getVariable('adminName');

            if (isTargetMedia) return `~p~` + target.getVariable('name')
                
            if (targetFraction && targetRank && fractionCfg.getLeaderRank(targetFraction) === targetRank)
                return `~g~` + target.getVariable('name')
            
            return target.getVariable('name')
        }
        
        const data = user.myDating.find(q => q[0] === id);

        return (target && target.getVariable('enabledAdmin') && target.getVariable('adminName'))
            ? target.getVariable('adminName') 
            : (data)
                ? data[1]
                : (targetFraction && targetFraction === player.getVariable('fraction'))
                    ? target.getVariable('name') 
                    : (user.family && targetFamily && targetFamily[0] == user.family)
                        ? target.getVariable('name')
                        : '';
    },
    setHelpKey(key: string, text: string, time?: number) {
        if(!time && key == helpKey && helpKeyText === text) return;
        helpKey = key;
        helpKeyText = text;
        CustomEvent.triggerCef('cef:alert:setHelpKey', key, text)
        if (!time) return;
        setTimeout(() => {
            if (!this.exists) return;
            this.removeHelpKey()
        }, time)
    },
    notifyBig(title: string, text: string, time: number = 5000) {
        CustomEvent.triggerCef('cef:notifyBig', title, text, time);
    },
    removeHelpKey() {
        if(helpKey || helpKeyText)  CustomEvent.triggerCef('cef:alert:removeHelpKey')
        helpKey = null;
        helpKeyText = null;
    },
    clearWaypointHistoryByName: (name: string) => {
        CustomEvent.triggerCef('gps:clearHistory', name)
    },
    addWaypointHistory: (x: number, y: number, z: number, name: string) => {
        CustomEvent.triggerCef('gps:chatNotify', name, x, y, z)
    },
    setWaypoint: (x: number, y: number, z: number, notify = true, chatNotify?: string) => {
        mp.game.ui.setNewWaypoint(x, y);
        if (chatNotify) {
            user.addWaypointHistory(x, y, z, chatNotify)
        }
        if (!notify || mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, 0, x, y, 0, true) < 1) return;
        user.notify('Метка в GPS была установлена', "success");
    },
    getWaypoint: () => {
        let pos = new mp.Vector3(0, 0, 0);
        if (mp.game.invoke('0x1DD1F58F493F1DA5')) {
            let blipInfoIdIterator = mp.game.invoke('0x186E5D252FA50E7D');
            for (
                let index = mp.game.invoke('0x1BEDE233E6CD2A1F', blipInfoIdIterator);
                mp.game.invoke('0xA6DB27D19ECBB7DA', index);
                index = mp.game.invoke('0x14F96AA50D6FBEA7', blipInfoIdIterator)
            )
                if (mp.game.invoke('0xBE9B0959FFD0779B', index) == 4)
                    pos = mp.game.ui.getBlipInfoIdCoord(index);

            pos.z += 1550;
        }
        return pos.x != 0 || pos.y != 0 || pos.z != 0 ? pos : null;
    },
    clearWaypoint: () => {
        mp.game.invoke('0xD8E694757BCEA8E9');
    },
    playScenario: (name: string, x?: number, y?: number, z?: number, h?: number, teleport?: boolean) => {
        if (name && x && y && z && h) {
            player.clearTasksImmediately();
            player.taskStartScenarioAtPosition(name, x, y, z, h, -1, (!(!!teleport) && name == "PROP_HUMAN_SEAT_BENCH"), !!teleport)
        } else
            if (name == 'PROP_HUMAN_SEAT_BENCH') {
                user.stopAnim();
                let pos = player.getOffsetFromInWorldCoords(0, -0.5, -0.5);
                let heading = player.getRotation(0).z;
                player.taskStartScenarioAtPosition(
                    name,
                    pos.x,
                    pos.y,
                    pos.z,
                    heading,
                    -1,
                    true,
                    false
                );
            } else {
                user.stopAnim();
                player.taskStartScenarioInPlace(name, 0, true);
            }
    },
    goToCoord: (pos: {x: number, y: number, z: number}, heading: number, speed: 1.0 | 2.0 = 1.0): Promise<boolean> => {
        return new Promise(async resolve => {
            const seqId = [228];
            mp.game.invoke(system.natives.OPEN_SEQUENCE_TASK, seqId);
            mp.game.invoke(system.natives.TASK_GO_STRAIGHT_TO_COORD, 0, pos.x, pos.y, pos.z, 1.0, -1, heading + 0.001, 0.05);
            mp.game.invoke(system.natives.CLOSE_SEQUENCE_TASK, seqId[0]);
            mp.game.invoke(system.natives.TASK_PERFORM_SEQUENCE, player.handle, seqId[0]);
            mp.game.invoke(system.natives.CLEAR_SEQUENCE_TASK, seqId);
            await system.sleep(500);
            let fail = false;
            let nearest = 0;
            let timer = setTimeout(() => {
                fail = true;
            }, 10000)
            while (mp.game.invoke(system.natives.GET_SEQUENCE_PROGRESS, player.handle) != -1 && !fail) {
                if(system.distanceToPos(player.position, pos) < 0.5) nearest++;
                if(nearest >= 200) fail = false;
                await system.sleep(10);
            }
            if(!fail) clearTimeout(timer);
            return resolve(!fail);
        })
    },
    playExitCasinoAnim: (): Promise<boolean> => {
        return new Promise((resolve) => {
            CustomEvent.triggerServer('casino:freeze', null)
            const {x,y,z} = player.position;
            const pos = player.getOffsetFromInWorldCoords(0.0, -1.5, 0.0);
            user.playAnim([[EXIT_ANIM[0], EXIT_ANIM[1]]], false, false).then((q) => {
                const dist = system.distanceToPos(player.position, {x,y,z});
                const dist2 = system.distanceToPos(player.position, pos);
                if(dist2 > dist) player.setCoordsNoOffset(pos.x, pos.y, pos.z, true, true, true)
                resolve(q)
            })
        })
    },
    playEnterCasinoAnim: (pos?: Vector3Mp): Promise<boolean> => {
        return new Promise((resolve) => {
            user.playAnim([[ENTER_ANIM[0], ENTER_ANIM[1]]], false, false).then((q) => {
                const {x,y,z} = pos ? pos : mp.players.local.position
                CustomEvent.triggerServer('casino:freeze', {x,y,z})
                resolve(q)
            })
        })
    },
    playAnim: (seq: [string, string, number?][], upper = false, lopping = false, target?:number) => {
        if (typeof target === "number") return playAnims(target, seq, upper, lopping);
        if (!upper) return playAnims(player.remoteId, seq, upper, lopping);
        else CustomEvent.triggerServer('user:playAnimation', seq, upper, lopping)
    },
    stopAnim: () => {
        if(inCasinoRoulette()) return;
        if(currentSlotData.inGame) return;
        if(inDiceGame()) return;
        if(player.getVariable('inVehicleTruck')) return;
        // @ts-ignore
        if (player.isReloading()) return;
        if(player.getVariable('follow')) return;

        player.clearTasks();
        if(myLastAnimUpper){
            CustomEvent.triggerServer('anim:stop')
            myLastAnimUpperClear();
        }
    },
    disableAllControlsSystem: (status: boolean) => {
        disableAllControlSystemStatus(status);
    },
    interrior: 0,
    get healing() {
        return hospitalTimer > 0
    },
    get inInterrior() {
        return !(!!mp.game.interior.areCoordsCollidingWithExterior(player.position.x, player.position.y, player.position.z))
    },
    /** Статус того, что локальный игрок мёртв */
    get dead() {
        return mp.players.local.isDead() || mp.players.local.getHealth() <= 0;
    },
    get id(): number {
        return player.getVariable('id') || -1
    },
    get fraction(): number {
        return player.getVariable('fraction')
    },
    get fractionData() {
        return user.fraction ? fractionCfg.getFraction(user.fraction) : null
    },
    get family(): number {
        return player.getVariable('family') ? player.getVariable('family')[0] : 0
    },
    get familyRank(): number {
        return player.getVariable('family')[1]
    },
    get rank(): number {
        return player.getVariable('rank')
    },
    get is_gos(): boolean {
        if (!user.fraction) return false;
        const data = fractionCfg.getFraction(user.fraction);
        return data ? !!data.gos : false;
    },
    get is_police(): boolean {
        if (!user.fraction) return false;
        const data = fractionCfg.getFraction(user.fraction);
        return data ? !!data.police : false;
    },
    get is_gang(): boolean {
        if (!user.fraction) return false;
        const data = fractionCfg.getFraction(user.fraction);
        return data ? !!data.gang : false;
    },
    get is_mafia(): boolean {
        if (!user.fraction) return false;
        const data = fractionCfg.getFraction(user.fraction);
        return data ? !!data.mafia : false;
    },
    hasPermission: (name: string) => {
        let perm = permissions[name];
        if (!perm) return false;
        if (user.isAdminNow(7)) return true
        if (perm.admin_level && !user.isAdminNow(perm.admin_level)) return false
        if (perm.fractions) {
            if (!perm.fractions.includes(user.fraction)) return false;
        }
        if (perm.rank && perm.rank > user.rank) return false;
        if (user.fraction && perm.rankLast) {
            const fraction = user.fractionData;
            if (!fraction) return false;
            if (((fraction.ranks.length + 1) - perm.rankLast) > user.rank) return false
        }
        if (perm.gos && !user.is_gos) return false;
        return true
    },
    login: false,
    trackSuspect: -1,
    trackSuspectLastTime: 0,
    notify: (text: string, type: AlertType = "info", img?: string, time = DEFAULT_ALERT_TIME, title?: string) => {
        text = system.filterInput(text);
        text = text.trim();
        CustomEvent.triggerCef('cef:alert:setAlert', type, text, img, time, title)
    },
    get enabledAdmin() {
        let enabled = player.getVariable('enabledAdmin') && user.admin_level > 0
        mp.players.local.setInvincible(!!enabled)
        return !!player.getVariable('enabledAdmin')
    },
    set enabledAdmin(value: boolean) {
        if (user.admin_level == 0) return;
        CustomEvent.triggerServer('enableAdmin', value);

        if(!value && !user.family) CustomEvent.trigger('family:cargoBattle:stopAll')
    },
    isAdminNow(level: number = 1) {
        if (!user.enabledAdmin) return false;
        if (!user.admin_level) return false;
        if (typeof level === 'number') return user.admin_level >= level;
    },
    get admin_level() {
        return player.getVariable('admin_level')
    },
    get test(){
      return test
    },
    getSex: (target = mp.players.local) => {
        if (target.model === mp.game.joaat('mp_f_freemode_01')) return "F";
        else if (target.model === mp.game.joaat('mp_m_freemode_01')) return "M";
    },
    isMale: (target = mp.players.local) => user.getSex(target) == "M",
    isFeemale: (target = mp.players.local) => user.getSex(target) == "F",
    teleport: async (x: number, y: number, z: number, h?: number) => {
        user.showLoadDisplay();
        player.freezePosition(true)
        // mp.game.streaming.requestCollisionAtCoord(x, y, z);
        await system.sleep(system.TELEPORT_TIME);
        player.setCoords(x,y,z, true, true,true, true)
        if (typeof h === "number") player.setHeading(h), mp.game.cam.setGameplayCamRelativeHeading(0);
        cameraManager.destroyCam();
        await system.sleep(1000);
        player.freezePosition(false)
        user.hideLoadDisplay();

        mp.events.call('teleportEnd');
    },
    teleportVisible: async (h?: number) => {
        user.showLoadDisplay();
        await system.sleep(system.TELEPORT_TIME);
        if (typeof h === "number") mp.game.cam.setGameplayCamRelativeHeading(0);
        cameraManager.destroyCam();
        await system.sleep(500);
        user.hideLoadDisplay();
    },
    hideLoadDisplay: (duration: number = 500, hud: boolean = true) => {
        // mp.game.cam.doScreenFadeIn(duration);
        CustomEvent.triggerCef('fadeOut', duration);
    },

    showLoadDisplay: (duration: number = 500, hud: boolean = true) => {
        // mp.game.cam.doScreenFadeOut(duration);
        CustomEvent.triggerCef('fadeIn', duration);
    },
    getLocalSkinData,
    getFullLocalSkinData: () => { return characterLocalSkinData },
    setLocalSkinData,
    setPlayerModel: (model: 'mp_m_freemode_01' | 'mp_f_freemode_01') => {
        CustomEvent.triggerServer('server:user:setPlayerModel', model)
    },
    updateCharacterFace: (isLocal = false) => {

        if (!isLocal) return CustomEvent.triggerServer('server:user:updateCharacterFace');
        player.setHeadBlendData(
            user.getLocalSkinData('SHAPE_THRID_ID'),
            user.getLocalSkinData('SHAPE_SECOND_ID'),
            0,
            user.getLocalSkinData('SKIN_THRID_ID'),
            user.getLocalSkinData('SKIN_SECOND_ID'),
            0,
            user.getLocalSkinData('SHAPE_MIX'),
            user.getLocalSkinData('SKIN_MIX'),
            0,
            true
        );

        let features = user.getLocalSkinData('FACE_SPECIFICATIONS');

        if (features) {
            features.forEach((item, id) => {
                player.setFaceFeature(id, item);
            });
        }

        player.setComponentVariation(2, user.getLocalSkinData('HAIR'), 0, 2);
        player.setHeadOverlay(
            2,
            user.getLocalSkinData('EYEBROWS'),
            user.getLocalSkinData('EYEBROWS_OPACITY'),
            user.getLocalSkinData('EYEBROWS_COLOR'),
            0
        );
        // mp.console.logInfo(`EYEBROWS_COLOR ${user.getLocalSkinData('EYEBROWS_COLOR')}`)
        player.setHairColor(user.getLocalSkinData('HAIR_COLOR'), user.getLocalSkinData('HAIR_COLOR2'));
        player.setEyeColor(user.getLocalSkinData('EYE_COLOR'));
        // player.setHeadOverlayColor(2, user.getLocalSkinData('EYEBROWS_OPACITY'), user.getLocalSkinData('EYEBROWS_COLOR'), 0);

        player.setHeadOverlay(
            9,
            user.getLocalSkinData('OVERLAY9'),
            user.getLocalSkinData('OVERLAY9_OPACITY'),
            user.getLocalSkinData('OVERLAY9_COLOR'),
            0
        );

        if (user.getSex() == "M") {
            if (user.getLocalSkinData('OVERLAY10') != -1)
                player.setHeadOverlay(
                    10,
                    user.getLocalSkinData('OVERLAY10'),
                    1.0,
                    user.getLocalSkinData('OVERLAY10_COLOR'),
                    0
                );
            player.setHeadOverlay(
                1,
                user.getLocalSkinData('OVERLAY'),
                user.getLocalSkinData('OVERLAY_OPACITY'),
                1,
                1
            );
        } else if (user.getSex() == "F") {
            if (user.getLocalSkinData('OVERLAY4') != -1)
                player.setHeadOverlay(
                    4,
                    user.getLocalSkinData('OVERLAY4'),
                    user.getLocalSkinData('OVERLAY4_OPACITY') || 1.0,
                    user.getLocalSkinData('OVERLAY4_COLOR'),
                    0
                );
            if (user.getLocalSkinData('OVERLAY5') != -1)
                player.setHeadOverlay(
                    5,
                    user.getLocalSkinData('OVERLAY5'),
                    1.0,
                    user.getLocalSkinData('OVERLAY5_COLOR'),
                    0
                );
            if (user.getLocalSkinData('OVERLAY8') != -1)
                player.setHeadOverlay(
                    8,
                    user.getLocalSkinData('OVERLAY8'),
                    1.0,
                    user.getLocalSkinData('OVERLAY8_COLOR'),
                    0
                );
            if (user.getLocalSkinData('BLUSH')){
                player.setHeadOverlay(
                    5,
                    user.getLocalSkinData('BLUSH'),
                    user.getLocalSkinData('BLUSH_OPACITY') || 0.0,
                    user.getLocalSkinData('BLUSH_COLOR') || 0,
                    0
                );
            if (user.getLocalSkinData('NAILS') != -1)
                setNailsOverlay(10, user);
            }
            if (user.getLocalSkinData('LIPS') != -1){
                player.setHeadOverlay(
                    8,
                    user.getLocalSkinData('LIPS'),
                    user.getLocalSkinData('LIPS_OPACITY') || 0.0,
                    user.getLocalSkinData('LIPS_COLOR') || 0,
                    0
                );
            }

        }

       

    },
}

// let onVeh:boolean = false;
//
// setInterval(() => {
//     if (!user.login) return;
//     const { x, y, z } = player.position
//     let inInt = mp.game.interior.getInteriorAtCoords(x, y, z)
//     user.interrior = inInt
//     const newOnVeh = player.isOnVehicle();
//     if(newOnVeh != onVeh){
//         onVeh = newOnVeh;
//         CustomEvent.triggerServer('isOnVehicle', newOnVeh)
//     }
// }, 500)

mp.events.add('teleport', async (x: number, y: number, z: number, h?: number) => {
    await user.teleport(x, y, z, h);
})
mp.events.add('teleportVisible', async (h?: number) => {
    await user.teleportVisible(h);
})
let test = false
mp.events.add('setLogin', (signatureKey: string, announce: boolean, ip: string) => {
    user.login = true;
    test = announce

    mp.players.local.setMeleeWeaponDamageModifier = _ => {
        CustomEvent.triggerServer('anticheat:detect', "weapon", "Подозрение на увеличенный урон холодного оружия")
    }
    mp.players.local.setWeaponDamageModifier = _ => {
        CustomEvent.triggerServer('anticheat:detect', "weapon", "Подозрение на увеличенный урон оружия")
    }
    mp.players.local.setWeaponDefenseModifier = _ => {
        CustomEvent.triggerServer('anticheat:detect', "weapon", "Подозрение на увеличенный урон")
    }

    CustomEvent.triggerCef('signatureKey', signatureKey, announce, ip)
})

CustomEvent.registerSocket('test', (data) => {
    user.notify(data);
})


export let cuff_follow = false;

mp.events.add('entityStreamIn', (player: PlayerMp) => {
    if (!player.getVariable('follow')) {
        return;
    }

    handlePlayerFollow(player);
});

mp.events.addDataHandler('follow', (player: PlayerMp) => {
    if (!player.handle) {
        return;
    }

    handlePlayerFollow(player);
});

function handlePlayerFollow(player: PlayerMp) {
    const targetId = player.getVariable('follow') as number;
    if (!targetId) {
        player.clearTasks();
        return;
    }

    const followTarget = mp.players.atRemoteId(targetId - 1)
    if (!followTarget?.handle) {
        return;
    }

    player.taskFollowToOffsetOf(followTarget.handle, 0, 0, 0, 1.0, -1, 1, true);
}

setInterval(() => {
    const targetid = player.getVariable('follow') as number;
    if (cuff_follow && !targetid){
        user.stopAnim();
        cuff_follow = false;
        return;
    } else if (targetid){
        const target = mp.players.atRemoteId(targetid - 1);
        if(!target) return;
        if(!target.handle) return;
        const pos = target.position
        if(!pos) return;
        if(system.distanceToPos(pos, player.position) < 2) return;
        player.taskFollowToOffsetOf(target.handle, 0, 0, 0, 1.0, -1, 1, true);
        // player.taskGoStraightToCoord(pos.x, pos.y, pos.z, 1.0, 30000, system.headingToCoord(player.position, pos), 1.0)
    }

}, 1000)


export let myWeapons: number;
export let myWeaponsHash: string;
export let myWeaponsHashStr = system.randomStr(10);
export const clearAllWeapons = () => {
    myWeapons = null;
    myWeaponsHash = null;
    player.removeAllWeapons()
    player.giveWeapon(-1569615261, 1, true);
    if(player.getVariable('currentWeapon')) CustomEvent.triggerServer('clearcurrentWeapon')
}

const getHashWeapon = (weapon:HashOrString): number => {
    let hash = (weapon_hashes as [string, number][]).find(q => q[0].toUpperCase() === String(weapon).toUpperCase() || q[1] === weapon || mp.game.joaat(q[0] as string) === weapon);
    return hash ? hash[1] as number : null;
}

CustomEvent.registerServer('user:removeWeapon', () => {
    clearAllWeapons();
})

// mp.events.add('render', () => {
//     mp.players.forEachInStreamRange(target => {
//         if(target.remoteId === player.remoteId) return;
//         const currentVariable = target.getVariable('currentWeapon');
//         if(currentVariable){
//             const currentData = getHashWeapon(currentVariable)
//             if(!currentData) return target.giveWeapon(-1569615261, 1, true);
//             if(!target.ammoFix){
//                 const ammo = mp.game.invoke('0x2E1202248937775C', target.handle, currentData);
//                 if(!ammo){
//                     mp.game.invoke('0x4899CB088EDF59B8', target.handle, currentData);
//                     target.ammoFix = 1;
//                 } else {
//                     target.ammoFix = 0;
//                 }
//             } else {
//                 if(target.ammoFix === 1){
//                     mp.game.invoke('0xBF0FD6E56C964FCB', target.handle, currentData, 0, false, true)
//                     target.ammoFix = 2;
//                 }
//             }
//
//
//
//             // const current = mp.game.invoke('0x0A6DB4965674D243', target.handle);
//             // if(currentData != current) {
//             //     target.removeWeapon(currentData)
//             //     setTimeout(() => {
//             //         target.giveWeapon(currentData, 0, true);
//             //     }, 100)
//             // }
//         }
//     })
// })

CustomEvent.registerServer('user:giveWeapon', (weapon: HashOrString, ammo: number, equipNow = true) => {
    let hash = typeof weapon === "number" ? weapon : getHashWeapon(weapon)
    if(!hash) return user.notify('bad hash');
    myWeapons = hash;
    myWeaponsHash = system.encryptCodes(myWeapons.toString(), myWeaponsHashStr);
    player.giveWeapon(hash, ammo, equipNow);
})

export const giveWeaponLocally = (weapon: HashOrString, ammo: number, equipNow = true) => {
    let hash = typeof weapon === "number" ? weapon : getHashWeapon(weapon)
    myWeapons = hash;
    myWeaponsHash = system.encryptCodes(myWeapons.toString(), myWeaponsHashStr);
    player.giveWeapon(hash, ammo, equipNow);
}

export let nowPutIntoVehicle = 0;

export const nowPutIntoVehicleBlock = () => {
    nowPutIntoVehicle++;
    setTimeout(() => {
        nowPutIntoVehicle--;
    }, 1000)
}

CustomEvent.registerServer('user:leaveVehicle', (flag: RageEnums.LeaveVehicle = 16) => {
    if(!player.vehicle) return;
    player.taskLeaveVehicle(player.vehicle.handle, flag)
})

CustomEvent.registerServer('user:putIntoVehicle', async (vehid: number, seat: number) => {
    seat -= 1;
    const veh = mp.vehicles.atRemoteId(vehid);
    if(!veh) return;
    let count = 0;
    while(!veh.handle && count < 10){
        count += 1;
        await system.sleep(500);
    }
    if(!veh.handle) return;
    nowPutIntoVehicle++
    player.setIntoVehicle(veh.handle, seat)
    setTimeout(() => {
        nowPutIntoVehicle--;
    }, 1000)
})