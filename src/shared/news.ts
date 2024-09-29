/** Стоиомость подачи объявления */
export const NEWS_POST_COST = 300

export const NEWS_CATEGORY = [
    ["other", "Разное"],
    ["veh", "Автомобили"],
    ["house", "Недвижимость"],
    ["business", "Бизнес"],
    ["job", "Работа"],
    ["news", "Новости"],
]

export const getCategoryName = (cat: string) => {
    return NEWS_CATEGORY.find(q => q[0] === cat)[1]
}