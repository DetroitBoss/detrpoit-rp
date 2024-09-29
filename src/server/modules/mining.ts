import {HouseEntity} from "./typeorm/entities/houses";
import {houses, isPlayerHasHouseKey} from "./houses";
import {
    calculateMiningFarmData,
    COIN_SELL_POS,
    getMiningLevel,
    MINING_ALGORITHMS_LEVELS,
    MINING_CPUS,
    MINING_POWERSS,
    MINING_RAMS,
    MINING_SELL_COEFFICIENT,
    MINING_TF_INDEX_BASE_COIN,
    MINING_TICK_INTERVAL,
    MINING_VIDEOCARDS,
    MiningHouseDefault
} from "../../shared/mining";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {getInteriorHouseById, interriors} from "../../shared/inrerriors";
import {inventory} from "./inventory";
import {getBaseItemNameById, getItemName, inventoryShared, ITEM_TYPE, OWNER_TYPES} from "../../shared/inventory";
import {ItemEntity} from "./typeorm/entities/inventory";
import {saveEntity} from "./typeorm";
import {CustomEvent} from "./custom.event";
import {SocketSyncWeb} from "./socket.sync.web";
import PhoneCryptoData from "../../shared/phone/phoneCryptoData";
import {CryptoTransactionType} from "../../shared/phone/cryptoTransactionType.enum";
import {AccountEntity} from "./typeorm/entities/account";
import {UserEntity} from "./typeorm/entities/user";
import {getX2Param, UserStatic} from "./usermodule/static";
import { taxRun } from './tax.system'
import { UserStats } from './usermodule/stats'
import { gui } from './gui'


let cryptoCost = 100;

export class MiningStats {
    /** Число крипты выведенной за день */
    public static cryptoDailyWithdrawal: number = 0;  
}

export const calculatePowerForCoin = () => {
    const items = houses.dataArray.filter(q => q.miningData);
    let sum = 0;
    items.map(q => {
        const data = calculateMiningFarmData(q.miningData);
        sum += data.tf
    })
    let res = sum / items.length
    currentPowerForCoin = (res / MINING_TF_INDEX_BASE_COIN) || 100
}

interriors.map(int => {
    if(int.type !== 'house') return;
    if(!int.mining) return;
    colshapes.new(new mp.Vector3(int.mining.x, int.mining.y, int.mining.z), "Майнинг ферма", player => {
        if(!player.dimension) return;
        const item = houses.get(player.dimension)
        if(!item) return;
        miningMenu(player, item)
    }, {
        // radius: int.type == "house" ? 1 : 3,
        dimension: -1,
        color: [0,0,0,0],
        radius: 2
    })
})


let miningProps = new Map<number, ObjectMp>();


export const getMiningCefData = (player: PlayerMp, item: HouseEntity) => {
    const user = player.user;
    if(!user) return null;
    const ids = [...MINING_ALGORITHMS_LEVELS, ...MINING_CPUS, ...MINING_RAMS, ...MINING_VIDEOCARDS, ...MINING_POWERSS].map(q => q.item);
    const items = user.allMyItems.filter(q => ids.includes(q.item_id)).map(q => {
        return [q.id, q.item_id]
    })
    return JSON.stringify({...item.miningData, items})
}

