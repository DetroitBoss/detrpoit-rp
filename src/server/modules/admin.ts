import {CustomEvent} from "./custom.event";
import {reloadConfig, Vehicle, vehicleConfigs} from "./vehicles";
import {menu, MenuClass} from "./menu";
import {system} from "./system";
import {fuelTypeNames} from "../../shared/vehicles";
import {VehicleConfigsEntity} from "./typeorm/entities/vehicle.configs";
import {gui} from "./gui";
import {account, User} from "./user";
import {inventoryShared, OWNER_TYPES, WeaponAddonsItemBase} from "../../shared/inventory";
import {inventory} from "./inventory";
import {UserEntity} from "./typeorm/entities/user";
import {houses, openHouseEditAdminMenu} from "./houses";
import {DONATE_MONEY_NAMES, PLAYTIME_TIME} from "../../shared/economy";
import {JAIL_ADMIN_MAX_MIN} from "../../shared/jail";
import {getJobName, getLevelByExp} from "../../shared/jobs";
import {LicenceType, LicenseName, LicensesData} from "../../shared/licence";
import {document_templates} from "../../shared/documents";
import {VIP_TARIFS} from "../../shared/vip";
import {QUESTS_DATA} from "../../shared/quests";
import {AccountEntity} from "./typeorm/entities/account";
import {parking} from "./businesses/parking";
import {dialogSystem} from "./chat";
import {PromocodeList, PromocodeUseEntity} from "./typeorm/entities/promocodes";
import {MoreThan} from "typeorm";
import {saveEntity} from "./typeorm";
import {addAdminStats} from "./admin.stats";
import {CAR_FOR_PLAY_REWARD_MAX, MINUTES_FOR_PLAY_REWARD_MAX} from "../../shared/reward.time";
import {showFamilyAdminMenu, showFamilyEditAdminMenu} from "./families/admin_menu";
import {Family} from "./families/family";
import {BlackListEntity} from "./typeorm/entities/blacklist";
import {CargoBattleFamilyQuest} from "./families/quests/cargobattle";
import {HELPER_PAYDAY_MONEY} from "../../shared/admin.data";
import {clearExpiredPlayTime, payDayGlobal} from "./usermodule/payday";
import {SkinChange} from "../../shared/ChangeSkin";
import {SendUpdate} from "../../shared/GameVisualElement";
import {business} from "./business";
import {getX2Param, UserStatic} from "./usermodule/static";
import {getZoneAtPosition, setZoneControl} from './gangwar'
import {SpecialLog} from "./typeorm/entities/specialLog";
import {writePersonalMessage, writeSpecialLog} from "./specialLogs";
import { fractionCfg } from "./fractions/main";
import {prison} from "./prison";
import {IPrisonData} from "../../shared/prison/IPrisonData";
import {PURCHASEABLE_ANIMS} from "../../shared/anim";

gui.chat.registerCommand('changeSocialName', async (player: PlayerMp, oldSocialName: string, newSocialName: string) => {
    if (!player.user || !player.user.isAdminNow(5)) {
        return;
    }

    const account = await AccountEntity.findOne({
        social_name: oldSocialName
    });

    if (!account) {
        return player.notify('Аккаунт с таким Social`ом не найден');
    }

    account.social_name = newSocialName;
    await account.save();

    player.user.log('AdminJob', `Сменил social на аккаунте ${account.login} с ${oldSocialName} на ${newSocialName}`);
    player.notify(`Вы сменили social на аккаунте ${account.login} с ${oldSocialName} на ${newSocialName}`);
});

gui.chat.registerCommand('deleteitems', (player, targetIdStr, itemIdStr) => {
    if (!player.user || !player.user.isAdminNow(4)) {
        return;
    }

    const target = UserStatic.get(parseInt(targetIdStr));
    if (!target || !target.user) {
        return player.notify('Игрок не найден', 'error')
    }

    const itemId = parseInt(itemIdStr);
    const itemsToDelete = target.user.getItemsByIds([itemId]);

    const itemCount = itemsToDelete.length;
    const itemAmount = itemsToDelete
        .map(item => item.count)
        .reduce((count1, count2) => count1 + count2, 0)

    itemsToDelete.forEach(item => {
        inventory.deleteItem(item, OWNER_TYPES.PLAYER, target.user.id);
    });

    player.outputChatBox(`У игрока ${targetIdStr}: ${itemIdStr} - itemAmount x${itemAmount}, itemCount x${itemCount}`);
    player.user.log('AdminJob', `Забрал все предметы #${itemId} (${itemCount}, ${itemAmount})`, target);
});

gui.chat.registerCommand('toggleevlog', (player) => {
    player.call('toggleEventsLogging');
});

gui.chat.registerCommand('atest', player => testMenu(player));

gui.chat.registerCommand('addcloth', player => CustomEvent.triggerClient(player, "admin:cloth:new"));
gui.chat.registerCommand('mtp', player => CustomEvent.triggerClient(player, 'tpWaypoint'));

gui.chat.registerCommand('ajail', (player, userIdStr, minutesStr, ...reasonArgs) => {
    if (!player.user.isAdminNow()) return;

    const userId = parseInt(userIdStr);
    const minutes = parseInt(minutesStr);
    const reason = reasonArgs.join(' ');

    if (!userId || !minutes || !reason) return player.notify("Ошибка в аргументах", "error");
    if (minutes > 500) return player.notify("Нельзя посадить больше чем на 500 минут", "error");

    prison.jailAdmin(player, userId, minutes, reason);
});



gui.chat.registerCommand('a', (player, ...args) => {
    if (!player.user) {
        return;
    }

    if (!player.user.admin_level || player.user.admin_level < 1) {
        return;
    }

    const message = args.join(' ');

    mp.players.toArray()
        .filter(p => p.user && p.user.admin_level && p.user.admin_level >= 1)
        .forEach(p => p.outputChatBox(`!{338A36}[A] ${player.user.name} (${player.user.id}): ${message}`));
})

gui.chat.registerCommand('gangzones', (player) => {
    if (!player.user) {
        return;
    }

    if (!player.user.admin_level || player.user.admin_level < 1) {
        return;
    }

    CustomEvent.triggerClient(player, 'admin:gangzones:show');
})

gui.chat.registerCommand('testdebug', (player) => {
    if (!player.user) return;
    player.callUnreliable('testDebug');
    player.call('testDebug')
})

CustomEvent.registerClient('admin:setName', (player, name: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    user.entity.admin_name = name;
    player.setVariable('adminName', name);
})

const testMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (getX2Param('testserver')) return;
    const m = menu.new(player, 'Панель тестировщика');

    m.newItem({
        name: 'ТП на метку',
        onpress: () => {
            CustomEvent.triggerClient(player, 'tpWaypoint');
        }
    })

    m.newItem({
        name: 'Фракция',
        more: user.fraction ? `${fractionCfg.getFractionName(user.fraction)} (${user.fraction})` : "Не во фракции",
        onpress: () => {
            menu.selectFraction(player, 'all', user.fraction).then(async fraction => {
                if (!fraction) return testMenu(player);
                user.fraction = fraction;
                player.notify("Фракция указана", "error");
                testMenu(player)
            })
        }
    })

    if (user.fraction) {
        m.newItem({
            name: 'Ранг',
            more: user.rank ? `${fractionCfg.getRankName(user.fraction, user.rank)} (${user.rank})` : "Нет ранга",
            onpress: () => {
                menu.selector(player, "Выберите ранг", fractionCfg.getFractionRanks(user.fraction), true).then(async val => {
                    if (typeof val !== "number") return testMenu(player);
                    if (!user.fraction) return player.notify("Игрок не во фракции", "error"), testMenu(player);
                    user.rank = val + 1;
                    player.notify("Ранг назначен", "success");
                    testMenu(player)
                })
            }
        })
        m.newItem({
            name: '~r~Снять фракцию',
            onpress: () => {
                menu.accept(player).then(async status => {
                    if (!status) return testMenu(player);
                    user.fraction = 0;
                    user.rank = 0;
                    player.notify("Фракция указана", "error");
                })
            }
        })
    }

    m.newItem({
        name: 'Валюта',
        more: `$${system.numberFormat(user.money)}`,
        onpress: () => {
            menu.input(player, 'Сколько валюты выдать?', 100, 7, 'int').then(val => {
                if (!val || val < 0 || val > 9999999) return;
                user.addMoney(val, true, 'Выдача валюты через панель тестера')
            })
        }
    })

    if (user.bank_have) {
        m.newItem({
            name: 'Банковский баланс',
            more: `$${system.numberFormat(user.bank_money)}`,
            onpress: () => {
                menu.input(player, 'Сколько валюты выдать?', 100, 7, 'int').then(val => {
                    if (!val || val < 0 || val > 9999999) return;
                    user.addBankMoney(val, true, 'Выдача валюты через панель тестера', 'Система');
                })
            }
        })
    }

    m.newItem({
        name: 'Коины',
        more: `$${system.numberFormat(user.donate_money)}`,
        onpress: () => {
            menu.input(player, 'Сколько донат валюты выдать?', 100, 7, 'int').then(val => {
                if (!val || val < 0 || val > 9999999) return;
                user.addDonateMoney(val, 'Выдача донат валюты через панель тестера')
            })
        }
    })

    m.newItem({
        name: 'Спавн ТС',
        onpress: () => {
            menu.input(player, 'Модель ТС', '', 7).then(model => {
                if (!model) return;
                CustomEvent.callClient(player, 'verifyVehModel', model).then(q => {
                    if (!q) return player.notify('Модель указана не верно', 'error')
                    let veh = Vehicle.spawn(model, player.position, player.heading, player.dimension, true, false);
                    user.putIntoVehicle(veh);
                })
            })
        }
    })

    m.open()
}

gui.chat.registerCommand("adminPanel", async (player, task: string, ids: string, timeT: 'm' | 'h' | 'd', timeN: string, ...reasonT: string[]) => {
    const user = player.user;
    if (!user) return;
    if (!player.user.isAdminNow()) return;

    const id = parseInt(ids);
    let time = parseInt(timeN);
    if (time) {
        if (timeT === 'm') time = time * 60;
        if (timeT === 'h') time = time * 60 * 60;
        if (timeT === 'd') time = time * 60 * 60 * 24;
    }
    let reason = reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : '';

    const data = await User.getData(id);

    if (!data) return player.notify('Пользователь с указанным ID не обнаружен', 'error');

    if (!mp.players.exists(player)) return;

    if (data.admin_level > user.admin_level && user.admin_level < 6 && getX2Param('testserver')) return player.notify('Вы не можете взаимодействовать с администратором более высокого уровня чем вы', 'error')

    if (task === 'ban') {
        if (!user.hasPermission('admin:useredit:banuser')) return player.notify("У вас нет доступа", 'error');
        User.banUser(id, player, reason, system.timestamp + time);
    } else if (task === 'aban') {
        if (!user.hasPermission('admin:useredit:banaccount')) return player.notify("У вас нет доступа", 'error');
        User.banUserAccount(data.accountId, player, reason, system.timestamp + time);
    } else if (task === 'jail') {
        if (!user.hasPermission('admin:useredit:jail')) return player.notify("У вас нет доступа", 'error');
        const target = User.get(id);
        if (mp.players.exists(target)) {
            player.notify(`Наказание ${target.user.jail_time_admin ? "Перевыдано" : "Выдано"}`, 'success')
            target.user.jailAdmin(player, time, reason)
        } else {
            player.notify(`Наказание ${data.jail_time_admin ? "Перевыдано" : "Выдано"}. Игрок его отбудет при следующем заходе на сервер`, 'success')
            data.jail_time_admin = time;
            data.jail_reason_admin = reason + ` / ${user.name} (${user.id})`;
            saveEntity(data);
        }
        user.log('AdminJob', `Выдал деморган на ${timeN}${timeT}., причина - ${reason}`, data.id);
        addAdminStats(user.id, 'jail')
    } else if (task === 'cmute') {
        if (!user.hasPermission('admin:useredit:cmute')) return player.notify("У вас нет доступа", 'error');
        const target = User.get(id);
        cmute.set(id, system.timestamp + time);
        user.log('AdminBan', `Выдал текстовый мут на персонажа ${id} до ${system.timeStampString(cmute.get(id))}`, id);
        addAdminStats(user.id, 'cmute')
        syncMutePlayer(id)
        const mutePlayer = User.get(id);
        if (mutePlayer) mutePlayer.outputChatBox(`Вы получили блокировку текстового чата до ${system.timeStampString(cmute.get(id))}. Причина: ${reason}`)
    } else if (task === 'vmute') {
        if (!user.hasPermission('admin:useredit:bmute')) return player.notify("У вас нет доступа", 'error');
        const target = User.get(id);
        vmute.set(id, system.timestamp + time);
        user.log('AdminBan', `Выдал голосовой мут на персонажа ${id} до ${system.timeStampString(vmute.get(id))}`, id);
        addAdminStats(user.id, 'vmute')
        syncMutePlayer(id)
        const mutePlayer = User.get(id);
        if (mutePlayer) mutePlayer.outputChatBox(`Вы получили блокировку голосового чата до ${system.timeStampString(vmute.get(id))}. Причина: ${reason}`)
    } else if (task === 'kill') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        target.user.health = 0;
    } else if (task === 'fullhp') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        target.user.health = 100;
    } else if (task === 'cuff') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        target.user.cuffed = !target.user.cuffed
        return player.notify(`Игрок ${target.user.cuffed ? 'закован в наручники' : 'освобождён от наручников'}`, 'success')
    } else if (task === 'tp') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        const {x, y, z} = target.position;
        user.teleportVeh(x, y, z, 0, target.dimension)
    } else if (task === 'tpm') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        const {x, y, z} = player.position;
        target.user.teleportVeh(x, y, z, 0, player.dimension)
    } else if (task === 'kick') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        User.kickUser(target, reason, player);
    } else if (task === 'freeze') {
        const target = User.get(id);
        if (!target) return player.notify('Пользователь offline', 'error')
        const current = target.getVariable('admin:freeze')
        target.setVariable('admin:freeze', !current)
        return player.notify(`Игрок ${current ? 'разморожен' : 'заморожен'}`, 'success')
    } else if (task === 'sp') {
        return startSpectate(player, id);
    } else if (task === 'choice') {
        return userChoise(player, id)
    } else if (task === 'stats') {
        let res: [string, any][] = [];
        const target = User.get(id);
        const prison: IPrisonData = data.prison ? JSON.parse(data.prison) : null;

        res.push(['Имя', data.rp_name]);
        res.push(['Уровень', data.level]);
        res.push(['Фракция', `${data.fraction ? `${fractionCfg.getFractionName(data.fraction)} (${data.rank} ранг)` : 'НЕТ'}`]);
        res.push(['Семья', `${data.family ? `${Family.getByID(data.family)?.name} (ID: ${data.family})` : 'НЕТ'}`]);
        res.push(['Наличные', `$${system.numberFormat(data.money)}`]);
        res.push(['Банк', `$${system.numberFormat(data.bank_money)}`]);
        res.push(['Фишки', `${system.numberFormat(data.chips)}`]);
        res.push(['Тюрьма', `${prison ? `${Math.floor(prison.time / 60)} мин.${prison.byAdmin ? ' [A]' : ''}` : 'НЕТ'}`]);
        res.push(['Бан', `${data.ban_end && data.ban_end > system.timestamp ? `До ${system.timeStampString(data.ban_end)}` : 'НЕТ'}`]);
        res.push(['Варны', `${data.warns.length}`]);
        res.push(['CMute', `${cmute.get(id) ? system.timeStampString(cmute.get(id)) : 'НЕТ'}`]);
        res.push(['VMute', `${vmute.get(id) ? system.timeStampString(vmute.get(id)) : 'НЕТ'}`]);
        if (target) {
            res.push(['ХП', `${target.user.health.toFixed(0)}`]);
            res.push(['AP', `${target.armour.toFixed(0)}`]);
            res.push(['Пинг', `${target.ping}`]);
            res.push(['Потери', `${target.packetLoss}`]);
        }

        return CustomEvent.triggerCef(player, 'admin:panel:stats:data', id, res)
    }
    player.notify('Действие успешно выполнено', 'success')
})

