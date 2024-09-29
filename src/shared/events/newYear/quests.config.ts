import {NpcParameters} from "../../../server/modules/npc";
import {AnimationData} from "../../anim";

// Первый квестовый NPC

export const NEW_YEAR_SANTA_NPC_ID = 'new-year-santa';
export const NEW_YEAR_SANTA_NPC_NAME = 'Санта Клаус';
export const NEW_YEAR_SANTA_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1674.40, 3684.91, 34.32),
    Heading: 5,
    Model: 's_m_y_clown_01',
    Name: NEW_YEAR_SANTA_NPC_NAME
}

// Второй квестовый NPC

export const NEW_YEAR_HARRY_NPC_ID = 'new-year-harry';
export const NEW_YEAR_HARRY_NPC_NAME = 'Гарри';
export const NEW_YEAR_HARRY_NPC_PARAMETERS: NpcParameters = {
        Position: new mp.Vector3(2220.25, 5609.61, 54.71),
        Heading: 117,
        Model: 'ig_isldj_02',
        Name: NEW_YEAR_HARRY_NPC_NAME
}

// Третий квестовый NPC

export const NEW_YEAR_WORD_NPC_POSITION: Vector3Mp = new mp.Vector3(63.42, 118.50, 79.11);
export const NEW_YEAR_WORD_NPC_HEADING: number = 140;
export const NEW_YEAR_WORD_NPC_MODEL: string = 's_m_m_postal_01';
export const NEW_YEAR_WORD_NPC_NAME: string = 'Руслан';
export const NEW_YEAR_WORD_NPC_RANGE: number = 1.5;
export const NEW_YEAR_WORD_NPC_DIMENSION: number = 0;

// Четвертый квестовый NPC

export const NEW_YEAR_HOMELESS_NPC_ID = 'new-year-marv';
export const NEW_YEAR_HOMELESS_NPC_NAME = 'Марв';
export const NEW_YEAR_HOMELESS_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1099.42, -775.49, 58.35),
    Heading: 183,
    Model: 'a_m_m_tramp_01',
    Name: NEW_YEAR_HOMELESS_NPC_NAME
}

// Пятый квестовый NPC

export const NEW_YEAR_SPANISH_NPC_ID = 'new-year-abelardo';
export const NEW_YEAR_SPANISH_NPC_NAME = 'Абелардо';
export const NEW_YEAR_SPANISH_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-1069.57, -1675.77, 4.54),
    Heading: 29,
    Model: 's_m_o_busker_01',
    Name: NEW_YEAR_SPANISH_NPC_NAME
}

// 1ый квест

export const NEW_YEAR_FIRST_QUEST_ID = 'new-year-first-quest';
export const NEW_YEAR_FIRST_QUEST_NAME = 'Ёлкоруб';

export const NEW_YEAR_FIRST_QUEST_COGNAC_ITEM_ID = 215;
export const NEW_YEAR_FIRST_QUEST_COGNAC_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_DONUT_ITEM_ID = 26;
export const NEW_YEAR_FIRST_QUEST_DONUT_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_COFFEE_ITEM_ID = 5;
export const NEW_YEAR_FIRST_QUEST_COFFEE_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_TREES_ITEM_ID = 7011;
export const NEW_YEAR_FIRST_QUEST_TREES_GOAL = 20;


// 2ой квест

export const NEW_YEAR_SECOND_QUEST_ID = 'new-year-second-quest';
export const NEW_YEAR_SECOND_QUEST_NAME = 'Фейхоа или...';

export const NEW_YEAR_SECOND_QUEST_BANANA_ITEM_ID = 25;
export const NEW_YEAR_SECOND_QUEST_BANANA_GOAL = 15;

export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_FIRST = new mp.Vector3(2220.48, 5578.52, 52.72);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_SECOND = new mp.Vector3(2225.49, 5578.14, 52.70);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_THIRD = new mp.Vector3(2231.56, 5575.46, 52.80);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_FOURTH = new mp.Vector3(2223.74, 5575.85, 52.62);

export const NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA: AnimationData = {
    dictionary: 'anim@heists@money_grab@duffel',
    name: 'loop',
    durationSec: 5
}

