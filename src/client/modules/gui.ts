import {CustomEvent} from "./custom.event";
import {guiNames, guiNotHideList} from "../../shared/gui";
import {user} from "./user";
import {system} from "./system";
import {MonthNames2, weather} from "./world";
import {stopBuyCar} from "./businesses/autosalon";
import {exitCloth} from "./cloth";
import {disableControlGroup} from "./controls";
import {exitTattoo} from "./tattoo";
import {closeBarber} from "./businesses/barber";
import {stopLsc} from "./businesses/lsc";
import {currentMenu, MenuClass} from "./menu";
import {furniturePlace} from "./houses/furniturePlace";

const player = mp.players.local
let _zone = 'Подключение к сети GPS';
let _street = '...';
let pauseMenuColorArray: string[] = [];
for (let q = 0; q < 100; q++) pauseMenuColorArray.push(system.rgbToHex(system.getRandomInt(0, 255), system.getRandomInt(0, 255), system.getRandomInt(0, 255)))

mp.events.add('render', () => {
    if (gui.currentGui && mp.game.ui.isPauseMenuActive()) {
        mp.game.ui.setFrontendActive(false);
    }
});

setInterval(() => {
    if(!user.login) return;
    // mp.game.gxt.reset("PM_PAUSE_HDR")
    mp.game.gxt.set("PM_PAUSE_HDR", `<font color="${system.randomArrayElement(pauseMenuColorArray)}">Detroit ${user.name} [${user.id}] ~r~|~w~ Online: ${mp.players.length}`);
    CustomEvent.triggerCef('hud:zone', escape(gui.zone.getCurrentZone()), escape(gui.zone.getCurrentStreet()))
}, 2000)

CustomEvent.registerServer('stopcef', () => {
    gui.browser.destroy()
})

CustomEvent.registerServer('currentStreet', () => {
    return gui.zone.getCurrentStreet();
})

CustomEvent.register('currentStreet', () => {
    return gui.zone.getCurrentStreet();
})

CustomEvent.register('toggleChat', () => {
    mp.storage.data.alertsEnable.enableChat = !(!!mp.storage.data.alertsEnable.enableChat);
    CustomEvent.triggerCef('alerts:enable', mp.storage.data.alertsEnable);
});

export let unitpayBrowser: BrowserMp;

mp.events.add('unitpayexit', () => {
    if(unitpayBrowser && mp.browsers.exists(unitpayBrowser)) unitpayBrowser.destroy()
    unitpayBrowser = null;
})

mp.events.add('donate:add', (link: string) => {
    gui.setGui(null);
    if(unitpayBrowser && mp.browsers.exists(unitpayBrowser)) unitpayBrowser.destroy()
    unitpayBrowser = mp.browsers.new(link);
})

