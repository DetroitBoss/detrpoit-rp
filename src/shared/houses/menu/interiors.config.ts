export interface ILayout {
    id: number
    name: string
    img: string | string[]
}

export interface IInteriorData {
    id: number
    interiorId: number
    name: string
    cost: number
    isDonate?: boolean
    img: string
    layoutId: number
}

export const layoutsData: ILayout[] = [
    {
        id: 0,
        name: 'Дешевый',
        img: 'layout0'
    },
    {
        id: 1,
        name: 'Средний',
        img: 'layout1'
    },
    {
        id: 2,
        name: 'Дорогой',
        img: ['layout2-1', 'layout2-2']
    },
    {
        id: 3,
        name: "Двухэтажный",
        img: ['layout3-1', 'layout3-2']
    },
    {
        id: 4,
        name: "Элитная",
        img: 'layout4'
    },
    {
        id: 5,
        name: "Элитная 3х этажная",
        img: ['layout5-1', 'layout5-2', 'layout5-3']
    },
    {
        id: 6,
        name: "Престижная с бассейном",
        img: ['layout6-1', 'layout6-2']
    }
]

// img - house
export const interiorsData: IInteriorData[] = [
    {
        id: 0,
        interiorId: 24,
        name: 'Пользовательская №1',
        cost: 200000,
        isDonate: false,
        img: 'interior24',
        layoutId: 0
    },
    {
        id: 1,
        interiorId: 25,
        name: 'Пользовательская №2',
        cost: 250000,
        isDonate: false,
        img: 'interior25',
        layoutId: 0
    },
    {
        id: 2,
        interiorId: 26,
        name: 'Пользовательская №3',
        cost: 300000,
        isDonate: false,
        img: 'interior26',
        layoutId: 0
    },
    {
        id: 3,
        interiorId: 27,
        name: 'Пользовательская №4',
        cost: 500000,
        isDonate: false,
        img: 'interior27',
        layoutId: 1
    },
    {
        id: 4,
        interiorId: 28,
        name: 'Пользовательская №5',
        cost: 600000,
        isDonate: false,
        img: 'interior28',
        layoutId: 1
    },
    {
        id: 5,
        interiorId: 29,
        name: 'Пользовательская №6',
        cost: 10000,
        isDonate: true,
        img: 'interior29',
        layoutId: 1
    },
    {
        id: 6,
        interiorId: 30,
        name: 'Пользовательская №7',
        cost: 2000000,
        isDonate: false,
        img: 'interior30',
        layoutId: 2
    },
    {
        id: 7,
        interiorId: 31,
        name: 'Пользовательская №8',
        cost: 2500000,
        isDonate: false,
        img: 'interior31',
        layoutId: 2
    },
    {
        id: 8,
        interiorId: 32,
        name: 'Пользовательская №9',
        cost: 25000,
        isDonate: true,
        img: 'interior32',
        layoutId: 2
    },
    {
        id: 9,
        interiorId: 33,
        name: 'Пользовательская №10',
        cost: 30000,
        isDonate: true,
        img: 'interior34',
        layoutId: 3
    },
    {
        id: 10,
        interiorId: 34,
        name: 'Пользовательская №11',
        cost: 30000,
        isDonate: true,
        img: 'interior33',
        layoutId: 3
    },
    {
        id: 11,
        interiorId: 35,
        name: 'Пользовательская №12',
        cost: 30000,
        isDonate: true,
        img: 'interior35',
        layoutId: 3
    },
    {
        id: 12,
        interiorId: 36,
        name: 'Пользовательская №13',
        cost: 12000,
        isDonate: true,
        img: 'interior36',
        layoutId: 4
    },
    {
        id: 13,
        interiorId: 37,
        name: 'Пользовательская №14',
        cost: 12000,
        isDonate: true,
        img: 'interior37',
        layoutId: 4
    },
    {
        id: 14,
        interiorId: 38,
        name: 'Пользовательская №15',
        cost: 12000,
        isDonate: true,
        img: 'interior38',
        layoutId: 4
    },
    {
        id: 15,
        interiorId: 39,
        name: 'Пользовательская №16',
        cost: 25000,
        isDonate: true,
        img: 'interior39',
        layoutId: 5
    },
    {
        id: 16,
        interiorId: 40,
        name: 'Пользовательская №17',
        cost: 25000,
        isDonate: true,
        img: 'interior40',
        layoutId: 5
    },
    {
        id: 17,
        interiorId: 41,
        name: 'Пользовательская №18',
        cost: 15000000,
        isDonate: false,
        img: 'interior41',
        layoutId: 5
    },
    {
        id: 18,
        interiorId: 42,
        name: 'Пользовательская 19',
        cost: 10000000,
        isDonate: false,
        img: 'interior42',
        layoutId: 6
    },
    {
        id: 19,
        interiorId: 43,
        name: 'Пользовательская 20',
        cost: 20000,
        isDonate: true,
        img: 'interior43',
        layoutId: 6
    },
    {
        id: 20,
        interiorId: 44,
        name: 'Пользовательская 21',
        cost: 20000,
        isDonate: true,
        img: 'interior44',
        layoutId: 6
    }
]