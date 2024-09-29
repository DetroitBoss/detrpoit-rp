import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    HALLOWEEN_PORTALS_QUEST_ID
} from "../../../../../../shared/events/halloween.config";
import {DateCondition} from "../../../../advancedNpc/dialogs/impl/dateCondition";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";

registerDialog({
    id: 'halloween-quest-3-dialog-1',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: '*притворяется занятым*' }
            ],
            answers: [
                { text: 'АУУУУУУ', toNode: 57 }
            ]
        },
        {
            id: 1,
            npcReplies: [
                { text: 'Чувак, я занят...' },
                { text: 'Тебе реально нечем заняться?' },
                { text: 'Ты уже фугу поймал? А чебака? А хайповую удочку уже купил?' },
                { text: 'Нет? Ну а чего ждёшь, иди рыбачь..' },
                { text: 'Договорились же, что 6 числа сходка падпещекав' }
            ],
            answers: [
                { text: 'Ясно.', isExit: true }
            ]
        },
        {
            id: 57,
            npcReplies: [
                { text: 'Тебе не хватило? Опять приперся, чтобы попросить денег?' },
            ],
            answers: [
                { text: 'Та ладно тебе, я же нормально себя проявил. Может есть что посерьезней?', toNode:58 }
            ]
        },
        {
            id: 58,
            npcReplies: [
                { text: 'Куда еще серьезней? Ты уже помочил зеленых дураков. Может уже оставишь это дело?' },
            ],
            answers: [
                { text: 'А ловко ты это придумал, давай к делу. Я хочу еще!', toNode:59 }
            ]
        },
        {
            id: 59,
            npcReplies: [
                { text: 'Ладно, надоел. Есть еще одна задачка. Надо будет позаботиться о твоей безопасности. Купи бронежилет, который защитит тебя от попаданий.' },
            ],
            answers: [
                { text: 'Так не понял, в меня будут стрелять?', toNode:60 }
            ]
        },
        {
            id: 60,
            npcReplies: [
                { text: 'Да, придется повозиться. Ты не переживай, все будет хорошо.' },
            ],
            answers: [
                { text: 'Ладно, где взять броню.', toNode:61 }
            ]
        },
        {
            id: 61,
            npcReplies: [
                { text: 'Ну понятное дело что в амуниции. Купи два бронежилета, потом приходи.' },
            ],
            answers: [
                { text: 'Лады.', isExit:true, onReply: new QuestStart(HALLOWEEN_PORTALS_QUEST_ID) },
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-3-dialog-2',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 62,
            npcReplies: [
                { text: 'Надеюсь купил целый бронежилет?' },
            ],
            answers: [
                { text: 'Какой был, такой и купил. Вообще какого хрена ты переживаешь за мою жизнь?', toNode:63 }
            ]
        },
        {
            id: 63,
            npcReplies: [
                { text: 'Та так по приколу. Ладно давай бронежилет сюда, я поработаю над твоей броней и потом как раз подойдёшь.' },
            ],
            answers: [
                { text: 'Через сколько примерно?', toNode:64 }
            ]
        },
        {
            id: 64,
            npcReplies: [
                { text: 'Давай через часик.' },
            ],
            answers: [
                { text: 'Хорошо.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-3-dialog-3',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 65,
            npcReplies: [
                { text: '' },
            ],
            answers: [
                { text: 'Хей! Я пришёл, давай к заданию перейдём. Что нужно сделать?', toNode:66 }
            ]
        },
        {
            id: 66,
            npcReplies: [
                { text: 'Муравью приделать…' },
            ],
            answers: [
                { text: 'Идиот, ещё на меня что-то говоришь.', toNode:67 }
            ]
        },
        {
            id: 67,
            npcReplies: [
                { text: 'Поплачь, давай. Мама! Хочу к Маме!' },
            ],
            answers: [
                { text: 'Хватит, давай к делу.', toNode:68 }
            ]
        },
        {
            id: 68,
            npcReplies: [
                { text: 'Окей, помнишь ты ловил привидений. Из-за этой хреновины ты открыл портал, где куча всякого дерьма.' },
            ],
            answers: [
                { text: 'Ты предлагаешь убрать за кем-то куски говна?', toNode:69 }
            ]
        },
        {
            id: 69,
            npcReplies: [
                { text: 'Ты идиот? Тебе надо зайти в портал и там собрать дерьмо. Хотя лучше истреби это дерьмо.' },
            ],
            answers: [
                { text: 'Окей, куда идти?', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) },
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-3-dialog-4',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 70,
            npcReplies: [
                { text: 'Красавчик!' },
            ],
            answers: [
                { text: 'Спасибо, ты тоже ничего.', toNode:71 }
            ]
        },
        {
            id: 71,
            npcReplies: [
                { text: 'Если честно, ты выглядишь как урод.' },
            ],
            answers: [
                { text: 'Идиот?', toNode:72 }
            ]
        },
        {
            id: 72,
            npcReplies: [
                { text: 'Мне потанцевать нельзя?' },
            ],
            answers: [
                { text: 'Ты меня раздражаешь, забирай оружие и я пошёл.', toNode:73 }
            ]
        },
        {
            id: 73,
            npcReplies: [
                { text: 'Ладно, шучу я. Ты хорошо поработал. На вот рюкзак, будет напоминать об этой маленькой истории.' },
            ],
            answers: [
                { text: 'Давай без соплей закончим последний диалог?', toNode: 74 }
            ]
        },
        {
            id: 74,
            npcReplies: [
                { text: 'I’ll be back.' },
            ],
            answers: [
                { text: 'Давай', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        }
    ]
});