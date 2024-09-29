import WebStore from "../../../shared/WebStore";
import {action, makeObservable, observable} from "mobx";
import {IBattleStatusDTO} from "../../../shared/islandBattle";


export default class IslandBattleStore extends WebStore {
    show: boolean = false

    result: IBattleStatusDTO[] = [
        {
            name: "YAK",
            points: 5
        },
        {
            name: "RM",
            points: 5
        },
        {
            name: "LCN",
            points: 5
        }
    ]

    time: number = 0;

    constructor() {
        super();


        makeObservable(this, {
            show: observable,
            time: observable,
            result: observable,
            setState: action.bound
        })
    }
}