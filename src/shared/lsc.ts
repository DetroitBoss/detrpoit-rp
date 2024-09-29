export interface lscUpgrade {
    /** ID элемента, который будет приходить в интерфейс, от него берутся все данные */
    id: number,
    /** Название */
    name: string,
    /** ID раздела, если ни одного элемента с ID какого то раздела нет, то раздел не выводить в интерфейс вообще */
    section_type: number,
    /** Нужно ли выводить окно с цветами, и тип для выбора тоже ставить как "Цвет" */
    isColor?: boolean,
    /** Элементов для выбора (это если нет цвета) (например ['Включено','Выключено'] или ['Колеса 1', 'Колеса 2', 'Колеса 3'] и т.д.) */
    elements?: { id:number, name: number | string, percent: number, isUsed?: boolean, isBuy?: boolean }[],
    /** Текущий элемент (только для цефа) */
    currentElement?: number,
    /** Имеется ли текущий элемент тюнинга на складе у владельца */
    available?: boolean,
    /**Закупочная цена*/
    // cost: number,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS, т.е. [ 'sportwheels', 'suvwheels' и тд ]*/
    isWheelType?: boolean,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS индекса выбранного выше */
    isWheelTypeValue?: boolean,
    /** Если true то выводить модуль который над выбором цвета с выбором одного из LSC_COLOR_MODS (где в примере интерфейса написано Глянцевый).  */
    isColorMod?: boolean,
    /** текущий цвет если есть */
    color?: {r: number, g: number, b: number},
    /** текущий тип цвета из LSC_COLOR_MODS (index) если есть */
    colorMod?: number,
    /** выбранный цвет */
    selectColor?: {r: number, g: number, b: number},
    /** выбранный тип цвета из LSC_COLOR_MODS (index) */
    selectColorMod?: number,
}

// !(ВАЖНО) В интерфейс буду слать ( carName: string (название авто), [ ]: lscUpgrade[] )
// !(ВАЖНО) Из интерфейса буду ждать на клиенте массив из buyUpgrades[]


export const LSC_VEHICLE_POS = { x: -846.66, y: -279.26, z: -9.16, h: 0 }
/** Сколько получит бизнес % от стоимости закупки */
export const LSC_PROFIT_PERCENT = 15;

export interface buyUpgrades {
    id: number,
    color: [number, number, number],
    colorMod: number,
    selectedElementID: number
}

export interface LSC_SECTION_TYPES_I {
    id:number,
    name:string,
    /** название картинки, для Витали, можно поменять и на ID картинки, как тебе удобнее */
    imgName: string
}

export const LSC_COLOR_MODS = [
    { name: "Нет доп. цвета", index: 0 }, {"name":"Металлик","index":2},{"name":"Матовый","index":12},{"name":"Блестящий матовый","index":85},{"name":"Асфальт","index":120},{"name":"Глянцевый","index":157},{"name":"Светло-глянцевый","index":158},{"name":"Ярко-глянцевый","index":159},{"name":"Светящий-глянцевый","index":160}
]


export const LSC_WHEEL_COLOR_MODS = [
    { name: "Черный металлик", index: 0 }, {"name":"Чёрный графит","index":1},{"name":"Чёрная сталь","index":2},{"name":"Тёмное серебро","index":3},
    {"name":"Серебро","index":4},{"name":"Синие серебро","index":5}, { "name": "Серая сталь", "index": 6 }, { "name": "Серебрянная тень", "index": 7 },
    { "name": "Камменое серебро", "index": 8 }, { "name": "Полуночное серебро", "index": 9 }, { "name": "Оружейный Металл", "index": 10 }, { "name":"Серый Антрацит","index":11},
    {"name":"Матовый чёрный","index":12},{"name":"Матовый сервый","index":13},{"name":"Светло-серый","index":14},{"name":"Потёртый чёрный","index":21},{"name":"Потёртый графит","index":22},
    {"name":"Изношенный серебристо-серый","index":23}, {"name":"Потрёпанное серебро","index":24},{"name":"Потрёпанное синее серебро","index":25},
    {"name":"Потрёпанное тёмное серебро","index":26},{"name":"Красный металлик","index":27}, {"name":"Ярко-красный металлик","index":28},{"name":"Тёмно-красный металлик","index":29},
    {"name":"Красная пустыня","index":33},{"name":"Красный каберне","index":34},{"name":"Малиновый металлик","index":35},
    {"name":"Ораньжевый санрайз","index":36},{"name":"Классическое золото","index":37},{"name":"Ораньжевый","index":38},{"name":"Матовый красный","index":39},
    {"name":"Матовый тёмно-красный","index":40},{"name":"Матовый ораньжевый","index":41},
    {"name":"Матовый жёлтый","index":42},{"name":"Тёмно-зелёный металлик","index":49},{"name":"Гоночный зелёный","index":50},{"name":"Морской зелёный","index":51},
    {"name":"Оливково-зелёный","index":52},{"name":"Зелёный","index":53},{"name":"Сине-зелёный металлик","index":54},{"name":"Лаймовый","index":55},{"name":"Тёмно синий","index":64},
    {"name":"Синий","index":70},{"name":"Фиолетово-синий метлаик","index":71}, {"name":"Фиолетовый","index":81},{"name":"Матовый тёмно-синий","index":82},{"name":"Матовый синий","index":83},
    {"name":"Полуночно-синий","index":84},{"name":"Жёлтое такси","index":88},{"name":"Гоночный жёлтый","index":89},
    {"name":"Металическая бронза","index":90},{"name":"Жёлтая птица","index":91},{"name":"Бежёвый Пуэбло","index":94},{"name":"Тёмная слоновая кость","index":95},
    {"name":"Металлический бук","index":102},{"name":"Тёмный бук","index":103},{"name":"Коричневый","index":104},{"name":"Пляжный песок","index":105},{"name":"Бежевый","index":107},
    {"name":"Белый металлик","index":111},{"name":"Холодный белый","index":112},{"name":"Медово бежевый","index":113},{"name":"Светло-оранжевый","index":124},
    {"name":"Бирюзовый","index":127},{"name":"Зелёный матовый","index":128},{"name":"Коричневый матовый","index":129},{"name":"Розовый","index":135},
    {"name":"Фиолетовый металлик","index":145},{"name":"Чистое золото","index":160}
]

