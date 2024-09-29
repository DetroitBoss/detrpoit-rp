import {SpecialLog} from "../typeorm/entities/specialLog";
import {system} from "../system";

export function writeSpecialLog(text: string, player: PlayerMp, target?: number) {
    if (!player.user || player.user.admin_level < 6) return;
    let v = new SpecialLog();
    v.userId = player.user.id;
    v.text = text;
    v.target = target ? target : 0;
    v.time = system.timestamp;
    v.save();
}

export function writePersonalMessage(text: string, player: PlayerMp, target: number) {
    if (!player.user || player.user.admin_level >= 6) return;

    let v = new SpecialLog();
    v.userId = player.user.id;
    v.text = text;
    v.target = target ? target : 0;
    v.time = system.timestamp;
    v.save();
}