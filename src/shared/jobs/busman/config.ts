interface EmployerNPC {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

interface EmployerBlip {
    Sprite: number,
    Color: number,
    Position: Vector3Mp,
    Name: string
}

export interface JobLevel {
    index: number,
    fromEXP: number,
    description: string,
    salary: number,
    vehicleModel: string,
    payment: number
}

export interface WorkState {
    type: number | null,
    status?: number,
    Halt?: HaltState,
    vehicleID?: number,
    spawnVehicleMarker?: MarkerMp,
    pedsInBus?: PedMp[],
    pedsOnStop?: PedMp[],
    timeout?: number,
    stopsForEXP?: number
}

interface VehicleSpawn {
    Position: Vector3Mp,
    Heading: number
}

export interface Halt {
    blipSprite: number,
    blipColor: number,
    blipName: string,
    colshapeRange: number,
    markerScale: number,
    markerColor: RGBA
}

export interface HaltState {
    Blip: BlipMp,
    Colshape: ColshapeMp,
    Marker: MarkerMp
}

interface WorkVehicle {
    color: number[]
}

/* Конфиг рабочего транспорта */

export const WORK_VEHICLE: WorkVehicle = {
    color: [0, 0, 0, 0, 0, 0]
}

export const PED_MODELS: string[] = [
    "csb_prologuedriver",
    "ig_prolsec_02",
    "s_m_m_snowcop_01",
    "a_m_o_soucent_03",
    "ig_talina",
    "ig_chengsr",
    "mp_m_forgery_01",
    "ig_brad",
    "g_m_m_chiboss_01",
    "g_m_m_chigoon_01",
]

/* Конфиг остановки */

export const HALT: Halt = {
    blipSprite: 1,
    blipColor: 73,
    blipName: "Остановка",
    colshapeRange: 5,
    markerScale: 5,
    markerColor: [241,203,88,255]
}

/* NPC у которого брать работу */

export const EMPLOYER_NPC: EmployerNPC = {
    Position: new mp.Vector3(436.30, -627.69, 28.71),
    Heading: 85,
    Model: "s_m_y_airworker",
    Name: "Директор вокзала",
    Range: 10,
    Dimension: 0
}

/* Блип самого NPC */

export const EMPLOYER_BLIP: EmployerBlip = {
    Sprite: 513,
    Color: 46,
    Position: EMPLOYER_NPC.Position,
    Name: "Автобусный вокзал"
}
/* Через сколько остановка +1 EXP */

export const STOPS_FOR_EXP = 1;

/* Массив уровней работы */

export const BUS_LEVELS: JobLevel[] = [
    {
        index: 0,
        fromEXP: 0,
        description: "Ездите и подбирайте пассажиров",
        salary: 0,
        vehicleModel: 'bus',
        payment: 195
    },
    {
        index: 1,
        fromEXP: 1000,
        description: "Ездите и подбирайте пассажиров",
        salary: 1,
        vehicleModel: 'bus',
        payment: 220
    },
    {
        index: 2,
        fromEXP: 2000,
        description: "Ездите и подбирайте пассажиров",
        salary: 2,
        vehicleModel: 'coach',
        payment: 270
    },
    {
        index: 3,
        fromEXP: 5000,
        description: "Ездите и подбирайте пассажиров",
        salary: 3,
        vehicleModel: 'bus',
        payment: 350
    },
    {
        index: 4,
        fromEXP: 10000,
        description: "Ездите и подбирайте пассажиров",
        salary: 4,
        vehicleModel: 'airbus',
        payment: 500
    }
]

/* Униформка */

export const DRESS_CONFIG_MALE: [number, number, number][] = [
    [3, 11, 0],
    [8, 15, 0],
    [11, 95, 2],
    [4, 24, 0],
    [6, 10, 0],
    [102, 2, 0]
];

export const DRESS_CONFIG_FEMALE: [number, number, number][] = [
    [3, 3, 0],
    [8, 38, 2],
    [11, 25, 10],
    [4, 7, 0],
    [6, 0, 0]
];

/* Точки спавна транспорта */

export const VEHICLE_SPAWNS: VehicleSpawn[] = [
    {
        Position: new mp.Vector3(418.11,-633.54,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(418.37,-638.65,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(418.54,-644.22,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(418.55,-649.44,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(418.37,-654.70,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(395.92,-660.64,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(395.93,-654.98,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(395.91,-649.52,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(396.47,-644.20,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(396.24,-638.65,28.50),
        Heading: 270
    },
    {
        Position: new mp.Vector3(406.84,-633.19,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(406.97,-638.69,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(406.38,-644.11,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(406.23,-649.71,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(407.27,-655.01,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(431.42,-599.70,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(430.96,-605.28,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(429.92,-610.62,28.50),
        Heading: 85
    },
    {
        Position: new mp.Vector3(430.79,-616.11,28.50),
        Heading: 85
    }
]

interface NPCPosition {
    Position: Vector3Mp,
    Heading: number
}

interface BusStop {
    Position: Vector3Mp,
    NPCPositions: NPCPosition[]
}


export const BUS_STOPS: BusStop[] = [
    // id 0
    {
        Position: new mp.Vector3(306.68, -766.02, 29.21),
        NPCPositions: [
            {
                Position: new mp.Vector3(304.86,-763.99,29.31),
                Heading: 244
            },
            {
                Position: new mp.Vector3(304.10,-766.25,29.31),
                Heading: 244
            },
        ]
    },
    // id 1
    {
        Position: new mp.Vector3(114.37,-785.05,31.35),
        NPCPositions: [
            {
                Position: new mp.Vector3(114.42,-781.69,31.41),
                Heading: 263
            },
            {
                Position: new mp.Vector3(116.53,-782.21,31.39),
                Heading: 272
            },
        ]
    },
    // id 2
    {
        Position: new mp.Vector3(-505.04,-667.71,33.01),
        NPCPositions: [
            {
                Position: new mp.Vector3(-503.93,-670.34,33.08),
                Heading: 338
            },
            {
                Position: new mp.Vector3(-505.88,-670.79,33.11),
                Heading: 338
            },
            {
                Position: new mp.Vector3(-507.46,-670.46,33.13),
                Heading: 338
            },
        ]
    },
    // id 3
    {
        Position: new mp.Vector3(-740.67,-751.18,26.73),
        NPCPositions: [
            {
                Position: new mp.Vector3(-738.32,-749.66,26.91),
                Heading: 90
            },
            {
                Position: new mp.Vector3(-738.50,-751.06,26.83),
                Heading: 79
            },
        ]
    },
    // id 4
    {
        Position: new mp.Vector3(-558.13,-845.03,27.55),
        NPCPositions: [
            {
                Position: new mp.Vector3(-557.04,-848.75,27.69),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-559.55,-848.55,27.44),
                Heading: 272
            },
        ]
    },
    // id 5
    {
        Position: new mp.Vector3(-249.25,-882.93,30.58),
        NPCPositions: [
            {
                Position: new mp.Vector3(-248.68,-886.56,30.58),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-251.39,-886.17,30.67),
                Heading: 272
            },
        ]
    },
    // id 6
    {
        Position: new mp.Vector3(-173.34,-819.87,31.03),
        NPCPositions: [
            {
                Position: new mp.Vector3(-175.68,-820.00,31.10),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-175.03,-817.15,31.18),
                Heading: 272
            },
        ]
    },
    // id 7
    {
        Position: new mp.Vector3(-108.10,-1688.23,29.24),
        NPCPositions: [
            {
                Position: new mp.Vector3(-110.73,-1686.91,29.31),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-109.52,-1685.25,29.31),
                Heading: 272
            },
        ]
    },
    // id 8
    {
        Position: new mp.Vector3(51.11,-1534.99,29.21),
        NPCPositions: [
            {
                Position: new mp.Vector3(56.92,-1538.86,29.29),
                Heading: 263
            },
            {
                Position: new mp.Vector3(55.65,-1540.42,29.29),
                Heading: 272
            }
        ]
    },
    // id 9
    {
        Position: new mp.Vector3(440.67,-2030.83,23.50),
        NPCPositions: [
            {
                Position: new mp.Vector3(439.71,-2033.12,23.61),
                Heading: 263
            },
            {
                Position: new mp.Vector3(438.28,-2031.85,23.54),
                Heading: 272
            },
        ]
    },
    // id 10
    {
        Position: new mp.Vector3(258.75,-1123.57,29.22),
        NPCPositions: [
            {
                Position: new mp.Vector3(256.23,-1120.45,29.36),
                Heading: 263
            },
            {
                Position: new mp.Vector3(258.51,-1120.25,29.36),
                Heading: 272
            },
        ]
    },
    // id 11
    {
        Position: new mp.Vector3(-83.36,-644.07,36.18),
        NPCPositions: [
            {
                Position: new mp.Vector3(-80.53,-645.45,36.27),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-81.15,-647.51,36.26),
                Heading: 272
            },
        ]
    },
    // id 12
    {
        Position: new mp.Vector3(-504.82,20.08,44.71),
        NPCPositions: [
            {
                Position: new mp.Vector3(-506.12,22.70,44.79),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-503.82,23.24,44.81),
                Heading: 272
            },
        ]
    },
    // id 13
    {
        Position: new mp.Vector3(-693.13,-6.74,38.17),
        NPCPositions: [
            {
                Position: new mp.Vector3(-696.27,-2.81,38.24),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-693.73,-1.74,38.30),
                Heading: 272
            },
            {
                Position: new mp.Vector3(-697.90,-3.20,38.18),
                Heading: 272
            }
        ]
    },
    // id 14
    {
        Position: new mp.Vector3(-1528.67,-465.19,35.41),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1526.53,-463.55,35.40),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-1525.84,-466.86,35.32),
                Heading: 272
            },
        ]
    },
    // id 15
    {
        Position: new mp.Vector3(-1211.47,-1218.84,7.63),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1214.25,-1219.96,7.68),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-1214.65,-1218.11,7.69),
                Heading: 272
            },
        ]
    },
    // id 16
    {
        Position: new mp.Vector3(-1168.09,-1472.38,4.27),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1169.52,-1474.13,4.38),
                Heading: 263
            },
            {
                Position: new mp.Vector3(-1170.90,-1472.78,4.38),
                Heading: 272
            },
        ]
    },
    // id 17
    {
        Position: new mp.Vector3(440.67,-2030.83,23.50),
        NPCPositions: [
            {
                Position: new mp.Vector3(439.71,-2033.12,23.61),
                Heading: 263
            },
            {
                Position: new mp.Vector3(438.28,-2031.85,23.54),
                Heading: 272
            },
        ]
    },
    // id 18
    {
        Position: new mp.Vector3(440.67,-2030.83,23.50),
        NPCPositions: [
            {
                Position: new mp.Vector3(439.71,-2033.12,23.61),
                Heading: 263
            },
            {
                Position: new mp.Vector3(438.28,-2031.85,23.54),
                Heading: 272
            },
        ]
    },
    // id 19
    {
        Position: new mp.Vector3(440.67,-2030.83,23.50),
        NPCPositions: [
            {
                Position: new mp.Vector3(439.71,-2033.12,23.61),
                Heading: 263
            },
            {
                Position: new mp.Vector3(438.28,-2031.85,23.54),
                Heading: 272
            },
        ]
    },

    // Маршрут 1
    //По городу через больницу до миррор парка
    // id 20
    {
        Position: new mp.Vector3(307.01, -766.56, 29.23),
        NPCPositions: [
            {
                Position: new mp.Vector3(304.14, -766.45, 29.3),
                Heading: 268
            },
            {
                Position: new mp.Vector3(305.05, -764.37, 29.31),
                Heading: 213
            },
        ]
    },
    // id 21
    {
        Position: new mp.Vector3(-512.60, -648.49, 33.07),
        NPCPositions: [
            {
                Position: new mp.Vector3(-515.10, -645.22, 33.1),
                Heading: 205
            },
            {
                Position: new mp.Vector3(-512.26, -644.98, 33.17),
                Heading: 150
            },
        ]
    },
    // id 22
    {
        Position: new mp.Vector3(-735.18, -97.81, 37.87),
        NPCPositions: [
            {
                Position: new mp.Vector3(-732.85, -99.65, 38.08),
                Heading: 43
            },
            {
                Position: new mp.Vector3(-735.60, -101.50, 38.09),
                Heading: 343
            },
        ]
    },
    // id 23
    {
        Position: new mp.Vector3(-433.32, 120.90, 64.73),
        NPCPositions: [
            {
                Position: new mp.Vector3(-432.32, 117.36, 64.92),
                Heading: 13
            },
            {
                Position: new mp.Vector3(-435.13, 116.73, 64.86),
                Heading: 13
            },
        ]
    },
    // id 24
    {
        Position: new mp.Vector3(293.93, 148.09, 103.91),
        NPCPositions: [
            {
                Position: new mp.Vector3(294.00, 145.00, 104.03),
                Heading: 343
            },
            {
                Position: new mp.Vector3(291.35, 145.41, 104.08),
                Heading: 343
            },
        ]
    },
    // id 25
    {
        Position: new mp.Vector3(282.73, -494.26, 43.21),
        NPCPositions: [
            {
                Position: new mp.Vector3(279.74, -493.01, 43.25),
                Heading: 270
            },
            {
                Position: new mp.Vector3(280.06, -491.53, 43.25),
                Heading: 285
            },
        ]
    },
    // id 26
    {
        Position: new mp.Vector3(-388.06, -832.03, 31.46),
        NPCPositions: [
            {
                Position: new mp.Vector3(-388.87, -829.53, 31.56),
                Heading: 199
            },
            {
                Position: new mp.Vector3(-386.09, -829.40, 31.56),
                Heading: 215
            },
        ]
    },
    // id 27
    {
        Position: new mp.Vector3(-1323.58, -835.11, 16.82),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1321.97, -833.32, 16.95),
                Heading: 141
            },
            {
                Position: new mp.Vector3(-1319.44, -835.47, 16.95),
                Heading: 104
            },
        ]
    },
    // id 28
    {
        Position: new mp.Vector3(-1046.41, -389.21, 37.62),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1045.66, -393.15, 37.74),
                Heading: 35
            },
            {
                Position: new mp.Vector3(-1048.01, -394.37, 37.70),
                Heading: 77
            },
        ]
    },
    // id 29
    {
        Position: new mp.Vector3(-530.23, 306.50, 82.89),
        NPCPositions: [
            {
                Position: new mp.Vector3(-527.90, 306.85, 83.02),
                Heading: 103
            },
            {
                Position: new mp.Vector3(-527.95, 304.02, 83.02),
                Heading: 52
            },
        ]
    },
    // id 30
    {
        Position: new mp.Vector3(210.49, 353.87, 105.67),
        NPCPositions: [
            {
                Position: new mp.Vector3(210.51, 350.80, 105.6),
                Heading: 5
            },
            {
                Position: new mp.Vector3(208.38, 351.20, 105.71),
                Heading: 315
            },
        ]
    },
    // id 31
    {
        Position: new mp.Vector3(845.58, -217.66, 71.82),
        NPCPositions: [
            {
                Position: new mp.Vector3(845.12, -221.43, 71.84),
                Heading: 356
            },
            {
                Position: new mp.Vector3(841.73, -220.04, 72.1),
                Heading: 304
            },
        ]
    },
    // id 32
    {
        Position: new mp.Vector3(1091.00, -763.95, 57.66),
        NPCPositions: [
            {
                Position: new mp.Vector3(1091.47, -766.32, 57.82),
                Heading: 18
            },
            {
                Position: new mp.Vector3(1087.93, -765.95, 57.80),
                Heading: 323
            },
        ]
    },
    // Маршрут 2
    // id 33
    // Город - порт - миррор
    {
        Position: new mp.Vector3(496.78, -853.56, 24.97),
        NPCPositions: [
            {
                Position: new mp.Vector3(494.01, -854.62, 25.08),
                Heading: 308
            },
            {
                Position: new mp.Vector3(493.66, -851.79, 25.05),
                Heading: 234
            },
        ]
    },
    // id 34
    {
        Position: new mp.Vector3(263.29, -1124.69, 29.22),
        NPCPositions: [
            {
                Position: new mp.Vector3(260.07, -1121.38, 29.42),
                Heading: 257
            },
            {
                Position: new mp.Vector3(261.81, -1120.21, 29.36),
                Heading: 234
            },
        ]
    },
    // id 35
    {
        Position: new mp.Vector3(-108.88, -1688.58, 29.23),
        NPCPositions: [
            {
                Position: new mp.Vector3(-110.58, -1686.90, 29.31),
                Heading: 264
            },
            {
                Position: new mp.Vector3(-109.39, -1685.85, 29.31),
                Heading: 215
            },
        ]
    },
    // id 36
    {
        Position: new mp.Vector3(243.89, -1851.35, 26.54),
        NPCPositions: [
            {
                Position: new mp.Vector3(243.13, -1853.72, 26.61),
                Heading: 349
            },
            {
                Position: new mp.Vector3(240.35, -1852.18, 26.63),
                Heading: 317
            },
        ]
    },
    // id 37
    {
        Position: new mp.Vector3(303.64, -2508.29, 5.84),
        NPCPositions: [
            {
                Position: new mp.Vector3(301.80,-2506.18,5.98),
                Heading: 235
            },
            {
                Position: new mp.Vector3(305.20,-2504.62,6.00),
                Heading: 184
            },
        ]
    },
    // id 38
    {
        Position: new mp.Vector3(-387.21,-2830.60,6.00),
        NPCPositions: [
            {
                Position: new mp.Vector3(-385.02,-2831.20,6.00),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-386.18,-2832.81,6.00),
                Heading: 184
            },
        ]
    },
    // id 39
    {
        Position: new mp.Vector3(665.28,-2774.98,6.13),
        NPCPositions: [
            {
                Position: new mp.Vector3(662.46,-2776.65,6.14),
                Heading: 235
            },
            {
                Position: new mp.Vector3(661.61,-2773.98,6.15),
                Heading: 184
            },
        ]
    },
    // id 40
    {
        Position: new mp.Vector3(819.89,-1484.40,27.64),
        NPCPositions: [
            {
                Position: new mp.Vector3(822.26,-1482.48,27.74),
                Heading: 235
            },
            {
                Position: new mp.Vector3(823.70,-1484.45,27.80),
                Heading: 184
            },
        ]
    },
    // id 41
    {
        Position: new mp.Vector3(958.12,-990.79,40.27),
        NPCPositions: [
            {
                Position: new mp.Vector3(957.09,-987.51,40.19),
                Heading: 235
            },
            {
                Position: new mp.Vector3(959.75,-986.92,40.46),
                Heading: 184
            },
        ]
    },
    // id 42
    {
        Position: new mp.Vector3(265.58,-221.71,53.92),
        NPCPositions: [
            {
                Position: new mp.Vector3(264.71,-218.10,53.99),
                Heading: 235
            },
            {
                Position: new mp.Vector3(266.73,-218.70,53.98),
                Heading: 184
            },
        ]
    },
    // id 43
    {
        Position: new mp.Vector3(-82.88,-644.87,36.10),
        NPCPositions: [
            {
                Position: new mp.Vector3(-80.83,-645.55,36.27),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-81.17,-647.40,36.27),
                Heading: 184
            },
        ]
    },
    // id 44
    {
        Position: new mp.Vector3(306.92,-764.60,29.20),
        NPCPositions: [
            {
                Position: new mp.Vector3(304.52,-765.77,29.31),
                Heading: 235
            },
            {
                Position: new mp.Vector3(304.60,-764.25,29.31),
                Heading: 184
            },
        ]
    },

    // Маршрут 3
    // Город - ааеропорт
    // id 45
    {
        Position: new mp.Vector3(306.56,-766.95,29.22),
        NPCPositions: [
            {
                Position: new mp.Vector3(304.40,-766.57,29.31),
                Heading: 235
            },
            {
                Position: new mp.Vector3(304.86,-764.37,29.31),
                Heading: 184
            },
        ]
    },
    // id 46
    {
        Position: new mp.Vector3(-227.56,-1130.64,22.98),
        NPCPositions: [
            {
                Position: new mp.Vector3(-228.72,-1127.67,23.03),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-226.61,-1127.27,23.03),
                Heading: 184
            },
        ]
    },
    // id 47
    {
        Position: new mp.Vector3(-1077.61,-2042.98,13.00),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1079.87,-2047.83,13.10),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-1081.97,-2046.44,13.13),
                Heading: 184
            },
        ]
    },
    // id 48
    {
        Position: new mp.Vector3(-622.72,-2273.95,5.85),
        NPCPositions: [
            {
                Position: new mp.Vector3(-626.53,-2273.53,5.93),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-624.45,-2271.19,5.94),
                Heading: 184
            },
        ]
    },
    // id 49
    {
        Position: new mp.Vector3(-884.71,-2192.11,8.50),
        NPCPositions: [
            {
                Position: new mp.Vector3(-882.85,-2188.89,8.59),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-881.06,-2189.98,8.59),
                Heading: 184
            },
        ]
    },
    // id 50
    {
        Position: new mp.Vector3(-617.03,-1708.88,24.00),
        NPCPositions: [
            {
                Position: new mp.Vector3(-618.06,-1711.92,24.06),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-619.83,-1710.96,24.11),
                Heading: 184
            },
        ]
    },
    // id 51
    {
        Position: new mp.Vector3(-37.50,-1642.14,29.16),
        NPCPositions: [
            {
                Position: new mp.Vector3(-35.04,-1642.78,29.16),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-36.27,-1645.21,29.17),
                Heading: 184
            },
        ]
    },
    // id 52
    {
        Position: new mp.Vector3(256.00,-1135.53,29.25),
        NPCPositions: [
            {
                Position: new mp.Vector3(257.06,-1138.61,29.35),
                Heading: 235
            },
            {
                Position: new mp.Vector3(254.79,-1138.60,29.35),
                Heading: 184
            },
        ]
    },
    // id 53
    {
        Position: new mp.Vector3(63.51,-649.50,31.53),
        NPCPositions: [
            {
                Position: new mp.Vector3(59.75,-649.86,31.66),
                Heading: 235
            },
            {
                Position: new mp.Vector3(60.15,-647.47,31.66),
                Heading: 184
            },
        ]
    },
    // id 54
    {
        Position: new mp.Vector3(-622.85,-920.54,23.44),
        NPCPositions: [
            {
                Position: new mp.Vector3(-615.75,-919.04,23.53),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-615.78,-921.61,23.33),
                Heading: 184
            },
        ]
    },

    // Маршрут 4
    // Город - сенди шорс
    // id 55
    {
        Position: new mp.Vector3(412.52,-582.40,28.61),
        NPCPositions: [
            {
                Position: new mp.Vector3(415.58,-583.48,28.73),
                Heading: 235
            },
            {
                Position: new mp.Vector3(414.53,-585.36,28.73),
                Heading: 184
            },
        ]
    },
    // id 56
    {
        Position: new mp.Vector3(1402.62,673.72,79.12),
        NPCPositions: [
            {
                Position: new mp.Vector3(1405.85,673.26,79.07),
                Heading: 235
            },
            {
                Position: new mp.Vector3(1404.60,670.53,79.16),
                Heading: 184
            },
        ]
    },
    // id 57
    {
        Position: new mp.Vector3(2210.22,2723.67,46.31),
        NPCPositions: [
            {
                Position: new mp.Vector3(2213.03,2722.65,46.16),
                Heading: 235
            },
            {
                Position: new mp.Vector3(2211.67,2720.64,46.27),
                Heading: 184
            },
        ]
    },
    // id 58
    {
        Position: new mp.Vector3(1658.65,3583.97,35.51),
        NPCPositions: [
            {
                Position: new mp.Vector3(1661.47,3587.54,35.40),
                Heading: 235
            },
            {
                Position: new mp.Vector3(1662.60,3585.27,35.42),
                Heading: 184
            },
        ]
    },
    // id 59
    {
        Position: new mp.Vector3(898.82,3638.86,32.64),
        NPCPositions: [
            {
                Position: new mp.Vector3(897.42,3642.09,32.70),
                Heading: 235
            },
            {
                Position: new mp.Vector3(899.49,3642.57,32.75),
                Heading: 184
            },
        ]
    },
    // id 60
    {
        Position: new mp.Vector3(296.36,2593.17,44.53),
        NPCPositions: [
            {
                Position: new mp.Vector3(294.17,2590.64,44.38),
                Heading: 235
            },
            {
                Position: new mp.Vector3(292.66,2592.27,44.45),
                Heading: 184
            },
        ]
    },
    // id 61
    {
        Position: new mp.Vector3(1159.85,1806.65,74.18),
        NPCPositions: [
            {
                Position: new mp.Vector3(1158.16,1803.41,74.20),
                Heading: 235
            },
            {
                Position: new mp.Vector3(1156.87,1804.60,74.09),
                Heading: 184
            },
        ]
    },
    // id 62
    {
        Position: new mp.Vector3(596.77,634.96,128.91),
        NPCPositions: [
            {
                Position: new mp.Vector3(593.30,635.07,129.04),
                Heading: 235
            },
            {
                Position: new mp.Vector3(593.91,637.56,129.05),
                Heading: 184
            },
        ]
    },
    // id 63
    {
        Position: new mp.Vector3(365.28,170.72,102.95),
        NPCPositions: [
            {
                Position: new mp.Vector3(362.06,170.55,103.06),
                Heading: 235
            },
            {
                Position: new mp.Vector3(362.32,172.51,103.06),
                Heading: 184
            },
        ]
    },
    // id 64
    {
        Position: new mp.Vector3(203.32,-697.88,35.59),
        NPCPositions: [
            {
                Position: new mp.Vector3(200.33,-698.69,35.57),
                Heading: 235
            },
            {
                Position: new mp.Vector3(200.74,-696.41,35.71),
                Heading: 184
            },
        ]
    },
    // id 65
    {
        Position: new mp.Vector3(251.95,-1135.72,29.23),
        NPCPositions: [
            {
                Position: new mp.Vector3(253.16,-1138.93,29.34),
                Heading: 235
            },
            {
                Position: new mp.Vector3(251.53,-1139.36,29.34),
                Heading: 184
            },
        ]
    },
    // Маршрут 5 
    // город - палето бей
    // id 66
    {
        Position: new mp.Vector3(-311.99,-648.79,32.78),
        NPCPositions: [
            {
                Position: new mp.Vector3(-312.93,-646.65,32.70),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-311.02,-646.08,32.76),
                Heading: 184
            },
        ]
    },
    // id 67
    {
        Position: new mp.Vector3(-1335.83,-518.47,32.24),
        NPCPositions: [
            {
                Position: new mp.Vector3(-1337.93,-516.95,32.29),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-1336.28,-515.45,32.41),
                Heading: 184
            },
        ]
    },
    // id 68
    {
        Position: new mp.Vector3(-2109.26,-354.74,12.84),
        NPCPositions: [
            {
                Position: new mp.Vector3(-2108.55,-352.40,12.94),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-2107.67,-353.48,12.95),
                Heading: 184
            },
        ]
    },
    // id 69
    {
        Position: new mp.Vector3(-2975.19,466.94,15.19),
        NPCPositions: [
            {
                Position: new mp.Vector3(-2972.38,467.50,15.18),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-2972.33,466.16,15.18),
                Heading: 184
            },
        ]
    },
    // id 70
    {
        Position: new mp.Vector3(-2693.36,2339.37,17.07),
        NPCPositions: [
            {
                Position: new mp.Vector3(-2691.58,2340.10,17.05),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-2691.60,2338.71,17.07),
                Heading: 184
            },
        ]
    },
    // id 71
    {
        Position: new mp.Vector3(-2230.59,4256.19,45.94),
        NPCPositions: [
            {
                Position: new mp.Vector3(-2228.79,4255.92,46.02),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-2229.00,4254.54,45.93),
                Heading: 184
            },
        ]
    },
    // id 72
    {
        Position: new mp.Vector3(-850.14,5432.42,34.47),
        NPCPositions: [
            {
                Position: new mp.Vector3(-848.60,5431.11,34.45),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-849.62,5429.80,34.50),
                Heading: 184
            },
        ]
    },
    // id 73
    {
        Position: new mp.Vector3(-198.09,6323.74,31.41),
        NPCPositions: [
            {
                Position: new mp.Vector3(-195.36,6321.82,31.51),
                Heading: 235
            },
            {
                Position: new mp.Vector3(-196.33,6320.79,31.52),
                Heading: 184
            },
        ]
    },
    // id 74
    {
        Position: new mp.Vector3(2607.71,5075.82,44.77),
        NPCPositions: [
            {
                Position: new mp.Vector3(2605.51,5074.83,44.75),
                Heading: 235
            },
            {
                Position: new mp.Vector3(2604.61,5076.59,44.75),
                Heading: 184
            },
        ]
    }
]

