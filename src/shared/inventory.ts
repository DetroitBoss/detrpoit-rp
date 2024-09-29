import {LicenseName} from "./licence";
import {systemUtil} from "./system";
import {document_templates} from "./documents";
import {BANK_CARD_NAME_LIST} from "./economy";
import {WEAPON_ATTACH_LIST} from "./attach.system";
import {BagAttachData} from "./bag";
import {FACTION_ID} from "./fractions";

export const business_stock_level = [100000, 500000, 1000000]

export interface houseUpgradeLevelData {
    /** Стоимость дома, которая нужна для данного апгрейда */
    house: number;
    /** Стоимость данного апгрейда */
    price: number;
    /** Сколько веса в КГ даёт данный апгрейд к базовому */
    amount: number;
}


/** Базовая вместительность хранилища в доме в КГ */
export const HOUSE_DEFAULT_WEIGHT_KG = 150;

export const getItemDesc = (item_id: number) => {
    const cfg = inventoryShared.get(item_id)
    if(!cfg) return null;
    let text = ``;
    let cfgWeapon = ITEM_TYPE.WEAPON == cfg.type ? inventoryShared.getWeaponConfigByItemId(cfg.item_id) : null
    if([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON].includes(cfg.type)) text += `Калибр: ${cfgWeapon.caliber}mm\n`
    if(cfg.type == ITEM_TYPE.AMMO_BOX) text += `Количество патронов: ${cfg.default_count} шт\n`
    if(cfg.type == ITEM_TYPE.WEAPON_MAGAZINE) text += `Вместительность: ${cfg.default_count} шт\n`

    if(cfg.type === ITEM_TYPE.WEAPON_ADDON){
        const list: string[] = [];
        weapon_list.filter(q => q.addons).map(q => {
            for(let type in q.addons){
                const data: WeaponAddonsItemBase = (q.addons as any)[type]
                if(data){
                    if(data.item_id === cfg.item_id) list.push(inventoryShared.get(q.weapon).name)
                }
            }
        })
        if(list.length > 0){
            text += `Совместимое оружие: ${list.join(', ')}\n`
        }
    }
    if(cfg.type === ITEM_TYPE.WEAPON){
        const weapon = inventoryShared.getWeaponConfigByItemId(cfg.item_id);
        if(weapon && weapon.addons){
            const list: string[] = [];
            for(let type in weapon.addons){
                const data: WeaponAddonsItemBase = (weapon.addons as any)[type]
                if (data.hash.includes('WEAPON_TINT')) 
                    continue
                if(data){
                    const itm = inventoryShared.get(data.item_id)
                    if(itm) list.push(itm.name)
                }
            }
            if(list.length > 0){
                text += `Совместимые модификации: ${list.join(', ')}\n`
            }
        }



    } else {
        const container = getContainerByItemID(cfg.item_id)
        if(container){
            text += `Вместимость: ${(container.max_size / 1000).toFixed(1)} кг\n`
        }
    }

    if(cfg.desc) text += `${cfg.desc}\n`;

    return text
}

/** Объём инвентаря игрока в КГ */
export const PLAYER_DEFAULT_WEIGHT_KG = 40;
/** Сколько максимум уровней может быть у расширеного инвентаря */
export const PLAYER_INVENTORY_MAX_LEVEL = 4;
/** Сколько КГ даётся за уровень */
export const PLAYER_INVENTORY_KG_PER_LEVEL = 5;

export interface InventoryWeaponPlayerData {
    item_id: number,
    id: number,
    // caliber: WEAPON_CALIBER,
    ammo: number,
    // name: string,
    serial: string,
    max_ammo: number,
    unloaded?: boolean;
}

export const enum OWNER_TYPES {
    /** Мир */
    WORLD = 0,
    /** Игрок */
    PLAYER = 1,
    /** Временное хранилище игрока, в него слетают его вещи во время мероприятий, где нужен голый инвентарь */
    PLAYER_TEMP = 1111,
    /** ТС */
    VEHICLE = 2,
    /** ТС заспавненое, то есть предмет будет удалён */
    VEHICLE_TEMP = 1000,
    /** Дом */
    HOUSE = 3,
    /** Склад хранилища 1 */
    STOCK_1 = 4,
    /** Склад хранилища 2 */
    STOCK_2 = 5,
    /** Склад хранилища 3 */
    STOCK_3 = 6,
    /** Склад хранилища 4 */
    STOCK_4 = 7,
    /** Склад хранилища 5 */
    STOCK_5 = 8,
    /** Склад хранилища 6 */
    STOCK_6 = 9,
    /** Склад хранилища 7 */
    STOCK_7 = 10,
    /** Склад хранилища 8 */
    STOCK_8 = 11,
    /** Склад хранилища 9 */
    STOCK_9 = 12,
    /** Склад хранилища 10 */
    STOCK_10 = 13,
    /** Склад хранилища 11 */
    STOCK_11 = 14,
    /** Склад хранилища 12 */
    STOCK_12 = 15,
    /** Склад хранилища 13 */
    STOCK_13 = 16,
    /** Склад хранилища 14 */
    STOCK_14 = 17,
    /** Склад хранилища 15 */
    STOCK_15 = 18,
    /** Склад дома с кодовым замком */
    STOCK_SAFE = 19,
    /** Временное хранилище */
    BUSINESS = 100,
    /** Фракционный ТС */
    FRACTION_VEHICLE = 20,
    /** Бумажник */
    WALLET = 21,
    /**Сумка для предметов */
    BAG = 22,
    /**Модификации оружия */
    WEAPON_MODS = 23,
    /** Майнинг ферма */
    MINING_FARM = 25,
    /** Меню обмена */
    EXCHANGE_MENU = 600,
    /** Хранилище внутри GANGWAR режима */
    GANGWAR_CONTAINER = 997,
    /** Временное хранилище */
    TEMP = 999,
    /** Хоткей ( для драг-дропа) */
    HOTKEY = 9998,
    /** Оружие ( для драг-дропа) */
    WEAPON = 9997,
    /** Одежда ( для драг-дропа) */
    CLOTHES = 9996,
    /** Склад рынка */
    MARKET_STOCK = 500,
    /** Склад рынка */
    FARM_STOCK = 501,
    BP_STORAGE = 502,
    DONATE_STORAGE = 503,
    /** Сумки и рюкзаки  */
    BAG1 = 15000,
    BAG2 = 15001,
    BAG3 = 15002,
    BAG4 = 15003,
    BAG5 = 15004,
    BAG6 = 15005,
    BAG7 = 15006,
    BAG8 = 15007,
    BAG9 = 15008,
    BAG10 = 15010,
    BAG11 = 15011,
    BAG12 = 15012,
    BAG13 = 15013,
    BAG14 = 15014,
    BAG15 = 15015,
    BAG16 = 15016,
    BAG17 = 15017,
    BAG18 = 15018,
    BAG19 = 15019,
    BAG20 = 15020,
    BAG21 = 15021,
    BAG22 = 15023,
    BAG23 = 15024,
    BAG24 = 15025,
    BAG25 = 15026,
    BAG26 = 15027,
    BAG27 = 15028,
    BAG28 = 15029,
    BAG29 = 15030,
    BAG30 = 15031,
    BAG31 = 15032,
    BAG32 = 15033,
    BAG33 = 15034,
    BAG34 = 15035,
    BAG35 = 15036,
    BAG36 = 15037,
    BAG37 = 15038,
    BAG38 = 15039,
    BAG39 = 15040,
    BAG40 = 15041,
    BAG41 = 15042,
    BAG42 = 15043,
    BAG43 = 15044,
    BAG44 = 15045,
    BAG45 = 15046,
    BAG46 = 15047,
    BAG47 = 15048,
    BAG48 = 15049,
    BAG49 = 15050,
    BAG50 = 15051,
    BAG51 = 15052,
    BAG53 = 15053,
    BAG54 = 15053,
    BAG55 = 15053,
    BAG56 = 15053,
    BAG57 = 15054,
    BAG58 = 15055,
    BAG59 = 15056,
    BAG60 = 15057,
    BAG61 = 15058,
    BAG62 = 15059,
    BAG63 = 15060,
    BAG64 = 15061,
    BAG65 = 15062,
    BAG66 = 15063,
    BAG67 = 15064,
    BAG68 = 15065,
    BAG69 = 15066,
    BAG70 = 15067,
    BAG71 = 15068,
    BAG72 = 15069,
    BAG73 = 15070,
    BAG74 = 15071,
    BAG75 = 15072,
    BAG76 = 15073,
    BAG77 = 15074,
    BAG78 = 15075,
    BAG79 = 15076,
    BAG80 = 15077,
    BAG81 = 15078,
    BAG82 = 15079,
    BAG83 = 15080,
    BAG84 = 15081,
    BAG85 = 15082,
    BAG86 = 15083,
    BAG87 = 15084,
    BAG88 = 15085,
    BAG89 = 15086,
    BAG90 = 15087,
    BAG91 = 15088,
    BAG92 = 15089,
    BAG93 = 15090,
    BAG94 = 15091,
    BAG95 = 15092,
    BAG96 = 15093,
    BAG97 = 15094,
    BAG98 = 15095,
    BAG99 = 15096,
    BAG100 = 15097,
    BAG101 = 15098,
    // сюда новые
    BAG_102 = 19999,
    BAG_103 = 20000,
    BAG_104 = 20001,
    BAG_105 = 20002,
    BAG_106 = 20003,
    BAG_107 = 20004,
    BAG_108 = 20005,
    BAG_109 = 20006,
    BAG_110 = 20007,
    BAG_111 = 20008,
    BAG_112 = 20009,
    BAG_113 = 20010,
    BAG_114 = 20011,
    BAG_115 = 20012,
    BAG_116 = 20013,
    BAG_117 = 20014,
    BAG_118 = 20015,
    BAG_119 = 20016,
    BAG_120 = 20017,
    BAG_121 = 20018,
    BAG_122 = 20019,
    BAG_123 = 20020,
    BAG_124 = 20021,
    BAG_125 = 20022,
    BAG_126 = 20023,
    BAG_127 = 20024,
    BAG_128 = 20025,
    BAG_129 = 20026,
    BAG_130 = 20027,
    BAG_131 = 20028,
    BAG_132 = 20029,
    BAG_133 = 20030,
    BAG_134 = 20031,
    BAG_135 = 20032,
    BAG_136 = 20033,
    BAG_137 = 20034,
    BAG_138 = 20035,
    BAG_139 = 20036,
    BAG_140 = 20038,
    BAG_141 = 20039,
    BAG_142 = 20040,
    BAG_143 = 20041,
    BAG_144 = 20042,
    BAG_145 = 20043,
    BAG_146 = 20044,
    BAG_147 = 20045,
    BAG_148 = 20046,
    BAG_149 = 20047,
    BAG_150 = 20048,
    BAG_151 = 20049,
    BAG_152 = 20050,
    BAG_153 = 20051,
    BAG_154 = 20052,
    BAG_155 = 20053,
}


export const getContainerByOwnerType = (owner_type: OWNER_TYPES) => {
    return CONTAINERS_DATA.find(q => q.owner_type === owner_type)
}
export const getContainerByItemID = (item_id: number) => {
    return CONTAINERS_DATA.find(q => q.item_id === item_id)
}

/**
 * Список параметров: 
 * @arg {number} ID {number}
 * @arg {number} ITEM_ID {number}
 * @arg {number} COUNT {number}
 * @arg {string} SERIAL {number}
 * @arg {string} EXTRA {string}
 */
export type InventoryItemCef = [number, number, number, string, string];

export const MAXIMUM_ITEMS_IN_ONE_EXCHANGE = 20;

export interface ExchangeData {
    myData: ExchangePlayerData;
    targetData: ExchangePlayerData;
}

export interface ExchangePlayerData {
    /** Имя игрока, с которым совершается обмен */
    playerName: string;
    /** Деньги, участвующие в обмене */
    money: number;
    /** Предметы, участвующие в обмене */
    items: InventoryItemCef[];
    /** Статус готовности к обмену */
    readyStatus: ExchangeReadyStatus;
}

export enum ExchangeReadyStatus {
    NOT_READY,
    READY,
    CONFIRMED,
}

export interface InventoryDataCef {
    /** Название */
    name: string;
    /** Описание */
    desc: string;
    /** ИД */
    owner_id: number;
    /** Тип */
    owner_type: OWNER_TYPES;
    /** Максимальный вес */
    weight_max: number;
    /** Доступ закрыт */
    closed?: boolean;
    /** Вещи */
    items: InventoryItemCef[];
    /** Показать динамический инвентарь */
    show?:boolean;
    /** Позиция для отображения */
    left?:number;
    /** Позиция для отображения */
    top?:number;
    /** Для драг-дропа */
    drag?:{x:number, y:number}
}

export interface InventoryChoiseItemData {
    item: InventoryItemCefObject;
    task: string;
    owner_type: number;
    owner_id: number;
    target_id?: number;
    target_type?: number;
}

/** Список типов всех предметов */
export const enum ITEM_TYPE {
    /** Вода */
    WATER = 0,
    /** Еда */
    FOOD = 1,
    /** Оружие */
    WEAPON = 2,
    /** Коробка с патронами */
    AMMO_BOX = 3,
    /** Магазин/Обойма для оружия */
    WEAPON_MAGAZINE = 4,
    /** Наркотики */
    DRUG = 5,
    /** Системные предметы (Документы, ключи и прочее) */
    SYSTEM = 6,
    // Медикаменты
    MEDICATION = 7,
    // Донатные предметы
    DONAT = 8,
    // Одежда
    CLOTH = 9,
    // Алкоголь
    ALCO = 10,
    // Прочее
    OTHER = 11,
    /** Модификации оружия */
    WEAPON_ADDON = 12,
    /**Сумки и рюкзаки */
    BAGS = 13,
    /** Компоненты майнинга */
    MINING = 14,
    // Зелья
    POTION = 15,
    // Животные
    ANIMAL = 16,
    // Курительные принадлежности
    SMOKING = 17
}

export const ITEM_TYPE_ARRAY = ["Напитки", "Еда", "Оружие", "Коробка патронов", "Оружейный магазин", "Наркотики", "Системные", "Медикаменты", "Донат вещи", "Одежда", "Алкоголь", "Прочее", "Модификации оружия", "Сумки и рюкзаки", "Компоненты майнинга", "Зелья", "Животные"]

export interface InventoryItemCefObject {
    id: number;
    item_id: number;
    count: number;
    serial: string;
    extra: string;
    desc?: string;
}

/** Конвертор читаемого объёкта предмета в короткий массив */
export const convertInventoryItemObjectToArray = (item: InventoryItemCefObject): InventoryItemCef => {
    return [item.id, item.item_id, item.count, item.serial, item.extra]
}

/** Конвертор короткого массива в читаемый объёкт */
export const convertInventoryItemArrayToObject = (item: InventoryItemCef): InventoryItemCefObject => {
    const cfg = inventoryShared.get(item[1]);
    return {
        id: item[0],
        item_id: item[1],
        count: item[2],
        serial: item[3],
        extra: item[4],
        desc: cfg.desc,
    }
}

