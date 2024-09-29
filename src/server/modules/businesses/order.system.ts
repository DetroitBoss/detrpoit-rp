import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from "../../../shared/business";
import {system} from "../system";
import {business, businessCatalogItemName, businessDefaultCostItem} from "../business";
import {
    ORDER_CAR_HEADING,
    ORDER_CAR_MODELS,
    ORDER_CAR_POS,
    ORDER_CONFIG,
    ORDER_LOAD_COORDS,
    ORDER_MENU_POS
} from "../../../shared/order.system";
import {colshapes} from "../checkpoints";
import {Vehicle} from "../vehicles";
import {User} from "../user";
import {LEVEL_PERMISSIONS} from "../../../shared/level.permissions";
import {MenuItem} from "../../../shared/menu";
import {JOB_TASK_MANAGER_EVENT} from "../battlePass/tasks/jobTaskManager";


export const order_list: { sum: number, comission: number, id: number, biz: number, items: [number, number][], time: number, deliver: number, fake?:true }[] = []

const createFakeOrder = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (order_list.find(item => !item.deliver && !item.fake)) return player.notify("Сейчас можно брать только заказы из списка", "error", "CHAR_BARRY");
    if (order_list.find(q => q.deliver === user.id)) return player.notify("У вас уже есть активный заказ", "error", "CHAR_BARRY");
    const commission = system.getRandomInt(ORDER_CONFIG.NPC_DELIVER_COST_MIN, ORDER_CONFIG.NPC_DELIVER_COST_MAX);

    const biz = system.randomArrayElement(
        business.data
            .filter(b => [
                    BUSINESS_TYPE.FUEL,
                    BUSINESS_TYPE.DRESS_SHOP,
                    BUSINESS_TYPE.ITEM_SHOP,
                    BUSINESS_TYPE.BAR,
                    BUSINESS_TYPE.BARBER
                ].includes(b.type)
            )
            .filter(b => b.dimension === 0)
    );

    if(!biz) return;
    let deposit = ((commission / 100) * ORDER_CONFIG.ZALOG)
    if (!user.tryRemoveBankMoney(deposit, true, 'Залог для выполнения заказа', 'Служба доставки')) return;
    player.notify("Вы успешно взяли заказ. Проследуйте на свободную погрузочную зону чтобы загрузить заказ", "success", "CHAR_BARRY");
    menu.close(player);
    order_list.push({
        sum: 0,
        comission: commission,
        id: system.personalDimension,
        biz: biz.id,
        items: [],
        time: system.timestamp,
        deliver: user.id,
        fake: true
    })
}

