import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";
import {ILicenceGetDataStore} from '../../../shared/licence';

export default class LicensesStore extends WebStore {
    items: ILicenceGetDataStore[] = [];
    constructor() {
        super();

        makeObservable(this, {
            items: observable,
            setState: action.bound
        })
    }
}