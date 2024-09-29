import {GRAB_POS_LIST} from "../../shared/grab.zone";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {menu} from "./menu";
import {getBaseItemNameById, inventoryShared} from "../../shared/inventory";
import {ScaleformTextMp} from "./scaleform.mp";
import {Dispatch} from "./dispatch";
import {Family} from "./families/family";
import {FamilyReputationType} from "../../shared/family";
import {User} from "./user";
import { getX2Param } from "./usermodule/static";

let exploded = new Map<number, boolean>();
let currentMoney = new Map<number, number>();
let currentItem = new Map<number, number[]>();
GRAB_POS_LIST.map((item, id) => {
    setTimeout(() => {
        restore(id);
    }, 100)
    item.points.map((point, pointindex) => {
        colshapes.new(new mp.Vector3(point.x, point.y, point.z), () => {
            return "Ячейка " + (pointindex + 1)
        }, (player) => {
            if (typeof player.grab_item === "number") return player.notify("Вы уже собираете деньги", "error")
            const user = player.user;
            const nwrk = notwork(id)
            if (nwrk) return player.notify(nwrk, "error");
            if (item.door && !exploded.has(id)) {
                player.notify("Дверь не вскрыта", "error")
                return;
            }
            if (currentGrab(id) >= item.points.length) return player.notify(`Одновременно грабить могут только ${item.points.length} человек`, "error");
            if (typeof item.fractions === "string") {
                if (item.fractions === "family") {
                    if (!user.family || user.family.level < item.familyLevel) 
                        return player.notify(`Вы не можете грабить`, "error");
                }
                else if (item.fractions !== "all") {
                    if (item.fractions === "mafia" && (!user.fractionData?.mafia)) return player.notify(`Грабить может только член мафии`, "error");
                    if (item.fractions === "gang" && (!user.fractionData?.gang)) return player.notify(`Грабить может только член банды`, "error");
                }
                else {
                    if (!user.fractionData?.mafia && !user.fractionData?.gang) return player.notify(`Вы не можете грабить`, "error");
                }
            } else {
                if (!item.fractions.includes(user.fraction)) return player.notify(`Вы не можете грабить`, "error");
            }
            const itm = user.haveItem(813)
            if (!itm) return player.notify('У вас нет отмычки', 'error');
            player.grab_item = id;
            CustomEvent.callClient(player, "grab:start", item.anim, point.x, point.y, point.z + 1, point.h, item.minigame).then((status: boolean) => {
                if (!mp.players.exists(player)) return;
                const user = player.user;
                player.grab_item = null;
                if (!status) return;
                const nwrk = notwork(id)
                if (nwrk) return player.notify(nwrk, "error");
                if (item.door && !exploded.has(id)) {
                    player.notify("Дверь не вскрыта", "error")
                    return;
                }
                const itm = user.haveItem(813)
                if (!itm) return player.notify('У вас нет отмычки', 'error');
                if (system.getRandomInt(1, 10) <= 2) itm.useCount(1, player), player.notify('Отмычка сломалась', 'error');
                if (item.findChance && system.getRandomInt(0, 100) <= item.findChance) return player.notify('Вы ничего не нашли', 'error');
                if (item.type === "money"){
                    if (item.type === "money" && currentMoney.get(id) <= 0) return player.notify("Все ячейки уже опустошены", "error");
                    let current = currentMoney.get(id);
                    let give = typeof item.money === "number" ? item.money : system.getRandomInt(item.money[0], item.money[1]);
                    if (current < item.money) give = current;
                    currentMoney.set(id, currentMoney.get(id) - give);
                    user.grab_money += give;
                    player.notify(`Вы загрузили в сумку $${system.numberFormat(give)}`, 'success');
                } else {
                    const t = system.randomArrayElementIndex(item.giveItem);
                    if (t == -1) return player.notify('Вы ничего не нашли, странно', 'error');
                    if (!currentItem.get(id)[t]) return player.notify('Пусто', 'error');
                    const itemid = item.giveItem[t];
                    user.giveGrabItem(itemid.item)
                    const d = currentItem.get(id);
                    d[t]--;
                    currentItem.set(id, d);
                }
            })
        })
        if (item.door) {

            /// Точка подрыва
            colshapes.new(new mp.Vector3(item.door.x, item.door.y, item.door.z), "Точка подрыва дверей", player => {
                if (exploded.has(id)) return player.notify("Дверь уже взорвана");
                const nwrk = notwork(id)
                if (nwrk) return player.notify(nwrk, "error");
                if (ScaleformTextMp.toArray().find(text => text.grab_item === id && system.distanceToPos(item.door, text.position) < 3)) return player.notify("Дверь уже вскрывается", "error")
                const user = player.user;
                const bomb = user.c4item;
                if (!bomb) return player.notify(`Чтобы взорвать дверь необходимо иметь ${getBaseItemNameById(854)}`, 'error');
                if (typeof item.fractions === "string") {
                    if (item.fractions === "family") {
                        if (!user.family || user.family.level < item.familyLevel)
                            return player.notify(`Вы не можете грабить`, "error");
                    }
                    else if (item.fractions !== "all") {
                        if (item.fractions === "mafia" && (!user.fractionData?.mafia)) return player.notify(`Грабить может только член мафии`, "error");
                        if (item.fractions === "gang" && (!user.fractionData?.gang)) return player.notify(`Грабить может только член банды`, "error");
                    }
                } else {
                    if (!item.fractions.includes(user.fraction)) return player.notify(`Вы не можете грабить`, "error");
                }
                CustomEvent.callClient(player, 'grab:explode', item.door.x, item.door.y, item.door.z, item.door.h + 180).then((res: boolean) => {
                    if (!res) return;
                    if (!mp.players.exists(player)) return;
                    if (exploded.has(id)) return player.notify("Дверь уже взорвана");
                    if (ScaleformTextMp.toArray().find(text => text.grab_item === id && system.distanceToPos(item.door, text.position) < 3)) return player.notify("Дверь уже вскрывается", "error")
                    const bomb = user.c4item;
                    if (!bomb) return player.notify(`Чтобы взорвать дверь необходимо иметь ${getBaseItemNameById(854)}`, 'error');
                    bomb.useCount(1, player)
                    let timer = item.door.timer;
                    let text = new ScaleformTextMp(new mp.Vector3(item.door.x, item.door.y, item.door.z + 1), `Таймер взрывчатки - ${timer}`)
                    if(item.door.alert && item.door.alertBefore){
                        item.door.alert.map(faction => {
                            Dispatch.new(faction, `Сообщение об попытке подрыва бомбы ${item.name}`, {x: item.door.x, y: item.door.y})
                        })
                    }
                    text.grab_item = id;
                    let object = mp.objects.new(inventoryShared.get(854).prop, new mp.Vector3(item.door.x, item.door.y, item.door.z), {
                        rotation: new mp.Vector3(-90, 0, 0)
                    });
                    let int = setInterval(() => {
                        timer--;
                        if (timer === 0) {
                            if (ScaleformTextMp.exists(text)) text.destroy();
                            if (mp.objects.exists(object)) object.destroy();
                            exploded.set(id, true);
                            CustomEvent.triggerClients('grab:door:add', id);
                            if(item.door.alert && !item.door.alertBefore){
                                item.door.alert.map(faction => {
                                    Dispatch.new(faction, `Сообщение о подрыве двери ${item.name}`, {x: item.door.x, y: item.door.y})
                                })
                            }
                            clearInterval(int);
                        }
                    }, 1000)
                })
            }, {
                radius: item.door.r,
                color: [0, 0, 0, 0]
            })
            /// Выход если дверь закрыта
            colshapes.new(new mp.Vector3(item.door.exit_x, item.door.exit_y, item.door.exit_z), "", player => {
                if (exploded.has(id)) return;
                if (player.user.isAdminNow()) return player.notify("Дверь не вскрыта, однако админ не будет телепортирован обратно", "error");
                player.user.teleport(item.door.x, item.door.y, item.door.z, item.door.h);
                player.notify("Дверь не вскрыта", "error");
            }, {
                onenter: true,
                radius: item.door.exit_r,
                color: [0, 0, 0, 0]
            })
        }
    })
})

