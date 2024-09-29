import {system} from "../../system";
import {Dialog} from "./interfaces/dialog";
import {IDialogNpc} from "./interfaces/IDialogNpc";
import {CustomEvent} from "../../custom.event";
import {mapDialogNodeToDto} from "./converters";

const registeredDialogs = new Map<string, Dialog>();
export function registerDialog(dialog: Dialog) {
    if (registeredDialogs.has(dialog.id)) {
        system.debug.error(`Attempt to register dialog with already exist identifier (${dialog.id})`);
        return;
    }

    registeredDialogs.set(dialog.id, dialog);
}

export function getDialog(id: string) {
    return registeredDialogs.get(id);
}

const openedPlayerDialogs = new Map<PlayerMp, Dialog>();
export function openDialog(player: PlayerMp, dialog: Dialog, dialogNpc: IDialogNpc) {
    openedPlayerDialogs.set(player, dialog);

    CustomEvent.triggerClient(player, 'dialogs:open', dialog.characterName,
        mapDialogNodeToDto(dialog.nodes[0]), dialogNpc.getNpcData());
}

CustomEvent.registerCef('dialogs:answer', (player: PlayerMp, nodeId: number, answerIndex: number) => {
    if (!player.user) {
        return;
    }

    const dialog = openedPlayerDialogs.get(player);
    if (!dialog) {
        return system.debug.error(`[Dialogs] (dialogs:answer) - not found dialog. ${player.user.id} ${nodeId} ${answerIndex}`);
    }

    const node = dialog.nodes.find(node => node.id === nodeId);
    if (!node) {
        openedPlayerDialogs.delete(player);
        return player.user.setGui(null);
    }

    const answer = node.answers[answerIndex];
    if (!answer) {
        openedPlayerDialogs.delete(player);
        return player.user.setGui(null);
    }

    if (answer.onReply) {
        answer.onReply.handle(player, dialog);
    }

    if (answer.isExit) {
        return CustomEvent.triggerClient(player, 'dialogs:close');
    }

    const nextNodeId = typeof answer.toNode === "number" ? answer.toNode : answer.toNode.getNextNode(player);
    const nextNode = dialog.nodes.find(node => node.id === nextNodeId);
    CustomEvent.triggerCef(player, 'dialogs::setNode', mapDialogNodeToDto(nextNode));
});

mp.events.add('playerQuit', (player: PlayerMp) => {
    openedPlayerDialogs.delete(player);
});