CustomEvent.registerCef('mining:component:insert', (player, id: number, upgradeComponent: "videocards" | "cpu" | "powers" | "alghoritm" | "rams", itemid: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    let data = item.miningData;
    if(!data) return;
    const cfg = getMiningLevel(data.level)
    if(upgradeComponent === "cpu" && data.cpu) return player.notify('Снимите старый компонент прежде чем устанавливать новый', 'error')
    if(upgradeComponent === "alghoritm" && data.algorithm) return player.notify('Снимите старый компонент прежде чем устанавливать новый', 'error')
    if(upgradeComponent === "videocards" && data.cards.filter(q => q).length >= cfg.max_cards) return player.notify('Все слоты заняты', 'error')
    if(upgradeComponent === "powers" && data.powers.filter(q => q).length >= cfg.max_additional_power_blocks) return player.notify('Все слоты заняты', 'error')
    if(upgradeComponent === "rams" && data.ram.filter(q => q).length >= cfg.max_ram_count) return player.notify('Все слоты заняты', 'error')
    let filterList: number[] = []
    if(upgradeComponent === 'cpu') filterList = MINING_CPUS.map(q => q.item)
    if(upgradeComponent === 'alghoritm') filterList = MINING_ALGORITHMS_LEVELS.map(q => q.item)
    if(upgradeComponent === 'videocards') filterList = MINING_VIDEOCARDS.map(q => q.item)
    if(upgradeComponent === 'powers') filterList = MINING_POWERSS.map(q => q.item)
    if(upgradeComponent === 'rams') filterList = MINING_RAMS.map(q => q.item)
    const itm = user.allMyItems.find(q => q.id === itemid);
    if(!itm) return player.notify('Выбранного предмета нет в вашем инвентаре', 'error');
    if(!filterList.includes(itm.item_id)) return player.notify('Выбранный предмет не подходит для установки', 'error');
    if(upgradeComponent === 'cpu') data.cpu = itm.item_id;
    if(upgradeComponent === 'alghoritm') data.algorithm = itm.item_id;
    if(upgradeComponent === 'videocards') data.cards.push(itm.item_id);
    if(upgradeComponent === 'powers') data.powers.push(itm.item_id);
    if(upgradeComponent === 'rams') data.ram.push(itm.item_id);

    itm.useCount(1, player);
    item.miningData = {...data};
    saveEntity(item);

    fireSocket(item)

})

const fireSocket = (item: HouseEntity) =>
    SocketSyncWeb.getfire(`mining_${item.id}`).map(player =>
        SocketSyncWeb.fireTarget(player, `mining_${item.id}`, getMiningCefData(player, item)))


CustomEvent.registerCef('mining:component:remove', async (player, id: number, upgradeComponent: "videocards" | "cpu" | "powers" | "alghoritm" | "rams", index: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    let data = item.miningData;
    if(!data) return;
    const cfg = getMiningLevel(data.level)
    if(upgradeComponent === "cpu" && !data.cpu) return player.notify('Слот пустой', 'error')
    if(upgradeComponent === "alghoritm" && !data.algorithm) return player.notify('Слот пустой', 'error')
    if(upgradeComponent === "videocards" && !data.cards[index]) return player.notify('Слот пустой', 'error')
    if(upgradeComponent === "powers" && !data.powers[index]) return player.notify('Слот пустой', 'error')
    if(upgradeComponent === "rams" && !data.ram[index]) return player.notify('Слот пустой', 'error')
    let itemid: number;

    if(upgradeComponent === "cpu") itemid = data.cpu;
    if(upgradeComponent === "alghoritm") itemid = data.algorithm;
    if(upgradeComponent === "videocards") itemid = data.cards[index];
    if(upgradeComponent === "powers") itemid = data.powers[index];
    if(upgradeComponent === "rams") itemid = data.ram[index];

    if(!itemid) {
        console.log('incorrect select item when remove')
        return;
    } else {
        console.log(`give ${itemid}`)
    }

    if (!user.canTakeItem(itemid, 1, 1)) {
        player.notify(`Недостаточно места в инвентаре для ${getBaseItemNameById(itemid)}`, "error");
        return;
    }

    if(upgradeComponent === "cpu") data.cpu = null;
    else if(upgradeComponent === "alghoritm") data.algorithm = 0;
    else if(upgradeComponent === "videocards") data.cards[index] = 0;
    else if(upgradeComponent === "powers") data.powers[index] = 0;
    else if(upgradeComponent === "rams") data.ram[index] = 0;

    data.cards = data.cards.filter(q => q)
    data.powers = data.powers.filter(q => q)
    data.ram = data.ram.filter(q => q)

    item.miningData = {...data};
    saveEntity(item);
    fireSocket(item)

    await user.giveItem(itemid);
})

