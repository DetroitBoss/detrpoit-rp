import {JobId} from "./jobs";
import {BUSINESS_TYPE} from "./business";
import {LicenceType} from "./licence";
import {OWNER_TYPES} from "./inventory";
import {systemUtil} from "./system";
export const DEFAULT_USER_ACHIEV: [number, number] = [0, 0]


export type UserAchievmentItem = typeof DEFAULT_USER_ACHIEV
export type UserAchievmentData = {[param in UserAchievmentKey]?: UserAchievmentItem}
export interface AchievementItemBase {
    key: UserAchievmentKey,
    /** Название ачивки */
    name: string,
    /** Описание ачивки */
    desc: string,
    /** Сколько нужно выполнить задания чтобы достижение было выполнено */
    max: number,
    /** Награда при получении достижения */
    reward: {
        /** Выдать предметы при получении награды */
        item?:number[];
        /** Выдать деньги при получении награды */
        money?:number;
        /** Выдать опыт при получении награды */
        exp?:number;
        /** Выдать донат валюту при получении награды */
        donate?:number;
    }
}

/** Интерфейс заработка денег на работе */
export interface AchievementItemJob extends AchievementItemBase { type: 'jobmoney' | 'jobexp'; jobId?: JobId }
/** Интерфейс отыгранного времени на сервере */
export interface AchievementItemPlayTime extends AchievementItemBase { type: 'playTime' }
/** Проехать на такси */
export interface AchievementItemTaxi extends AchievementItemBase { type: 'taxiDriverCount' | 'taxiPassengerCount' | 'taxiDriverSum' | 'taxiPassengerSum' }
/** Задание в инкаске */
export interface AchievementItemGR6 extends AchievementItemBase { type: 'gr6count' | 'gr6sum' }
/** Задание в дальнобойщиках */
export interface AchievementItemDeliver extends AchievementItemBase { type: 'deliverCount' | 'deliverSum' }
/** Дуэли */
export interface AchievementItemDuel extends AchievementItemBase { type: 'duelCount' | 'duelSum' }
/** Победа в БР */
export interface AchievementItemBR extends AchievementItemBase { type: 'brCount' | 'brSum' }
/** Победа в гонках */
export interface AchievementItemRace extends AchievementItemBase { type: 'raceWinPLace' | 'raceFirst' | 'raceSum' }
/** Покупка в бизнесах */
export interface AchievementItemBiz extends AchievementItemBase { type: 'buyShopSum', typeBiz?: BUSINESS_TYPE, subtypeBiz?:number }
/** Использование предмета */
export interface AchievementItemUse extends AchievementItemBase { type: 'useItem', item_id: number[] }
/** Получение лицензии */
export interface AchievementItemLicense extends AchievementItemBase { type: 'giveLicense', license: LicenceType[] }
/** Получение лицензии */
export interface AchievementItemDocument extends AchievementItemBase { type: 'giveDocument', document: string[] }
/** Ловля рыбы */
export interface AchievementItemFish extends AchievementItemBase { type: 'fishCount' }
/** Вскрыть ТС */
export interface AchievementItemVehJack extends AchievementItemBase { type: 'vehJack' }
/** Угнать ТС для Ламара */
export interface AchievementItemVehJackLamar extends AchievementItemBase { type: 'vehJackLamar' }
/** Выполнить другое достижение (НЕ ИСПОЛЬЗОВАТЬ ДЛЯ ВРЕМЕННЫХ ДОСТИЖЕНИЙ) */
export interface AchievementItemComplete extends AchievementItemBase { type: 'achieveComplete', achieve?:UserAchievmentKey[] }
/** Познакомится */
export interface AchievementItemMeet extends AchievementItemBase { type: 'newMeet' }
/** Купить дом */
export interface AchievementItemBuyHouse extends AchievementItemBase { type: 'buyHouse' }
/** Прописать человека */
export interface AchievementItemResidentHouse extends AchievementItemBase { type: 'inviteResident' }
/** Оказаться прописаным в доме */
export interface AchievementItemBeResidentHouse extends AchievementItemBase { type: 'beResident' }
/** Оказаться прописаным в доме */
export interface AchievementItemFlat extends AchievementItemBase { type: 'flatCount' | 'flatSum' }
/** Продать ТС */
export interface AchievementItemVehSell extends AchievementItemBase { type: 'vehSellGos' | 'vehSellPlayer' }
/** Переместить предмет */
export interface AchievementItemMove extends AchievementItemBase { type: 'itemMove', owner_types?: OWNER_TYPES[] }
/** Принять участие в МП */
export interface AchievementItemEvent extends AchievementItemBase { type: 'eventEnter' }
/** Заработок по безработице */
export interface AchievementItemNoWork extends AchievementItemBase { type: 'noWorkMoneySum' }
/** Наработать очки по дрифту */
export interface AchievementItemDrift extends AchievementItemBase { type: 'driftPoints' }
/** Наработать очки по дрифту */
export interface AchievementItemHunt extends AchievementItemBase { type: 'animalHunt' }
/** Казино */
export interface AchievementItemCasino extends AchievementItemBase { type:
    /** Количество побед где либо кроме крупье */
        'casinoWinCount'
        /** Сумма побед где либо кроме крупье */
        | 'casinoWinSum'
        /** Количество побед в рулетке */
        | 'casinoRouletteWinCount'
        /** Сумма побед в рулетке */
        | 'casinoRouletteWinSum'
        /** Количество побед в костях */
        | 'casinoDiceWinCount'
        /** Сумма побед в рулетке */
        | 'casinoDiceWinSum'
        /** Количество побед в слотах */
        | 'casinoSlotsWinCount'
        /** Сумма побед в рулетке */
        | 'casinoSlotsWinSum'
        /** Сколько дилер на костях провёл успешных игр */
        | 'casinoDiceDealerWinCount'
        /** Комиссия диллера в костях */
        | 'casinoDiceDealerWinSum'
}