gui.chat.registerCommand('skick', (player, ids, ...reasonT) => {
    if (!player.user) return;
    if (!player.user.isAdminNow(6)) return;

    const id = parseInt(ids),
        target = User.get(id);

    if (!target) return player.notify('Пользователь offline', 'error')
    let reason = reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : '';
    target.kick(`Вы были кикнуты по причине ${reason}`);
    player.notify('Игрок успешно кикнут', 'success');
    writeSpecialLog(`skick - [${id}]: ${reason}`, player);
});

gui.chat.registerCommand('sban', (player, id, end, ...reasonT) => {
    if (!player.user || !player.user.isAdminNow(6)) return;
    if (!end) return;

    User.getData(parseInt(id)).then(usr => {
        if (!usr) return;
        if (!mp.players.exists(player)) return;
        if (!player.user) return;
        usr.ban_end = parseInt(end);
        usr.ban_reason = reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : ''
        usr.fraction = 0;
        usr.rank = 0;
        usr.ban_admin = player.dbid;
        usr.save().then(() => {
            const target = User.get(parseInt(id));
            if (target && mp.players.exists(target))
                target.kick(`Бан до ${system.timeStampString(parseInt(end))} по причине ${reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : ''}`)
            player.notify('Игрок успешно заблокирован', 'success');
            writeSpecialLog(`sban - [${id}]: ${system.timeStampString(parseInt(end))} по причине ${reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : ''}`, player);
        })
    })
})

gui.chat.registerCommand('sunban', (player, id) => {
    if (!player.user || !player.user.isAdminNow(6)) return;
    if (!player.user || !id) return;

    User.getData(parseInt(id)).then(usr => {
        if (!usr) return;
        if (!mp.players.exists(player)) return;
        if (!player.user) return;
        usr.ban_end = 0;

        player.notify('Игрок успешно разблокирован', 'success');
        writeSpecialLog(`sunban - [${id}]`, player);
        usr.save();
    })
})

gui.chat.registerCommand('shban', async (admin, id, end, ...reasonT) => {
    if (!admin.user || !admin.user.isAdminNow(6)) return;
    if (!reasonT) return admin.notify('Причина не указана', 'error');

    let target = User.get(parseInt(id));
    const data = target && target.user ? target.user.entity : await User.getData(parseInt(id)),
    dataAccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)

    if (!mp.players.exists(admin)) return;
    if (!admin.user) return;
    dataAccount.ban_end = parseInt(end);
    dataAccount.ban_reason = reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : '';
    dataAccount.ban_admin = admin.dbid;

    dataAccount.save().then(() => {
        if (target && mp.players.exists(target)) target.kick('');
    })

    admin.notify('Игрок успешно заблокирован', 'success');
    writeSpecialLog(`shban - [${id}]: ${system.timeStampString(parseInt(end))} по причине ${reasonT && reasonT.length > 0 ? reasonT.map(q => system.filterInput(q)).join(' ') : ''}`, admin);
})

gui.chat.registerCommand('shunban', async (player, id) => {
    if (!player.user || !player.user.isAdminNow(6)) return;
    const data = await User.getData(parseInt(id)),
        dataAccount = await User.getDataAccount(data.accountId);

    if (!data || !dataAccount) return;

    dataAccount.ban_end = 0;
    dataAccount.save();
    player.notify('Игрок успешно разблокирован', 'success');
    writeSpecialLog(`shunban - [${id}]`, player);
})

gui.chat.registerCommand("setTime", (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let d = parseInt(str);
    CustomEvent.triggerClient(player, 'forceSetTime', d)
})

gui.chat.registerCommand("cname", (player, strId, ...newName) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:setusername')) return;
    let id = parseInt(strId);
    const targetUser = User.get(id);
    if (!targetUser?.user) return player.notify("Игрок не найден");
    const fullName = newName.join(' ');
    if (!newName || !fullName) return player.notify("Никнейм введен неверно");
    targetUser.user.name = fullName;
})

gui.chat.registerCommand("czone", (player, fractionIdStr) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:changeCaptZone')) return;

    const zoneId = getZoneAtPosition(player.position);
    if (!zoneId) return player.notify('Вы должны стоять на территории капта', 'error');

    let fractionId = parseInt(fractionIdStr);
    if (!fractionId) return player.notify('ID фракции указан неверно', 'error');

    setZoneControl(zoneId, fractionId);
})

gui.chat.registerCommand("resetpassword", async (player, login) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:resetpassword')) return;
    const acc = await AccountEntity.findOne({where: {login}})
    if (!acc) return player.notify('Аккаунт не найден', 'error');
    acc.password = account.hashPassword('12345678');
    player.notify(`Был установлен тестовый пароль 12345678 на аккаунт ${login}`);
    await acc.save();
})

gui.chat.registerCommand("d", (player, strId, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let d = parseInt(str);
    let id = parseInt(strId);
    const target = User.get(id);
    if (!target) return player.notify("Игрок не найден");
    if (isNaN(d) && isNaN(id)) return player.notify("Текущее измерение: " + player.dimension, "success");
    if (isNaN(d) || d < 0 || d > 9999999999999) return player.notify("Текущее измерение: " + player.dimension, "success")
    target.dimension = d;
})

gui.chat.registerCommand("warn", async (player, strId, reason) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission("admin:useredit:givewarn")) return;
    const id = parseInt(strId);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    if (!reason) return;
    const target = User.get(id);
    const data = target && target.user ? target.user.entity : await User.getData(id);
    if (!data) return;

    let warns = [...data.warns];
    warns.push({reason, admin: player.dbid, time: system.timestamp + (10 * 24 * 60 * 60)});
    data.warns = warns;
    if (mp.players.exists(player)) player.notify('Предупреждение выдано', 'error');
    if (target && mp.players.exists(target)) {
        target.notify('Администратор выдал вам предупреждение', 'error');
        if (target.user.fraction && !target.user.isLeader) {
            target.notify('Вы были исключены из фракции', 'error');
            target.user.fraction = 0;
        }
    } else {
        data.fraction = 0;
        data.rank = 0
        await data.save()
    }
    addAdminStats(user.id, 'warn')
    user.log('AdminJob', `Выдал варн, причина - ${reason}`, data.id);
    if (data.warns.length && data.warns.length % 3 === 0) {
        User.banUser(data.id, player, `Получено 3 варна`, system.timestamp + (10 * 24 * 60 * 60))
    }
})

gui.chat.registerCommand("ban", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:banuser')) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    banUser(player, id);
})

gui.chat.registerCommand("kick", (player, strId, strReason) => {
    const user = player.user;
    if (!user) return;
    if (!strReason) return;
    if (!user.hasPermission('admin:useredit:jail')) return;
    if (strReason.length < 5) return player.notify('Минимальная длинна причины - 5 символов', 'error');
    const id = parseInt(strId);

    if (isNaN(id) || id < 1 || id > 99999999) return;
    const target = User.get(id);

    if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error');
    User.kickUser(target, strReason, player)
})

gui.chat.registerCommand("aban", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:banaccount')) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    banAccount(player, id);
})

gui.chat.registerCommand("tpm", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    const target = User.get(id);
    if (!target) return player.notify('Игрок не обнаружен', 'error');
    target.user.teleportVeh(player.position.x, player.position.y, player.position.z, player.heading, player.dimension);
})

gui.chat.registerCommand("pm", (player, str, ...text) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    const target = User.get(id);
    if (!target) return player.notify('Игрок не обнаружен', 'error');
    writeSpecialLog(`pm: ${text.join(' ')}`, player, target.user.id);
    writePersonalMessage(`pm: ${text.join(' ')}`, player, target.user.id);
    target.outputChatBox(`!{#FFA500}${user.name} [#${user.id}]: ${text.join(' ')}`)
    player.outputChatBox(`!{#FFA500}${user.name} [#${user.id}]: ${text.join(' ')}`)
})

gui.chat.registerCommand("tpveh", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 0 || id > 99999999) return;
    const target = mp.vehicles.at(id);
    if (!target) return player.notify('ТС не обнаружен', 'error');
    Vehicle.teleport(target, player.position, player.heading, player.dimension);
})

gui.chat.registerCommand('admins', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.admin_level) return;
    player.outputChatBox(`Список администраторов в сети: ${mp.players.toArray().filter(q => q.user && q.user.admin_level).map(q => `${q.user.name} [#${q.user.id}] (${q.user.admin_level} LVL)`).join(', ')}`)
})

gui.chat.registerCommand('helpers', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.admin_level && !user.helper) return;
    player.outputChatBox(`Список хелперов в сети: ${mp.players.toArray().filter(q => q.user && q.user.helper).map(q => `${q.user.name} [#${q.user.id}] (${q.user.helper_level} LVL)`).join(', ')}`)
})

gui.chat.registerCommand("makeadmin", (player, str) => {
    if(getX2Param('testserver')) return;
    if(!player.user) return;
    let d = parseInt(str);
    if(isNaN(d) || d < 0 || d > 7) return player.notify("Уровень админки допустим от 0 до 7", "error");
    player.user.admin_level = d;
    player.notify("Новый уровень админки: "+d, "success");
})

let deathList: { id: number, name: string, pos: Vector3Mp, killerid?: number, killername?: string }[] = []

mp.events.add('playerDeath', (player, reason?: number, killer?: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (killer && killer.user) deathList.push({
        id: user.id,
        name: user.name,
        pos: player.position,
        killerid: killer.user.id,
        killername: killer.user.name
    })
    else deathList.push({id: user.id, name: user.name, pos: player.position})
})


CustomEvent.registerClient('admin:blacklist', (player) => {
    blmenu(player)
})

const blmenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:blacklist')) return;


    BlackListEntity.find().then(list => {
        const m = menu.new(player, 'Управление BlackList');

        m.newItem({
            name: 'Добавить',
            onpress: () => {
                menu.close(player)
                menu.input(player, 'Введите Social', '', 20).then(social => {
                    if (!social) return;
                    if (list.find(q => q.social_name.toLowerCase() === social.toLowerCase())) return player.notify('Данный сошиал уже внесён', 'error')
                    menu.input(player, 'Введите причину', '', 250).then(reason => {
                        if (!reason) return;
                        const item = new BlackListEntity();
                        item.time = system.timestamp
                        item.admin = `${user.name} (${user.id})`
                        item.social_name = social.toLowerCase();
                        item.reason = reason;
                        item.save().then((r) => {
                            if (mp.players.exists(player)) {
                                player.notify('Social успешно внесён')
                                blmenu(player)
                            }
                        })
                    })
                })
            }
        })

        list.map(item => {
            m.newItem({
                name: item.social_name,
                more: `${system.timeStampString(item.time)}`,
                desc: `${item.admin} - ${item.reason}`,
                onpress: () => {
                    menu.accept(player, 'Удалить запись?', 'small').then(status => {
                        if (!status) return;
                        BlackListEntity.remove(item).then(() => {
                            blmenu(player)
                        })
                    })
                }
            })
        })
        m.open();
    })
}

CustomEvent.registerCef('admin:spectate:next', (player, id: number, history: number[] = []) => {
    const target = User.get(id);
    if (!target) return player.notify('Игрок покинул сервер', 'error');
    const newtarget = system.sortArrayObjects(User.getNearestPlayers(target, 100).filter(q => !history.includes(q.id) && q.id != player.dbid).map(q => {
        return {
            id: q.id,
            dist: system.distanceToPos(q.position, target.position)
        }
    }), [
        {id: 'dist', type: 'ASC'}
    ])
    if (newtarget.length === 0) return player.notify('Других игроков поблизости нет', 'error');
    startSpectate(player, newtarget[0].id)
})

const startSpectate = (player: PlayerMp, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return player.call('admin:spectate:stop');
    if (id === user.id) return player.notify('Вы не можете следить за самим собой', 'error');
    const target = User.get(id);
    if (!target) return player.notify('Игрок покинул сервер', 'error');
    const tuser = target.user;
    if (!player.user.spectatePos) player.user.spectatePos = [player.position.x, player.position.y, player.position.z, player.dimension];
    player.dimension = target.dimension;
    player.alpha = 0;
    CustomEvent.triggerClient(player, 'admin:sp', [target.position.x, target.position.y, target.position.z], target.id, tuser.id)
}

CustomEvent.registerClient('admin:spectate:problem', (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const target = User.get(id);
    if (!target) {
        return player.call('admin:spectate:stop')
    }
    startSpectate(player, id);
})
CustomEvent.registerClientAndCef('admin:spectate:stop', (player, returnMe = true, tpHim = false, id?: number) => {
    const user = player.user;
    if (!user) return;
    player.alpha = 255;
    if (!user.spectatePos) return;
    if (returnMe) {
        user.teleport(user.spectatePos[0], user.spectatePos[1], user.spectatePos[2], 0, user.spectatePos[3], true);
        user.spectatePos = null;
    } else {
        const target = User.get(id);
        if (target) user.teleport(target.position.x, target.position.y, target.position.z, 0, target.dimension, true);
        else user.teleport(user.spectatePos[0], user.spectatePos[1], user.spectatePos[2], 0, user.spectatePos[3], true);
    }
    if (!tpHim) return;
    const target = User.get(id);
    if (!target) return;
    target.user.teleport(user.spectatePos[0], user.spectatePos[1], user.spectatePos[2], 0, user.spectatePos[3], true);
})


