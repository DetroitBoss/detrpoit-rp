import {Vector3WithHeading} from "../system";
import {NpcParameters} from "../../server/modules/npc";
import {AnimationData} from "../anim";

export const HALLOWEEN_EXCHANGE_NPC_ID = 'halloween-exchange-npc';
export const HALLOWEEN_EXCHANGE_NPC_NAME = 'Обменщик';
export const HALLOWEEN_EXCHANGE_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1676.36, 3688.48, 34.32),
    Heading: 93,
    Model: 'u_m_o_filmnoir',
    Name: HALLOWEEN_EXCHANGE_NPC_NAME
}

export const HALLOWEEN_EXCHANGE_STARTS_DATE = new Date(2021, 11, 8, 4, 30);

export const HALLOWEEN_SWEET_NPC_ID = 'halloween-sweet-npc';
export const HALLOWEEN_SWEET_NPC_NAME = 'Конфетчик';
export const HALLOWEEN_SWEET_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1661.29, 3687.51, 34.23),
    Heading: 210,
    Name: HALLOWEEN_SWEET_NPC_NAME,
    Model: 's_m_m_strperf_01'
};

export const HALLOWEEN_GHOSTBUSTER_NPC_ID = 'halloween-ghostbuster';
export const HALLOWEEN_GHOSTBUSTER_NPC_NAME = 'Рэй Стэнц';
export const HALLOWEEN_GHOSTBUSTER_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1669.18, 3691.57, 34.25),
    Heading: 183,
    Model: 's_m_y_clown_01',
    Name: HALLOWEEN_GHOSTBUSTER_NPC_NAME
}

export const HALLOWEEN_GHOSTS_QUEST_NPC_ID = 'halloween-ghosts-quest-1';
export const HALLOWEEN_GHOSTS_QUEST_NPC_NAME = 'Старый дед';
export const HALLOWEEN_GHOSTS_QUEST_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(2528.81, 2586.80, 37.94),
    Heading: 0,
    Model: 'ig_cletus',
    Name: HALLOWEEN_GHOSTS_QUEST_NPC_NAME
}

export const HALLOWEEN_START_QUEST_ID = 'halloween-first-quest';
export const HALLOWEEN_START_QUEST_NAME = 'Операция Ы';
export const BOAR_MEAL_ITEM_ID = 830;
export const QUEST_1_BOAR_MEAL_GOAL = 2;
export const CHIPS_ITEM_ID = 21;
export const QUEST_1_CHIPS_GOAL = 1;
export const MILK_ITEM_ID = 9000;
export const QUEST_1_MILK_GOAL = 10;
export const POTATO_ITEM_ID = 7020;
export const QUEST_1_POTATO_GOAL = 50;
export const BLUEBERRY_ITEM_ID = 7030;
export const QUEST_1_BLUEBERRY_GOAL = 15;

export const QUEST_1_OBJECT_TO_FIND_NAME = 'странный предмет';
export const QUEST_1_OBJECT_TO_FIND_MODEL = 'vw_prop_casino_art_skull_01a';
export const QUEST_1_OBJECT_GOAL = 3;
export const QUEST_1_OBJECT_POSITIONS: Vector3WithHeading[] = [
    [new mp.Vector3(2433.79, 4972.22, 41.29), 136],
    [new mp.Vector3(2428.87, 4966.58, 45.55), 303],
    [new mp.Vector3(2435.20, 4973.67, 45.62), 223],
    [new mp.Vector3(2456.54, 4983.07, 46.81), 134],
    [new mp.Vector3(2457.15, 4973.77, 45.92), 64],
    [new mp.Vector3(2451.55, 4977.93, 46.29), 135],
    [new mp.Vector3(2445.53, 4989.16, 46.80), 148],
    [new mp.Vector3(2449.25, 4974.21, 51.46), 4],
    [new mp.Vector3(2439.42, 4968.47, 51.21), 319],
    [new mp.Vector3(2444.61, 4976.09, 51.48), 57],
    [new mp.Vector3(2449.47, 4988.66, 50.57), 184],
    [new mp.Vector3(2454.01, 4969.61, 50.57), 354],
    [new mp.Vector3(2453.11, 4979.42, 51.32), 227],
    [new mp.Vector3(2451.28, 4974.31, 51.48), 227],
];

export const QUEST_1_POTIONS_GOAL = 1;

export const HALLOWEEN_HOUSE_POS = new mp.Vector3(2435.76, 4975.81, 46.57);

