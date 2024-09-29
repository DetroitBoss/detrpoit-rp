import {colshapeHandle} from "../../../client/modules/checkpoints";

interface EmployerNPC {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

interface EmployerBlip {
    Sprite: number,
    Color: number,
    Position: Vector3Mp,
    Name: string
}

interface VehicleSpawnParams {
    Position: Vector3Mp,
    Heading: number
}

export interface JobLevel {
    index: number,
    fromEXP: number,
    description: string,
    salary: number,
    payment: number
}

export interface Cable {
    percent: number,
    seconds: number,
    active: boolean,
    completed: boolean
}

export type GameComponent = "wires" | "insulator" | "diagram";

export const ELECTRICIAN_LEVELS: JobLevel[] = [
    {
        index: 0,
        fromEXP: 0,
        description: "Ходите по станции и чините",
        salary: 0,
        payment: 50,
    },
    {
        index: 1,
        fromEXP: 4000,
        description: "Катайте по домам и чините",
        salary: 1,
        payment: 1000,
    },
    {
        index: 2,
        fromEXP: 10000,
        description: "Чините большие щетки",
        salary: 2,
        payment: 2000,
    }
]

export interface WorkState {
    active: boolean,
    type?: WORK_TYPE,
    activePoint?: colshapeHandle,
    blip?: BlipMp,
    status?: number,
    forEXP?: number,
    sca?: string
}

/* Типы работ электрика */

export enum WORK_TYPE {
    // работа на станции
    station,
    // разъед по домам
    houses,
    // разъед по крупным щиткам
    large
}

/* Модель рабочего транспорта */

export const WORK_VEHICLE_MODEL = "burrito";


/* NPC у которого брать работу */

export const EMPLOYER_NPC: EmployerNPC = {
    Position: new mp.Vector3(726.09, 135.78, 80.75),
    Heading: 341,
    Model: "s_m_m_dockwork_01",
    Name: "Старший электрик",
    Range: 10,
    Dimension: 0
}

/* Блип самого NPC */

export const EMPLOYER_BLIP: EmployerBlip = {
    Sprite: 354,
    Color: 46,
    Position: EMPLOYER_NPC.Position,
    Name: "Электростанция"
}

/* Позиции спавна рабочего транспорта */

export const VEHICLE_SPAWN_POSITIONS: VehicleSpawnParams[] = [
    {
        Position: new mp.Vector3(660.44,196.38,94.99),
        Heading: 70
    },
    {
        Position: new mp.Vector3(658.95,192.86,95.01),
        Heading: 70
    },
    {
        Position: new mp.Vector3(657.62,188.70,94.99),
        Heading: 70
    },
    {
        Position: new mp.Vector3(656.63,184.84,94.97),
        Heading: 70
    },
    {
        Position: new mp.Vector3(655.53,180.86,94.95),
        Heading: 70
    },
    {
        Position: new mp.Vector3(654.05,176.90,94.95),
        Heading: 70
    },
    {
        Position: new mp.Vector3(652.74,172.88,94.94),
        Heading: 70
    },
    {
        Position: new mp.Vector3(651.26,169.17,94.95),
        Heading: 70
    },
    {
        Position: new mp.Vector3(649.22,165.56,94.99),
        Heading: 70
    },
    {
        Position: new mp.Vector3(648.39,161.77,94.98),
        Heading: 70
    },
    {
        Position: new mp.Vector3(634.13,156.93,95.64),
        Heading: 248
    },
    {
        Position: new mp.Vector3(635.91,161.24,95.66),
        Heading: 248
    },
    {
        Position: new mp.Vector3(637.41,164.96,95.75),
        Heading: 248
    },
    {
        Position: new mp.Vector3(638.52,168.98,95.87),
        Heading: 248
    },
    {
        Position: new mp.Vector3(639.72,172.97,95.90),
        Heading: 248
    },
    {
        Position: new mp.Vector3(641.22,176.77,95.92),
        Heading: 248
    },
    {
        Position: new mp.Vector3(643.07,180.83,95.82),
        Heading: 248
    },
    {
        Position: new mp.Vector3(625.83,159.97,96.26),
        Heading: 70
    },
    {
        Position: new mp.Vector3(627.03,163.95,96.21),
        Heading: 70
    },
    {
        Position: new mp.Vector3(628.32,168.60,96.29),
        Heading: 70
    },
    {
        Position: new mp.Vector3(630.58,172.44,96.29),
        Heading: 70
    },
    {
        Position: new mp.Vector3(631.91,176.05,96.33),
        Heading: 70
    },
    {
        Position: new mp.Vector3(633.08,180.18,96.39),
        Heading: 70
    },
    {
        Position: new mp.Vector3(634.31,183.91,96.39 ),
        Heading: 70
    },
    {
        Position: new mp.Vector3(627.70,196.48,97.28),
        Heading: 248
    },
    {
        Position: new mp.Vector3(626.13,192.64,97.31),
        Heading: 248
    },
    {
        Position: new mp.Vector3(624.92,188.75,97.37),
        Heading: 248
    },
    {
        Position: new mp.Vector3(623.49,184.94,97.45),
        Heading: 248
    },
    {
        Position: new mp.Vector3(622.31,180.98,97.41),
        Heading: 248
    },
    {
        Position: new mp.Vector3(620.73,177.25,97.43),
        Heading: 248
    },
    {
        Position: new mp.Vector3(619.23,172.86,97.42),
        Heading: 248
    },
    {
        Position: new mp.Vector3(617.45,169.29,97.47),
        Heading: 248
    },
    {
        Position: new mp.Vector3(616.42,165.38,97.42),
        Heading: 248
    },
    {
        Position: new mp.Vector3(615.00,161.56,97.42),
        Heading: 248
    }
]

/* Позиции мини игр на станции */

export const STATION_WORK_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(711.54,128.63,79.75),
    new mp.Vector3(712.34,121.71,79.90),
    new mp.Vector3(705.94,124.10,79.90),
    new mp.Vector3(707.82,128.91,79.90),
    new mp.Vector3(714.37,126.54,79.90),
    new mp.Vector3(707.68,108.75,79.94),
    new mp.Vector3(704.67,109.78,79.94),
    new mp.Vector3(701.69,110.83,79.94),
    new mp.Vector3(697.67,104.54,79.75),
    new mp.Vector3(703.37,102.44,79.75),
    new mp.Vector3(681.43,108.46,79.91),
    new mp.Vector3(678.37,109.56,79.91),
    new mp.Vector3(675.30,110.53,79.91),
    new mp.Vector3(664.52,112.35,79.92),
    new mp.Vector3(658.75,114.21,79.92),
    new mp.Vector3(660.13,123.72,79.92),
    new mp.Vector3(663.09,122.59,79.92),
    new mp.Vector3(666.05,121.47,79.92),
    new mp.Vector3(670.08,127.90,79.95),
    new mp.Vector3(664.28,129.93,79.95),
    new mp.Vector3(676.93,119.53,79.94),
    new mp.Vector3(682.75,117.72,79.94),
    new mp.Vector3(679.56,123.94,79.95),
    new mp.Vector3(686.10,121.67,79.95),
    new mp.Vector3(687.85,126.37,79.95),
    new mp.Vector3(684.84,128.13,79.95),
    new mp.Vector3(681.22,128.61,79.95),
    new mp.Vector3(703.29,119.92,79.96),
    new mp.Vector3(709.03,117.80,79.96),
    new mp.Vector3(692.63,142.97,79.94),
    new mp.Vector3(686.88,145.18,79.94),
    new mp.Vector3(677.55,148.95,79.93),
    new mp.Vector3(670.70,151.31,79.93),
    new mp.Vector3(669.16,146.83,79.93),
    new mp.Vector3(671.86,144.98,79.93),
    new mp.Vector3(675.62,144.58,79.93),
    new mp.Vector3(690.79,151.51,79.96),
    new mp.Vector3(693.80,150.37,79.96),
    new mp.Vector3(696.81,149.28,79.96),
    new mp.Vector3(697.99,158.61,79.94),
    new mp.Vector3(692.23,160.53,79.94),
    new mp.Vector3(679.95,153.49,79.94),
    new mp.Vector3(674.23,155.42,79.94),
    new mp.Vector3(675.42,164.48,79.93),
    new mp.Vector3(678.44,163.46,79.93),
    new mp.Vector3(681.38,162.20,79.93),
    new mp.Vector3(685.43,168.61,79.95),
    new mp.Vector3(679.68,170.85,79.95),
    new mp.Vector3(693.81,166.25,79.95),
    new mp.Vector3(695.02,168.80,79.95),
    new mp.Vector3(700.21,168.95,79.95),
    new mp.Vector3(703.03,163.06,79.95),
    new mp.Vector3(703.91,165.64,79.95)
]

