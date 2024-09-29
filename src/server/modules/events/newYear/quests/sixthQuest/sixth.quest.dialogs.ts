import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_ARIEL_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SIXTH_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: 'new-year-quest-6-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: 'Хей, скоро Новый год. Ура! Ура!'},

            ],
            answers: [
                {text: 'Да, уже вот вот я буду спать в салате.', toNode: 1},
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: 'Не стоит придумывать, на Новый год максимум бокал детского шампанского.'},

            ],
            answers: [
                {text: 'Ладно, согласен. Звучит плохо.', toNode: 2},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Слушай, ты наверное никогда не видел настоящей красоты.'},

            ],
            answers: [
                {text: 'Ну есть такой момент. Иногда бывают грустные моменты перед праздниками.', toNode: 3},
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Ничего страшного в этом нет. Мы все иногда ловим такие грустные моменты в нашей жизни.'},

            ],
            answers: [
                {text: 'И что? Что теперь?', toNode: 4},
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Ничего, вот именно что ничего. Новый год надо проводить в хорошем и уютном окружении. Это могут быть как друзья, так и семья. Тогда никакие проблемы не смогут тебя достать.'},

            ],
            answers: [
                {text: 'Ладно, возможно ты и прав.', toNode: 5},
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Конечно я прав. Пойми, миллионы приходят, уходят, не в них счастье. Самым важным на свете всегда будут твои близкие, не важно рядом они или далеко.'},

            ],
            answers: [
                {text: 'Никогда нельзя отворачиваться от семьи, даже если она отвернулась от тебя.', toNode: 6},
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: 'Ладно, давай помогу тебе понять что такое настоящая красота. Едь к моей подруге, она любит медитировать.'},

            ],
            answers: [
                {text: 'Окей.', isExit:true, onReply: new QuestStart(NEW_YEAR_SIXTH_QUEST_ID)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-2',
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        
        {
            id: 7,
            npcReplies: [
                {text: '*Закрыв глаза, издает непонятные звуки*'},

            ],
            answers: [
                {text: 'Откуда ты тут взялась?', toNode: 8},
                {text: 'Классные шортики бывшие джинсы Levis. Простой макияж.', toNode: 8},
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: 'Хлопья летят наверх, всюду магия и свет.'},

            ],
            answers: [
                {text: 'Ты чё, тут одна? Привет, пойдём на Парад планет. Я дам тебе тёплый шарф, там в космосе холода.', toNode: 9},
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: 'И мы встречаем рассвет, укутавшись в облака.'},

            ],
            answers: [
                {text: 'Крутой трек, да?', toNode: 10},
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: 'Согласна с тобой, а ты какими судьбами?'},

            ],
            answers: [
                {text: 'Я тут от Санты, он хотел показать мне что означает красота.', toNode: 11},
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: 'Красота это не то что нас окружает, а то что внутри нас.'},

            ],
            answers: [
                {text: 'На самом деле, так оно и есть.', toNode: 12},
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: 'Многие не умеют ценить человека за его поступки или за его внутренний мир.'},

            ],
            answers: [
                {text: 'Чаще всего все смотрят на внешность, но это лишь дополнение к настоящей красоте.', toNode: 13},
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: 'Да ты и так все знаешь, есть один способ закрепить твои мысли в сознании. Подойди к уступу и попробуй воссоединиться с природой.'},

            ],
            answers: [
                {text: 'Попробую.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-3',
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        {
            id: 14,
            npcReplies: [
                {text: 'Ну как? Получилось?'},

            ],
            answers: [
                {text: 'Да, может что-то и поменялось во мне. Я еще не понял что именно.', toNode: 15},
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: 'Это нормально, теперь тебе пора заняться настоящим делом.'},

            ],
            answers: [
                {text: 'И каким же?', toNode: 16},
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: 'Надо поохотиться на кабанов.'},

            ],
            answers: [
                {text: 'Опять эти кабаны.', toNode: 17},
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: 'Кхм.. Да, я должен был придумать то чего еще не было, поэтому Ариель дает именно это задание.'},

            ],
            answers: [
                {text: 'Ладно, я погнал.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-4',
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        
        {
            id: 18,
            npcReplies: [
                {text: 'Ну как, получилось?'},

            ],
            answers: [
                {text: 'Конечно, кабанам не удавалось уйти от меня.', toNode: 19},
            ]
        },
        {
            id: 19,
            npcReplies: [
                {text: 'Супер, в целом это все. Возвращайся к Санте, у него есть задание для тебя.'},

            ],
            answers: [
                {text: 'Окей.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-5',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 20,
            npcReplies: [
                {text: '*Делает вид что занят*'},

            ],
            answers: [
                {text: 'Привет, как ты?', toNode: 21},
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: 'Хооо, я уже и заждался тебя. Рассказывай, как Ариэль?'},

            ],
            answers: [
                {text: 'Та пойдет, помогла мне немного. Посмотрел на красивые виды нашего штата.', toNode: 22},
            ]
        },
        {
            id: 22,
            npcReplies: [
                {text: 'Это очень хорошо, тебе надо сделать кое-что для меня. Скоро будут обменивать конфеты на крутые призы, надо подготовиться.'},

            ],
            answers: [
                {text: 'Что мне нужно сделать?', toNode: 23},
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: 'Тебе надо наладить транспортные пути в городе.'},

            ],
            answers: [
                {text: 'Автобусник?', toNode: 24},
            ]
        },
        {
            id: 24,
            npcReplies: [
                {text: 'В точку'},

            ],
            answers: [
                {text: 'Ладно, я понял.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-6',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        
        {
            id: 25,
            npcReplies: [
                {text: '*Рисует картинку на маленьком клочке бумаги*'},

            ],
            answers: [
                {text: 'Фух… это было сложно.', toNode: 26},
            ]
        },
        {
            id: 26,
            npcReplies: [
                {text: 'Ну слушай, я не думаю что работать когда-то было легко.'},

            ],
            answers: [
                {text: 'По факту.', toNode: 27},
            ]
        },
        {
            id: 27,
            npcReplies: [
                {text: 'Теперь осталось последнее задание для тебя. Тебе надо будет, отгадать последнее слово.'},

            ],
            answers: [
                {text: 'Опять твои загадки.', toNode: 28},
            ]
        },
        {
            id: 28,
            npcReplies: [
                {text: 'Слушай внимательно. Напротив этого здания есть парк, там почти никто не гуляет. Еще есть большая парковка.'},

            ],
            answers: [
                {text: 'Зимой на голой резине, можно подрифтить. Ты там уже был в прошлом квесте.', toNode: 29},
            ]
        },
        {
            id: 29,
            npcReplies: [
                {text: 'Здание используется для наблюдения и слежения за различными объектами и явлениями на Земле и в космосе.'},
                {text: 'Твоя задача сказать моему другу первое слово в названии этого здания.'},

            ],
            answers: [
                {text: 'Окей, я понял.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-6-dialog-7',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 30,
            npcReplies: [
                {text: 'Ну как, получилось?'},

            ],
            answers: [
                {text: 'Ты как думаешь?', toNode: 31},
            ]
        },
        {
            id: 31,
            npcReplies: [
                {text: 'Конечно получилось.'},

            ],
            answers: [
                {text: 'Ладно, есть еще что-то для меня?', toNode: 32},
            ]
        },
        {
            id: 32,
            npcReplies: [
                {text: 'Нет, на этом все.'},

            ],
            answers: [
                {text: 'История заканчивается?', toNode: 33},
            ]
        },
        {
            id: 33,
            npcReplies: [
                {text: 'Все когда-то заканчивается. От все команды Revenge Project, хотелось бы поздравить тебя с наступающим Новым годом. Спасибо за то, что ты это все проходил.'},
                {text: 'Пускай 2022 год Тигра принесет тебе все то, о чем ты давно мечтаешь! Желаем тебе сказочно счастливой жизни и успехов во всех начинаниях и делах! '},
                {text: 'Пускай новогоднее чудо постучится в твой дом и подарит море радости, позитива и добра! Окружай себя только хорошими людьми, цени каждое мгновение жизни и наполняй ее всем, что приносит тебе удовольствие! '},

            ],
            answers: [
                {text: 'Спасибо за эти квесты.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: 'Квесты не очень, а так все топ.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: 'И вас тоже хотелось бы поздравить с Новым годом. Спасибо!', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})