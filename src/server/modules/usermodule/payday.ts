import {playTimeX2Users, User} from "../user";
import {getX2Param} from "./static";
import {ADMIN_DATA, HELPER_PAYDAY_MONEY} from "../../../shared/admin.data";
import {system} from "../system";
import {
    DONATE_MONEY_NAMES,
    familyFractionPayDayRewardPercent,
    PAYDAY_MONEY_PER_HOUR_MULTIPLE,
    PLAYTIME_MONEY,
    PLAYTIME_TIME,
    PLAYTIME_TYPE,
    UNEMPLOYMENT_BENEFIT
} from "../../../shared/economy";
import {CustomEvent} from "../custom.event";
import {FamilyAddPointsAtPayDay} from "../families";
import {business} from "../business";
import {MoneyChestClass} from "../money.chest";
import {getZonesByOwner} from "../gangwar";
import {GANGWAR_ZONE_MONEY} from "../../../shared/gangwar";
import {PAYDAY_NEED_PLAY} from "../../../shared/payday";
import {
    CAR_FOR_PLAY_REWARD_MAX,
    LEVEL_FOR_PLAY_REWARD_MAX,
    MINUTES_FOR_PLAY_REWARD_MAX
} from "../../../shared/reward.time";
import {Vehicle} from "../vehicles";
import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {saveEntity} from "../typeorm";
import {FamilyContractList} from "../../../shared/family";
import {taxRun} from "../tax.system";
import {Family} from "../families/family";
import {fractionCfg} from "../fractions/main";


CustomEvent.register('newHour', () => {
    payDayGlobal()
})


CustomEvent.register('newMinute', () => {
    const players = mp.players.toArray().filter(target => target.user && target.user.load);
    if (!getX2Param('playtime')) playTimeX2Users.data = [];
    players.map(player => {
        try {
            const user = player.user;
            if (!getX2Param("testserver")) {
                if (!playTimeX2Users.data.find(q => q.id === player.user.account.id)) {
                    playTimeX2Users.insert({id: player.user.account.id, time: 1})
                } else {
                    const q = [...playTimeX2Users.data]
                    const ind = q.findIndex(s => s.id === player.user.account.id);
                    if (ind > -1) {
                        q[ind].time = q[ind].time + 1;
                        if (q[ind].time === PLAYTIME_TIME * 60) {
                            if (PLAYTIME_TYPE === "donate") {
                                player.user.addDonateMoney(PLAYTIME_MONEY, 'Награда за отыгранное время')
                                player.user.account.save();
                            } else {
                                player.user.addMoney(PLAYTIME_MONEY, true, 'Награда за отыгранное время');
                            }
                            player.outputChatBox(`Вы отыграли ${PLAYTIME_TIME} часов и получили ${PLAYTIME_TYPE === "donate" ? '' : `$`}${system.numberFormat(PLAYTIME_MONEY)} ${PLAYTIME_TYPE === "donate" ? DONATE_MONEY_NAMES[2] : ``}`);
                        }
                    }
                }
            }
            if (user.afk) return;
            if (getX2Param('playtimecar') && (user.level <= LEVEL_FOR_PLAY_REWARD_MAX || user.entity.playtimecar > 0)) {
                const MIN_NEED = getX2Param('testserver') ? MINUTES_FOR_PLAY_REWARD_MAX : 10
                if (!user.account.playtimecar) {
                    if (user.entity.playtimecar === MIN_NEED) {
                        const cfg = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX)
                        if (cfg) {
                            user.notifyBig('Получен купон', 'Данный купон вы можете обменять на автомобиль. Для этого используйте полученный купон в инвентаре')
                            player.outputChatBox(`Вы получили купон, который можно обменять на автомобиль. Для этого откройте инвентерь и используйте купон.`)
                            inventory.createItem({
                                owner_type: OWNER_TYPES.PLAYER,
                                owner_id: user.id,
                                item_id: 866,
                                advancedNumber: user.id,
                                advancedString: 'veh|' + CAR_FOR_PLAY_REWARD_MAX
                            })
                            user.account.playtimecar = 1;
                            saveEntity(user.account)
                        }
                    } else if (user.entity.playtimecar < MIN_NEED) {
                        user.entity.playtimecar++;
                    }
                }
            }
            player.user.entity.played_time += 1;
            player.user.questTick();
            if (!User.playedTime.has(player.dbid)) {
                User.playedTime.set(player.dbid, 1);
            } else if (User.playedTime.get(player.dbid) < 60) {
                User.playedTime.set(player.dbid, User.playedTime.get(player.dbid) + 1);
            }
        } catch (e) {
            system.debug.error(`${e.name} ${e.message} ${e.stack}`);
        }
    })
    playTimeX2Users.save()
})

