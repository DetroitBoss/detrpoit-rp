import {
    GRID_START_Z,
    ROULETTE_BET_TIME,
    ROULETTE_MAP_ANIMS,
    ROULETTE_MAX_BETS,
    ROULETTE_RULES,
    ROULETTE_STATENAMES_ID,
    ROULETTE_SUM_AS_BIG_WIN,
    ROULETTE_TABLE_COLOR,
    ROULETTE_TABLE_ENTER_DISTANCE,
    ROULETTE_TABLE_ENTER_DISTANCE_SEAT,
    ROULETTE_TABLE_POSITIONS,
    ROULETTE_TABLE_SEATS_POSITIONS,
    ROULETTE_VIP_TABLE_COLOR,
    ROULETTETableItem
} from "../../../shared/casino/roulette";
import {CamerasManager} from "../cameraManager";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {
    CASINO_DEALERS, CASINO_INTERIORS_IDS_IN,
    CHIP_TYPE_MODELS,
    CHIPS_TYPE,
    ENTER_ANIM,
    EXIT_ANIM,
    getChipIndexBySum
} from "../../../shared/casino/main";
import {gui} from "../gui";
import {disableControlGroup} from "../controls";
import {needCasinoExit} from "./advanced";
import {VIP_TARIFS} from "../../../shared/vip";
const inCasinoInt = () => {
    const {x,y,z} = mp.players.local.position;
    return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
}

const player = mp.players.local

export const inCasinoRoulette = () => {
    return currentTableData.inGame
}

let currentTableData = {
    seatPosition: {x: 0, y: 0, z: 0, h: 0},
    get playerIdleAnims(){
        return [
            [`anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@base`, 'base'],
            [`anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@idles`, 'idle_a'],
            [`anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@idles`, 'idle_b'],
            [`anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@idles`, 'idle_c'],
            [`anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@idles`, 'idle_d'],
        ]
    },
    playIdleAnim: () => {
        // if(system.distanceToPos(player.position, currentTableData.seatPosition) > 0.3){
        //     player.setCoordsNoOffset(currentTableData.seatPosition.x, currentTableData.seatPosition.y, currentTableData.seatPosition.z, true, true, true);
        //     player.setHeading(currentTableData.seatPosition.h);
        // }
        const anim = system.randomArrayElement(currentTableData.playerIdleAnims)
        user.playAnim([[anim[0], anim[1]]], false, false)
        disableExit = false;
    },
    waitBet: false,
    get wheelCamera() {
        return this.currentState !== ROULETTE_STATENAMES_ID.WAIT
    },
    get myBetsCount() {
        return this.myBets.length
    },
    myBets: <{ betKey: string, balance: number, sid: number }[]>[],
    get currentTable() {
        return tables[this.id]
    },
    get inGame() {
        return !!this.currentTable
    },
    id: -1,
    chipObject: <ObjectMp>null,
    seat: 0,
    currentChipSum: 10,
    get lastWinSums(){
        return lastWin.get(currentTableData.id) || []
    },
    get currentChipType(){
      return getChipIndexBySum(currentTableData.currentChipSum)
    },
    chipPosition: {x: 0, y: 0},
    get currentState(): ROULETTE_STATENAMES_ID {
        return this.currentTable?.state
    },
    screenGridFirstPoint: {x: 0, y: 0},
    screenGridSecondPoint: {x: 0, y: 0},
    screenGridThreePoint: {x: 0, y: 0},
    screenGridFourPoint: {x: 0, y: 0},
    endActionTime: 0,
    lastActionTimeSeconds: 0,
    selectedIds: <number[]>[],
    lastSelectedBetKey: '',
    lastCurrentBet: 0,
}

const tables: {
    index: number,
    object: ObjectMp,
    position: Vector3Mp,
    heading: number,
    dimension: number,
    cellsData?: { id: number, coloredId: string, firstPoint: Vector3Mp, secondPoint: Vector3Mp, threePoint: Vector3Mp, fourPoint: Vector3Mp, markerPos?: Vector3Mp, isActive: boolean, hoverItems: number[], markerObject?: ObjectMp, isHovered?: boolean }[],
    chipTypePrices: ROULETTETableItem['chipTypePrices'],
    chipObject?: ObjectMp,
    ballObject?: ObjectMp,
    state: ROULETTE_STATENAMES_ID,
    centerGridPosition?: Vector3Mp,
    wheelCenterPosition?: Vector3Mp,
    cameraPosition?: Vector3Mp,
    gridFirstPoint?: Vector3Mp,
    gridSecondPoint?: Vector3Mp,
    gridThreePoint?: Vector3Mp,
    gridFourPoint?: Vector3Mp,
    ped?: PedMp,
    speech: string,
    male: boolean
}[] = [];
export const getRouletteObject = (id: number) => {
    return tables[id]?.object
}
let lastWin = new Map<number, number[]>();
const createTable = (
    position: Vector3Mp,
    heading: number,
    dimension: number,
    chipTypePrices: ROULETTETableItem['chipTypePrices'],
    index: number
) => {
    lastWin.set(index, []);
    const object = mp.objects.toArray().find(q => q.handle && q.getVariable('casinoId') === index)
    const pos = object ? object.getOffsetFromInWorldCoords(-0.11, 0.77, 1) : null;
    const dealer = CASINO_DEALERS[ROULETTE_TABLE_POSITIONS[index].dealer]
    tables.push({
        ped: pos ? mp.peds.new(mp.game.joaat(dealer.model), pos, ROULETTE_TABLE_POSITIONS[index].heading + 180, ROULETTE_TABLE_POSITIONS[index].dimension) : null,
        speech: dealer.speech,
        male: dealer.male,
        index,
        get object() {
            return mp.objects.toArray().find(q => q.handle && q.getVariable('casinoId') === this.index)
        },
        position,
        heading,
        dimension,
        chipTypePrices,
        get state() {
            return this.object?.getVariable('casinoStatus')
        },
    });
};

setInterval(() => tables.map((table, index) => generateTableData(index, false)), 5000);

mp.events.add('entityStreamIn', async (target: ObjectMp) => {
    if (target.type !== "object") return;
    if (!target.getVariable('casinoRouletteTable')) return;
    const id = target.getVariable('casinoId')
    if (typeof id !== "number") return;
    generateTableData(id, false)
});