export const ELECTRO_SHOP_ITEMS:number[] = []

export const getItemName = (item: InventoryItemCefObject) => {
    let name = getBaseItemNameById(item.item_id);
    if (item.serial){
        let cfg = inventoryShared.get(item.item_id);
        if(cfg){
            if ([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON].includes(cfg.type) || item.item_id == 800){
                name += ` (#${item.serial})`
            }
            if (item.item_id == 805){
                name += ` ${item.serial}`;
            }
            if (item.item_id == 851){
                const q = item.serial.split('_');
                if(q.length > 0){
                    name += ` #${q[q.length - 1]}`;
                }
            }
            if (item.item_id == 803){
                const q = item.serial.split('-');
                if(q.length === 5){
                    name += ` на ${(LicenseName as any)[q[0]]} ${parseInt(q[3]) < systemUtil.timestamp ? ' (Просрочена)' : ''}`;
                }
            }
            if (item.item_id == 802){
                const q = item.serial.split('|');
                if(q.length === 10){
                    const doc = document_templates.find(s => s.id === q[0])
                    name += ` ${doc.typeShort}`;
                }
            }
            if (item.item_id == 801){
                // let bank_number = (`${item.sub_type + 1}_${item.id}_${tarif}_${system.getRandomInt(1000000, 9999999)}`)
                if (!item.extra){
                    name += " (Заблокирована)"
                } else {
                    const [sub_type, id, tarifid, rand] = item.serial.split('A');
                    name += ` (${BANK_CARD_NAME_LIST[parseInt(tarifid)] || "Debit"})`
                }
            }
            if(cfg.type == ITEM_TYPE.CLOTH){
                name += ` (${item.serial})`
            }
        }
    }
    return name
}
export const getBaseItemNameById = (item_id: number) => {
    let cfg = inventoryShared.get(item_id);
    if (!cfg) return "Безымянный"
    return cfg.name;
}

export const canUse = (item_id: number) => {
    let cfg = inventoryShared.get(item_id);
    if (!cfg) return false
    return !!cfg.use
}

export interface InventoryEquipList {
    bracelet: number,
    watch: number,
    ear: number,
    glasses: number,
    hat: number,
    accessorie: number,
    accessorie2: number,
    foot: number,
    leg: number,
    torso: number,
    mask: number,
    armor: number,
    gloves: number,
}

export interface itemConfig {
    /** ID предмета */
    item_id: number;
    /** Название предмета */
    name: string;
    /** Тип предмета */
    type: ITEM_TYPE,
    /** Должен ли предмет группироваться с подобными */
    need_group?: boolean;
    /** Вес одной единици */
    weight: number;
    /** Дополнительный вес по умолчанию
     * @example Вес самой бутылки с водой */
    base_weight?: number;
    /** Название пропа, когда лежит на земле */
    prop: string;
    /** Уникальные настройки атача пропа для проигрывания анимации держания в руке. Данные получаются через специальную систему */
    propAttachParam?: [number, number, number, number, number, number];
    /** Запас по умолчанию */
    default_count: number;
    /** Можно ли использовать предмет */
    use?: boolean;
    /** Сколько единиц потратить при использовании
     * @default ALL
     */
    count_use?: number;
    /** Предмет с данным флагом нельзя будет отобрать у другого игрока */
    protect?:boolean;
    /** Базовая стоимость товара для заказа владельцем бизнеса, для продажи продукции на склад и в других подобных моментах. Если 0 - заказать нельзя */
    defaultCost?: number;
    /** Множитель параметра количества наркотиков. Когда будет использоватся 1 единица наркотика - значение будет исходя из drugMultiple. Лечение игрока будет происходит по формуле drugMultiple * 0.3 */
    drugMultiple?: number;
    /** Количество ХП восстанавливаемое с определныым периодом времени */
    drugHeal?: number;
    /** Описание предмета */
    desc?: string;
    /** Текст уведомления при первом появлении предмета в инвентаре. Чтобы уведомление появилось нужно указать и описание и иконку */
    helpDesc?: string;
    /** Иконка уведомления при первом появлении предмета в инвентаре. В папке /src/shared/SuccessInfo без .png Чтобы уведомление появилось нужно указать и описание и иконку */
    helpIcon?: string;
    /** Предмет можно разделить */
    canSplit?:boolean;
    /** Предмет может поднять только член фракции из массива  */
    canFactionsTake?:FACTION_ID[];
    /** Данный предмет нельзя будет переместить из изначально выданого инвентаря */
    blockMove?:true,
    attachBody?:keyof typeof WEAPON_ATTACH_LIST,
    /** Если указать этот параметр и включить параметр use - то будет лечить на указанное количество ХП*/
    healUse?:number,
    /** Этот предмет можно взять в руки (цветы и прочее)
     * <p color='red'>ОБЯЗАТЕЛЬНО УКАЖИТЕ ПАРАМЕТР <b>propAttachParam</b></p> */
    inHand?: boolean,
    /** Параметр для продуктов, который указывает через сколько дней продукт будет считаться испорченым после создания (покупки в магазине, крафта и т.д.). Если не указать - то будет параметр по умолчанию <b>POISONING_DAYS</b>*/
    poisoning?:number,
    /** Флаг, запрещающий использовать предмет через хоткей */
    blockHotkey?: boolean,
    /** Нелегальный */
    isIllegal?: boolean,
}

/** Получить вес предмета исходя из количества */
export const getItemWeight = (
    /** Либо ID предмета, либо сам конфиг */
    item: number | itemConfig,
    /** Параметр количества предмета */
    count?: number,
    /** Если необходимо - вернём в КГ, то есть поделим на тысячу */
    returnKg = false
) => {
    let cfg = inventoryShared.get(typeof item === "number" ? item : item.item_id);
    if (!cfg) return 0;
    if (typeof count !== "number") count = cfg.default_count;
    if (typeof item === "object") return item.weight * count
    if (!cfg) return 0
    let weight = cfg.weight * count;
    if (cfg.base_weight) weight += cfg.base_weight;
    if (returnKg) return weight / 1000
    return weight;
}

/** Получить вес предмета в текстовом представлении */
export const getItemWeightText = (
    /** Либо ID предмета, либо сам конфиг */
    item: number | itemConfig,
    /** Параметр количества предмета */
    count: number
) => {
    let weight = getItemWeight(item, count);
    if (weight > 1000) return `${(weight / 1000).toFixed(3)} кг`
    else return `${Math.floor(weight)} г`
}
/** Получить вес всех предметов в текстовом представлении */
export function getAllItemsWeightText(...itm: [number, number][]): string;
export function getAllItemsWeightText(...itm: [itemConfig, number][]): string;
export function getAllItemsWeightText(...itm: number[][]): string;
export function getAllItemsWeightText(...itm: [number | itemConfig, number][] | number[][]) {
    let weight = 0;
    (itm as any).map((i: any) => {
        weight += getItemWeight(i[0], i[1])
    })
    if (weight > 1000) return `${(weight / 1000).toFixed(3)} кг`
    else return `${Math.floor(weight)} г`
}


export const CUFFS_ITEM_ID = 804;
export const CUFFS_KEY_ITEM_ID = 899;
export const SCREWS_ITEM_ID = 799;
export const SCREWS_DESTROYER_ITEM_IDS = [552, 890];

export const ARMOR_ITEM_ID = 960;

/** Калибр оружия */
export type WEAPON_CALIBER = 5.45 | 5.56 | 7.62 | 12.7 | 9 | 18.5 ;

/** Параметр веса патрона каждого калибра */
export const enum WEAPON_AMMO_WEIGHT {
    /** 5.45 */
    "AK" = 10,
    /** 5.56 */
    "NATO" = 12,
    /**7.62 */
    "COMBAT" = 15,
    /**12.7 */
    "HEAVY" = 20,
    /**9mm */
    "PISTOL" = 8,
    /**18.5 */
    "SHOTGUN" = 30,
 
}

/**
 * 1-100 - Вода
 * 500-599 - Оружие (Не группировать)
 * 600-699 - Магазины (НЕ группировать)
 * 800-899 - Системные предметы (НЕ группировать)
 */
