import {MonopolyPlayer} from "./monopolyPlayer";
import {MonopolyStreet} from "./monopolyStreet";

export class Firm {
    public owner: MonopolyPlayer
    public readonly id: number

    private readonly _cost: number
    private readonly _street: MonopolyStreet
    private readonly _name: string;

    constructor(id: number, cost: number, street: MonopolyStreet, name: string) {
        this.id = id
        this._cost = cost
        this._street = street;
        this._name = name;
    }

    public get cost() {
        return this._cost
    }

    public get name() {
        return this._name
    }

    public get street() {
        return this._street
    }
}