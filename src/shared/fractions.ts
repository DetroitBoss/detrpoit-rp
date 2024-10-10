import {ArmorNames} from "./cloth";

export const TENCODES_LIST:[string, string][] = [
    ['Код 0', "Офицер убит или ранен"],
    ['Код 1', "Офицер в бедственном положении (По офицерам открыт огонь)"],
    ['Код 2', "Прибыть на место без сирен и стробоскобов"],
    ['Код 3', "Срочный вызов с сиреной и маячками"],
    ['Код 4', "Все спокойно"],
    ['Код 5', "Ложная тревога"],
    ['Код 6', "Массовые беспорядки"],
    ['Код 7', "Скопление вооруженных людей"],
]

export const GOS_INVITE_RANKS_MINUS = 3;
export const GANG_INVITE_RANKS_MINUS = 2;
export const MAIFA_INVITE_RANKS_MINUS = 2;

/** КД на ограбление игрока в секундах */
export const CRIME_ROBBERY_COOLDOWN = 3600;
/** Процент получения денег при ограблении */
export const CRIME_ROBBERY_INTEREST = 20;
/** Максимально возможная сумма ограбления */
export const CRIME_ROBBERY_PROFIT_LIMIT = 10000000;

export enum DISPATCH_TYPES {
    CALL,
    TEN_CODE
}

interface fractionInterface {
    /** ID Фракции */
    id: FACTION_ID;
    /** Название */
    name: string;
    /** Описание */
    desc: string;
    /** Иконка */
    icon: string;
    /** Гос фракция */
    gos?: boolean;
    /** Полномочия полицейских */
    police?: boolean;
    /** Правительство */
    government?: boolean;
    /** Мафия */
    mafia?: boolean;
    /** Банда */
    gang?: boolean;
    /** Список рангов */
    ranks: string[];
    /** Базовая цифра зарплаты, которая прибавится к итоговой */
    moneybase: number;
    /** Множитель ранга для определения зарплаты */
    salaries: number[]; 
    /** HEX Цвет фракции для некоторых систем */
    color?: string;
    /** Цвет зоны капта для банд */
    blipgangcolor?:number;
    codes?:string[]
    /** Координаты для спавна во фракции */
    spawn?: {x: number, y: number, z: number, h: number},
    armour_male?: {drawable: number, texture: number},
    armour_female?: {drawable: number, texture: number},
    armour_male_small?: {drawable: number, texture: number},
    armour_female_small?: {drawable: number, texture: number},
    armorName?: string;
}


export const enum FACTION_ID {
    GOV = 1,
    LSPD = 2,
    FIB = 3,
    ARMY = 4,
    LIFEINVADER = 5,
    SHERIFF = 7,
    EMS = 16,
    BALLAS = 18,
    FAMILIES = 19,
    MARABUNTA = 20,
    BLOODS = 21,
    VAGOS = 22,
    MAFIA1 = 23,
    MAFIA2 = 24,
    MAFIA3 = 25,
}


