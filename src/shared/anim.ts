interface SyncAnimData {
    /** Название анимации
     * @example Обняться
     */
    name: string;
    /** Название библиотеки, в которой хранится анимация для инициатора */
    dict1: string;
    /** Название анимации для инициатора. Если они разные для мужчины и женщины - то массив из двух названий. Первая - мужская, вторая - женская */
    anim1: string | [string, string];
    /** Название библиотеки, в которой хранится анимация для второго */
    dict2: string;
    /** Название анимации для второго. Если они разные для мужчины и женщины - то массив из двух названий. Первая - мужская, вторая - женская. Если не указывать - то будет использоватся anim1 */
    anim2: string | [string, string];
    /** Дистанция между игроками */
    dist?: number;
}

export interface AnimationData {
    dictionary: string,
    name: string,
    durationSec: number
}

/** Каталог с анимациями взаимодействия. Не более 10 */
export const SYNC_ANIM_LIST: SyncAnimData[] = [
    // { name: "Тест1", dict1: 'mp_ped_interaction', anim1: 'handshake_guy_a', dict2: 'mp_ped_interaction', anim2: 'handshake_guy_b'},
    // { name: "Тест2", dict1: 'mp_ped_interaction', anim1: 'highfive_guy_a', dict2: 'mp_ped_interaction', anim2: 'highfive_guy_b'},
    // { name: "Тест3", dict1: 'mp_ped_interaction', anim1: 'hugs_guy_a', dict2: 'mp_ped_interaction', anim2: 'hugs_guy_b'},
    { name: "Поцелуй", dict1: 'mp_ped_interaction', anim1: 'kisses_guy_a', dict2: 'mp_ped_interaction', anim2: 'kisses_guy_b', dist: -1.00},
    //{ name: "Минет", dict1: 'misscarsteal2pimpsex', anim1: 'pimpsex_punter', dict2: 'misscarsteal2pimpsex', anim2: 'pimpsex_hooker'},
    //{ name: "Секс", dict1: 'rcmpaparazzo_2', anim1: 'shag_loop_a', dict2: 'rcmpaparazzo_2', anim2: 'shag_loop_poppy'},
]

interface IPurchaseableAnimation {
    id: number;
    category: string;
    name: string;
    forBattlePass: boolean;
    /** Стоимость покупки/продажи. Не учитывается при forBattlePass = true */
    cost?: 100;
    costType?: "coins" | "money";
}

export const getPurchaseableModelForAnim = (name: string): IPurchaseableAnimation  => {
    return PURCHASEABLE_ANIMS.find(anim => anim.name == name)
}

export const PURCHASEABLE_ANIMS: IPurchaseableAnimation[] = [
    { id: 1, category: "Развлечение", name: "Хай-кик", forBattlePass: true },
    { id: 2, category: "Развлечение", name: "На коне", forBattlePass: true },
    { id: 3, category: "Развлечение", name: "Лузер 2", forBattlePass: true },
    { id: 4, category: "Развлечение", name: "Киса", forBattlePass: true },
    { id: 5, category: "Танцы", name: "Брейк 3", forBattlePass: true },
    { id: 6, category: "Развлечение", name: "Лузер 1", forBattlePass: true },
    { id: 7, category: "Развлечение", name: "Победа!", forBattlePass: true },
    { id: 8, category: "Танцы", name: "Брейк 10", forBattlePass: true },
    { id: 9, category: "Танцы", name: "Танец утят", forBattlePass: true },
    { id: 10, category: "Танцы", name: "Twerk", forBattlePass: true },
    { id: 11, category: "Танцы", name: "Робот 2", forBattlePass: true },
    { id: 12, category: "Танцы", name: "Диско", forBattlePass: true },
    { id: 13, category: "Танцы", name: "Крутиться на одной руке", forBattlePass: true }
]

