import WebStore from "../../../shared/WebStore";
import {makeObservable, observable} from "mobx";
import {IBattlePassItemDTO} from "../../../shared/battlePass/storage";
import {CSSProperties} from "react";


export default class BattlePassStorageStore extends WebStore {

    inventory: IBattlePassItemDTO[] = [
    ]

    storage: IBattlePassItemDTO[] = []

    styles: CSSProperties = {
        display: 'none',
        position: 'absolute',
        left: '0px',
        right: '0px'
    }

    menuActive: boolean = false

    name: string = ''

    toStorage: boolean = true

    targetId: number = -1;

    constructor() {
        super();

        makeObservable(this, {
            inventory: observable,
            storage: observable,
            styles: observable,
            menuActive: observable,
            name: observable,
            toStorage: observable,
            targetId: observable
        })
    }
}