CustomEvent.registerCef('mining:sell', (player) => {
    const user = player.user;
    if (!user) return;
    if (!player.user.house) return;
    if (!player.user.houseEntity.miningData) return;
    if (!player.user.houseEntity.miningData.amount) return player.notify('Пустой баланс', 'error');

    const house: HouseEntity = player.user.houseEntity;
    const interiorConfig = getInteriorHouseById(house.interrior);

    let amountToWithdraw = house.miningData.amount;
    let electricityTax = 0;
    if (interiorConfig.cryptoWithdrawalTax) {
        electricityTax = amountToWithdraw * interiorConfig.cryptoWithdrawalTax;
    }

    const taxNoticeText = (electricityTax > 0) ? ` (после вычета счета на электричества ${electricityTax})` : '';
    user.setGui(null)
    menu.accept(player, `Вы действительно хотите вывести ${player.user.houseEntity.miningData.amount}${taxNoticeText} криптовалюты на свой крипто-счёт?`)
        .then(status => {
            if (!user) return;
            if (!player.user.house) return;
            if (!player.user.houseEntity.miningData) return;
            if (!player.user.houseEntity.miningData.amount) return;

            if (status) {
                player.user.houseEntity.miningData.amount = 0;
                if (!user.crypto_number) user.newCryptoNumber();
                
                user.addCryptoMoney(amountToWithdraw - electricityTax, true, 'Вывод с майнинг фермы');
                player.user.houseEntity.miningData = {...player.user.houseEntity.miningData, amount: 0};
                saveEntity(player.user.houseEntity);
                player.notify('Вы успешно вывели криптовалюту с фермы', 'success');
            }
    });
})

CustomEvent.registerCef('mining:exchange', async (player, amount: number, type: CryptoTransactionType) => {
    if (!player.user || !player.user.crypto_number || !amount) return;
    if (type === CryptoTransactionType.WITHDRAW)
        sellCrypto(player, amount);
    else await buyCrypto(player, amount);
    const cryptoData: PhoneCryptoData = { cryptoBalance: player.user.crypto, dailyWithdrawal: MiningStats.cryptoDailyWithdrawal }
    CustomEvent.triggerCef(player, 'mining:updateAmount', cryptoData)
})

CustomEvent.registerCef('mining:update', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const item = houses.get(id);
    if(!item) return;
    if (!item.miningData) return player.notify('Майнинг ферма еще не установлена', 'error');
    if (!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
    const cfg = getMiningLevel(item.miningData.level);
    if (!cfg) return;
    const nextLevel = cfg.next;
    if (!nextLevel) return player.notify('Больше улучшений нет', 'error');
    const cfgNext = getMiningLevel(nextLevel);
    if (!cfgNext) return;
    if (cfgNext.requireMoney && user.money < cfgNext.requireMoney) return player.notify(`Требуется $${system.numberFormat(cfgNext.requireMoney)}`, 'error')
    let allhave = true;
    if (cfgNext.requireItems) cfgNext.requireItems.map(q => {
        if (allhave && !user.haveItem(q)) {
            allhave = false;
            player.notify(`Требуется ${getBaseItemNameById(q)}`, 'error')
        }
    })
    if (!allhave) return;
    if (cfgNext.requireMoney) user.removeMoney(cfgNext.requireMoney, true, `Улучшение майнинг фермы`);
    let items: ItemEntity[] = []
    if (cfgNext.requireItems) cfgNext.requireItems.map(q => {
        const itemq = user.haveItem(q)
        if (itemq) items.push(itemq)
    })
    if (items.length > 0) inventory.deleteItems(...items);
    item.miningData = {...item.miningData, level: nextLevel};
    item.save();
    player.notify('Ферма улучшена', 'success');

    fireSocket(item)
})

