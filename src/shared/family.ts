import {systemUtil} from "./system";

export const FAMILY_TO_ORGANIZATION_MIN_LEVEL = 4;
export const getFamilyFractionName = (type: FamilyReputationType): string => {
    return type == FamilyReputationType.CIVILIAN ? 'ЧОП' : 'Мафия';
}

export enum FamilyReputationType {
    /** Гражданская семья */
    CIVILIAN,
    /** Криминальная семья */
    CRIME
}

interface IFamilyMemberAction {
    id: number,
    /** Название действия */
    name: string,
    /** Сколько добавится очков в нужную ветку за это действие */
    scores: number,
    /** Кд в минутах на начисление очков */
    cooldown?: number
}

/** Доступные действия влияющие на очки семьи */
export const familyMemberActions: IFamilyMemberAction[] = [
    // Крайм действия
    { id: 0, name: 'Ограбление человека', scores: 2, cooldown: 5 },
    { id: 1, name: 'Угон автомобиля', scores: 3, cooldown: 10 },
    { id: 2, name: 'Ограбление ячейки', scores: 2, cooldown: 10 },
    { id: 3, name: 'Подрыв двери', scores: 5 },
    { id: 4, name: 'Победа в войне за территорию', scores: 5 },
    { id: 5, name: 'Ограбление кассы магазина', scores: 3, cooldown: 10 },
    // Гос действия
    { id: 6, name: 'Выписка штрафа', scores: 2, cooldown: 10 },
    { id: 7, name: 'Реанимация игрока', scores: 3, cooldown: 10 },
    { id: 8, name: 'Эвакуация ТС', scores: 2, cooldown: 10 },
    { id: 9, name: 'Отправка на штрафстоянку ТС', scores: 3, cooldown: 10 },
    { id: 10, name: 'Арест за угон авто', scores: 5, cooldown: 10 },
]

export const newRankRules = [
    { id: 1, name: 'Покупка транспорта'},
    { id: 2, name: 'Продажа транспорта в государство'},
    { id: 3, name: 'Доставка транспорта к гаражу'},
    { id: 4, name: 'Заказ груза'},
    { id: 5, name: 'Создание дубликата ключей'},
    { id: 6, name: 'Принятие в семью'},
    { id: 7, name: 'Исключать из семьи, изменять ранги'},
    { id: 8, name: 'Запускать войну за бизнесы'},
    { id: 9, name: 'Участвовать в войне за бизнес'},
]

export const getRankRuleName = (id: number) => {
    return newRankRules.find(r => r.id === id)
}

export const Timetable = [
    { start: '14:00', stop:'22:00', name: 'Борьба за груз', desc: 'проходит в данном интервале времени каждый день'}
]

export enum FamilyContractWinTypes {
    MONEY = 9999,
    COINS = 10000,
    FAMILY_POINTS = 10001
}

export type rankData = {
    id: number;
    name?: string;
    rules?: Array<number>;
    isOwner?: boolean; 
    isSoOwner?: boolean; 
    isPermament?: boolean;
}
/** Максимальное кол-во рангов */
export const family_max_rank = 10;

/** Максимальное количество машин у семьи без улучшений */
export const family_max_cars = 20;


/** Максимальное количество груза у семьи без улучшений */
export const family_max_cargo = 3000;

/** Максимальное количество членов семьи у семьи без улучшений */
export const family_max_users = 50;

/** Необходимое количество денежных средств для создания семьи */
export const FAMILY_CREATE_MONEY = 1000000

/** Необходимое количество донат-валюты для создания семьи */
export const FAMILY_CREATE_COINS = 2999

/** Координаты плоского маркера (чекпоинта) создания официальной организации */
export const FAMILY_CREATE_POS_GOS = { x: -550.88, y: -188.85, z: 37.23 }
/** Координаты создания крайм семьи */

export const FAMILY_CREATE_POS_CRIME = { x: -800.68, y: 171.59, z: 71.94 }


/** Количество секунд между заказами груза в порту через NPC */
export const FAMILY_TIMEOUT_AFTER_CARGO_REQUEST = 60*5*60

/** Количество кг заказываемое игроком в порту через NPC */
export const FAMILY_REQUEST_CARGO_AMOUNT = 1500

/** Стоимость за заказ груза игроком в порту через NPC */
export const FAMILY_REQUEST_CARGO_PRICE = 60000

export enum FamilyRankPermission {
    FAMILY_LEADER= 10000,
    FAMILY_SUBLEADER
}

