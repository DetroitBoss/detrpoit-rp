import * as coordsAndSize from "./coordsAndSizes";
import {TimerBarBase} from "./classes/TimerBarBase";
import {CustomEvent} from "../custom.event";
import {TextTimerBar} from "./classes/TextTimerBar";
import {system} from "../system";

const { gfxAlignWidth, gfxAlignHeight, initialY, initialBusySpinnerY, timerBarMargin, timerBarThinMargin } = coordsAndSize.default
const invoke = mp.game.invoke;

const BUSYSPINNER_IS_ON = "0xD422FCC5F239A915";
const SET_SCRIPT_GFX_ALIGN = "0xB8A850F20A067EB6";
const SET_SCRIPT_GFX_ALIGN_PARAMS = "0xF5A2C681787E579D";
const RESET_SCRIPT_GFX_ALIGN = "0xE3A3DB414A373DAB";

let timerBarPoolArr: TimerBarBase[] = [];

// Request texture dictionary
// mp.game.graphics.requestStreamedTextureDict("timerbars", true);

let lastSendData: {text: string, help: string|(boolean[]), red?:boolean}[] = [];
setInterval(() => {
    let data: {text: string, help: string|(boolean[]), red?:boolean}[] = [];
    timerBarPoolArr.map(item => {
        if(item.hidden) return;
        let text = system.filterInput(item.title);
        let help = (item as any).checkpointArrayBoolean ? (item as any).checkpointArrayBoolean : (system.filterInput((item as TextTimerBar).text) || "")
        let red = (item as any).checkpointArrayBoolean ? false : ((item as TextTimerBar).textColor as number[])[1] < 100

        data.push({text, help, red})
    })
    if(JSON.stringify(data) !== JSON.stringify(lastSendData)){
        CustomEvent.triggerCef('hud:textclass', data)
        lastSendData = data;
    }
}, 200)

// // Rendering
// mp.events.add("render", () => {
//     const max = timerBarPoolArr.length;
//     if (max === 0) return;
//
//
//     // Hide HUD items that appear near timerbars
//     hideHudComponents();
//
//     // Apply drawing config
//     invoke(SET_SCRIPT_GFX_ALIGN, 82, 66);
//     invoke(SET_SCRIPT_GFX_ALIGN_PARAMS, 0.0, 0.0, gfxAlignWidth, gfxAlignHeight);
//
//     // Draw
//     for (let i = 0, drawY = (invoke(BUSYSPINNER_IS_ON) ? initialBusySpinnerY : initialY); i < max; i++) {
//         if (!timerBarPoolArr[i].hidden){
//             timerBarPoolArr[i].draw(drawY);
//             drawY -= timerBarPoolArr[i]._thin ? timerBarThinMargin : timerBarMargin;
//         }
//     }
//
//     // Reset drawing config
//     invoke(RESET_SCRIPT_GFX_ALIGN);
// });

// API
export const timerBarPool = {
    add: function (...args: TimerBarBase[]) {
        const validTimerBars = args.filter(arg => arg instanceof TimerBarBase);
        timerBarPoolArr.push(...validTimerBars);
    },

    has: function (timerBar: TimerBarBase) {
        return timerBarPoolArr.includes(timerBar);
    },

    remove: function (timerBar: TimerBarBase) {
        const idx = timerBarPoolArr.indexOf(timerBar);
        if (idx === -1) return;
        timerBarPoolArr.splice(idx, 1);
    },

    removeById: function (id: string) {
        const idx = timerBarPoolArr.findIndex(q => q._id === id);
        if (idx === -1) return;
        timerBarPoolArr.splice(idx, 1);
    },

    clear: function() {
        timerBarPoolArr = [];
    }
};

