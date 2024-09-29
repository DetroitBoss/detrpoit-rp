import {CustomEvent} from "../../custom.event";
import {gui} from "../../gui";
import {
    FURNITURE_SHOP_HEADING,
    FURNITURE_SHOP_OBJECT_POSITION, FURNITURE_SHOP_OBJECT_ROTATION, FURNITURE_SHOP_POSITION,
    FURNITURE_SHOP_VIEW_DIMENSION
} from "../../../../shared/houses/furniture/shop.config";
import {furnitureList} from "../../../../shared/houses/furniture/furniture.config";
import {anticheatProtect, teleportAnticheat} from "../../protection";
import {user} from "../../user";
import {mouseMove} from "../../controls";
import {handleCamZoom} from "../../camera";



class FurnitureShop {
    public inShop: boolean = false
    private cfgId: number = null
    private object: ObjectMp | null = null;
    private currentPosition: { x: number, y: number, z: number, h?: number } = {
        x: FURNITURE_SHOP_OBJECT_POSITION.x,
        y: FURNITURE_SHOP_OBJECT_POSITION.y,
        z: FURNITURE_SHOP_OBJECT_POSITION.z,
        h: FURNITURE_SHOP_HEADING
    };
    private currentCamera: CameraMp;
    private showOffset: [number, number, number] = [1.23276901245117, -7.93903710937500, 2.460024642944336];
    private enabledZoom: boolean = true;

    constructor() {
        CustomEvent.registerServer('furnitureShop:open', this.openHandler);
        mp.events.add('furnitureShop:close', this.closeHandler);
        mp.events.add('furnitureShop:select', this.selectHandler);
        mp.events.add('furnitureShop:zoomToggle', this.zoomHandler);

        mouseMove((right, down, leftKey, rightKey, posX) => {
            if (!leftKey) return;
            if (!this.inShop) return;
            if (posX > 0.21 && posX < 0.81){
                this.object.setHeading(this.object.getHeading() + (right / 1.5));
                this.object.setCoords(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z, true, true, true, true);
            }
        }, 10)

        mp.events.add('render', () => {
            if (!this.inShop || !this.enabledZoom) return;

            handleCamZoom(this.currentCamera)
        })

    }

    private openHandler = (): void => {
        if (this.inShop) return;

        this.inShop = true;
        teleportAnticheat(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z + 15)
        mp.players.local.position = new mp.Vector3(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z + 15);
        mp.players.local.freezePosition(true);
        this.focusCamera();
        gui.setGui('furnitureStore');
        this.object = this.createObject();
    }

    private zoomHandler = (toggle: boolean) => {
        this.enabledZoom = toggle;
    }

    private focusCamera() {
        mp.game.streaming.requestCollisionAtCoord(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        mp.game.streaming.setFocusArea(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z, 0.0, 0.0, 0.0);
        if (!this.currentCamera || !mp.cameras.exists(this.currentCamera)) this.currentCamera = mp.cameras.new('furniture_shop');
        this.currentCamera.setFov(50);
        this.currentCamera.setActive(true)
        this.currentCamera.setCoord(this.currentPosition.x + this.showOffset[0], this.currentPosition.y + this.showOffset[1], this.currentPosition.z + this.showOffset[2]);
        this.currentCamera.pointAtCoord(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        mp.game.cam.renderScriptCams(true, true, 1500, true, false);
    }

    protected unFocusCamera() {
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        mp.game.invoke('0x198F77705FA0931D', mp.players.local.handle);
        mp.game.cam.setGameplayCamRelativeHeading(0);

        user.hideLoadDisplay(500, false);
    }

    private closeHandler = (): void => {
        if (!this.inShop) return;

        anticheatProtect('teleport');
        mp.players.local.position = FURNITURE_SHOP_POSITION;
        CustomEvent.triggerServer('furnitureShop:exit');
        mp.players.local.freezePosition(false);
        this.unFocusCamera();
        this.inShop = false;
        this.object.destroy();
        this.object = null;
        this.enabledZoom = true;
    }

    private getModelById(id: number): string {
        const item = furnitureList.find(el => el.id === id);

        if (!item) return 'prop_tool_pickaxe';
        return item.prop;
    }

    private selectHandler = (id: number): void => {
        if (!this.inShop || this.object === null || this.cfgId === id) return;

        this.cfgId = id;
        this.object.model = mp.game.joaat(this.getModelById(id));

        this.object.setAlpha(255);
    }

    protected createObject(): ObjectMp {
        return mp.objects.new(
            mp.game.joaat('prop_tool_pickaxe'),
            FURNITURE_SHOP_OBJECT_POSITION,
            {
                alpha: 0,
                dimension: FURNITURE_SHOP_VIEW_DIMENSION,
                rotation: FURNITURE_SHOP_OBJECT_ROTATION
            }
        )
    }
}

new FurnitureShop()