import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";
import {FurnitureCategory} from "../../../shared/houses/furniture/furniture.config";

export default class FurnitureShopStore extends WebStore{
    cat: FurnitureCategory | null = 'wardrobe'
    item: number = null
    constructor() {
        super();
        makeObservable(this, {
            setState: action.bound,
            cat: observable,
            item: observable
        })
    }

}