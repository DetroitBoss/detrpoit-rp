import {IReplyAnimation} from "./IReplyAnimation";

export interface DialogNpcReply {
    text: string,
    audioUrl?: string,
    animation?: IReplyAnimation
}