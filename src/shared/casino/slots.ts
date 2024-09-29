import {CHIPS_TYPES_SUM} from "./main";

export const CASINO_SLOTS_DATA:{hash: number, model: string}[] = [
    {hash: -1932041857, model: 'vw_prop_casino_slot_01a'},
    {hash: -1519644200, model: 'vw_prop_casino_slot_02a'},
    {hash: -430989390, model: 'vw_prop_casino_slot_03a'},
    {hash: 654385216, model: 'vw_prop_casino_slot_04a'},
    {hash: 161343630, model: 'vw_prop_casino_slot_05a'},
    {hash: 1096374064, model: 'vw_prop_casino_slot_06a'},
    {hash: 207578973, model: 'vw_prop_casino_slot_07a'},
    {hash: -487222358, model: 'vw_prop_casino_slot_08a'},
]
export const CASINO_SLOT_SEAT_OFFSET = {x: -0.00, y: -1.0, z: 0.68, h: 0, sy: -1.50}
export const CASINO_SLOT_ENTER_DISTANCE = 1.25;
export const CASINO_SLOT_BETS_LIST:CHIPS_TYPES_SUM[] = [10, 50, 100, 500]
export const CASINO_SLOT_STEP = 22.5;

export const rulesMap: {[key: number]: string[]} = {
    [0]: [],
    [2]: [],
    [5]: [],
    [25]: ['6-6-6', '2-2-2'],
    [50]: ['1-1-1'],
    [75]: ['3-3-3'],
    [100]: ['7-7-7'],
    [250]: ['0-0-0'],
    [500]: ['4-4-4'],
    [1000]: ['5-5-5'],
};

export const rules: {[key: string]: number} = {
    '6-6-6': 25,
    '2-2-2': 25,
    '1-1-1': 25,
    '3-3-3': 25,
    '7-7-7': 25,
    '0-0-0': 25,
    '4-4-4': 25,
    '5-5-5': 25,
};

const notWinNumbers = new Set<string>();

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {
            if (i === 4 || j === 4 || k === 4) {
                continue;
            }

            const numbers = [i, j, k];

            for (let i = 0; i < numbers.length; i++) {
                if (numbers[i] === 6) {
                    numbers[i] = 2;
                }
            }

            if (numbers.every(number => numbers[0] === number)) {
                continue;
            }

            notWinNumbers.add(numbers.join('-'));
        }
    }
}

rulesMap[0] = [...notWinNumbers];


for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        if (i !== 4 && j !== 4) {
            const keys = [
                `4-${i}-${j}`,
                `4-${j}-${i}`,
                `${i}-4-${j}`,
                `${j}-4-${i}`,
                `${i}-${j}-4`,
                `${j}-${i}-4`
            ];
            rules[keys[0]] = 2;
            rules[keys[1]] = 2;
            rules[keys[2]] = 2;
            rules[keys[3]] = 2;
            rules[keys[4]] = 2;
            rules[keys[5]] = 2;
            rulesMap[2].push(keys[0]);
            rulesMap[2].push(keys[1]);
            rulesMap[2].push(keys[2]);
            rulesMap[2].push(keys[3]);
            rulesMap[2].push(keys[4]);
            rulesMap[2].push(keys[5]);
        } else if (i !== 4) {
            const keys = [
                `${i}-4-4`,
                `4-${i}-4`,
                `4-4-${i}`
            ];
            rules[keys[0]] = 5;
            rules[keys[1]] = 5;
            rules[keys[2]] = 5;

            rulesMap[5].push(keys[0]);
            rulesMap[5].push(keys[1]);
            rulesMap[5].push(keys[2]);
        }
    }
}

const rulesPercentage = [
    {
        value: 0,
        pct: 1685
    },
    {
        value: 2,
        pct: 200
    },
    {
        value: 5,
        pct: 100
    },
    {
        value: 25,
        pct: 10
    },
    {
        value: 50,
        pct: 0
    },
    {
        value: 75,
        pct: 0
    },
    {
        value: 100,
        pct: 0
    },
    {
        value: 250,
        pct: 0
    },
    {
        value: 500,
        pct: 0
    },
    {
        value: 1000,
        pct: 0
    }
];

export const slotMachineData = {
    rules,
    rulesMap,
    rulesPercentage
}