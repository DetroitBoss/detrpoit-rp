import {BusinessEntity} from "../typeorm/entities/business";
import {
    IBaseBusinessInfo,
    IBusinessCatalogRating,
    IBusinessRating,
    IOrderCatalogDTO,
    IPricesCatalog,
    ITaxes,
    IUserBuyerRating
} from "../../../shared/tablet/business.config";
import {CustomEvent} from "../custom.event";
import {system} from "../system";
import {MoreThan} from "typeorm";
import {BusinessClientsRatingEntity} from "../typeorm/entities/businessClientsRating";
import {business, businessCatalogItemName, businessDefaultCostItem} from "../business";
import {order_list} from "./order.system";
import {ORDER_CONFIG} from "../../../shared/order.system";
import {BUSINESS_TYPE, getFuelCost} from "../../../shared/business";
import {inventoryShared} from "../../../shared/inventory";
import {BarberShopCost} from "../../../shared/barbershop";
import {dress} from "../customization";
import {vehicleConfigs} from "../vehicles";
import {tattoosShared} from "../../../shared/tattoos";
import {CAR_WASH_ITEM_COST} from "../../../shared/carwash";
import {getVehicleMod} from "./lsc";
import {BusinessTaxLogEntity} from "../typeorm/entities/businessTaxLog";

class TabletBusiness {
    ratingHash: (BusinessClientsRatingEntity | IBusinessRating)[] = []

    constructor() {
        CustomEvent.registerCef('tablet:business:loadCatalog', this.loadOrderCatalogHandler);
        CustomEvent.registerCef('tablet:business:orderProducts', this.orderProductsHandler);
        CustomEvent.registerCef('tablet:business:baseInfo', this.getBusinessBaseInfoHandler);
        CustomEvent.registerCef('tablet:business:pricesCatalog', this.pricesCatalogHandler);
        CustomEvent.registerCef('tablet:business:updatePrice', this.updatePriceFromCatalog);
        CustomEvent.registerCef('tablet:business:taxData', this.getBusinessTaxHandler);
        CustomEvent.registerCef('tablet:business:payTax', this.payTaxHandler);
        CustomEvent.registerCef('tablet:business:rating:week', this.getWeekRatingHandler);
        CustomEvent.registerCef('tablet:business:rating:month', this.getMonthRatingHandler);
        CustomEvent.registerCef('tablet:business:catalog:rating', this.getCatalogRatingHandler);
        CustomEvent.registerCef('tablet:business:taxes:history', this.getHistoryTaxesHandler);
        CustomEvent.registerCef('tablet:business:lastSells', this.getLastSellsRatingHandler);

        this.updateHash();
    }
    /** Обновление хэша рейтинга */
    private updateHash() {
        setTimeout(async () => {
            this.ratingHash = await BusinessClientsRatingEntity.find({
                where: {time: MoreThan(Math.floor(Date.now() / 1000) - 2678400)}
            });
        }, 10000);
    }

