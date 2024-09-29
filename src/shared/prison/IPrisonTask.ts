import {MINIGAME_TYPE} from "../minigame";

export interface IPrisonTask {
    type: MINIGAME_TYPE,
    count: number,
    completed: number
}