colshapes.new(ORDER_CAR_POS, 'Пункт аренды транспорта для доставки', (player, index) => {
    const user = player.user;
    if (!user) return;
    if (user.level < LEVEL_PERMISSIONS.DELIVER) return player.notify(`Аренда доступна с ${LEVEL_PERMISSIONS.DELIVER} LVL персонажа`)
    const m = menu.new(player, "Пункт аренды", "Действия");
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;

    if (user.deliverJobCar) {
        m.newItem({
            name: "Вернуть транспорт",
            more: `$${system.numberFormat(ORDER_CONFIG.VEHICLE_RENT_RETURN)}`,
            onpress: () => {
                if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
                if (!user.deliverJobCar) return player.notify("У вас нет арендованого транспорта", "error");
                if (user.deliverJobLoaded) return player.notify("Перед тем как вернуть транспорт отвезите ранее взятый заказ", 'error');
                user.addBankMoney(ORDER_CONFIG.VEHICLE_RENT_RETURN, true, 'Возврат средств за арендованый транспорт', 'Служба доставки')
                if (user.deliverJobCar && mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar.destroy();
                user.deliverJobCar = null
                user.deliverJobLoaded = false
                m.close();
            }
        })
    } else {
        ORDER_CAR_MODELS.map(([model, cost, level]) => {
            const name = Vehicle.getName(model);
            m.newItem({
                name,
                more: `$${system.numberFormat(cost)}`,
                desc: `Доступно с ${level} LVL`,
                onpress: () => {
                    //if (user.fraction) return player.notify("Нельзя работать в службе доставки работая в организации", 'error')
                    if (user.deliverJobCar) return player.notify("У вас уже есть арендованный транспорт", "error");
                    if (!user.bank_have) return player.notify(`Для аренды вам необходимо иметь банковский счёт`, 'error');
                    if(level && player.user.entity.deliver_level < level) return player.notify('Вам недоступен данный ТС', 'error');
                    if (!user.tryRemoveBankMoney(cost, true, 'Аренда служебного транспорта', 'Служба доставки')) return;

                    menu.close(player);
                    user.deliverJobCar = Vehicle.spawn(model, new mp.Vector3(ORDER_CAR_POS[index].x, ORDER_CAR_POS[index].y, ORDER_CAR_POS[index].z + 1), ORDER_CAR_HEADING, 0, true, false);
                    user.deliverJobLoaded = false
                    setTimeout(() => {
                        if (!mp.players.exists(player)) return;
                        if (!mp.vehicles.exists(user.deliverJobCar)) return;
                        player.user.putIntoVehicle(user.deliverJobCar, 0);
                    }, 500)
                }
            })
        })
    }

    m.open();
}, {
    radius: 3,
    type: 27
})

export const needUnload = (player: PlayerMp, biz: BusinessEntity) => {
    const user = player.user;
    if (!user) return false;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    let item = order_list.find(q => q.deliver === user.id);
    if(!item) return false;
    if(item.biz !== biz.id) return false;

    return true;
}

export const deliverSet = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    if (!user.deliverJobCar) return player.notify("Транспорт пропал", "error", "CHAR_BARRY");
    if (!user.deliverJobLoaded) return player.notify("Чтобы доставить заказ - необходимо сначала погрузить заказ в транспорт", "error", "CHAR_BARRY");
    if(player.dimension == 0 && system.distanceToPos(user.deliverJobCar.position, player.position) > 60) return player.notify('Транспорт находится слишком далеко', 'error');
    let item = order_list.find(q => q.deliver === user.id);
    if (!item) return player.notify("У вас нет активного заказа", "error", "CHAR_BARRY");
    const biz = business.get(item.biz);
    if (!biz) return;
    if(!item.fake){
        biz.reserve_money -= item.sum;
        const catalog = [...biz.catalog];
        item.items.map(([id, count]) => {
            const q = catalog.find(s => s.item === id);
            if(q) q.count+=count;
        })
        biz.catalog = catalog;
        if (biz.userId){
            const owner = User.get(biz.userId);
            if (owner) owner.notify("Заказ для вашего бизнеса был успешно доставлен", "success", "CHAR_BARRY");
        }
        biz.save();
    }
    let zalog = ((item.comission / 100) * ORDER_CONFIG.ZALOG)
    let comission = item.comission;
    let multiple = 0;
    if(player.user.entity.deliver_level > 0) multiple = (comission / 100 * (ORDER_CONFIG.PERCENT_COST_ADD_PER_LEVEL * player.user.entity.deliver_level))
    player.user.entity.deliver_total++;
    player.user.entity.deliver_current++;
    if(player.user.entity.deliver_current >= ORDER_CONFIG.LEVEL_STEP){
        player.user.entity.deliver_current = 0;
        player.user.entity.deliver_level = player.user.entity.deliver_level + 1;
    }
    player.user.achiev.achievTickByType("deliverCount")
    player.user.achiev.achievTickByType("deliverSum", comission)
    mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'trucker')
    user.addBankMoney(comission, true, 'Оплата доставки', 'Служба доставки')
    setTimeout(() => {
        if(multiple){
            user.addBankMoney(multiple, true, 'Надбавка за уровень', 'Служба доставки')
        }
        user.addBankMoney(zalog, true, 'Возврат залога', 'Служба доставки')
    }, 3000)
    user.deliverJobLoaded = false
    if(order_list.findIndex(q => q.id === item.id) > -1)order_list.splice(order_list.findIndex(q => q.id === item.id), 1);
}


