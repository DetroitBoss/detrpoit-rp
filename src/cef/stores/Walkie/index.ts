import {observable, action, makeObservable} from "mobx";
import WebStore from "../../../shared/WebStore";

export default class WalkieStore extends WebStore {
    opened: boolean = false;
    /** Мы сейчас говорим */
    enabled: boolean = false;
    /** Текущая частота */
    freq: string = "";
    /** Вводимая частота */
    freqInput: string = "";
    /** Таймер вводимой частоты */
    freqInputTimer: number = 0;
    /** Список говорящих */
    currentSpeakers: string[] = [];
    /** Отображаемый говорящий */
    currentSpeakerName: string = "";
    /** Уведомление о смене громкости */
    alertVolume?: boolean = false;
    /** Уровень громкости */
    volume: number = 50;

    show: boolean = false;

    constructor() {
        super();
        makeObservable(this, {
            show: observable,
            freqInput: observable,
            freqInputTimer: observable,
            volume: observable,
            currentSpeakerName: observable,
            currentSpeakers: observable,
            opened: observable,
            enabled: observable,
            freq: observable,
            setState: action.bound
        });
    }

    destroy() {
    }
}