/** Обнулить счетчик отыгранного времени для тех кто отыграл 5+ часов*/
export const clearExpiredPlayTime = () => {
    if (!getX2Param('playtime')) return;
    
    const array = [...playTimeX2Users.data]
    array.map(user => {
        if (user.time >= PLAYTIME_TIME * 60) {
            const ind = playTimeX2Users.data.findIndex(s => s.id === user.id);
            playTimeX2Users.remove(ind);
        }
    })
    
    playTimeX2Users.save()
}

CustomEvent.register('newDay', clearExpiredPlayTime)

export const payDayGlobal = (check = true) => {
    system.debug.info('----------------')
    let bonus_money = 0;
    let base_money = 0;
    let exp = 0;
    let donate_money = 0;

    fractionCfg.list.filter(q => q.mafia).map(fraction => {
        let addmoney = 0;
        business.data.filter(q => q.mafiaOwner == fraction.id).map(biz => {
            addmoney += Math.floor((((biz.price / 100) * familyFractionPayDayRewardPercent) / 24))
        })
        if (addmoney) {
            const safe = MoneyChestClass.getByFraction(fraction.id);
            if (safe) safe.money = safe.money + addmoney;
        }
    })

    fractionCfg.list.filter(q => q.gang).map(fraction => {
        let addmoney = getZonesByOwner(fraction.id).length * GANGWAR_ZONE_MONEY;
        if(addmoney){
            const safe = MoneyChestClass.getByFraction(fraction.id);
            if (safe) safe.money = safe.money + addmoney;
        }
    })

    const players = mp.players.toArray().filter(target => target.user);
    system.debug.info(`Выдача PayDay для ${players.length} игроков`);
    players.map(player => {
        if (check && (!User.playedTime.has(player.dbid) || User.playedTime.get(player.dbid) < PAYDAY_NEED_PLAY)) {
            player.notify(`PayDay не был получен, вы должны отыграть ${PAYDAY_NEED_PLAY} или более минут за час`, "error");
        } else if (check && player.user.afk) {
            player.notify(`PayDay не был получен, вы AFK`, "error");
        } else {
            const res = player.user.payday();
            bonus_money += res.bonus_money;
            base_money += res.base_money;
            exp += res.exp;
            donate_money += res.donate_money;
        }
    })
    FamilyAddPointsAtPayDay(check)
    User.playedTime = new Map();
    if (players.length > 0) {
        system.debug.info(`Зарплата: $${system.numberFormat(base_money)}`);
        system.debug.info(`Бонусные средства: $${system.numberFormat(bonus_money)}`);
        system.debug.info(`Донат валюта: ${system.numberFormat(donate_money)}`);
        system.debug.info(`Опыт: ${system.numberFormat(exp)}`);
    }
    system.debug.info('----------------')
}