colshapes.new(ORDER_MENU_POS, 'Доставка продукции', player => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    const m = menu.new(player, "Выбор заказа", "Список");
    m.newItem({
        name: 'Ваш уровень дальнобойщика',
        more: `${user.entity.deliver_level} LVL (${player.user.entity.deliver_current} / ${ORDER_CONFIG.LEVEL_STEP})`
    })
    m.newItem({
        name: "Взять случайный заказ",
        desc: `Случайный заказ на сумму $${system.numberFormat((ORDER_CONFIG.NPC_DELIVER_COST_MIN))} до $${system.numberFormat(ORDER_CONFIG.NPC_DELIVER_COST_MAX)}. Залог - ${ORDER_CONFIG.ZALOG}%`,
        onpress: () => {
            if (!user.deliverJobCar) return player.notify("Для того, чтобы взять заказ необходимо иметь служебный транспорт", "error", "CHAR_BARRY");
            createFakeOrder(player)
        }
    })
    order_list.map(item => {
        if (item.deliver) return;
        if (item.fake) return;
        if ((item.time + (ORDER_CONFIG.AFK_TIME * 50)) < system.timestamp) return;

        const biz = business.get(item.biz);
        if (!biz) return;
        let zalog = ((item.comission / 100) * ORDER_CONFIG.ZALOG)
        m.newItem({
            name: `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]}`,
            more: `+$${system.numberFormat(item.comission)}`,
            desc: `Залог: $${system.numberFormat(zalog)}`,
            onpress: () => {
                if (!user.deliverJobCar) return player.notify("Для того, чтобы взять заказ необходимо иметь служебный транспорт", "error", "CHAR_BARRY");
                if (item.deliver) return player.notify("Данный заказ уже кто то взял", "error", "CHAR_BARRY");
                if (order_list.find(q => q.deliver === user.id)) return player.notify("У вас уже есть активный заказ", "error", "CHAR_BARRY");
                if (!user.tryRemoveBankMoney(zalog, true, 'Залог для выполнения заказа', 'Служба доставки')) return;
                item.deliver = user.id;
                player.notify("Вы успешно взяли заказ. Проследуйте на свободную погрузочную зону чтобы загрузить заказ", "success", "CHAR_BARRY");
                menu.close(player);
            }
        })

    })

    m.open();
}, {
    radius: 3,
    type: 27
})

colshapes.new(ORDER_LOAD_COORDS, 'Погрузочная зона', (player, index) => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
    if (!user.deliverJobCar) return player.notify("Для того, чтобы взять заказ необходимо иметь служебный транспорт", "error", "CHAR_BARRY");
    const veh = user.deliverJobCar;
    if(user.deliverJobLoaded) return player.notify("Заказ уже погружен", 'error')
    if(mp.labels.toArray().find(q => q.deliver === index)) return player.notify("Погрузочная зона занята", 'error')
    const check = () => {
        if(!mp.players.exists(player)) return false;
        if (user.deliverJobCar && !mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar = null, user.deliverJobLoaded = false;
        if (!user.deliverJobCar){
            player.notify("Для того, чтобы взять заказ необходимо иметь служебный транспорт", "error", "CHAR_BARRY");
            return false
        }
        let item = order_list.find(q => q.deliver === user.id);
        if (!item) {
            player.notify("У вас нет активного заказа", "error", "CHAR_BARRY");
            return false;
        }
        if (user.deliverJobLoaded){
            player.notify("Заказ уже погружен", "error", "CHAR_BARRY");
            return false;
        }
        if(!mp.vehicles.exists(veh)){
            player.notify("Транспорт пропал", "error", "CHAR_BARRY");
            return false;
        }
        if (system.distanceToPos2D(veh.position, ORDER_LOAD_COORDS[index]) > 5){
            player.notify("Транспорт отсутствует в погрузочной зоне", "error", "CHAR_BARRY");
            return false;
        }
        return true;
    }
    if (!check()) return;
    player.notify("Погрузка займёт 30 секунд. Ожидайте", "error");
    let t = 30;
    let text = mp.labels.new(`Погрузка: ${t}`, ORDER_LOAD_COORDS[index], {
        dimension: player.dimension,
        drawDistance: 5,
        los: false
    })
    text.deliver = index
    let int = setInterval(() => {
        let q = check();
        t--;
        if (mp.labels.exists(text)) text.text = `Погрузка: ${t}`;
        if (t <= 0 || !q){
            if (mp.labels.exists(text)) text.destroy();
            clearInterval(int);
            if(!t){
                user.deliverJobLoaded = true;
                const biz = business.get(order_list.find(q => q.deliver === user.id).biz);
                if(!biz) return player.notify("Возникла ошибка с поиском местоположения бизнеса", "error");
                player.notify("Маршрут в вашем навигаторе, постарайтесь как можно быстрее доставить товар", "success");
                user.setWaypoint(biz.positions[0].x, biz.positions[0].y, biz.positions[0].z, 'Доставка продукции', true);
            }
        }
    }, 1000)
}, {
    radius: 5,
    type: 27
})

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    if (user.deliverJobCar && mp.vehicles.exists(user.deliverJobCar)) user.deliverJobCar.destroy();
    const index = order_list.findIndex(q => q.deliver === user.id)
    if(index == -1) return;
    let item = order_list[index];
    if(!item) return;
    if(item.fake) order_list.splice(index, 1)
    else order_list[index].deliver = null;
})