export const miningMenu = (player: PlayerMp, item: HouseEntity) => {
    const user = player.user;
    if (!item.userId || (!user.isAdminNow(6) && item.userId != user.id)) return player.notify('Информация о майнинг ферме недоступна')
    if (!item.miningData) {
        const m = menu.new(player, "Майнинг ферма", `${item.name} №${item.id}`)
        m.newItem({
            name: 'Установить майнинг ферму',
            onpress: async () => {
                if (item.miningData) return player.notify('Майнинг ферма уже установлена', 'error');
                if (!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
                
                let canInstall = true;
                const usersInAccount = await UserEntity.find({ account: player.user.account });
                usersInAccount.map(u => {
                    const house = houses.getByOwner(u.id);
                    if (house && house.miningData) canInstall = false;
                });
                if (!canInstall) return player.notify('Вы уже имеете майнинг ферму на другом персонаже', 'error');
                
                const itemInt = user.haveItem(3001)
                if (!itemInt) return player.notify(`Требуется ${getBaseItemNameById(3001)} в инвентаре`, 'error');
                m.close()
                itemInt.useCount(1, player);
                item.miningData = {...MiningHouseDefault};
                item.save();
                player.notify(`Майнинг ферма установлена`, 'success');
                miningMenu(player, item)
            }
        })
        m.open()
    } else {
        if(user.isAdminNow(6)){
            inventoryShared.items.filter(q => q.type == ITEM_TYPE.MINING).map(q => {
                if(!user.haveItem(q.item_id)) inventory.createItem({item_id: q.item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: user.id, temp: 1});
            })
        }
        user.setGui('mining', 'mining:data', item.id, JSON.parse(getMiningCefData(player, item)));
        return;
    }
}

export const sendMiningData = (player: PlayerMp, house: HouseEntity) => {
    if(!house) return;
    const miningData = house.miningData;
    CustomEvent.triggerClient(player, 'mining:data', house.id, house.interrior, miningData ? miningData.cards : null, miningData ? miningData.powers : null);
}

const sellCrypto = (player: PlayerMp, amount: number) => {
    const user = player.user;
    if (!user) return;
    if (!amount || amount < 0 || amount > 999999) return;
    if (amount > user.crypto) return player.notify('У вас недостаточно криптовалюты', 'error');
    const cost = amount * MINING_SELL_COEFFICIENT;
    user.removeCryptoMoney(amount, true, 'Продажа криптовалюты');
    user.addMoney(cost, true, 'Продажа криптовалюты');
    menu.close(player);
}

const buyCrypto = async (player: PlayerMp, amount: number) => {
    const user = player.user;
    if (!user) return;
    const cost = amount * cryptoCost;
    const status = await user.tryPayment(cost, 'all', () => true, 'Покупка криптовалюты', 'Биржа');
    if (!status) return;
    user.addCryptoMoney(amount, true, 'Покупка криптовалюты');
}

setTimeout(() => {
    calculatePowerForCoin();
}, 10000)
setInterval(() => {
    calculatePowerForCoin();
}, MINING_TICK_INTERVAL * 60000 * 10)

let currentPowerForCoin = 100;


colshapes.new(COIN_SELL_POS, `Биржа криптовалюты`, player => {
    const user = player.user;
    if(!user) return;
    if(!user.crypto_number) user.newCryptoNumber()
    const m = menu.new(player, 'Биржа');
    m.newItem({
        name: 'Ваш текущий баланс',
        more: `${system.numberFormat(user.crypto)}`,
    })
    m.newItem({
        name: 'Курс покупки',
        more: `$${system.numberFormat(cryptoCost)} за единицу`,
    })
    m.newItem({
        name: 'Курс продажи',
        more: `${MINING_SELL_COEFFICIENT} за единицу`,
        desc: 'Курс меняется динамически в зависимости от количества крипты в штате'
    })
    m.newItem({
        name: 'Купить криптовалюту',
        onpress: () => {
            menu.input(player, 'Введите количество', '', 6, 'int').then(sum => {
                buyCrypto(player, sum)
            })
        }
    })
    m.newItem({
        name: 'Продать криптовалюту',
        onpress: () => {
            menu.input(player, 'Введите количество', '', 6, 'int').then(sum => {
                sellCrypto(player, sum);
            })
        }
    })

    m.open();
}, {
    type: 27,
    radius: 3,
})

export const miningTick = (item: HouseEntity) => {
    const miningData = item.miningData;
    if(!miningData) return 0;
    const data = calculateMiningFarmData(miningData);
    if(!data || data.power.current > data.power.max) return 0;

    if (UserStatic.get(item.userId)) {
        const coins = data.tf / currentPowerForCoin;
        item.miningData = {...item.miningData, amount: item.miningData.amount + coins};
        fireSocket(item);
    }

    return data.tf;
}

CustomEvent.register('newDay1', () => {
    const date = new Date()
    const dayOfTheMonth = date.getDate()
    
    if (dayOfTheMonth % 2) {
        houses.data.forEach(item => {
            if (item.userId) {
                const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours
                const averagePlayed = playedHours / dayOfTheMonth
                const randomLimit = system.getRandomInt(5, 12)
                
                if (averagePlayed > randomLimit) {
                    const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                    const data = item.miningData
                    
                    if (randomComponent === "cpu") data.cpu = null;
                    else if (randomComponent === "alghoritm") data.algorithm = 0;
                    else if (randomComponent === "videocards" && data.cards[0]) data.cards[0] = 0;
                    else if (randomComponent === "powers" && data.powers[0]) data.powers[0] = 0;
                    else if (randomComponent === "rams" && data.ram[0]) data.ram[0] = 0;
                    
                    item.miningData = {...data};
                    saveEntity(item);
                }
            }
        })
    } 
})

gui.chat.registerCommand('testmining', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) return
    
    const date = new Date()
    const dayOfTheMonth = date.getDate()

    houses.data.forEach(item => {
        if (item.userId) {
            const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours ?? 0
            const averagePlayed = playedHours / dayOfTheMonth
            const randomLimit = system.getRandomInt(5, 12)

            if (averagePlayed > randomLimit) {
                const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                const data = item.miningData

                if (randomComponent === "cpu" && data.cpu) {
                    player.outputChatBox('alg ' + item.id)
                }
                else if (randomComponent === "alghoritm" && data.algorithm) player.outputChatBox('alg ' + item.id);
                else if (randomComponent === "videocards" && data.cards[0]) player.outputChatBox('videocards ' + item.id);
                else if (randomComponent === "powers" && data.powers[0]) player.outputChatBox('powers ' + item.id);
                else if (randomComponent === "rams" && data.ram[0]) player.outputChatBox('rams ' + item.id);
            }
        }
    })
})