mp.events.addDataHandler("casinoStatus", (entity: ObjectMp, value: number, oldValue) => {
    if (!user.login) return;
    if (entity.type !== "object") return;
    if (!entity.handle) return;
    const winNumber = entity.getVariable('winNumber');
    if (winNumber === 9999) return;
    const id = entity.getVariable('casinoId')
    if (typeof id !== "number") return;
    generateTableData(id, false)
    if (value === ROULETTE_STATENAMES_ID.BET_END && oldValue === ROULETTE_STATENAMES_ID.WAIT) {
        playAnimForCurrentTable(id, winNumber);
    } else if (value === ROULETTE_STATENAMES_ID.WAIT && oldValue === ROULETTE_STATENAMES_ID.BET_END){
        if(currentTableData.id === id) {
            currentTableData.myBets = [];
            sendCEFTimer(ROULETTE_BET_TIME)
        }
    }

});

const timerLoadAnimDict = setInterval(() => {
    if (!mp.game.streaming.hasAnimDictLoaded('anim_casino_b@amb@casino@games@roulette@table')) {
        mp.game.streaming.requestAnimDict('anim_casino_b@amb@casino@games@roulette@table');
        return;
    }
    if (!mp.game.streaming.hasAnimDictLoaded('anim_casino_b@amb@casino@games@roulette@dealer_female')) {
        mp.game.streaming.requestAnimDict('anim_casino_b@amb@casino@games@roulette@dealer_female');
        return;
    }
    if (!mp.game.streaming.hasAnimDictLoaded('anim_casino_b@amb@casino@games@roulette@dealer')) {
        mp.game.streaming.requestAnimDict('anim_casino_b@amb@casino@games@roulette@dealer');
        return;
    }

    clearInterval(timerLoadAnimDict);
}, 500);

const generateTableData = (tableid: number, current: boolean) => {
    const data = tables[tableid];
    if (!data) return;
    const object = data.object
    if (!mp.objects.exists(data.object) || !data.object.handle) return;
    const cfg = ROULETTE_TABLE_POSITIONS[tableid];
    if(!cfg) return;
    mp.game.invoke('0x971DA0055324D033', object.handle, cfg.isVip ? ROULETTE_VIP_TABLE_COLOR : ROULETTE_TABLE_COLOR);
    if (!data.ped || !mp.peds.exists(data.ped)) {
        const dealer = CASINO_DEALERS[ROULETTE_TABLE_POSITIONS[tableid].dealer]
        const pos = object.getOffsetFromInWorldCoords(-0.11, 0.77, 1);
        data.ped = mp.peds.new(mp.game.joaat(dealer.model), pos, ROULETTE_TABLE_POSITIONS[tableid].heading + 180, ROULETTE_TABLE_POSITIONS[tableid].dimension)
    }
    if (!data.cellsData) data.cellsData = generateTableCells(object);
    if (!data.centerGridPosition) data.centerGridPosition = object.getOffsetFromInWorldCoords(GRID_CENTER_X, GRID_CENTER_Y, GRID_START_Z);
    if (!data.wheelCenterPosition) data.wheelCenterPosition = object.getOffsetFromInWorldCoords(-0.73, GRID_CENTER_Y - 0.15, GRID_START_Z + 0.1);
    if (!data.cameraPosition) data.cameraPosition = object.getOffsetFromInWorldCoords(GRID_CENTER_X, -0.2, 2.5);
    if (!data.gridFirstPoint) data.gridFirstPoint = object.getOffsetFromInWorldCoords(-0.14, -0.39, GRID_START_Z);
    if (!data.gridSecondPoint) data.gridSecondPoint = object.getOffsetFromInWorldCoords(-0.14, 0.21, GRID_START_Z);
    if (!data.gridThreePoint) data.gridThreePoint = object.getOffsetFromInWorldCoords(0.91, 0.21, GRID_START_Z);
    if (!data.gridFourPoint) data.gridFourPoint = object.getOffsetFromInWorldCoords(0.91, -0.39, GRID_START_Z);
    if (!data.ballObject || !mp.objects.exists(data.ballObject)) {
        data.ballObject = mp.objects.new(mp.game.joaat('vw_prop_roulette_ball'), object.getWorldPositionOfBone(object.getBoneIndexByName('Roulette_Wheel')), {dimension: data.dimension});
        mp.game.invoke('0xEA1C610A04DB6BBB', data.ballObject.handle, false);
    }
    if (current) {
        const tableRotation = data.object.getRotation(2);
        for (let i = 0; i < 38; i++) {
            const cellData = data.cellsData[i];
            const markerPos = cellData.markerPos;

            if (typeof cellData.markerObject === 'undefined' || !mp.objects.exists(cellData.markerObject)) {
                cellData.markerObject = mp.objects.new(mp.game.joaat(i >= 36 ? 'vw_prop_vw_marker_01a' : 'vw_prop_vw_marker_02a'), markerPos, {
                    dimension: -1,
                    rotation: tableRotation
                });
            }

            mp.game.invoke('0xEA1C610A04DB6BBB', cellData.markerObject.handle, false);
            mp.game.invoke('0x971DA0055324D033', cellData.markerObject.handle, 3);
        }
    }
}

ROULETTE_TABLE_POSITIONS.map((table, index) =>
    createTable(table.position, table.heading, table.dimension, table.chipTypePrices, index))

/** Камера над столом */
const camera = CamerasManager.hasCamera('casino_roulette') ?
    CamerasManager.getCamera('casino_roulette') :
    CamerasManager.createCamera(
        'casino_roulette',
        'default',
        new mp.Vector3(0, 0, 0),
        new mp.Vector3(-90, 0, 0),
        50
    );

export const getNearestRouletteTable = (target = mp.players.local) => {
    let res = -1;
    let q = tables.map(q => {
        return {...q, dist: system.distanceToPos(target.position, q.position)}
    }).filter(q => (q.dimension == -1 || q.dimension == target.dimension) && q.dist <= ROULETTE_TABLE_ENTER_DISTANCE);
    let z = system.sortArrayObjects(q, [
        {id: 'dist', type: 'ASC'}
    ])
    return z.length > 0 ? z[0].index : -1;
}

let disableExit = false;

let seatPos = [...ROULETTE_TABLE_SEATS_POSITIONS]

