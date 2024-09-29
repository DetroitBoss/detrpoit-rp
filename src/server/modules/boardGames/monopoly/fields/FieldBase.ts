export abstract class FieldBase {
    private readonly _id: number;

    constructor(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}