const getOrderSum = (biz: BusinessEntity, order: Map<number, number>) => {
    const items: [number, number][] = [];
    order.forEach((count, id) => {
        items.push([id, count])
    });

    let sum = 0;
    items.map(([item, count]) => {
        if (count == 0) return;
        let cost = businessDefaultCostItem(biz, item, count)
        sum += cost
    })
    if(biz.upgrade > 0 && [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING].includes(biz.type)){
        sum = sum - (sum / 100 * (biz.upgrade * 10))
    }
    return sum
}

type BusinessCatalogFilterFunc = (
    businessEntity: BusinessEntity,
    catalog: typeof BusinessEntity.prototype.catalog
) => typeof BusinessEntity.prototype.catalog;

function createFilterByItemName(itemName: string): BusinessCatalogFilterFunc {
    const lowerCaseName = itemName.toLowerCase();

    return function (
        businessEntity: BusinessEntity,
        catalog: typeof BusinessEntity.prototype.catalog
    ) {
        return catalog.filter(item =>
            businessCatalogItemName(businessEntity, item.item)
                .toLowerCase().includes(lowerCaseName)
        )
    }
}

function createFilterByCountOnStock(lessThenCount: number): BusinessCatalogFilterFunc {
    return function (
        businessEntity: BusinessEntity,
        catalog: typeof BusinessEntity.prototype.catalog
    ) {
        return catalog.filter(item => item.count <= lessThenCount);
    }
}

