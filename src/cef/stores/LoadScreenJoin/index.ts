import WebStore from '../../../shared/WebStore'
import { action, makeObservable, observable } from "mobx";

export default class LoadScreenJoinStore extends WebStore {
    introScene: boolean = true;
    allowEnter: boolean = false;
    loadingScreenStart: boolean = false;

    constructor() {
        super();

        makeObservable(this, {
            introScene: observable,
            allowEnter: observable,
            loadingScreenStart: observable,
            setState: action.bound
        })
    }
}