export const HALLOWEEN_GHOSTS_QUEST_ID = 'halloween-ghosts';
export const HALLOWEEN_GHOSTS_QUEST_NAME = 'Операция НЕ ССЫ';

export const HALLOWEEN_GHOSTS_COLLECT_MODULE_POSITION = new mp.Vector3(2330.15, 2572.39, 45.48);
export const HALLOWEEN_GHOSTS_COLLECT_MODULE_ANIMATION: AnimationData = {
    dictionary: 'anim@heists@money_grab@duffel',
    name: 'loop',
    durationSec: 5
}

export const HALLOWEEN_DESTROY_GHOST_EVENT = 'halloween:ghostDestroyed';
export const HALLOWEEN_START_GHOSTS_DESTROY_EVENT = 'halloween:quest:startGhostsDestroy';
export const HALLOWEEN_END_GHOSTS_DESTROY_EVENT = 'halloween:quest:endGhostsDestroy';
export const HALLOWEEN_GHOSTS_COUNT = 5;
export const HALLOWEEN_GHOSTBUSTERS_CAR_MODEL = 'ecto1';
export const HALLOWEEN_GHOSTBUSTERS_CARS: Vector3WithHeading[] = [
    [new mp.Vector3(1702.13, 3626.23, 35.12), 24],
    [new mp.Vector3(1708.73, 3630.14, 35.02), 28],
    [new mp.Vector3(1716.55, 3634.11, 35.00), 31],
    [new mp.Vector3(1727.27, 3640.48, 34.85), 27],
    [new mp.Vector3(1732.27, 3643.66, 34.92), 27],
    [new mp.Vector3(1685.11, 3620.37, 35.34), 24],
    [new mp.Vector3(1678.55, 3616.52, 35.40), 26],
    [new mp.Vector3(1671.83, 3613.18, 35.38), 27],
    [new mp.Vector3(1666.81, 3610.37, 35.38), 29],
    [new mp.Vector3(1609.94, 3691.19, 34.44), 222],
    [new mp.Vector3(1617.78, 3695.48, 34.37), 208],
    [new mp.Vector3(1623.21, 3698.47, 34.29), 208],
    [new mp.Vector3(1628.55, 3701.49, 34.20), 202],
    [new mp.Vector3(1633.83, 3704.07, 34.12), 208],
    [new mp.Vector3(1640.56, 3707.79, 34.07), 204],
    [new mp.Vector3(1645.91, 3710.69, 34.03), 205],
];
export const GHOSTBUSTERS_BACKPACK_MODEL = 'ghostbusters_bag';
export const GHOST_MODEL = 'on_slime';
export const GHOST_APPEARS_POSITIONS: Vector3WithHeading[] = [
    [new mp.Vector3(2435.17, 4959.56, 46.82), 331],
    [new mp.Vector3(2443.07, 4969.24, 46.81), 127],
    [new mp.Vector3(2448.36, 4980.31, 46.81), 48],
    [new mp.Vector3(2455.82, 4994.02, 46.81), 129],
    [new mp.Vector3(2444.39, 4975.90, 46.81), 130],
    [new mp.Vector3(2435.05, 4963.13, 46.81), 337],
    [new mp.Vector3(2443.86, 4965.10, 46.81), 46],
    [new mp.Vector3(2454.73, 4981.11, 46.81), 225],
    [new mp.Vector3(2450.35, 4975.20, 51.56), 48],
    [new mp.Vector3(2443.73, 4984.58, 51.56), 124],
    [new mp.Vector3(2442.24, 4976.45, 51.56), 272],
    [new mp.Vector3(2439.14, 4969.12, 51.56), 313],
    [new mp.Vector3(2452.17, 4973.77, 51.56), 320],
    [new mp.Vector3(2444.97, 4989.04, 51.70), 217],
    [new mp.Vector3(2435.25, 4973.09, 46.83), 223],
    [new mp.Vector3(2450.70, 4977.27, 46.81), 131],
    [new mp.Vector3(2458.92, 4991.12, 46.81), 137],
    [new mp.Vector3(2430.49, 4968.24, 46.82), 220],
    [new mp.Vector3(2448.02, 4969.72, 46.81), 39],
    [new mp.Vector3(2445.23, 4988.32, 46.81), 141],
    [new mp.Vector3(2454.72, 4984.12, 46.81), 32],
    [new mp.Vector3(2454.34, 4989.73, 46.81), 41],
    [new mp.Vector3(2452.82, 4982.17, 48.06), 137],
    [new mp.Vector3(2452.68, 4981.69, 48.06), 39],
    [new mp.Vector3(2446.89, 4976.70, 51.56), 318],
];
export const GHOST_DAMAGE_PER_SECOND = 40;
export const GHOST_HEALTH = 100;