gui.chat.registerCommand('sp', (player, ids) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const id = parseInt(ids);
    const target = User.get(id);
    if (!target) return player.notify('Игрок не обнаружен', 'error');
    if (getX2Param('testserver') && target.user.admin_level === 6 && player.user.admin_level < 5) return player.notify('Вы не можете следить за данным игроком')
    startSpectate(player, id);
})


CustomEvent.registerClient('death:log', player => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow()) return;
    const m = menu.new(player, 'Список убийств рядом');
    deathList.filter(q => system.distanceToPos(q.pos, player.position) < 100).map(item => {
        m.newItem({
            name: `${item.name} [#${item.id}]`,
            more: `${item.killerid ? `${item.killername} [#${item.killerid}]` : ''}`,
            onpress: () => {
                user.setWaypoint(item.pos.x, item.pos.y, item.pos.z);
            }
        })
    })

    m.open();
})

CustomEvent.registerClient('admin:x2func', player => {
    x2funcmenu(player);
})


CustomEvent.registerClient('admin:familyControl', player => {
    if (player.user && player.user.hasPermission('admin:familyControl')) showFamilyAdminMenu(player)
})

CustomEvent.registerClient('admin:paydayglobal', player => {
    const user = player.user;
    if (!user.hasPermission('admin:paydayglobal')) return;
    payDayGlobal(false);
    player.notify('Глобальный PayDay выдан')

})

CustomEvent.registerClient('admin:allheal', player => {
    const user = player.user;
    if (!user.hasPermission('admin:allheal')) return;
    const users = user.getNearestPlayers(50);
    users.map(target => {
        if (mp.players.exists(target) && target.user) target.user.health = 100;
    })

})

CustomEvent.registerClient('admin:global:notify', (player, text: string, dimensionFilter = false) => {
    const user = player.user;
    if (!user.hasPermission('admin:global:notify')) return;
    mp.players.toArray().filter(q => !dimensionFilter || player.dimension === q.dimension).map(target => {
        if (mp.players.exists(target)) target.outputChatBox(`!{ff0000}[${gui.chat.getTime()}] Сообщение от администратора ${player.user.name}: ${escape(text)}`)
    })

})

CustomEvent.registerClient('admin:globalevent:notify', (player, text: string, dimensionFilter = false) => {
    const user = player.user;
    if (!user.hasPermission('admin:global:notify')) return;
    mp.players.toArray().filter(q => !dimensionFilter || player.dimension === q.dimension).map(target => {
        if (mp.players.exists(target)) target.outputChatBox(`!{fcba03}[${gui.chat.getTime()}] (${player.user.name}): Событие ${escape(text)}`)
    })

})

const x2funcmenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user.hasPermission('admin:x2func')) return;
    const m = menu.new(player, 'Функции X2');
    m.newItem({
        name: 'Донат x2',
        more: `${User.x2func.data[0].donate ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].donate = !User.x2func.data[0].donate;
            player.notify(`${User.x2func.data[0].donate ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: 'Опыт x2',
        more: `${User.x2func.data[0].exp ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].exp = !User.x2func.data[0].exp;
            player.notify(`${User.x2func.data[0].exp ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: 'Донат x3',
        more: `${User.x2func.data[0].donate3 ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].donate3 = !User.x2func.data[0].donate3;
            player.notify(`${User.x2func.data[0].donate3 ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: 'Опыт x3',
        more: `${User.x2func.data[0].exp3 ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].exp3 = !User.x2func.data[0].exp3;
            player.notify(`${User.x2func.data[0].exp3 ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: 'Работы',
        more: `${User.x2func.data[0].job ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].job = !User.x2func.data[0].job;
            player.notify(`${User.x2func.data[0].job ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Отыграй ${PLAYTIME_TIME} часов`,
        more: `${User.x2func.data[0].playtime ? 'Включёно' : 'Выключено'}`,
        desc: 'Нужное время и сумма награды настраиваются в конфиге экономики',
        onpress: () => {
            User.x2func.data[0].playtime = !User.x2func.data[0].playtime;
            player.notify(`${User.x2func.data[0].playtime ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    const cfgcar = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX);
    m.newItem({
        name: `Отыграй ${Math.floor(MINUTES_FOR_PLAY_REWARD_MAX / 60)} часов для ${cfgcar ? Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX).name : 'НЕИЗВЕСТНО'}`,
        more: `${User.x2func.data[0].playtimecar ? 'Включёно' : 'Выключено'}`,
        desc: 'Нужное время и сумма награды настраиваются в конфиге reward.time',
        onpress: () => {
            User.x2func.data[0].playtimecar = cfgcar ? !User.x2func.data[0].playtimecar : false;
            player.notify(`${User.x2func.data[0].playtimecar ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Включить приём донатов`,
        more: `${User.x2func.data[0].enabledonate ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].enabledonate = !User.x2func.data[0].enabledonate;
            player.notify(`${User.x2func.data[0].enabledonate ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Включить налоги`,
        more: `${User.x2func.data[0].taxes ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            User.x2func.data[0].taxes = !User.x2func.data[0].taxes;
            player.notify(`${User.x2func.data[0].taxes ? 'Включено' : 'Отключено'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Сайт с логами`,
        more: `${User.x2func.data[0].logoff ? 'Выключен' : 'Включён'}`,
        onpress: () => {
            User.x2func.data[0].logoff = !User.x2func.data[0].logoff;
            player.notify(`${User.x2func.data[0].logoff ? 'Выключен' : 'Включён'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Тестовый сервер`,
        more: `${User.x2func.data[0].testserver ? 'Выключен' : 'Включён'}`,
        onpress: () => {
            User.x2func.data[0].testserver = !User.x2func.data[0].testserver;
            player.notify(`${User.x2func.data[0].testserver ? 'Выключен' : 'Включён'}`);
            User.x2func.save();
            x2funcmenu(player)
        }
    })
    m.newItem({
        name: `Отладка`,
        more: `${system.debug.debugShow ? 'Включёно' : 'Выключено'}`,
        onpress: () => {
            system.debug.showDebug(!system.debug.debugShow);
            player.notify(`${system.debug.debugShow ? 'Включено' : 'Отключено'}`);
            x2funcmenu(player)
        }
    })
    m.open();
}

gui.chat.registerCommand("clearplaytime", (player) => {
    if (!player.user) return;
    if (!player.user.isAdminNow(6)) return player.notify("У вас нет доступа", "error");

    clearExpiredPlayTime();
})

gui.chat.registerCommand("veh", (player, model) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error");

    let veh = Vehicle.spawn(model, player.position, player.heading, player.dimension, true, false);
    player.user.log('AdminJob', `Заспавнил ТС X: ${player.position.x.toFixed(1)}, Y: ${player.position.y.toFixed(1)}, Z: ${player.position.z.toFixed(1)}, Model: ${model}`)
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        player.user.putIntoVehicle(veh, 0);
    }, 300);
})

gui.chat.registerCommand("tp", (player, str, str2, str3) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    if (str2 && str3) {
        const x = parseFloat(str);
        const y = parseFloat(str2);
        const z = parseFloat(str3);
        if (!x && !y && !z) return player.notify("Координаты указаны не верно", "error")
        player.user.teleport(x, y, z);
        return;
    }
    let d = parseInt(str);
    if (isNaN(d) || d < 0 || d > 9999999999999) return player.notify("ID игрока указан не верно", "error")
    let target = User.get(d);
    if (!target) return player.notify("Игрок не обнаружен", "error");
    if (getX2Param('testserver') && target.user.admin_level === 6 && player.user.admin_level < 6) return player.notify('Вы не можете телепортироваться к данному игроку')
    player.user.teleport(target.position.x, target.position.y, target.position.z, target.heading, target.dimension);
})

gui.chat.registerCommand("tpped", (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let d = parseInt(str);
    if (isNaN(d) || d < 0 || d > 9999999999999) return player.notify("ID peda указан не верно", "error")
    let target = mp.peds.at(d);
    if (!target) return player.notify("Ped не обнаружен", "error");
    player.user.teleport(target.position.x, target.position.y, target.position.z, 0, target.dimension);
})

gui.chat.registerCommand("night", (player) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    CustomEvent.triggerCefAll('notify:doomsdayNight')
})

gui.chat.registerCommand("fullhp", (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;

    let d = parseInt(str);
    if (isNaN(d) || d < 0 || d > 9999999999999) return player.notify("ID игрока указан не верно", "error")
    let target = User.get(d);
    if (!target) return player.notify("Игрок не обнаружен", "error");
    target.user.health = 100;
})
gui.chat.registerCommand("kill", (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;

    let d = parseInt(str);
    if (isNaN(d) || d < 0 || d > 9999999999999) return player.notify("ID игрока указан не верно", "error")
    let target = User.get(d);
    if (!target) return player.notify("Игрок не обнаружен", "error");
    target.user.health = 0;
})
gui.chat.registerCommand("tpveh", (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let d = parseInt(str);
    const veh = mp.vehicles.at(d);
    if (!mp.vehicles.exists(veh)) return player.notify("ТС не обнаружен", "error");
    Vehicle.teleport(veh, player.position, player.heading, player.dimension)
})

gui.chat.registerCommand("delveh", (player, str) => {
    if (getX2Param('testserver')) return;
    if (!player.user) return;
    if (!player.user.isAdminNow(6)) return;
    let d = parseInt(str);
    const veh = mp.vehicles.at(d);
    if (!mp.vehicles.exists(veh)) return player.notify("ТС не обнаружен", "error");
    Vehicle.destroy(veh)
})

CustomEvent.registerClient('enableAdmin', (player, status: boolean) => {
    if (!player.user) return;
    if (!player.user.admin_level) return;
    player.setVariable('enabledAdmin', !!status);
    SendUpdate(player, 'admin');
    if (status) CargoBattleFamilyQuest.all.forEach(q => q.addPlayer(player))
})
CustomEvent.registerClient('admin:spawn:vehicle', (player, model: string, spawnMethoodSelect: number, headerSelect: number) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error");
    let veh = Vehicle.spawn(model, player.position, !headerSelect ? player.heading : headerSelect, player.dimension, true, false);
    player.user.log('AdminJob', `Заспавнил ТС X: ${player.position.x.toFixed(1)}, Y: ${player.position.y.toFixed(1)}, Z: ${player.position.z.toFixed(1)}, Model: ${model}`)
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        if (spawnMethoodSelect) return;
        player.user.putIntoVehicle(veh, 0);
    }, 300);
})
CustomEvent.registerClient('admin:gamedata:newhouse', (player, model: string) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:gamedata:newhouse')) return player.notify("У вас нет доступа", "error");
    houses.createNewHouseMenu(player);
})
CustomEvent.registerClient('admin:inventory:create', (player, id: number) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error");
    let user = player.user;
    if (!user.hasPermission('admin:inventory:create')) return player.notify('У вас нет доступа', "error");
    let itmCfg = inventoryShared.get(id);
    if (!itmCfg) return player.notify('Предмет не существует', "error");
    inventory.createItem({
        owner_type: OWNER_TYPES.PLAYER,
        owner_id: user.id,
        item_id: id,
        serial: `ADMIN_${user.id}_${system.getTimeStamp()}`
    }).then((result) => {
        player.notify('Предмет успешно добавлен', "success")
    }).catch(err => {
        player.notify('Возникла ошибка: ' + err, "error")
    })
})
CustomEvent.registerClient('admin:reconnect', (player) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error")
    player.kickSilent("Реконнект");
});

CustomEvent.registerClient('admin:quit', (player) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error")
    player.kick("Выход");
})
CustomEvent.registerClient('admin:users:choice', (player, id: number) => {
    userChoise(player, id);
})

const jailUser = async (player: PlayerMp, id: number, min: number = null, reason: string = null, isCalledFromMenu = true) => {
    if (!player.user) return;
    if (!player.user.admin_level) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    let target = User.get(id);
    let data: UserEntity;
    let dataaccount: AccountEntity;
    try {
        data = target && target.user ? target.user.entity : await User.getData(id)
        dataaccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)
    } catch (error) {
        // console.error(error);
    }
    if (!mp.players.exists(player)) return;
    if (!data) return player.notify("Игрок с указанным ID не обнаружен", "error")
    if (mp.players.exists(target) && target.user.isAdminNow()) return player.notify("Игрок выполняет обязанности администратора", "error");
    if (data.jail_time_admin) player.notify("Игрок уже сидит в деморгане, наказание будет перевыдано", "success");

    if (!min) {
        const minutesInputResult = await menu.input(player, "Введите количество минут", 10, 4, "int");
        if (!minutesInputResult) {
            return;
        }

        min = minutesInputResult as number;
    }

    if (min <= 0) return player.notify("Время указано не верно");
    if (min > JAIL_ADMIN_MAX_MIN && !user.isAdminNow(5)) return player.notify(`Вы не можете указывать более чем ${JAIL_ADMIN_MAX_MIN} мин. Администраторы 5+ LVL не имеют данного ограничения`, "error");
    if (min > 9999999) return player.notify(`Да, админы 5+ ЛВЛ не имеют ограничения, но база данных имеет. Вводите вменяемые цифры если вас не затруднит`, "error");

    if (!reason) {
        reason = await menu.input(player, "Введите причину", "", 60);
    }

    if (mp.players.exists(target)) {
        player.notify(`Наказание ${target.user.jail_time_admin ? "Перевыдано" : "Выдано"}`, 'success')
        target.user.jailAdmin(player, min * 60, reason)
    } else {
        player.notify(`Наказание ${data.jail_time_admin ? "Перевыдано" : "Выдано"}. Игрок его отбудет при следующем заходе на сервер`, 'success')
        data.jail_time_admin = min * 60;
        data.jail_reason_admin = reason + ` / ${user.name} (${user.id})`;
        saveEntity(data);
    }

    if (isCalledFromMenu) {
        userChoise(player, id);
    }

    user.log('AdminJob', `Выдал деморган на ${min} мин., причина - ${reason}`, data.id);
    addAdminStats(user.id, 'jail')
}