let radarStatus = true;
export const gui = {
    /** Статус отображения радара на экране */
    get radar(){
        let status = radarStatus && !(!!gui.currentGui) || guiNotHideList.includes(gui.currentGui);
        mp.game.ui.displayRadar(status)
        return status
    },
    set radar(val){
        radarStatus = val;
        mp.game.ui.displayRadar(radarStatus);
        updateSavezone();
    },
    zone: {
        updateZoneAndStreet: () => {
            const local = mp.players.local;
            let getStreet = mp.game.pathfind.getStreetNameAtCoord(
                local.position.x,
                local.position.y,
                local.position.z,
                0,
                0
            );
            _street = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName); // Return string, if exist
            _zone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(local.position.x, local.position.y, local.position.z));
        },
        getCurrentZone: () => {
            return _zone;
        },

        getCurrentStreet: () => {
            return _street;
        },
    },
    updateDirectionText: () => {
        let dgr = mp.players.local.getRotation(0).z + 180;
        if (dgr >= 22.5 && dgr < 67.5) return 'SE';
        if (dgr >= 67.5 && dgr < 112.5) return 'E';
        if (dgr >= 112.5 && dgr < 157.5) return 'NE';
        if (dgr >= 157.5 && dgr < 202.5) return 'N';
        if (dgr >= 202.53 && dgr < 247.5) return 'NW';
        if (dgr >= 247.5 && dgr < 292.5) return 'W';
        if (dgr >= 292.5 && dgr < 337.5) return 'SW';
        return 'S';
    },
    hud: {
        oldHudData: "",
        setCustomText: (text: string[], time: number) => { gui.execute(`CEF.hud.setTextText('${(JSON.stringify(text))}');CEF.hud.setTextTime(${time})`)},
        setCasinoInt: (inCasino: boolean) => gui.execute(`CEF.hud.setCasinoInt(${inCasino})`),
        setCustomZone: (name: string, color: string) => gui.execute(`CEF.hud.setCustomZone('${name}', '${color}')`),
        setWeapon: (weapon: boolean) => gui.execute(`CEF.hud.setWeapon(${weapon})`),
        setBullets: (b1: number, b2: number) => gui.execute(`CEF.hud.setBullets(${b1}, ${b2})`),
        setMoney: (money: number) => gui.execute(`CEF.hud.setMoney(${money})`),
        setChips: (money: number) => gui.execute(`CEF.hud.setChips(${money})`),
        setMoneyBank: (money: number) => gui.execute(`CEF.hud.setMoneyBank(${money})`),
        setRadio: (radio: boolean) => gui.execute(`CEF.hud.setRadio(${radio})`),
        lockMicrophone: (microphoneLock: number) => gui.execute(`CEF.hud.lockMicrophone(${microphoneLock})`),
        setHasWatch: (hasWatch: boolean) => gui.execute(`CEF.hud.setHasWatch(${hasWatch})`),
        setTime: (time: string) => gui.execute(`CEF.hud.setTime('${time}')`),
        setDate: (date: string) => gui.execute(`CEF.hud.setDate('${date}')`),
        setTemp: (temp: number) => gui.execute(`CEF.hud.setTemp(${temp})`),
        setCompass: (compass: string) => gui.execute(`CEF.hud.setCompass('${compass}')`),
        setZone: (zone: string, street: string) => gui.execute(`CEF.hud.setZone('${zone}', '${street}')`),
        showHud: (show: boolean) => gui.execute(`CEF.hud.showHud(${show})`),
        raceData: (position: number, lap: number, lapMax: number, racers: number) => gui.execute(`CEF.hud.raceData(${position}, ${lap}, ${lapMax}, ${racers})`),
        disableRace: () => gui.execute(`CEF.hud.disableRace()`),
        setInfoLinePos: (left: number, bottom: number) => gui.execute(`CEF.hud.setInfoLinePos(${left}, ${bottom})`),
        updateHelpToggle: (toggle: boolean) => gui.execute(`CEF.hud.updateHelpToggle(${toggle})`),
    },
    chat: {
        active: false,
        message: (message: string) => {
            CustomEvent.triggerCef('outputChatBox', message)
        }
    },
    browser: mp.browsers.new('http://package/cef/index.html'),
    execute: (command: string) => {
        if (mp.browsers.exists(gui.browser) && gui.browser.eventReady)
        {
            gui.browser.execute(command)
        }
    },
    /** Название текущего активного элемента GUI */
    currentGui: <guiNames>null,
    setGuiWithEvent: (guiName: guiNames, cefEventName?:string, ...cefEventArgs:any[]) => {
        gui.setGui(guiName)
        if(cefEventName) CustomEvent.triggerCef(cefEventName, ...cefEventArgs)
    },
    setGui: (guiName: guiNames, fromCef = false) => {
        if (gui.currentGui === guiName) return;
        gui.currentGui = guiName;
        if (hideHudStatus){
            mp.gui.chat.show(hideHudStatus);
        } else {
            mp.gui.chat.show(!(!!guiName));
        }
        if(!guiName){
            user.setBlur(false);
        } else {
            if (['reg', 'login'].includes(guiName)) user.setBlur(true)
            else user.setBlur(false);
        }
        gui.cursor = !!guiName;
        CustomEvent.triggerCef('cef:hud:showHud', !(!!guiName) || guiNotHideList.includes(guiName));
        gui.radar;
        if (!fromCef) CustomEvent.triggerCef('setGui', guiName);
    },
    freezeCursorDatas: false,
    /** Статус принудительно активного курсора */
    get cursor() {
        if (gui.freezeCursorDatas) mp.gui.cursor.visible = true;
        return gui.freezeCursorDatas
    },
    set cursor(status: boolean) {
        //if (mp.game.ui.isPauseMenuActive()) return;
        if(!gui.cursor && status) mp.game.invoke("0xFC695459D4D0E219", 0.5, 0.5);
        gui.freezeCursorDatas = status;
        mp.gui.cursor.visible = status;
    },
    get is_block_keys(){
        return gui.cursor || !!gui.currentGui || user.dead
    },
    drawText: (
        text: string,
        xPos: number,
        yPos: number,
        scale: number | [number, number] = 0.2,
        r: number = 255,
        g: number = 255,
        b: number = 255,
        a: number = 255,
        font: number = 0,
        justify: number = 1,
        shadow: boolean = false,
        outline: boolean = false
    ) => {
        if (!mp.game.ui.isHudComponentActive(0)) return false;

        mp.game.ui.setTextFont(font);
        if(typeof scale === "number") mp.game.ui.setTextScale(1, scale);
        else mp.game.ui.setTextScale(scale[0], scale[1])
        mp.game.ui.setTextColour(r, g, b, a);

        if (shadow) mp.game.invoke('0x1CA3E9EAC9D93E5E');
        if (outline) mp.game.invoke('0x2513DFB0FB8400FE');

        switch (justify) {
            case 1:
                mp.game.ui.setTextCentre(true);
                break;
            case 2:
                mp.game.ui.setTextRightJustify(true);
                mp.game.ui.setTextWrap(0, xPos);
                break;
        }

        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.addTextComponentSubstringPlayerName(text);
        mp.game.ui.drawText(xPos, yPos);
    },

    drawRect: (
        xPos: number,
        yPos: number,
        wSize: number,
        hSize: number,
        r: number,
        g: number,
        b: number,
        a: number
    ) => {
        if (!mp.game.ui.isHudComponentActive(0)) return false;
        let x = xPos + wSize * 0.5;
        let y = yPos + hSize * 0.5;
        mp.game.invoke('0x3A618A217E5154F0', x, y, wSize, hSize, r, g, b, a);
    },

    drawText3D: (caption: string, x: number, y: number, z: number, scale = 0.5, distanceScale = false) => {
        if (!mp.game.ui.isHudComponentActive(0)) return false;
        if (!scale) scale = 0.5
        z = z + 0.5;
        mp.game.graphics.setDrawOrigin(x, y, z, 0);
        let distScale = distanceScale ? Math.min(1 / (system.distanceToPos({ x, y, z }, player.position) / 2.6), 1) : 1


        mp.game.ui.setTextFont(0);
        mp.game.ui.setTextScale(0.1 * scale * distScale, 0.55 * scale * distScale);
        mp.game.ui.setTextColour(255, 255, 255, 255);
        mp.game.ui.setTextProportional(true);
        mp.game.ui.setTextDropshadow(0, 0, 0, 0, 255);
        mp.game.ui.setTextEdge(2, 0, 0, 0, 150);
        mp.game.invoke('0x2513DFB0FB8400FE');
        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.setTextCentre(true);
        mp.game.ui.addTextComponentSubstringPlayerName(caption);
        mp.game.ui.drawText(0, 0);
        mp.game.invoke('0xFF0B610F6BE0D7AF');
    },
}

