import WebStore from "../../../shared/WebStore";
import {makeObservable, observable} from "mobx";


export default class FurnitureHudStore extends WebStore {

    direction: 'x' | 'y' | 'z' = 'x'
    moveType: boolean = true;

    constructor() {
        super();

        makeObservable(this, {
            direction: observable,
            moveType: observable
        })
    }
}