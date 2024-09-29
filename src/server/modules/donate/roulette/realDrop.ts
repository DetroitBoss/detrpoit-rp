import {RealDropData} from "../../../../shared/donate/donate-roulette/Drops/realDrop";
import {DropBase} from "./dropBase";

export class RealDrop extends DropBase {
    constructor(public readonly data: RealDropData) {
        super(data.dropId);
    }
    
    protected onDropActivated(player: PlayerMp): boolean {
        player.notify('Вы активировали реальный приз! Обратитесь к администрации для выдачи')
        return true;
    };
}