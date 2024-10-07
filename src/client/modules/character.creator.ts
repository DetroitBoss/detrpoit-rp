import {system} from "./system";
import {user} from "./user";
import {gui} from "./gui";
import {CustomEvent} from "./custom.event";
import {
    defaultCharacterData,
    PERSONAGE_CAMERA_POS,
    PERSONAGE_CAMERA_POS_POINT,
    PERSONAGE_POS, PERSONAGE_POS_HEADING
} from "../../shared/character";
import {mouseMove, MouseMoveSystem, tempCursorStatus} from "./controls";
import {teleportAnticheat} from "./protection";
import {NAILS_COMPONENT_ID, nailsConfig} from "../../shared/barbershop";

// import voice from './voice';
const player = mp.players.local;
let personageCam: CameraMp = null;
let currentCamCoords = null;
let currentCamDist = 0.2;
let currentCamRot = -2;

let camHeights = [-1.2, 0.7]
let camHeightsCurrent = 0.0;

let mouseMoveBlock: MouseMoveSystem;


mp.events.add({
    'client:user:personage:start': async () => {

        const skin = defaultCharacterData;

        for (let param in skin) {
            user.setLocalSkinData(param as any, (skin as any)[param]);
        }
        player.clearAllProps();
        user.showLoadDisplay();
        await system.sleep(500);
        user.hideLoadDisplay();

        personageCam = mp.cameras.new(
            'customization',
            PERSONAGE_CAMERA_POS,
            new mp.Vector3(0, 0, 0),
            20
        );
        personageCam.pointAtCoord(PERSONAGE_CAMERA_POS_POINT.x, PERSONAGE_CAMERA_POS_POINT.y, PERSONAGE_CAMERA_POS_POINT.z);
        personageCam.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);


        mp.gui.chat.activate(false);
        mp.gui.chat.show(false);
        mp.gui.cursor.show(true, true);

        mp.game.invoke('0x31B73D1EA9F01DA2');
        setTimeout(() => {
            mp.game.invoke('0x31B73D1EA9F01DA2');
        }, 100)
        gui.setGui('personage');
        tempCursorStatus(true);
        mp.players.local.position = PERSONAGE_POS;
        teleportAnticheat(PERSONAGE_POS.x, PERSONAGE_POS.y, PERSONAGE_POS.z)
        mp.players.local.setRotation(0, 0, PERSONAGE_POS_HEADING, 0, true);
        mp.players.local.freezePosition(true);
        mp.players.local.setVisible(true, false);
        mp.players.local.taskPlayAnim(
            'amb@world_human_guard_patrol@male@base',
            'base',
            8.0,
            -8,
            -1,
            9,
            0,
            false,
            false,
            false
        );
        if (mouseMoveBlock) mouseMoveBlock.destroy();
        mouseMoveBlock = mouseMove((right, down, leftKey, rightKey, posX, posY) => {
            if (posX > 0.21 && posX < 0.61) {
                if (right > 0.04 || right < -0.04) {
                    player.setHeading(player.getHeading() + (right * 1.5));
                }
                if (down > 0.04 || down < -0.04) {
                    camHeightsCurrent += down / 400;
                    if (camHeightsCurrent > camHeights[1]) camHeightsCurrent = camHeights[1];
                    if (camHeightsCurrent < camHeights[0]) camHeightsCurrent = camHeights[0];
                    personageCam.pointAtCoord(PERSONAGE_CAMERA_POS_POINT.x, PERSONAGE_CAMERA_POS_POINT.y, PERSONAGE_CAMERA_POS_POINT.z + camHeightsCurrent);
                }
            }
        }, 10)
    },
    'client:user:personage:setAge': (age: number) => {
        if (age > 72) player.setHeadOverlay(3, 14, 1, 1, 1);
        else if (age > 69) player.setHeadOverlay(3, 16, 1, 1, 1);
        else if (age > 66) player.setHeadOverlay(3, 12, 1, 1, 1);
        else if (age > 63) player.setHeadOverlay(3, 11, 0.9, 1, 1);
        else if (age > 60) player.setHeadOverlay(3, 10, 0.9, 1, 1);
        else if (age > 57) player.setHeadOverlay(3, 9, 0.9, 1, 1);
        else if (age > 54) player.setHeadOverlay(3, 8, 0.8, 1, 1);
        else if (age > 51) player.setHeadOverlay(3, 7, 0.7, 1, 1);
        else if (age > 48) player.setHeadOverlay(3, 6, 0.6, 1, 1);
        else if (age > 45) player.setHeadOverlay(3, 5, 0.5, 1, 1);
        else if (age > 42) player.setHeadOverlay(3, 4, 0.4, 1, 1);
        else if (age > 39) player.setHeadOverlay(3, 4, 0.4, 1, 1);
        else if (age > 36) player.setHeadOverlay(3, 3, 0.3, 1, 1);
        else if (age > 33) player.setHeadOverlay(3, 1, 0.2, 1, 1);
        else if (age > 30) player.setHeadOverlay(3, 0, 0.1, 1, 1);
    },
    'client:user:personage:eventManager': async (type: string, value: number, name: string, family: string, age: number, dress: any, promo: string) => {
        switch (type) {
            case 'save':
                personageCam.destroy();

                gui.setGui(null);
                personageCam = null;
                // currentCamDist = 0.2;
                // currentCamRot = -2;
                // currentCamCoords = null;
                mp.players.local.freezePosition(false);
                mp.gui.cursor.show(false, false);
                tempCursorStatus(false);

                mp.game.cam.renderScriptCams(false, true, 500, true, true);

                gui.cursor = false;
                CustomEvent.triggerServer('server:user:personage:done', JSON.stringify(user.getFullLocalSkinData()), name, family, age, dress, promo);


                if (mouseMoveBlock) mouseMoveBlock.destroy();

                break;

            case 'features':
                user.setLocalSkinData('FACE_SPECIFICATIONS', JSON.parse(value as any));
                break;

            case 'floor':
                user.showLoadDisplay(500);
                await system.sleep(500);
                user.setLocalSkinData('SEX', value);
                user.setPlayerModel(!value ? 'mp_m_freemode_01' : 'mp_f_freemode_01');
                setTimeout(() => user.updateCharacterFace(true));
                mp.players.local.taskPlayAnim(
                    'amb@world_human_guard_patrol@male@base',
                    'base',
                    8.0,
                    -8,
                    -1,
                    9,
                    0,
                    false,
                    false,
                    false
                );
                await system.sleep(500);
                user.updateCharacterFace(true);
                user.hideLoadDisplay();
                break;

            case 'mother':
                user.setLocalSkinData('SHAPE_THRID_ID', value);
                user.setLocalSkinData('SKIN_THRID_ID', value);
                break;

            case 'father':
                user.setLocalSkinData('SHAPE_SECOND_ID', value);
                user.setLocalSkinData('SKIN_SECOND_ID', value);
                break;

            case 'heredity':
                user.setLocalSkinData('SHAPE_MIX', value);
                break;

            case 'skin':
                user.setLocalSkinData('SKIN_MIX', value);
                break;

            case 'hair':
                user.setLocalSkinData('HAIR', value);
                break;

            case 'hairColor':
                user.setLocalSkinData('HAIR_COLOR', value);
                break;
            case 'hairColor2':
                user.setLocalSkinData('HAIR_COLOR2', value);
                break;

            case 'eyeColor':
                user.setLocalSkinData('EYE_COLOR', value);
                break;

            case 'eyebrows':
                user.setLocalSkinData('EYEBROWS', value);
                break;

            case 'eyebrowsColor':
                user.setLocalSkinData('EYEBROWS_COLOR', value);
                break;

            case 'eyebrowsOpacity':
                user.setLocalSkinData('EYEBROWS_OPACITY', value);
                break;

            case 'beard':
                user.setLocalSkinData('OVERLAY', value - 1);
                break;

            case 'beardColor':
                user.setLocalSkinData('OVERLAY_COLOR', value);
                break;

            case 'beardOpacity':
                user.setLocalSkinData('OVERLAY_OPACITY', value);
                break;

            case 'freckles':
                user.setLocalSkinData('OVERLAY9', value - 1);
                break;
            case 'frecklesOpacity':
                user.setLocalSkinData('OVERLAY9_OPACITY', value);
                break;
            case 'makeup':
                user.setLocalSkinData('OVERLAY4', value);
                break;
            case 'makeupColor':
                user.setLocalSkinData('OVERLAY4_COLOR', value);
                break;
            case 'makeupOpacity':
                user.setLocalSkinData('OVERLAY4_OPACITY', value);
                break;
            case 'lips':
                user.setLocalSkinData('LIPS', value);
                break;
            case 'lipsOpacity':
                user.setLocalSkinData('LIPS_OPACITY', value);
                break;
            case 'lipsColor':
                user.setLocalSkinData('LIPS_COLOR', value);
                break;
            case 'blush':
                user.setLocalSkinData('BLUSH', value);
                break;
            case 'blushOpacity':
                user.setLocalSkinData('BLUSH_OPACITY', value);
                break;
            case 'blushColor':
                user.setLocalSkinData('BLUSH_COLOR', value);
                break;
            case 'nails':
                user.setLocalSkinData('NAILS', value);
                const nailsData = nailsConfig.find(data => data.Id === value);
                mp.players.local.setComponentVariation(NAILS_COMPONENT_ID, nailsData.Drawable, nailsData.Texture, 2);
                break;

            /*case 'nails':
                const nailsData = nailsConfig.find(data => data.Id === value);
                mp.players.local.setComponentVariation(NAILS_COMPONENT_ID, nailsData.Drawable, nailsData.Texture, 2);
                break;*/
        }

    },
});