export const NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT = "Неизвестная трава";
export const NEW_YEAR_SECOND_QUEST_CARRY_GOAL = 2;

// 3ий квест

export const NEW_YEAR_THIRD_QUEST_ID = 'new-year-third-quest';
export const NEW_YEAR_THIRD_QUEST_NAME = 'Сайфер или как найти нужное слово';

export const NEW_YEAR_THIRD_QUEST_VALID_WORD = 'dashound';
export const NEW_YEAR_THIRD_QUEST_HUD_NAME = 'Найти кодовое слово из песни';

// 4ый квест

export const NEW_YEAR_FOURTH_QUEST_ID = 'new-year-fourth-quest';
export const NEW_YEAR_FOURTH_QUEST_NAME = 'Испанский стыд';
export const NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_ITEM_ID = 20;
export const NEW_YEAR_FOURTH_QUEST_COLA_ITEM_ID = 2;
export const NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_GOAL = 2;
export const NEW_YEAR_FOURTH_QUEST_COLA_GOAL = 2;
export const NEW_YEAR_FOURTH_QUEST_BANANA_ITEM_ID = 25;
export const NEW_YEAR_FOURTH_QUEST_BANANA_GOAL = 15;

// 5ый квест

export const NEW_YEAR_FIFTH_QUEST_ID = 'new-year-fifth-quest';
export const NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID = 'new-year-fifth-quest-first';
export const NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID = 'new-year-fifth-quest-second';
export const NEW_YEAR_FIFTH_QUEST_NAME = 'Новогодний переполох';

export const NEW_YEAR_MEGATRON_NPC_ID = 'new-year-megatron';
export const NEW_YEAR_MEGATRON_NPC_NAME = 'Мегатрон';
export const NEW_YEAR_MEGATRON_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-420.54, 1219.48, 325.76),
    Heading: 176,
    Model: 'a_m_m_genfat_02',
    Name: NEW_YEAR_MEGATRON_NPC_NAME
}


export const NEW_YEAR_BOLVANKA_NPC_ID = 'new-year-bolvanka';
export const NEW_YEAR_BOLVANKA_NPC_NAME = 'Охранник';
export const NEW_YEAR_BOLVANKA_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(722.53, 1291.67, 360.30),
    Heading: 181,
    Model: 'csb_prologuedriver',
    Name: NEW_YEAR_BOLVANKA_NPC_NAME
}

export const NEW_YEAR_FIFTH_QUEST_COLLECT_POSITION: Vector3Mp = new mp.Vector3(714.02, 1285.84, 359.30);
export const NEW_YEAR_FIFTH_QUEST_COLLECT_ANIMATION_DATA: AnimationData = {
    dictionary: 'missbigscore1switch_trevor_piss',
    name: 'piss_loop',
    durationSec: 10
};
export const NEW_YEAR_FIFTH_QUEST_COLLECT_HELP_TEXT: string = 'Пытаемся разобраться с проводами';

export const NEW_YEAR_FIFTH_QUEST_COLLECT_HUD_TEXT = 'Найти нужный электрощиток';
export const NEW_YEAR_FIFTH_QUEST_JOB_TYPE = 'electrician';
export const NEW_YEAR_FIFTH_QUEST_JOB_GOAL = 30;
export const NEW_YEAR_FIFTH_QUEST_JOB_HUD_NAME = 'Поработать на электрике';

export const NEW_YEAR_FIFTH_QUEST_PIZZA_ITEM_ID = 24;
export const NEW_YEAR_FIFTH_QUEST_PIZZA_GOAL = 2;

export const NEW_YEAR_FIFTH_QUEST_COLA_ITEM_ID = 2;
export const NEW_YEAR_FIFTH_QUEST_COLA_GOAL = 3;

export const NEW_YEAR_FIFTH_QUEST_ENERGY_ITEM_ID = 7;
export const NEW_YEAR_FIFTH_QUEST_ENERGY_GOAL = 4;

export const NEW_YEAR_FIFTH_QUEST_SIDR_ITEM_ID = 200;
export const NEW_YEAR_FIFTH_QUEST_SIDR_GOAL = 5;