setInterval(() => {
    if(!user.login) return;
    CustomEvent.triggerCef('hud:data', `${system.digitFormat(weather.realDay)} ${MonthNames2[weather.realMonth]}`, ``, ``, mp.players.length, user.isAdminNow(), user.id, weather.realHour, weather.realMinute)
}, 1000)

CustomEvent.registerServer('server:setGui', (guiName: guiNames, cefEventName?:string, ...cefEventArgs:any[]) => {
    gui.setGuiWithEvent(guiName, cefEventName, ...cefEventArgs);
})
mp.events.add('cef:setGui', (guiName: guiNames) => {
    gui.setGui(guiName, true);
})
mp.events.add('cef:setCursor', (status: boolean) => {
    gui.cursor = status;
})
mp.events.add('setChatActiveInput', (status: boolean) => {
    gui.chat.active = status;
})

// let currentCefState = false;
// setInterval(() => {
//     if (gui.currentGui && !mp.gui.cursor.visible) mp.gui.cursor.visible = true;
//     if(mp.gui.cursor.visible === currentCefState) return;
//     currentCefState = mp.gui.cursor.visible;
//     CustomEvent.triggerCef('setCursorState', mp.gui.cursor.visible)
// }, 100);

mp.events.add('console:cef', (...message: string[]) => {
    mp.console.logInfo(`[BROWSER] ${message.join(' ')}`)
})