/* Позиции мини игр на домах */

export const HOME_WORK_POSITIONS: Vector3Mp[] = [

    // Вайнвуд
    new mp.Vector3(-1262.38,524.49,95.78),
    new mp.Vector3(-1175.62,438.58,85.85),
    new mp.Vector3(-1116.94,484.86,81.16),
    new mp.Vector3(-967.70,423.36,78.97),
    new mp.Vector3(-906.64,588.04,99.99),
    new mp.Vector3(-811.24,421.09,90.56),
    new mp.Vector3(-687.22,431.74,105.84),
    new mp.Vector3(-633.51,396.96,100.23),
    new mp.Vector3(-354.84,468.91,111.49),
    new mp.Vector3(-197.36,407.31,110.11),
    new mp.Vector3(-525.05,576.96,120.22),
    new mp.Vector3(-298.58,633.60,174.69),
    new mp.Vector3(-127.51,507.74,142.28),
    new mp.Vector3(-282.65,384.05,109.83),
    new mp.Vector3(-441.01,364.52,104.15),
    new mp.Vector3(-753.44,622.46,141.66),
    new mp.Vector3(-772.10,667.65,144.50),
    new mp.Vector3(-861.43,695.79,147.99),
    new mp.Vector3(-947.64,683.39,152.58),
    new mp.Vector3(-1003.57,684.31,159.90),
    new mp.Vector3(-1242.39,629.60,139.80),
    new mp.Vector3(-1366.41,608.95,132.90),
    

    // Каналы веспуччи
    new mp.Vector3(-1046.82,-1006.36,1.15),
    new mp.Vector3(-1072.78,-1049.46,1.15),
    new mp.Vector3(-1132.89,-1056.64,1.15),
    new mp.Vector3(-1173.47,-1106.82,1.66),
    new mp.Vector3(-1124.97,-1164.55,1.36),
    new mp.Vector3(-1115.09,-1217.82,1.52),
    new mp.Vector3(-1035.55,-1124.74,1.16),
    new mp.Vector3(-1016.76,-1156.43,1.16),
    new mp.Vector3(-978.36,-1119.53,1.17),
    new mp.Vector3(-983.34,-1100.58,1.17),
    new mp.Vector3(-936.79,-1090.78,1.17),
    new mp.Vector3(-953.78,-1060.47,1.17),
    new mp.Vector3(-896.88,-1004.62,1.15),
    new mp.Vector3(-911.80,-977.30,1.15),
    new mp.Vector3(-943.16,-918.41,1.15),

    // Ghetto
    new mp.Vector3(-46.51,-1791.23,26.44),
    new mp.Vector3(-10.09,-1868.84,23.31),
    new mp.Vector3(46.87,-1854.34,21.83),
    new mp.Vector3(60.78,-1923.36,20.65),
    new mp.Vector3(127.69,-1849.39,23.90),
    new mp.Vector3(166.55,-1868.12,23.07),
    new mp.Vector3(211.25,-1898.24,23.42),
    new mp.Vector3(248.36,-1943.01,23.29),
    new mp.Vector3(319.75,-1941.31,23.65),
    new mp.Vector3(363.42,-1899.62,23.80),
    new mp.Vector3(396.65,-1868.38,25.32),
    new mp.Vector3(495.97,-1831.28,27.51),
    new mp.Vector3(461.58,-1765.76,27.69),
    new mp.Vector3(482.70,-1701.75,28.36),
    new mp.Vector3(334.49,-1736.40,28.38),
    new mp.Vector3(1320.92,-1513.89,50.41),
    new mp.Vector3(1393.74,-1511.59,57.04),
    new mp.Vector3(1293.24,-1746.19,52.88),

    // Sandy
    new mp.Vector3(1901.09,3879.97,31.64),
    new mp.Vector3(1851.94,3856.83,32.23),
    new mp.Vector3(1741.26,3883.38,33.73),
    new mp.Vector3(1390.38,3646.11,33.29),
    new mp.Vector3(1410.43,3612.51,34.03),
    new mp.Vector3(1646.13,3814.67,33.95),
    new mp.Vector3(1708.62,3789.70,33.76),
    new mp.Vector3(1737.05,3695.98,33.46),

    // Paleto
    new mp.Vector3(24.68,6602.69,31.47),
    new mp.Vector3(-23.27,6554.95,30.93),
    new mp.Vector3(-152.43,6400.87,30.55),
    new mp.Vector3(-237.56,6424.07,30.46),
    new mp.Vector3(-285.92,6336.82,31.49),
    new mp.Vector3(-435.63,6272.03,29.07),
    new mp.Vector3(-384.44,6239.52,30.53),
    new mp.Vector3(-348.09,6223.61,30.52),
    new mp.Vector3(-367.37,6215.88,30.58),
    new mp.Vector3(-51.98,6650.16,29.04),
    new mp.Vector3(-35.72,6577.86,30.45),
    new mp.Vector3(-27.65,6596.81,30.86),
    new mp.Vector3(0.65,6612.29,30.88)
]