    /** Обработчик получения базовой информации о бизнесе */
    private getBusinessBaseInfoHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.business) return;

        return this.getBaseInfo(player.user.business);
    }

    /** Базовая информация о бизнесе */
    private getBaseInfo(item: BusinessEntity): IBaseBusinessInfo {
        return {
            name: item.name,
            money: item.money,
            cost: item.price,
            tax: item.tax,
            taxMax: item.taxMax,
            upgrade: item.upgrade,
            type: item.type
        }
    }

    /** Обновление цены в каталоге */
    private updatePriceFromCatalog(player: PlayerMp, item: number, price: number) {
        if (!player.user.business) return player.notify("У вас нет бизнеса", 'error');

        const biz = player.user.business;

        const index = biz.catalog.findIndex(el => el.item === item);

        if (index === -1) return;

        const catalogCopy = [...biz.catalog];

        catalogCopy[index].price = price;

        player.user.business.catalog = catalogCopy;

        player.notify("Цена успешно изменена", 'success');
        CustomEvent.triggerCef(player, 'tablet:business:update:pricesCatalog');
    }

    /** Обработчик получения каталога */
    private loadOrderCatalogHandler = (player: PlayerMp) => {
        if (!player.user.business) return [];

        return this.generateCatalog(player.user.business);
    }

    /** Получение каталога по бизнесу */
    private generateCatalog(item: BusinessEntity): IOrderCatalogDTO[] {
        const catalog = item.catalog.map(el => {
            return {
                name: businessCatalogItemName(item, el.item),
                item: el.item,
                price: TabletBusiness.getOrderItemCost(item, el.item),
                count: el.count,
                max_count: el.max_count
            }
        });

        return catalog;
    }

    /** Получение информации о налогах */
    private getBusinessTaxHandler = (player: PlayerMp): ITaxes => {
        const biz = player.user.business;
        const paidDate = system.timestamp + (Math.trunc(biz.tax / biz.taxDay) * 86400);


        return {
            now: biz.tax,
            day: biz.taxDay,
            max: biz.taxMax,
            end: system.timeStampStringDate(paidDate)
        }
    }

    /** Оплата налогов */
    private payTaxHandler = (player: PlayerMp, days: number) => {
        if (!player.user || !player.user.business) return player.notify('Произошла ошибка', 'error');
        if (days === 0) return player.notify('Нельзя оплатить на 0 дней', 'error');
        const biz = player.user.business;
        let taxMoney = days * biz.taxDay;

        if (taxMoney + biz.tax > biz.taxMax) taxMoney = biz.taxMax - biz.tax;
        biz.tax += taxMoney

        const res = player.user.tryRemoveBankMoney(taxMoney, true, `Оплата налога бизнеса [${biz.id}] на ${days} дней`, "business");

        if (res) {
            player.notify('Вы успешно оплатили налог на бизнес', "success");
            CustomEvent.triggerCef(player, 'tablet:business:update:taxData');

            const data = BusinessTaxLogEntity.create({
                userId: player.user.id,
                businessId: biz.id,
                money: taxMoney,
                time: system.timestamp
            })

            biz.save();
            data.save();
        }
    }

    /** Получение истории оплаты налогов */
    private getHistoryTaxesHandler = async (player: PlayerMp) => {
        if (!player.user || !player.user.business) return [];

        let res = await BusinessTaxLogEntity.find({
            where: {
                userId: player.user.id,
                businessId: player.user.business.id,
                time: MoreThan(system.timestamp - 5097600)
            }
        })

        res = res.sort((a,b) => b.time > a.time ? 1 : -1);

        return res.map(el => {
            return {
                time: system.timeStampString(el.time, true),
                money: el.money
            }
        })
    }

    /** Получение цены за предмет */
    private static getOrderItemCost(biz: BusinessEntity, item: number, count = 1): number {
        let sum = 0;
        if (biz.type === BUSINESS_TYPE.ITEM_SHOP || biz.type === BUSINESS_TYPE.BAR) {
            const cfg = inventoryShared.get(item);
            sum = cfg ? (cfg.defaultCost || 0) * count : 0
        } else if (biz.type === BUSINESS_TYPE.BARBER) {
            if (item === 1) sum += BarberShopCost.hair * count;
            if (item === 2) sum += BarberShopCost.paint * count;
            if (item === 3) sum += BarberShopCost.lenses * count;
        } else if (biz.type === BUSINESS_TYPE.FUEL) {
            sum = getFuelCost(item) * count
        } else if (biz.type === BUSINESS_TYPE.DRESS_SHOP) {
            const cfg = dress.get(item);
            sum = cfg ? (cfg.price || 0) * count : 0;
        } else if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP) {
            sum = vehicleConfigs.has(item) ? vehicleConfigs.get(item).cost : 0;
        } else if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
            const cfg = tattoosShared.getTattoo(item)
            sum = cfg ? (cfg.price || 0) * count : 0;
        } else if (biz.type === BUSINESS_TYPE.WASH) {
            sum = CAR_WASH_ITEM_COST * count
        } else if (biz.type === BUSINESS_TYPE.TUNING) {
            let cfg = getVehicleMod(item);
            sum = cfg ? (cfg.cost || 0) * count : 0;
        }

        return sum;
    }

    /** Получение каталога изменения цен */
    private pricesCatalogHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.business) return [];

        const biz = player.user.business;

        const data: IPricesCatalog[] = biz.catalog.map(el => {
            return {
                item: el.item,
                name: businessCatalogItemName(biz, el.item),
                price: el.price,
                maxPrice: businessDefaultCostItem(biz, el.item) * biz.multiple_price,
                count: el.count,
                maxCount: el.max_count
            }
        })

        return data;
    }

    /** Получение последних покупок */
    private getLastSellsRatingHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.business) return [];

        const biz = player.user.business;

        let today = this.ratingHash.filter(el => el.time > system.timestamp - 86400 && el.businessId === biz.id);

        today = today.sort(
            (a, b) => b.time > a.time ? 1 : -1);

        today = today.slice(0, 20);

        return today.map(el => {
            return {
                name: el.itemName,
                count: el.count,
                userId: el.userId,
                time: system.timeStampString(
                    el.time,
                    system.timestamp - el.time > 86000
                ),
                money: el.money * el.count
            }
        });
    }

    /** Получение топа за неделю */
    private getWeekRatingHandler = async (player: PlayerMp) => {
        if (!player.user || !player.user.business) return [];

        return await this.getRating(player.user.business, true);
    }

    /** Получение топа за месяц */
    private getMonthRatingHandler = async (player: PlayerMp) => {
        if (!player.user || !player.user.business) return;

        return await this.getRating(player.user.business, false);
    }

    /** Получение топа 10 игроков */
    private async getRating(item: BusinessEntity, isWeek: boolean) {

        const time = isWeek ? 604800 : 2678400;

        const users: Map<number, number> = new Map<number, number>();

        const biz = this.ratingHash.filter(el => el.businessId === item.id && system.timestamp > system.timestamp - time);

        biz.forEach(el => {
            if (users.has(el.userId)) return;
            users.set(el.userId, 0);
        })

        biz.forEach(el => {
            if (!users.has(el.userId)) return;
            const val = users.get(el.userId);
            users.set(el.userId, val + el.count * el.money);
        })

        let answer: IUserBuyerRating[] = []

        users.forEach((money, userId) => {
            answer.push({
                userId: userId,
                money: money
            })
        })

        answer.sort((a,b) => b.money > a.money ? 1 : -1);

        if (answer.length > 10) answer.slice(0, 10);

        return answer;
    }

    /** Обработчик получения рейтнга каталога */
    private getCatalogRatingHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.business) return [];

        return this.getCatalogRating(player.user.business);
    }

    /** Получение рейтинга каталога */
    private getCatalogRating(item: BusinessEntity) {
        const biz = this.ratingHash.filter(el => el.businessId === item.id);
        const catalog: IBusinessCatalogRating[] = []

        biz.forEach(el => {
            if (catalog.find(item => item.name === el.itemName)) return;

            catalog.push({
                name: el.itemName,
                day: 0,
                week: 0,
                month: 0
            })
        })

        biz.filter(el => el.time > system.timestamp - 86400).forEach(el => {
            const item = catalog.find(item => item.name === el.itemName);
            if (item === undefined) return;
            item.day += el.count;
        })

        biz.filter(el => el.time > system.timestamp - 604800).forEach(el => {
            const item = catalog.find(item => item.name === el.itemName);
            if (item === undefined) return;
            item.week += el.count;
        })

        biz.filter(el => el.time > system.timestamp - 2678400).forEach(el => {
            const item = catalog.find(item => item.name === el.itemName);
            if (item === undefined) return;
            item.month += el.count;
        })

        catalog.sort((a,b) => b.week > a.week ? 1 : -1);

        if (catalog.length > 10) catalog.slice(0, 10);

        return catalog;
    }

    private static getOrderDiscount(biz: BusinessEntity) {
        if (biz.upgrade > 0 && [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING].includes(biz.type)) {
            return biz.upgrade * 10;
        }

        return 0;
    }

    /** Заказ продукции */
    private orderProductsHandler = (player: PlayerMp, items: IOrderCatalogDTO[]) => {
        if (!player.user) return;
        if (!player.user.business) return player.notify('Произошла ошибка', 'error');
        const biz = player.user.business;
        if (order_list.find(q => q.biz === biz.id)) return player.notify("У вас уже есть активный заказ. Дождитесь его выполнения", "error");

        let sum = 0;
        const discount = TabletBusiness.getOrderDiscount(biz);

        const resItems: [number, number][] = [];

        items.forEach((el) => {
            sum += el.orderCount * TabletBusiness.getOrderItemCost(biz, el.item);
            resItems.push([el.item, el.orderCount]);
        });

        if (discount !== 0) sum = sum - Math.floor(sum / 100 * discount);

        const comission = Math.floor(((sum / 100) * ORDER_CONFIG.COMISSION));

        if (sum < 10000) return player.notify("Сумма заказа не может быть менее 10000$", "error");

        if (biz.money < sum) return player.notify("На счету бизнеса недостаточно средств для оплаты данного заказа", "error")

        order_list.push({
            sum: sum + comission,
            comission,
            id: system.personalDimension,
            biz: biz.id,
            items: resItems,
            time: system.timestamp,
            deliver: 0
        })

        business.removeMoney(biz, sum + comission, 'Оплата заказа продукции', true);

        const data = BusinessTaxLogEntity.create({
            userId: player.user.id,
            businessId: biz.id,
            money: sum + comission,
            time: system.timestamp
        })

        biz.save();
        data.save();

        player.notify("Заказ успешно оформлен", "success");
    }
}


const tabletBusiness = new TabletBusiness();


export const writeClientRatingLog = async (player: PlayerMp, businessId: number, money: number, itemName: string, count: number) => {
    const data = BusinessClientsRatingEntity.create({
        businessId: businessId,
        itemName: itemName,
        count: count,
        money: money,
        userId: player.user.id,
        time: system.timestamp
    });

    tabletBusiness.ratingHash.push({
        businessId: businessId,
        itemName: itemName,
        count: count,
        money: money,
        userId: player.user.id,
        time: system.timestamp
    })

    await data.save();
}