gui.chat.registerCommand('resetmining', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) return

    const date = new Date()
    const dayOfTheMonth = date.getDate()
    
    houses.data.forEach(item => {
        if (item.userId) {
            const playedHours = UserStats.monthlyOnline.data.find(o => o.id === item.userId)?.hours
            const averagePlayed = playedHours / dayOfTheMonth
            const randomLimit = system.getRandomInt(5, 12)

            if (averagePlayed > randomLimit) {
                const randomComponent = system.randomArrayElement(["videocards", "cpu", "powers", "alghoritm", "rams"])
                const data = item.miningData

                if (randomComponent === "cpu" && data.cpu) data.cpu = null;
                else if (randomComponent === "alghoritm" && data.algorithm) data.algorithm = 0;
                else if (randomComponent === "videocards" && data.cards[0]) data.cards[0] = 0;
                else if (randomComponent === "powers" && data.powers[0]) data.powers[0] = 0;
                else if (randomComponent === "rams" && data.ram[0]) data.ram[0] = 0;

                item.miningData = {...data};
                saveEntity(item);
            }
        }
    })
})

setInterval(() => {
    let sum = 0;
    houses.data.forEach(item => {
        const q = miningTick(item);
        if(q) sum += q;
    })
    if(sum > 0) currentPowerForCoin = MINING_TF_INDEX_BASE_COIN / sum;
}, 60000 * MINING_TICK_INTERVAL)