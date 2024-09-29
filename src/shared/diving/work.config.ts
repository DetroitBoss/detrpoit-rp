export const CHEST_PROP = 'xm_prop_x17_chest_closed';
export const SHIP_PROP = 'cs2_06b_boat03';

export interface ChestData {
    position: Vector3Mp,
    rotation: Vector3Mp
}

export interface ShipData {
    position: Vector3Mp,
    rotation: Vector3Mp
}

export const DIVING_COSTUME_ITEM_ID = 6500;

export const DRESS_CONFIG_MALE: [number, number, number][] = [
    [3, 31, 0],
    [8, 151, 0],
    [11, 243, 0],
    [4, 94, 0],
    [6, 67, 0],
    [102, 2, 0]
];

export const DRESS_CONFIG_FEMALE: [number, number, number][] = [
    [3, 40, 0],
    [8, 187, 0],
    [11, 42, 0],
    [4, 97, 0],
    [6, 70, 0]
];

export interface DivingMap {
    itemId: number,
    slices: number[]

}

export const DivingMaps: DivingMap[] = [
    {
        itemId: 6526,
        slices: [
            6501,
            6502,
            6503,
            6504,
            6505,
            6506,
            
        ]
    },
    {
        itemId: 6527,
        slices: [
           
            6507,
            6508,
            6509,
            6510,
            6511,
            6512,
            
        ]
    },
    {
        itemId: 6528,
        slices: [
           
            6513,
            6514,
            6515,
            6516,
            6517,
            6518
            
        ]
    }
]


export const REWARDS: number[] = [
    6519,
    6520,
    6521,
    6522,
    6523,
    6524,
    6525
]

