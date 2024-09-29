import {CustomEvent} from "./custom.event"
import {guiNames} from "../../shared/gui";
import {FILE_STORAGE_URL} from "../../shared/file.storage";
import sounds from '../assets/sounds/*.ogg'
import soundswv from '../assets/sounds/*.wav'
import {WEB_DATA_PORT_EXTERNAL, WEB_DATA_PORT_INTERNAL} from "../../shared/web";
import {CharacterCreatorDress, DressCefItem} from "../../shared/character";
//import soundsmps3 from "*.mp3";
import soundsmps3 from '../assets/sounds/*.mp3'
import {Howl} from "howler";
import { ICrosshairSettings } from '../../shared/crosshair'
import {ClothData, GloveClothData} from "../../shared/cloth";
import {fractionCfg} from "./fractions";

let fraction = 0;
let rank = 0;
let tag = "";

let family = 0, familyRank = 0;

setTimeout(() => {
    CustomEvent.register('user:fraction', (val: number) => {
        fraction = val
    })
    CustomEvent.register('user:rank', (val: number) => {
        rank = val
    })
    CustomEvent.register('user:tag', (val: string) => {
        tag = val
    })
    CustomEvent.register('signatureKey', (val: string, announce: boolean, ip: string) => {
        signatureKey = val
        testServer = announce
        serverIp = ip;
        loadDress();
    })
    CustomEvent.register('user:family', (val: number, rank: number) => {
        family = val;
        familyRank = rank;
    })
}, 3000)
let signatureKey: string = '';
let serverIp: string = '127.0.0.1';
let testServer = false

let money = 0;
let bank = 0;
let chips = 0;


export let dressCfg: {
    id: number;
    name: string;
    category: number;
    male: number;
    data: ClothData[] | GloveClothData[];
}[] = [];


const loadDress = () => {
    CEF.getDressData().then(data => {
        dressCfg = data;
    })
}

CustomEvent.register('dressData:remove', (id: number) => {
    dressCfg.map((item, index) => {
        if (item.id === id) dressCfg.splice(index, 1);
    })
})
CustomEvent.register('dressData:new', (datas: string) => {
    if (!datas) return;
    const data: {
        id: number;
        name: string;
        category: number;
        male: number;
        data: {
            component: number;
            drawable: number;
            texture: number;
            name?: string;
        }[][];
    }[] = JSON.parse(datas);
    data.map(item => {
        let ind = dressCfg.findIndex(q => q.id === item.id);
        if (ind > -1) {
            dressCfg[ind] = { ...dressCfg[ind], ...item };
        } else {
            dressCfg.push(item);
        }
    })
})

