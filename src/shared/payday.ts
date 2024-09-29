export const getMaxExpLevel = (level: number) => {
    return (level) * 6
}
/** Множитель награды при получении нового уровня при PayDay.
 * @example Если игрок получит 3 LVL, а параметр установлен 200 - то игрок дополнительно получит 600$
 */
export const LEVEL_MONEY_REWARD_MULTIPLER = 200


/** Сколько минут необходимо поиграть чтобы получить PayDay который приходит каждый час */
export const PAYDAY_NEED_PLAY = 20;