const unjailUser = async (player: PlayerMp, id: number) => {
    if (!player.user) return;
    if (!player.user.admin_level) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    let target = User.get(id);
    let data: UserEntity;
    let dataaccount: AccountEntity;
    try {
        data = target && target.user ? target.user.entity : await User.getData(id)
        dataaccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)
    } catch (error) {
        // console.error(error);
    }
    if (!mp.players.exists(player)) return;
    if (!data) return player.notify("Игрок с указанным ID не обнаружен", "error")


    if (!data.jail_time_admin) return player.notify("Игрок не сидит в деморгане", "success");
    user.log('AdminJob', `Освободил из деморгана. Данные последнего деморгана - ${data.jail_time_admin} мин, причина - ${data.jail_reason_admin}`, data.id);
    player.notify(`Наказание снято`, 'success')
    if (target && mp.players.exists(target)) {
        target.user.jail_time_admin = 0;
        target.user.jail_reason_admin = null;
        target.user.save();
        target.user.jailSync();
        userChoise(player, id);
    } else {
        player.notify(`Наказание ${data.jail_time_admin ? "Перевыдано" : "Выдано"}. Игрок его отбудет при следующем заходе на сервер`, 'success')
        data.jail_time_admin = 0;
        data.jail_reason_admin = "";
        data.save().then(() => {
            userChoise(player, id);
        });
    }
}

const banUser = async (player: PlayerMp, id: number) => {
    if (!player.user) return;
    if (!player.user.admin_level) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    let target = User.get(id);
    let data: UserEntity;
    let dataaccount: AccountEntity;
    try {
        data = target && target.user ? target.user.entity : await User.getData(id)
        dataaccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)
    } catch (error) {
        // console.error(error);
    }
    if (!mp.players.exists(player)) return;
    if (!data) return player.notify("Игрок с указанным ID не обнаружен", "error")


    let banhours = 0;
    let bandays = 0;
    let banmonths = 0;
    let banreason = "";
    const s = () => {
        if (data.admin_level > user.admin_level) return player.notify('Вы не можете банить админа рангом выше вашего', 'error')
        const submenu = menu.new(player, 'Бан персонажа', 'Действия');
        submenu.onclose = () => {
            userChoise(player, id);
        }
        if (data.ban_end > system.timestamp) {
            submenu.newItem({
                name: `~r~Снять текущий бан`,
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        user.log('AdminBan', `Снял бан админа ${data.ban_admin}, который был до ${system.timeStampString(data.ban_end)} по причине ${data.ban_reason}`, data.id)
                        data.ban_end = 0;
                        data.ban_admin = 0;
                        data.ban_reason = null;
                        data.save().then(() => {
                            if (!mp.players.exists(player)) return;
                            player.notify('Игрок разбанен');
                            s();
                        })
                    })
                }
            })
        }
        submenu.newItem({
            name: 'Параметры нового бана',
            onpress: () => {
                player.notify('Укажите параметры ниже, это просто разделительный блок');
            }
        })
        submenu.newItem({
            name: 'Причина бана',
            more: banreason ? 'Указана' : 'Не указана',
            onpress: () => {
                menu.input(player, "Укажите причину бана", '', 400, 'text').then(reason => {
                    if (!reason) return;
                    banreason = reason;
                    s();
                })
            }
        })
        submenu.newItem({
            name: 'Сколько часов бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banhours,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banhours = val;
            }
        })
        submenu.newItem({
            name: 'Сколько дней бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: bandays,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                bandays = val;
            }
        })
        submenu.newItem({
            name: 'Сколько месяцев бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banmonths,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banmonths = val;
            }
        })
        submenu.newItem({
            name: '~g~Выдать бан с указанными параметрами',
            onpress: () => {
                if (!banreason) return player.notify('Причина не указана', 'error');
                if ((banhours + bandays + banmonths) === 0) return player.notify('Время не указано', 'error');
                let endtime = system.timestamp + (banhours * 60 * 60) + (bandays * 24 * 60 * 60) + (banmonths * 30 * 24 * 60 * 60)
                menu.accept(player, `Выдать бан до ${system.timeStampString(endtime)}`).then(status => {
                    if (!status) return;
                    User.banUser(data.id, player, banreason, endtime);
                    if (!mp.players.exists(player)) return;
                    player.notify('Бан выдан', 'error')
                    menu.close(player)
                })
            }
        })


        submenu.open();
    }
    s();
}
const banAccount = async (player: PlayerMp, id: number) => {
    if (!player.user) return;
    if (!player.user.admin_level) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    let target = User.get(id);
    let data: UserEntity;
    let dataaccount: AccountEntity;
    try {
        data = target && target.user ? target.user.entity : await User.getData(id)
        dataaccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)
    } catch (error) {
        // console.error(error);
    }
    if (!mp.players.exists(player)) return;
    if (!data) return player.notify("Игрок с указанным ID не обнаружен", "error")


    if (data.admin_level > user.admin_level) return player.notify('Вы не можете банить админа рангом выше вашего', 'error')
    let banhours = 0;
    let bandays = 0;
    let banmonths = 0;
    let banreason = "";
    const s = () => {
        const submenu = menu.new(player, 'Бан аккаунта', 'Действия');
        submenu.onclose = () => {
            userChoise(player, id);
        }
        if (dataaccount.ban_end > system.timestamp) {
            submenu.newItem({
                name: `~r~Снять текущий бан`,
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        user.log('AdminBan', `Снял бан админа ${dataaccount.ban_admin}, который был до ${system.timeStampString(dataaccount.ban_end)} по причине ${dataaccount.ban_reason}`, data.id)
                        dataaccount.ban_end = 0;
                        dataaccount.ban_admin = 0;
                        dataaccount.ban_reason = null;
                        dataaccount.save().then(() => {
                            if (!mp.players.exists(player)) return;
                            player.notify('Игрок разбанен');
                            s();
                        })
                    })
                }
            })
        }
        submenu.newItem({
            name: 'Параметры нового бана',
            onpress: () => {
                player.notify('Укажите параметры ниже, это просто разделительный блок');
            }
        })
        submenu.newItem({
            name: 'Причина бана',
            more: banreason ? 'Указана' : 'Не указана',
            onpress: () => {
                menu.input(player, "Укажите причину бана", '', 400, 'text').then(reason => {
                    if (!reason) return;
                    banreason = reason;
                    s();
                })
            }
        })
        submenu.newItem({
            name: 'Сколько часов бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banhours,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banhours = val;
            }
        })
        submenu.newItem({
            name: 'Сколько дней бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: bandays,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                bandays = val;
            }
        })
        submenu.newItem({
            name: 'Сколько месяцев бана',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banmonths,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banmonths = val;
            }
        })
        submenu.newItem({
            name: '~g~Выдать бан с указанными параметрами',
            onpress: () => {
                if (!banreason) return player.notify('Причина не указана', 'error');
                if ((banhours + bandays + banmonths) === 0) return player.notify('Время не указано', 'error');
                let endtime = system.timestamp + (banhours * 60 * 60) + (bandays * 24 * 60 * 60) + (banmonths * 30 * 24 * 60 * 60)
                menu.accept(player, `Выдать бан до ${system.timeStampString(endtime)}`).then(status => {
                    if (!status) return;
                    User.banUserAccount(dataaccount.id, player, banreason, endtime);
                    if (!mp.players.exists(player)) return;
                    player.notify('Бан выдан', 'error')
                    menu.close(player)
                })
            }
        })


        submenu.open();
    }
    s();
}

export let vmute = new Map<number, number>();
export let cmute = new Map<number, number>();

// gui.chat.registerCommand("ppp", (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newHour');
// })
//
// gui.chat.registerCommand("nm", async (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newMinute');
// })
//
// gui.chat.registerCommand("nd", async (player, str) => {
//     const user = player.user;
//     if(!user) return;
//     CustomEvent.trigger('newDay');
// })

gui.chat.registerCommand("cmute", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:cmute')) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    cmuteAccount(player, id);
})

gui.chat.registerCommand("vmute", (player, str) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:vmute')) return;
    const id = parseInt(str);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    vmuteAccount(player, id);
})

setInterval(() => mp.players.toArray().filter(q => q.user && q.user.load).map(q => syncMutePlayer(q.dbid)), 120 * 1000)

export const syncMutePlayer = (id: number) => {
    syncVMutePlayer(id);
    syncCMutePlayer(id);
}
const syncVMutePlayer = (id: number) => {
    if (vmute.has(id) && system.timestamp > vmute.get(id)) vmute.delete(id)
    const player = User.get(id);
    if (!player) return;
    const exists = vmute.has(id);
    if ((!!player.getVariable('muted:voice')) !== exists) player.setVariable('muted:voice', exists ? vmute.get(id) : false)
}
const syncCMutePlayer = (id: number) => {
    if (cmute.has(id) && system.timestamp > cmute.get(id)) cmute.delete(id)
    const player = User.get(id);
    if (!player) return;
    const exists = cmute.has(id);
    if ((!!player.getVariable('muted:chat')) !== exists) player.setVariable('muted:chat', exists)
}


const vmuteAccount = async (player: PlayerMp, id: number) => {
    let user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:vmute')) return player.notify("У вас нет доступа", "error")
    let banhours = 0;
    let banminutes = 0;
    const s = () => {
        const submenu = menu.new(player, 'Войс мут', 'Действия');
        submenu.onclose = () => {
            userChoise(player, id);
        }
        if (vmute.has(id)) {
            submenu.newItem({
                name: `~r~Снять текущий мут`,
                more: `${system.timeStampString(vmute.get(id))}`,
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        user.log('AdminBan', `Снял голосовой мут с персонажа ${id}, который был до ${system.timeStampString(vmute.get(id))}`, id);
                        vmute.delete(id);
                        player.notify('Мут снят', 'success')
                        syncMutePlayer(id)
                        s();
                    })
                }
            })
        }
        submenu.newItem({
            name: 'Параметры нового мута',
            onpress: () => {
                player.notify('Укажите параметры ниже, это просто разделительный блок');
            }
        })
        submenu.newItem({
            name: 'Сколько минут мута',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banminutes,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banminutes = val;
            }
        })
        submenu.newItem({
            name: 'Сколько часов мута',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banhours,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banhours = val;
            }
        })
        submenu.newItem({
            name: '~g~Выдать мут с указанными параметрами',
            onpress: () => {
                if ((banhours + banminutes) === 0) return player.notify('Время не указано', 'error');
                let endtime = system.timestamp + (banhours * 60 * 60) + (banminutes * 60)
                menu.input(player, 'Введите причину голосового мута:', '', 30, 'text').then(reason => {
                    reason = system.filterInput(reason)
                    if (!reason || !reason.length) return
                    menu.accept(player, `Выдать мут до ${system.timeStampString(endtime)} с причиной ${reason}`).then(status => {
                        if (!status) return;
                        vmute.set(id, endtime);
                        user.log('AdminBan', `Выдал голосовой мут на персонажа ${id} до ${system.timeStampString(vmute.get(id))} с причиной ${reason}`, id);
                        addAdminStats(user.id, 'vmute')
                        if (!mp.players.exists(player)) return;
                        player.notify('Мут выдан', 'error')
                        syncMutePlayer(id)

                        const mutePlayer = User.get(id);
                        if (mutePlayer) mutePlayer.outputChatBox(`Вы получили блокировку голосового чата до ${system.timeStampString(vmute.get(id))}. Причина: ${reason}`)

                        s();
                    })
                })
            }
        })


        submenu.open();
    }
    s();
}


const cmuteAccount = async (player: PlayerMp, id: number) => {
    let user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:useredit:cmute')) return player.notify("У вас нет доступа", "error")
    let banhours = 0;
    let banminutes = 0;
    const s = () => {
        const submenu = menu.new(player, 'Текстовый мут', 'Действия');
        submenu.onclose = () => {
            userChoise(player, id);
        }
        if (cmute.has(id)) {
            submenu.newItem({
                name: `~r~Снять текущий мут`,
                more: `${system.timeStampString(cmute.get(id))}`,
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        user.log('AdminBan', `Снял текстовый мут с персонажа ${id}, который был до ${system.timeStampString(cmute.get(id))}`, id);
                        cmute.delete(id);
                        player.notify('Мут снят', 'success')
                        syncMutePlayer(id)
                        s();
                    })
                }
            })
        }
        submenu.newItem({
            name: 'Параметры нового мута',
            onpress: () => {
                player.notify('Укажите параметры ниже, это просто разделительный блок');
            }
        })
        submenu.newItem({
            name: 'Сколько минут мута',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banminutes,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banminutes = val;
            }
        })
        submenu.newItem({
            name: 'Сколько часов мута',
            type: 'range',
            rangeselect: [0, 60],
            listSelected: banhours,
            desc: 'Указанное значение будет приплюсовано к суммарному сроку бана',
            onchange: (val) => {
                banhours = val;
            }
        })
        submenu.newItem({
            name: '~g~Выдать мут с указанными параметрами',
            onpress: () => {
                if ((banhours + banminutes) === 0) return player.notify('Время не указано', 'error');
                let endtime = system.timestamp + (banhours * 60 * 60) + (banminutes * 60)
                menu.input(player, 'Введите причину текстового мута:', '', 30, 'text').then(reason => {
                    reason = system.filterInput(reason)
                    if (!reason || !reason.length) return
                    menu.accept(player, `Выдать мут до ${system.timeStampString(endtime)}`).then(status => {
                        if (!status) return;
                        cmute.set(id, endtime);
                        user.log('AdminBan', `Выдал текстовый мут на персонажа ${id} до ${system.timeStampString(cmute.get(id))}`, id);
                        addAdminStats(user.id, 'cmute')
                        if (!mp.players.exists(player)) return;
                        player.notify('Мут выдан', 'error')
                        syncMutePlayer(id)
                        s();

                        const mutePlayer = User.get(id);
                        if (mutePlayer) mutePlayer.outputChatBox(`Вы получили блокировку текстового чата до ${system.timeStampString(cmute.get(id))}. Причина: ${reason}`)
                    })
                })
            }
        })


        submenu.open();
    }
    s();
}

