import {user} from "./user";
import {healTimer} from "./survival";
import {inCasinoRoulette} from "./casino/roulette";
import {inDiceGame} from "./casino/dice";

const player = mp.players.local

let currentSetStatus: string;
let currentSetText: string;
export const discord = {
    get status(){
        return currentSetStatus
    },
    set status(val){
        currentSetStatus = val;  
        discord.update();
    },
    update(){
        let text:string;
        if (currentSetStatus) text = currentSetStatus;
        if(!text && !user.login) text = 'Заходит на сервер';
        if(!text && mp.game.ui.isPauseMenuActive()) text = 'В меню паузы';
        if(!text && user.afk) text = 'AFK';
        if(!text && user.isAdminNow()) text = 'Администрирует';
        if (!text && (player.isSprinting() || player.isRunning())) text = 'Бегает';
        if (!text && user.dead) text = 'В коме';
        if (!text && healTimer) text = 'Проходит лечение';
        if (!text && inCasinoRoulette()) text = 'Ставит на рулетке в казино';
        if (!text && inDiceGame()) text = 'Играет в кости';

        
        if(!text) text = 'Играет';
        if (text === currentSetText) return;
        currentSetText = text
        mp.discord.update('Detroit', text);
    }
}

setInterval(() => {
    discord.update();
}, 1000)