export const FamilyPermissions = {
    /** Купить дом */
    buyHouse: FamilyRankPermission.FAMILY_LEADER,
    /** Сменить замок в доме */
    changeLock: FamilyRankPermission.FAMILY_LEADER,
    /** Сделать дубликат ключей */
    keyDublicate: 5,
    /** Продажа дома государство */
    sellHouse: FamilyRankPermission.FAMILY_LEADER,
    /** Продажа ТС государство */
    sellVehicle: 2,
    /** Инвайт в семью */
    invite: 6,
    /** Оплата налога за дом и ТС */
    payTax: FamilyRankPermission.FAMILY_LEADER,
    /** Покупать транспорт в семью */
    buyCar: 1,
    /** Покупать транспорт в семью */
    houseUpgrade: FamilyRankPermission.FAMILY_LEADER,
    /** Повысить уровень семьи через планшет */
    level_up: FamilyRankPermission.FAMILY_LEADER,
    /** Выкинуть другого члена семьи из семьи через планшет */
    kick: 7,
    /** Изменить другому члену семьи ранг семьи через планшет */
    setRank: 7,
    /** Заспавнить машину в гараж */
    car_park: 3,
    /** Телепортировать машину к себе */
    car_teleport: FamilyRankPermission.FAMILY_SUBLEADER,
    /** Брать средства с money safe */
    money_take: FamilyRankPermission.FAMILY_SUBLEADER,
    /** Брать средства с money safe */
    request_cargo: 4,
    /** Запускать бизвар */
    bizwar_start: 8,
    /** Участвовать в бизваре */
    bizwar_join: 9,
}

export interface FamilyTasksInterface {
/** Тип задания. Они уже заранее заготовленные. Сейчас существует только нулевой  */
    type: number;
/** Название задания. Также отображается в планшете */
    name: string;    
/** Доп. информация о задании (для планшета) */
    info: string;    
/** Описание для scores. Игрок получает +scores очков семьи, за что именно указывать для планшета тут */
    desc: string;
/** Количество очков семьи, получаемое игроком за экспорт 1 единицы груза */
    scores: number;
/** Цвет (для планшета) */
    color: string;
    /** Количество денег выдающееся за экспорт 1 единицы груза */
    money: number;
/** Координаты плоского маркера - куда игрок несет коробку на разгрузке */
    importCoords: { x: number, y: number, z: number }[];
    
}

/** Настройки точки загрузки груза для семей */
export const FamilyTasksLoading = [
    {
        /** Тип, для которого указывается настройка (сейчас у нас только 0 поэтому это постоянное значение) */
        type: 0,

        /** Координаты плоского маркера для точек, откуда игрок берет семейный груз */
        loadingCoords: [ // для плоского маркера
            { x: 1240.8, y: -3135.55, z: 4.63 },
            { x: 1240.8, y: -3142.07, z: 4.63 },
            { x: 1240.8, y: -3148.96, z: 4.63 },
            { x: 1240.8, y: -3155.70, z: 4.63 }
        ],

        /** Координаты плоского маркера для точек регистрации ТС на загрузку семейного груза (по дефолту и как правильно она всего одна, при желании можно потом добавить) */
        carRegisterCoords: [
            { x: 1246.17, y: -3189.19, z: 5.13 }
        ],

        loadingBlip: [
            { x: 1239.95, y: -3145.58, z: 5.53 }
        ],

        requestCargoNpc: [
            { x: 1243.60, y: -3196.76, z: 6.03, h: 282, model: 's_m_y_construct_02' }
        ]
    }
]


export const FamilyExtraTaskTypes = {
    'cargoBattle': { }
}

export enum FamilyContractList {
    delivers = 1,
    taxists,
    builders,
    garders,
    helpers,
    cleaners,
    moneytransfers,
    onliners,
    fishers,
    drifters,
    farmers,
    robbers
}

export const FAMILY_CONTRACT_UPD_TIME = 60*60*2 // секунды
export const CONTRACT_NUM_FOR_FAMILY = 5

