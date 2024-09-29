import WebStore from "../../../shared/WebStore";
import {IGunGamePlayerScore} from "../../../shared/hudgungame";
import {action, makeObservable, observable} from "mobx";

export default class HudGunGameStore extends WebStore {
    show: boolean = false;
    myKills: number = 5;
    topPlayers: IGunGamePlayerScore[] = [
        {name: "Игрок 1", kills: 30},
        {name: "Игрок 2", kills: 20},
        {name: "Игрок 3", kills: 10},
    ];

    constructor() {
        super();

        makeObservable(this, {
            show: observable,
            myKills: observable,
            topPlayers: observable,
            setState: action.bound
        })
    }

}