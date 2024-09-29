/** Тип скейлформы */
export type ScaleformTextMpType = "text" | "board"

export const DEFAULT_SCALE = { x: 2, y: 1, z: 1 }
export interface ScaleformTextMpOption {
    range?: number,
    rotation?: { x: number, y: number, z: number },
    scale?: { x: number, y: number, z: number },
    type?: "rotation" | "front" | "board",
    dimension?: number;
}

export interface ScaleformTextMpDto {
    id: number,
    text: string,
    position: Vector3Mp,
    rotation: { x: number, y: number, z: number },
    scale: { x: number, y: number, z: number },
    range: number,
    dimension: number,
    type: "rotation" | "front" | "board"
}