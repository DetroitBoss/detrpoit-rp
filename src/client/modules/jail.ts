import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {user} from "./user";
import {ADMIN_PRISON_COORD, ADMIN_PRISON_RADIUS, PRISON_DATA} from "../../shared/jail";
import {TextTimerBar} from "./bars/classes/TextTimerBar";

let blockText: TextTimerBar;
/** Текущее время заключения */
let currentJailTime = 0;
/** Текущая причина заключения */
let currentJailReason = "";
/** Текущее заключение админское */
let currentJailAdmin = false;


let currentJailHash: string;

let currentJailHashCode = system.randomStr(10)

CustomEvent.registerServer('jail:sync', (time: number, reason: string, admin = false) => {
    currentJailTime = time;
    currentJailReason = reason;
    currentJailAdmin = admin;
    currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
    block = true;
    setTimeout(() => {
        block = false;
    }, 3000)
})
CustomEvent.registerServer('jail:clear', () => {
    clearJailData();
})

const clearJailData = () => {
    currentJailTime = 0;
    currentJailReason = '';
    currentJailAdmin = false;
    currentJailHash = null
    if (blockText && blockText.exists) blockText.destroy();
    blockText = null;
}

let block = false;

setInterval(() => {
    if (block) return;
    if (currentJailTime <= 0 && !currentJailHash) return;
    if (currentJailHash && currentJailHash !== system.encryptCodes(currentJailTime.toString(), currentJailHashCode)){
        currentJailTime+=1000;
        currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
        CustomEvent.triggerServer('jail:sync', currentJailTime, currentJailAdmin);
        user.cheatDetect('memory', `Перемотка времени в ${currentJailAdmin ? 'Админской' : "RP"} тюрьме`);
        return;
    }
    // if(user.afk) return;
    currentJailTime--;
    if (currentJailTime <= 0){
        CustomEvent.triggerServer('jail:sync', 0, currentJailAdmin);
        clearJailData();
    } else {
        if (system.distanceToPos(mp.players.local.position, currentJailAdmin ? ADMIN_PRISON_COORD : PRISON_DATA[0]) > (currentJailAdmin ? ADMIN_PRISON_RADIUS : PRISON_DATA[1])){
            CustomEvent.triggerServer('jail:tryRun');
            user.notify("Попытка побега из тюрьмы");
            return;
        }
        currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
        if (blockText && blockText.exists){
            blockText.title = `${(currentJailAdmin ? 'Деморган' : 'Заключение в тюрьме')} ${currentJailReason ? `| ${currentJailReason}` : ''}`;
            blockText.text = system.secondsToString(currentJailTime);
        } else {
            blockText = new TextTimerBar(`${(currentJailAdmin ? 'Деморган' : 'Заключение в тюрьме')} ${currentJailReason ? `| ${currentJailReason}` : ''}`, system.secondsToString(currentJailTime));
        }
        if (currentJailTime % 60 === 0) CustomEvent.triggerServer('jail:sync', currentJailTime, currentJailAdmin);
    }
}, 1000)