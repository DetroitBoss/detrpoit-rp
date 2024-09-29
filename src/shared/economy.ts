import {houseUpgradeLevelData} from "./inventory";
import {BUSINESS_TYPE} from "./business";
import {PARKING_STEP} from "./parking";

export const COINS_FOR_ONE_ROUBLE = 2

/** Множитель награды за начальную работу умноженный на час. */
export const JOB_MONEY_PER_HOUR_MULTIPLE = [
    0, // 0
    0, // 1
    0, // 2
    0, // 3
    0, // 4
    0, // 5               
    0, // 6
    0, // 7
    0, // 8
    0, // 9
    0, // 10
    0, // 11
    0, // 12
    0, // 13
    0, // 14
    0, // 15
    0, // 16
    0, // 17
    0, // 18
    0, // 19
    0, // 20
    0, // 21
    0, // 22
    0, // 23
];

/** Множитель зарплаты умноженный на час. */
export const PAYDAY_MONEY_PER_HOUR_MULTIPLE = [
    0, // 0
    0, // 1
    0, // 2
    0, // 3
    0, // 4
    0, // 5
    0, // 6
    0, // 7
    0, // 8
    0, // 9
    0, // 10
    0, // 11
    0, // 12
    0, // 13
    0, // 14
    0, // 15
    0, // 16
    0, // 17
    0, // 18
    0, // 19
    0, // 20
    0, // 21
    0, // 22
    0, // 23
];

/** Название донат валюты */
export const DONATE_MONEY_NAMES = ["коин", "коины", "коинов", "⭕"]
/** Сколько виртов за 1 коин */
export const DONATE_VIRTS_PER_COIN = 100;

/** Сколько времени нужно отыграть при акции */
export const PLAYTIME_TIME = 5;
/** Сколько игрок получит денег если отыграет положеный срок при включённой акции */
export const PLAYTIME_MONEY = 200;
/** Что игрок получит, вирты или коины */
export const PLAYTIME_TYPE: "money" | "donate" = 'donate';

/** Настройки медиа промокода */
export const MEDIA_PROMOCODE = {
    /** Блокировать ввод медиакода с другого персонажа на том же аккаунте */
    BLOCK_MULTIPLE: false,
    /** Сколько денег даст игроку сразу при введении */
    GIVE_MONEY_PLAYER: 5000,
    // /** Сколько денег даст медиа */
    // GIVE_MONEY_MEDIA: 10000,
    /** Сколько коинов даст игроку */
    GIVE_DONATE_PLAYER: 0,
    /** Сколько коинов даст медиа */
    GIVE_DONATE_MEDIA: 10,
    /** Уведомлять стримера, если он в сети, что есть промокод был введён */
    NOTIFY: false,
    /** Какой максимальный уровень у игрока может быть, чтобы иметь возможность ввести промокод медиа. */
    LEVEL_MAX: 2,
    // Сумма которую игрок получит при достижении необходимого ЛВЛ
    GIVE_MONEY_PLAYER_LEVEL: 25000,
    // Уровень на котором игроку даст вторую часть денег
    LEVEL_TWO: 3,
    //!!!! Не трогать
    REWARD_STAGE_LIST: <{count: number, class: string, name: string, data: any}[]>[
        {count: 10, class: 'font24 fontw600', name: `$100 000`, data: 100000},
        {count: 20, class: 'font24 fontw600', name: `VIP Diamond<br/><small>на месяц</small>`},
        {count: 30, class: 'font24 fontw600', name: `<small>Семья</small><br/>бесплатно`},
        {count: 40, class: 'font24 fontw600', name: `Пак лицензий`},
        {count: 70, class: 'font24 fontw600', name: `Ford<br/>Mustang`, data: 'must1onyx'},
    ]

}

/** Пособие по безработице. Для тех, кто не является членом какой либо фракции */
export const UNEMPLOYMENT_BENEFIT = 400;
/** Начальный запас наличных средств игрока
 * !!! Если сменить на работающем сервере - перезапишет баланс всех игроков */
export const startMoney = 5000;
/** Начальный запас наличных средств игрока
 * !!! Если сменить на работающем сервере - перезапишет баланс всех игроков */
export const startChips = 0;
/** Стоимость в коинах на создание третьего перса */
export const DONATE_SLOT_PERSONAGE_COST = 500;

/** Процент от суммы при продажу в гос, который отнимается */
export const SELL_GOS_TAX_PERCENT = 30;

/** Процент от суммы при продажу в гос, который отнимается при продаже ДОНАТ вещей */
export const SELL_GOS_TAX_PERCENT_DONATE = 0;