export const NEW_YEAR_FIFTH_QUEST_POTATO_ITEM_ID = 7000;
export const NEW_YEAR_FIFTH_QUEST_POTATO_GOAL = 15;

export const NEW_YEAR_FIFTH_QUEST_TOMATO_ITEM_ID = 7022;
export const NEW_YEAR_FIFTH_QUEST_TOMATO_GOAL = 10;

// 6ой квест

export const NEW_YEAR_SIXTH_QUEST_ID = 'new-year-sixth-quest';
export const NEW_YEAR_SIXTH_QUEST_NAME = 'Конец или новое начало';

export const NEW_YEAR_SIXTH_QUEST_COLLECT_POSITION: Vector3Mp = new mp.Vector3(-744.67, 4323.64, 140.35);
export const NEW_YEAR_SIXTH_QUEST_COLLECT_ANIMATION: AnimationData = {
    dictionary: 'anim@amb@business@bgen@bgen_no_work@',
    name: 'sit_phone_phoneputdown_fallasleep_nowork',
    durationSec: 5
}
export const NEW_YEAR_SIXTH_QUEST_COLLECT_HUD_TEXT = 'Воссоединяемся с природой';
export const NEW_YEAR_SIXTH_QUEST_HUNT_ITEM_ID = 830;
export const NEW_YEAR_SIXTH_QUEST_HUNT_GOAL = 5;

export const NEW_YEAR_SIXTH_QUEST_JOB_TYPE = 'busman:way';
export const NEW_YEAR_SIXTH_QUEST_JOB_GOAL = 4;
export const NEW_YEAR_SIXTH_QUEST_JOB_HUD_NAME = 'Проехать маршрут на работе Автобусника';
export const NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TYPE = 'busman';
export const NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TEXT = 'Уволиться с работы в автобусном депо';

export const NEW_YEAR_SIXTH_QUEST_WORD_TEXT = 'galileo';
export const NEW_YEAR_SIXTH_QUEST_HUD_NAME = 'Найти кодовое слово по описанию';


export const NEW_YEAR_ARIEL_NPC_ID = 'new-year-ariel';
export const NEW_YEAR_ARIEL_NPC_NAME = 'Ариэль';
export const NEW_YEAR_ARIEL_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-747.22, 4323.73, 141.70),
    Heading: 305,
    Model: 'a_f_m_bodybuild_01',
    Name: NEW_YEAR_ARIEL_NPC_NAME
}

export const NEW_YEAR_GALILEO_NPC_POSITION: Vector3Mp = new mp.Vector3(-601.17, 2091.22, 131.50);
export const NEW_YEAR_GALILEO_NPC_HEADING: number = 351;
export const NEW_YEAR_GALILEO_NPC_MODEL: string = 'mp_m_counterfeit_01';
export const NEW_YEAR_GALILEO_NPC_NAME: string = 'Рудокоп';
export const NEW_YEAR_GALILEO_NPC_RANGE: number = 1.5;
export const NEW_YEAR_GALILEO_NPC_DIMENSION: number = 0;

export const NEW_YEAR_FIRST_QUEST_REWARD_LOLLIPOPS = 1000;
export const NEW_YEAR_SECOND_QUEST_REWARD_LOLLIPOPS = 1500;
export const NEW_YEAR_THIRD_QUEST_REWARD_LOLLIPOPS = 1700;
export const NEW_YEAR_FOURTH_QUEST_REWARD_LOLLIPOPS = 2000;

export const NEW_YEAR_FIFTH_QUEST_REWARD_LOLLIPOPS = 500;
export const NEW_YEAR_FIFTH_QUEST_FIRST_LINE_REWARD_LOLLIPOPS = 1500;
export const NEW_YEAR_FIFTH_QUEST_SECOND_LINE_REWARD_LOLLIPOPS = 1500;

export const NEW_YEAR_SIXTH_QUEST_REWARD_LOLLIPOPS = 2500;
export const NEW_YEAR_SIXTH_QUEST_REWARD_ITEM_ID = 888;