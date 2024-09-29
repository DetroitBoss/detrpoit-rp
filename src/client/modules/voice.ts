import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {gui} from "./gui";
import {playAnims} from "./anim";
import {
    MaxRange,
    MICROPHONE_PROPS,
    POLICE_MEGAPHONE_PROPS,
    VOICE_VEH_ONE_DIVIDER, VOICE_VEH_TWO_DIVIDER,
    VOICE_WALL_DIVIDER
} from "../../shared/megaphone";


mp.events.add('saveVoiceSettings', (params: string) => {
    const cfg:[number, number, number] = JSON.parse(params);
    if (mp.storage.data.voiceSettings[0] != cfg[0]) {
        CustomEvent.triggerServer('setMicrophoneVolume', mp.storage.data.voiceSettings[0])
    }
    mp.storage.data.voiceSettings = cfg
    user.notify("Настройки голосового чата сохранены", "success");
    setTimeout(() => {
        voiceConfig()
    }, 100)
})


CustomEvent.register('vreload', () => {
    mp.voiceChat.cleanupAndReload(true, true, true)
    user.notify('Голосовой чат перезапущен', 'success');
})


let voiceVolume = 6.0;
let phoneVolume = 11.0;
const voiceVolumeBasic = 2.0
const phoneVolumeBasic = 11.0


export const getVoiceSettingMultiple = (id: number) => {
    if(!mp.storage.data.voiceUsers) mp.storage.data.voiceUsers = []
    const data = mp.storage.data.voiceUsers.find(q => q[0] === id)
    return data ? data[1] : 100
}


function voiceConfig(){
    const cfg = mp.storage.data.voiceSettings;
    if(!cfg) mp.storage.data.voiceSettings = [100, 100, 100];
    voiceVolume = (voiceVolumeBasic / 100) * mp.storage.data.voiceSettings[1]
    phoneVolume = (phoneVolumeBasic / 100) * mp.storage.data.voiceSettings[2]
}

voiceConfig()
setTimeout(() => {
    if (mp.storage.data.voiceSettings[0] !== 100) CustomEvent.triggerServer('setMicrophoneVolume', mp.storage.data.voiceSettings[0])
}, 1000)

export const getVoiceMultipler = (target: PlayerMp): number => {
    if(!mp.players.exists(target)) return 0;

    let val = 0;
    const id = target.getVariable('id')
    const level = mp.storage.data.voiceLevel || 1;
    const ulvl = Number(target.getVariable('level')) || 1
    if(level > ulvl) return 0.0;
    if (typeof target.getVariable('microphoneVolume') !== "number") val = 1;
    else val = target.getVariable('microphoneVolume') / 100
    return val * (getVoiceSettingMultiple(id) / 100)
}

let currentRadio = ""


/** Игроки, которые рядом, которых мы должны слышать */
let worldList: number[] = [];
/** Игрок, с которым мы говорим по телефону */
let phoneTarget: number;
/** Игроки, которые на одной частоте с нами */
let radioList: number[] = [];

let block = false;

let currentMyMultiple = null;
let pressMegaphone = false;

export const getDistAndMultipleTarget = (target: PlayerMp):{multiple: number, dist: number} => {
    if(!target || !mp.players.exists(target)) return {dist: MaxRange, multiple: 1.0};
    const data = target.getVariable('microphoneVolumeCustom');
    if(!data) return {dist: MaxRange, multiple: 1.0};
    const q = JSON.parse(data);
    if(!q) return {dist: MaxRange, multiple: 1.0};
    return {dist: q[1], multiple: q[0]};
}

let currentMultSend = false;
setInterval(() => {
    if(!user.login) return;
    let keypress = mp.keys.isDown(mp.storage.data.hotkeys.megaphone);
    if(!keypress && currentMultSend) {
        CustomEvent.triggerServer('voice:setDistAndMultiple', 0, 0)
        currentMultSend = false;
        return
    } else {
        if(keypress){
            let haveAccess = [0, 0];
            const veh = mp.players.local.vehicle
            if(veh){
                if(veh.getPedInSeat(0) !== mp.players.local.handle || !veh.getIsEngineRunning()) return;
                const item = POLICE_MEGAPHONE_PROPS.find(q => mp.game.joaat(q.model) === veh.model)
                if(item) {
                    haveAccess = [item.multiple, item.dist]
                    // CustomEvent.triggerServer('voice:setDistAndMultiple', item.multiple, item.dist)
                }
            }
            if(haveAccess[0] == 0){
                const pos = mp.players.local.position
                const item = MICROPHONE_PROPS.find(q => mp.game.object.getClosestObjectOfType(pos.x, pos.y, pos.z, 3, mp.game.joaat(q.model), true, true, true))
                if(item) {
                    haveAccess = [item.multiple, item.dist]
                }
            }
            if(haveAccess[0] == 0 && currentMultSend){
                CustomEvent.triggerServer('voice:setDistAndMultiple', 0, 0)
                currentMultSend = false;
            } else if(haveAccess[0] != 0 && !currentMultSend){
                CustomEvent.triggerServer('voice:setDistAndMultiple', haveAccess[0], haveAccess[1]);
                currentMultSend = true;
            }

        }
    }
}, 100)




