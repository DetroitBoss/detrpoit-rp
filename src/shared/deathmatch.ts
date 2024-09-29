export interface DeathMathPlayerBase {
    id: number,
    name: string,
    score: number,
    death: number,
}

export interface DeathMathTeamStartPos {
    x: number,
    y: number,
    z: number,
    /** Угол поворота */
    h: number,
    /** Радиус разброса от центра */
    r: number
}

export type eventEnd = (winner:1|2)=>void

export const DEATHMATCH_COLOR:RGBA = [179, 0, 0, 0.5]

export type CaptureType = {
    show: boolean,
    // select: number,
    capture: Array<{
        name: string,
        image?:string,
        score?: number
    }>,
    time: number,
    killist?: Array<{ killer: string, killed: string}>,
    type: string,
    start: boolean;
}