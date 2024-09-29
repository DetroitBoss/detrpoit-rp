import {systemUtil, Vector3Shared} from "../../shared/system";
import {User} from "./user";
import colors from 'colors';
import {business} from "./business";
import { CustomEvent, eventsPerfomanceTestResults } from "./custom.event";
import fs from 'fs'
import {fractionChest} from "./chest";
import {DynamicBlipOption} from "../../shared/dynamicBlip";
import {DynamicBlip} from "./dynamicBlip";
import {FamilyLogType, FileLogType} from "../../shared/log";
import {exec} from "child_process";
import md5 from "md5";
import {LogEntity, LogFamilyEntity} from "./typeorm/entities/log";
import {UserEntity} from "./typeorm/entities/user";
import {Vehicle} from "./vehicles";
import {FamilyEntity} from "./typeorm/entities/family";
import {SyncClass} from "./sync";
import {createDynamicPed} from "./npc";
import {houses} from "./houses";
import querystring from 'querystring'
import fetch from 'node-fetch'
import {UserQuestManager} from "./advancedQuests/userQuestManager";
import { dbLogsConnection } from './typeorm/logs'
import BattlePass from './battlePass'
import { getX2Param } from "./usermodule/static";

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

//const LAUNCHER_ONLINE_UPDATE_IN_MINUTES = 1
//if (getX2Param('testserver')) {
//    setInterval(async () => {
 //       const form = {
  //          query: "update_online",
   //         count: mp.players.length
   //     };

   //     const formData = querystring.stringify(form);
   //     await fetch('http://launcher.onyx-gta.ru/api/api.php', {
   //         body: formData,
    //        method: 'POST',
    //        headers: {
    //            'Content-Type': 'application/x-www-form-urlencoded'
    //        },
    //    })
   // },LAUNCHER_ONLINE_UPDATE_IN_MINUTES * 60 * 1000)    
//}

CustomEvent.registerClient('srv:log', (player: PlayerMp, text: string) => {
    console.log(text)
})

CustomEvent.registerCef('srv:log', (player: PlayerMp, text: string) => {
    console.log(text)
})

let playersConsoleStream: PlayerMp[] = [];

setInterval(() => {
    if(getX2Param("testserver")) return;
    playersConsoleStream = mp.players.toArray().filter(q => q.user && q.user.admin_level >= 6 && !!q.user.socket);
}, 10000);

// Очищаем кеш фастдла на основе 
setTimeout(async () => {
    if (!getX2Param('testserver')) {
        exec('curl -X PURGE -L http://purge-fastdl-onyx-zgGfJfj2w.rage-fastdl.com/purge')
    }
}, 70000);


function writeLastMessageData(...text: any){
    playersConsoleStream.map(player => {
        if(!mp.players.exists(player)) return;
        const user = player.user;
        if(!user) return;
        if(user.admin_level < 6) return;
        if(!user.socket) return;
        CustomEvent.triggerClientSocket(player, 'editor:serverConsole', ...text);
    })
    SystemClass.lastMessageLog.push(...text);
    if (SystemClass.lastMessageLog.length > 50) SystemClass.lastMessageLog.splice(0, 20);
}


function b64EncodeUnicode(str: string) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            // @ts-ignore
            return String.fromCharCode('0x' + p1);
        }));
}

function b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

setInterval(() => {
    SystemClass.saveLogs();
    SystemClass.saveLogsFamily()
}, 40000)

class SystemClass extends systemUtil {
    static get rebootStarter(){
        return rebootStart
    }
    /** Доступна ли сейчас акция на x2 */
    static get playtimeCanNow(){
        return true;
    }

    private static saveLogList: LogEntity[] = [];
    static async saveLogs() {
        if (this.saveLogList.length === 0) return;
        await dbLogsConnection
            .createQueryBuilder()
            .insert()
            .into(LogEntity)
            .values(this.saveLogList)
            .execute()
        
        this.saveLogList = [];
    }

    private static saveLogFamilyList: LogFamilyEntity[] = [];
    static async saveLogsFamily(){
        if (this.saveLogFamilyList.length === 0) return;
        await dbLogsConnection
            .createQueryBuilder()
            .insert()
            .into(LogFamilyEntity)
            .values(this.saveLogFamilyList)
            .execute()
        
        this.saveLogFamilyList = [];
    }