export const HALLOWEEN_PORTALS_QUEST_ID = 'halloween-portal-quest';
export const HALLOWEEN_PORTALS_QUEST_NAME = 'Операция СХОДКА';

export const HALLOWEEN_PORTALS_ARMORS_GOAL = 2;

export const HALLOWEEN_PORTAL_MODEL = 'netherportal';
export const HALLOWEEN_PORTAL_POSITION = new mp.Vector3(-549.74, -261.05, 34.34);
export const HALLOWEEN_PORTAL_HEADING = 252;

export const HALLOWEEN_ENTER_PORTAL_EVENT = 'halloween:enterPortal';
export const HALLOWEEN_ZOMBIE_KILLED_EVENT = 'halloween:killZombie';
export const HALLOWEEN_EXIT_PORTAL_EVENT = 'halloween:exitPortal';

export const HALLOWEEN_ISLAND_PORTAL_POSITION = new mp.Vector3(5322.75, -5249.59, 31.44);
export const HALLOWEEN_ISLAND_DIMENSION_BASE = 1000013;
export const HALLOWEEN_ISLAND_ZOMBIES_POSITIONS: Vector3WithHeading[] = [
    [new mp.Vector3(5393.33,-5237.47,34.04), 73],
    [new mp.Vector3(5381.45,-5231.26,33.05), 90],
    [new mp.Vector3(5373.11,-5223.51,32.15), 130],
    [new mp.Vector3(5364.69,-5216.29,31.26), 123],
    [new mp.Vector3(5357.34,-5213.02,30.96), 99],
    [new mp.Vector3(5346.36,-5204.38,30.95), 141],
    [new mp.Vector3(5337.82,-5202.20,31.75), 146],
    [new mp.Vector3(5329.58,-5199.73,31.88), 149],
    [new mp.Vector3(5318.25,-5202.50,31.74), 206],
    [new mp.Vector3(5301.80,-5207.36,31.79), 209],
    [new mp.Vector3(5287.15,-5217.61,30.86), 147],
    [new mp.Vector3(5269.11,-5233.38,27.57), 217],
    [new mp.Vector3(5272.77,-5261.83,28.67), 272],
    [new mp.Vector3(5278.17,-5285.01,31.04), 298],
    [new mp.Vector3(5284.99,-5293.98,32.26), 311],
    [new mp.Vector3(5294.35,-5306.25,34.13), 242],
    [new mp.Vector3(5301.34,-5313.67,35.19), 320],
    [new mp.Vector3(5309.08,-5315.97,35.47), 10],
    [new mp.Vector3(5315.01,-5314.35,35.87), 29],
    [new mp.Vector3(5320.45,-5310.95,36.05), 336],
    [new mp.Vector3(5335.59,-5302.39,36.51), 46],
    [new mp.Vector3(5339.92,-5299.90,36.68), 24],
    [new mp.Vector3(5348.61,-5301.59,37.23), 36],
    [new mp.Vector3(5363.26,-5292.02,34.87), 61],
    [new mp.Vector3(5375.14,-5277.79,34.78), 57],
    [new mp.Vector3(5388.76,-5259.67,34.66), 68],
    [new mp.Vector3(5381.93,-5269.25,34.61), 82],
    [new mp.Vector3(5395.42,-5254.91,34.83), 25],
];
export const HALLOWEEN_ZOMBIES_MODELS: string[] = [
    "u_m_o_filmnoir",
    "ig_johnnyklebitz",
    "s_m_m_movalien_01",
    "u_m_y_zombie_01",
    "u_f_m_drowned_01",
    "s_m_m_strperf_01",
    "u_f_y_corpse_01",
    "u_m_m_prolsec_01"
];

export const HALLOWEEN_PORTALS_ZOMBIES_GOAL = 20;

export const HALLOWEEN_PORTALS_QUEST_BAG_REWARD_ITEM_ID = 2088;

export const HALLOWEEN_ZOMBIES_DAMAGE = 30;
export const HALLOWEEN_PLAYER_TO_ZOMBIES_DAMAGE = 20;

export const HALLOWEEN_ZOMBIES_EVENT_GROUP_LENGTH = 5;