// upper, dictData, looping
export const ANIM_LIST: { [param: string]: { [param: string]: [boolean, [string, string?, number?][] | string, boolean]}} = {
    "Развлечение": {
        "Бонг 1": [false, [["amb@world_human_musician@bongos@male@idle_a", "idle_a", 1]], true],
        "Бонг 2": [false, [["amb@world_human_musician@bongos@male@idle_a", "idle_b", 1]], true],

        "Играть в гольф": [false, [["rcmnigel1d", "swing_a_mark", 1]], false],

        "Гитара 1": [false, [["amb@world_human_musician@guitar@male@base", "base", 1]], true],
        "Гитара 2": [false, [["amb@world_human_musician@guitar@male@idle_a", "idle_c", 1]], true],
        "Гитара 3": [false, [["switch@trevor@guitar_beatdown", "001370_02_trvs_8_guitar_beatdown_idle_busker", 1]], true],
        "Гитара 4": [false, [["amb@world_human_musician@guitar@male@idle_a", "idle_c", 1]], true],
        
        "Курить (М)": [false, "WORLD_HUMAN_AA_SMOKE", false],
        "Курить 2": [false, [["timetable@gardener@smoking_joint", "smoke_idle", 1]], true],

        "Выпивать": [true, "WORLD_HUMAN_DRINKING", true],
        "Выпивать 2 (+)": [true, [["amb@world_human_drinking@beer@male@idle_a", "idle_a", 1]], true],
        "Выпивать 3 (+)": [true, [["amb@world_human_drinking@coffee@female@idle_a", "idle_a", 1]], true],
        "Выпивать 4": [false, "WORLD_HUMAN_PARTYING", true],

        "Статуя": [false, "WORLD_HUMAN_HUMAN_STATUE", true],
        "Сделать селфи": [false, [["cellphone@self@franklin@", "chest_bump", 1]], false],
        "Опорожниться": [false, [["missbigscore1switch_trevor_piss", "piss_loop", 1]], true],
        "Опорожниться 2": [false, [["rcm_epsilonism4", "peeing", 1]], true],

        "Бег на месте": [false, [["amb@world_human_jog_standing@male@base", "base", 1]], true],
        "Бег на месте 2": [false, [["move_f@runner", "idle", 1]], true],
        "Прыжки на месте": [false, [["timetable@tracy@ig_5@base", "base", 1]], true],
         
        "Отжиматься (М)": [false, "WORLD_HUMAN_PUSH_UPS", false],        
        "Отжиматься 2": [false, [["switch@franklin@press_ups", "pressups_into", 1],
                                    ["switch@franklin@press_ups", "pressups_loop", 1],
                                ], true], 
        "Качать пресс (М)": [false, "WORLD_HUMAN_SIT_UPS", false],  
        "Ковыряться в саду": [false, "WORLD_HUMAN_GARDENER_PLANT", false], 

        "Рок (+)": [true, [["anim@mp_player_intincarrockbodhi@rds@", "idle_a_fp", 1]], true], 
        "Лайк  (+)": [true, [["anim@mp_player_intincarthumbs_upbodhi@ds@", "idle_a_fp", 1]], true], 
        "Okay (+)": [true, [["anim@mp_player_intselfiedock", "idle_a", 1]], true], 
        "Два пальца": [true, [["amb@code_human_in_car_mp_actions@v_sign@bodhi@rps@base", "idle_a", 1]], true],

        "Медитация": [false, [["rcmcollect_paperleadinout@", "meditiate_idle", 1]], true],

        "Заниматься йогой": [false, "WORLD_HUMAN_YOGA", true],
        "Заниматься йогой 1": [false, [["timetable@amanda@ig_4", "ig_4_idle", 1]], true],
        "Заниматься йогой 2": [false, [["amb@world_human_yoga@female@base", "base_a", 1], 
                                        ["amb@world_human_yoga@female@base", "base_c", 1],
                                        ], true],
        "Заниматься йогой 3": [false, [["amb@world_human_jog_standing@male@base", "base", 1]], true],

        "Притвориться мертвым": [false, [["anim@melee@machete@streamed_core@", "victim_front_takedown", 1]], false],
        "Покачиваться  (+)": [true, [["anim@mp_player_intcelebrationmale@peace", "peace", 1]], false],

        "Насмешка. Воздушный трах": [false, [["anim@mp_player_intcelebrationfemale@air_shagging", "air_shagging", 1]], false],
        "Насмешка. Воздушный поцелуй": [false, [["anim@mp_player_intcelebrationmale@blow_kiss", "blow_kiss", 1]], false],
        "Насмешка. Chicken": [false, [["anim@mp_player_intcelebrationfemale@chicken_taunt", "chicken_taunt", 1]], false],
        "Насмешка. Чпок": [false, [["anim@mp_player_intcelebrationfemale@dock", "dock", 1]], false],
        "Насмешка. Лось": [false, [["anim@mp_player_intcelebrationfemale@thumb_on_ears", "thumb_on_ears", 1]], false],
        "Насмешка Fuck you": [false, [["anim@mp_player_intcelebrationfemale@finger", "finger", 1]], false],
        "Насмешка. Клоун": [false, [["rcm_barry2", "clown_idle_0", 1],
                                    ["rcm_barry2", "clown_idle_1", 1],
                                    ["rcm_barry2", "clown_idle_2", 1],
                                    ["rcm_barry2", "clown_idle_3", 1],
                                    ["rcm_barry2", "clown_idle_4", 1],
                                    ["rcm_barry2", "clown_idle_5", 1],
                                    ["rcm_barry2", "clown_idle_6", 1],
                                    ], false],

        "Сальто": [false, [["backflip@animation", "backflip_clip", 1]], true],
        "Киса": [false, [["catbackflip@animation", "catbackflip_clip", 1]], true],
        "Робот 1": [false, [["emotebandofthefort@animation", "emotebandofthefort_clip", 1]], true],
       // "18": [false, [["emotebreakdance@animation", "emotebreakdance_clip", 1]], true], //не работает
        "Лузер 1": [false, [["emotedancelosercmf@animation", "emotedancelosercmf_clip", 1]], true],
        "На коне": [false, [["emotedanceridethepony@animation", "emotedanceridethepony_clip", 1]], true],
        "Победа!": [false, [["emoteheelclick@animation", "emoteheelclick_clip", 1]], true],
        "Rich": [false, [["emotemakeitrain@animation", "emotemakeitrain_clip", 1]], true],
        "Лузер 2": [false, [["emotethumbsdown@animation", "emotethumbsdown_clip", 1]], true],
        "Лузер 3": [false, [["loosers@animation", "loosers_clip", 1]], true],
        "Хай-кик": [false, [["mmakick@animation", "mmakick_clip", 1]], true],


        "Стрелять": [false, [["timetable@ron@ig_4", "ig_4_idle_b", 1],
                            ["timetable@ron@ig_4", "ig_4_idle_a", 1],
                            ["timetable@ron@ig_4", "ig_4_idle_c", 1],
                        ], false],
        "Кинуть гранату": [false, [["timetable@trevor@grenade_throwing", "grenade_throwing_trev", 1]], false],

        "Прыжок": [false, [["veh@bike@chopper@front@ps", "jump_out", 1]], false],
    },  
    
    "Социальные": {        
        "Отдышаться": [false, [["timetable@reunited@ig_2", "jimmy_base", 1]], true],
        "Смотреть в бинокль": [false, "WORLD_HUMAN_BINOCULARS", false],
        "Чинить ТС": [false, [["mini@repair", "fixing_a_ped", 1]], true],

        "Поклон": [false, [["anim@mp_player_intcelebrationpaired@f_f_sarcastic", "sarcastic_right", 1]], false],

        "Хлопать в ладоши": [true, "WORLD_HUMAN_CHEERING", true],
        "Хлопать в ладоши (+)": [true, [["amb@world_human_cheering@female_d", "base", 1]], true],
        "Хлопать в ладоши 2": [false, [["amb@world_human_cheering@male_a", "base", 1]], true],
        "Хлопать в ладоши 3": [false, [["amb@world_human_cheering@male_d", "base", 1]], true],

        "Махать руками (+)": [true, [["random@car_thief@victimpoints_ig_3", "arms_waving", 1]], true],

        "Снимать на телефон": [false, "WORLD_HUMAN_MOBILE_FILM_SHOCKING", true],
        "Записывать на телефон": [false, "WORLD_HUMAN_TOURIST_MOBILE", true],
        "Сидеть в телефоне": [false, "WORLD_HUMAN_STAND_MOBILE", true],

        "Участие в разговоре": [false, "WORLD_HUMAN_HANG_OUT_STREET", true],
        "Участие в разговоре 2": [false, "WORLD_HUMAN_HANG_OUT_STREET_CLUBHOUSE", true],
        "Светить фонариком (М)": [false, "WORLD_HUMAN_SECURITY_SHINE_TORCH", true],

        "Facepalm": [false, [["anim@mp_player_intcelebrationmale@face_palm", "face_palm", 1]], false],

        "Ожидать": [false, "WORLD_HUMAN_STAND_IMPATIENT_UPRIGHT", true],
        "Ожидать 2": [false, "CODE_HUMAN_CROSS_ROAD_WAIT", true],
        "Ожидать 3": [false, [["friends@", "pickupwait", 1]], true],

        "Смотреть карту": [false, "WORLD_HUMAN_TOURIST_MAP", true],
        "Йоу! Васап!": [false, [["special_ped@clinton@convo_1@convo_1a", "im_in_hell_0", 1],
                                ["special_ped@clinton@convo_1@convo_1b", "im_in_hell_1", 1]], false],
        "Точняк!": [false, [["special_ped@clinton@convo_2@convo_2b", "living_in_this_plastic_1", 1]], false],
        "Ты абсолютно прав!": [false, [["special_ped@clinton@convo_5@convo_5a", "you_dont_give_a_0", 1],
                                        ["special_ped@clinton@convo_5@convo_5b", "you_dont_give_a_1", 1]], false],

        "Возмущение": [false, [["special_ped@impotent_rage@convo_2@convo_2a", "i_wanna_do_hamlet_0", 1]], false],
        "Возмущение 2": [false, [["special_ped@impotent_rage@convo_3@convo_3a", "having_about_as_much_0", 1]], false],
        "Паралич": [false, [["stungun@standing", "damage", 1]], true],
        "Паралич 2": [false, [["ragdoll@human", "electrocute", 1]], false],
        "Страх": [false, [["anim@heists@fleeca_bank@hostages@ped_d@", "flinch_under_fire_outro", 1]], true],
        "Потянуться (+)": [true, [["switch@franklin@bed", "stretch_long", 1]], false],
        "Свистнуть (+)": [true, [["taxi_hail", "hail_taxi", 1]], false],
        "Свистнуть 2 (+)": [true, [["rcmnigel1c", "hailing_whistle_waive_a", 1]], false],
        "Дрочка (+)": [true, [["amb@code_human_in_car_mp_actions@wank@bodhi@rps@", "idle_a", 1]], true],

        "Радоваться": [false, [["amb@world_human_cheering@female_b", "base", 1]], true],
        "Радоваться 2": [false, [["amb@world_human_cheering@female_c", "base", 1]], true],
        "Радоваться 3": [false, [["amb@world_human_cheering@male_b", "base", 1]], true],

        "Показать мышцы": [false, [["amb@world_human_muscle_flex@arms_at_side@idle_a", "idle_c"]], true],
        "Показать мышцы 2": [false, [["amb@world_human_muscle_flex@arms_in_front@idle_a", "idle_a"]], true], 
        "Показать мышцы 3": [false, "WORLD_HUMAN_MUSCLE_FLEX", true],    
        
        "Греть руки (М)": [false, "WORLD_HUMAN_STAND_FIRE", false], 
        "Подстрелен": [false, [["anim@heists@prison_heistig_5_p1_rashkovsky_idle", "idle_180", 1]], true], 

        "Секс (М)": [false, [["timetable@trevor@skull_loving_bear", "skull_loving_bear", 1]], true], 


        "Самоубийство": [false, [["mp_suicide", "pistol", 1]], false],

        "Тебе туда": [false, [["emoteclapperboard@animation", "emoteclapperboard_clip", 1]], true],
        "Пыль": [false, [["emotedustoffshoulders@animation", "emotedustoffshoulders_clip", 1]], true],


    },

    "Служебные": {
        "Фотограф (+)": [true, [["amb@world_human_paparazzi@male@enter", "enter", 1], ["amb@world_human_paparazzi@male@base", "base", 1]], true],
        "Фотограф 1": [false, [["amb@world_human_paparazzi@male@idle_a", "idle_a", 1], 
                                ["amb@world_human_paparazzi@male@idle_a", "idle_b", 1], 
                                ["amb@world_human_paparazzi@male@idle_a", "idle_c", 1]], true],
        "Видео-запись (+)": [true, [["rcmpaparazzo_4", "gesture_to_cam_camman", 1]], true],

        "Отдать честь (+)": [true, [["mp_player_int_uppersalute", "mp_player_int_salute", 1]], true],
        "Запись в блокнот": [true, "WORLD_HUMAN_CLIPBOARD_FACILITY", true],
        "Запись в блокнот 2": [true, "CODE_HUMAN_MEDIC_TIME_OF_DEATH", true],
        "Запись в блокнот (+)": [true, [["amb@medic@standing@timeofdeath@base", "base", 1]], true],
        "Руки на пояс. Шериф (+)": [true, [["amb@code_human_wander_idles_cop@male@static", "static", 1]], true],
        "Руки на пояс. Коп (+)": [true, [["amb@code_human_wander_idles_cop@female@static", "static", 1]], true],       
        "Осмотреть землю": [false, "CODE_HUMAN_MEDIC_KNEEL", true],
        "Взаимодействие с телом": [false, "CODE_HUMAN_MEDIC_TEND_TO_DEAD", true], 
        "Операция (+)": [true, [["amb@medic@standing@tendtodead@enter", "enter ", 1], ["amb@medic@standing@tendtodead@idle_a", "idle_a", 1]], true],
        "Сбор в сумку": [false, [["anim@heists@money_grab@duffel", "loop", 1]], true],
        "Копать яму": [false, [["missmic1leadinoutmic_1_mcs_2", "_leadin_trevor", 1]], true],
    },

    "Танцы": {
        "Чечетка": [false, [["special_ped@mountain_dancer@monologue_1@monologue_1a", "mtn_dnc_if_you_want_to_get_to_heaven", 1]], true],
        "Чечетка 2": [false, [["special_ped@mountain_dancer@monologue_2@monologue_2a", "mnt_dnc_angel", 1]], true],
        "Чечетка 3": [false, [["special_ped@mountain_dancer@monologue_3@monologue_3a", "mnt_dnc_buttwag", 1]], true],

        "Пританцовывать": [false, [["amb@world_human_partying@female@partying_beer@base", "base", 1]], true],
        "Пританцовывать 2": [false, [["amb@world_human_strip_watch_stand@male_a@idle_a", "idle_c"]], true],
        "Танец тигра": [false, [["rcmnigel1bnmt_1b", "dance_intro_tyler", 1], ["rcmnigel1bnmt_1b", "dance_loop_tyler", 1]], true],
        "Танец пингвина": [false, [["move_clown@p_m_two_idles@", "fidget_short_dance", 1]], true],
        "Тектоник": [false, [["misschinese2_crystalmazemcs1_cs", "dance_loop_tao", 1]], true],

        "Подвижный танец": [false, [["timetable@tracy@ig_5@idle_a", "idle_a", 1]], true],
        "Подвижный танец 2": [false, [["timetable@tracy@ig_5@idle_a", "idle_b", 1]], true],
        "Подвижный танец 3": [false, [["timetable@tracy@ig_5@idle_a", "idle_c", 1]], true],
        "Подвижный танец 4": [false, [["timetable@tracy@ig_5@idle_b", "idle_e", 1]], true],
        "Подвижный танец 5": [false, [["timetable@tracy@ig_5@idle_b", "idle_d", 1]], true],
        "Подвижный танец 6": [false, [["timetable@tracy@ig_8@idle_a", "idle_a", 1]], true],

        "Мини Стриптиз": [false, [["amb@world_human_prostitute@cokehead@idle_a", "idle_b", 1],
                                ["amb@world_human_prostitute@cokehead@idle_a", "idle_c", 1],
                                ["amb@world_human_prostitute@cokehead@idle_a", "idle_a", 1],
                            ], true],
        
        "Приватный танец": [false, [["mini@strip_club@private_dance@part1", "priv_dance_p1", 1]], true],
        "Приватный танец 2": [false, [["mini@strip_club@private_dance@part2", "priv_dance_p2", 1]], true],
        "Приватный танец 3": [false, [["mini@strip_club@private_dance@part3", "priv_dance_p3", 1]], true],
        "Приватный танец 4": [false, [["mini@strip_club@lap_dance@ld_girl_a_song_a_p1", "ld_girl_a_song_a_p1_f", 1]], true],
        "Тверк": [false, [
            ["switch@trevor@mocks_lapdance", "001443_01_trvs_28_exit_stripper", 1],
            ["switch@trevor@mocks_lapdance", "001443_01_trvs_28_idle_stripper", 1],
        ], true],

        "Стриптиз": [false, [["mp_am_stripper", "lap_dance_girl", 1]], true],

        "Брейк 1": [false, [["breakdanceending1@animation", "breakdanceending1_clip", 1]], true],
        "Брейк 2": [false, [["breakdanceending3@animation", "breakdanceending3_clip", 1]], true],
        "Брейк 3": [false, [["breakdancefreezes@animation", "breakdancefreezes_clip", 1]], true],
        "Брейк 4": [false, [["breakdancefreezevar2@animation", "breakdancefreezevar2_clip", 1]], true],
        "Брейк 5": [false, [["breakdancefreezevar4@animation", "breakdancefreezevar4_clip", 1]], true],
        "Брейк 6": [false, [["breakdanceuprockvar2@animation", "breakdanceuprockvar2_clip", 1]], true],
        "Брейк 7": [false, [["brooklynuprock@animation", "brooklynuprock_clip", 1]], true],
        "Брейк 8": [false, [["dancemoves@animation", "dancemoves_clip", 1]], true],
        "Брейк 9": [false, [["dancingrunningman@animation", "dancingrunningman_clip", 1]], true],
        "Брейк 10": [false, [["northernsoulspincombo@animation", "northernsoulspincombo_clip", 1]], true],
        "Танец утят": [false, [["chickendance@animation", "chickendance_clip", 1]], true],
        "Макарена": [false, [["dancemakarena@animation", "dancemakarena_clip", 1]], true],
        "Twerk": [false, [["dancetwerk@animation", "dancetwerk_clip", 1]], true],
        "Шафл": [false, [["electroshuffle@animation", "electroshuffle_clip", 1]], true],
        "Диско": [false, [["emotedancedisco@animation", "emotedancedisco_clip", 1]], true],
        "Робот 2": [false, [["emoterobotdance@animation", "emoterobotdance_clip", 1]], true],
        "На хайпе": [false, [["emotedanceshootcmf@animation", "emotedanceshootcmf_clip", 1]], true],
        "Волна": [false, [["hiphophand@animation", "hiphophand_clip", 1]], true],
        "Крутиться на одной руке": [false, [["breackdnace1990@animation", "breackdnace1990_clip", 1]], true],


    },

    "Позы": {
        "Охранник": [false, "WORLD_HUMAN_GUARD_STAND", false],
        "Охранник (+)": [true, [["switch@michael@rejected_entry", "001396_01_mics3_6_rejected_entry_idle_bouncer"]], true],  
        "Охранник 2": [false, "WORLD_HUMAN_GUARD_STAND", false],      

        "Руки на пояс": [false, [["special_ped@impotent_rage@base", "base", 1]], true], 
        "Руки на пояс 2": [false, [["timetable@amanda@ig_3", "ig_3_base_tracy", 1]], true],
        "Руки на пояс 3 (+)": [true, [["special_ped@impotent_rage@base", "base", 1]], true],

        "Руки вверх (+)": [true, [["switch@trevor@bear_in_floyds_face", "bear_in_floyds_face_loop_floyd", 1]], true], 
        "Руки вверх 2 (+)": [true, [["mp_am_hold_up", "handsup_base", 1]], true], 
        "Руки за спину (+)": [true, [["anim@miss@low@fin@vagos@", "idle_ped06", 1]], true], 
        "Руки за голову (+)": [true, [["busted", "idle_a", 1]], true], 

        "Скромняга": [false, [["special_ped@jane@base", "base", 1]], true],   
        "Опереться на левый локоть": [false, [["special_ped@mime@intro", "idle_intro", 1], 
                                        ["special_ped@mime@base", "base", 1]], true],
        "Скрестить руки (+)": [true, [["switch@franklin@lamar_tagging_wall", "lamar_tagging_wall_loop_franklin", 1]], true],
        "Скрестить руки 2 (+)": [true, [["amb@world_human_cop_idles@female@idle_b", "idle_e", 1]], true],
        "Скрестить руки 3 (+)": [true, [["anim@heists@heist_corona@single_team", "single_team_intro_boss", 1]], true],
        "Скрестить руки 4 (+)": [true, [["amb@world_human_hang_out_street@female_arms_crossed@base", "base", 1]], true],
        "Скрестить руки 5 (+)": [true, [["rcmme_amanda1", "stand_loop_cop", 1]], true],

        "Облокотиться на авто": [false, [["switch@michael@sitting_on_car_bonnet", "sitting_on_car_bonnet_loop", 1]], true],
        "Облокотиться на стену 1": [false, [["amb@lo_res_idles@", "world_human_lean_male_legs_crossed_lo_res_base", 1]], true],
        "Облокотиться на стену 2": [false, [["amb@lo_res_idles@", "world_human_lean_male_foot_up_lo_res_base", 1]], true],
        "Облокотиться на стену 3": [false, "WORLD_HUMAN_LEANING", false],
        "Облокотиться вперед": [false, "PROP_HUMAN_BUM_SHOPPING_CART", false],

        "Лежать в страхе": [false, [["anim@heists@ornate_bank@hostages@hit", "hit_loop_ped_a", 1]], true],
        "Лежать на правом боку": [false, [["amb@world_human_bum_slumped@male@laying_on_right_side@idle_a", "idle_a", 1]], true],
        "Лечь на живот": [false, "WORLD_HUMAN_SUNBATHE", false],        
        "Лечь на живот. Отдых": [false, [["amb@world_human_sunbathe@female@front@idle_a", "idle_c", 1]], true],        
        "Лечь на спину. Отдых": [false, "WORLD_HUMAN_SUNBATHE_BACK", false], 
        "Лечь на спину. Загар": [false, [["amb@world_human_sunbathe@female@back@idle_a", "idle_a", 1]], true],  
        "Лечь на спину. Ранен": [false, [["combat@damage@rb_writhe", "rb_writhe_loop", 1]], true],  

        "Проститутка High Class": [false, "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS", false],        
        "Проститутка Low Class": [false, "WORLD_HUMAN_PROSTITUTE_LOW_CLASS", false],

        "Ползти на спине": [false, [["move_crawl", "onback_fwd", 1]], true],
        "Ползти на животе": [false, [["move_crawl", "onfront_fwd", 1]], true],
    },

    "Сидеть": {
        "Обычный": [false, "PROP_HUMAN_SEAT_BENCH", false],
        "Обычный 2": [false, [["rcmtmom_1leadinout", "tmom_1_rcm_p3_leadout_loop", 1]], true],
        "Расслабленно": [false, [["timetable@ron@ig_5_p3", "ig_5_p3_base", 1]], true],
        "Облокотившись вперед": [false, [["switch@michael@tv_w_kids", "001520_02_mics3_14_tv_w_kids_idle_mic", 1]], true],
        "Облокотившись вперед 2": [false, [["timetable@ron@ig_3_couch", "base", 1]], true],
        "Задумавшись": [false, [["anim@amb@business@cfid@cfid_desk_no_work_bgen_chair_no_work@", "sleep_cycle_lazyworker", 1]], true],
        "Делая маникюр": [false, [["timetable@tracy@famr_ig_5", "famr_ig_5_iamabouttocrackthis", 1], 
                                    ["timetable@tracy@famr_ig_5", "famr_ig_5_iamtotallyontop", 1],
                                    ["timetable@tracy@famr_ig_5", "famr_ig_5_iamtryingtoconcentrate", 1],
                                    ["timetable@tracy@famr_ig_5", "famr_ig_5_thiscollegestuff", 1],
                                ], true],

        "Сидеть. Руки за голову": [false, [["busted", "idle_a", 1]], true], 
        "Сидеть. Руки вверх": [false, [["rcmminute2", "kneeling_arrest_idle", 1]], true], 

        "Сидеть в страхе": [false, [["amb@code_human_cower@male@react_cowering", "base_left", 1]], true],   
        "Сесть на колено": [false, [["amb@medic@standing@kneel@enter", "enter", 1], 
                                ["amb@medic@standing@kneel@base", "base", 1]
                            ], true],
        "Сесть на колено 2": [false, [["amb@medic@standing@tendtodead@base", "base", 1]], true],
        "Сесть на колено 3": [false, [["amb@world_human_bum_wash@male@low@idle_a", "idle_a", 1]], true],
        "Аккуратно сесть на колено": [false, [["special_ped@mani@trevor_1@trevor_1h", "convo_trevor_whahellholaamigo_7", 1], 
                                        ["special_ped@mani@trevor_1@trevor_1i", "convo_trevor_whahellholaamigo_8", 1],
                                    ], true],
        "Сесть на левое бедро": [false, [["amb@world_human_picnic@female@base", "base", 1],
                                ["amb@world_human_picnic@female@idle_a", "idle_a", 1],
                                ["amb@world_human_picnic@female@idle_a", "idle_c", 1],
                                ["amb@world_human_picnic@female@idle_a", "idle_b", 1],
                                ], true],
        // "Сесть. Пикник": [false, "WORLD_HUMAN_PICNIC", true],
        // "Сесть. Пикник 2": [false, [["rcm_barry3", "barry_3_sit_loop", 1]], true],
        "Сесть, поджав колени": [false, [["anim@amb@business@bgen@bgen_no_work@", "sit_phone_phoneputdown_fallasleep_nowork", 1]], true],
    },

    "Монологи": {
        "Спасение близко...": [false, [["special_ped@baygor@monologue_6@monologue_6a", "salvation_comes_at_a_price_0", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6b", "salvation_comes_at_a_price_1", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6c", "salvation_comes_at_a_price_2", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6d", "salvation_comes_at_a_price_3", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6e", "salvation_comes_at_a_price_4", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6f", "salvation_comes_at_a_price_5", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6g", "salvation_comes_at_a_price_6", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6h", "salvation_comes_at_a_price_7", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6i", "salvation_comes_at_a_price_8", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6j", "salvation_comes_at_a_price_9", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6k", "salvation_comes_at_a_price_10", 1],
                                    ["special_ped@baygor@monologue_6@monologue_6l", "salvation_comes_at_a_price_11", 1],
                                ], false],
        "Хотите быть счастливым": [false, [["special_ped@baygor@monologue_7@monologue_7a", "do_you_want_happiness_0", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7b", "do_you_want_happiness_1", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7c", "do_you_want_happiness_2", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7d", "do_you_want_happiness_3", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7e", "do_you_want_happiness_4", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7f", "do_you_want_happiness_5", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7g", "do_you_want_happiness_6", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7h", "do_you_want_happiness_7", 1],
                                            ["special_ped@baygor@monologue_7@monologue_7i", "do_you_want_happiness_8", 1],
                                    ], false],
        "Я эпсилонист": [false, [["special_ped@baygor@monologue_8@monologue_8a", "im_an_epsilonist_0", 1],
                                ["special_ped@baygor@monologue_8@monologue_8b", "im_an_epsilonist_1", 1],
                                ["special_ped@baygor@monologue_8@monologue_8c", "im_an_epsilonist_2", 1],
                                ["special_ped@baygor@monologue_8@monologue_8d", "im_an_epsilonist_3", 1],
                                ["special_ped@baygor@monologue_8@monologue_8e", "im_an_epsilonist_4", 1],
                                ["special_ped@baygor@monologue_8@monologue_8f", "im_an_epsilonist_5", 1],
                                ["special_ped@baygor@monologue_8@monologue_8g", "im_an_epsilonist_6", 1],
                                ["special_ped@baygor@monologue_8@monologue_8h", "im_an_epsilonist_7", 1],
                                ["special_ped@baygor@monologue_8@monologue_8i", "im_an_epsilonist_8", 1],
                                ["special_ped@baygor@monologue_8@monologue_8j", "im_an_epsilonist_9", 1],
                        ], false],
        "Такова жизнь...": [false, [["special_ped@bill@monologue_4@monologue_4a", "bill_ig_1_b_01_imofferingironclad_0", 1],
                                    ["special_ped@bill@monologue_4@monologue_4b", "bill_ig_1_b_01_imofferingironclad_1", 1],
                                    ["special_ped@bill@monologue_4@monologue_4c", "bill_ig_1_b_01_imofferingironclad_2", 1],
                                    ["special_ped@bill@monologue_4@monologue_4d", "bill_ig_1_b_01_imofferingironclad_3", 1],
                                    ["special_ped@bill@monologue_4@monologue_4e", "bill_ig_1_b_01_imofferingironclad_4", 1],
                                    ["special_ped@bill@monologue_4@monologue_4f", "bill_ig_1_b_01_imofferingironclad_5", 1],
                                    ["special_ped@bill@monologue_4@monologue_4g", "bill_ig_1_b_01_imofferingironclad_6", 1],
                            ], false],
        "Марионетка": [false, [["special_ped@clinton@monologue_10@monologue_10a", "this_country_used_to_0", 1],
                                ["special_ped@clinton@monologue_10@monologue_10b", "this_country_used_to_1", 1],
                                ["special_ped@clinton@monologue_10@monologue_10c", "this_country_used_to_2", 1],
                                ["special_ped@clinton@monologue_10@monologue_10d", "this_country_used_to_3", 1],
                            ], false],
        "Когда ты глубоко": [false, [["special_ped@clinton@monologue_11@monologue_11a", "when_your_deep_in_0", 1],
                            ["special_ped@clinton@monologue_11@monologue_11b", "when_your_deep_in_1", 1],
                            ["special_ped@clinton@monologue_11@monologue_11c", "when_your_deep_in_2", 1],
                        ], false],
        "Этот монстр возвращается": [false, [["special_ped@clinton@monologue_13@monologue_13a", "charlies_coming_back_0", 1],
                                            ["special_ped@clinton@monologue_13@monologue_13b", "charlies_coming_back_1", 1],
                                            ["special_ped@clinton@monologue_13@monologue_13c", "charlies_coming_back_2", 1],
                                            ], false],
        "Знаешь что...": [false, [["special_ped@clinton@monologue_14@monologue_14a", "you_know_what_they_0", 1],
                                            ["special_ped@clinton@monologue_14@monologue_14b", "you_know_what_they_1", 1],
                                            ["special_ped@clinton@monologue_14@monologue_14c", "you_know_what_they_2", 1],
                                            ["special_ped@clinton@monologue_14@monologue_14d", "you_know_what_they_3", 1],
                                            ["special_ped@clinton@monologue_14@monologue_14e", "you_know_what_they_4", 1],
                                            ["special_ped@clinton@monologue_14@monologue_14f", "you_know_what_they_5", 1],
                                   ], false],
        "Они убьют вас...": [false, [["special_ped@clinton@monologue_2@monologue_2a", "theyll_kill_ya_0", 1],
                                   ["special_ped@clinton@monologue_2@monologue_2b", "theyll_kill_ya_1", 1],
                                   ["special_ped@clinton@monologue_2@monologue_2c", "theyll_kill_ya_2", 1],
                                   ["special_ped@clinton@monologue_2@monologue_2d", "theyll_kill_ya_3", 1],
                                   ["special_ped@clinton@monologue_2@monologue_2e", "theyll_kill_ya_4", 1],
                                 ], false],
        "Мы здесь власть!": [false, [["special_ped@griff@monologue_1@monologue_1a", "iamnotaracist_0", 1],
                                 ["special_ped@griff@monologue_1@monologue_1b", "iamnotaracist_1", 1],
                                 ["special_ped@griff@monologue_1@monologue_1c", "iamnotaracist_2", 1],
                                 ["special_ped@griff@monologue_1@monologue_1d", "iamnotaracist_3", 1],
                                 ["special_ped@griff@monologue_1@monologue_1e", "iamnotaracist_4", 1],
                                 ["special_ped@griff@monologue_1@monologue_1f", "iamnotaracist_5", 1],
                                 ["special_ped@griff@monologue_1@monologue_1g", "iamnotaracist_6", 1],
                                 ["special_ped@griff@monologue_1@monologue_1h", "iamnotaracist_7", 1],
                               ], false],
        "Ты думаешь я хуже него": [false, [["special_ped@jerome@monologue_2@monologue_2a", "iamyourtruesalvation_0", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2b", "iamyourtruesalvation_1", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2c", "iamyourtruesalvation_2", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2d", "iamyourtruesalvation_3", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2e", "iamyourtruesalvation_4", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2f", "iamyourtruesalvation_5", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2g", "iamyourtruesalvation_6", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2h", "iamyourtruesalvation_7", 1],
                                            ["special_ped@jerome@monologue_2@monologue_2i", "iamyourtruesalvation_8", 1],
                                        ], false],
    },
};

export const WALKING_STYLES: { name: string, animSet: string }[] = [
    { name: 'Стандартная', animSet: null },
    { name: 'Инопланетная', animSet: 'move_m@alien' },
    { name: 'Деревянная', animSet: 'anim_group_move_ballistic' },
    { name: 'Расслабленная', animSet: 'move_f@arrogant@a' },
    { name: 'Рама', animSet: 'move_m@brave' },
    { name: 'Уверенная 2', animSet: 'move_m@casual@a' },
    { name: 'Странная', animSet: 'move_m@casual@b' },
    { name: 'Торопыга', animSet: 'move_m@casual@c' },
    { name: 'Спокойная', animSet: 'move_m@casual@d' },
    { name: 'Вольяжная', animSet: 'move_m@casual@e' },
    { name: 'Стриптизёрша', animSet: 'move_f@chichi' },
    { name: 'Официальная', animSet: 'move_m@confident' },
    { name: 'Официальная 2', animSet: 'move_m@business@a' },
    { name: 'Женственная', animSet: 'move_f@multiplayer' },
    { name: 'Мужественная', animSet: 'move_m@multiplayer' },
    { name: 'Пьяная', animSet: 'move_m@drunk@a' },
    { name: 'Пошатываюшееся', animSet: 'move_m@drunk@slightlydrunk' },
    { name: 'Сильно пьяный', animSet: 'move_m@drunk@verydrunk' },
    { name: 'Женственная 2', animSet: 'move_f@femme@' },
    { name: 'Бык', animSet: 'move_characters@franklin@fire' },
    { name: 'Женственная 3', animSet: 'move_f@flee@a' },
    { name: 'Уверенная 3', animSet: 'move_p_m_one' },
    { name: 'Гангстер 1', animSet: 'move_m@gangster@generic' },
    { name: 'Пожилая', animSet: 'move_m@gangster@var_e' },
    { name: 'Грустная', animSet: 'move_m@gangster@var_f' },
    { name: 'Торопыга 2', animSet: 'move_m@gangster@var_i' },
    { name: 'Дёрганная', animSet: 'anim@move_m@grooving@' },
    { name: 'Стриптизёрша 2', animSet: 'move_f@heels@c' },
    { name: 'Гангстер 2', animSet: 'move_m@hipster@a' },
    { name: 'Аккуратный', animSet: 'move_f@hurry@a' },
    { name: 'Рама 2', animSet: 'move_p_m_zero_janitor' },
    { name: 'Гангстер 3', animSet: 'move_p_m_zero_slow' },
    { name: 'Стриптизёрша 3', animSet: 'move_f@maneater' },
    { name: 'Гангстер 4', animSet: 'move_m@money' },
    { name: 'На чилле', animSet: 'move_m@muscle@a' },
    { name: 'Женственная 4', animSet: 'move_f@posh@' },
    { name: 'Беговая', animSet: 'move_m@quick' },
    { name: 'Тильт', animSet: 'move_m@sad@a' },
    { name: 'Испуганная', animSet: 'move_f@scared' },
    { name: 'Сэкси', animSet: 'move_f@sexy@a' },
    { name: 'Гангстер 5', animSet: 'move_m@shadyped@a' },
    { name: 'Свэг', animSet: 'move_m@swagger' },
    { name: 'Бык 2', animSet: 'move_p_m_two' },
    { name: 'Толстая', animSet: 'move_m@bag' },
]