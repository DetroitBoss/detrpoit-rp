import {CustomEvent} from "../custom.event";
import {BarberData} from "../../../shared/barbershop";
import {gui} from "../gui";
import {system} from "../system";
import {mouseMove, MouseMoveSystem} from "../controls";
import {CharacterSkinData} from "../../../shared/character";
import {setAllLocalSkinData} from "../user";

let mouseMoveBlock: MouseMoveSystem;
const player = mp.players.local;
let camera: CameraMp;

mp.events.add('barbershop::subPageChanged', (categoryId) => {
    if (camera) {
        const camSettings = cameraSettingsByCategory[categoryId];
        const offset = camSettings.offset;
        const cameraPosition = player.getOffsetFromInWorldCoords(offset.x, offset.y, offset.z);

        camera.setCoord(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        camera.pointAtPedBone(player.handle, camSettings.focusBone, 0,0,0, false);
        camera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);
    }
});

const cameraSettingsByCategory = [
    // hair
    { offset: { x: 0.0, y: 1.9, z: 0.9 }, focusBone: 31086 },
    // brows
    { offset: { x: 0.0, y: 1.9, z: 0.9 }, focusBone: 31086 },
    // beard
    { offset: { x: 0.0, y: 1.9, z: 0.9 }, focusBone: 31086 },
    // lips
    { offset: { x: 0.0, y: 1.9, z: 0.9 }, focusBone: 31086 },
    // nails
    { offset: { x: 1.3, y: 0, z: -0.3 }, focusBone: 6286 },
]

CustomEvent.registerServer('barber:load', async (data: BarberData, pos: {x: number, y: number, z: number, h: number}, catalog: any, id: number, skinData: CharacterSkinData) => {
    const {x,y,z,h} = pos;
    gui.setGui('barber');
    setAllLocalSkinData(skinData)
    CustomEvent.triggerCef('barbershop:load', data, catalog, id);
    player.setCoords(x, y, z,true,true,true,true);
    player.setHeading(h);
    await system.sleep(100);
    const offset = player.getOffsetFromInWorldCoords(0.0, 1.9, 0.9);
    if(!camera || !mp.cameras.exists(camera)) camera = mp.cameras.new('barber', offset, new mp.Vector3(0,0,0), 20), await system.sleep(100);
    camera.setCoord(offset.x, offset.y, offset.z)
    camera.pointAtPedBone(player.handle, 31086, 0,0,0, false);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, false, false);
    if(!mouseMoveBlock){
        mouseMoveBlock = mouseMove((right, down, leftKey, rightKey, posX, posY) => {
            if (posX > 0.21 && posX < 0.61) {
                if (right > 0.04 || right < -0.04) {
                    player.setHeading(player.getHeading() + (right * 2.5));
                }
            }
        }, 10)
    }
})


export const closeBarber = () => {
    if(camera && mp.cameras.exists(camera)) camera.destroy();
    camera = null;
    mp.game.cam.renderScriptCams(false,true,300,true,false);
    CustomEvent.triggerServer('barber:close')
    if(mouseMoveBlock){
        mouseMoveBlock.destroy();
        mouseMoveBlock = null;
    }
}