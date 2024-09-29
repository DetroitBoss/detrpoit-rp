import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";
import {IFurnitureDTO} from "../../../shared/houses/menu/menu.web";
import {FurnitureCategory} from "../../../shared/houses/furniture/furniture.config";


export default class HomeMenuStore extends WebStore {

    page: 'configurator' | 'interior' | 'furniture' = 'configurator';
    layout: number = null;
    variation: number = null;
    furniture: IFurnitureDTO[] = []
    category: FurnitureCategory = null;
    furnitureItem: number = null;
    cash: number = 0;
    wallet: number = 0;
    coins: number = 0;
    interiorId: number = null;

    constructor() {
        super();

        makeObservable(this, {
            page: observable,
            layout: observable,
            variation: observable,
            furniture: observable,
            category: observable,
            furnitureItem: observable,
            cash: observable,
            wallet: observable,
            coins: observable,
            interiorId: observable,
            setState: action.bound
        })
    }
}