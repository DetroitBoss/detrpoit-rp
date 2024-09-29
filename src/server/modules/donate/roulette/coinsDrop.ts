import {DropBase} from "./dropBase";
import {CoinsDropData} from "../../../../shared/donate/donate-roulette/Drops/coinsDrop";

export class CoinsDrop extends DropBase {
    private readonly _data: CoinsDropData;

    get data() {
        return this._data;
    }

    constructor(data: CoinsDropData) {
        super(data.dropId);
        this._data = data;
    }

    protected onDropActivated(player: PlayerMp): boolean {
        player.user.addDonateMoney(this._data.count, 'coinsFromRoulette')
        return true
    };
}