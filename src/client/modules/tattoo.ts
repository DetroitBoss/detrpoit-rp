import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";
import {mouseMove, MouseMoveSystem} from "./controls";
import {TattooItem, tattoosShared} from "../../shared/tattoos";

const player = mp.players.local


let currentCamera: CameraMp;
let currentHeading:number;
let currentZone:string;
let myTattoos:[string, string][] = []

let mousePersControl: MouseMoveSystem;
CustomEvent.registerServer('tattooshop:open', (id: number, name: string, type: number, data: {
    item_id: number;
    count: number;
    price: number;
    params: {
        component: number;
        drawable: number;
        texture: number;
    }[];
}[], tattoos:[string, string][], h:number) => {
    currentHeading = h;
    myTattoos = tattoos;
    restoreTattoos();
    if (!mousePersControl) mousePersControl = mouseMove((right, down, leftKey, rightKey, posX) => {
        if (!leftKey) return;
        if (posX > 0.21 && posX < 0.81) {
            player.setHeading(player.getHeading() + (right / 1.5));
        }
    }, 10)
    if (gui.currentGui === "tattooshop") return CustomEvent.triggerCef('cef:tattoo_shop:init', id, name, type, data, tattoos);
    gui.setGui("tattooshop")
    
    setTimeout(() => {
        if(!gui.currentGui) return;
        CustomEvent.triggerCef('cef:tattoo_shop:init', id, name, type, data, tattoos);
        if(!currentCamera){
            const pos = player.getOffsetFromInWorldCoords(0, 2.5, 0);
            currentCamera = mp.cameras.new(
                'tattooshop',
                pos,
                new mp.Vector3(0, 0, 0),
                20
            );
            currentCamera.pointAtPedBone(player.handle, 31086, 0, 0, 0, false);
            currentCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 2000, false, false);
            cameraCategory(null);
        }
    }, 1000)
});

const cameraCategory = (id: string) => {
    if(!currentCamera || !mp.cameras.exists(currentCamera)) return;
    if (!id) id = "ZONE_TORSO";
    restoreTattoos();
    if (currentZone === id) return;
    const cfg = tattoosShared.getZoneData(id);
    if(!cfg) return;
    player.setHeading(currentHeading);
    const pos = player.getOffsetFromInWorldCoords(cfg.x, cfg.y, cfg.z);
    currentCamera.setCoord(pos.x, pos.y, pos.z);
    currentCamera.pointAtPedBone(player.handle, cfg.bone, 0, 0, 0, false);
}

mp.events.add('tattoo:category', (id: string) => {
    cameraCategory(id);
})

mp.events.add('tattoo:preview', (datas: string) => {
    let data: TattooItem = JSON.parse(datas)
    if (!data) return;
    restoreTattoos()
    player.setDecoration(mp.game.joaat(data.collection), mp.game.joaat(user.isMale() ? data.overlay_male : data.overlay_female));
    
})
mp.events.add('tattoo:exit', () => {
    exitTattoo()
})

const clearTattoos = () => {
    player.clearDecorations()
}

const restoreTattoos = () => {
    clearTattoos();
    myTattoos.map(item => {
        player.setDecoration(mp.game.joaat(item[0]), mp.game.joaat(item[1]));
    })
}

export const exitTattoo = () => {
    restoreTattoos();
    currentZone = null;
    gui.setGui(null);
    if (mousePersControl){
        mousePersControl.destroy();
        mousePersControl = null;
    }
    CustomEvent.triggerServer('tattoo:exit');
    if (currentCamera){
        currentCamera.destroy();
        currentCamera = null;
    }
    mp.game.cam.renderScriptCams(false, true, 500, true, true);
}