// player.setSeatPos = (data) => {
//     seatPos = data;
// }

export const enterTableHandle = () => {
    if (!user.login) return false;
    if (currentTableData.inGame) return false;
    const nearestIndex = getNearestRouletteTable();
    if (nearestIndex > -1) {
        const nearest = tables[nearestIndex];
        const cfg = ROULETTE_TABLE_POSITIONS[nearestIndex];
        if(cfg.isVip && (!user.vipData || !user.vipData.casino)) return user.notify(`Данный стол предназначен для VIP членов казино. Вип членство можно получить купив ${VIP_TARIFS.filter(q => !q.media && q.casino).map(q => q.name).join(', ')}`, 'error')
        let seatsDist: { id: number, dist: number, position: Vector3Mp, startPos: Vector3Mp, heading: number, seatH: number }[] = [];
        seatPos.map((seat, seatid) => {
            const sitPosition = nearest.object.getOffsetFromInWorldCoords(
                seat[0],
                seat[1],
                seat[2]
            );
            const sitresPosition = nearest.object.getOffsetFromInWorldCoords(
                seat[4],
                seat[5],
                seat[2]
            );
            const heading = nearest.heading + seat[3];
            const startPos = system.offsetPosition(sitPosition, heading, new mp.Vector3(0, -0.6, 0))
            if (system.distanceToPos2D(startPos, player.position) <= ROULETTE_TABLE_ENTER_DISTANCE_SEAT) seatsDist.push({
                id: seatid,
                dist: system.distanceToPos(sitPosition, player.position),
                position: sitresPosition,
                startPos,
                heading,
                seatH: nearest.heading + seat[6]
            })
        })

        if (seatsDist.length === 0) return user.notify('Станьте позади места которое хотите занять', 'error');
        seatsDist = system.sortArrayObjects(seatsDist, [
            {id: 'dist', type: 'ASC'},
        ])

        CustomEvent.callServer('casino:roulette:entertable', nearestIndex, seatsDist[0].id).then((dataRes: [number, number]) => {
            if(typeof dataRes === 'string') return user.notify(dataRes, 'error');
            if (!dataRes) return user.notify('Место занято', 'error');
            let [seat, countdown] = dataRes;
            if (typeof seat !== "number") return user.notify('Место занято', 'error');
            const res = seatsDist.find(q => q.id === seat);
            generateTableData(nearestIndex, true);
            const table = tables[nearestIndex];
            currentTableData.id = nearestIndex;
            currentTableData.seat = seat;
            currentTableData.chipObject = mp.objects.new(mp.game.joaat(CHIP_TYPE_MODELS[currentTableData.currentChipType]), table.centerGridPosition, {dimension: -1});
            camera.setCoord(table.cameraPosition.x, table.cameraPosition.y, table.cameraPosition.z);
            camera.pointAtCoord(table.centerGridPosition.x, table.centerGridPosition.y, table.centerGridPosition.z);
            CamerasManager.setActiveCamera(camera, true);
            currentTableData.chipPosition = {x: GRID_CENTER_X, y: GRID_CENTER_Y};

            const startPos = res.startPos

            disableExit = true;
            changeChipType(0);
            user.goToCoord(startPos, res.heading).then(q => {
                if(!q){
                    player.setCoordsNoOffset(startPos.x, startPos.y, startPos.z, true, true, true);
                    player.setHeading(res.heading);
                }
                mp.game.audio.playAmbientSpeechWithVoice(table.ped.handle, currentRes !== 0 ? 'MINIGAME_DEALER_REJOIN_TABLE' : 'MINIGAME_DEALER_GREET', table.speech, 'SPEECH_PARAMS_FORCE', false);
                currentRes = 0;
                let qint = setInterval(() => {
                    countdown--;
                    if(countdown <= 0) clearInterval(qint);
                })
                mp.game.invoke("0x1A9205C1B9EE827F", table.object.handle, false, false);
                user.playEnterCasinoAnim(res.position).then(() => {
                    gui.setGui('casinoroulette');
                    changeChipType(0);
                    if(countdown > 0) {
                        sendCEFTimer(countdown)
                        clearInterval(qint);
                    }
                    currentTableData.seatPosition = {x: res.position.x, y: res.position.y, z: res.position.z, h: res.seatH}
                    // player.setCoordsNoOffset(res.position.x, res.position.y, res.position.z, true, true, false);
                    player.setHeading(res.seatH);
                    currentTableData.playIdleAnim()
                    sendCEFData();
                })
            })

        });

        return true;
    }

    return false;
}

const changeChipState = (state: boolean) => {
    if (!currentTableData.chipObject || !mp.objects.exists(currentTableData.chipObject)) {
        return false;
    }
    currentTableData.chipObject.setVisible(state, false);
    // mp.game.invoke('0xEA1C610A04DB6BBB', currentTableData.chipObject.handle, state);
};


const changeChipType = (direction: number) => {
    if (!currentTableData.inGame || (currentTableData.currentTable.state && direction)) return false;
    let nextId = 0;
    if(direction != 0){
        const currentIndex = currentTableData.currentTable.chipTypePrices.findIndex(q => q === currentTableData.currentChipSum)
        nextId = currentIndex + direction
        if(!currentTableData.currentTable.chipTypePrices[nextId]) {
            if(direction > 0) nextId = 0;
            else nextId = currentTableData.currentTable.chipTypePrices.length - 1;
        }
    }
    const nextChipModel = mp.game.joaat(CHIP_TYPE_MODELS[getChipIndexBySum(currentTableData.currentTable.chipTypePrices[nextId])]);
    const chipExists = currentTableData.chipObject && mp.objects.exists(currentTableData.chipObject);
    if (chipExists) currentTableData.chipObject.destroy();
    const chipPosition = currentTableData.currentTable.object.getOffsetFromInWorldCoords(currentTableData.chipPosition.x, currentTableData.chipPosition.y, GRID_START_Z);
    currentTableData.chipObject = mp.objects.new(nextChipModel, chipPosition, {dimension: -1});
    changeChipState(currentTableData.currentState === 0);
    currentTableData.currentChipSum = currentTableData.currentTable.chipTypePrices[nextId];
    if(direction != 0) sendCEFData()

};

mp.keys.bind(38, true, () => {
    changeChipType(1);
});

mp.keys.bind(40, true, () => {
    changeChipType(-1);
});


