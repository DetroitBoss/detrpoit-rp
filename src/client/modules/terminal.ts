import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {DOORS_LIST} from "../../shared/doors";
import {getDoorStatus, setDoorStatus} from "./doors";

const player = mp.players.local;

/** Рабочая дистанция для взаимодействия */
const workDistance = 3;

const doorTerminal = -160937700;

const sendToTerminal = (text: string) => {
    CustomEvent.triggerCef('terminal:send', text);
}

CustomEvent.register('terminal:search', () => {
    const { x, y, z } = player.position;
    const handle = mp.game.object.getClosestObjectOfType(x, y, z + 1, workDistance, doorTerminal, true, true, true);
    return handle;
})

CustomEvent.register('terminal:bruteforce:validterminal', (handle: number) => {
    const model = mp.game.invoke('0x9F47B058362C84B5', handle)
    if (model !== doorTerminal) return false;
    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
    if(!pos) return false;
    return true;
})
CustomEvent.register('terminal:bruteforce:validterminal:interact', (handle: string) => {
    const model = mp.game.invoke('0x9F47B058362C84B5', parseInt(handle))
    if (model !== doorTerminal) return 0;
    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', parseInt(handle), true)
    if(!pos) return 0;
    const dist = system.distanceToPos(pos, player.position);
    const signal = (workDistance / dist);
    if (signal < (workDistance / 10)) return 0;
    return signal
})
mp.events.add('terminal:bruteforce:validterminal:done', (handle: string) => {
    const model = mp.game.invoke('0x9F47B058362C84B5', parseInt(handle))
    if (model !== doorTerminal) return sendToTerminal("Сигнал потерян");
    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', parseInt(handle), true)
    if (!pos) return sendToTerminal("Сигнал потерян");
    const dist = system.distanceToPos(pos, player.position);
    if (dist > (workDistance * 2)) return sendToTerminal("Сигнал потерян");
    DOORS_LIST.map((door, index) => {
        if(!system.isPointInPoints(pos, [door.pos, ...door.doors], 5)) return;
        if (!getDoorStatus(index)) return sendToTerminal("Тернинал информирует что дверь уже открыта");
        setDoorStatus(index, false, true);
    })
})