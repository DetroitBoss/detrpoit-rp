// import {DynamicBlipOption} from "./dynamicBlip";
import {BUSINESS_TYPE} from "./business";
import {SELL_FISH_POS} from "./npc.customer";
import {WEDDING_NAME, WEDDING_POS} from "./wedding";
import {HousesTeleportsList} from "./houses";
import {CONSTRUCTION_REGISTER_POS} from "./construction";
import {DRIFT_MAP_EXIT} from "./drift";
import {DynamicBlipOption} from "./dynamicBlip";
import { COIN_SELL_POS } from "./mining";
import {FAMILY_CREATE_POS_CRIME} from "./family";

export const BUSINESS_BLIPS: {type: BUSINESS_TYPE, subtype: number, blip: number, color: number, scale?: number}[] = [
    {type: BUSINESS_TYPE.BANK, subtype: 0, blip: 374, color: 39},
    {type: BUSINESS_TYPE.BANK, subtype: 1, blip: 374, color: 1},
    {type: BUSINESS_TYPE.BANK, subtype: 2, blip: 374, color: 2},
    {type: BUSINESS_TYPE.BANK, subtype: 3, blip: 374, color: 3},
    {type: BUSINESS_TYPE.FUEL, subtype: 0, blip: 415, color: 4},
    {type: BUSINESS_TYPE.FUEL, subtype: 1, blip: 415, color: 4},
    {type: BUSINESS_TYPE.TUNING, subtype: 0, blip: 446, color: 0},
    {type: BUSINESS_TYPE.TUNING, subtype: 1, blip: 488, color: 0},
    {type: BUSINESS_TYPE.PARKING, subtype: 0, blip: 267, color: 38},
    {type: BUSINESS_TYPE.PARKING, subtype: 1, blip: 267, color: 38},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 0, blip: 739, color: 4, scale: 0.7},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 1, blip: 225, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 2, blip: 225, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 3, blip: 225, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 4, blip: 226, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 5, blip: 427, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 6, blip: 251, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 7, blip: 225, color: 4},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 8, blip: 530, color: 4},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 0, blip: 52, color: 0},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 1, blip: 521, color: 4},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 2, blip: 110, color: 0},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 3, blip: 153, color: 69},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 4, blip: 597, color: 69},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 5, blip: 52, color: 2},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 6, blip: 463, color: 64},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 7, blip: 403, color: 48},
    {type: BUSINESS_TYPE.BAR, subtype: 0, blip: 136, color: 4},
    {type: BUSINESS_TYPE.BAR, subtype: 1, blip: 136, color: 4},
    {type: BUSINESS_TYPE.BARBER, subtype: 0, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 1, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 2, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 3, blip: 71, color: 81},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 0, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 1, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 2, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 3, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 4, blip: 75, color: 10},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 0, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 1, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 2, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 3, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 4, blip: 617, color: 3},
    {type: BUSINESS_TYPE.WASH, subtype: 0, blip: 100, color: 4},
]

export const getBusinessBlip = (type: BUSINESS_TYPE, subtype: number) => {
    return BUSINESS_BLIPS.find(q => q.type === type && q.subtype === subtype)
}

