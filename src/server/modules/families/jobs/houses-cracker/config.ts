import { NpcParameters } from '../../../npc'

/** Подсказки, которые вылезают во время проигрывания анимации обыска */
export const RobberyTexts: string[] = [
    'Обыскиваем шмотки',
    'Проверяем шкаф',
    'Ищем травку',
    'Вытряхиваем сумки'
];

/**
 * Конфиг Id отмычки
 */
export const PicklockItemId = 813;

/**
 * Вероятность сломать отмычку при успешном завершении мини-игры (100% = 1)
 */
export const PicklockBrokeChance = 0.2;

/**
 * Кулдаун на взятие задания ограбления у НПС
 */
export const RobberyTaskCooldownMinutes = 60;

/**
 * Минимальный уровень семьи-банды для начала квеста
 */
export const MinGangFamilyLevel = 3;
/**
 * Минимальный уровень гос-семьи, с которого им будут приходить уведомления об ограблении
 */
export const MinGovFamilyLevel = 2;

/**
 * Параметры НПС, выдающего квест членам семей-банд
 */
export const QuestNpcParameters : NpcParameters = {
    Position: new mp.Vector3(705.22, -960.97, 30.4),
    Heading: 249.0,
    Model: 'csb_agent',
    Name: 'Вор со стажем'
}

export const QuestBlip = 472;
export const QuestBlipColor = 5;

/**
 * Время проигрывания анимации ограбления
 */
export const RobbingTimeSeconds = 1;

/**
 * Радиус зоны вокруг входа в дом, которую нужно покинуть, чтобы завершить ограбление
 */
export const LeavingAreaRadius = 255;

export interface RobberyItemConfig {
    /**
     * Id предмета
     */
    ItemId: number,

    /**
     * Диапазон возможного количества дропа этого предмета при ограблении (за один чекпоинт)
     */
    DropAmountRange: [number, number],
}

export const RobberyItems: RobberyItemConfig[] = [
    { ItemId: 5000, DropAmountRange: [1, 3] },
    { ItemId: 5001, DropAmountRange: [1, 3] },
    { ItemId: 5002, DropAmountRange: [1, 3] },
    { ItemId: 5003, DropAmountRange: [1, 2] },
    { ItemId: 5004, DropAmountRange: [1, 3] },
    { ItemId: 5005, DropAmountRange: [1, 2] },
    { ItemId: 5006, DropAmountRange: [1, 1] },
    { ItemId: 5007, DropAmountRange: [1, 4] },
    { ItemId: 5008, DropAmountRange: [1, 4] },
    { ItemId: 5009, DropAmountRange: [1, 4] },
    { ItemId: 5010, DropAmountRange: [1, 5] },
    { ItemId: 5011, DropAmountRange: [1, 4] },
    { ItemId: 5012, DropAmountRange: [1, 5] },
    { ItemId: 5013, DropAmountRange: [1, 3] },
    { ItemId: 5014, DropAmountRange: [1, 1] },
    { ItemId: 5015, DropAmountRange: [1, 1] },
]