import {
    NEW_YEAR_EVENT_BLIP_OPTIONS,
    NEW_YEAR_EVENT_BLIP_POSITION,
    NEW_YEAR_EVENT_BLIP_SPRITE
} from "../../../../shared/events/newYear/main.config";

export function createNewYearBlip(): BlipMp {
    return mp.blips.new(
        NEW_YEAR_EVENT_BLIP_SPRITE,
        NEW_YEAR_EVENT_BLIP_POSITION,
        NEW_YEAR_EVENT_BLIP_OPTIONS
    );
}