// registerHotkey(84, () => {
//     if(gui.cursor) return;
//     if(gui.currentGui) return;
//     CustomEvent.triggerCef("chat:active:input")
// })

mp.events.add('chatMessage', (message: string) => CustomEvent.triggerServer('chatMessage', message))
mp.events.add('chatCommand', (command: string, ...args: string[]) => CustomEvent.triggerServer('chatCommand', command, ...args))

mp.events.add('auth:saveLogin', (login:string) => {
    mp.storage.data.login = login;
})

export let inputOnFocus = false
mp.events.add('inputOnFocus', (status: boolean) => {
    inputOnFocus = status
})

export let hideHudStatus = false;
CustomEvent.register('hidehud', () => {
    hideHud(!hideHudStatus)
})

export const hideHud = (status: boolean) => {
    hideHudStatus = status;
    mp.gui.chat.show(!hideHudStatus);
    gui.radar = !hideHudStatus;
    CustomEvent.triggerCef('cef:hud:showHud', !hideHudStatus);
}



let guiReady = false;
mp.events.add('gui:ready', async () => {
    mp.gui.chat.show(false);
    gui.browser.markAsChat();
    gui.browser.eventReady = true;
    await system.sleep(500)
    updateSavezone();
    if (guiReady) return;
    guiReady = true;
    CustomEvent.triggerCef('menu:loadDefaultPos', mp.storage.data.menuX || 0, mp.storage.data.menuY || 0, mp.storage.data.menuItems || 8)
    CustomEvent.callServer('accounts:exists', mp.game.invoke('0x198D161F458ECC7F')).then((status: boolean) => {
        gui.cursor = true;
        if (status) {
            gui.setGui('login')
            if (mp.storage.data.login) CustomEvent.triggerCef("auth:getLogin", mp.storage.data.login)
        } else {
            gui.setGui('reg')
        }
    })
})

mp.events.add('alerts:load', () => {
    CustomEvent.triggerCef('alerts:enable', mp.storage.data.alertsEnable)
})

mp.events.add('menu:setDefaultPos', (x: number, y: number) => {
    mp.storage.data.menuX = x;
    mp.storage.data.menuY = y;
})



// Object.defineProperty(mp.gui.chat, "push", {
//     writable: true
// })
// mp.gui.chat.push = (message: string) => CustomEvent.triggerCef('cef:chat:message', message);

CustomEvent.registerServer('showWithPicture', (title: string, sender: string, message: string, notifPic: string, time: number = 8000) => { 
    user.notify(`${sender ? sender+': ':''}${message}`, 'info', notifPic, time, title)
})



let bigmap = {
    status: 0,
    timer: <number>null
};

bigmap.status = 0;
bigmap.timer = null;

const canBeClosed: (guiNames | 'editorqweqweqwe' | 'unitpay')[]  = [
    'boombox',
    'casino',
    'editorqweqweqwe',
    'unitpay',
    'workselect',
    'fuel',
    'inventory',
    'shop',
    'idcard',
    'mainmenu',
    'autosalon',
    'clothshop',
    'tattooshop',
    'tablet',
    'barber',
    'atm',
    'vehiclesell',
    "adminchat",
    "admincheat",
    "greeting",
    'minigame',
    'family',
    'flat',
    'flatres',
    'lsc',
    'buycar',
    'mining',
    'jobSessions',
    'buyers',
    'interact',
    'numberplate',
    'animations',
    'rent',
    'bank',
    'orderofgoods',
    'casinoenter',
    'finishinitquests',
    'marriage',
    'gungame',
    'market',
    'farm',
    'potions',
    'candyShop',
    'lollipopsExchanger',
    'newYearsGift',
    'battlePass',
    'carSharing',
    'monopoly',
];

