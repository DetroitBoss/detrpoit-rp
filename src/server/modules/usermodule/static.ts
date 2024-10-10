import {Vehicle} from "../vehicles";
import {system} from "../system";
import {addAdminStats} from "../admin.stats";
import {gui} from "../gui";
import {OWNER_TYPES} from "../../../shared/inventory";
import {houses} from "../houses";
import {UserDatingEntity, UserEntity} from "../typeorm/entities/user";
import {RpHistoryEntity} from "../typeorm/entities/rp_history";
import {DuelRatingEntity} from "../typeorm/entities/duel";
import {BankHistoryEntity} from "../typeorm/entities/bank_history";
import {phone} from "../phone";
import {CustomEvent} from "../custom.event";
import {AccountEntity} from "../typeorm/entities/account";
import {AlertType, DEFAULT_ALERT_TIME} from "../../../shared/alert";
import {weather} from "../weather";
import {playTimeX2Users, User } from "../user";
import { In } from "typeorm";
import {inventory} from "../inventory";
import {business} from "../business";
import {FileLogType} from "../../../shared/log";
import {NoSQLbase} from "../nosql";
import {payDayGlobal} from "./payday";
import {ItemEntity} from "../typeorm/entities/inventory";
import {PromocodeUseEntity} from "../typeorm/entities/promocodes";
import {dbconnection, saveEntity} from "../typeorm";
import {LogEntity} from "../typeorm/entities/log";
import {WarehouseEntity} from "../typeorm/entities/warehouse";
import { dbLogsConnection } from '../typeorm/logs'
import { Family } from '../families/family'
import { writeSpecialLog } from '../specialLogs'

interface X2Data {
    donate: boolean,
    exp: boolean,
    job: boolean,
    playtime: boolean,
    enabledonate: boolean,
    playtimecar: boolean,
    taxes: boolean,
    donate3: boolean,
    exp3: boolean,
    logoff: boolean,
    testserver: boolean,
}

let int = setInterval(() => {
    if (User.x2func.data.length == 0) {
        User.x2func.insert({donate: false, exp: false, job: false, playtime: false, enabledonate: false, playtimecar: false, taxes: false, donate3: false, exp3: false, logoff: false, testserver: false});
        User.x2func.save()
        system.debug.info('Insert x2 function data')
    } else {
        clearInterval(int);
    }
}, 5000)

export const getX2Param = (item: keyof X2Data) => {
    return !!User.x2func.data[0][item]
}



CustomEvent.registerClient('isOnVehicle', (player, status: boolean) => {
    player.isOnVeh = status;
})
CustomEvent.registerClient('setWalkstyle', (player, val: string) => {
    player.setVariable('walkstyle', val);
})

export class UserStatic {

    static x2func = new NoSQLbase<X2Data>('x2func');

    static getRpHistory(id: number, limit = 10) {
        return RpHistoryEntity.find({where: {user: {id}}, take: limit, order: {id: "DESC"}});
    }

    static get playedTimeDay(){
        return playTimeX2Users.data
    }
    static playedTime = new Map<number, number>();

    static async log(id: number, type: FileLogType, text: string, target?: PlayerMp | number) {

        const data = await User.getData(id);
        if (!data) return;
        let myData = `${data.rp_name} [${data.id}]`
        let targetData = ``
        if (target) {
            if (typeof target === "number") {
                let q = User.get(target);
                if (q) target = q;
            }
            targetData = typeof target === "number" ? `Игрок ${target}` : `${target.user.name} [${target.user.id}]`
        }
        let resText = target ? `${myData} - Взаимодействие с ${targetData}: ${text}` : `${myData} - ${text}`;
        system.saveLog(type, resText)
    }

