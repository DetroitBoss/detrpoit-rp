/** Список моделей ТС, на которых есть якорь */
export const ANCHOR_LIST: string[] = ["dinghy2", "dinghy", "dinghy3", "dinghy4", "toro", "suntrap", "toro2", "tropic", "tropic2", "speeder", "jetmax", "riot2", "riot", "insurgent2"];

/** Сколько минут после сдачи ТС Ламару игрок не сможет сдать вторую */
export const VEHICLE_GRAB_COOLDOWN_MINUTES = 10;

export const MOTORCYCLES_LIST: string[] = ["akuma", "avarus", "bagger", "bati", "bati2", "bf1401", "carbonrs", "chimera", "cliffhanger", "daemon", "daemon2", "defiler", "deathbike", "deathbike2", "deathbike3",
"diablous", "diablous2", "double", "enduro", "esskey", "faggio", "faggio2", "faggio3", "fcr", "fcr2", "gargoyle", "hakuchou", "hakuchou2", "hexer", "innovation", "lectro", "manchez", "nemesis", "nightblade", "oppressor", "oppressor2",
"pcj", "ratbike", "ruffian", "rrocket", "sanchez", "sanchez2", "sanctus", "shotaro", "sovereign", "stryder", "thrust", "vader", "vindicator", "vortex", "wolfsbane", "zombiea", "zombieb", "manchez2", "policeb"]

export const BIKE_LIST: string[] = ["bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3"]

export const PLANES_LIST: string[] = ["alphaz1", "avenger", "avenger2", "besra", "blimp", "blimp2", "blimp3", "bombushka", "cargoplane", "cuban1901", "dodo", "duster", "howard", "hydra", "jet", "lazer",
"luxor", "luxor2", "mammatus", "microlight", "miljet", "mogul", "molotok", "nimbus", "nokota", "pyro", "rogue", "seabreeze", "shamal", "starling", "strikeforce", "stunt", "titan", "tula", "velum", "velum2",
"vestra", "volatol", "alkonost"]

export const HELI_LIST: string[] = ["akula", "annihilator", "buzzard", "buzzard2", "cargobob", "cargobob3", "cargobob4", "frogger", "frogger2", "havok", "hunter", "maverick", "savage", "seasparrow",
"skylift", "supervolito", "supervolito2", "swift", "swift2", "valkyrie", "valkyrie2", "volatus", "annihilator2", "seasparrow2", "seasparrow3", "polmav"]

export const isAMotorcycle = (model:string) => {
    return MOTORCYCLES_LIST.includes(model)
}
export const isABike = (model:string) => {
    return BIKE_LIST.includes(model)
}
export const isAPlane = (model:string) => {
    return PLANES_LIST.includes(model)
}
export const isAHeli = (model:string) => {
    return HELI_LIST.includes(model)
}



export const fuelTypeNames = ["Электричество", "92", "95", "98", "Дизель", "Авиатопливо"]
export const commercialVehicles = ["benson", "biff", "hauler", "hauler2", "mule", "mule2", "mule3", "mule4", "packer", "phantom", "phantom3", "pounder", "pounder2", "guardian", "brutus", "bison", "bison2", "burrito3", "gburrito", "gburrito2", "pony", "speedo4", "speedo", "rumpo3", "youga", "youga2", "bobcatxl", "burrito", "burrito4", "paradise", "bison", "burrito2", "sadler", "contender", "sandking2", "sandking", "riata"]
/** Сколько минут транспорт может стоять АФК */
export const maxAfkTime = 100
/** Сколько минут транспорт может стоять АФК арендованый транспорт */
export const maxAfkRentCarTime = 10
/** Сколько минут транспорт может стоять АФК фракционный транспорт */
export const maxAfkFractionCarTime = 120
/** Сколько топлива даётся ТС если его нет в конфиге */
export const FUEL_MAX_DEFAULT = 80
/** Настройка модификаторов расхода топлива */
export const enum VEHICLE_FUEL_RATE {
    /** Модификатор умножение базового параметра исходя из скорости */
    SPEED = 0.001,
    /** Параметр штрафа за каждого пассажира */
    PASSENGERS = 0.005,
    /** Параметр расхода за заведённый двигатель (не работает на электрокарах) */
    AFK = 0.06,
    /** Интервал в секундах, в который будет происходить расход по формуле */
    INTERVAL = 15,
}
/** Енумка типов топлива */
export const enum VEHICLE_FUEL_TYPE {
    /** Электричество */
    ELECTRO = 0,
    /** 92 */
    A92 = 1,
    /** 95 */
    A95 = 2,
    /** 98 */
    A98 = 3,
    /** Дизель */
    DISEL = 4,
    /** Авиатопливо */
    AIR = 5,
}






