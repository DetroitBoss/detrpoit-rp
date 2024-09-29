import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {getBaseItemNameById} from "../../shared/inventory";
import {FractionChestOrderEntity} from "./typeorm/entities/chest";
import {User} from "./user";
import {Vehicle} from "./vehicles";
import {fractionChest} from "./chest";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {saveEntity} from "./typeorm";
import {Logs} from "./logs";
import {FamilyReputationType} from "../../shared/family";
import {Family} from "./families/family";
import {OrderedItem, OrderItem, OrderMenuStyle} from "../../shared/chest";
import {fractionCfg} from "./fractions/main";

const paramsName = [
    "Количество|Общее количество данного предмета на складе",
    "Стоимость одной единицы",
    "Автопополнение за 6 часов|Каждые 6 часов работы сервера происходит автопополнение этого предмета на указанное вами количество",
    "Максимальное количество на складе|Этот параметр необходим для системы автопополнения и является её стопором",
    "Количество за заказ|При заказе продукции нельзя будет превысить данный параметр",
    "Задержка перед новым заказом|Если будет заказан этот предмет - снова этот предмет можно будет заказать через указанное количество времени. 0 - без задержки. Таймер указывается в минутах",
];

export class fractionChestOrder {
    static list = new Map<number, fractionChestOrder>()
    label: ScaleformTextMp;
    blip: DynamicBlip;
    limitEnable = new Map<number, boolean>();
    static get(id: number) {
        return this.list.get(id);
    }
    static getByFraction(id: number) {
        let item: fractionChestOrder;
        this.list.forEach(q => {
            if (q.fraction === id) item = q;
        })
        return item;
    }
    static getByFamily(type: FamilyReputationType) {
        let item: fractionChestOrder;
        this.list.forEach(q => {
            if (q.familyType == type) item = q;
        })
        return item;
    }

