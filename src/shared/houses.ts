// export const MULTIHOUSE_ENTER_COORDS = new mp.Vector3(-774.98, 312.34, 85.70)
// export const MULTIHOUSE_PARKING_ENTER = new mp.Vector3( -791.54, 332.35, 84.42)

export interface HousesTeleportsItem {name: string, carExit: Vector3Mp, carH: number, pos: Vector3Mp, posH: number, inside: Vector3Mp, insideH: number, rooms: [number, number, number, number][]}

export const HOUSES_TELEPORT_SEPARATOR = 1000

export const HousesTeleportsList:HousesTeleportsItem[] = [
    {name: "Многоквартирный дом 1", pos: new mp.Vector3(-772.91, 312.45, 84.70), posH: 174, carExit: new mp.Vector3(-796.12, 320.12, 84.69), carH: 184, inside: new mp.Vector3(-793.91, 332.37, 45.56), insideH: 350, rooms: [[-792.27,339.63,45.56,90],[-795.48,339.52,45.56,265],[-792.47,347.13,45.56,84],[-795.66,347.00,45.56,271],[-800.60,350.70,45.56,280],[-799.09,351.87,45.56,180],[-794.16,352.16,45.56,179],[-789.26,352.21,45.56,175],[-787.46,351.12,45.56,84]]
    },
    {
        name: "Многоквартирный дом 2",
        pos: new mp.Vector3(-1447.48, -537.72, 33.74),
        posH: 210,
        carExit: new mp.Vector3(-1449.22, -513.89, 30.58),
        carH: 33,
        inside: new mp.Vector3(-793.91, 332.37, 45.56),
        insideH: 350,
        rooms: [
            [-792.27,339.63,45.56,90],
            [-795.48,339.52,45.56,265],
            [-792.47,347.13,45.56,84],
            [-795.66,347.00,45.56,271],
            [-800.60,350.70,45.56,280],
            [-799.09,351.87,45.56,180],
            [-794.16,352.16,45.56,179],
            [-789.26,352.21,45.56,175],
            [-787.46,351.12,45.56,84]
        ]
    },
    {
        name: "Многоквартирный дом 3",
        pos: new mp.Vector3(-595.91, 37.10, 42.61),
        posH: 174,
        carExit: new mp.Vector3(-623.55, 56.63, 42.73),
        carH: 89,
        inside: new mp.Vector3(-793.91, 332.37, 45.56),
        insideH: 350,
        rooms: [
            [-792.27,339.63,45.56,90],
            [-795.48,339.52,45.56,265],
            [-792.47,347.13,45.56,84],
            [-795.66,347.00,45.56,271],
            [-800.60,350.70,45.56,280],
            [-799.09,351.87,45.56,180],
            [-794.16,352.16,45.56,179],
            [-789.26,352.21,45.56,175],
            [-787.46,351.12,45.56,84]
        ]
    },
]