export const fractionList: fractionInterface[] = [
    { id: 1, name: "Government", desc: "Правительство", icon: "GOV", gos: true, police: true, mafia: false, gang: false, government: true, ranks: ["Trainee" , "Junior Secretary", "Junior Officer of the USSS", "Secretary", "Lawyer", "USSS Officer", "Assiastant Secretary", "Senior Lawyer", "USSS Agent", "EVENT Manager", "HR Manager", "USSS Secret Agent", "Dep.Head of the Department", "Head of the Department", "Attorney", "Judge", "Mayor", "Chief of Staff", "Dep.Dir. of the USSS", "Director of the USSS", "Chief Justice", "Dep. Minister", "Minister", "Attorney General", "Counsel to the Governor", "Vice Governor", "Governor"], moneybase: 0,
     salaries: [2000, 2300,2300,2300,3800,3300,3300,3300,4300,3800,3800,3800,4800,5000,3800,4000,3800,4200,5200,5400,5600,5800,6000,6400,6000,6400,6800],
      spawn: {x: -549.89, y: -184.01, z: 47.90, h: 131}, armour_male: {drawable: 68, texture: 1}, armour_female: {drawable: 58, texture: 1},
        armorName: ArmorNames.GovernmentArmor
    },

    { id: 2, name: "LSPD", desc: "Отделение полиции", icon: "LSPD", gos: true, police: true, mafia: false, gang: false, ranks: ["Cadet PA", "Police Officier I", "Police Officier II", "Police Officier III", "Police Officier III+1", "Sergeant I", "Sergeant II", "Lieutenant I", "Lieutenant II", "Captain I", "Captain II", "Commander", "Assistant Chief of Police", "Chief of Police"], moneybase: 0,
     salaries: [1300,1600,1900,2300,2700,3100,3500,3800,4100,4500,4800,5500,5800,6400]
     , spawn: {x: 479.24, y: -997.16, z: 23.31, h: 83}, armour_male: {drawable: 68, texture: 2}, armour_female: {drawable: 58, texture: 2},
        armorName: ArmorNames.PoliceArmor
    },

    { id: 3, name: "FIB", desc: "Отделение FIB", icon: "fib", gos: true, police: true, mafia: false, gang: false, ranks: ["Trainee FIB", "Junior Agent", "Agent", "Special Agent", "Secret Agent", "Senior Agent", "Free Agent", "Deputy of Department", "Head of Department", "Inspector FIB", "Assistant Director", "Deputy Director", "Director FIB"], moneybase: 0,
     salaries: [1500,2100,2700,3300,3900,4400,4900,5500,6100,6700,6800,6800,6900],
        spawn: {x: 2487.22, y: -415.19, z: 100.36, h: 281}, armour_male: {drawable: 22, texture: 9}, armour_female: {drawable: 20, texture: 9},
        armorName: ArmorNames.FibArmor
    },

    { id: 4, name: "Army", desc: "Армия", icon: "Army", gos: true, mafia: false, police: true, gang: false, ranks: ["Private", "Private Second Class", "Private First Class", "Specialist", "Corporal", "Sergeant", "Staff Sergeant", "Master Sergeant", "Sergeant Major", "Warrant Officer", "Chief Warrant Officer", "Lieutenant", "Lieutenant Colonel", "Colonel"], moneybase: 0,
     salaries: [1300,1600,1900,2200,2500,2900,3300,3700,4100,4500,5000,5500,6000,6600],
      spawn: {x: -2342.48, y: 3224.74, z: 29.22, h: 136}, armour_male: {drawable: 68, texture: 0 }, armour_female: {drawable: 58, texture: 0},
        armorName: ArmorNames.ArmyArmor
    },

    { id: 5, name: "Weazel News", desc: "Агенство новостей", icon: "LifeInvader", gos: true, mafia: false, gang: false, ranks: ["Promoter", "Trainee", "Editor", "Radio Host", "Event Manager", "Operator", "Journalist", "Chief Editor", "Manager", "Dep.Head of the Department", "Head of the Department", "Dep.Director", "Director"], moneybase: 0,
     salaries: [1300,1700,2100,2600,3100,3600,4100,4600,5100,5600,5400,5700,6000],
      spawn: {x: -578.08, y: -937.52, z: 28.18, h: 47}
    },

    { id: 7, name: "Sheriffs Department", desc: "Шериф Департамент", icon: "Sheriff", gos: true, police: true, mafia: false, gang: false, ranks: ["Deputy Sheriff Treinee", "Deputy Sheriff", "Corporal", "Sergeant", "Lieutenant", "Senior-Lieutenant", "Captain", "Commander", "Division Chief", "Assistant Sheriff", "Undersheriff", "Sheriff"], moneybase: 0,
     salaries: [1300,1600,1900,2200,2500,2900,3400,3700,4100,4600,5000,6000],
      spawn: {x: -436.02, y: 6008.00, z: 31.72, h: 30}, armour_male: {drawable: 68, texture: 4}, armour_female: {drawable: 58, texture: 4},
        armorName: ArmorNames.SheriffArmor
    },
    
    { id: 16, name: "EMS", desc: "Отделение Больницы", icon: "EMS", gos: true, mafia: false, gang: false, ranks: ["Trainee", "Intern", "Ordinator", "Paramedic", "Jr.Specialist", "Senior Specialist", "Chief Specialist", "Doctors Assistant", "Doctor", "Senior Doctor", "Dep.Head of Department", "Head of the Department", "Dep.Chief Physician", "Chief Physician"], moneybase: 0,
     salaries: [1200,1600,2000,2400,2800,3200,3600,4000,4400,4800,5200,5600,6000,6200],
      spawn: {x: 306.11, y: -598.19, z: 43.26, h: 29}
    },

    { id: 18, name: "Ballas", desc: "Ballas", icon: "Ballas", gos: false, mafia: false, gang: true, ranks: ["Blade", "Buster", "Сracker", "gunBrogh", "upBrogh", "Gangster", "Federal block", "Foulkes", "Rich Nig", "Big Gangster"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#CD42FF",  blipgangcolor:  7, spawn: {x: 901.31, y: -2171.85, z: 32.27, h: 353},
        armour_male: {drawable: 22, texture: 2}, armour_female: {drawable: 20, texture: 2},
        armorName: ArmorNames.PurpleArmor
    },

     { id: 19, name: "Families", desc: "Families", icon: "Families", gos: false, mafia: false, gang: true, ranks: ["Beginner", "Youngsta", "Killa", "Wang G", "Shooter", "Big Brother", "High", "The King", "Deputy Boss", "Mad Dog"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#41AB5D",  blipgangcolor:  25, spawn: {x: 111.55, y: -1968.08, z: 21.32, h: 323},
        armour_male: {drawable: 22, texture: 0 }, armour_female: {drawable: 20, texture: 0},
         armorName: ArmorNames.GreenArmor
     },

     { id: 20, name: "Marabunta Grande", desc: "Marabunta Grande", icon: "mara", gos: false, mafia: false, gang: true, ranks: ["Novato", "Experimentado", "Maton", "El asesino", "Viendo", "Trusted", "Cerrar", "Mano izquierda", "Mano derecha", "Capitulo"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#49A2E6",  blipgangcolor:  3, spawn: {x: 447.77, y: -1313.57, z: 29.27, h: 308},
         armour_male: {drawable: 22, texture: 5 }, armour_female: {drawable: 20, texture: 5},
         armorName: ArmorNames.BlueArmor
     },

     { id: 21, name: "Bloods", desc: "Bloods", icon: "Bloods", gos: false, mafia: false, gang: true, ranks: ["Boy Blood.", "Young Blood", "Mature Blood", "Gangster Blood", "Killa Blood", "Old Blood", "Boss Gangster Blood", "Looker Blood", "Big Boss Blood", "King of Blood"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#FF0000",  blipgangcolor:  59, spawn: {x: -491.94, y: -1724.18, z: 19.51, h: 277},
         armour_male: {drawable: 22, texture: 4 }, armour_female: {drawable: 20, texture: 4},
         armorName: ArmorNames.RedArmor
     },

     { id: 22, name: "Vagos", desc: "Vagos", icon: "Vagos", gos: false, mafia: false, gang: true, ranks: ["Novito", "Ordinario", "Configuracion regional", "Verifikado", "Bandito", "V. E. G", "Assessino", "Lider V. E. G.", "Padrino", "Padre"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#FFFF00",  blipgangcolor:  5, spawn: {x: 484.01, y: -1951.13, z: 24.72, h: 309},
         armour_male: {drawable: 22, texture: 1 }, armour_female: {drawable: 20, texture: 1},
         armorName: ArmorNames.YellowArmor
     },

     { id: 23, name: "Yakuza", desc: "Yakuza", icon: "Yakuza", gos: false, mafia: true, gang: false, ranks: ["Iangy-Rodo", "Iangy-Rodo Sha", "Shatei", "Kie Dai", "Siatei Gasira", "Singin", "Kaikei", "Vaka Gasira", "Saiko Komon", "Oyabun"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#41AB5D",  blipgangcolor:  25, spawn: {x: -355.71, y: 207.21, z: 88.57, h: 259},
        armour_male: {drawable: 22, texture: 0 }, armour_female: {drawable: 20, texture: 0},
         armorName: ArmorNames.YakuzaArmor
     },

     { id: 24, name: "Russian", desc: "Russian", icon: "Russian", gos: false, mafia: true, gang: false, ranks: ["Шнырь", "Хулиган", "Фраер", "Жулик", "Барыга", "Блатной", "Авторитет", "Смотрящий", "Положенец", "Вор в Законе"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#41AB5D",  blipgangcolor:  25, spawn: {x: -1524.51, y: 842.90, z: 181.60, h: 256},
        armour_male: {drawable: 22, texture: 0 }, armour_female: {drawable: 20, texture: 0},
         armorName: ArmorNames.RMArmor
     },

     { id: 25, name: "La Cosa Nostra", desc: "La Cosa Nostra", icon: "La Cosa Nostra", gos: false, mafia: true, gang: false, ranks: ["Novizio", "Testato", "Associato", "Combattente", "Soldato", "Confidente", "Capo", "Strada Boss", "Сonsigliere", "Don"], moneybase: 0, salaries: [400,400,400,400,400,400,400,400,400,400], color: "#41AB5D",  blipgangcolor:  25, spawn: {x: 1400.91, y: 1144.58, z: 114.33, h: 57},
        armour_male: {drawable: 22, texture: 0 }, armour_female: {drawable: 20, texture: 0},
         armorName: ArmorNames.LCNArmor
     },
]