    /** Локальное хранилище данных в формате Base64 */
    private static base64Data = new Map<string, string>();
    static getBase64(key: string) {
        const data = this.base64Data.get(key);
        return data ? b64DecodeUnicode(data) : null;
    }
    static setBase64(key: string, value: string) {
        this.base64Data.set(key, b64EncodeUnicode(value));
    }
    static base64Encode(value: string) {
        return b64EncodeUnicode(value);
    }
    static base64Decode(value: string) {
        return b64DecodeUnicode(value);
    }
    static clearBase64(key: string) {
        this.base64Data.delete(key);
    }
    static playerSignature(id: number) {
        let str = md5(id.toString());
        str = md5(str);
        str = md5(str);
        str = md5(str);
        return str
    }
    private static dimensionIds = 10000000;
    /** Генерация уникального персонального измерения при каждом вызове */
    static get personalDimension(){
        this.dimensionIds++;
        return parseInt(`${this.dimensionIds}`)
    }
    static lastMessageLog: string[] = [];
    static debug = {
        success: (...text: any) => { writeLastMessageData(...text); console.log(colors.green(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        input: (...text: any) => { writeLastMessageData(...text); console.log(colors.input(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        verbose: (...text: any) => { writeLastMessageData(...text); console.log(colors.verbose(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        prompt: (...text: any) => { writeLastMessageData(...text); console.log(colors.prompt(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        info: (...text: any) => { writeLastMessageData(...text); console.log(colors.info(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        data: (...text: any) => { writeLastMessageData(...text); console.log(colors.data(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        help: (...text: any) => { writeLastMessageData(...text); console.log(colors.help(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        // @ts-ignore
        warn: (...text: any) => { writeLastMessageData(...text); console.log(colors.warn(`[${system.getTime(true)}] ${text.join(' ')}`)) },

        debug(...text: any){
            // if (!getX2Param('testserver') && !this.debug.debugShow) return;
            writeLastMessageData(...text);
            // @ts-ignore
            console.log(colors.debug(`[${system.getTime(true)}] ${text.join(' ')}`))
        },
        debugShow: true,
        showDebug(status: boolean){
            this.debug.debugShow = status;
        },


        // @ts-ignore
        error: (...text: any) => { console.log(colors.error(`[${system.getTime(true)}] ${text.join(' ')}`)) },

    }
    static createPed(pos:Vector3Mp, heading:number, model:HashOrString, freeze:boolean = true, invincible:boolean = true, dimension = 0) {
        if(!freeze) return createDynamicPed(pos, heading, model, invincible, dimension);
        let ped = mp.peds.new(typeof model === "number" ? model : mp.joaat(model), pos, {
            heading: heading,
            frozen: freeze,
            lockController: false,
            dynamic: !freeze,
            invincible,
            dimension: dimension
        })
        return ped;
    }
    static saveAll(reboot = false){
        User.saveAll();
        UserQuestManager.saveAll();
        BattlePass.saveAll();
        houses.saveAll();
        if(reboot) {
            business.saveAll();
            Vehicle.toArray().filter(veh => veh.entity).map(veh => {
                veh.entity.save();
            })
            //this.saveLogs();
            //this.saveLogsFamily()
        } else {
            business.saveAllWait()
        }
        fractionChest.saveAll();
    }
    static reboot(delayMinutes?: number){
        if(!delayMinutes) delayMinutes = 0;
        rebootTimer = delayMinutes ? delayMinutes * 60 : 1;
        rebootStart = true;
        SyncClass.setData('serverReboot', rebootTimer)
    }
    static saveLog(name: FileLogType, log: string, user?:UserEntity, target?: number){
        const item = new LogEntity()
        item.text = log;
        item.type = name;
        item.userId = user.id;
        item.target = target;
        item.time = system.timestamp;
        this.saveLogList.push(item);
    }

    static saveLogFamily(name: FamilyLogType, amount: number, log: string, family?: FamilyEntity, target?: PlayerMp) {
        const item = new LogFamilyEntity()
        item.text = log;
        item.type = name;
        item.familyId = family.id;
        item.count = amount;
        item.target = target && mp.players.exists(target) ? target.user.id : 0;
        item.targetName = target && mp.players.exists(target) ? target.user.name : '';
        item.time = system.timestamp;
        this.saveLogFamilyList.push(item);
    }

    static getLogsByType(type: FileLogType, limit = 1){
        return dbLogsConnection.getRepository(LogEntity).find({
            where: {type},
            take: limit,
            order: {id: "DESC"}
        })
    }
    static saveLogText(name: FileLogType, log: string){
        fs.appendFile("log/" + name + ".log", `[${this.getDate()}] [${this.getTime()}] ${log}\n`, (err) => {
            if (err) {
                this.createFile("log/" + name + ".log");
                return this.saveLog(name, log);
            }
        });
    }
    static createFile(filename: string){
        fs.open(filename, 'r', (err, fd) => {
            if (err) {
                fs.writeFile(filename, '', (err) => {
                    if (err)
                        this.debug.error(err);
                    else
                        this.debug.debug("The file was saved!");
                });
            } else {
                this.debug.debug("The file exists!");
            }
        });
    }
    static createDynamicBlip(id: string, type: number, color: number, position: {x: number, y: number, z: number}, name: string, options?: DynamicBlipOption) {
        return new DynamicBlip(id, type, color, new mp.Vector3(position.x, position.y, position.z), name, options)
    }
}


CustomEvent.registerClient('admin:system:rebootstop', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:system:reboot')) return;
    if (!rebootStart) return player.notify(`Перезагрузка не запущена`, "error");
    rebootStart = false;
    player.notify("Перезагрузка остановлена", "success");
    SyncClass.clearData('serverReboot')
});
CustomEvent.registerClient('admin:system:reboot', (player, minutes:number) => {
    const user = player.user;
    if(!user) return;
    if (!user.hasPermission('admin:system:reboot')) return;
    if (!minutes) minutes = 0;
    if (rebootStart) return player.notify(`Перезагрузка уже запущена`, "error");
    system.reboot(minutes)
    player.notify("Перезагрузка запущена", "success");
})
let startUpdate = false;
CustomEvent.registerClient('admin:system:update', (player) => {
    const user = player.user;
    if(!user) return;
    if (!user.hasPermission('admin:system:reboot')) return;
    if(!getX2Param("testserver")) return player.notify("Сервер не тестовый. Функция не выполнима", "error");
    if (startUpdate) return player.notify("Обновление уже запущено", "error");
    system.saveAll(true);
    player.notify("Система обновления запущена. Сервер сейчас будет отключён и будет включён по завершению обновления")
    startUpdate = true
    // exec(`sh ${!getX2Param('testserver') ? 'update-beta' : 'update-main'}.sh`, () => {
    //     startUpdate = false;
    //     if(mp.players.exists(player)) player.notify('Код обновления залит, можете перезапустить сервер', 'success')
    // }) 
})

CustomEvent.register('newHour', (hour) => {
    if (rebootStart) return;
    if(hour != 4) return;
    system.reboot(15)
})

let rebootTimer = 0;
let rebootStart = false;

setInterval(() => {
    if (!rebootStart) return;
    if (rebootTimer <= 0) return;
    rebootTimer--;
    if(rebootTimer % 10 === 0) SyncClass.setData('serverReboot', rebootTimer)
    if (rebootTimer === 0){
        rebootStart = false;
        system.saveAll(true);
        eventsPerfomanceTestResults.save()
        exec('sh dump.sh')
        setTimeout(() => {
            process.exit()
        }, 7000)
    }
}, 1000)
let q = 0;
setInterval(() => {
    if (mp.players.length === 0) return;
    console.time("Сохранение всей системы")
    system.saveAll(q === 5);
    q++;
    if(q >= 5) q = 0;
    console.timeEnd("Сохранение всей системы")
    system.debug.debug('Сохранение всех системы выполнено')
},  mp.config.announce ? 240000 : 20000)

// mp.events.add("serverShutdown", async () => {
//     console.log("Server shutdown event")
//     mp.events.delayShutdown = true;
//     system.saveAll();
//     setTimeout(() => {
//         mp.events.delayShutdown = false;
//     }, 3000)
// });

export const system = SystemClass