const itemsList: itemConfig[] = [
    { item_id: 99919, name: 'Хэллоуин рюкзак', type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 30, prop: 'ghostbusters_bag', default_count: 0 },

    // Вода
    { item_id: 1, name: "Бутылка воды", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_ld_flow_bottle", default_count: 500, use: true, count_use: 100, defaultCost: 90, propAttachParam: [0.120, 0.075, 0.000, 248, 0, 0], protect: true },
    { item_id: 2, name: "Банка Кока Колы", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_ecola_can", default_count: 330, use: true, defaultCost: 100, propAttachParam: [0.135, 0.020, 0.040, 247, 0, 0], protect: true  },
    { item_id: 3, name: "Банка Спрайта", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "ba_prop_club_tonic_can", default_count: 330, use: true, defaultCost: 100, propAttachParam: [0.135, -0.035, 0.060, 247, 0, 0], protect: true  },
    { item_id: 4, name: "Апельсиновая газировка", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_orang_can_01", default_count: 330, use: true, defaultCost: 100, propAttachParam: [0.135, 0.025, 0.025, 243, 0, 0], protect: true  },
    { item_id: 5, name: "Кофе", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_food_bs_coffee", default_count: 230, use: true, defaultCost: 120, propAttachParam: [0.120, -0.045, 0.070, 256, 0, 0], protect: true  },
    { item_id: 6, name: "Бутылка Тоника", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "ba_prop_club_tonic_bottle", default_count: 450, use: true, count_use: 100, defaultCost: 50, propAttachParam: [0.130, -0.095, 0.095, 240, 0, 0], protect: true  },
    { item_id: 7, name: "Энергетик", type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_energy_drink", default_count: 400, use: true, count_use: 100, defaultCost: 140, propAttachParam: [0.135, 0.040, 0.025, 241, 0, 0], protect: true  },
    { item_id: 8, name: "Чай", type: ITEM_TYPE.WATER, weight: 1, base_weight: 20, prop: "v_res_fa_pottea", default_count: 300, use: true, defaultCost: 120, propAttachParam: [0.135, 0.040, 0.025, 241, 0, 0], protect: true  },
    // Коробки патронов
    { item_id: 150, name: "Коробка патронов 5.45", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.AK, base_weight: 10, prop: "prop_ld_ammo_pack_03", default_count: 70, need_group: true, defaultCost: 1400, canSplit: true },
    { item_id: 151, name: "Коробка патронов 5.56", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.NATO, base_weight: 10, prop: "prop_ld_ammo_pack_03", default_count: 70, need_group: true, defaultCost: 1750, canSplit: true },
    { item_id: 152, name: "Коробка патронов 12.7", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.HEAVY, base_weight: 70, prop: "prop_box_ammo02a", default_count: 30, need_group: true, defaultCost: 1850, canSplit: true },
    { item_id: 153, name: "Коробка патронов 9mm", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.PISTOL, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1350, canSplit: true },
    { item_id: 154, name: "Коробка патронов 18.5", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.SHOTGUN, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1350 , canSplit: true },
    { item_id: 155, name: "Коробка патронов 7.62", type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.COMBAT, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1200, canSplit: true },
    { item_id: 156, name: "Смесь для огнетушителя", type: ITEM_TYPE.AMMO_BOX, weight: 1, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 999, need_group: true, defaultCost: 500, canSplit: false, blockMove: true },
    // Еда
    { item_id: 20, name: "Чизбургер", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 10, prop: "prop_cs_burger_01", default_count: 200, use: true, defaultCost: 250, propAttachParam: [0.155, 0.035, 0.035, 163, 29, 0], protect: true },
    { item_id: 21, name: "Чипсы", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 20, prop: "prop_food_cb_chips", default_count: 250, use: true, defaultCost: 150, propAttachParam: [0.150, -0.045, 0.030, 260, 19, 15], protect: true },
    { item_id: 22, name: "Картошка фри", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 20, prop: "prop_food_bs_chips", default_count: 200, use: true, defaultCost: 150, propAttachParam: [0.155, -0.030, 0.060, 232, 0, 0], protect: true },
    { item_id: 23, name: "Чипсы с сыром", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 10, prop: "ng_proc_food_chips01a", default_count: 200, use: true, defaultCost: 150, propAttachParam: [0.165, 0.000, 0.060, 332, 161, 0], need_group: true, protect: true },
    { item_id: 24, name: "Пицца", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 50, prop: "prop_pizza_box_01", default_count: 800, use: true, count_use: 400, defaultCost: 200, protect: true },
    { item_id: 25, name: "Банан", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 100, prop: "ng_proc_food_nana1a", default_count: 300, use: true, defaultCost: 90, propAttachParam: [0.170, 0.000, 0.000, 357, 0, 0], protect: true },
    { item_id: 26, name: "Пончики", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 50, prop: "prop_food_cb_donuts", default_count: 500, use: true, count_use: 200, defaultCost: 100, propAttachParam: [0.155, 0.015, 0.040, 281, 17, 88], protect: true  },
    { item_id: 27, name: "Нагетсы", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 30, prop: "prop_food_cb_nugets", default_count: 500, use: true, defaultCost: 200, propAttachParam: [0.155, 0.015, 0.040, 281, 17, 88], protect: true  },
    { item_id: 28, name: "Яблоко", type: ITEM_TYPE.FOOD, weight: 1, prop: "ng_proc_food_aple2a", default_count: 300, use: true, defaultCost: 90, propAttachParam: [0.120, -0.000, -0.025, 327, 0, 0], protect: true  },
    { item_id: 29, name: "Апельсин", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 100, prop: "ng_proc_food_ornge1a", default_count: 90, use: true, defaultCost: 100, propAttachParam: [0.130, 0.000, 0.000, 328, 0, 0], protect: true  },
    { item_id: 30, name: "Сухпаек", type: ITEM_TYPE.FOOD, weight: 1, base_weight: 1000, prop: "prop_food_cb_chips", default_count: 500, use: true}, // Убрать из продажи, добавить армейцам и фибам!!!!

    // Наркотики
    { item_id: 50, name: "Пакетик с амфетамином", type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 50, use: true, count_use: 1, drugMultiple: 300, drugHeal: 7, need_group: true, canSplit: true },
    { item_id: 51, name: "Пакетик с марихуанной", type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_weed_smallbag_01a", default_count: 50, use: true, count_use: 1, drugMultiple: 100, drugHeal: 6, need_group: true, canSplit: true },
    { item_id: 52, name: "Пакетик с ЛСД", type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 50, use: true, count_use: 1, drugMultiple: 350, drugHeal: 7, need_group: true, canSplit: true },
    { item_id: 53, name: "Пакетик с DMT", type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 50, use: true, count_use: 1, drugMultiple: 300, drugHeal: 6, need_group: true, canSplit: true },
    { item_id: 54, name: "Пакетик с кокаином", type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 50, use: true, count_use: 1, drugMultiple: 300, drugHeal: 10, need_group: true, canSplit: true },
    { item_id: 55, name: "Зип-лок", type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "ng_proc_drug01a002", default_count: 1, need_group: true, defaultCost: 10, canSplit: true, protect: true },
    { item_id: 56, name: "Фольга", type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "rop_a4_pile_01", default_count: 1, need_group: true, defaultCost: 5, canSplit: true, protect: true },
    { item_id: 57, name: "Лист бумаги", type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "p_a4_sheets_s", default_count: 1, need_group: true, defaultCost: 5, canSplit: true, protect: true },
    { item_id: 58, name: "Кислота", type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_drug_bottle", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим
    { item_id: 59, name: "Пропанол", type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_cs_script_bottle", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим
    { item_id: 60, name: "Лин", type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_energy_drink", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим

    // Алкоголь
    { item_id: 200, name: "Сидр", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "ng_proc_beerbottle_01a", default_count: 500, use: true, count_use: 1, defaultCost: 1200, propAttachParam: [0.135, -0.060, 0.065, 242, 0, 0], protect: true},
    { item_id: 201, name: "Крафтовое Пиво", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_amb_beer_bottle", default_count: 500, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, 0.055, 0.005, 234, 0, 0], protect: true },
    { item_id: 202, name: "Пиво Dusche", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beerdusche", default_count: 500, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.130, -0.140, 0.150, 233, 0, 0], protect: true },
    { item_id: 203, name: "Китайское Пиво", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_amopen", default_count: 500, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.125, 0.140, 234, 0, 0], protect: true },
    { item_id: 204, name: "Пиво Barracho", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_bar", default_count: 500, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.125, 0.140, 232, 0, 0], protect: true },
    { item_id: 205, name: "Пиво Blarney", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_blr", default_count: 500, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.135, 0.110, 239, 0, 0], need_group: true, protect: true },
    { item_id: 206, name: "Пиво Patriot", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_patriot", default_count: 500, use: true, count_use: 1, defaultCost: 800, protect: true },
    { item_id: 207, name: "Пиво Pride", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_pride", default_count: 500, use: true, count_use: 1, defaultCost: 800 , protect: true},
    { item_id: 208, name: "Пиво Stronz", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_stz", default_count: 500, use: true, count_use: 1, defaultCost: 800, protect: true},
    { item_id: 209, name: "Виски Richards", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "ba_prop_battle_whiskey_opaque_s", default_count: 500, use: true, count_use: 1, defaultCost: 1500, protect: true },
    { item_id: 210, name: "Бурбон The Mount", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_cs_whiskey_bottle", default_count: 500, use: true, count_use: 1, defaultCost: 1500, protect: true },
    { item_id: 211, name: "Водка", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_vodka_bottle", default_count: 500, use: true, count_use: 1, defaultCost: 1000, protect: true },
    { item_id: 212, name: "Белое полусладкое Вино", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_bot_01", default_count: 750, use: true, count_use: 1, defaultCost: 1200 , protect: true},
    { item_id: 213, name: "Белое сладкое Вино", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_bot_02", default_count: 750, use: true, count_use: 1, defaultCost: 1200, protect: true },
    { item_id: 214, name: "Красное сухое Вино", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 750, use: true, count_use: 1, defaultCost: 1200, protect: true},
    { item_id: 215, name: "Коньяк", type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_bottle_cognac", default_count: 750, use: true, count_use: 1, defaultCost: 1400, protect: true },

    // Оружие
    { item_id: 500, name: "АК-47", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7700, prop: "w_ar_assaultrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 3000},
    { item_id: 501, name: "Taurus PT92", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_pistol", default_count: 1, use: true, defaultCost: 1500, attachBody: "SHORT" },
    { item_id: 502, name: "Beretta 90Two", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_pistolmk2", default_count: 1, use: true, defaultCost: 1600, attachBody: "SHORT" },
    { item_id: 503, name: "P99", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_combatpistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 504, name: "TDI Kard", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_appistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 505, name: "Desert Eagle", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_pistol50", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 506, name: "HK P7M10", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_sns_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 507, name: "AMT Backup", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_sns_pistolmk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 508, name: "Remington 1911", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_heavypistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1200 },
    { item_id: 509, name: "FN Model 1922", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 800, prop: "w_pi_vintage_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1000 },
    { item_id: 510, name: "Contender G2", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1100, prop: "w_pi_singleshot", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 511, name: "Taurus Raging Bull", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1200, prop: "w_pi_revolver", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 512, name: "Taurus Raging Bull Mod", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1200, prop: "w_pi_revolvermk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5500 },
    { item_id: 513, name: "Colt New Service", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1300, prop: "w_pi_wep1_gun", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 514, name: "Glock 17", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_ceramic_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 515, name: "Colt Navy", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1400, prop: "w_pi_wep2_gun", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 516, name: "Mini Uzi", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_sb_microsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 6500 },
    { item_id: 517, name: "MP5A3", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 3300, prop: "w_sb_smg", default_count: 1, use: true, defaultCost: 4500, attachBody: "SHORT" },
    { item_id: 518, name: "MP5K", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1000, prop: "w_sb_smgmk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 3000 },
    { item_id: 519, name: "P-90", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1500, prop: "w_sb_assaultsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 520, name: "SIG MPX-SD", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 3200, prop: "w_sb_pdw", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 3000 },
    { item_id: 521, name: "Intratec TEC-9", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_sb_compactsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 2000 },
    { item_id: 522, name: "Scorpion", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 450, prop: "w_sb_minismg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 2000 },
    { item_id: 523, name: "Mossberg 590 A1", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_pumpshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 4500 },
    { item_id: 524, name: "Mossberg 590 A1 Mod", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_pumpshotgunmk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 525, name: "Mossberg 500", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_sawnoff", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 4000 },
    { item_id: 526, name: "UTS-15", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_assaultshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 527, name: "KSG 12", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_bullpupshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 528, name: "Land Pattern Musket", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_musket", default_count: 1, use: true, attachBody: "LONG", defaultCost: 7000 },
    { item_id: 529, name: "Сайга-12К", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_heavyshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 6000 },
    { item_id: 530, name: "Обрез", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_doublebarrel", default_count: 1, use: true, defaultCost: 3000, attachBody: "SHORT" },
    { item_id: 531, name: "Protecta", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_sweeper", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 4000 },
    { item_id: 532, name: "AK-103", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_ar_assaultriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 533, name: "HK-416", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_carbinerifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 534, name: "HK Mod", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_carbineriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 6000 },
    { item_id: 535, name: "Tavor CTar-21", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_advancedrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 7000 },
    { item_id: 536, name: "G36C", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6400, prop: "w_ar_specialcarbine", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 537, name: "G36KV", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6200, prop: "w_ar_specialcarbinemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 538, name: "QBZ-97", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_bullpuprifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 539, name: "QBZ-95", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_bullpupriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 540, name: "АКС-74У", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 4200, prop: "w_ar_assaultrifle_smg", default_count: 1, use: true, defaultCost: 5000, attachBody: "LONG" },
    { item_id: 541, name: "Печенег", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11700, prop: "w_mg_mg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 542, name: "Mk 48", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 14500, prop: "w_mg_combatmg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 70000 },
    { item_id: 543, name: "MG42", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 15000, prop: "w_mg_combatmgmk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 544, name: "Thompson M1918A1", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11000, prop: "w_sb_gusenberg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 545, name: "AWM L115A3", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11000, prop: "w_sr_sniperrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 60000 },
    { item_id: 546, name: "Barrett M82A1", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_heavysniper", default_count: 1, use: true, attachBody: "LONG" },
    { item_id: 547, name: "Винтовка для охоты", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 14000, prop: "w_sr_heavysnipermk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 548, name: "M14 EBR", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_marksmanrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 150000 },
    { item_id: 549, name: "SOCOM 16", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_marksmanriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 150000 },
    { item_id: 550, name: "Taser", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_stungun", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 551, name: "Бита", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_me_bat", default_count: 1, use: true, attachBody: "BAT" },
    { item_id: 552, name: "Охотничий нож", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 553, name: "Дубинка", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_me_nightstick", default_count: 1, use: true, attachBody: "BATON" },
    { item_id: 554, name: "РПГ феерверки", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_lr_firework", default_count: 1, use: true, attachBody: "LONG" },
    { item_id: 555, name: "Фонарик", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 500 },
    { item_id: 556, name: "Бластер", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 557, name: "Лучевой миниган", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 558, name: "Рельсовое оружие", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 559, name: "Мини гранатомет", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 560, name: "Огнетушитель", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_am_fire_exting", default_count: 1, use: true, blockMove: true  },
    { item_id: 561, name: "Розочка", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 562, name: "Ломик", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 563, name: "Строительный молоток", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 564, name: "Топорик", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 565, name: "Кастет", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 566, name: "Мачете", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 567, name: "Трубный ключ", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 568, name: "Axe топор", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 569, name: "Кий", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 570, name: "Каменный топор", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 571, name: "AUG A3", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_ar_assaultriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 572, name: "Perico pistol", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 573, name: "Клюшка", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 574, name: "Выкидной нож", type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },


     // Магазины




    // Системные предметы
    { item_id: 798, name: "Спец. пластид", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5400, prop: "ch_prop_ch_ld_bomb_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 799, name: "Стяжки", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_cuffs_01", default_count: 1, use: true, need_group: true, canSplit: true },
    { item_id: 800, name: "ID Карта", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 40, prop: "p_ld_id_card_002", default_count: 1, use: true, helpIcon: 'document', protect: true, helpDesc: 'Нажав использовать на ID карту в инвентаре вы можете посмотреть свою роспись и данные, а также показать другим игрокам' },
    { item_id: 801, name: "Банковская карта", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 40, prop: "prop_cs_credit_card", default_count: 1, use: true, helpIcon: 'card', helpDesc: 'Банковская карта используется для оплаты товаров в магазинах', protect: true },
    { item_id: 802, name: "Документ", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "ng_proc_paper_03a", default_count: 1, use: true, protect: true, },

    { item_id: 803, name: "Лицензия", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "prop_cs_documents_01", default_count: 1, use: true, protect: true, },
    { item_id: 804, name: "Наручники", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_cuffs_01", default_count: 1, need_group: true, canSplit: true },

    { item_id: 805, name: "Ключи", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cuff_keys_01", default_count: 1, use: true, protect: true, },
    { item_id: 806, name: "Полицейское ограждение", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1100, prop: "prop_barrier_work05", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 807, name: "Длинный полосатый конус", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_mp_cone_01", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB] },
    { item_id: 808, name: "Полосатый конус", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_cone_float_1", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 809, name: "Красный конус", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_mp_cone_03", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 810, name: "Длинный конус с огнями", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_air_conelight", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 811, name: "Пачка отмычек", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "p_cash_envelope_01_s", default_count: 1, use: true },
    { item_id: 813, name: "Отмычка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "gr_prop_gr_jailer_keys_01a", default_count: 1, use: true, need_group: true, canSplit: true },
    { item_id: 815, name: "Набор инструментов", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "gr_prop_gr_tool_box_01a", default_count: 1, use: true, defaultCost: 500, protect: true },
    { item_id: 816, name: "Верёвка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "prop_devin_rope_01", default_count: 1, use: true , defaultCost: 100, protect: true},
    { item_id: 817, name: "Канистра с бензином", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_ld_jerrycan_01", default_count: 15, use: true, defaultCost: 500, protect: true },
    { item_id: 818, name: "Бетонный блок", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 30000, prop: "prop_barier_conc_01a", default_count: 1, },
    { item_id: 819, name: "Лосось", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true, canSplit: true },
    { item_id: 820, name: "Фуга", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 821, name: "Камбала", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 822, name: "Осётр", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 823, name: "Кижуч", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 824, name: "Удостоверение", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, protect: true, use: true},

    { item_id: 830, name: "Мясо Кабана", type: ITEM_TYPE.SYSTEM, weight: 8500, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо кабана вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 831, name: "Мясо Койота", type: ITEM_TYPE.SYSTEM, weight: 3000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо койота вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 832, name: "Мясо Оленя", type: ITEM_TYPE.SYSTEM, weight: 10000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо оленя вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 833, name: "Мясо Курицы", type: ITEM_TYPE.SYSTEM, weight: 1000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо курицы вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 834, name: "Мясо Кролика", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо кролика вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 835, name: "Мясо Свиньи", type: ITEM_TYPE.SYSTEM, weight: 7000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо свиньи вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },
    { item_id: 836, name: "Мясо Пумы", type: ITEM_TYPE.SYSTEM, weight: 4500, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: "Мясо пумы вы можете продать одному из 2 скупщиков (желтая иконка животного на карте). У каждого скупщика своя цена. Скупщик в порту покупает больше мяса и за большую стоимость. Каждый час цена у торговцев меняется. Чтобы продать мясо нужно иметь лицензию на охоту, которую вы можете приобрести в Правительстве за 15 000$", helpIcon: "meat", protect: true },


    { item_id: 849, name: "Легкий бронежилет", type: ITEM_TYPE.OTHER, weight: 5, base_weight: 4500, prop: "prop_bodyarmour_03", default_count: 50, use: true, defaultCost: 2000},
    { item_id: 850, name: "Телефон", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 450, prop: "prop_amb_phone", default_count: 1, use: true, defaultCost: 2200, helpIcon: 'phone',    helpDesc: 'Чтобы начать пользоваться телефоном, вам нужно купить и активировать сим карту, нажав "Использовать". Для удобства, перенесите телефон в слот быстрого доступа в инвентаре, после чего вы сможете быстро открыть или закрыть телефон, нажимая на выбранную клавишу.', protect: true, },
    { item_id: 851, name: "Сим карта", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "ch_prop_vault_key_card_01a", default_count: 1, use: true, defaultCost: 100, helpIcon: 'sim-card', helpDesc: 'Чтобы начать пользоваться телефоном, в инвентаре вам нужно активировать сим карту, нажав "Использовать" на нее.', protect: true, },
    { item_id: 852, name: "Рация", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 550, prop: "prop_cs_hand_radio", default_count: 1, use: true, defaultCost: 1000, protect: true, },
    { item_id: 853, name: "Cherry Portable", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 550, prop: "hei_bank_heist_laptop", default_count: 1, use: true },
    { item_id: 854, name: "Самодельная взрывчатка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5400, prop: "ch_prop_ch_ld_bomb_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 855, name: "Обычная удочка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 5000, use: true },
    { item_id: 856, name: "Планшет", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "xm_prop_x17_tablet_01", default_count: 1, defaultCost: 2500, protect: true, use: true, helpIcon: 'tablet', helpDesc: 'Для удобства использования планшета перенесите его в быстрый доступ на удобный вам слот в инвентаре. Чтобы открыть его, нажимайте по выбранной клавише быстрого доступа, чтобы закрыть нажмите ESC' },
    { item_id: 857, name: "Тротил", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "ch_prop_ch_explosive_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 858, name: "Провода", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_ld_cable_tie_01", default_count: 1, need_group: true, canSplit: true },
    { item_id: 859, name: "Электронная плата", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_prototype_minibomb", default_count: 1, need_group: true, canSplit: true},
    { item_id: 860, name: "Бронежилет", type: ITEM_TYPE.OTHER, weight: 10, base_weight: 9000, prop: "prop_bodyarmour_03", default_count: 100, use: true, defaultCost: 4000},
    { item_id: 861, name: "Бумажник", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, defaultCost: 1500, protect: true, use: true},
    { item_id: 862, name: "Аккумулятор для электромобиля", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_ld_jerrycan_01", default_count: 15, use: true, defaultCost: 10000, protect: true },
    { item_id: 863, name: "Найденная сумка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1, protect: true },
    { item_id: 864, name: "Семейный груз", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_onyx_box", default_count: 1, protect: true },

    { item_id: 865, name: "Противоугонная система", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "w_ar_railgun_mag1", default_count: 1, use: true, defaultCost: 5000 , protect: true},
    { item_id: 866, name: "Бонусный купон", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 867, name: "Сумка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 868, name: "Фейерверк", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2000, prop: "ind_prop_firework_03", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 869, name: "Цветы", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2000, prop: "pp_flowersbucket", default_count: 1, use: true, inHand: true, defaultCost: 5000, propAttachParam: [0.135, -0.060, 0.065, 242, 0, 0] },
    { item_id: 870, name: "Розовый дилдо", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_cs_dildo_01", default_count: 1, use: true, inHand: true, defaultCost: 5000, propAttachParam: [0.130, 0.050, -0.005, 66, 159, 0], protect: true },
    { item_id: 871, name: "Плюшевый мишка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_mr_rasberryclean", default_count: 1, use: true, inHand: true, defaultCost: 25000, propAttachParam: [-0.015, 0.150, -0.050, 186, 271, 0], protect: true },


    // Прочее (Броники, удочки и тд)
    { item_id: 872, name: "Корпус", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 873, name: "Ствол", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true, use: true},
    { item_id: 874, name: "Затвор", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 875, name: "Прицел", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 876, name: "Курок", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 877, name: "Боёк", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 878, name: "Патронник", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 879, name: "Плоды винограда", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 200, prop: "prop_grapes_01", default_count: 1, use: false, protect: true },
    { item_id: 880, name: "Ганджубас", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, use: false, need_group: true, canSplit: true },
    { item_id: 881, name: "Виноградный сок", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_wine_red", default_count: 1, use: false, protect: true },
    { item_id: 882, name: "Бутылки с вином", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1500, prop: "winerow", default_count: 1, use: false, protect: true },
    { item_id: 883, name: "Листва", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 5, prop: "ng_proc_leaves05", default_count: 1, use: false, protect: true },
    { item_id: 884, name: "Био топливо", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "v_ind_cs_jerrycan02", default_count: 1, use: false, protect: true },
    { item_id: 885, name: "Каменая порода", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true },
    { item_id: 886, name: "Порода содежащяя серебро", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true},
    { item_id: 887, name: "Золото содержащяя порода", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true },
    { item_id: 888, name: "Большой чёрный дилдо", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "v_res_d_dildo_f", default_count: 1, use: true, inHand: true, defaultCost: 15000, propAttachParam: [0.130, 0.050, -0.005, 66, 159, 0], protect: true },
    { item_id: 889, name: "Микрофон", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 3000, prop: "v_microphone", default_count: 1, defaultCost: 10000, protect: true },
    { item_id: 890, name: "Нож для разделки", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_bowie_knife", default_count: 1, protect: true, use: true, inHand: true, defaultCost: 10000, propAttachParam: [0.130, 0.050, -0.005, 252, 19, 0], helpDesc: "Этот нож используется для разделки туши животного. Животных можно найти в зонах охоты. Существует всего 5 зон охоты все они показаны на карте.", helpIcon: "knife" },
    { item_id: 891, name: "Костёр", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 600, prop: "prop_beach_fire", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 892, name: "Палатка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_skid_tent_01", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 893, name: "Стул", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_chaircamp", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 894, name: "Музыкальный плеер", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_tapeplayer_01", default_count: 1, use: true, helpDesc: 'Используйте бумбокс в инвентаре (ПКМ - Использовать). Теперь вы можете слушать свою музыку и включать ее окружающим. Для того чтобы убрать проигрыватель, в интерфейсе имеется кнопка "забрать плеер"', helpIcon: "boombox", defaultCost: 10000, protect: true},
    { item_id: 895, name: "Трава", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, protect: true},
    { item_id: 896, name: "Силос", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, protect: true},
    { item_id: 897, name: "Рыба для суши", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_steak", default_count: 1, protect: true},
    { item_id: 898, name: "Суши", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_steak", default_count: 1, protect: true},
    { item_id: 899, name: "Ключ от наручников", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 50, prop: "prop_cuff_keys_01", default_count: 1 },
// Медикаменты
    { item_id: 900, name: "Антипохмелин", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_cs_pills", default_count: 1, use: true, count_use: 1, defaultCost: 120, need_group: true, canSplit: true, protect: true },
    { item_id: 901, name: "Обезболивающие", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills2", default_count: 1, use: true, count_use: 1, defaultCost: 150, need_group: true, canSplit: true, protect: true },
    { item_id: 902, name: "Аптечка", type: ITEM_TYPE.MEDICATION, weight: 350, base_weight: 10, prop: "prop_ld_health_pack", default_count: 1, use: true, need_group: true, defaultCost: 500, canSplit: true, healUse: 100, protect: true },
    { item_id: 903, name: "Набор таблеток", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills3", default_count: 1, count_use: 1, defaultCost: 500, need_group: true, canSplit: true, use: true, protect: true },
    { item_id: 904, name: "Антибиотик", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills2", default_count: 1, use: true, count_use: 1, defaultCost: 300, need_group: true, canSplit: true, protect: true },
    { item_id: 905, name: "Шприц с обезболивающим", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_syringe_01", default_count: 1, need_group: true, defaultCost: 150, canSplit: true , protect: true},
    { item_id: 906, name: "Медицинский набор", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_cs_package_01", default_count: 1, need_group: true, defaultCost: 150 , canSplit: true, protect: true},
    { item_id: 907, name: "Бинты", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 125, canSplit: true, healUse: 25, use: true, protect: true },
    { item_id: 908, name: "Красная аптечка", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_ld_health_pack2", default_count: 1, need_group: true, defaultCost: 200, canSplit: true, healUse: 50, use: true, protect: true },
    { item_id: 909, name: "Активированный уголь", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 150, canSplit: true, use: true, protect: true },
    { item_id: 910, name: "Эпинефрин", type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 7000, canSplit: true, use: true, protect: true },

    // Одежда
    { item_id: 949, name: "Перчатки", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 100, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true},
    { item_id: 950, name: "Маска", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 500, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true},
    { item_id: 951, name: "Торс", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 1500, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 952, name: "Ноги", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 800, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 953, name: "Обувь", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 800, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 954, name: "Головные уборы", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 400, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 955, name: "Очки", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 300, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 956, name: "Уши", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 200, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 957, name: "Часы", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 200, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 958, name: "Аксессуары", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 100, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 959, name: "Браслеты", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 150, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 960, name: "Бронежилет", type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 4500, prop: "prop_bodyarmour_03", default_count: 100, use: true, protect: false, blockHotkey: true, defaultCost: 2500 },


    // Модификации оружия
    { item_id: 1003, name: "Прицел Макро", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_scope_macro", default_count: 1, use: true, protect: true, defaultCost: 2000 },
    { item_id: 1004, name: "Прицел Малый", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 160, prop: "w_at_scope_small", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1005, name: "Прицел Средний", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 170, prop: "w_at_scope_medium", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1006, name: "Прицел Большой", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 180, prop: "w_at_scope_large", default_count: 1, use: true, protect: true, defaultCost: 6500 },
    { item_id: 1007, name: "Прицел Максимальный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 350, prop: "w_at_scope_max", default_count: 1, use: true, protect: true, defaultCost: 8000 },
    { item_id: 1008, name: "Прицел Голографический", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_sights_1", default_count: 1, use: true, protect: true, defaultCost: 2000 },
    { item_id: 1009, name: "Прицел Ночного виденья", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_scope_nv", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 1010, name: "Прицел Термальный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 650, prop: "w_at_scope_nv", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    // AR
    { item_id: 1100, name: "Глушитель Крупный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 300, prop: "w_at_ar_supp", default_count: 1, use: true, protect: true, defaultCost: 7000 },
    { item_id: 1101, name: "Рукоятка", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_afgrip_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1102, name: "Фонарик", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 300, prop: "w_me_flashlight_flash", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    // SNIPERS
    { item_id: 1301, name: "Глушитель Тяжёлый", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 500, prop: "w_at_sr_supp", default_count: 1, use: true, protect: true, defaultCost: 9000 },
    // PISTOL
    { item_id: 1401, name: "Глушитель Маленький", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 250, prop: "w_at_pi_supp", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1403, name: "Компенсатор", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_pi_comp_2", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1404, name: "Прицел Монтированый", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_pi_rail_1", default_count: 1, use: true, protect: true, defaultCost: 2000 },


    { item_id: 1501, name: "ДТ Плоский", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_1", default_count: 1, use: true, protect: true, defaultCost: 3000 },
    { item_id: 1502, name: "ДТ Тактический", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_2", default_count: 1, use: true, protect: true, defaultCost: 3100 },
    { item_id: 1503, name: "ДТ Жирный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_3", default_count: 1, use: true, protect: true, defaultCost: 3200 },
    { item_id: 1504, name: "ДТ Высокоточный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_4", default_count: 1, use: true, protect: true, defaultCost: 3300 },
    { item_id: 1505, name: "ДТ Устойчивый", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_5", default_count: 1, use: true, protect: true, defaultCost: 3400 },
    { item_id: 1506, name: "ДТ Наклонный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_6", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1507, name: "ДТ Разъемный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_7", default_count: 1, use: true, protect: true, defaultCost: 3600 },
    { item_id: 1508, name: "ДТ Квадратный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_8", default_count: 1, use: true, protect: true, defaultCost: 3700 },
    { item_id: 1509, name: "ДТ Bell-End", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_9", default_count: 1, use: true, protect: true, defaultCost: 3800 },


    { item_id: 1601, name: "Ствол усиленный", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 4800 },
    
    { item_id: 1603, name: "Зеленый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 10000 },
    { item_id: 1604, name: "Золотой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 50000  },
    { item_id: 1605, name: "Розовый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 40000 },
    { item_id: 1606, name: "Военный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 1607, name: "LSPD камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 10000 },
    { item_id: 1608, name: "Оранжевый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 1609, name: "Платиновый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 45000 },
    
    { item_id: 1611, name: "Классический серый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1612, name: "Классический двухцветный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 25000 },
    { item_id: 1613, name: "Классический белый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 30000 },
    { item_id: 1614, name: "Классический бежевый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1615, name: "Классический зеленый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1616, name: "Классический голубой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 6000 },
    { item_id: 1617, name: "Классический земляной камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1618, name: "Классический коричневый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1619, name: "Красный контрастный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1620, name: "Голубой контрастный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 7000 },
    { item_id: 1621, name: "Желтый контрастный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 20000 },
    { item_id: 1622, name: "Оранжевый контрастный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 12000 },
    { item_id: 1623, name: "Розовый контрастный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 30000 },
    { item_id: 1624, name: "Фиолетово-желтый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 60000 },
    { item_id: 1625, name: "Оранжевый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 1626, name: "Зелено-фиолетовый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    { item_id: 1627, name: "Черно-красный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1628, name: "Черно-зеленый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1629, name: "Черно-голубой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1630, name: "Черно-желтый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1631, name: "Красно-белый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1632, name: "Бело-голубой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    { item_id: 1633, name: "Металлический золотой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000  },
    { item_id: 1634, name: "Металлический платиновый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    { item_id: 1635, name: "Металлический сиренево-серый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    { item_id: 1636, name: "Металлический лаймово-фиолетовый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    { item_id: 1637, name: "Металлический красный камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 85000 },
    { item_id: 1638, name: "Металлический зеленый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 80000 },
    { item_id: 1639, name: "Металлический голубой камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 1640, name: "Металлический аква белый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000 },
    { item_id: 1641, name: "Металлический красно-желтый камуфляж", type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000 },

    // Сумки и рюкзаки
    { item_id: 2000, name: "Черный рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2001, name: "Серый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2002, name: "Песочный рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2003, name: "Зеленый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2004, name: "Зеленый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2005, name: "Оранжевый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2006, name: "Фиолетовый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2007, name: "Розовый рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2008, name: "Темно красный рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2009, name: "Синий рюкзак", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2010, name: "Черная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2011, name: "Голубая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2012, name: "Желтая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2013, name: "Красная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2014, name: "Салатовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2015, name: "Оранжевая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2016, name: "Фиолетовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2017, name: "Розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2018, name: "Красно синяя сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2019, name: "Бирюзовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2020, name: "Синяя милитари сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2021, name: "Травянистая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2022, name: "Болотная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2023, name: "Песочная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2024, name: "Милитари сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2025, name: "Белая Bigness сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2026, name: "Красная Bigness сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2027, name: "Цветочная Bigness сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2028, name: "Зеленая Guffy сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2029, name: "Розовая Guffy сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2030, name: "Берюзово травянистая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2031, name: "Серая травянистая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2032, name: "Розовая Jackal сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2033, name: "Бирюзовая Jackal сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2034, name: "Карбоновая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2035, name: "Бирюзовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2036, name: "Розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2037, name: "Красная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2038, name: "Нежно розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2039, name: "Бирюзовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2040, name: "Бирюзово салатовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2041, name: "Серо желтая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2042, name: "Голубовато розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2043, name: "Серая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2044, name: "Бирюзовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2045, name: "Бирюзовая милитари сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2046, name: "Расписная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2047, name: "Расписная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2048, name: "Расписная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2049, name: "Расписная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2050, name: "Рюкзак Adidas серый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2051, name: "Рюкзак Adidas розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2052, name: "Рюкзак Adidas красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2053, name: "Рюкзак Adidas фиолетовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2054, name: "Рюкзак Gucci бежевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2055, name: "Рюкзак Gucci красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2056, name: "Рюкзак Gucci серый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2057, name: "Рюкзак Gucci черный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2058, name: "Черная бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2059, name: "Бирюзовая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2060, name: "Фиолетовая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2061, name: "Красная бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2062, name: "Виноградная бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2063, name: "Черная сумка конверт", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2064, name: "Леопардовая сумка конверт", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2065, name: "Белая сумка конверт", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2066, name: "Красная сумка конверт", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2067, name: "Бежевая сумка конверт", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2068, name: "Розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2069, name: "Черная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2070, name: "Песочная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2071, name: "Розовая сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2072, name: "Черная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2073, name: "Песочная сумка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2074, name: "Черная сумка Louis", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2075, name: "Коричневая сумка Louis", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2076, name: "Белая сумка Louis", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2077, name: "Черная сумка Louis", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2078, name: "Коричневая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2079, name: "Голубая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2080, name: "Бирюзовая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2081, name: "Зеленая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2082, name: "Красная бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2083, name: "Желтая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2084, name: "Фиолетовая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2085, name: "Черная бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2086, name: "Серая бананка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2087, name: "Рюкзак дьявола красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2088, name: "Рюкзак дьявола оранжевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2089, name: "Рюкзак halloween оранжевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2090, name: "Рюкзак halloween красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2091, name: "Рюкзак с крыльями красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2092, name: "Рюкзак с крыльями оранжевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2093, name: "Бананка halloween оранжевая ", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2094, name: "Бананка halloween красная", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2095, name: "Бананка halloween розовая", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2096, name: "Бананка halloween черно оранжевая", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2097, name: "Бананка halloween серая", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2098, name: "Рюкзак новогодний олень", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2099, name: "Рюкзак новогодний тигр", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2100, name: "Рюкзак сердце красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2101, name: "Рюкзак сердце синий", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2102, name: "Рюкзак сердце бордовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2103, name: "Рюкзак сердце черный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2104, name: "Рюкзак сердце розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2105, name: "Рюкзак сердце зеленый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2106, name: "Рюкзак котик серый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2107, name: "Рюкзак котик голубой", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2108, name: "Рюкзак котик красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2109, name: "Рюкзак котик розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2110, name: "Рюкзак котик фиолетовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2111, name: "Рюкзак котик бирюзовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2112, name: "Рюкзак котик розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2113, name: "Рюкзак котик бежевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2114, name: "Рюкзак котик с ушками голубой", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2115, name: "Рюкзак котик с ушками салатовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2116, name: "Рюкзак котик с ушками фиолетовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2117, name: "Рюкзак котик с ушками розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2118, name: "Рюкзак котик с ушками серый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2119, name: "Рюкзак котик с ушками песочный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2120, name: "Сумка ручная гепард", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2121, name: "Сумка ручная бело коричневый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2122, name: "Сумка ручная бело песочный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2123, name: "Сумка ручная красная", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2124, name: "Сумка ручная бежевая", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2125, name: "Сумка ручная красно белая", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2126, name: "Сумка ручная черная", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2127, name: "Рюкзак пингвин синий", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2128, name: "Рюкзак коровка", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2129, name: "Катана какаси", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2130, name: "Бананка маршмелло", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2131, name: "Рюкзак спортивный белый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2132, name: "Рюкзак спортивный черный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2133, name: "Рюкзак спортивный синий", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2134, name: "Рюкзак спортивный голубой", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2135, name: "Рюкзак спортивный бирюзовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2136, name: "Рюкзак спортивный оранжевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2137, name: "Рюкзак спортивный красный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2138, name: "Рюкзак спортивный оранжевый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2139, name: "Рюкзак спортивный зеленый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2140, name: "Рюкзак спортивный розовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2141, name: "Рюкзак спортивный салатовый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2142, name: "Сумочка Gucci", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2143, name: "Рюкзак Versace", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2144, name: "Рюкзак Nike Черный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2145, name: "Рюкзак Nike Белый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2146, name: "Рюкзак разгрузочный черный", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2147, name: "Рюкзак разгрузочный белый", type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },












    { item_id: 3000, name: "Криптоключ", desc: 'Данный ключ хранит информацию о вашем криптокошельке. Без него невозможны операции Offline', type: ITEM_TYPE.MINING, weight: 0, base_weight: 100, prop: "ch_prop_ch_usb_drive01x", default_count: 1, use: true, protect: true, defaultCost: 150000 },
    { item_id: 3001, name: "Майнинг ферма", desc: 'Это стартовый набор, который устанавливается в квартире', type: ITEM_TYPE.MINING, weight: 0, base_weight: 5000, prop: "ba_prop_battle_chest_closed", default_count: 1, use: true, protect: true, defaultCost: 100000 },

    // Видеокарты (3100 - 3199)
    { item_id: 3100, name: "GTX 1050", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3101, name: "GTX 1060", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3102, name: "GTX 1660ti", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 120000 },
    { item_id: 3103, name: "GTX 1070", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 150000 },
    { item_id: 3104, name: "GTX 1080", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 200000 },
    { item_id: 3105, name: "GTX 1080super", desc: 'Видеокарта, предназначенная для майнинг ферм', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 250000 },

    // Алгоритмы (3200 - 3299)
    { item_id: 3200, name: "Флешка с ПО (Алгоритм Альфа)", desc: 'Флешка с програмным обеспечением для майнинга.', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    { item_id: 3201, name: "Флешка с ПО (Алгоритм Бета)", desc: 'Флешка с програмным обеспечением для майнинга.', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    { item_id: 3202, name: "Флешка с ПО (Алгоритм Гамма)", desc: 'Флешка с програмным обеспечением для майнинга.', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 85000 },
    { item_id: 3203, name: "Флешка с ПО (Алгоритм Дельта)", desc: 'Флешка с програмным обеспечением для майнинга.', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 125000 },
    { item_id: 3204, name: "Флешка с ПО (Алгоритм Эпсилон)", desc: 'Флешка с програмным обеспечением для майнинга.', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 200000 },

    // CPU (3300 - 3399)
    { item_id: 3300, name: "Ryzen 5 1600", desc: 'Процессор для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3301, name: "Ryzen 5 3600", desc: 'Процессор для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 75000 },
    { item_id: 3302, name: "Ryzen 7 3700", desc: 'Процессор для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3303, name: "Ryzen 9 5900X", desc: 'Процессор для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 150000 },

    // RAM (3400 - 3499)
    { item_id: 3400, name: "Ram 4GB", desc: 'Планка оперативной памяти для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    { item_id: 3401, name: "Ram 8GB", desc: 'Планка оперативной памяти для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    { item_id: 3402, name: "Ram 16GB", desc: 'Планка оперативной памяти для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 95000 },
    { item_id: 3403, name: "Ram 32GB", desc: 'Планка оперативной памяти для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 125000 },

    // Блоки питания (3500 - 3599)
    { item_id: 3500, name: "Блок питания PowerPC Light", desc: 'Блок питания для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3501, name: "Блок питания PowerPC Medium", desc: 'Блок питания для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3502, name: "Блок питания PowerPC Hard", desc: 'Блок питания для майнинг фермы', type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 150000 },


    // Предметы для крафта
    { item_id: 4000, name: "Ткань для бронежилета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 500, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 4001, name: "Передняя пластина бронежилета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 4002, name: "Задняя пластина бронежилета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1 },

    // Предметы в ограбления домов
    { item_id: 5000, name: "Золотые серьги", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5001, name: "Золотая цепь", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5002, name: "Золотое кольцо", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5003, name: "Дорогостоящие часы", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5004, name: "Серебрянная статуэтка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5005, name: "Старинная ваза", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5006, name: "Редкая картина", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5007, name: "Серебрянное колье", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5008, name: "Ценные бумаги", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5009, name: "Колекционный кубок", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5010, name: "Редкая монета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5011, name: "Антикварная почтовая марка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5012, name: "Колекционная музыкальная пластинка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5013, name: "Драгоценный камень", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5014, name: "Вино Romanee Conti Grand Cru 1945", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5015, name: "Виски Macallan 1926", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },


    { item_id: 6000, name: "Артефакт", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6001, name: "Записка Майкла", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6002, name: "Олень Санты", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6003, name: "Морская ракушка", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },



    // Для дайвинга
    { item_id: 6500, name: "Акваланг", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, defaultCost: 40000, use: true },

    // Элементы карты
    { item_id: 6501, name: "Кусок пиратской карты 1", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6502, name: "Кусок пиратской карты 2", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6503, name: "Кусок пиратской карты 3", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6504, name: "Кусок пиратской карты 4", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6505, name: "Кусок пиратской карты 5", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6506, name: "Кусок пиратской карты 6", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6507, name: "Кусок карты сокровищ 1", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6508, name: "Кусок карты сокровищ 2", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6509, name: "Кусок карты сокровищ 3", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6510, name: "Кусок карты сокровищ 4", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6511, name: "Кусок карты сокровищ 5", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6512, name: "Кусок карты сокровищ 6", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6513, name: "Кусок карты лоцмана 1", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6514, name: "Кусок карты лоцмана 2", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6515, name: "Кусок карты лоцмана 3", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6516, name: "Кусок карты лоцмана 4", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6517, name: "Кусок карты лоцмана 5", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6518, name: "Кусок карты лоцмана 6", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },

    // Предметы падающие с сундуков
    { item_id: 6519, name: "Золотой зуб", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6520, name: "Золотой самородок", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6521, name: "Серебрянная монета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6522, name: "Золотая монета", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6523, name: "Перстень", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6524, name: "Изумруд", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6525, name: "Янтарный слиток", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },

    { item_id: 6526, name: "Пиратская карта", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6527, name: "Карта сокровищ", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6528, name: "Карта лоцмана", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },

    // Для фермы

    { item_id: 7000, name: "Семена картофели", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 150},
    { item_id: 7001, name: "Семена моркови", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 155},
    { item_id: 7002, name: "Семена помидоров", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 160},
    { item_id: 7003, name: "Семена огурцов", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 165},
    { item_id: 7004, name: "Семена редьки", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 170},
    { item_id: 7005, name: "Семена лука", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 175},
    { item_id: 7006, name: "Семена клубники", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 230},
    { item_id: 7007, name: "Семена арбуза", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 200},
    { item_id: 7008, name: "Семена малины", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 210},
    // { item_id: 7009, name: "Семена винограда", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 210},
    { item_id: 7010, name: "Семена черники", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 250},
    { item_id: 7011, name: "Семена Ели", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 150},


    { item_id: 7020, name: "Картофель", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7021, name: "Морковь", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7022, name: "Помидор", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7023, name: "Огурец", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7024, name: "Редька", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7025, name: "Лук", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7026, name: "Клубника", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7027, name: "Арбуз", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7028, name: "Малина", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    // { item_id: 7029, name: "Виноград", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7030, name: "Черника", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},
    { item_id: 7031, name: "Еловое бревно", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},

    { item_id: 8001, name: "Автопилот", type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "w_ar_railgun_mag1", default_count: 1, use: true, defaultCost: 2500000 , protect: true},


    { item_id: 9000, name: "Коровье молоко", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},
    { item_id: 9100, name: "Дорогой корм", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 150},
    { item_id: 9101, name: "Низкосортный корм", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 50},
    { item_id: 9102, name: "Сбалансированный корм", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 80},

    { item_id: 9200, name: "Хорошая удочка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 10000, use: true },
    { item_id: 9201, name: "Высококачественная удочка", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 20000, use: true },

    { item_id: 9210, name: "Чебак", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true, canSplit: true },
    { item_id: 9211, name: "Карп", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9212, name: "Окунь", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9213, name: "Щука", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9214, name: "Судак", type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},

    { item_id: 9500, name: "Корзинка для сладостей", type: ITEM_TYPE.SYSTEM, weight: 1, prop: "pumpkin_basket", default_count: 1, propAttachParam: [0.505, -0.090, -0.110, 161, 256, 0], inHand: true, use: true },

    //Зелья
    { item_id: 10000, name: "Зелье здоровье для карликов", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10001, name: "Зелье здоровье для гигантов", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10002, name: "Зелье здоровья", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10003, name: "Зелье жука броненосца", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10004, name: "Зелье богомола", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10005, name: "Зелье диванного критика", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10006, name: "Зелье неизвестность", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10007, name: "Зелье альфа", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10008, name: "Зелье маленького таракана", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10009, name: "Зелье танцпола", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10010, name: "Зелье Логана", type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},


    // Собаки
    { item_id: 15000, name: "Ротвеллер", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15001, name: "Хаски", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15002, name: "Пудель", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15003, name: "Мопс", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true},
    { item_id: 15004, name: "Шеперд", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15005, name: "Болоньез", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15006, name: "Золотистый ретривер", type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },



    // Кальяны и табачка 
    { item_id: 20000, name: "Кальян", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 5, prop: "kalian", default_count: 1, use: true },
    { item_id: 20001, name: "Вейп", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 5, prop: "vape", default_count: 1,   protect: true, use: true },
    { item_id: 20002, name: "Бонг", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "prop_bong_01", default_count: 1,   protect: true, use: true },
    { item_id: 20010, name: "Жижа для вейпа вкус малины", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20011, name: "Жижа для вейпа вкус черники", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20012, name: "Жижа для вейпа вкус вишни", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20013, name: "Жижа для вейпа вкус дыни", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20014, name: "Жижа для вейпа вкус клубника арбуз", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20015, name: "Жижа для вейпа вкус Mexican", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20016, name: "Жижа для вейпа вкус маракуя", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20017, name: "Жижа для вейпа вкус манго", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20018, name: "Жижа для вейпа вкус грейпфрут", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20019, name: "Жижа для вейпа вкус яблоко", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20020, name: "Табак для кальяна Darkside Cosmo Flower", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20021, name: "Уголь для кальяна", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20030, name: "Травка для бонга", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true , need_group: true},
    { item_id: 20050, name: "Табак для кальяна Darkside Coca Cola", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20051, name: "Табак для кальяна Darkside Grapfruit", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20052, name: "Табак для кальяна Darkside Mango Lassi", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20053, name: "Табак для кальяна Darkside Blueberry Blast", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20054, name: "Табак для кальяна Darkside Tropic Ray", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20055, name: "Табак для кальяна BlackBurn Green tea", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20056, name: "Табак для кальяна BlackBurn Shock Pineapple", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20057, name: "Табак для кальяна BlackBurn Cane Mint", type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },

];

export const AUTO_SOUND_ITEM_ID = 8000;
export const HALLOWEEN_BASKET_ITEM_ID = 9500;
export const KEYS_ITEM_ID = 805;

export interface WeaponAddonsItemBase {
    /** ID предмета из инвентаря*/
    item_id: number,
    /** Hash вариации (уникален для каждого оружия) */
    hash: string,
    /** Группа модификации. Если внутри оружия уже есть предмет из данной группы - второй поставить не выйдет */
    group: number,
}

export interface WeaponAddonsItem {
    /** Глушитель (ID предмета и ХЕШ компонента) */
    suppressor?: WeaponAddonsItemBase
    /** Компенсатор (ID предмета и ХЕШ компонента) */
    compensator?: WeaponAddonsItemBase
    /** Фонарь (ID предмета и ХЕШ компонента) */
    flashlight?: WeaponAddonsItemBase
    /** Рукоять (ID предмета и ХЕШ компонента) */
    grip?: WeaponAddonsItemBase
    /** Прицел (Макро) */
    makro?: WeaponAddonsItemBase
    /** Прицел (Малый) */
    small?: WeaponAddonsItemBase
    /** Прицел (Монтированый) */
    mounted?: WeaponAddonsItemBase
    /** Прицел (Голограф) */
    holographic?: WeaponAddonsItemBase
    /** Прицел (NV) */
    nv?: WeaponAddonsItemBase
    /** Прицел (термальный) */
    thermal?: WeaponAddonsItemBase

    /** ДТ */
    muzzle_1?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_2?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_3?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_4?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_5?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_6?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_7?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_8?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_9?: WeaponAddonsItemBase
    /** Ствол */
    barrel_heavy?: WeaponAddonsItemBase
    /** Скин оружия */
    tint_1?: WeaponAddonsItemBase
    tint_2?: WeaponAddonsItemBase
    tint_3?: WeaponAddonsItemBase
    tint_4?: WeaponAddonsItemBase
    tint_5?: WeaponAddonsItemBase
    tint_6?: WeaponAddonsItemBase
    tint_7?: WeaponAddonsItemBase
    
    tint_8?: WeaponAddonsItemBase
    tint_9?: WeaponAddonsItemBase
    tint_10?: WeaponAddonsItemBase
    tint_11?: WeaponAddonsItemBase
    tint_12?: WeaponAddonsItemBase
    tint_13?: WeaponAddonsItemBase
    tint_14?: WeaponAddonsItemBase
    tint_15?: WeaponAddonsItemBase
    tint_16?: WeaponAddonsItemBase
    tint_17?: WeaponAddonsItemBase
    tint_18?: WeaponAddonsItemBase
    tint_19?: WeaponAddonsItemBase
    tint_20?: WeaponAddonsItemBase
    tint_21?: WeaponAddonsItemBase
    tint_22?: WeaponAddonsItemBase
    tint_23?: WeaponAddonsItemBase
    tint_24?: WeaponAddonsItemBase
    tint_25?: WeaponAddonsItemBase
    tint_26?: WeaponAddonsItemBase
    tint_27?: WeaponAddonsItemBase
    tint_28?: WeaponAddonsItemBase
    tint_29?: WeaponAddonsItemBase
    tint_30?: WeaponAddonsItemBase
    tint_31?: WeaponAddonsItemBase
    
    camo?: WeaponAddonsItemBase
}

export const weapon_list: {
    /** item_id Оружия */
    weapon: number,
    /** Калибр оружия */
    caliber: WEAPON_CALIBER,
    /** item_id Магазина оружия */
    // magazine: number,
    /** Хэш оружия в строковом виде */
    hash: string
    /** ID предмета коробки с патронами */
    ammo_box: number,
    /** Сколько патронов в магазине */
    ammo_max: number,
    /** Для этого оружия требуется лицензия */
    need_license?:true,
    /** Крепление оружия на теле*/
    attach?: {},
    /** Список модификаций, доступных на данном оружии */
    addons?: WeaponAddonsItem
}[] = [
        { weapon: 500, caliber: 5.45, ammo_max: 30, hash: "weapon_assaultrifle", ammo_box: 150, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
            suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
            grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 2},
            flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
            makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO', group: 4},
        }},
        { weapon: 501, caliber: 9, ammo_max: 12, hash: "weapon_pistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
            suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP_02', group: 1},
            flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
        }},
        { weapon: 502, caliber: 9, ammo_max: 12, hash: "weapon_pistol_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
                
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP_02', group: 1},
                compensator: {item_id: 1403, hash: 'COMPONENT_AT_PI_COMP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH_02', group: 2},
                mounted: {item_id: 1404, hash: 'COMPONENT_AT_PI_RAIL', group: 3},
        }},
        { weapon: 503, caliber: 9, ammo_max: 12, hash: "weapon_combatpistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
        }},
        { weapon: 504, caliber: 9, ammo_max: 18, hash: "weapon_appistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
            }},
        { weapon: 505, caliber: 9, ammo_max: 9, hash: "weapon_pistol50", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
        }},
        { weapon: 506, caliber: 9, ammo_max: 6, hash: "weapon_snspistol", ammo_box: 153, need_license: true},
        { weapon: 507, caliber: 9, ammo_max: 6, hash: "weapon_snspistol_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP_02', group: 1},
                compensator: {item_id: 1403, hash: 'COMPONENT_AT_PI_COMP_02', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH_03', group: 2},
                mounted: {item_id: 1404, hash: 'COMPONENT_AT_PI_RAIL_02', group: 3},
        }},
        { weapon: 508, caliber: 9, ammo_max: 18, hash: "weapon_heavypistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
            }},
        { weapon: 509, caliber: 9, ammo_max: 7, hash: "weapon_vintagepistol", ammo_box: 153, need_license: true, addons: {
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
            } },
        { weapon: 510, caliber: 9, ammo_max: 1, hash: "weapon_marksmanpistol", ammo_box: 153, need_license: true },
        { weapon: 511, caliber: 9, ammo_max: 6, hash: "weapon_revolver", ammo_box: 153, need_license: true },
        { weapon: 512, caliber: 9, ammo_max: 6, hash: "weapon_revolver_mk2", ammo_box: 153, need_license: true, addons: {
                camo: {item_id: 1611, hash: 'COMPONENT_REVOLVER_MK2_CAMO_ONYX_01', group: 7},
                //tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 1},
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_MACRO_MK2', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
                compensator: {item_id: 1403, hash: 'COMPONENT_AT_PI_COMP_03', group: 3},
            } },
        { weapon: 513, caliber: 9, ammo_max: 6, hash: "weapon_doubleaction", ammo_box: 153, need_license: true },
        { weapon: 514, caliber: 9, ammo_max: 12, hash: "weapon_ceramicpistol", ammo_box: 153, need_license: true , addons: {
                suppressor: {item_id: 1401, hash: 'COMPONENT_CERAMICPISTOL_SUPP', group: 1},
            } },
        { weapon: 515, caliber: 9, ammo_max: 6, hash: "weapon_navyrevolver", ammo_box: 153, need_license: true },
        { weapon: 516, caliber: 9, ammo_max: 16, hash: "weapon_microsmg", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_PI_FLSH', group: 2},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO', group: 3},
            } },
        { weapon: 517, caliber: 9, ammo_max: 30, hash: "weapon_smg", ammo_box: 153, need_license: true, /*addons: {
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_02', group: 3},
            }*/ },
        { weapon: 518, caliber: 9, ammo_max: 30, hash: "weapon_smg_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1100, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS_SMG', group: 3},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_02_SMG_MK2', group: 3},
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_SMALL_SMG_MK2', group: 3},
                muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
                muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
                muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
                muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
                muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
                muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
                muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_SB_BARREL_02', group: 1},
            } },
        { weapon: 519, caliber: 9, ammo_max: 30, hash: "weapon_assaultsmg", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_02', group: 3},
            } },
        { weapon: 520, caliber: 9, ammo_max: 30, hash: "weapon_combatpdw", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                small: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_SMALL', group: 3},
            } },
        { weapon: 521, caliber: 9, ammo_max: 12, hash: "weapon_machinepistol", ammo_box: 153, need_license: true , addons: {
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
            } },
        { weapon: 522, caliber: 9, ammo_max: 20, hash: "weapon_minismg", ammo_box: 153, need_license: true },
        { weapon: 523, caliber: 18.5, ammo_max: 8, hash: "weapon_pumpshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_SR_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
            } },
        { weapon: 524, caliber: 18.5, ammo_max: 8, hash: "weapon_pumpshotgun_mk2", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 1},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_MK2', group: 1},
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_SMALL_MK2', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_SR_SUPP_03', group: 3},
                muzzle_8: {item_id: 1508, hash: 'COMPONENT_AT_MUZZLE_08', group: 3},
            } },
        { weapon: 525, caliber: 18.5, ammo_max: 8, hash: "weapon_sawnoffshotgun", ammo_box: 154, need_license: true },
        { weapon: 526, caliber: 18.5, ammo_max: 8, hash: "weapon_assaultshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 3},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 1},
            } },
        { weapon: 527, caliber: 18.5, ammo_max: 14, hash: "weapon_bullpupshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 3},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 1},
            } },
        { weapon: 528, caliber: 18.5, ammo_max: 1, hash: "weapon_musket", ammo_box: 154, need_license: true },
        { weapon: 529, caliber: 18.5, ammo_max: 6, hash: "weapon_heavyshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 3},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 1},
            } },
        { weapon: 530, caliber: 18.5, ammo_max: 2, hash: "weapon_dbshotgun", ammo_box: 154, need_license: true },
        { weapon: 531, caliber: 18.5, ammo_max: 10, hash: "weapon_autoshotgun", ammo_box: 154, need_license: true },
        { weapon: 532, caliber: 7.62, ammo_max: 30, hash: "weapon_assaultrifle_mk2", ammo_box: 155, need_license: true, addons: {
            barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_AR_BARREL_02', group: 5},
            grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP_02', group: 2},
            flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
            holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 4},
            makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_MK2', group: 4},
            small: {item_id: 1005, hash: 'COMPONENT_AT_SCOPE_MEDIUM_MK2', group: 4},
            suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
            muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
            muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
            muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
            muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
            muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
            muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
            muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
            } },
        { weapon: 533, caliber: 5.56, ammo_max: 30, hash: "weapon_carbinerifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 4},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                small: {item_id: 1005, hash: 'COMPONENT_AT_SCOPE_MEDIUM', group: 2},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
            } },
        { weapon: 534, caliber: 5.56, ammo_max: 30, hash: "weapon_carbinerifle_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_CR_BARREL_02', group: 5},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP_02', group: 2},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 4},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_MK2', group: 4},
                small: {item_id: 1005, hash: 'COMPONENT_AT_SCOPE_MEDIUM_MK2', group: 4},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
                muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
                muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
                muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
                muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
                muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
                muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
                muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
        }},
        { weapon: 535, caliber: 5.56, ammo_max: 30, hash: "weapon_advancedrifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_SMALL', group: 4},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
            } },
        { weapon: 536, caliber: 5.56, ammo_max: 30, hash: "weapon_specialcarbine", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                small: {item_id: 1005, hash: 'COMPONENT_AT_SCOPE_MEDIUM', group: 4},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 5},
            } },
        { weapon: 537, caliber: 5.56, ammo_max: 30, hash: "weapon_specialcarbine_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_SC_BARREL_02', group: 5},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP_02', group: 2},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 4},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_MK2', group: 4},
                small: {item_id: 1005, hash: 'COMPONENT_AT_SCOPE_MEDIUM_MK2', group: 4},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
                muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
                muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
                muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
                muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
                muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
                muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
                muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
            }},
        { weapon: 538, caliber: 5.56, ammo_max: 30, hash: "weapon_bullpuprifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
            
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_SMALL', group: 4},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 5},
            } },
        { weapon: 539, caliber: 5.56, ammo_max: 30, hash: "weapon_bullpuprifle_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_BP_BARREL_02', group: 5},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP_02', group: 2},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 3},
                holographic: {item_id: 1008, hash: 'COMPONENT_AT_SIGHTS', group: 4},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_02_MK2', group: 4},
                small: {item_id: 1004, hash: 'COMPONENT_AT_SCOPE_SMALL_MK2', group: 4},
                suppressor: {item_id: 1100, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
                muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
                muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
                muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
                muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
                muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
                muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
                muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
            }},
        { weapon: 540, caliber: 5.45, ammo_max: 30,  hash: "weapon_compactrifle", ammo_box: 150, need_license: true },
        { weapon: 541, caliber: 7.62, ammo_max: 70,  hash: "weapon_mg", ammo_box: 155, need_license: true },
        { weapon: 542, caliber: 7.62, ammo_max: 100,  hash: "weapon_combatmg", ammo_box: 155, need_license: true },
        { weapon: 543, caliber: 7.62, ammo_max: 70,  hash: "weapon_combatmg_mk2", ammo_box: 155, need_license: true },
        { weapon: 544, caliber: 7.62, ammo_max: 55,  hash: "weapon_gusenberg", ammo_box: 155, need_license: true },
        { weapon: 545, caliber: 12.7, ammo_max: 10,  hash: "weapon_sniperrifle", ammo_box: 152, need_license: true, addons: {
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_AR_SUPP_02', group: 1},
        }},
        { weapon: 546, caliber: 12.7, ammo_max: 6,  hash: "weapon_heavysniper", ammo_box: 152, need_license: true },
        { weapon: 547, caliber: 12.7, ammo_max: 6,  hash: "weapon_heavysniper_mk2", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_SR_SUPP_03', group: 1},
                makro: {item_id: 1006, hash: 'COMPONENT_AT_SCOPE_LARGE_MK2', group: 2},
                small: {item_id: 1007, hash: 'COMPONENT_AT_SCOPE_MAX', group: 2},
                nv: {item_id: 1009, hash: 'COMPONENT_AT_SCOPE_NV', group: 2},
                thermal: {item_id: 1010, hash: 'COMPONENT_AT_SCOPE_THERMAL', group: 2},
                muzzle_8: {item_id: 1508, hash: 'COMPONENT_AT_MUZZLE_08', group: 1},
                muzzle_9: {item_id: 1509, hash: 'COMPONENT_AT_MUZZLE_09', group: 1},
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_SR_BARREL_02', group: 3},
            }},
        { weapon: 548, caliber: 12.7, ammo_max: 8,  hash: "weapon_marksmanrifle", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1604, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1605, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1606, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1607, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1608, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1609, hash: 'WEAPON_TINT7', group: 6},
                
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP', group: 3},
            }},
        { weapon: 549, caliber: 12.7, ammo_max: 8,  hash: "weapon_marksmanrifle_mk2", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: 'WEAPON_TINT2', group: 6},
                tint_3: {item_id: 1613, hash: 'WEAPON_TINT3', group: 6},
                tint_4: {item_id: 1614, hash: 'WEAPON_TINT4', group: 6},
                tint_5: {item_id: 1615, hash: 'WEAPON_TINT5', group: 6},
                tint_6: {item_id: 1616, hash: 'WEAPON_TINT6', group: 6},
                tint_7: {item_id: 1617, hash: 'WEAPON_TINT7', group: 6},
                tint_8: {item_id: 1618, hash: 'WEAPON_TINT8', group: 6},
                tint_9: {item_id: 1619, hash: 'WEAPON_TINT9', group: 6},
                tint_10: {item_id: 1620, hash: 'WEAPON_TINT10', group: 6},
                tint_11: {item_id: 1621, hash: 'WEAPON_TINT11', group: 6},
                tint_12: {item_id: 1622, hash: 'WEAPON_TINT12', group: 6},
                tint_13: {item_id: 1623, hash: 'WEAPON_TINT13', group: 6},
                tint_14: {item_id: 1624, hash: 'WEAPON_TINT14', group: 6},
                tint_15: {item_id: 1625, hash: 'WEAPON_TINT15', group: 6},
                tint_16: {item_id: 1626, hash: 'WEAPON_TINT16', group: 6},
                tint_17: {item_id: 1627, hash: 'WEAPON_TINT17', group: 6},
                tint_18: {item_id: 1628, hash: 'WEAPON_TINT18', group: 6},
                tint_19: {item_id: 1629, hash: 'WEAPON_TINT19', group: 6},
                tint_20: {item_id: 1630, hash: 'WEAPON_TINT20', group: 6},
                tint_21: {item_id: 1631, hash: 'WEAPON_TINT21', group: 6},
                tint_22: {item_id: 1632, hash: 'WEAPON_TINT22', group: 6},
                tint_23: {item_id: 1633, hash: 'WEAPON_TINT23', group: 6},
                tint_24: {item_id: 1634, hash: 'WEAPON_TINT24', group: 6},
                tint_25: {item_id: 1635, hash: 'WEAPON_TINT25', group: 6},
                tint_26: {item_id: 1636, hash: 'WEAPON_TINT26', group: 6},
                tint_27: {item_id: 1637, hash: 'WEAPON_TINT27', group: 6},
                tint_28: {item_id: 1638, hash: 'WEAPON_TINT28', group: 6},
                tint_29: {item_id: 1639, hash: 'WEAPON_TINT29', group: 6},
                tint_30: {item_id: 1640, hash: 'WEAPON_TINT30', group: 6},
                tint_31: {item_id: 1641, hash: 'WEAPON_TINT31', group: 6},
            
                suppressor: {item_id: 1301, hash: 'COMPONENT_AT_AR_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                muzzle_1: {item_id: 1501, hash: 'COMPONENT_AT_MUZZLE_01', group: 1},
                muzzle_2: {item_id: 1502, hash: 'COMPONENT_AT_MUZZLE_02', group: 1},
                muzzle_3: {item_id: 1503, hash: 'COMPONENT_AT_MUZZLE_03', group: 1},
                muzzle_4: {item_id: 1504, hash: 'COMPONENT_AT_MUZZLE_04', group: 1},
                muzzle_5: {item_id: 1505, hash: 'COMPONENT_AT_MUZZLE_05', group: 1},
                muzzle_6: {item_id: 1506, hash: 'COMPONENT_AT_MUZZLE_06', group: 1},
                muzzle_7: {item_id: 1507, hash: 'COMPONENT_AT_MUZZLE_07', group: 1},
                barrel_heavy: {item_id: 1601, hash: 'COMPONENT_AT_MRFL_BARREL_02', group: 3},
                grip: {item_id: 1101, hash: 'COMPONENT_AT_AR_AFGRIP_02', group: 3},
            }},
        { weapon: 550, caliber: null, ammo_max: 0,  hash: "weapon_stungun", ammo_box: null, need_license: true },
        { weapon: 551, caliber: null, ammo_max: 0,  hash: "weapon_bat", ammo_box: null, need_license: true },
        { weapon: 552, caliber: null, ammo_max: 0,  hash: "weapon_knife", ammo_box: null, need_license: true },
        { weapon: 553, caliber: null, ammo_max: 0,  hash: "weapon_nightstick", ammo_box: null, need_license: true },
        { weapon: 554, caliber: 12.7, ammo_max: 1,  hash: "weapon_firework", ammo_box: 152, need_license: true },
        { weapon: 555, caliber: null, ammo_max: 0,  hash: "weapon_flashlight", ammo_box: null},
        { weapon: 556, caliber: 12.7, ammo_max: 0,  hash: "weapon_raypistol", ammo_box: null},
        { weapon: 557, caliber: 12.7, ammo_max: 0,  hash: "weapon_rayminigun", ammo_box: null},
        { weapon: 558, caliber: 12.7, ammo_max: 0,  hash: "weapon_railgun", ammo_box: null},
        { weapon: 559, caliber: 12.7, ammo_max: 0,  hash: "weapon_compactlauncher", ammo_box: null},
        { weapon: 560, caliber: null, ammo_max: 999,  hash: "weapon_fireextinguisher", ammo_box: 156 },
        { weapon: 561, caliber: null, ammo_max: 0,  hash: "weapon_bottle", ammo_box: null, need_license: true },
        { weapon: 562, caliber: null, ammo_max: 0,  hash: "weapon_crowbar", ammo_box: null, need_license: true },
        { weapon: 563, caliber: null, ammo_max: 0,  hash: "weapon_hammer", ammo_box: null, need_license: true },
        { weapon: 564, caliber: null, ammo_max: 0,  hash: "weapon_hatchet", ammo_box: null, need_license: true },
        { weapon: 565, caliber: null, ammo_max: 0,  hash: "weapon_knuckle", ammo_box: null, need_license: true },
        { weapon: 566, caliber: null, ammo_max: 0,  hash: "weapon_machete", ammo_box: null, need_license: true },
        { weapon: 567, caliber: null, ammo_max: 0,  hash: "weapon_wrench", ammo_box: null, need_license: true },
        { weapon: 568, caliber: null, ammo_max: 0,  hash: "weapon_battleaxe", ammo_box: null, need_license: true },
        { weapon: 569, caliber: null, ammo_max: 0,  hash: "weapon_poolcue", ammo_box: null, need_license: true },
        { weapon: 570, caliber: null, ammo_max: 0,  hash: "weapon_stone_hatchet", ammo_box: null, need_license: true },
        { weapon: 571, caliber: 5.56, ammo_max: 30,  hash: "weapon_militaryrifle", ammo_box: 151, need_license: true },
        { weapon: 572, caliber: 9, ammo_max: 6,  hash: "weapon_gadgetpistol", ammo_box: 153, need_license: true },
        { weapon: 573, caliber: null, ammo_max: 0,  hash: "weapon_golfclub", ammo_box: null, need_license: true },
        { weapon: 574, caliber: null, ammo_max: 0,  hash: "weapon_switchblade", ammo_box: null, need_license: true },
    ]


export const getWeaponAddonKeyByItemId = (weapon: number, addon_id: number): keyof WeaponAddonsItem => {
    const q = inventoryShared.getWeaponConfigByItemId(weapon)
    if(!q) return null;
    for(let type in q.addons){
        const t = type as keyof WeaponAddonsItem
        if(q.addons[t]?.item_id === addon_id) return t
    }
    return null;
}

export const CONTAINERS_DATA:{
    /** ID предмета, который будет инвентарём (сумка, бумажник и т.д.)*/
    item_id: number,
    /** Тип хранилища. нужно создавать уникальный в OWNER_TYPES */
    owner_type: OWNER_TYPES,
    /** Максимальный вес в гр. */
    max_size: number,
    /** Список предметов, которые можно поместить в данное хранилище. Если не указывать - то можно поместить что угодно. */
    access?:number[],
    /** Внешний вид контейнера (сумки на теле), если не указать - то не будет отображаться. */
    bag_sync?: BagAttachData,
}[] = [
    {item_id: 861, owner_type: OWNER_TYPES.WALLET, max_size: 1500, access: [824, 800, 801, 802, 803, 805, 851]},
    {item_id: 2000, owner_type: OWNER_TYPES.BAG1, max_size: 10000, bag_sync: {d: 35, t: 0, p: 2}},
    {item_id: 2001, owner_type: OWNER_TYPES.BAG2, max_size: 10000, bag_sync: {d: 35, t: 1, p: 2}},
    {item_id: 2002, owner_type: OWNER_TYPES.BAG3, max_size: 10000, bag_sync: {d: 35, t: 3, p: 2}},
    {item_id: 2003, owner_type: OWNER_TYPES.BAG4, max_size: 10000, bag_sync: {d: 35, t: 4, p: 2}},
    {item_id: 2004, owner_type: OWNER_TYPES.BAG5, max_size: 10000, bag_sync: {d: 56, t: 0, p: 2}},
    {item_id: 2005, owner_type: OWNER_TYPES.BAG6, max_size: 10000, bag_sync: {d: 56, t: 1, p: 2}},
    {item_id: 2006, owner_type: OWNER_TYPES.BAG7, max_size: 10000, bag_sync: {d: 56, t: 2, p: 2}},
    {item_id: 2007, owner_type: OWNER_TYPES.BAG8, max_size: 10000, bag_sync: {d: 56, t: 3, p: 2}},
    {item_id: 2008, owner_type: OWNER_TYPES.BAG9, max_size: 10000, bag_sync: {d: 56, t: 4, p: 2}},
    {item_id: 2009, owner_type: OWNER_TYPES.BAG10, max_size: 10000, bag_sync: {d: 56, t: 5, p: 2}},
    {item_id: 2010, owner_type: OWNER_TYPES.BAG11, max_size: 30000, bag_sync: {d: 82, t: 0, p: 2}},
    {item_id: 2011, owner_type: OWNER_TYPES.BAG12, max_size: 30000, bag_sync: {d: 82, t: 1, p: 2}},
    {item_id: 2012, owner_type: OWNER_TYPES.BAG13, max_size: 30000, bag_sync: {d: 82, t: 2, p: 2}},
    {item_id: 2013, owner_type: OWNER_TYPES.BAG14, max_size: 30000, bag_sync: {d: 82, t: 3, p: 2}},
    {item_id: 2014, owner_type: OWNER_TYPES.BAG15, max_size: 30000, bag_sync: {d: 82, t: 4, p: 2}},
    {item_id: 2015, owner_type: OWNER_TYPES.BAG16, max_size: 30000, bag_sync: {d: 82, t: 5, p: 2}},
    {item_id: 2016, owner_type: OWNER_TYPES.BAG17, max_size: 30000, bag_sync: {d: 82, t: 6, p: 2}},
    {item_id: 2017, owner_type: OWNER_TYPES.BAG18, max_size: 30000, bag_sync: {d: 82, t: 7, p: 2}},
    {item_id: 2018, owner_type: OWNER_TYPES.BAG19, max_size: 30000, bag_sync: {d: 82, t: 8, p: 2}},
    {item_id: 2019, owner_type: OWNER_TYPES.BAG20, max_size: 30000, bag_sync: {d: 82, t: 9, p: 2}},
    {item_id: 2020, owner_type: OWNER_TYPES.BAG21, max_size: 30000, bag_sync: {d: 82, t: 10, p: 2}},
    {item_id: 2021, owner_type: OWNER_TYPES.BAG22, max_size: 30000, bag_sync: {d: 82, t: 11, p: 2}},
    {item_id: 2022, owner_type: OWNER_TYPES.BAG23, max_size: 30000, bag_sync: {d: 82, t: 12, p: 2}},
    {item_id: 2023, owner_type: OWNER_TYPES.BAG24, max_size: 30000, bag_sync: {d: 82, t: 14, p: 2}},
    {item_id: 2024, owner_type: OWNER_TYPES.BAG26, max_size: 30000, bag_sync: {d: 82, t: 15, p: 2}},
    {item_id: 2025, owner_type: OWNER_TYPES.BAG27, max_size: 30000, bag_sync: {d: 86, t: 0, p: 2}},
    {item_id: 2026, owner_type: OWNER_TYPES.BAG28, max_size: 30000, bag_sync: {d: 86, t: 1, p: 2}},
    {item_id: 2027, owner_type: OWNER_TYPES.BAG29, max_size: 30000, bag_sync: {d: 86, t: 2, p: 2}},
    {item_id: 2028, owner_type: OWNER_TYPES.BAG30, max_size: 30000, bag_sync: {d: 86, t: 3, p: 2}},
    {item_id: 2029, owner_type: OWNER_TYPES.BAG31, max_size: 30000, bag_sync: {d: 86, t: 4, p: 2}},
    {item_id: 2030, owner_type: OWNER_TYPES.BAG32, max_size: 30000, bag_sync: {d: 86, t: 5, p: 2}},
    {item_id: 2031, owner_type: OWNER_TYPES.BAG33, max_size: 30000, bag_sync: {d: 86, t: 6, p: 2}},
    {item_id: 2032, owner_type: OWNER_TYPES.BAG34, max_size: 30000, bag_sync: {d: 86, t: 7, p: 2}},
    {item_id: 2033, owner_type: OWNER_TYPES.BAG35, max_size: 30000, bag_sync: {d: 86, t: 8, p: 2}},
    {item_id: 2034, owner_type: OWNER_TYPES.BAG36, max_size: 30000, bag_sync: {d: 86, t: 9, p: 2}},
    {item_id: 2035, owner_type: OWNER_TYPES.BAG37, max_size: 30000, bag_sync: {d: 86, t: 10, p: 2}},
    {item_id: 2036, owner_type: OWNER_TYPES.BAG38, max_size: 30000, bag_sync: {d: 86, t: 11, p: 2}},
    {item_id: 2037, owner_type: OWNER_TYPES.BAG39, max_size: 30000, bag_sync: {d: 86, t: 12, p: 2}},
    {item_id: 2038, owner_type: OWNER_TYPES.BAG40, max_size: 30000, bag_sync: {d: 86, t: 13, p: 2}},
    {item_id: 2039, owner_type: OWNER_TYPES.BAG41, max_size: 30000, bag_sync: {d: 86, t: 14, p: 2}},
    {item_id: 2040, owner_type: OWNER_TYPES.BAG42, max_size: 30000, bag_sync: {d: 86, t: 15, p: 2}},
    {item_id: 2041, owner_type: OWNER_TYPES.BAG43, max_size: 30000, bag_sync: {d: 86, t: 16, p: 2}},
    {item_id: 2042, owner_type: OWNER_TYPES.BAG44, max_size: 30000, bag_sync: {d: 86, t: 17, p: 2}},
    {item_id: 2043, owner_type: OWNER_TYPES.BAG45, max_size: 30000, bag_sync: {d: 86, t: 18, p: 2}},
    {item_id: 2044, owner_type: OWNER_TYPES.BAG46, max_size: 30000, bag_sync: {d: 86, t: 19, p: 2}},
    {item_id: 2045, owner_type: OWNER_TYPES.BAG47, max_size: 30000, bag_sync: {d: 86, t: 20, p: 2}},
    {item_id: 2046, owner_type: OWNER_TYPES.BAG48, max_size: 30000, bag_sync: {d: 86, t: 21, p: 2}},
    {item_id: 2047, owner_type: OWNER_TYPES.BAG49, max_size: 30000, bag_sync: {d: 86, t: 22, p: 2}},
    {item_id: 2048, owner_type: OWNER_TYPES.BAG50, max_size: 30000, bag_sync: {d: 86, t: 23, p: 2}},
    {item_id: 2049, owner_type: OWNER_TYPES.BAG51, max_size: 30000, bag_sync: {d: 86, t: 24, p: 2}},
    {item_id: 2050, owner_type: OWNER_TYPES.BAG53, max_size: 18000, bag_sync: {d: 91, t: 0, p: 2}},
    {item_id: 2051, owner_type: OWNER_TYPES.BAG54, max_size: 18000, bag_sync: {d: 91, t: 1, p: 2}},
    {item_id: 2052, owner_type: OWNER_TYPES.BAG55, max_size: 18000, bag_sync: {d: 91, t: 2, p: 2}},
    {item_id: 2053, owner_type: OWNER_TYPES.BAG56, max_size: 18000, bag_sync: {d: 91, t: 3, p: 2}},
    {item_id: 2054, owner_type: OWNER_TYPES.BAG57, max_size: 23000, bag_sync: {d: 91, t: 4, p: 2}},
    {item_id: 2055, owner_type: OWNER_TYPES.BAG58, max_size: 23000, bag_sync: {d: 91, t: 6, p: 2}},
    {item_id: 2056, owner_type: OWNER_TYPES.BAG59, max_size: 23000, bag_sync: {d: 91, t: 7, p: 2}},
    {item_id: 2057, owner_type: OWNER_TYPES.BAG60, max_size: 23000, bag_sync: {d: 91, t: 8, p: 2}},
    {item_id: 2058, owner_type: OWNER_TYPES.BAG61, max_size: 7000, bag_sync: {d: 97, t: 0, p: 2}},
    {item_id: 2059, owner_type: OWNER_TYPES.BAG62, max_size: 7000, bag_sync: {d: 97, t: 1, p: 2}},
    {item_id: 2060, owner_type: OWNER_TYPES.BAG63, max_size: 7000, bag_sync: {d: 97, t: 2, p: 2}},
    {item_id: 2061, owner_type: OWNER_TYPES.BAG64, max_size: 7000, bag_sync: {d: 97, t: 3, p: 2}},
    {item_id: 2062, owner_type: OWNER_TYPES.BAG65, max_size: 7000, bag_sync: {d: 97, t: 4, p: 2}},
    {item_id: 2063, owner_type: OWNER_TYPES.BAG66, max_size: 5000, bag_sync: {d: 93, t: 0, p: 2}},
    {item_id: 2064, owner_type: OWNER_TYPES.BAG67, max_size: 5000, bag_sync: {d: 93, t: 1, p: 2}},
    {item_id: 2065, owner_type: OWNER_TYPES.BAG68, max_size: 5000, bag_sync: {d: 93, t: 2, p: 2}},
    {item_id: 2066, owner_type: OWNER_TYPES.BAG69, max_size: 5000, bag_sync: {d: 93, t: 3, p: 2}},
    {item_id: 2067, owner_type: OWNER_TYPES.BAG70, max_size: 5000, bag_sync: {d: 93, t: 4, p: 2}},
    {item_id: 2068, owner_type: OWNER_TYPES.BAG71, max_size: 18000, bag_sync: {d: 94, t: 0, p: 2}},
    {item_id: 2069, owner_type: OWNER_TYPES.BAG72, max_size: 18000, bag_sync: {d: 94, t: 1, p: 2}},
    {item_id: 2070, owner_type: OWNER_TYPES.BAG73, max_size: 18000, bag_sync: {d: 94, t: 2, p: 2}},
    {item_id: 2071, owner_type: OWNER_TYPES.BAG74, max_size: 18000, bag_sync: {d: 95, t: 0, p: 2}},
    {item_id: 2072, owner_type: OWNER_TYPES.BAG75, max_size: 18000, bag_sync: {d: 95, t: 1, p: 2}},
    {item_id: 2073, owner_type: OWNER_TYPES.BAG76, max_size: 18000, bag_sync: {d: 95, t: 2, p: 2}},
    {item_id: 2074, owner_type: OWNER_TYPES.BAG77, max_size: 23000, bag_sync: {d: 96, t: 0, p: 2}},
    {item_id: 2075, owner_type: OWNER_TYPES.BAG78, max_size: 23000, bag_sync: {d: 96, t: 1, p: 2}},
    {item_id: 2076, owner_type: OWNER_TYPES.BAG79, max_size: 23000, bag_sync: {d: 96, t: 2, p: 2}},
    {item_id: 2077, owner_type: OWNER_TYPES.BAG80, max_size: 23000, bag_sync: {d: 96, t: 3, p: 2}},
    {item_id: 2078, owner_type: OWNER_TYPES.BAG81, max_size: 23000, bag_sync: {d: 98, t: 0, p: 2}},
    {item_id: 2079, owner_type: OWNER_TYPES.BAG82, max_size: 23000, bag_sync: {d: 98, t: 1, p: 2}},
    {item_id: 2080, owner_type: OWNER_TYPES.BAG83, max_size: 23000, bag_sync: {d: 98, t: 2, p: 2}},
    {item_id: 2081, owner_type: OWNER_TYPES.BAG84, max_size: 23000, bag_sync: {d: 98, t: 4, p: 2}},
    {item_id: 2082, owner_type: OWNER_TYPES.BAG85, max_size: 23000, bag_sync: {d: 98, t: 6, p: 2}},
    {item_id: 2083, owner_type: OWNER_TYPES.BAG86, max_size: 23000, bag_sync: {d: 98, t: 7, p: 2}},
    {item_id: 2084, owner_type: OWNER_TYPES.BAG87, max_size: 23000, bag_sync: {d: 98, t: 8, p: 2}},
    {item_id: 2085, owner_type: OWNER_TYPES.BAG88, max_size: 23000, bag_sync: {d: 98, t: 9, p: 2}},
    {item_id: 2086, owner_type: OWNER_TYPES.BAG89, max_size: 23000, bag_sync: {d: 98, t: 10, p: 2}},
    {item_id: 2087, owner_type: OWNER_TYPES.BAG90, max_size: 30000, bag_sync: {d: 100, t: 0, p: 2}},
    {item_id: 2088, owner_type: OWNER_TYPES.BAG91, max_size: 30000, bag_sync: {d: 100, t: 1, p: 2}},
    {item_id: 2089, owner_type: OWNER_TYPES.BAG92, max_size: 30000, bag_sync: {d: 101, t: 0, p: 2}},
    {item_id: 2090, owner_type: OWNER_TYPES.BAG93, max_size: 30000, bag_sync: {d: 102, t: 0, p: 2}},
    {item_id: 2091, owner_type: OWNER_TYPES.BAG94, max_size: 30000, bag_sync: {d: 103, t: 0, p: 2}},
    {item_id: 2092, owner_type: OWNER_TYPES.BAG95, max_size: 30000, bag_sync: {d: 103, t: 1, p: 2}},
    {item_id: 2093, owner_type: OWNER_TYPES.BAG96, max_size: 33000, bag_sync: {d: 104, t: 0, p: 2}},
    {item_id: 2094, owner_type: OWNER_TYPES.BAG97, max_size: 33000, bag_sync: {d: 104, t: 1, p: 2}},
    {item_id: 2095, owner_type: OWNER_TYPES.BAG98, max_size: 33000, bag_sync: {d: 104, t: 2, p: 2}},
    {item_id: 2096, owner_type: OWNER_TYPES.BAG99, max_size: 33000, bag_sync: {d: 104, t: 3, p: 2}},
    {item_id: 2097, owner_type: OWNER_TYPES.BAG100, max_size: 33000, bag_sync: {d: 104, t: 4, p: 2}},
    {item_id: 2098, owner_type: OWNER_TYPES.BAG_102, max_size: 35000, bag_sync: {d: 105, t: 0, p: 2}},
    {item_id: 2099, owner_type: OWNER_TYPES.BAG_103, max_size: 35000, bag_sync: {d: 106, t: 0, p: 2}},
    {item_id: 2100, owner_type: OWNER_TYPES.BAG_104, max_size: 33000, bag_sync: {d: 107, t: 0, p: 2}},
    {item_id: 2101, owner_type: OWNER_TYPES.BAG_105, max_size: 33000, bag_sync: {d: 107, t: 1, p: 2}},
    {item_id: 2102, owner_type: OWNER_TYPES.BAG_106, max_size: 33000, bag_sync: {d: 107, t: 2, p: 2}},
    {item_id: 2103, owner_type: OWNER_TYPES.BAG_107, max_size: 33000, bag_sync: {d: 107, t: 3, p: 2}},
    {item_id: 2104, owner_type: OWNER_TYPES.BAG_108, max_size: 33000, bag_sync: {d: 107, t: 4, p: 2}},
    {item_id: 2105, owner_type: OWNER_TYPES.BAG_109, max_size: 33000, bag_sync: {d: 107, t: 5, p: 2}},
    {item_id: 2106, owner_type: OWNER_TYPES.BAG_110, max_size: 33000, bag_sync: {d: 108, t: 0, p: 2}},
    {item_id: 2107, owner_type: OWNER_TYPES.BAG_111, max_size: 33000, bag_sync: {d: 108, t: 1, p: 2}},
    {item_id: 2108, owner_type: OWNER_TYPES.BAG_112, max_size: 33000, bag_sync: {d: 108, t: 2, p: 2}},
    {item_id: 2109, owner_type: OWNER_TYPES.BAG_113, max_size: 33000, bag_sync: {d: 108, t: 3, p: 2}},
    {item_id: 2110, owner_type: OWNER_TYPES.BAG_114, max_size: 33000, bag_sync: {d: 108, t: 4, p: 2}},
    {item_id: 2111, owner_type: OWNER_TYPES.BAG_115, max_size: 33000, bag_sync: {d: 108, t: 5, p: 2}},
    {item_id: 2112, owner_type: OWNER_TYPES.BAG_116, max_size: 33000, bag_sync: {d: 108, t: 6, p: 2}},
    {item_id: 2113, owner_type: OWNER_TYPES.BAG_117, max_size: 33000, bag_sync: {d: 108, t: 7, p: 2}},
    {item_id: 2114, owner_type: OWNER_TYPES.BAG_118, max_size: 33000, bag_sync: {d: 109, t: 0, p: 2}},
    {item_id: 2115, owner_type: OWNER_TYPES.BAG_119, max_size: 33000, bag_sync: {d: 109, t: 1, p: 2}},
    {item_id: 2116, owner_type: OWNER_TYPES.BAG_120, max_size: 33000, bag_sync: {d: 109, t: 2, p: 2}},
    {item_id: 2117, owner_type: OWNER_TYPES.BAG_121, max_size: 33000, bag_sync: {d: 109, t: 3, p: 2}},
    {item_id: 2118, owner_type: OWNER_TYPES.BAG_122, max_size: 33000, bag_sync: {d: 109, t: 4, p: 2}},
    {item_id: 2119, owner_type: OWNER_TYPES.BAG_123, max_size: 33000, bag_sync: {d: 109, t: 5, p: 2}},
    {item_id: 2120, owner_type: OWNER_TYPES.BAG_124, max_size: 15000, bag_sync: {d: 110, t: 0, p: 2}},
    {item_id: 2121, owner_type: OWNER_TYPES.BAG_125, max_size: 15000, bag_sync: {d: 110, t: 1, p: 2}},
    {item_id: 2122, owner_type: OWNER_TYPES.BAG_126, max_size: 15000, bag_sync: {d: 110, t: 2, p: 2}},
    {item_id: 2123, owner_type: OWNER_TYPES.BAG_127, max_size: 15000, bag_sync: {d: 110, t: 3, p: 2}},
    {item_id: 2124, owner_type: OWNER_TYPES.BAG_128, max_size: 15000, bag_sync: {d: 110, t: 4, p: 2}},
    {item_id: 2125, owner_type: OWNER_TYPES.BAG_129, max_size: 15000, bag_sync: {d: 110, t: 5, p: 2}},
    {item_id: 2126, owner_type: OWNER_TYPES.BAG_130, max_size: 15000, bag_sync: {d: 110, t: 6, p: 2}},
    {item_id: 2127, owner_type: OWNER_TYPES.BAG_135, max_size: 25000, bag_sync: {d: 111, t: 0, p: 2}},
    {item_id: 2128, owner_type: OWNER_TYPES.BAG_136, max_size: 25000, bag_sync: {d: 112, t: 0, p: 2}},
    {item_id: 2129, owner_type: OWNER_TYPES.BAG_137, max_size: 20000, bag_sync: {d: 114, t: 0, p: 2}},
    {item_id: 2130, owner_type: OWNER_TYPES.BAG_138, max_size: 30000, bag_sync: {d: 115, t: 0, p: 2}},
    {item_id: 2131, owner_type: OWNER_TYPES.BAG_139, max_size: 30000, bag_sync: {d: 117, t: 0, p: 2}},
    {item_id: 2132, owner_type: OWNER_TYPES.BAG_140, max_size: 30000, bag_sync: {d: 117, t: 1, p: 2}},
    {item_id: 2133, owner_type: OWNER_TYPES.BAG_141, max_size: 30000, bag_sync: {d: 117, t: 2, p: 2}},
    {item_id: 2134, owner_type: OWNER_TYPES.BAG_142, max_size: 30000, bag_sync: {d: 117, t: 3, p: 2}},
    {item_id: 2135, owner_type: OWNER_TYPES.BAG_143, max_size: 30000, bag_sync: {d: 117, t: 5, p: 2}},
    {item_id: 2136, owner_type: OWNER_TYPES.BAG_144, max_size: 30000, bag_sync: {d: 117, t: 6, p: 2}},
    {item_id: 2137, owner_type: OWNER_TYPES.BAG_145, max_size: 30000, bag_sync: {d: 117, t: 7, p: 2}},
    {item_id: 2138, owner_type: OWNER_TYPES.BAG_146, max_size: 30000, bag_sync: {d: 117, t: 8, p: 2}},
    {item_id: 2139, owner_type: OWNER_TYPES.BAG_147, max_size: 30000, bag_sync: {d: 117, t: 9, p: 2}},
    {item_id: 2140, owner_type: OWNER_TYPES.BAG_148, max_size: 30000, bag_sync: {d: 117, t: 10, p: 2}},
    {item_id: 2141, owner_type: OWNER_TYPES.BAG_149, max_size: 30000, bag_sync: {d: 117, t: 11, p: 2}},
    {item_id: 2142, owner_type: OWNER_TYPES.BAG_150, max_size: 30000, bag_sync: {d: 118, t: 0, p: 2}},
    {item_id: 2143, owner_type: OWNER_TYPES.BAG_151, max_size: 30000, bag_sync: {d: 119, t: 0, p: 2}},
    {item_id: 2144, owner_type: OWNER_TYPES.BAG_152, max_size: 35000, bag_sync: {d: 120, t: 0, p: 2}},
    {item_id: 2145, owner_type: OWNER_TYPES.BAG_153, max_size: 35000, bag_sync: {d: 121, t: 0, p: 2}},
    {item_id: 2146, owner_type: OWNER_TYPES.BAG_154, max_size: 25000, bag_sync: {d: 122, t: 0, p: 2}},
    {item_id: 2147, owner_type: OWNER_TYPES.BAG_155, max_size: 25000, bag_sync: {d: 122, t: 1, p: 2}},
    //! Данный кусок не трогать, нужен для модификаций оружия
    ...weapon_list.filter(q => q.addons).map(q => {
        let access: number[] = []
        for(let type in q.addons){
            const t = type as keyof WeaponAddonsItem
            if(q.addons[t]?.item_id) access.push(q.addons[t]?.item_id)
        }
        return {
            item_id: q.weapon,
            owner_type: OWNER_TYPES.WEAPON_MODS,
            max_size: 10000,
            access
        }
    })
]


let itemsAttachBody = itemsList.filter(q => q.attachBody)

export const inventoryShared = {
    get items(): itemConfig[]{
        return itemsList
    },
    get itemsHand(): itemConfig[]{
        return itemsList.filter(q => q.inHand)
    },
    get itemsAttachBody(): itemConfig[]{
        return itemsAttachBody
    },
    get: (item_id: number) => inventoryShared.items.find(item => item.item_id == item_id),
    getWeaponConfigByItemId: (id: number) => {
        return weapon_list.find(q => q.weapon == id);
    },
    getWeaponNameByHash: (hash: string) => {
        hash = hash.replace('weapon_', '');
        let cfg = weapon_list.find(q => q.hash.includes(hash));
        if(!cfg) return null;
        const item = inventoryShared.get(cfg.weapon);
        if(!item) return null;
        return item.name
    },
    getWeaponConfigByHash: (hash: string) => {
        if(!hash) return null;
        hash = hash.toLowerCase().replace('weapon_', '');
        let cfg = weapon_list.find(q => q.hash.includes(hash));
        if(!cfg) return null;
        const item = inventoryShared.get(cfg.weapon);
        if(!item) return null;
        return inventoryShared.getWeaponConfigByItemId(item.item_id)
    },
    get weapons(){
        return weapon_list
    }
}