const GRID_START_X = -0.057;
const GRID_START_Y = -0.192;


const CELL_SIZE_X = 0.081;
const CELL_SIZE_X_05 = 0.081 / 2;

const CELL_SIZE_Y = 0.167;
const CELL_SIZE_Y_05 = 0.167 / 2;
const CELL_SIZE_Y_07 = CELL_SIZE_Y * 0.7;

const CELL_OFFSET_X = 0.015;
const CELL_OFFSET_Y = 0.02;

const GRID_CENTER_X = 0.39;
const GRID_CENTER_Y = -0.02;

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];


const generateTableCells = (entity: ObjectMp) => {
    const cells: {
        id: number,
        coloredId: string,
        firstPoint: Vector3Mp,
        secondPoint: Vector3Mp,
        threePoint: Vector3Mp,
        fourPoint: Vector3Mp,
        markerPos?: Vector3Mp,
        isActive: boolean,
        hoverItems: number[]
    }[] = [];

    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 3; j++) {
            const id = cells.length;

            const bottomOffset = i === 11 ? -CELL_OFFSET_X : 0;
            const leftOffset = j === 0 ? CELL_OFFSET_Y * 2 : 0;

            const firstPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((i * CELL_SIZE_X) - CELL_SIZE_X_05) - CELL_OFFSET_X, GRID_START_Y + ((j * CELL_SIZE_Y) - CELL_SIZE_Y_05) - CELL_OFFSET_Y + leftOffset, GRID_START_Z);
            const secondPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((i * CELL_SIZE_X) - CELL_SIZE_X_05) - CELL_OFFSET_X, GRID_START_Y + ((j * CELL_SIZE_Y) + CELL_SIZE_Y_05) + CELL_OFFSET_Y, GRID_START_Z);
            const threePoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((i * CELL_SIZE_X) + CELL_SIZE_X_05) + CELL_OFFSET_X + bottomOffset, GRID_START_Y + ((j * CELL_SIZE_Y) - CELL_SIZE_Y_05) - CELL_OFFSET_Y + leftOffset, GRID_START_Z);
            const fourPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((i * CELL_SIZE_X) + CELL_SIZE_X_05) + CELL_OFFSET_X + bottomOffset, GRID_START_Y + ((j * CELL_SIZE_Y) + CELL_SIZE_Y_05) + CELL_OFFSET_Y, GRID_START_Z);

            const markerPos = entity.getOffsetFromInWorldCoords(GRID_START_X + (i * CELL_SIZE_X), GRID_START_Y + (j * CELL_SIZE_Y), GRID_START_Z);

            cells.push({
                id,
                coloredId: RED_NUMBERS.includes(id + 1) ? `~r~${id + 1}` : `~c~${id + 1}`,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint,
                markerPos,
                isActive: false,
                hoverItems: []
            });
        }
    }

    (() => {
        const firstPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, 0.107 - CELL_SIZE_Y_07 - CELL_OFFSET_Y, GRID_START_Z);
        const secondPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, 0.107 + CELL_SIZE_Y_07 + CELL_OFFSET_Y, GRID_START_Z);
        const threePoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, 0.107 - CELL_SIZE_Y_07 - CELL_OFFSET_Y, GRID_START_Z);
        const fourPoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, 0.107 + CELL_SIZE_Y_07 + CELL_OFFSET_Y, GRID_START_Z);

        const markerPos = entity.getOffsetFromInWorldCoords(-0.137, 0.107, GRID_START_Z);

        cells.push({
            id: cells.length,
            coloredId: `~g~Double zero`,
            firstPoint,
            secondPoint,
            threePoint,
            fourPoint,
            markerPos,
            isActive: false,
            hoverItems: []
        });
    })();

    (() => {
        const firstPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, -0.148 - CELL_SIZE_Y_07 + (CELL_OFFSET_Y * 0.5), GRID_START_Z);
        const secondPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, -0.148 + CELL_SIZE_Y_07 + CELL_OFFSET_Y, GRID_START_Z);
        const threePoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, -0.148 - CELL_SIZE_Y_07 + (CELL_OFFSET_Y * 0.5), GRID_START_Z);
        const fourPoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, -0.148 + CELL_SIZE_Y_07 + CELL_OFFSET_Y, GRID_START_Z);

        const markerPos = entity.getOffsetFromInWorldCoords(-0.137, -0.148, GRID_START_Z);

        cells.push({
            id: cells.length,
            coloredId: `~g~zero`,
            firstPoint,
            secondPoint,
            threePoint,
            fourPoint,
            markerPos,
            isActive: false,
            hoverItems: []
        });
    })();

    (() => {
        for (let i = 0; i < 3; i++) {
            const firstPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 4)) * i) - (CELL_SIZE_X_05), GRID_START_Y - (CELL_SIZE_Y * 0.8) - (CELL_OFFSET_Y * 0.2), GRID_START_Z);
            const secondPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 4)) * i) - (CELL_SIZE_X_05), GRID_START_Y - (CELL_SIZE_Y_05), GRID_START_Z);
            const threePoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 4)) * i) - (CELL_SIZE_X_05) + (CELL_SIZE_X * 4), GRID_START_Y - (CELL_SIZE_Y * 0.8) - (CELL_OFFSET_Y * 0.2), GRID_START_Z);
            const fourPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 4)) * i) - (CELL_SIZE_X_05) + (CELL_SIZE_X * 4), GRID_START_Y - (CELL_SIZE_Y_05), GRID_START_Z);

            const hoverItems = [];

            for (let j = (i) * 12; j < (i + 1) * 12; j++) {
                hoverItems.push(j);
            }

            cells.push({
                id: cells.length,
                coloredId: `~c~${(i) * 12}-${(i + 1) * 12}`,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint,
                isActive: false,
                hoverItems
            });
        }
    })();

    (() => {
        for (let i = 0; i < 6; i++) {
            const firstPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 2)) * i) - (CELL_SIZE_X_05), GRID_START_Y - (CELL_SIZE_Y) - (CELL_SIZE_Y * 0.4), GRID_START_Z);
            const secondPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 2)) * i) - (CELL_SIZE_X_05), GRID_START_Y - (CELL_SIZE_Y_05) + (CELL_OFFSET_Y * 0.6) - (CELL_SIZE_Y * 0.4), GRID_START_Z);
            const threePoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 2)) * i) - (CELL_SIZE_X_05) + (CELL_SIZE_X * 2), GRID_START_Y - (CELL_SIZE_Y) - (CELL_SIZE_Y * 0.4), GRID_START_Z);
            const fourPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (((CELL_SIZE_X * 2)) * i) - (CELL_SIZE_X_05) + (CELL_SIZE_X * 2), GRID_START_Y - (CELL_SIZE_Y_05) + (CELL_OFFSET_Y * 0.6) - (CELL_SIZE_Y * 0.4), GRID_START_Z);

            const hoverItems = [];

            if (i === 0) {
                for (let j = 0; j < 18; j++) {
                    hoverItems.push(j);
                }
            } else if (i === 1) {
                for (let j = 0; j < 36; j++) {
                    if ((cells[j].id + 1) % 2 === 0) {
                        hoverItems.push(j);
                    }
                }
            } else if (i === 2) {
                for (let j = 0; j < 36; j++) {
                    if (RED_NUMBERS.includes(cells[j].id + 1)) {
                        hoverItems.push(j);
                    }
                }
            } else if (i === 3) {
                for (let j = 0; j < 36; j++) {
                    if (!RED_NUMBERS.includes(cells[j].id + 1)) {
                        hoverItems.push(j);
                    }
                }
            } else if (i === 4) {
                for (let j = 0; j < 36; j++) {
                    if ((cells[j].id + 1) % 2 !== 0) {
                        hoverItems.push(j);
                    }
                }
            } else if (i === 5) {
                for (let j = 18; j < 36; j++) {
                    hoverItems.push(j);
                }
            }

            cells.push({
                id: cells.length,
                coloredId: `~c~down_${i}`,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint,
                isActive: false,
                hoverItems
            });
        }
    })();

    (() => {
        for (let i = 0; i < 3; i++) {
            const rightOffset = i === 2 ? CELL_OFFSET_Y : 0;
            const firstPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((12 * CELL_SIZE_X) - CELL_SIZE_X_05), GRID_START_Y + ((i * CELL_SIZE_Y) - CELL_SIZE_Y_05) + 0.0005, GRID_START_Z);
            const secondPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((12 * CELL_SIZE_X) - CELL_SIZE_X_05), GRID_START_Y + ((i * CELL_SIZE_Y) + CELL_SIZE_Y_05) + rightOffset - 0.0005, GRID_START_Z);
            const threePoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((12 * CELL_SIZE_X) + CELL_SIZE_X_05) + (CELL_OFFSET_X * 0.4), GRID_START_Y + ((i * CELL_SIZE_Y) - CELL_SIZE_Y_05) + 0.0005, GRID_START_Z);
            const fourPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + ((12 * CELL_SIZE_X) + CELL_SIZE_X_05) + (CELL_OFFSET_X * 0.4), GRID_START_Y + ((i * CELL_SIZE_Y) + CELL_SIZE_Y_05) + rightOffset - 0.0005, GRID_START_Z);

            const hoverItems = [];

            for (let j = 0; j < 12; j++) {
                hoverItems.push(j * 3 + i);
            }

            cells.push({
                id: cells.length,
                coloredId: `~c~Колонка: ${i + 1}`,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint,
                isActive: false,
                hoverItems
            });
        }
    })();

    (() => {
        const firstPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05, GRID_START_Z);
        const secondPoint = entity.getOffsetFromInWorldCoords(-0.137 - CELL_SIZE_X_05 - CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05 + CELL_OFFSET_Y, GRID_START_Z);
        const threePoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05, GRID_START_Z);
        const fourPoint = entity.getOffsetFromInWorldCoords(-0.137 + CELL_SIZE_X_05 + CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05 + CELL_OFFSET_Y, GRID_START_Z);

        cells.push({
            id: cells.length,
            coloredId: `~c~Ряд: 1`,
            firstPoint,
            secondPoint,
            threePoint,
            fourPoint,
            isActive: false,
            hoverItems: [36, 37]
        });
    })();

    (() => {
        for (let i = 0; i < 12; i++) {
            const bottomOffset = i === 11 ? -CELL_OFFSET_X : 0;

            const firstPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (CELL_SIZE_X * i) - (CELL_SIZE_X_05) - CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05, GRID_START_Z);
            const secondPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (CELL_SIZE_X * i) - (CELL_SIZE_X_05) - CELL_OFFSET_X, GRID_START_Y - CELL_SIZE_Y_05 + CELL_OFFSET_Y, GRID_START_Z);
            const threePoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (CELL_SIZE_X * i) - (CELL_SIZE_X_05) + CELL_SIZE_X + CELL_OFFSET_X + bottomOffset, GRID_START_Y - CELL_SIZE_Y_05, GRID_START_Z);
            const fourPoint = entity.getOffsetFromInWorldCoords(GRID_START_X + (CELL_SIZE_X * i) - (CELL_SIZE_X_05) + CELL_SIZE_X + CELL_OFFSET_X + bottomOffset, GRID_START_Y - CELL_SIZE_Y_05 + CELL_OFFSET_Y, GRID_START_Z);

            const hoverItems = [];

            for (let j = i * 3; j < (i + 1) * 3; j++) {
                hoverItems.push(j);
            }

            cells.push({
                id: cells.length,
                coloredId: `~c~Ряд: ${i + 2}`,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint,
                isActive: false,
                hoverItems
            });
        }
    })();

    return cells;
};

