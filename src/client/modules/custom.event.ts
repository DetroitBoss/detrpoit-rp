import {CustomEventBase} from "../../shared/custom.event";
import {user} from "./user";

type serverEventHandle = (...args: any[]) => void
mp.events.add('setKey', (key: number) => {
    CustomEvent.key = key
})
mp.events.add('alerts:load', () => {
    CustomEvent.triggerCef('setKey', CustomEvent.key)
})
export class CustomEvent extends CustomEventBase {
    static callServerResponse = 1
    static requestServerHandle = new Map<number, (value?:any)=>any>()
    static callServerResponseCEF = 1
    static requestServerHandleCEF = new Map<number, (value?:any)=>any>()
    static registerServerEvents: [string, serverEventHandle][] = []
    static registerSocketEvents: [string, serverEventHandle][] = []

    static key: number
    static encryptEventName(eventName: string): string {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ CustomEvent.key).toString(16))
            .join('g')
    }

    static triggerServer(eventName:string, ...args:any[]) {
        mp.events.callRemote('trigger:client', CustomEvent.encryptEventName(eventName), JSON.stringify(args))
    }
    static callServer(eventName:string, ...args:any[]):Promise<any> {
        const requestID = CustomEvent.callServerResponse++;
        return new Promise((resolve, reject) => {
            CustomEvent.requestServerHandle.set(requestID, resolve)
            mp.events.callRemote('call:client', requestID, CustomEvent.encryptEventName(eventName), JSON.stringify(args))
        })
    }
    static triggerCef(eventName: string, ...args: any[]){
        mp.browsers.forEach(browser => {
            if(browser.eventReady)
            {
                browser.execute(`customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`)
            }
        });
    }
    static forceTriggerCef(eventName: string, ...args: any[]){
        mp.browsers.forEach(browser => {
            browser.execute(`customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`)
        });
    }
    static registerServer(eventName: string, handle: serverEventHandle){
        this.registerServerEvents.push([eventName, handle]);
    }
    static registerSocket(eventName: string, handle: serverEventHandle){
        this.registerSocketEvents.push([eventName, handle]);
    }
}
mp.events.add('socket:server', (event: string, ...data: any[]) => {
    CustomEvent.registerSocketEvents.filter(item => item[0] == event).map(item => {
        item[1](...data)
    })
})

mp.events.add("client:trigger:event", (eventname: string, argsstring: string) => triggerEvent(eventname, argsstring))

mp.events.add('toggleEventsLogging', () => {
    enableEventsLogging = !(!!enableEventsLogging);
});

let enableEventsLogging = mp.storage.data.enableEventsLoggin

const eventsCountMap = new Map<string, number>();
const triggerEvent = async (eventname: string, argsstring: string) => {

    if (!eventsCountMap.has(eventname)) {
        eventsCountMap.set(eventname, 0);
    }

    eventsCountMap.set(eventname, (eventsCountMap.get(eventname) + 1));

    const events = CustomEvent.registerServerEvents.filter(item => item[0] == eventname);


    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering started: ${eventname}`);
    }

    if (events.length == 0) return mp.console.logError("[CustomEvent] trigger non exists event " + eventname, true);
    events.map(q => {
        try {
            q[1](...(JSON.parse(argsstring)));
        } catch (error) {

            if (enableEventsLogging) {
                mp.console.logError(`event (${eventname}) catch an error: ${error}`);
            }
        }
    });

    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering ended: ${eventname}`);
    }
}

let splitTrigger = new Map<string, string[]>();

mp.events.add("client:trigger:event:split", async (tid: number, index: number, last: boolean, eventname: string, argsstring: string) => {
    const events = CustomEvent.registerServerEvents.filter(item => item[0] == eventname);
    if (events.length == 0) return mp.console.logError("[CustomEvent] trigger split non exists event "+eventname, true);
    if (!splitTrigger.has(`${tid}_${eventname}`)){
        splitTrigger.set(`${tid}_${eventname}`, []);
    }

    let d = splitTrigger.get(`${tid}_${eventname}`);
    d[index] = argsstring;
    if (last){
        triggerEvent(eventname, d.join(''));
    } else {
        splitTrigger.set(`${tid}_${eventname}`, d);
    }
})
mp.events.add("client:call:event", async (eventname: string, requestID: number, argsstring: string) => {
    try {
        let q = CustomEvent.registerServerEvents.find(item => item[0] == eventname);
        if (!q) mp.events.callRemote('client:call:event:result', requestID, null);
        let res = await q[1](...(JSON.parse(argsstring)));
        mp.events.callRemote('client:call:event:result', requestID, res)
    } catch (error) {
        mp.console.logError(error, true);
    }
})

mp.events.add('cef:trigger:event', (eventName: string, args:string) => {
    CustomEvent.triggerCef(eventName, ...JSON.parse(args))
})

mp.events.add('call:client:response', (requestID:number, res:any) => {
    let resolve = CustomEvent.requestServerHandle.get(requestID)
    if(!resolve) return;
    resolve(res);
});
mp.events.add('call:cef:response', (requestID:number, res:any) => {
    mp.browsers.forEach(browser => {
        if(browser.eventReady) browser.execute(`customevent.callServerResponseHandle(${requestID}, '${JSON.stringify(res)}');`)
    });
});

mp.events.add('call:server', (requestID:number, eventName: string, ...args:any[]) => mp.events.callRemote('call:cef', requestID, CustomEvent.encryptEventName(eventName), ...args))
mp.events.add('call:clientfromcef', async (requestID:number, eventName: string, ...args:any[]) => {
    const fnd = await CustomEvent.call(eventName, ...args)
    mp.browsers.forEach(browser => {
        if(browser.eventReady) browser.execute(`customevent.callClientResponseHandle(${requestID}, '${JSON.stringify(fnd)}');`)
    });
})

mp.events.add('trigger:server', (name:string, args:string) => mp.events.callRemote('trigger:cef', CustomEvent.encryptEventName(name), args));

mp.events.add('testDebug', () => {
    let max = { event: 'none', count: -1 };
    for (let key of [...eventsCountMap.keys()]) {
        if (eventsCountMap.get(key) > max.count) {
            max = { event: key, count: eventsCountMap.get(key) }
        }
    }

    user.notify(`event with max count: ${max.event}, (${max.count})`);

    user.notify('test')
})
