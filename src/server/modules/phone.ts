import {inventory} from "./inventory"
import {OWNER_TYPES} from "../../shared/inventory"
import {MessagesEntity, PhoneEntity} from "./typeorm/entities/phoneData";
import {CustomEvent} from "./custom.event";
import {PhoneHistory, PhoneSettings} from "../../shared/phone";
import {system} from "./system";
import {SMS_COST, VOICE_CONNECT_COST, VOICE_MINUTE_COST} from "../../shared/economy";
import {User} from "./user";
import {business} from "./business";
import {IventClass} from "./invent";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE_CATEGORIES, BUSINESS_TYPE_NAMES} from "../../shared/business";
import {houses} from "./houses";
import {parking} from "./businesses/parking";
import {TaxCategory} from "../../shared/phone/taxCategory.enum";
import {GPSPointData, GPSPointType, LocationCategoryEnum} from "../../shared/phone/locationCategories.enum";
import PhoneCryptoData from "../../shared/phone/phoneCryptoData";
import {MiningStats} from "./mining";
import PhoneHealthData from "../../shared/phone/phoneHealthData";
import {getMaxExpLevel} from "../../shared/payday";
import {phoneMessenger} from "./phone.messenger";

export const phone = {
    removeMoney: (player: PlayerMp, number: number, sum: number) => {
        const user = player.user;
        if(!user) return;
        const phone = user.inventory.find(q => q.advancedNumber === number && q.item_id === 850);
        if(!phone) return;
        let currentSum = parseInt(phone.advancedString);
        if (isNaN(currentSum) || typeof currentSum !== "number") currentSum = 0;
        currentSum -= sum;
        phone.advancedString = `${currentSum}`;
        phone.save();
        if (player.phoneCurrent === phone.id) CustomEvent.triggerCef(player, 'phone:updateBalance', phone.id, currentSum);
    },
    addMoney: (player: PlayerMp, number: number, sum: number) => {
        const user = player.user;
        if(!user) return;
        const phone = user.inventory.find(q => q.advancedNumber === number && q.item_id === 850);
        if(!phone) return;
        let currentSum = parseInt(phone.advancedString);
        if (isNaN(currentSum) || typeof currentSum !== "number") currentSum = 0;
        currentSum += sum;
        phone.advancedString = `${currentSum}`;
        phone.save();
        if (player.phoneCurrent === phone.id) CustomEvent.triggerCef(player, 'phone:updateBalance', phone.id, currentSum);
    },
    callSessionIds: 1,
    callSession: new Map<number, {
        senderNumber: number,
        targetNumber: number,
        senderPlayer: PlayerMp,
        targetPlayer: PlayerMp,
        started: boolean,
        startTime?: number,
        id: number
    }>(),
    newCallSession: (senderNumber: number, senderPlayer: PlayerMp, targetNumber: number, targetPlayer: PlayerMp) => {
        const id = phone.callSessionIds;
        phone.callSession.set(id, {
            senderNumber, senderPlayer, targetNumber, targetPlayer, id, started: false
        })
        return phone.callSession.get(id);
        phone.callSessionIds++;
    },
    getPhoneEntity: (id: number, create = true): Promise<PhoneEntity> => {
        return new Promise((resolve, reject) => {
            PhoneEntity.findOne({ phone: id }).then(async res => {
                if (!res && create) {
                    res = new PhoneEntity();
                    res.phone = id;
                    res.contacts = [];
                    res.history = [];
                    res.blocked = [];
                    res.settings = {
                        sound: false,
                        aviamode: false,
                        dark: false,
                        big: false
                    };
                    res.save();
                }
                return resolve(res)
            })
        })
    },
    loadSoundSettings: () => {
        PhoneEntity.find().then(list => {
            list.map(item => {
                phone.soundSetting.set(item.id, !!item.settings.sound)
            })
        })
    },
    soundSetting: new Map<number, boolean>(),
    openPhone: (player: PlayerMp, id: number) => {
        const user = player.user;
        if(!user) return;
        if(player.phoneSession) return player.notify("Нельзя использовать телефон во время разговора", "error")
        const item = user.inventory.find(q => q.id === id);
        if(!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");

        if(!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
        PhoneEntity.findOne({phone: id}).then(async res => {
            if(!res){
                res = new PhoneEntity();
                res.phone = id;
                res.contacts = [];
                res.history = [];
                res.settings = {
                    sound: false,
                    aviamode: false,
                    dark: false,
                    big: false
                };
                res.save();
            }
            phone.soundSetting.set(id, !!res.settings.sound)
            const taxesList: [string, number][] = [];
            if (user.house) taxesList.push([TaxCategory.Home, user.houseEntity.taxMax - user.houseEntity.tax < 0 ? 0 : user.houseEntity.taxMax - user.houseEntity.tax]);
            if (user.warehouse) taxesList.push([TaxCategory.Warehouse, user.warehouseEntity.taxMax - user.warehouseEntity.tax < 0 ? 0 : user.warehouseEntity.taxMax - user.warehouseEntity.tax]);
            if (user.business) taxesList.push([TaxCategory.Business, user.business.taxMax - user.business.tax < 0 ? 0 : user.business.taxMax - user.business.tax]);
            const cryptoData: PhoneCryptoData = { cryptoBalance: user.crypto, dailyWithdrawal: MiningStats.cryptoDailyWithdrawal }
            //CustomEvent.triggerCef(player, 'phone:open', id, res.contacts, res.settings, item.advancedNumber, parseInt(item.advancedString), res.history, dialogs, res.blocked);
            CustomEvent.triggerCef(player, 'phone:open', 
                id, 
                res.contacts, 
                item.advancedNumber, // Номер симкарты
                parseInt(item.advancedString), // Баланс на симке
                taxesList,
                res.history,
                res.settings,
                cryptoData,
                //res.blocked
            );
            player.phoneCurrent = id;
        })
    },
    setNewSettings: (player: PlayerMp, id: number, settings: PhoneSettings) => {
        const user = player.user;
        if (!user) return;
        const item = user.inventory.find(q => q.id === id);
        if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");

        if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
        phone.soundSetting.set(id, !!settings.sound)
        PhoneEntity.findOne({ phone: id }).then(res => {
            if (!res) {
                res = new PhoneEntity();
                res.phone = id;
            }
            res.settings = settings
            res.save();
        })
    },
    // loadMessages: (player: PlayerMp, id: number, number: number) => {
    //     const user = player.user;
    //     if (!user) return;
    //     const item = user.inventory.find(q => q.id === id);
    //     if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");
    //
    //     if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
    //
    //     MessagesEntity.find({
    //         where: [{ sender: number, target: item.advancedNumber }, { target: number, sender: item.advancedNumber}],
    //         order: {id: "DESC"}
    //     }).then(res => {
    //         let data: [number, string, string, boolean, string?][] = [];
    //         res.reverse().map((item, index) => {
    //             if(item.sender === number){
    //                 item.read_data = 1;
    //                 item.save();
    //             }
    //             if(index > 50) return;
    //             data.push([item.sender, item.text, item.time, item.read, item.gps])
    //         })
    //         CustomEvent.triggerCef(player, 'phone:loadMessages', item.advancedNumber, number, data);
    //     })
    // },
    // sendMessage: async (player: PlayerMp, id: number, number: number, target: number, text: string, withGps = false) => {
    //     const user = player.user;
    //     if (!user) return;
    //     const item = user.inventory.find(q => q.id === id);
    //     if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");
    //
    //     if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
    //
    //     const targetPhone = [...inventory.data].map(q => q[1]).filter(q => q.item_id === 850).find(q => q.advancedNumber === target);
    //     if (!targetPhone) return user.notifyPhone("Сообщение", `Ошибка отправки сообщения`, `Сообщение не было доставлено. Указанный номер телефона не обслуживается`);
    //     const targetPhoneEnt = await phone.getPhoneEntity(targetPhone.id)
    //     if (targetPhoneEnt.blocked.find(q => q === number)) return user.notifyPhone("Сообщение", `Ошибка отправки сообщения`, `Сообщение не было доставлено. Получатель заблокировал ваш номер`)
    //     phone.removeMoney(player, number, SMS_COST)
    //     const newMessage = new MessagesEntity();
    //     if (withGps) newMessage.gps = `${Math.floor(player.position.x)}|${Math.floor(player.position.y)}`
    //     newMessage.sender = number;
    //     newMessage.target = target;
    //     newMessage.text = text;
    //     newMessage.timestamp = system.timestamp
    //     newMessage.time = system.fullDateTime
    //     newMessage.save().then(async res => {
    //         const targetPhone = [...inventory.data].map(q => q[1]).filter(q => q.item_id === 850).find(q => q.advancedNumber === target);
    //         if(!targetPhone) return;
    //         if(targetPhone.owner_type !== OWNER_TYPES.PLAYER) return;
    //         const targetUser = mp.players.toArray().find(q => q.dbid === targetPhone.owner_id);
    //         if(!targetUser || !mp.players.exists(targetUser)) return;
    //         if (targetUser.phoneReadMessage != number) return targetUser.user.notifyPhone("Сообщение", `${(await phone.getContactName(targetPhone.id, number)) || "Неизвестный"} (${number})`, `${text}`);
    //         phone.loadMessages(targetUser, targetUser.phoneCurrent, number);
    //     })
    //
    //
    // },
    getContactName: (id: number, number: number):Promise<string> => {
        return new Promise((resolve, reject) => {
            PhoneEntity.findOne({ phone: id }).then(res => {
                if (!res) {
                    resolve(null)
                } else {
                    const contact = res.contacts.find(q => q[1] === number);
                    resolve(contact ? contact[0] : null)
                }
            })
        })
    },
    sendAlert(player: PlayerMp, id: number){
        const user = player.user;
        if (!user) return;
        const item = user.inventory.find(q => q.id === id);
        if (!item) return;

        if (!item.advancedNumber) return;
        PhoneEntity.findOne({ phone: id }).then(res => {
            if (!res) {
                res = new PhoneEntity();
                res.phone = id;
                res.save();
            }

            if(res.settings.aviamode) return;
            if(res.settings.sound) return;
        })
    },

    newContact: (player: PlayerMp, id: number, name: string, number: number) => {
        const user = player.user;
        if (!user) return;
        const item = user.inventory.find(q => q.id === id);
        if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");

        if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
        PhoneEntity.findOne({ phone: id }).then(async res => {
            if (!res) {
                res = new PhoneEntity();
                res.phone = id;
            }
            const contacts = [...res.contacts];
            contacts.push([name, number])
            res.contacts = contacts;
            res.save();
        })
        
        CustomEvent.triggerCef(player, 'phone:contactAdd:success', name, number);
    },
    removeContact: (player: PlayerMp, id: number, number: number) => {
        const user = player.user;
        if (!user) return;
        const item = user.inventory.find(q => q.id === id);
        if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");

        if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
        PhoneEntity.findOne({ phone: id }).then(async res => {
            if (!res) {
                res = new PhoneEntity();
                res.phone = id;
            }
            const contacts = [...res.contacts];
            if(contacts.findIndex(q => q[1] === number) > -1) contacts.splice(contacts.findIndex(q => q[1] === number), 1)
            res.contacts = contacts;
            res.save();
        })

        CustomEvent.triggerCef(player, 'phone:contactRemove:success', number);
    },
    writePhoneHistory: (number: number, data: PhoneHistory) => {
        const targetPhone = [...inventory.data].map(q => q[1]).filter(q => q.item_id === 850).find(q => q.advancedNumber === number);
        if(!targetPhone) return;
        PhoneEntity.findOne({ phone: targetPhone.id }).then(async res => {
            if (!res) return;
            const history = [...res.history];
            history.unshift(data);
            history.splice(10, 10);
            res.history = history;
            res.save();
        })
    },
    loadBankHistory(player: PlayerMp){
        if(!player.phoneCurrent) return;
        player.user.getBankHistory().then(res => {
            CustomEvent.triggerCef(player, "phone:bankData", player.user.bank_number, player.user.bank_tarif, res)
        })
    },
    loadGps: (player: PlayerMp) => {
        const user = player.user;
        const house = user.houseEntity;
        const warehouse = user.warehouseEntity;
        const familyHouse = user?.family?.house;
        const res: {
            name: string,
            id: string,
            cats: {
                name: string,
                items: [string, number, number, number][]
            }[]
        }[] = []

        let realty: [string, number, number, number][] = [];
        if (house) realty.push([`Дом ${house.name} #${house.id}`, house.x, house.y, house.z]);
        if (familyHouse) realty.push([`Семейный дом ${familyHouse.name} #${familyHouse.id}`, familyHouse.x, familyHouse.y, familyHouse.z]);
        if (warehouse) realty.push([`Склад #${warehouse.id}`, warehouse.x, warehouse.y, warehouse.z]);

        let realtyBiz: [string, number, number, number][] = [];
        const biz = user.myBank
        if (biz){
            if (biz) realtyBiz.push([`Мой банк ${biz.name} #${biz.id}`, biz.positions[0].x, biz.positions[0].y, biz.positions[0].z]);
        }
        const myBiz = user.business;
        if(myBiz){
            realtyBiz.push([`Мой бизнес ${myBiz.name} #${myBiz.id}`, myBiz.positions[0].x, myBiz.positions[0].y, myBiz.positions[0].z]);
        }

        const vehsData: [string, number, number, number][] = [];
        user.myVehicles.filter(q => !q.onParkingFine).map(q => {
            let pos: { x: number, y: number, z: number };
            if (!q.exists) return;
            if (q.vehicle.usedAfterRespawn) {
                pos = { x: q.vehicle.position.x, y: q.vehicle.position.y, z: q.vehicle.position.y }
            } else if (!q.onParkingFine) {
                if (q.spawnPointType === "house") {
                    const house = houses.get(q.position.d);
                    if (house) {
                        pos = { x: house.car_x, y: house.car_y, z: house.car_z };
                    }
                } else {
                    const p = parking.getParkingFromDimension(q.position.d);
                    if (p) {
                        pos = { x: p.positions[0].x, y: p.positions[0].y, z: p.positions[0].y };
                    }
                }
            }
            if(pos){
                vehsData.push([`${q.name} ${q.number}`, pos.x, pos.y, pos.z])
            }
        })

        res.push({
            name: "Личные",
            id: "realty",
            cats: [
                {
                    name: "Недвижимость",
                    items: realty
                },
                {
                    name: "Бизнес и услуги",
                    items: realtyBiz
                },
                {
                    name: "Транспорт",
                    items: vehsData
                },
            ]
        })



        const bizes = business.data.map(item => {
            const { id, type, sub_type } = item;
            const { x, y, z } = item.positions[0]
            return { id, type, sub_type, x, y, z }
        })

        BUSINESS_TYPE_NAMES.map((category, type) => {
            let cats: {
                name: string,
                items: [string, number, number, number][]
            }[] = []
            BUSINESS_SUBTYPE_NAMES[type].map((name, subtype) => {
                cats.push({
                    name, items: bizes.filter(itm => itm.type === type && itm.sub_type === subtype).map(item => [`${name} #${item.id}`, item.x, item.y, item.z])
                })
            })
            res.push({
                name: category,
                id: "biz_"+type,
                cats
            })
        })
        
        const list = IventClass.pool.filter(itm => itm.exist).map(item => {
            return {
                id: item.id, name: item.name, author: item.author, created: item.createTime, end: item.endTime, type: item.type, pos: item.pos, count: mp.players.toArray().filter(target => target.dimension === item.world).length
            }
        })
        CustomEvent.triggerCef(player, 'phone:gpsData', res, list)
    }
}

CustomEvent.registerCef('phone:setGps', (player, id) => {
    if (!player.user) return;
    const biz = business.data.find(business => business.id === id);
    if (!biz) return;
    player.user.setWaypoint(biz.positions[0].x, biz.positions[0].y, biz.positions[0].z, 'Метка GPS', true)
})

CustomEvent.registerCef('gps:markClosestBank', (player) => {
   const bank = player.user?.myBank;
   if (!bank) return player.notify('У вас нет банка', 'error');
    player.user.setWaypoint(bank.positions[0].x, bank.positions[0].y, bank.positions[0].z, 'Метка GPS', true)
})

CustomEvent.registerCef('phone:loadGpsData', player => {
    const bizes = business.data.map(item => {
        const { id, type, sub_type } = item;
        const pos = item.positions[0];
        return { id, type, sub_type, pos }
    })
    
    const points: GPSPointData[] = [];
    BUSINESS_TYPE_CATEGORIES.map((category, type) => {
        BUSINESS_SUBTYPE_NAMES[type].map((name, subtype) => {
            const bizData = bizes.filter(itm => itm.type === type && itm.sub_type === subtype);
            if (bizData){
                bizData.map(b => {
                    points.push({ 
                        id: b.id, 
                        type: GPSPointType.Business,
                        distance: parseFloat(system.distanceToPos2D(player.position, b.pos).toFixed(0)), 
                        name: name, 
                        category: BUSINESS_TYPE_CATEGORIES[type] 
                    })
                })
            }
        })
    })

    IventClass.pool.filter(itm => itm.exist).map(item => {
        points.push({
            type: GPSPointType.Event,
            id: item.id,
            name: item.name,
            distance: parseFloat(system.distanceToPos2D(player.position, item.pos).toFixed(0)),
            category: LocationCategoryEnum.Events
        })
    })

    CustomEvent.triggerCef(player, 'phone:gpsData', points);
})

CustomEvent.registerClient('phone:openPhone', player => {
    const phoneItem = player.user.inventory.find(q => q.item_id === 850);
    if (!phoneItem) return;
    if (!player.phoneCurrent){
        const item = player.user.inventory.find(e => e.id === phoneItem.id);
        phone.openPhone(player, item.id)
    } else {
        CustomEvent.triggerCef(player, 'phone:closephone');
        player.phoneReadMessage = null;
        player.phoneCurrent = null;
    }
})

CustomEvent.registerCef('phone:loadBankHistory', player => {
    if(!player.phoneCurrent) return;
    if(!player.user.bank_number) return;
    phone.loadBankHistory(player);
})

CustomEvent.registerCef('phone:sendMoney', (player, number: string, sum: number) => {
    if(!player.phoneCurrent) return;
    if(!player.user.bank_number) return;
    User.sendMoney(player, sum, number)
})

CustomEvent.registerCef('phone:requestHealth', (player) => {
    const user = player.user;
    if (!user) return;
    const data: PhoneHealthData = { 
        health: player.user.health * 10,
        level: user.level, 
        exp: user.exp, 
        hunger: user.food, 
        thirst: user.water,
        maxExp: getMaxExpLevel(user.level)
    };
    
    CustomEvent.triggerCef(player, 'phone:healthData', data);
})

CustomEvent.registerCef('phone:payTax', (player, taxCategory: TaxCategory, taxSum: number) => {
    if(!player.phoneCurrent) return;
    if(!player.user.bank_number) return;
    const user = player.user;
    if (taxCategory === TaxCategory.Business) {
        if (user.business){
            const withdrawAmount = user.business.taxMax - user.business.tax;
            if (withdrawAmount <= 0) return player.notify("Бизнес проплачен на максимум", "error");
            if (!user.tryRemoveBankMoney(withdrawAmount, false, `Оплата налогов на бизнес #${user.business.id}`, 'Налоговая служба'))
                return player.notify("Недостаточно средств на банковском счету", "error");
            user.business.tax = user.business.taxMax;
            user.business.save();
        }
    }

    if (taxCategory === TaxCategory.Warehouse) {
        if (user.warehouse){
            const withdrawAmount = user.warehouseEntity.taxMax - user.warehouseEntity.tax;
            if (withdrawAmount <= 0) return player.notify("Склад проплачен на максимум", "error");
            if (!user.tryRemoveBankMoney(withdrawAmount, false, `Оплата налогов на склад #${user.warehouseEntity.id}`, 'Налоговая служба'))
                return player.notify("Недостаточно средств на банковском счету", "error");
            user.warehouseEntity.tax = user.warehouseEntity.taxMax;
            user.warehouseEntity.save();
        }
    }

    if (taxCategory === TaxCategory.Home) {
        if (user.house){
            const withdrawAmount = user.houseEntity.taxMax - user.houseEntity.tax;
            if (withdrawAmount <= 0) return player.notify("Дом проплачен на максимум", "error");
            if (!user.tryRemoveBankMoney(withdrawAmount, false, `Оплата налогов на дом #${user.houseEntity.id}`, 'Налоговая служба'))
                return player.notify("Недостаточно средств на банковском счету", "error");
            user.houseEntity.tax = user.houseEntity.taxMax;
            user.houseEntity.save();
        }
    }

    player.notify("Налоги успешно оплачены");
    CustomEvent.triggerCef(player, 'phone:payTax:success', taxCategory);
})

const emergencyNumberCheck = (player: PlayerMp, number: number): boolean  => {
    if(number === 100){
        CustomEvent.triggerClient(player, "phone:requestTaxi");
        CustomEvent.triggerCef(player, 'phone:closephone');
        return false;
    }
    if(number === 101){
        CustomEvent.triggerClient(player, "phone:requestPolice");
        CustomEvent.triggerCef(player, 'phone:closephone');
        return false;
    }
    if(number === 102){
        CustomEvent.triggerClient(player, "phone:requestEms");
        CustomEvent.triggerCef(player, 'phone:closephone');
        return false;
    }
    if(number === 103){
        CustomEvent.triggerClient(player, "phone:requestNews");
        CustomEvent.triggerCef(player, 'phone:closephone');
        return false;
    }
    return true;
}

CustomEvent.registerCef("phone:requestCall", async (player, id: number, number: number) => {
    if (player.phoneSession) return;
    const user = player.user;
    if (!user) return;
    const item = user.inventory.find(q => q.id === id);
    if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");

    if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
    if (!emergencyNumberCheck(player, number)) return;
    
    const targetPhone = [...inventory.data].map(q => q[1]).filter(q => q.item_id === 850).find(q => q.advancedNumber === number);
    if (!targetPhone){
        return player.notify("Телефон указан не верно либо не активирован", "error");
    }
    if (targetPhone.owner_type !== OWNER_TYPES.PLAYER){
        phone.writePhoneHistory(targetPhone.advancedNumber, {
            type: "tommeMissed",
            time: system.fullDateTime,
            number: item.advancedNumber,
            count: 0
        })
        phone.writePhoneHistory(item.advancedNumber, {
            type: "frommeC",
            time: system.fullDateTime,
            number: targetPhone.advancedNumber,
            count: 0
        })
        return player.notify("Телефон вне зоны действия сети", "error");
    }
    const targetUser = mp.players.toArray().find(q => q.dbid === targetPhone.owner_id);
    if (!targetUser || !mp.players.exists(targetUser)){
        phone.writePhoneHistory(targetPhone.advancedNumber, {
            type: "tommeMissed",
            time: system.fullDateTime,
            number: item.advancedNumber,
            count: 0
        })
        phone.writePhoneHistory(item.advancedNumber, {
            type: "frommeC",
            time: system.fullDateTime,
            number: targetPhone.advancedNumber,
            count: 0
        })
        return player.notify("Телефон вне зоны действия сети", "error")
    }
    if (targetUser.phoneSession){
        phone.writePhoneHistory(targetPhone.advancedNumber, {
            type: "tommeMissed",
            time: system.fullDateTime,
            number: item.advancedNumber,
            count: 0
        })
        phone.writePhoneHistory(item.advancedNumber, {
            type: "frommeC",
            time: system.fullDateTime,
            number: targetPhone.advancedNumber,
            count: 0
        })
        return player.notify("Абонент сейчас разговаривает", "error")
    }
    const targetPhoneData = await phone.getPhoneEntity(targetPhone.id);
    if (!targetPhoneData) return CustomEvent.triggerCef(player, "phone:callAborted")
    if (targetPhoneData.blocked.find(q => q === item.advancedNumber)){
        phone.writePhoneHistory(item.advancedNumber, {
            type: "frommeC",
            time: system.fullDateTime,
            number: targetPhone.advancedNumber,
            count: 0
        })
        return player.notify("Абонент отклонил вызов", "error")
    }
    const session = phone.newCallSession(item.advancedNumber, player, number, targetUser);

    player.phoneSession = session;
    targetUser.phoneSession = session;

    const contact = await phone.getContactName(targetPhone.id, item.advancedNumber)
    const contactTarget = await phone.getContactName(item.id, number)

    CustomEvent.triggerCef(targetUser, "phone:requestCall", contact ? contact : item.advancedNumber.toString());
    CustomEvent.triggerCef(player, "phone:startCallTo", contactTarget ?? number.toString());
})

mp.events.add('playerQuit', player => {
    cancelCall(player);
})

const cancelCall = (player: PlayerMp) => {
    const session = player.phoneSession;
    if (!session) return;
    if (!session.started) {
        if(mp.players.exists(player)) CustomEvent.triggerCef(player, "phone:callAborted");
        const target = [session.senderPlayer, session.targetPlayer].find(target => mp.players.exists(target) && target.id != player.id);
        if (target) CustomEvent.triggerCef(target, "phone:callAborted");
    } else {
        [session.senderPlayer, session.targetPlayer].map(target => {
            if (mp.players.exists(target)) CustomEvent.triggerCef(target, "phone:callAborted");
        })
        if (mp.players.exists(session.senderPlayer)) phone.removeMoney(session.senderPlayer, session.senderPlayer.phoneCurrent, VOICE_MINUTE_COST * Math.floor((system.timestamp - session.startTime) / 60))
    }
    [session.senderPlayer, session.targetPlayer].map(target => {
        if (mp.players.exists(target)) target.phoneSession = null;
    })



    phone.writePhoneHistory(session.senderNumber, {
        type: session.started ? "fromme" : "frommeC",
        time: system.fullDateTime,
        number: session.targetNumber,
        count: session.startTime ? system.timestamp - session.startTime : 0
    })
    phone.writePhoneHistory(session.targetNumber, {
        type: session.started ? "tome" : "tommeMissed",
        time: system.fullDateTime,
        number: session.senderNumber,
        count: session.startTime ? system.timestamp - session.startTime : 0
    })


    // if (mp.players.exists(session.senderPlayer) && mp.players.exists(session.targetPlayer)) {
    //     session.senderPlayer.disableVoiceTo(session.targetPlayer)
    //     session.targetPlayer.disableVoiceTo(session.senderPlayer)
    // }

    if (mp.players.exists(session.senderPlayer)) session.senderPlayer.call('callStop')
    if (mp.players.exists(session.targetPlayer)) session.targetPlayer.call('callStop')

    
    phone.callSession.delete(session.id);
}

CustomEvent.registerCef('phone:requestCall:no', player => {
    cancelCall(player);
})
CustomEvent.registerCef('phone:addBlocked', (player, id: number, number: number) => {
    if (player.phoneCurrent !== id) return;
    phone.getPhoneEntity(player.phoneCurrent).then(ent => {
        const blocked = [...ent.blocked];
        if(blocked.find(q => q === number)) return;
        blocked.push(number);
        ent.blocked = blocked;
        ent.save();
    })
})
CustomEvent.registerCef('phone:removeBlocked', (player, id: number, number: number) => {
    if (player.phoneCurrent !== id) return;
    phone.getPhoneEntity(player.phoneCurrent).then(ent => {
        const blocked = [...ent.blocked];
        if(!blocked.find(q => q === number)) return;
        if(blocked.findIndex(q => q === number) > -1) blocked.splice(blocked.findIndex(q => q === number), 1)
        ent.blocked = blocked;
        ent.save();
    })
})
CustomEvent.registerCef('phone:requestCall:yes', player => {
    const session = player.phoneSession;
    if(!session) return;


    if(session.started) return;
    let can = true;
    [session.senderPlayer, session.targetPlayer].map(target => {
        if (!mp.players.exists(target)) can = false
    })
    if(!can) return cancelCall(player);

    phone.removeMoney(session.senderPlayer, session.senderPlayer.phoneCurrent, VOICE_CONNECT_COST)

    session.started = true;
    session.startTime = system.timestamp;

    session.senderPlayer.call('callStart', [session.targetPlayer.id])
    session.targetPlayer.call('callStart', [session.senderPlayer.id])

    session.senderPlayer.enableVoiceTo(session.targetPlayer)
    session.targetPlayer.enableVoiceTo(session.senderPlayer)

    CustomEvent.triggerCef(session.senderPlayer, 'phone:startCall');
    CustomEvent.triggerCef(session.targetPlayer, 'phone:startCall');
})

CustomEvent.registerCef("phone:buyBalance", (player, id: number, sum: number, number: number) => {
    const user = player.user;
    if(!user) return;
    if(!user.bank_number) return user.notifyPhone("Оператор", "Ошибка пополнения счёта", "Мы не смогли пополнить ваш баланс. У вас нет зарегистрированого на ваше имя банковского счёта", "error");
    if (user.bank_money < sum) return user.notifyPhone("Оператор", "Ошибка пополнения счёта", "Мы не смогли пополнить ваш баланс. На вашем банковском счету недостаточно средств для оплаты", "error");
    user.removeBankMoney(sum, true, `Пополнение мобильного счёта ${number} на сумму $${system.numberFormat(sum)}`, "Vodafone");
    phone.addMoney(player, number, sum)
})
CustomEvent.registerCef("phone:setSettings", (player, id: number, settings: PhoneSettings) => {
    phone.setNewSettings(player, id, settings)
})
CustomEvent.registerCef("phone:messageOpened", (player, number: number) => {
    player.phoneReadMessage = number;
})
CustomEvent.registerCef("phone:newContact", (player, id: number, name: string, number: number) => {
    phone.newContact(player, id, name, number)
})
CustomEvent.registerCef("phone:removeContact", (player, id: number, number: number) => {
    phone.removeContact(player, id, number)
})
CustomEvent.registerCef("phone:sendContact", (player, data: [string, number]) => {
    const targets = player.user.getNearestPlayers(2).filter(target => target.phoneCurrent);
    if (targets.length === 0) return player.user.notifyPhone('NFC', "Ошибка отправки данных", "Не удалось обнаружить активные телефоны поблизости");
    targets.map(target => {
        CustomEvent.triggerCef(target, 'phone:acceptReceivePhone', data[0], data[1]);
    })
})
CustomEvent.registerCef("phone:close", (player, unLoadSim = false) => {
    const user = player.user;
    if (!user) return;
    if (unLoadSim){
        const item = user.inventory.find(q => q.id === player.phoneCurrent);
        if (!item) return player.notify("Вы не можете использовать телефон, которого у вас нет в инвентаре", "error");
        if (!item.advancedNumber) return player.notify("В телефоне нет сим карты", "error");
        inventory.createItem({
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: user.id,
            item_id: 851,
            serial: "USED_" + item.id + "_" + user.id + "_" + system.timestamp + "_" + item.advancedNumber,
            advancedNumber: item.advancedNumber,
            advancedString: item.advancedString,
        });
        item.advancedNumber = 0;
        item.advancedString = "";
        item.save();
        user.notifyPhone("Система", "Смена оператора", "Из телефона была изъята сим-карта", "error")
    }
    player.phoneReadMessage = null;
    player.phoneCurrent = null;
})