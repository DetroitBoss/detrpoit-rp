import {CustomEvent} from "./custom.event";
import io from "socket.io-client";
import {CEF} from "./CEF";

type SocketEventCallback = (...data: any[])=>void
type SocketEvent = [string, SocketEventCallback, number]

let SocketEventIds = 110;

export class CustomEventSocket {
    static events = <SocketEvent[]>[
        ['socket:event:call:client', (event: string, ...data: any[]) => {
            CustomEvent.triggerClient('socket:server', event, ...data);
        }, 0]
    ];

    static register(name: string, callback: SocketEventCallback) {
        SocketEventIds++;
        const ids = SocketEventIds;
        const ev: SocketEvent = [name, callback, ids];
        this.events.push(ev);
        return {
            destroy: () => {
                const index = this.events.findIndex(q => q[2] === ids);
                if(index > -1) this.events.splice(index, 1)
            }
        }
    }

    static callServer(event: string, ...args: any[]) {
        if (!currentSocket) return;
        currentSocket.emit(event, ...args);
    }
}

let key: string;
let currentSocket: Socket
setTimeout(() => {

    CustomEvent.register('socket:joinroom', (room: string) => {
        if(!currentSocket) return;
        // currentSocket.
    })


    CustomEvent.register('signatureKey', (keyS: string, _, ip: string) => {
        setTimeout(() => {
            key = keyS;
            const socket  = io(`ws://${ip}:3402`);
            // @ts-ignore
            global.socket = socket
            const c = () => {
                currentSocket = socket;
                socket.emit('verify', key, CEF.id);
                socket.on('eventreceive', (name: string, ...params: any[]) => {
                    CustomEventSocket.events.filter(q => q[0] === name).map(item => item[1](...params))
                });
            }
            socket.on('connect', () => {c();});
            socket.on('reconnect', () => {c()});
        }, 1000)
    })
}, 5000)

