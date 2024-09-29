import {CustomEventBase} from "../../shared/custom.event";

export class CustomEvent extends CustomEventBase {
    static triggerCef(eventName: string, args: string){
        try {
            this.registerHanldes.filter(item => item[0] == eventName).map(item => {
                item[1](...JSON.parse(args))
            })
            if(['cef:alert:setSafezoneInfo', 'currentHotkeys', 'phone:synctime', 'hud:data', 'hud:zone', 'phone:syncPos', 'deathpopup:show', 'hud:speedometer', 'phone:syncPos'].includes(eventName)) return;
            console.log('trigger triggerCef ' + eventName)
        } catch (e) {
            console.log('error in triggerCef event: ' + e)
            console.log('event name '+eventName)
            console.log('args '+args)
        }
    }
    static callServerResponse = 0
    static callClientResponse = 0
    static requestServerHandle = new Map<number, (value?: any) => any>()
    static requestClientHandle = new Map<number, (value?: any) => any>()
    static triggerClient(name:string, ...args:any[]) {
        mp.trigger(name, ...args);
    }
    static lastServerSend = 0;
    static triggerServer(eventName: string, ...args: any[]) {
        mp.trigger("trigger:server", eventName, JSON.stringify(args));
    }
    static callServer(eventName: string, ...args: any[]): Promise<any> {
        const requestID = this.callServerResponse++;
        return new Promise((resolve, reject) => {
            this.requestServerHandle.set(requestID, resolve)
            mp.trigger('call:server', requestID, eventName, ...args)
        })
    }
    static callClient(eventName: string, ...args: any[]): Promise<any> {
        const requestID = this.callClientResponse++;
        return new Promise((resolve, reject) => {
            this.requestClientHandle.set(requestID, resolve)
            mp.trigger('call:clientfromcef', requestID, eventName, ...args)
        })
    }
    static callServerResponseHandle(requestID:number, val:string) {
        this.requestServerHandle.get(requestID)(JSON.parse(val))
    }
    static callClientResponseHandle(requestID:number, val:string) {
        this.requestClientHandle.get(requestID)(JSON.parse(val))
    }
}


// @ts-ignore
global.customevent = CustomEvent, window.customevent = CustomEvent;