export const enum MOD_COST_TYPE {
    /** Стоимость обычная */
    DEFAULT = 0,
    /** Стоимость прогрессивная */
    PROGRESSIVE = 1,
}



export const npcVehicleJack:[string, number][] = [
    ['banshee', 1401],
    ['bullet', 1501],
    ['coquette', 1701],
    ["bjxl", 1401],
    ["carbonizzare", 1501],
    ["feltzer2", 1501],
    ["felon", 1401],
    ["felon2", 1201],
    ["f620", 1801],
    ["infernus", 1401],
    ["jackal", 1201],
    ["ninef", 1401],
    ["ninef2", 1401],
    ["comet2", 1801],
    ["exemplar", 1401],
    ["rapidgt", 1901],
    ["rapidgt2", 1801],
    ["rocoto", 1501],
    ["superd", 1201],
    ["surano", 1201],
    ["schafter2", 1401],
    ["schwarzer", 1901],
    ["sentinel", 1201],
    ["sentinel2", 1201],
    ["zion", 1801],
    ["serrano", 1401],
    ["voltic", 1701],
    ["tornado", 1201],
    ["jester", 1901],
    ["alpha", 1801],
    ["massacro", 1501],
    ["huntley", 1401],
    ["furoregt", 1201],
    ["asterope", 1901],
    ["baller", 1501],
    ["baller2", 1501],
    ["buffalo", 1801],
    ["blista", 1901],
    ["blista2", 1901],
    ["cavalcade", 1201],
    ["cavalcade2", 1801],
    ["dominator", 1401],
    ["gresley", 1901],
    ["dubsta", 1701],
    ["dukes", 1201],
    ["dilettante", 1201],
    ["emperor", 1201],
    ["fq2", 1701],
    ["futo", 1801],
    ["fugitive", 1201],
    ["fusilade", 1501],
    ["habanero", 1201],
    ["issi2", 1201],
    ["gauntlet", 1201],
    ["granger", 1801],
    ["landstalker", 1201],
    ["mesa", 1201],
    ["oracle", 1401],
    ["oracle2", 1401],
    ["patriot", 1901],
    ["peyote", 1701],
    ["penumbra", 1801],
    ["prairie", 1901],
    ["radi", 1801],
    ["ruiner", 1501],
    ["rumpo", 1701],
    ["sabregt", 1801],
    ["seminole", 1201],
    ["stalion", 1201],
    ["stanier", 1701],
    ["surge", 1801],
    ["tornado2", 1701],
    ["washington", 1401],
    ["zion2", 1801],
    ["panto", 1201],
    ["pigalle", 1701],
    ["asea", 1801],
    ["buccaneer", 1401],
    ["emperor2", 1801],
    ["intruder", 1501],
    ["ingot", 1801],
    ["manana", 1701],
    ["minivan", 1201],
    ["phoenix", 1501],
    ["picador", 1901],
    ["premier", 1201],
    ["primo", 1801],
    ["rancherxl", 1901],
    ["regina", 1901],
    ["sultan", 1201],
    ["stratum", 1201],
    ["youga", 1401],
    ["tornado3", 1501],
    ["vigero", 1801],
    ["warrener", 1401],
    ["glendale", 1801],
    ["rhapsody", 1201],
    ["vader", 1801],
    ["faggio2", 1901],
    ["akuma", 1401],
    ["bagger", 1201],
    ["bati", 1801],
    ["daemon", 1401],
    ["nemesis", 1901],
    ["pcj", 1901],
    ["double", 1701],
    ["ruffian", 1701],
    ["thrust", 1401],
    ["hakuchou", 1801],
    ["pounder", 1801],
    ["biff", 1901],
    ["mule", 1701],
    ["taco", 1401],
    ["asbo", 1501],
    ["club", 1901],
    ["cogcabrio", 1801],
    ["seminole2", 1501],
    ["blista3", 1201],
    ["elegy", 1701],
    ["revolter", 1201],
    ["schlagen", 1501],
    ["seven70", 1701],
    ["dynasty", 1801],
    ["manana2", 1401],
    ["nebula", 1501],
    ["retinue2", 1901],
    ["ztype", 1201],
    ["zion3", 1401],
    ["zentorno", 2000],
    ["yosemite", 1401],
    ["virgo3", 1801]
]


