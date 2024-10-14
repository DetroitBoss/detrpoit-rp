import {clothShopNames} from "./cloth";
import {VEHICLE_FUEL_TYPE} from "./vehicles";
import {LocationCategoryEnum} from "./phone/locationCategories.enum";

/** Процент от бизнеса в Goverment **/
export const BUSINESS_GOV_PERCENT = 2;

/** Какой уровень нужен чтобы купить бизнес */
export const BUSINESS_BUY_LEVEL = 0;

export const enum FUEL_COST {
    /** Электричество */
    ELECTRO = 5,
    /** 92 */
    A92 = 10,
    /** 95 */
    A95 = 12,
    /** 98 */
    A98 = 15,
    /** Дизель */
    DISEL = 8,
    /** Авиатопливо */
    AIR = 18,
}

export const getFuelCost = (type: VEHICLE_FUEL_TYPE) => {
    if (type === VEHICLE_FUEL_TYPE.DISEL) return FUEL_COST.DISEL;
    else if (type === VEHICLE_FUEL_TYPE.ELECTRO) return FUEL_COST.ELECTRO;
    else if (type === VEHICLE_FUEL_TYPE.AIR) return FUEL_COST.AIR;
    else if (type === VEHICLE_FUEL_TYPE.A98) return FUEL_COST.A98;
    else if (type === VEHICLE_FUEL_TYPE.A95) return FUEL_COST.A95;
    else if (type === VEHICLE_FUEL_TYPE.A92) return FUEL_COST.A92;
    else return 0;
}

export const enum BUSINESS_TYPE {
    /** Банки */
    BANK = 0,
    /** Автосалоны */
    VEHICLE_SHOP = 1,
    /** Магазины товаров */
    ITEM_SHOP = 2,
    /** Заправки */
    FUEL = 3,
    /** Магазины одежды */
    DRESS_SHOP = 4,
    /** Тату салоны */
    TATTOO_SALON = 5,
    /** Автомастерские */
    TUNING = 6,
    /** Клубы и бары */
    BAR = 7,
    /** Парковки */
    PARKING = 8,
    /** Барбершоп */
    BARBER = 9,
    /** Автомойка */
    WASH = 10,
}

export const BUSINESS_TYPE_NAMES = ["Банки", "Продажа/Прокат транспорта", "Магазины", "Заправки", "Магазины одежды", "Тату салоны", "Автомастерские", "Клубы/Бары", 'Парковки', 'Барбершопы', 'Автомойки'];
export const BUSINESS_TYPE_CATEGORIES = [LocationCategoryEnum.Banks, LocationCategoryEnum.Car_Showroom, LocationCategoryEnum.Shop_24_7, LocationCategoryEnum.Refueling, LocationCategoryEnum.Clothing_Store, LocationCategoryEnum.Clothing_Store, LocationCategoryEnum.Los_Santos_Customs, LocationCategoryEnum.Clubs, LocationCategoryEnum.Parking, LocationCategoryEnum.Clothing_Store, LocationCategoryEnum.Car_Wash];
export const BUSINESS_SUBTYPE_NAMES = [
    ["Pacific Standart Bank", "Maze Bank", "Fleeca Bank", "Blane Bank"],
    ["Прокат транспорта", "Автосалон", "Автосалон", "Автосалон", "Мотосалон", "Лодочная станция", "Воздушный транспорт", "Автосалон", "Редкий транспорт"],
    ["Магазин 24/7", "Магазин электроники", "Оружейный магазин", "Аптека", "Магазин сумок и рюкзаков", "Фермерский магазин", "Магазин питомцев", "Табачный магазин"],
    ["Заправка", "Заправка"],
    clothShopNames,
    ["Тату салон", "Тату салон", "Тату салон", "Тату салон", "Тату салон"],
    ["Автомастерская", "Чип-тюнинг"],
    ["Клуб", "Клуб"],
    ["Парковка", "Парковка"],
    ["Барбершоп", "Барбершоп", "Барбершоп", "Барбершоп"],
    ["Автомойка"],
];


