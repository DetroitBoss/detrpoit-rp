
export interface CarrySharedData {
    targetId: number,
    carryCfgIdx: number
}

export interface CarryConfig {
    name: string,
    carriedAnimation: CarryAnimation,
    carriedAttach: CarryAttach,
    carryAnimation: CarryAnimation
}

export interface CarryAnimation {
    dictionary: string,
    name: string,
    flag: number,
    isUpper: boolean
}

export interface CarryAttach {
    boneIndex: number,
    posOffset: Vector3Mp,
    rotation: Vector3Mp
}

export const CARRY_LIST: CarryConfig[] = [
    {
        name: 'Положить на плечо',
        carriedAnimation: {
            dictionary: 'nm',
            name: 'firemans_carry',
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: 'missfinale_c2mcs_1',
            name: 'fin_c2_mcs_1_camman',
            flag: 49,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0.15, 0.22, 0.63),
            rotation: new mp.Vector3(0.5, 0.5, 0.0)
        }
    },

    {
        name: 'Нести на руках',
        carriedAnimation: {
            dictionary: 'amb@code_human_in_car_idles@generic@ps@base',
            name: 'base',
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: 'anim@heists@box_carry@',
            name: 'idle',
            flag: 50,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0.08, 0.38, 0.25),
            rotation: new mp.Vector3(0.9, 0.30, 90.0)
        }
    },

    {
        name: 'Нести за спиной',
        carriedAnimation: {
            dictionary: 'anim@arena@celeb@flat@paired@no_props@',
            name: 'piggyback_c_player_b',
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: 'anim@arena@celeb@flat@paired@no_props@',
            name: 'piggyback_c_player_a',
            flag: 49,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0, -0.15, 0.45),
            rotation: new mp.Vector3(0, 0, 0.0)
        }
    }
]
