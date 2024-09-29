import {IAnswerAction} from "./IAnswerAction";
import {INodeCondition} from "./INodeCondition";

export interface DialogAnswer {
    text: string,

    /** Закончить диалог с НПС */
    isExit?: boolean,

    /** Перенаправляет на другой DialogNode. */
    toNode?: number | INodeCondition,

    onReply?: IAnswerAction,
}