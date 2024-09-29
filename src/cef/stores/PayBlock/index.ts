import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";

export default class PayBlockStore extends WebStore {
    sum: number = 0;
    id: number = 0;
    name: string = '';

    constructor() {
        super();

        makeObservable(this, {
            sum: observable,
            id: observable,
            name: observable,
            setState: action.bound
        })
    }
}