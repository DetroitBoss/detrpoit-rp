import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_HARRY_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SECOND_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: 'new-year-quest-2-dialog-1',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: '*В руках журнал*'},
                {text: 'Блин, журнал «Playboy». Все голые, аж смотреть тошно.'}
            ],
            answers: [
                {text: 'Хватит смотреть на девочек, ты мне говорил что надо подойти будет.', toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: 'Казалось бы, надо дать тебе крутое задание, но...'}
            ],
            answers: [
                {text: 'Но?', toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: 'Новый год существует для того, чтобы уйти от всей этой токсичности.'},
                {text: 'Новый год это время, когда самые заветные мечты сбываются.'}
            ],
            answers: [
                {text: 'К чему ты клонишь, мужик.', toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: 'К тому, что тебе надо научиться общаться с людьми.'}
            ],
            answers: [
                {text: 'Я каждый день, на ревиках в гетто взаимодействую.', toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: 'Нет, ты не понял. Знаешь такое травяное растение, как банан.'}
            ],
            answers: [
                {text: 'Ну да, понятное дело.', toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: 'Пусть банан будет помощником в первом контакте с людьми.'}
            ],
            answers: [
                {text: 'Окей, а че с ним делать?', toNode: 6}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: 'Ну слушай, тебе надо будет произвести обмен с любым жителем этой планеты.'},
                {text: 'Просто отдать ему банан, ничего не взяв взамен и конечно же сказать приятные слова.'}
            ],
            answers: [
                {text: 'Странное конечно задание, но ладно.', isExit: true, onReply: new QuestStart(NEW_YEAR_SECOND_QUEST_ID)}
            ]
        }
    ]
});

registerDialog({
    id: 'new-year-quest-2-dialog-2',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 7,
            npcReplies: [
                {text: 'Грхм… *дрожит от холода*'}
            ],
            answers: [
                {text: 'Фух… это было сложно, найти общий язык оказалось труднее чем я думал.', toNode: 8},
                {text: 'Эй, ты чего тут мерзнешь, я сделал то что ты просил. Это оказалось достаточно просто.', toNode: 9}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: 'Н-н-ну а т-т-т ты как думал.'},
                {text: 'Не все так просто в нашей ж-жизни.'},
                {text: 'Слушай, надо бы сделать кое-что для меня. Я очень сильно замерз.'},
                {text: 'Там мой знакомый фейхоа выращивает, но я никогда его не пробовал. Сможешь принести мне?'}
            ],
            answers: [
                {text: 'Окей, без проблем.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: 'Фейхоа, звучит действительно интересно..', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: 'Я-я я рад что у тебя все получилось.'},
                {text: 'Холодно однако, слушай.'},
                {text: 'Можешь пойти к моему знакомому. Он выращивает целебные травы.'},
                {text: 'Как раз сделаю чай и согреюсь.'}
            ],
            answers: [
                {text: 'Окей, без проблем.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: 'Фейхоа, звучит действительно интересно..', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
});

registerDialog({
    id: 'new-year-quest-2-dialog-3',
    characterName: NEW_YEAR_HARRY_NPC_NAME,
    nodes: [
        {
            id: 10,
            npcReplies: [
                {text: 'Чёрт! Как можно штрафовать Санта-Клауса перед Рождеством, ну куда же мы катимся!'},
                {text: 'Остается только Пасхальному кролику сделать прививку от бешенства...'}
            ],
            answers: [
                {text: 'Слушай, мне тут сказали у тебя есть какие-то целебные травы. Попросили забрать.', toNode: 11},
                {text: 'Привет, я тут ищу фейхоа. Есть что-то такое.', toNode: 12}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: 'Целебные травы, понял тебя.'},
                {text: 'Слушай, у меня остался последний пакетик.'},
                {text: 'Сможешь сходит к моей ферме и собрать один кустик.'}
            ],
            answers: [
                {text: 'Хорошо, сейчас всё будет..', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: 'Ха-ха-ха, слушай ты за меня придурка не держи.'},
                {text: 'У меня тут остался один пакетик.'},
                {text: 'Но я так просто его не отдам.'},
                {text: 'Пойди собери немного для моих запасов.'},
                {text: 'Ну и я отдам этот пакетик фейхуевенький.'}
            ],
            answers: [
                {text: 'Хорошо, сейчас всё будет..', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-2-dialog-4',
    characterName: NEW_YEAR_HARRY_NPC_NAME,
    nodes: [
        {
            id: 13,
            npcReplies: [
                {text: '*Смотрит*'}
            ],
            answers: [
                {text: 'Ты уверен, что это лечебная трава?', toNode: 14},
                {text: 'Ты уверен, что это фейхоа, таким обычно убиваются всякие плохие люди', toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: 'Я че шутка чтоли, конечно уверен. Меня распирает от этого дерьма.'},
                {text: 'На свой пакетик и проваливай.'}
            ],
            answers: [
                {text: 'Окей.', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-2-dialog-5',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 15,
            npcReplies: [
                {text: '*Смотрит*'}
            ],
            answers: [
                {text: 'Ты кого пытался обмануть?', toNode: 16}
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: '*укуренным голосом* ахахах в плане?'}
            ],
            answers: [
                {text: 'Ты че просил достать для меня эту дрянь? Мог и на прямую сказать', toNode: 17}
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: 'Ха, ну типо да. Новый год все дела.'}
            ],
            answers: [
                {text: 'Чувак, я против этого конечно, но я достал что тебе нужно. Что дальше?', toNode: 18}
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: 'Гхааа видишь оленей?'}
            ],
            answers: [
                {text: 'Нет.', toNode: 19}
            ]
        },
        {
            id: 19,
            npcReplies: [
                {text: 'А они есть…'}
            ],
            answers: [
                {text: 'Шутишь опять?', toNode: 20}
            ]
        },
        {
            id: 20,
            npcReplies: [
                {text: 'Не, если серьезно то подари новогоднее настроение людям.'}
            ],
            answers: [
                {text: 'Так а что делать, сказал про каких-то оленей.', toNode: 21}
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: 'Сам подумай…'}
            ],
            answers: [
                {text: 'Хорошо', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: 'new-year-quest-2-dialog-6',
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 22,
            npcReplies: [
                {text: 'Ну как, получилось?'}
            ],
            answers: [
                {text: 'Да, было просто.', toNode: 23}
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: 'Окей, ну на этом пока все. Дальше больше..'}
            ],
            answers: [
                {text: 'До встречи', isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})