    private static createChest(fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][], family?: FamilyReputationType) {
        let entity = new FractionChestOrderEntity();
        entity.fraction = fraction;
        entity.familyType = family;
        entity.x = pos.x;
        entity.y = pos.y;
        entity.z = pos.z;
        entity.d = dimension;
        if (items) entity.items = items;
        entity.save().then(ent => {
            this.load(ent);
        })
    }
    
    static createForFamily(familyType: FamilyReputationType, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][]) {
        fractionChestOrder.createChest(0, pos, dimension, items, familyType);
    }
    
    static create(fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][]) {
        fractionChestOrder.createChest(fraction, pos, dimension, items, null);
    }
    static load(data: FractionChestOrderEntity) {
        return new fractionChestOrder(data);
    }
    static loadAll() {
        return FractionChestOrderEntity.find().then(items => {
            items.map(item => {
                this.load(item);
            })
        })
    }
    /** Таймер обратного отсчёта */
    timer = 0;
    colshape: colshapeHandle;
    get pos() {
        return new mp.Vector3(this.data.x, this.data.y, this.data.z);
    }
    set pos(val) {
        this.data.x = val.x
        this.data.y = val.y
        this.data.z = val.z
        this.createColshape();
        this.save();
    }
    get dimension() {
        return this.data.d;
    }
    set dimension(val) {
        this.data.d = val;
        this.createColshape();
        this.save();
    }
    get fraction() {
        return this.data.fraction;
    }
    set fraction(val) {
        this.data.fraction = val;
        this.save();
    }
    get familyType(): FamilyReputationType {
        return this.data.familyType;
    }
    set familyType(val: FamilyReputationType) {
        this.data.familyType = val;
        this.save();
    }
    get items() {
        return this.data.items;
    }
    set items(val) {
        this.data.items = val;
    }
    get closed() {
        return !!this.data.closed;
    }
    set closed(val) {
        this.data.closed = val ? 1 : 0;
        this.save();
    }
    get id() {
        return this.data.id
    }
    get name() {
        return `Заказ товаров`;
    }
    save() {
        saveEntity(this.data);
    }
    data: FractionChestOrderEntity;
    constructor(data: FractionChestOrderEntity) {
        this.data = data;
        this.createColshape();

        fractionChestOrder.list.set(this.id, this);
    }
    createLabel() {
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z + 1), `${this.name}`, {
            dimension: this.dimension,
            range: 15
        }, player => this.haveAccessToOrder(player), 'admin', 'fraction');
    }
    createColshape() {
        if (this.colshape) this.colshape.destroy();
        this.createLabel()
        const color = fractionCfg.getFractionColor(this.fraction);
        const rgb = color ? system.hexToRgb(color) : { r: 255, g: 0, b: 0 }
        this.colshape = colshapes.new(this.pos, () => { return this.name }, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 2,
            color: [rgb.r, rgb.g, rgb.b, 120],
            predicate: player => this.haveAccessToOrder(player)
        }, 'admin', 'fraction');
        if (this.blip) this.blip.destroy();

        this.blip = system.createDynamicBlip(`chestorder_${this.id}`, 501, 1, this.pos, `${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction,
            family: this.getFamiliesWithAccess()
        });
    }
    getFamiliesWithAccess(): number[] {
        if (this.familyType === null) {
            return null;
        }

        return Family.getAll()
            .filter(f => f.level >= 4)
            .map(f => f.id);
    }
    haveAccessToOrder(player: PlayerMp) {
        const user = player.user;
        if (!user) return false;

        if (user.hasPermission('admin:chestorder:access')) return true;
        if (this.fraction && !user.hasPermission('fraction:chestorder:access')) return false;
        if (this.fraction && user.fraction !== this.fraction) return false;
        if (this.familyType !== null && (!user.family || user.family.reputationType !== this.familyType || user.family.level < 4)) return false;
        
        return true;
    }
    addItem(item_id: number, amount: number = 0) {
        if (!item_id) return;
        // if (!amount) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) {
            items[target][1] = items[target][1] + amount;
        }
        else items.push([item_id, amount, 0, 0, 0, 0]);
        this.items = items;
    }
    removeItem(item_id: number, amount: number) {
        if (!item_id) return;
        if (!amount) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) {
            items[target][1] = items[target][1] - amount;
        }
        if (items[target][1] < 0) items[target][1] = 0;
        
        this.items = items;
    }
    getItemCost(item_id: number) {
        const item = this.items.find(itm => itm[0] === item_id)
        return item ? item[2] : 0
    }
    getItemAmount(item_id: number) {
        const item = this.items.find(itm => itm[0] === item_id)
        return item ? item[1] : 0
    }

    orderItems(player: PlayerMp, orderedItems: OrderedItem[]) {
        if (orderedItems.some(item => this.getItemAmount(item.ItemId) < item.Count)) {
            return player.notify("Количество продуции за время заказа уменьшилось", "error");
        }

        if (this.timer) {
            return player.notify('До возможности сделать новый заказ осталось ' + this.timer + ' мин.', 'error');
        }

        const orderSum = orderedItems
            .map(item => this.getItemCost(item.ItemId) * item.Count)
            .reduce((cost1, cost2) => cost1 + cost2, 0);

        if (orderSum && player.user.money < orderSum) {
            return player.notify("У вас недостаточно средств для оплаты", "error");
        }

        const veh = User.getNearestVehicle(player, 10);
        if (!veh) return player.notify("ТС поблизости не обнаружен", "error");
        if (this.fraction && veh.fraction !== this.fraction) return player.notify("Данный ТС не принадлежит вашей фракции", "error");
        if (Vehicle.getLocked(veh)) return player.notify("Транспорт должен быть открытым", "error")
        if (!Vehicle.isVehicleCommercial(veh)) return player.notify("Данный транспорт не предназначен для транспортировки заказов", "error");
        if (!Vehicle.isVehicleCommercialFree(veh)) return player.notify("В ближайшем ТС уже что-то перевозится. Используйте свободный транспорт", "error");

        if (orderSum) {
            player.user.removeMoney(orderSum, true, 'Заказ продукции');
        }

        player.notify("Продукция погружена в ближайший транспорт, осталось доставить её в целости на свой склад", "success");

        orderedItems.forEach(item => {
            this.removeItem(item.ItemId, item.Count);
            const chestItem = this.items.find(i => i[0] === item.ItemId);
            if (!chestItem || !chestItem[5]) {
                return;
            }

            const id = item.ItemId;
            this.limitEnable.set(id, true);
            setTimeout(() => {
                this.limitEnable.delete(id);
            }, chestItem[5] * 60000);
        })

        this.save();
        Logs.new(`chest_order_${this.id}`, `${player.user.name} [${player.user.id}]`,
            `${orderedItems.map(item => `${getBaseItemNameById(item.ItemId)} x${item.Count}`).join(', ')}`)

        const castedOrder = orderedItems.map<[number, number]>(item => [item.ItemId, item.Count]);
        veh.fractionOrder = [...castedOrder];

        player.user.setGui(null);
    }

    openOrderMenu(player: PlayerMp) {
        const user = player.user;
        if (!this.haveAccessToOrder(player)) return player.notify("У вас нет доступа к данному складу", "error");
        if (!user.hasPermission('admin:chestorder:access') && this.closed) return player.notify("Склад временно закрыт", "error");
        if (this.timer) return player.notify('До возможности сделать новый заказ осталось ' + this.timer + ' мин.', 'error');

        user.selectedChestOrderId = this.id;
        const availableItems = this.items.map<OrderItem>(item => {
            return {
                ItemId: item[0],
                IsBlocked: this.limitEnable.has(item[0]),
                MaxCount: system.smallestNumber(item[5], item[1]),
                Price: item[2]
            };
        });

        user.setGui('orderofgoods', 'orderOfGoods::set',
            user.money, user.bank_money,
            this.getOrderMenuStyle(), availableItems);
        return;
    }

    getOrderMenuStyle(): OrderMenuStyle {
        if (this.fraction) {
            return fractionCfg.getFraction(this.fraction).gos ? 'gov' : 'gang';
        } else {
            return this.familyType === 0 ? 'PSC' : 'mafia';
        }
    }

    menu(player: PlayerMp) {
        const user = player.user;
        if (!this.haveAccessToOrder(player)) return player.notify("У вас нет доступа к данному складу", "error");
        if (!user.hasPermission('admin:chestorder:access') && this.closed) return player.notify("Склад временно закрыт", "error");

        if (user.hasPermission('admin:chestorder:access')) {
            const m = menu.new(player, "", this.name);
            m.sprite = "shopui_title_gr_gunmod";

            m.newItem({
                name: "Открыть меню заказов",
                onpress: () => {
                    this.openOrderMenu(player);
                }
            })

            m.newItem({
                name: "Настройка предметов",
                desc: 'В данном разделе вы можете настроить предметы в складе',
                onpress: () => {
                    const itemsMenu = () => {
                        const submenu = menu.new(player, "Настройка предметов", "Список");
                        submenu.onclose = () => { this.menu(player) }
                        this.items.map(qs => {
                            submenu.newItem({
                                name: getBaseItemNameById(qs[0]),
                                icon: 'Item_' + qs[0],
                                onpress: () => {
                                    const itemchoise = () => {
                                        const item = this.items.find(q => q[0] === qs[0]);
                                        const itemmenu = menu.new(player, getBaseItemNameById(item[0]), "Действия над предметом");
                                        itemmenu.onclose = () => { itemsMenu() }


                                        paramsName.map((param, i) => {
                                            const index = i + 1;
                                            itemmenu.newItem({
                                                name: param.split('|')[0],
                                                desc: param.split('|')[1],
                                                more: `${item[index] || 0}`,
                                                onpress: () => {
                                                    menu.input(player, "Введите новое значение параметра " + param, item[index], 6, 'int').then(val => {
                                                        if (typeof val !== "number") return;
                                                        const findex = this.items.findIndex(q => q[0] === item[0]);
                                                        if (findex > -1) {
                                                            const items = [...this.items];
                                                            items[findex][index] = val;
                                                            this.items = items;
                                                            this.save();
                                                            player.notify("Параметр успешно изменён", "success")
                                                        } else {
                                                            player.notify("Ошибка сохранения, мы не нашли данный предмет в каталоге", "error");
                                                        }
                                                        setTimeout(() => {
                                                            if(mp.players.exists(player)) itemchoise();
                                                        }, 100)
                                                    })
                                                }
                                            })
                                        })


                                        itemmenu.newItem({
                                            name: '~r~Удалить',
                                            onpress: () => {
                                                menu.accept(player).then(status => {
                                                    if(!status) return;
                                                    const findex = this.items.findIndex(q => q[0] === item[0]);
                                                    if (findex > -1) {
                                                        const items = [...this.items];
                                                        items.splice(findex, 1)
                                                        this.items = [...items];
                                                        this.save();
                                                        player.notify("Предмет успешно удалён", "success")
                                                    } else {
                                                        player.notify("Предмета больше нет в каталоге", "error");
                                                    }
                                                    setTimeout(() => {
                                                        if(mp.players.exists(player)) itemchoise();
                                                    }, 100)
                                                })
                                            }
                                        })

                                        itemmenu.open();
                                    }
                                    itemchoise();
                                }
                            })
                        })
                        submenu.newItem({
                            name: "~g~Новый предмет",
                            onpress: () => {
                                menu.selectItem(player).then(item => {
                                    if (!item) return this.menu(player);
                                    menu.input(player, "Введите количество", '1', 5, 'int').then(amount => {
                                        if (typeof amount !== 'number') return this.menu(player);
                                        if (amount < 0) return this.menu(player);
                                        this.addItem(item, amount);
                                        this.save();
                                        this.menu(player);
                                        player.notify("Предмет успешно добавлен", "success");
                                    })

                                })
                            }
                        })
                        submenu.newItem({
                            name: "~b~Миграция данных со склада фракции",
                            desc: "Все предметы из каталога будут удалены, а на их место будут записаны те предметы, которые прописаны в складе фракции. Если же у фракции не 1 склад - то будут взяты предметы со всех складов. После операции необходимо будет заново настроить каталог данной системы.",
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if (!status) return this.menu(player);
                                    this.items = [];

                                    fractionChest.list.forEach(chest => {
                                        if (chest.fraction !== this.fraction) return;
                                        chest.items.map(item => {
                                            if (this.items.find(q => q[0] === item[0])) return;
                                            this.addItem(item[0]);
                                        })
                                    })

                                    player.notify("Действие успешно выполнено", "success");
                                    this.save();
                                    this.menu(player);
                                })
                            }
                        })
                        submenu.open();
                    }
                    itemsMenu();
                }
            })

            m.newItem({
                name: "Открыть/Закрыть склад",
                desc: 'Вы можете временно закрыть доступ к складу',
                more: `${this.closed ? '~r~Закрыт' : '~g~Открыт'}`,
                onpress: () => {
                    this.closed = !this.closed;
                    player.notify(`Склад ${this.closed ? 'Закрыт' : 'Открыт'}`, "error");
                    this.menu(player);
                }
            })
            m.newItem({
                name: "Название",
                more: this.name
            })

            m.newItem({
                name: "Переместить на моё местоположение",
                onpress: () => {
                    menu.accept(player, "Вы уверены?").then(status => {
                        if (!status) return;
                        const d = player.dimension;
                        this.pos = player.position;
                        setTimeout(() => {
                            if (this.dimension != d) this.dimension = d;
                            setTimeout(() => {
                                if (!mp.players.exists(player)) return;
                                player.notify("Местоположение успешно обновлено", "success")
                                this.menu(player);
                            }, 500)
                        }, 100)
                    })
                }
            })
            m.newItem({
                name: "~r~Удалить",
                more: "~r~Действие не отменить",
                onpress: () => {
                    menu.accept(player, "Вы уверены?").then(status => {
                        if (!status) return;
                        this.delete();
                        player.notify("Склад успешно удалён", "success");
                    })
                }
            })

            m.open();
            return;
        }

        this.openOrderMenu(player);
    }
    delete() {
        if (this.label) this.label.destroy();
        if (this.colshape) this.colshape.destroy();
        this.data.remove()
        fractionChestOrder.list.delete(this.id);
    }
    static delete(id: number) {
        const item = this.get(id);
        if (item) item.delete();
    }
    static saveAll() {
        this.list.forEach(item => {
            item.save();
        })
    }
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:chestorder:access')) return player.notify("У вас нет доступа", "error");
    const m = menu.new(player, "Склады для заказов", "Список");

    fractionChestOrder.list.forEach(item => {
        m.newItem({
            name: item.name,
            onpress: () => {
                const submenu = menu.new(player, item.name, "Список");
                submenu.newItem({
                    name: "Открыть",
                    onpress: () => {
                        item.menu(player);
                    }
                })
                submenu.newItem({
                    name: "Клонировать",
                    onpress: () => {
                        menu.selectFraction(player, 'all', item.fraction).then(fraction => {
                            if (!fraction) return;
                            if (fractionChestOrder.getByFraction(fraction)) return player.notify("Для данной фракции уже создан склад", "error");
                            fractionChestOrder.create(fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension, item.items);
                            player.notify("Клон успешно создан", "success");
                        })
                    }
                })

                submenu.open();
            }
        })
    })

    m.newItem({
        name: "~g~Создать новый",
        desc: 'Новый элемент будет создан на ваших координатах',
        onpress: () => {
            const submenu = menu.new(player, "Список");
            submenu.newItem({
                name: "Для семьи",
                onpress: () => {
                    const subSubMenu = menu.new(player, "Список");
                    subSubMenu.newItem({
                        name: "Крайм",
                        onpress: () => {
                            fractionChestOrder.createForFamily(FamilyReputationType.CRIME, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                            player.notify("Элемент успешно создан", "success");
                        }
                    })
                    subSubMenu.newItem({
                        name: "Гос",
                        onpress: () => {
                            fractionChestOrder.createForFamily(FamilyReputationType.CIVILIAN, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                            player.notify("Элемент успешно создан", "success");
                        }
                    })
                    
                    subSubMenu.open();
                }
            })
            submenu.newItem({
                name: "Для фракции",
                onpress: () => {
                    menu.selectFraction(player, 'all').then(fraction => {
                        if (!fraction) return player.notify('Фракция не выбрана', 'error');
                        if (fractionChestOrder.getByFraction(fraction)) return player.notify("Для данной фракции уже создан склад", "error");
                        fractionChestOrder.create(fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                        player.notify("Элемент успешно создан", "success");
                    })
                }
            })
            
            submenu.open();
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:chestorder:access', player => {
    adminMenu(player)
})

CustomEvent.registerCef('orderOfGoods::buyItems', (player, orderedItems: OrderedItem[]) => {
    if (!player || !player.user) {
        return;
    }

    const orderChestId = player.user.selectedChestOrderId;
    if (!orderChestId) {
        return;
    }

    const orderChest = fractionChestOrder.list.get(orderChestId);
    if (!orderChest) {
        return;
    }

    orderChest.orderItems(player, orderedItems);
});

setInterval(() => {
    fractionChestOrder.list.forEach(item => {
        if (item.timer > 0) item.timer--;
        else item.timer = 0;
    })
}, 60000)
setInterval(() => {
    fractionChestOrder.list.forEach(chest => {
        let haveUpdate = false;
        const items = [...chest.items]
        items.map((item, index) => {
            if (!item[3]) return;
            if (item[1] >= item[4]) return;
            haveUpdate = true;
            items[index][1] += item[3];
        })
        if (haveUpdate) {
            chest.items = items
            chest.save();
        }
    })
}, 60000 * 60 * 6)