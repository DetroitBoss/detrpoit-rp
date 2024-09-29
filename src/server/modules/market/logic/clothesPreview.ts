import {CustomEvent} from "../../custom.event";
import {getTentById} from "../TradeTent";
import {marketItemsDb} from "../marketItemsDb";
import {dress} from "../../customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../../../shared/cloth";
import {inventory} from "../../inventory";

CustomEvent.registerCef('market::clothPreview', (player: PlayerMp, tentId: number, itemId: number) => {
    const tent = getTentById(tentId);
    if (!tent) {
        return player.user.setGui(null);
    }

    const item = inventory.get(itemId);

    if (!item) {
        player.notify('Непредвиденная ошибка', 'error');
        return player.user.setGui(null);
    }

    let dressId = item.advancedNumber;
    let variation = 0;
    if (dressId >= CLOTH_VARIATION_ID_MULTIPLER) {
        variation = Math.floor(dressId / CLOTH_VARIATION_ID_MULTIPLER);
        dressId = dressId % CLOTH_VARIATION_ID_MULTIPLER;
    }

    const dressConfig = dress.get(dressId);

    if (dressConfig.male !== player.user.is_male) {
        return player.notify(`Это ${dressConfig.male ? 'мужская' : 'женская'} одежда`, 'error');
    }

    dressConfig.data[variation].forEach(data => {
        player.user.setDress(data.component, data.drawable, data.texture);
    });
});

CustomEvent.registerClient('market:closed', (player) => {
    player.user.reloadSkin();
});