export function restartVoice() {
    if (block) return mp.game.ui.notifications.show('~r~Нельзя так часто перезагружать голосовой чат');
    block = true;
    setTimeout(() => {
        block = false;
    }, 10000)
    mp.voiceChat.cleanupAndReload(true, true, true);
    mp.game.ui.notifications.show('~g~Голосовой чат перезапущен');
}

function removeWorldVoice(nplayer: PlayerMp | number, disconnect = true, triggerServer = true) {
    if (typeof nplayer == "number") nplayer = mp.players.atRemoteId(nplayer);
    if (!mp.players.exists(nplayer)) return;
    if (nplayer.remoteId == phoneTarget) return;
    if (radioList.indexOf(nplayer.remoteId) > -1) return;
    let idx = worldList.indexOf(nplayer.remoteId);
    if (idx !== -1)
        worldList.splice(idx, 1);
    if (!disconnect) return;
    const dist = system.distanceToPos(mp.players.local.position, nplayer.position);
    const dataMultiple = getDistAndMultipleTarget(nplayer)

    if (triggerServer) {
        CustomEvent.triggerServer("worldVoiceRemove", nplayer.remoteId);
    }
    nplayer.isListening = false;
    nplayer.voiceVolume = 0.0;
    nplayer.voice3d = false;
}
let radioSpeakersq: string[] = [];
function voiceControllerTick() {
    radioSpeakersq = []
    currentRadio = mp.players.local.getVariable('radioVol')

    const playersToRemove: number[] = [];
    const playersToAdd: number[] = [];

    mp.players.forEach(nplayer => {
        /** Отключаем проверку на самомо себя */
        if (nplayer.remoteId === mp.players.local.remoteId) return;
        /** Проверяем, мб мы должны работать с телефонным звонком либо рацией */
        if (!phoneRadioController(nplayer)) {
            /** Если игрок не в зоне стрима - отключаем сходу */
            if (!nplayer.handle) {
                nplayer.voiceVolume = 0.0;
                nplayer.voice3d = false;
                return;
            }
            /** Определяем расстояние между игроками */
            const dist = system.distanceToPos(mp.players.local.position, nplayer.position);
            const dataMultiple = getDistAndMultipleTarget(nplayer)
            /** Статус того, нужно ли нам разговаривать или нет */
            const needSpeak = (dist <= dataMultiple.dist) && mp.players.local.dimension == nplayer.dimension
            // Отключаем голос если он подключён
            if (!needSpeak) {
                // Определяем надобность того, чтобы запросить отмену передачи голоса
                if (worldList.indexOf(nplayer.remoteId) > -1) {
                    removeWorldVoice(nplayer, true, false)
                    playersToRemove.push(nplayer.remoteId);
                }
                nplayer.voiceVolume = 0.0;
                nplayer.voice3d = false;
            } else {
                // Определяем надобность того, чтобы запросить передачу голоса
                if (worldList.indexOf(nplayer.remoteId) == -1) {
                    worldList.push(nplayer.remoteId);
                    playersToAdd.push(nplayer.remoteId);
                    nplayer.isListening = true;
                }
                //////////////////////////////////////////////////////////////
                ///////// Теперь определяем громкость передачи голоса ////////
                //////////////////////////////////////////////////////////////
                // Если оба в одном ТС
                if (nplayer.vehicle && nplayer.vehicle == mp.players.local.vehicle) {
                    nplayer.voiceVolume = (voiceVolume * getVoiceMultipler(nplayer)) * dataMultiple.multiple;
                    nplayer.voice3d = false;
                } else {

                    let s = 1
                    let clearLosTo = mp.players.local.hasClearLosTo(nplayer.handle, 17)
                    if(clearLosTo){
                        const myVeh = mp.players.local.vehicle;
                        const tVeh = nplayer.vehicle;
                        if(myVeh){
                            if(!mp.game.vehicle.isThisModelABike(myVeh.model) &&
                                !mp.game.vehicle.isThisModelABicycle(myVeh.model) &&
                                !mp.game.vehicle.isThisModelAQuadbike(myVeh.model) &&
                                !mp.game.vehicle.isThisModelABoat(myVeh.model)
                            ){
                                s = VOICE_VEH_ONE_DIVIDER;
                            }
                        }
                        if(tVeh){
                            if(!mp.game.vehicle.isThisModelABike(tVeh.model) &&
                                !mp.game.vehicle.isThisModelABicycle(tVeh.model) &&
                                !mp.game.vehicle.isThisModelAQuadbike(tVeh.model) &&
                                !mp.game.vehicle.isThisModelABoat(tVeh.model)
                            ){
                                if(s != VOICE_VEH_ONE_DIVIDER) s = VOICE_VEH_TWO_DIVIDER
                                else s = VOICE_VEH_ONE_DIVIDER;
                            }
                        }
                    } else {
                        s = VOICE_WALL_DIVIDER;
                    }

                    let maxVoiceVolume = ((voiceVolume * getVoiceMultipler(nplayer)) * dataMultiple.multiple);
                    let metrVoiceVolume = maxVoiceVolume / dataMultiple.dist;
                    let minusVoiceVolume = metrVoiceVolume * dist;
                    let endVolume = (maxVoiceVolume - minusVoiceVolume) / s;
                    if (endVolume < 0) endVolume = 0.0
                    nplayer.voiceVolume = endVolume;
                    nplayer.voice3d = true;
                }
            }
        }
    })
    radioSpeakers = radioSpeakersq

    CustomEvent.triggerServer("worldVoiceChangeScope", playersToRemove, playersToAdd);
}