    static async addBankMoney(target: number, money: number, reason: string, iniciator: string, cashCan = true) {
        if (typeof money !== "number") return;
        if (money <= 0) return;
        const targetPl = this.get(target);
        if (targetPl) return targetPl.user.addBankMoney(money, false, reason, iniciator, cashCan);
        const data = await User.getData(target);
        if(!data) return;
        const bankHave = !!data.bank_number;
        if(!bankHave && !cashCan) return;
        if(bankHave){
            data.bank_money += money;
        } else {
            data.money += money;
        }
        await saveEntity(data);
        if(!bankHave) this.log(target, 'addMoney', `$${system.numberFormat(money)} ${reason}`)
        this.writeBankNotify(target, 'add', money, reason, iniciator);
    }

    static async addMoney(target: number, money: number, reason: string) {
        if (typeof money !== "number") return;
        if (money <= 0) return;
        const targetPl = this.get(target);
        if (targetPl) return targetPl.user.addMoney(money, false, reason);
        const data = await User.getData(target);
        data.money += money;
        saveEntity(data);
        if (reason) this.log(target, 'addMoney', `$${system.numberFormat(money)} ${reason}`)
    }

    static get sockets() : Socket[]{
        return mp.players.toArray().filter(q => q.user && q.user.socket).map(q => q.user.socket)
    }

    static getBySocketID(id: string) : PlayerMp {
        return mp.players.toArray().find(q => q.user && q.user.socket && q.user.socketId === id);
    }

    static lastSave = new Map<number, number>();
    static writeRpHistory(user: number, text: string) {
        if (!text) return;
        if (text.length > 1000) text = text.slice(0, 1000);
        let record = new RpHistoryEntity();
        record.userId = user;
        record.text = text;
        record.time = system.timestamp;
        record.save();
    }

    /** Хранилище переведённых средств за сутки */
    static dayTransferMoney = new Map<number, number>();

    static async writeBankNotify(target: number | User | PlayerMp, type: "add" | "remove" | "reject", sum: number, reason: string, iniciator: string) {
        let data = typeof target === "number" ? await this.getData(target) : (target instanceof this ? target.entity : target.user.entity);
        let ent = new BankHistoryEntity();
        ent.user = data;
        ent.type = type;
        ent.bank_number = data.bank_number;
        ent.sum = sum;
        ent.text = reason.replace(/<br\/>/g, '||||');
        ent.time = system.timestamp;
        ent.target = iniciator;
        ent.ticket = system.generateTransaction()
        setTimeout(() => {
            ent.save();
        }, 1000)
        if (type === "add") {
            system.saveLog('addBankMoney', `[${data.id}] #${data.bank_number} $${system.numberFormat(sum)} ${reason} ${iniciator}`, data)
        } else if (type === "remove") {
            system.saveLog('removeBankMoney', `[${data.id}] #${data.bank_number} $${system.numberFormat(sum)} ${reason} ${iniciator}`, data)
        }
    }

    static async sendMoney(player: PlayerMp, sum: number, targetNumber: string) {
        const user = player.user;
        if (!user) return;
        let targetName: string;
        let targetId: number;
        if(!user.bank_have) return player.notify('У вас нет банковского счёта', 'error');
        if(user.bank_money < sum) return player.notify('У вас недостаточно средств для перевода', 'error'), user.bankLog('reject', sum, `Перевод на банковский счёт ${targetNumber}`, "Перевод средств");
        const targetPlayer = mp.players.toArray().find(q => mp.players.exists(q) && q.user && q.user.bank_number === targetNumber);
        let send = false;
        if (targetPlayer) {
            const tuser = targetPlayer.user
            const tarif = tuser.bank_tarif_max
            targetName = tuser.name
            targetId = tuser.id
            if (tuser.bank_money + sum > tarif) {
                player.notify('Перевод превышает допустимый лимит хранения получателем', 'error');
                user.bankLog('reject', sum, `Перевод физическому лицу ${targetName} #${targetId}`, "Перевод средств");
                tuser.bankLog('reject', sum, `Перевод от физического лица ${user.name} #${user.id}`, user.bank_number);
            } else {
                send = true;
                tuser.addBankMoney(sum, true, `Перевод от физического лица ${user.name} #${user.id}`, user.bank_number);
            }
        } else {
            return player.notify('Получатель не в сети', 'error');
        }
        if (send) {
            user.removeBankMoney(sum, true, `Перевод физическому лицу ${targetName} #${targetId}`, "Перевод средств");
            CustomEvent.triggerCef(player, 'phone:sendMoney:success')
        }
        setTimeout(() => {
            if (mp.players.exists(player) && player.phoneCurrent) phone.loadBankHistory(player)
        }, 5000)
    }

