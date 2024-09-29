import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {NEW_YEAR_FIRST_QUEST_ID, NEW_YEAR_SANTA_NPC_NAME} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: 'new-year-quest-1-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: 'Хей хей хей! Хоу хоу хоу!'},
                {text: 'Я Санта, крутой мужик который заходит через дымоход в твой дом и закидывает разные подарки под ёлку.'},
                {text: 'Ладно, хватит с меня сценического образа. Че приперся?'},
            ],
            answers: [
                {text: 'Я слышал что тут можно получить подарки, как их забрать. Расскажи.', toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: 'Не гони давай, подарки не подарки, нормально ведь общались.'}
            ],
            answers: [
                {text: 'Ну окей давай так, ЙОУ ЧУВАК, крутой ты блин… скоро новый год, а ты тут стоишь мерзнешь, помочь чем?', toNode: 2},
                {text: 'Ну окей давай так, cлышь, ты как базаришь? Я че на клоуна похож? Нормально разговаривать можешь?', toNode: 3},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Так-то лучше.'},
                {text: 'На самом деле тут реально холодно, я еще и не ел ничего.'},
                {text: 'Сможешь привезти что-то?'},
            ],
            answers: [
                {text: 'Окей, скоро буду.', isExit: true, onReply: new QuestStart(NEW_YEAR_FIRST_QUEST_ID)}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'Воу воу, могу конечно.'},
                {text: 'Принеси пожалуйста поесть и согреться.'}
            ],
            answers: [
                {text: 'Так бы сразу сказал, а то нюни распускаешь.', isExit: true, onReply: new QuestStart(NEW_YEAR_FIRST_QUEST_ID)}
            ]
        }
    ]
});

registerDialog({
    id: 'new-year-quest-1-dialog-2',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 4,
            npcReplies: [
                {text: 'Ну как, принес что-то пожевать?'}
            ],
            answers: [
                {text: 'Да, вот держи, тут все в пакете. Ты прости если что не так сказал сначала. Просто привык что на улицах может происходить хаос, гетто, сленги вся вот эта тема.', toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Всякое бывает. Пока ты ходил за едой, я тут прочитал в газете статейку одну.'},
                {text: 'А правда ли, что во Франции девушки не бреют себе подмышки?'}
            ],
            answers: [
                {text: 'Не бреют.', toNode: 6},
                {text: 'Бреют конечно.', toNode: 7}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: 'А как же на пляже?'}
            ],
            answers: [
                {text: 'Сейчас зима.', toNode: 8}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: 'Я тоже так считаю. Это же выглядит эстетично.'}
            ],
            answers: [
                {text: 'Ну ладно, статья статьей… А мерзнуть не хочется. Ты вообще долго тут стоишь? Чем занят то сам?', toNode: 9}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: 'Ах, да точно. Ладно, надо поесть.'},
                {text: 'Господи, благослови этот питательный, микроволнового приготовления ужин из макарон с сыром и людей, благодаря которым он появился в продаже.'}
            ],
            answers: [
                {text: 'Идиот? Тут пончики и кофе. Ах, да я забыл сказать что я еще для разгона взял коньяка.', toNode: 10}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: 'Подожди, надо поесть.'},
                {text: 'Господи, благослови этот питательный, микроволнового приготовления ужин из макарон с сыром и людей, благодаря которым он появился в продаже.'}
            ],
            answers: [
                {text: 'Идиот? Тут пончики и кофе. Ах, да я забыл сказать что я еще для разгона взял коньяка.', toNode: 10}
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: 'И ты предлагаешь мне это есть?'},
                {text: 'Серьезно?'},
                {text: 'Ладно, черт с тобой.'}
            ],
            answers: [
                {text: 'Ты кого чертом назвал?', toNode: 11}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: 'Ладно, тише тише.'},
                {text: 'Я лишь хотел сказать, что я благодарен.'},
                {text: 'У меня есть еще одно задание для тебя.'},
                {text: 'Если конечно хочешь поработать.'}
            ],
            answers: [
                {text: 'Конечно хочу, рассказывай.', toNode: 12}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: 'Недалеко есть ферма, надо будет посадить там пару елок.'},
                {text: 'Блин, согласись новогоднее настроение афигенное будет.'}
            ],
            answers: [
                {text: 'Да, возможно. Ну я тогда погнал…', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-1-dialog-3',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 13,
            npcReplies: [
                {text: 'Jingle bells, jingle bells.'}
            ],
            answers: [
                {text: 'Ты че мужик, новый год будет не скоро. А ты тут песни поешь.', toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: 'Так, я так понял ты украсил ферму и придал ей новогоднего настроения?'}
            ],
            answers: [
                {text: 'Я дровосек получается какой-то.', toNode: 15}
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: 'Получается так.'},
                {text: 'Хочешь анекдот?'}
            ],
            answers: [
                {text: 'Да.', toNode: 16},
                {text: 'Нет.', toNode: 17}
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: 'Когда девушка кричала водителю автобуса - Не бревна везёшь!.'},
                {text: 'Её парень ухмыльнулся! АХАХАХАХА'}
            ],
            answers: [
                {text: 'Юморной ты дедулька.', toNode: 18}
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: 'Ну и ладно, тогда на сегодня все.'}
            ],
            answers: [
                {text: 'Юморной ты дедулька.', toNode: 18}
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: 'Ладно малый, на сегодня все.'}
            ],
            answers: [
                {text: 'Окей, завтра словимся.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})