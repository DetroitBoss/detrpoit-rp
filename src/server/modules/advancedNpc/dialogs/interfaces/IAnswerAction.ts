import {Dialog} from "./dialog";

export interface IAnswerAction {
    handle(player: PlayerMp, dialog: Dialog): void;
}