    static notifyToFraction(fraction: number, title: string, sender: string, message: string, notifPic: string, time: number = 8000) {
        this.filterByFraction(fraction).map(target => {
            target.user.notifyWithPicture(title, sender, message, notifPic, time)
        })
    }

    static notifyWithPictureToAll(title: string, sender: string, message: string, notifPic: string, time: number = 8000) {
        CustomEvent.triggerClients('showWithPicture', title, sender, message, notifPic, time)
    }

    static get(id: number) {
        if (typeof id !== "number") return;
        let usr = User.list.get(id);
        if (usr && usr.exists) return usr.player;
        return null;
    }

    static getData(id: number): Promise<UserEntity> {
        let onlineData = User.get(id);
        if (onlineData) return new Promise((resolve) => {
            resolve(onlineData.user.entity)
        })
        return UserEntity.findOne({where: {id}})
    }

    static getDatas(...id: number[]): Promise<UserEntity[]> {
        let res: UserEntity[] = id.filter(q => User.get(q)).map(q => User.get(q).user.entity);
        let offline = id.filter(q => !User.get(q));
        return new Promise(async (resolve) => {
            const datas = await UserEntity.find({
                where: {id: In(offline)}
            })
            if (datas) res.push(...datas)
            resolve(res)
        })
    }

    static getDataAccount(id: number): Promise<AccountEntity> {
        let onlineData = User.getByAccountId(id);
        if (onlineData) return new Promise((resolve) => {
            resolve(onlineData.user.account)
        })
        return AccountEntity.findOne({where: {id}})
    }

    static getByPlayer(player: PlayerMp) {
        if (!mp.players.exists(player)) return null;
        return player.user;
    }

    static getByAccountId(id: number) {
        return mp.players.toArray().find(q => q.user && q.user.account.id === id);
    }

    static userQuit(player: PlayerMp) {
        if (!player || !player.dbid) return;
        let usr = User.list.get(player.dbid);
        if (!usr) return;
        return usr.exit();
    }

    static create(player: PlayerMp, entity: UserEntity, account: AccountEntity, quest?: number) {
        return new User(player, entity, account, quest);
    }

    static remove(id: number): boolean {
        User.list.delete(id)
        return true;
    }

    static saveAll() {
        const users = [...User.list].map(q => q[1]).filter(q => q.exists).map(q => q.savePrepare());
        UserEntity.save(users)
        User.list.forEach((usr, id) => {
            if (!mp.players.exists(usr.player)) return User.list.delete(id);
            // usr.save();
        })
    }