export const LSC_SECTION_TYPES: LSC_SECTION_TYPES_I[] = [
    {
        id: 1,
        name: 'Внешний тюнинг',
        imgName: 'tuning-tab-1'
    },
    {
        id: 2,
        name: 'Внутренний тюнинг',
        imgName: 'tuning-tab-2'
    },
    {
        id: 3,
        name: 'Освещение',
        imgName: 'tuning-tab-3'
    }
]
type LSC_WHEELS_TYPE = {
    name: string;
    type: number;
    percent: number;
    elements: [string , number][];
}[]
export const LSC_WHEELS:LSC_WHEELS_TYPE = [
    {
        name: 'Sport Wheels',
        type: 0,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Inferno', 0], ['Deepfive', 1], ['Lozspeed', 2], ['Diamondcut', 3], ['Chrono', 4], ['Feroccirr', 5], ['Fiftynine', 6], ['Mercie', 7], ['Syntheticz', 8], ['Organictyped', 9], ['Endov1', 10], ['Duper7', 11], ['Uzer', 12],
            ['Groundride', 13], ['Spacer', 14], ['Venum', 15], ['Cosmo', 16], ['Dashvip', 17], ['Icekid', 18], ['Ruffeld', 19], ['Wangenmaster', 20], ['Superfive', 21], ['Endov2', 22], ['Slitsix', 23]
        ]
    },
    {
        name: 'Muscle Wheels',
        type: 1,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Classicfive', 0], ['Dukes', 1], ['Musclefreak', 2], ['Kracka', 3], ['Azrea', 4], ['Mecha', 5], ['Blacktop', 6], ['Dragspl', 7], ['Revolver', 8], ['Classicrod', 9], ['Spooner', 10], ['Fivestar', 11], ['Oldschool', 12],
            ['Eljefe', 13], ['Dodman', 14], ['Sixgun', 15], ['Mercenary', 16]
        ]
    },
    {
        name: 'Lowrider Wheels',
        type: 2,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Flare', 0], ['Wired', 1], ['Triplegolds', 2], ['Bigworm', 3], ['Sevenfives', 4], ['Splitsix', 5], ['Freshmesh', 6], ['Leadsled', 7], ['Turbine', 8], ['Superfin', 9], ['Classicrod', 10], ['Dollar', 11], ['Dukes', 12],
            ['Lowfive', 13], ['Gooch', 14]
        ]
    },
    {
        name: 'SUV Wheels',
        type: 3,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Vip', 0], ['Benefactor', 1], ['Cosmo', 2], ['Bippu', 3], ['Royalsix', 4], ['Fagorme', 5], ['Deluxe', 6], ['Icedout', 7], ['Cognscenti', 8], ['Lozspeedten', 9], ['Supernova', 10], ['Obeyrs', 11], ['Lozspeedballer', 12],
            ['Extra vaganzo', 13], ['Splitsix', 14], ['Empowered', 15], ['Sunrise', 16], ['Dashvip', 17], ['Cutter', 18]
        ]
    },
    {
        name: 'Offroad Wheels',
        type: 4,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Raider', 0], ['Nevis', 2], ['Cairngorm', 3], ['Amazon', 4], ['Challenger', 5], ['Dunebasher', 6], ['Fivestar', 7], ['Rockcrawler', 8], ['Milspecsteelie', 9]
        ]
    },
    {
        name: 'Tuner Wheels',
        type: 5,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Cosmo', 0], ['Supermesh', 1], ['Outsider', 2], ['Rollas', 3], ['Driffmeister', 4], ['Slicer', 5], ['Elquatro', 6], ['Dubbed', 7], ['Fivestar', 8], ['Slideways', 9], ['Apex', 10], ['Stancedeg', 11], ['Countersteer', 12],
            ['Endov1', 13], ['Endov2dish', 14], ['Guppez', 15], ['Chokadori', 16], ['Chicane', 17], ['Saisoku', 18], ['Dishedeight', 19], ['Fujiwara', 20], ['Zokusha', 21], ['Battlevill', 22], ['Rallymaster', 23]
        ]
    },
    {
        name: 'Highend Wheels',
        type: 7,
        percent: 0.06,
        elements: [
            ['Stock', -1],
            ['Shadow', 0], ['Hyper', 1], ['Blade', 2], ['Diamond', 3], ['Supagee', 4], ['Chromaticz', 5], ['Merciechlip', 6], ['Obeyrs', 7], ['Gtchrome', 8], ['Cheetahr', 9], ['Solar', 10], ['Splitten', 11], ['Dashvip', 12],
            ['Lozspeedten', 13], ['Carboninferno', 14], ['Carbonshadow', 15], ['Carbonz', 16], ['Carbonsolar', 17], ['Carboncheetahr', 18], ['Carbonsracer', 19]
        ]
    }
]
//
// export const LSC_WHEELS = {
//     // "frontwheel": [
//     //     {"name": "Stock", "wtype": 6, "index": -1},{"name": "Speedway", "wtype": 6, "index": 0},
//     //     {"name": "Streetspecial", "wtype": 6, "index": 1},{"name": "Racer", "wtype": 6, "index": 2},
//     //     {"name": "Trackstar", "wtype": 6, "index": 3},{"name": "Overlord", "wtype": 6, "index": 4},
//     //     {"name": "Trident", "wtype": 6, "index": 5},{"name": "Triplethreat", "wtype": 6, "index": 6},
//     //     {"name": "Stilleto", "wtype": 6, "index": 7},{"name": "Wires", "wtype": 6, "index": 8},
//     //     {"name": "Bobber", "wtype": 6, "index": 9},{"name": "Solidus", "wtype": 6, "index": 10},
//     //     {"name": "Iceshield", "wtype": 6, "index": 11},{"name": "Loops", "wtype": 6, "index": 12}
//     // ],
//     //     "backwheel": [
//     //     {"name": "Stock", "wtype": 6, "index": -1},{"name": "Speedway", "wtype": 6, "index": 0},
//     //     {"name": "Streetspecial", "wtype": 6, "index": 1},{"name": "Racer", "wtype": 6, "index": 2},
//     //     {"name": "Trackstar", "wtype": 6, "index": 3},{"name": "Overlord", "wtype": 6, "index": 4},
//     //     {"name": "Trident", "wtype": 6, "index": 5},{"name": "Triplethreat", "wtype": 6, "index": 6},
//     //     {"name": "Stilleto", "wtype": 6, "index": 7},{"name": "Wires", "wtype": 6, "index": 8},
//     //     {"name": "Bobber", "wtype": 6, "index": 9},{"name": "Solidus", "wtype": 6, "index": 10},
//     //     {"name": "Iceshield", "wtype": 6, "index": 11},{"name": "Loops", "wtype": 6, "index": 12}
//     // ],
//
// }


