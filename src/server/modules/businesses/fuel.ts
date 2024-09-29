import { PayData, PayType } from "../../../shared/pay";
import { BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE, getFuelCost } from "../../../shared/business";
import { fuelTypeNames, VEHICLE_FUEL_TYPE } from "../../../shared/vehicles";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import { CustomEvent } from "../custom.event";
import { menu } from "../menu";
import { system } from "../system";
import { BusinessEntity } from "../typeorm/entities/business";
import { Vehicle } from "../vehicles";
import { deliverSet, needUnload, orderDeliverMenu } from "./order.system";
import {inventoryShared} from "../../../shared/inventory";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";


export const azsMenuOpenEvent = (player: PlayerMp, shop: BusinessEntity, electro: boolean) => {
    const user = player.user;
    if (!user) return;
    const vehicle = player.vehicle;
    if(!vehicle){
        const item = inventoryShared.get(!electro ? 817 : 862)
        if(!item || !item.defaultCost) return player.notify('Чтобы открыть заправку необходимо находиться в ТС', "error");

        menu.accept(player, `Вы хотите приобрести ${item.name} за $${system.numberFormat(item.defaultCost)}`).then(status => {
            if(!status) return;
            if(user.money < item.defaultCost) return player.notify('У вас недостаточно средств для оплаты', 'error');
            if(!user.tryGiveItem(item.item_id, true, true)) return;
            user.removeMoney(item.defaultCost, true, `Покупка ${item.name} на заправке`);
            business.addMoney(shop, item.defaultCost * 0.7, `Покупка ${item.name}`);
        })

        return;
    }
    if (!vehicle) return player.notify('Чтобы открыть заправку необходимо находиться в ТС', "error");
    if (!user.isDriver) return player.notify('Вы должны быть за рулём', "error");
    const vehconf = Vehicle.getVehicleConfig(vehicle);
    if(!vehconf) return player.notify('Данный транспорт нельзя заправлять, мы не знаем что для него подходит', 'error');
    CustomEvent.triggerClient(player, 'fuel:open', electro, shop.catalog, shop.id, shop.name, Vehicle.getFuel(vehicle), Vehicle.getFuelMax(vehicle))
}

CustomEvent.registerCef('fuel:add', async (player, id: number, amount: number, payType: PayType, pin: string, electro: boolean, selectedFuel: VEHICLE_FUEL_TYPE) => {
    const user = player.user;
    if (!user) return "Ошибка";
    const veh = player.vehicle;
    if (!veh) return "Вы должны быть в транспорте чтобы его " + (electro ? "заряжать" : "заправлять");
    if (!user.isDriver) return 'Вы должны быть за рулём';
    const vehconf = Vehicle.getVehicleConfig(veh);
    if (!vehconf) return 'Данный транспорт нельзя заправлять, мы не знаем что для него подходит';
    const biz = business.get(id);
    if(!biz) return "Вы попали на сломаную заправку, либо её ликвидировали пока вы решались заправиться";
    if (biz.type !== BUSINESS_TYPE.FUEL) return "Вы попали на сломаную заправку, а быть может это вообще не заправка";
    if(electro && vehconf.fuel_type !== VEHICLE_FUEL_TYPE.ELECTRO) return "Для данного транспорта не подходит электрозаправка";
    if(!electro && vehconf.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO) return "Данному транспорту необходима электрозаправка";
    if (vehconf.fuel_type !== selectedFuel) return "Выбранный вид топлива не подходит для данного ТС";

    const item = biz.catalog.find(q => q.item === selectedFuel);
    if (!item) return "Выбранного типа топлива нет на данной заправке";
    let sum: number;
    if(item.count < amount) sum = getFuelCost(selectedFuel) * amount;
    else sum = item.price * amount;

    if(payType === PayType.COMPANY && (!user.fractionData || !user.fractionData.gos)) return "Вы не можете заправляться за счёт компании";
    if(payType === PayType.COMPANY && veh.fraction !== user.fraction) return "За счёт компании можно заправлять только транспорт компании";

    if (payType === PayType.CASH && user.money < sum) return "У вас недостаточно средств";

    if (payType === PayType.CARD && !user.tryRemoveBankMoney(sum, true, `Заправка ТС ${vehconf.name} ${fuelTypeNames[selectedFuel]} ${amount}${electro ? 'кВт' : 'л'}`, `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`)) return "У вас недостаточно средств";
    if (payType === PayType.CASH) user.removeMoney(sum, true, `Заправка ТС ${vehconf.name} ${fuelTypeNames[selectedFuel]} ${amount}${electro ? 'кВт' : 'л'} ${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`);
    Vehicle.addFuel(veh, amount);
    if([PayType.CASH, PayType.CARD].includes(payType)) player.user.achiev.setAchievTickBiz(biz.type, biz.sub_type, sum)
    writeClientRatingLog(player, biz.id, businessDefaultCostItem(biz, biz.catalog.find(s => s.item === selectedFuel).item, 1), fuelTypeNames[selectedFuel], amount);
    player.notify(`Транспорт ${electro ? "заряжен" : "заправлен"}`, "success");
    if(item.count >= amount){
        const o = [...biz.catalog]
        const fuelItem = o.find(s => s.item === selectedFuel);
        fuelItem.count -= amount;
        biz.catalog = o;
        business.addMoney(biz, sum, `Покупка топлива ${fuelTypeNames[selectedFuel]} ${amount}${electro ? 'кВт' : 'л'}`,
            false, false, true, true, businessDefaultCostItem(biz, fuelItem.item, amount));
    }
    return "";
})

export const azsMenuBase = (player: PlayerMp, item: BusinessEntity, electro: boolean) => {
    const user = player.user;
    if(!user) return;
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return azsMenuOpenEvent(player, item, electro);
    const m = menu.new(player, '', 'Заправка');
    m.sprite = "shopui_title_gasstation";

    if (needUnload(player, item)){
        m.newItem({
            name: "~g~Выгрузить заказ",
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    m.newItem({
        name: "Меню заправки",
        onpress: () => {
            m.close();
            azsMenuOpenEvent(player, item, electro);
        },
    })

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id){

        m.newItem({
            name: '~g~Заказ продукции',
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })


        m.newItem({
            name: 'Управление бизнесом',
            onpress: () => {

                businessCatalogMenu(player, item, () => {
                    azsMenuBase(player, item, electro)
                })
            }
        })

    }

    m.open();
}