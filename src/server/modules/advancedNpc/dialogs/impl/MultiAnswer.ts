import {IAnswerAction} from "../interfaces/IAnswerAction";
import {Dialog} from "../interfaces/dialog";

export class MultiAnswer implements IAnswerAction {
    private readonly _actions: IAnswerAction[];

    constructor(...actions: IAnswerAction[]) {
        this._actions = actions;
    }

    handle(player: PlayerMp, dialog: Dialog): void {
        this._actions.forEach(action => action.handle(player, dialog));
    }
}