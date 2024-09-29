import {
    ROULETTE_BET_TIME,
    ROULETTE_MAX_BETS,
    ROULETTE_MAX_BETS_TABLE, ROULETTE_RULES,
    ROULETTE_STATENAMES_ID,
    ROULETTE_TABLE_MODEL,
    ROULETTE_TABLE_POSITIONS,
    ROULETTETableItem
} from "../../../shared/casino/roulette";
import {CustomEvent} from "../custom.event";
import {User} from "../user";
import {system} from "../system";
import {CHIP_TYPE_MODELS, CHIPS_TYPE} from "../../../shared/casino/main";
import {runCasinoAchievWin} from "./achiev";
import { gui } from '../gui'
import { getX2Param } from "../usermodule/static";

let roulleteDailyWinning = 0
let roulleteDailyLoosing = 0

//todo: admin command

gui.chat.registerCommand("casinostats", (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow(6)) return;
    player.outputChatBox(`На ставках в рулетке выиграли сегодня: ${roulleteDailyWinning} фишек | всего поставили: ${roulleteDailyLoosing} фишек`)
})

interface TableData {
    chipTypePrices: ROULETTETableItem['chipTypePrices'],
    seats: [PlayerMp, PlayerMp, PlayerMp, PlayerMp],
    bets: { owner: number, chip: ROULETTETableItem['chipTypePrices'][number], pos: { x: number, y: number, z: number }, object: ObjectMp, betKey: string, id: number }[],
    getBetsSum: (player: PlayerMp) => number,
    getBetsCount: (player: PlayerMp) => number,
    status: ROULETTE_STATENAMES_ID,
    winNumber: number,
    table: number,
    nextRun: number,
}

let betid = 1
export const tables = new Map<number, TableData>();

const setWinNumberObject = (index: number, number: number) => {
    mp.objects.at(tables.get(index)?.table)?.setVariable('winNumber', number)
}
const setStatusObject = (index: number, status: ROULETTE_STATENAMES_ID) => {
    mp.objects.at(tables.get(index)?.table)?.setVariable('casinoStatus', status)
}

