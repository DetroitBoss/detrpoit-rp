import './dialogs'

import {invokeHook} from "../../../shared/hooks";
import {createDynamicPed, NpcParameters} from "../npc";
import {Dialog} from "./dialogs/interfaces/dialog";
import {getDialog, openDialog, registerDialog} from "./dialogs/dialogs";
import {IDialogNpc} from "./dialogs/interfaces/IDialogNpc";
import {DialogNpcData} from "../../../shared/dialogs/dtos/DialogNpcData";
import {CustomEvent} from "../custom.event";
import {IAnswerAction} from "./dialogs/interfaces/IAnswerAction";
import {system} from "../system";

export const NPC_INTERACT_HOOK = 'advanced-npc-interact-hook';
export class ServerNpc implements IDialogNpc {
    private static pool: ServerNpc[] = [];
    public static get(id: string | number) {
        if (typeof id === 'string') {
            return this.pool.find(npc => npc.id === id);
        } else {
            return this.pool.find(npc => npc.pedEntity.id === id);
        }
    }


    public readonly id: string;

    private readonly parameters: NpcParameters;
    private readonly dialogId?: string;
    private readonly pedEntity: PedMp;

    public get position() {
        return this.parameters.Position;
    }

    public get name() {
        return this.parameters.Name;
    }

    constructor(id: string, parameters: NpcParameters, dialogId?: string) {
        this.id = id;
        this.parameters = parameters;

        this.pedEntity = system.createPed(parameters.Position, parameters.Heading,
            parameters.Model, true, false, parameters.Dimension);
        this.pedEntity.setVariable('advancedPedName', parameters.Name);

        this.dialogId = dialogId;

        ServerNpc.pool.push(this);
    }

    handleInteract(player: PlayerMp) {
        const dialogs = invokeHook<Dialog>(NPC_INTERACT_HOOK, player, this);
        const dialog = dialogs[0] ?? getDialog(this.dialogId);

        if (dialog) {
            openDialog(player, dialog, this);
        }
    }

    getNpcData(): DialogNpcData {
        return {
            type: 'serverPed',
            id: this.pedEntity.id
        }
    }
}

CustomEvent.registerClient('advancedPed:interact', (player, pedRemoteId: number) => {
    const npc = ServerNpc.get(pedRemoteId);
    if (npc) {
        npc.handleInteract(player);
    }
});
