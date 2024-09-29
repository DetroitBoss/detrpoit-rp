import {IFurnitureSave, IFurnitureState, LOAD_INTERIORS} from "../../../../shared/houses/furniture/config";
import {CustomEvent} from "../../custom.event";
import {furnitureList} from "../../../../shared/houses/furniture/furniture.config";
import {IInteriorData, interiorsData} from "../../../../shared/houses/menu/interiors.config";

class Furniture {

    private houseId: number = null;
    private items: IFurnitureState[] = [];
    private interior: number = null;

    constructor() {
        CustomEvent.registerServer('furniture:enterHouse', this.enterHouseHandler);
        CustomEvent.registerServer('furniture:leaveHouse', this.leaveHouseHandler);
        CustomEvent.registerServer('furniture:remove', this.removeHandler);
        CustomEvent.registerServer('furniture:place', this.placeHandler);
    }


    private enterHouseHandler = (houseId: number, furnitureJSON: string, houseInterior: number) => {
        this.loadInterior(houseInterior)

        if (this.houseId !== null) {
            this.destroyItems();
        }

        this.houseId = houseId;

        const furnitureItems: IFurnitureSave[] = JSON.parse(furnitureJSON);

        furnitureItems.forEach(item => {
            const cfg = furnitureList.find(el => el.id === item.cfgId),
                rot = !item.rot ? new mp.Vector3(0, 0, 0) : item.rot;

            if (!cfg) return;

            this.items.push({
                id: item.id,
                object: mp.objects.new(
                    mp.game.joaat(cfg.prop),
                    item.pos,
                    {
                        rotation: rot,
                        dimension: houseId
                    }
                )
            })
        });
    }

    private loadInterior(interiorId: number) {
        const item = LOAD_INTERIORS.find(el => el.interiorId === interiorId);

        if (!item) return;

        const interior = mp.game.interior.getInteriorAtCoords(
            item.position.x,
            item.position.y,
            item.position.z
        );


        if(interior){
            mp.game.interior.enableInteriorProp(interior, item.prop);
            this.unloadOldInteriors(item.interiorId, item.prop, interior)
            mp.game.interior.refreshInterior(interior);
            this.interior = interiorId;
        }
    }

    private unloadOldInteriors(interiorId: number, prop: string, hash: number) {
        const interior: IInteriorData = interiorsData.find(el => el.interiorId === interiorId);

        if (!interior) return;

        const layoutId: number = interior.layoutId,
            interiorsList: IInteriorData[] = interiorsData.filter(el => el.layoutId === layoutId);

        interiorsList.forEach(el => {
            const cfg = LOAD_INTERIORS.find(item => item.interiorId === el.interiorId);

            if (cfg && cfg.prop !== prop) {
                if (mp.game.interior.isInteriorPropEnabled(hash, cfg.prop))
                    mp.game.interior.disableInteriorProp(hash, cfg.prop);
            }
        })
    }

    private unloadInterior() {
        if (this.interior === null) return;

        const item = LOAD_INTERIORS.find(el => el.interiorId === this.interior);

        if (!item) return;

        const interior = mp.game.interior.getInteriorAtCoords(
            item.position.x,
            item.position.y,
            item.position.z
        );

        if(interior){
            mp.game.interior.disableInteriorProp(interior, item.prop);
            mp.game.interior.refreshInterior(interior);
            this.interior = null;
        }

    }

    private leaveHouseHandler = () => {
        this.houseId = null;
        this.unloadInterior();
        this.destroyItems();
    }

    private removeHandler = (houseId: number, itemId: number) => {
        if (!this.canBeUpdated(houseId)) return;

        const item = this.items.find(el => el.id === itemId);

        if (!item) return;

        const index = this.items.indexOf(item);

        item.object.destroy();

        if (index === -1) return;

        this.items.splice(index, 1);
    }

    private placeHandler = (houseId: number, item: IFurnitureSave) => {
        if (!this.canBeUpdated(houseId)) return;

        const cfg = furnitureList.find(el => el.id === item.cfgId),
            rot = !item.rot ? new mp.Vector3(0, 0, 0) : item.rot;

        if (!cfg) return;

        const object = mp.objects.new(
            mp.game.joaat(cfg.prop),
            item.pos,
            {
                rotation: rot,
                dimension: houseId
            }
        )

        this.items.push({
            id: item.id,
            object
        })
    }

    private canBeUpdated(houseId: number): boolean {
        return houseId === this.houseId;
    }

    private destroyItems() {
        this.items.forEach(item => item.object.destroy());
        this.items = [];
    }

    get currentHouseId(): number | null {
        return this.houseId;
    }
}


export const furniture = new Furniture()