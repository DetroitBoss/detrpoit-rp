import {CustomEventBase} from "../../shared/custom.event";
import * as socketIo from 'socket.io'
import {User} from "./user";
import { NoSQLbase } from './nosql'
const { performance } = require('perf_hooks');

type clientEventHandle = (player: PlayerMp, ...args: any[]) => void

interface IPerfomanceResult {
    eventName: string
    count: number// Кол-во раз этот ивент логировался
    averageExecutionTime: number
}

const PERFOMANCE_MIN_TIME = 20 // Кол-во миллисекунд больше которых будет писать в консоль варнинг
export const eventsPerfomanceTestResults = new NoSQLbase<IPerfomanceResult>('perfomanceTest')

export class CustomEvent extends CustomEventBase {
    static clientPoolLog = new Map<string, {count: number, last: number}>()
    static clientEvents: [string, clientEventHandle][] = []
    static clientCallHandle = new Map<number, [(value?: any) => void, (reason?: any) => void]> ()
    static clientCallId = 0;

    static key: number = CustomEvent.getRandomKey()
    static getRandomKey(): number {
        return Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
    }
    static decryptEventName(eventName: string): string {
        return eventName
            .split('g')
            .filter(Boolean)
            .map(s => String.fromCharCode(parseInt(s,16) ^ CustomEvent.key) )
            .join('')
    }
    static encryptEventName(eventName: string): string {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ CustomEvent.key).toString(16))
            .join('g')
    }

    static registerClientCef(name: string, handle: clientEventHandle){
        this.registerClient(name, handle);
        this.registerCef(name, handle);
    }
    static registerClient(name: string, handle: clientEventHandle):void;
    static registerClient(name: 'playerLeaveVehicle', handle: (player: PlayerMp, vehid: number)=>void):void;
    static registerClient(name: 'playerEnterVehicle', handle: (player: PlayerMp, vehid: number)=>void):void;
    static registerClient(name: string, handle: clientEventHandle){
        // console.log('Зарегистрирован клиент ивент', name)
        CustomEvent.clientEvents.push([CustomEvent.encryptEventName(name), handle]);
    }
    static unregisterClient(name: string, handle: clientEventHandle) {
        const index = CustomEvent.clientEvents.findIndex(ev => ev[0] === name && ev[1] === handle);
        CustomEvent.clientEvents.splice(index, 1);
    }
    static unregisterCef(name: string, handle: clientEventHandle) {
        const index = CustomEvent.cefEvents.findIndex(ev => ev[0] === name && ev[1] === handle);
        CustomEvent.cefEvents.splice(index, 1);
    }
    static cefEvents: [string, clientEventHandle][] = []
    static registerCef(name: string, handle: clientEventHandle){
        // console.log('Зарегистрирован CEF ивент', name)
        CustomEvent.cefEvents.push([CustomEvent.encryptEventName(name), handle]);
    }
    static registerClientAndCef(name: string, handle: clientEventHandle){
        // console.log('Зарегистрирован клиент/CEF ивент', name)
        CustomEvent.clientEvents.push([CustomEvent.encryptEventName(name), handle]);
        CustomEvent.cefEvents.push([CustomEvent.encryptEventName(name), handle]);
    }
    static triggerCef(player:PlayerMp, eventName: string, ...args:any[]){
        if(!mp.players.exists(player)) return;
        player.call('cef:trigger:event', [eventName, JSON.stringify(args)])
    }
    static triggerCefAll(eventName: string, ...args:any[]){
        mp.players.call('cef:trigger:event', [eventName, JSON.stringify(args)])
    }
    static triggerClient(player:PlayerMp, eventName: string, ...args:any[]){
        if(!mp.players.exists(player)) return;
        return this.triggerCl(player, eventName, ...args)
    }
    static triggerClients(eventName: string, ...args:any[]){
        return this.triggerCl(mp.players, eventName, ...args)
    }
    private static triggerCl(pl: PlayerMp | PlayerMpPool, eventName: string, ...args: any[]){
        const argsString = JSON.stringify(args)
        if (argsString.length >= 32700){
            const ids = Math.floor(Math.random() * (999999 - 111111)) + 111111
            let arr:string[] = [];
            for (let i = 0; i < argsString.length; i += 32500) arr.push(argsString.slice(i, i + 32500));
            arr.map((itm, index) => {
                pl.call('client:trigger:event:split', [ids, index, index == (arr.length - 1), eventName, itm])
            })
        } else {
            pl.call('client:trigger:event', [eventName, argsString])
        }
    }
    static callClient(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
        return new Promise((resolve, reject) => {
            if(!mp.players.exists(player)) return;
            const reqId = parseInt(`${this.clientCallId++}`)
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])

        })
    }
    static callCef(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
        return new Promise((resolve, reject) => {
            if(!mp.players.exists(player)) return;
            const reqId = parseInt(`${this.clientCallId++}`)
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])

        })
    }
    static triggerClientSocket(target: PlayerMp, event: string, ...args:any[]){
        if(!mp.players.exists(target)) return;
        CustomEventSocket.callClient(target, event, ...args)
    }
    static triggerCefSocket(target: PlayerMp, event: string, ...args:any[]){
        if(!mp.players.exists(target)) return;
        CustomEventSocket.callCef(target, event, ...args)
    }
}