export const BLIPS_DATA: { type: number, color: number, position: Vector3Mp, name: string, options?: DynamicBlipOption}[] = [
    {
        type: 621, 
        color: 1,
        position: new mp.Vector3(283.97, -586.67, 43.38),
        name: "Больница"
        
    },
    {
        type: 540, 
        color: 63,
        position: new mp.Vector3(2506.09, -379.85, 94.12),
        name: "FIB"
    },
    {
        type: 526, 
        color: 60,
        position: new mp.Vector3(1846.05, 3679.35, 38.89),
        name: "Sheriffs Department"
    },
    {
        type: 526, 
        color: 60,
        position: new mp.Vector3(-447.44, 6008.74, 40.32),
        name: "Sheriffs Department"
    },
    {
        type: 598, 
        color: 4,
        position: new mp.Vector3(-2018.60, 3162.23, 57.58),
        name: "Army"
    },
    {
        type: 78, 
        color: 2,
        position: new mp.Vector3(-1503.98, 850.20, 188.74),
        name: "Русское посольство"
    },
    // {
    //     type: 78, 
    //     color: 4,
    //     position: new mp.Vector3(-1374.22, 54.72, 60.38),
    //     name: "Русское посольство"
    // },
    {
        type: 78, 
        color: 1,
        position: new mp.Vector3(-349.98, 191.19, 103.70),
        name: "Японское посольство"
    },
    {
        type: 78, 
        color: 46,
        position: new mp.Vector3(1405.99, 1147.69, 119.26),
        name: "Итальянское посольство"
    },
    {
        type: 590, 
        color: 59,
        position: new mp.Vector3(-585.05, -928.50, 36.83),
        name: "Weazel News"
    },
    {
        type: 672, 
        color: 18,
        position: new mp.Vector3(-704.59, -1286.57, 5.05),
        name: "Регистрация ТС"
    },
    {
        type: 641, 
        color: 50,
        position: new mp.Vector3(-1656.09, -826.43, 9.94),
        name: "Продажа ТС"
    },
    {
        type: 238, 
        color: 4,
        position: new mp.Vector3(1848.93, 2608.78, 45.59),
        name: "Тюрьма"
    },
    {
        type: 126, 
        color: 41,
        position: new mp.Vector3(-235.38, -2035.33, 36.20),
        name: "Мероприятия (Maze Arena)"
    },
    {
        type: 621, 
        color: 1,
        position: new mp.Vector3(-249.51, 6326.59, 32.43),
        name: "Больница"
        
    },
    {
        type: 280, 
        color: 8,
        position: new mp.Vector3(295.27, -1191.71, 29.25),
        name: "Ламар"
        
    },
    {
        type: 280, 
        color: 5,
        position: new mp.Vector3(20.22, -1301.45, 29.13),
        name: "Стэнли"
        
    },
    {
        type: 280, 
        color: 5,
        position: new mp.Vector3(-1066.14, -873.60, 4.99),
        name: "Джеффри"
        
    },
    {
        type: 84, 
        color: 59,
        position: new mp.Vector3(-461.37, -1715.58, 18.64),
        name: "Bloods"
        
    },
    {
        type: 84, 
        color: 25,
        position: new mp.Vector3(100.15, -1948.33, 22.35),
        name: "Families"
        
    },
    {
        type: 84, 
        color: 27,
        position: new mp.Vector3(892.59, -2173.04, 32.29),
        name: "Ballas"
        
    },
    {
        type: 84, 
        color: 46,
        position: new mp.Vector3(542.46, -1944.71, 24.99),
        name: "Vagos"
        
    },
    {
        type: 478,
        color: 5,
        name: 'Ремонт квартир',
        position: CONSTRUCTION_REGISTER_POS,
    },
    {
        type: 467,
        color: 4,
        name: 'Рынок',
        position: new mp.Vector3(-1627.47, -1088.61, 13.02),
    },
    ...HousesTeleportsList.map(item => {
        return {
            type: 476,
            color: 26,
            name: item.name,
            position: new mp.Vector3(item.pos.x, item.pos.y, item.pos.z)
        }
    }),
    ...WEDDING_POS.map(item => {
        return {
            type: 305,
            color: 0,
            name: WEDDING_NAME,
            position: item,
        }
    }),
    {
        type: 649,
        color: 1,
        name: 'Дрифт трасса',
        position: new mp.Vector3(DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z),
        options: {
            range: 150
        }
    },
    {
        type: 84, 
        color: 3,
        position: new mp.Vector3(496.25, -1336.79, 29.32),
        name: "Marabunta Grande"
        
    },
    {
        type: 594, 
        color: 0,
        position: COIN_SELL_POS,
        name: "Биржа криптовалюты"
        
    },
    {
        type: 304, 
        color: 4,
        position: new mp.Vector3(705.81, -966.68, 30.41),
        name: "Очистка розыска"
        
    },
    {
        type: 304, 
        color: 4,
        position: new mp.Vector3(-749.69, 5589.60, 38.03),
        name: "Очистка розыска"
        
    },
    {
        type: 304, 
        color: 4,
        position: new mp.Vector3(1702.38, 3290.27, 48.92),
        name: "Очистка розыска"
        
    },
    {
        type: 621, 
        color: 1,
        position: new mp.Vector3(1835.30, 3678.29, 34.27),
        name: "Больница"
        
    },

      // Ферма
    {
         type: 206, 
         color: 2,
         position: new mp.Vector3(2091.61,5150.82,50.28),
         name: "Ферма"
        
     },
     {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1884.17,5019.68,49.83),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1803.65,5041.41,60.04),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1875.42,4868.56,46.70),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2002.49,4802.68,44.85),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2066.05,4864.52,43.89),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2106.92,4907.48,41.88),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2167.01,5011.55,42.04),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2199.60,4983.26,45.08),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2254.46,4885.33,42.60),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2300.50,4770.67,38.91),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2387.49,4803.93,37.76),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2502.12,4892.72,45.03),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2544.27,4859.92,37.79),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2339.31,5083.47,45.83),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2855.15,4696.89,48.99),
        name: "Ферма"
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1867.55,4756.94,41.73),
        name: "Ферма"
       
    },
    {
        type: 523, 
        color: 3,
        position: new mp.Vector3(-1160.78, -1733.07, 3.11),
        name: "Каршеринг"
       
    }


]


