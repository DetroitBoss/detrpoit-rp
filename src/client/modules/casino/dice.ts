import {DICE_TABLE_MODEL, DICE_TABLE_SETTINGS, DICE_TABLES_LIST, getCasinoDiceTable} from "../../../shared/casino/dice";
import {user} from "../user";
import {
    ROULETTE_TABLE_COLOR,
    ROULETTE_TABLE_ENTER_DISTANCE_SEAT,
    ROULETTE_VIP_TABLE_COLOR
} from "../../../shared/casino/roulette";
import {colshapes, playerExitColshape} from "../checkpoints";
import {CustomEvent} from "../custom.event";
import {system} from "../system";
import {CASINO_DEALERS, ENTER_ANIM, EXIT_ANIM} from "../../../shared/casino/main";
import {disableControlGroup} from "../controls";
import {CamerasManager} from "../cameraManager";
import {gui} from "../gui";
import {needCasinoExit} from "./advanced";

const player = mp.players.local

let tables = new Map<number, {
    object: ObjectMp,
    id: number,
    ped?:PedMp,
    speech: string,
    male: boolean,
    playerCamera: {x: number, y: number, z: number, rx: number, ry: number, rz: number},
    crCamera: {x: number, y: number, z: number, rx: number, ry: number, rz: number},
}>();

/** Камера над столом */
const camera = CamerasManager.hasCamera('casino_dice') ?
    CamerasManager.getCamera('casino_dice') :
    CamerasManager.createCamera(
        'casino_dice',
        'default',
        new mp.Vector3(0, 0, 0),
        new mp.Vector3(-90, 0, 0),
        50
    );

