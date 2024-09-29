export const ISLAND_BATTLE_DAY = 6;
export const ISLAND_BATTLE_PREPARE_HOUR = 20;

export const ISLAND_BATTLE_NOTIFY_IMAGE = 'CHAR_MP_ROBERTO';
export const ISLAND_BATTLE_DIMENSION = 44888;
export const ISLAND_BATTLE_MAX_COMMAND_PLAYERS = 30;
export const ISLAND_POINT_PROP = 'prop_golfflag';

export const ISLAND_BATTLE_START_HOUR = 21;
export const ISLAND_BATTLE_START_MINUTE = 0;

export const TICKS_FOR_BATTLE_START = 15;
export const TICKS_FOR_BATTLE_FINISH = 30;
export const TICKS_FOR_BATTLE_EXTRA = 15;

export const WINNER_PAYMENT = 50000;



export const ISLAND_BATTLE_FRACTIONS: IIslandBattleCommand[] = [
    {   id: 24,
        name: 'RM',
        fullName: 'Russian Mafia',
        color: [255,255,255,255],
        preparePosition: new mp.Vector3(2744.07, 1346.50, 23.52)
    },
    {   id: 25,
        name: 'LCN',
        fullName: 'La Cosa Nostra',
        color: [255,255,255,255],
        preparePosition: new mp.Vector3(3831.34, 4463.74, 1.72)
    },
    {   id: 23,
        name: 'YAK',
        fullName: 'Yakuza',
        color: [255,255,255,255],
        preparePosition: new mp.Vector3(333.96, 6920.13, 3.59)
    }
]

export const ISLAND_SPAWN_POSITIONS: Vector3Mp[][] = [
    [
        new mp.Vector3(5586.78,-5223.61,14.35),
        new mp.Vector3(5587.92,-5223.64,14.35),
        new mp.Vector3(5589.55,-5221.86,14.35),
        new mp.Vector3(5587.62,-5220.50,14.35),
        new mp.Vector3(5587.08,-5222.38,14.35),
        new mp.Vector3(5586.19,-5222.43,14.35),
        new mp.Vector3(5583.95,-5222.28,14.35),
        new mp.Vector3(5585.05,-5221.41,14.35),
        new mp.Vector3(5585.79,-5220.05,14.35),
        new mp.Vector3(5589.80,-5223.77,14.35),
        new mp.Vector3(5591.88,-5224.29,14.35),
        new mp.Vector3(5591.62,-5225.91,14.36),
    ],
    [
        
        new mp.Vector3(5150.31,-5143.17,2.26),
        new mp.Vector3(5150.69,-5145.80,2.27),
        new mp.Vector3(5149.01,-5145.53,2.25),
        new mp.Vector3(5147.12,-5144.52,2.19),
        new mp.Vector3(5145.16,-5144.54,2.19),
        new mp.Vector3(5143.63,-5145.47,2.21),
        new mp.Vector3(5142.58,-5146.72,2.17),
        new mp.Vector3(5141.69,-5145.06,2.17),
        new mp.Vector3(5140.02,-5146.46,2.12),
        new mp.Vector3(5138.33,-5144.86,2.11),
        new mp.Vector3(5136.74,-5145.16,2.12),
        new mp.Vector3(5134.81,-5144.34,2.12),
        new mp.Vector3(5133.89,-5145.85,2.17),
        new mp.Vector3(5132.33,-5144.87,2.14),
        new mp.Vector3(5131.16,-5146.23,2.19),
        new mp.Vector3(5129.64,-5144.87,2.18),
        new mp.Vector3(5128.37,-5146.53,2.24)

    ],
    [
        new mp.Vector3(5136.94, -4607.18, 2.66),
        new mp.Vector3(5134.94, -4607.50, 2.59),
        new mp.Vector3(5132.65, -4607.00, 2.60),
        new mp.Vector3(5075.07,-4613.64,2.67),
        new mp.Vector3(5074.11,-4613.42,2.67),
        new mp.Vector3(5073.73,-4611.44,2.64),
        new mp.Vector3(5072.62,-4610.19,2.71),
        new mp.Vector3(5071.19,-4609.95,2.72),
        new mp.Vector3(5069.08,-4609.89,2.71),
        new mp.Vector3(5067.43,-4610.18,2.71),
        new mp.Vector3(5066.10,-4607.64,2.77),
        new mp.Vector3(5065.22,-4609.62,2.75),
        new mp.Vector3(5065.64,-4611.60,2.74),
        new mp.Vector3(5063.98,-4611.00,2.76),
        new mp.Vector3(5062.74,-4609.24,2.77),
        new mp.Vector3(5062.20,-4607.44,2.78),
        new mp.Vector3(5063.18,-4605.57,2.80),
        new mp.Vector3(5064.93,-4604.91,2.80),
        new mp.Vector3(5066.92,-4605.50,2.78),
        new mp.Vector3(5068.37,-4606.55,2.77),
        new mp.Vector3(5070.77,-4607.17,2.76),
        new mp.Vector3(5073.09,-4607.87,2.75),
        new mp.Vector3(5074.26,-4609.18,2.72),
        new mp.Vector3(5075.49,-4610.20,2.70)


    ]
]

export const ISLAND_POINTS: IIslandPoint[] = [
    {pos: new mp.Vector3(5258.23, -5414.39, 64.62)},
    {pos: new mp.Vector3(4978.41, -5707.24, 18.89)},
    {pos: new mp.Vector3(4909.06, -5344.58, 9.14)},
    {pos: new mp.Vector3(4896.66, -4914.97, 2.36)},
    {pos: new mp.Vector3(4873.73, -4628.10, 13.51)},
    {pos: new mp.Vector3(4510.44, -4514.93, 3.12)},
    {pos: new mp.Vector3(4770.89, -4769.40, 3.86)},
]


export enum ISLAND_BATTLE_STATE {
    PREPARE,
    RUNNING,
    EXTRA
}

export interface IIslandBattleCommand {
    id: number
    name: string
    fullName: string
    color: RGBA
    preparePosition: Vector3Mp
}

export interface IIslandPoint {
    pos: Vector3Mp
}

export interface IBattleStatusDTO {
    name: string
    points: number
}

export interface IBattleResult {
    id: number
    points: number
}