let globalhownsound: Howl
export const CEF = {
    triggerChatCommand: (...args: string[]) => {
        mp.trigger('chatCommand', ...args);
    },
    /** Получить каталог бизнеса */
    getCatalog: (id: number): Promise<{
        item: number;
        price: number;
        count: number;
        max_count: number;
    }[]> => {
        return new Promise(resolve => {


            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", `http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/business/catalog?id=${id}`, false ); // false for synchronous request
            xmlHttp.send( null );
            return resolve(JSON.parse(xmlHttp.responseText));


        })
    },
    /** Получить каталог одежды для создания персонажа */
    getDressPersonage: (male: number): Promise<CharacterCreatorDress[]> => {
        return new Promise(resolve => {

            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", `http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/personage/dress?male=${male}`, false ); // false for synchronous request
            xmlHttp.send( null );
            return resolve(JSON.parse(xmlHttp.responseText));

        })
    },
    /** Получить каталог одежды */
    getDressData: (): Promise<DressCefItem[]> => {
        return new Promise(resolve => {

            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", `http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/dress/data`, false ); // false for synchronous request
            xmlHttp.send( null );
            return resolve(JSON.parse(xmlHttp.responseText));

        })
    },
    /** Отправка введённого обычного промокода, который сгенерировал админ */
    enterPromocode: (code: string) => {
        if(!code) return;
        if(typeof code !== 'string') return;
        CustomEvent.triggerServer('promocode:use', code.toLowerCase());
    },
    /** Отправка промокода медиа, то есть стримера. Этот промокод он сможет ввести только раз */
    enterPromocodeMedia: (code: string) => {
        if(!code) return;
        if(typeof code !== 'string') return;
        CustomEvent.triggerServer('promocode:use:media', code.toLowerCase());
    },
    stopSound: () => {
        if(globalhownsound && globalhownsound.playing()) {
            const sound = globalhownsound;
            sound.unload();
            //let int = setInterval(() => {
            //    sound.volume(Math.max(0, sound.volume() - 0.01));
            //    if(sound.volume() <= 0){
            //        clearInterval(int);
            //        sound.unload();
            //    }
            //}, 100)
        }
    },
    playSound: (url: string, volume = 0.08, global = true) => { 
        let soundList:{[path:string]:string} = sounds as any,
            soundswvList:{[path:string]:string} = soundswv as any;

        let urls = soundList[url] || soundswvList[url] || soundsmps3[url] || url;
        if(global){
            CEF.stopSound();
        }
        let item = new Howl({
            src: [urls],
            autoplay: true,
            loop: false,
            volume
        });
        if(global) globalhownsound = item;
        return item
    },
    getSignatureURL(document: string){
        return `http://${FILE_STORAGE_URL}/files/signatures/${testServer ? 'test_' : ""}${document}.png`
    },
    getBusinessURL(id: string | number){
        return `http://${FILE_STORAGE_URL}/files/business/${testServer ? 'test_' : ""}${id}.png`
    },
    getHomeURL(interrior: number){
        return `http://${FILE_STORAGE_URL}/files/homes/${interrior}.png`
    },
    getVehicleURL(model: string){
        return `http://${FILE_STORAGE_URL}/files/vehicles/${model.toLowerCase()}.png`
    },
    getAnimsURL(animName: string){
        return `http://${FILE_STORAGE_URL}/files/anims/${animName}.gif`
    },
    saveSignature(signature: File, document: string): Promise<boolean>{
        return new Promise((resolve) => {

            let req = new XMLHttpRequest();
            let formData = new FormData();

            formData.append("photo", signature);
            req.open("POST", `https://${FILE_STORAGE_URL}/signature/load?id=${CEF.id}&code=${CEF.signature}&document_name=${testServer ? 'test_' : ""}${document}`);
            req.send(formData);

            req.onload = function () {
                if (req.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                    resolve(false)
                } else { // если всё прошло гладко, выводим результат
                    resolve(true)
                }
            };


            req.onerror = function () {
                resolve(false)
            };

        })
    },
    get signature(){
        return signatureKey
    },
    setGPS: (x: number, y: number, z?: number) => {
        CustomEvent.triggerClient('gps:set', x, y, z)
    },
    id: location.host.includes(':1234') ? 1 : 0,
    admin: false,
    setId: (id:number) => {
        CEF.id = id;
    },
    setAdmin: (status:boolean) => {
        CEF.admin = status;
    },
    formatTime: (time: number) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        let minutes_str = String(minutes);
        let seconds_str = String(seconds);
        if (minutes < 10) minutes_str = `0${minutes}`;
        if (seconds < 10) seconds_str = `0${seconds}`;
        return `${minutes_str}:${seconds_str}`;
    },
    user: {
        name: <string>null,
        get fraction() {
            return fraction
        },
        set fraction(val) {
            fraction = val;
        },
        get fractionCfg() {
            return CEF.user.fraction ? fractionCfg.getFraction(CEF.user.fraction) : null
        },
        get rank() {
            return rank
        },
        set rank(val) {
            rank = val
        },
        get tag() {
            return tag
        },
        get isLeader() {
            if (!CEF.user.fraction) return false;
            return fractionCfg.getLeaderRank(this.fraction) === this.rank
        },
        get isSubLeader() {
            if (!CEF.user.fraction) return false;
            return fractionCfg.getSubLeaderRank(this.fraction) <= this.rank
        },
        get money(){
            return money
        },
        get chips(){
            return chips
        },
        get bank(){
            return bank
        },
        set money(val){
            money = val
        },
        set chips(val){
            chips = val
        },
        set bank(val){
            bank = val
        },
        get family() {
            return family
        },
        set family(val) {
            family = val;
        },
        get familyRank() {
            return familyRank
        },
        set familyRank(val) {
            familyRank = val;
        },
        getIsMale: async () => {
            return await CustomEvent.callClient('cef:getIsMale');
        }
    },
    alert: {
        setSafezoneInfo: (width: number, height: number, left: number, bottom: number) => CustomEvent.trigger('cef:alert:setSafezoneInfo', width, height, left, bottom),
        setAlert: (type: "alert" | "info" | "warning" | "success" | "error", text: string, img?: string, time = 5000) => CustomEvent.trigger('cef:alert:setAlert', type, text, img, time),
        setHelp: (text: string) => CustomEvent.trigger('cef:alert:setHelp', text),
        setHelpKey: (key: string, text: string) => CustomEvent.trigger('cef:alert:setHelpKey', key, text),
        removeHelpKey: () => CustomEvent.trigger('cef:alert:removeHelpKey'),
    },
    gui: {
        saveLogin: (login:string) => {
            CustomEvent.triggerClient('auth:saveLogin', login)
        },
        currentGui: <guiNames> null,
        setGui: (gui: guiNames) => {
            CEF.gui.currentGui = gui;
            CustomEvent.trigger('setGui', gui);
        },
        setCursor: (status: boolean) => {
            mp.trigger('cef:setCursor', status);
        },
        enableCusrsor: () => {
            mp.trigger('enableCursor');
        },
        disableCusrsor: () => {
            mp.trigger('disableCursor');
        },
        close: () => {
            CustomEvent.triggerClient('gui::closeCurrent');
        }
    },
    hud: {
        setCasinoInt: (inCasino: boolean) => {},
        setCustomZone: (zoneName: string, zoneColor: string) => {},
        setWeapon: (weapon: boolean) => {},
        setBullets: (b1: number, b2: number) => {},
        setMoney: (money: number) => {},
        setChips: (money: number) => {},
        setMoneyBank: (money: number) => {},
        setMicrophone: (microphone: boolean) => {},
        setRadio: (radio: boolean) => {},
        lockMicrophone: (microphoneLock: number) => {},
        setHasWatch: (hasWatch: boolean) => {},
        setTime: (time: string) => {},
        setDate: (date: string) => {},
        setTemp: (temp: number) => {},
        setCompass: (compass: string) => {},
        setStat: (
            statTime: string,
            online: number,
            player_id: number,
            admin: boolean,
            afk: boolean = false,
            admin_hidden: boolean = false,
            mask: boolean = false,
            ) => {},
        setZone: (zone: string, street: string) => {},
        showHud: (show: boolean) => {},
        toggleDeathTimer: (setTextText: boolean) => {},
        setDeathTime: (deathTime: number) => {},
        setTextText: (text: string) => {},
        setTextTime: (number: number) => {},
        raceData: (position: number, lap: number, lapMax: number, racers: number) => {},
        disableRace: () => {},
        setInfoLinePos: (left: number, bottom: number) => {},
        updateHelpToggle: (toggle: boolean) => {},
    },
    speedometer: {
        setSpeed: (val: number) => {},
        setFuel: (val: number) => {},
        setEngine: (val: boolean) => {},
        setLockCar: (val: boolean) => {},
        setLights: (val: boolean) => {},
        setSpeedometer: (val: boolean) => {},
    },
    get test(){
        return location.host.includes(':1234');
    },
    get testGui(){
        return location.href.includes('?test=');
    },
    copy,
    focusInput: false
}


function fallbackCopyTextToClipboard(text: string) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copy(text: string) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

CustomEvent.register('cef:copytext', (text: string) => {
    CEF.copy(text);
})


let focusCount = 0;

document.addEventListener('focusin', (e) => {
    if((e.target as any).type === 'submit') return;
    focusCount++;
})
document.addEventListener('focusout', (e) => {
    if((e.target as any).type === 'submit') return;
    focusCount--;
})

setInterval(() => {
    (window as any).scroll(0, 0);
    const newFocusStatus = !!focusCount;
    if (newFocusStatus !== CEF.focusInput) {
        CEF.focusInput = newFocusStatus
        CustomEvent.triggerClient('inputOnFocus', CEF.focusInput)
    }
}, 200)


// @ts-ignore
global.CEF = CEF;
