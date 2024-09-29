import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_THIRD_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: 'new-year-quest-3-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: 'Я всё это хаваю, у меня нет выбора.'}
            ],
            answers: [
                {text: 'Слушай, а ты какой-то репер?', toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: 'Ну типа. Ой, ладно. Хватит с меня этой реп игры. Я в спячку на 6 лет.'}
            ],
            answers: [
                {text: 'Эээ, а как же мои леденцы.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Любишь да, сладенькое?'}
            ],
            answers: [
                {text: 'Может хватит, я конечно понимаю что ты скорее всего открыл тот пакет. Но может стоит что-то адекватное тут придумать. Да да, прямо в этом диалоге.', toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Ладно, слушай меня сюда. Когда за твоей спиной что-то говорят, значит ты впереди.'}
            ],
            answers: [
                {text: 'По факту, слушай.', toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Ладно, пора бы и задание тебе дать.'},
                {text: 'Итак, тебе надо понять что за слово я придумал.'}
            ],
            answers: [
                {text: 'Ты прикалываешься?', toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Слушай внимательно.'},
                {text: 'Я не директор, бро, я босс.'},
                {text: 'Они говорили это слово, но после открытия центра только вырос спрос.'},
                {text: 'Могу читать бесконечно - перевернутая восьмерка.'},
                {text: 'Но длинная такса на баннере это типо спойлер.'}
            ],
            answers: [
                {text: 'Спойлер это типо подсказка?', toNode: 6}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: 'Ну да. А ты как думал?'}
            ],
            answers: [
                {text: 'Окей, пойду искать.', toNode: 7}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: 'Стой! Это слово надо сказать моему другу на почте.'}
            ],
            answers: [
                {text: 'Понял, пойду искать.', isExit: true, onReply: new QuestStart(NEW_YEAR_THIRD_QUEST_ID)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-3-dialog-2',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 8,
            npcReplies: [
                {text: 'Ну как?'}
            ],
            answers: [
                {text: 'Тот кто придумал такое задание или помешан на музыке, или просто решил поиздеваться.', toNode: 9}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: 'Я уверен тебе слили ответ.'}
            ],
            answers: [
                {text: 'Ну может быть, все может быть.', toNode: 10}
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: 'Ладно, логических загадок с меня хватит.'}
            ],
            answers: [
                {text: 'До связи', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})