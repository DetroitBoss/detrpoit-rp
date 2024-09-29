import { colshapes } from "./checkpoints";
import { system } from "./system";
import { menu } from "./menu";
import { startDocumentCost, restoreDocumentCost } from "../../shared/economy";
import { inventory } from "./inventory";
import { OWNER_TYPES } from "../../shared/inventory";
import { ItemEntity } from "./typeorm/entities/inventory";
import { User } from "./user";
import { houses } from "./houses";
let pos = [
    new mp.Vector3(-554.69, -190.93, 37.23),
    // new mp.Vector3(-553.02, -187.37, 37.23),
]

setTimeout(() => {
    system.createBlip(419, 4, pos[0], "Los Santos City Hall")
}, 100)


export const openCityHall = (player: PlayerMp) => {
    const user = player.user;
    const m = menu.new(player, "", "Действия");
    m.sprite = "suemurry_background_left";
    let cost = startDocumentCost;
    let name = "Получить ID карту";
    let nameReason = "Получил ID карту";
    let desc = "По прибытию все жители штата обязаны получить удостоверение личности, вам не требуется заполнять заявку поскольку вы уже ранее подавали заявку";
    let notify = "Вы получили документы на имя ";
    if (user.social_number){
        cost = restoreDocumentCost 
        name = "Перевыпустить документы"
        nameReason = "Перевыпустил документы"
        desc = "В случае утраты документов вы обязаны их восстановить. Старые документы будут являться недействительными"
        notify = "Вы восстановили документы на имя ";
    }
    m.newItem({
        name: `${name} [Enter]`,
        icon: "Item_800",
        more: cost ? `$${system.numberFormat(cost)}` : "Бесплатно",
        desc,
        onpress: async () => {
            const sign = await user.getSignature('idcard_'+user.id)
         //   if (!sign) return player.notify('Необходимо поставить подпись', "error", 'DIA_MIGRANT');
            if (cost) {
                if (!(await user.tryPayment(cost, "all", null, nameReason, "Los Santos City Hall"))) {
                    return;
                }
            }
            let number = system.getRandomInt(1000000000, 9000000000)
            user.social_number = number.toString();
            inventory.createItem({
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: user.id,
                item_id: 800,
                advancedString: `${user.name}`,
                advancedNumber: user.male ? 1 : 0,
                serial: user.id + "_" + number
            })
            player.notify(notify + user.name, "success", 'DIA_MIGRANT');
            m.close();
        }
    })
    m.open();
}

pos.map(item => colshapes.new(item, "Секретарь", player => openCityHall(player)))



export const getDocumentData = (item: ItemEntity): Promise<{ house:string, number: string, name: string, male: number, partner:string, age: number, id: number, level: number}> => {
    return new Promise(async (resolve, reject) => {
        if(!item) resolve(null);
        const acc = await User.getData(parseInt(item.serial.split('_')[0]));
        if(!acc) return resolve(null);
        if (acc.id + "_" + acc.social_number !== item.serial) return resolve(null);
        const house = houses.getByUserList(acc.id);
        const partner = acc.partnerId ? await User.getData(acc.partnerId) : null
        const partnerName = partner ? `${partner.rp_name} (#${partner.id}_${partner.social_number})` : null;
        resolve({ id: acc.id, house: house ? `${house.name} #${house.id}` : '', number: item.serial.split('_')[1], name: item.advancedString, male: item.advancedNumber, partner: partnerName, age: acc.age, level: acc.level })
    })
}