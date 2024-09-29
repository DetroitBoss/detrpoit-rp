
export const DAMAGE_HEAD_BONE_INDEX = 20;


export const DAMAGE_CONTROLLER_CONFIGS:{
    /** Специфическое оружие, если требуется */
    weapon?:number,
    /** Проверка непосредственно на попадание в голову */
    headShot?:boolean,
    /** Урон будет не выше, чем указанный. Лучше всего указывать для определённого оружия. Если под урон подойдёт несколько элементов из этого конфига - будет выбран с самым маленьким значением */
    maxDamage?: number,
    /** На сколько нужно умножить урон */
    damageMultipler: number,
}[] = [
    {weapon: mp.game.joaat("weapon_assaultrifle"), damageMultipler: 0.5, maxDamage: 10}, //АК-47
    {weapon: 453432689, damageMultipler: 0.35, maxDamage: 9}, //taurus
    {weapon: mp.game.joaat("weapon_pistol_mk2"), damageMultipler: 0.3, maxDamage: 9}, //beretta
    {weapon: 1593441988, damageMultipler: 0.35, maxDamage: 7}, //p99
    {weapon: 584646201, damageMultipler: 0.3, maxDamage: 6}, //tdi
    {weapon: mp.game.joaat("weapon_pistol50"), damageMultipler: 0.4, maxDamage: 20}, //desert
    {weapon: mp.game.joaat("weapon_gadgetpistol"), damageMultipler: 0.4, maxDamage: 75}, // perico pistool
    {weapon: mp.game.joaat("weapon_snspistol"), damageMultipler: 0.3, maxDamage: 6}, //hkp7m10
    {weapon: mp.game.joaat("weapon_snspistol_mk2"), damageMultipler: 0.3, maxDamage: 6}, //amtbackup
    {weapon: mp.game.joaat("weapon_heavypistol"), damageMultipler: 0.4, maxDamage: 12}, //remington
    {weapon: 137902532, damageMultipler: 0.4, maxDamage: 12}, //fnmodel
    {weapon: mp.game.joaat("weapon_marksmanpistol"), damageMultipler: 0.2, maxDamage: 42}, //contederg2
    {weapon: mp.game.joaat("weapon_revolver"), damageMultipler: 0.36, maxDamage: 50}, //taurusRagingBull
    {weapon: mp.game.joaat("weapon_revolver_mk2"), damageMultipler: 0.2, maxDamage: 38}, //taurusRagingBullmod
    {weapon: mp.game.joaat("weapon_doubleaction"), damageMultipler: 0.3, maxDamage: 24}, //coltNewService
    {weapon: 727643628, damageMultipler: 0.3, maxDamage: 9}, //glock17
    {weapon: mp.game.joaat("weapon_navyrevolver"), damageMultipler: 0.3, maxDamage: 45}, //coltNavy
    {weapon: 324215364, damageMultipler: 0.35, maxDamage: 7}, //miniUzi
    {weapon: 736523883, damageMultipler: 0.35, maxDamage: 7}, //mp5a3
    {weapon: 2024373456, damageMultipler: 0.35, maxDamage: 7}, //mp5k
    {weapon: mp.game.joaat("weapon_assaultsmg"), damageMultipler: 0.4, maxDamage: 8}, //p90
    {weapon: 171789620, damageMultipler: 0.45, maxDamage: 9}, //sigmpx pdw
    {weapon: mp.game.joaat("weapon_machinepistol"), damageMultipler: 0.3, maxDamage: 6}, //tec9
    {weapon: mp.game.joaat("weapon_minismg"), damageMultipler: 0.3, maxDamage: 6}, //scorpion
    {weapon: 487013001, damageMultipler: 0.14, maxDamage: 30}, //mosberg590A1
    {weapon: 1432025498, damageMultipler: 0.14, maxDamage: 30}, //mosberg590A1Mod
    {weapon: 2017895192, damageMultipler: 0.14, maxDamage: 30}, //mosberg500
    {weapon: mp.game.joaat("weapon_assaultshotgun"), damageMultipler: 0.11, maxDamage: 20}, //uts
    {weapon: mp.game.joaat("weapon_bullpupshotgun"), damageMultipler: 0.25, maxDamage: 20}, //ksg12
    {weapon: mp.game.joaat("weapon_musket"), damageMultipler: 0.1, maxDamage: 75}, //musket
    {weapon: 984333226, damageMultipler: 0.22, maxDamage: 28}, //Сайга
    {weapon: mp.game.joaat("weapon_dbshotgun"), damageMultipler: 0.15, maxDamage: 25}, //обрез
    {weapon: 317205821, damageMultipler: 0.13, maxDamage: 20}, //proteca
    {weapon: 961495388, damageMultipler: 0.48, maxDamage: 14}, //ak-103
    {weapon: mp.game.joaat("weapon_carbinerifle"), damageMultipler: 0.4, maxDamage: 12 }, //hk416
    {weapon: mp.game.joaat("weapon_carbinerifle_mk2"), damageMultipler: 0.4, maxDamage:12}, //hkmod
    {weapon: mp.game.joaat("weapon_advancedrifle"), damageMultipler: 0.35, maxDamage:10}, //tavr
    {weapon: mp.game.joaat("weapon_specialcarbine"), damageMultipler: 0.35, maxDamage:10}, //g36c
    {weapon: mp.game.joaat("weapon_specialcarbine_mk2"), damageMultipler: 0.4, maxDamage:12}, //g36kv
    {weapon: 2132975508, damageMultipler: 0.35, maxDamage:10}, //qbz97
    {weapon: mp.game.joaat("weapon_bullpuprifle_mk2"), damageMultipler: 0.3, maxDamage: 9}, //qbz95
    {weapon: 1649403952, damageMultipler: 0.3, maxDamage: 9}, //aksu
    {weapon: mp.game.joaat("weapon_mg"), damageMultipler: 0.6, maxDamage: 18}, //pecheneg
    {weapon: 2144741730, damageMultipler: 0.4, maxDamage: 17}, //mk48
    {weapon: mp.game.joaat("weapon_combatmg_mk2"), damageMultipler: 0.4, maxDamage: 18}, //mg42
    {weapon: 1627465347, damageMultipler: 0.3, maxDamage: 9}, //tompson
    {weapon: 100416529, damageMultipler: 0.3, maxDamage:30}, //awm
    {weapon: 205991906, damageMultipler: 0.15, maxDamage: 40}, //barret
    {weapon: 177293209, damageMultipler: 0}, //barretxm109 для охоты
    {weapon: mp.game.joaat("weapon_marksmanrifle"), damageMultipler: 0.25, maxDamage: 25}, //m14ebr
    {weapon: 1785463520, damageMultipler: 0.2, maxDamage: 18}, //socom16
    {weapon: mp.game.joaat("weapon_knife"), damageMultipler: 0.5, maxDamage: 30}, //weapon_knife
    {weapon: mp.game.joaat("weapon_flashlight"), damageMultipler: 0}, //weapon_flashlight
    {headShot: true, damageMultipler: 1.3}, // Хедшот со всех оружий
    {weapon: mp.game.joaat("weapon_militaryrifle"), damageMultipler: 0.4, maxDamage:12}, //AUG A3
    {weapon: mp.game.joaat("weapon_bottle"), damageMultipler: 0.5, maxDamage: 35}, //Розочка
    {weapon: mp.game.joaat("weapon_crowbar"), damageMultipler: 0.5, maxDamage: 35}, //Ломик
    {weapon: mp.game.joaat("weapon_hammer"), damageMultipler: 0.5, maxDamage: 35}, //Строительный молоток
    {weapon: mp.game.joaat("weapon_hatchet"), damageMultipler: 0.5, maxDamage: 35}, //Топорик
    {weapon: mp.game.joaat("weapon_knuckle"), damageMultipler: 0.5, maxDamage: 35}, //Кастет
    {weapon: mp.game.joaat("weapon_machete"), damageMultipler: 0.5, maxDamage: 35}, //Мачете
    {weapon: mp.game.joaat("weapon_wrench"), damageMultipler: 0.5, maxDamage: 35}, //Трубный ключ
    {weapon: mp.game.joaat("weapon_battleaxe"), damageMultipler: 0.5, maxDamage: 35}, //Axe топорик
    {weapon: mp.game.joaat("weapon_poolcue"), damageMultipler: 0.5, maxDamage: 35}, //Кий
    {weapon: mp.game.joaat("weapon_stone_hatchet"), damageMultipler: 0.5, maxDamage: 35}, //Каменный топорик
    {weapon: mp.game.joaat("weapon_switchblade"), damageMultipler: 0.5, maxDamage: 35}, //Стилет
]

