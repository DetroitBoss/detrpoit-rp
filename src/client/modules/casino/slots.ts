import {
    CASINO_SLOT_BETS_LIST,
    CASINO_SLOT_ENTER_DISTANCE,
    CASINO_SLOT_SEAT_OFFSET, CASINO_SLOT_STEP,
    CASINO_SLOTS_DATA
} from "../../../shared/casino/slots";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {
    CASINO_INTERIORS_IDS_IN, CASINO_MAIN_DIMENSION,
    CHIP_TYPE_MODELS,
    ENTER_ANIM,
    EXIT_ANIM,
    getChipIndexBySum
} from "../../../shared/casino/main";
import {GRID_START_Z} from "../../../shared/casino/roulette";
import {hideHud} from "../gui";
import {needCasinoExit} from "./advanced";
import {gui} from "../gui";
const player = mp.players.local;


const getNearestSlotsMachines = (target = mp.players.local) => {
    if(player.dimension !== CASINO_MAIN_DIMENSION) return null;
    let handles:number[] = [];
    const {x,y,z} = target.position;
    CASINO_SLOTS_DATA.map(({hash, model}) => {
        let handle = mp.game.object.getClosestObjectOfType(x,y,z, CASINO_SLOT_ENTER_DISTANCE, hash, true, true, true);
        if(handle) handles.push(handle);
    })
    if(handles.length === 0) return null;
    return system.sortArrayObjects(handles.map(handle => {
        const q = getSlotPosition(handle)
        return {handle, ...q, dist: system.distanceToPos({x,y,z}, q)}
    }), [
        {id: 'dist', type: 'ASC'}
    ])
}
export const getNearestSlotsMachine = (target = mp.players.local) => {
    const q = getNearestSlotsMachines(target);
    return q ? q[0] : null;
}

export const inSlotGame = () => {
    return currentSlotData.inGame
}

export const getSlotPosition = (handle: number) => {
    const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
    const model = mp.game.invoke('0x9F47B058362C84B5', handle) as number
    return {x: pos.x, y: pos.y, z: pos.z, h: heading.x, model};
}

export const standOffset = (handle: number) => {
    return mp.game.invokeVector3('0x1899F328B0E12848', handle, CASINO_SLOT_SEAT_OFFSET.x, CASINO_SLOT_SEAT_OFFSET.sy, CASINO_SLOT_SEAT_OFFSET.z)
}

const inCasinoInt = () => {
    const {x,y,z} = mp.players.local.position;
    return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
}

interface ReelsObjectInterface extends ObjectMp {
    heading: number;
    active: boolean;
    activeWin: boolean;
    winNumber: number;
}

const createReels = (handle: number, offset: Vector3Mp): ReelsObjectInterface => {
    const data = getSlotPosition(handle);
    const cfg = CASINO_SLOTS_DATA.find(q => q.hash === data.model)
    const reels: ReelsObjectInterface = mp.objects.new(mp.game.joaat(`${cfg.model}_reels`), mp.game.object.getObjectOffsetFromCoords(data.x, data.y, data.z, data.h, offset.x, offset.y, offset.z), {
        dimension: -1
    }) as ReelsObjectInterface;

    reels.setCollision(false, false);
    reels.setRotation(0, 0, data.h, 2, true);

    reels.heading = data.h;
    reels.active = false;
    reels.activeWin = false;
    reels.winNumber = -1;

    return reels;
};

mp.events.add('casino:slotmachine:changeBet', (isIncrease: boolean) => {
    if (isIncrease) {
        changeChipType(1);
    } else {
        changeChipType(-1);
    }
});

