import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_FOURTH_QUEST_ID,
    NEW_YEAR_HOMELESS_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SPANISH_NPC_NAME
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";


registerDialog({
    id: 'new-year-quest-4-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: 'Забиваем, продаем…'}
            ],
            answers: [
                {text: 'Отсыпь на забивку.', toNode: 1},
                {text: 'Крутой фильм, но вот смысл от этой отсылки тут.', toNode: 2},
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: 'Пятнашка баксов, чувачок. Гони в лапу пятачок. Если с бабками облом, даю в долг, долг, долг.'},
                {text: 'Ладно, давай теперь адекватно.'}

            ],
            answers: [
                {text: 'Я только за.', toNode: 3},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Не знаю, чувак. Просто когда кто-то это придумывал, увидел видео в рекомендациях.'},
                {text: 'Ладно, давай теперь адекватно.'}

            ],
            answers: [
                {text: 'Я только за.', toNode: 3},
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Слушай, мужик, мужичок, мужчина, молодой человек.'},

            ],
            answers: [
                {text: 'Ты идиот?', toNode: 4},
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Мне потанцевать нельзя?'},

            ],
            answers: [
                {text: 'Можно, давай к делу.', toNode: 5},
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Окей, смотри. По городу пошел слух, что кто-то хочет украсть новый год.'},
                {text: 'Там такая душещипательная история.'},

            ],
            answers: [
                {text: 'Рассказывай.', toNode: 6},
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: 'Ну короче, у одного пацана было проблемное детство. Он был весь такой зеленый. Другие дети всегда обзывали его, смеялись над его внешним видом. Это его очень сильно оскорбляло, но эмоций он никаких не показывал.'},

            ],
            answers: [
                {text: 'Я в психологи записался?', toNode: 7},
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: 'Нет, послушай до конца. Как-то на новый год, учитель в школе дал им задание сделать елочную игрушку. Но так как он был необычным ребенком, вне зависимости от его стараний, его засмеяли.'},

            ],
            answers: [
                {text: 'И зачем это мне?', toNode: 8},
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: 'Так вот, сейчас он планирует украсть все подарки в городе. Твоя задача спасти праздник.'},

            ],
            answers: [
                {text: 'Окей, где он сейчас?', toNode: 9},
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: '*Передал карту с зоной, обведенной красным маркером*.'},

            ],
            answers: [
                {text: 'Окей', isExit: true, onReply: new QuestStart(NEW_YEAR_FOURTH_QUEST_ID)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-4-dialog-2',
    characterName: NEW_YEAR_HOMELESS_NPC_NAME,
    nodes: [
        
        {
            id: 10,
            npcReplies: [
                {text: 'ЭАаргх, черт возьми. НЕНАВИЖУ, НЕНАВИЖУ!'},

            ],
            answers: [
                {text: 'Эй, чувак. Подкинуть может?', toNode: 11},
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: 'А? Придурок, уйди от меня. Ненавижу, ненавижу!'},

            ],
            answers: [
                {text: 'Мужик, я с добром', toNode: 12},
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: 'СКАЖИ ЧТО Я УРОД! ДАВАЙ!'},

            ],
            answers: [
                {text: 'Нет, мужик. Ты странный, не очень пахнущий мужчина. Все нормально. Я могу тебя приютить, помыть, накормить. Если надо конечно.', toNode: 13},
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: 'Ты плохо меня услышал! ПРОВАЛИВАЙ!'},

            ],
            answers: [
                {text: 'Нет, чувак. Ты сейчас будешь слушать меня. Нахрен, блин, нахрен! ', toNode: 14},
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: 'Ха, вот ты и клоун.'},

            ],
            answers: [
                {text: 'Это не я решил, так говорить.', toNode: 15},
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: 'А кто? Ты реально клоун.'},

            ],
            answers: [
                {text: 'Человек кто это придумал, пересмотрел фильмы про гангстеров с плохим дубляжом.', toNode: 16},
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: 'Ты клоун, чел)'},

            ],
            answers: [
                {text: 'Слушай, мне кажется мы поймали одну волну.', toNode: 17},
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: 'Ты не хочешь, покушать?'},

            ],
            answers: [
                {text: 'Хочу, давай я сейчас сбегаю в ближайший 24 на 7 и посмотрю, что можно цепануть.', toNode: 18},
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: 'Окей, сушняк возьми.'},

            ],
            answers: [
                {text: 'Скоро буду.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-4-dialog-3',
    characterName: NEW_YEAR_HOMELESS_NPC_NAME,
    nodes: [
        
        {
            id: 19,
            npcReplies: [
                {text: '*посвистывает, ковыряясь в мусорке*'},

            ],
            answers: [
                {text: 'Чувак, может хватит искать в мусорке еду.', toNode: 20},
            ]
        },
        {
            id: 20,
            npcReplies: [
                {text: 'Не, ты взял что-то?'},

            ],
            answers: [
                {text: 'Да, тут чиз и колка, будешь?', toNode: 21},
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: 'Оооо, сейчас разберу тут до конца и как раз поем.'},

            ],
            answers: [
                {text: 'Слушай, мужик. А тут говорят слух какой-то пошел, что ты хочешь испортить кому-то настроение.', toNode: 22},
            ]
        },
        {
            id: 22,
            npcReplies: [
                {text: 'Ну да, есть такая темка. Она мутная по своей сути. Но я вот че думал, если ничего не портить… Что будет дальше?'},

            ],
            answers: [
                {text: 'Ну знаешь, я часто задумываюсь о своем будущем. Что будет завтра? Никто не знает.', toNode: 23},
                {text: 'Как по мне, нужно жить сегодняшним днем, наслаждаться тем, что имеет сейчас. Но и не спорю, что определенно важно, хотя бы держать в голове какие-то дальнейшие планы на будущее.', toNode: 23},
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: 'Слушай, твоя правда тоже в этом есть. Но мне очень жаль, что некоторые люди для меня теперь лишь некоторые люди.'},

            ],
            answers: [
                {text: 'Ну да, жалко так-то.', toNode: 24},
            ]
        },
        {
            id: 24,
            npcReplies: [
                {text: 'А кто тебя прислал ко мне?'},

            ],
            answers: [
                {text: 'Он называет себя Сантой. Мужик стоит напротив разрушенного отеля и втирает какую-то дичь.', toNode: 25},
            ]
        },
        {
            id: 25,
            npcReplies: [
                {text: 'Ааа, это учитель моей собачки. Бегает рядом, выполняет команды какие-то.'},

            ],
            answers: [
                {text: 'Слушай, интересно звучит.', toNode: 26},
            ]
        },
        {
            id: 26,
            npcReplies: [
                {text: 'Сложно Предположить ведь никтО не ожидает, оЙ, о чем-Либо можно размышлять. Единственное что Реально знаю, тут крутые заглавные буквы))'},

            ],
            answers: [
                {text: 'Реально, круто выглядит. Как та реплика с автосалоном за стеклом)', toNode: 27},
                {text: 'Ладно, ты чего-то хочешь в своей жизни? Чтобы тебя успокоить и ты больше никому не доставлял бед своими тайными желаниями.', toNode: 27},
            ]
        },
        {
            id: 27,
            npcReplies: [
                {text: 'У меня есть подруга. Она говорит только на испанском. Английский язык не воспринимает.'},

            ],
            answers: [
                {text: 'Переводчик есть?', toNode: 28},
            ]
        },
        {
            id: 28,
            npcReplies: [
                {text: 'Максимум в гугле.'},
                {text: 'Ей что-то надо было достать. Разберись.'},

            ],
            answers: [
                {text: 'Окей.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-4-dialog-4',
    characterName: NEW_YEAR_SPANISH_NPC_NAME,
    nodes: [
        {
            id: 29,
            npcReplies: [
                {text: 'Hola mi amigo. Con que has venido.'},

            ],
            answers: [
                {text: 'Чеееего блин?', toNode: 30},
            ]
        },
        {
            id: 30,
            npcReplies: [
                {text: 'Cursos de idiomas extranjeros en balashikha, si quieres salir de balashikha aprende el idioma.'},
                {text: 'Espero que alguien traduzca esto.'},
                {text: 'Pueden escribir cualquier cosa aquí.'},

            ],
            answers: [
                {text: 'Я не понимаю, ваш испанский, мексиканский, гватемальский. Называй как хочешь, я все равно не понимаю.', toNode: 31},
            ]
        },
        {
            id: 31,
            npcReplies: [
                {text: 'Ладно, ups, y aquí escribiremos en cirílico. Мне не хватать, информасьон для того чтобы узнать, que son los bananos.'},

            ],
            answers: [
                {text: 'Бананы?', toNode: 32},
            ]
        },
        {
            id: 32,
            npcReplies: [
                {text: 'Si, gracias por traducir todos los diálogos, continuaré en el idioma normal'},

            ],
            answers: [
                {text: 'Окей, достану тебе бананы.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-4-dialog-5',
    characterName: NEW_YEAR_SPANISH_NPC_NAME,
    nodes: [
        
        {
            id: 33,
            npcReplies: [
                {text: 'Trajiste plátanos?'},

            ],
            answers: [
                {text: 'Да, взял тут тебе бананоситос или как там на вашем. Ну короче ты понял.', toNode: 34},
            ]
        },
        {
            id: 34,
            npcReplies: [
                {text: 'Окей, но ты даже не спросил у меня почему Марв говорил что я девушка.'},

            ],
            answers: [
                {text: 'Ладно, я уехал.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: 'new-year-quest-4-dialog-6',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 35,
            npcReplies: [
                {text: 'Ну как ты? Устал бегать по городу?'},

            ],
            answers: [
                {text: 'Да, устал. На сегодня точно не буду ничего не делать.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})