export const FamilyContracts: {id:number, type:number, name:string, desc: string, needScore: number, win: { type: FamilyContractWinTypes, amount?: number, desc?: string}[] }[] = [
    { id: 1, type: FamilyContractList.delivers, name: "Доставщики", desc: `Всей семьёй отвезите ${systemUtil.numberFormat(100)} грузов на работе дальнобойщика`, needScore: 100, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 2, type: FamilyContractList.taxists, name: "Таксопарк", desc: `Всей семьёй выполните ${systemUtil.numberFormat(100)} заказов работая таксистом`, needScore: 100, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 3, type: FamilyContractList.builders, name: "Прорабы", desc: `2 раз выполнить работу ремонта квартиры (Складывается с каждого члена семьи)`, needScore: 2, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 4, type: FamilyContractList.garders, name: "Садовники", desc: `Всей семьёй заработать в саду $${systemUtil.numberFormat(50000)}`, needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 5, type: FamilyContractList.helpers, name: "Помощники", desc: `Всей семьёй заработать $${systemUtil.numberFormat(50000)} помогая в гараже Тони`, needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 6, type: FamilyContractList.cleaners, name: "Чистильщики", desc: `Всей семьёй заработать $${systemUtil.numberFormat(50000)} на мойке окон`, needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 7, type: FamilyContractList.moneytransfers, name: "Развозчик денег", desc: `Всей семьёй заработать $${systemUtil.numberFormat(100000)} работая инкассатором`, needScore: 100000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 8, type: FamilyContractList.onliners, name: "Усидчивые", desc: `Пробыть в сумме всей семьёй в онлайне ${systemUtil.numberFormat(80)} часов (Онлайн каждого члена семьи складывается)`, needScore: 80, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 9, type: FamilyContractList.fishers, name: "Рыбный промысел", desc: `Поймать всей семьёй ${systemUtil.numberFormat(3000)} рыб`, needScore: 3000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 10, type: FamilyContractList.drifters, name: "Семья дрифтеров", desc: `Набрать всей семьёй ${systemUtil.numberFormat(2000000)} очков на дрифт трассе`, needScore: 2000000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }, { type: FamilyContractWinTypes.MONEY, amount: 50000 } ] },
    { id: 11, type: FamilyContractList.farmers, name: "Старший Шахтёр", desc: `Добыть ${systemUtil.numberFormat(50)} каменной породы в карьере`, needScore: 50, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 12, type: FamilyContractList.farmers, name: "Младший Шахтёр", desc: `Добыть ${systemUtil.numberFormat(25)} каменной породы в карьере`, needScore: 25, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 13, type: FamilyContractList.delivers, name: "Доставщики", desc: `Всей семьёй отвезите ${systemUtil.numberFormat(50)} грузов на работе дальнобойщика`, needScore: 50, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 14, type: FamilyContractList.taxists, name: "Таксопарк", desc: `Всей семьёй выполните ${systemUtil.numberFormat(50)} заказов работая таксистом`, needScore: 50, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 15, type: FamilyContractList.builders, name: "Прорабы", desc: `2 раз выполнить работу ремонта квартиры (Складывается с каждого члена семьи)`, needScore: 1, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 16, type: FamilyContractList.garders, name: "Садовники", desc: `Всей семьёй заработать в саду $${systemUtil.numberFormat(25000)}`, needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 17, type: FamilyContractList.helpers, name: "Помощники", desc: `Всей семьёй заработать $${systemUtil.numberFormat(25000)} помогая в гараже Тони`, needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 18, type: FamilyContractList.cleaners, name: "Чистильщики", desc: `Всей семьёй заработать $${systemUtil.numberFormat(25000)} на мойке окон`, needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 19, type: FamilyContractList.moneytransfers, name: "Развозчик денег", desc: `Всей семьёй заработать $${systemUtil.numberFormat(50000)} работая инкассатором`, needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 20, type: FamilyContractList.onliners, name: "Усидчивые", desc: `Пробыть в сумме всей семьёй в онлайне ${systemUtil.numberFormat(40)} часов (Онлайн каждого члена семьи складывается)`, needScore: 40, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 21, type: FamilyContractList.fishers, name: "Рыбный промысел", desc: `Поймать всей семьёй ${systemUtil.numberFormat(1500)} рыб`, needScore: 1500, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 22, type: FamilyContractList.drifters, name: "Семья дрифтеров", desc: `Набрать всей семьёй ${systemUtil.numberFormat(1000000)} очков на дрифт трассе`, needScore: 1000000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }, { type: FamilyContractWinTypes.MONEY, amount: 25000 } ] },
    { id: 23, type: FamilyContractList.robbers, name: "Грабители", desc: `Ограбить всей семьёй кассы бизнесов на сумму ${systemUtil.numberFormat(75000)}`, needScore: 75000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }, { type: FamilyContractWinTypes.MONEY, amount: 25000 } ] },
]