export const userChoise = async (player: PlayerMp, id: number) => {
    if (!player.user) return;
    if (!player.user.admin_level) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    let target = User.get(id);
    let data: UserEntity;
    let dataaccount: AccountEntity;
    try {
        data = target && target.user ? target.user.entity : await User.getData(id)
        dataaccount = target && target.user ? target.user.account : await User.getDataAccount(data.accountId)
    } catch (error) {
        // console.error(error);
    }
    if (!mp.players.exists(player)) return;
    if (!data) return player.notify("Игрок с указанным ID не обнаружен", "error")
    let m = menu.new(player, "Действия над игроком", `[${data.id}] ${data.rp_name} (${target ? "Online" : "Offline"})`);

    if (target && target.id != player.id) {
        m.newItem({
            name: 'ТП к игроку',
            type: 'list',
            list: ["Без ТС", "С ТС"],
            onpress: (itm) => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                if (target.user.admin_level >= 6 && player.user.admin_level < 5) return player.notify('Вы не можете телепортироваться к данному игроку')
                if (itm.listSelected) {
                    player.user.teleportVeh(target.position.x, target.position.y, target.position.z, target.heading, target.dimension)
                } else {
                    player.user.teleport(target.position.x, target.position.y, target.position.z, target.heading, target.dimension);
                }
                player.user.log("AdminJob", "Телепортировался к игроку", target.dbid)
            }
        })
        m.newItem({
            name: 'ТП игрока',
            type: 'list',
            list: ["Без ТС", "С ТС"],
            onpress: (itm) => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                if (itm.listSelected) {
                    target.user.teleportVeh(player.position.x, player.position.y, player.position.z, player.heading, player.dimension);
                } else {
                    target.user.teleport(player.position.x, player.position.y, player.position.z, player.heading, player.dimension);
                }
                player.user.log("AdminJob", "Телепортировал игрока к себе", target.dbid)
            }
        })
    }
    if (user.hasPermission('admin:useredit:banuser')) {
        m.newItem({
            name: 'Бан персонажа',
            more: data.ban_end > system.timestamp ? `До ${system.timeStampString(data.ban_end)}` : 'Не забанен',
            desc: data.ban_end > system.timestamp ? data.ban_reason : 'Не забанен',
            onpress: () => {
                banUser(player, id);
            }
        })
    }
    if (user.hasPermission('admin:useredit:banaccount')) {
        m.newItem({
            name: 'Бан аккаунта',
            more: dataaccount.ban_end > system.timestamp ? `До ${system.timeStampString(dataaccount.ban_end)}` : 'Не забанен',
            desc: `${dataaccount.ban_end > system.timestamp ? dataaccount.ban_reason : 'Не забанен'}. Аналог BlackList`,
            onpress: () => {
                banAccount(player, id)
            }
        })
    }
    if (user.hasPermission('admin:useredit:vmute')) {
        m.newItem({
            name: 'Голосовой мут',
            onpress: () => {
                vmuteAccount(player, id)
            }
        })
    }
    if (user.hasPermission('admin:useredit:cmute')) {
        m.newItem({
            name: 'Текстовый мут',
            onpress: () => {
                cmuteAccount(player, id)
            }
        })
    }

    if (user.admin_level > data.admin_level && target) {
        m.newItem({
            name: 'Кикнуть',
            onpress: () => {
                menu.input(player, 'Введите причину', '', 60, 'text').then(val => {
                    if (!val) return;
                    if (val.length < 5) return player.notify('Минимальная длинна причины - 5 символов', 'error');
                    if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error');
                    addAdminStats(user.id, 'kick')
                    User.kickUser(target, val, player)
                    menu.close(player)
                })
            }
        })
    }

    if (target) {
        m.newItem({
            name: 'Запрос (Вы тут?)',
            onpress: () => {
                menu.accept(target, 'Вы тут?', 'big', 9999999).then(status => {
                    if (status) {
                        if (mp.players.exists(player)) player.notify('Ответ получен');
                    }
                })
            }
        })
    }

    if (target && target.user.cuffed) {
        m.newItem({
            name: 'Снять наручники',
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error');
                if (!target.user.cuffed) return player.notify('Не в наручниках', 'error')
                target.user.cuffed = false;
                player.notify('Наручники сняты')
            }
        })
    }

    if (user.hasPermission('admin:useredit:givewarn')) {
        m.newItem({
            name: 'Предупреждения',
            more: data.warns.length,
            onpress: () => {
                const s = () => {
                    const submenu = menu.new(player, 'Предупреждения', 'Действия');
                    submenu.onclose = () => {
                        userChoise(player, id);
                    }
                    submenu.newItem({
                        name: 'Выдать предупреждение',
                        onpress: () => {
                            menu.input(player, "Введите причину", "", 400, 'text').then(async reason => {
                                if (!reason) return;
                                let warns = [...data.warns];
                                warns.push({reason, admin: player.dbid, time: system.timestamp + (10 * 24 * 60 * 60)});
                                data.warns = warns;
                                if (mp.players.exists(player)) player.notify('Предупреждение выдано', 'error');
                                if (target && mp.players.exists(target)) {
                                    target.notify('Администратор выдал вам предупреждение', 'error');
                                    if (target.user.fraction && !target.user.isLeader) {
                                        target.notify('Вы были исключены из фракции', 'error');
                                        target.user.fraction = 0;
                                    }
                                } else {
                                    data.fraction = 0;
                                    data.rank = 0;
                                    await data.save()
                                }
                                addAdminStats(user.id, 'warn')
                                user.log('AdminJob', `Выдал варн, причина - ${reason}`, data.id);
                                if (data.warns.length && data.warns.length % 3 === 0) {
                                    User.banUser(data.id, player, `Получено 3 варна`, system.timestamp + (10 * 24 * 60 * 60))
                                }
                                userChoise(player, id);
                            })
                        }
                    })
                    data.warns.map((warn, warnid) => {
                        submenu.newItem({
                            name: `~r~${system.timeStampString(warn.time)} ADM: ${warn.admin}`,
                            onpress: () => {
                                if (!user.hasPermission('admin:useredit:unwarn') && warn.admin !== player.dbid) return player.notify('У вас нет доступа к снятию варна')
                                menu.accept(player, "Снять варн?").then(async reason => {
                                    if (!reason) return;
                                    if (target && !mp.players.exists(target)) return player.notify('Игрок не на сервере', 'error');
                                    let warns = [...data.warns];
                                    warns.splice(warnid, 1);
                                    data.warns = warns;
                                    if (!target) await data.save();
                                    if (mp.players.exists(player)) player.notify('Предупреждение снято', 'error');
                                    if (mp.players.exists(target)) target.notify('Администратор снял вам предупреждение', 'error');
                                })
                            }
                        })
                    })
                    submenu.open();
                }
                s();
            }
        })
    }

    m.newItem({
        name: `Медиа-промокод`,
        more: dataaccount.promocode_my,
        desc: 'Промокод регистронезависимый, можно вводить как в верхнем, так и в нижнем регистре, система в любом случае определит промокод',
        onpress: async () => {
            const submenu = menu.new(player, 'Информация по медиа промокоду');
            submenu.onclose = () => {
                userChoise(player, id)
            }
            const activators = await PromocodeUseEntity.find({code: dataaccount.promocode_my});
            if (dataaccount.promocode_my) {
                if (user.isAdminNow(6)) {
                    submenu.newItem({
                        name: `~r~Очистить полученные награды`,
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if (!status) return;
                                dataaccount.promocode_my_reward = 0;
                                saveEntity(dataaccount);
                                player.notify('Очищено', 'success')
                            })
                        }
                    });
                }
                submenu.newItem({
                    name: `Количество активаций (Общее)`,
                    more: `${activators.length}`,
                    desc: `Показывает суммарное количество активаций промокода на всех персонажах, когда либо вводивших текущий промокод медиа. Если промокод медиа сменить - счётчик будет считать уже по новому коду.`
                });
                submenu.newItem({
                    name: `Количество активаций (Уникальные)`,
                    more: `${activators.filter((q, i, a) => {
                        return a.findIndex(z => z.id === q.id) === i
                    }).length}`,
                    desc: `Показывает суммарное количество активаций промокода на аккаунтах. То есть если 1 игрок ввёл промокод с двух персонажей на одном аккаунте - будет считать как один. Этот параметр позволит лучше понять сколько медиа привёл уникальных игроков`
                });
                if (user.hasPermission('admin:useredit:mediapromo')) submenu.newItem({
                    name: `Сменить промокод`,
                    more: dataaccount.promocode_my,
                    onpress: () => {
                        menu.input(player, 'Введите новый промокод', dataaccount.promocode_my, 30, 'text').then(newpromo => {
                            if (!newpromo) return;
                            AccountEntity.find({promocode_my: newpromo}).then(async dublicate => {
                                if (!mp.players.exists(player)) return;
                                if (dublicate.length > 0) {
                                    if (dublicate.length == 1 && dublicate[0].id == dataaccount.id) return player.notify('Вы пытаетесь сменить промокод на тот же, что и указан.', "error");
                                    if (dublicate.length == 1 && dublicate[0].id != dataaccount.id) return player.notify('Промокод, который вы пытаетесь назначить уже принадлежит другому медиа.', "error");
                                    if (dublicate.length > 1) return player.notify('У нас проблема, этот промокод вообще принадлежит нескольким медиа, такого быть не должно, зовите разработчика чтобы он исправил данную ситуацию', "error");
                                    if (target && !mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                    if ((await PromocodeList.count({code: newpromo})) > 0) return player.notify('Указанный промокод совпадает с промокодом от администрации', "error")
                                }
                                dataaccount.promocode_my = newpromo;
                                dataaccount.save().then(() => {
                                    if (!mp.players.exists(player)) return;
                                    player.notify('Новый промокод успешно указан')
                                    userChoise(player, id);
                                })
                            })
                        })
                    }
                })
                if (user.hasPermission('admin:useredit:mediapromo')) submenu.newItem({
                    name: `~r~Удалить промокод`,
                    onpress: () => {
                        menu.accept(player).then(status => {
                            if (!status) return;
                            dataaccount.promocode_my = '';
                            dataaccount.save().then(() => {
                                if (!mp.players.exists(player)) return;
                                player.notify('Промокод успешно удалён')
                                userChoise(player, id);
                            })
                        })
                    }
                })
            } else {
                if (user.hasPermission('admin:useredit:mediapromo')) submenu.newItem({
                    name: `Дать промокод`,
                    more: ``,
                    onpress: () => {
                        menu.input(player, 'Введите новый промокод', '', 30, 'text').then(newpromo => {
                            if (!newpromo) return;
                            AccountEntity.find({promocode_my: newpromo}).then(async dublicate => {
                                if (!mp.players.exists(player)) return;
                                if (dublicate.length > 0) {
                                    if (dublicate.length == 1 && dublicate[0].id == dataaccount.id) return player.notify('Вы пытаетесь сменить промокод на тот же, что и указан.', "error");
                                    if (dublicate.length == 1 && dublicate[0].id != dataaccount.id) return player.notify('Промокод, который вы пытаетесь назначить уже принадлежит другому медиа.', "error");
                                    if (dublicate.length > 1) return player.notify('У нас проблема, этот промокод вообще принадлежит нескольким медиа, такого быть не должно, зовите разработчика чтобы он исправил данную ситуацию', "error");
                                    if (target && !mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                    if ((await PromocodeList.count({code: newpromo})) > 0) return player.notify('Указанный промокод совпадает с промокодом от администрации', "error")
                                }
                                dataaccount.promocode_my = newpromo;
                                dataaccount.save().then(() => {
                                    if (!mp.players.exists(player)) return;
                                    player.notify('Новый промокод успешно указан')
                                    userChoise(player, id);
                                })
                            })
                        })
                    }
                })
            }
            submenu.open();

        }
    })

    if (user.hasPermission('admin:useredit:helper')) {
        m.newItem({
            name: `Хелпер`,
            more: `${data.helper_level ? `${data.helper_level} LVL` : "Нет"}`,
            onpress: () => {
                menu.selector(player, 'Выдача хелперки', ['Снять', ...HELPER_PAYDAY_MONEY.map((q, i) => `${i + 1} LVL ($${system.numberFormat(q)})`)], true, null, true).then(async status => {
                    if (typeof status !== "number") return userChoise(player, id);
                    data.helper_level = status;
                    if (!target) await data.save();
                    else if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error');
                    userChoise(player, id);
                })
            }
        })
    }

    m.newItem({
        name: 'Уровень админки',
        more: `${data.admin_level} LVL`,
        onpress: () => {
            if (!user.isAdminNow(5)) return player.notify(`У вас нет доступа к смене уровня админки`, 'error');
            if (user.admin_level < data.admin_level) return player.notify(`Вы не можете изменять уровень админки данного администратора`, 'error');
            let text: string[] = [];
            for (let adm = 0; adm <= 5; adm++) text.push(`${adm} уровень`);
            if (user.isAdminNow(6)) text.push(`${6} уровень`);
            menu.selector(player, 'Выберите уровень админки', text, true, null, true).then(lvl => {
                if (typeof lvl !== "number") return;
                if (isNaN(lvl)) return;
                if (target && !mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                if (target) {
                    target.user.admin_level = lvl;
                    player.notify("Уровень админки изменён", "success");
                    writeSpecialLog(`Изменил уровень админки на ${lvl}`, player, target.user.id);
                    userChoise(player, id);
                } else {
                    data.admin_level = lvl;
                    data.save().then(() => {
                        player.notify("Уровень админки изменён", "success");
                        writeSpecialLog(`Изменил уровень админки на ${lvl}`, player, data.id);
                        userChoise(player, id);
                    })
                }
            })
        }
    })
    if (target && user.hasPermission('admin:useredit:jobskill')) {
        m.newItem({
            name: 'Навыки работы',
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                const submenu = menu.new(player, `${target.user.name} #${target.user.id}`, 'Список');
                submenu.onclose = () => {
                    userChoise(player, id);
                }
                submenu.newItem({
                    name: 'Уровень дальнобойщика',
                    more: data.deliver_level + " LVL",
                    onpress: () => {
                        menu.input(player, "Введите уровень", data.deliver_level, 4, 'int').then(val => {
                            if (typeof val !== "number") return;
                            if (isNaN(val)) return;
                            if (val < 0 || val > 9999) return;
                            if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                            target.user.entity.deliver_level = val;
                            player.notify("Количество опыта успешно изменено", "success");
                            userChoise(player, id);
                        })
                    }
                })
                for (let job in target.user.jobStats) {
                    const name = getJobName(job as any);
                    if (name) {
                        const exp = target.user.jobStats[job];
                        submenu.newItem({
                            name: name,
                            more: `${system.numberFormat(exp)} / ${system.numberFormat(1000)} (LVL: ${getLevelByExp(exp)})`,
                            onpress: () => {
                                menu.input(player, "Введите новое значение опыта", exp, 4, 'int').then(newexp => {
                                    if (typeof newexp !== "number") return userChoise(player, id);
                                    if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                                    if (newexp > 1000 || newexp < 0) return player.notify('Допускается значение от 0 до 1000', 'error'), userChoise(player, id);
                                    const oldexp = {...target.user.jobStats};
                                    oldexp[job] = newexp;
                                    target.user.jobStats = oldexp;
                                    player.notify("Количество опыта успешно изменено", "success");
                                    userChoise(player, id);
                                })
                            }
                        })
                    }
                }

                submenu.open();
            }
        })
    }
    if (target && user.hasPermission('admin:useredit:givedocument')) {
        m.newItem({
            name: 'Выдать документ/справку',
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                const submenu = menu.new(player, `${target.user.name} #${target.user.id}`, 'Список');
                submenu.onclose = () => {
                    userChoise(player, id);
                }
                submenu.newItem({
                    name: "~b~Лицензии"
                })
                submenu.widthMultipler = 2;
                LicensesData.map(item => {
                    if (target.user.haveActiveLicense(item.id)) {
                        submenu.newItem({
                            name: `~r~Изъять ${item.name}`,
                            onpress: async (itm) => {
                                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                                player.notify("Лицензия изъята");
                                writeSpecialLog(`Забрал у игрока лицензию ${item.id}`, player, target.user.id);
                                target.user.removeLicense(item.id);
                                userChoise(player, id);
                            }
                        })
                    } else {
                        submenu.newItem({
                            name: item.name,
                            onpress: async (itm) => {
                                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                                player.notify("Лицензия выдана на 30 дней");
                                writeSpecialLog(`Выдал игроку лицензию ${item.id} на 30 дней`, player, target.user.id);
                                target.user.giveLicense(item.id, 30);
                                userChoise(player, id);
                            }
                        })
                    }
                })
                submenu.newItem({
                    name: "~b~Документы и справки"
                })
                document_templates.map(item => {
                    submenu.newItem({
                        name: item.typeShort,
                        type: "list",
                        list: ["Реальный от своего имени", "Реальный вручную введённый", "Фейковый вручную введённый"],
                        onpress: async (itm) => {
                            if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                            if (itm.listSelected == 0) {
                                target.user.giveDocument(item.id, player);
                                player.notify("Документ выдан", "success");
                                userChoise(player, id);
                            } else {
                                let fakeid = await menu.input(player, "Введите ID", user.id);
                                if (!fakeid) return userChoise(player, id)
                                let fake_name = await menu.input(player, "Введите имя", user.name);
                                if (!fake_name) return userChoise(player, id)
                                let fake_social_number = await menu.input(player, "Введите соц номер", user.social_number);
                                if (!fake_social_number) return userChoise(player, id)
                                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error'), userChoise(player, id);
                                target.user.giveDocumentData(item.id, fakeid, fake_name, fake_social_number, itm.listSelected === 1)
                                player.notify("Документ выдан", "success");
                                userChoise(player, id);
                            }
                        }
                    })
                })


                submenu.open();
            }
        })
    }
    if (user.hasPermission('admin:inventory:create')) {
        m.newItem({
            name: 'Выдать предмет',
            type: "list",
            list: ['Постоянный', 'Временный'],
            desc: 'Временный предмет - это предмет - который будет существовать только пока запущен сервер. В базе данных он сохранятся не будет',
            onpress: (itm) => {
                menu.selectItem(player).then(async item_id => {
                    if (!item_id) return userChoise(player, id);
                    let count = await menu.input(player, "Введите количество", 1, 2, 'int');
                    if (!count || count <= 0) return userChoise(player, id);
                    for (let q = 0; q < count; q++) {
                        await inventory.createItem({
                            item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: id,
                            temp: itm.listSelected ? 1 : 0
                        });
                    }
                    writeSpecialLog(`Выдал предмет - ${item_id}`, player, id);
                    player.notify("Предмет выдан", "success");
                    userChoise(player, id);
                })
            }
        })
        m.newItem({
            name: 'Выдать оружие',
            type: "list",
            list: ['Постоянный', 'Временный'],
            desc: 'Временный предмет - это предмет - который будет существовать только пока запущен сервер. В базе данных он сохранятся не будет',
            onpress: (itm) => {
                menu.selectWeapon(player).then(async item_id => {
                    if (!item_id) return userChoise(player, id);
                    let count = await menu.input(player, "Введите количество", 1, 2, 'int');
                    if (!count || count <= 0) return userChoise(player, id);

                    writeSpecialLog(`Выдал оружие - ${item_id}`, player, id);

                    for (let q = 0; q < count; q++) {
                        const weapon = await inventory.createItem({
                            item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: id,
                            temp: itm.listSelected ? 1 : 0
                        });
                        const weaponCfg = inventoryShared.getWeaponConfigByItemId(item_id);
                        if (weaponCfg.ammo_box) {
                            inventory.createItem({
                                item_id: weaponCfg.ammo_box, owner_type: OWNER_TYPES.PLAYER, owner_id: id, count: 300,
                                temp: itm.listSelected ? 1 : 0
                            })
                        }
                        if (weaponCfg.addons) {
                            let groupUsed: number[] = [];
                            Object.values(weaponCfg.addons).map((addon: WeaponAddonsItemBase) => {
                                if (groupUsed.includes(addon.group)) return;
                                groupUsed.push(addon.group);
                                inventory.createItem({
                                    item_id: addon.item_id, owner_type: OWNER_TYPES.WEAPON_MODS, owner_id: weapon.id,
                                    temp: itm.listSelected ? 1 : 0
                                })
                            })
                        }
                    }


                    player.notify("Оружие выдано", "success");
                    userChoise(player, id);
                })
            }
        })
        m.newItem({
            name: '~r~Очистить инвентарь',
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    writeSpecialLog(`Очистил инвентарь`, player, id);
                    inventory.clearInventory(OWNER_TYPES.PLAYER, id)
                    player.notify('Инвентарь очищен');
                })
            }
        })
        if (user.isAdminNow(6)) {
            m.newItem({
                name: '~r~Выдать все предметы в инвентарь',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        inventoryShared.items.map(q => {
                            inventory.createItem({
                                item_id: q.item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: id
                            });
                        })
                    })
                }
            })
        }
        if (user.hasPermission('admin:animation:set')) {
            m.newItem({
                name: 'Платные анимации',
                onpress: () => {
                    const animationsMenu = menu.new(player, "Выберите анимацию", "Управление");
                    animationsMenu.exitProtect = true;
                    animationsMenu.onclose = () => {
                        userChoise(player, id);
                    }

                    animationsMenu.newItem({
                        name: 'Выдать все платные анимации',
                        onpress: () => {
                            menu.accept(player).then(async status => {
                                if (!status) return;
                                await target.user.animation.giveAllPurchaseableAnimations()
                            })
                        }
                    })

                    animationsMenu.newItem({
                        name: 'Выдать платную анимацию',
                        onpress: () => {
                            const subMenu = menu.new(player, "Выберите анимацию", "Список");
                            subMenu.exitProtect = true;
                            subMenu.onclose = () => {
                                userChoise(player, id);
                            }
                            PURCHASEABLE_ANIMS.filter(a => !target.user.animation.havePurchaseableAnimation(a.id)).forEach(anim => {
                                subMenu.newItem({
                                    name: `${anim.category} | ${anim.name}`,
                                    more: `${anim.forBattlePass ? "для баттлпаса" : ""} ${anim.cost ? anim.cost : ""} ${anim.costType ? anim.costType : ""}`,
                                    onpress: async () => {
                                        subMenu.close();
                                        await target.user.animation.givePurchaseableAnimation(anim.id)
                                    }
                                })
                            })
                            subMenu.open()
                        }
                    })

                    animationsMenu.newItem({
                        name: 'Забрать платную анимацию',
                        onpress: () => {
                            const subMenu = menu.new(player, "Выберите анимацию", "Список");
                            subMenu.exitProtect = true;
                            subMenu.onclose = () => {
                                userChoise(player, id);
                            }
                            PURCHASEABLE_ANIMS.filter(a => target.user.animation.havePurchaseableAnimation(a.id)).forEach(anim => {
                                subMenu.newItem({
                                    name: `${anim.category} | ${anim.name}`,
                                    more: `${anim.forBattlePass ? "Battle Pass" : ""} ${anim.cost ? anim.cost : ""} ${anim.costType ? anim.costType : ""}`,
                                    onpress: async () => {
                                        subMenu.close();
                                        await target.user.animation.takePurchaseableAnimation(anim.id)
                                    }
                                })
                            })
                            subMenu.open()
                        }
                    })
                    animationsMenu.open()
                }
            })
        }
    }
    if (user.hasPermission('admin:useredit:fraction')) {
        m.newItem({
            name: 'Фракция',
            more: data.fraction ? `${fractionCfg.getFractionName(data.fraction)} (${data.fraction})` : "Не во фракции",
            onpress: () => {
                menu.selectFraction(player, 'all', data.fraction).then(async fraction => {
                    if (!fraction) return userChoise(player, id);
                    if (mp.players.exists(target)) {
                        target.user.fraction = fraction;
                        await target.user.save();
                    } else {
                        data.fraction = fraction;
                        await data.save();
                    }
                    player.notify("Фракция указана", "error");
                    player.user.log("AdminJob", `Сменил фракцию на ${fraction} (${fractionCfg.getFractionName(fraction)})`, data.id)
                    userChoise(player, id);
                })
            }
        })

        if (data.fraction) {
            m.newItem({
                name: 'Ранг',
                more: data.rank ? `${fractionCfg.getRankName(data.fraction, data.rank)} (${data.rank})` : "Нет ранга",
                onpress: () => {

                    menu.selector(player, "Выберите ранг", fractionCfg.getFractionRanks(data.fraction), true).then(async val => {
                        if (typeof val !== "number") return userChoise(player, id);
                        if (!data.fraction) return player.notify("Игрок не во фракции", "error"), userChoise(player, id);
                        if (mp.players.exists(target)) {
                            target.user.rank = val + 1;
                            await target.user.save();
                        } else {
                            data.rank = val + 1;
                            await data.save();
                        }
                        player.notify("Ранг назначен", "success");
                        player.user.log("AdminJob", `Выдал ранг ${fractionCfg.getRankName(data.fraction, val + 1)} для фракции ${fractionCfg.getFractionName(data.fraction)}`, data.id);
                        userChoise(player, id);
                    })
                }
            })
            m.newItem({
                name: '~r~Снять фракцию',
                onpress: () => {

                    menu.accept(player).then(async status => {
                        if (!status) return userChoise(player, id);
                        if (mp.players.exists(target)) {
                            target.user.fraction = 0;
                            target.user.rank = 0;
                            await target.user.save();
                        } else {
                            data.fraction = 0;
                            data.rank = 0;
                            await data.save();
                        }
                        player.notify("Фракция указана", "error");
                        player.user.log("AdminJob", `Снял фракцию`, data.id)
                        userChoise(player, id);
                    })
                }
            })
        }
    }
    if (target) {
        m.newItem({
            name: 'Полное восстановление',
            desc: "Полное восстановление показателей еды/воды/здоровья",
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                target.user.adminRestore();
                player.user.log("AdminJob", "Полностью восстановил параметры", target.dbid)
            }
        })
        if (!mp.config.announce) {
            m.newItem({
                name: 'Вынести все показатели голода и жажды в ноль',
                onpress: () => {
                    target.user.food = 0;
                    target.user.water = 0;
                }
            })
        }
        m.newItem({
            name: 'Убить',
            desc: "Пришить игрока на месте",
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                target.user.health = 0;
                player.user.log("AdminJob", "Убил", target.dbid)
            }
        })
    }
    if (target) {
        if (user.isAdminNow(6)) {
            m.newItem({
                name: 'Выдать квест игроку',
                more: ``,
                onpress: () => {
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    let submenu = menu.new(player, "Выдать квест");
                    submenu.onclose = () => {
                        userChoise(player, data.id)
                    }
                    QUESTS_DATA.forEach(item => {
                        submenu.newItem({
                            name: item.name,
                            desc: item.desc,
                            onpress: () => {
                                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                target.user.giveQuest(item.id);
                                player.notify('Квест выдан')
                                userChoise(player, data.id)
                            }
                        })
                    })
                    submenu.open();
                }
            })
            m.newItem({
                name: 'Очистить квесты',
                more: ``,
                onpress: () => {
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    target.user.quests = [];
                }
            })
            m.newItem({
                name: 'Очистить инфу о выданых предметах',
                desc: `Чистится информация о том, что мы видели окно с информацией о полученном предмете`,
                onpress: () => {
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    writeSpecialLog(`Очистил варны игроку`, player, target.user.id);
                    target.user.entity.successItem = [];
                    player.notify("Список очищен")
                }
            })
            m.newItem({
                name: 'Очистить тату',
                more: ``,
                onpress: () => {
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    writeSpecialLog(`Очистил тату`, player, target.user.id);
                    target.user.tattoos = [];
                    target.user.reloadTattoo()
                }
            })
        }
        if (user.hasPermission('admin:vehicle:givetoplayer')) {
            m.newItem({
                name: 'Выдать ТС игроку',
                more: ``,
                onpress: () => {
                    let search = '';
                    const s = () => {
                        if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                        let submenu = menu.new(player, "Выдать ТС");
                        submenu.onclose = () => {
                            userChoise(player, data.id)
                        }
                        submenu.newItem({
                            name: 'Поиск',
                            onpress: () => {
                                menu.input(player, 'Введите название', search, 15).then(n => {
                                    search = n ? n : ''
                                    s();
                                })
                            }
                        });
                        [...vehicleConfigs].map(q => q[1]).filter(q => !search || q.name.toLowerCase().includes(search.toLowerCase())).forEach(item => {
                            submenu.newItem({
                                name: item.name,
                                onpress: () => {
                                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                    const pos = target.user.getFreeVehicleSlot()
                                    if (!pos) return player.notify("Для выдачи транспорта необходим собственный дом с свободным местом в гараже, либо свободное парковочное место", "error");
                                    Vehicle.createNewDatabaseVehicle(target, item.id, {r: 0, g: 0, b: 0}, {
                                        r: 0,
                                        g: 0,
                                        b: 0
                                    }, new mp.Vector3(pos.x, pos.y, pos.z), pos.h, target.user.house, 0, 0)
                                    writeSpecialLog(`Выдал тс игроку - ${item.name}`, player, target.user.id);
                                    player.notify("ТС успешно выдан", 'success')
                                    target.notify("Администратор выдал вам ТС " + item.name, 'success')
                                }
                            })
                        })
                        submenu.open();
                    }
                    s();
                }
            })
        }

    }
    if (user.hasPermission('admin:useredit:wanted')) {
        m.newItem({
            name: '~r~Выдать розыск',
            more: ``,
            onpress: () => {
                menu.input(player, 'Введите уровень (1 - 5)', null, 1, 'int').then(lvl => {
                    if (!lvl || lvl <= 0) return;
                    menu.input(player, 'Введите причину', '', 100, 'textarea').then(reason => {
                        if (!reason) return;
                        if (target && !mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                        if (target) {
                            target.user.giveWanted(lvl as any, reason)
                            userChoise(player, id);
                            player.notify('Розыск выдан', 'success')
                        } else {
                            data.wanted_level = lvl as any;
                            data.wanted_reason = reason;
                            data.save().then(() => {
                                writeSpecialLog(`Выдал розыск`, player, target.user.id);
                                player.notify('Розыск выдан', 'success')
                                userChoise(player, id);
                            })
                        }
                    })
                })
            }
        })
        if (data.wanted_level) {
            m.newItem({
                name: 'Снять розыск',
                more: ``,
                onpress: () => {
                    if (target && !mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    if (target) {
                        target.user.clearWanted()
                        userChoise(player, id);
                        player.notify('Розыск очищен', 'success')
                    } else {
                        data.wanted_level = 0;
                        data.wanted_reason = '';
                        data.save().then(() => {
                            player.notify('Розыск очищен', 'success')
                            userChoise(player, id);
                        })
                    }
                }
            })
        }
    }
    if (user.hasPermission('admin:useredit:jail')) {
        m.newItem({
            name: '~r~Посадить в тюрьму',
            more: ``,
            onpress: async () => {
                const reason = await menu.input(player, "Причина", "", 30);
                const time = await menu.input(player, "Время в минутах", "", 5, "int");

                prison.jailAdmin(player, data.id, time, reason);
            }
        })
        if (data.prison) {
            m.newItem({
                name: '~r~Освободить из тюрьмы',
                more: `${data.jail_time_admin}`,
                onpress: () => {
                    prison.unjailAdmin(player, data.id);
                }
            })
        }
    }

    const house = (target) ? target.user.houseEntity : houses.getByOwner(id);
    if (house) {
        m.newItem({
            name: `Дом`,
            more: `${house.name} #${house.id}`,
            onpress: () => {
                if (user.hasPermission('admin:houses:editmarks')) {
                    openHouseEditAdminMenu(player, house);
                } else {
                    user.teleport(house.x, house.y, house.z, house.h, house.d)
                }
            }
        })
    }

    const targetBusiness = (target) ? target.user.business : business.getByOwner(id);
    if (targetBusiness) {
        m.newItem({
            name: `Бизнес`,
            more: `#${targetBusiness.id}`,
            onpress: () => {
                const pos = targetBusiness.positions[0]
                user.teleport(pos.x, pos.y, pos.z, 0, targetBusiness.dimension)
            }
        })
    }

    const targetVehs = Vehicle.getPlayerVehicles(data.id)
    if (targetVehs.length === 0) {
        m.newItem({
            name: "~r~ТС игрока",
            more: "~r~У игрока нет ТС",
            onpress: () => {
                if (targetVehs.length === 0) return;
            }
        })
    } else {
        m.newItem({
            name: "ТС игрока",
            more: `x${targetVehs.length}`,
            onpress: () => {
                let submenu = menu.new(player, "Выдать ТС");
                submenu.onclose = () => {
                    userChoise(player, data.id)
                }
                targetVehs.map(veh => {
                    submenu.newItem({
                        name: `#${veh.id} ${veh.name}`,
                        more: `${veh.number}`,
                        desc: `Стоимость покупки: ${veh.isDonate ? DONATE_MONEY_NAMES[2] : '$'} ${system.numberFormat(veh.data.cost)}. ${veh.onParkingFine ? 'На штрафстоянке $' + system.numberFormat(veh.fine) : `На точке спавна - ${veh.inSpawnPoint ? 'Да' : 'Нет'}, Место парковки - ${parking.allVehsInAllParking().find(q => q.entity.id === veh.id) ? 'Парковка' : `Дом`}`}`,
                        onpress: () => {
                            let submenu2 = menu.new(player, "Действия над ТС");
                            submenu.onclose = () => {
                                userChoise(player, data.id)
                            }
                            submenu2.newItem({
                                name: "Респавн",
                                onpress: () => {
                                    veh.respawn();
                                }
                            })
                            submenu2.newItem({
                                name: "Телепортировать ТС ко мне",
                                onpress: () => {
                                    Vehicle.teleport(veh.vehicle, player.position, player.heading, player.dimension);
                                }
                            })
                            submenu2.newItem({
                                name: "Телепортироваться к ТС",
                                onpress: () => {
                                    if (veh.exists) user.teleport(veh.vehicle.position.x, veh.vehicle.position.y, veh.vehicle.position.z, 0, veh.vehicle.dimension)
                                }
                            })
                            submenu2.newItem({
                                name: "Телепортироваться на точку парковки",
                                onpress: () => {
                                    user.teleport(veh.position.x, veh.position.y, veh.position.z, veh.position.h, veh.position.d)
                                }
                            })
                            if (user.isAdminNow(6)) {
                                submenu2.newItem({
                                    name: "~r~Удалить ТС",
                                    onpress: () => {
                                        menu.accept(player).then(status => {
                                            if (!status) return;
                                            veh.deleteFromDatabase()
                                            userChoise(player, id);
                                            player.notify('Готово', 'success');
                                        })
                                    }
                                })
                            }
                            submenu2.open();
                        }
                    })
                })
                submenu.open();
            }
        })
    }
    if (target && user.hasPermission('admin:useredit:vipcontrol')) {
        let currentVip = target.user.vipData
        m.newItem({
            name: 'Vip',
            more: `${currentVip ? currentVip.name : "~r~Нет"}`,
            desc: `${currentVip ? `Действует до ${system.timeStampString(currentVip.end)}` : null}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                let currentVip = target.user.vipData
                const submenu = menu.new(player, "Управление випкой", "Действия");
                submenu.onclose = () => {
                    userChoise(player, id)
                }
                if (currentVip) {
                    submenu.newItem({
                        name: "Текущая випка",
                        more: `${currentVip ? currentVip.name : "~r~Нет"}`,
                        desc: `${currentVip ? `Действует до ${system.timeStampString(currentVip.end)}` : null}`,
                    })
                    submenu.newItem({
                        name: "~g~Продлить текущую випку",
                        onpress: () => {
                            menu.input(player, "Введите количество дней", 30, 3, 'int').then(days => {
                                if (!days) return;
                                if (isNaN(days) || days < 0) return;
                                if (days > 365) return player.notify("Количество дней не может превышать 365 дней", "error");
                                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                target.user.giveVip(currentVip.id, days);
                                writeSpecialLog(`Продлил VIP ${currentVip.name} на ${days} дней`, player, target.user.id);
                                player.notify("Випка успешно продлена");
                                userChoise(player, id)
                            })
                        }
                    })
                    submenu.newItem({
                        name: "~r~Отобрать текущую випку",
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if (!status) return;
                                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                                target.user.removeVip();
                                writeSpecialLog(`Отобрал VIP`, player, target.user.id);
                                player.notify("Випка успешно отобрана");
                                userChoise(player, id)
                            })
                        }
                    })
                }
                submenu.newItem({
                    name: "~b~Список випок для выдачи"
                })
                VIP_TARIFS.map(tarif => {
                    submenu.newItem({
                        name: `${tarif.name}`,
                        more: `${tarif.id}`,
                        desc: `Стоимость: ${tarif.cost ? system.numberFormat(tarif.cost) : "Не продаётся"}\nМедиа: ${tarif.media ? "Да" : "Нет"}\nБонус к ЗП: ${tarif.payday_money ? system.numberFormat(tarif.payday_money) : "Не даётся"}\nБонус к опыту: ${tarif.payday_exp ? system.numberFormat(tarif.payday_exp) : "Не даётся"}\nБонус донат валюты: ${tarif.payday_donate ? system.numberFormat(tarif.payday_donate) : "Не даётся"}\nБонус к опыту работы: ${tarif.job_skill_multipler ? `+${tarif.job_skill_multipler}%` : "Не даётся"}`,
                        onpress: () => {
                            if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                            target.user.giveVip(tarif.id, 30);
                            writeSpecialLog(`Выдал VIP ${tarif.name} на 30 дней`, player, target.user.id);
                            player.notify("Випка выдана на 30 дней", "success");
                        }
                    })
                })
                submenu.open();
            }
        })
    }
    if (target && user.isAdminNow(6)) {
        m.newItem({
            name: 'Сохранить игрока',
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                target.user.save()
                player.notify('Готово', "success");
            }
        })
    }
    if (user.hasPermission('admin:useredit:coins')) {
        m.newItem({
            name: 'Баланс коинов',
            more: `${target && target.user
                ? system.numberFormat(target.user.donate_money)
                : system.numberFormat(dataaccount.donate)}`,
            onpress: () => {
                menu.input(player, "Введите баланс", target && target.user ? target.user.donate_money : dataaccount.donate, 8, "int").then(val => {
                    if (val === null) return;
                    if (val < 0 || val > 999999999) return player.notify('Баланс указан не верно', 'error');
                    let lastValue = target && target.user ? target.user.donate_money : dataaccount.donate;
                    if (mp.players.exists(target)) {
                        target.user.donate_money = val
                        writeSpecialLog(`Изменил коины с ${lastValue} на ${val}`, player, target.user.id);
                    } else {
                        if (dataaccount) {
                            dataaccount.donate = val
                            writeSpecialLog(`Изменил коины с ${lastValue} на ${val} (OFFLINE)`, player, dataaccount.id);
                            saveEntity(dataaccount)
                        }
                    }

                    player.notify('Готово', "success");
                    userChoise(player, id)
                })
            }
        })
    }
    if (target && user.hasPermission('admin:useredit:chips')) {
        m.newItem({
            name: 'Баланс фишек',
            more: `${system.numberFormat(target.user.chips)}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                menu.input(player, "Введите баланс", target.user.chips, 8, "int").then(val => {
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    if (val === null) return;
                    if (val < 0 || val > 999999999) return player.notify('Баланс указан не верно', 'error');
                    target.user.chips = val
                    player.notify('Готово', "success");
                    userChoise(player, id)
                    player.user.log('AdminJob', `Изменение баланса фишек (${val})`, target);
                })
            }
        })
    }
    if (user.hasPermission('admin:setmedia')) {
        m.newItem({
            name: 'Медиа статус',
            more: `${target && target.user
                ? (target.user.account.isMedia ? 'Активен' : 'Не активен')
                : (dataaccount.isMedia ? 'Активен' : 'Не активен')}`,
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    if (target && target.user) {
                        target.user.account.isMedia = !target.user.account.isMedia
                        target.setVariable('media', target.user.account.isMedia)
                        writeSpecialLog(`Выдал медиа статус`, player, target.user.id);
                        saveEntity(target.user.account)
                    } else {
                        dataaccount.isMedia = !dataaccount.isMedia
                        writeSpecialLog(`Выдал медиа статус`, player, data.id);
                        saveEntity(dataaccount)
                    }
                    player.notify("Медиа статус изменен", "success");
                    userChoise(player, id);
                })
            }
        })
    }
    if (target && user.hasPermission('admin:useredit:payday')) {
        m.newItem({
            name: '~r~Выдать PayDay',
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    if (!mp.players.exists(target)) return player.notify("Игрок покинул сервер", "error");
                    target.user.payday();
                    writeSpecialLog(`Выдал PayDay`, player, target.user.id);
                    player.notify("PayDay выдан игроку", "success");
                    userChoise(player, id);
                })
            }
        })
    }

    m.newItem({
        name: 'Баланс наличных',
        more: `$${system.numberFormat(data.money)}`,
        onpress: () => {
            if (!user.hasPermission('admin:useredit:money')) return player.notify('Вы не можете это редактировать', 'error')
            menu.input(player, "Введите баланс", data.money, 8, "int").then(val => {
                if (val === null) return;
                if (val < 0 || val > 999999999) return player.notify('Баланс указан не верно', 'error');
                if (user.admin_level < 6) player.user.log("AdminJob", `Смена налички с $${data.money} на $${val} (${data.money > val ? `-${data.money - val}$` : `+${val - data.money}$`})`, data.id)
                const lastValue = data.money;
                if (target) target.user.money = val
                else {
                    data.money = val
                    data.save();
                }
                writeSpecialLog(`Изменил количество денег с ${lastValue} на ${val}`, player, data.id);
                player.notify('Готово', "success");
                userChoise(player, id)
            })
        }
    })
    if (data.bank_number) {
        m.newItem({
            name: 'Баланс на карте',
            more: `$${system.numberFormat(data.bank_money)}`,
            onpress: () => {
                if (!user.hasPermission('admin:useredit:money')) return player.notify('Вы не можете это редактировать', 'error')
                menu.input(player, "Введите баланс", data.bank_money, 8, "int").then(val => {
                    if (val === null) return;
                    if (val < 0 || val > 999999999) return player.notify('Баланс указан не верно', 'error');
                    if (user.admin_level < 6) player.user.log("AdminJob", `Смена баланса с $${data.bank_money} на $${val} (${data.bank_money > val ? `-${data.bank_money - val}$` : `+${val - data.bank_money}$`})`, data.id)
                    const lastValue = data.bank_money;
                    if (target) target.user.bank_money = val
                    else {
                        data.bank_money = val
                        data.save();
                    }
                    writeSpecialLog(`Изменил количество банка с ${lastValue} на ${val}`, player, data.id);
                    player.notify('Готово', "success");
                    userChoise(player, id)
                })
            }
        })
    }

    if (target && data.family) {
        m.newItem({
            name: 'Семья',
            more: `${Family.getByID(data.family).name}`,
            desc: `ID семьи: ${data.family}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                showFamilyEditAdminMenu(player, Family.getByID(data.family))
            }
        })
        m.newItem({
            name: 'Ранг в семье',
            more: `${target.user.family.getRank(target.user.familyRank) ? target.user.family.getRank(target.user.familyRank).name : 'Не найден'}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                if (!target.user.family) return;
                if (!user.hasPermission('admin:useredit:familyRank')) return player.notify('Вы не можете это редактировать', 'error')
                menu.selector(player, 'Выберите ранг', target.user.family.ranks.map(r => {
                    return r.name
                }), false).then(name => {
                    if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                    if (!target.user.family) return;
                    target.user.familyRank = target.user.family.ranks.find(r => r.name == name) ? target.user.family.ranks.find(r => r.name == name).id : 1
                    writeSpecialLog(`Изменил ранг семьи игроку ${target.user.name} на ${target.user.family.getRank(target.user.familyRank).name} | ${target.user.family.name}`, player, target.user.id);
                    player.notify(`Вы изменили ранг семьи игроку ${target.user.name} на ${target.user.family.getRank(target.user.familyRank).name}`)
                })
            }
        })
    }

    if (user.hasPermission('admin:useredit:armour') && target) {
        m.newItem({
            name: 'Уровень брони',
            more: `${target.armour}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                menu.input(player, "Введите новый уровень брони", target.armour, 3, "int").then(val => {
                    if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                    if (val === null) return;
                    if (val < 0 || val > 100) return player.notify('Уровень брони указан не верно', 'error');
                    player.user.log("AdminJob", `Выдача брони с %${target.armour} на %${val} (${target.armour > val ? `-${target.armour - val}%` : `+${val - target.armour}%`})`, target)
                    target.user.armour = val;
                    player.notify('Готово', "success");
                    userChoise(player, id)
                })
            }
        })
    }
    if (user.hasPermission('admin:useredit:skin') && target) {
        m.newItem({
            name: 'Скин персонажа',
            more: `${target.user.mp_character ? 'Стандартный' : 'Изменён'}`,
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                if (!target.user.mp_character) {
                    target.user.reloadSkin();
                    player.notify('Скин сменён обратно', 'success')
                    userChoise(player, id)
                    return;
                }
                menu.selector(player, 'Выберите скин', SkinChange, false, null, true).then(model => {
                    if (!model) return;
                    target.user.anticheatProtect('heal')
                    target.model = mp.joaat(model);
                    target.user.inventoryAttachSync()
                    player.notify('Готово', "success");
                    userChoise(player, id)
                })
            }
        })
    }
    if (user.hasPermission('admin:useredit:level')) {
        m.newItem({
            name: 'Уровень персонажа',
            more: `${data.level} LVL`,
            onpress: () => {
                if (target && !mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                menu.input(player, "Введите новый уровень", target.user.level, 3, "int").then(val => {
                    if (target && !mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                    if (!val) return;
                    if (val < 0 || val > 100) return player.notify('Уровень указан не верно', 'error');
                    player.user.log("AdminJob", `Смена уровня игрока с ${data.level} на ${val} (${data.level > val ? `-${data.level - val}` : `+${val - data.level}`})`, data.id)
                    data.level = val;
                    if (!target) data.save()
                    player.notify('Готово', "success");
                    userChoise(player, id)
                })
            }
        })
    }
    if (user.hasPermission('admin:useredit:editor') && target) {
        m.newItem({
            name: 'Отправить в редактор',
            onpress: () => {
                if (!mp.players.exists(target)) return player.notify('Игрок покинул сервер', 'error')
                menu.close(target);
                target.user.startCustomization();
            }
        })
    }
    if (user.hasPermission('admin:deletepersonage')) {
        m.newItem({
            name: '~r~Удалить персонажа',
            onpress: () => {
                if (mp.config.announce && data.admin_level === 6 && user.account.id !== dataaccount.id) return player.notify('~r~Вы не можете удалить персонажа главного адмистратора. Только если это ваш персонаж', 'error');
                menu.accept(player).then(status => {
                    if (!status) return;
                    menu.close(player);
                    player.notify('Персонаж будет удалён через 10 секунд', 'success')
                    User.deletepersonage(data.id)
                    writeSpecialLog(`Удалил персонажа ${data.id}`, player, data.id)
                })
            }
        })
    }
    // if (user.hasPermission('admin:celarpersonage')) {
    //     m.newItem({
    //         name: '~r~Очистить персонажа',
    //         onpress: () => {
    //             if(mp.config.announce && data.admin_level === 6 && user.account.id !== dataaccount.id) return player.notify('~r~Вы не можете очистить персонажа главного адмистратора. Только если это ваш персонаж', 'error');
    //             menu.accept(player).then(status => {
    //                 if(!status) return;
    //                 menu.close(player);
    //                 player.notify('Персонаж будет очищен через 10 секунд', 'success')
    //                 User.clearPersonage(data.id)
    //             })
    //         }
    //     })
    // }
    if (user.hasPermission('admin:changeidpersonage')) {
        m.newItem({
            name: '~r~Сменить ID персонажа',
            onpress: () => {
                if (mp.config.announce && data.admin_level === 6 && user.account.id !== dataaccount.id) return player.notify('~r~Вы не можете очистить персонажа главного адмистратора. Только если это ваш персонаж', 'error');
                menu.accept(player).then(status => {
                    if (!status) return;
                    menu.input(player, 'Введите новый ID', '', 6, 'int').then(val => {
                        if (!val || val < 0 || val > 999999) return;
                        menu.close(player);
                        player.notify('Начата процедура замены ИД персонажа', 'success')
                        User.changeId(data.id, val).then(q => {
                            if (!mp.players.exists(player)) return;
                            player.notify(`${q ? 'Действие успешно выполнено' : 'Возникла ошибка при смене ИД'}`, 'error')
                        });
                    })
                })
            }
        })
    }

    m.open();

}

CustomEvent.registerClient('admin:fullrestore', (player) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error")
    let user = player.user;
    user.adminRestore()
})
CustomEvent.registerClient('admins:vehicle:config', (player) => {
    configEditMain(player);
})


const configEditMain = (player: PlayerMp, search?: string, page = 0) => {
    if (!player.user) return;
    let user = player.user;
    if (!user.hasPermission('admin:vehicle:configs')) return player.notify('У вас нет доступа', "error");
    let m = menu.new(player, "Конфиг ТС", "Список");
    m.newItem({
        name: `Новая запись`,
        onpress: () => {
            menu.input(player, "Введите модель", "", 100).then(val => {
                if (!val) return configEditMain(player, search, page);
                if ([...vehicleConfigs].map(q => q[1]).find(q => q.model === val.toLowerCase())) return player.notify('Данная модель уже добавлена', 'error');
                let item = new VehicleConfigsEntity();
                item.model = val.toLowerCase();
                item.name = val;
                item.multiple = 100;
                item.save().then((r) => {
                    vehicleConfigs.set(r.id, r);
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })
    m.newItem({
        name: `~r~Список ТС без багажника`,
        onpress: () => {
            const submenu = menu.new(player, 'Список');

            submenu.onclose = () => {
                configEditMain(player, search, page);
            };

            [...vehicleConfigs].map(q => q[1]).filter(q => !Vehicle.haveTruck(q.model)).map(q => {
                submenu.newItem({
                    name: q.name,
                    more: q.model,
                    onpress: () => {
                        CustomEvent.callClient(player, 'verifyVehModel', q.model).then(q => {
                            if (!q) return player.notify('Модель указана не верно', 'error')
                            let veh = Vehicle.spawn(q.model, player.position, player.heading, player.dimension, true, false);
                            user.putIntoVehicle(veh);
                        })
                    }
                })
            })

            submenu.open();
        }
    })
    const configs = system.chunkArray([...vehicleConfigs].map(q => q[1]).filter(q => !search || q.model.toLowerCase().includes(search.toLowerCase())), 100)
    if (configs[page + 1]) {
        m.newItem({
            name: `Следующая страница`,
            onpress: () => {
                configEditMain(player, search, page + 1);
            }
        })
    }
    m.newItem({
        name: `Поиск`,
        more: search,
        onpress: () => {
            menu.input(player, "Введите модель", "", 50).then(val => {
                if (typeof val === "string") search = val;
                configEditMain(player, search, 0);
            }).catch(err => console.error(err))
        }
    })
    if (configs.length > 1) {
        m.newItem({
            name: `Страница`,
            more: `${(page + 1)} / ${configs.length}`
        })
    }
    if (page) {
        m.newItem({
            name: `Предыдущая страница`,
            onpress: () => {
                configEditMain(player, search, page - 1);
            }
        })
    }
    if (configs[page]) configs[page].map(item => {
        let fuelString = "";
        if (item.fuel_max == 0) fuelString = `Топливо: не требуется\n`
        else fuelString = `Топливо: тип ${fuelTypeNames[item.fuel_type]}, объём ${item.fuel_max}, расход ${item.fuel_min}\n`;
        m.newItem({
            name: `${item.id}) ${item.name}`,
            more: `${item.model}`,
            desc: `Багажник: ${system.numberFormat(item.stock)} кг\n${fuelString}`,
            onpress: () => {
                vehicleConfigEdit(player, item)
            }
        })
    })
    m.open()
}

export const vehicleConfigEdit = (player: PlayerMp, item: VehicleConfigsEntity) => {
    let m = menu.new(player, item.name, "Параметры");
    m.onclose = () => {
        configEditMain(player)
    }
    const count = item.model ? Vehicle.toArray().filter(veh => veh.entity).map(veh => veh.entity.model).filter(veh => veh && veh.toLowerCase() === item.model.toLowerCase()).length : 0;
    m.newItem({
        name: `Количество ТС`,
        more: `x${count}`
    })
    m.newItem({
        name: `Удалить конфиг`,
        more: `${item.model}`,
        onpress: () => {
            menu.accept(player, "Удалить модель?").then(status => {
                if (!status) return vehicleConfigEdit(player, item);
                vehicleConfigs.delete(item.id);
                player.notify("Конфиг удалён", "success");
                item.remove();
                configEditMain(player)
            }).catch(console.error);
        }
    })

    m.newItem({
        name: `Название ТС`,
        more: `${item.name}`,
        onpress: () => {
            menu.input(player, "Введите название", item.name, 200).then(val => {
                if (!val) return vehicleConfigEdit(player, item);
                item.name = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })

    m.newItem({
        name: `Гос.Стоимость`,
        more: `$${system.numberFormat(item.cost)}`,
        onpress: () => {
            menu.input(player, "Введите стоимость", item.cost, 10, "int").then(val => {
                if (typeof val !== "number") return vehicleConfigEdit(player, item);
                item.cost = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })

    m.newItem({
        name: `Множитель скорости`,
        more: `${item.multiple}`,
        desc: '100 - не ускорять',
        onpress: () => {
            menu.input(player, "Введите множитель", item.multiple, 10, "int").then(val => {
                if (typeof val !== "number") return vehicleConfigEdit(player, item);
                item.multiple = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })

    // m.newItem({
    //     name: `Количество на складе`,
    //     more: `${system.numberFormat(item.count)}`,
    //     onpress: () => {
    //         menu.input(player, "Введите количество", item.count, 10, "int").then(val => {
    //             if(typeof val !== "number") return vehicleConfigEdit(player, item);
    //             item.count = val;
    //             item.save().then((r) => {
    //                 player.notify("Параметр сохранён", "success");
    //                 vehicleConfigs.set(r.id, r);
    //                 reloadConfig(r)
    //                 vehicleConfigEdit(player, r);
    //             })
    //         }).catch(err => console.error(err))
    //     }
    // })

    m.newItem({
        name: `Багажник`,
        more: `${item.stock} кг`,
        onpress: () => {
            menu.input(player, "Введите объём багажника", item.stock.toString(), 100, "int").then(val => {
                if (!val) return vehicleConfigEdit(player, item);
                item.stock = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })
    m.newItem({
        name: `Наличие автопилота`,
        more: `${item.autopilot ? "Да" : "Нет"}`,
        onpress: () => {
            item.stock = item.autopilot ? 0 : 1;
            item.save().then((r) => {
                player.notify("Параметр сохранён", "success");
                vehicleConfigs.set(r.id, r);
                reloadConfig(r)
                vehicleConfigEdit(player, r);
            })
        }
    })

    const vehLicList: LicenceType[] = ["car", "moto", "air", "boat", "truck"]
    const vehLicListName = vehLicList.map((item, i) => LicenseName[vehLicList[i]])
    m.newItem({
        name: `Лицензия`,
        desc: "Этот параметр влияет на запрет использования транспорта в некоторых системах мода без наличия этой самой лицензии",
        type: "list",
        list: ["Не требуется", ...vehLicListName],
        listSelected: vehLicList.findIndex(q => q === item.license) + 1,
        onpress: (itm) => {
            if (itm.listSelected === 0) {
                (item.license as any) = ""
            } else {
                item.license = vehLicList[itm.listSelected - 1]
            }
            item.save().then((r) => {
                player.notify("Параметр сохранён", "success");
                vehicleConfigs.set(r.id, r);
                reloadConfig(r)
                vehicleConfigEdit(player, r);
            })
        }
    })

    m.newItem({
        name: `Объём топлива`,
        more: `${item.fuel_max} л`,
        onpress: () => {
            menu.input(player, "Введите объём топлива", item.fuel_max.toString(), 100, "int").then(val => {
                if (!val && val !== 0) return vehicleConfigEdit(player, item);
                item.fuel_max = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })

    if (item.fuel_max > 0) {
        m.newItem({
            name: `Расход топлива`,
            more: `${item.fuel_min} л`,
            onpress: () => {
                menu.input(player, "Введите объём топлива", item.fuel_min.toString(), 100, "int").then(val => {
                    if (!val && val !== 0) return vehicleConfigEdit(player, item);
                    item.fuel_min = val;
                    item.save().then((r) => {
                        player.notify("Параметр сохранён", "success");
                        vehicleConfigs.set(r.id, r);
                        reloadConfig(r)
                        vehicleConfigEdit(player, r);
                    })
                }).catch(err => console.error(err))
            }
        })
        m.newItem({
            name: `Тип топлива`,
            type: "list",
            list: fuelTypeNames,
            listSelected: item.fuel_type,
            onpress: (itm) => {
                item.fuel_type = itm.listSelected as any
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }
        })
    }

    m.newItem({
        name: 'Максимальная скорость',
        more: `${item.maxSpeed} км/ч`,
        desc: 'При 0 максимальная скорость остается по умолчанию',
        onpress: () => {
            menu.input(player, "Введите максимальную скорость", item.maxSpeed.toString(), 2000, "int").then(val => {
                if (!val && val !== 0) return vehicleConfigEdit(player, item);
                item.maxSpeed = val;
                item.save().then((r) => {
                    player.notify("Параметр сохранён", "success");
                    vehicleConfigs.set(r.id, r);
                    reloadConfig(r)
                    vehicleConfigEdit(player, r);
                })
            }).catch(err => console.error(err))
        }
    })

    m.open();
}


CustomEvent.registerClient('flyMode', (player: PlayerMp, status: boolean) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return player.notify("У вас нет доступа", "error")
    player.alpha = status ? 0 : 255;
});


CustomEvent.registerClient('admin:promocode', async player => {
    await promomenu(player);
})

export const tempPromo = {
    list: new Map<string, { label: TextLabelMp, sum: number }>(),
    add: (code: string, sum: number, pos: Vector3Mp) => {
        tempPromo.list.set(code.toUpperCase(), {
            label: mp.labels.new(`Промокод на ~g~$${system.numberFormat(sum)}\n~b~${code.toUpperCase()}`, pos, {
                drawDistance: 10,
                los: true
            }),
            sum
        })
    },
    get: (code: string) => {
        return tempPromo.list.get(code.toUpperCase())
    },
    delete: (code: string) => {
        const promo = tempPromo.get(code.toUpperCase());
        if (!promo) return;
        if (promo.label && mp.labels.exists(promo.label)) promo.label.destroy()
        tempPromo.list.delete(code.toUpperCase())
    }
}

const promomenu = async (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:promocode')) return player.notify('У вас нет доступа к управлению промокодами', 'error');
    const m = menu.new(player, 'Список промокодов');

    m.open();
}