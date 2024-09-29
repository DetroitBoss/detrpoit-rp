export interface ICrosshairSettings {
    length: number 
    width: number
    /** Зазор */
    gap: number
    alpha: number
    color: { r: number, g: number, b: number }
    enable: boolean
    aimColor: { r: number, g: number, b: number }
}