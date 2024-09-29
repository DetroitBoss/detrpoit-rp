import {system} from "../system";
import {user} from "../user";
import {CASINO_INTERIORS_IDS_IN} from "../../../shared/casino/main";
import {gui} from "../gui";








let enabled = false;
let renderTarget:any;

const SCREEN_DIAMONDS = "CASINO_DIA_PL";
const SCREEN_SKULLS = "CASINO_HLW_PL";
const SCREEN_SNOW = "CASINO_SNWFLK_PL";
const SCREEN_WIN = "CASINO_WIN_PL";

const targetName = "casinoscreen_01";
const targetModel = mp.game.joaat('vw_vwint01_video_overlay');
const textureDict = "Prop_Screen_Vinewood";
const textureName = "BG_Wall_Colour_4x4";



const enableScreens = async () => {
    try {
        mp.game.graphics.requestStreamedTextureDict(textureDict, false)

        while (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
            await system.sleep(100)
        }

        mp.game.ui.registerNamedRendertarget(targetName, false);
        mp.game.ui.linkNamedRendertarget(targetModel);

        mp.game.invoke('0xF7B38B8305F1FE8B', 0, SCREEN_DIAMONDS, true)
        mp.game.graphics.setTvAudioFrontend(true);
        mp.game.graphics.setTvVolume(-99.999999);
        mp.game.graphics.setTvChannel(-1);

        renderTarget = mp.game.ui.getNamedRendertargetRenderId(targetName);

        enabled = true;
        setTimeout(() => {
            mp.game.graphics.setTvChannel(0)
        }, 100)
    } catch (e) {
        mp.console.logError(e)
    }

}

mp.events.add('render', function () {
    if (enabled) {
        mp.game.ui.setTextRenderId(renderTarget);
        mp.game.invoke('0x61BB1D9B3A95D802', 4)
        mp.game.invoke('0xC6372ECD45D73BCD', true)
        mp.game.invoke('0x2BC54A8188768488', textureDict, textureName, 0.25, 0.5, 0.5, 1.0000001, 0.0000001, 255, 255, 255, 255);
        mp.game.graphics.drawTvChannel(0.5, 0.5, 1.0000001, 1.0000001, 0.0000001, 255, 255, 255, 255);
        mp.game.ui.setTextRenderId(1);
    }
});

const inCasinoInt = () => {
    const {x,y,z} = mp.players.local.position;
    return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
}

let enableInt = setInterval(() => {
    if(!user.login) return;
    if(!inCasinoInt()) return;
    if(enabled) return;
    enableScreens()
    clearInterval(enableInt)
}, 1000)






//
// let inCasino = false
// let videoWallRenderTarget: any = null
// let showBigWin = false
//
// //
// // Threads
// //
//
// const GetGameTimer = () => {
//     return mp.game.invoke(system.natives.GET_GAME_TIMER)
// }
//
// const startCasinoThreads = async () => {
//     mp.console.logInfo(`CASINO TEST START`)
//     while (!mp.game.graphics.hasStreamedTextureDictLoaded('Prop_Screen_Vinewood')) {
//         mp.game.graphics.requestStreamedTextureDict('Prop_Screen_Vinewood', true);
//         await system.sleep(100);
//     }
//     mp.console.logInfo(`CASINO 1`)
//     mp.game.ui.registerNamedRendertarget('casinoscreen_01', true);
//     mp.console.logInfo(`CASINO 2`)
//     mp.game.ui.linkNamedRendertarget(mp.game.joaat('vw_vwint01_video_overlay'));
//     mp.console.logInfo(`CASINO 3`)
//     videoWallRenderTarget = mp.game.ui.getNamedRendertargetRenderId('casinoscreen_01');
//     mp.console.logInfo(`CASINO 4`)
//     lastUpdatedTvChannel = 0;
//     while (inCasino) await system.sleep(100)
//     mp.console.logInfo(`CASINO 5`)
//     mp.game.ui.releaseNamedRendertarget(mp.game.joaat('casinoscreen_01'))
//     mp.console.logInfo(`CASINO 6`)
//     videoWallRenderTarget = null
//     showBigWin = false
// }
// let lastUpdatedTvChannel = 0;
// mp.events.add('render', () => {
//     if(!inCasino) return;
//     if(!videoWallRenderTarget) return;
//     let currentTime = GetGameTimer()
//     if(showBigWin){
//         setVideoWallTvChannelWin()
//         lastUpdatedTvChannel = GetGameTimer() - 33666
//         showBigWin           = false
//     } else if((currentTime - lastUpdatedTvChannel) >= 42666){
//         setVideoWallTvChannel()
//         lastUpdatedTvChannel = currentTime
//     }
//     mp.game.ui.setTextRenderId(videoWallRenderTarget)
//     mp.game.invoke(system.natives.SET_SCRIPT_GFX_DRAW_ORDER, 4)
//     mp.game.invoke(system.natives.SET_SCRIPT_GFX_DRAW_BEHIND_PAUSEMENU, true)
//     mp.game.invoke(system.natives._DRAW_INTERACTIVE_SPRITE, 'Prop_Screen_Vinewood', 'BG_Wall_Colour_4x4', 0.25, 0.5, 0.5, 1.0, 0.0, 255, 255, 255, 255)
//
//     mp.game.graphics.drawTvChannel(0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255)
//     mp.game.ui.setTextRenderId(mp.game.invoke(system.natives.GET_DEFAULT_SCRIPT_RENDERTARGET_RENDER_ID))
//     gui.drawText(`CASINO TV`, 0.3, 0.3)
// })
//
// const inCasinoInt = () => {
//     const {x,y,z} = mp.players.local.position;
//     return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
// }
//
// setInterval(() => {
//     if(!user.login) return inCasino = false;
//     if(!inCasinoInt()) return inCasino = false;
//     if(inCasino) return;
//     inCasino = true;
//     startCasinoThreads();
// }, 1000)
//
// const setVideoWallTvChannelWin = () => {
//     mp.game.invoke(system.natives.SET_TV_CHANNEL_PLAYLIST, 0, 'CASINO_WIN_PL', true)
//     mp.game.graphics.setTvAudioFrontend(true)
//     mp.game.graphics.setTvVolume(-100.0)
//     mp.game.graphics.setTvChannel(-1)
//     mp.game.graphics.setTvChannel(0)
// }
// const setVideoWallTvChannel = () => {
//     mp.game.invoke(system.natives.SET_TV_CHANNEL_PLAYLIST, 0, 'CASINO_DIA_PL', true)
//     mp.game.graphics.setTvAudioFrontend(true)
//     mp.game.graphics.setTvVolume(-100.0)
//     mp.game.graphics.setTvChannel(0)
// }