const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => (Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0));
const check = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, x: number, y: number) => (
    (
        area(x1, y1, x2, y2, x3, y3) +
        area(x1, y1, x4, y4, x3, y3)
    ) ===
    (
        area(x, y, x1, y1, x2, y2) +
        area(x, y, x2, y2, x3, y3) +
        area(x, y, x3, y3, x4, y4) +
        area(x, y, x1, y1, x4, y4)
    )
);


const onActiveAction = ({id, hoverItems}: { id: number, hoverItems: number[] }) => {
    if (!Array.isArray(hoverItems)) {
        return;
    }

    for (let i = 0; i < hoverItems.length; i++) {
        currentTableData.currentTable.cellsData[hoverItems[i]].isHovered = true;
    }
};

const onDeActiveAction = ({id, hoverItems}: { id: number, hoverItems: number[] }) => {
    if (!Array.isArray(hoverItems)) {
        return;
    }

    for (let i = 0; i < hoverItems.length; i++) {
        currentTableData.currentTable.cellsData[hoverItems[i]].isHovered = false;
    }
};


const playAnimForCurrentTable = async (tableId: number, winNumber: number) => {
    const table = tables[tableId]
    if (!table) return;
    const check = () => {
        if(!table) return false;
        if(table.dimension !== -1 && player.dimension !== table.dimension) return false;
        if(system.distanceToPos(player.position, table.position) > 80) return false;
        const tableObject = table.object
        if(!tableObject || !tableObject.handle) return false;
        if(!table.ped || !table.ped.handle) return false;
        return true;
    }
    if(!check()) return;
    generateTableData(tableId, false)

    mp.game.audio.requestAmbientAudioBank(table.speech, true);
    const tableObject = table.object
    if(!check()) return;
    const animId = ROULETTE_MAP_ANIMS[winNumber];
    mp.game.invoke('0xEA1C610A04DB6BBB', table.ballObject.handle, false);
    let lib = 'anim_casino_b@amb@casino@games@roulette@table';
    let dealerDict = 'anim_casino_b@amb@casino@games@roulette@dealer' + (!table.male ? '_female' : '');
    table.ped.setNoCollision(tableObject.handle, false);
    mp.game.audio.playAmbientSpeechWithVoice(table.ped.handle, 'MINIGAME_DEALER_CLOSED_BETS', table.speech, 'SPEECH_PARAMS_FORCE', false);
    table.ped.taskPlayAnim(dealerDict, 'spin_wheel', 4.0, -1, -1, 0, 0, false, false, true)
    mp.game.invoke('0xE1E65CA8AC9C00ED', table.ped.handle, 'spin_wheel_facial', dealerDict)
    await system.sleep(1500)
    if(!check()) return;
    tableObject.playAnim('loop_wheel', lib, 1000.0, false, true, false, 0, 136704);
    tableObject.forceAiAndAnimationUpdate();

    await system.sleep(1500)
    if(!check()) return;
    mp.game.invoke('0xEA1C610A04DB6BBB', table.ballObject.handle, true);

    const ballPosition = tableObject.getWorldPositionOfBone(tableObject.getBoneIndexByName('Roulette_Wheel'));

    table.ballObject.setCoordsNoOffset(ballPosition.x, ballPosition.y, ballPosition.z, false, false, false);
    const tableRotation = tableObject.getRotation(2);
    table.ballObject.setRotation(tableRotation.x, tableRotation.y, tableRotation.z + 90, 2, false);

    mp.game.invoke('0xEA1C610A04DB6BBB', table.ballObject.handle, true);
    tableObject.playAnim(`exit_${animId}_wheel`, 'anim_casino_b@amb@casino@games@roulette@table', 1000, false, true, false, 0, 131072);
    table.ballObject.playAnim(`exit_${animId}_ball`, 'anim_casino_b@amb@casino@games@roulette@table', 1000, false, true, false, 0, 136704);
    await system.sleep(8000);
    let last = lastWin.get(tableId);
    last.push(winNumber+1);
    if(last.length > 7) last.splice(0, 1)
    lastWin.set(tableId, last);
    if(currentTableData.id === tableId) sendCEFData()
    if(!check()) return;
    let name = `MINIGAME_ROULETTE_BALL_`;
    if (winNumber == 36) name += '00';
    else if (winNumber == 37) name += '0';
    else name += (winNumber + 1);

    mp.game.audio.playAmbientSpeechWithVoice(table.ped.handle, name, table.speech, 'SPEECH_PARAMS_FORCE', false);
    table.ped.taskPlayAnim(dealerDict, 'idle', 4.0, -1, -1, 0, 0, false, false, true)
};


