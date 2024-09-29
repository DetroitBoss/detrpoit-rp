import {Vector3Shared} from "../../system";

/** Конфиг места пожара */
export interface FireSpotConfig {
    /** Позиция места пожара */
    position: Vector3Shared,
    /** Тип пожара */
    type: FireSpotType,
    /** Угол */
    heading: number
}
export type FireSpotType = 'carCrash' | 'burningtree';
export const FireSpots: FireSpotConfig[] = [
    { position: { x: -971.83, y: 5415.90, z: 39.57 }, type: 'carCrash', heading: 0 },
    { position: { x: -2266.92, y: 4274.19, z: 45.43 }, type: 'carCrash', heading: 0 },
    { position: { x: 2566.87, y: 5124.43, z: 46.17 }, type: 'carCrash', heading: 0 },
    { position: { x:-3163.65,y:1261.30,z:11.9 }, type: 'carCrash', heading: 0 },
    { position: { x:-3163.65,y:1261.30,z:11.92 }, type: 'carCrash', heading: 0 },
    { position: { x:-3033.03,y:284.32,z:15.45 }, type: 'carCrash', heading: 0 },
    { position: { x:-1326.85,y:-71.92,z:48.98 }, type: 'carCrash', heading: 0 },
    { position: { x:-745.02,y:-257.83,z:36.96 }, type: 'carCrash', heading: 0 },
    { position: { x:-62.12,y:-537.47,z:31.91 }, type: 'carCrash', heading: 0 },
    { position: { x:145.79,y:-850.00,z:30.86 }, type: 'carCrash', heading: 0 },
    { position: { x:-86.72,y:-1336.30,z:29.24 }, type: 'carCrash', heading: 0 },
    { position: { x:177.17,y:-1798.90,z:29.04 }, type: 'carCrash', heading: 0 },
    { position: { x:500.39,y:-1760.28,z:28.48 }, type: 'carCrash', heading: 0 },
    { position: { x:1248.88,y:-1375.06,z:34.99 }, type: 'carCrash', heading: 0 },
    { position: { x:955.54,y:-562.52,z:58.69 }, type: 'carCrash', heading: 0 },
    { position: { x:391.98,y:283.21,z:102.99 }, type: 'carCrash', heading: 0 },
    { position: { x:-540.81,y:329.59,z:83.03 }, type: 'carCrash', heading: 0 },
    { position: { x:-220.66,y:913.57,z:213.20 }, type: 'carCrash', heading: 0 },
    { position: { x:1091.54,y:1962.89,z:57.75 }, type: 'carCrash', heading: 0 },
    { position: { x:1891.37,y:2074.68,z:54.95 }, type: 'carCrash', heading: 0 },
    { position: { x:2952.68,y:3920.26,z:52.00 }, type: 'carCrash', heading: 0 },
    { position: { x:2605.46,y:5282.50,z:44.60 }, type: 'carCrash', heading: 0 },
    { position: { x:2303.79,y:4742.46,z:36.29 }, type: 'carCrash', heading: 0 },
    { position: { x:1377.32,y:4513.54,z:54.71 }, type: 'carCrash', heading: 0 },



];

export interface FireSpotTypeConfig {
    /** Пропы места пожара */
    props: FireSpotPropConfig[],

    /** Непосредственно точки с огнем, которые и нужно будет потушить */
    firePlaces: FireSpotFirePlaceConfig[]
}
interface FireSpotPropConfig {
    /** Относительная позиция пропа (относительно точки позиции из {@link FireSpotConfig}) */
    position: Vector3Shared,
    /** Абсолютное вращение пропа */
    rotation: Vector3Shared,
    /** Модель объекта пропа */
    model: string
}
interface FireSpotFirePlaceConfig {
    /** Относительная позиция точки огня центру очага пожара */
    position: Vector3Shared,
    /** Тип пожара */
    type: FirePlaceType
}

export type FirePlaceType = 'small' | 'big';
export const FireSpotTypes = new Map<FireSpotType, FireSpotTypeConfig>([
    [
        'carCrash',
        {
            props: [
                {
                    position: new mp.Vector3(0, 0, -1),
                    rotation: new mp.Vector3(0, 0, 0,),
                    model: 'prop_rub_carwreck_12'
                }
            ],
            firePlaces: [
                { position: new mp.Vector3(2, 5, 0), type: 'small' },
                { position: new mp.Vector3(-2, -5, 0), type: 'small' },
                { position: new mp.Vector3(5, 3, 0), type: 'small' },
                { position: new mp.Vector3(0, 0, -2), type: 'big' },
            ]
        },
        
    ],
    [
        'burningtree',
        {
            props: [
                
            ],
            firePlaces: [
                { position: new mp.Vector3(-0.09, 0, 0), type: 'big' },
                { position: new mp.Vector3(3.07, 0.24, 0.33), type: 'small' },
                { position: new mp.Vector3(-0.72, 3.29, -0.19), type: 'small' },
                { position: new mp.Vector3(-2.79, 0.02, -0.36), type: 'big' },
                { position: new mp.Vector3(-2.23, -1.6, -0.28), type: 'small' },
                { position: new mp.Vector3(-0.01, -3.29, 0.06), type: 'small' },
            ]
        },
        
    ]
]);

export interface IFirePlace extends FireSpotFirePlaceConfig {
    /** Горит огонь или уже потушен */
    isBurning: boolean
}

export interface FireSpotDto {
    position: Vector3Shared,
    heading: number,
    firePlaces: IFirePlace[]
}