/** Сколько машин может иметь игрок по умолчанию */

export const DEFAULT_VEHICLE_PLAYER_LIMIT = 11;
/** Сколько машин может иметь игрок максимум */
export const DEFAULT_VEHICLE_PLAYER_LIMIT_MAX = 11;


/** Процент за снятие средств с банковского счёта */
export const REMOVAL_BANK_MONEY_PERCENT = 1;

//! Телефон
/** Стоимость анонса мероприятия */
export const EVENT_ANNOUNCE_COST = 50000
/** Время в минутах, сколько анонс будет существовать */
export const EVENT_ANNOUNCE_MINUTE = 10
/** Стоимость одной СМС */
export const SMS_COST = 2;
/** Стоимость соединения при разговоре */
export const VOICE_CONNECT_COST = 2;
/** Стоимость одной минуты разговора */
export const VOICE_MINUTE_COST = 2;


//! Банки
/** Максимальный запас по запасу банковского баланса */
export const bankCardMax = [10000000, 100000000, 500000000]
/** Стоимость перевыпуска карты */
export const newBankCardCost = 5000;
/** Стоимость выпуска карт */
export const bankCardCostCreate = [1000, 20000, 50000];
/** Стоимость закрытия счёта */
export const bankAccountClose = 4000;
/** Названия тарифов банковских карт */
export const BANK_CARD_NAME_LIST = [
    "Debit",
    "Gold",
    "Platinum",
]
/** Список стилей всех банковских карт */
export const BANK_CARD_STYLE_LIST = [
    "debit",
    "gold",
    "platinum",
]
/** Максимальный процент, который может установить банк */
export const bankMaxPercent = 5;
/** Каков процент за обслуживание, если не заключён договор */
export const bankPercentDefault = 5;
/** Каков процент от суммы перевода */
export const bankPercentMoneyReceive = 100;


//! Бизнесы
export const enum BANK_TAX {
/** Процент от стоимости бизнеса для ежесуточного взыскания */
    DAY_TAX_PERCENT = 0.45,
}

/** Процент взыскания с бизнеса когда товара нет в наличии */
export const shopFineWhenNoItems = 1;
/** Максимальное кол-во суток для проплаты налога на бизнес */
export const BUSINESS_MAX_TAX_DAYS_DEFAULT = 14;

export const BUSINESS_UPGRADE_DATA: {
    /** ТИП бизнеса */
    type: BUSINESS_TYPE[],
    /** Описание улучшения */
    desc: string,
    /** Максимальный уровень улучшения. Уровень по умолчанию - 0 */
    max_level: number,
    /** Стоимость улучшения в процентах от стоимости бизнеса */
    level_percent: number,
    /** Если указать этот параметр - то стоимость улучшения будет зависить не только от цены бизнеса, но и от выбранного уровня. Например, если мы улучшаем бизнес до третьего уровня, то итоговая цена улучшения будет дополнительно умножена на 3 */
    level_multiple?: true,
    /** Если указать данный параметр - то улучшать бизнес можно будет поочерёдно. То есть нельзя будет улучшить до второго уровня и следом на пятый. Админ в любом случае сможет улучшать как ему надо */
    step_by_step?:true
}[] = [
    {type: [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING], desc: `Уменьшает закупочную стоимость продукции на 10%`, max_level: 4, level_percent: 10, step_by_step: true},
    {type: [BUSINESS_TYPE.PARKING], desc: `Добавляет дополнительный этаж с парковочными местами`, max_level: Math.min(30, PARKING_STEP), level_percent: 10, step_by_step: true},
    {type: [BUSINESS_TYPE.VEHICLE_SHOP], desc: `Оптимизирует расходы повышая доход на 10%`, max_level: 4, level_percent: 10, step_by_step: true},
]

//? Тату салоны
/** Множитель цены тату при сведении */
export const tattooRemoveCostMultipler = 2;
/** Сколько средств перечислить тату салону при сведении тату */
export const tattooRemoveMoneySendToBusinessMultipler = 1;
/** Какой процент от стоимости бизнеса идёт в сейф семьи при каждом PayDay */
export const familyFractionPayDayRewardPercent = 0.7;
//! Документы
/** Стоимость выпуска ID карты */
export const startDocumentCost = 0;
/** Стоимость перевыпуска ID карты в случае утраты */
export const restoreDocumentCost = 5000;


