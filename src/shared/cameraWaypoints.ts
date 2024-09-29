export interface CameraWaypoint {
    /** Идентификатор для запуска маршрута по ID */
    id: string;
    /** Угол обзора */
    fov: number;
    coords: { x: number, y: number, z: number, rx: number, ry: number, rz: number, time: number }[];
    /** Эта камера предназначена для загрузочного экрана и будет случайно выбираться для него */
    cameraForLoadScreen?: true;
}

export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
    {
        id: "startcamera1",
        fov: 35,
        coords: [
            { x: -2385.51, y: -1115.05, z: 5.94, rx: -22.391366958618164, ry: 1.1542429234623341e-7, rz: -86.6463394165039, time: 35000 },
            { x: -2155.40, y: -1081.47, z: 9.77, rx: 2.9186275005340576, ry: 0, rz: -83.64603424072266, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera2",
        fov: 35,
        coords: [
            { x: -516.98, y: -292.70, z: 38.75, rx: 2.1751081943511963, ry: 1.334983057432737e-8, rz: -5.627867698669434, time: 35000 },
            { x: -508.20, y: -250.83, z: 39.58, rx: 0.25984033942222595, ry: 0, rz: 38.14142608642578, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera3",
        fov: 35,
        coords: [
            { x: -287.23, y: -198.14, z: 124.66, rx: -6.200956344604492, ry: 2.1469951150265842e-7, rz: -159.35011291503906, time: 35000 },
            { x: -384.18, y: -491.42, z: 127.88, rx: 14.45740795135498, ry: 0, rz: -137.13641357421875, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera4",
        fov: 15,
        coords: [
            { x: 540.50, y: -79.94, z: 391.86, rx: -15.538573265075684, ry: 0, rz: 137.52024841308594, time: 35000 },
            { x: 36.69, y: -264.24, z: 235.09, rx: -10.157404899597168, ry: 4.3368387991904456e-7, rz: 163.99737548828125, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera5",
        fov: 25,
        coords: [
            { x: 327.73, y: 989.86, z: 253.85, rx: 11.139458656311035, ry: 0, rz: -62.17083740234375, time: 35000 },
            { x: 958.73, y: 995.20, z: 297.34, rx: -5.59882926940918, ry: 0, rz: 151.57443237304688, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera6",
        fov: 35,
        coords: [
            { x: 796.63, y: 50.97, z: 99.52, rx: -6.146016597747803, ry: 1.3417328581510901e-8, rz: -88.46786499023438, time: 35000 },
            { x: 889.00, y: -9.23, z: 119.43, rx: -6.738712787628174, ry: -2.1492820678759017e-7, rz: -42.83810043334961, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera7",
        fov: 35,
        coords: [
            { x: 658.17, y: -613.90, z: 18.78, rx: -12.886061668395996, ry: 0, rz: -76.17179107666016, time: 35000 },
            { x: 697.78, y: -615.05, z: 21.86, rx: -18.176006317138672, ry: -4.4930598619430384e-7, rz: -112.25457000732422, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera8",
        fov: 35,
        coords: [
            { x: 79.17, y: -1338.28, z: 36.50, rx: 14.298660278320312, ry: 0, rz: 16.176340103149414, time: 35000 },
            { x: 44.45, y: -1306.65, z: 35.87, rx: -7.545614242553711, ry: 0, rz: 88.94438934326172, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera9",
        fov: 35,
        coords: [
            { x: -1438.16, y: 949.80, z: 212.79, rx: -5.268324851989746, ry: 2.1434885866256081e-7, rz: -136.2998809814453, time: 35000 },
            { x: -1396.11, y: 817.84, z: 215.70, rx: -2.4864981174468994, ry: -1.0682227014058299e-7, rz: -138.16122436523438, time: 0 },
        ], cameraForLoadScreen: true
    },
    {
        id: "startcamera10",
        fov: 35,
        coords: [
            { x: -1110.90, y: -876.24, z: 15.76, rx: -17.5274715423584, ry: 4.4767094209419156e-7, rz: -77.09341430664062, time: 35000 },
            { x: -1073.90, y: -859.63, z: 15.78, rx: 14.139208793640137, ry: -4.4022328893333906e-7, rz: -71.2710952758789, time: 0 },
        ], cameraForLoadScreen: true
    }
]