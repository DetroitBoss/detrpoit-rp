import {system} from "../system";
import {ORDER_CAR_POS, ORDER_LOAD_COORDS, ORDER_MENU_POS} from "../../../shared/order.system";
import {ScaleformTextMp} from "../scaleform.mp";

ORDER_LOAD_COORDS.map((item, index) => {
    system.createBlipNearest(85, 26, item, `Погрузочная зона №${index+1}`, 100)
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), `Погрузочная зона №${index + 1}`, {
        range: 5,
        type: ""
    })
})
ORDER_CAR_POS.map(item => {
    // Пожалуйста, не пропадай при мерджах
    system.createBlip(85, 1, item, `Аренда служебного транспорта`, 0);
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), 'Аренда служебного транспорта', {
        range: 20,
        type: ""
    })
})
ORDER_MENU_POS.map(item => {
    system.createBlip(616, 26, item, `Служба доставки`)
    new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1), `Служба доставки`, {
        range: 25,
        type: ""
    })
})
