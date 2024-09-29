export interface DoorConfig {
    /** Конфиг пропов дверей */
    doors: {
        /** Хеш двери */
        hash: number,
        /** Координата X */
        x: number,
        /** Координата Y */
        y: number,
        /** Координата Z */
        z: number
    }[],
    /** Текст кнопки */
    text: string,
    /** Позиция текста */
    pos: {
        /** Координата X */
        x: number,
        /** Координата Y */
        y: number,
        /** Координата Z */
        z: number
    },
    /** Текущая фракция */
    fraction: number,
    /** Пометить дверь открытой по умолчанию */
    defaultOpened?: boolean
}

/** Список всех дверей */
export const DOORS_LIST: DoorConfig[] = [

        // LSPD
        // { text: "Служебный коридор LSPD", fraction: 2, doors: [{ hash: 1557126584, x: 450.10, y: -985.74, z: 30.84 }], pos: { x: 450.06, y: -986.39, z: 30.69}, defaultOpened: true},
        // { text: "Коридор LSPD", fraction: 2, doors: [{ hash: 185711165, x: 443.41, y: -989.45, z: 30.84 },{hash:185711165,x: 446.01, y: -989.45, z: 30.84}], pos: { x: 444.72, y: -989.21, z: 30.69}, defaultOpened: true},
        // { text: "Лестница на второй этаж", fraction: 2, doors: [{ hash: -131296141, x: 443.03, y: -991.94, z: 30.84 },{hash: -131296141, x: 443.03, y: -994.54, z: 30.84}], pos: { x: 443.06, y: -993.23, z: 30.69}, defaultOpened: true},
        // { text: "Допросная LSPD", fraction: 2, doors: [{ hash: -543497392, x: 446.13, y: -987.79, z: 26.82 },{ hash: -543497392, x: 446.12, y: -985.20, z: 26.82 }], pos: { x: 446.11, y: -986.50, z: 26.67}, defaultOpened: true},
        // { text: "Черный вход LSPD", fraction: 2, doors: [{ hash: -1033001619, x: 447.22, y: -999.00, z: 30.79 },{ hash: -1033001619, x: 444.62, y: -999.00, z: 30.79 }], pos: { x: 445.88, y: -999.14, z: 30.72}, defaultOpened: true},
        // { text: "Кабинет шефа LSPD", fraction: 2, doors: [{ hash: -1320876379, x: 463.42, y: -1001.01, z: 36.05 }], pos: { x: 462.65, y: -1000.77, z: 35.93}, defaultOpened: true},
        // { text: "Митинг рум LSPD", fraction: 2, doors: [{ hash: -131296141, x: 474.62, y: -991.97, z: 36.05 }], pos: { x: 475.38, y: -992.18, z: 35.93}, defaultOpened: true},
        // { text: "Митинг рум LSPD", fraction: 2, doors: [{ hash: -131296141, x: 484.04, y: -992.00, z: 36.05 }], pos: { x: 484.71, y: -992.15, z: 35.93}, defaultOpened: true},
        // { text: "Задний вход LSPD", fraction: 2, doors: [{ hash: -2023754432, x: 467.37, y: -1014.45, z: 26.54 },{ hash: -2023754432, x: 469.97, y: -1014.45, z: 26.54 }], pos: { x: 468.57, y: -1014.28, z: 26.39}, defaultOpened: true},
        // { text: "Клетка 1", fraction: 2, doors: [{ hash: 631614199, x: 461.8065, y: -994.4069, z: 25.06535 }], pos: { x: 462.04, y: -993.54, z: 24.91}, defaultOpened: true},
        // { text: "Клетка 2", fraction: 2, doors: [{ hash: 631614199, x: 461.8065, y: -997.6582, z: 25.0653 }], pos: { x: 461.87, y: -998.38, z: 24.91}, defaultOpened: true},
        // { text: "Клетка 3", fraction: 2, doors: [{ hash: 631614199, x:461.8065,  y: -1001.301, z: 25.06535 }], pos: { x: 461.87, y: -1001.95, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 1", fraction: 2, doors: [{ hash: -1033001619, x: 468.49, y: -1003.55, z: 25.01 }], pos: { x: 467.79, y: -1003.50, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 2", fraction: 2, doors: [{ hash: -1033001619, x: 471.47, y: -1003.54, z: 25.01 }], pos: { x: 472.15, y: -1003.46, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 3", fraction: 2, doors: [{ hash: -1033001619, x: 477.05, y: -1003.55, z: 25.01 }], pos: { x: 476.30, y: -1003.53, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 4", fraction: 2, doors: [{ hash: -1033001619, x: 480.03, y: -1003.54, z: 25.01 }], pos: { x: 480.73, y: -1003.52, z: 24.91}, defaultOpened: true},
        // { text: "Крыша ЛСПД", fraction: 2, doors: [{ hash: -340230128, x: 464.36, y: -984.68, z: 43.83 }], pos: { x: 464.38, y: -983.98, z: 43.70}, defaultOpened: true},
        // { text: "Камера 1", fraction: 2, doors: [{ hash: -1033001619, x: 467.19, y: -996.46, z: 25.01 }], pos: { x: 467.87, y: -996.45, z: 24.91}, defaultOpened: true},
        // { text: "Камера 2", fraction: 2, doors: [{ hash: -1033001619, x: 471.48, y: -996.46, z: 25.01 }], pos: { x: 472.23, y: -996.54, z: 24.91}, defaultOpened: true},
        // { text: "Камера 3", fraction: 2, doors: [{ hash: -1033001619, x: 475.75, y: -996.46, z: 25.01 }], pos: { x: 476.50, y: -996.56, z: 24.91}, defaultOpened: true},
        // { text: "Камера 4", fraction: 2, doors: [{ hash: -1033001619, x: 480.03, y: -996.46, z: 25.01 }], pos: { x: 480.82, y: -996.45, z: 24.91}, defaultOpened: true},


        // GOV
        { text: "Кабинет губернатора", fraction: 1, doors: [{ hash: 736699661, x: -557.67, y: -205.05, z: 38.55 }, {hash: 736699661, x: -556.38, y: -207.31, z: 38.54}], pos: { x: -556.85, y: -206.02, z: 38.38}, defaultOpened: true},
        { text: "Зал заседаний", fraction: 1, doors: [{ hash: 736699661, x: -560.68, y: -199.83, z: 38.54 }, {hash: 736699661, x: -559.39, y: -202.08, z: 38.54}], pos: { x: -559.87, y: -200.81, z: 38.38}, defaultOpened: true},
        { text: "Комната охраны", fraction: 1, doors: [{ hash: 1219957182, x: -563.42, y: -195.08, z: 37.38 }, {hash: -1225363909, x: -562.68, y: -196.37, z: 37.38}], pos: { x: -562.94, y: -195.65, z: 38.38}, defaultOpened: true},
        { text: "Зал собраний", fraction: 1, doors: [{ hash: 736699661, x: -543.11, y: -185.10, z: 38.39 }, {hash: 736699661, x: -541.80, y: -187.35, z: 38.38}], pos: { x: -542.63, y: -186.33, z: 38.23}, defaultOpened: true},
        { text: "Зал собраний", fraction: 1, doors: [{ hash: 736699661, x: -540.68, y: -189.37, z: 38.38 }, {hash: 736699661, x: -539.39, y: -191.63, z: 38.38}], pos: { x: -540.09, y: -190.57, z: 38.23}, defaultOpened: true},

        // BCSD Сэнди-шорс
        { text: "Офис капитана", fraction: 7, doors: [{ hash: -2023754432, x: 1857.25, y: 3690.30, z: 34.42 }], pos: { x: 1856.68, y: 3689.86, z: 34.27}, defaultOpened: true},
        { text: "Лестничная площадка", fraction: 7, doors: [{ hash: -2023754432, x: 1849.98, y: 3684.11, z: 34.42 }, {hash: -2023754432, x: 1851.29, y: 3681.87, z: 34.42}], pos: { x: 1850.59, y: 3683.01, z: 34.27}, defaultOpened: true},
        { text: "Оружейная комната", fraction: 7, doors: [{ hash: -2023754432, x: 1849.40, y: 3691.21, z: 34.42 }, {hash: -2023754432, x: 1847.13, y: 3689.95, z: 34.42}], pos: { x: 1848.34, y: 3690.48, z: 34.27}, defaultOpened: true},
        { text: "Клетка 1", fraction: 7, doors: [{ hash: 2367212570, x: 1862.763, y: 3688.412, z: 30.40947 }], pos: { x: 1862.18, y: 3689.24, z: 30.26}, defaultOpened: true},
        { text: "Клетка 2", fraction: 7, doors: [{ hash: 2367212570, x: 1860.897, y: 3691.643, z: 30.40947 }], pos: { x: 1860.68, y: 3692.40, z: 30.26}, defaultOpened: true},
        { text: "Клетка 3", fraction: 7, doors: [{ hash: 2367212570, x: 1858.996, y: 3694.936, z: 30.40947 }], pos: { x: 1858.60, y: 3695.67, z: 30.26}, defaultOpened: true},
        { text: "Допросная", fraction: 7, doors: [{ hash: 749848321, x: 1852.92, y: 3686.41, z: 30.41 }], pos: { x: 1852.39, y: 3686.11, z: 30.26}, defaultOpened: true},

        // BCSD Палето-Бэй
        { text: "Гардеробная передняя", fraction: 7, doors: [{ hash: -2023754432, x: -450.71, y: 6016.37, z: 31.87 }], pos: { x: -450.12, y: 6016.14, z: 31.72}, defaultOpened: true},
        { text: "Гардеробная задняя", fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}, defaultOpened: true},
        { text: "Комната ожидания", fraction: 7, doors: [{ hash: -2023754432, x: -442.86, y: 6010.96, z: 31.87 }, {hash: -2023754432, x: -441.02, y: 6012.79, z: 31.87}], pos: { x: -441.82, y: 6011.81, z: 31.72}, defaultOpened: true},
        { text: "Лестничная площадка передняя", fraction: 7, doors: [{ hash: -2023754432, x: -442.66, y: 6009.30, z: 31.87 }, {hash: -2023754432, x: -440.82, y: 6007.46, z: 31.87}], pos: { x: -441.63, y: 6008.32, z: 31.72}, defaultOpened: true},
        { text: "Лестничная площадка задняя", fraction: 7, doors: [{ hash: 749848321, x: -447.77, y: 6005.19, z: 31.87 }], pos: { x: -447.16, y: 6004.93, z: 31.72}, defaultOpened: true},
        { text: "Оружейная комната передняя", fraction: 7, doors: [{ hash: 749848321, x: -437.04, y: 6003.70, z: 31.87 }], pos: { x: -436.45, y: 6003.40, z: 31.72}, defaultOpened: true},
        { text: "Оружейная комната задняя", fraction: 7, doors: [{ hash: 749848321, x: -440.42, y: 5998.60, z: 31.87 }], pos: { x: -440.93, y: 5999.20, z: 31.72}, defaultOpened: true},
        { text: "Хол", fraction: 7, doors: [{ hash: -2023754432, x: -449.57, y: 6008.54, z: 31.87 }, {hash: -2023754432, x: -447.73, y: 6006.70, z: 31.87}], pos: { x: -448.67, y: 6007.65, z: 31.72}, defaultOpened: true},
        { text: "Клетка", fraction: 7, doors: [{ hash: 2367212570, x: -444.3676, y: 6012.223, z: 28.13549 }], pos: { x: -444.54, y: 6011.47, z: 27.99}, defaultOpened: true},
        //{ text: "Задний вход", fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}},
        //{ text: "Задний вход", fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}},
        { text: "Допросная", fraction: 7, doors: [{ hash: 749848321, x: -436.63, y: 6002.55, z: 28.14 }], pos: { x: -437.05, y: 6002.04, z: 27.99}, defaultOpened: true},

        // ARMY
        { text: "КПП №1", fraction: 4, doors: [{hash: 3419809524, x: -1569.93579, y: 2765.0498, z: 18.088747},{hash: 3419809524, x: -1562.23181, y:  2774.231, z: 18.088747}], pos: { x: -1565.88, y: 2769.39, z: 17.44}, defaultOpened: true},
        { text: "КПП №2", fraction: 4, doors: [{ hash: 3419809524, x: -2322.044, y: 3393.939, z: 31.424181 },{ hash: 3419809524, x: -2314.3186, y: 3403.1123, z: 31.4162941} ], pos: { x: -2318.45, y: 3398.73, z: 30.76}, defaultOpened: true},

        // { text: "Лестничная площадка", fraction: 4, doors: [{ hash: -1207991715, x: -2353.75, y: 3252.64, z: 32.96 }], pos: { x: -2353.09, y: 3252.47, z: 32.81}, defaultOpened: true},
        // { text: "Лифт", fraction: 4, doors: [{ hash: -522980862, x: -2360.82, y: 3251.14, z: 31.81 }, {hash: -1977105237, x: -2359.37, y: 3250.30, z: 31.81}], pos: { x: -2359.97, y: 3250.91, z: 32.81}, defaultOpened: true},
        // { text: "Казарма", fraction: 4, doors: [{ hash: -551608542, x: -2346.58, y: 3231.93, z: 35.08 }], pos: { x: -2345.92, y: 3231.76, z: 34.96}, defaultOpened: true},
        { text: "Казарма", fraction: 4, doors: [{ hash: 1248599813, x: -2346.53, y: 3231.97, z: 35.09} ], pos: { x: -2346.15, y: 3231.20, z: 34.97}, defaultOpened: true},

        //EMS
        // { text: "Ресепшн", fraction: 16, doors: [{ hash: 854291622, x: 313.48, y: -595.46, z: 43.43}], pos: { x: 313.12, y: -596.31, z: 43.28}, defaultOpened: true},
        // { text: "Служебное Помещение", fraction: 16, doors: [{ hash: 854291622, x: 309.13, y: -597.75, z: 43.43 }], pos: { x: 308.18, y: -597.51, z: 43.28}, defaultOpened: true},
        // { text: "Лаборатория", fraction: 16, doors: [{ hash: 854291622, x: 307.12, y: -569.57, z: 43.43 }], pos: { x: 308.04, y: -569.80, z: 43.28}, defaultOpened: true},
        // { text: "Операционная 1", fraction: 16, doors: [{ hash: -434783486, x: 312.01, y: -571.34, z: 43.43 },{hash: -1700911976, x: 314.42, y: -572.22, z: 43.43}], pos: { x: 313.27, y: -571.64, z: 43.29}, defaultOpened: true},
        // { text: "Операционная 2", fraction: 16, doors: [{ hash: -434783486, x: 317.84, y: -573.47, z: 43.43 },{hash: -1700911976, x: 320.26, y: -574.35, z: 43.43}], pos: { x: 318.94, y: -574.00, z: 43.29}, defaultOpened: true},
        // { text: "Операционная 3", fraction: 16, doors: [{ hash: -434783486, x: 323.24, y: -575.43, z: 43.43 },{hash: -1700911976, x: 325.66, y: -576.31, z: 43.43}], pos: { x: 324.62, y: -575.78, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет МРТ", fraction: 16, doors: [{ hash: 854291622, x: 336.16, y: -580.14, z: 43.43 }], pos: { x: 337.09, y: -580.40, z: 43.28}, defaultOpened: true},
        // { text: "Служебное", fraction: 16, doors: [{ hash: 854291622, x: 340.78, y: -581.82, z: 43.43 }], pos: { x: 341.60, y: -582.09, z: 43.28}, defaultOpened: true},
        // { text: "Рентген Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 346.77, y: -584.00, z: 43.43 }], pos: { x: 347.57, y: -584.32, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет 1", fraction: 16, doors: [{ hash: 854291622, x: 339.00, y: -586.70, z: 43.43 }], pos: { x: 339.91, y: -587.08, z: 43.28}, defaultOpened: true},
        // { text: "VIP Палата 1", fraction: 16, doors: [{ hash: 854291622, x: 357.49, y: -579.61, z: 43.43 }], pos: { x: 357.27, y: -580.34, z: 43.28}, defaultOpened: true},
        // { text: "VIP Палата 2", fraction: 16, doors: [{ hash: 854291622, x: 356.13, y: -583.36, z: 43.43 }], pos: { x: 355.89, y: -584.29, z: 43.28}, defaultOpened: true},
        // { text: "Терапевтический Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 352.20, y: -594.15, z: 43.43 }], pos: { x: 351.87, y: -595.03, z: 43.28}, defaultOpened: true},
        // { text: "Реабилитационный Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 346.89, y: -593.60, z: 43.43 }], pos: { x: 347.21, y: -592.77, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет 2", fraction: 16, doors: [{ hash: 854291622, x: 358.73, y: -593.88, z: 43.43 }], pos: { x: 359.49, y: -594.15, z: 43.28}, defaultOpened: true},
        // { text: "Гараж", fraction: 16, doors: [{ hash: -434783486, x: 338.45, y: -590.05, z: 28.95 },{hash: -1700911976, x: 339.33, y: -587.63, z: 28.9}], pos: { x: 338.91, y: -588.89, z: 28.83}, defaultOpened: true},
        // { text: "Ресепшн", fraction: 16, doors: [{ hash: 854291622, x: 348.55, y: -585.16, z: 28.95 }], pos: { x: 348.22, y: -585.98, z: 28.80}, defaultOpened: true},
        { text: "Ворота EMS", fraction: 16, doors: [{ hash:  741314661, x: 399.8277, y:  -551.1396, z: 27.56778}], pos: {x: 402.78, y: -546.71, z: 28.58}, defaultOpened: true},

        //EMS paleto
        // { text: "Кабинет директора", fraction: 16, doors: [{ hash: 1859711902, x: -261.10, y: 6318.99, z: 32.58 }], pos: { x: -261.60, y: 6318.50, z: 32.44}, defaultOpened: true},
        // { text: "Комната обследований", fraction: 16, doors: [{ hash: 374758529, x: -257.37, y: 6322.71, z: 32.62 },{ hash: 374758529, x: -255.55, y: 6324.54, z: 32.62 }], pos: { x: -256.44, y: 6323.66, z: 32.44}, defaultOpened: true},


        //FIB
        { text: "Серверная", fraction: 3, doors: [{ hash: -2051651622, x: 2504.32, y: -411.30, z: 94.27 }], pos: { x: 2504.83, y: -411.69, z: 94.11}, defaultOpened: true},
        { text: "Лестничная площадка", fraction: 3, doors: [{ hash: -1033001619, x: 2490.97, y: -405.18, z: 94.26 }], pos: { x: 2490.41, y: -404.62, z: 94.11}, defaultOpened: true},
        { text: "КПЗ и склад", fraction: 3, doors: [{ hash: -1033001619, x: 2491.09, y: -405.05, z: 90.27 }], pos: { x: 2490.59, y: -404.52, z: 90.11}, defaultOpened: true},
        { text: "Склад", fraction: 3, doors: [{ hash: -1033001619, x: 2496.61, y: -403.95, z: 90.26 }], pos: { x: 2495.97, y: -403.42, z: 90.10}, defaultOpened: true},
        { text: "Первая допросная", fraction: 3, doors: [{ hash: -1033001619, x: 2502.89, y: -416.84, z: 90.25 }], pos: { x: 2502.35, y: -416.28, z: 90.10}, defaultOpened: true},
        { text: "Вторая допросная", fraction: 3, doors: [{ hash: -1033001619, x: 2506.97, y: -420.91, z: 90.25 }], pos: { x: 2506.44, y: -420.39, z: 90.10}, defaultOpened: true},
        { text: "Второй этаж", fraction: 3, doors: [{ hash: -1033001619, x: 2490.97, y: -405.18, z: 100.52 }], pos: { x: 2490.47, y: -404.61, z: 100.36}, defaultOpened: true},
        { text: "Кабинет директора", fraction: 3, doors: [{ hash: -2051651622, x: 2517.29, y: -443.74, z: 100.50 }], pos: { x: 2516.75, y: -444.27, z: 100.37}, defaultOpened: true},
        { text: "Лекционная", fraction: 3, doors: [{ hash: -2051651622, x: 2523.45, y: -437.57, z: 100.51 }], pos: { x: 2522.92, y: -438.07, z: 100.37}, defaultOpened: true},
        //{ text: "Лаборатория", fraction: 3, doors: [{ hash: -2051651622, x: 2507.83, y: -425.85, z: 100.51 }], pos: { x: 2507.30, y: -425.28, z: 100.36}, defaultOpened: true},
        //{ text: "Гардеробная ", fraction: 3, doors: [{ hash: -2051651622, x: 2507.83, y: -425.85, z: 100.51 }], pos: { x: 2507.30, y: -425.28, z: 100.36}},
        { text: "Главный вход в левый корпус", fraction: 3, doors: [{ hash: 3691419444, x: 2521.943, y: -417.3813, z: 93.09399 }, { hash: 1122723068, x: 2520.103, y: -415.5412, z: 93.09382} ], pos: { x: 2520.85, y: -416.45, z: 94.12}, defaultOpened: true},
        //  { text: "Приёмная", fraction: 3, doors: [{ hash: -395331334, x: 2507.42, y: -422.88, z: 104.71 }], pos: { x: 2502.89, y: -422.01, z: 94.58}},
        { text: "Подвал", fraction: 3, doors: [{ hash: 1055151324, x: 2511.095, y: -416.0965, z: 99.27245 }], pos: { x: 2510.34, y: -415.76, z: 99.11}},
        { text: "Конференц зал", fraction: 3, doors: [{ hash: 1055151324, x: 2510.824, y: -435.6792, z: 99.27245 },{ hash: 1055151324, x: 2512.664, y: -433.8399, z: 99.27245 }], pos: { x: 2511.55, y: -434.44, z: 99.11}},
        { text: "Кабинеты", fraction: 3, doors: [{ hash: 1055151324, x: 2499.76, y: -424.20, z: 99.11 },{ hash: 1055151324, x: 2501.43, y: -422.52, z: 99.11 }], pos: {x: 2500.37, y: -423.30, z: 99.11}},
        { text: "Главный вход", fraction: 3, doors: [{ hash: 4180086300, x: 2515.791, y: -355.7704, z: 93.08971 },{ hash: 2249271310, x: 2513.928, y: -357.5838, z: 93.08971 }], pos: {x: 2514.82, y: -356.55, z: 94.09}},

        { text: "Лестница", fraction: 3, doors: [{ hash: 823867722, x: 2497.481, y: -353.3639, z: 94.25793 }], pos: {x: 2498.03, y: -353.91, z: 94.09}},
        { text: "Тренажерный зал", fraction: 3, doors: [{ hash: 823867722, x: 2506.72, y: -361.99, z: 94.09 },{hash: 823867722, x: 2504.99, y: -360.32, z: 94.09}], pos: {x: 2505.76, y: -361.36, z: 94.09}},
        { text: "Охрана", fraction: 3, doors: [{ hash: 823867722, x: 2506.371, y: -357.1198, z: 94.2556 }], pos: {x: 2505.78, y: -356.82, z: 94.09}},
        { text: "Гардероб", fraction: 3, doors: [{ hash: 823867722, x: 2520.449, y: -336.174, z: 94.25628 },{ hash: 823867722, x: 2522.29, y: -338.0148, z: 94.25628 }], pos: {x: 2521.16, y: -337.32, z: 94.09}},



        //NEWS
        { text: "Задний вход", fraction: 5, doors: [{ hash: 1104171198, x: -1045.118, y: -232.0034, z: 39.44269 },{ hash: 1104171198, x: -1046.52, y: -229.3665, z: 39.44269 }], pos: { x: -1045.79, y: -230.70, z: 39.01}, defaultOpened: true},
        { text: "Главный вход", fraction: 5, doors: [{ hash: -1679881977, x: -1083.62, y: -260.42, z: 38.19 },{ hash: -1045015371, x: -1080.97, y: -259.02, z: 38.19 }], pos: { x: -1082.22, y: -259.66, z: 37.79}, defaultOpened: true},
        { text: "конференц-зал", fraction: 5, doors: [{ hash: 2473190209, x: -1048.281, y: -236.8198,z: 44.17329 },{ hash: 2473190209,x: -1047.086,y: -239.1204,z: 44.17329 }], pos: { x: -1048.38, y: -238.24, z: 44.02}, defaultOpened: true},
        { text: "Гардеробная", fraction: 5, doors: [{ hash: -495720969, x: -1055.96, y: -236.43, z: 44.17 }], pos: { x: -1055.29, y: -236.18, z: 44.02}, defaultOpened: true},


        //Weazel News
        { text: "Черный вход", fraction: 5, doors: [{ hash: 738456037, x: -576.44, y: -939.58, z: 23.99 },{ hash: 738456037, x: -573.84, y: -939.58, z: 23.99 } ], pos: { x: -575.15, y: -939.24, z: 23.86}},
        { text: "Студия", fraction: 5, doors: [{ hash: 1901183774, x: -580.05, y: -918.18, z: 28.34 }, ], pos: { x: -580.24, y: -917.49, z: 28.18}},
        { text: "Студия 2", fraction: 5, doors: [{ hash: 1901183774, x: -579.25, y: -928.54, z: 28.34 }, ], pos: { x: -579.24, y: -929.38, z: 28.19}},
        { text: "Студия 3", fraction: 5, doors: [{ hash: 1901183774, x: -574.97, y: -938.39, z: 28.34 },{ hash: 1901183774, x: -574.98, y: -935.82, z: 28.34 } ], pos: { x: -575.16, y: -937.19, z: 28.18}},
        { text: "Серверная", fraction: 5, doors: [{ hash: 1901183774, x: -594.12, y: -931.85, z: 32.69 } ], pos: { x: -594.75, y: -931.96, z: 32.52}},
        { text: "Студия 5", fraction: 5, doors: [{ hash: 1901183774, x: -574.58, y: -935.11, z: 32.69 } ], pos: { x: -574.59, y: -935.85, z: 32.52}},
        { text: "Гардеробная", fraction: 5, doors: [{ hash: 1901183774, x: -575.70, y: -926.10, z: 32.69 } ], pos: { x: -576.65, y: -926.26, z: 32.52}},


        //Mafia

        //UM
        { text: "Главный вход", fraction: 24, doors: [{ hash: 1033441082, x: -1515.80, y: 850.72, z: 181.72 },{ hash: 1033441082, x: -1518.03, y: 851.55, z: 181.72 }], pos: { x: -1516.90, y: 851.30, z: 181.59}, defaultOpened: true},
        { text: "Правая входная дверь", fraction: 24, doors: [{ hash: 1033441082, x: -1520.77, y: 848.33, z: 181.72 }], pos: { x: -1520.14, y: 848.61, z: 181.60}, defaultOpened: true},
        { text: "Левая входная дверь", fraction: 24, doors: [{ hash: 1033441082, x: -1500.63, y: 856.68, z: 181.72 }], pos: { x: -1501.27, y: 856.46, z: 181.60}, defaultOpened: true},
        { text: "Задний вход", fraction: 24, doors: [{ hash: 1033441082, x: -1490.46, y: 851.03, z: 181.72 },{ hash: 1033441082, x: -1491.46, y: 853.18, z: 181.72 }], pos: { x: -1491.04, y: 852.21, z: 181.60}, defaultOpened: true},
        { text: "Служебное помещение", fraction: 24, doors: [{ hash: -1785293089, x: -1511.60, y: 844.05, z: 181.70 },{ hash: -1785293089, x: -1510.60, y: 841.90, z: 181.70 }], pos: { x: -1511.13, y: 843.00, z: 181.60}, defaultOpened: true},
        { text: "Кабинет директора", fraction: 24, doors: [{ hash: -1785293089, x: -1520.32, y: 833.40, z: 186.28 }], pos: { x: -1520.03, y: 832.70, z: 186.15}, defaultOpened: true},
        { text: "Выход на балкон", fraction: 24, doors: [{ hash: 1033441082, x: -1522.39, y: 843.54, z: 186.28 }], pos: { x: -1521.79, y: 843.83, z: 186.15}, defaultOpened: true},

        // RM
        { text: "Двор", fraction: 8, doors: [{ hash: -462653789, x: -1346.44, y: 57.45, z: 55.69 },{ hash: -462653789, x: -1346.61, y: 59.33, z: 55.69 }], pos: { x: -1346.34, y: 58.40, z: 55.25}, defaultOpened: true},
        { text: "Основной вход", fraction: 8, doors: [{ hash: -462653789, x: -1365.66, y: 57.70, z: 54.44 },{ hash: -462653789, x: -1365.49, y: 55.82, z: 54.44 }], pos: { x: -1365.49, y: 56.75, z: 54.13}, defaultOpened: true},
        { text: "Подвал", fraction: 8, doors: [{ hash: -1687047623, x: -1358.03, y: 90.57, z: 55.40 }], pos: { x: -1358.76, y: 90.47, z: 55.25}, defaultOpened: true},
        { text: "Кабинет директора", fraction: 8, doors: [{ hash: -1687047623, x: -1349.91, y: 59.18, z: 60.52 }], pos: { x: -1350.16, y: 59.90, z: 60.41}, defaultOpened: true},
        { text: "Гардеробная", fraction: 8, doors: [{ hash: -1687047623, x: -1351.09, y: 61.97, z: 60.52 }], pos: { x: -1351.79, y: 61.67, z: 60.41}, defaultOpened: true},
        { text: "Оружейная", fraction: 8, doors: [{ hash: -1687047623, x: -1359.27, y: 61.23, z: 60.53 }], pos: { x: -1359.79, y: 60.90, z: 60.41}, defaultOpened: true},

        //LCN
        { text: "Погреб", fraction: 9, doors: [{ hash: 1033441082, x: -1929.55, y: 2059.38, z: 140.97 }], pos: { x: -1928.90, y: 2059.12, z: 140.84}, defaultOpened: true},
        { text: "Левый вход", fraction: 9, doors: [{ hash: 1662086909, x: -1890.26, y: 2052.15, z: 141.29 },{ hash: 1662086909, x: -1887.94, y: 2051.30, z: 141.29 }], pos: { x: -1888.98, y: 2051.75, z: 141.02}, defaultOpened: true},
        { text: "Правый вход", fraction: 9, doors: [{ hash: 1662086909, x: -1887.56, y: 2051.16, z: 141.29 },{ hash: 1662086909, x: -1885.24, y: 2050.31, z: 141.29 }], pos: { x: -1886.49, y: 2050.75, z: 141.01}, defaultOpened: true},
        { text: "Задний выход", fraction: 9, doors: [{ hash: -245429350, x: -1879.33, y: 2071.39, z: 141.28 },{ hash: -245429350, x: -1879.33, y: 2071.39, z: 141.28 }], pos: { x: -1880.32, y: 2071.58, z: 141.00}, defaultOpened: true},
        { text: "Правый выход", fraction: 9, doors: [{ hash: 1662086909, x: -1861.76, y: 2054.07, z: 141.29 },{ hash: 1662086909, x: -1859.29, y: 2054.07, z: 141.29 }], pos: { x: -1860.61, y: 2054.00, z: 141.01}, defaultOpened: true},
        { text: "Кухня", fraction: 9, doors: [{ hash: -1687047623, x: -1876.10, y: 2057.71, z: 141.11 }], pos: { x: -1875.88, y: 2058.39, z: 140.99}, defaultOpened: true},
        { text: "Балкон", fraction: 9, doors: [{ hash: -1687047623, x: -1890.48, y: 2068.24, z: 145.66 }], pos: { x: -1890.77, y: 2067.60, z: 145.51}, defaultOpened: true},
        { text: "Кабинет директора", fraction: 9, doors: [{ hash: -1687047623, x: -1883.43, y: 2055.98, z: 145.66 }], pos: { x: -1884.12, y: 2056.17, z: 145.51}, defaultOpened: true},
        { text: "Гардеробная", fraction: 9, doors: [{ hash: -1687047623, x: -1882.05, y: 2057.23, z: 145.57 }], pos: { x: -1882.28, y: 2056.56, z: 145.51}, defaultOpened: true},
        { text: "Оружейная", fraction: 9, doors: [{ hash: 747539127, x: -1881.00, y: 2060.67, z: 144.51 }], pos: { x: -1881.13, y: 2060.27, z: 145.51}, defaultOpened: true},
        // { text: "Подвал", fraction: 9, doors: [{ hash: -1572669922, x: -1932.84, y: 2050.66, z: 139.82 }], pos: { x: -1933.00, y: 2049.92, z: 140.82}},

        //yakuza
        { text: "Главный вход", fraction: 23, doors: [{ hash: 1039647283, x: -336.10, y: 206.45, z: 89.45 },{ hash: 1039647283, x: -338.51, y: 207.43, z: 89.45 }], pos: { x: -337.41, y: 206.96, z: 88.58}, defaultOpened: true},
        { text: "Задний выход", fraction: 23, doors: [{ hash: 866758039, x: -349.39, y: 179.50, z: 88.10 },{ hash: 866758039, x: -347.24, y: 179.50, z: 88.10 }], pos: { x: -348.29, y: 179.52, z: 87.94}, defaultOpened: true},
        { text: "Вход в подвал", fraction: 23, doors: [{ hash: -1687047623, x: -335.20, y: 188.34, z: 88.71 }], pos: { x: -335.94, y: 188.30, z: 88.57}, defaultOpened: true},
        { text: "Кухня", fraction: 23, doors: [{ hash: -121180812, x: -348.75, y: 194.10, z: 88.72 }], pos: { x: -348.71, y: 193.56, z: 88.57}, defaultOpened: true},
        { text: "Кабинет директора", fraction: 23, doors: [{ hash: -121180812, x: -344.98, y: 190.35, z: 95.34 }], pos: { x: -344.89, y: 190.99, z: 95.19}, defaultOpened: true},
        { text: "Оружейная", fraction: 23, doors: [{ hash: -121180812, x: -351.94, y: 191.08, z: 95.34 }], pos: { x: -351.98, y: 190.52, z: 95.19}, defaultOpened: true},
        { text: "Служебный вход", fraction: 23, doors: [{ hash: -121180812, x: -347.58, y: 195.83, z: 95.34 }], pos: { x: -348.14, y: 195.81, z: 95.19}, defaultOpened: true},

        //GANG
        //Ballas
        // { text: "Вход в гараж", fraction: 18, doors: [{ hash: 539180131, x: 105.85, y: -1964.97, z: 20.90 }], pos: { x: 105.95, y: -1964.31, z: 20.88}, defaultOpened: true},
        // { text: "Вход на лестницу", fraction: 18, doors: [{ hash: -1835483074, x: 103.42, y: -1963.44, z: 19.87 }], pos: { x: 104.10, y: -1963.53, z: 20.87}, defaultOpened: true},
        // { text: "Оружейная", fraction: 18, doors: [{ hash: -710818483, x: 89.24, y: -1958.20, z: 15.40 }], pos: { x: 88.47, y: -1958.03, z: 15.26}, defaultOpened: true},
        // { text: "Лабораторная", fraction: 18, doors: [{ hash: -710818483, x: 88.89, y: -1962.10, z: 15.41 }], pos: { x: 88.17, y: -1962.09, z: 15.26}, defaultOpened: true}
        //  { text: "Вход", fraction: 19, doors: [{ hash: 2370261621, x: 101.4777, y: -20.87931, z: 20.88 }], pos: { x: 100.96, y: -1964.26, z: 20.87}, defaultOpened: true},
        //{ text: "Вход", fraction: 21, doors: [{ hash: 2120064279, x: -1721.458, y: -20.87931, z: 17.6739}], pos: { x: -492.15, y: -1720.93, z: 18.67}, defaultOpened: true},
        // { text: "Вход", fraction: 20, doors: [{ hash: 3630385052, x: 496.3792, y:  -1341.297, z: 29.52036}], pos: { x: 495.79, y: -1341.13, z: 29.36}, defaultOpened: true},
        //  { text: "Вход", fraction: 21, doors: [{ hash: 3584148813, x: 848.4344, y:  -2204.545, z: 30.42788}], pos: { x: 848.05, y: -2203.66, z: 30.28}, defaultOpened: true},

        //Bloods
          { text: "Вход", fraction: 21, doors: [{ hash: -35610440, x: -470.44, y: -1722.93, z: 18.91}], pos: { x: -470.56, y: -1722.24, z: 18.77}, defaultOpened: true},
          { text: "Вход 2", fraction: 21, doors: [{ hash: -35610440, x: -484.22, y: -1729.65, z: 19.82}], pos: { x: -485.08, y: -1729.69, z: 19.67}, defaultOpened: true},
          { text: "Мастерская", fraction: 21, doors: [{ hash: -35610440, x: -483.51, y: -1728.13, z: 19.68}], pos: { x: -483.93, y: -1727.58, z: 19.51}, defaultOpened: true},
          { text: "Склад", fraction: 21, doors: [{ hash: -35610440, x: -485.73, y: -1719.85, z: 19.72}], pos: { x: -485.43, y: -1720.60, z: 19.57}, defaultOpened: true},
          { text: "Вход", fraction: 21, doors: [{ hash: 1093926891, x:-1387.088, y:-586.5935, z:30.45739},{ hash: 1093926891, x:-1389.197, y:-587.9832, z:30.45739} ], pos: { x: -1388.32, y: -587.02, z: 30.22}, defaultOpened: true},

          // Ballas
          { text: "Вход", fraction: 18, doors: [{ hash: 4259356856, x: 893.1168, y: -2171.419, z: 32.54395}], pos: { x: 892.44, y: -2171.44, z: 32.39}, defaultOpened: true},
          { text: "Склад", fraction: 18, doors: [{ hash: 4259356856, x:884.3304, y:-2163.563, z:32.4353}], pos: { x: 884.35, y: -2162.83, z: 32.28}, defaultOpened: true},
          

          // Marabunta
          { text: "Склад", fraction: 20, doors: [{ hash: 1173348778, x:452.0893, y:-1305.413, z:30.35599}], pos: { x: 452.88, y: -1305.54, z: 30.12}, defaultOpened: true},

          // Vagos
          { text: "Вход 1", fraction: 22, doors: [{ hash: 2374820049, x:500.0611, y:-1962.585, z:25.16408}], pos: { x: 500.88, y: -1962.96, z: 25.06}, defaultOpened: true},
          { text: "Вход 2", fraction: 22, doors: [{ hash: 2374820049, x:502.4556, y:-1966.44, z:25.16417}], pos: { x: 502.17, y: -1965.70, z: 25.06}, defaultOpened: true},

          // LSPD New
          { text: "Лестничная площадка 1", fraction: 2, doors: [{ hash: 2974090917, x:471.3868, y:-986.3861, z:28.23847 }, {hash: 2974090917, x:468.783,  y:-986.3882, z:28.23847}], pos: { x: 470.08, y: -985.97, z: 28.09}, defaultOpened: true},
          { text: "Лестничная площадка 2", fraction: 2, doors: [{ hash: 4163671155, x:468.7839, y:-993.9683, z:28.23798 }, {hash: 4163671155, x:471.3859,  y:-993.9683, z:28.23798}], pos: { x: 469.98, y: -994.12, z: 28.09}, defaultOpened: true},
          { text: "Офис 1", fraction: 2, doors: [{ hash: 2372686273, x:452.8327, y:-988.2734, z:35.95989 }, {hash: 2372686273, x:452.8327,  y:-990.3912, z:35.95989}], pos: { x: 452.73, y: -989.31, z: 35.68}, defaultOpened: true},
          { text: "Офис 2", fraction: 2, doors: [{ hash: 2974090917, x:459.9573, y:-991.5281, z:35.83414 }, {hash: 2974090917, x:459.9565,  y:-988.9236, z:35.83414}], pos: { x: 459.95, y: -990.31, z: 35.68}, defaultOpened: true},
          { text: "Лестничная площадка 3", fraction: 2, doors: [{ hash: 2974090917, x:459.9573, y:-991.5283, z:30.83918 }, {hash: 2974090917, x:459.9573,  y:-988.9244, z:30.83918}], pos: { x: 460.03, y: -990.11, z: 30.69}, defaultOpened: true},
          { text: "Лестничная площадка 4", fraction: 2, doors: [{ hash: 4163671155, x:462.2406, y:-988.9244, z:25.86339 }, {hash: 4163671155, x:462.2434,  y:-991.5268, z:25.86339}], pos: {  x: 462.09, y: -990.23, z: 25.71}, defaultOpened: true},
          { text: "Лестничная площадка 5", fraction: 2, doors: [{ hash: 4163671155, x:468.7828, y:-986.3874, z:23.46275 }, {hash: 4163671155, x:471.3876,  y:-986.3874, z:23.46275}], pos: {  x: 470.33, y: -986.36, z: 23.31}, defaultOpened: true},
          { text: "Лестничная площадка 6", fraction: 2, doors: [{ hash: 4163671155, x:471.3864, y:-993.9685, z:23.46061 }, {hash: 4163671155, x:468.7833,  y:-993.9685, z:23.46061}], pos: {  x: 470.03, y: -993.29, z: 23.31}, defaultOpened: true},
          { text: "Вход к камерам", fraction: 2, doors: [{ hash: 2233064549, x:470.7346, y:-977.412, z:23.4634}], pos: { x: 469.99, y: -977.68, z: 23.31}, defaultOpened: true},
          { text: "Камера 1", fraction: 2, doors: [{ hash: 2233064549, x:473.623, y:-972.9127, z:23.4634}], pos: { x: 473.12, y: -972.38, z: 23.31}, defaultOpened: true},
          { text: "Камера 2", fraction: 2, doors: [{ hash: 2233064549, x:473.6221, y:-966.6074, z:23.4634}], pos: { x: 472.95, y: -966.00, z: 23.31}, defaultOpened: true},
          { text: "Камера 3", fraction: 2, doors: [{ hash: 2233064549, x:473.621, y:-960.3025, z:23.4634}], pos: { x: 472.99, y: -959.90, z: 23.31}, defaultOpened: true},
          { text: "Камера 4", fraction: 2, doors: [{ hash: 2233064549, x:467.468, y:-959.3839, z:23.4634}], pos: { x: 467.35, y: -959.97, z: 23.31}, defaultOpened: true},
          { text: "Камера 5", fraction: 2, doors: [{ hash: 2233064549, x:467.4684, y:-965.69, z:23.4634}], pos: { x: 467.30, y: -966.31, z: 23.31}, defaultOpened: true},
          { text: "Камера 6", fraction: 2, doors: [{ hash: 2233064549, x:467.4698, y:-971.9943, z:23.4634}], pos: { x: 467.37, y: -972.56, z: 23.31}, defaultOpened: true},

        
        
        
        
         //ems
        { text: "Лаборатория 1", fraction: 16, doors: [{ hash: 1415151278, x:298.2036, y:-592.9224, z:43.40875}], pos: { x: 298.74, y: -593.34, z: 43.26}, defaultOpened: true},
        { text: "Лаборатория 2", fraction: 16, doors: [{ hash: 1415151278, x:298.2036, y:-592.9224, z:43.40875}], pos: { x: 305.23, y: -595.27, z: 43.26}, defaultOpened: true},
        { text: "Лаборатория 3", fraction: 16, doors: [{ hash: 1415151278, x:304.5355, y:-595.2271, z:43.40875}], pos: { x: 311.80, y: -597.61, z: 43.26}, defaultOpened: true},
        { text: "Ресепшн", fraction: 16, doors: [{ hash: 1415151278, x:313.0905, y:-588.9059, z:43.40875},{ hash: 1415151278, x:313.9705, y:-586.4881, z:43.40875}], pos: { x: 313.61, y: -587.66, z: 43.26}, defaultOpened: true},

          //LCN
        // { text: "Вход 1", fraction: 25, doors: [{ hash: 4242392117, x:1409.292, y:1146.254, z:114.4869 }, {hash: 4242392117, x:1409.292,  y:1148.454, z:114.4869}], pos: { x: 1409.24, y: 1145.19, z: 114.33}, defaultOpened: true},
        // { text: "Вход 2", fraction: 25, doors: [ {hash: 4242392117, x:1409.292 ,  y:1146.254, z:114.4869}, { hash: 4242392117, x:1409.292, y:1144.054, z:114.4869 }], pos: { x: 1409.12, y: 1147.64, z: 114.33}, defaultOpened: true},
        // { text: "Вход 3", fraction: 25, doors: [{ hash: 4242392117, x:1409.292, y:1148.454, z:114.4869 }, {hash: 4242392117, x:1409.292  ,  y:1150.654, z:114.4869}], pos: { x: 1409.16, y: 1149.70, z: 114.33}, defaultOpened: true},
        // { text: "Вход 4", fraction: 25, doors: [{ hash: 4242392117, x:1408.58, y:1158.967, z:114.4827 }, {hash: 4242392117, x:1408.58  ,  y:1161.168, z:114.4827}], pos: { x: 1408.61, y: 1159.82, z: 114.33}, defaultOpened: true},
        // { text: "Вход 5", fraction: 25, doors: [{ hash: 4242392117, x:1408.578, y:1165.833, z:114.4827 }, {hash: 4242392117, x:1408.578  ,  y:1163.632, z:114.4827}], pos: { x: 1408.72, y: 1164.85, z: 114.33}, defaultOpened: true},
        // { text: "Вход 6", fraction: 25, doors: [{ hash: 2567541138, x:1395.906, y:1142.904, z:114.7907 }, {hash: 2567541138, x:1395.906  ,  y:1140.705, z:114.4827}], pos: { x: 1395.49, y: 1141.79, z: 114.64}, defaultOpened: true},
        // { text: "Вход 7", fraction: 25, doors: [{ hash: 4242392117, x:1390.666, y:1131.117, z:114.4808 }, {hash: 4242392117, x:1390.666  ,  y:1133.317, z:114.4808}], pos: { x: 1390.40, y: 1132.13, z: 114.33}, defaultOpened: true},
        { text: "Вход 8", fraction: 25, doors: [{ hash: 3262795659, x:1390.488, y:1161.237, z:114.4817 }, {hash: 3262795659, x:1390.488  ,  y:1163.438, z:114.4817}], pos: { x: 1390.18, y: 1162.36, z: 114.33}, defaultOpened: true},
        { text: "Подвал", fraction: 25, doors: [{ hash: 736699661, x:1407.688, y:1128.333, z:114.4977}], pos: { x: 1406.82, y: 1127.87, z: 114.33}, defaultOpened: true},

    // Jail
    { text: "Проходная", fraction: 7, doors: [{ hash: 1716321923, x: 1691.49, y: 2577.84, z: 45.68}], pos: { x: 1691.49, y: 2577.84, z: 45.68}, defaultOpened: false},
    { text: "Проходная Офис-1", fraction: 7, doors: [{ hash: 1716321923, x: 1688.72, y: 2571.60, z: 45.68}], pos: { x: 1689.24, y: 2571.32, z: 45.68}, defaultOpened: false},
    { text: "Проходная Офис-2", fraction: 7, doors: [{ hash: 1716321923, x: 1693.94, y: 2571.60, z: 45.68}], pos: { x: 1693.49, y: 2571.36, z: 45.68}, defaultOpened: false},
    { text: "Вход", fraction: 7, doors: [{ hash: 1716321923, x:1670.523, y:2467.454, z:46.13116}], pos: { x: 1670.90, y: 2466.70, z: 45.98}, defaultOpened: true},
    { text: "Камера 622", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2460.736, z:46.12994}], pos: { x: 1671.05, y: 2459.56, z: 45.98}, defaultOpened: true},
    { text: "Камера 620", fraction: 7, doors: [{ hash: 1716321923, x: 1670.69, y: 2455.92, z: 50.00}], pos: { x: 1671.18, y: 2455.69, z: 50.00}, defaultOpened: true},
    { text: "Камера 621", fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2457.011, z:50.14636}], pos: { x: 1671.03, y: 2459.53, z: 50.00}, defaultOpened: true},
    //{ text: "Камера 4", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2457.012, z:46.12994}], pos: { x: 1670.38, y: 2456.13, z: 45.98}, defaultOpened: false},
    { text: "Камера 623", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2457.012, z:46.12994}], pos: { x: 1671.00, y: 2455.85, z: 45.98}, defaultOpened: true},
    { text: "Камера 619", fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2453.287, z:50.14636}], pos: { x: 1670.41, y: 2452.49, z: 50.00}, defaultOpened: true},
    { text: "Камера 624", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2453.286, z:46.12994}], pos: { x: 1671.03, y: 2452.10, z: 45.98}, defaultOpened: true},
    { text: "Камера 618", fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2449.561, z:50.14636}], pos: { x: 1671.04, y: 2448.33, z: 50.00}, defaultOpened: true},
    { text: "Камера 625", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2449.561, z:46.12994}], pos: { x: 1671.02, y: 2448.39, z: 45.98}, defaultOpened: true},
    { text: "Камера 617", fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2445.841, z:50.14636}], pos: { x: 1671.01, y: 2444.64, z: 50.00}, defaultOpened: true},
    { text: "Камера 626", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2445.839, z:46.12994}], pos: { x: 1670.99, y: 2444.73, z: 45.98}, defaultOpened: true},
    { text: "Камера 616", fraction: 7, doors: [{ hash: 1716321923, x:1675.566, y:2440.924, z:50.14619}], pos: { x: 1674.42, y: 2441.24, z: 50.00}, defaultOpened: true},
    { text: "Камера 627", fraction: 7, doors: [{ hash: 1716321923, x:1675.565, y:2440.925, z:46.13091}], pos: { x: 1674.37, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: "Камера 615", fraction: 7, doors: [{ hash: 1716321923, x:1679.081, y:2440.924, z:50.14619}], pos: { x: 1677.89, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: "Камера 628", fraction: 7, doors: [{ hash: 1716321923, x:1679.082, y:2440.925, z:46.13091}], pos: { x: 1677.95, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: "Камера 614", fraction: 7, doors: [{ hash: 1716321923, x:1682.625, y:2440.924, z:50.14619}], pos: { x: 1681.53, y: 2441.27, z: 50.00}, defaultOpened: true},
    { text: "Камера 629", fraction: 7, doors: [{ hash: 1716321923, x:1682.62, y:2440.925, z:46.13091}], pos: { x: 1681.44, y: 2441.27, z: 45.98}, defaultOpened: true},
    { text: "Камера 630", fraction: 7, doors: [{ hash: 1716321923, x:1686.345, y:2440.925, z:46.13091}], pos: { x: 1685.18, y: 2441.26, z: 45.98}, defaultOpened: true},
    { text: "Камера 613", fraction: 7, doors: [{ hash: 1716321923, x:1686.345, y:2440.924, z:50.14619}], pos: { x: 1685.17, y: 2441.25, z: 50.00}, defaultOpened: true},
    { text: "Камера 612", fraction: 7, doors: [{ hash: 1716321923, x:1690.071, y:2440.924, z:50.14619}], pos: { x: 1688.87, y: 2441.28, z: 50.00}, defaultOpened: true},
    { text: "Камера 631", fraction: 7, doors: [{ hash: 1716321923, x:1690.071, y:2440.924, z:46.13091}], pos: { x: 1688.86, y: 2441.26, z: 45.98}, defaultOpened: true},
    { text: "Камера 632", fraction: 7, doors: [{ hash: 1716321923, x:1693.796, y:2440.924, z:46.13091}], pos: { x: 1692.70, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: "Камера 611", fraction: 7, doors: [{ hash: 1716321923, x:1693.796, y:2440.925, z:50.14619}], pos: { x: 1692.69, y: 2441.27, z: 50.00}, defaultOpened: true},
    { text: "Камера 610", fraction: 7, doors: [{ hash: 1716321923, x:1697.52, y:2440.925, z:50.14619}], pos: { x: 1696.42, y: 2441.25, z: 50.00}, defaultOpened: true},
    { text: "Камера 633", fraction: 7, doors: [{ hash: 1716321923, x:1697.52, y:2440.925, z:46.13091}], pos: { x: 1696.44, y: 2441.27, z: 45.98}, defaultOpened: true},
    { text: "Камера 609", fraction: 7, doors: [{ hash: 1716321923, x:1701.245, y:2440.925, z:50.14619}], pos: { x: 1700.11, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: "Камера 634", fraction: 7, doors: [{ hash: 1716321923, x:1701.245, y:2440.925, z:46.13091}], pos: { x: 1700.07, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: "Камера 608", fraction: 7, doors: [{ hash: 1716321923, x:1704.971, y:2440.924, z:50.14619}], pos: { x: 1703.89, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: "Камера 635", fraction: 7, doors: [{ hash: 1716321923, x:1704.971, y:2440.924, z:46.13091}], pos: { x: 1703.77, y: 2441.28, z: 45.98}, defaultOpened: true},
    { text: "Камера 607", fraction: 7, doors: [{ hash: 1716321923, x:1708.694, y:2440.924, z:50.14619}], pos: { x: 1707.58, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: "Камера 636", fraction: 7, doors: [{ hash: 1716321923, x:1708.694, y:2440.924, z:46.13091}], pos: { x: 1707.51, y: 2441.32, z: 45.98}, defaultOpened: true},
    { text: "Камера 606", fraction: 7, doors: [{ hash: 1716321923, x:1712.421, y:2440.924, z:50.14619}], pos: { x: 1711.26, y: 2441.24, z: 50.00}, defaultOpened: true},
    { text: "Камера 637", fraction: 7, doors: [{ hash: 1716321923, x:1712.421, y:2440.924, z:46.13091}], pos: { x: 1711.29, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: "Камера 605", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2445.84, z:50.14321}], pos: { x: 1714.75, y: 2444.74, z: 50.00}, defaultOpened: true},
    { text: "Камера 638", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2445.84, z:46.12989}], pos: { x: 1714.76, y: 2444.62, z: 45.98}, defaultOpened: true},
    { text: "Камера 604", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2449.561, z:50.14321}], pos: { x: 1714.77, y: 2448.39, z: 50.00}, defaultOpened: true},
    //{ text: "Камера 37", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2449.561, z:46.12989}], pos: { x: 1715.23, y: 2448.81, z: 45.98}, defaultOpened: false},
    { text: "Камера 639", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2449.561, z:46.12989}], pos: { x: 1714.78, y: 2448.38, z: 45.98}, defaultOpened: true},
    { text: "Камера 603", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2453.287, z:50.14321}], pos: { x: 1714.78, y: 2452.08, z: 50.00}, defaultOpened: true},
    { text: "Камера 640", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2453.287, z:46.12989}], pos: { x: 1714.78, y: 2452.12, z: 45.98}, defaultOpened: true},
    { text: "Камера 602", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2457.012, z:50.14321}], pos: { x: 1714.75, y: 2455.87, z: 50.00}, defaultOpened: true},
    { text: "Камера 641", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2457.012, z:46.12989}], pos: { x: 1714.74, y: 2455.81, z: 45.98}, defaultOpened: true},
    { text: "Камера 601", fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2460.737, z:50.14321}], pos: { x: 1714.77, y: 2459.61, z: 50.00}, defaultOpened: true},
    { text: "Камера 642", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2460.735, z:46.12989}], pos: { x: 1714.78, y: 2459.64, z: 45.98}, defaultOpened: true},
    { text: "Вход", fraction: 7, doors: [{ hash: 1716321923, x:1715.256, y:2466.154, z:46.13197}], pos: { x: 1715.04, y: 2467.00, z: 45.98}, defaultOpened: true},
    { text: "Склад", fraction: 7, doors: [{ hash: 1716321923, x:1670.906, y:2481.484, z:46.12421}], pos: { x: 1670.18, y: 2481.15, z: 45.98}, defaultOpened: true},
    { text: "Вход в блок 1", fraction: 7, doors: [{ hash: 3256632098, x:1703.325, y:2475.592, z:46.12902}], pos: { x: 1703.80, y: 2476.14, z: 45.98}, defaultOpened: true},
    { text: "Вход в блок 2", fraction: 7, doors: [{ hash: 3256632098, x:1681.741, y:2476.279, z:46.13059}], pos: { x: 1682.31, y: 2475.92, z: 45.95}, defaultOpened: true},
    { text: "Кабинет 1", fraction: 7, doors: [{ hash: 4165413875, x:1707.291, y:2474.066, z:46.13017}], pos: { x: 1706.57, y: 2474.29, z: 45.98}, defaultOpened: false},
    { text: "Наблюдательный пункт 1", fraction: 7, doors: [{ hash: 4165413875, x:1699.737, y:2468.822, z:46.1289}], pos: { x: 1698.75, y: 2469.00, z: 45.98}, defaultOpened: false},
    { text: "Наблюдательный пункт 2", fraction: 7, doors: [{ hash: 4165413875, x:1687.397, y:2468.821, z:46.12875}], pos: { x: 1686.60, y: 2469.00, z: 45.98}, defaultOpened: false},
    { text: "Наблюдательный пункт 3", fraction: 7, doors: [{ hash: 4165413875, x:1679.846, y:2473.969, z:46.131}], pos: { x: 1678.83, y: 2473.84, z: 45.98}, defaultOpened: false},
    { text: "Коридор", fraction: 7, doors: [{ hash: 4165413875, x:1667.854, y:2476.09, z:46.12963}], pos: { x: 1667.06, y: 2475.86, z: 45.98}, defaultOpened: true},
    { text: "Лестница 1", fraction: 7, doors: [{ hash: 4165413875, x:1691.794, y:2457.103, z:50.14656}], pos: { x: 1691.89, y: 2457.92, z: 50.00}, defaultOpened: true},
    { text: "Лестница 2", fraction: 7, doors: [{ hash: 4165413875, x:1693.499, y:2457.103, z:50.14393}], pos: { x: 1693.37, y: 2457.87, z: 50.00}, defaultOpened: true},
    { text: "Коридор", fraction: 7, doors: [{ hash: 1716321923, x:1775.296, y:2510.252, z:46.11236}], pos: { x: 1775.22, y: 2511.17, z: 45.96}, defaultOpened: true},
    { text: "Коридор", fraction: 7, doors: [{ hash: 1716321923, x:1735.905, y:2489.012, z:46.11648}], pos: { x: 1736.34, y: 2488.18, z: 45.96}, defaultOpened: true},
    { text: "Вход в блок 3", fraction: 7, doors: [{ hash: 3256632098, x:1741.226, y:2502.28, z:46.11132}], pos: { x: 1742.06, y: 2502.32, z: 45.81}, defaultOpened: true},
    { text: "Вход в блок 4", fraction: 7, doors: [{ hash: 3256632098, x:1760.222, y:2512.462, z:46.11219}], pos: { x: 1760.75, y: 2513.03, z: 45.961}, defaultOpened: true},
    { text: "Больничка 1", fraction: 7, doors: [{ hash: 1716321923, x:1652.437, y:2482.25, z:46.1146}], pos: { x: 1651.52, y: 2482.68, z: 45.97}, defaultOpened: true},
    { text: "Больничка 2", fraction: 7, doors: [{ hash: 1716321923, x:1649.779, y:2484.48, z:46.1146}], pos: { x: 1649.01, y: 2485.12, z: 45.97}, defaultOpened: true},
    { text: "Вход в столовую 1", fraction: 7, doors: [{ hash: 1716321923, x:1641.461, y:2475.016, z:46.12078}], pos: { x: 1640.75, y: 2474.66, z: 45.97}, defaultOpened: true},
    { text: "Больничка 3", fraction: 7, doors: [{ hash: 1716321923, x:1616.702, y:2512.111, z:46.12175}], pos: { x: 1616.17, y: 2512.72, z: 45.97}, defaultOpened: true},
    { text: "Больничка 4", fraction: 7, doors: [{ hash: 1716321923, x:1614.043, y:2514.342, z:46.12175}], pos: { x: 1613.63, y: 2515.07, z: 45.97}, defaultOpened: true},
]