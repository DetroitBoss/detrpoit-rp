export const FIGHT_LIST:{
    /** Название локации */
    name: string;
    /** Центр */
    pos: Vector3Mp;
    /** Радиус */
    radius: number;
    /** Место спавна синей команды */
    blueTeamPos: Vector3Mp;
    /** Угол поворота синей команды */
    blueTeamH: number;
    /** Место спавна красной команды */
    redTeamPos: Vector3Mp;
    /** Угол поворота красной команды */
    redTeamH: number;
}[] = [
        { 
            name: "Кладбище самолетов", 
            pos: new mp.Vector3(2388.67, 3093.93, 48.15), 
            radius: 180, 
            blueTeamPos: new mp.Vector3(2426.76, 3153.68, 48.22), 
            blueTeamH: 145,             
            redTeamPos: new mp.Vector3(2350.60, 3034.18, 48.15),
            redTeamH: 323,
        },
        { 
            name: "Стройка", 
            pos: new mp.Vector3(1057.955, 2252.995, 49.11), 
            radius: 110, 
            blueTeamPos: new mp.Vector3(1041.81, 2280.00, 49.63), 
            blueTeamH: 181,             
            redTeamPos: new mp.Vector3(1074.10, 2225.99, 49.11),
            redTeamH: 27,
        },
        { 
            name: "Аэропорт LS", 
            pos: new mp.Vector3(-1066.455, -2788.045, 44.56), 
            radius: 200, 
            blueTeamPos: new mp.Vector3(-1012.16, -2777.92, 48.06), 
            blueTeamH: 143,             
            redTeamPos: new mp.Vector3(-1082.59, -2815.23, 48.06),
            redTeamH: 327,
        },
        { 
            name: "Лесопилка", 
            pos: new mp.Vector3(-553.705, 5312.88, 70.32), 
            radius: 200, 
            blueTeamPos: new mp.Vector3(-529.32, 5377.28, 70.32), 
            blueTeamH: 112,             
            redTeamPos: new mp.Vector3(-578.09, 5248.48, 70.47),
            redTeamH: 339,
        },
        { 
            name: "Ла-Пуэрта", 
            pos: new mp.Vector3(-529.14, -1689.065, 18.59), 
            radius: 200, 
            blueTeamPos: new mp.Vector3(-576.00, -1641.39, 19.41), 
            blueTeamH: 190,             
            redTeamPos: new mp.Vector3(-482.28, -1736.74, 18.59),
            redTeamH: 84,
        },
        { 
            name: "Доки", 
            pos: new mp.Vector3(-43.035, -2660.665, 6.01), 
            radius: 210, 
            blueTeamPos: new mp.Vector3(34.59, -2661.48, 6.01), 
            blueTeamH: 96,             
            redTeamPos: new mp.Vector3(-120.66, -2659.85, 6.01),
            redTeamH: 268,
        },        
        { 
            name: "Крыша в порту", 
            pos: new mp.Vector3(227.64, -3227.17, 40.54), 
            radius: 130, 
            blueTeamPos: new mp.Vector3(233.84, -3154.29, 40.53), 
            blueTeamH: 175,             
            redTeamPos: new mp.Vector3(220.84, -3296.19, 40.54),
            redTeamH: 358,
        },
        { 
            name: "Лагерь альтруистов", 
            pos: new mp.Vector3(-1113.42, 4923.52, 217.92), 
            radius: 180, 
            blueTeamPos: new mp.Vector3(-1159.44, 4923.78, 224.11), 
            blueTeamH: 271,             
            redTeamPos: new mp.Vector3(-1045.71, 4908.95, 210.44),
            redTeamH: 47,
        },
        { 
            name: "Лодочная станция", 
            pos: new mp.Vector3(1349.19, 4347.44, 43.19), 
            radius: 120, 
            blueTeamPos: new mp.Vector3(1329.00, 4295.21, 37.26), 
            blueTeamH: 327,             
            redTeamPos: new mp.Vector3(1366.05, 4384.51, 44.33),
            redTeamH: 153,
        },
]