/** Множитель того, сколько мы дадим денег бизнесу просто так. За основу берётся суточный PayDay */
export const DAYLY_ADD_MONEY = 2;


export const npcBusiness = {
    ITEM: [
        // 24/7
        ['s_m_y_busboy_01', 's_m_m_linecook', 'ig_manuel', 'cs_marnie', 's_f_y_migrant_01', 's_m_m_migrant_01', 'ig_russiandrunk', 'a_m_m_salton_02', 'g_m_y_salvagoon_02', 'mp_m_shopkeep_01', 'a_f_m_soucent_02', 'a_f_y_soucent_02', 's_m_m_strvend_01', 's_f_m_sweatshop_01', 's_f_y_sweatshop_01', 'mp_f_counterfeit_01', 'mp_f_weed_01', 'u_m_y_burgerdrug_01', 'a_m_m_farmer_01', 'a_m_o_genstreet_01', 'cs_jimmyboston', 'ig_oneil'],
        // Электроника
        ['a_m_y_stlat_01', 'u_m_y_baygor', 's_m_y_strvend_01', 'a_m_y_stwhi_02', 'cs_taocheng', 'a_m_y_vinewood_03', 'mp_f_execpa_01', 'ig_andreas', 'a_m_y_bevhills_01', 'a_m_y_bevhills_02', 'mp_f_boatstaff_01', 'u_m_y_burgerdrug_01', 'a_m_y_busicas_01', 'a_f_y_business_02', 'a_m_y_business_02', 'a_f_y_business_04', 'u_m_y_chip', 'csb_imran', 'g_m_y_pologoon_01', 'ig_popov'],
        // Оружейный
        ['u_m_y_baygor', 'u_m_y_baygor', 'u_m_o_taphillbilly', 'ig_terry', 'mp_m_weapexp_01', 's_m_y_ammucity_01', 'a_m_m_bevhills_02', 'a_f_y_business_04', 's_m_o_busker_01', 'ig_car3guy1', 'ig_car3guy2', 'csb_chin_goon', 'ig_cletus', 's_m_m_cntrybar_01', 'mp_m_exarmy_01', 'u_m_m_filmdirector', 'ig_josef', 'a_m_o_ktown_01', 'ig_popov', 'ig_russiandrunk'],
        // Аптека
        ['u_m_y_baygor', 'a_m_y_beachvesp_01', 'a_m_y_beachvesp_02', 'a_m_m_bevhills_01', 'a_m_m_bevhills_02', 'a_m_y_bevhills_02', 'mp_f_boatstaff_01', 'a_f_y_business_04', 'a_m_o_genstreet_01', 'ig_jay_norris', 'a_f_o_ktown_01', 'a_f_m_tourist_01', 'mp_f_execpa_01'],
        // Магазин сумок и рюкзаков
        ['u_m_y_baygor', 'u_m_y_baygor', 'u_m_o_taphillbilly', 'ig_terry', 'mp_m_weapexp_01', 's_m_y_ammucity_01', 'a_m_m_bevhills_02', 'a_f_y_business_04', 's_m_o_busker_01', 'ig_car3guy1', 'ig_car3guy2', 'csb_chin_goon', 'ig_cletus', 's_m_m_cntrybar_01', 'mp_m_exarmy_01', 'u_m_m_filmdirector', 'ig_josef', 'a_m_o_ktown_01', 'ig_popov', 'ig_russiandrunk'],
        // Фермерский магазин
        ['u_m_y_baygor', 'u_m_y_baygor', 'u_m_o_taphillbilly', 'ig_terry', 'mp_m_weapexp_01', 's_m_y_ammucity_01', 'a_m_m_bevhills_02', 'a_f_y_business_04', 's_m_o_busker_01', 'ig_car3guy1', 'ig_car3guy2', 'csb_chin_goon', 'ig_cletus', 's_m_m_cntrybar_01', 'mp_m_exarmy_01', 'u_m_m_filmdirector', 'ig_josef', 'a_m_o_ktown_01', 'ig_popov', 'ig_russiandrunk'],
        // Магазин питомцев
        ['u_m_y_baygor', 'u_m_y_baygor', 'u_m_o_taphillbilly', 'ig_terry', 'mp_m_weapexp_01', 's_m_y_ammucity_01', 'a_m_m_bevhills_02', 'a_f_y_business_04', 's_m_o_busker_01', 'ig_car3guy1', 'ig_car3guy2', 'csb_chin_goon', 'ig_cletus', 's_m_m_cntrybar_01', 'mp_m_exarmy_01', 'u_m_m_filmdirector', 'ig_josef', 'a_m_o_ktown_01', 'ig_popov', 'ig_russiandrunk'],
        // Магазин табачки
        ['u_m_y_baygor', 'u_m_y_baygor', 'u_m_o_taphillbilly', 'ig_terry', 'mp_m_weapexp_01', 's_m_y_ammucity_01', 'a_m_m_bevhills_02', 'a_f_y_business_04', 's_m_o_busker_01', 'ig_car3guy1', 'ig_car3guy2', 'csb_chin_goon', 'ig_cletus', 's_m_m_cntrybar_01', 'mp_m_exarmy_01', 'u_m_m_filmdirector', 'ig_josef', 'a_m_o_ktown_01', 'ig_popov', 'ig_russiandrunk'],
    ],
    DRESS: [
        // Discount Store
        ['a_f_m_bevhills_01', 'a_m_y_bevhills_01', 'ig_bride', 'a_f_y_business_01', 'csb_customer', 'ig_denise', 'a_m_y_cyclist_01', 'a_f_y_eastsa_01', 'a_f_y_eastsa_03', 'a_f_y_epsilon_01', 'a_m_y_eastsa_02', 'g_m_y_famfor_01', 'cs_jewelass', 'a_m_y_indian_01', 'ig_lamardavis', 'u_f_y_mistress', 'cs_movpremf_01'],
        // Binco
        ['a_m_y_mexthug_01', 'csb_oscar', 'g_m_y_pologoon_01', 'a_f_o_soucent_01', 'a_m_m_soucent_01', 'g_m_y_strpunk_01', 's_m_y_strvend_01', 'a_m_y_sunbathe_01', 's_f_y_sweatshop_01', 'a_f_y_vinewood_01', 'a_f_y_vinewood_02', 'a_m_y_vinewood_03', 'a_f_y_vinewood_04'],
        // Suburban
        ['g_m_y_ballaeast_01', 'g_m_y_ballaorig_01', 'g_f_y_ballas_01', 'g_m_y_ballasout_01', 'g_m_m_chigoon_02', 'ig_claypain', 'g_m_y_famdnf_01', 'g_f_y_families_01', 'a_f_y_fitness_01', 'ig_g', 's_m_y_grip_01'],
        // Ponsonbys
        ['s_f_y_airhostess_01', 'ig_barry', 'mp_f_boatstaff_01', 'mp_m_boatstaff_01', 'u_f_y_comjane', 'ig_dale', 'u_f_y_jewelass_01', 'u_m_m_jewelthief', 'ig_josh', 'ig_milton', 'cs_movpremmale', 'u_f_y_princess', 'csb_reporter', 'a_f_y_femaleagent'],
        // Магазин эксклюзивной одежды
        ['s_f_y_airhostess_01', 'ig_barry', 'mp_f_boatstaff_01', 'mp_m_boatstaff_01', 'u_f_y_comjane', 'ig_dale', 'u_f_y_jewelass_01', 'u_m_m_jewelthief', 'ig_josh', 'ig_milton', 'cs_movpremmale', 'u_f_y_princess', 'csb_reporter', 'a_f_y_femaleagent']
    ],
    TATTOO: [
        // Blazing Tattoos
        ['u_m_y_baygor', 'a_f_y_juggalo_01', 'g_f_y_lost_01', 's_m_y_robber_01', 'ig_benny', 'ig_hao'],
        // Body Art Tattoos
        ['u_m_y_baygor', 'u_f_y_bikerchic', 'g_m_y_lost_01', 'ig_g', 'a_m_y_gay_01', 'u_m_y_tattoo_01'],
        // The Pit Tattoos
        ['u_m_y_baygor', 'u_m_y_guido_01', 'ig_ortega', 'cs_jimmyboston', 'a_m_m_soucent_04', 'ig_terry'],
        // Los Santos Tattoos
        ['u_m_y_baygor', 'u_m_y_sbike', 'csb_porndudes', 'ig_stretch', 'g_m_y_strpunk_01'],
        // Ink Ink Tattoos
        ['u_m_y_baygor', 'g_f_y_vagos_01', 'a_f_y_vinewood_02', 's_m_y_xmech_02', 'g_m_y_strpunk_02', 's_m_y_strvend_01', 'a_m_m_soucent_04'],
    ],
    BAR: [
        // Клубы
        ['csb_anita', 's_m_y_barman_01', 'a_m_y_beachvesp_02', 'ig_benny', 'u_f_y_bikerchic', 'mp_f_boatstaff_01', 'a_f_y_business_04', 'ig_car3guy1',
        'ig_car3guy2', 'u_m_y_chip', 'ig_dale', 'ig_g', 'u_m_y_gunvend_01', 'csb_imran', 'ig_jewelass', 'u_m_m_jewelthief', 'ig_taocheng', 'mp_f_execpa_01'],
        // Бары
        ['u_m_m_aldinapoli', 'a_m_y_beachvesp_01', 'ig_benny', 'a_m_m_bevhills_02', 'a_f_y_bevhills_04', 'u_f_y_bikerchic', 'ig_car3guy1',
        'ig_car3guy2', 'ig_clay', 'ig_cletus', 's_m_m_cntrybar_01', 'a_m_y_eastsa_02', 'a_m_y_genstreet_01', 'a_m_y_hipster_02', 'csb_hugh',
        'ig_jay_norris', 'g_m_y_lost_01', 'u_f_y_mistress', 'g_m_y_pologoon_01', 's_m_y_strvend_01', 'u_m_o_taphillbilly', 'u_m_y_tattoo_01',
        'g_f_y_vagos_01', 'a_f_y_vinewood_02', 's_m_y_xmech_02_mp'],
    ],
    BARBER: [
        ['u_m_y_baygor', 'a_f_y_juggalo_01', 'g_f_y_lost_01', 's_m_y_robber_01', 'ig_benny', 'ig_hao'],
        ['u_m_y_baygor', 'a_f_y_juggalo_01', 'g_f_y_lost_01', 's_m_y_robber_01', 'ig_benny', 'ig_hao'],
        ['u_m_y_baygor', 'a_f_y_juggalo_01', 'g_f_y_lost_01', 's_m_y_robber_01', 'ig_benny', 'ig_hao'],
        ['u_m_y_baygor', 'a_f_y_juggalo_01', 'g_f_y_lost_01', 's_m_y_robber_01', 'ig_benny', 'ig_hao'],
    ],
}

/** Дальность отрисовки транспорта */
export const StaticVehicleStreamRange = 200;
export const StaticVehicle: {
    // Модель ТС
    model : string;
    // Координаты
    x: number;
    y: number;
    z: number;
    // Угол поворота
    h: number;
    color1: [number, number, number];
    color2: [number, number, number];
    spin?: boolean;

}[] = [
//     model: "g500",
//     x: -782.61,
//     y: -213.84,
//     z: 37.27,
//     h: 167,
//     color1: [1,1,1],
//     color2: [1,1,1],
//     spin: true
//},
]