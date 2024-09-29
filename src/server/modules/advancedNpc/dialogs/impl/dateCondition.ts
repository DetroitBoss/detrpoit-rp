import {INodeCondition} from "../interfaces/INodeCondition";

export class DateCondition implements INodeCondition {
    private readonly _date: Date;
    private readonly _dateMoreNode: number;
    private readonly _dateLessNode: number;

    constructor(date: Date, dateMoreNode: number, dateLessNode: number) {
        this._date = date;
        this._dateMoreNode = dateMoreNode;
        this._dateLessNode = dateLessNode;
    }

    getNextNode(player: PlayerMp): number {
        return new Date() > this._date ? this._dateMoreNode : this._dateLessNode;
    }
}
