import {CustomEvent} from "../../custom.event";
import {ObjectManager} from "./objectManager";
import {furniture} from "../furniture";
import {gui} from "../../gui";

class FurniturePlace {

    private manager: ObjectManager;
    public lockControls: boolean = true;

    constructor() {
        CustomEvent.registerServer('furniturePlace:start', this.startHandler);
        mp.events.add('furniturePlace:onKey', this.onKeyHandler);
    }

    startHandler = (houseId: number, id: number, cfgId: number) => {
        if (furniture.currentHouseId !== houseId) return;
        gui.setGui('interiorHud');
        this.manager = new ObjectManager(id, cfgId, houseId);
        this.lockControls = false;
        mp.gui.cursor.visible = false;
    }

    onKeyHandler = (key: number) => {
        if (!this.manager) return;

        if (key === 39) {
            const direction = this.manager.changeVector(true);
            CustomEvent.triggerCef('furnitureHud:direction', direction)
        }
        else if (key === 37) {
            const direction = this.manager.changeVector(false);
            CustomEvent.triggerCef('furnitureHud:direction', direction)
        }
        else if (key === 38) {
            this.manager.move(true);
        }
        else if (key === 40) {
            this.manager.move(false);
        }
        else if (key === 16) {
            this.manager.changeSpeed(true);
        }
        else if (key === 17) {
            this.manager.changeSpeed(false);
        }
        else if (key === 79) {
            const moveType = this.manager.changeMoveType();
            CustomEvent.triggerCef('furnitureHud:moveType', moveType);
        }
        else if (key === 89) {
            const data: [Vector3Mp, Vector3Mp] = this.manager.save(),
                id: number = this.manager.id;

            this.manager.destroy();
            this.lockControls = true;
            gui.setGui(null);

            if (data[1].x === 0 && data[1].y === 0 && data[1].z === 0) {
                CustomEvent.triggerServer(
                    'furniture:place',
                    id,
                    data[0]
                )
            }else{
                CustomEvent.triggerServer(
                    'furniture:place',
                    id,
                    data[0],
                    data[1]
                )
            }
        }
        else if (key === 78) {
            this.manager.destroy();
            this.lockControls = true;
            gui.setGui(null);
        }
    }
}

export const furniturePlace = new FurniturePlace();