import {DialogNode} from "./dialogNode";

/**
 * Интерфейс, описывающий схему диалога
 * Первым запускается DialogNode с 0-го индекса
 */
export interface Dialog {
    id: string,
    characterName: string,
    nodes: DialogNode[],
}