export const BP_SEASONS: string[] = [
    'february-season',
    'may-season',
    'july-season'
]

export const isBattlePassItem = (advancedString: string) => {
    return BP_SEASONS.find(el => el === advancedString) !== undefined;
}