setInterval(() => {
    if (!user.login) return;
    voiceControllerTick()
}, 100)

function phoneRadioController(nplayer: PlayerMp) {
    let speak = false
    if (nplayer) {
        if (currentRadio && currentRadio.length > 3 && currentRadio == nplayer.getVariable('radioVol') && nplayer.getVariable('radioSpeak')) {
            nplayer.voiceVolume = phoneVolume * getVoiceMultipler(nplayer);
            nplayer.voice3d = false;
            speak = true;
            if (!radioSpeakersq.includes(`${nplayer.getVariable('name')} [${nplayer.getVariable('id')}]`))
                radioSpeakersq.push(`${nplayer.getVariable('name')} [${nplayer.getVariable('id')}]`)
        }
        if (typeof phoneTarget === "number" && phoneTarget == nplayer.remoteId) {
            nplayer.voiceVolume = phoneVolume * getVoiceMultipler(nplayer);
            nplayer.voice3d = false;
            speak = true;
        }
    }
    if (!speak) {
        if (worldList.indexOf(nplayer.remoteId) == -1) {
            nplayer.voiceVolume = 0.0;
            nplayer.voice3d = false;
        }
    }
    return speak;
}

mp.events.add('radio:targetStopSpeak', (targetid: number) => {
    radioList.splice(radioList.indexOf(targetid), 1)
    removeWorldVoice(targetid)
})
mp.events.add('radio:targetStartSpeak', (targetid: number) => {
    radioList.splice(radioList.indexOf(targetid), 1)
    radioList.push(targetid);
})

mp.events.addDataHandler("muted:voice", (entity, value) => {
    if (entity != mp.players.local) return;
    if (!value) return gui.execute('CEF.hud.lockMicrophone(false)');
    disableMicrophone()
    disableMicrophoneRadio()
    gui.execute('CEF.hud.lockMicrophone(true)');
});

export let pressVoice = false;

const enableMicrophone = async () => {
    if (!user.login) return;
    if (user.dead)
        return;
    if (mp.players.local.getVariable('muted:voice')) return user.notify(`У вас блокировка голосового чата до ${system.timeStampString(mp.players.local.getVariable('muted:voice'))}`, 'error');
    if (pressVoice) return;
    mp.voiceChat.muted = false;
    CustomEvent.triggerCef('hud:setMicrophone', true)
    CustomEvent.triggerServer('startWorldSpeak')
    pressVoice = true;
    setTimeout(() => {
        pressVoice = false;
    }, 300)
    voiceKeyPressed = true;
    mp.game.streaming.requestAnimDict("mp_facial");
    while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
        await system.sleep(10);
    mp.players.local.playFacialAnim("mic_chatter", "mp_facial");
}
const disableMicrophone = async () => {
    if (!user.login) return;
    mp.voiceChat.muted = true;
    CustomEvent.triggerCef('hud:setMicrophone', false)
    CustomEvent.triggerServer('stopWorldSpeak')
    voiceKeyPressed = false;
    mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
    while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
        await system.sleep(10);
    mp.players.local.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
}

setInterval(() => {
    if (radioKeyPressed || mp.players.local.getVariable('radioSpeak')) {
        if (mp.keys.isDown(mp.storage.data.hotkeys.radio)) return;
        disableMicrophoneRadio();
        return;
    }
    if (voiceKeyPressed) {
        if (mp.keys.isDown(mp.storage.data.hotkeys.voice)) return;
        disableMicrophone();
        return;
    }
}, 1500);