export interface vehicleModItemBase {
    /** ID слота мода */
    id: number;
    /** Название мода */
    name: string;
    /** Раздел мода */
    sector: number;
    /** С какого уровня бизнеса данная штука будет доступна для заказа */
    level:0|1|2;
    target?:"car"|"bike"|"all",
    /** Процент от стоимости машины, который будет минимальной ценой на штуку */
    percent: number,
    isColor?: boolean
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS, т.е. [ 'sportwheels', 'suvwheels' и тд ]*/
    isWheelType?: boolean,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS индекса выбранного выше */
    isWheelTypeValue?: boolean,
    /** Если true то выводить модуль который над выбором цвета с выбором одного из LSC_COLOR_MODS (где в примере интерфейса написано Глянцевый).  */
    isColorMod?: boolean,
    default?: number,
    // Закупочная стоимость
    cost: number,
}


export const enum MOD_SECTOR {
    /** Визуальный тюнинг */
    VISUAL = 1,
    /** Внутренний тюнинг */
    PERMORMANCE = 2,
    /** Освещение */
    LIGHT = 3,
}

/** Стоимость покраски */
export const VEHICLE_COLOR_COST = 2000
/** Стоимость винила */
export const VEHICLE_LIVERY_COST = 15000

/**
 * !!! LEGACY конфиг. Предоставляет стандартные значения для конфига, который в бд (LscConfigEntity)
 */