const currentGrab = (id: number) => {
    return mp.players.toArray().filter(q => q.user && q.grab_item === id && mp.players.exists(q)).length;
}

const restore = (id: number) => {
    const cfg = GRAB_POS_LIST[id];
    if(cfg.type === "money"){
        let money = typeof cfg.money_max !== "number" ? system.getRandomInt((cfg.money_max as number[])[0], (cfg.money_max as number[])[1]) : cfg.money_max as number;
        currentMoney.set(id, money);
    } else {
        currentItem.set(id, cfg.giveItem.map(q => q.amount))
    }
    
    if (exploded.has(id)) {
        CustomEvent.triggerClients('grab:door:remove', id);
    }
    exploded.delete(id);
    adminGrabEnable.delete(id);
    system.debug.info(`Точка ограбления ${GRAB_POS_LIST[id].name} была восстановлена до изначальных параметров`);
}

export let adminGrabEnable = new Map<number, boolean>();

export const runAdminGrab = (id: number) => {
    restore(id);
    if(adminGrabEnable.has(id)) adminGrabEnable.delete(id);
    else {
        adminGrabEnable.set(id, true);
        const item = GRAB_POS_LIST[id];
        mp.players.toArray().filter(player => {
            const user = player.user;
            if (!user) return false;
            
            if (typeof item.fractions === "string") {

                if (item.fractions === "family") {
                    if (!user.family || user.family.level < item.familyLevel)
                        return false
                }
                
                if (item.fractions !== "all") {
                    if (item.fractions === "mafia" && (!user.fractionData?.mafia)) return false
                    if (item.fractions === "gang" && (!user.fractionData || !user.fractionData.gang)) return false
                }
            } else {
                if (!item.fractions.includes(user.fraction)) return false
            }
            return true
        }).map(player => {
            player.notify(`Зона ${item.name} доступна для ограбления`, "success", null, 10000);
        })
    }
}