export const FamilyTasks:FamilyTasksInterface[] = [
    {
        type: 0,
        name: 'Транспортировка гвоздей и короб',
        info: 'Отвезите груз со склада на стройку.',
        desc: 'за коробку',
        scores: 10,
        money: 700,
        color: '',
        importCoords: [
            { x: -457.02, y: -889.26, z: 22.76 },
            { x: -453.31, y: -889.43, z: 22.76 },
            { x: -449.13, y: -889.16, z: 22.76 }
        ]

    },
    {
        type: 0,
        name: 'Доставка инструментов',
        info:'Отвезите инструменты в You Tool.',
        desc: 'за коробку',
        color: 'green',
        scores: 10,
        money: 700,
        importCoords: [
            { x: 2684.53, y: 3515.77, z: 52.40 }, // для плоского маркера
            { x: 2680.99, y: 3507.77, z: 52.40 },
            { x: 2676.10, y: 3500.36, z: 52.40 }
        ]
    },
    {
        type: 0,
        name: 'Доставка семян апельсинового дерева',
        info:'Отвезите семена апельсинов на ферму.',
        desc: 'за коробку',
        color: 'orange',
        scores: 10,
        money: 700,
        importCoords: [
            { x: 2306.87, y: 4882.40, z: 40.91 }, // для плоского маркера
            { x: 2312.82, y: 4889.51, z: 40.91 }
        ]
    }
]


type LevelInfoType = {
    desc: string;
    members: number;
    scores: number;
    wins: number;
    coin: number;
    /** Может ли семья купить дом в многоквартирном доме */
    canBuyMultiHouse: boolean;
    /** Может ли семья купить дом для семьи без вертолетной площадки */
    canBuyCustomHouse: boolean;
    /** Может ли семья купить дом для семьи с вертолетной площадкой */
    canBuyAirHouse: boolean;
}[];
export const LevelInfo:LevelInfoType = [
    {desc: 'Вы можете владеть домами и семейным автопарком.', members: 0, scores: 0, wins: 0, coin: 0, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: false },
    {desc: 'Возможность владеть домами семей с увеличенным количеством мест для транспорта семьи. Возможность грабить магазины.',    members: 15, scores: 24000, wins: 10, coin: 15999, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: false },
    {desc: 'Возможностью приобрести вертолетную площадку, получать заказы от Ламара.', members: 20, scores: 80000, wins: 12, coin: 21999, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: true },
    {desc: 'Вы становитесь полноценной фракцией с возможностями выбранной вами ветки развития семьи', members: 30, scores: 120000, wins: 20, coin: 24999, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: true }
];


interface price {
    money:number,
    coin:number
}

type FamilyUpgrades  = {
    /** ID улучшения. Идут только в плюс, если какое то отсутствует - пропускать */
   id:number,
    /** Название для интерфейса */
   name: string,
    /** Описание для интерфейса */
   desc: string,
    /** Цена в виртах и коинах соответственно */
   price: price,
    /** Одно улучшение добавляет указанное тут количество того, что в нём указано
     * Например если это лимит семьи, то +1 улучшение за price добавляет
     * +10 человек, если указать amount = 10 */
   amount: number,
    /** Сколько можно улучшениями добавить значений к дефолтному
     * Если указать 15 для кол-ва транспорта, то максимальное количество транспорта у семьи
     * будет 15 + default (следующее значение) */
   max: number,
    /** Сколько изначально семья получает данного лимита / улучшения */
   default: number,
    multiple:number
}


/** Обновления семьи
 * После формирования семей айди не менять, иначе поменяются местами текущие улучшения
 */
export const FamilyUpgrade:FamilyUpgrades[] = [
    {id: 1, name: 'Увеличить лимит семьи. Сейчас максимум', desc:'человек', price: {money:300000, coin: 500}, amount: 10, max: 1000-family_max_users, default: family_max_users, multiple: 1.2},
    {id: 2, name: 'Увеличить кол-во транспорта семьи. Сейчас мест', desc:'мест для авто', price: {money:100000, coin: 250}, amount: 2, max: 100-family_max_cars, default: family_max_cars, multiple: 1.2},
    {id: 3, name: 'Увеличить лимит хранимого груза семьи. Сейчас лимит', desc:'кг', price: {money:200000, coin: 300}, amount: 1000, max: 20000-family_max_cargo, default: family_max_cargo, multiple: 1.2},
    // {id: 3, name: 'Подземная парковка. Увеличивает максимальный лимит авто семьи', desc:'мест для авто', price: {money:1000, coin: 100}, amount: 10, max: 10, default: 0},
    {id: 4, name: '', desc:'Переименовать семью', price: {money:0, coin: 1000}, amount: 1, max: 1, default: 0, multiple: 1}
]

export const getFamilyUpgradeLevelPrice = (id: number, level: number, priceType:keyof price) => {
    const fu = FamilyUpgrade.find(fu => fu.id == id)
    if(fu && level == 1) return fu.price[priceType]
    return fu ? Math.floor(Math.pow(fu.multiple, level-1) * fu.price[priceType]) : 0
}