const currentData = {
    block: false,
    get playerIdleAnims(){
        return [
            [`anim_casino_b@amb@casino@games@threecardpoker@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@base`, 'base'],
            [`anim_casino_b@amb@casino@games@threecardpoker@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_a'],
            [`anim_casino_b@amb@casino@games@threecardpoker@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_b'],
            [`anim_casino_b@amb@casino@games@threecardpoker@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_c'],
            [`anim_casino_b@amb@casino@games@threecardpoker@ped_${user.isMale() ? '' : 'fe'}male@regular@01a@idles`, 'idle_d'],
        ]
    },
    get idleAnim():[string, string]{
        let anim = system.randomArrayElement(currentData.playerIdleAnims)
        return [`${anim[0]}`, anim[1]]
    },
    playIdleAnim: () => {
        if(currentData.block) return;
        user.playAnim([currentData.idleAnim], false, false)
    },
    get inGame(){
        return !!currentData.table
    },
    id: -1,
    seat: -1,
    get table(){
        return tables.get(currentData.id);
    },
    get object(){
        return currentData.table?.object;
    }
}

export const inDiceGame = () => {
    return currentData.inGame
}

export const enterDice = () => {
    let nearest = nearestDiceTable();
    if(nearest === -1) return false;
    enterTable(nearest);
    return true;
}

export const nearestDiceTable = (target = mp.players.local) => {
    let index = -1;
    let res: {dist: number, id: number}[] = [];
    DICE_TABLES_LIST.map((q, id) => {
        if(q.dimension !== -1 && q.dimension !== target.dimension) return;
        const dist = system.distanceToPos(q.position, target.position)
        if(dist <= 3){
            res.push({dist, id})
        }
    })
    if(res.length > 0){
        res = system.sortArrayObjects(res, [{id: 'dist', type: 'ASC'}]);
        index = res[0].id
    }
    return index;
}

export const nearestDiceTableObject = (target = mp.players.local) => {
    let index = nearestDiceTable(target);
    if(index == -1) return null;
    return tables.get(index)?.object
}

const enterTable = (id: number) => {
    const tableItem = tables.get(id);
    if(!tableItem) return;
    const object = tableItem.object;
    const table = DICE_TABLES_LIST[id];
    if(!table) return;

    let seatsDist: { id: number, dist: number, position: Vector3Mp, startPos: Vector3Mp, heading: number, seatH: number }[] = [];
    DICE_TABLE_SETTINGS.SEATS.map((seat, seatid) => {
        const sitPosition = object.getOffsetFromInWorldCoords(
            seat.x,
            seat.y,
            seat.z
        );
        const sitresPosition = object.getOffsetFromInWorldCoords(
            seat.sx,
            seat.sy,
            seat.sz
        );
        const heading = table.heading + seat.h;
        const startPos = system.offsetPosition(sitPosition, heading, new mp.Vector3(0, -0.6, 0))
        if (system.distanceToPos2D(startPos, player.position) <= ROULETTE_TABLE_ENTER_DISTANCE_SEAT) seatsDist.push({
            id: seatid,
            dist: system.distanceToPos(sitPosition, player.position),
            position: sitresPosition,
            startPos,
            heading,
            seatH: heading
        })
    })

    if(typeof table.npc !== "number"){
        const npcPos = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.DEALER_OFFSET.x, DICE_TABLE_SETTINGS.DEALER_OFFSET.y, DICE_TABLE_SETTINGS.DEALER_OFFSET.z))
        if (system.distanceToPos2D(npcPos, player.position) <= ROULETTE_TABLE_ENTER_DISTANCE_SEAT) seatsDist.push({
            id: 9999,
            dist: system.distanceToPos(npcPos, player.position),
            position: npcPos,
            startPos: npcPos,
            heading: DICE_TABLE_SETTINGS.DEALER_OFFSET.h + table.heading,
            seatH: DICE_TABLE_SETTINGS.DEALER_OFFSET.h + table.heading
        })
    }


    if (seatsDist.length === 0) return user.notify('Станьте позади места которое хотите занять', 'error');
    seatsDist = system.sortArrayObjects(seatsDist, [
        {id: 'dist', type: 'ASC'},
    ])
    const seat = seatsDist[0].id

    if(typeof seat !== "number") return user.notify('Возле вас нет места', 'error');

    CustomEvent.callServer('casino:dice:enter', id, seat).then((status: string) => {
        if(typeof status !== 'object') return user.notify(status, 'error')
        playerExitColshape()
        gui.setGuiWithEvent('casinodice', 'casino:dice:data', status, seat !== 9999);
        if(seat === 9999){
            user.goToCoord(seatsDist[0].position, seatsDist[0].heading).then(q => {
                if(!q){
                    player.setCoordsNoOffset(seatsDist[0].position.x, seatsDist[0].position.y, seatsDist[0].position.z, true, true, true);
                    player.setHeading(seatsDist[0].heading);
                }
                setTimeout(() => {
                    currentData.id = id;
                    currentData.seat = seat;
                }, 100)
                setTimeout(() => {
                    CustomEvent.triggerCef('casino:dice:ready')
                }, 1000)
            })
        } else {
            const cfgSeat = DICE_TABLE_SETTINGS.SEATS[seat];
            if(!cfgSeat) return;
            const sitPosition = object.getOffsetFromInWorldCoords(
                cfgSeat.x,
                cfgSeat.y,
                cfgSeat.z
            );
            const sitresPosition = object.getOffsetFromInWorldCoords(
                cfgSeat.sx,
                cfgSeat.sy,
                cfgSeat.sz
            );
            const heading = table.heading + cfgSeat.h;
            const startPos = system.offsetPosition(sitPosition, heading, new mp.Vector3(0, -0.6, 0))
            currentData.block = true;
            user.goToCoord(startPos, heading).then(q => {
                mp.game.invoke("0x1A9205C1B9EE827F", object.handle, false, false);
                if(!q){
                    player.setCoordsNoOffset(startPos.x, startPos.y, startPos.z, true, true, true);
                    player.setHeading(heading);
                }
                setTimeout(() => {
                    currentData.id = id;
                    currentData.seat = seat;
                }, 100)
                user.playEnterCasinoAnim().then(() => {
                    currentData.block = false;
                    currentData.playIdleAnim()
                    CustomEvent.triggerCef('casino:dice:ready')
                })
            })
        }


    })
}


DICE_TABLES_LIST.map((table, id) => {
    const object = mp.objects.new(mp.game.joaat(DICE_TABLE_MODEL), table.position, {
        dimension: table.dimension,
        rotation: new mp.Vector3(0, 0, table.heading),
    })
    const npcPos = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.DEALER_OFFSET.x, DICE_TABLE_SETTINGS.DEALER_OFFSET.y, DICE_TABLE_SETTINGS.DEALER_OFFSET.z))
    const playerCamera = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.x, DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.y, DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.z))
    const rplayerCamera = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.rx, DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.ry, DICE_TABLE_SETTINGS.CAMERA_OFFSET.PLAYER.rz))
    const crCamera = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.x, DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.y, DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.z))
    const rcrCamera = system.offsetPosition(table.position, new mp.Vector3(0, 0, table.heading), new mp.Vector3(DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.rx, DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.ry, DICE_TABLE_SETTINGS.CAMERA_OFFSET.CROUPIER.rz))
    tables.set(id, {
        object,
        id,
        ped: typeof table.npc === "number" ? mp.peds.new(mp.game.joaat(CASINO_DEALERS[table.npc].model), npcPos, table.heading + DICE_TABLE_SETTINGS.DEALER_OFFSET.h, table.dimension) : null,
        speech: typeof table.npc === "number" ? CASINO_DEALERS[table.npc].speech : null,
        male: typeof table.npc === "number" ? CASINO_DEALERS[table.npc].male : true,
        playerCamera: {x: playerCamera.x, y: playerCamera.y, z: playerCamera.z, rx: rplayerCamera.x, ry: rplayerCamera.y, rz: rplayerCamera.z},
        crCamera: {x: crCamera.x, y: crCamera.y, z: crCamera.z, rx: rcrCamera.x, ry: rcrCamera.y, rz: rcrCamera.z},
    })

})

mp.events.add('render', () => {
    nearestTables.map(id => {
        const table = tables.get(id);
        const object = table.object;
        if(!object || !mp.objects.exists(object) || !object.handle) return;
        const me = (currentData.seat === 9999 && currentData.id === id)
        if((table.ped && table.ped.handle) || me){
            const target = me ? player : table.ped
            let dealerDict = 'anim_casino_b@amb@casino@games@roulette@dealer' + (!table.male ? '_female' : '');
            let ok = false;
            idleAnims.map(anim => {
                if(ok || (target.isPlayingAnim(dealerDict, anim, 3) && target.getAnimCurrentTime(dealerDict, anim) < 0.90)) ok = true;
            })
            if(!ok) {
                if(me){
                    user.playAnim([[dealerDict, system.randomArrayElement(idleAnims)]], false, false);
                } else {
                    table.ped.taskPlayAnim(dealerDict, system.randomArrayElement(idleAnims), 2.0, -1, -1, 0, 0, false, false, true)
                }
            }
        }
    })
    if(!currentData.inGame) return;

    if(currentData.seat !== 9999 && !player.isPlayingAnim(EXIT_ANIM[0], EXIT_ANIM[1], 3) && !player.isPlayingAnim(ENTER_ANIM[0], ENTER_ANIM[1], 3)){
        let okAnim = false;
        currentData.playerIdleAnims.map(anim => {
            if(okAnim || (player.isPlayingAnim(anim[0], anim[1], 3) && player.getAnimCurrentTime(anim[0], anim[1]) < 0.90)) okAnim = true;
        })
        if(!okAnim) currentData.playIdleAnim()
    }

    mp.game.controls.disableControlAction(2, 200, true);
    if (needCasinoExit() && !currentData.block) {
        gui.setGui(null);
        CustomEvent.triggerServer('casino:dice:exittable', currentData.id)
        const handle = currentData.table.object.handle;
        if(currentData.table.ped) mp.game.audio.playAmbientSpeechWithVoice(currentData.table.ped.handle, 'MINIGAME_DEALER_LEAVE_NEUTRAL_GAME', currentData.table.speech, 'SPEECH_PARAMS_FORCE', false);
        const oldseat = currentData.seat
        currentData.id = -1;
        currentData.seat = -1;
        if(oldseat !== 9999) user.playExitCasinoAnim();
        else user.stopAnim()
        setTimeout(() => {
            mp.game.invoke("0x1A9205C1B9EE827F", handle, true, true);
        }, 4000)
        CamerasManager.setActiveCamera(camera, false);
        return;
    } else {
        const table = tables.get(currentData.id);
        if(table){
            const pos = currentData.seat === 9999 ? table.crCamera : table.playerCamera
            camera.setCoord(pos.x, pos.y, pos.z);
            camera.pointAtCoord(pos.rx, pos.ry, pos.rz);
            CamerasManager.setActiveCamera(camera, true);
        }
    }
})

const idleAnims = ['idle', 'idle_var01', 'idle_var02', 'idle_var03', 'idle_var04', 'idle_var05'];
const idleAnimsPlayer = ['idle', 'idle_var01', 'idle_var02', 'idle_var03', 'idle_var04', 'idle_var05'];

let nearestTables:number[] = [];

setInterval(() => {
    nearestTables = []
    if(!user.login) return;
    if(!user.inInterrior) return;
    tables.forEach((table, id) => {
        const object = table.object;
        if(!object || !mp.objects.exists(object) || !object.handle) return;
        nearestTables.push(id)
        mp.game.invoke('0x971DA0055324D033', object.handle, getCasinoDiceTable(table.id).isVip ? DICE_TABLE_SETTINGS.TABLE_COLOR.VIP : DICE_TABLE_SETTINGS.TABLE_COLOR.DEFAULT);
    })
}, 2000);