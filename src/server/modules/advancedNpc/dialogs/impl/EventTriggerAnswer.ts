import {IAnswerAction} from "../interfaces/IAnswerAction";
import {Dialog} from "../interfaces/dialog";

export class EventTriggerAnswer implements IAnswerAction {
    private readonly _eventName: string;

    constructor(eventName: string) {
        this._eventName = eventName;
    }

    handle(player: PlayerMp, dialog: Dialog): void {
        mp.events.call(this._eventName, player, dialog);
    }
}