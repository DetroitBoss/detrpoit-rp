import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID,
    NEW_YEAR_FIFTH_QUEST_ID, NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID,
    NEW_YEAR_MEGATRON_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {MultiAnswer} from "../../../../advancedNpc/dialogs/impl/MultiAnswer";

registerDialog({
    id: 'new-year-quest-5-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Шесть шесть. Дорогой, хей хоу.'}
            ],
            answers: [
                {text: 'То что упало на стол.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Кхм.. о чем это я. Ты готов к новым приключениям?'}
            ],
            answers: [
                {
                    text: 'Конечно готов, давай на этот раз меньше переводов и знакомств с твоими непонятными друзьями.',
                    toNode: 3
                }
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Окей, ладно. На этот раз тебе надо будет подарить частичку новогоднего настроения.'}
            ],
            answers: [
                {text: 'Кхм.. и как например.', toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Я тебя познакомлю с моим хорошим знакомым, который когда-то владел телебашней в Los-Santos’е.'},
                {text: 'Он знает как сгенерировать нужный сигнал и послать его новстникам.'}
            ],
            answers: [
                {text: 'Ладно, но сам понимаешь у меня образования нет. Я могу и накосячить.', toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Ничего страшного.'}
            ],
            answers: [
                {text: 'Я тогда полетел.', isExit: true, onReply: new QuestStart(NEW_YEAR_FIFTH_QUEST_ID)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-dialog-2',
    characterName: NEW_YEAR_MEGATRON_NPC_NAME,
    nodes: [
        {
            id: 6,
            npcReplies: [
                {text: '*Раскуривает мокрую сигарету*'}
            ],
            answers: [
                {text: 'ЭЙ, чувак. Как ты?', toNode: 7}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: 'Я МЕГАТРОН А НЕ ЧУВАК.'}
            ],
            answers: [
                {text: 'Чего?', toNode: 8}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: 'Слушай, я не собираюсь разглагольствовать с тобой. Пойду я.'}
            ],
            answers: [
                {text: 'Да, проваливай.', toNode: 9},
                {text: 'Нет, ладно. Мегатрон у меня есть к тебе просьба', toNode: 10}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: 'Да пошел я.'}
            ],
            answers: [
                {
                    text: 'Ты сам себя послал.', isExit: true, onReply: new MultiAnswer(
                        new EventTriggerAnswer(TALK_WITH_NPC_EVENT),
                        new QuestStart(NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID))
                }
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: 'Так-то лучше.'},
                {text: 'Слушай меня сюда.'},
                {text: 'Я люблю когда меня называют о великий мегатрон.'}
            ],
            answers: [
                {text: 'Окей, великий Мегатрон. Мне нужна помощь.', toNode: 11}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: 'Вываливай.'}
            ],
            answers: [
                {text: 'Так сразу?', toNode: 12}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: 'Я про вопрос, остолоп.'}
            ],
            answers: [
                {
                    text: 'Окей. Мне нужно чтобы ты поговорил с сотрудниками редакции Weazel News, они должны пропустить мое объявление.',
                    toNode: 13
                }
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: 'Окей, давай тогда ты мне купишь, то чего я так хотел.'}
            ],
            answers: [
                {text: 'Что еще купить.', toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: 'На вот список, быстренько смотайся.'}
            ],
            answers: [
                {
                    text: 'Кабанчиком, великий Мегатрон. *вздыхая*',
                    isExit: true,
                    onReply: new MultiAnswer(new EventTriggerAnswer(TALK_WITH_NPC_EVENT), new QuestStart(NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID))
                }
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-1-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: '*Делает вид что занят*'}
            ],
            answers: [
                {text: 'Эй, с меня хватит. Я не хочу общаться с умолишенными людьми из твоего окружения.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Ты не договорился с Билом?'}
            ],
            answers: [
                {text: 'Кто-то договорился до меня?', toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Да, ну ладно не суть. Если у тебя не вышло, тогда едь сам на одну из вышек.'}
            ],
            answers: [
                {text: 'Окей.', toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Там вроде есть охранник, но он часто спит.'}
            ],
            answers: [
                {
                    text: 'Хорошо, сделаю все что в моих силах.',
                    isExit: true,
                    onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)
                }
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-1-dialog-2',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Красавчик, теперь ты подарил все хорошее настроение.'}
            ],
            answers: [
                {text: 'На этом все?', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Нет. Теперь тебе нужно, обеспечить светом дома нашего города.'}
            ],
            answers: [
                {text: 'Работать электриком.', toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'А ты как думал?'}
            ],
            answers: [
                {text: 'Ладно, я пошел.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-1-dialog-3',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Спасибо, что исправил свою ошибку на той вышке)'}
            ],
            answers: [
                {text: 'Я так и знал, что ты у кого-то это узнал.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Тот охранник не спал.'}
            ],
            answers: [
                {
                    text: 'Ладно, я больше не буду ничего сегодня делать. Я устал.',
                    isExit: true,
                    onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)
                }
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-2-dialog-1',
    characterName: NEW_YEAR_MEGATRON_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Что движет тобой, человечишка?'},
                {text: 'Страх или отвага?'},
                {text: 'Некуда бежать.'},
                {text: 'Отдай мне искру, глупыш, и я оставлю тебя в живых.'}
            ],
            answers: [
                {text: 'Эй, я принес что ты хотел.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Окей, теперь твоя задача просто отправить сообщение на редакцию в своем планшете.'}
            ],
            answers: [
                {text: 'Окей, я пошел писать.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-2-dialog-2',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Ты молодец, я увидел объявление.'}
            ],
            answers: [
                {text: 'На этом все?', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Нет, сбегай помоги стране. Увеличь урожай.'}
            ],
            answers: [
                {text: 'На ферму?', toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Да, чувак. На ферму.'}
            ],
            answers: [
                {text: 'Ладно.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-5-line-2-dialog-3',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: 'Принес?'}
            ],
            answers: [
                {text: 'Да, я все собрал.', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Супер, на этом пока все, приходи позже.'}
            ],
            answers: [
                {text: 'Окей.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})



