import {DialogNode} from "./interfaces/dialogNode";
import {DialogNodeDto, DialogNpcReplyDto} from "../../../../shared/dialogs/dtos/DialogNodeDto";
import {DialogNpcReply} from "./interfaces/dialogNpcReply";

export function mapDialogNodeToDto(dialogNode: DialogNode): DialogNodeDto {
    return {
        id: dialogNode.id,
        npcReplies: dialogNode.npcReplies.map(mapDialogNpcReplyToDto),
        answers: dialogNode.answers.map(answer => answer.text)
    }
}

export function mapDialogNpcReplyToDto(dialogNpcReply: DialogNpcReply): DialogNpcReplyDto {
    return {
        text: dialogNpcReply.text,
        audioUrl: dialogNpcReply.audioUrl
    }
}
