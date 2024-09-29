import {DropBase} from "./dropBase";
import {DressDropData} from "../../../../shared/donate/donate-roulette/Drops/dressDrop";
import {dress} from "../../customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../../../shared/cloth";

const dressConfigCategoryToItemId = new Map<number, number>([
    [107, 959],
    [106, 957],
    [102, 956],
    [101, 955],
    [7, 958],
    [6, 953],
    [4, 952],
    [3, 951],
    [1, 950]
]);

export class DressDrop extends DropBase {
    constructor(public readonly data: DressDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        const user = player.user;
        let dressCfgs = dress.data.filter(q => q.name === this.data.clothName);
        if (!dressCfgs) return false;

        if (dressCfgs.length > 1 && dressCfgs.some(dress => dress.male === user.is_male)) {
            dressCfgs = dressCfgs.filter(dress => dress.male === user.is_male);
        }

        const dressCfg = dressCfgs[0];
        const variationIndex = dressCfg.data.findIndex(dressComponents => dressComponents.some(component => component.name === this.data.clothComponentName));
        const variation = (variationIndex === -1) ? 0 : variationIndex;
        const advancedNumber = dressCfg.id + variation * CLOTH_VARIATION_ID_MULTIPLER;

        player.user.giveItem({
            item_id: dressConfigCategoryToItemId.get(dressCfg.category),
            serial: dressCfg.name,
            advancedNumber: advancedNumber
        }, true);

        return true;
    }
}