let radioKeyPressed = false;
export let voiceKeyPressed = false;

const enableMicrophoneRadio = () => {
    if (!user.login)
        return;
    if (user.cuffed)
        return;
    if (user.dead)
        return;
    if (radioKeyPressed) return;
    if (!mp.players.local.getVariable('radioVol')) return;
    if (mp.players.local.getVariable('muted:voice')) return user.notify(`У вас блокировка голосового чата до ${system.timeStampString(mp.players.local.getVariable('muted:voice'))}`, 'error');
    radioKeyPressed = true;
    CustomEvent.triggerCef('radio:speaking', true);
    CustomEvent.triggerServer("radio:enableMic");
    enableMicrophone()
};

const disableMicrophoneRadio = () => {
    if (!user.login)
        return;
    if (!radioKeyPressed)
        return;
    
    disableMicrophone();
    CustomEvent.triggerCef('radio:speaking', false);
    user.stopAnim();
    radioKeyPressed = false;
    CustomEvent.triggerServer("radio:disableMic");
};

CustomEvent.register('radio', (status => {
    if (status) enableMicrophoneRadio()
    else disableMicrophoneRadio()
}))
CustomEvent.register('voice', (status => {
    if (status) enableMicrophone()
    else disableMicrophone()
}))


let oldRadioSpeakData:string[] = [];
setInterval(() => {
    if (JSON.stringify(oldRadioSpeakData) !== JSON.stringify(radioSpeakers)){
        oldRadioSpeakData = radioSpeakers;
        CustomEvent.triggerCef('radio:speakersList', radioSpeakers);
    }
}, 100)


mp.events.addDataHandler('radioVol', (playerq:PlayerMp, value: string) => {
    if (playerq.remoteId == mp.players.local.remoteId) {
        CustomEvent.triggerCef("radio:setFreq", value)
        mp.storage.data.radioFreq = value;
    }
});

mp.events.addDataHandler('radioSpeak', (playerq:PlayerMp, status: boolean) => {
    if(status){
        playAnims(playerq.remoteId, [["random@arrests", "generic_radio_chatter"]], true, true)
    } else {
        playerq.clearTasks()
    }
});

let int = setInterval(() => {
    if(!user.login) return;
    clearInterval(int);
    if(!mp.storage.data.radioFreq) return;
    CustomEvent.triggerServer('radio:connectToFreq', mp.storage.data.radioFreq, false);
}, 1000)

mp.events.add({
    "playerStartTalking": (nplayer: PlayerMp) => {
        phoneRadioController(nplayer);
    },
    "playerStartTalkingEvent": async (nplayer: PlayerMp) => {
        if (!nplayer) return;
        nplayer.isSpeaking = true;


        let radioVol = mp.players.local.getVariable("radioVol");

        let nradioVol = nplayer.getVariable("radioVol");
        let nradiospeak = nplayer.getVariable('radioSpeak');
        if ((phoneTarget == nplayer.remoteId) || (radioVol && radioVol == nradioVol && nradiospeak)) {
            nplayer.voiceVolume = phoneVolume * getVoiceMultipler(nplayer);
            nplayer.voice3d = false;
            // if (radioVol && radioVol == nradioVol && nradiospeak) ui.radioSoundOn();
            // if (worldList.indexOf(nplayer) > -1) worldList.splice(worldList.indexOf(nplayer), 1)
        }
        phoneRadioController(nplayer);

        if (!nplayer.handle) return;
        mp.game.streaming.requestAnimDict("mp_facial");
        while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
            await system.sleep(10);
        nplayer.playFacialAnim("mic_chatter", "mp_facial");
    },
    "playerStopTalkingEvent": async (nplayer: PlayerMp) => {
        if (!nplayer) return;
        nplayer.isSpeaking = false;
        // if (radioVol && radioVol == nradioVol && nradiospeak) ui.radioSoundOff();
        if (!nplayer.handle) return;
        mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
        while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
            await system.sleep(10);
        nplayer.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
    },
    "playerQuit": (nplayer: PlayerMp) => {
        if (!nplayer) return;
        worldList.splice(worldList.indexOf(nplayer.remoteId), 1);
        radioList.splice(radioList.indexOf(nplayer.remoteId), 1);
        if (phoneTarget == nplayer.remoteId) phoneTarget = null;
    },
    "callStop": () => {
        const target = mp.players.atRemoteId(phoneTarget)
        phoneTarget = null;
        removeWorldVoice(target);
    },
    "callStart": (nplayerid: number) => {
        phoneTarget = nplayerid;
    },
});


let radioSpeakers: string[] = [];
