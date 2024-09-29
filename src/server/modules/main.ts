import {CustomEvent} from "./custom.event";
import {account, User} from "./user";
import {MenuAdsEntity} from "./typeorm/entities/menu_ads";
import {menu} from "./menu";
import {getVipConfig, PACKETS, VipId} from "../../shared/vip";
import {DEFAULT_VEHICLE_PLAYER_LIMIT_MAX, getDonateItemConfig, MEDIA_PROMOCODE} from "../../shared/economy";
import {system} from "./system";
import {business} from "./business";
import {UserDatingEntity, UserEntity} from "./typeorm/entities/user";
import {OWNER_TYPES, PLAYER_INVENTORY_MAX_LEVEL} from "../../shared/inventory";
import {inventory} from "./inventory";
import {Family} from "./families/family";
import {RpHistoryEntity} from "./typeorm/entities/rp_history";
import {getX2Param} from "./usermodule/static";
import {PromocodeList, PromocodeUseEntity} from "./typeorm/entities/promocodes";
import {AccountEntity} from "./typeorm/entities/account";
import {SocketSyncWeb} from "./socket.sync.web";
import {dress} from "./customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../shared/cloth";
import {saveEntity} from "./typeorm";
import {CAR_FOR_PLAY_REWARD_MAX} from "../../shared/reward.time";
import {LicenceType} from "../../shared/licence";

CustomEvent.registerClient('admin:mainmenu:ads', player => {
    adsMenu(player);
})

const adsMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:mainmenu:ads')) return player.notify("У вас нет доступа", "error");
    let m = menu.new(player, "Каталог обявлений", "Список");
    m.newItem({
        name: "Новое объявление",
        onpress: () => {
            menu.input(player, "Введите заголовок", "", 60).then(title => {
                if(!title) return;
                menu.input(player, "Введите текст", "", 320, 'textarea').then(text => {
                    if (!text) return;
                    menu.selector(player, "Кнопка 'В магазин'", ["Нет", "Да"], true).then(async val => {
                        if(typeof val !== "number") return;
                        let item = new MenuAdsEntity();
                        item.title = title;
                        item.text = text;
                        if(val){
                            item.button = await menu.input(player, "Введите текст кнопки", "В магазин", 60);
                            if (!item.button) return player.notify('Отмена', 'error'), adsMenu(player);
                        }
                        item.pic = await menu.input(player, "Название файла картинки (Без .png, если не указать - картинки не будет)", "", 60);
                        if (val) item.pos = { x: player.position.x, y: player.position.y, z: player.position.z - 1 };
                        item.save().then(r => {
                            catalog.set(r.id, r);
                            player.notify("Объявление добавлено", "success");
                            return adsMenu(player);
                        })
                    })
                })
            })
        }
    })
    catalog.forEach(item => {
        m.newItem({
            name: item.title,
            desc: item.text,
            onpress: () => {
                let submenu = menu.new(player, "Действие над обявлением", item.title)
                submenu.newItem({
                    name: "Переименовать",
                    desc: item.title,
                    onpress: () => {
                        menu.input(player, "Введите новый заголовок", item.title, 60).then(val => {
                            if(!val) return adsMenu(player);
                            item.title = val;
                            item.save().then(() => {
                                player.notify("Значение сохранено", "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: "Сменить описание",
                    desc: item.text,
                    onpress: () => {
                        menu.input(player, "Введите новое описание", item.text, 320).then(val => {
                            if(!val) return adsMenu(player);
                            item.text = val;
                            item.save().then(() => {
                                player.notify("Значение сохранено", "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: "Сменить картинку",
                    desc: item.pic,
                    onpress: () => {
                        menu.input(player, "Название файла картинки (Без .png, если не указать - картинки не будет)", item.pic, 320).then(val => {
                            if(typeof val !== "string") return adsMenu(player);
                            item.pic = val;
                            item.save().then(() => {
                                player.notify("Значение сохранено", "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: item.pos ? "Сменить координаты на текущие" : "Установить координаты для навигатора",
                    onpress: () => {
                        item.pos = {x: player.position.x, y: player.position.y, z: player.position.z - 1};
                        item.save().then(() => {
                            player.notify("Координаты установлены", "success");
                            adsMenu(player);
                        })
                    }
                })
                if(item.pos){
                    submenu.newItem({
                        name: "Текст кнопки",
                        desc: item.button,
                        onpress: () => {
                            menu.input(player, "Введите новый текст кнопки", item.text, 320).then(val => {
                                if (!val) return adsMenu(player);
                                item.button = val;
                                item.save().then(() => {
                                    player.notify("Значение сохранено", "success");
                                    adsMenu(player);
                                })
                            })
                        }
                    })
                    submenu.newItem({
                        name: "~r~Удалить координаты",
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if(!status) return adsMenu(player);
                                item.pos = null;
                                item.save().then(() => {
                                    player.notify("Координаты удалены", "success");
                                    adsMenu(player);
                                })
                            })
                        }
                    })  
                }
                submenu.newItem({
                    name: "~r~Удалить объявление",
                    onpress: () => {
                        menu.accept(player).then(status => {
                            if (!status) return adsMenu(player);
                            const id = item.id;
                            item.remove().then(() => {
                                player.notify("Объявление удалено", "success");
                                catalog.delete(id);
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.open();
            }
        })
    })
    m.open();
}

let catalog = new Map<number, MenuAdsEntity>();


export const loadAdsDB = () => MenuAdsEntity.find().then(data => data.map(item => catalog.set(item.id, item)))

const getOnline = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    return mp.players.toArray().filter(pl => !!pl.dbid && !!pl.user).map(pl => {
        return [pl.dbid, pl.user.name, pl.user.level]
    }).sort((a, b) => {
        if (a[0] === user.id) return 1;
        else if (b[0] === user.id) return -1;
        else return ((b[2] as number) - (a[2] as number))
    })
}

const getRich = async (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const data = await UserEntity.find({
        take: 50,
        where: {admin_level: 0},
        order: {money: "DESC"}
    })
    return system.sortArrayObjects(data.map(q => {
        return [q.id, q.rp_name, q.money + q.bank_money]
    }), [
        {id: 2, type: "DESC"}
    ])
}
const getActive = async (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const data = await UserEntity.find({
        take: 50,
        where: {admin_level: 0},
        order: {level: "DESC"}
    })
    return system.sortArrayObjects(data, [
        {id: 'level', type: "DESC"},
        {id: 'exp', type: "DESC"},
    ]).map(q => {
        return [q.id, q.rp_name, q.level]
    })
}

const getBanlist = async () => {
    const data = await system.getLogsByType('AdminBan', 50)
    return data.map(q => {
        return [q.id, q.text, '']
    });
}

CustomEvent.registerCef('mainmenu:getRich', player => getRich(player))
CustomEvent.registerCef('mainmenu:getActive', player => getActive(player))
CustomEvent.registerCef('mainmenu:getOnline', player => getOnline(player))
CustomEvent.registerCef('mainmenu:getBanlist', () => getBanlist())
CustomEvent.registerCef('mainmenu:getFamilies', () => Family.getFamilyTop())

CustomEvent.registerClient('mainmenu:open', async (player, report = false) => {
    const user = player.user;
    if(!user) return;
    const biz = user.business;
    const house = user.houseEntity;
    const online = mp.players.length;
    const total = await UserEntity.count()
    CustomEvent.triggerClient(player, 'mainmenu:data', user.name, user.exp, user.level, user.wanted_level, user.wanted_reason, user.fraction, user.rank, [], biz ? biz.name : null, house ? `${house.name} #${house.id}` : null, [...catalog].map(q => {
        return {
            title: q[1].title,
            text: q[1].text,
            button: q[1].button,
            pic: q[1].pic,
            pos: q[1].pos,
        }
    }), user.vip, user.vip_end, user.donate_money, user.entity.warns.filter(q => q.time > system.timestamp).length, user.job, business.data.filter(q => q.donate).map(q => {
        return {x: q.positions[0].x, y: q.positions[0].y, name: q.name, type: q.type, sub_type: q.sub_type}
    }), user.bank_number, user.myBank ? {x: user.myBank.positions[0].x, y: user.myBank.positions[0].y} : null, getX2Param('donate'), online, total, getX2Param('playtime') && system.playtimeCanNow && User.playedTimeDay.find(q => q.id === player.user.account.id) ? User.playedTimeDay.find(q => q.id === player.user.account.id).time : null, getX2Param('playtimecar') && user.entity.playtimecar && !user.account.playtimecar ? user.entity.playtimecar : null, getX2Param('donate3'), user.entity.achievements, user.achiev.getTempAchievDataBlock(), user.account.promocode_my, user.account.promocode_my ? await PromocodeUseEntity.count({ code: user.account.promocode_my}) : 0, user.account.promocode_my_reward, report)
})

CustomEvent.registerCef('mainmenu:changePassword', (player, old_password: string, new_password: string) => {
    const user = player.user;
    if (!user) return;
    if (user.password != account.hashPassword(old_password)) return false
    user.newPassword(new_password);
    return true;
})
CustomEvent.registerCef('mediapromo:takereward', async (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if(id !== user.account.promocode_my_reward) return;
    const cfg = MEDIA_PROMOCODE.REWARD_STAGE_LIST[id];
    if(!cfg) return;
    const count = user.account.promocode_my ? await PromocodeUseEntity.count({ code: user.account.promocode_my}) : 0
    if(count < cfg.count) return;
    user.account.promocode_my_reward++;
    if(id === 0) user.addMoney(cfg.data, true, 'Награда за партнерскую програму');
    if(id === 1) {
        user.giveVip('Diamond', 30);
        player.notify(`Вы получили Diamond VIP на 30 дней!`)
    }
    if(id === 2) {
        user.account.freeFamily++;
    }
    if(id === 3) {
        ["reanimation","car","moto","truck","weapon","med",].map(l => user.giveLicense(<LicenceType>l, 30))
    }
    if(id === 4) inventory.createItem({
        owner_type: OWNER_TYPES.PLAYER,
        owner_id: user.id,
        item_id: 866,
        advancedNumber: user.id,
        advancedString: 'veh|'+cfg.data
    })
    saveEntity(user.account);
    player.notify('Награда успешно получена', 'success');
    SocketSyncWeb.fireTarget(player, 'mymediapromo', JSON.stringify({promocodeMy: user.account.promocode_my, promocodeMyCount: count, promocodeMyRewardGived: user.account.promocode_my_reward}))
})
CustomEvent.registerCef('mediapromo:create', (player, newpromo: string) => {
    const user = player.user;
    if (!user) return;
    if(newpromo) newpromo = system.filterInput(newpromo);
    if (!newpromo) return player.notify("Необходимо указать промокод", 'error')
    if(user.account.promocode_my) return player.notify("У вас уже есть промокод", 'error')
    AccountEntity.find({ promocode_my: newpromo }).then(async dublicate => {
        if (!mp.players.exists(player)) return;
        if(user.account.promocode_my) return player.notify("У вас уже есть промокод", 'error')
        if (dublicate.length > 0) {
            if (dublicate.length > 0) return player.notify('Данный промокод уже используется', "error");
        }
        if ((await PromocodeList.count({ code: newpromo })) > 0) return player.notify('Указанный промокод уже используется', "error")
        if ((await PromocodeUseEntity.count({ code: newpromo })) > 0) return player.notify('Указанный промокод уже используется', "error")
        user.account.promocode_my = newpromo;
        user.account.save().then(() => {
            if (!mp.players.exists(player)) return;
            player.notify('Новый промокод успешно указан')
        })
    })
})


CustomEvent.registerCef('mainmenu:buyVip', (player, id: VipId, month: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = getVipConfig(id);
    if(!cfg) return player.notify('ВИП тариф выбран не верно', 'error');
    const cost = cfg.cost * month;
    if(user.donate_money < cost) return player.notify(`У вас недостаточно средств для покупки ${cfg.name} на указанный период`, 'error');
    user.giveVip(id, month * 30)
    user.removeDonateMoney(cost, 'Купил вип статус')
    user.save();
    player.notify(`${cfg.name} успешно приобретён`, 'success');
    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})
CustomEvent.registerCef('mainmenu:buyShop', async (player, id: number, value?: any) => {
    const user = player.user;
    if(!user) return;
    const cfg = getDonateItemConfig(id);
    if(!cfg) return player.notify('Донат услуга выбрана не верно', 'error');
    if(id == 4){
        if (!value || isNaN(value) || value < 1) return player.notify('Сумма для обмена указана не верно', 'error');
        const cost = value * cfg.price;
        if (user.donate_money < value) return player.notify(`У вас недостаточно средств для обмена такого количества коинов`, 'error');
        user.removeDonateMoney(value, 'Обмен коинов')
        let sum = cost;
        if(getX2Param('donate')) sum *= 2;
        if(getX2Param('donate3')) sum *= 3;
        user.addMoney(sum, true, 'Обмен коинов');
        user.save();
    } else if(id == 3){
        if(!player.user.mp_character) return player.notify('Вы не можете сменить внешность пока используется не стандартный скин', 'error')
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для смены внешности`, 'error');
        user.removeDonateMoney(cfg.price, 'Сменил внешность')
        user.skin = null;
        user.save();
        user.startCustomization();

        UserDatingEntity.delete({target: {id: user.id}})
    } else if(id == 2){
        const warns = [...user.entity.warns];
        const index = warns.findIndex(q => q.time > system.timestamp)
        if (!user.haveActiveWarns || index == -1) return player.notify('У вас нет активного варна', 'error');
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для снятия варна`, 'error');
        warns.splice(index, 1);
        user.entity.warns = warns;
        user.removeDonateMoney(cfg.price, 'Снял варн')
        player.notify('Активный варн был снят', 'success')
        user.save();
    } else if(id == 1){
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для смены имени`, 'error');
        if(value.split(' ').length !== 2) return player.notify("Введите имя и фамилию через пробел на латинице", 'error');
        const [name, fam] = value.split(' ');
        if(!name.match(/^[a-zA-Z]{0,20}$/i)) return player.notify('Только латиница', 'error')
        if(!fam.match(/^[a-zA-Z]{0,20}$/i)) return player.notify('Только латиница', 'error')
        const exists = !!(await UserEntity.count({ rp_name: `${value}` }))
        if(exists) return player.notify(`Данное имя уже зарегистрировано`, 'error');
        user.removeDonateMoney(cfg.price, 'Сменил имя')
        user.name = value;
        player.notify('Вы успешно сменили имя', 'success')
        RpHistoryEntity.delete({user: {id: user.id}})
        UserDatingEntity.delete({user: {id: user.id}})
        UserDatingEntity.delete({target: {id: user.id}})
        user.save();
    } else if(id == 5){
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для смены возраста`, 'error');
        user.removeDonateMoney(cfg.price, 'Сменил возраст')
        if(value < 18 || value > 77) return player.notify('Допускается возраст от 18 до 77', 'error');
        user.age = value;
        player.notify('Вы успешно сменили возраст', 'success')
        user.save();
    } else if(id == 7){
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для покупки места в инвентаре`, 'error');
        if (user.entity.inventory_level >= PLAYER_INVENTORY_MAX_LEVEL) return player.notify(`Уровень инвентаря достиг максимального уровня`, 'error');
        user.entity.inventory_level++;
        user.removeDonateMoney(cfg.price, 'Увеличил инвентарь')
        player.notify(`Инвентарь успешно увеличен`, 'success')
        user.save();
        if(player.openInventory) return inventory.reloadInventory(player)
    } else if(id == 6){
        if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для покупки дополнительного слота ТС`, 'error');
        if(user.current_vehicle_limit >= DEFAULT_VEHICLE_PLAYER_LIMIT_MAX) return player.notify(`Максимально можно иметь только ${DEFAULT_VEHICLE_PLAYER_LIMIT_MAX} ТС`, "error");
        user.removeDonateMoney(cfg.price, 'Приобрёл дополнительный слот ТС')
        user.addVehicleLimit();
        player.notify(`Дополнительный слот для ТС успешно приобретён. Теперь вам доступно ${user.current_vehicle_limit} слотов`, 'success')
        user.save();
    }
    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})

CustomEvent.registerCef('mainmenu:buyPacket', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = PACKETS.find(q => q.id === id);
    if(!cfg) return;
    if (user.donate_money < cfg.price) return player.notify(`У вас недостаточно средств для покупки пакета`, 'error');
    user.removeDonateMoney(cfg.price, 'Купил донат пакет '+(cfg.name))
    const item = cfg.items
    if(item.vip) user.giveVip(item.vip.type, item.vip.time * 30);
    if(item.licenses) item.licenses.map(lic => user.giveLicense(lic.id, lic.days))
    if(item.money) user.addMoney(item.money, true, `Покупка донат пакета ${cfg.name}`);
    if(item.items) item.items.map(q => user.giveItem(q))
    user.save();
    player.notify(`Пакет успешно приобретён`, 'success')

    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})