mp.events.add("render", () => {
    // if (user.login && gui.radar){
    //     let hpx = saveZone.left_x + (saveZone.width / 4)
    //     let apx = saveZone.left_x + saveZone.width - (saveZone.width / 4)
    //     const hp = player.getHealth();
    //     const ap = player.getArmour();
    //     if (hp) gui.drawText(`${hp}%`, hpx, 0.983 - saveZone.bottom_y)
    //     if (ap) gui.drawText(`${ap}%`, apx, 0.983 - saveZone.bottom_y)
    // }
    if (inputOnFocus || gui.currentGui && furniturePlace.lockControls) disableControlGroup.allControls();
    mp.game.ui.hideHudComponentThisFrame(1); // Wanted Stars
    mp.game.ui.hideHudComponentThisFrame(2); // Weapon Icon
    mp.game.ui.hideHudComponentThisFrame(3); // Cash
    mp.game.ui.hideHudComponentThisFrame(4); // MP Cash
    mp.game.ui.hideHudComponentThisFrame(6); // Vehicle Name
    mp.game.ui.hideHudComponentThisFrame(7); // Area Name
    mp.game.ui.hideHudComponentThisFrame(8);// Vehicle Class
    mp.game.ui.hideHudComponentThisFrame(9); // Street Name
    mp.game.ui.hideHudComponentThisFrame(13); // Cash Change
    // mp.game.ui.hideHudComponentThisFrame(17); // Save Game
    mp.game.ui.hideHudComponentThisFrame(20); // Weapon Stats
    //if (gui.cursor && gui.currentGui != 'deathpopup') mp.gui.cursor.show(false, true)
    
    if (mp.game.ui.isPauseMenuActive()) mp.gui.cursor.visible = false;
    
    if (mp.gui.cursor.visible) disableControlGroup.moveGui()
    if (mp.game.controls.isControlJustPressed(0, 48)) {
        bigmap.status++;
        if (bigmap.status == 1) {
            setTimeout(() => {
                if (bigmap.status == 1) bigmap.status = 0;
            }, 2000)
        }
        if (bigmap.status == 3) bigmap.status = 0;

        if (bigmap.status >= 2) {
            toggleBigMap = true;
        } else {
            toggleBigMap = false;
        }
        updateSavezone();
    }
    if (bigmap.status == 2) {
        mp.game.ui.setRadarBigmapEnabled(true, false);
        mp.game.ui.setRadarZoom(0.0);
    } else {
        mp.game.ui.setRadarBigmapEnabled(false, false);
    }
    if ((unitpayBrowser || gui.currentGui || currentMenu) && !mp.game.ui.isPauseMenuActive()){
        if (['dialog'].includes(gui.currentGui)){
            disableControlGroup.allControls();
        }
        mp.game.controls.disableControlAction(2, 200, true);
        if (mp.game.controls.isDisabledControlJustReleased(2, 200)) {
            if (currentMenu) {
                currentMenu.close()
            }
            if(unitpayBrowser){
                if(mp.browsers.exists(unitpayBrowser)) unitpayBrowser.destroy()
                unitpayBrowser = null;
            } else if ((canBeClosed as guiNames[]).includes(gui.currentGui)) {
                if (gui.currentGui === 'clothshop') exitCloth()
                if (gui.currentGui === 'tattooshop') exitTattoo()
                if (gui.currentGui === 'inventory') CustomEvent.triggerServer('inventory:close');
                if (gui.currentGui === 'autosalon')stopBuyCar();
                if (gui.currentGui === "barber")closeBarber()
                if (gui.currentGui === 'atm') user.stopAnim()
                if (gui.currentGui === 'monopoly') CustomEvent.triggerServer('monopoly:playerLeft');
                if (gui.currentGui === 'minigame') return CustomEvent.triggerCef('minigame:stop');
                if (gui.currentGui === 'lsc') stopLsc(true)
                if (gui.currentGui === 'mainmenu') {
                    CustomEvent.triggerCef('crosshair:setSettings', mp.storage.data.crosshair);
                    CustomEvent.triggerCef('crosshair:disable');
                }

                const closedGui = gui.currentGui;
                gui.setGui(null)

                mp.events.call('gui:menuClosed', closedGui);
            }
        }
    }
});