/* Позиции мини игр на больших счетках */

export const LARGE_WORK_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(2046.59,3676.11,33.59),
    new mp.Vector3(2056.64,3689.12,33.59),
    new mp.Vector3(2053.25,3687.49,33.59),
    new mp.Vector3(2055.18,3684.04,33.59),
    new mp.Vector3(2043.76,3681.53,33.59),
    new mp.Vector3(2850.43,3440.92,49.92),
    new mp.Vector3(2287.05,2948.07,45.75),
    new mp.Vector3(2279.93,2971.02,45.75),
    new mp.Vector3(2266.57,2967.38,45.75),
    new mp.Vector3(2280.13,2965.05,45.75),
    new mp.Vector3(2266.58,2973.29,45.75),
    new mp.Vector3(2107.32,2338.55,93.29),
    new mp.Vector3(2091.25,2330.26,93.29),
    new mp.Vector3(2094.03,2320.52,93.29),
    new mp.Vector3(2137.67,1949.88,92.93),
    new mp.Vector3(2136.67,1934.65,92.93),
    new mp.Vector3(2278.94,1718.19,67.04),
    new mp.Vector3(2302.11,1719.94,67.04),
    new mp.Vector3(2463.14,1481.45,35.20),
    new mp.Vector3(2459.24,1460.62,35.20),
    new mp.Vector3(2475.32,1460.55,35.20),
    new mp.Vector3(535.62,-1602.11,27.92),
    new mp.Vector3(540.16,-1592.60,28.11),
    new mp.Vector3(550.46,-1600.90,27.77),
    new mp.Vector3(545.94,-1610.39,27.77),
    new mp.Vector3(560.02,-1594.73,27.37),
    new mp.Vector3(1403.98,2122.55,104.06),
    new mp.Vector3(556.16,-1591.67,27.37),
    new mp.Vector3(734.53,2576.50,74.34),
    new mp.Vector3(1344.02,6388.19,32.41),
    new mp.Vector3(1344.12,6382.20,32.41),
    new mp.Vector3(1351.75,6382.03,32.21),
    new mp.Vector3(1351.44,6388.13,32.21),
]

