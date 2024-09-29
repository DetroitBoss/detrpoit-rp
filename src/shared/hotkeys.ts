export const defaultHotkeys = {
    invopen: 9,
    mmenu: 77,
    cursor: 192,
    voice: 78,
    radio: 96,
    lockveh: 76,
    engineveh: 66,
    hidehud: 120,
    stopanim: 121,
    anim: 57,
    gpress: 71,
    seatbelt: 88,
    vreload: 118,


    flashlight: 74,

    radarEnable: 104,
    // radarFreeze: 101,


    invslot1: 49,
    invslot2: 50,
    invslot3: 51,
    invslot4: 52,
    invslot5: 53,
    
    phoneSlot: 38,
    tabletSlot: 40,

    ten0: 96,
    megaphone: 191,
    report: 117,

    toggleChat: 116,
    
    cuff: 54,
    uncuff: 55,
    follow: 90,
    
    admin: 56,
    autopilot: 79,
    snowball: 113,
    petControl: 89,
    battlePass: 115,
    duckWalk: 20
}

/** [Название, Можно редактировать, Удержание] */
export const hotkeysTasks:{
    [task:string]:[string, boolean?, boolean?];
} = {
    invopen: ["Открыть инвентарь"],
    mmenu: ["Главное меню"],
    cursor: ["Включить/Выключить курсор"],
    lockveh: ["Закрыть/Открыть ближайший ТС"],
    engineveh: ["Завести/Заглушить ТС"],
    voice: ["Голосовой чат", false, true],
    radio: ["Использовать рацию", false, true],
    hidehud: ["Скрыть/Отобразить HUD"],
    stopanim: ["Отменить анимацию"],
    anim: ["Воспроизвести анимацию"],
    gpress: ["Взаимодействие"],
    seatbelt: ["Ремень безопасности"],
    vreload: ["Перезагрузить голосовой чат"],

    flashlight: ["Фонарь на оружии"],

    radarEnable: ["Включить Скоростной радар"],
    // radarFreeze: ["Заморозить Скоростной радар"],
    
    invslot1: ["Слот быстрого доступа 1"],
    invslot2: ["Слот быстрого доступа 2"],
    invslot3: ["Слот быстрого доступа 3"],
    invslot4: ["Слот быстрого доступа 4"],
    invslot5: ["Слот быстрого доступа 5"],
    
    phoneSlot: ["Открыть/закрыть телефон"],
    tabletSlot: ["Открыть/закрыть планшет"],

    ten0: ["Отправить Код 0"],
    megaphone: ["Говорить в громкоговоритель/Мегафон"],
    report: ["Меню тикетов"],
    
    toggleChat: ["Выключить/включить чат", true],

    admin: ["Админ-меню", true],
    
    cuff: ["Надеть наручники/стяжки"],
    uncuff: ["Снять наручники/стяжки"],
    follow: ["Вести за собой"],
    autopilot: ["Включить/выключить автопилот"],
    snowball: ["Слепить снежок"],
    petControl: ["Управление питомцем"],
    battlePass: ["Battle pass"],
    duckWalk: ["Встать/присесть"]
}

interface IHotkeyCategory {
    name: string
    keys: string[]
}

export const hotkeyCategories: IHotkeyCategory[] = [
    {
        name: "Инвентарь",
        keys: ["invopen", "invslot1", "invslot2", "invslot3", "invslot4", "invslot5"]
    },
    {
        name: "Транспорт",
        keys: ["autopilot", "engineveh", "lockveh", "seatbelt"]
    },
    {
        name: "Персонаж и взаимодействие",
        keys: ["duckWalk", "gpress", "anim", "stopanim", "snowball", "petControl", "cuff", "uncuff", "follow", "flashlight", ]
    },
    {
        name: "Интерфейс",
        keys: ["report", "phoneSlot", "tabletSlot", "vreload", "hidehud", "battlePass", "toggleChat", "radio", "voice", "cursor"]
    },
    {
        name: "Админ раздел",
        keys: ["admin", "report" ]
    },
    {
        name: "Раздел полиции",
        keys: ["ten0", "megaphone", "radarEnable" ]
    }

]

export const getHotkeysName = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return cfg[0]
}

export const getHotkeysCanEdit = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return !(!!cfg[1])
}

export const getHotkeysNeedHold = (task:string) => {
    const cfg = hotkeysTasks[task];
    if(!cfg) return;
    return (!!cfg[2])
}

export const generateHotkeysButtonsArray = () => {
    let data:[number,string][] = [];
    for (let key in hotkeysAllowed){
        data.push([key as any, (hotkeysAllowed as any)[key]])
    }
    return data;
}

export const getKeyName = (key:number):string => {
    return (hotkeysAllowed as any)[key];
}

export const hotkeysAllowed = {
    8: "BackSpace",
    9: "Tab",
    // 16: "Shift",
    // 17: "Ctrl",
    18: "Alt",
    20: "CapsLock",
    33: "PageUP",
    34: "PageDown",
    35: "End",
    36: "Home",
    45: "Insert",
    46: "Delete",
    145: "Scroll Lock",
    192: "~",
    191: "/",

    37: "Стрелка влево",
    38: "Стрелка вверх",
    39: "Стрелка вправо",
    40: "Стрелка вниз",
    44: "Print Screen",

    48: "Цифра 0",
    49: "Цифра 1",
    50: "Цифра 2",
    51: "Цифра 3",
    52: "Цифра 4",
    53: "Цифра 5",
    54: "Цифра 6",
    55: "Цифра 7",
    56: "Цифра 8",
    57: "Цифра 9",

    66: "B",
    67: "C",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    84: "T",
    85: "U",
    88: "X",
    89: "Y",
    90: "Z",

    96: "NumPad 0",
    97: "NumPad 1",
    98: "NumPad 2",
    99: "NumPad 3",
    100: "NumPad 4",
    101: "NumPad 5",
    102: "NumPad 6",
    103: "NumPad 7",
    104: "NumPad 8",
    105: "NumPad 9",

    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
}