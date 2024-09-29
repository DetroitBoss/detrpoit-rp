import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {system} from "./system";
import {CustomEvent} from "./custom.event";


CustomEvent.registerServer('timer:drawserver', (text: string, timer: number) => {
    hudBar.timer(text, timer);
})

export const hudBar = {
    timer: (text: string, timer: number) => {
        let tm = timer + 0;
        const mapTimeBar = new TextTimerBar(text, system.secondsToString(tm));
        let int = setInterval(() => {
            tm--;
            if (tm < 0 || !mapTimeBar.exists){
                clearInterval(int);
                if (mapTimeBar.exists) mapTimeBar.destroy();
                return;
            }
            if(tm <= 5){
                mapTimeBar.textColor = [224, 50, 50, 255]; // or 6 (HUD_COLOUR_RED)
                mapTimeBar.highlightColor = 8; // HUD_COLOUR_REDDARK
            }
            mapTimeBar.text = system.secondsToString(tm)
        }, 1000)
        return mapTimeBar;
    },
    showLoading: (text: string) => {
        mp.game.gxt.set("TB_TEST_LOADING", text);
        if (!mp.game.invoke("0xD422FCC5F239A915")) {
            mp.game.ui.setLoadingPromptTextEntry("TB_TEST_LOADING");
            mp.game.ui.showLoadingPrompt(1);
        }
    },
    hideLoading: () => {
        mp.game.invoke("0x10D373323E5B9C0D");
    }
}