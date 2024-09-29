import {DialogAnswer} from "./dialogAnswer";
import {DialogNpcReply} from "./dialogNpcReply";

export interface DialogNode {
    id: number,
    npcReplies: DialogNpcReply[],
    answers: DialogAnswer[]
}