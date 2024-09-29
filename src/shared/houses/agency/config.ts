export const cost: number = 5000;
export const agencies: IAgencyData[] = [
    {
        id: 1,
        name: 'Sandy',
        position: new mp.Vector3(1924.51, 3721.34, 31.81),
        npcPosition: new mp.Vector3(1922.80, 3721.79, 32.81),
        npcHeading: 262
    },
    {
        id: 2,
        name: 'Paleto',
        position: new mp.Vector3(-35.71, 6471.61, 30.45),
        npcPosition: new mp.Vector3(-33.96, 6471.67, 31.45),
        npcHeading: 95
    },
    {
        id: 3,
        name: 'Los Santos',
        position: new mp.Vector3(-1007.67, -734.36, 20.53),
        npcPosition: new mp.Vector3(-1005.76, -734.80, 21.53),
        npcHeading: 64
    }
]

export interface IAgencyData {
    id: number
    name: string
    position: Vector3Mp
    npcPosition: Vector3Mp
    npcHeading: number
}

export interface IAgencyDTO {
    name: string
    id: number
}

export interface IAgencyHouseDTO {
    id: number
    name: string
    repository: boolean
    garageSpaces: number
    stock: boolean
    interior: string
    helicopter: boolean
}

export const AGENCY_BLIP_SPRITE: number = 255;
export const AGENCY_BLIP_COLOR: number = 5;
export const AGENCY_BLIP_NAME: string = 'Риелторское агентсво';

export const AGENCY_NPC_MODELS: string[] = [
    'csb_reporter',
    'ig_andreas',
    'cs_bankman'
]
