export interface IQuestSavable {
    /**
     * Должно быть переменной экземпляра
     * @example getSaveData = () => { ... code here ... }
     */
    getSaveData: () => any;
}

export function isObjectImplementsIQuestSavable(obj: any): obj is IQuestSavable {
    return obj.hasOwnProperty('getSaveData');
}
