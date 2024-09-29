import './shop'
import {IFurnitureSave, INTERIORS_FOR_FURNITURE} from "../../../../shared/houses/furniture/config";
import {HouseEntity} from "../../typeorm/entities/houses";
import {CustomEvent} from "../../custom.event";
import {furnitureList} from "../../../../shared/houses/furniture/furniture.config";
import {IFurnitureDTO} from "../../../../shared/houses/menu/menu.web";
import {FurnitureEntity} from "../../typeorm/entities/furniture";

class Furniture {

    constructor() {
        CustomEvent.registerCef('furniture:buy', this.buyFurnitureHandler);
        CustomEvent.registerClient('furniture:place', this.placeHandler);
        CustomEvent.registerCef('furniture:remove', this.removeHandler);
        CustomEvent.registerCef('furniture:sell', this.sellHandler);
        CustomEvent.registerCef('furniture:placement', this.placementHandler);
    }

    private placementHandler = (player: PlayerMp, id: number, toggle: boolean) => {
        if (!player.user || toggle === undefined || !player.user.houseEntity) return;
        if (!this.isInteriorForFurniture(player.user.houseEntity.interrior))
            return player.notify('Ваш интерьер не поддерживает мебель');

        const house = player.user.houseEntity,
            item = house.furnitureData.find(el => el.id === id);

        if (!item) return;

        if (toggle) {
            CustomEvent.triggerClient(player, 'furniturePlace:start', house.id, id, item.cfgId)
        }else{
            this.removeHandler(player, id);
            player.user.setGui(null);
        }
    }

    private buyFurnitureHandler = (player: PlayerMp, cfgId: number) => {
        if (!player.user) return;

        if (!player.user.houseEntity)
            return player.notify('У вас нет дома', 'error');

        if (!this.isInteriorForFurniture(player.user.houseEntity.interrior))
            return player.notify('Интерьер вашего дома не поддерживает мебель', 'error');

        const cfg = furnitureList.find(el => cfgId === el.id);

        if (!cfg) return;

        if (player.user.money < cfg.cost)
            return player.notify('У вас недостаточно денег', 'error');

        player.user.removeMoney(cfg.cost, false, `покупка мебели ${cfgId}`);

        const house: HouseEntity = player.user.houseEntity;

        const furnitureItem = FurnitureEntity.create({
            cfgId,
            houseId: house.id
        });

        furnitureItem.save();

        const furnitureData = house.furnitureData;

        furnitureData.push(furnitureItem);

        house.furnitureData = furnitureData;

        player.user.log('houses', `Купил мебель - ${cfg.id} за ${cfg.cost}`);
        player.notify(`Вы успешно приобрели ${cfg.name}`, 'success');
    }

    private sellHandler = (player: PlayerMp, id: number) => {
        if (!player.user || !player.user.houseEntity) return;

        const house = player.user.houseEntity,
            furniture = [...house.furnitureData];

        const item = furniture.find(el => el.id === id);

        if (!item) return;

        if (item.pos)
            return player.notify('Необходимо сперва убрать мебель');

        const cfgId = item.cfgId,
            index = furniture.indexOf(item);

        if (index === -1) return;

        furniture[index].remove();

        furniture.splice(index, 1);

        house.furnitureData = furniture;

        const cfg = furnitureList.find(el => el.id === cfgId);

        if (!cfg) return;
        const furnitureItems: IFurnitureDTO[] = [];
        player.user.houseEntity.furnitureData.forEach(el => {
            furnitureItems.push({
                id: el.id,
                cfgId: el.cfgId,
                placed: !!el.pos
            })
        })
        CustomEvent.triggerCef(player, 'homeMenu:furniture', furnitureItems)
        player.user.addMoney(Math.floor(cfg.cost * 0.2), true, `Продажа мебели ${cfgId}`);
    }

    private removeHandler = (player: PlayerMp, id: number) => {
        if (!player.user || !player.user.houseEntity) return;

        const house: HouseEntity = player.user.houseEntity,
            items: FurnitureEntity[] = [...house.furnitureData],
            item: FurnitureEntity = items.find(el => el.id === id);

        if (!item) return;

        const index = items.indexOf(item);

        if (index === -1) return;

        if (items[index].pos) items[index].pos = null;
        if (items[index].rot) items[index].rot = null;

        items[index].save();

        house.furnitureData = items;

        this.getPlayersForUpdate(house.id).map(target =>
            CustomEvent.triggerClient(target, 'furniture:remove', house.id, id));
    }

    private placeHandler = (player: PlayerMp, id: number, pos: Vector3Mp, rot?: Vector3Mp) => {
        if (!player.user) return;

        const house: HouseEntity = player.user.houseEntity,
            items: FurnitureEntity[] = [...house.furnitureData],
            item: FurnitureEntity = items.find(el => el.id === id);


        if (!item) return;

        const index = items.indexOf(item);

        if (index === -1) return;

        pos = new mp.Vector3(
            Number(pos.x.toFixed(2)),
            Number(pos.y.toFixed(2)),
            Number(pos.z.toFixed(2)),
        )

        if (rot) {
            rot = new mp.Vector3(
                Number(rot.x.toFixed(2)),
                Number(rot.y.toFixed(2)),
                Number(rot.z.toFixed(2)),
            )
        }

        items[index].pos = JSON.stringify(pos);
        if (rot) items[index].rot = JSON.stringify(rot);
        items[index].save();

        house.furnitureData = items;

        this.getPlayersForUpdate(house.id).map(target =>
            CustomEvent.triggerClient(target, 'furniture:place', house.id, {
                id: item.id,
                cfgId: item.cfgId,
                pos,
                rot: rot ? rot : new mp.Vector3(0,0,0)
            }));
    }

    public enterHouse(player: PlayerMp, house: HouseEntity) {
        const furnitureData = [...house.furnitureData],
            furnitureItems: IFurnitureSave[] = [];

        furnitureData.forEach(el => {
            if (!el.pos) return;

            if (el.rot) {
                furnitureItems.push({
                    id: el.id,
                    cfgId: el.cfgId,
                    pos: JSON.parse(el.pos),
                    rot: JSON.parse(el.rot)
                })
            }else{
                furnitureItems.push({
                    id: el.id,
                    cfgId: el.cfgId,
                    pos: JSON.parse(el.pos)
                })
            }
        })

        CustomEvent.triggerClient(player, 'furniture:enterHouse', house.id, JSON.stringify(furnitureItems), house.interrior);
    }

    public leaveHouse(player: PlayerMp) {
        CustomEvent.triggerClient(player, 'furniture:leaveHouse');
    }

    public isInteriorForFurniture(interiorId: number): boolean {
        return INTERIORS_FOR_FURNITURE.find(el => el === interiorId) !== undefined;
    }

    public clearPlacementFurniture(player: PlayerMp, house: HouseEntity) {
        const items = house.furnitureData;

        items.forEach(item => {
            if (item.pos) item.pos = null;
            if (item.rot) item.rot = null;
            item.save();
        });
    }

    private getPlayersForUpdate(dimension: number): PlayerMp[] {
        return mp.players.toArray().filter(player => player.user && player.dimension === dimension);
    }
}

export const furniture = new Furniture();