export let currentSlotData = {
    goToCoord: false,
    id: 0,
    handle: 0,
    waitSpinResponse: false,
    currentChipSum: CASINO_SLOT_BETS_LIST[0],
    get inGame(){
        return currentSlotData.id != 0;
    },
    get playerIdleAnims(){
        return [
            [`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@base`, 'base'],
            [`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_a'],
            [`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_b'],
            [`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_c'],
            [`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_d'],
        ]
    },
    get playerSpinAnim(){
        return system.randomArrayElement([
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'spinning_a'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'spinning_b'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'spinning_c'],
        ])
    },
    get playerLoseAnim(){
        return system.randomArrayElement([
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_a'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_b'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_c'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_d'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_e'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'lose_f'],
        ])
    },
    get playerWinAnim(){
        return system.randomArrayElement([
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_a'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_b'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_c'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_d'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_e'],
            [`anim_casino_a@amb@casino@games@slots@${user.isMale() ? '' : 'fe'}male`, 'win_f'],
        ])
    },
    get idleAnim():[string, string]{
        let anim = system.randomArrayElement(currentSlotData.playerIdleAnims)
        return [`${anim[0]}`, anim[1]]
    },
    playIdleAnim(){
        user.playAnim([currentSlotData.idleAnim], false, false)
    },
    betButtonAnim: () => {
        if(!currentSlotData.betVerify) return;
        currentSlotData.waitSpinResponse = true;
        user.playAnim([[`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@play@v02`, "bet_one_press_spin"]], true, false);
        setTimeout(() => currentSlotData.betPlay(), 3000)
    },
    betStickAnim: () => {
        if(!currentSlotData.betVerify) return;
        currentSlotData.waitSpinResponse = true;
        user.playAnim([[`anim_casino_a@amb@casino@games@slots@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@play@v02`, "bet_one_pull_spin"]], true, false)
        setTimeout(() => currentSlotData.betPlay(), 3000)
    },
    get betVerify(){
        if(!currentSlotData.inGame) return false;
        if(currentSlotData.waitSpinResponse) return false
        if(currentSlotData.goToCoord) return false;
        if(!currentSlotData.isPlayingIldeAnim) return false;
        return true;
    },
    get isPlayingIldeAnim(){
        return !!currentSlotData.playerIdleAnims.find(anim => player.isPlayingAnim(anim[0], anim[1], 3));
    },
    betPlay: () => {
        currentSlotData.waitSpinResponse = false;
        if(user.chips < currentSlotData.currentChipSum) return user.notify('У вас недостаточно фишек для такой ставки', 'error');
        currentSlotData.waitSpinResponse = true;
        const animSpin = currentSlotData.playerSpinAnim
        user.playAnim([[animSpin[0], animSpin[1]]], true);
        CustomEvent.callServer('casino:slots:roll', currentSlotData.id, currentSlotData.currentChipSum).then(([winNumbers, isWin]) => {
            if(!winNumbers) return currentSlotData.waitSpinResponse = false;
            spinWin(player.remoteId, currentSlotData.id, winNumbers)
            setTimeout(() => {
                setTimeout(() => {
                    currentSlotData.waitSpinResponse = false;
                }, 500)
                const anim = isWin ? currentSlotData.playerWinAnim : currentSlotData.playerLoseAnim
                user.playAnim([[anim[0], anim[1]]], true);
            }, 5500)
        })
    }

}

const changeChipType = (direction: number) => {
    if (!currentSlotData.inGame) return false;
    let nextId = 0;
    const currentIndex = CASINO_SLOT_BETS_LIST.findIndex(q => q === currentSlotData.currentChipSum)
    nextId = currentIndex + direction
    if(!CASINO_SLOT_BETS_LIST[nextId]) {
        if(direction > 0) nextId = 0;
        else nextId = CASINO_SLOT_BETS_LIST.length - 1;
    }
    currentSlotData.currentChipSum = CASINO_SLOT_BETS_LIST[nextId]
    sendCEFData()
};

const sendCEFData = (exit = false) => {
    CustomEvent.triggerCef('casino:slots:data', exit ? 0 : currentSlotData.currentChipSum)
    hideHud(!exit)
}

// Space
mp.keys.bind(32, true, () => {
    currentSlotData.betButtonAnim();
});
// Enter
mp.keys.bind(13, true, () => {
    currentSlotData.betStickAnim();
});
// BetUp
mp.keys.bind(38, true, () => {
    changeChipType(1);
});
// BetDown
mp.keys.bind(40, true, () => {
    changeChipType(-1);
});

export const enterSlots = () => {
    if(!inCasinoInt()) return false;
    const q = getNearestSlotsMachine();
    if(!q) return false;
    const id = q.model + Math.floor(q.x) + Math.floor(q.y) + Math.floor(q.z);
    CustomEvent.callServer('casino:slots:enter', id).then(status => {
        if(typeof status === 'string') return user.notify(status, 'error');
        if(!status) return user.notify('Место занято', 'error');
        currentSlotData.id = id;
        currentSlotData.goToCoord = true;
        currentSlotData.handle = q.handle;

        const pos = standOffset(q.handle);
        const heading = q.h + CASINO_SLOT_SEAT_OFFSET.h;
        user.goToCoord(pos, heading).then(z => {
            mp.game.invoke("0x1A9205C1B9EE827F", q.handle, false, false);
            if (!z) {
                mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, true, true, true);
                mp.players.local.setHeading(heading);
            }
            user.playEnterCasinoAnim().then(() => {
                currentSlotData.goToCoord = false;
                currentSlotData.playIdleAnim();
                gui.setGui('casinoslots');
                sendCEFData()
            })
        });
    })

    return true;
}

let tempIdsReels:{[key: number]: [ReelsObjectInterface, ReelsObjectInterface, ReelsObjectInterface, Vector3Mp, number]} = {}
setInterval(() => {
    for(let keyq in tempIdsReels){
        let key: number = keyq as any;
        const data = tempIdsReels[key];
        if(data){
            const dist = system.distanceToPos(data[3], player.position);
            if(dist > 20){
                destroySpin(key);
            }
        }
    }
}, 1000)

