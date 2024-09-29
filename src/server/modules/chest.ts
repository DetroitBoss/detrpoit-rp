import {FractionChestEntity} from "./typeorm/entities/chest";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {FACTION_ID} from "../../shared/fractions";
import {inventory} from "./inventory";
import {
    ARMOR_ITEM_ID,
    getBaseItemNameById,
    getItemName,
    getItemWeight,
    inventoryShared,
    OWNER_TYPES
} from "../../shared/inventory";
import {User} from "./user";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {CHEST_RECYCLING_LIST} from "../../shared/chest";
import {Logs} from "./logs";
import {Family} from "./families/family";
import {ItemEntity} from "./typeorm/entities/inventory";
import {ArmorNames} from "../../shared/cloth";
import {dress} from "./customization";
import {fractionCfg} from "./fractions/main";

export class fractionChest {
    static list = new Map <number, fractionChest>()
    label: ScaleformTextMp;
    blip: DynamicBlip;
    static get(id: number){
        return this.list.get(id);
    }
    static getByFraction(id: FACTION_ID){
        return [...this.list].map(q => q[1]).filter(q => q.fraction === id)
    }
    static getByFamily(id: number){
        return [...this.list].map(q => q[1]).filter(q => q.family === id)
    }
    
    private static createChest(name: string, prefix: string, fraction: number, familyId: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]) {
        let entity = new FractionChestEntity();
        entity.name = name;
        entity.prefix = prefix;
        entity.family = familyId;
        entity.fraction = fraction;
        entity.pos_x = pos.x;
        entity.pos_y = pos.y;
        entity.pos_z = pos.z;
        entity.pos_d = dimension;
        entity.logs = JSON.stringify([]);
        if (items) entity.items = items;
        if (limits) entity.limits = limits;
        entity.save().then(ent => {
            this.load(ent);
        }).catch(err => {
            console.error(err);
        })
    }
    
    static createForFamily(name: string, prefix: string, familyId: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]) {
        fractionChest.createChest(name, prefix, 0, familyId, pos, dimension, items, limits);
    }
    
    static create(name: string, prefix: string, fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]){
        fractionChest.createChest(name, prefix, fraction, 0, pos, dimension, items, limits);
    }
    static load(data: FractionChestEntity){
        return new fractionChest(data);
    }
    static loadAll(){
        return FractionChestEntity.find().then(items => {
            items.map(item => {
                this.load(item);
            })
        })
    }
    /** Сколько игрок взял предметов по типу
     * @key USERID_ITEMID
     */
    takedByItems = new Map<string, number>()
    /** Сколько игрок взял предметов всего */
    takedTotal = new Map<number, number>()
    colshape: colshapeHandle;
    get pos(){
        return new mp.Vector3(this.data.pos_x, this.data.pos_y, this.data.pos_z);
    }
    set pos(val){
        this.data.pos_x = val.x
        this.data.pos_y = val.y
        this.data.pos_z = val.z
        this.createColshape();
        this.save();
    }
    get dimension(){
        return this.data.pos_d;
    }
    set dimension(val){
        this.data.pos_d = val;
        this.createColshape();
        this.save();
    }
    get fraction(){
        return this.data.fraction;
    }
    set fraction(val){
        this.data.fraction = val;
        this.save();
    }
    get family(){
        return this.data.family;
    }
    set family(val){
        this.data.family = val;
        this.save();
    }
    get name(){
        return this.data.name;
    }
    set name(val){
        this.data.name = val;
        this.createLabel()
        this.save();
    }
    get prefix(){
        return this.data.prefix;
    }
    set prefix(val){
        this.data.prefix = val;
        this.save();
    }
    get items(){
        return this.data.items;
    }
    set items(val){
        this.data.items = val;
    }
    get limits(){
        return this.data.limits;
    }
    set limits(val){
        this.data.limits = val;
        this.save();
    }
    get closed(){
        return !!this.data.closed;
    }
    set closed(val){
        this.data.closed = val ? 1 : 0;
        this.save();
    }
    get currentSize(){
        let size = 0;
        this.items.map(item => {
            size += getItemWeight(item[0]) * item[1]
        })
        return size;
    }
    get size(){
        return this.data.size;
    }
    set size(size){
        this.data.size = size;
        this.save();
    }
    get id(){
        return this.data.id
    }
    save(){
        this.data.save();
    }
    data: FractionChestEntity;
    constructor(data: FractionChestEntity){
        this.data = data;
        let ranks: any[] = [];
        
        if (this.fraction) {
            ranks = fractionCfg.getFractionRanks(this.fraction);
        }
        else if (this.family) {
            ranks = Family.getByID(this.family).ranks;
        }
        
        if (ranks) {
            const limits = [...this.limits]
            ranks.map((_, id) => {
                const rankid = id + 1
                if (!limits.find(q => q[0] === rankid)) limits.push([rankid, 0, 0]);
            })
            if (limits.length !== this.limits.length) this.limits = limits;
        }
        
        let items = [...this.items]
        items.map(item => {
            if(typeof item[1] !== 'number') item[1] = 0;
        })
        this.items = [...items];
        this.createColshape();
        fractionChest.list.set(this.id, this);
    }
    
    
    createLabel() {
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z + 1), `Склад ${this.name}`, {
            dimension: this.dimension,
            range: 10,
            type: "front",
        })
    }
    createColshape(){
        this.createLabel()
        if(this.colshape) this.colshape.destroy();
        const color = fractionCfg?.getFractionColor(this.fraction) ?? "#fc0317";
        const rgb = color ? system.hexToRgb(color) : { r: 255, g: 0, b: 0 }
        this.colshape = colshapes.new(this.pos, () => { return this.name }, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 2,
            color: [rgb.r, rgb.g, rgb.b, 120]
        })
        if (this.blip) this.blip.destroy();
        this.blip = system.createDynamicBlip(`chest_${this.id}`, 568, 4, this.pos, `Склад ${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction ?? 0,
            family: this.family ?? 0,
            shortRange: false,
            range: 50,
            interior: true
        })
    }
    haveAccessToChest(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission('admin:chest:access')) return true;
        if (this.fraction && !user.hasPermission('fraction:chest:access')) return false;
        if (this.fraction && user.fraction === this.fraction) return true;
        if (this.family && user.familyId === this.family) return true;

        return false;
    }
    haveAccessToChestEdit(player: PlayerMp){
        const user = player.user;
        if (!user) return false;
        if (user.hasPermission('admin:chest:accessEdit')) return true;
        if (this.fraction && user.fraction !== this.fraction) return false;
        if (this.fraction && user.hasPermission('fraction:chest:accessEdit')) return true;
        if (this.family && (user.getFamilyRank().isOwner || user.getFamilyRank().isSoOwner)) return true;
        
        return false;
    }
    setItemRank(item_id: number, rank: number){
        if (!item_id) return;
        if (!rank) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) items[target][2] = rank
        this.items = items;
    }
    addItem(item_id: number, amount: number = 1){
        if (!item_id) return;
        if (!amount) return;
        const currentSize = this.currentSize;
        if(this.size < (currentSize + (getItemWeight(item_id) * amount))) return false
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) items[target][1] = items[target][1] + amount;
        else items.push([item_id, amount, this.fraction ? fractionCfg.getLeaderRank(this.fraction) : Family.getByID(this.family).ranks.find(r => r.isOwner).id]);
        this.items = items;
        
        return true;
    }
    removeItem(item_id: number, amount: number = 1){
        if (!item_id) return;
        if (!amount) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) items[target][1] = items[target][1] - amount;
        this.items = items;
    }
    haveItem(item_id: number){
        if (!item_id) return false;
        const itm = this.items.find(q => q[0] === item_id)
        return itm ? itm[1] : 0;
    }
    canTakeItem(player: PlayerMp, item_id: number, notify = false){
        const user = player.user;
        if (!user) return;
        if (!this.haveAccessToChest(player)){
            if(notify) player.notify("У вас нет доступа к данному складу", "error");
            return false
        }
        if (!this.haveItem(item_id)) {
            if (notify) player.notify("Предмет закончился на складе", "error");
            return false
        }
        if (!user.canTakeItem(item_id)) {
            if (notify) player.notify("У вас нет места в инвентаре", "error");
            return false
        }
        if (!user.hasPermission("admin:chest:access")) {
            const itemcfg = this.items.find(q => q[0] === item_id);
            if (!itemcfg){
                if (notify) player.notify("Такого предмета нет на складе", "error");
                return false
            }
            if(itemcfg[2] > this.getPlayerRankId(player)){
                if (notify) player.notify("У вас нет доступа к этому предмету", "error");
                return false
            }
            const limit = this.limits.find(q => q[0] === this.getPlayerRankId(player));
            if (!limit) {
                if (notify) player.notify("Ваш ранг не прописан в настройках склада", "error");
                return false
            }
            const [rank, item, total] = limit;
            if (!this.takedByItems.has(`${user.id}_${item_id}`)) this.takedByItems.set(`${user.id}_${item_id}`, 0)
            if (!this.takedTotal.has(user.id)) this.takedTotal.set(user.id, 0);
            if (!item) {
                if (notify) player.notify("У вашего ранга нет доступа чтобы брать этот предмет", "error");
                return false
            }
            if (!total) {
                if (notify) player.notify("У вашего ранга нет доступа чтобы брать любой предмет со склада", "error");
                return false
            }
            if (item <= this.takedByItems.get(`${user.id}_${item_id}`)) {
                if (notify)  player.notify("Вы уже взяли слишком много этого предмета", "error");
                return false
            }
            if (total <= this.takedTotal.get(user.id)) {
                if (notify) player.notify("Вы уже взяли слишком много предметов со склада", "error");
                return false
            }

        }
        return true
    }
    getPlayerRankId(player: PlayerMp): number {
        if (!player.user) return;
        if (this.family) return player.user.family.ranks.findIndex(r => r.id == player.user.familyRank) + 1;
        else return player.user.rank;
    }
    giveItem(player: PlayerMp, item_id: number) {
        const user = player.user;
        if (!user) return;
        if(!this.canTakeItem(player, item_id, true)) return;
        this.removeItem(item_id)

        const itemParams: Partial<ItemEntity> = {
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: user.id,
            item_id: item_id,
            serial: this.prefix + "_" + this.id + "_" + user.id + "_" + system.timestamp
        };

        if (item_id === ARMOR_ITEM_ID) {
            let armorName = (this.fraction)
                ? fractionCfg.getFraction(this.fraction).armorName
                : ArmorNames.StandardArmor;

            let isGov = fractionCfg.getFraction(this.fraction)?.gos;

            const dressConfig = dress.data.find(dressEntity => dressEntity.name === armorName);
            itemParams.count = isGov ? 100 : 50;
            itemParams.serial = dressConfig.name;
            itemParams.advancedNumber = dressConfig.id;
        }

        inventory.createItem(itemParams);
        this.takedTotal.set(user.id, this.takedTotal.get(user.id) + 1)
        this.takedByItems.set(`${user.id}_${item_id}`, this.takedByItems.get(`${user.id}_${item_id}`) + 1)
        player.notify("Предмет получен", "success");
        user.log('fractionChest', `Взял со склада #${this.id} ${this.name} ${getBaseItemNameById(item_id)}`)
        Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, `Взял со склада ${getBaseItemNameById(item_id)}`)
        this.open(player);
    }
    itemsEdit(player: PlayerMp){
        if (!this.haveAccessToChestEdit(player)) return player.notify("У вас нет доступа к редактированию предметов", "error");
        const m = menu.new(player, "", "Каталог предметов")
        m.sprite = "shopui_title_gr_gunmod";
        
        this.items.map(item => {
            m.newItem({
                name: getBaseItemNameById(item[0]),
                icon: `Item_${item[0]}`,
                more: `x${item[1]}`,
                desc: `Минимальный ранг: ${item[2]}`,
                onpress: () => {
                    const submenu = menu.new(player, "", getBaseItemNameById(item[0]));
                    submenu.onclose = () => {
                        this.itemsEdit(player)
                    }
                    submenu.newItem({
                        name: 'Ранг',
                        type: 'list',
                        list: this.fraction ? fractionCfg.getFractionRanks(this.fraction) : Family.getByID(this.family).ranks.map(rank => rank.name),
                        listSelected: item[2] - 1,
                        onchange: (val) => {
                            const items = [...this.items];
                            items.find(q => q[0] === item[0])[2] = val + 1
                            this.items = items;
                        }
                    })

                    if (player.user.hasPermission('admin:chest:accessEdit')){
                        submenu.newItem({
                            name: 'Количество',
                            type: 'range',
                            rangeselect: [0, 1500],
                            listSelected: item[1],
                            onpress: () => {
                              menu.input(player, "Введите количество", item[1], 5, 'int').then(val => {
                                  if(typeof val !== "number") return;
                                  if(val < 0) return;
                                  const items = [...this.items];
                                  items.find(q => q[0] === item[0])[1] = val || 0;
                                  this.items = items;
                                  this.itemsEdit(player)
                              })
                            },
                            onchange: (val) => {
                                const items = [...this.items];
                                items.find(q => q[0] === item[0])[1] = val + 1
                                this.items = items;
                            }
                        })
                        submenu.newItem({
                            name: 'Удалить предмет',
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if (!status) return this.itemsEdit(player);
                                    const items = [...this.items];
                                    const index = items.findIndex(q => q[0] === item[0])
                                    items.splice(index, 1)
                                    this.items = items;
                                    this.itemsEdit(player);
                                })
                            }
                        })
                    }

                    submenu.open();
                }
            })  
        })

        if (player.user.hasPermission('admin:chest:accessEdit')) {
            m.newItem({
                name: "Новый предмет",
                onpress: () => {
                    menu.selectItem(player).then(itemid => {
                        if (!itemid) return this.itemsEdit(player);
                        this.addItem(itemid, 10);
                        player.notify("Предмет успешно добавлен", "success");
                        this.itemsEdit(player);
                    })
                }
            })
        }
        
        m.open();
    }
    ranksEdit(player: PlayerMp){
        if (!this.haveAccessToChestEdit(player)) return player.notify("У вас нет доступа к редактированию рангов", "error");
        const submenu = menu.new(player, "", "Лимиты по рангам")
        submenu.sprite = "shopui_title_gr_gunmod";
        submenu.newItem({
            name: "Ранг / Лимит на 1 предмет / Лимит на все предметы",
            desc: "Данные обновляются каждые 10 минут, то есть если человек например взял 2 аптечки, то через 10 минут будет считатся что он взял одну аптечку. Лимит на 1 предмет - этот лимит учитывается на каждую единицу каталога отдельно. Лимит на все предметы~w~ - это общий лимит, не позволяющий брать больше чем указано учитывая все предметы склада, которые были взяты"
        })
        this.limits.map(([rankid, item, total], index) => {
            submenu.newItem({
                name: this.fraction ? fractionCfg.getRankName(this.fraction, rankid) : Family.getByID(this.family).ranks[rankid]?.name ?? 'Ошибка',
                more: `${item} / ${total}`,
                onpress: () => {
                    const submenu2 = menu.new(player, "", "Лимиты по рангам")
                    submenu2.sprite = "shopui_title_gr_gunmod";
                    submenu2.newItem({
                        name: "Лимит на 1 предмет",
                        type: "range",
                        rangeselect: [0, 1000],
                        listSelected: item,
                        onchange: (val) => {
                            item = val;
                        }
                    })
                    submenu2.newItem({
                        name: "Лимит на все предметы",
                        type: "range",
                        rangeselect: [0, 1000],
                        listSelected: total,
                        onchange: (val) => {
                            total = val;
                        }
                    })
                    submenu2.newItem({
                        name: "Сохранить",
                        onpress: (val) => {
                            const limits = [...this.limits];
                            limits[index][1] = item;
                            limits[index][2] = total;
                            this.limits = limits;
                            player.notify("Настройки успешно сохранены", "success");
                            this.menu(player);
                        }
                    })

                    submenu2.open();
                }
            })
        })
        submenu.open();
    }
    menu(player: PlayerMp){
        if (!this.haveAccessToChest(player)) return player.notify("У вас нет доступа к данному складу", "error");
        
        let veh: VehicleMp = null;
        if (this.family) {
            const house = Family.getByID(this.family).house;
            veh = User.getNearestVehicleByCoord({ x: house.car_x, y: house.car_y, z: house.car_z }, 40);

            if (veh && veh.fraction) {
                veh = null;
                player.notify('Фракционная машина, находящаяся рядом с гаражом мешает определить возможную машину с грузом', 'warning');
            }
        }
        else if (this.fraction) veh = User.getNearestVehicle(player, 40);
        if (veh) {
            if (!veh.fractionOrder) veh = null;
        }

        // if (!veh && !this.haveAccessToChestEdit(player)) return this.open(player);
        const user = player.user;
        const m = menu.new(player, "", "Управление складом");
        m.sprite = "shopui_title_gr_gunmod";

        m.newItem({
            name: "Открыть склад",
            onpress: () => {
                this.open(player);
            }
        })

        if(user.grab_item && user.grab_item.length > 0){
            m.newItem({
                name: "Выгрузить сумку c вещами на склад",
                onpress: () => {
                    if(!user.grab_item || user.grab_item.length == 0) return;
                    if(user.is_gos){
                        player.notify('Предметы утилизированы', 'success')
                    } else {
                        user.grab_item.map(q => this.addItem(q.id, q.amount))
                        player.notify('Предметы выгружены', 'success');
                        Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, `Выгрузил сумку с предметами`)
                    }
                    user.grab_item = [];
                    this.menu(player);
                }
            })
        }

        if(user.is_gos && CHEST_RECYCLING_LIST.length > 0){
            m.newItem({
                name: "Утилизация предметов",
                onpress: () => {
                    const myItems = user.inventory.filter(q => CHEST_RECYCLING_LIST.find(z => z.item_id === q.item_id))
                    if(myItems.length === 0) return player.notify('У вас нет предметов чтобы утилизировать', "error");
                    const submenu = menu.new(player, 'Утилизация предметов', "Выберите необходимый предмет");
                    submenu.sprite = "shopui_title_gr_gunmod";
                    submenu.onclose = () => {
                        this.menu(player);
                    }
                    myItems.map(item => {
                        const name = getItemName(item)
                        submenu.newItem({
                            name,
                            onpress: () => {
                                if(!user.inventory.find(q => q.id === item.id)) return player.notify('У вас больше нет этого предмета в инвентаре', 'error');
                                const cfg = inventoryShared.get(item.item_id);
                                if(!cfg) return;
                                if(cfg.default_count && cfg.default_count > 1 && item.count < cfg.default_count) return player.notify('Вы не можете утилизировать данный предмет поскольку он не полный', 'error');
                                let count = Math.floor(item.count / cfg.default_count)
                                const sum = CHEST_RECYCLING_LIST.find(z => z.item_id === cfg.item_id).price * count
                                user.addMoney(sum, false, `Утилизация ${name} x${count}`)
                                Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, `Утилизировал ${name} x${count}`)
                                inventory.deleteItem(item);
                                player.notify(`Вы утилизировали ${name} и получили за это ${sum}$`, 'success')
                            }
                        })
                    })

                    submenu.open()
                }
            })
        }

        m.newItem({
            name: "Положить предметы на склад",
            onpress: () => {
                const myItems = user.inventory.filter(q => this.items.map(s => s[0]).includes(q.item_id))
                if(myItems.length === 0) return player.notify('У вас нет предметов чтобы положить на склад', "error");
                const submenu = menu.new(player, 'Список доступных предметов', "Выберите необходимый предмет");
                submenu.sprite = "shopui_title_gr_gunmod";
                submenu.onclose = () => {
                    this.menu(player);
                }
                myItems.map(item => {
                    const name = getItemName(item)
                    submenu.newItem({
                        name,
                        onpress: () => {
                            if(!user.inventory.find(q => q.id === item.id)) return player.notify('У вас больше нет этого предмета в инвентаре', 'error');
                            const cfg = inventoryShared.get(item.item_id);
                            if(!cfg) return;

                            let count = 0;

                            if (item.item_id === ARMOR_ITEM_ID) {
                                const availableArmorName = this.fraction
                                    ? fractionCfg.getFraction(this.fraction).armorName : ArmorNames.StandardArmor;

                                if (item.serial !== availableArmorName) {
                                    return player.notify(`Вы можете положить только ${availableArmorName}`, 'error');
                                }

                                const unbrokenArmorCount = this.fraction && fractionCfg.getFraction(this.fraction).gos
                                    ? 100 : 50;

                                if (item.count < unbrokenArmorCount) {
                                    return player.notify('Вы не можете положить поломанный бронежилет');
                                }

                                count = 1;
                            }
                            else {
                                if (cfg.default_count && cfg.default_count > 1 && item.count < cfg.default_count) return player.notify('Вы не можете положить данный предмет на склад поскольку он не полный', 'error');

                                count = Math.floor(item.count / cfg.default_count)
                            }

                            this.addItem(item.item_id, count);
                            Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, `Положил на склад ${getBaseItemNameById(item.item_id)} x${count}`)
                            inventory.deleteItem(item);
                            player.notify(`Вы положили ${name} в хранилище склада`)
                        }
                    })
                })

                submenu.open()
            }
        })

        if (veh) {
            m.newItem({
                name: "Выгрузить заказ из ТС на склад",
                onpress: () => {
                    if (!mp.vehicles.exists(veh)) return player.notify("Транспорт пропал", "error");
                    if (!veh.fractionOrder) return player.notify("Разгружать больше нечего", "error");
                    if (!veh.fractionOrder.length) return player.notify("Разгружать больше нечего", "error");
                    //if (system.distanceToPos(player.position, veh.position) > 30) return player.notify("Транспорт слишком далеко", "error");
                    const driver = veh.getOccupant(0);
                    if(!driver || !mp.players.exists(driver)) return player.notify("За рулём должен быть водитель из вашей фракции", "error")
                    if (this.fraction && driver.user.fraction !== this.fraction) return player.notify("За рулём должен быть водитель из вашей фракции", "error")
                    if (this.family && driver.user.familyId !== this.family) return player.notify("За рулём должен быть водитель из вашей семьи", "error")
                    const items = [...veh.fractionOrder];
                    veh.fractionOrder = null;
                    let names: [string, number][] = []
                    items.map(([item, amount]) => {
                        const name = getBaseItemNameById(item);
                        if(!names.find(s => s[0] === name)) names.push([name, amount]);
                        if(!this.addItem(item, amount)){
                            player.notify(`Сожалеем, но ${getBaseItemNameById(item)} x${amount} было слишком много, а места в складе так мало, ну... в общем при разгрузке всё сломали`, "error");
                        }
                    })

                    Logs.new(`chest_unload_${this.id}`, `${user.name} [${user.id}]`, `${names.map(z => `${z[0]} x${z[1]}`).join(', ')}`)

                    this.save();
                    player.notify("Разгрузка успешно выполнена", "success");
                }
            })
        }

        if ((this.fraction && user.rank >= 9) || (this.family && user.familyRank >= 3)) {
            m.newItem({
                name: "Последние записи склада",
                onpress: () => {
                    Logs.open(player, `chest_${this.id}`, 'Склад')
                }
            })
        }

        if (!this.haveAccessToChestEdit(player)) return m.open();

        m.newItem({
            name: "Настройка лимитов",
            desc: "Настройки данного раздела отвечают за то, сколько 1 человек может брать предметов со склада",
            onpress: () => {
                this.ranksEdit(player);
            }
        })
        m.newItem({
            name: "Настройка предметов",
            desc: 'В данном разделе вы можете настроить минимальный ранг доступа к предметам со склада' + (user.hasPermission('admin:chest:accessEdit') ? '\n~r~У вас есть доступ к полному редактированию предметов склада' : ''),
            onpress: () => {
                this.itemsEdit(player);
            }
        })
        m.newItem({
            name: "Открыть/Закрыть склад",
            desc: 'Вы можете временно закрыть доступ к складу, чтобы никто кроме тех, кто может им управлять не мог брать из него вещи',
            more: `${this.closed ? '~r~Закрыт' : '~g~Открыт'}`,
            onpress: () => {
                this.closed = !this.closed;
                player.notify(`Склад ${this.closed ? 'Закрыт' : 'Открыт'}`, "error");
                this.menu(player);
            }
        })
        m.newItem({
            name: (this.currentSize < this.size ? '~g~' : '~r~')+"Вместительность",
            more: `${system.numberFormat(this.currentSize / 1000)} / ${system.numberFormat(this.size / 1000)} кг`,
            onpress: () => {
                if (!user.hasPermission('admin:chest:accessEdit')) return;
                menu.input(player, "Введите значение", this.size / 1000, 9, 'int').then(size => {
                    if (!size) return;
                    this.size = size * 1000
                    player.notify("Значение обновлено", "success");
                    this.menu(player);
                })
            }
        })

        if (user.hasPermission('admin:chest:accessEdit')){
            m.newItem({
                name: "~r~Админ раздел управления складом",
                desc: 'Это не кликабельный пункт',
                onpress: () => {
                    player.notify("Это такая шутка? Чёрным по белому написано, это не кликабельно, а в качестве наказания этот алерт провисит минуту", "error", null, 60000);
                }
            })
            m.newItem({
                name: "Название",
                more: this.name,
                onpress: () => {
                    menu.input(player, "Введите название", this.name).then(name => {
                        if(!name) return;
                        this.name = name
                        player.notify("Название обновлено", "success");
                        this.menu(player);
                    })
                }
            })
            
            m.newItem({
                name: "Префикс",
                more: this.prefix,
                desc: "Этот префикс дописывается к серийным номерам оружия и прочего, что имеет серийный номер. На уже взятом оружии префикс не обновится. ~r~!!! Только латыница",
                onpress: () => {
                    menu.input(player, "Введите префикс", this.prefix, 6).then(prefix => {
                        if (!prefix) return;
                        this.prefix = prefix
                        player.notify("Префикс обновлён", "success");
                        this.menu(player);
                    })
                }
            })
            if (user.hasPermission('admin:chest:accessRemote') && system.distanceToPos(player.position, this.pos) > 1 || this.dimension != player.dimension){
                m.newItem({
                    name: "Переместить на моё местоположение",
                    onpress: () => {
                        menu.accept(player, "Вы уверены?").then(status => {
                            if(!status) return;
                            const d = player.dimension;
                            this.pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
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
            }
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
        }
        m.open()
    }
    open(player: PlayerMp){
        if (!this.haveAccessToChest(player)) return player.notify("У вас нет доступа к данному складу", "error");
        if (!this.haveAccessToChestEdit(player) && this.closed) return player.notify("Склад временно закрыт", "error");

        CustomEvent.triggerClient(player, "chest:open", this.id, this.name, this.items.map(item => {
            return {
                id: item[0],
                amount: item[1],
                canTake: this.canTakeItem(player, item[0], true)
            }
        }))

    }
    delete(){
        if (this.label) this.label.destroy();
        if (this.colshape) this.colshape.destroy();
        if (this.blip) this.blip.destroy();
        this.data.remove()
        fractionChest.list.delete(this.id);
    }
    static delete(id: number){
        const item = this.get(id);
        if(item) item.delete();
    }
    static saveAll(){
        this.list.forEach(item => {
            item.save();
        })
    }
}


const createChest = (player: PlayerMp, data?: FractionChestEntity) => {
    menu.input(player, "Введите название", data ? data.name : "").then(name => {
        if (!name) return openChestAdmin(player);
        menu.input(player, "Введите префикс", data ? data.prefix : "", 6).then(prefix => {
            if (!prefix) return openChestAdmin(player);
            const m = menu.new(player, "Создание склада");
            
            m.newItem({
                name: 'Для фракции',
                onpress: () => {
                    menu.selectFraction(player, 'all', data ? data.fraction : 0).then(fraction => {
                        if (!fraction) return openChestAdmin(player);
                        fractionChest.create(name, prefix, fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.dimension);
                        player.notify("Склад успешно создан", "success");
                        setTimeout(() => {
                            if (mp.players.exists(player)) openChestAdmin(player)
                        }, 500)
                    }).catch(err => {
                        system.debug.error(`Создание склада фракции`, err);
                        if (!mp.players.exists(player)) return;
                        player.notify("Возникла ошибка")
                    })
                }
            })
            m.newItem({
                name: 'Для семьи',
                onpress: () => {
                    menu.selectFamily(player).then(familyId => {
                        if (!familyId) return openChestAdmin(player);
                        fractionChest.createForFamily(name, prefix, familyId, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.dimension);
                        player.notify("Склад успешно создан", "success");
                        setTimeout(() => {
                            if (mp.players.exists(player)) openChestAdmin(player)
                        }, 500)
                    }).catch(err => {
                        system.debug.error(`Создание склада семьи`, err);
                        if (!mp.players.exists(player)) return;
                        player.notify("Возникла ошибка")
                    })
                }
            })
            m.open();
        })
    })
}

const openChestAdmin = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:chest:accessRemote')) return player.notify("~r~У вас нет доступа");
    const m = menu.new(player, "Фракционные склады", "Список");

    fractionChest.list.forEach(item => {
        m.newItem({
            name: item.name,
            more: item.fraction ? fractionCfg.getFractionName(item.fraction) : Family.getByID(item.family).name,
            onpress: () => {

                const submenu = menu.new(player, "Фракционные/Семейные склады", item.name);
                submenu.onclose = () => { openChestAdmin(player) }
                submenu.newItem({
                    name: "Открыть",
                    onpress: () => {
                        item.menu(player);
                    }
                })
                submenu.newItem({
                    name: "Клонировать",
                    onpress: () => {
                        createChest(player, item.data);
                    }
                })

                submenu.open();

            }
        })
    })

    m.newItem({
        name: '~g~Создать новый',
        desc: 'Новый склад будет создан на ваших координатах в вашем текущем измерении',
        onpress: () => {
            createChest(player)
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:chest:accessRemote', player => {
    openChestAdmin(player);
})

setInterval(() => {
    fractionChest.list.forEach(item => {
        if(!item) return;
        item.takedByItems.forEach((q, i) => {
            if (!q) return;
            item.takedByItems.set(i, q - 1);
        })
        item.takedTotal.forEach((q, i) => {
            if (!q) return;
            item.takedTotal.set(i, q - 1);
        })
        item.save();
    })
}, 60000)

CustomEvent.registerCef('chest:take', (player, id: number, item_id: number) => {
    const chest = fractionChest.get(id);
    if(chest) chest.giveItem(player, item_id);
})