let acceptsIds = 0;
let acceptsIdsProm = new Map<number, (value?: boolean) => void>();
export const acceptButton = (text:string, img?:string, time = 15000):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        acceptsIds++;
        const id = parseInt(`${acceptsIds}`);
        acceptsIdsProm.set(id, resolve)
        CustomEvent.triggerCef('cef:alert:accept', id, text, "error", img, time);

    })
}

mp.events.add('cef:alert:accept:result', (id:number, status:boolean) => {
    let res = acceptsIdsProm.get(id)
    if(res) res(status)
})

mp.events.add('gui::closeCurrent', () => {
    gui.setGui(null);
});

CustomEvent.registerServer('cef:accept', (text: string, img: string, time = 15000) => {
    return new Promise((resolve, reject) => {
        acceptButton(text, img, time).then(status => {
            resolve(status)
        });
    })
})

let toggleBigMap = false;
const GetMinimapAnchor = () => {
    let safezone = mp.game.graphics.getSafeZoneSize();
    let safezone_x = 1.0 / 20.0;
    let safezone_y = 1.0 / 20.0;

    let aspect_ratio = mp.game.graphics.getScreenAspectRatio(false);
    let objectRes = mp.game.graphics.getScreenActiveResolution(1, 1);
    let res_x = objectRes.x;
    let res_y = objectRes.y;
    let xscale = 1.0 / res_x;
    let yscale = 1.0 / res_y;
    let bigMapMultipler = 1;
    //let bigMapMultipler = 2.3
    if (toggleBigMap) xscale = xscale * 1.48, bigMapMultipler = 2.3;

    let left_x = xscale * (res_x * (safezone_x * ((Math.abs(safezone - 1.0)) * 10)));
    let bottom_y = yscale * (res_y * (safezone_y * ((Math.abs(safezone - 1.0)) * 10)));
    let height = yscale * (res_y / 5.674) * bigMapMultipler;
    let width = xscale * (res_x / (4 * aspect_ratio));

    let height_px = height * res_y;
    let width_px = width * res_x;

    let left_px = left_x * res_x;
    let bottom_px = bottom_y * res_y;

    let Minimap = {
        width: width,
        height: yscale * (res_y / 5.674),
        left_x: left_x,
        bottom_y: bottom_y,
        right_x: left_x + width,
        top_y: bottom_y - height,
        x: left_x,
        y: bottom_y - height,
        xunit: xscale,
        yunit: yscale,
        res_x: res_x,
        res_y: res_y,
        height_px: gui.radar ? height_px : 0,
        width_px,
        left_px,
        bottom_px,
    };
    return Minimap;
};
export let saveZone = GetMinimapAnchor();

const updateSavezone = () => {
    saveZone = GetMinimapAnchor();
    if (gui.browser) {
        const { width_px, height_px, left_px, bottom_px } = saveZone;
        CustomEvent.triggerCef('cef:alert:setSafezoneInfo', width_px, height_px, left_px, bottom_px)
        gui.execute(`CEF.hud.setInfoLinePos(${left_px + width_px}, ${bottom_px})`);
        gui.zone.updateZoneAndStreet();
    }
}



// let half = 0;
// mp.events.add('render', () => {
//     half++;
//     if (half > 4) half = 0;
//     if (half) return;
//     gui.hud.updateHud();
// })

setInterval(() => {
    mp.game.invoke('0xF4F2C0D4EE209E20');
}, 25000);

setTimeout(() => {
    setInterval(updateSavezone, 5000);
}, 7500)

export let phoneOpened = false

mp.events.add('phone:opened', (status: boolean) => {
    phoneOpened = status;
})
export let terminalOpened = false

mp.events.add('terminal:opened', (status: boolean) => {
    terminalOpened = status;
})

let lastPhonePos = new mp.Vector3(0,0,0)

setInterval(() => {
    CustomEvent.triggerCef('phone:synctime', `${system.digitFormat(weather.realDay)}.${system.digitFormat(weather.realMonth+1)}.${system.digitFormat(weather.realYear)}`, `${system.digitFormat(weather.realHour)}:${system.digitFormat(weather.realMinute)}`, weather.getFullRpTime())
    const newPos = mp.players.local.position;
    if(system.distanceToPos(lastPhonePos, newPos) > 1){
        CustomEvent.triggerCef('phone:syncpos', player.position.x, player.position.y, player.position.z)
        lastPhonePos = newPos;
    }
}, 1000)