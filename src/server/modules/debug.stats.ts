import { CustomEvent } from "./custom.event";
import { system } from "./system";
import { gui } from './gui'

CustomEvent.registerClient('debug:fpsData', (player, min: number, max: number, average: number, sum: number, length: number) => {
    const user = player.user;
    if(!user) return;
    user.log('fpsDebug', `MIN: ${min} | MAX: ${max} | AVERAGE: ${average} | SUM: ${sum} | LENGTH: ${length}`);
})

gui.chat.registerCommand('stopcef', (player) => {
    CustomEvent.triggerClient(player, 'stopcef')
})