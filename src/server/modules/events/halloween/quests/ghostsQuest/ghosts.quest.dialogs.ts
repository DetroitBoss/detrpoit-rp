import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_NAME, HALLOWEEN_GHOSTS_QUEST_ID,
    HALLOWEEN_GHOSTS_QUEST_NPC_NAME
} from "../../../../../../shared/events/halloween.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {DateCondition} from "../../../../advancedNpc/dialogs/impl/dateCondition";

const HALLOWEEN_GHOSTS_QUEST_AVAILABLE_DATE = new Date(2021, 11, 3, 9);

registerDialog({
    id: 'halloween-quest-2-dialog-1',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 26,
            npcReplies: [
                { text: 'Я думал ты не вернешься, че опять надо.' },
            ],
            answers: [
                {
                    text: 'Да, я сам так думал, но знаешь я многое переосмыслил.',
                    toNode: 27
                    // toNode: new DateCondition(HALLOWEEN_GHOSTS_QUEST_AVAILABLE_DATE, 27, 900)
                }
            ]
        },

        {
            id: 900,
            npcReplies: [
                { text: 'Слушай, приходи позже. Сейчас я реально очень занят' },
                { text: 'Вообще, я смогу с тобой продолжить числа так 3-го.' },
                { text: 'Пока можешь порыбачить или автобус поводить, не знаю. Не только призраков ловить же' },
                { text: 'Ноу проблем?' }
            ],
            answers: [
                { text: 'Окей, окей. Приду потом', isExit: true }
            ]
        },

        {
            id: 27,
            npcReplies: [
                { text: 'Давай, скажи еще что ты хочешь покрасить ногти и кричать фразы связанные с Дедами внутри.' },
                { text: 'Может перейдешь к сути? Я тут делом занят.' },
            ],
            answers: [
                { text: 'Нет, я серьезно. Я сначала относился к тебе с недоверием, но сейчас я хочу помочь тебе. Есть какие-то задачи или может мне взять ствол и стоять у тебя на охране?', toNode: 28 }
            ]
        },
        {
            id: 28,
            npcReplies: [
                { text: 'Хватит меня смешить, этих призраков не удивить огнестрелом. Надо переходить к чему-то посерьезнее.' },
            ],
            answers: [
                { text: 'РПГ? Танки? Гаубицы? Вертолет?', toNode: 29 }
            ]
        },
        {
            id: 29,
            npcReplies: [
                { text: 'Ты что, правда смеешься? Скажи что это пранк и где-то меня снимает скрытая камера.' },
            ],
            answers: [
                { text: 'Я правда не знаю, я только огнестрел держал в руках.', toNode: 30 }
            ]
        },
        {
            id: 30,
            npcReplies: [
                { text: 'Ха-ха, ладно. Может ты слышал что-то о дематериализирующем бластере?' },
                { text: 'Такая штука, которая способна вернуть эту грязь обратно в свой потусторонний мир.' },
            ],
            answers: [
                { text: 'Нет, а где ее купить можно? Амазон, Озон, Вайлдберис, Деливери клаб?', toNode: 31 }
            ]
        },
        {
            id: 31,
            npcReplies: [
                { text: 'Хватит задавать глупые вопросы! На данный момент наука позволяет такие штуки делать и самому. Ты знаешь как?' },
            ],
            answers: [
                { text: 'Ну нужно взять нужные материалы, подойти к станку и через пару секунд все будет готово.', toNode: 32 }
            ]
        },
        {
            id: 32,
            npcReplies: [
                { text: 'Ты правда глуп, давай так… Найди мне один чертеж и я помогу тебе с оружием.' },
            ],
            answers: [
                { text: 'Окей, скоро буду.', isExit: true, onReply: new QuestStart(HALLOWEEN_GHOSTS_QUEST_ID) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-2',
    characterName: HALLOWEEN_GHOSTS_QUEST_NPC_NAME,
    nodes: [
        {
            id: 33,
            npcReplies: [
                { text: '*вопросительно смотрит на тебя*' },
            ],
            answers: [
                { text: 'Хей мужик, не знаешь работает кто в этой забегаловке.', toNode: 34 }
            ]
        },
        {
            id: 34,
            npcReplies: [
                { text: 'Да, ты хочешь поесть?' },
            ],
            answers: [
                { text: 'Нет, я ищу кого-то кто шарит за хайповые темки всякие.', toNode: 35 }
            ]
        },
        {
            id: 35,
            npcReplies: [
                { text: 'Чего? Я ничерта не понял.' },
            ],
            answers: [
                { text: 'Ну я нашел мужика какого-то, говорит что он ловит кого-то, призраков всяких.', toNode: 36 }
            ]
        },
        {
            id: 36,
            npcReplies: [
                { text: 'Так ты из наших, чего хотел?' },
            ],
            answers: [
                { text: 'Он мне сказал найти какой-то чертеж, не знаешь к кому обратиться по этому вопросу?', toNode: 37 }
            ]
        },
        {
            id: 37,
            npcReplies: [
                { text: 'Ты не поверишь, ко мне. Я чертежник со стажем, точнее инженер. Моделирую ребятам оружие, для их сложной работы.' },
            ],
            answers: [
                { text: 'Сложной работы? Это все же правда?', toNode: 38 }
            ]
        },
        {
            id: 38,
            npcReplies: [
                { text: 'Конечно правда, ты не помнишь какая сейчас неделя? Неделя потусторонней силы, появляется нечисть и пытается захватить этот мир.' },
                { text: 'Ладно, не буду тебя грузить, забирай свой чертеж и проваливай.' },
            ],
            answers: [
                { text: 'Спасибо большое, надеюсь еще встретимся и поговорим на интересные темы!', toNode: 39 }
            ]
        },
        {
            id: 39,
            npcReplies: [
                { text: 'Надеюсь, что нет.' },
            ],
            answers: [
                { text: 'Ясно...', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-3',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 40,
            npcReplies: [
                { text: 'Долго тебя ждать?' },
            ],
            answers: [
                { text: 'Я старался сделать это быстро. Вот чертеж, который ты и просил.', toNode: 41 }
            ]
        },
        {
            id: 41,
            npcReplies: [
                { text: 'Черт! Я кое-что забыл. Для этого бластера, нужны еще энергетические модули, они не далеко от той забегаловки в деревне есть.' },
                { text: 'Найдешь дом хипстера, попробуй открыть гараж, если его нет дома.' },
            ],
            answers: [
                { text: 'Он мне сам их даст или за это надо будет заплатить?', toNode: 42 }
            ]
        },
        {
            id: 42,
            npcReplies: [
                { text: 'Платить не нужно, там живет дедуля, который даже своего имени не помнит. Он из кореи и занимается просмотром сериала про креветку.' },
            ],
            answers: [
                { text: 'Может Кальмара?', toNode: 43 }
            ]
        },
        {
            id: 43,
            npcReplies: [
                { text: 'Может быть, не важно. Иди туда и принеси мне модули или я сейчас все брошу и ничего не буду делать.' },
            ],
            answers: [
                { text: 'Ладно, скоро буду!', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-4',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 44,
            npcReplies: [
                { text: 'Ну как?' },
            ],
            answers: [
                { text: 'Достал что тебе нужно, тяжелая зараза.', toNode: 45 }
            ]
        },
        {
            id: 45,
            npcReplies: [
                { text: 'Отлично, я тогда займусь этим на досуге, а пока проваливай.' },
            ],
            answers: [
                { text: 'В смысле? Я же хотел заполучить какую-то пушку, по итогу я просто бегал по штату в поисках каких-то хреновин и сейчас ты говоришь проваливай? Это не серьезно!', toNode: 46 }
            ]
        },
        {
            id: 46,
            npcReplies: [
                { text: 'Я просто переиграл и уничтожил тебя! Ха-ха-ха! Ладно шучу, давай так. Тебе понадобится еще кое-что. Для того чтобы пойти на первое твое задание, научись готовить зелья.' },
            ],
            answers: [
                { text: 'Так я уже умею, ты мне сам давал задание.', toNode: 47 }
            ]
        },
        {
            id: 47,
            npcReplies: [
                { text: 'Знаю что давал, но сюда надо было придумать логическое завершение. Заканчивать диалог словами проваливай не круто. Поэтому принеси мне зелье Альфа.' },
            ],
            answers: [
                { text: 'Ладно.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-5',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 48,
            npcReplies: [
                { text: 'Уже?' },
            ],
            answers: [
                { text: 'Я принес.', toNode:49 }
            ]
        },
        {
            id: 49,
            npcReplies: [
                { text: 'Отлично, жду тебя через 15 минут.' },
            ],
            answers: [
                { text: 'Ладно.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-6',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 50,
            npcReplies: [
                { text: '*чем-то занят*' },
            ],
            answers: [
                { text: 'Ну что? Я вовремя?', toNode:51 }
            ]
        },
        {
            id: 51,
            npcReplies: [
                { text: 'Да, почти.' },
            ],
            answers: [
                { text: 'В смысле почти!', toNode:52 }
            ]
        },
        {
            id: 52,
            npcReplies: [
                { text: 'Все готово, только я не успел пригнать сюда машину.' },
            ],
            answers: [
                { text: 'Какую еще машину?', toNode:53 }
            ]
        },
        {
            id: 53,
            npcReplies: [
                { text: 'Самую настоящую машину охотников за приведениями!' },
            ],
            answers: [
                { text: 'Окей, давай я ее сам пригоню!', toNode:54 }
            ]
        },
        {
            id: 54,
            npcReplies: [
                { text: 'Начерта она мне сдалась, забирай свой бластер и на парковке неподалеку отсюда возьми машину, вот ключи.' },
            ],
            answers: [
                { text: 'Окей, отлично. А что делать?', toNode:55 }
            ]
        },
        {
            id: 55,
            npcReplies: [
                { text: 'На бортовой компьютер придет оповещение о задании. Надо будет поймать 15 привидений.' },
            ],
            answers: [
                { text: 'Ну все, я теперь крутой?', toNode:56 }
            ]
        },
        {
            id: 56,
            npcReplies: [
                { text: 'Круче только яйца! Давай быстрее проваливай.' },
            ],
            answers: [
                { text: 'Лады.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-2-dialog-7',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: 'Ну как? Всех победил?' }
            ],
            answers: [
                { text: 'Да, только вот у меня есть пару вопросов', toNode: 1 }
            ]
        },
        {
            id: 1,
            npcReplies: [
                { text: 'Задавай, я жду!' },
                { text: 'Ну и че стоишь? Задавай' }
            ],
            answers: [
                { text: 'Ну вот смотри, я любитель выполнять всякие задачи, не читаю даже что тут написано. А вдруг я тут напишу какую-то пасхалку и никто даже не обратит на нее внимание. Почему?', toNode: 100 },
                { text: 'Я выполняю это все ради чего? Ради конфет? А ты знал что сахар в таких количествах может быть вреден организму, ты об этом задумывался?', toNode: 2 }
            ]
        },
        {
            id: 100,
            npcReplies: [
                { text: 'Ну да, по факту никому оно и не надо, а ведь кто-то нам продумывал все эти диалоги, проговаривал у себя в голове их, чтобы было прикольно.' },
                { text: 'Но тебе, да да, тебе за тем экраном может быть все равно. Не надо так.' }
            ],
            answers: [
                { text: 'Ладно, прости. Теперь я буду читать диалоги', toNode: 101 }
            ]
        },
        {
            id: 101,
            npcReplies: [
                { text: 'Еще остались вопросы?' }
            ],
            answers: [
                { text: 'Я выполняю это все ради чего? Ради конфет? А ты знал что сахар в таких количествах может быть вреден организму, ты об этом задумывался?', toNode: 2 }
            ]
        },
        {
            id: 2,
            npcReplies: [
                { text: 'Сахар, действительно вреден, но ты ведь потом сможешь получить интересные вещи за эти конфеты.' },
                { text: 'Кстати, после последнего квеста ты сможешь посмотреть на один из уникальных рюкзаков.' },
                { text: 'А ты заметил, что тут было 2 выбора ответа? Походу это отсылка, что со временем квесты будут сложнее.' }
            ],
            answers: [
                { text: 'Походу)', toNode: 3 }
            ]
        },
        {
            id: 3,
            npcReplies: [
                { text: 'Ладно, теперь к делу, ты выполнил достаточно сложное задание.' },
                { text: 'Скоро, а именно 6 числа, я объявляю сходку!' }
            ],
            answers: [
                { text: 'Чтобы на нее никто не пришел?', toNode: 4 }
            ]
        },
        {
            id: 4,
            npcReplies: [
                { text: 'Если на нее никто не придет, я заплачу.' }
            ],
            answers: [
                { text: 'Ты просто бот в компьютерной игре, о каких эмоциях идет речь?..', toNode: 5 }
            ]
        },
        {
            id: 5,
            npcReplies: [
                { text: 'Ты уверен?' }
            ],
            answers: [
                { text: 'Ты всего лишь машина. Только имитация жизни. Робот сочинит симфонию? Робот превратит кусок холста в шедевр искусства?', toNode: 6 }
            ]
        },
        {
            id: 6,
            npcReplies: [
                { text: 'А вы?' }
            ],
            answers: [
                { text: 'Ладно, я понял. Так что будет 6 числа?', toNode: 7 }
            ]
        },
        {
            id: 7,
            npcReplies: [
                { text: 'Ты скоро обо всем узнаешь, могу лишь порекомендовать закупить припасов.' },
                { text: 'Оружие например, бронежилеты' }
            ],
            answers: [
                { text: 'Окей, будет сделано босс. Тогда пока?', toNode: 8 }
            ]
        },
        {
            id: 8,
            npcReplies: [
                { text: 'Проваливай!' }
            ],
            answers: [
                { text: 'Справедливо', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        }
    ]
})
