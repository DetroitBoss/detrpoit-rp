// TODO: Удалить этот интерфейс, импортить интерфейс из '../../npc'
interface NpcParameters {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

export interface VehicleSpawnParameters {
    Position: Vector3Mp,
    Heading: number
}

export interface FireStationParameters {
    EmployerNpc: NpcParameters,
    VehiclesSpawns: VehicleSpawnParameters[],
    WaterSpotPositions: Vector3Mp[]
}

export const FIRETRUCK_MODEL = 'firetruk';
export const FIRETRUCK_COLOR: { r: number, g: number, b: number } = { r: 220, g: 0, b: 0 };

export const MAX_PLAYERS_IN_SQUAD = 4;
export const MIN_PLAYERS_IN_SQUAD = 2;

export const MINIMAL_LEVEL = 6;

export const STATION_BLIP = 436;
export const STATION_BLIP_COLOR = 1;

export const CREATING_FIRESPOTS_TIME_S = 3 * 60;

export const FIRE_STATIONS: FireStationParameters[] = [
    {
        EmployerNpc: {
            Position: new mp.Vector3(-373.68, 6117.71, 31.67),
            Heading: 97,
            Model: 's_m_y_fireman_01',
            Name: 'Начальник станции'
        },
        VehiclesSpawns: [
            { Position: new mp.Vector3(-372.41, 6129.86, 31.48), Heading: 40 },
            { Position: new mp.Vector3(-377.41, 6127.68, 31.44), Heading: 40 },
            { Position: new mp.Vector3(-392.22, 6119.36, 31.29), Heading: 40 },
            { Position: new mp.Vector3(-396.70, 6115.35, 31.29), Heading: 40 }
        ],
        WaterSpotPositions: [
            new mp.Vector3(-365.33, 6116.24, 32.44),
            new mp.Vector3(209.78, -1646.6, 30.8)
        ]
    }
];

export const PAYMENT_PER_FIRESPOT = 3500;

export const FIRE_EXTINGUISHER_ITEM_ID = 560;
export const FIRE_EXTINGUISHER_MIXTURE_ITEM_ID = 156;
export const FIRE_EXTINGUISHER_MIXTURE_PER_BALLOON = 999;

export const FIRETRUCK_MAX_BALLOON_COUNT = 12;
export const FIRETRUCK_FILL_MIXTURE_RANGE = 5;

export const DRESS_CONFIG_MALE: [number, number, number][] = [
    [3, 17, 0],
    [8, 151, 0],
    [11, 314, 0],
    [4, 120, 0],
    [6, 82, 0],
    [100, 137, 0]
];

export const DRESS_CONFIG_FEMALE: [number, number, number][] = [
    [3, 220, 0],
    [8, 187, 0],
    [11, 325, 0],
    [4, 126, 0],
    [6, 52, 0],
    [100, 136, 0]
];