const io = new socketIo.Server()
io.listen(3402, {
    cors: {
        origin: '*',
        methods: ["GET", "POST", "PUT", "HEAD"]
    }
})
type SocketEventCallback = (player: PlayerMp, ...data: any[])=>void
type SocketEvent = [string, SocketEventCallback]
export class CustomEventSocket {
    static events = <SocketEvent[]>[];
    private static socketRegisterEvent(socket: Socket, event: SocketEvent){
        socket.on(event[0], (...params:any[]) => {
            const target = User.getBySocketID(socket.id);
            if(target) this.events.filter(q => q[0] === event[0]).map(item => item[1](target, ...params))
        });
    }
    static socketRegister(socket: Socket){
        this.events.map(ev => this.socketRegisterEvent(socket, ev))
    }
    static register(name: string, callback: SocketEventCallback){
        const ev: SocketEvent = [name, callback];
        this.events.push(ev);
        // socketMap.forEach(socket => this.socketRegisterEvent(socket, ev))
    }
    static callClient(target: PlayerMp, event: string, ...args:any[]){
        if(!target || !mp.players.exists(target) || !target.user) return;
        this.callCef(target, 'socket:event:call:client', event, ...args)
    }
    static callCef(target: PlayerMp, event: string, ...args:any[]){
        if(!target || !mp.players.exists(target) || !target.user) return;
        const socket = target.user.socket;
        if(!socket) return;
        socket.emit('eventreceive', event, ...args);
    }
}

io.on('connection', socket => {
    socket.on('verify', (key: string, id: number) => {
        const target = User.get(id);
        if(!target || !target.user || target.user.signature !== key) {
            return;
        }
        target.user.socket = socket;
        CustomEventSocket.socketRegister(socket);
        CustomEvent.trigger('player:socket:add', target, socket)
    });
});





mp.events.add('client:call:event:result', (player: PlayerMp, reqId: number, result: any) => {
    let res = CustomEvent.clientCallHandle.get(reqId);
    if(res) res[0](result);
    CustomEvent.clientCallHandle.delete(reqId);
})

mp.events.add('trigger:client', (player: PlayerMp, name: string, argss: string) => {
    const nowTm = Date.now() / 1000 | 0;
    if(CustomEvent.clientPoolLog.has(`${player.id}_____${name}`)){
        const old = CustomEvent.clientPoolLog.get(`${player.id}_____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam client event ${name}`)
            }
            CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, old)
        } else {
            CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
        }
    } else {
        CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
    }

    CustomEvent.clientEvents.filter(item => item[0] == name).map(item => {
        const t1 = performance.now()
        item[1](player, ...(JSON.parse(argss)));
        const t2 = performance.now();
        const time = t2 -t1
        if (time > PERFOMANCE_MIN_TIME) {
            console.debug(`Client event '${CustomEvent.decryptEventName(name)}' executed in ${time} ms by ${player?.user?.id ?? 0}.`)
            const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
            if (!existedResult) eventsPerfomanceTestResults.insert({
                count: 1,
                averageExecutionTime: time, 
                eventName: name
            })
            else {
                existedResult.count++
                existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
            }
        }
    })
})
mp.events.add('call:client', (player: PlayerMp, requestID: number, name: string, argss: string) => {

    const nowTm = Date.now() / 1000 | 0;
    if(CustomEvent.clientPoolLog.has(`${player.id}_____${name}`)){
        const old = CustomEvent.clientPoolLog.get(`${player.id}_____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam client event ${name}`)
            }
            CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, old)
        } else {
            CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
        }
    } else {
        CustomEvent.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
    }

    CustomEvent.clientEvents.filter(item => item[0] == name).map(async item => {
        if(!mp.players.exists(player)) return;
        let res: void;
        try {
            res = await item[1](player, ...(JSON.parse(argss)));
        } catch (error) {
            console.error(error);
        }
        if(!mp.players.exists(player)) return;
        player.call('call:client:response', [requestID, res]);
    })
})
mp.events.add('trigger:cef', (player: PlayerMp, name: string, argss: string) => {

    const nowTm = Date.now() / 1000 | 0;
    if(CustomEvent.clientPoolLog.has(`${player.id}_CEF____${name}`)){
        const old = CustomEvent.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam cef event ${name}`)
            }
            CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
        } else {
            CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
        }
    } else {
        CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }

    CustomEvent.cefEvents.filter(item => item[0] == name).map(item => {
        const t1 = performance.now();
        item[1](player, ...(JSON.parse(argss)));
        const t2 = performance.now();
        const time = t2 -t1
        if (time > PERFOMANCE_MIN_TIME) {
            console.debug(`Client event '${CustomEvent.decryptEventName(name)}' executed in ${time} ms by ${player?.user?.id ?? 0}.`)
            const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
            if (!existedResult) eventsPerfomanceTestResults.insert({
                count: 1,
                averageExecutionTime: time,
                eventName: name
            })
            else {
                existedResult.count++
                existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
            }
        }
    })
})

mp.events.add('call:cef', (player: PlayerMp, requestID: number, name: string, ...args: any[]) => {

    const nowTm = Date.now() / 1000 | 0;
    if(CustomEvent.clientPoolLog.has(`${player.id}_CEF____${name}`)){
        const old = CustomEvent.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam cef event ${name}`)
            }
            CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
        } else {
            CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
        }
    } else {
        CustomEvent.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }

    CustomEvent.cefEvents.filter(item => item[0] == name).map(async item => {
        if (!mp.players.exists(player)) return;
        let res:void;
        try {
            res = await item[1](player, ...args);
        } catch (error) {
            console.error(error);
        }
        if (!mp.players.exists(player)) return;
        player.call('call:cef:response', [requestID, res]);
    })
})
mp.events.add('playerJoin', (player: PlayerMp) => {
    player.call('setKey', [CustomEvent.key])
})