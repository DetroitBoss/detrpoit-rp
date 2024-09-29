import {ISeller} from "./ISeller";
import {getMarketPedModel} from "../../../../shared/market/npcPedsConfig";
import {NPC_SELLER_PERCENTS} from "../../../../shared/market/config";
import {system} from "../../system";

export class NpcSeller implements ISeller {
    private _npc: PedMp;

    public constructor(position: Vector3Mp, heading: number) {
        this._npc = system.createPed(position, heading, getMarketPedModel());
    }

    public destroy(isTentDestroyed: boolean): void {
        this._npc.destroy();
    }

    public makePayment(money: number): void {
        return;
    }

    public getSellsPercent(): number {
        return NPC_SELLER_PERCENTS;
    }

    public callToTent(caller: PlayerMp): void {
        caller.notify('В данный момент владелец лавки не может подойти к ней');
    }
}