/* Маршруты автобусов */

export const BUS_WAYS: BusStop[][] = [
    // Маршрут 1 уровня
    [
        BUS_STOPS[20],
        BUS_STOPS[21],
        BUS_STOPS[22],
        BUS_STOPS[23],
        BUS_STOPS[24],
        BUS_STOPS[25],
        BUS_STOPS[26],
        BUS_STOPS[27],
        BUS_STOPS[28],
        BUS_STOPS[29],
        BUS_STOPS[30],
        BUS_STOPS[31],
        BUS_STOPS[32],
        
    ],
    // Маршрут 2 уровня
    [
        BUS_STOPS[33],
        BUS_STOPS[34],
        BUS_STOPS[35],
        BUS_STOPS[36],
        BUS_STOPS[37],
        BUS_STOPS[38],
        BUS_STOPS[39],
        BUS_STOPS[40],
        BUS_STOPS[41],
        BUS_STOPS[42],
        BUS_STOPS[43],
        BUS_STOPS[44],
    ],
    // Маршрут 3 уровня
    [
        BUS_STOPS[45],
        BUS_STOPS[46],
        BUS_STOPS[47],
        BUS_STOPS[48],
        BUS_STOPS[49],
        BUS_STOPS[50],
        BUS_STOPS[51],
        BUS_STOPS[52],
        BUS_STOPS[53],
        BUS_STOPS[54],
    
    ],
    // Маршрут 4 уровня
    [
        BUS_STOPS[55],
        BUS_STOPS[56],
        BUS_STOPS[57],
        BUS_STOPS[58],
        BUS_STOPS[59],
        BUS_STOPS[60],
        BUS_STOPS[61],
        BUS_STOPS[62],
        BUS_STOPS[63],
        BUS_STOPS[64],
        BUS_STOPS[65],
    
    ],
    // Маршрут 5 уровня
    [
        BUS_STOPS[66],
        BUS_STOPS[67],
        BUS_STOPS[68],
        BUS_STOPS[69],
        BUS_STOPS[70],
        BUS_STOPS[71],
        BUS_STOPS[72],
        BUS_STOPS[73],
        BUS_STOPS[74],
        BUS_STOPS[60],
        BUS_STOPS[61],
        BUS_STOPS[62],
        BUS_STOPS[63],
        BUS_STOPS[64],
        BUS_STOPS[65],
    ]
]