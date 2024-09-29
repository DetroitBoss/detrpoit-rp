import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";
import {IAgencyHouseDTO} from "../../../shared/houses/agency/config";

export default class AgencyStore extends WebStore {

    id: number = 2
    name: string = 'Los Angeles'
    houses: IAgencyHouseDTO[] = [
        {
            id: 1515,
            name: 'Wall street',
            repository: false,
            garageSpaces: 10,
            stock: true,
            interior: 'Качественный',
            helicopter: false
        }
    ]
    activeHouse: number = null

    constructor() {
        super();
        makeObservable(this, {
            id: observable,
            name: observable,
            houses: observable,
            activeHouse: observable,
            setState: action.bound
        })
    }
}