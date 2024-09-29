/** На сколько минут накладывается ограничение на заказ продукции */
export const CHEST_ORDER_BLOCK_TIME = 60

export type OrderMenuStyle = "mafia" | "PSC" | "gov" | "gang";

export interface OrderItem {
    ItemId: number,
    IsBlocked: boolean,
    MaxCount: number,
    Price: number
}

export interface OrderedItem {
    ItemId: number,
    Count: number
}

export const CHEST_RECYCLING_LIST: {item_id: number, price: number}[] = [
    {item_id: 50, price: 1000},
    {item_id: 51, price: 1000},
    {item_id: 52, price: 1000},
    {item_id: 53, price: 1000},
    {item_id: 54, price: 1000},
    {item_id: 544, price: 200},
    {item_id: 529, price: 400},
    {item_id: 516, price: 100},
    {item_id: 532, price: 1000},
    {item_id: 530, price: 100},
    {item_id: 511, price: 500},
    {item_id: 521, price: 150},
    {item_id: 500, price: 250},
    {item_id: 501, price: 50},
    {item_id: 813, price: 20},
    {item_id: 857, price: 3000},
    {item_id: 858, price: 1000},
    {item_id: 859, price: 1500},
    {item_id: 860, price: 150},
    {item_id: 854, price: 8000},
    {item_id: 4000, price: 50},
    {item_id: 4001, price: 50},
    {item_id: 4002, price: 50},
    {item_id: 872, price: 20},
    {item_id: 873, price: 20},
    {item_id: 874, price: 20},
    {item_id: 875, price: 20},
    {item_id: 876, price: 20},
    {item_id: 877, price: 20},
    {item_id: 878, price: 20},
    {item_id: 799, price: 30},
    {item_id: 804, price: 5},
    {item_id: 890, price: 800},
    {item_id: 551, price: 200},
    {item_id: 830, price: 100},
    {item_id: 831, price: 100},
    {item_id: 832, price: 100},
    {item_id: 833, price: 100},
    {item_id: 834, price: 100},
    {item_id: 835, price: 100},
    {item_id: 836, price: 100},
    {item_id: 819, price: 50},
    {item_id: 820, price: 50},
    {item_id: 821, price: 50},
    {item_id: 822, price: 50},
    {item_id: 823, price: 50},
    {item_id: 824, price: 50},
    {item_id: 880, price: 100}
]