export type AchievementItem = AchievementItemJob | AchievementItemPlayTime | AchievementItemTaxi | AchievementItemGR6 | AchievementItemDeliver | AchievementItemDuel | AchievementItemBR | AchievementItemRace | AchievementItemBiz | AchievementItemUse | AchievementItemLicense | AchievementItemDocument | AchievementItemFish | AchievementItemVehJack | AchievementItemVehJackLamar | AchievementItemComplete | AchievementItemMeet | AchievementItemBuyHouse | AchievementItemResidentHouse | AchievementItemBeResidentHouse | AchievementItemFlat | AchievementItemVehSell | AchievementItemMove | AchievementItemEvent | AchievementItemNoWork | AchievementItemDrift | AchievementItemCasino | AchievementItemHunt

/** Ключи */
export type UserAchievmentKey = '24hours' | '48hours' | '1hours' | '2hours' | 'jobferma' | 'jobferma2' | 'jobferma3' | 'jobbuilder' | 'jobbuilder1' | 'jobbuilder2' | 'jobwash' | 'jobwash1' | 'jobwash2' | 'jobtoni' | 'jobtoni1' | 'jobtoni2' | '72hours' | '500hours' | 'buyhouse' | 'buylic' | 'buylic1' | 'Fishman' | 'duelman' | 'duelman1' | 'freeworkman' | 'meet' | 'adminevent' | 'invitehouse' | 'jobmoneyall' | '247magazine' | 'buytunning' | 'buyweapons' | 'winsbattle' | 'buyclotches' | 'winsplacerace' | 'winsrace' | 'sellcarsruki' | 'sellcarsgos' | 'passtaxi' | 'drivetaxi' | 'drivetruck' | 'vzlommachin' | 'buylic2' | 'otdelkahati' | 'otdelkahati1' | 'achiev' | 'achiev1' | 'achiev2' | 'duelstemp' | 'racetemp' | 'healtemp' | 'drinktemp' | 'eattemp' | 'narkotemp' | '247magazinetemp' | 'buyclotchestemp' | 'buytunningtemp' | 'buyaptekatemp' | 'buyfueltemp' | 'buyprokattemp' | 'buytatu' | 'modweaponstemp' | 'fishtemp' | 'worktemp1' | 'worktemp2' | 'worktemp3' | 'worktemp4' | 'taxipastemp' | 'meettemp' | 'vehvzlomtemp' | 'jobtimetemp' | 'canoiltemp' | 'buyweaponstemp' | 'buybarbertemp' | 'drinkvodkatemp' | 'eatnaggtemp' | 'eatcheestemp' | 'drinkcofetemp' | 'drinenergytemp' | 'eatappletemp' | 'eatbanantemp' | 'eatpotfreetemp' | 'masfishtemp' | 'putinsotragetemp' | 'drinkrichtemp' | 'drinkvinetemp' | 'drinkpivotemp' | 'buylic3' | 'buylic4' | 'buylic5' | 'buybarber' | 'driftpoint1' | 'driftpoint2' | 'driftpoint3' | "rouleteCountWins" | "rouleteCountWins100" | "diceWinsCount20" | "diceWinsCount100" | "slotWinsCount20" | "slotWinsCount100" | "rouleteWinsSum2" | "rouleteWinsSum15" | "diceWinsSum2" | "diceWinsSum25" | "slotsWinsSum2" | "slotsWinsSum50" | "usecartpirat" | "usecarttreasures" | "usecartlocman"

