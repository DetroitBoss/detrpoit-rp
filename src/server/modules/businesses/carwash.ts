import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {Vehicle} from "../vehicles";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";



export const openWashBuyMenu = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user
    const vehicle = player.vehicle;
    if(!user) return;

    if(!vehicle) {
        player.notify("Вы должны быть в ТС", "error");
        return false;
    }
    if (!user.isDriver) {
        player.notify("Вы должны быть за рулём", "error")
        return false
    }
    if(Vehicle.getDirtLevel(vehicle) < 0.02) return player.notify('Транспорт не нуждается в мойке', 'error');
    const cfg = item.catalog[0];


    user.tryPayment(cfg.price, 'all', () => {
        return player.vehicle == vehicle && user.isDriver && Vehicle.getDirtLevel(vehicle) >= 0.02
    }, 'Оплата автомойки', `Автомойка #${item.id}`).then(status => {
        if(!status) return;
        Vehicle.setDirtLevel(vehicle, 0.0)
        player.notify('Транспорт чист', 'success');
        writeClientRatingLog(player, item.id, cfg.price, "Мойка ТС", 1);
        if(cfg.count > 0){
            cfg.count--;
            item.catalog = [cfg];
            //@ts-ignore
            business.addMoney(item, cfg.p, 'Мойка ТС', false, false, true,
                true, businessDefaultCostItem(item, cfg.item));
        }
    })

}





export const washMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (!user.isAdminNow(6) && 
        item.userId !== user.id && 
        !needUnload(player, item) &&
        !canUserStartBizWar(user)) return player.notify('У вас нет доступа к управлению бизнесом', 'error')
    let m = menu.new(player, "Автомойка", user.isAdminNow(6) ? `Бизнес #${item.id}` : "");

    if (needUnload(player, item)) {
        m.newItem({
            name: "~g~Выгрузить заказ",
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: '~b~Управление бизнесом',
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    washMenu(player, item)
                })
            }
        })
        m.newItem({
            name: '~g~Заказ продукции',
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })

    }

    m.open();
};