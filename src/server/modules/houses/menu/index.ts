import {gui} from "../../gui";
import {CustomEvent} from "../../custom.event";
import {IFurnitureDTO} from "../../../../shared/houses/menu/menu.web";
import {HouseEntity} from "../../typeorm/entities/houses";
import {IInteriorData, interiorsData} from "../../../../shared/houses/menu/interiors.config";
import {furniture} from "../furniture";

class HomeMenu {
    constructor() {
        gui.chat.registerCommand('hmenu', (player) => this.commandHandler(player));
        CustomEvent.registerCef('homeMenu:buyInterior', this.buyInteriorHandler);
    }

    commandHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.houseEntity) return;
        if (player.dimension !== player.user.houseEntity.id) console.log(`${player.dimension} | ${player.user.houseEntity.id}`)
        if (player.dimension !== player.user.houseEntity.id)
            return player.notify('Необходимо находиться в своем доме', 'error');
        const furnitureList: IFurnitureDTO[] = [];
        player.user.houseEntity.furnitureData.forEach(el => {
            furnitureList.push({
                id: el.id,
                cfgId: el.cfgId,
                placed: !!el.pos
            })
        })
        CustomEvent.triggerClient(
            player,
            'homeMenu:open',
            player.user.houseEntity.id,
            furnitureList,
            player.user.houseEntity.interrior,
            player.user.money,
            player.user.bank_money,
            player.user.donate_money
        );
    }

    buyInteriorHandler = (player: PlayerMp, id: number) => {
        if (!player.user || !player.user.houseEntity) return;

        const house: HouseEntity = player.user.houseEntity,
            interiorCfg: IInteriorData = interiorsData.find(el => el.interiorId === id);

        if (!interiorCfg) return;

        if (interiorCfg.isDonate) {
            if (player.user.donate_money < interiorCfg.cost)
                return player.notify('У вас недостаточно коинов', 'error');

            player.user.donate_money = player.user.donate_money - interiorCfg.cost;
        }else{
            if (player.user.money < interiorCfg.cost)
                return player.notify('У вас недостаточно денег', 'error');
            player.user.money = player.user.money - interiorCfg.cost;
        }

        const players: PlayerMp[] = [];

        mp.players.toArray().forEach(target => {
            if (!target.user || target.dimension !== house.id) return;
            players.push(target);
        })

        players.forEach(target => {
            if (!player.user) return;
            furniture.leaveHouse(target);
            target.user.teleport(house.x, house.y, house.z, house.h, 0);
        });

        furniture.clearPlacementFurniture(player, house);

        house.interrior = id;
        house.save();

        player.user.log('houses', `Купил интерьер - ${id} за ${interiorCfg.cost} ${interiorCfg.isDonate ? "доната" : "игровых"}`);
        player.user.notify('Вы успешно приобрели новый интерьер дома', 'success');
    }
}

export const homeMenu = new HomeMenu();