export const destroySpin = (key: number) => {
    const data = tempIdsReels[key];
    if(data){
        if(data[0] && mp.objects.exists(data[0])) data[0].destroy();
        if(data[1] && mp.objects.exists(data[1])) data[1].destroy();
        if(data[2] && mp.objects.exists(data[2])) data[2].destroy();
        tempIdsReels[key] = null;
        delete tempIdsReels[key];
    }
}

const spinWin = (targetId: number, id: number, winNumbers: string) => {
    const target = mp.players.atRemoteId(targetId);
    if(!target || !target.handle) return;

    const q = getNearestSlotsMachine(target);
    if(!q || !q.handle) return;

    if(!tempIdsReels[id] || !tempIdsReels[id][0] || !tempIdsReels[id][0].handle) destroySpin(id);

    if(!tempIdsReels[id]){
        tempIdsReels[id] = [
            createReels(q.handle, new mp.Vector3(-0.115, 0.047, 1.1)),
            createReels(q.handle, new mp.Vector3(0.005, 0.047, 1.1)),
            createReels(q.handle, new mp.Vector3(0.125, 0.047, 1.1)),
            new mp.Vector3(q.x, q.y, q.z),
            0
        ]
    }
    tempIdsReels[id][4] = 0;


    for (let i = 0; i < 3; i++) {
        (tempIdsReels[id][i] as ReelsObjectInterface).winNumber = -1;
        (tempIdsReels[id][i] as ReelsObjectInterface).active = true;
    }
    const [first, second, three] = winNumbers.split('-').map((winNumber: string): number => parseInt(winNumber));
    setTimeout(() => {
        if(!tempIdsReels[id] || !tempIdsReels[id][0] || !tempIdsReels[id][0].handle) return;
        (tempIdsReels[id][0] as ReelsObjectInterface).winNumber = first;
        (tempIdsReels[id][0] as ReelsObjectInterface).activeWin = true;

        setTimeout(() => {
            if(!tempIdsReels[id] || !tempIdsReels[id][0] || !tempIdsReels[id][0].handle) return;
            (tempIdsReels[id][1] as ReelsObjectInterface).winNumber = second;
            (tempIdsReels[id][1] as ReelsObjectInterface).activeWin = true;

        }, 1000);

        setTimeout(() => {
            if(!tempIdsReels[id] || !tempIdsReels[id][0] || !tempIdsReels[id][0].handle) return;
            (tempIdsReels[id][2] as ReelsObjectInterface).winNumber = three;
            (tempIdsReels[id][2] as ReelsObjectInterface).activeWin = true;

        }, 2000);
    }, 3000);
}


CustomEvent.registerServer('casino:slots:rollVisual', (targetId: number, id: number, winNumbers: string) => {
    spinWin(targetId, id, winNumbers);
})

mp.events.add('render', () => {
    for(let keyq in tempIdsReels){
        let key: number = keyq as any;
        let data = tempIdsReels[key];
        if(data){
            if(data[0] && data[0].handle){
                data[4]+=10

                for (let i = 0; i < 3; i++) {
                    const reels = data[i] as ReelsObjectInterface ;

                    if (reels && mp.objects.exists(reels) && reels.active) {
                        reels.setRotation(data[4], 0, reels.heading, 2, true);

                        if (typeof reels.winNumber === 'number' && reels.winNumber !== -1 && reels.activeWin) {
                            const winRotation = reels.winNumber * CASINO_SLOT_STEP;
                            const reelsRotation = reels.getRotation(1);

                            if (reelsRotation.x >= winRotation) {
                                reels.active = false;
                                reels.setRotation(winRotation, 0, reels.heading, 2, true);
                            }
                        }
                    }
                }
            }
        }
    }
    if(!currentSlotData.inGame) return;



    mp.game.controls.disableControlAction(2, 200, true);
    if (!currentSlotData.goToCoord && !currentSlotData.waitSpinResponse && needCasinoExit()) {
        sendCEFData(true);
        user.playExitCasinoAnim().then(() => {
            gui.setGui(null);
            mp.game.invoke("0x1A9205C1B9EE827F", currentSlotData.handle, true, true);
            CustomEvent.triggerServer('casino:slots:exit', currentSlotData.id)
            currentSlotData.id = 0;
        })
    } else {
        let okAnim = false;
        if(!currentSlotData.goToCoord && !player.isPlayingAnim(EXIT_ANIM[0], EXIT_ANIM[1], 3) && !player.isPlayingAnim(ENTER_ANIM[0], ENTER_ANIM[1], 3)){
            currentSlotData.playerIdleAnims.map(anim => {
                if(okAnim || (player.isPlayingAnim(anim[0], anim[1], 3) && player.getAnimCurrentTime(anim[0], anim[1]) < 0.90)) okAnim = true;
            })
            if(!okAnim) currentSlotData.playIdleAnim()
        }
    }
})