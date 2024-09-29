import { ITEM_TYPE } from "./inventory";
import { LicenceType } from "./licence";

/** Конфиг по выдаче стартовых квестов. Должно быть 3 элемента, для первого второго и третьего начального квеста (они являются первыми квестами сюжетной линии). */
export const QUEST_SPAWN_ITEM: {
    x: number, 
    y: number, 
    z: number, 
    h: number, 
    /** ID самого квеста, который будет выдан игроку при создании персонажа. Если не указать - квест выдан не будет */
    questID?: number
}[] = [
    {x: 3.29, y: -1308.97, z: 30.17, h: 293, questID: 1},
    {x: -1057.11, y: -855.24, z: 4.87, h: 151, questID: 500},
    {x: -519.57, y: -258.77, z: 35.59, h: 28},
]

export const QUESTS_DATA: QuestData[] = [
    {
        id: 1, name: "Знакомство со Стэнли", desc: "Описание", reward: 
        [{ type: "cash", value: 500 }, { type: "item", value: 850}], taskStepByStep: true, nextQuest: 2,  botData: {
            id: 0,
            dialogStart: ['Слышь! Я бы не советовал здесь так ошиваться. Места это не тихие.. ', 
            { answers: ['Я тут недалеко работаю.'], onAnswer: () => {                   
                return ['Аа.. тебе работка нужна? Ну ты же понимаешь чем мы тут занимаемся? Мне нужно передать один пакетик своему старому корешу, да самому не безопасно, так как легавые давно пасут. Если хочешь доказать, что на что-то способен, то вот зиплок, замотанный изолентой. Доставь его Россу. Скажи, что это от Стэнли, да сам не вздумай открывать его, координаты указаны на пакете. Арендуй мопед или велик за углом.', 
                { answers: ['Понял, скоро вернусь.'] 
            }]
            } }],
            dialogComplete: [`К легавым ты не пошёл.. Да и сам пакет не вскрыл.. А из тебя может что-нибудь и получиться. Но пока рано об этом думать. В любом случае ты рисковал, не зная, что в пакете и заслужил награду`, {
                answers: ['Приятно было помочь тебе',], onAnswer: (index) => 2
            }],
        },
        tasks: [
            {   
                nameTask: 'Найдите Стэнли',
                descTask: 'Найдите квестового персонажа',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {
                nameTask: 'Найти Росса',
                descTask: 'Найти Росса можно на карте',
                type: "delivertonpc",
                name: "Росс",
                role: "",
                dialog: ['Чего нужно??', { answers: ['Я от Стэнли'], onAnswer: () => {
                    return ['Оу.. ты от Стэнли?', {
                        answers: ['У меня тут пакет для тебя. Держи!'], onAnswer: () => {
                            return ['Лады, пацан. *взял пакет, открыл его, достал оттуда кусок бумаги и прочел вслух*: Братан, это проверка моего нового помощника, и если пакет не был вскрыт до тебя, то пожми руку этому оборванцу, он справился с заданием.', {
                                answers: ['Все нормально? Я могу идти?'], onAnswer: () => {
                                    return ['Охх.. Типичный Стэнли, всегда что-нибудь придумает, когда взбредёт в голову заняться наставничеством и помогать таким бедолагам. Езжай обратно, я передам ему, что всё хорошо.', {
                                        answers: ['Окей, рад был познакомится.'] 
                                    }]
                                }
                            }]
                        }
                    }] 
                } }],
                model: "a_m_m_paparazzi_01",
                x: 446.59, y: -1231.38, z: 29.94, h: 288,
                itemName: "Закрытый пакет",
                blipData: {
                    x: 446.59, y: -1231.38,
                    text: "Росс",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 2,
        name: "На связи", desc: "Описание", reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 3, botData: {
            id: 0,
            dialogStart: ['Пока ты только встаешь на ноги, буду помогать тебе с деньгами, потом ещё отработаешь. Чтобы быть всегда на связи держи мобилу. Съезди купи себе сим-карту и вставь в телефон, она продается в любом магазине электроники.', 
            { answers: ['Что бы я без тебя делал? Скоро вернусь.'], }],
            dialogComplete: ['Дай мне свой номер, вот тебе 500$, кинешь себе на счёт, чтобы всегда быть на связи. Не забудь активировать сим-карту, вставь ее и ознакомься с функциями телефона.', {
                answers: ['Окей, понял.'], onAnswer: (index) => 3 }],
        },
        tasks: [
            {   
                nameTask: 'Купить сим-карту',
                descTask: 'Направляйтесь в любой магазин электроники',
                type: "itemHave",
                item_id: 851,
                blipData: {
                    x: -658.13,
                    y: -853.86,
                    text: "Магазин электроники",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 3, name: "Получение документов", desc: "Описание", reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 4, botData: {
            id: 0,
            dialogStart: ['Если хочешь продолжить работать со мною, то тебе понадобятся документы.', { answers: ['Где их можно достать?.'], onAnswer: () => {
                return ['Ты пока чист, поэтому подделывать их не нужно. Отправляйся в здание правительства, веди себя нормально и получи себе ID-card, так как если будут проблемы с легавыми, то без неё вопросов станет ещё больше.', {
                    answers: ['Понял, скоро вернусь с документами!']
                }]
            } }],
            dialogComplete: [`Я смотрю всё прошло хорошо?`, {
                answers: ['Да, всё клёво'], onAnswer: (idnex) => 4 }],
        },
        tasks: [
            {   
                nameTask: 'Получение документов',
                descTask: 'ID Card - это универсальный документ который можно получить в мэрии!',
                type: "itemHave",
                item_id: 800,
                blipData: {
                    x: -541.83,
                    y: -209.09,
                    text: "Правительство",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 1
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ] 
    },
    {
        id: 4, name: "Знакомство с районом", desc: "Описание", reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 5, botData: {
            id: 0,
            dialogStart: ['Поздравляю с чистой работой, но такая будет не всегда. Возьми 500$ и купи себе энергетик и чипсы похавать, а то выглядишь не очень.', { answers: ['А куда можно сходить?'], onAnswer: () => {
                return ['За углом есть магазин 24 часа маркет, как освоешься возращайся ко мне.', {
                    answers: ['Спасибо Стэнли!']
                }]
            } }],
            dialogComplete: ['Осмотрелся? Как тебе наш район?', {
                answers: ['Да, всё клёво'], onAnswer: (index) => 5 }],
        },
        tasks: [
            {   
                nameTask: 'Купить Энергетик',
                descTask: 'Купить энергетик в любом магазине 24/7',
                type: "itemHave",
                item_id: 7,
                blipData: {
                    x: 28.92,
                    y: -1350.07,
                    text: "Магазин 24/7",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Купить чипсы',
                descTask: 'Купить чипсы в любом магазине 24/7',
                type: "itemHave",
                item_id: 21,
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 5,
        name: "Работа у Тони", desc: "Описание", reward: [{ type: "cash", value: 500 }], 
        taskStepByStep: true, nextQuest: 6, botData: {
            id: 0,
            dialogStart: ['Тут мой кореш звонил - Тони, он работает на ферме у местного авторитета, сходи к нему, он просил надежного парня найти.', { answers: ['Далеко она находится? Как туда лучше добраться ?'], onAnswer: () => {
                return ['За углом есть аренда.', {
                    answers: ['Понял, скоро буду']
                }]
            } }],
            dialogComplete: ['Тони звонил, сказал что ты хороший работник, попросил выдать тебе премию', {
                answers: ['Да, пришлось немного приложить усилий, но деньги хорошие.'], onAnswer: (index) => 6 }],
        },
        tasks: [
            {   
                nameTask: 'Заработайте первые деньги',
                descTask: 'Направляйтесь в гараж Тони и заработайте $700',
                type: "jobFarm",
                job: "marihuana",
                amount: 700,
                blipData: {
                    x: 1966.38,
                    y: 5184.26,
                    text: "Гараж Тони",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 6,
        name: "Получение лицензии", desc: "Описание", reward: [{ type: "cash", value: 1000 }], taskStepByStep: true, nextQuest: 7, botData: {
            id: 0,
            dialogStart: ['А руки растут откуда надо. Деньги эти ещё пригодятся. Всегда лучше иметь при себе немного нала. Так же нам предстоит много гонять, поэтому без прав никуда. После от копов проблем будет больше. Вот тебе 1.000$, направляйся в автошколу и получи права.', 
            { answers: ['Спасибо Стэнли! До скорой встречи.'], }],
            dialogComplete: ['Молодец, ты хороший водитель', {
                answers: ['Я знаю брат'], onAnswer: (index) => 7 }],
        },
        tasks: [
            {   
                nameTask: 'Получение прав',
                descTask: 'Направляйтесь в автошколу чтоб получить водительские права',
                type: "licenseHave",
                license: "car",
                blipData: {
                    x: -711.94,
                    y: -1299.51,
                    text: "Автошкола",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 7,
        name: "Плати везде", desc: "Описание", reward: [{ type: "cash", value: 500 }, {type: "item", value: 813}], nextQuest: 8, taskStepByStep: true, botData: {
            id: 0,
            dialogStart: ['Что бы двигаться в этом городе, тебе нужна банковская карта. Оформи ее в любом банке, через нее в будущем будем отмывать бабки.', 
            { answers: ['Отмывать бабки круто, скоро вернусь.'], }],
            dialogComplete: ['Оформил карту?', {
                answers: ['Да, все прошло нормально.'], onAnswer: (index) => 8 }],
        },
        tasks: [
            {   
                nameTask: 'Оформите банковскую карту',
                descTask: 'Направляйтесь в банк',
                type: "itemHave",
                item_id: 801,
                blipData: {
                    x: 151.19,
                    y: -1037.22,
                    text: "Банк",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 8,
        name: "Опасный район", desc: "Описание", reward: [{ type: "license", value: 15, licenseType: "weapon", }, {type: "item", value: 813}], taskStepByStep: true, nextQuest: 9, botData: {
            id: 0, 
            dialogStart: ['Я говорил про небезопасное место, без валыны тут никто не ходит. Ты уже имеешь некоторые связи, но отбитых здесь всегда хватало. Чтобы всё те же легавые не трогали тебя, купи себе лицензию на оружие. Так почти всегда будешь перед ними чист, я уже попросил Росса сделать тебе лицензии, он оставил их под мусорным баком.', 
            { answers: ['Я мигом.'], }],
            dialogComplete: ['Открыл уже конверт?', {
                answers: ['Да, все круто.'], onAnswer: (index) => 9 }],
        },
        tasks: [
            {   
                nameTask: 'Заберите лицензию на оружие',
                descTask: 'Стэнли попросил Росса сделать вам лицензию, заберите ее',
                type: "gotopos",
                x: 446.59,
                y: -1231.38,
                z: 29.94,
                text:"Какой-то конверт",
                blipData: {
                    x: 446.59,
                    y: -1231.38,
                    text: "Конверт с лицензией",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 11
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
    
        id: 9,
        name: "Темные делишки", desc: "Описание", reward: [
            { type: "item", value: 856, }, 
            { type: "cash", value: 1000, },
            ],  taskStepByStep: true,
            botData: {
            id: 0,
            dialogStart: ['Мне тут еще звонил Ламар, он занимается разборкой тачек в нашем штате. Ему срочно нужна машина, держи отмычки они тебе нужны чтоб вскрыть тачку.', 
            { answers: ['Держу путь к Ламару'], }],
            dialogComplete: ['Чисто сработал, держи тебе планшет, там будет вся твоя важная информация о твоем имуществе. После дела нужно лечь на дно, поэтому заданий пока больше не будет. Держи десятку на первую тачку.', {
                answers: ['Спасибо за планшет, работа была непростая.'], }],
        },
        tasks: [
            {   
                nameTask: 'Направляйтесь к Ламару.',
                descTask: 'Узнай какую тачку нужно угнать и привези ее к нему.',
                type: "lamar",
                blipData: {
                    x: 294.22,
                    y: -1187.72,
                    text: "Ламар",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Стэнли',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 500,
        name: "Проверка на честность", desc: "Описание", reward: [{ type: "cash", value: 500 }, { type: "item", value: 850}],
        taskStepByStep: true,
            nextQuest: 501, botData: {
            id: 500,
            dialogStart: ['Приветствую тебя. Ты так ходишь и неуверенно смотришь по сторонам, может тебе нужна помощь? ', 
            { answers: ['А чем вы можете мне помочь?'], onAnswer: () => {
                return ['Я временами помогаю основаться людям, которые за честный труд и всего хотят добиться сами. Узнать честный ты или нет - очень просто. Вот конверт, в нём 500$ долларов, я должен их за работу своему подчинённому, он как раз сейчас ждёт их. Если ты за честный труд, то отнеси их Аврааму, он в нескольких кварталах отсюда. Или можешь забрать их себе, но тогда мне с тобой больше не о чем разговаривать. Арендуй велосипед тут за углом.', {
                    answers: ['Надеюсь что это рядом.']
                } ]
            } }],
            dialogComplete: ['Ты прошёл проверку, такие люди мне нужны. Мы с тобой ещё много чего добьёмся, хотя я уже и так всего достиг, а сейчас по большей части помогаю сам людям. Ты молодец, что не обманул меня. Я хочу тебя поблагодарить, возьми в дар от меня 500$.', {
                answers: ['Спасибо тебе за работу.'], onAnswer: () => 501 }],
        },
        tasks: [
            {   
                nameTask: 'Найдите Джеффри',
                descTask: 'Найдите квестового персонажа',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {
                nameTask: 'Найти Авраама',
                descTask: 'Передайте Аврааму конверт',
                type: "delivertonpc",
                name: "Авраам",
                role: "",
                dialog: ['Оу, моя зарплата? Спасибо тебе большое. Ведь ты мог просто взять мои деньги и сбежать. Видно, что остались здесь порядочные люди. Мой Босс сказал, что хочет видеть тебя и помочь, поэтому возвращайся к нему', 
                { answers: ['Надеюсь что все хорошо'], }],
                model: "ig_barry",
                x: -1307.28, 
                y: -833.50, 
                z: 17.09, 
                h: 197,
                itemName: "Конверт с зарплатой",
                blipData: {
                    x: -1307.28, 
                    y: -833.50, 
                    text: "Авраам",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]  
    },
    {
        id: 501,
        name: "На связи", desc: "Описание", reward: [{ type: "cash", value: 500 }], nextQuest: 502, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [' Ну и согласись, куда сейчас без телефона? Держи, тебе нужно только купить SIM-карту Они есть в любом магазине электроники. Быть на связи сейчас важно.', 
            { answers: ['Что бы я без тебя делал? Скоро вернусь.'], }],
            dialogComplete: ['У тебя на балансе уже есть немного денег, на первое время хватит.', {
                answers: ['Принял.'], onAnswer: (index) => 502 }],
        },
        tasks: [
            {   
                nameTask: 'Купить сим-карту',
                descTask: 'Направляйтесь в любой магазин электроники',
                type: "itemHave",
                item_id: 851,
                blipData: {
                    x: -658.13,
                    y: -853.86,
                    text: "Магазин электроники",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 502, name: "Получение документов", desc: "Описание", reward: [{ type: "cash", value: 1000 }], nextQuest: 503, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: ['В наше время на нормальную работу без ID-card никуда не устроишься. Да и честному человеку нечего скрывать. Отправляйся в мэрию и получи себе документ, удостоверяющий твою личность, а уже после можно будет и о заработке подумать. ', { answers: ['А есть тут аренда транспорта рядом?.'], onAnswer: () => {
                return ['За углом можешь арендовать мопед или велосипед', {
                    answers: ['Понял, скоро вернусь с документами!']
                }]
            } }],
            dialogComplete: [`Так уже лучше. Теперь можно и приступить к получению первых денег, которые ты заработаешь своим трудом. Я сам не сразу пришёл к тому, что имею. И у тебя получится, но тут и руками нужно уметь работать.`, {
                answers: ['Согласен'], onAnswer: (idnex) => 503 }],
        },
        tasks: [
            {   
                nameTask: 'Получение документов',
                descTask: 'ID Card - это универсальный документ который можно получить в мэрии!',
                type: "itemHave",
                item_id: 800,
                blipData: {
                    x: -541.83,
                    y: -209.09,
                    text: "Правительство",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ] 
    },
    {
        id: 503,
        name: "Трудная работа", desc: "Описание", reward: [{ type: "cash", value: 500 }], nextQuest: 504, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: ['Тут недалеко есть стройка, там всегда нужны рабочие, направляйся туда и заработай немного денег.', { answers: ['Пришло время поработать руками.'], }],
            dialogComplete: ['Ты неплохо потрудился и заработал своим трудом первые деньги. Было непросто, да? ', {
                answers: ['Да, мне даже понравилось'], onAnswer: (index) => 504 }],
        },
        tasks: [
            {   
                nameTask: 'Заработайте первые деньги',
                descTask: 'Направляйтесь на стройку и заработайте 700$',
                type: "jobFarm",
                job: "builder",
                amount: 700,
                blipData: {
                    x: -510.88,
                    y: -999.74,
                    text: "Стройка",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 504,
        name: "Питание - залог", desc: "Описание", reward: [{ type: "cash", value: 1000 }], nextQuest: 505, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: ['Физический труд утомляет, не правда? Предлагаю тебе покушать. Возьми мои 800$ и отправляйся в ближайший магазин 24/7  Купи себе чего-нибудь, а то впереди ещё задания и тяжелая работа', { answers: ['Спасибо тебе Джеффри'], }],
            dialogComplete: ['Как тебе город? Сильно поменялось за столько лет?', {
                answers: ['Да, цены все такие же.'], onAnswer: (index) => 505 }],
        },
        tasks: [
            {   
                nameTask: 'Купить Энергетик',
                descTask: 'Купить энергетик в любом магазине 24/7',
                type: "itemHave",
                item_id: 7,
                blipData: {
                    x: -1227.35,
                    y: -902.03,
                    text: "Магазин 24/7",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Купить чипсы',
                descTask: 'Купить чипсы в любом магазине 24/7',
                type: "itemHave",
                item_id: 21,
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 505,
        name: "Получение лицензии", desc: "Описание", reward: [{ type: "cash", value: 2000 }], taskStepByStep: true, nextQuest: 506, botData: {
            id: 500,
            dialogStart: ['Самое главное -  это права. Про пилота никто не говорит. Если захочешь - выучишься. Но машину водить ты обязан. Без этого сейчас никуда, поэтому езжай в лицензированный центр и сдай на права, и не забудь ознакомится с правилами ПДД', 
            { answers: ['Надо бы вспомнить правила.'], }],
            dialogComplete: [' С правами у тебя открываются огромные возможности. Но залог успеха - это не они. Залог успеха - это ты. Чтобы не зазнаться, когда будешь вертеть миллионами, нужно прочувствовать жизнь в её тяжёлых аспектах', {
                answers: ['Ты прав Джеффри'], onAnswer: (index) => 506 }],
        },
        tasks: [
            {   
                nameTask: 'Получение прав',
                descTask: 'Направляйтесь в автошколу чтоб получить водительские права',
                type: "licenseHave",
                license: "car",
                blipData: {
                    x: -711.94,
                    y: -1299.51,
                    text: "Автошкола",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 506,
        name: "Пластиковая жизнь", desc: "Описание", reward: 
        [{ type: "cash", value: 4000 },  { type: "item", value: 856}], taskStepByStep: true, botData: {
            id: 500,
            dialogStart: ['Что бы не тоскать все свои наличные при себе, тебе лучше завести банковскую карту. Направляйся в любой банк и заведи дебютовую карту', 
            { answers: ['Да, платить с помощью карты это намного удобнее, скоро вернусь.'], }],
            dialogComplete: ['Оформил карту? У меня тут для тебя небольшой подарок - планшет. Он тебе нужен будет в любой твоей будущей организации, так же ты сможешь смотреть в нем все свое имущество.', {
                answers: ['Да, огромное спасибо, думаю что планшет это очень важная вещь.'], onAnswer: () => {
                    return ['Мы поставили тебя на ноги, пока заданий больше нет. Я оповещу тебя если что то', {
                        answers: ['Спасибо за планшет. Было приятно познакомиться с тобой. Джеффри.']
                    }]
                } }],
        },
        tasks: [
            {   
                nameTask: 'Оформите банковскую карту',
                descTask: 'Направляйтесь в банк',
                type: "itemHave",
                item_id: 801,
                blipData: {
                    x: -1214.85,
                    y: -326.60,
                    text: "Банк",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Вернитесь к Джеффри',
                descTask: 'Завершите квест и заберите награду',
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
];

export const QUEST_BOT_DATA: { model: string; x: number; y: number; z: number; h: number; name: string; role: string, id: number; freeError: string, anim?:string|[string, string] }[] = [
    { id: 0, name: 'Стэнли Уильямс', role: "", x: 21.26, y: -1301.40, z: 29.14, h: 88, model: "a_m_m_og_boss_01", freeError: "Ничего не подскажу, пока!" },
    { id: 500, name: 'Джеффри Порт', role: "", x: -1066.17, y: -874.74, z: 4.98, h: 332, model: "s_m_m_fiboffice_01", freeError: "Здравствуйте, извините у меня разговор по телефону." },
]


export type QuestDialog = [string, QuestDialogAnswer]
interface QuestDialogAnswer {
    /** Варианты ответов игрока */
    answers: string[];
    /** Ивент ответа игрока. Функция должна вернуть либо новый диалог, либо диалог нового квеста по ID квеста. Если не указывать функцию - то диалог просто закроеться. */
    onAnswer?: (index?: number) => QuestDialog | number
}

interface QuestData {
    /** Уникальный ID каждого квеста. Ни в коем случае не должен совпадать... */
    id: number;
    /** Название квеста */
    name: string;
    /** Статическое описание квеста */
    desc: string;
    /** Награда за выполнение квеста. Массив со всеми данными */
    reward: RewardData[];
    /** ID квеста, который будет выдан автоматически */
    nextQuest?: number;
    /** Настройки NPC на карте. Если не указывать бота - то квест сам завершиться при выполнении всех тасков */
    botData?: {
        /** ID NPC, у которого будет этот квест */
        id: number;
        /** Диалог начала выполнения задания  */
        dialogStart: QuestDialog;
        /** Конечный диалог с НПЦ при завершении задания  */
        dialogComplete: QuestDialog;
    };
    /** Список действий, которые необходимо выполнить для того, чтобы задание считалось выполненым. */
    tasks: (TasksNpcDeliver | TaskHaveItem | QuestBotSpeak | TaskJobFarm | TaskLicenceHave | TaskDressBuy | TaskGotoPos | TaskLamar | TaskSendBankMoney | TaskBuyItem)[];
    /** Действия необходимо выполнять строго по очереди. Допустим если вы планируете развозку предметов по разным точкам - можно спланировать точный маршрут, по которому игроку придёться пермещаться */
    taskStepByStep?: boolean;
    /** Позволяет вывести уведомление при выполнении таска. Если функция не вернёт строку - то уведомления не будет */
    onTaskComplete?: (
        /** ИД таска, который выполнен. Счёт идёт от нуля */
        index: number
    ) => string;
}


interface TaskBase {
    /** Название для худа */
    nameTask: string,
    /** Краткое описание для худа */
    descTask?: string;
    /** Данные для метки на карте, если она необходима */
    blipData?: {
        x: number;
        y: number;
        /** Название блипа */
        text: string;
        bliptype: number;
        blipcolor: number;
        /** Цвет маршрута, если нужно отрисовать */
        bliproute?: number;
    }
}



interface RewardData {
    type: "exp" | "item" | "cash" | "bank" | "license";
    /** Сумма награды, либо ID предмета либо срок выдачи лицензии в зависимости от типа*/
    value: number;
    /** Тип лицензии если выдать нужно лицензию */
    licenseType?:LicenceType;
}

//? Интерфейсы различных тасков

/** Интерфейс доставки предмета другому боту. Игрок получает мифический предмет у того бота, у которого берёт задание и доставляет указанному боту */
interface TasksNpcDeliver extends TaskBase {
    type: "delivertonpc";
    /** Модель NPC */
    model: string;
    /** Имя бота над головой */
    name: string;
    /** Роль НЦП для диалога */
    role: string;
    /** Координата X */
    x: number;
    /** Координата Y */
    y: number;
    /** Координата Z */
    z: number;
    /** Угол поворота */
    h: number;
    /** Название мифического предмета */
    itemName: string;
    /** Диалог с NPC */
    dialog: QuestDialog;
    anim?: string | [string, string]
}

/** Интерфейс таска покупки предмета в магазине */
interface TaskBuyItem extends TaskBase {
    type: "itemBuy"
    /** ИД предмета или массив ИДшников, если проверка нужна по нему */
    item_id?: number;
}
/** Интерфейс таска наличия предмета в магазине */
interface TaskHaveItem extends TaskBase {
    type: "itemHave"
    /** ИД предмета или массив ИДшников, если проверка нужна по нему */
    item_id: number;
}
/** Интерфейс таска покупки предмета в магазине */
export interface TaskJobFarm extends TaskBase {
    type: "jobFarm"
    /** ID работы, если нужна конкретная работа */
    job?: string;
    /** Сколько нужно заработать средств на работе */
    amount: number;
}
/** Интерфейс таска покупки предмета в магазине */
interface TaskLicenceHave extends TaskBase {
    type: "licenseHave"
    /** ИД лицензии, которую проверяем. */
    license: LicenceType;
    /** Если требуется, можно отключить проверку актуальности, тогда просроченная лицензия так же подойдёт */
    ignoreExpired?: boolean;
}
/** Интерфейс проверки покупки одежды */
interface TaskDressBuy extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "dress"
}
/** Интерфейс таска достижения точки назначения  */
interface TaskGotoPos extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "gotopos";
    x: number;
    y: number;
    z: number;
    /** Текст над точкой назначения, он же для блипа */
    text:string;
    /** Требуется нажать на E, если не указать - то сработает если просто наступить */
    keypress?:boolean;
}
/** Интерфейс таска угона ТС для Ламара  */
interface TaskLamar extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "lamar";
}
/** Интерфейс таска что требуется начать диалог с NPC, у которого брали квест */
interface QuestBotSpeak extends TaskBase {
    type: "questBotSpeak"
}

/** Интерфейс таска перевода средств для NPC  */
interface TaskSendBankMoney extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "sendbankmoney";
    /** Номер счёта */
    number: string;
    /** Сумма перевода */
    sum: number;
}

