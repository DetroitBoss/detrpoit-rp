/** Базовый индекс производительности CPU */
export const DEFAULT_CPU_POWER_INDEX = 50;
/** Базовый индекс объёма RAM */
export const DEFAULT_RAM_POWER_INDEX = 200;
/** Базовый индекс производительности видеокарты */
export const DEFAULT_GPU_POWER_INDEX = 10;
export const DEFAULT_MINING_LEVEL_ID = 0;
export const DEFAULT_MINING_ALGORITHM_ID = 3200;

/** Параметр по умолчанию, который определяет сколько требуется производительности для добычи одной единицы крипты. Расчёт по формуле - средняя производительность всех майнинг ферм разделить на этот индекс. В результате ферма будет приносить крипты по формуле производительность разделить на результат  */
export const MINING_TF_INDEX_BASE_COIN = 300;

/** Коэффициент на который умножается крипта при продаже */
export const MINING_SELL_COEFFICIENT = 0.021;

/** Время в минутах между тиками фарма */
export const MINING_TICK_INTERVAL = 1;

export const COIN_SELL_POS = new mp.Vector3(5.78, -708.56, 45.07)




export const MINING_VIDEOCARDS_ATTACHLIST: {
    props: string[],
    attachPositions: [number, number, number][]
}[] = [
    {
        props: ["pp_videocard760", "pp_videocard7601"],
        attachPositions: [
            [-0.025, -0.536, -0.365],
            [-0.025, -0.429, -0.365],
            [-0.025, -0.323, -0.365],
            [-0.025, -0.217, -0.365],
            [-0.025, -0.11, -0.365],
            [-0.025, -0.004, -0.365],
            [-0.025, 0.102, -0.365],
            [-0.025, 0.209, -0.365],
            [-0.025, 0.315, -0.365],
            [-0.025, 0.421, -0.365],
            [-0.025, 0.528, -0.365],
            [-0.025, 0.634, -0.365],
            [-0.025, 0.74, -0.365],
            [-0.025, 0.847, -0.365],
            [-0.025, 0.953, -0.365],
            [-0.025, 1.059, -0.365],
            [-0.025, 1.165, -0.365],
            [-0.025, 1.272, -0.365],
            [-0.025, -0.536, -0.072 ],
            [-0.025, -0.429, -0.072 ],
            [-0.025, -0.323, -0.072 ],
            [-0.025, -0.217, -0.072 ],
            [-0.025, -0.11, -0.072 ],
            [-0.025, -0.004, -0.072 ],
            [-0.025, 0.102, -0.072 ],
            [-0.025, 0.209, -0.072 ],
            [-0.025, 0.315, -0.072 ],
            [-0.025, 0.421, -0.072 ],
            [-0.025, 0.528, -0.072 ],
            [-0.025, 0.634, -0.072 ],
            [-0.025, 0.74, -0.072 ],
            [-0.025, 0.847, -0.072 ],
            [-0.025, 0.953, -0.072 ],
            [-0.025, 1.059, -0.072 ],
            [-0.025, 1.165, -0.072 ],
            [-0.025, 1.272, -0.072 ],
            [-0.025, -0.536, 0.22 ],
            [-0.025, -0.429, 0.22 ],
            [-0.025, -0.323, 0.22 ],
            [-0.025, -0.217, 0.22 ],
            [-0.025, -0.11, 0.22  ],
            [-0.025, -0.004, 0.22 ],
            [-0.025, 0.102, 0.22  ],
            [-0.025, 0.209, 0.22  ],
            [-0.025, 0.315, 0.22  ],
            [-0.025, 0.421, 0.22  ],
            [-0.025, 0.528, 0.22  ],
            [-0.025, 0.634, 0.22  ],
            [-0.025, 0.74, 0.22 ],
            [-0.025, 0.847, 0.22  ],
            [-0.025, 0.953, 0.22  ],
            [-0.025, 1.059, 0.22  ],
            [-0.025, 1.165, 0.22  ],
            [-0.025, 1.272, 0.22  ],
            [-0.025, -0.536, 0.512 ],
            [-0.025, -0.429, 0.512 ],
            [-0.025, -0.323, 0.512 ],
            [-0.025, -0.217, 0.512 ],
            [-0.025, -0.11, 0.512  ],
            [-0.025, -0.004, 0.512 ],
            [-0.025, 0.102, 0.512  ],
            [-0.025, 0.209, 0.512  ],
            [-0.025, 0.315, 0.512  ],
            [-0.025, 0.421, 0.512  ],
            [-0.025, 0.528, 0.512  ],
            [-0.025, 0.634, 0.512  ],
            [-0.025, 0.74, 0.512 ],
            [-0.025, 0.847, 0.512  ],
            [-0.025, 0.953, 0.512  ],
            [-0.025, 1.059, 0.512  ],
            [-0.025, 1.165, 0.512  ],
            [-0.025, 1.272, 0.512  ],
        ]
    },
    {
        props: ["pp_videocardamd", "pp_videocardamd1"],
        attachPositions: [
            [-0.017, -0.549, -0.368],
            [-0.017, -0.443, -0.368],
            [-0.017, -0.336, -0.368],
            [-0.017, -0.230, -0.368],
            [-0.017, -0.124, -0.368],
            [-0.017, -0.017, -0.368],
            [-0.017, 0.089, -0.368],
            [-0.017, 0.195, -0.368],
            [-0.017, 0.302, -0.368],
            [-0.017, 0.408, -0.368],
            [-0.017, 0.514, -0.368],
            [-0.017, 0.621, -0.368],
            [-0.017, 0.727, -0.368],
            [-0.017, 0.833, -0.368],
            [-0.017, 0.940, -0.368],
            [-0.017, 1.046, -0.368],
            [-0.017, 1.152, -0.368],
            [-0.017, 1.258, -0.368],
            [-0.017, -0.549, -0.075],
            [-0.017, -0.443, -0.075],
            [-0.017, -0.336, -0.075],
            [-0.017, -0.230, -0.075],
            [-0.017, -0.124, -0.075],
            [-0.017, -0.017, -0.075],
            [-0.017, 0.089, -0.075],
            [-0.017, 0.195, -0.075],
            [-0.017, 0.302, -0.075],
            [-0.017, 0.408, -0.075],
            [-0.017, 0.514, -0.075],
            [-0.017, 0.621, -0.075],
            [-0.017, 0.727, -0.075],
            [-0.017, 0.833, -0.075],
            [-0.017, 0.940, -0.075],
            [-0.017, 1.046, -0.075],
            [-0.017, 1.152, -0.075],
            [-0.017, 1.258, -0.075],
            [-0.017, -0.549, 0.217],
            [-0.017, -0.443, 0.217],
            [-0.017, -0.336, 0.217],
            [-0.017, -0.230, 0.217],
            [-0.017, -0.124, 0.217],
            [-0.017, -0.017, 0.217],
            [-0.017, 0.089, 0.217],
            [-0.017, 0.195, 0.217],
            [-0.017, 0.302, 0.217],
            [-0.017, 0.408, 0.217],
            [-0.017, 0.514, 0.217],
            [-0.017, 0.621, 0.217],
            [-0.017, 0.727, 0.217],
            [-0.017, 0.833, 0.217],
            [-0.017, 0.940, 0.217],
            [-0.017, 1.046, 0.217],
            [-0.017, 1.152, 0.217],
            [-0.017, 1.258, 0.217],
            [-0.017, -0.549, 0.51],
            [-0.017, -0.443, 0.51],
            [-0.017, -0.336, 0.51],
            [-0.017, -0.230, 0.51],
            [-0.017, -0.124, 0.51],
            [-0.017, -0.017, 0.51],
            [-0.017, 0.089, 0.51],
            [-0.017, 0.195, 0.51],
            [-0.017, 0.302, 0.51],
            [-0.017, 0.408, 0.51],
            [-0.017, 0.514, 0.51],
            [-0.017, 0.621, 0.51],
            [-0.017, 0.727, 0.51],
            [-0.017, 0.833, 0.51],
            [-0.017, 0.940, 0.51],
            [-0.017, 1.046, 0.51],
            [-0.017, 1.152, 0.51],
            [-0.017, 1.258, 0.51],
        ]
    },
    {
        props: ["pp_videocard2080", "pp_videocard20801"],
        attachPositions: [
            [-0.009, -0.547, -0.374],
            [-0.009, -0.440, -0.374],
            [-0.009, -0.334, -0.374],
            [-0.009, -0.228, -0.374],
            [-0.009, -0.121, -0.374],
            [-0.009, -0.015, -0.374],
            [-0.009, 0.091, -0.374],
            [-0.009, 0.198, -0.374],
            [-0.009, 0.304, -0.374],
            [-0.009, 0.410, -0.374],
            [-0.009, 0.517, -0.374],
            [-0.009, 0.623, -0.374],
            [-0.009, 0.729, -0.374],
            [-0.009, 0.836, -0.374],
            [-0.009, 0.942, -0.374],
            [-0.009, 1.049, -0.374],
            [-0.009, 1.155, -0.374],
            [-0.009, 1.261, -0.374],
            [-0.009, -0.547, -0.078],
            [-0.009, -0.440, -0.078],
            [-0.009, -0.334, -0.078],
            [-0.009, -0.228, -0.078],
            [-0.009, -0.121, -0.078],
            [-0.009, -0.015, -0.078],
            [-0.009, 0.091, -0.078],
            [-0.009, 0.198, -0.078],
            [-0.009, 0.304, -0.078],
            [-0.009, 0.410, -0.078],
            [-0.009, 0.517, -0.078],
            [-0.009, 0.623, -0.078],
            [-0.009, 0.729, -0.078],
            [-0.009, 0.836, -0.078],
            [-0.009, 0.942, -0.078],
            [-0.009, 1.049, -0.078],
            [-0.009, 1.155, -0.078],
            [-0.009, 1.261, -0.078],
            [-0.009, -0.547, 0.212],
            [-0.009, -0.440, 0.212],
            [-0.009, -0.334, 0.212],
            [-0.009, -0.228, 0.212],
            [-0.009, -0.121, 0.212],
            [-0.009, -0.015, 0.212],
            [-0.009, 0.091, 0.212],
            [-0.009, 0.198, 0.212],
            [-0.009, 0.304, 0.212],
            [-0.009, 0.410, 0.212],
            [-0.009, 0.517, 0.212],
            [-0.009, 0.623, 0.212],
            [-0.009, 0.729, 0.212],
            [-0.009, 0.836, 0.212],
            [-0.009, 0.942, 0.212],
            [-0.009, 1.049, 0.212],
            [-0.009, 1.155, 0.212],
            [-0.009, 1.261, 0.212],
            [-0.009, -0.547, 0.505],
            [-0.009, -0.440, 0.505],
            [-0.009, -0.334, 0.505],
            [-0.009, -0.228, 0.505],
            [-0.009, -0.121, 0.505],
            [-0.009, -0.015, 0.505],
            [-0.009, 0.091, 0.505],
            [-0.009, 0.198, 0.505],
            [-0.009, 0.304, 0.505],
            [-0.009, 0.410, 0.505],
            [-0.009, 0.517, 0.505],
            [-0.009, 0.623, 0.505],
            [-0.009, 0.729, 0.505],
            [-0.009, 0.836, 0.505],
            [-0.009, 0.942, 0.505],
            [-0.009, 1.049, 0.505],
            [-0.009, 1.155, 0.505],
            [-0.009, 1.261, 0.505],
        ]
    },
    {
        props: ["pp_powersupply"],
        attachPositions: [
                [-0.1, -0.478, -0.596],
                [-0.1, -0.079, -0.596],
                [-0.1, 0.32, -0.596],
                [-0.1, 0.72, -0.596],
                [-0.1, 1.119, -0.596]
        ]
    }
]