/** Список постоянных достижений. Можно добавлять, нельзя удалять */
export const ACHIEVEMENT_LIST:AchievementItem[] = [
    { key: '24hours', name: 'Усердный игрок', desc: 'Отыграйте 24 часа и получите награду.',  max: 24, reward: {money: 3000}, type: "playTime" },
    { key: '48hours', name: 'Постоялец', desc: 'Отыграйте 48 часов и получите награду.',  max: 48, reward: {money: 7000}, type: "playTime" },
    { key: '72hours', name: 'Опытный', desc: 'Отыграйте 72 часа и получите награду.',  max: 72, reward: {money: 10000}, type: "playTime" },
    { key: '500hours', name: 'Психопат', desc: 'Отыграйте 500 часов и получите награду.',  max: 500, reward: {money: 500000}, type: "playTime" },
    { key: 'jobferma', name: 'Начинающий садовод', desc: `Заработать $${systemUtil.numberFormat(3000)} в саду.`, max: 3000, reward: { money: 1000 }, type: "jobmoney", jobId: "garden"},
    { key: 'jobferma2', name: 'Продвинутый садовод', desc: `Заработать $${systemUtil.numberFormat(6000)} в саду.`, max: 6000, reward: { money: 2000 }, type: "jobmoney", jobId: "garden"},
    { key: 'jobferma3', name: 'Опытный садовод', desc: `Заработать $${systemUtil.numberFormat(12000)} в саду.`, max: 12000, reward: { money: 3000 }, type: "jobmoney", jobId: "garden"},
    { key: 'jobbuilder', name: 'Начинающий строитель', desc: `Заработать $${systemUtil.numberFormat(3000)} на стройке.`, max: 3000, reward: { money: 1000 }, type: "jobmoney", jobId: "builder"},
    { key: 'jobbuilder1', name: 'Продвинутый строитель', desc: `Заработать $${systemUtil.numberFormat(6000)} на стройке.`, max: 6000, reward: { money: 2000 }, type: "jobmoney", jobId: "builder" },
    { key: 'jobbuilder2', name: 'Опытный строитель', desc: `Заработать $${systemUtil.numberFormat(12000)} на стройке.`, max: 12000, reward: { money: 3000 }, type: "jobmoney", jobId: "builder" },
    { key: 'jobwash', name: 'Начинающий мойщик', desc: `Заработать $${systemUtil.numberFormat(2000)} на мойщике окон.`, max: 2000, reward: { money: 1000 }, type: "jobmoney", jobId: "cleaning" },
    { key: 'jobwash1', name: 'Продвинутый мойщик', desc: `Заработать $${systemUtil.numberFormat(4000)} на мойщике окон.`, max: 4000, reward: { money: 1500 }, type: "jobmoney", jobId: "cleaning" },
    { key: 'jobwash2', name: 'Опытный мойщик', desc: `Заработать $${systemUtil.numberFormat(8000)} на мойщике окон.`, max: 8000, reward: { money: 2000 }, type: "jobmoney", jobId: "cleaning" },
    { key: 'jobtoni', name: 'Начинающий помощник', desc: `Заработать $${systemUtil.numberFormat(3000)} помогая Тони.`, max: 3000, reward: { money: 1000 }, type: "jobmoney", jobId: "marihuana" },
    { key: 'jobtoni1', name: 'Продвинутый помощник', desc: `Заработать $${systemUtil.numberFormat(6000)} помогая Тони.`, max: 6000, reward: { money: 2000 }, type: "jobmoney", jobId: "marihuana" },
    { key: 'jobtoni2', name: 'Опытный помощник', desc: `Заработать $${systemUtil.numberFormat(12000)} помогая Тони.`, max: 12000, reward: { money: 3000 }, type: "jobmoney", jobId: "marihuana" },
    { key: 'buyhouse', name: 'Местный', desc: 'Приобрести дом', max: 1, reward: { exp: 2 }, type: "buyHouse"},
    { key: 'buylic', name: 'Полный привод', desc: 'Получите лицензию на авто транспорт', max: 1, reward: { exp: 2 }, type: "giveLicense", license:["car"]},
    { key: 'buylic1', name: 'К рыбалке готов', desc: 'Получите лицензию на ловлю рыбы', max: 1, reward: { exp: 2, item: [855] }, type: "giveLicense", license:["fishrod"]},
    { key: 'buylic2', name: 'Дешёвая медицина', desc: 'Получите медицинскую страховку', max: 1, reward: { exp: 2, item: [902], money: 500 }, type: "giveLicense", license:["med"]},
    { key: 'buylic3', name: 'Опасный парень', desc: 'Получите лицензию на оружие', max: 1, reward: { exp: 2, money: 1500 }, type: "giveLicense", license:["weapon"]},
    { key: 'buylic4', name: 'Байкер', desc: 'Получите лицензию на вождение мотоцикла', max: 1, reward: { exp: 1, money: 300 }, type: "giveLicense", license:["moto"]},
    { key: 'buylic5', name: 'Иваныч', desc: 'Получите лицензию на вождение грузового транспорта', max: 1, reward: { exp: 1, money: 3000 }, type: "giveLicense", license:["truck"]},
    { key: 'Fishman', name: 'Бешенный рыбак', desc: `Поймайте ${systemUtil.numberFormat(2000)} рыбы`, max: 2000, reward: { exp: 1, item: [211, 25] }, type: "fishCount"},
    { key: 'duelman', name: 'Дантес', desc: 'Победить 100 раз в дуэлях', max: 100, reward: { money: 10000, exp: 1 }, type: "duelCount"},
    { key: 'duelman1', name: 'Пули и деньги', desc: `Заработай на ставках в дуэлях $${systemUtil.numberFormat(100000)}`, max: 100000, reward: { item: [1102] }, type: "duelSum"},
    { key: 'freeworkman', name: 'Бездельник', desc: `Заработай $${systemUtil.numberFormat(200000)} на пособии по безработице`, max: 200000, reward: { money: 5000, item: [2, 24] }, type: "noWorkMoneySum"},
    { key: 'meet', name: 'Известная личность', desc: 'Познакомься со 100 людьми', max: 100, reward: { money: 5000 }, type: "newMeet"},
    { key: 'adminevent', name: 'Активист', desc: 'Поучаствовать в 5 админ мероприятиях', max: 5, reward: { money: 10000 }, type: "eventEnter"},
    { key: 'invitehouse', name: 'Гастарбайтеры', desc: 'Прописать 5 человек в доме', max: 5, reward: { exp: 2 }, type: "inviteResident"},
    { key: 'jobmoneyall', name: 'Работник месяца', desc: `Заработать на начальных работах $${systemUtil.numberFormat(40000)}`, max: 40000, reward: { money: 10000, exp: 2 }, type: "jobmoney"},
    { key: '247magazine', name: 'Потребитель', desc: `Потратить $${systemUtil.numberFormat(100000)} в магазинах 24/7`, max: 100000, reward: { money: 5000, exp: 1 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 0},
    { key: 'buytunning', name: 'Гонщик', desc: `Потратить $${systemUtil.numberFormat(1000000)} в автомастерских`, max: 1000000, reward: { item: [865, 815, 817] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.TUNING },
    { key: 'buyweapons', name: 'Беспредельщик', desc: `Потратить $${systemUtil.numberFormat(1000000)} в магазинах с оружием`, max: 1000000, reward: { item: [532, 1601, 1101, 1102, 1005, 1100] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 2},
    { key: 'buyclotches', name: 'Модный но голодный', desc: `Потратить $${systemUtil.numberFormat(1000000)} в магазинах одежды`, max: 1000000, reward: { item: [26], money: 10000, exp: 1 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.DRESS_SHOP},
    { key: 'buytatu', name: 'Татуированный', desc: `Потратить $${systemUtil.numberFormat(50000)} в тату салонах`, max: 50000, reward: { money: 5000, exp: 1 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.TATTOO_SALON},
    { key: 'buybarber', name: 'Ухоженный', desc: `Потратить $${systemUtil.numberFormat(50000)} в барбер шопах`, max: 50000, reward: { money: 5000, exp: 1 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.BARBER},
    { key: 'winsplacerace', name: 'Вин Дизель', desc: 'Занять 100 раз призовое место в гонках', max: 100, reward: { item: [815], money: 50000, exp: 2 }, type: "raceWinPLace"},
    { key: 'winsrace', name: 'Шумахер', desc: 'Победить в гонке', max: 1, reward: { item: [815], money: 2000 }, type: "raceFirst"},
    { key: 'sellcarsruki', name: 'Перекуп', desc: 'Продать 5 автомобилей игроку', max: 5, reward: { item: [817, 815], money: 10000 }, type: "vehSellPlayer"},
    { key: 'sellcarsgos', name: 'Опустошитель', desc: 'Продать 10 автомобилей государству', max: 10, reward: { item: [817] }, type: "vehSellGos"},
    { key: 'passtaxi', name: 'Пьяный пешеход', desc: 'Проехаться на такси 100 раз', max: 100, reward: { item: [209, 29], money: 2000, exp: 2 }, type: "taxiPassengerCount"},
    { key: 'drivetaxi', name: 'Сами Насери', desc: 'Отвезти 100 человек на такси', max: 100, reward: { item: [817, 815], money: 10000, exp: 1 }, type: "taxiDriverCount"},
    { key: 'drivetruck', name: 'Йокараный бабай сворачивай', desc: 'Отвезти 100 грузов', max: 100, reward: { money: 35000 }, type: "deliverCount"},
    { key: 'vzlommachin', name: 'Форточник', desc: 'Угнать 100 машин для Ламара', max: 100, reward: { money: 20000 }, type: "vehJackLamar"},
    { key: 'otdelkahati', name: 'Равшан', desc: '1 раз выполнить работу ремонта квартиры', max: 1, reward: { exp: 2, item: [24, 2] }, type: "flatCount"},
    { key: 'otdelkahati1', name: 'Джамшут', desc: '10 раз выполнить работу ремонта квартиры', max: 10, reward: { exp: 3, item: [24, 2] }, type: "flatCount"},
    { key: 'achiev', name: 'Освоился', desc: 'Выполните 5 достижений', max: 5, reward: { money: 5000, exp: 1 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'achiev1', name: 'Местный', desc: 'Выполните 20 достижений', max: 20, reward: { money: 7000, exp: 1 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'achiev2', name: 'Верный резидент', desc: 'Выполните 40 достижений', max: 40, reward: { money: 10000 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'driftpoint1', name: 'Первая лысая покрышка', desc: `Заработать ${systemUtil.numberFormat(150000)} очков на дрифт карте`, max: 150000, reward: { money: 15000, item: [815, 817] }, type: "driftPoints" },
    { key: 'driftpoint2', name: 'Ездок боком', desc: `Заработать ${systemUtil.numberFormat(500000)} очков на дрифт карте`, max: 500000, reward: { money: 25000, item: [815, 817] }, type: "driftPoints" },
    { key: 'driftpoint3', name: 'Король дрифта', desc: `Заработать ${systemUtil.numberFormat(1000000)} очков на дрифт карте`, max: 1000000, reward: { money: 50000, item: [815, 817] }, type: "driftPoints" },
    { key: 'rouleteCountWins', name: 'Счастливчик', desc: `Сделать 20 победных ставок на рулетке`, max: 20, reward: {exp: 2}, type: "casinoRouletteWinCount" },
    { key: 'rouleteCountWins100', name: 'Везунчик', desc: `Сделать 100 победных ставок на рулетке`, max: 100, reward: {exp: 3}, type: "casinoRouletteWinCount" },
    { key: 'diceWinsCount20', name: 'Игрок в кости', desc: `Выиграть 20 раз в кости`, max: 20, reward: {exp: 2}, type: "casinoDiceWinCount" },
    { key: 'diceWinsCount100', name: 'Мастер игры в кости', desc: `Выиграть 100 раз в кости`, max: 100, reward: {exp: 3}, type: "casinoDiceWinCount" },
    { key: 'slotWinsCount20', name: 'Ох уж эти автоматы', desc: `Выиграть 20 раз играя на слот машинах`, max: 20, reward: {exp: 2}, type: "casinoSlotsWinCount" },
    { key: 'slotWinsCount100', name: 'Азартный игрок', desc: `Выиграть 100 раз играя на слот машинах`, max: 100, reward: {exp: 3}, type: "casinoSlotsWinCount" },
    { key: 'rouleteWinsSum2', name: 'Чёрное или Красное?', desc: `Выиграть ${systemUtil.numberFormat(2000)} фишек на ставках рулетке`, max: 2000, reward: {exp: 2}, type: "casinoRouletteWinSum" },
    { key: 'rouleteWinsSum15', name: 'Чёрное или Красное?', desc: `Выиграть ${systemUtil.numberFormat(15000)} фишек на ставках в рулетке`, max: 15000, reward: {exp: 3}, type: "casinoRouletteWinSum" },
    { key: 'diceWinsSum2', name: 'Кости', desc: `Выиграть ${systemUtil.numberFormat(2000)} фишек на ставках в кости`, max: 2000, reward: {exp: 2}, type: "casinoDiceWinSum" },
    { key: 'diceWinsSum25', name: 'Кости', desc: `Выиграть ${systemUtil.numberFormat(25000)} фишек на ставках в кости`, max: 25000, reward: {exp: 3}, type: "casinoDiceWinSum" },
    { key: 'slotsWinsSum2', name: 'Слоты', desc: `Выиграть ${systemUtil.numberFormat(2000)} фишек в автоматах`, max: 2000, reward: {exp: 2}, type: "casinoSlotsWinSum" },
    { key: 'slotsWinsSum50', name: 'Слоты', desc: `Выиграть ${systemUtil.numberFormat(50000)} фишек в автоматах`, max: 50000, reward: {exp: 3}, type: "casinoSlotsWinSum" },
    // Для дайвинга
    { key: 'usecartpirat', name: 'Соберите карту пиратов', desc: 'Использовать карту пиратов', max: 1, reward: { money: 20000}, type: "useItem", item_id: [6526]},
    { key: 'usecarttreasures', name: 'Соберите карту сокровищ', desc: 'Использовать карту сокровищ', max: 1, reward: { money: 50000}, type: "useItem", item_id: [6527]},
    { key: 'usecartlocman', name: 'Соберите карту лоцмана', desc: 'Использовать карту лоцмана', max: 1, reward: { money: 100000}, type: "useItem", item_id: [6528]},
]

/** Список ежедневных достижений. Можно добавлять, нельзя удалять */
export const ACHIEVEMENT_TEMP_LIST:AchievementItem[] = [
    { key: '1hours', name: '1 час онлайн', desc: 'Отыграйте 1 час и получите награду.', max: 1, reward: { money: 300, item: [1] }, type: "playTime"},
    { key: '2hours', name: '2 часа онлайн', desc: 'Отыграйте 2 часа и получите награду.', max: 2, reward: { money: 400, item: [21] }, type: "playTime"},
    { key: 'duelstemp', name: 'Дуэлянт', desc: 'Победить 5 раз дуэлях', max: 5, reward: { money: 1000, item: [1] }, type: "duelCount"},
    { key: 'racetemp', name: 'Гонщик', desc: 'Занять призовове место в гонках', max: 1, reward: { money: 1000, item: [21] }, type: "raceWinPLace"},
    { key: 'healtemp', name: 'Жить здорово', desc: 'Использовать аптечку', max: 1, reward: { money: 150, item: [1]}, type: "useItem", item_id: [902]},
    { key: 'drinktemp', name: 'Поддать жару', desc: 'Выпить бутылку виски', max: 1, reward: { money: 150, item: [21] }, type: "useItem", item_id: [209]},
    { key: 'eattemp', name: 'Пухляш', desc: 'Съесть пиццу или выпить банку колы', max: 1, reward: { money: 150, item: [1] }, type: "useItem", item_id: [24, 2]},
    { key: 'narkotemp', name: 'Утром йога, вечером дорога', desc: 'Употребить кокаин', max: 1, reward: { money: 200, item: [21] }, type: "useItem", item_id: [54]},
    { key: '247magazinetemp', name: 'Шопоголик', desc: `Потратить $${systemUtil.numberFormat(1000)} в магазинах 24/7`, max: 1000, reward: { money: 400, item: [1] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 0 },
    { key: 'buyclotchestemp', name: 'Новый лук', desc: `Потратить $${systemUtil.numberFormat(5000)} в магазинах одежды`, max: 5000, reward: { money: 1000, item: [21] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.DRESS_SHOP },
    { key: 'buytunningtemp', name: 'Отполировать бричку', desc: `Потратить $${systemUtil.numberFormat(500)} в автомастерской`, max: 500, reward: { item: [815] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.TUNING },
    { key: 'buyaptekatemp', name: 'Пенсия близко', desc: `Потратить $${systemUtil.numberFormat(2000)} в аптеке`, max: 2000, reward: { item: [902], money: 500 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 3 },
    { key: 'buyfueltemp', name: 'Хлебнуть бензина', desc: `Потратить $${systemUtil.numberFormat(500)} на заправку автотранспорта`, max: 500, reward: { item: [817], money: 100 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.FUEL, subtypeBiz: 0 },
    { key: 'buyprokattemp', name: 'Никакой ответственности', desc: `Потратить $${systemUtil.numberFormat(100)} взяв транспорт в прокат`, max: 100, reward: { money: 50, item: [1] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.VEHICLE_SHOP, subtypeBiz: 0 },
    { key: 'modweaponstemp', name: 'Голый пистолет', desc: 'Поставить модификацию на любое оружие', max: 1, reward: { money: 500 }, type: "itemMove", owner_types: [23] },
    { key: 'fishtemp', name: 'Яяяяязь', desc: 'Поймайте 10 рыб', max: 10, reward: { money: 1000 }, type: "fishCount" },
    { key: 'worktemp1', name: 'Жареные гвозди', desc: `Заработайте $${systemUtil.numberFormat(500)} на стройке`, max: 500, reward: { money: 500 }, type: "jobmoney", jobId: "builder" },
    { key: 'worktemp2', name: 'Рога и копыта', desc: `Заработайте $${systemUtil.numberFormat(500)} в саду`, max: 500, reward: { money: 500 }, type: "jobmoney", jobId: "garden" },
    { key: 'worktemp3', name: 'Мойдодыр', desc: `Заработайте $${systemUtil.numberFormat(500)} мойкой окон`, max: 500, reward: { money: 500 }, type: "jobmoney", jobId: "cleaning" },
    { key: 'worktemp4', name: 'Smoke everyday...', desc: `Заработайте $${systemUtil.numberFormat(500)} помогая в гараже Тони`, max: 500, reward: { money: 500 }, type: "jobmoney", jobId: "marihuana" },
    { key: 'taxipastemp', name: 'Уехать в закат', desc: 'Прокатиться на такси', max: 1, reward: { money: 250 }, type: "taxiPassengerCount" },
    { key: 'meettemp', name: 'Тёплые ручки', desc: 'Познакомится с одним человеком', max: 1, reward: { item: [7] }, type: "newMeet" },
    { key: 'vehvzlomtemp', name: 'Отмычка-друг', desc: 'Взломайте любую машину', max: 1, reward: { money: 500 }, type: "vehJack" },
    { key: 'jobtimetemp', name: 'Утренняя пробежка', desc: `Заработать на начальных работах $${systemUtil.numberFormat(500)}`, max: 500, reward: { money: 250 }, type: "jobmoney" },
    { key: 'canoiltemp', name: 'Ароматная канистра', desc: 'Заправить машину канистрой с бензином', max: 1, reward: { money: 250, item: [817] }, type: "useItem", item_id: [817] },
    { key: 'buyweaponstemp', name: 'Опасный прохожий', desc: `Потратить $${systemUtil.numberFormat(1000)} в магазине оружия`, max: 1000, reward: { item: [206] }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 2 },
    { key: 'buybarbertemp', name: 'Сергей Зверев', desc: `Потратить $${systemUtil.numberFormat(1000)} в барбер шопе`, max: 1000, reward: { money: 500 }, type: "buyShopSum", typeBiz: BUSINESS_TYPE.BARBER },
    { key: 'drinkvodkatemp', name: 'Мальчик водочки нам принеси', desc: 'Выпить бутылку водки', max: 1, reward: { money: 250 }, type: "useItem", item_id: [211]},
    { key: 'eatnaggtemp', name: 'Петушиный принц', desc: 'Съесть 20 нагетсов', max: 20, reward: { money: 150 }, type: "useItem", item_id: [27]},
    { key: 'eatcheestemp', name: 'Американская мечта', desc: 'Навернуть 10 чизбургеров за раз', max: 10, reward: { money: 1200 }, type: "useItem", item_id: [20]},
    { key: 'drinkcofetemp', name: 'Очаровательная бессоница', desc: 'Выпить 8 чашек кофе', max: 8, reward: { money: 1000 }, type: "useItem", item_id: [5]},
    { key: 'drinenergytemp', name: 'Заместитель батарейки', desc: 'Выпить 5 энергетиков', max: 5, reward: { money: 600 }, type: "useItem", item_id: [7]},
    { key: 'eatappletemp', name: 'Запретный плод', desc: 'Скушать яблоко', max: 1, reward: { money: 100 }, type: "useItem", item_id: [28]},
    { key: 'eatbanantemp', name: 'Австралопитек', desc: 'Съесть 20 бананов', max: 20, reward: { money: 1000 }, type: "useItem", item_id: [25]},
    { key: 'eatpotfreetemp', name: 'Жук навозный', desc: 'Съесть картошку фри', max: 1, reward: { money: 150 }, type: "useItem", item_id: [22]},
    { key: 'masfishtemp', name: 'Рыбных дел мастер', desc: 'Выловить 20 рыб', max: 20, reward: { money: 1000 }, type: "fishCount"},
    { key: 'putinsotragetemp', name: 'Сделать нычку', desc: 'Переместить предмет в любое место', max: 1, reward: { item: [1] }, type: "itemMove"},
    { key: 'drinkrichtemp', name: 'Крепкий и матёрый', desc: 'Выпить 5 коньяка, виски или бурбона', max: 5, reward: { money: 1000 }, type: "useItem", item_id: [209, 210, 215] },
    { key: 'drinkvinetemp', name: 'Сомелье под шафе', desc: 'Выпить 3 бутылки вина', max: 3, reward: { money: 1000 }, type: "useItem", item_id: [212, 213, 214] },
    { key: 'drinkpivotemp', name: 'Пивной романтик', desc: 'Выпить 8 бутылок пива', max: 8, reward: { money: 2000 }, type: "useItem", item_id: [201, 202, 203, 204, 205, 206, 207, 208] },
]

export const getAchievConfigBiz = (typeBiz: BUSINESS_TYPE, subtypeBiz:number) => {
    return ACHIEVEMENT_LIST.filter(q => q.type === 'buyShopSum' && (!q.typeBiz || q.typeBiz == typeBiz) && (!q.subtypeBiz || q.subtypeBiz == subtypeBiz)) as AchievementItemBiz[]
}

export const getAchievConfig = (key: UserAchievmentKey) => {
    return ACHIEVEMENT_LIST.find(q => q.key === key);
}
export const getTempAchievConfig = (key: UserAchievmentKey) => {
    return ACHIEVEMENT_TEMP_LIST.find(q => q.key === key);
}
export const getAchievConfigByType = (type: typeof ACHIEVEMENT_LIST[number]['type']):AchievementItem[] => {
    return ACHIEVEMENT_LIST.filter(q => q.type === type);
}
export const getTempAchievConfigByType = (type: typeof ACHIEVEMENT_LIST[number]['type']):AchievementItem[] => {
    return ACHIEVEMENT_LIST.filter(q => q.type === type);
}