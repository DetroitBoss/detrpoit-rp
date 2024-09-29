import {CustomEvent} from "../custom.event";
import {DialogNodeDto} from "../../../shared/dialogs/dtos/DialogNodeDto";
import {DialogNpcData} from "../../../shared/dialogs/dtos/DialogNpcData";
import {gui} from "../gui";
import {systemUtil} from "../../../shared/system";

const gameplayCam = mp.cameras.new('gameplay');
const CAMERA_SLIDE_TIME_MS = 500;
let dialogCamera: CameraMp = null;

CustomEvent.registerServer('dialogs:open', (
    characterName: string,
    dialogNodeDto: DialogNodeDto,
    dialogNpc: DialogNpcData
) => {
    const ped = getDialogNpcPed(dialogNpc);

    setTimeout(() => {
        gui.setGui('dialogs');
        CustomEvent.triggerCef('dialogs::setDialog', characterName, dialogNodeDto);
    }, CAMERA_SLIDE_TIME_MS);
});

function getDialogNpcPed(dialogNpc: DialogNpcData): PedMp {
    switch (dialogNpc.type) {
        case 'serverPed':
            return mp.peds.atRemoteId(dialogNpc.id);
        case 'clientPed':
            return mp.peds.atHandle(dialogNpc.id);
    }

    return null;
}

CustomEvent.registerServer('dialogs:close', () => {
    gui.setGui(null);
});