mp.events.add('render', () => {
    if (!currentTableData.inGame) return;

    if (currentTableData.myBetsCount > 0) {
        disableExit = true;
    }

    disableControlGroup.allControls()
    if (needCasinoExit() && !disableExit) {
        CustomEvent.triggerServer('casino:roulette:exittable', currentTableData.id)

        for (let cellId = 0; cellId < currentTableData.currentTable.cellsData.length; cellId++) {
            const {id, markerObject} = currentTableData.currentTable.cellsData[cellId];
            if (markerObject && mp.objects.exists(markerObject)) mp.game.invoke('0xEA1C610A04DB6BBB', markerObject.handle, false);
        }

        mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, currentRes !== 0 ? (currentRes > 0 ? 'MINIGAME_DEALER_LEAVE_GOOD_GAME' : 'MINIGAME_DEALER_LEAVE_BAD_GAME') : 'MINIGAME_DEALER_LEAVE_NEUTRAL_GAME', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
        const handle = currentTableData.currentTable.object.handle
        currentTableData.id = -1;
        currentTableData.seat = -1;
        if (currentTableData.chipObject && mp.objects.exists(currentTableData.chipObject)) currentTableData.chipObject.destroy()
        currentTableData.chipObject = null;
        CamerasManager.setActiveCamera(camera, false);
        currentTableData.chipPosition = {x: 0, y: 0};

        user.playExitCasinoAnim();
        gui.setGui(null);
        setTimeout(() => {
            mp.game.invoke("0x1A9205C1B9EE827F", handle, true, true);
        }, 4000)
        return;
    }
    const pointPosition = currentTableData.wheelCamera ? currentTableData.currentTable.wheelCenterPosition : currentTableData.currentTable.centerGridPosition;

    camera.setCoord(currentTableData.currentTable.cameraPosition.x, currentTableData.currentTable.cameraPosition.y, currentTableData.currentTable.cameraPosition.z);
    camera.pointAtCoord(pointPosition.x, pointPosition.y, pointPosition.z);
    CamerasManager.setActiveCamera(camera, true);

    if(!disableExit){
        let okAnim = false;
        if(!player.isPlayingAnim(EXIT_ANIM[0], EXIT_ANIM[1], 3) && !player.isPlayingAnim(ENTER_ANIM[0], ENTER_ANIM[1], 3)){
            currentTableData.playerIdleAnims.map(anim => {
                if(okAnim || (player.isPlayingAnim(anim[0], anim[1], 3) && player.getAnimCurrentTime(anim[0], anim[1]) < 0.90)) okAnim = true;
            })
            if(!okAnim) currentTableData.playIdleAnim()
        }
    }

    const tableInfo = currentTableData.currentTable;

    let endActionSeconds = 0;

    if (currentTableData.endActionTime) {
        endActionSeconds = Math.floor((currentTableData.endActionTime - Date.now()) / 1000);
    } else {
        currentTableData.lastActionTimeSeconds = 0;
    }

    if (currentTableData.lastActionTimeSeconds !== endActionSeconds) {

        if (endActionSeconds >= 0) {
            //     gui.browser.execute(`CEF.casino.updateAdditionalData({
            //   currentState: 'Ожидание - 00:${endActionSeconds.toString().padStart(2, '0')}'
            // });`);
        }

        currentTableData.lastActionTimeSeconds = endActionSeconds;
    }

    if (currentTableData.currentState === 0) {
        currentTableData.screenGridFirstPoint = mp.game.graphics.world3dToScreen2d(tableInfo.gridFirstPoint.x, tableInfo.gridFirstPoint.y, tableInfo.gridFirstPoint.z);
        currentTableData.screenGridSecondPoint = mp.game.graphics.world3dToScreen2d(tableInfo.gridSecondPoint.x, tableInfo.gridSecondPoint.y, tableInfo.gridSecondPoint.z);
        currentTableData.screenGridThreePoint = mp.game.graphics.world3dToScreen2d(tableInfo.gridThreePoint.x, tableInfo.gridThreePoint.y, tableInfo.gridThreePoint.z);
        currentTableData.screenGridFourPoint = mp.game.graphics.world3dToScreen2d(tableInfo.gridFourPoint.x, tableInfo.gridFourPoint.y, tableInfo.gridFourPoint.z);
        const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
        const mousePosition = [mp.gui.cursor.position[0] / resolution.x, mp.gui.cursor.position[1] / resolution.y];

        const gridStartY = mousePosition[1] - currentTableData.screenGridSecondPoint.y;
        const gridEndY = currentTableData.screenGridFourPoint.y - currentTableData.screenGridSecondPoint.y;

        const yRelativePos = gridStartY / gridEndY;

        const screenGridX = system.lerp(currentTableData.screenGridSecondPoint.x, currentTableData.screenGridFirstPoint.x, yRelativePos);
        const gridStartX = mousePosition[0] - screenGridX;
        const gridEndX = currentTableData.screenGridThreePoint.x - screenGridX;

        const xRelativePos = gridStartX / gridEndX;

        currentTableData.chipPosition.x = Math.min(Math.max(system.lerp(-0.191, 0.96, xRelativePos), -0.191), 0.96);
        currentTableData.chipPosition.y = Math.min(Math.max(system.lerp(0.23, -0.426, yRelativePos), -0.426), 0.23);

        const chipPosition = currentTableData.currentTable.object.getOffsetFromInWorldCoords(currentTableData.chipPosition.x, currentTableData.chipPosition.y, GRID_START_Z);
        currentTableData.chipObject.setCoordsNoOffset(chipPosition.x, chipPosition.y, chipPosition.z, false, false, false);

        const selectedIds = [];
        const selectedColoredIds = [];

        for (let i = 0; i < currentTableData.currentTable.cellsData.length; i++) {
            const {
                id,
                coloredId,
                firstPoint,
                secondPoint,
                threePoint,
                fourPoint
            } = currentTableData.currentTable.cellsData[i];
            if (check(firstPoint.x, firstPoint.y, threePoint.x, threePoint.y, fourPoint.x, fourPoint.y, secondPoint.x, secondPoint.y, chipPosition.x, chipPosition.y)) {
                selectedIds.push(id);
                selectedColoredIds.push(coloredId);
            } else {
                if (currentTableData.currentTable.cellsData[i].isActive) {
                    onDeActiveAction(currentTableData.currentTable.cellsData[i]);
                    currentTableData.currentTable.cellsData[i].isActive = false;
                }
            }
        }

        currentTableData.selectedIds = selectedIds;

        const betKey = selectedIds.join('-');

        if (currentTableData.lastSelectedBetKey !== betKey) {
            currentTableData.lastSelectedBetKey = betKey;

            const selected = ROULETTE_RULES[betKey] ? ROULETTE_RULES[betKey].title || betKey : '';

        }

        // if (betKey.length && helpers.rules[betKey]) {
        //   mp.game.graphics.drawText(`Выбрано: ${helpers.rules[betKey].title}`, [0.5, 0.1], { font: 4, color: [255, 255, 255, 255], scale: [0, 0.4], outline: true, centre: true });
        // } else {
        //   mp.game.graphics.drawText(`Выбрано: ${betKey}`, [0.5, 0.1], { font: 4, color: [255, 255, 255, 255], scale: [0, 0.4], outline: true, centre: true });
        // }

        // let currentBet = 0;
        //
        // if (currentTableData.myBets.has(betKey)) {
        //     currentBet = currentTableData.myBets.get(betKey).balance;
        //
        //     // mp.game.graphics.drawText(`Сумма этой ставки: ${thisInfo.myBets.get(betKey).balance}, возможный выигрыш: ${helpers.rules[betKey].multiplier * thisInfo.myBets.get(betKey).balance}`, [0.5, 0.13], { font: 4, color: [255, 255, 255, 255], scale: [0, 0.4], outline: true, centre: true });
        // }
        //
        // if (currentTableData.lastCurrentBet !== currentBet) {
        //     currentTableData.lastCurrentBet = currentBet;
        //     // gui.browser.execute(`CEF.casino.updateAdditionalData({currentBet: ${currentBet}})`);
        // }

        for (let cellId = 0; cellId < currentTableData.currentTable.cellsData.length; cellId++) {
            const {id, markerObject} = currentTableData.currentTable.cellsData[cellId];

            if (selectedIds.includes(id)) {
                if (!currentTableData.currentTable.cellsData[cellId].isActive) {
                    onActiveAction(currentTableData.currentTable.cellsData[cellId]);
                    currentTableData.currentTable.cellsData[cellId].isActive = true;
                }
            }

            if (markerObject && mp.objects.exists(markerObject)) {
                mp.game.invoke('0xEA1C610A04DB6BBB', markerObject.handle, currentTableData.currentTable.cellsData[cellId].isHovered || currentTableData.currentTable.cellsData[cellId].isActive);
            }
        }
        changeChipState(true)
    } else {
        for (let cellId = 0; cellId < currentTableData.currentTable.cellsData.length; cellId++) {
            const {id, markerObject} = currentTableData.currentTable.cellsData[cellId];
            if (markerObject && mp.objects.exists(markerObject)) mp.game.invoke('0xEA1C610A04DB6BBB', markerObject.handle, false);
        }
        changeChipState(false);
    }

    // mp.game.graphics.drawText(`Текущее состояние: ${currentTableData.currentState}, ставка: ${currentTableData.lastSelectedBetKey} / ${currentTableData.currentChipType}`, [0.5, 0.19], {
    //     font: 4,
    //     color: [255, 255, 255, 255],
    //     scale: [0, 0.4],
    //     outline: true,
    //     centre: true
    // });

})
let currentRes = 0
CustomEvent.registerServer('casino:roulette:statusWinLoose', (status: 'win' | 'loose' | 'draw', sum: number) => {
    currentTableData.myBets = [];
    disableExit = false;

    sendCEFData()
    if (disableExit) return;
    const dict = `anim_casino_b@amb@casino@games@roulette@ped_${user.isMale() ? '' : 'fe'}male@seat_${currentTableData.seat + 1}@regular@0${currentTableData.seat + 1}a@reacts@v01`
    let anim = '';
    if (sum === 0 || status === 'draw') anim = system.randomArrayElement(['reaction_impartial_var01', 'reaction_impartial_var02', 'reaction_impartial_var03'])
    else if (status === 'win') {
        if (sum >= ROULETTE_SUM_AS_BIG_WIN) anim = 'reaction_great';
        else anim = system.randomArrayElement(['reaction_good_var02', 'reaction_good_var01'])
        currentRes += sum;
        CustomEvent.triggerCef('casino:roulette:win', sum);
    } else {
        if (sum >= ROULETTE_SUM_AS_BIG_WIN) anim = 'reaction_terrible';
        else anim = system.randomArrayElement(['reaction_bad_var01', 'reaction_bad_var02'])
        currentRes -= sum;
        CustomEvent.triggerCef('casino:roulette:win', -sum);
    }
    disableExit = true;
    user.playAnim([[dict, anim]], false, false).then(() => {
        currentTableData.playIdleAnim()
    })
})

