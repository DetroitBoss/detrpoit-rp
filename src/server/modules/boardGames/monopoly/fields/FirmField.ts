import {Firm} from "../firm";
import {IField} from "./IField";
import {MonopolyPlayer} from "../monopolyPlayer";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class FirmField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Firm
    private readonly _firm: Firm;

    constructor(id: number, firm: Firm) {
        super(id)
        this._firm = firm;
    }

    public get firm() {
        return this._firm
    }

    public onPlayerReached(player: MonopolyPlayer): void {
        if (player == this._firm.owner) {
            return player.releaseMove()
        } else if (!this._firm.owner) {
            player.suggestBuyFirm(this._firm)
        } else {
            const cost = this._firm.owner.haveStreet(this._firm.street) ? this._firm.cost * 2 : this._firm.cost
            player.withdrawBalance(cost)
            this._firm.owner.balance += cost
        }
    }
}