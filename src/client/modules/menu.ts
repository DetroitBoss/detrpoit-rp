import {MenuInterface, MenuItem, MenuItemBase, menuSprite} from "../../shared/menu";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";
import {tempCursorStatus} from "./controls";
import {user} from "./user";


export interface MenuItemClient extends MenuItem {
    SetRightLabel?(text: string): MenuItemClient;
    SetIcon?(url: string): MenuItemClient;
    onchangeColorFast?: (value: { r: number, g: number, b: number; }, item: MenuItem, index: number) => any;
    [x: string]: any;
}

export let menuid = 1;
export let currentMenu: MenuClass;

function filter(str: string) {
    if (!str) return "";
    return str.replace(/\n/gi, ' ').replace(/"/gi, "").replace(/'/gi, "")
}

function itemMenuCEF(item: MenuItemClient): MenuItemBase {
    return {
        name: item.name,
        more: item.more,
        desc: item.desc,
        type: item.type,
        rangeselect: item.rangeselect,
        list: item.list,
        listSelected: item.listSelected,
        color: item.color,
        icon: item.icon
    }
}

let dialogHandlesIds = 1;
let dialogHandles = new Map<number, [(value: any) => void, (err: any) => void]>();



export function DialogInput(title: string, value?: string, limit?: number, type?: "text" | "password" | "textarea" | "passwordNumber"): Promise<string>;
export function DialogInput(title: string, value?: number, limit?: number, type?: "int" | "float"): Promise<number>;
export function DialogInput(title: string, value: string | number = '', limit = 30, type: "text" | "password" | "passwordNumber" | "int" | "float" | "textarea" = "text"){
    return new Promise((resolve, reject) => {
        gui.setGui('dialog');
        const id = parseInt(`${dialogHandlesIds++}`);
        CustomEvent.triggerCef('cef:dialog:init', id, title, '', type, "Отмена", "Отправить", value, limit)
        const res = (res:string) => {
            let rets = ["int", "float"].includes(type) ? parseInt(res) : res;
            resolve(rets);
        }
        dialogHandles.set(id, [res, reject])
    })
};




CustomEvent.registerServer('server:input', (title: string, value = '', limit = 30, type = "text") => {
    return DialogInput(title, value, limit, type)
})

mp.events.add('client:dialog:submit', (id:number, value:any) => {
    let v = dialogHandles.get(id);
    if(!v) return;
    v[0](value);
})



let tryPaymentD = new Map<number, [(value: any) => void, (err: any) => void]>();
let pids = 1;
CustomEvent.registerServer('server:payment', (name: string, sum: number) => {
    return new Promise(resolve => {
        tryPayment(name, sum).then(status => {
            setTimeout(() => {
                resolve(status);
            }, 200)
        })
    });
})

mp.events.add('server:payment:res', (id: number, statuss: string) => {
    const q = tryPaymentD.get(id);
    if(q) q[0](statuss);
    tryPaymentD.delete(id);
    tempCursorStatus(false)
})

const tryPayment = (name: string, sum: number) => {
    return new Promise((resolve, reject) => {
        pids++;
        const id = pids;
        tryPaymentD.set(id, [resolve, reject]);
        CustomEvent.triggerCef('server:payment:data', name, sum, id)
        tempCursorStatus(true)
    })
}

export class MenuClass {
    /** Специальный тег, если необходим */
    tag?:any;
    /** Параметр множителя базовой ширины меню, на случай если это необходимо */
    widthMultipler = 1;
    /** Уникальный ID каждого конструктора меню */
    readonly id: number;
    serverid?: number;
    workAnyTime?: boolean;
    /** Защита от закрытия меню при выходе из колшейпа */
    exitProtect = false;
    /** Заголовок меню */
    title: string;
    /** Подзаголовок меню */
    subtitle: string;
    /** Пункты меню */
    items: MenuItemClient[];
    /** Доп параметры */
    customParams: {
        isResetBackKey?: boolean,
        isDisableAllControls?: boolean,
        DisableAllControlsOnClose?: boolean;
        closeEvent?: boolean;
        selected?: number;
    }
    closedMenu: boolean;
    opened: boolean;
    onclose: () => Promise<void> | void;    
    spriteName?: menuSprite;
    constructor(title?: string, subtitle?: string, items?: MenuItemClient[]) {
        if (currentMenu) currentMenu.close();
        this.opened = false;
        this.closedMenu = false;
        this.id = parseInt(`${menuid++}`);
        this.title = filter(title);
        this.subtitle = filter(subtitle);
        this.items = (items ? items : []).map((item) => {
            if (!item.type) item.type = "select";
            return item;
        });
        this.customParams = {};

        
    }
    /** Добавляет новые пункты в текущее меню */
    newItem(item: MenuItemClient) {
        if (!this.items) return;
        if (!item.type) item.type = "select"
        //if(item.more) item.name+=" "+item.more, item.more = null;


        if (item.name) item.name = filter(item.name);
        if (item.more) item.more = filter(String(item.more));
        if (item.desc) item.desc = filter(item.desc);
        if (item.list) {
            item.list.map(q => {
                q = filter(q);
            })
        }

        item.SetRightLabel = (text) => {
            item.more = text;
            return item;
        }
        item.SetIcon = (url) => {
            item.icon = url;
            return item;
        }
        this.items.push(item);
        if (this.opened) {
            CustomEvent.triggerCef('menu:addItems', itemMenuCEF(item))
        }
        return item
    }
    /** Отрисовать меню в текущем состоянии у клиента */
    async open(selected: number = null) {
        setTimeout(() => {
            if (!this.items) return;
            this.customParams.selected = selected ? selected : 0
            this.items.forEach(item => {
                if (item.type == "list") {
                    if (item.Index) item.listSelected = item.Index
                    if (!item.listSelected) item.listSelected = 0;
                    item.listSelectedName = item.list[item.listSelected]
                }
                if (item.name) item.name = filter(item.name);
                if (item.more) item.more = filter(String(item.more));
                if (item.desc) item.desc = filter(item.desc);
                if (item.list) {
                    item.list.map(q => {
                        q = filter(q);
                    })
                }
            })
            let data: MenuInterface = {
                widthMultipler: this.widthMultipler,
                id: this.id,
                select: this.customParams.selected,
                title: this.title,
                subtitle: this.subtitle,
                items: [...this.items].map(q => { return itemMenuCEF(q) }),
                sprite: this.spriteName ? this.spriteName : null,
                fromserver: !!this.serverid
            }
            this.opened = true;
            currentMenu = this;
            CustomEvent.triggerCef('menu:open', data)
        }, 100)
    }
    /** Функция закрытия меню */
    close(fromCef = false) {
        currentMenu = null;
        if (!fromCef) CustomEvent.triggerCef('menu:close');
        if (fromCef && this.onclose) this.onclose();
    }



    // Declare Old methoods
    AddMenuItem(title: string, subtitle?: string) {
        return this.newItem({
            name: title,
            desc: subtitle ? subtitle : "",
        })
    }
    AddMenuItemList(title: string, list: string[], subtitle?: string) {
        return this.newItem({
            type: "list",
            list,
            name: title,
            desc: subtitle ? subtitle : ""
        })
    }
    static closeMenu(fromCef = false){
        if (!currentMenu) return;
        currentMenu.close(fromCef);
    }
}

mp.events.add('menu:close', () => {
    MenuClass.closeMenu(true);
})

CustomEvent.registerServer('menu:server:close', () => {
    MenuClass.closeMenu();
})

mp.events.add('menu:setindex', (id: number, select: number) => {
    if (!currentMenu) return;
    if (currentMenu.id != id) return;
    let item = currentMenu.items[select];
    if (!item) return;
})

mp.events.add('menu:select', (id: number, select: number) => {
    if (!currentMenu) return;
    if (currentMenu.id != id) return;
    let item = currentMenu.items[select];
    if (!item) return;
    if (typeof item.onpress == "function") item.onpress(item, select);
})

mp.events.add("menu:colorChange", (itemid: number, value: string) => {
    if (!currentMenu) return;
    let item = currentMenu.items[itemid];
    if (!item) return;
    if (item.type !== "color") return;
    item.color = JSON.parse(value);
    if (typeof item.onchangeColor == "function") item.onchangeColor(item.color, item, itemid);
})
mp.events.add("menu:colorChangeFast", (itemid: number, value: string) => {
    if (!currentMenu) return;
    let item = currentMenu.items[itemid];
    if (!item) return;
    if (item.type !== "color") return;
    item.color = JSON.parse(value);
    if (typeof item.onchangeColorFast == "function") item.onchangeColorFast(item.color, item, itemid);
})

mp.events.add('menu:onchange', (id: number, select: number, value: number) => {
    if (!currentMenu) return;
    if (currentMenu.id != id) return;
    let item = currentMenu.items[select];
    if (!item) return;
    if (item.type == "list" && !item.list[value]) return;
    item.listSelected = value;
    if (item.type == "list") item.listSelectedName = item.list[value];
    if (typeof item.onchange == "function") item.onchange(item.listSelected, item, select);
})





let reopen = false;

CustomEvent.registerServer('server:menu:updateItem', (index: number, itemDto: MenuItem) => {
    const item = currentMenu.items[index] as MenuItemBase;
    item.more = itemDto.more;
    item.color = itemDto.color;
    item.name = itemDto.name;
    item.type = itemDto.type;
    item.icon = itemDto.icon;
    item.desc = itemDto.desc;
    item.list = itemDto.list;
    item.listSelected = itemDto.listSelected;
    item.rangeselect = itemDto.rangeselect;

    CustomEvent.triggerCef('menu:updateItem', index, item);
});

CustomEvent.registerServer('server:menu:open', (id: number, title: string, subtitle: string, items: MenuItem[], customParams: {
    isResetBackKey?: boolean,
    isDisableAllControls?: boolean,
    DisableAllControlsOnClose?: boolean;
    closeEvent?: boolean;
    selected?: number;
}, workAnyTime: boolean, sprite: menuSprite, widthMultipler = 1) => {
    openMenu(id, title, subtitle, items, customParams, workAnyTime, sprite, widthMultipler)
})

function openMenu(id: number, title: string, subtitle: string, items: MenuItem[], customParams: {
    isResetBackKey?: boolean,
    isDisableAllControls?: boolean,
    DisableAllControlsOnClose?: boolean;
    closeEvent?: boolean;
    selected?: number;
}, workAnyTime: boolean = false, sprite: menuSprite, widthMultipler = 1) {

    reopen = true;

    let m = new MenuClass(title, subtitle);
    m.widthMultipler = widthMultipler;
    if (sprite) m.spriteName = sprite;
    m.serverid = id;
    items.map((item) => {
        // let sendEvent = false;
        m.newItem({
            ...item,
            onpress: (_, index) => {
                // if(sendEvent) return;
                // sendEvent = true;
                mp.events.callRemote('client:menu:itemSelect', id, index)
                // setTimeout(() => {
                //     sendEvent = false;
                // }, 1000)
            },
            onchange: (val, _, index) => {
                // if(sendEvent) return;
                mp.events.callRemote('client:menu:listChange', id, index, val);
                // sendEvent = true;
                // setTimeout(() => {
                //     if(val !== _.listSelected) mp.events.callRemote('client:menu:listChange', id, index, val);
                //     sendEvent = false;
                // }, 1000)
            },
            onchangeColor: (val, _, index) => {
                // if(sendEvent) return;
                // sendEvent = true;
                const s = JSON.stringify(val);
                mp.events.callRemote('client:menu:colorChange', id, index, s)
                // setTimeout(() => {
                //     sendEvent = false;
                // }, 500)
            }
        })
    })
    if (items.length === 0){
        m.newItem({
            name: 'Пусто'
        })
    }
    m.onclose = () => {
        if (reopen) return;
        if (!customParams.closeEvent) return;
        mp.events.callRemote('client:menu:closeEvent', id)
    }
    m.workAnyTime = workAnyTime;
    m.open(customParams.selected);

    reopen = false;
}