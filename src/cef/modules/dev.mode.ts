import {guiNames} from "../../shared/gui";
import {CEF} from "./CEF";


if (location.host.includes(':1234')){
    var mp = {
        trigger: (eventName:string, ...args:any[]) => {
            console.log('[TRIGGER]', eventName, ...args)
        },
        invoke: (eventName:string, ...args:any[]) => {
            console.log('[INVOKE]', eventName, ...args)
        }
    } as Mp;
    // @ts-ignore
    global.mp = mp
    CEF.setId(1);
    if(location.href.includes('inventory_test')){
        setTimeout(() => {
            CEF.gui.setGui('inventory')
        }, 100)
    }
    if (location.href.split('test=').length > 1){
        setTimeout(() => {
            CEF.gui.setGui(location.href.split('test=')[1].replace(/#/g, '') as any)
        }, 100)
    }
    
}

export let devPages: {
    name: string;
    gui: guiNames;
    onClick: () => void;
}[] = []
export let registerDebugPage = (name: string, gui: guiNames, onClick?: () => void) => {
    let pages = [...devPages];
    if (pages.find(q => q.name === name)) pages.find(q => q.name === name).onClick = onClick
    else pages.push({ name, gui, onClick });
    devPages = pages
}


export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
// @ts-ignore
if (global.mp) global.mp.Vector3 = Vector3 as any