export interface MiningLevelItem {
    /** Уникальный ИД уровня фермы. */
    id: number,
    /** Какой уровень можно купить следующий. Такой вариант конфига сделан для того, чтобы можно было свободно двигать параметры внутри масива ничего не сломав */
    next?: number,
    /** Какие предметы требуются */
    requireItems?: number[],
    /** Какая сумма наличных требуется */
    requireMoney?: number,
    /** Сколько максимум карт можно установить */
    max_cards: number,
    /** Сколько максимум блоков питания можно установить */
    max_additional_power_blocks: number,
    // /** Максимальная производительность CPU (от этого будет зависеть сколько доп утилит можно будет использовать на ферме, и какие алгоритмы добычи можно запускать) */
    // max_cpu_power: number,
    /** Максимальное количество плашек ОЗУ (стоимость ОЗУ будет реализована в геометрической прогрессии, то есть условно 2 по 2 будет дешевле чем 1 по 4) */
    max_ram_count: 1 | 2 | 3 | 4 | 6 | 8,
}

export interface MiningAlgorithmItem {
    /** Уникальный идентификатор уровня */
    item: number,
    /** Стоимость уровня (за крипту) */
    cost: number,
    /** Коефициэнт эффективности (от 1 до 100), чем выше - тем больше крипты будет добыватся */
    efficiency: number,
    /** Сколько алгоритм потребляет ОЗУ */
    ram: number,
    /** Сколько алгоритм потребляет CPU */
    cpu: number,
}

