import {IAnswerAction} from "../interfaces/IAnswerAction";
import {Dialog} from "../interfaces/dialog";

export class FuncAnswer implements IAnswerAction {
    private readonly _func: (player: PlayerMp) => void;

    constructor(func: (player: PlayerMp) => void) {
        this._func = func;
    }

    handle(player: PlayerMp, dialog: Dialog): void {
        this._func(player);
    }
}