ROULETTE_TABLE_POSITIONS.map((table, index) => {

    const tableObject = mp.objects.new(mp.joaat(ROULETTE_TABLE_MODEL), table.position, {
        dimension: table.dimension,
        rotation: new mp.Vector3(0, 0, table.heading)
    });
    tableObject.notifyStreaming = true;
    tableObject.setVariables({
        casinoId: index,
        casinoRouletteTable: true,
        casinoStatus: ROULETTE_STATENAMES_ID.WAIT,
        winNumber: 9999,
    })

    tables.set(index, {
        table: tableObject.id,
        chipTypePrices: table.chipTypePrices,
        seats: [null, null, null, null],
        bets: [],
        status: ROULETTE_STATENAMES_ID.WAIT,
        winNumber: 9999,
        getBetsSum: (player) => {
            let sum = 0;
            tables.get(index).bets.filter(item => item.owner === player.dbid).map(item => sum += item.chip)
            return sum
        },
        getBetsCount: (player) => {
            return tables.get(index).bets.filter(item => item.owner === player.dbid).length
        },
        nextRun: 0,
    })


    setTimeout(() => {
        const intervalTime = system.getRandomInt(1000, !mp.config.announce ? 90000 : 5000)
        setTimeout(() => {
            setInterval(() => {
                const currentWinNumber = tables.get(index).winNumber;
                
                let allBetsOwners: number[] = [];
                let winSums = new Map<number, number>();
                let looseList = new Map<number, number>();
                
                tables.get(index).bets.map(bet => {
                    if(bet.object && mp.objects.exists(bet.object)) bet.object.destroy();
                    const rule = ROULETTE_RULES[bet.betKey];
                    roulleteDailyLoosing += bet.chip
                    if(rule && rule.winNumbers && rule.winNumbers.includes(currentWinNumber)){
                        winSums.set(bet.owner, (winSums.get(bet.owner) || 0) + bet.chip + (bet.chip * rule.multiplier))
                    } else {
                        looseList.set(bet.owner, (looseList.get(bet.owner) || 0) + bet.chip)
                    }
                    if(!allBetsOwners.includes(bet.owner)) allBetsOwners.push(bet.owner)
                })
                
                if(currentWinNumber !== 9999){
                    winSums.forEach((sum, owner) => {
                        const player = User.get(owner);
                        if(!player) return;
                        roulleteDailyWinning += sum
                        player.user.addChips(sum, false, `Победа в рулетке`)
                        runCasinoAchievWin(player, 'Roulette', sum)
                    })
                    looseList.forEach((sum, owner) => {
                        if(winSums.has(owner)) return;
                        const player = User.get(owner);
                        if(!player) return;
                    })
                    tables.get(index).seats.map(player => {
                        if(!player) return;
                        if(!allBetsOwners.includes(player.dbid)) allBetsOwners.push(player.dbid)
                    })
                    allBetsOwners.map(owner => {
                        const player = User.get(owner);
                        if(!player) return;
                        const win = winSums.get(owner) || 0
                        const loose = looseList.get(owner) || 0
                        const sum = Math.abs(win - loose);
                        CustomEvent.triggerClient(player, `casino:roulette:statusWinLoose`,sum === 0 ? 'draw' : (win >= loose ? 'win' : 'loose'), sum);
                    })
                }
                tables.get(index).status = ROULETTE_STATENAMES_ID.WAIT;
                setStatusObject(index, ROULETTE_STATENAMES_ID.WAIT)
                tables.set(index, {...tables.get(index), bets: [], nextRun: system.timestamp + ROULETTE_BET_TIME})

                const getNumWin = (): number => {
                    let num = 0;

                    do {
                        num = Math.floor(Math.random() * 38);
                    } while ([36, 37].includes(num))

                    return num;
                }

                mp.objects.toArray().filter(q => q && q.getVariable('casinoId') === index && !!q.getVariable('casinoChip')).map(q => q.destroy());
                setTimeout(() => {
                    let numWin = getNumWin();
                    let bigWin = false;
                    
                    for (let i = 0; i < 30; i++) {
                        tables.get(index).bets.forEach(bet => {
                            const rule = ROULETTE_RULES[bet.betKey];
                            if (rule && rule.winNumbers.includes(numWin) && bet.chip + (bet.chip * rule.multiplier) > 25000) {
                              bigWin = true  
                            }
                        })
                        
                        if (!bigWin) break;
                        
                        numWin = getNumWin();
                        bigWin = false
                    }
                    
                    if (bigWin && tables.get(index).bets.length) console.log(`Unexcepted winning in casino roulette ${tables.get(index).bets}`)
                        
                    tables.get(index).winNumber = numWin;
                    setWinNumberObject(index, numWin);
                    setStatusObject(index, ROULETTE_STATENAMES_ID.BET_END);
                    tables.get(index).status = ROULETTE_STATENAMES_ID.BET_END;
                }, ROULETTE_BET_TIME * 1000)
            }, 50000)
        }, intervalTime)
    }, 1000 + (1000 * index))
})

const nearestPlayers = (tableId: number) => {
    checkTable(tableId);
    const table = tables.get(tableId);
    if (!table) return [];
    return User.getNearestPlayersByCoord(ROULETTE_TABLE_POSITIONS[tableId].position, 20, ROULETTE_TABLE_POSITIONS[tableId].dimension)
}