export const MiningHouseDefault = {
    level: DEFAULT_MINING_LEVEL_ID,
    ram: <number[]>[],
    cpu: 0,
    algorithm: DEFAULT_MINING_ALGORITHM_ID,
    cards: <number[]>[],
    powers: <number[]>[],
    viruses: 0,
    amount: 0,
}
type MiningHouseDefaultType = {} & typeof MiningHouseDefault
export interface MiningHouseItemData extends MiningHouseDefaultType {}

export interface MiningComponentItem {
    /** ID предмета из инвентаря */
    item: number,
    /** Значение (показатель данного вида компонента) */
    value: number,
    /** Сколько потребляет мощности (для блока питания устанавливать 0)*/
    powerUse: number,
}




/** Список уровней фермы */
export const MINING_LEVELS_LIST: MiningLevelItem[] = [
    {id: 0, next: 1, requireItems: [], requireMoney: 0, max_cards: 1, max_additional_power_blocks: 1, max_ram_count: 1},
    {id: 1, next: 2, requireItems: [], requireMoney: 20000, max_cards: 2, max_additional_power_blocks: 1, max_ram_count: 2},
    {id: 2, next: 3, requireItems: [], requireMoney: 40000, max_cards: 3, max_additional_power_blocks: 2, max_ram_count: 3},
    {id: 3, next: 4, requireItems: [], requireMoney: 60000, max_cards: 4, max_additional_power_blocks: 2, max_ram_count: 4},
    {id: 4, next: 5, requireItems: [], requireMoney: 80000, max_cards: 5, max_additional_power_blocks: 3, max_ram_count: 4},
    {id: 5, next: 6, requireItems: [], requireMoney: 100000, max_cards: 6, max_additional_power_blocks: 4, max_ram_count: 6},
]
/** Список всех доступных алгоритмов */
export const MINING_ALGORITHMS_LEVELS: MiningAlgorithmItem[] = [
    {item: DEFAULT_MINING_ALGORITHM_ID, cost: 0, efficiency: 20, ram: DEFAULT_RAM_POWER_INDEX, cpu: DEFAULT_CPU_POWER_INDEX},
    {item: 3201, cost: 0, efficiency: 50, ram: DEFAULT_RAM_POWER_INDEX, cpu: DEFAULT_CPU_POWER_INDEX},
    {item: 3202, cost: 0, efficiency: 70, ram: DEFAULT_RAM_POWER_INDEX * 1.5, cpu: DEFAULT_CPU_POWER_INDEX * 1.5},
    {item: 3203, cost: 0, efficiency: 80, ram: DEFAULT_RAM_POWER_INDEX * 1.8, cpu: DEFAULT_CPU_POWER_INDEX * 1.8},
    {item: 3204, cost: 0, efficiency: 99, ram: DEFAULT_RAM_POWER_INDEX * 2, cpu: DEFAULT_CPU_POWER_INDEX * 2},
]
/** Список всех видеокарт */
export const MINING_VIDEOCARDS: MiningComponentItem[] = [
    {item: 3100, value: DEFAULT_GPU_POWER_INDEX, powerUse: 100},
    {item: 3101, value: DEFAULT_GPU_POWER_INDEX * 1.1, powerUse: 200},
    {item: 3102, value: DEFAULT_GPU_POWER_INDEX * 1.2, powerUse: 400},
    {item: 3103, value: DEFAULT_GPU_POWER_INDEX * 1.3, powerUse: 500},
    {item: 3104, value: DEFAULT_GPU_POWER_INDEX * 1.4, powerUse: 700},
    {item: 3105, value: DEFAULT_GPU_POWER_INDEX * 1.5, powerUse: 800}
]
/** Список всех CPU */
export const MINING_CPUS: MiningComponentItem[] = [
    {item: 3300, value: DEFAULT_CPU_POWER_INDEX * 1.2, powerUse: 50},
    {item: 3301, value: DEFAULT_CPU_POWER_INDEX * 1.4, powerUse: 100},
    {item: 3302, value: DEFAULT_CPU_POWER_INDEX * 1.6, powerUse: 200},
    {item: 3303, value: DEFAULT_CPU_POWER_INDEX * 1.8, powerUse: 400}
]
/** Список всех RAM */
export const MINING_RAMS: MiningComponentItem[] = [
    {item: 3400, value: DEFAULT_RAM_POWER_INDEX * 1.2, powerUse: 100},
    {item: 3401, value: DEFAULT_RAM_POWER_INDEX * 1.4, powerUse: 150},
    {item: 3402, value: DEFAULT_RAM_POWER_INDEX * 1.6, powerUse: 200},
    {item: 3403, value: DEFAULT_RAM_POWER_INDEX * 1.8, powerUse: 300},
]
/** Список всех блоков питания */
export const MINING_POWERSS: MiningComponentItem[] = [
    {item: 3500, value: 600, powerUse: 0},
    {item: 3501, value: 900, powerUse: 0},
    {item: 3502, value: 1300, powerUse: 0}
]
/** Узнать процент производительности алгоритма */
export const getMiningLevel = (id: number) => {
    return MINING_LEVELS_LIST.find(q => q.id === id);
}
/** Узнать процент производительности алгоритма */
export const getMiningAlgoritmEfficiency = (id: number) => {
    const item = MINING_ALGORITHMS_LEVELS.find(q => q.item === id);
    return item ? item.efficiency : 0
}
/** Узнать процент производительности карты */
export const getMiningCardProfit = (id: number) => {
    const item = MINING_VIDEOCARDS.find(q => q.item === id);
    return item ? item.value : 0
}
/** Посчитать итоговую производительность фермы */
export const calculateMiningFarmPoints = (algorithm: number, cards: number[]) => {
    const profit = getMiningAlgoritmEfficiency(algorithm);
    if(!profit) return 0;
    let tf = 0;
    cards.filter(q => q).map(item =>
        tf += getMiningCardProfit(item))
    return (tf / 100) * profit;

}
/** Посчитать итоговую производительность фермы */
export const calculateMiningFarmData = (data: MiningHouseItemData) => {
    const algorithm = data.algorithm;
    const cpu = data.cpu;
    const rams = data.ram;
    const cards = data.cards;
    const powers = data.powers;
    let res = {
        /** Текущий заработок фермы */
        amount: data.amount,
        /** Процент профита  */
        profit: 0,
        /** Производительность */
        tf: 0,
        /** Можность (электричество) */
        power: {
            max: 0,
            current: 0,
        },
        /** Процессор */
        cpu: {
            max: 0,
            current: 0,
        },
        /** Оперативная память*/
        ram: {
            max: 0,
            current: 0,
        },
    }

    const a = MINING_ALGORITHMS_LEVELS.find(q => q.item === algorithm);
    if(a){
        res.profit = getMiningAlgoritmEfficiency(algorithm)
        res.cpu.current = a.cpu
        res.ram.current = a.ram
    }
    const c = MINING_CPUS.find(q => q.item === cpu);
    if(c){
        res.cpu.max = c.value
        res.power.current = res.power.current + c.powerUse
    }
    const r = MINING_RAMS.filter(q => rams.includes(q.item));
    if(r.length > 0){
        r.map(q => {
            res.ram.max = q.value
            res.power.current = res.power.current + q.powerUse
        })
    }
    const v = MINING_VIDEOCARDS.filter(q => cards.includes(q.item));
    if(v.length > 0){
        v.map(q => {
            res.power.current = res.power.current + q.powerUse
        })
    }

    const p = MINING_POWERSS.filter(q => powers.includes(q.item));
    if(p.length > 0){
        p.map(q => {
            res.power.max = res.power.max + q.value
        })
    }

    res.tf = calculateMiningFarmPoints(algorithm, cards);

    if(res.cpu.max < res.cpu.current) res.tf = 0;
    if(res.power.max < res.power.current) res.tf = 0;
    if(res.ram.max < res.ram.current) res.tf = 0;

    return res;

}