/* Через какое количество счетков будет добавлять +1 EXP */

export const ADD_EXP: number = 4;

// Униформа

export const DRESS_CONFIG_MALE: [number, number, number][] = [
    [3, 66, 0],
    [8, 15, 0],
    [11, 89, 2],
    [4, 89, 19],
    [6, 12, 0],
    [100, 145, 1]
];

export const DRESS_CONFIG_FEMALE: [number, number, number][] = [
    [3, 72, 0],
    [8, 2, 0],
    [11, 88, 0],
    [4, 93, 7],
    [6, 59, 0],
    [100, 144, 1]
];


/* Конфиг для мини игры Diagram */

export interface DiagramItem {
    plus: boolean,
    active: boolean,
    next?: number | number[],
    direction?: string | string[],
    currentDirection?: string
}

export const DiagramMaps: DiagramItem[][] = [
    [
        // 0
        {
            plus: true,
            active: true,
            next: 1,
            direction: "r"
        },
        // 1
        {
            plus: false,
            active: false,
            next: 5,
            direction: "b"
        },
        // 2
        {
            plus: false,
            active: false
        },
        // 3
        {
            plus: true,
            active: false
        },
        // 4
        {
            plus: true,
            active: false,
        },
        // 5
        {
            plus: true,
            active: false,
            next: 6,
            direction: "r"
        },
        // 6
        {
            plus: false,
            active: false,
            next: [7,10],
            direction: ["r", "b"]
        },
        // 7
        {
            plus: true,
            active: false,
            next: 11,
            direction: "b"
        },
        // 8
        {
            plus: false,
            active: false,
        },
        // 9
        {
            plus: true,
            active: false,
        },
        // 10
        {
            plus: true,
            active: false,
            next: [14,11],
            direction: ["b", "r"]
        },
        // 11
        {
            plus: false,
            active: false,
            next: 15,
            direction: "b"
        },
        // 12
        {
            plus: true,
            active: false,
        },
        // 13
        {
            plus: false,
            active: false,
        },
        // 14
        {
            plus: false,
            active: false,
            next: 15,
            direction: "r"
        },
        // 15
        {
            plus: true,
            active: false,
        }
    ],
    [
        // 0
        {
            plus: true,
            active: true,
            next: 4, 
            direction: 'b'
        },
        // 1
        {
            plus: true,
            active: false,
        },
        // 2
        {
            plus: true,
            active: false
        },
        // 3
        {
            plus: true,
            active: false
        },
        // 4
        {
            plus: false,
            active: false,
            next: 8, 
            direction: 'b'
        },
        // 5
        {
            plus: true,
            active: false,
        },
        // 6
        {
            plus: true,
            active: false,
        },
        // 7
        {
            plus: true,
            active: false,
        },
        // 8
        {
            plus: true,
            active: false,
            next: 12, 
            direction: 'b'
        },
        // 9
        {
            plus: true,
            active: false,
        },
        // 10
        {
            plus: true,
            active: false,
        },
        // 11
        {
            plus: true,
            active: false,
        },
        // 12
        {
            plus: false,
            active: false,
            next: 13, 
            direction: 'r'
        },
        // 13
        {
            plus: true,
            active: false,
            next: 14, 
            direction: 'r'
        },
        // 14
        {
            plus: false,
            active: false,
            next: 15, 
            direction: 'r'
        },
        // 15
        {
            plus: true,
            active: false,
        }
    ],
    ,
    [
        // 0
        {
            plus: true,
            active: true,
            next: [1, 4],
            direction: ['r', 'b']
        },
        // 1
        {
            plus: false,
            active: false,
            next: [2,5],
            direction: ['r', 'b']
        },
        // 2
        {
            plus: true,
            active: false,
            next: [6],
            direction: 'b'
        },
        // 3
        {
            plus: true,
            active: false,
        },
        // 4
        {
            plus: false,
            active: false,
            next: [5, 8],
            direction: ['r', 'b']
        },
        // 5
        {
            plus: true,
            active: false,
            next: [6, 9],
            direction: ["r", "b"]
        },
        // 6
        {
            plus: false,
            active: false,
            next: 10, 
            direction: 'b'
        },
        // 7
        {
            plus: false,
            active: false,
        },
        // 8
        {
            plus: true,
            active: false,
            next: [9,12],
            direction: ["r", "b"]
        },
        // 9
        {
            plus: false,
            active: false,
            next: [10,13],
            direction: ["r", "b"]
        },
        // 10
        {
            plus: true,
            active: false,
            next: 14, 
            direction: 'b'
        },
        // 11
        {
            plus: true,
            active: false,
        },
        // 12
        {
            plus: false,
            active: false,
            next: 13, 
            direction: 'r'
        },
        // 13
        {
            plus: true,
            active: false,
            next: 14, 
            direction: 'r'
        },
        // 14
        {
            plus: false,
            active: false,
            next: 15, 
            direction: 'r'
        },
        // 15
        {
            plus: true,
            active: false,
        }
    ],
    [
        // 0
        {
            plus: true,
            active: true,
            next: 1, 
            direction: 'r'
        },
        // 1
        {
            plus: false,
            active: false,
            next: [2,5], 
            direction: ['r', 'b']
        },
        // 2
        {
            plus: true,
            active: false,
            next: [3, 6],
            direction: ['r', 'b']
        },
        // 3
        {
            plus: false,
            active: false,
            next: 7,
            direction: 'b'
        },
        // 4
        {
            plus: true,
            active: false,
        },
        // 5
        {
            plus: true,
            active: false,
            next: 6,
            direction: 'r'
        },
        // 6
        {
            plus: false,
            active: false,
            next: 7,
            direction: 'r',

        },
        // 7
        {
            plus: true,
            active: false,
            next: 11,
            direction: 'b'
        },
        // 8
        {
            plus: true,
            active: false,
        },
        // 9
        {
            plus: true,
            active: false,
        },
        // 10
        {
            plus: false,
            active: false,
        },
        // 11
        {
            plus: false,
            active: false,
            next: 15,
            direction: 'b'
        },
        // 12
        {
            plus: true,
            active: false,
        },
        // 13
        {
            plus: true,
            active: false,
        },
        // 14
        {
            plus: true,
            active: false,
        },
        // 15
        {
            plus: true,
            active: false,
        }
    ],
    [
        // 0
        {
            plus: true,
            active: true,
            next: [1,4],
            direction: ['r', 'b']
        },
        // 1
        {
            plus: false,
            active: false,
            next: [2,5],
            direction: ['r', 'b']
        },
        // 2
        {
            plus: true,
            active: false,
            next:  [3,6],
            direction: ['r', 'b']
        },
        // 3
        {
            plus: false,
            active: false,
            next: 7,
            direction: 'b'
        },
        // 4
        {
            plus: false,
            active: false,
            next: [5,8],
            direction: ['r', 'b'],

        },
        // 5
        {
            plus: true,
            active: false,
            next: [6, 9],
            direction: ['r', 'b']
        },
        // 6
        {
            plus: false,
            active: false,
            next: 7,
            direction: 'r'

        },
        // 7
        {
            plus: true,
            active: false,
            next: 11,
            direction: 'b'
        },
        // 8
        {
            plus: true,
            active: false,
            next: [9, 12],
            direction: ['r', 'b']
        },
        // 9
        {
            plus: false,
            active: false,
            next: 13,
            direction: 'b'
        },
        // 10
        {
            plus: false,
            active: false,
        },
        // 11
        {
            plus: false,
            active: false,
            next: 15,
            direction: 'b'
        },
        // 12
        {
            plus: false,
            active: false,
            next: 13,
            direction: 'r'
        },
        // 13
        {
            plus: true,
            active: false,
            next: 14,
            direction: 'r'
        },
        // 14
        {
            plus: false,
            active: false,
            next: 15,
            direction: 'r'
        },
        // 15
        {
            plus: true,
            active: false,
        }
    ]
]