export const vehicleModsList: (vehicleModItemBase)[] = [
    { level: 0, percent: 0.07, id: 1000, name: "Основной цвет", sector: MOD_SECTOR.VISUAL, isColor: true, isColorMod: true, cost: 15000 },
    { level: 0, percent: 0.05, id: 1001, name: "Дополнительный цвет", sector: MOD_SECTOR.VISUAL, isColor: true, isColorMod: true, cost: 13000 },


    { level: 0, percent: 0.05, id: 0, name: "Спойлер", sector: MOD_SECTOR.VISUAL, default: -1, cost: 18000 }, // +
    { level: 0, percent: 0.05, id: 1, name: "Передний бампер", sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 2, name: "Задний бампер", sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 3, name: "Юбки", sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 4, name: "Глушитель", sector: MOD_SECTOR.VISUAL, default: -1, cost: 15000 }, // +
    { level: 0, percent: 0.05, id: 5, name: "Рама каркаса", sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 6, name: "Решетка", sector: MOD_SECTOR.VISUAL, default: -1, cost: 12000 }, // +
    { level: 0, percent: 0.06, id: 7, name: "Капот", sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 8, name: "Крыло", sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 9, name: "Правое крыло", sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 10, name: "Крыша", sector: MOD_SECTOR.VISUAL, default: -1, cost: 40000 }, // +
    { level: 0, percent: 0.02, id: 11, name: "Двигатель", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 70000 }, // +
    { level: 0, percent: 0.02, id: 12, name: "Тормоза", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 50000 }, // +
    { level: 0, percent: 0.02, id: 13, name: "Трансмиссия", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 60000 }, // +
    { level: 0, percent: 0.01, id: 14, name: "Гудок", sector: MOD_SECTOR.VISUAL, default: -1, cost: 15000 }, // +
    { level: 0, percent: 0.02, id: 15, name: "Подвеска", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 55000 }, // +
    { level: 0, percent: 0.11, id: 18, name: "Турбо", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 100000 }, // +
    { level: 0, percent: 0.04, id: 27, name: "Отделка салона", sector: MOD_SECTOR.VISUAL, default: -1, cost: 10000 }, // +
    { level: 0, percent: 0.04, id: 28, name: "Украшения", sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // ?
    { level: 0, percent: 0.04, id: 29, name: "Интерьер салона", sector: MOD_SECTOR.VISUAL, default: -1, cost: 10000 }, // +
    { level: 0, percent: 0.03, id: 30, name: "Дизайн циферблата", sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.03, id: 31, name: "Внутренняя обшивка двери", sector: MOD_SECTOR.VISUAL, default: -1, cost: 2000 }, // +
    { level: 0, percent: 0.03, id: 32, name: "Сиденья", sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.03, id: 33, name: "Руль", sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.03, id: 34, name: "Рычаг КП", sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.03, id: 35, name: "Бляшки", sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.2, id: 38, name: "Гидравлика", sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 80000 }, // +
    { level: 0, percent: 0.1, id: 39, name: "Вид двигателя", sector: MOD_SECTOR.VISUAL, default: -1, cost: 70000 }, // ?
    { level: 0, percent: 0.07, id: 40, name: "Воздушный фильтр", sector: MOD_SECTOR.VISUAL, default: -1, cost: 12000 }, // +
    { level: 0, percent: 0.07, id: 41, name: "Стойки", sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.05, id: 42, name: "Передние фары", sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.02, id: 43, name: "Замок капота", sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.15, id: 55, name: "Тонировка", sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 },
    { level: 0, percent: 0.17, id: 48, name: "Винил", sector: MOD_SECTOR.VISUAL, default: -1, cost: 20000 }, // +
    { level: 0, percent: 0.03, id: 46, name: "Отделка окна", sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +


    { level: 0, percent: 0.03, id: 4000, name: "Неон слева", sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4001, name: "Неон справа", sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4002, name: "Неон спереди", sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4003, name: "Неон сзади", sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4004, name: "Цвет неона", sector: MOD_SECTOR.LIGHT, isColor: true, target: "car", cost: 25000 },

    { level: 0, percent: 0.04, id: 1005, name: "Материал основного цвета", sector: MOD_SECTOR.VISUAL, default: 0, cost: 5000 },
    { level: 0, percent: 0.03, id: 1006, name: "Материал дополнительного цвета", sector: MOD_SECTOR.VISUAL, default: 0, cost: 5000 },

    { level: 0, percent: 0.05, id: 25, name: "Номерная рамка", sector: MOD_SECTOR.VISUAL, default: 0, cost: 12000 }, // +
    { level: 0, percent: 0.05, id: 1007, name: "Стиль номерной рамки", sector: MOD_SECTOR.VISUAL, target: "car", default: 0, cost: 12000 }, // +

    { level: 0, percent: 0.02, id: 22, name: "Ксенон", sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 25000 }, // +
    { level: 0, percent: 0.01, id: 1008, name: "Цвет ксенона", sector: MOD_SECTOR.LIGHT, target: "car", cost: 30000 },


    { level: 0, percent: 0.05, id: 2999, name: "Тип колёс", sector: MOD_SECTOR.VISUAL, target: "car", cost: 20000 }, // +
    { level: 0, percent: 0.03, id: 62, name: "Колёса", sector: MOD_SECTOR.VISUAL, target: "car", cost: 20000 }, // +
    { level: 0, percent: 0.01, id: 3000, name: "Цвет колёс", sector: MOD_SECTOR.VISUAL, target: "car", cost: 12000 }, // +

    { level: 0, percent: 0.02, id: 3001, name: "Дым от колёс", sector: MOD_SECTOR.VISUAL, default: -1, cost: 35000 }, // +
    { level: 0, percent: 0.02, id: 3002, name: "Цвет дыма от колёс", sector: MOD_SECTOR.VISUAL, isColor: true, cost: 40000 }, // +


    { level: 0, percent: 0.25, id: 3004, name: "Дрифт мод", sector: MOD_SECTOR.PERMORMANCE, target: "car", default: -1, cost: 150000 }, // +
]

// Тонировка
export const lscTintUpgrades = [
    { name: 'Pure Black', value: 0, percent: 0.02 },
    { name: 'Darksmoke', value: 1, percent: 0.08 },
    { name: 'Lightsmoke', value: 2, percent: 0.03 },
    { name: 'Limo', value: 3, percent: 0.025 },
    { name: 'Green', value: 4, percent: 0.025 },
]


// export const lscArmourUpgrades = [
//     { name: 'Без брони', value: -1, percent: 1000 },
//     { name: 'Броня 20%', value: 0, percent: 2000 },
//     { name: 'Броня 40%', value: 1, percent: 3000 },
//     { name: 'Броня 60%', value: 2, percent: 1500 },
//     { name: 'Броня 80%', value: 3, percent: 2500 },
//     { name: 'Броня 100%', value: 4, percent: 1800 },
// ]


export const lscSuspensionUpgrades = [
    { name: 'Standard Suspension', value: -1, percent: 0.02 },
    { name: 'Lowered Suspension', value: 0, percent: 0.03 },
    { name: 'Street Suspension', value: 1, percent: 0.04 },
    { name: 'Sport Suspension', value: 2, percent: 0.05 },
    { name: 'Race Suspension', value: 3, percent: 0.06 }
]


export const lscTransmissionUpgrades = [
    { name: 'Standard Transmission', value: -1, percent: 0.02 },
    { name: 'Street Transmission', value: 0, percent: 0.03 },
    { name: 'Sport Transmission', value: 1, percent: 0.04 },
    { name: 'Race Transmission', value: 2, percent: 0.05 }
]


export const lscBrakeUpgrades = [
    { name: 'Standard Brakes', value: -1, percent: 0.02 },
    { name: 'Street Brakes', value: 0, percent: 0.03 },
    { name: 'Sport Brakes', value: 1, percent: 0.04 },
    { name: 'Race Brakes', value: 2, percent: 0.05 }
]


export const lscNumberUpgrades = [
    { name: 'Рамка 1', value: 0, percent: 0.02 },
    { name: 'Рамка 2', value: 1, percent: 0.02 },
    { name: 'Рамка 3', value: 2, percent: 0.02 },
    { name: 'Рамка 4', value: 3, percent: 0.02 },
    { name: 'Рамка 5', value: 4, percent: 0.02 },
    { name: 'Рамка 6', value: 5, percent: 0.02 }
]


export const lscEngineUpgrades = [
    { name: 'Standard Engine', value: -1, percent: 0.02 },
    { name: 'EMS-Improvement 1', value: 0, percent: 0.04 },
    { name: 'EMS-Improvement 2', value: 1, percent: 0.06 },
    { name: 'EMS-Improvement 3', value: 2, percent: 0.08 },
    { name: 'EMS-Improvement 4', value: 3, percent: 0.1 }
]


export const lscXenonColorUpgrades = [
    { name: 'Stock', value: 255, percent: 0.02 },
    { name: 'White', value: 0, percent: 0.02 },
    { name: 'Blue', value: 1, percent: 0.02 },
    { name: 'Electric Blue', value: 2, percent: 0.02 },
    { name: 'Mint Green', value: 3, percent: 0.02 },
    { name: 'Lime Green', value: 4, percent: 0.02 },
    { name: 'Yellow', value: 5, percent: 0.02 },
    { name: 'Golden Shower', value: 6, percent: 0.02 },
    { name: 'Orange', value: 7, percent: 0.02 },
    { name: 'Red', value: 8, percent: 0.02 },
    { name: 'Pony Pink', value: 9, percent: 0.02 },
    { name: 'Hot Pink', value: 10, percent: 0.02 },
    { name: 'Purple', value: 11, percent: 0.02 },
    { name: 'Blacklight', value: 12, percent: 0.02 },
]

/** Профит бизнеса от покупки игроком на totalTuningCost */
export const getProfitFromTuningCost = (totalTuningCost: number) => 
    totalTuningCost * LSC_PROFIT_PERCENT / 100

export const convertModCostFromCarCost = (percent: number, carCost: number) => Math.floor(percent * carCost)

const vehicleBones = ['chassis', 'chassis_lowlod',  'chassis_dummy', 'seat_dside_f',  'seat_dside_r', 'seat_dside_r1', 'seat_dside_r2', 'seat_dside_r3', 'seat_dside_r4', 'seat_dside_r5', 'seat_dside_r6',
    'seat_dside_r7', 'seat_pside_f', 'seat_pside_r', 'seat_pside_r1', 'seat_pside_r2', 'seat_pside_r3', 'seat_pside_r4',  'seat_pside_r5', 'seat_pside_r6', 'seat_pside_r7', 'window_lf1', 'window_lf2',
    'window_lf3', 'window_rf1', 'window_rf2', 'window_rf3', 'window_lr1', 'window_lr2', 'window_lr3', 'window_rr1', 'window_rr2', 'window_rr3', 'door_dside_f', 'door_dside_r', 'door_pside_f', 'door_pside_r',
    'handle_dside_f', 'handle_dside_r', 'handle_pside_f', 'handle_pside_r', 'wheel_lf', 'wheel_rf', 'wheel_lm1', 'wheel_rm1', 'wheel_lm2', 'wheel_rm2', 'wheel_lm3', 'wheel_rm3', 'wheel_lr', 'wheel_rr',
    'suspension_lf', 'suspension_rf', 'suspension_lm', 'suspension_rm', 'suspension_lr', 'suspension_rr', 'spring_rf', 'spring_lf', 'spring_rr', 'spring_lr', 'transmission_f', 'transmission_m', 'transmission_r',
    'hub_lf', 'hub_rf', 'hub_lm1', 'hub_rm1', 'hub_lm2', 'hub_rm2', 'hub_lm3', 'hub_rm3', 'hub_lr', 'hub_rr', 'windscreen', 'windscreen_r', 'window_lf', 'window_rf', 'window_lr',  'window_rr', 'window_lm',
    'window_rm', 'bodyshell', 'bumper_f', 'bumper_r', 'wing_rf', 'wing_lf', 'bonnet', 'boot', 'exhaust', 'exhaust_2', 'exhaust_3', 'exhaust_4', 'exhaust_5', 'exhaust_6', 'exhaust_7', 'exhaust_8', 'exhaust_9',
    'exhaust_10', 'exhaust_11',  'exhaust_12', 'exhaust_13',  'exhaust_14', 'exhaust_15', 'exhaust_16', 'engine', 'overheat', 'overheat_2', 'petrolcap', 'petroltank', 'petroltank_l', 'petroltank_r',     'steering',
    'hbgrip_l', 'hbgrip_r', 'headlight_l', 'headlight_r', 'taillight_l', 'taillight_r', 'indicator_lf', 'indicator_rf', 'indicator_lr', 'indicator_rr', 'brakelight_l', 'brakelight_r', 'brakelight_m', 'reversinglight_l', 'reversinglight_r',
    'extralight_1', 'extralight_2', 'extralight_3', 'extralight_4', 'numberplate', 'interiorlight', 'siren1',  'siren2', 'siren3', 'siren4', 'siren5', 'siren6', 'siren7', 'siren8', 'siren9', 'siren10', 'siren11', 'siren12', 'siren13',
    'siren14', 'siren15', 'siren16', 'siren17', 'siren18', 'siren19', 'siren20', 'siren_glass1', 'siren_glass2', 'siren_glass3', 'siren_glass4', 'siren_glass5', 'siren_glass6', 'siren_glass7', 'siren_glass8', 'siren_glass9',
    'siren_glass10', 'siren_glass11', 'siren_glass12', 'siren_glass13', 'siren_glass14', 'siren_glass15', 'siren_glass16',  'siren_glass17',  'siren_glass18',  'siren_glass19',  'siren_glass20',  'spoiler', 'struts',
    'misc_a', 'misc_b', 'misc_c', 'misc_d',  'misc_e', 'misc_f',  'misc_g', 'misc_h', 'misc_i', 'misc_j', 'misc_k', 'misc_l', 'misc_m', 'misc_n', 'misc_o', 'misc_p', 'misc_q', 'misc_r', 'misc_s', 'misc_t', 'misc_u', 'misc_v',
    'misc_w', 'misc_x', 'misc_y', 'misc_z',  'misc_1', 'misc_2',  'weapon_1a', 'weapon_1b', 'weapon_1c', 'weapon_1d', 'weapon_1a_rot', 'weapon_1b_rot', 'weapon_1c_rot', 'weapon_1d_rot', 'weapon_2a',
    'weapon_2b', 'weapon_2c', 'weapon_2d', 'weapon_2a_rot', 'weapon_2b_rot', 'weapon_2c_rot',  'weapon_2d_rot', 'weapon_3a', 'weapon_3b', 'weapon_3c', 'weapon_3d', 'weapon_3a_rot', 'weapon_3b_rot',
    'weapon_3c_rot', 'weapon_3d_rot', 'weapon_4a', 'weapon_4b', 'weapon_4c', 'weapon_4d',  'weapon_4a_rot', 'weapon_4b_rot', 'weapon_4c_rot', 'weapon_4d_rot', 'turret_1base', 'turret_1barrel',
    'turret_2base',  'turret_2barrel', 'turret_3base', 'turret_3barrel', 'ammobelt', 'searchlight_base',  'searchlight_light', 'attach_female', 'roof', 'roof2',  'soft_1', 'soft_2', 'soft_3', 'soft_4', 'soft_5', 'soft_6',
    'soft_7', 'soft_8', 'soft_9', 'soft_10', 'soft_11', 'soft_12', 'soft_13', 'forks', 'mast', 'carriage', 'fork_l', 'fork_r', 'forks_attach', 'frame_1', 'frame_2', 'frame_3', 'frame_pickup_1', 'frame_pickup_2', 'frame_pickup_3',
    'frame_pickup_4',  'freight_cont', 'freight_bogey', 'freightgrain_slidedoor', 'door_hatch_r', 'door_hatch_l', 'tow_arm', 'tow_mount_a', 'tow_mount_b', 'tipper', 'combine_reel', 'combine_auger', 'slipstream_l',
    'slipstream_r',  'arm_1', 'arm_2', 'arm_3', 'arm_4', 'scoop', 'boom', 'stick', 'bucket', 'shovel_2', 'shovel_3', 'Lookat_UpprPiston_head', 'Lookat_LowrPiston_boom', 'Boom_Driver', 'cutter_driver', 'vehicle_blocker',
    'extra_1', 'extra_2', 'extra_3', 'extra_4', 'extra_5', 'extra_6', 'extra_7', 'extra_8', 'extra_9', 'extra_ten', 'extra_11', 'extra_12', 'break_extra_1', 'break_extra_2', 'break_extra_3', 'break_extra_4', 'break_extra_5',
    'break_extra_6',  'break_extra_7', 'break_extra_8', 'break_extra_9', 'break_extra_10', 'mod_col_1', 'mod_col_2', 'mod_col_3', 'mod_col_4', 'mod_col_5', 'handlebars', 'forks_u', 'forks_l', 'wheel_f',
    'swingarm', 'wheel_r', 'crank', 'pedal_r', 'pedal_l', 'static_prop', 'moving_prop', 'static_prop2', 'moving_prop2', 'rudder', 'rudder2', 'wheel_rf1_dummy','wheel_rf2_dummy', 'wheel_rf3_dummy', 'wheel_rb1_dummy',
    'wheel_rb2_dummy', 'wheel_rb3_dummy', 'wheel_lf1_dummy', 'wheel_lf2_dummy', 'wheel_lf3_dummy', 'wheel_lb1_dummy', 'wheel_lb2_dummy', 'wheel_lb3_dummy', 'bogie_front', 'bogie_rear', 'rotor_main',
    'rotor_rear', 'rotor_main_2', 'rotor_rear_2', 'elevators', 'tail', 'outriggers_l', 'outriggers_r', 'rope_attach_a', 'rope_attach_b', 'prop_1', 'prop_2', 'elevator_l', 'elevator_r', 'rudder_l', 'rudder_r', 'prop_3', 'prop_4',
    'prop_5', 'prop_6', 'prop_7', 'prop_8',  'rudder_2',  'aileron_l', 'aileron_r', 'airbrake_l', 'airbrake_r', 'wing_l', 'wing_r', 'wing_lr', 'wing_rr', 'engine_l', 'engine_r', 'nozzles_f', 'nozzles_r', 'afterburner', 'wingtip_1',
    'wingtip_2', 'gear_door_fl', 'gear_door_fr', 'gear_door_rl1', 'gear_door_rr1', 'gear_door_rl2', 'gear_door_rr2', 'gear_door_rml', 'gear_door_rmr', 'gear_f', 'gear_rl', 'gear_lm1', 'gear_rr', 'gear_rm1', 'gear_rm',
    'prop_left', 'prop_right', 'legs', 'attach_male', 'draft_animal_attach_lr', 'draft_animal_attach_rr', 'draft_animal_attach_lm', 'draft_animal_attach_rm', 'draft_animal_attach_lf', 'draft_animal_attach_rf', 'wheelcover_l',
    'wheelcover_r', 'barracks', 'pontoon_l', 'pontoon_r', 'no_ped_col_step_l', 'no_ped_col_strut_1_l', 'no_ped_col_strut_2_l', 'no_ped_col_step_r', 'no_ped_col_strut_1_r', 'no_ped_col_strut_2_r', 'light_cover',
    'emissives', 'neon_l', 'neon_r', 'neon_f', 'neon_b', 'dashglow', 'doorlight_lf', 'doorlight_rf', 'doorlight_lr', 'doorlight_rr', 'unknown_id', 'dials', 'engineblock', 'bobble_head', 'bobble_base', 'bobble_hand', 'chassis_Control']

export type DependencyType = 'direct' | 'inverse';

export interface HandlingDependency {
    handlingId: number,
    /** Тип зависимости хэндлинга от родительского
     * При прямой (direct) при увеличении родительского хэндлинга будет увеличиваться и зависимый
     * При обратной (inverse) наоборот */
    dependencyType: DependencyType,
}

export interface HandlingConfig {
    id: number,
    name: string,
    description?: string,
    handlingName: string,
    minValue: number,
    maxValue: number,
    step: number,

    dependencies?: HandlingDependency[]
}

export const handlingConfigs: HandlingConfig[] = [
    { id: 0, name: 'Привод', handlingName: 'fDriveBiasFront', minValue: 0, maxValue: 1, step: 0.5 },
    { id: 1, name: 'Кол-во передач', handlingName: 'nInitialDriveGears', minValue: 3, maxValue: 7, step: 1 },
    { id: 2, name: 'Тяги двигателя', handlingName: 'fInitialDriveForce', minValue: 0.1, maxValue: 2, step: 0.05 },
    { id: 3, name: 'Инерция двигателя', handlingName: 'fDriveInertia', minValue: 0.1, maxValue: 1.5, step: 0.05 },
    { id: 4, name: 'Множитель смещения (вверх)', handlingName: 'fClutchChangeRateScaleUpShift', minValue: 1, maxValue: 2, step: 0.1 },
    { id: 5, name: 'Множитель смещения (вниз)', handlingName: 'fClutchChangeRateScaleDownShift', minValue: 1, maxValue: 2, step: 0.1 },

    { id: 6, name: 'Сила торможения', handlingName: 'fBrakeForce', minValue: 0.2, maxValue: 2, step: 0.05 },
    { id: 7, name: 'Распределение торможения', handlingName: 'fBrakeBiasFront', minValue: 0.4, maxValue: 0.7, step: 0.05 },
    { id: 8, name: 'Мощность ручного тормоза', handlingName: 'fHandBrakeForce', minValue: 0, maxValue: 2, step: 0.1 },

    { id: 9, name: 'Выворот колес', handlingName: 'fSteeringLock', minValue: 0, maxValue: 1.5, step: 0.05 },
    { id: 10, name: 'Сцепление колес', handlingName: 'fTractionCurveMax', minValue: 0, maxValue: 4, step: 0.5 },
    { id: 11, name: 'Пробуксовка колес', handlingName: 'fTractionCurveMin', minValue: 1, maxValue: 3, step: 0.1 },
    { id: 12, name: 'Боковая сила сцепления', handlingName: 'fTractionCurveLateral', minValue: 20, maxValue: 35, step: 0.5 },
    { id: 13, name: 'Сила сцепления при низкой скорости', handlingName: 'fLowSpeedTractionLossMult', minValue: 0.1, maxValue: 1.5, step: 0.1 },
    { id: 14, name: 'Распределение сцепления между осями', handlingName: 'fTractionBiasFront', minValue: 0.4, maxValue: 0.6, step: 0.05 },

    { id: 15, name: 'Сила подвески', handlingName: 'fSuspensionForce', minValue: 1, maxValue: 4, step: 0.5 },
    { id: 16, name: 'Сила вибрации подвески', handlingName: 'fSuspensionCompDamp', minValue: 0.6, maxValue: 2, step: 0.05 },
    { id: 17, name: 'Интенсивность вибрации подвески на высоких скоростях', handlingName: 'fSuspensionReboundDamp', minValue: 0.4, maxValue: 3.5, step: 0.1 },
    { id: 20, name: 'Высота подвески', handlingName: 'fSuspensionRaise', minValue: -0.015, maxValue: 0.04, step: 0.005 },
    { id: 21, name: 'Высота центра крена (перед)', handlingName: 'fRollCentreHeightFront', minValue: 0, maxValue: 0.7, step: 0.1 },
    { id: 22, name: 'Высота центра крена (зад)', handlingName: 'fRollCentreHeightRear', minValue: 0, maxValue: 0.6, step: 0.1 },
]

export interface ChipTuningOption {
    handlingId: number,
    value: number
}

export const CHIP_TUNING_COST = 200000;
