export type FurnitureCategory =
    'wardrobe'
    | 'bed'
    | 'chest'
    | 'chair'
    | 'table'
    | 'armchair'
    | 'sofa'
    | 'lamp'
    | 'decor'
    | 'plumbing'
    | 'none';
export const FurnitureAllCategories: FurnitureCategory[] = [
    'wardrobe',
    'bed',
    'chest',
    'chair',
    'table',
    'armchair',
    'sofa',
    'lamp',
    'decor',
    'plumbing'
]

export const FurnitureCategoryNames: any = {
    'wardrobe': "Шкафы",
    'bed': "Кровати",
    'chest': "Комоды",
    'chair': "Стулья",
    'table': "Столы",
    'armchair': "Кресла",
    'sofa': "Диваны",
    'lamp': "Светильники",
    'decor': "Декорации",
    'plumbing': "Сантехника"
}

export interface IFurnitureItem {
    id: number
    name: string
    prop: string
    cost: number
    cat: FurnitureCategory
}

export const furnitureList: IFurnitureItem[] = [
    {
        id: 0,
        name: 'Угловой диван серый',
        prop: 'apa_mp_h_stn_sofacorn_01',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 1,
        name: 'Угловой диван синий',
        prop: 'apa_mp_h_stn_sofacorn_05',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 2,
        name: 'Угловой диван зеленый',
        prop: 'apa_mp_h_stn_sofacorn_06',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 3,
        name: 'Угловой диван темно синий',
        prop: 'apa_mp_h_stn_sofacorn_07',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 4,
        name: 'Угловой диван кожанный серый',
        prop: 'apa_mp_h_stn_sofacorn_08',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 5,
        name: 'Угловой диван кожанный черный',
        prop: 'apa_mp_h_stn_sofacorn_09',
        cost: 100000,
        cat: 'sofa'
    },
    {
        id: 6,
        name: 'Угловой диван белый',
        prop: 'apa_mp_h_stn_sofacorn_10',
        cost: 110000,
        cat: 'sofa'
    },
    {
        id: 7,
        name: 'Коричневый лежак',
        prop: 'apa_mp_h_stn_sofa_daybed_01',
        cost: 35000,
        cat: 'armchair'
    },
    {
        id: 8,
        name: 'Черный лежак',
        prop: 'apa_mp_h_stn_sofa_daybed_02',
        cost: 30000,
        cat: 'armchair'
    },
    {
        id: 9,
        name: 'Длинный диван белый',
        prop: 'apa_mp_h_yacht_sofa_01',
        cost: 50000,
        cat: 'sofa'
    },
    {
        id: 10,
        name: 'Диван коричневый',
        prop: 'apa_mp_h_yacht_sofa_02',
        cost: 30000,
        cat: 'sofa'
    },
    // {
    //     id: 11,
    //     name: 'Диван коричневый офисный',
    //     prop: 'apa_mp_h_yacht_sofa_01',
    //     cost: 50000,
    //     cat: 'sofa'
    // },
    {
        id: 12,
        name: 'Диван черный офисный',
        prop: 'bkr_prop_clubhouse_sofa_01a',
        cost: 35000,
        cat: 'sofa'
    },
    {
        id: 13,
        name: 'Диван серый клетчатый офисный',
        prop: 'ex_mp_h_off_sofa_003',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 14,
        name: 'Диван белый клетчатый офисный',
        prop: 'ex_mp_h_off_sofa_01',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 15,
        name: 'Диван черный клетчатый офисный',
        prop: 'ex_mp_h_off_sofa_02',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 16,
        name: 'Лофтовый бежевый диван',
        prop: 'hei_heist_stn_sofa2seat_03',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 17,
        name: 'Лофтовый коричневый диван',
        prop: 'hei_heist_stn_sofa2seat_06',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 18,
        name: 'Простой серый диван',
        prop: 'hei_heist_stn_sofa3seat_01',
        cost: 20000,
        cat: 'sofa'
    },
    {
        id: 19,
        name: 'Простой шоколадный диван',
        prop: 'hei_heist_stn_sofa3seat_02',
        cost: 25000,
        cat: 'sofa'
    },
    {
        id: 20,
        name: 'Домашний серый диван',
        prop: 'hei_heist_stn_sofa3seat_06',
        cost: 25000,
        cat: 'sofa'
    },
    {
        id: 21,
        name: 'Угловой синий диван',
        prop: 'hei_heist_stn_sofacorn_05',
        cost: 70000,
        cat: 'sofa'
    },
    {
        id: 22,
        name: 'Белая раскладушка',
        prop: 'prop_t_sofa_02',
        cost: 40000,
        cat: 'bed'
    },
    {
        id: 23,
        name: 'Терасный диван серый',
        prop: 'prop_yaught_sofa_01',
        cost: 20000,
        cat: 'sofa'
    },
    {
        id: 24,
        name: 'Угловой белый диван',
        prop: 'p_lev_sofa_s',
        cost: 70000,
        cat: 'sofa'
    },
    {
        id: 25,
        name: 'Турецкий узорный диван',
        prop: 'p_res_sofa_l_s',
        cost: 50000,
        cat: 'sofa'
    },
    // {
    //     id: 26,
    //     name: 'Уютный белый домашний диван',
    //     prop: 'p_sofa_s',
    //     cost: 1,
    //     cat: 'sofa'
    // },
    {
        id: 27,
        name: 'Офисный кожанный диван коричневый',
        prop: 'p_v_med_p_sofa_s',
        cost: 40000,
        cat: 'sofa'
    },
    {
        id: 28,
        name: 'Терасный диван в полоску',
        prop: 'p_yacht_sofa_01_s',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 29,
        name: 'Уютный домашний синий диван',
        prop: 'v_res_tre_sofa_s',
        cost: 30000,
        cat: 'sofa'
    },
    {
        id: 30,
        name: 'Белая тумба с телевизором',
        prop: 'apa_mp_h_str_avunitl_04',
        cost: 150000,
        cat: 'chest'
    },
    {
        id: 31,
        name: 'Черная тумба с телевизором и желтыми колонками',
        prop: 'apa_mp_h_str_avunitm_01',
        cost: 120000,
        cat: 'chest'
    },
    {
        id: 32,
        name: 'Черная тумба с телевизором и белыми колонками',
        prop: 'apa_mp_h_str_avunitm_03',
        cost: 120000,
        cat: 'chest'
    },
    {
        id: 33,
        name: 'Обычная тумба с телевизором',
        prop: 'apa_mp_h_str_avunits_01',
        cost: 100000,
        cat: 'chest'
    },
    {
        id: 34,
        name: 'Необычная тумба с телевизором',
        prop: 'apa_mp_h_str_avunits_04',
        cost: 110000,
        cat: 'chest'
    },
    {
        id: 35,
        name: 'Тумба с телевизором и большой аудиосистемой',
        prop: 'hei_heist_str_avunitl_03',
        cost: 170000,
        cat: 'chest'
    },
    {
        id: 36,
        name: 'Белая тумба 1',
        prop: 'apa_mp_h_str_sideboardl_06',
        cost: 30000,
        cat: 'chest'
    },
    {
        id: 37,
        name: 'Коричневая тумба',
        prop: 'apa_mp_h_str_sideboardl_11',
        cost: 10000,
        cat: 'chest'
    },
    {
        id: 38,
        name: 'Песочная тумба',
        prop: 'apa_mp_h_str_sideboardl_09',
        cost: 40000,
        cat: 'chest'
    },
    {
        id: 39,
        name: 'Серая тумба 1',
        prop: 'apa_mp_h_str_sideboardl_13',
        cost: 25000,
        cat: 'chest'
    },
    {
        id: 40,
        name: 'Коричнево белая тумба',
        prop: 'apa_mp_h_str_sideboardl_14',
        cost: 20000,
        cat: 'chest'
    },
    {
        id: 41,
        name: 'Древесная тумба',
        prop: 'apa_mp_h_str_sideboardm_02',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 42,
        name: 'Белая тумба 2',
        prop: 'apa_mp_h_str_sideboardm_03',
        cost: 30000,
        cat: 'chest'
    },
    {
        id: 43,
        name: 'Бело серая тумба',
        prop: 'apa_mp_h_str_sideboards_01',
        cost: 20000,
        cat: 'chest'
    },
    {
        id: 44,
        name: 'Стеклянный стол',
        prop: 'apa_mp_h_str_sideboards_02',
        cost: 25000,
        cat: 'table'
    },
    {
        id: 45,
        name: 'Серая тумба 2',
        prop: 'hei_heist_str_sideboardl_02',
        cost: 20000,
        cat: 'chest'
    },
    {
        id: 46,
        name: 'Дубовая тумба',
        prop: 'hei_heist_str_sideboardl_03',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 47,
        name: 'Синяя тумба',
        prop: 'hei_heist_str_sideboardl_04',
        cost: 30000,
        cat: 'chest'
    },
    {
        id: 48,
        name: 'Серо белая тумба',
        prop: 'hei_heist_str_sideboardl_05',
        cost: 25000,
        cat: 'chest'
    },
    {
        id: 49,
        name: 'Стеклянный стол',
        prop: 'hei_heist_str_sideboards_02',
        cost: 25000,
        cat: 'table'
    },
    {
        id: 50,
        name: 'Фиолетовая тумба',
        prop: 'apa_mp_h_bed_chestdrawer_02',
        cost: 30000,
        cat: 'chest'
    },
    {
        id: 51,
        name: 'Древесная тумба',
        prop: 'hei_heist_bed_chestdrawer_04',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 52,
        name: 'Кухонный белый стул',
        prop: 'apa_mp_h_din_chair_04',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 53,
        name: 'Кухонный белый стул 2',
        prop: 'apa_mp_h_din_chair_08',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 54,
        name: 'Кухонный темный стул',
        prop: 'apa_mp_h_din_chair_12',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 55,
        name: 'Кожанный коричневый стул',
        prop: 'apa_mp_h_din_chair_09',
        cost: 13000,
        cat: 'chair'
    },
    {
        id: 56,
        name: 'Красный лофт стул',
        prop: 'hei_heist_din_chair_02',
        cost: 20000,
        cat: 'chair'
    },
    {
        id: 57,
        name: 'Серый офисный стул',
        prop: 'hei_heist_din_chair_05',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 58,
        name: 'Бирюзовый кухонный стул',
        prop: 'hei_heist_din_chair_06',
        cost: 13000,
        cat: 'chair'
    },
    {
        id: 59,
        name: 'Белый металический стул',
        prop: 'prop_table_04_chr',
        cost: 13000,
        cat: 'chair'
    },
    {
        id: 60,
        name: 'Белый уютный стул',
        prop: 'prop_table_06_chr',
        cost: 20000,
        cat: 'chair'
    },
    {
        id: 61,
        name: 'Коричневое кожанное кресло',
        prop: 'apa_mp_h_stn_chairarm_01',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 62,
        name: 'Деревянный стул с мягкой накладкой',
        prop: 'apa_mp_h_stn_chairarm_02',
        cost: 15000,
        cat: 'chair'
    },
    {
        id: 63,
        name: 'Мягкий дубовый стул',
        prop: 'apa_mp_h_stn_chairarm_03',
        cost: 15000,
        cat: 'chair'
    },
    {
        id: 64,
        name: 'Желтый лофтовый стул',
        prop: 'apa_mp_h_stn_chairarm_09',
        cost: 20000,
        cat: 'chair'
    },
    {
        id: 65,
        name: 'Дубовый коричневый стул',
        prop: 'apa_mp_h_stn_chairarm_11',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 66,
        name: 'Черное мягкое кресло',
        prop: 'apa_mp_h_stn_chairarm_12',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 67,
        name: 'Желтый стул',
        prop: 'apa_mp_h_stn_chairarm_13',
        cost: 15000,
        cat: 'chair'
    },
    {
        id: 68,
        name: 'Мягкое домашнее красное кресло',
        prop: 'apa_mp_h_stn_chairarm_23',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 69,
        name: 'Серый металический стул',
        prop: 'apa_mp_h_stn_chairarm_24',
        cost: 15000,
        cat: 'chair'
    },
    {
        id: 70,
        name: 'Мягкое красное кресло',
        prop: 'apa_mp_h_stn_chairarm_25',
        cost: 20000,
        cat: 'armchair'
    },
    {
        id: 71,
        name: 'Кресло в виде сабвуфера',
        prop: 'apa_mp_h_stn_chairarm_26',
        cost: 30000,
        cat: 'armchair'
    },
    {
        id: 72,
        name: 'Кресло в виде сферы серое',
        prop: 'apa_mp_h_stn_chairstool_12',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 73,
        name: 'Мягкое оранжевое домашнее кресло',
        prop: 'apa_mp_h_stn_chairstrip_01',
        cost: 20000,
        cat: 'armchair'
    },
    {
        id: 74,
        name: 'Кожанное оранжевое домашнее кресло',
        prop: 'apa_mp_h_stn_chairstrip_02',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 75,
        name: 'Белое кожанное кресло',
        prop: 'apa_mp_h_stn_chairstrip_05',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 76,
        name: 'Уютное домашнее красное кресло',
        prop: 'apa_mp_h_stn_chairstrip_04',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 77,
        name: 'Черное кожанное домашнее кресло',
        prop: 'apa_mp_h_stn_chairstrip_07',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 78,
        name: 'Голубое домашнее кресло',
        prop: 'apa_mp_h_stn_chairstrip_08',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 79,
        name: 'Белое домашнее кресло',
        prop: 'apa_mp_h_yacht_armchair_01',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 80,
        name: 'Белое терасное кресло',
        prop: 'apa_mp_h_yacht_armchair_03',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 81,
        name: 'Маленькое коричневое кресло',
        prop: 'apa_mp_h_yacht_armchair_04',
        cost: 30000,
        cat: 'armchair'
    },
    {
        id: 82,
        name: 'Офисное кресло кожанное',
        prop: 'ba_prop_battle_club_chair_01',
        cost: 20000,
        cat: 'armchair'
    },
    {
        id: 83,
        name: 'Офисное кресло директора',
        prop: 'ba_prop_battle_club_chair_02',
        cost: 100000,
        cat: 'armchair'
    },
    {
        id: 84,
        name: 'Офисное кресло серое',
        prop: 'ba_prop_battle_club_chair_03',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 85,
        name: 'Офисное кресло серое 2',
        prop: 'bkr_prop_biker_boardchair01',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 86,
        name: 'Потрепанное кресло',
        prop: 'bkr_prop_biker_chairstrip_01',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 87,
        name: 'Черное кресло',
        prop: 'bkr_prop_clubhouse_armchair_01a',
        cost: 30000,
        cat: 'armchair'
    },
    {
        id: 88,
        name: 'Кухонный коричневый стул',
        prop: 'bkr_prop_weed_chair_01a',
        cost: 13000,
        cat: 'chair'
    },
    {
        id: 89,
        name: 'Серое кресло лофт',
        prop: 'ex_mp_h_off_easychair_01',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 90,
        name: 'Белое кресло лофт',
        prop: 'ex_mp_h_off_chairstrip_01',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 91,
        name: 'Коричневое кресло лофт',
        prop: 'ex_mp_h_stn_chairstrip_010',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 92,
        name: 'Белое кресло лофт',
        prop: 'ex_mp_h_stn_chairstrip_011',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 93,
        name: 'Черное кресло лофт',
        prop: 'ex_mp_h_stn_chairstrip_07',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 94,
        name: 'Кожанное офисное кресло',
        prop: 'ex_prop_offchair_exec_01',
        cost: 20000,
        cat: 'armchair'
    },
    {
        id: 95,
        name: 'Офисный рабочий стул',
        prop: 'ex_prop_offchair_exec_03',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 96,
        name: 'Кресло полусфера нежно коричневый',
        prop: 'hei_heist_stn_chairarm_04',
        cost: 30000,
        cat: 'armchair'
    },
    {
        id: 97,
        name: 'Необычное кресло фиолетовое',
        prop: 'hei_heist_stn_chairarm_06',
        cost: 15000,
        cat: 'armchair'
    },
    {
        id: 98,
        name: 'Красное кожанное кресло',
        prop: 'hei_heist_stn_chairstrip_01',
        cost: 25000,
        cat: 'armchair'
    },
    {
        id: 99,
        name: 'Коричневый кожанный стул',
        prop: 'imp_prop_impexp_offchair_01a',
        cost: 30000,
        cat: 'chair'
    },
    {
        id: 100,
        name: 'Садовый стул',
        prop: 'prop_chair_02',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 101,
        name: 'Старый стул',
        prop: 'prop_chair_03',
        cost: 13000,
        cat: 'chair'
    },
    {
        id: 102,
        name: 'Модный дубовый стул',
        prop: 'prop_chair_04a',
        cost: 25000,
        cat: 'chair'
    },
    {
        id: 103,
        name: 'Модный белый древесный стул',
        prop: 'prop_chair_04b',
        cost: 25000,
        cat: 'chair'
    },
    {
        id: 104,
        name: 'Садовое кресло',
        prop: 'prop_chair_05',
        cost: 20000,
        cat: 'armchair'
    },
    {
        id: 105,
        name: 'Обычный стул',
        prop: 'prop_clown_chair',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 106,
        name: 'Офисный стул ожидания',
        prop: 'prop_cs_office_chair',
        cost: 10000,
        cat: 'chair'
    },
    {
        id: 107,
        name: 'Офисный серый стул ожидания',
        prop: 'prop_off_chair_05',
        cost: 15000,
        cat: 'chair'
    },
    {
        id: 108,
        name: 'Серое кожанное кресло',
        prop: 'p_armchair_01_s',
        cost: 60000,
        cat: 'armchair'
    },
    {
        id: 109,
        name: 'Старинный кухонный стул',
        prop: 'p_dinechair_01_s',
        cost: 35000,
        cat: 'chair'
    },
    {
        id: 110,
        name: 'Серая кровать дубовая',
        prop: 'apa_mp_h_bed_double_08',
        cost: 50000,
        cat: 'bed'
    },
    {
        id: 111,
        name: 'Серая кровать с высоким матрасом',
        prop: 'apa_mp_h_bed_double_09',
        cost: 50000,
        cat: 'bed'
    },
    {
        id: 112,
        name: 'Красная еловая кровать',
        prop: 'apa_mp_h_bed_wide_05',
        cost: 55000,
        cat: 'bed'
    },
    {
        id: 113,
        name: 'Коричневая дубовая кровать',
        prop: 'apa_mp_h_yacht_bed_01',
        cost: 60000,
        cat: 'bed'
    },
    {
        id: 114,
        name: 'Серая большая кровать с тумбами',
        prop: 'apa_mp_h_bed_with_table_02',
        cost: 80000,
        cat: 'bed'
    },
    {
        id: 115,
        name: 'Темная очень большая кровать',
        prop: 'apa_mp_h_yacht_bed_02',
        cost: 90000,
        cat: 'bed'
    },
    {
        id: 116,
        name: 'Кованная одноместная кровать',
        prop: 'gr_prop_bunker_bed_01',
        cost: 10000,
        cat: 'bed'
    },
    {
        id: 117,
        name: 'Кожанная раскладушка',
        prop: 'ex_prop_exec_bed_01',
        cost: 20000,
        cat: 'bed'
    },
    {
        id: 118,
        name: 'Потрепанная коричневая кровать',
        prop: 'p_lestersbed_s',
        cost: 5000,
        cat: 'bed'
    },
    {
        id: 119,
        name: 'Старинная дорогая кровать',
        prop: 'p_mbbed_s',
        cost: 100000,
        cat: 'bed'
    },
    {
        id: 120,
        name: 'Серая лофтовая кровать',
        prop: 'v_res_msonbed_s',
        cost: 50000,
        cat: 'bed'
    },
    {
        id: 121,
        name: 'Прикроватные тумбы коричневые',
        prop: 'hei_heist_bed_table_dble_04',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 122,
        name: 'Прикроватные тумбы красные',
        prop: 'apa_mp_h_bed_table_wide_12',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 123,
        name: 'Журнальный столик стеклянный',
        prop: 'apa_mp_h_din_table_01',
        cost: 35000,
        cat: 'table'
    },
    {
        id: 124,
        name: 'Журнальный столик стеклянный 2',
        prop: 'apa_mp_h_din_table_04',
        cost: 35000,
        cat: 'table'
    },
    {
        id: 125,
        name: 'Стол дубовый',
        prop: 'apa_mp_h_din_table_05',
        cost: 30000,
        cat: 'table'
    },
    {
        id: 126,
        name: 'Большой белый стол',
        prop: 'apa_mp_h_din_table_06',
        cost: 30000,
        cat: 'table'
    },
    {
        id: 127,
        name: 'Журнальный стол в виде яйца',
        prop: 'ba_prop_int_edgy_table_01',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 128,
        name: 'Журнальный стол в виде яйца 2',
        prop: 'ba_prop_int_edgy_table_02',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 129,
        name: 'Журнальный стол в виде корзины',
        prop: 'ba_prop_int_glam_table',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 130,
        name: 'Терасный стол сетчатый',
        prop: 'gr_dlc_gr_yacht_props_table_03',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 131,
        name: 'Кухонный стол со стульями белый',
        prop: 'hei_heist_din_table_06',
        cost: 100000,
        cat: 'table'
    },
    {
        id: 132,
        name: 'Стеклянный кухонный стол',
        prop: 'hei_heist_din_table_07',
        cost: 25000,
        cat: 'table'
    },
    {
        id: 133,
        name: 'Лофтовый коричневый стол',
        prop: 'prop_table_04',
        cost: 20000,
        cat: 'table'
    },
    {
        id: 134,
        name: 'Кованный домашний стол',
        prop: 'prop_table_06',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 135,
        name: 'Кофейный столик черный',
        prop: 'apa_mp_h_yacht_coffee_table_01',
        cost: 20000,
        cat: 'table'
    },
    {
        id: 136,
        name: 'Кофейный столик темно серый',
        prop: 'apa_mp_h_yacht_coffee_table_02',
        cost: 20000,
        cat: 'table'
    },
    {
        id: 137,
        name: 'Кофейный столик темно серый кубический',
        prop: 'apa_mp_h_yacht_side_table_01',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 138,
        name: 'Кофейный столик серый',
        prop: 'apa_mp_h_yacht_side_table_02',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 139,
        name: 'Кофейный столик серый 2',
        prop: 'ch_prop_ch_coffe_table_02',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 140,
        name: 'Кофейный столик секрый 3',
        prop: 'ch_prop_table_casino_short_02a',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 141,
        name: 'Маленький терассный столик',
        prop: 'hei_prop_yah_table_01',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 142,
        name: 'Длинный терасный столик',
        prop: 'hei_prop_yah_table_02',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 143,
        name: 'Древесный кофейный столик',
        prop: 'prop_fbi3_coffee_table',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 144,
        name: 'Простой древесный столик',
        prop: 'prop_patio_lounger1_table',
        cost: 5000,
        cat: 'table'
    },
    {
        id: 145,
        name: 'Маленький древесный столик',
        prop: 'prop_tablesmall_01',
        cost: 10000,
        cat: 'table'
    },
    {
        id: 146,
        name: 'Черный кофейный столик',
        prop: 'prop_t_coffe_table',
        cost: 15000,
        cat: 'table'
    },
    {
        id: 147,
        name: 'Лампа',
        prop: 'apa_mp_h_floorlamp_a',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 148,
        name: 'Лампа 2',
        prop: 'apa_mp_h_floorlamp_b',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 149,
        name: 'Лампа 3',
        prop: 'apa_mp_h_floorlamp_c',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 150,
        name: 'Лампа 4',
        prop: 'apa_mp_h_floor_lamp_int_08',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 151,
        name: 'Лампа 5',
        prop: 'apa_mp_h_lit_floorlampnight_05',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 152,
        name: 'Лампа 6',
        prop: 'apa_mp_h_lit_floorlampnight_07',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 153,
        name: 'Лампа 7',
        prop: 'apa_mp_h_lit_floorlampnight_14',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 154,
        name: 'Лампа 8',
        prop: 'apa_mp_h_lit_floorlamp_01',
        cost: 20000,
        cat: 'lamp'
    },
    // {
    //     id: 155,
    //     name: 'Лампа 9',
    //     prop: 'apa_mp_h_lit_floorlamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 156,
        name: 'Лампа 10',
        prop: 'apa_mp_h_lit_floorlamp_03',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 157,
        name: 'Лампа 11',
        prop: 'apa_mp_h_lit_floorlamp_06',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 158,
        name: 'Лампа 12',
        prop: 'apa_mp_h_lit_floorlamp_10',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 159,
        name: 'Лампа 13',
        prop: 'apa_mp_h_lit_floorlamp_13',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 160,
        name: 'Лампа 14',
        prop: 'apa_mp_h_lit_floorlamp_17',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 161,
        name: 'Лампа 15',
        prop: 'hei_heist_lit_floorlamp_04',
        cost: 20000,
        cat: 'lamp'
    },
    {
        id: 162,
        name: 'Цветок в горшке',
        prop: 'apa_mp_h_acc_plant_palm_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 163,
        name: 'Цветок в горшке 2',
        prop: 'apa_mp_h_acc_plant_tall_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 164,
        name: 'Цветок в горшке 3',
        prop: 'ch_prop_ch_planter_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 165,
        name: 'Цветок в горшке 4',
        prop: 'prop_plant_int_01a',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 166,
        name: 'Цветок в горшке 5',
        prop: 'prop_plant_int_03a',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 167,
        name: 'Цветок в горшке 6',
        prop: 'prop_plant_int_03b',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 168,
        name: 'Цветок в горшке 7',
        prop: 'prop_plant_int_03c',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 169,
        name: 'Цветок в горшке 8',
        prop: 'p_int_jewel_plant_02',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 170,
        name: 'Сейф',
        prop: 'prop_ld_int_safe_01',
        cost: 70000,
        cat: 'decor'
    },
    {
        id: 171,
        name: 'Сейф 2',
        prop: 'p_v_43_safe_s',
        cost: 100000,
        cat: 'decor'
    },
    // {
    //     id: 172,
    //     name: 'Тумба белая',
    //     prop: 'p_v_43_safe_s',
    //     cost: 1,
    //     cat: 'chest'
    // },
    // {
    //     id: 173,
    //     name: 'Тумба белая',
    //     prop: 'p_v_43_safe_s',
    //     cost: 1,
    //     cat: 'chest'
    // },
    {
        id: 174,
        name: 'Картина 1',
        prop: 'apa_mp_h_acc_artwalll_01',
        cost: 16000, cat: 'decor'
    },
    {
        id: 175,
        name: 'Картина 2',
        prop: 'apa_mp_h_acc_artwalll_02',
        cost: 16000,
        cat: 'decor'
    },
    {
        id: 176,
        name: 'Картина 3',
        prop: 'apa_mp_h_acc_artwalll_03',
        cost: 16000, cat: 'decor'
    },
    {
        id: 177,
        name: 'Картина 4',
        prop: 'apa_mp_h_acc_artwallm_02',
        cost: 16000, cat: 'decor'
    },
    {
        id: 178,
        name: 'Картина 5',
        prop: 'apa_mp_h_acc_artwallm_03',
        cost: 16000, cat: 'decor'
    },
    {
        id: 179,
        name: 'Картина 6',
        prop: 'apa_mp_h_acc_artwallm_04',
        cost: 16000, cat: 'decor'
    },
    {
        id: 180,
        name: 'Картина 7',
        prop: 'apa_p_h_acc_artwalll_01',
        cost: 16000, cat: 'decor'
    },
    {
        id: 181,
        name: 'Картина 8',
        prop: 'apa_p_h_acc_artwalll_02',
        cost: 16000, cat: 'decor'
    },
    {
        id: 182,
        name: 'Картина 9',
        prop: 'apa_p_h_acc_artwalll_03',
        cost: 15000, cat: 'decor'
    },
    {
        id: 183,
        name: 'Картина 10',
        prop: 'apa_p_h_acc_artwallm_04',
        cost: 16000, cat: 'decor'
    },
    {
        id: 184,
        name: 'Картина 11',
        prop: 'apa_p_h_acc_artwalls_03',
        cost: 10000, cat: 'decor'
    },
    {
        id: 185,
        name: 'Картина 12',
        prop: 'apa_p_h_acc_artwalls_04',
        cost: 10000, cat: 'decor'
    },
    // {
    //     id: 186,
    //     name: 'Картина 13',
    //     prop: 'apa_p_h_acc_artwalls_04',
    //     cost: 1, cat: 'decor'
    // },
    {
        id: 187,
        name: 'Пластинка позолоченная 1',
        prop: 'hei_heist_acc_artgolddisc_01',
        cost: 20000, cat: 'decor'
    },
    {
        id: 188,
        name: 'Пластинка позолоченная 2',
        prop: 'hei_heist_acc_artgolddisc_02',
        cost: 20000, cat: 'decor'
    },
    {
        id: 189,
        name: 'Пластинка позолоченная 3',
        prop: 'hei_heist_acc_artgolddisc_03',
        cost: 20000, cat: 'decor'
    },
    {
        id: 190,
        name: 'Пластинка позолоченная 4',
        prop: 'hei_heist_acc_artgolddisc_04',
        cost: 20000, cat: 'decor'
    },
    {
        id: 191,
        name: 'Консоль декорная',
        prop: 'vw_prop_casino_art_console_01a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 192,
        name: 'Консоль декорная 2',
        prop: 'vw_prop_casino_art_console_02a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 193,
        name: 'Статуя свободы миниатюра 1',
        prop: 'vw_prop_casino_art_miniature_05a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 194,
        name: 'Статуя свободы миниатюра 2',
        prop: 'vw_prop_casino_art_miniature_05b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 195,
        name: 'Статуя свободы миниатюра 3',
        prop: 'vw_prop_casino_art_miniature_05c',
        cost: 50000, cat: 'decor'
    },
    {
        id: 196,
        name: 'Миниатюра казино 1',
        prop: 'vw_prop_casino_art_miniature_09a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 197,
        name: 'Миниатюра казино 2',
        prop: 'vw_prop_casino_art_miniature_09b',
        cost: 35000, cat: 'decor'
    },
    {
        id: 198,
        name: 'Миниатюра казино 3',
        prop: 'vw_prop_casino_art_miniature_09c',
        cost: 50000, cat: 'decor'
    },
    {
        id: 199,
        name: 'Статуя собаки',
        prop: 'vw_prop_casino_art_sculpture_01a',
        cost: 100000, cat: 'decor'
    },
    {
        id: 200,
        name: 'Статуя бананы 1',
        prop: 'vw_prop_casino_art_sculpture_02a',
        cost: 150000, cat: 'decor'
    },
    {
        id: 201,
        name: 'Статуя бананы 2',
        prop: 'vw_prop_casino_art_sculpture_02b',
        cost: 100000, cat: 'decor'
    },
    {
        id: 202,
        name: 'Арт маска 1',
        prop: 'vw_prop_casino_art_skull_01a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 203,
        name: 'Арт маска 2',
        prop: 'vw_prop_casino_art_skull_01b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 204,
        name: 'Арт маска 3',
        prop: 'vw_prop_casino_art_skull_02a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 205,
        name: 'Арт маска 4',
        prop: 'vw_prop_casino_art_skull_02b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 206,
        name: 'Арт маска 5',
        prop: 'vw_prop_casino_art_skull_03a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 207,
        name: 'Арт маска 6',
        prop: 'vw_prop_casino_art_skull_03b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 208,
        name: 'Статуя 1',
        prop: 'vw_prop_casino_art_statue_01a',
        cost: 200000, cat: 'decor'
    },
    {
        id: 209,
        name: 'Статуя 2',
        prop: 'vw_prop_casino_art_statue_02a',
        cost: 200000, cat: 'decor'
    },
    {
        id: 210,
        name: 'Арт птицы',
        prop: 'vw_prop_casino_art_bird_01a',
        cost: 70000, cat: 'decor'
    },
    {
        id: 211,
        name: 'Моделька машинки 1',
        prop: 'vw_prop_casino_art_car_01a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 212,
        name: 'Моделька машинки 2',
        prop: 'vw_prop_casino_art_car_02a',
        cost: 20000, cat: 'decor'
    },
    {
        id: 213,
        name: 'Моделька машинки 3',
        prop: 'vw_prop_casino_art_car_03a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 214,
        name: 'Моделька машинки 4',
        prop: 'vw_prop_casino_art_car_04a',
        cost: 50900, cat: 'decor'
    },
    {
        id: 215,
        name: 'Моделька машинки 5',
        prop: 'vw_prop_casino_art_car_05a',
        cost: 33000, cat: 'decor'
    },
    {
        id: 216,
        name: 'Моделька машинки 6',
        prop: 'vw_prop_casino_art_car_06a',
        cost: 20000, cat: 'decor'
    },
    {
        id: 217,
        name: 'Моделька машинки 7',
        prop: 'vw_prop_casino_art_car_07a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 218,
        name: 'Моделька машинки 8',
        prop: 'vw_prop_casino_art_car_08a',
        cost: 20000, cat: 'decor'
    },
    {
        id: 219,
        name: 'Моделька машинки 9',
        prop: 'vw_prop_casino_art_car_09a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 220,
        name: 'Моделька машинки 10',
        prop: 'vw_prop_casino_art_car_10a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 221,
        name: 'Моделька машинки 11',
        prop: 'vw_prop_casino_art_car_11a',
        cost: 40000, cat: 'decor'
    },
    {
        id: 222,
        name: 'Моделька машинки 12',
        prop: 'vw_prop_casino_art_car_12a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 223,
        name: 'Арт вишни',
        prop: 'vw_prop_casino_art_cherries_01a',
        cost: 100000, cat: 'decor'
    },
    {
        id: 224,
        name: 'Настенный олень',
        prop: 'vw_prop_casino_art_deer_01a',
        cost: 50000, cat: 'decor'
    },
    {
        id: 225,
        name: 'Арт пёс',
        prop: 'vw_prop_casino_art_dog_01a',
        cost: 50000, cat: 'decor'
    },
    {
        id: 226,
        name: 'Статуя инопланетянин',
        prop: 'vw_prop_casino_art_egg_01a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 227,
        name: 'Арт фигурки людей 1',
        prop: 'vw_prop_casino_art_figurines_01a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 228,
        name: 'Арт фигурки людей 2',
        prop: 'vw_prop_casino_art_figurines_02a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 229,
        name: 'Декор граната 1',
        prop: 'vw_prop_casino_art_grenade_01a',
        cost: 50000, cat: 'decor'
    },
    {
        id: 230,
        name: 'Декор граната 2',
        prop: 'vw_prop_casino_art_grenade_01b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 231,
        name: 'Декор граната 3',
        prop: 'vw_prop_casino_art_grenade_01c',
        cost: 20000, cat: 'decor'
    },
    {
        id: 232,
        name: 'Декор граната 4',
        prop: 'vw_prop_casino_art_grenade_01d',
        cost: 25000, cat: 'decor'
    },
    {
        id: 233,
        name: 'Декор гитара',
        prop: 'vw_prop_casino_art_guitar_01a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 234,
        name: 'Декор револьвер',
        prop: 'vw_prop_casino_art_gun_01a',
        cost: 50000, cat: 'decor'
    },
    {
        id: 235,
        name: 'Декор оружия',
        prop: 'vw_prop_casino_art_gun_02a',
        cost: 100000, cat: 'decor'
    },
    {
        id: 236,
        name: 'Декор маска 1',
        prop: 'vw_prop_casino_art_head_01a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 237,
        name: 'Декор маска 2',
        prop: 'vw_prop_casino_art_head_01b',
        cost: 40000, cat: 'decor'
    },
    {
        id: 238,
        name: 'Декор маска 3',
        prop: 'vw_prop_casino_art_head_01c',
        cost: 20000, cat: 'decor'
    },
    {
        id: 239,
        name: 'Декор маска 4',
        prop: 'vw_prop_casino_art_head_01d',
        cost: 20000, cat: 'decor'
    },
    {
        id: 240,
        name: 'Лампа стриптиз 1',
        prop: 'vw_prop_casino_art_lampf_01a',
        cost: 25000, cat: 'lamp'
    },
    {
        id: 241,
        name: 'Лампа стриптиз 2',
        prop: 'vw_prop_casino_art_lampm_01a',
        cost: 25000, cat: 'lamp'
    },
    {
        id: 242,
        name: 'Арт леденец',
        prop: 'vw_prop_casino_art_lollipop_01a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 243,
        name: 'Арт обьект 1',
        prop: 'vw_prop_casino_art_mod_01a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 244,
        name: 'Арт обьект 2',
        prop: 'vw_prop_casino_art_mod_02a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 245,
        name: 'Арт пиксельный человек 1',
        prop: 'vw_prop_casino_art_mod_03a',
        cost: 35000, cat: 'decor'
    },
    {
        id: 246,
        name: 'Арт пиксельный человек 2',
        prop: 'vw_prop_casino_art_mod_03a_a',
        cost: 35000, cat: 'decor'
    },
    {
        id: 247,
        name: 'Арт пиксельный человек 3',
        prop: 'vw_prop_casino_art_mod_03a_b',
        cost: 35000, cat: 'decor'
    },
    {
        id: 248,
        name: 'Арт пиксельный человек 4',
        prop: 'vw_prop_casino_art_mod_03a_c',
        cost: 35000, cat: 'decor'
    },
    {
        id: 249,
        name: 'Арт человек из камней 1',
        prop: 'vw_prop_casino_art_mod_03b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 250,
        name: 'Арт человек из камней 2',
        prop: 'vw_prop_casino_art_mod_03b_a',
        cost: 30000, cat: 'decor'
    },
    {
        id: 251,
        name: 'Арт человек из камней 3',
        prop: 'vw_prop_casino_art_mod_03b_b',
        cost: 30000, cat: 'decor'
    },
    {
        id: 252,
        name: 'Арт человек из камней 4',
        prop: 'vw_prop_casino_art_mod_03b_c',
        cost: 30000, cat: 'decor'
    },
    {
        id: 253,
        name: 'Арт каменная утка',
        prop: 'vw_prop_casino_art_mod_04a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 254,
        name: 'Арт каменная курица',
        prop: 'vw_prop_casino_art_mod_05a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 255,
        name: 'Арт веселый молочник',
        prop: 'vw_prop_casino_art_mod_06a',
        cost: 40000, cat: 'decor'
    },
    {
        id: 256,
        name: 'Арт сплетения',
        prop: 'vw_prop_casino_art_sh_01a',
        cost: 15000, cat: 'decor'
    },
    {
        id: 257,
        name: 'Арт ваза 1',
        prop: 'vw_prop_casino_art_vase_01a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 258,
        name: 'Арт ваза 2',
        prop: 'vw_prop_casino_art_vase_02a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 259,
        name: 'Арт ваза 3',
        prop: 'vw_prop_casino_art_vase_03a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 260,
        name: 'Арт ваза 4',
        prop: 'vw_prop_casino_art_vase_04a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 261,
        name: 'Арт ваза 5',
        prop: 'vw_prop_casino_art_vase_05a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 262,
        name: 'Арт ваза 6',
        prop: 'vw_prop_casino_art_vase_06a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 263,
        name: 'Арт ваза 7',
        prop: 'vw_prop_casino_art_vase_07a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 264,
        name: 'Арт ваза 8',
        prop: 'vw_prop_casino_art_vase_08a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 265,
        name: 'Арт ваза 9',
        prop: 'vw_prop_casino_art_vase_09a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 266,
        name: 'Арт ваза 10',
        prop: 'vw_prop_casino_art_vase_10a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 267,
        name: 'Арт ваза 11',
        prop: 'vw_prop_casino_art_vase_11a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 268,
        name: 'Арт ваза 12',
        prop: 'vw_prop_casino_art_vase_12a',
        cost: 10000, cat: 'decor'
    },
    {
        id: 269,
        name: 'Арт мяч',
        prop: 'vw_prop_art_football_01a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 270,
        name: 'Арт обьект',
        prop: 'vw_prop_art_mic_01a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 271,
        name: 'Арт мопс 1',
        prop: 'vw_prop_art_pug_01a',
        cost: 35000, cat: 'decor'
    },
    {
        id: 272,
        name: 'Арт мопс 2',
        prop: 'vw_prop_art_pug_01b',
        cost: 35000, cat: 'decor'
    },
    {
        id: 273,
        name: 'Арт мопс 3',
        prop: 'vw_prop_art_pug_02a',
        cost: 35000, cat: 'decor'
    },
    {
        id: 274,
        name: 'Арт мопс 4',
        prop: 'vw_prop_art_pug_02b',
        cost: 35000, cat: 'decor'
    },
    {
        id: 275,
        name: 'Арт мопс 5',
        prop: 'vw_prop_art_pug_03a',
        cost: 35000, cat: 'decor'
    },
    {
        id: 276,
        name: 'Арт мопс 6',
        prop: 'vw_prop_art_pug_03b',
        cost: 35000, cat: 'decor'
    },
    {
        id: 277,
        name: 'Арт шары',
        prop: 'vw_prop_art_resin_balls_01a',
        cost: 80000, cat: 'decor'
    },
    {
        id: 278,
        name: 'Арт оружие в стенде',
        prop: 'vw_prop_art_resin_guns_01a',
        cost: 80000, cat: 'decor'
    },
    {
        id: 279,
        name: 'Арт старинное полотно',
        prop: 'vw_prop_art_wall_segment_01a',
        cost: 40000, cat: 'decor'
    },
    {
        id: 280,
        name: 'Арт ретро полотно 1',
        prop: 'vw_prop_art_wall_segment_02a',
        cost: 25000, cat: 'decor'
    },
    {
        id: 281,
        name: 'Арт ретро полотно 2',
        prop: 'vw_prop_art_wall_segment_02b',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 282,
        name: 'Арт стена',
        prop: 'vw_prop_art_wall_segment_03a',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 283,
        name: 'Арт крылья 1',
        prop: 'vw_prop_art_wings_01a',
        cost: 65000,
        cat: 'decor'
    },
    {
        id: 284,
        name: 'Арт крылья 2',
        prop: 'vw_prop_art_wings_01b',
        cost: 65000,
        cat: 'decor'
    },
    {
        id: 285,
        name: 'Баскет мяч 1',
        prop: 'vw_prop_casino_art_basketball_01a',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 286,
        name: 'Баскет мяч 2',
        prop: 'vw_prop_casino_art_basketball_02a',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 287,
        name: 'Бутылка шампанского',
        prop: 'vw_prop_casino_art_bottle_01a',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 288,
        name: 'Кегля 1',
        prop: 'vw_prop_casino_art_bowling_01a',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 289,
        name: 'Кегля 2',
        prop: 'vw_prop_casino_art_bowling_01b',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 290,
        name: 'Кегля 3',
        prop: 'vw_prop_casino_art_bowling_02a',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 291,
        name: 'Шарики Eco',
        prop: 'vw_prop_casino_art_ego_01a',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 292,
        name: 'Статуя Лошадь 1',
        prop: 'vw_prop_casino_art_horse_01a',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 293,
        name: 'Статуя Лошадь 2',
        prop: 'vw_prop_casino_art_horse_01b',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 294,
        name: 'Статуя Лошадь 3',
        prop: 'vw_prop_casino_art_horse_01c',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 295,
        name: 'Статуя Рысь 1',
        prop: 'vw_prop_casino_art_panther_01a',
        cost: 30000,
        cat: 'decor'
    },
    {
        id: 296,
        name: 'Статуя Рысь 2',
        prop: 'vw_prop_casino_art_panther_01b',
        cost: 30000,
        cat: 'decor'
    },
    {
        id: 297,
        name: 'Статуя Рысь 3',
        prop: 'vw_prop_casino_art_panther_01c',
        cost: 30000,
        cat: 'decor'
    },
    // {
    //     id: 298,
    //     name: 'Арт полотно 1',
    //     prop: 'apa_dining_art_new',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 299,
    //     name: 'Арт полотно 2',
    //     prop: 'apa_mp_h_acc_artwalll_01_dressing',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 300,
    //     name: 'Арт полотно 3',
    //     prop: 'apa_mp_h_acc_artwallm_bed_1',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 301,
    //     name: 'Арт полотно 4',
    //     prop: 'apa_mp_h_acc_artwallm_bed_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 302,
    //     name: 'Арт полотно 5',
    //     prop: 'apa_mpa3_dining_art',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 303,
    //     name: 'Арт полотно 5',
    //     prop: 'apa_mpa3_dining_art',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 304,
    //     name: 'Модульные картины 1',
    //     prop: 'ex_off2b_artwall',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 305,
    //     name: 'Модульные картины 2',
    //     prop: 'ex_off2b_artwallrecp',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 306,
    //     name: 'Модульные картины 3',
    //     prop: 'ex_off2c_artwallrecp',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 307,
    //     name: 'Модульные картины 4',
    //     prop: 'ex_office2c_artwall',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 308,
        name: 'Статуя инопланетянина',
        prop: 'h4_prop_h4_art_pant_01a',
        cost: 20000,
        cat: 'decor'
    },
    // {
    //     id: 309,
    //     name: 'Статуя тигра',
    //     prop: 'sf_int1_art_statue_tgr_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 310,
    //     name: 'Картина Blah',
    //     prop: 'sf_int1_art2_operations',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 311,
    //     name: 'Ковер 1',
    //     prop: 'sf_int2_art_f2_option_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 312,
    //     name: 'Ковер 2',
    //     prop: 'sf_int2_art_f2_option_3',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 313,
    //     name: 'Полотно с ретро машиной',
    //     prop: 'sf_int2_art_gf_option_1_f0',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 314,
    //     name: 'Ковер с жабой',
    //     prop: 'sf_int2_art_gf_option_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 315,
    //     name: 'Полотно с пистолетом',
    //     prop: 'sf_int2_art_gf_option_3',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 316,
    //     name: 'Арт моделька 1',
    //     prop: 'sf_prop_sf_art_car_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 317,
    //     name: 'Арт моделька 2',
    //     prop: 'sf_prop_sf_art_car_02a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 318,
    //     name: 'Арт моделька 3',
    //     prop: 'sf_prop_sf_art_car_03a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 319,
    //     name: 'Модель трофея',
    //     prop: 'sf_prop_sf_art_trophy_co_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 320,
    //     name: 'Модель кепки',
    //     prop: 'sf_prop_art_cap_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 321,
    //     name: 'Сигары',
    //     prop: 'sf_prop_sf_art_box_cig_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 322,
    //     name: 'Патрон 5.56',
    //     prop: 'sf_prop_sf_art_bullet_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 323,
    //     name: 'Модель монеты',
    //     prop: 'sf_prop_sf_art_coin_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 324,
    //     name: 'Собачка из шариков 1',
    //     prop: 'sf_prop_sf_art_dog_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 325,
    //     name: 'Собачка из шариков 2',
    //     prop: 'sf_prop_sf_art_dog_01b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 326,
    //     name: 'Собачка из шариков 3',
    //     prop: 'sf_prop_sf_art_dog_01c',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 327,
    //     name: 'Сигара',
    //     prop: 'sf_prop_sf_art_roll_up_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 328,
    //     name: 'Доски для серфинга 1',
    //     prop: 'sf_prop_sf_art_s_board_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 329,
    //     name: 'Доски для серфинга 2',
    //     prop: 'sf_prop_sf_art_s_board_02a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 330,
    //     name: 'Доски для серфинга 3',
    //     prop: 'sf_prop_sf_art_s_board_02b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 331,
    //     name: 'Сигн травки',
    //     prop: 'sf_prop_sf_art_sign_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 332,
    //     name: 'Модель человека 1',
    //     prop: 'sf_prop_sf_art_bobble_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 333,
    //     name: 'Модель человека 2',
    //     prop: 'sf_prop_sf_art_bobble_bb_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 334,
    //     name: 'Модель человека 3',
    //     prop: 'sf_prop_sf_art_bobble_bb_01b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 335,
    //     name: 'Кегля 4',
    //     prop: 'sf_prop_sf_art_pin_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 336,
    //     name: 'Мумия',
    //     prop: 'sf_prop_sf_art_pogo_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 337,
        name: 'Одежда на вешалке',
        prop: 'prop_cs_shirt_01',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 338,
        name: 'Стопка одежды',
        prop: 'prop_cs_t_shirt_pile',
        cost: 4000,
        cat: 'decor'
    },
    {
        id: 339,
        name: 'Синяя голова',
        prop: 'prop_phys_wades_head',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 340,
        name: 'Алкоголь 1',
        prop: 'beerrow_local',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 341,
        name: 'Алкоголь 2',
        prop: 'beerrow_world',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 342,
        name: 'Бутылка декоративная',
        prop: 'apa_mp_h_acc_bottle_02',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 343,
        name: 'Блюдо керамическое',
        prop: 'apa_mp_h_acc_bowl_ceramic_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 344,
        name: 'Свечи 1',
        prop: 'apa_mp_h_acc_candles_01',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 345,
        name: 'Свечи 2',
        prop: 'apa_mp_h_acc_candles_02',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 346,
        name: 'Свечи 3',
        prop: 'apa_mp_h_acc_candles_04',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 347,
        name: 'Свечи 4',
        prop: 'apa_mp_h_acc_candles_05',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 348,
        name: 'Свечи 5',
        prop: 'apa_mp_h_acc_candles_06',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 349,
        name: 'Кофемашина',
        prop: 'apa_mp_h_acc_coffeemachine_01',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 350,
        name: 'Маска декорная',
        prop: 'apa_mp_h_acc_dec_head_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 351,
        name: 'Узорное блюдо 1',
        prop: 'apa_mp_h_acc_dec_plate_01',
        cost: 13000,
        cat: 'decor'
    },
    {
        id: 352,
        name: 'Узорное блюдо 2',
        prop: 'apa_mp_h_acc_dec_plate_02',
        cost: 13000,
        cat: 'decor'
    },
    {
        id: 353,
        name: 'Футуристичный объект',
        prop: 'apa_mp_h_acc_dec_sculpt_03',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 354,
        name: 'Чайный набор на подносе',
        prop: 'apa_mp_h_acc_drink_tray_02',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 355,
        name: 'Набор фруктов 1',
        prop: 'apa_mp_h_acc_fruitbowl_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 356,
        name: 'Набор фруктов 2',
        prop: 'apa_mp_h_acc_fruitbowl_02',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 357,
        name: 'Арт кубы 1',
        prop: 'apa_mp_h_acc_jar_02',
        cost: 6000,
        cat: 'decor'
    },
    {
        id: 358,
        name: 'Арт кубы 2',
        prop: 'apa_mp_h_acc_jar_03',
        cost: 6000,
        cat: 'decor'
    },
    {
        id: 359,
        name: 'Арт кубы 3',
        prop: 'apa_mp_h_acc_jar_04',
        cost: 6000,
        cat: 'decor'
    },
    {
        id: 360,
        name: 'Старинный телефон',
        prop: 'apa_mp_h_acc_phone_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 361,
        name: 'Арт блюдо с камушками',
        prop: 'apa_mp_h_acc_pot_pouri_01',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 362,
        name: 'Свечи',
        prop: 'apa_mp_h_acc_tray_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 363,
        name: 'Доллары 1',
        prop: 'bkr_cash_scatter_02',
        cost: 16000,
        cat: 'decor'
    },
    {
        id: 364,
        name: 'Доллары 2',
        prop: 'bkr_prop_bkr_cash_roll_01',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 365,
        name: 'Доллары 3',
        prop: 'bkr_prop_bkr_cashpile_01',
        cost: 100000,
        cat: 'decor'
    },
    {
        id: 366,
        name: 'Порошок',
        prop: 'bkr_prop_coke_bakingsoda',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 367,
        name: 'Модель в коробке boxeddoll',
        prop: 'bkr_prop_coke_boxeddoll',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 368,
        name: 'Модель boxeddoll',
        prop: 'bkr_prop_coke_doll',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 369,
        name: 'Металическое блюдо',
        prop: 'bkr_prop_coke_metalbowl_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 370,
        name: 'Миксер',
        prop: 'bkr_prop_coke_mixer_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 371,
        name: 'Ступка',
        prop: 'bkr_prop_coke_mortalpestle',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 372,
        name: 'Таблетки',
        prop: 'bkr_prop_coke_painkiller_01a',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 373,
        name: 'Банка',
        prop: 'bkr_prop_coke_powderbottle_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 374,
        name: 'Кейс 1',
        prop: 'bkr_prop_biker_case_shut',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 375,
        name: 'Кейс 2',
        prop: 'bkr_prop_biker_gcase_s',
        cost: 30000,
        cat: 'decor'
    },
    {
        id: 376,
        name: 'Коробка шампанского',
        prop: 'ex_office_swag_booze_cigs',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 377,
        name: 'Коробка виски',
        prop: 'ex_office_swag_booze_cigs3',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 378,
        name: 'Коробки електроники',
        prop: 'ex_office_swag_electronic',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 379,
        name: 'Упаковки таблеток',
        prop: 'ex_office_swag_pills2',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 380,
        name: 'Ноутбук',
        prop: 'ex_prop_ex_laptop_01a',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 381,
        name: 'Сигара',
        prop: 'ex_prop_exec_cigar_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 382,
        name: 'Зажигалка',
        prop: 'ex_prop_exec_lighter_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 383,
        name: 'Приставка',
        prop: 'ex_prop_tv_settop_box',
        cost: 5000,
        cat: 'decor'
    },
    // {
    //     id: 384,
    //     name: 'Пульт',
    //     prop: 'ex_prop_tv_settop_box',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 385,
        name: 'Сахарница',
        prop: 'prop_food_sugarjar',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 386,
        name: 'Факс',
        prop: 'prop_fax_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 387,
        name: 'Пепельница',
        prop: 'prop_fib_ashtray_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 388,
        name: 'Телефон',
        prop: 'prop_amb_phone',
        cost: 12000,
        cat: 'decor'
    },
    {
        id: 389,
        name: 'Корзина для фруктов',
        prop: 'prop_fruit_basket',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 390,
        name: 'Статуетка',
        prop: 'prop_idol_01_error',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 391,
        name: 'Камера',
        prop: 'prop_pap_camera_01',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 392,
        name: 'Катана',
        prop: 'prop_cs_katana_01',
        cost: 50000,
        cat: 'decor'
    },
    {
        id: 393,
        name: 'Наручники',
        prop: 'prop_cs_cuffs_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 394,
        name: 'Помада',
        prop: 'prop_cs_lipstick',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 395,
        name: 'Газировка',
        prop: 'prop_ld_can_01b',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 396,
        name: 'Сигареты',
        prop: 'prop_ld_fags_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 397,
        name: 'Зеленая свеча',
        prop: 'prop_mem_candle_04',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 398,
        name: 'Красная свеча',
        prop: 'prop_mem_candle_05',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 399,
        name: 'Синяя свеча',
        prop: 'prop_mem_candle_06',
        cost: 5000,
        cat: 'decor'
    },
    // {
    //     id: 400,
    //     name: 'Набор свечей',
    //     prop: 'prop_mem_candle_06',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 401,
        name: 'Арахис на блюдце',
        prop: 'prop_peanut_bowl_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 402,
        name: 'Ром',
        prop: 'prop_rum_bottle',
        cost: 8000,
        cat: 'decor'
    },
    {
        id: 403,
        name: 'Листовка',
        prop: 'v_ilev_csr_lod_boarded',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 404,
        name: 'Декорный шар',
        prop: 'v_ilev_exball_blue',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 405,
        name: 'Декорный шар 2',
        prop: 'v_ilev_exball_grey',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 406,
        name: 'Лампа кубическая',
        prop: 'v_ilev_fh_lampa_on',
        cost: 15000,
        cat: 'lamp'
    },
    {
        id: 407,
        name: 'Полотно для проектора',
        prop: 'v_ilev_lest_bigscreen',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 408,
        name: 'Кувшин',
        prop: 'v_ilev_m_pitcher',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 409,
        name: 'Подушка на диван',
        prop: 'v_ilev_m_sofacushion',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 410,
        name: 'Мотивирующий плакат 1',
        prop: 'v_ilev_mchalkbrd_1',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 411,
        name: 'Мотивирующий плакат 2',
        prop: 'v_ilev_mchalkbrd_2',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 412,
        name: 'Мотивирующий плакат 3',
        prop: 'v_ilev_mchalkbrd_3',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 413,
        name: 'Мотивирующий плакат 4',
        prop: 'v_ilev_mchalkbrd_4',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 414,
        name: 'Мотивирующий плакат 5',
        prop: 'v_ilev_mchalkbrd_5',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 415,
        name: 'Кухонный кран',
        prop: 'v_ilev_mm_faucet',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 416,
        name: 'Холодильник',
        prop: 'v_ilev_mm_fridgeint',
        cost: 50000,
        cat: 'plumbing'
    },
    {
        id: 417,
        name: 'Книга',
        prop: 'v_ilev_mp_bedsidebook',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 418,
        name: 'Мишка',
        prop: 'v_ilev_mr_rasberryclean',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 419,
        name: 'Старинная ваза 2',
        prop: 'v_res_cherubvase',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 420,
        name: 'Старинная ваза 3',
        prop: 'v_res_mbronzvase',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 421,
        name: 'Ваза с цветами 1',
        prop: 'v_res_mvasechinese',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 422,
        name: 'Ваза с цветами 2',
        prop: 'v_res_rosevase',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 423,
        name: 'Ваза с цветами 3',
        prop: 'v_res_rosevasedead',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 424,
        name: 'Тумба для обуви',
        prop: 'v_res_tre_sideboard',
        cost: 15000,
        cat: 'chest'
    },
    {
        id: 425,
        name: 'Томаты',
        prop: 'v_ret_247_choptom',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 426,
        name: 'Кола',
        prop: 'v_ret_247_popcan2',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 427,
        name: 'Кукуруза',
        prop: 'v_ret_247_swtcorn2',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 428,
        name: 'Пицца',
        prop: 'v_ret_fh_pizza01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 429,
        name: 'Ящик пива 1',
        prop: 'v_ret_ml_beerben1',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 430,
        name: 'Ящик пива 2',
        prop: 'v_ret_ml_beerbla1',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 431,
        name: 'Ящик пива 3',
        prop: 'v_ret_ml_beerlog1',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 432,
        name: 'Принтер',
        prop: 'prop_printer_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 433,
        name: 'CD disk',
        prop: 'v_res_cd',
        cost: 3000,
        cat: 'decor'
    },
    {
        id: 434,
        name: 'Канцелярия',
        prop: 'v_res_desktidy',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 435,
        name: 'Расческа',
        prop: 'p_cs_comb_01',
        cost: 3000,
        cat: 'decor'
    },
    {
        id: 436,
        name: 'Старинная ваза с цветами 1',
        prop: 'p_int_jewel_plant_01',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 437,
        name: 'Старинная ваза с цветами 2',
        prop: 'p_int_jewel_plant_02',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 438,
        name: 'Гитара 1',
        prop: 'prop_acc_guitar_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 439,
        name: 'Гитара 2',
        prop: 'prop_el_guitar_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 440,
        name: 'Гитара 3',
        prop: 'prop_el_guitar_02',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 441,
        name: 'Гитара 4',
        prop: 'prop_el_guitar_03',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 442,
        name: 'Настенные часы 1',
        prop: 'prop_egg_clock_01',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 443,
        name: 'Настенные часы 2',
        prop: 'prop_hotel_clock_01',
        cost: 30000,
        cat: 'decor'
    },
    {
        id: 444,
        name: 'Коврик для йоги 1',
        prop: 'prop_rolled_yoga_mat',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 445,
        name: 'Телескоп',
        prop: 'prop_t_telescope_01b',
        cost: 35000,
        cat: 'decor'
    },
    {
        id: 446,
        name: 'Коврик для йоги 2',
        prop: 'p_yoga_mat_01_s',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 447,
        name: 'Коврик для йоги 3',
        prop: 'p_yoga_mat_02_s',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 448,
        name: 'Бутылка пива',
        prop: 'prop_amb_beer_bottle',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 449,
        name: 'Пончик',
        prop: 'prop_amb_donut',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 450,
        name: 'Бонг',
        prop: 'prop_bong_01',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 451,
        name: 'Джойстик',
        prop: 'prop_controller_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 452,
        name: 'Камера',
        prop: 'prop_cs_cctv',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 453,
        name: 'Бокал',
        prop: 'prop_cs_champ_flute',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 454,
        name: 'Дилдо',
        prop: 'prop_cs_dildo_01',
        cost: 50000,
        cat: 'decor'
    },
    {
        id: 455,
        name: 'Фото',
        prop: 'prop_cs_frank_photo',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 456,
        name: 'Сушилка',
        prop: 'prop_cs_ironing_board',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 457,
        name: 'Чайник',
        prop: 'prop_cs_kettle_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 458,
        name: 'Фоторамка',
        prop: 'prop_cs_photoframe_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 459,
        name: 'Блюдо с едой',
        prop: 'prop_cs_plate_01',
        cost: 5000,
        cat: 'decor'
    },
    // {
    //     id: 460,
    //     name: 'Ящик для одежды',
    //     prop: 'prop_cs_plate_01',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 461,
        name: 'Наушники',
        prop: 'prop_ear_defenders_01',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 462,
        name: 'Настенные часы лофт',
        prop: 'prop_id2_20_clock',
        cost: 25000,
        cat: 'decor'
    },
    {
        id: 463,
        name: 'Колонка',
        prop: 'prop_mp3_dock',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 464,
        name: 'Бумбокс',
        prop: 'prop_tapeplayer_01',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 465,
        name: 'Штаны',
        prop: 'p_laz_j02_s',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 466,
        name: 'Ковер',
        prop: 'p_loose_rag_01_s',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 467,
        name: 'Стопка одежды 2',
        prop: 'p_t_shirt_pile_s',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 468,
        name: 'Лампа на подвесах',
        prop: 'prop_fragtest_cnst_06',
        cost: 40000,
        cat: 'lamp'
    },
    {
        id: 469,
        name: 'Таблетки',
        prop: 'ng_proc_drug01a002',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 470,
        name: 'Обогреватель',
        prop: 'prop_elec_heater_01',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 471,
        name: 'Колонка большая 1',
        prop: 'prop_speaker_07',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 472,
        name: 'Колонка большая 2',
        prop: 'prop_speaker_06',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 473,
        name: 'Колонка большая 3',
        prop: 'prop_speaker_03',
        cost: 20000,
        cat: 'decor'
    },
    {
        id: 474,
        name: 'Микроволновка 1',
        prop: 'prop_micro_02',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 475,
        name: 'Микроволновка 2',
        prop: 'prop_micro_04',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 476,
        name: 'Чашка 1',
        prop: 'prop_mug_02',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 477,
        name: 'Чашка 2',
        prop: 'prop_mug_03',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 478,
        name: 'Чашка 3',
        prop: 'prop_mug_04',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 479,
        name: 'Сахарница',
        prop: 'v_res_fa_potsug',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 480,
        name: 'Чай',
        prop: 'v_res_fa_pottea',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 481,
        name: 'Специи 1',
        prop: 'v_res_foodjara',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 482,
        name: 'Специи 2',
        prop: 'v_res_foodjarb',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 483,
        name: 'Специи 3',
        prop: 'v_res_foodjarc',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 484,
        name: 'Чашка',
        prop: 'v_res_mcofcupdirt',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 485,
        name: 'Тарелка 1',
        prop: 'v_res_mbowl',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 486,
        name: 'Тарелка 2',
        prop: 'v_res_mplatelrg',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 487,
        name: 'Стопка тарелок',
        prop: 'v_res_tt_bowlpile02',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 488,
        name: 'Холодильник пива',
        prop: 'prop_bar_beerfridge_01',
        cost: 70000,
        cat: 'decor'
    },
    {
        id: 489,
        name: 'Шейкер',
        prop: 'prop_bar_cockshaker',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 490,
        name: 'Набор трубочек',
        prop: 'prop_bar_drinkstraws',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 491,
        name: 'Закуска лимон',
        prop: 'prop_bar_lemons',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 492,
        name: 'Закуска лайм',
        prop: 'prop_bar_limes',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 493,
        name: 'Закуска орешки',
        prop: 'prop_bar_nuts',
        cost: 5000,
        cat: 'decor'
    },
    {
        id: 494,
        name: 'Виски Richards',
        prop: 'prop_bottle_richard',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 495,
        name: 'Коньяк',
        prop: 'prop_bottle_cognac',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 496,
        name: 'Шампанское',
        prop: 'prop_champ_01b',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 497,
        name: 'Текила',
        prop: 'prop_tequila_bottle',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 498,
        name: 'Бильярдный стол 1',
        prop: 'prop_pooltable_02',
        cost: 120000,
        cat: 'decor'
    },
    {
        id: 499,
        name: 'Бильярдный стол 2',
        prop: 'prop_pooltable_3b',
        cost: 120000,
        cat: 'decor'
    },
    {
        id: 500,
        name: 'Дартс',
        prop: 'prop_dart_bd_01',
        cost: 15000,
        cat: 'decor'
    },
    {
        id: 501,
        name: 'Ковер 1',
        prop: 'apa_mp_h_acc_rugwooll_03',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 502,
        name: 'Ковер 2',
        prop: 'apa_mp_h_acc_rugwoolm_01',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 503,
        name: 'Ковер 3',
        prop: 'apa_mp_h_acc_rugwoolm_02',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 504,
        name: 'Ковер 4',
        prop: 'apa_mp_h_acc_rugwoolm_03',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 505,
        name: 'Ковер 5',
        prop: 'apa_mp_h_acc_rugwoolm_04',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 506,
        name: 'Ковер 6',
        prop: 'apa_mp_h_acc_rugwools_01',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 507,
        name: 'Ковер 7',
        prop: 'apa_mp_h_acc_rugwools_03',
        cost: 10000,
        cat: 'decor'
    },
    {
        id: 508,
        name: 'Шкаф 1',
        prop: 'apa_mp_h_str_shelffloorm_02',
        cost: 30000,
        cat: 'wardrobe'
    },
    {
        id: 509,
        name: 'Шкаф 2',
        prop: 'apa_mp_h_str_shelffreel_01',
        cost: 30000,
        cat: 'wardrobe'
    },
    {
        id: 510,
        name: 'Шкаф 3',
        prop: 'apa_mp_h_str_shelfwallm_01',
        cost: 15000,
        cat: 'wardrobe'
    },
    {
        id: 511,
        name: 'Беговая дорожка',
        prop: 'apa_p_apdlc_treadmill_s',
        cost: 60000,
        cat: 'decor'
    },
    {
        id: 512,
        name: 'Шкаф с одеждой',
        prop: 'bkr_prop_biker_garage_locker_01',
        cost: 15000,
        cat: 'wardrobe'
    },
    // {
    //     id: 513,
    //     name: 'Беговая дорожка',
    //     prop: 'apa_p_apdlc_treadmill_s',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 514,
    //     name: 'Кухня в сборе 1',
    //     prop: 'apa_mp_h_kit_kitchen_01_a',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 515,
    //     name: 'Кухня в сборе 2',
    //     prop: 'apa_mp_h_kit_kitchen_01_b',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 516,
    //     name: 'Люстра 1',
    //     prop: 'v_44_kitc_chand',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 517,
    //     name: 'Люстра 2',
    //     prop: 'prop_chall_lamp_01n',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 518,
    //     name: 'Люстра 3',
    //     prop: 'prop_chall_lamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 519,
    //     name: 'Люстра 4',
    //     prop: 'prop_chall_lamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 520,
    //     name: 'Подвесная лампа 1',
    //     prop: 'prop_wall_light_12',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 521,
        name: 'Подвесная лампа 2',
        prop: 'xm_base_cia_lamp_ceiling_02a',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 522,
        name: 'Подвесная лампа 3',
        prop: 'ch_prop_ch_lamp_ceiling_01a',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 523,
        name: 'Подвесная лампа 4',
        prop: 'apa_mp_h_lampbulb_multiple_a',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 524,
        name: 'Подвесная лампа 5',
        prop: 'apa_mp_h_lit_lightpendant_01',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 525,
        name: 'Подвесная лампа 6',
        prop: 'apa_mp_h_lit_lightpendant_05',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 526,
        name: 'Подвесная лампа 7',
        prop: 'apa_mp_h_lit_lightpendant_05b',
        cost: 40000,
        cat: 'lamp'
    },
    {
        id: 527,
        name: 'Подвесная лампа 8',
        prop: 'bkr_prop_biker_pendant_light',
        cost: 30000,
        cat: 'lamp'
    },
    {
        id: 528,
        name: 'Подвесная лампа 9',
        prop: 'xs_prop_arena_lights_ceiling_l_c',
        cost: 25000,
        cat: 'lamp'
    },
    {
        id: 529,
        name: 'Подвесная лампа 10',
        prop: 'ex_mp_h_lit_lightpendant_01',
        cost: 30000,
        cat: 'lamp'
    },
    // {
    //     id: 530,
    //     name: 'Лавовая лампа',
    //     prop: 'v_57_lavalamp',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 531,
        name: 'Подвесная лампа 11',
        prop: 'v_9_glasslamps',
        cost: 50000,
        cat: 'lamp'
    },
    // {
    //     id: 532,
    //     name: 'Подвесная лампа 12',
    //     prop: 'apa_mp_h_05_dining_light',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 533,
        name: 'Раковина 1',
        prop: 'prop_sink_02',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 534,
        name: 'Раковина 2',
        prop: 'prop_sink_04',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 5340,
        name: 'Раковина 3',
        prop: 'prop_sink_05',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 535,
        name: 'Раковина 4',
        prop: 'prop_sink_06',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 536,
        name: 'Унитаз',
        prop: 'prop_toilet_01',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 537,
        name: 'Унитаз',
        prop: 'prop_toilet_02',
        cost: 7000,
        cat: 'plumbing'
    },
    {
        id: 538,
        name: 'Ершик',
        prop: 'prop_toilet_brush_01',
        cost: 5000,
        cat: 'plumbing'
    },
    {
        id: 539,
        name: 'Туалетная бумага',
        prop: 'prop_toilet_roll_02',
        cost: 5000,
        cat: 'plumbing'
    },
    {
        id: 540,
        name: 'Ванный декор 1',
        prop: 'prop_toilet_shamp_01',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 541,
        name: 'Ванный декор 2',
        prop: 'prop_toilet_shamp_02',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 542,
        name: 'Ванный декор 3',
        prop: 'prop_toilet_soap_01',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 543,
        name: 'Ванный декор 4',
        prop: 'prop_toilet_soap_03',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 544,
        name: 'Ванный декор 5',
        prop: 'prop_toilet_soap_04',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 545,
        name: 'Ванная',
        prop: 'apa_mp_h_bathtub_01',
        cost: 50000,
        cat: 'plumbing'
    },
    {
        id: 546,
        name: 'Старинный шкаф',
        prop: 'v_res_mcupboard',
        cost: 10000,
        cat: 'wardrobe'
    },
    // {
    //     id: 547,
    //     name: 'Гардеробная 1',
    //     prop: 'v_16_wardrobe',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 548,
    //     name: 'Гардеробная 2',
    //     prop: 'v_16_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 549,
    //     name: 'Гардеробная 3',
    //     prop: 'apa_mpa2_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 550,
    //     name: 'Гардеробная 4',
    //     prop: 'apa_mpa3_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 551,
    //     name: 'Шкаф с одеждой',
    //     prop: 'ba_wardrobe',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    {
        id: 552,
        name: 'Шкаф белый',
        prop: 'v_res_tre_wardrobe',
        cost: 20000,
        cat: 'wardrobe'
    },
    {
        id: 553,
        name: 'Набор ножей 1',
        prop: 'v_res_mknifeblock',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 554,
        name: 'Набор ножей 2',
        prop: 'v_res_mkniferack',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 555,
        name: 'Холодильник 1',
        prop: 'v_res_fridgemodsml',
        cost: 40000,
        cat: 'plumbing'
    },
    {
        id: 556,
        name: 'Набор лопаток',
        prop: 'v_res_mutensils',
        cost: 7000,
        cat: 'decor'
    },
    {
        id: 557,
        name: 'Газовая духовка',
        prop: 'prop_cooker_03',
        cost: 25000,
        cat: 'plumbing'
    },
    // {
    //     id: 558,
    //     name: 'Кухня в сборе 3',
    //     prop: 'apa_mpa2_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 559,
    //     name: 'Кухня в сборе 4',
    //     prop: 'apa_mpa3_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 560,
    //     name: 'Кухня в сборе 5',
    //     prop: 'apa_mp_h_04_kitchen_dining',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 561,
    //     name: 'Кухня в сборе 6',
    //     prop: 'apa_mpa6_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 562,
    //     name: 'Кухня в сборе 7',
    //     prop: 'apa_mp_h_08_kitchen_dining',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 563,
    //     name: 'Кухня в сборе 8',
    //     prop: 'apa_mp_stilts_a_kitchen_dtl',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 564,
    //     name: 'Кухня в сборе 9',
    //     prop: 'apa_mp_stilts_b_kitchen_dtl',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 565,
    //     name: 'Кухня в сборе 10',
    //     prop: 'ex_office_02a_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 566,
    //     name: 'Кухня в сборе 11',
    //     prop: 'sf_int1_3_kitchen_cabinets',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 567,
    //     name: 'Кухня в сборе 12',
    //     prop: 'h4_int_sub_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // }























]