    static initPlayerFunctions(player: PlayerMp) {
        player.notify = (text: string, type: AlertType = "info", img?: string, time = DEFAULT_ALERT_TIME) => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerCef(player, 'cef:alert:setAlert', type, text, img, time)
        }
        player.notifyWithPicture = (title: string, sender: string, message: string, notifPic: string, time: number = 8000) => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerClient(player, 'showWithPicture', title, sender, message, notifPic, time)
        }
        player.outputChatBox = (message, type = 'None') => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerCef(player, 'cef:chat:message', message, type);
        };
        
        // player.notifyWithPicture(
        //     `Life Invader [${weather.getFullRpTime()}]`,
        //     '~y~Новости погоды',
        //     `${weather.getWeatherName(weather.weather)}\nТемпература воздуха: ~y~${Math.round(weather.temp)}°C`,
        //     'CHAR_LIFEINVADER'
        // );
    }

    static findByFraction(fraction: number) {
        return mp.players.toArray().find(target => target.user && target.user.fraction === fraction)
    }

    static filterByFraction(fraction: number) {
        return mp.players.toArray().filter(target => target.user && target.user.fraction === fraction)
    }

    static list = new Map<number, User>();

    static getNearestVehicle(player: PlayerMp, r = 5) {
        if (player.vehicle) return player.vehicle;
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == player.dimension && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestVehicleByCoord(position: { x: number, y: number, z: number }, r = 5, dimension = 0) {
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == dimension && veh.dist(position) <= r).sort((a, b) => {
            return system.distanceToPos(position, a.position) - system.distanceToPos(position, b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestPed(player: PlayerMp, r = 5) {
        let peds = mp.peds.toArray().filter(ped => ped.dimension == player.dimension && player.dist(ped.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (peds.length > 0) return peds[0]
    }

    static getNearestPeds(player: PlayerMp, r = 5) {
        return mp.peds.toArray().filter(ped => ped.dimension == player.dimension && player.dist(ped.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
    }

    static getNearestPlayer(player: PlayerMp, r = 5) {
        let vehs = mp.players.toArray().filter(veh => veh.dimension == player.dimension && veh.id != player.id && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestPlayerByCoord(position: Vector3Mp, r = 5, dimension = 0) {
        return this.getNearestPlayersByCoord(position, r, dimension)[0]
    }

    static getNearestPlayersByCoord(position: Vector3Mp, r = 5, dimension = 0) {
        return mp.players.toArray().filter(veh => veh.dimension == dimension && veh.dist(position) <= r).sort((a, b) => {
            return a.dist(position) - b.dist(position)
        });
    }

    static getNearestVehicles(player: PlayerMp, r = 5) {
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == player.dimension && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        return vehs
    }

    static getNearestPlayers(player: PlayerMp, r = 5, onlyVisible = false) {
        let vehs = mp.players.toArray().filter(veh => veh.dimension == player.dimension && veh.id != player.id && player.dist(veh.position) <= r && (!onlyVisible || veh.alpha > 10)).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (r == 0 && player.vehicle) vehs.filter(t => t.vehicle == player.vehicle);
        return vehs
    }

    static banUser = (id: number, admin: PlayerMp, reason: string, end: number) => {
        User.getData(id).then(usr => {
            if (!usr) return;
            if (!mp.players.exists(admin)) return;
            if (!admin.user) return;
            usr.ban_end = end;
            usr.ban_reason = reason;
            usr.fraction = 0;
            usr.rank = 0;
            usr.ban_admin = admin.dbid;
            admin.user.log("AdminBan", `Забанил до ${system.timeStampString(end)} по причине ${reason}`, usr.id);
            addAdminStats(admin.user.id, 'ban')
            usr.save().then(() => {
                const target = User.get(id);
                if (target && mp.players.exists(target)) User.kickUser(target, `Бан до ${system.timeStampString(end)} по причине ${reason}`, admin);
            })
        })
    }
    static banUserAccount = (id: number, admin: PlayerMp, reason: string, end: number) => {
        User.getDataAccount(id).then(usr => {
            if (!usr) return;
            if (!mp.players.exists(admin)) return;
            if (!admin.user) return;
            usr.ban_end = end;
            usr.ban_reason = reason;
            usr.ban_admin = admin.dbid;
            admin.user.log("AdminBan", `Забанил аккаунт #${id} до ${system.timeStampString(end)} по причине ${reason}`);
            usr.save().then(() => {
                const target = mp.players.toArray().find(q => q.user && q.user.account.id === id);
                if (target && mp.players.exists(target)) User.kickUser(target, `Бан аккаунта до ${system.timeStampString(end)} по причине ${reason}`);
            })
        })
    }
    static kickUser = (player: PlayerMp, reason: string, who?:PlayerMp) => {
        if (!mp.players.exists(player)) return;
        if(player && mp.players.exists(player) && player.user){
            mp.players.toArray().filter(q => q.id !== player.id && q.user && (q.user.isAdminNow() || (q.dimension === player.dimension && system.distanceToPos(player.position, q.position) < 50))).map(target => {
                target.outputChatBox(`[${gui.chat.getTime()}] !{FF0000}${player.user.name} ${who ? `был кикнут администратором ${who.user.name} (${who.user.id})` : `Покинул сервер`}: !{2196F3}${reason}`,"None");
            })
        }
        player.outputChatBox(`Вы были кикнуты с сервера, причина: ${reason}`,"SERVER");
        player.kick(`Вы были кикнуты с сервера, причина: ${reason}`);
        system.debug.info(`${player.user ? `${player.user.name} #${player.user.id}` : 'Неавторизованный игрок'} был кикнут, причина: ${reason}`);
    }

    static changeId(id: number, newid: number): Promise<boolean>{
        return new Promise(async resolve => {
            UserEntity.count({where: {
                id: newid
            }}).then(async count => {
                if(count > 0) return resolve(false);
                const target = User.get(id);
                if (target) {
                    User.kickUser(target, 'Очистка персонажа');
                    await system.sleep(4000);
                }
                await this.clearPersonage(id);

                let data = (await UserEntity.findOne({relations: ["account"], where: {id}}));
                if(!data) return resolve(false)
                dbconnection.createQueryBuilder()
                    .update(UserEntity)
                    .set({ id: newid })
                    .where("id = :id", { id })
                    .execute()
                return resolve(true);
                // dbconnection.query("UPDATE `user_entity` SET `id` = ? WHERE `id` = ? LIMIT 1", [id, newid]).then(q => {
                //
                // })
                // console.log(data.id);
                // data.id = newid;
                // console.log(data.id);
                // saveEntity(data).then(q => {
                //     console.log(data.id);
                //     console.log(q.id);
                //     // console.log(q);
                //
                // })
                // return resolve(true);
            })
        })
    }

    static clearPersonage(id: number): Promise<boolean>{
        return new Promise(async resolve => {
            // const target = User.get(id);
            // if (target) {
            //     User.kickUser(target, 'Очистка персонажа');
            //     await system.sleep(4000);
            // }
            inventory.clearInventory(OWNER_TYPES.PLAYER, id);
            Vehicle.getPlayerVehicles(id).map(veh => veh.deleteFromDatabase());
            await PromocodeUseEntity.delete({user: {id}})
            const biz = business.getByOwner(id);
            if (biz) await business.setOwner(biz, null);
            const home = houses.dataArray.find(h => h.garageAccess(id))
            if (home) {
                if (home.userId === id) await houses.setOwner(home, null, false);
                else {
                    const d = [...home.residents];
                    d.splice(d.indexOf(id), 1);
                    home.residents = d;
                    home.save();
                }
            }
            await UserDatingEntity.delete({user: {id}});
            await UserDatingEntity.delete({target: {id}});
            await RpHistoryEntity.delete({user: {id}});
            //await LogEntity.delete({userId: id});
            await BankHistoryEntity.delete({user: {id}});
            await DuelRatingEntity.delete({userId: id});
            const warehouse = WarehouseEntity.getByOwner(id);
            if(warehouse) await warehouse.setOwner(null)
            // UserEntity.remove(data)
            return resolve(true)
        })
    }

    static async deletepersonage(id: number) {

        const target = User.get(id);
        if (target) {
            User.kickUser(target, 'Очистка персонажа');
            await system.sleep(4000);
        }
        if(!(await this.clearPersonage(id))) return false;
        if(!(await UserEntity.delete({id}))) return false;
        //
        return true;
    }
}