CustomEvent.register('newHour', (hour: number) => {
    GRAB_POS_LIST.map((item, id) => {
        if (typeof item.restoreWorldTime === "object" && item.restoreWorldTime.includes(hour)) {
            restore(id);
        }
        if(item.worldTime.find(q => q[0] == hour)){
            mp.players.toArray().filter(player => {
                const user = player.user;
                if (!user) return false; 
                
                if (typeof item.fractions === "string") {
                    
                    if (item.fractions === "family") {
                        if (!user.family || user.family.level < item.familyLevel)
                            return false;
                    }
                    
                    if (item.fractions !== "all") {
                        if (item.fractions === "mafia" && (!user.fractionData?.mafia)) return false
                        if (item.fractions === "gang" && (!user.fractionData?.gang)) return false
                    }
                    else {
                        if (!user.fractionData?.mafia && !user.fractionData?.gang) return false
                    }
                } else {
                    if (!item.fractions.includes(user.fraction)) return false
                }
                return true
            }).map(player => {
                player.notify(`Зона ${item.name} доступна для ограбления`, "success", null, 10000)
            })
        }
    })
})

mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    exploded.forEach((item, id) => {
        if (item) CustomEvent.triggerClient(player, 'grab:door:add', id, true)
    })
})

const notwork = (id: number) => {
    const cfg = GRAB_POS_LIST[id];
    if (!cfg) return;
    if(cfg.adminRun){
        if(!adminGrabEnable.has(id)) return 'Администратор не запустил данное ограбление'
        else return null;
    }
    // if (cfg.gameTime) {
    //     if (weather.hour < cfg.gameTime[0] || weather.hour > cfg.gameTime[1]) return `Система работает с ${cfg.gameTime[0]} часов до ${cfg.gameTime[1]} игрового времени включительно`;
    // }
    if (cfg.worldTime) {
        const tm = new Date();
        if(!getX2Param("testserver")){
            let access = false;
            cfg.worldTime.map(q => {
                if(!access && tm.getHours() >= q[0] && tm.getHours() <= q[1]) access = true;
            })
            if(!access) return 'Сейчас система не работает'
        }
    }
    if (cfg.days) {
        const tm = new Date();
        if (!cfg.days.includes(tm.getDate())) return `Система работает в следующие дни: ${cfg.days.join(', ')}`;
    }
    return null;
}

CustomEvent.registerClient('admin:gamedata:restoregrab', player => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:gamedata:restoregrab')) return player.notify("У вас нет доступа", 'error');

    const m = menu.new(player, "Точки ограбления", "Список");

    GRAB_POS_LIST.map((item, id) => {
        m.newItem({
            name: item.name,
            more: `${system.numberFormat(currentMoney.get(id))}`,
            desc: `Дверь: ${item.door ? (exploded.has(id) ? 'Вскрыта' : 'Не вскрыта') : 'Её тут нет'}`,
            onpress: () => {
                menu.accept(player, "Вы точно хотите провести процедуру полного восстановления?").then(status => {
                    if (!status) return;
                    restore(id);
                    player.notify("Продедура восстановления выполнена", "success");
                })
            }
        })
    })

    m.open();
})