const sendCEFData = () => {
    if(!currentTableData.inGame) return;
    let allmybets = 0;
    currentTableData.myBets.map(item => {
        allmybets+=item.balance
    })
    CustomEvent.triggerCef('casino:roulette:data', currentTableData.currentChipSum, currentTableData.lastWinSums, currentTableData.id, allmybets, currentTableData.myBets.length);
}

const sendCEFTimer = (time: number) => {
    CustomEvent.triggerCef('casino:roulette:timer', time);
}

let spamBets = false;
mp.events.add('click', (x, y, upOrDown, leftOrRight) => {
    if (upOrDown === 'down') return;
    if (!currentTableData.inGame) return;
    if (currentTableData.waitBet) return;
    if (currentTableData.currentState !== ROULETTE_STATENAMES_ID.WAIT) return;
    if (!currentTableData.currentTable) return;
    const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    if (!system.insidePolygon([mp.gui.cursor.position[0] / resolution.x, mp.gui.cursor.position[1] / resolution.y],
        [
            [currentTableData.screenGridFirstPoint.x, currentTableData.screenGridFirstPoint.y],
            [currentTableData.screenGridSecondPoint.x, currentTableData.screenGridSecondPoint.y],
            [currentTableData.screenGridThreePoint.x, currentTableData.screenGridThreePoint.y],
            [currentTableData.screenGridFourPoint.x, currentTableData.screenGridFourPoint.y]
        ])) return;


    const betKey = currentTableData.selectedIds.join('-');
    const chipPosition = currentTableData.currentTable.object.getOffsetFromInWorldCoords(currentTableData.chipPosition.x, currentTableData.chipPosition.y, GRID_START_Z);
    if (leftOrRight === 'left') {
        if(user.chips < CHIPS_TYPE[currentTableData.currentChipType]) return user.notify(`Недостаточно фишек для данной ставки`, 'error');
        if (currentTableData.myBetsCount >= ROULETTE_MAX_BETS) {
            user.notify(`Сделано максимальное количество ставок`, 'error');
            mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_REFUSE_BETS', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
            return;
        }
        if(spamBets){
            user.notify(`Делайте ставки помедленнее`, 'error');
            mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_REFUSE_BETS', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
            return;
        }
        spamBets = true;
        setTimeout(() => {
            spamBets = false
        }, 1000)
        currentTableData.waitBet = true;
        CustomEvent.callServer('casino:roulette:setBet', currentTableData.id, betKey, chipPosition.x, chipPosition.y, chipPosition.z, currentTableData.currentChipType).then((id: number) => {
            if (id) {
                currentTableData.myBets.push({sid: id, betKey, balance: CHIPS_TYPE[currentTableData.currentChipType]})
                mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_PLACE_BET', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
                sendCEFData();
            } else {
                mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_REFUSE_BETS', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
            }

            currentTableData.waitBet = false;
        });
    } else if (leftOrRight === 'right') {
        if (currentTableData.myBets.find(q => q.betKey === betKey)) {
            if(spamBets){
                user.notify(`Снимайте ставки помедленнее`, 'error');
                mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_REFUSE_BETS', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
                return;
            }
            spamBets = true;
            setTimeout(() => {
                spamBets = false
            }, 1000)
            currentTableData.waitBet = true;
            CustomEvent.callServer('casino:roulette:removeBet', currentTableData.id, betKey, chipPosition.x, chipPosition.y, chipPosition.z, currentTableData.currentChipType).then((id: number) => {
                if (id) {
                    currentTableData.myBets.splice(currentTableData.myBets.findIndex(q => q.sid === id), 1)
                    sendCEFData();
                    mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_PLACE_BET', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
                } else {
                    mp.game.audio.playAmbientSpeechWithVoice(currentTableData.currentTable.ped.handle, 'MINIGAME_DEALER_CLOSED_BETS', currentTableData.currentTable.speech, 'SPEECH_PARAMS_FORCE', false);
                }
                currentTableData.waitBet = false;

                if (currentTableData.myBetsCount === 0) {
                    disableExit = false;
                }
            });
        }
    }
});