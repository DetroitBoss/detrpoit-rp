export type DivingGameComponent = 'net' | 'lock' | 'chest' | null;

// LockGame

export interface Gear {
    id: number,
    success: boolean,
    rotation: number,
    neededRotation: number
}

export const DIVING_LOCK_GAME_MIN_ROT = 80;
export const DIVING_LOCK_GAME_MAX_ROT = 480;

// NetGame

export interface CollectItem {
    img: string,
    isDragging: boolean,
    inNet: boolean
}

// ChestGame

export interface Rune {
    img: number,
    symbol: string,
    x: number,
    isDragging: boolean
}

export interface RuneManual {
    img: number,
    symbol: string
}

export const runesManual: RuneManual[] = [
    {
        img: 0,
        symbol: "A"
    },
    {
        img: 1,
        symbol: "B"
    },
    {
        img: 2,
        symbol: "C"
    },
    {
        img: 3,
        symbol: "D"
    }
]