//! Дома
/** Стоиомсть ключей от дома */
export const houseKeyCost = 999
/** Стоиомсть замены замка */
export const houseLockRepairCost = 10000
/** Стоимость отправки ТС на штрафстоянку когда игрок выселяется */
export const houseVehicleRemoveFine = 1000;
/** Процент от стоимости за сутки в налог */
export const HOUSE_TAX_PERCENT = 0.4;
/* Максимальный налог в сутки */
export const HOUSE_TAX_PERCENT_DAY_MAX = 100000;
/* Максимальная проплата налога на дом в сутках */
export const HOUSE_MAX_TAX_DAYS_DEFAULT = 14;
/** Данные по апгрейду домов */
export const HOUSE_UPGRADE_LEVEL_COST: houseUpgradeLevelData[] = [
    //!* Этот пункт не просто пример, он должен быть первым и его нельзя трогать
    {house: 0, price: 0, amount: 0},
    {house: 50000, price: 10000, amount: 50},
    {house: 100000, price: 20000, amount: 100},
    {house: 400000, price: 50000, amount: 150},
    {house: 1000000, price: 100000, amount: 200},
]


export const HOUSE_CHEST_KG_DEFAULT = 1000;
export const HOUSE_CHEST_MAX_LEVEL = 8;
export const HOUSE_CHEST_KG_PER_LEVEL = 500;
export const HOUSE_CHEST_LEVEL_COST = 300000;
export const HOUSE_CHEST_LEVEL_COST_COIN = 500;
export const HOUSE_CHEST_LEVEL_COST_MULTIPLE = 1.2;

//! Склады
/** Процент от стоимости за сутки в налог */
export const WAREHOUSE_TAX_PERCENT = 1;
/** Максимальный налог в сутки */
export const WAREHOUSE_TAX_PERCENT_DAY_MAX = 10000;
/** Максимальное кол-во суток для проплаты налога */
export const WAREHOUSE_MAX_TAX_DAYS_DEFAULT = 14;

//! Транспорт
/* Налог на обычный ТС */
export const VEHICLE_TAX_PERCENT = 0;
/** Процент от стоимости ТС, когда налоги достигнут этого уровня - ТС слетает */
export const VEHICLE_MAX_TAX_PERCENT_DAY = 1;
/** Стоимость создания ключа для ТС */
export const VEHICLE_KEY_CREATE_COST = 999;
/** Максимальная сумма штрафа для штрафстоянки */
export const VEHICLE_FINE_POLICE_MAX = 5000
/** Стоимость ремонта ТС в ЛСК */
export const VEHICLE_REPAIR_COST = 500;
/** Стоимость возврата ТС в гараж */
export const VEHICLE_RESPAWN_COST = 200
//! Взаимодействие
/** Сколько максимум наличных средств можно передать за одну операцию */
export const GIVE_MONEY_PER_TASK = 50000
/** Сколько максимум наличных средств можно передать за 1 рестарт сервера */
export const GIVE_MONEY_PER_DAY = 10000000

//! Больница

/** Сколько стоит выписать из больницы */
export const enum QUICK_HEAL_COST {
    /** Через врача */
    MANUAL = 400,
    /** Через врача */
    MANUAL_LICENSE = 200,
    /** Через маркер */
    AUTO = 2000,
    /** Через маркер */
    AUTO_LICENSE = 1000,
}

type DonateData = {
    id:number;
    name: string;
    desc: string;
    price: number;
    pic: string;
}
export const Donate_Items: DonateData[] = [
    { id: 4, name: "Получить $", desc: "Обменяйте коины на валюту", price: DONATE_VIRTS_PER_COIN, pic:"d-virt"},
    {id: 2, name:"Снять варн", desc:"Больше не нарушайте", price: 500, pic:"d-warn"},
    {id: 3, name:"Сменить внешность", desc:"Сделайте пластическую операцию", price: 250, pic:"d-face"},
    {id: 1, name:"Смена имени", desc:"Смените имя", price: 100, pic:"d-name"},
    {id: 5, name:"Сменить возраст", desc:"Выпейте таблетку от старости", price: 50, pic:"d-age"},
    {id: 6, name:"Дополнительный слот для ТС", desc:"Позволяет владеть дополнительным транспортом на вашем персонаже", price: 500, pic:"d-slots"},
    {id: 7, name:"Увеличение вместительности инвентаря", desc:`Добавляет 5кг к максимальному весу инвентаря`, price: 500, pic:"inventory"},
];

export const getDonateItemConfig = (id: number) => {
    return Donate_Items.find(q => q.id === id)
}


export const enum DONATE_STATUS {
    /** Платёж создан, ожидает оплаты */
    CREATED = 0,
    /** Платёж оплачен */
    PAYED = 1,
    /** Платёж зачислен аккаунту */
    DONE = 2,

}

/** Получаемое количество средств полицейским за арест игрока */
export const ARREST_MONEY = 0