export function userPayDay(user: User){
    let bonus_money = 0;
    let base_money = 0;
    let donate_money = 0;
    let bonus_money_text: string[] = []
    let base_money_text: string[] = []
    let cef_money_text: [string, number][] = []
    let exp = 1;
    if(getX2Param('exp')) exp += 1;
    if(getX2Param('exp3')) exp += 2;
    const cfgAdmin = ADMIN_DATA.find(q => q.level === user.admin_level)
    if (cfgAdmin) {
        bonus_money += cfgAdmin.money;
        bonus_money_text.push(`Администрирование: $${system.numberFormat(cfgAdmin.money)}`)
        cef_money_text.push(['Администрирование', cfgAdmin.money])
        if (cfgAdmin.donate_money) donate_money += cfgAdmin.donate_money
    }
    if (user.helper) bonus_money += HELPER_PAYDAY_MONEY[user.helper_level - 1], bonus_money_text.push(`Хелпер: $${system.numberFormat(HELPER_PAYDAY_MONEY[user.helper_level - 1])}`), cef_money_text.push(['Хелпер', HELPER_PAYDAY_MONEY[user.helper_level - 1]]);
    const cfgVip = user.vipData;
    if (cfgVip) {
        if (cfgVip.payday_money) bonus_money += cfgVip.payday_money, bonus_money_text.push(`VIP: $${system.numberFormat(cfgVip.payday_money)}`), cef_money_text.push(['VIP', cfgVip.payday_money]);
        if (cfgVip.payday_exp) exp += cfgVip.payday_exp;
    }

    if(!cfgAdmin){
        const cfgFraction = user.fractionData
        if (cfgFraction) {
            if (cfgFraction.moneybase) {
                base_money += cfgFraction.moneybase;
                base_money_text.push(`Базовые выплаты ${cfgFraction.name}: $${system.numberFormat(cfgFraction.moneybase)}`);
                cef_money_text.push([`Базовые выплаты ${cfgFraction.name}`, cfgFraction.moneybase])
            }
            if (user.rank && fractionCfg.getRankSalary(user.fraction, user.rank)) {
                base_money += fractionCfg.getRankSalary(user.fraction, user.rank);
                base_money_text.push(`Выплата за должность ${fractionCfg.getRankName(user.fraction, user.rank)}: $${system.numberFormat(fractionCfg.getRankSalary(user.fraction, user.rank))}`);
                cef_money_text.push([`Выплата за должность ${fractionCfg.getRankName(user.fraction, user.rank)}`, fractionCfg.getRankSalary(user.fraction, user.rank)])
            }
        }
    }

    if(!!user.family) {
        user.familyScores += 1
        user.family.addPoints(1)
        user.family.addContractValueIfExists(FamilyContractList.onliners, 1)
    }

    if(!base_money){
        user.achiev.achievTickByType("noWorkMoneySum", UNEMPLOYMENT_BENEFIT)
        base_money_text.push(`Пособие по безработице: $${system.numberFormat(UNEMPLOYMENT_BENEFIT)}`)
        cef_money_text.push([`Пособие по безработице`, UNEMPLOYMENT_BENEFIT])
        base_money += UNEMPLOYMENT_BENEFIT;
    }

    const tm = user.getDaylyOnline
    if(tm){
        const tms = (base_money * PAYDAY_MONEY_PER_HOUR_MULTIPLE[tm]) - base_money
        if(tms > 0){
            base_money_text.push(`Бонус за активность: $${system.numberFormat(tms)}`)
            cef_money_text.push([`Бонус за активность`, tms])
            base_money += tms;
        }
    }


    if (base_money > 0 || bonus_money > 0) {
        const sender = `${base_money ? 'Зарплата' : ''}${base_money && bonus_money ? ' и ' : ''}${bonus_money ? (base_money ? 'Прочее' : 'Прочие доходы') : ''}`;
        const text = `${base_money ? 'Зарплата<br/>' : ''}${base_money_text.join('<br/>') + "\n"}${bonus_money ? '<br/>Доходы<br/>' : ''}${bonus_money_text.join('<br/>')}`;
        if (user.bank_number) {
            user.addBankMoney(base_money + bonus_money, false, text, sender);
        } else {
            // user.notifyWithPicture(sender, "PayDay", `${base_money ? 'Зарплата<br/>' : ''}${base_money_text.join('')}${bonus_money ? '<br/>Доходы<br/>' : ''}${bonus_money_text.join('')}`, 'diamond', 10000)
            user.addMoney(base_money + bonus_money, false, 'PayDay')
        }
    }

    if (donate_money > 0) user.addDonateMoney(donate_money, `PayDay`);
    if (exp > 0) user.giveExp(exp);

    CustomEvent.triggerCef(user.player, 'hud:payday', user.level, user.exp, {
        money: base_money + bonus_money,
        exp,
        info: cef_money_text.map(q => {
            return {
                money: q[1],
                text: q[0],
            }
        })
    })

    return {bonus_money, base_money, exp, donate_money}
}
