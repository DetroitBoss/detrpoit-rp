import {FIB_DATA_POS, FIB_DATA_RANK} from "../../shared/fibdata";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {FACTION_ID} from "../../shared/fractions";
import {FractionChestEntity} from "./typeorm/entities/chest";
import {fractionChest} from "./chest";
import {Logs} from "./logs";
import {MoneyChestClass} from "./money.chest";
import {fractionCfg} from "./fractions/main";

if (FIB_DATA_POS.length > 0) {
    colshapes.new(FIB_DATA_POS, `База данных FIB`, player => {
        main(player)
    }, {
        type: 27,
        drawStaticName: 'scaleform'
    })
}

const main = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.fraction !== FACTION_ID.FIB) return player.notify('Доступно только сотрудникам FIB', 'error');
    if (user.rank < FIB_DATA_RANK) return player.notify(`Доступно только с ранга ${fractionCfg.getRankName(FACTION_ID.FIB, FIB_DATA_RANK)}`, 'error');
    const m = menu.new(player, 'База данных FIB')

    const fractions = [...fractionCfg.list.map(q => q.id)]

    fractions.map(id => {
        const cfg = fractionCfg.getFraction(id);
        if (!cfg) return;
        m.newItem({
            name: `Данные по ${cfg.name}`,
            onpress: () => {
                data(player, id);
            }
        })
    })

    m.open();
}

const data = (player: PlayerMp, id: FACTION_ID) => {
    const cfg = fractionCfg.getFraction(id);
    if (!cfg) return;
    const user = player.user;
    if (!user) return;
    if (user.fraction !== FACTION_ID.FIB) return player.notify('Доступно только сотрудникам FIB', 'error');
    if (user.rank < FIB_DATA_RANK) return player.notify(`Доступно только с ранга ${fractionCfg.getRankName(FACTION_ID.FIB, FIB_DATA_RANK)}`, 'error');


    const m = menu.new(player, `Данные по ${cfg.name}`)
    m.onclose = () => {
        main(player);
    }

    const items = fractionChest.getByFraction(id);
    if(!items.length){
        m.newItem({
            name: 'Журнал склада',
            more: `Данные недоступны`
        })
    } else {
        items.map(item => {
            m.newItem({
                name: `Склад #${item.id}`,
                onpress: () => {
                    Logs.open(player, `chest_${item.id}`, 'Склад')
                }
            })
        })
    }

    const mitems = MoneyChestClass.getAllByFraction(id);
    if(!mitems.length){
        m.newItem({
            name: 'Журнал деженый сейфов',
            more: `Данные недоступны`
        })
    } else {
        mitems.map(item => {
            m.newItem({
                name: `Денежный сейф #${item.id}`,
                onpress: () => {
                    Logs.open(player, `money_${item.id}`, 'Склад')
                }
            })
        })
    }


    m.open()
}