/** Список ТС которые будут спавнится случайно а так же могут быть заказаны для угона */
export const npcVehicles = ["banshee",
    "bjxl",
    "bullet",
    "carbonizzare",
    "coquette",
    "feltzer2",
    "felon",
    "felon2",
    "f620",
    "infernus",
    "jackal",
    "ninef",
    "ninef2",
    "comet2",
    "exemplar",
    "rapidgt",
    "rapidgt2",
    "rocoto",
    "superd",
    "surano",
    "schafter2",
    "schwarzer",
    "sentinel",
    "sentinel2",
    "zion",
    "serrano",
    "voltic",
    "tornado",
    "jester",
    "alpha",
    "massacro",
    "huntley",
    "furoregt",
    "asterope",
    "baller",
    "baller2",
    "buffalo",
    "blista",
    "blista2",
    "cavalcade",
    "cavalcade2",
    "dominator",
    "gresley",
    "dubsta",
    "dukes",
    "dilettante",
    "emperor",
    "fq2",
    "futo",
    "fugitive",
    "fusilade",
    "habanero",
    "issi2",
    "gauntlet",
    "granger",
    "landstalker",
    "mesa",
    "oracle",
    "oracle2",
    "patriot",
    "peyote",
    "penumbra",
    "prairie",
    "radi",
    "ruiner",
    "rumpo",
    "sabregt",
    "seminole",
    "stalion",
    "stanier",
    "surge",
    "tornado2",
    "washington",
    "zion2",
    "panto",
    "pigalle",
    "asea",
    "buccaneer",
    "emperor2",
    "intruder",
    "ingot",
    "manana",
    "minivan",
    "phoenix",
    "picador",
    "premier",
    "primo",
    "rancherxl",
    "regina",
    "sultan",
    "stratum",
    "youga",
    "tornado3",
    "vigero",
    "warrener",
    "glendale",
    "rhapsody",
    "vader",
    "faggio2",
    "akuma",
    "bagger",
    "bati",
    "daemon",
    "nemesis",
    "pcj",
    "double",
    "ruffian",
    "thrust",
    "hakuchou",
    "pounder",
    "biff",
    "mule",
    "taco",
    "asbo",
    "club",
    "cogcabrio",
    "seminole2",
    "blista3",
    "elegy",
    "revolter",
    "schlagen",
    "seven70",
    "dynasty",
    "manana2",
    "nebula",
    "retinue2",
    "ztype",
    "zion3",
    "zentorno"
]

export const npcGrabCarSetting = {
    /** На сколько метров может быть отклонения даваемых игроку координат транспорта, чтобы ему было сложнее отыскать машину */
    vehPosOffset: 15,
    /** Местоположение NPC */
    npcModel: 'ig_lamardavis',
    /** Местоположение NPC */
    npcPos: {x: 297.33, y: -1184.32, z: 29.34},
    /** Угол поворота NPC */
    npcHeading: 129,
    /** Место для маркера сдачи ТС (радиус будет 4м) */
    vehiclePos: {x: 293.73, y: -1188.57, z: 28.26},
    incorrectCarText: ["Я конечно всё понимаю, но этот транспорт мне нафиг не нужен", "Нет, мне это не нужно", "Я вроде как не просил эту модель", "Не надо мне свозить что попало, только то, что я прошу", "Я это не приму, что мне с этим делать?"]
}