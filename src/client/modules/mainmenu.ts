import {CustomEvent} from "./custom.event";
import {gui} from "./gui";
import {survival} from "./survival";
import {user} from "./user";
import {currentHotkeys} from "./hotkeys";
import {fractionCfg} from "./fractions";

CustomEvent.registerServer('mainmenu:data', (name: string, exp: number, level: number, wanted_level: number, wanted_reason: string, fraction: number, rank: number, players: (string | number)[][], business: string, house: string, ads: {
    title: string;
    text: string;
    pos: {
        x: number;
        y: number;
        z: number;
    };
}[], vipName: string, vipEnd: number, donate_money: number, warns: number, job: string, bizList: any, bankNumber: number, bankPos: any, donateX, online, total, bonus, carbonus, donateX3, achieve, achieveDaily, promocodeMy, promocodeMyCount, promocodeMyRewardGived, report = false) => {
    gui.setGui('mainmenu');
    CustomEvent.triggerCef('mainmenu:setCrosshairSettings', mp.storage.data.crosshair)
    CustomEvent.triggerCef('mainmenu:data', name, survival.food, survival.water, user.isMale(), exp, level, wanted_level, wanted_reason,
    // WARNS
    warns, 
    // BANS
    0, 
    // WORK
    job,
        fractionCfg.getFractionName(fraction), fractionCfg.getRankName(fraction, rank), house, business, players, currentHotkeys, mp.storage.data.voiceSettings, mp.storage.data.menuItems, ads, vipName, vipEnd, donate_money, bizList, bankNumber, bankPos, donateX, donateX3, online, total, bonus, mp.storage.data.alertsEnable, carbonus, achieve, achieveDaily, promocodeMy, promocodeMyCount, promocodeMyRewardGived, user.getNearestPlayers(50).map(q => {
            const id = q.getVariable('id')
            if(!mp.storage.data.voiceUsers) mp.storage.data.voiceUsers = []
            const data = mp.storage.data.voiceUsers.find(s => s[0] === id);
            return [id, data ? data[1] : 100]
        }), mp.storage.data.voiceLevel || 1, mp.storage.data.lodDistPlayers || 200, mp.storage.data.lodDistVehs || 200, typeof mp.storage.data.boomboxSound === 'number' ? mp.storage.data.boomboxSound : 100, report)
})

mp.events.add('menu:setItemsOnPage', (menuItems: number) => {
    mp.storage.data.menuItems = menuItems;
})

mp.events.add('voiceUser:set', (id: number, val: number) => {
    if(!mp.storage.data.voiceUsers) mp.storage.data.voiceUsers = []
    let data = mp.storage.data.voiceUsers.find(s => s[0] === id);
    if(data) data[1] = val
    else mp.storage.data.voiceUsers.push([id, val]);
})
mp.events.add('voiceUser:voiceLevel', (val: number) => {
    mp.storage.data.voiceLevel = val;
})

CustomEvent.register('mmenu', () => {
    CustomEvent.triggerServer('mainmenu:open');
})
CustomEvent.register('report', () => {
    CustomEvent.triggerServer('mainmenu:open', true);
})


let int = setInterval(() => {
    if(!user.login) return;
    clearInterval(int);
    CustomEvent.triggerServer('alertsEnable:data', mp.storage.data.alertsEnable);
}, 1000)


mp.events.add('saveAlertSettings', (datas: string) => {
    if(!datas) return;
    const data = JSON.parse(datas)
    mp.storage.data.alertsEnable = data;
    CustomEvent.triggerServer('alertsEnable:data', mp.storage.data.alertsEnable);
    CustomEvent.triggerCef('alerts:enable', mp.storage.data.alertsEnable)
})

export const getAlertSetting = (key: keyof typeof mp.storage.data.alertsEnable) => {
    return !!mp.storage.data.alertsEnable[key]
}