export const orderDeliverMenu = (player: PlayerMp, biz: BusinessEntity) => {
    const user = player.user;
    if (!user) return;
    if (order_list.find(q => q.biz === biz.id && !q.fake)) return player.notify("У вас уже есть активный заказ. Дождитесь его выполнения", "error")
    let order = new Map<number, number>();
    let catalogFilter: BusinessCatalogFilterFunc = null;

    const sm = () => {
        const m = menu.new(player, "Оформление заказа", "");

        const orderSumMenuItem: MenuItem = {
            name: 'Сумма заказа',
            more: `$${getOrderSum(biz, order)}`
        };

        const updateOrderSum = () => {
            orderSumMenuItem.more = `$${getOrderSum(biz, order)}`;
            m.updateItem(orderSumMenuItem);
        };

        const catalog = catalogFilter == null
            ? biz.catalog
            : catalogFilter(biz, biz.catalog);

        m.newItem({
            name: '~o~Фильтр по кол-ву на складе',
            onpress: () => {
                menu.input(player, 'На складе меньше, чем...', 0, 6, 'int').then(count => {
                    catalogFilter = createFilterByCountOnStock(count);
                    sm();
                });
            }
        });

        m.newItem({
            name: '~o~Фильтр по имени',
            onpress: () => {
                menu.input(player, 'Имя продукта', "", 20, 'text').then(name => {
                    catalogFilter = createFilterByItemName(name);
                    sm();
                });
            }
        });

        m.newItem({
            name: '~r~Сбросить фильтр',
            onpress: () => {
                catalogFilter = null;
                sm();
            }
        });

        catalog.map(item => {
            const canMax = item.max_count - item.count
            let name = businessCatalogItemName(biz, item.item)
            m.newItem({
                name,
                type: "range",
                desc: `Изменяйте по одному стрелками влево-вправо, либо введите новое количество нажав на Enter. У вас на складе ${item.count} / ${item.max_count}`,
                rangeselect: [0, canMax],
                listSelected: order.has(item.item) ? order.get(item.item) : 0,
                onchange: (val) => {
                    if (val) order.set(item.item, val)
                    else order.delete(item.item);

                    updateOrderSum();
                },
                onpress: () => {
                    menu.input(player, 'Введите количество', order.has(item.item) ? order.get(item.item) : 0, 6, 'int').then(count => {
                        if(typeof count !== "number") return;
                        if(!count && count !== 0) return;
                        if(count < 0) return;
                        if(count > canMax) return;
                        if(count) order.set(item.item, count)
                        else order.delete(item.item)
                        sm();
                    })
                }
            })
        })

        m.newItem(orderSumMenuItem);

        m.newItem({
            name: '~g~Перейти к оформлению',
            desc: 'Оплата производится со счета бизнеса. В случае если доставка не будет выполнена - средства будут возвращены',
            onpress: () => {
                const sum = getOrderSum(biz, order);
                if (!sum) return player.notify("Чтобы оформить заказ укажите товары для заказа", "error");
                if (sum < 10000) return player.notify("Сумма заказа не может быть менее 10000$", "error");
                if (order_list.find(q => q.biz === biz.id)) return player.notify("У вас уже есть активный заказ. Дождитесь его выполнения", "error"), menu.close(player);
                const submenu = menu.new(player, "Оформление заказа", "Результат");
                const comission = ((sum / 100) * ORDER_CONFIG.COMISSION)
                submenu.newItem({
                    name: "Сумма продукции",
                    more: `$${system.numberFormat(sum)}`
                })
                submenu.newItem({
                    name: "Услуги доставки",
                    more: `$${system.numberFormat(comission)}`
                })
                submenu.newItem({
                    name: "Итоговая сумма",
                    more: `$${system.numberFormat(sum + comission)}`
                })

                const resItems: [number, number][] = [];
                order.forEach((count, id) => {
                    resItems.push([id, count])
                });

                submenu.newItem({
                    name: "~g~Оформить",
                    onpress: () => {
                        if (order_list.find(q => q.biz === biz.id)) return player.notify("У вас уже есть активный заказ. Дождитесь его выполнения", "error"), menu.close(player);
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
                        business.removeMoney(biz, sum + comission, 'Оплата заказа продукции', true)
                        menu.close(player);
                        player.notify("Заказ успешно оформлен", "success");
                    }
                })

                submenu.open();
            }
        })

        m.open();
    }

    sm();

}

setInterval(() => {
    const current = system.timestamp;
    order_list.map((item, index) => {
        if (item.deliver) return;
        if ((item.time + (ORDER_CONFIG.AFK_TIME * 60)) < current) {
            if(!item.fake){
                const biz = business.get(item.biz);
                if (!biz) return;
                biz.reserve_money -= item.sum;
                const catalog = [...biz.catalog];
                item.items.map(([id, count]) => {
                    const q = catalog.find(s => s.item === id);
                    if (q) q.count += count;
                })
                biz.catalog = catalog;
                if (biz.userId) {
                    const owner = User.get(biz.userId);
                    if (owner) owner.notify("Заказ для вашего бизнеса был успешно доставлен", "success", "CHAR_BARRY");
                }
            }
            order_list.splice(index, 1)
        }
    })
}, 60000)