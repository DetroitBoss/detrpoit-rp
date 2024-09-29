export interface ISquadTask {
    completed: boolean
    created: number
    points: [Vector3Mp, Vector3Mp][]
    completedPoints: [boolean, boolean]
    step: number
}

export const SANITATION_SQUAD_POINTS: [Vector3Mp, Vector3Mp][] = [
    [new mp.Vector3(-577.75, -295.98, 33.98), new mp.Vector3(-574.70, -295.27, 34.05)],
    [new mp.Vector3(-581.48, 192.25, 70.37), new mp.Vector3(-581.24, 189.37, 70.29)],
    [new mp.Vector3(-358.37, 81.45, 62.61), new mp.Vector3(-355.93, 81.92, 62.90)],
    [new mp.Vector3(-340.50, 76.80, 63.57), new mp.Vector3(-311.28, 74.98, 65.14)],
    [new mp.Vector3(49.04, -832.41, 30.01), new mp.Vector3(51.63, -832.75, 30.05)],
    [new mp.Vector3(-4.11, -1081.71, 25.67), new mp.Vector3(-5.83, -1084.20, 25.67)],
    [new mp.Vector3(127.45, -1055.43, 28.19), new mp.Vector3(130.17, -1056.00, 28.19)],
    [new mp.Vector3(151.43, -1066.73, 28.21), new mp.Vector3(153.78, -1067.31, 28.19)],
    [new mp.Vector3(171.22, -1073.50, 28.19), new mp.Vector3(171.84, -1076.31, 28.19)],
    [new mp.Vector3(300.94, -905.67, 28.29), new mp.Vector3(298.10, -904.54, 28.29)],
    [new mp.Vector3(438.10, -1063.08, 28.21), new mp.Vector3(440.20, -1062.38, 28.21)],
    [new mp.Vector3(294.53, 365.92, 104.37), new mp.Vector3(291.11, 366.52, 104.39)],
    [new mp.Vector3(196.73, 335.94, 104.56), new mp.Vector3(193.30, 332.29, 104.44)],
    [new mp.Vector3(-1799.37, -405.88, 43.80), new mp.Vector3(-1800.74, -407.92, 43.69)],
    [new mp.Vector3(-1787.04, -493.70, 37.77), new mp.Vector3(-1788.79, -491.79, 37.79)],
    [new mp.Vector3(-3243.44, 994.12, 11.46), new mp.Vector3(-3247.84, 995.10, 11.48)],
    [new mp.Vector3(-2947.80, 417.03, 14.28), new mp.Vector3(-2950.22, 420.76, 14.28)],
    [new mp.Vector3(562.21, 2668.64, 41.14), new mp.Vector3(562.99, 2670.84, 41.12)],
    [new mp.Vector3(565.11, 2804.54, 41.11), new mp.Vector3(562.97, 2803.64, 41.21)],
    [new mp.Vector3(1176.57, 2728.89, 37.00), new mp.Vector3(1174.51, 2728.75, 37.00)],
    [new mp.Vector3(1945.49, 3831.54, 31.12), new mp.Vector3(1946.50, 3830.14, 31.13)],
    [new mp.Vector3(1727.96, 4787.03, 40.88), new mp.Vector3(1731.54, 4791.69, 40.82)],
    [new mp.Vector3(1711.53, 4810.04, 40.90), new mp.Vector3(1713.97, 4810.07, 40.90)],
    [new mp.Vector3(-185.54, 6322.51, 30.42), new mp.Vector3(-183.73, 6320.60, 30.38)],
    [new mp.Vector3(-399.24, 6081.83, 30.50), new mp.Vector3(-397.58, 6095.20, 30.46)],
    [new mp.Vector3(-437.16, 6144.61, 30.48), new mp.Vector3(-435.57, 6142.98, 30.48)],
]