CustomEvent.registerClient('casino:roulette:removeBet', (player, tableId: number, betKey: string, x: number, y: number, z: number, ChipType: number) => {
    const user = player.user;
    if (!user) return 0;
    checkTable(tableId);
    const table = tables.get(tableId);
    if (!table) return 0;
    if (table.status !== ROULETTE_STATENAMES_ID.WAIT) {
        player.notify('Ставки сделаны', 'error')
        return 0;
    }
    if (table.winNumber === 9999) {
        player.notify('Ставки пока что не принимаются', 'error')
        return 0;
    }

    let bets = [...table.bets]
    const mybets = bets.filter(q => q.owner === user.id && q.betKey === betKey).map(q => {
        return {...q, dist: system.distanceToPos2D({x, y}, q.pos)}
    })
    const mybet = system.sortArrayObjects(mybets, [{id: 'dist', type: "ASC"}])[0];
    if (!mybet) {
        player.notify('У вас нет ставки в данной области', 'error');
        return 0;
    }
    if (mybet.object && mp.objects.exists(mybet.object)) mybet.object.destroy();
    bets.splice(bets.findIndex(q => q.id === mybet.id), 1)
    table.bets = [...bets];
    user.addChips(mybet.chip, false, `Отмена ставки`)
    tables.set(tableId, table);
    return mybet.id;
    // table.bets.push({owner: user.id, chip: sum, pos: {x: pos.x, y: pos.y, z: pos.z}, object: chipObject})
})
CustomEvent.registerClient('casino:roulette:setBet', (player, tableId: number, betKey: string, x: number, y: number, z: number, ChipType: number) => {
    const user = player.user;
    if (!user) return false;
    checkTable(tableId);
    const table = tables.get(tableId);
    if (!table) return 0;
    if (table.status !== ROULETTE_STATENAMES_ID.WAIT) {
        player.notify('Ставки больше не принимаются', 'error')
        return 0;
    }
    if (table.winNumber === 9999) {
        player.notify('Ставки пока что не принимаются', 'error')
        return 0;
    }
    const count = table.getBetsCount(player);
    if (count >= ROULETTE_MAX_BETS) {
        player.notify(`Нельзя выставить более чем ${ROULETTE_MAX_BETS} ставок`, 'error');
        return 0;
    }
    if (table.bets.length >= ROULETTE_MAX_BETS_TABLE) {
        player.notify(`На столе уже максимальное количество ставок`, 'error');
        return 0;
    }
    const sum = CHIPS_TYPE[ChipType]
    if(user.chips < sum){
        player.notify(`У вас недостаточно фишек для данной ставки`, 'error');
        return 0;
    }
    const sumTotal = table.getBetsSum(player) + sum;
    const maxsum = table.chipTypePrices[table.chipTypePrices.length - 1];
    if (sumTotal > maxsum) {
        player.notify(`Сумма ваших ставок не может превышать $${system.numberFormat(maxsum)}`, 'error');
        return 0;
    }
    const rule = ROULETTE_RULES[betKey];
    if (!rule) {
        return 0;
    }
    // const currentBet = table.bets.find(q => q.owner === user.id && q.betKey === betKey);
    // if(currentBet){
    //     currentBet.chip
    // } else {
    let bets = [...table.bets]
    const pos = new mp.Vector3(x, y, z)
    const chipObject = mp.objects.new(mp.joaat(CHIP_TYPE_MODELS[ChipType]), pos, {
        dimension: ROULETTE_TABLE_POSITIONS[tableId].dimension,
        rotation: new mp.Vector3(0, 0, 0)
    });
    chipObject.setVariables({
        casinoId: tableId,
        casinoChip: true
    })

    betid++;
    bets.push({owner: user.id, chip: sum, pos: {x: pos.x, y: pos.y, z: pos.z}, object: chipObject, betKey, id: betid})
    table.bets = [...bets]
    user.removeChips(sum, false, 'Ставка в рулетке')

    tables.set(tableId, table);
    // }
    return betid;
})

CustomEvent.registerClient('casino:roulette:entertable', (player, tableId: number, mySeat: number) => {
    checkTable(tableId);
    const cfg = ROULETTE_TABLE_POSITIONS[tableId];
    if(!cfg) return null;
    if(cfg.isVip && (!player.user.vipData || !player.user.vipData.casino)) return null;
    const table = tables.get(tableId);
    if (!table) return null;
    if(player.user.getJobDress) return 'Снимите рабочую одежду прежде чем начать играть';
    let seatEnter: number = null;
    if(!table.seats[mySeat]) seatEnter = mySeat

    if(typeof seatEnter === "number") {
        player.user.currentWeapon = null;
        table.seats[seatEnter] = player;
        tables.set(tableId, table);
    } else {
        return null;
    }

    return [seatEnter, table.nextRun - system.timestamp];
})
CustomEvent.registerClient('casino:roulette:exittable', (player, tableId: number) => {
    checkTable(tableId);
    const table = tables.get(tableId);
    if (!table) return null;
    table.seats.map((target, seat) => {
        if(target && mp.players.exists(target) && target.dbid === player.dbid) table.seats[seat] = null;
    })
    tables.set(tableId, table);
})


const checkTable = (id: number) => {
    let data = tables.get(id);
    if (!data) return;
    // @ts-ignore
    let seats: TableData['seats'] = [];
    let ids: number[] = []
    let bets: TableData['bets'] = [];
    data.seats.map(target => {
        if (!target || !mp.players.exists(target)) {
            seats.push(null);
        } else {
            seats.push(target);
            ids.push(target.dbid)
        }
    })
    data.bets.map(bet => {
        if (ids.includes(bet.owner)) bets.push(bet);
        else if(bet.object && mp.objects.exists(bet.object)) bet.object.destroy()
    })

    data = {...data, seats, bets};
    tables.set(id, data);
}