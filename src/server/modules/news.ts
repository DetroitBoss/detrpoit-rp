import {CustomEvent} from "./custom.event";
import {getCategoryName, NEWS_CATEGORY, NEWS_POST_COST} from "../../shared/news";
import {system} from "./system";
import {User} from "./user";
import {inventory} from "./inventory";
import {OWNER_TYPES} from "../../shared/inventory";
import {gui} from "./gui";
import {MoneyChestClass} from "./money.chest";
import {SEND_AD_PLAYER_EVENT} from "./advancedQuests/impl/MultiStepQuest/sendAdQuestStep";

let orderListId = 1
export let orderList = new Map<number, {
    id: number,
    ids: number,
    name: string,
    time: number,
    cat: string,
    text: string,
    number: number,
    res?: string,
}>();

let news: {
    id: number,
    name: string,
    time: number,
    cat: string,
    text: string,
    number: number,
}[] = [];

gui.chat.registerCommand("allnews", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    console.log(news)
})

gui.chat.registerCommand("allnewsorders", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    console.log([...orderList].map(q => q[1]))
})

gui.chat.registerCommand("clearnews", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    news = [];
})

gui.chat.registerCommand("clearnewsorders", (player, str) => {
    const user = player.user;
    if(!user) return;
    if(!user.isAdminNow()) return;
    orderList = new Map();
})

export const getOrderListArray = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return [];
    const accessFull = user.isAdminNow(3) || user.fraction === 5
    let data = [...orderList].map(q => q[1])
    if(!accessFull) data = data.filter(q => q.id === user.id);
    return data
}

CustomEvent.registerCef('news:new', (player, cat: string, text: string, number: number) => {
    const user = player.user;
    if(!user) return;
    if (!NEWS_CATEGORY.find(q => q[0] === cat)) return "Для подачи объявления необходимо выбрать корректную категорию";
    const free = cat === "news"
    if (cat === "news" && (!user.fraction || !user.fractionData.gos)) return "У вас нет доступа к подаче объявлений данной категории"
    if (!text || text.length < 5) return "Минимальная длина сообщения при подаче - 5 символов";
    if (text.length > 100) return "Максимальная длина текста объявления - 100 символов";
    if (!user.bank_have) return "Для заказа объявления необходимо иметь счёт в банке";
    if (!free){
        if (!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(item => item.item_id === 850 && item.advancedNumber === number)) return 'У вас нет телефона с указаным номером';
        if (user.bank_money < NEWS_POST_COST){
            user.bankLog("reject", NEWS_POST_COST, "Подача рекламного объявления", 'LifeInvader')
            return "От банка поступил отказ"
        }
        user.removeBankMoney(NEWS_POST_COST, false, "Подача рекламного объявления", 'LifeInvader');
    }
    orderListId++;
    if ([...orderList].length > 20){
        const q = [...orderList].find(q => q[1].res);
        if(q){
            orderList.delete(q[0]);
        }
    }
    orderList.set(orderListId, { ids: orderListId, id: user.id, name: user.name, cat, text: system.filterInput(text), number, time: system.timestamp});
    if (free) pushNews(orderList.get(orderListId));
    else {
        mp.players.toArray().filter(q => q && q.user && q.user.fraction === 5 && q.user.exists).map(target => target.outputChatBox(`Новое объявление в новостях на модерацию`))
    }
    return ""
})

CustomEvent.registerCef('news:setOrder', (player, id: number, status: boolean, reason?: string) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== 5) return;
    let item = orderList.get(id);
    if(!item) return;
    if(!item.res){
        if(item.id === user.id && !user.isAdminNow()) return player.notify("Вы не можете обработать собственное объявление", "error");
        if(status){
            pushNews(item, user);
        } else {
            item.res = `Отклонено ${user.name} (${user.id}) ${system.filterInput(reason)}`
            let target = User.get(item.id);
            if(target){
                target.user.addBankMoney(NEWS_POST_COST * 0.9, true, 'Возврат средств за подачу рекламного объявления', 'LifeInvader')
            }
        }
        system.saveLog('news', `#${id}, Автор: ${item.name} (${item.id}), Категория: ${getCategoryName(item.cat)}, Текст: ${item.text}, Статус: ${item.res}`, user.entity)
        User.filterByFraction(5).map(target => {
            CustomEvent.triggerCef(target, 'news:setOrderStatus', id, item.res)
        })

        const forPlayer = NEWS_POST_COST * 0.8
        user.addMoney(forPlayer, true, `Обработка объявления`)
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, NEWS_POST_COST - forPlayer, false)
    }
})

CustomEvent.registerCef('news:editOrder', (player, id: number, status: boolean, newText?: string) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== 5) return;
    let item = orderList.get(id);
    if(!item) return;
    if (!newText || newText.length < 5) return "Минимальная длина сообщения при подаче - 5 символов";
    if (newText.length > 100) return "Максимальная длина текста объявления - 100 символов";
    if(!item.res){
        if(item.id === user.id && !user.isAdminNow()) return player.notify("Вы не можете обработать собственное объявление", "error");

        item.res = `Отредактировано ${user.name} (${user.id}) Было: ${system.filterInput(item.text)}`

        item.text = system.filterInput(newText)
        pushNews(item, user);
        system.saveLog('news', `#${id}, Автор: ${item.name} (${item.id}), Категория: ${getCategoryName(item.cat)}, Текст: ${item.text}, Статус: ${item.res}`, user.entity)
        User.filterByFraction(5).map(target => {
            CustomEvent.triggerCef(target, 'news:setOrderStatus', id, item.res, item.text)
        })

        const forPlayer = NEWS_POST_COST * 0.8
        user.addMoney(forPlayer, true, `Обработка объявления`)
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, NEWS_POST_COST - forPlayer, false)
    }
})


export const pushNews = (item: {
    id: number;
    ids: number;
    name: string;
    time: number;
    cat: string;
    text: string;
    number: number;
    res?: string;
}, user?: User) => {
    mp.events.call(SEND_AD_PLAYER_EVENT, item.id)
    let title = `${getCategoryName(item.cat)}`;
    let text = `${item.text}`;
    if(!item.res) {
        if(user){
            text += `. Автор: ${item.name} (${item.id})`
            item.res = `Одобрено ${user.name} (${user.id})`
        } else {
            item.res = `Одобрено системой`
        }
    }
    news.push({
        id: item.id,
        name: item.name,
        time: item.time,
        cat: item.cat,
        text: item.text,
        number: item.number,
    });
    if (news.length > 30) news.splice(0, 1)
    CustomEvent.triggerCefAll('tablet:addnews', [{
        id: item.id,
        name: item.name,
        time: item.time,
        cat: item.cat,
        text: item.text,
        number: item.number,
    }])
    User.notifyWithPictureToAll(item.cat === 'news' ? 'Объявление' : `Weazel News`, title, text, item.cat === 'news' ? 'WEAZEL' : 'WEAZEL');
}

mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    CustomEvent.triggerCef(player, 'tablet:addnews', news);
})