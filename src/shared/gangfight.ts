export const GANGFIGHT_POS: {
    x: number,
    y: number,
    z: number,
    h: number,
    d: number,
    /** Название */
    name: string,
    /** Сколько минут будет открыватся контейнер */
    timer: number,
    /** Через сколько времени после открытия контейнер будет уничтожен*/
    destroyTime: number,
    /** В какие часы система будет запускатся */
    startHours?: number[],
    /** Какие предметы будут выпадать из коробки */
    items: {
        /** ID предмета */
        item_id: number,
        /** Количество предмета */
        amount: number,
        /** Параметр количества у предмета (если требуется, если не указать - то будет использоватся параметр предмета по умолчанию) */
        count?:number,
        /** Шанс выпадения предмета (параметр относительно других предметов) */
        chance: number,
    }[],
    /** Сколько предметов будет выпадать (количество) */
    itemsCount: number,
    /** Какие фракции участвуют в мероприятии */
    factions: number[],
    bliptype: number,
    blipcolor: number,
    /** С какого уровня можно запустить мероприятие вручную администратором */
    adminRun: number,
}[] = [

    // Gang
    {x: 2339.79, y: 5564.36, z: 39.44, h: 264, d:0, name: "Борьба за груз для банд", timer: 1, destroyTime: 3, startHours: [12], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        {item_id: 854, amount: 1, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ],  itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },
     
     {x: 1271.52, y: 3125.04, z: 40.44, h: 101, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [14], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -1134.56, y: 4924.43, z: 219.88, h: 254, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [16], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 1675.79, y: -62.17, z: 173.78, h: 217, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [18], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        {item_id: 854, amount: 1, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 299.44, y: -3213.81, z: 5.76, h: 355, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [20], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -1924.89, y: -2994.55, z: 13.94, h: 8, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [22], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 1715.68, y: -1649.67, z: 112.53, h: 191, d:0, name: "Борьба за груз для банд", timer: 15, destroyTime: 3, startHours: [0], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 },





    //MAFIA
    {x: 3693.79, y: 3804.37, z: 13.01, h: 163, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [13], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -2204.13, y: 4588.68, z: 2.07, h: 228, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [15], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -2247.51, y: 262.53, z: 174.62, h: 119, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [17], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },
    

    {x: -903.62, y: -1531.13, z: 5.02, h: 108, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [19], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },
    

    {x: 294.46, y: 4305.68, z: 45.69, h: 4, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [21], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },
    

    {x: 794.22, y: 1274.40, z: 360.30, h: 294, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [23], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 54, amount: 10, chance: 5},

    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },
    

    {x: 794.22, y: 1274.40, z: 360.30, h: 294, d:0, name: "Борьба за груз для мафий", timer: 15, destroyTime: 3, startHours: [1], items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 804, amount: 10, chance: 50},
        { item_id: 857, amount: 5, chance: 2},
        { item_id: 858, amount: 5, chance: 2},
        { item_id: 859, amount: 5, chance: 2},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 7, factions: [8,9,10,11], bliptype: 550, blipcolor: 0, adminRun: 5 },


    // ALL
    
    {x: 20.79, y: -1735.82, z: 29.30, h: 328, d:0, name: "Борьба за груз для крайма", timer: 15, destroyTime: 3, items: [
        { item_id: 511, amount: 4, chance: 45},
        { item_id: 529, amount: 3, chance: 45},
        { item_id: 910, amount: 5, chance: 15},
        { item_id: 799, amount: 10, chance: 50},
        { item_id: 872, amount: 2, chance: 5},
        { item_id: 873, amount: 2, chance: 5},
        { item_id: 874, amount: 2, chance: 5},
        { item_id: 875, amount: 2, chance: 5},
        { item_id: 876, amount: 2, chance: 5},
        { item_id: 877, amount: 2, chance: 5},
        { item_id: 878, amount: 2, chance: 5},
        { item_id: 54, amount: 10, chance: 5},
    ], itemsCount: 20, factions: [18,19,20,21,22], bliptype: 550, blipcolor: 0, adminRun: 5 }

    

];

export const GANGFIGHT_MODEL = 'prop_box_ammo03a_set2'