export interface lineInsulator {
    watt: number,
    isDrag: boolean,
    onPosition: "right" | "left" | null
}

export interface InsulatorGame {
    totalWatt: number,
    insulators: lineInsulator[]
}

export const INSULATOR_GAME: InsulatorGame[] = [
    {
        totalWatt: 220,
        insulators: [
            {
                watt: 200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 20,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 20,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 40,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 20,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 180,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 380,
        insulators: [
            {
                watt: 360,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 20,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 340,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 40,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 320,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 60,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 800,
        insulators: [
            {
                watt: 400,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 430,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 350,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 450,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 399,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 401,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 1000,
        insulators: [
            {
                watt: 653,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 347,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 499,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 501,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 505,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 495,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 1200,
        insulators: [
            {
                watt: 500,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 700,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 650,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 550,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 700,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 499,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 1500,
        insulators: [
            {
                watt: 750,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 750,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 600,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 900,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 145,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 1700,
        insulators: [
            {
                watt: 850,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 750,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 600,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 800,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 800,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 850,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 2000,
        insulators: [
            {
                watt: 850,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 11,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 600,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 800,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 800,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1150,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 2500,
        insulators: [
            {
                watt: 850,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 600,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 800,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1150,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 3000,
        insulators: [
            {
                watt: 1100,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 600,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1900,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1899,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1901,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 3500,
        insulators: [
            {
                watt: 1100,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2905,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 250,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 349,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2400,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2499,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 3750,
        insulators: [
            {
                watt: 1700,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2905,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2050,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1999,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2001,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 3900,
        insulators: [
            {
                watt: 1700,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2905,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2050,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2001,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4000,
        insulators: [
            {
                watt: 31,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2905,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2050,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 3969,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2001,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4500,
        insulators: [
            {
                watt: 4444,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2905,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2050,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1200,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 56,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2250,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4610,
        insulators: [
            {
                watt: 4444,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 163,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 3333,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 4447,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 2250,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4860,
        insulators: [
            {
                watt: 4444,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 260,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 4666,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 4660,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 4600,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4900,
        insulators: [
            {
                watt: 3300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 260,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1601,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1603,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1600,
                isDrag: false,
                onPosition: null
            }
        ]
    },
    {
        totalWatt: 4950,
        insulators: [
            {
                watt: 3300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1650,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1300,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1601,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1603,
                isDrag: false,
                onPosition: null
            },
            {
                watt: 1600,
                isDrag: false,
                onPosition: null
            }
        ]
    }
]

export const VEHICLE_SPAWN_BLIP = {
    sprite: 756,
    color: 83,
    name: "Ваш рабочий транспорт"
}






