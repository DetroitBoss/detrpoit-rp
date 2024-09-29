import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export abstract class QuestStep {
    protected readonly _player: PlayerMp;
    protected _nextStep: () => void;
    protected update: () => void;

    protected constructor(player: PlayerMp) {
        this._player = player;
    }

    init(nextStep: () => void, update: () => void) {
        this._nextStep = nextStep;
        this.update = update;
    }

    /**
     * Вызывается при завершении шага
     */
    abstract onDestroy(): void;

    /**
     * Вызывается при завершении всего квеста
     */
    abstract onQuestDestroy(): void;

    abstract get isComplete(): boolean;

    abstract get hudDto(): QuestStepDto;
}