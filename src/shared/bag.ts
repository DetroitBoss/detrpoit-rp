export interface BagAttachData {
    /** Drawable */
    d: number,
    /** Текстура */
    t: number,
    /** Палитра (обычно - 2) */
    p: number
}

/** Параметры сумки на человеке */
export const BAG_ATTACH = {
    /** Ограбление банков и подобного */
    grab_money: <BagAttachData>{d: 45, t: 0, p: 2},
    /** Ограбление кассовых аппаратов */
    grab_money_shop: <BagAttachData>{d: 45, t: 0, p: 2},
    /** Ограбление порта, где дают предметы */
    grab_item: <BagAttachData>{d: 45, t: 0, p: 2},
    /** Инкассаторка */
    gr6Money: <BagAttachData>{d: 45, t: 0, p: 2},
    /** Игра по захвату сумки с доставкой */
    box_game_owner: <BagAttachData>{d: 45, t: 0, p: 2}
}