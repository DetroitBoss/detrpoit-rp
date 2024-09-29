import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {HALLOWEEN_GHOSTBUSTER_NPC_NAME, HALLOWEEN_START_QUEST_ID} from "../../../../../../shared/events/halloween.config";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: 'halloween-quest-1-dialog-1',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: 'А? Опять жалкие люди, как вы меня раздражаете.' }
            ],
            answers: [
                { text: 'Тише тише, я слышал тебе нужна какая-то помощь. Есть что-то для меня?', toNode: 1 }
            ]
        },

        {
            id: 1,
            npcReplies: [
                { text: 'Ты решил помочь? И тебя не смущает то, как я выгляжу?' },
                { text: 'Ладно, не суть. Я есть хочу, принеси мне мясо кабана.' },
                { text: 'И давай побыстрее, я умираю с голоду.' },
            ],
            answers: [
                { text: 'Хорошо.', isExit: true, onReply: new QuestStart(HALLOWEEN_START_QUEST_ID) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-1-dialog-2',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 2,
            npcReplies: [
                { text: 'Опять ты! Принес что я просил?' }
            ],
            answers: [
                { text: 'Да, принес. Только зачем тебе сырое мясо. Я тут еще чипсов принес, пока готовить будешь, перекуси..', toNode: 3 }
            ]
        },

        {
            id: 3,
            npcReplies: [
                { text: 'Идиот! Я не просил чипсы. Как с вами трудно, вы ничего не понимаете. Жалкие люди.' }
            ],
            answers: [
                { text: 'Зачем ты так? Я хотел сделать как лучше.', toNode: 4 }
            ]
        },

        {
            id: 4,
            npcReplies: [
                { text: 'Зачем вы отвлекаете меня? Я пытаюсь изучить что-то, еще не придумал что. Но я пытаюсь, ясно?' }
            ],
            answers: [
                { text: 'Вы не похожи на учёного, они малоприятные люди. Вы больше похожи на ведущего телешоу.', toNode: 5 }
            ]
        },

        {
            id: 5,
            npcReplies: [
                { text: 'Замолчи! Иди лучше принеси мне пару ведер молока!' }
            ],
            answers: [
                { text: 'Ладно.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-1-dialog-3',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 6,
            npcReplies: [
                { text: 'Наконец-то, я уже почти закончил…' }
            ],
            answers: [
                { text: 'Может хватит? Скажете что вы делаете или так и будете использовать меня?', toNode: 7 }
            ]
        },

        {
            id: 7,
            npcReplies: [
                { text: 'Сынок! Тебя смущает мой костюм? Я уверен что да, ты знаешь кто за этим костюмом?' }
            ],
            answers: [
                { text: 'Какой-то мошенник, который хочет заполучить мои данные от карты, код с обратной стороны. Да-да, я так вас и представлял!', toNode: 8 }
            ]
        },

        {
            id: 8,
            npcReplies: [
                { text: 'Ты реально глупый. За этим костюмом скрывается гений, миллиардер, плэйбой, филантроп и просто охотник за приведениями. Последнее время тут творится что-то дико интересное.' }
            ],
            answers: [
                { text: 'И что же?', toNode: 9 }
            ]
        },

        {
            id: 9,
            npcReplies: [
                { text: 'Пока я работал на ферме, моя знакомая дико кричала в своем доме неподалеку, такое ощущение, что она кого-то звала на помощь. Но я культивировал огромное поле, мне было не до этого.' },
                { text: 'Слушай! Я знаю чем ты можешь мне помочь. Сходи к ней домой и посмотри чем она там занималась.' }
            ],
            answers: [
                { text: 'Как меня достало быть на побегушках, ладно скажи где ее дом.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) },
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-1-dialog-4',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 10,
            npcReplies: [
                { text: 'Ну как поиски?' },
            ],
            answers: [
                { text: 'Ее там не было, дом разбит. Такое ощущение что эту старушку сдуло ветром.', toNode: 11 }
            ]
        },

        {
            id: 11,
            npcReplies: [
                { text: 'Я же ей давал деньги на ремонт дома, грхгр… Бабки на ветер! Ладно, выкладывай что ты там нашел. ' },
            ],
            answers: [
                { text: 'Тут какие-то черепа, жутковато.', toNode: 12 }
            ]
        },
        {
            id: 12,
            npcReplies: [
                { text: 'Отлично! Это сюда, тут так. Черт чего-то не хватает!' },
            ],
            answers: [
                { text: 'Хватит! Ты держишь меня за дурака, старик. Может скажешь что ты делаешь, черт возьми, для чего?', toNode: 13 }
            ]
        },
        {
            id: 13,
            npcReplies: [
                { text: 'Двадцать четыре часа в сутки, семь дней в неделю. Любая работа нам по плечу, любая цена государству по карману.' },
            ],
            answers: [
                { text: 'Вы? Кто такие вы? Ты тут один, идиот.', toNode: 14 }
            ]
        },
        {
            id: 14,
            npcReplies: [
                { text: 'Мы охотники за привидениями, я специально в этом костюме, чтобы эти призраки подумали что я свой. Нас много, целая команда.' },
            ],
            answers: [
                { text: 'Окей, типо вы верите в НЛО, астрологию, телепатию, ясновидение, фотографии духов, телекинез, медиумов, Лох-Несское чудовище, теорию Атлантиды?', toNode: 15 }
            ]
        },
        {
            id: 15,
            npcReplies: [
                { text: 'Если за это мне будут платить деньги, я поверю во всё что угодно. А теперь мне нужно от тебя чтобы ты принес мне несколько картошек.' },
            ],
            answers: [
                { text: 'Это реально надоедает, не могли придумать что поинтереснее, как бегать по каким-то заданиям.', toNode: 16 }
            ]
        },
        {
            id: 16,
            npcReplies: [
                { text: 'Это не я придумал, ты лучше у космоса спроси.' },
            ],
            answers: [
                { text: 'Хорошо', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-1-dialog-5',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 17,
            npcReplies: [
                { text: 'Ах вот ты где, я хотел тебе набрать и сказать что еще нужна черника. Но ты не оставил свой телефон.' },
            ],
            answers: [
                { text: 'Ты серьезно?', toNode: 18 }
            ]
        },
        {
            id: 18,
            npcReplies: [
                { text: 'Да, но зачем ты принес мне ведро картошки.' },
            ],
            answers: [
                { text: 'Я просто решил красиво сделать, а ты…', toNode: 19 }
            ]
        },
        {
            id: 19,
            npcReplies: [
                { text: 'Ты хочешь спросить зачем я тебя гоняю как загнанную муху? Надо было.' },
            ],
            answers: [
                { text: 'Ладно, надеюсь ты заплатишь мне. Скоро буду.', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: 'halloween-quest-1-dialog-6',
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 20,
            npcReplies: [
                { text: 'Я думал ты не будешь ничего делать и просто убежишь в город смотреть на красивые машинки за стеклом.' },
            ],
            answers: [
                { text: 'Че? Типо самые дорогие, за какие-то там коины.', toNode: 21 }
            ]
        },
        {
            id: 21,
            npcReplies: [
                { text: 'Ну типа…' },
            ],
            answers: [
                { text: 'Ладно, давай к делу. Я все сделал, может ты уже отдашь мне мои деньги.', toNode: 22 }
            ]
        },
        {
            id: 22,
            npcReplies: [
                { text: 'Так… Денег у меня нет, есть пачка чипсов и ингредиенты для зелья.' },
            ],
            answers: [
                { text: 'Зелье? Ты можешь варить зелья?', toNode: 23 }
            ]
        },
        {
            id: 23,
            npcReplies: [
                { text: 'Ну да. Они разные бывают, но сейчас тут ингредиенты только на одно зелье.' },
            ],
            answers: [
                { text: 'Хорошо, а где их варить тогда?', toNode: 24 }
            ]
        },
        {
            id: 24,
            npcReplies: [
                { text: 'Тут недалеко есть котел, Люсси его оставила когда готовила плов. Смотри чтобы рис туда не попал.' },
            ],
            answers: [
                { text: 'Ладно, тогда давай мне все ингредиенты и я пошел попробую что-то сварить.', toNode: 25 }
            ]
        },
        {
            id: 25,
            npcReplies: [
                { text: 'Забирай, а я пока поищу других людей, кто оставит ингредиенты и не будет жаловаться.' },
            ],
            answers: [
                { text: 'Хорошо', isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});
