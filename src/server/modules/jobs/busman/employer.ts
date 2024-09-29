import { NpcSpawn } from "../../npc";
import { EMPLOYER_NPC , EMPLOYER_BLIP } from "../../../../shared/jobs/busman/config";
import {CustomEvent} from "../../custom.event";

export default class Employer {
    private readonly NPC: NpcSpawn;
    private readonly Blip: BlipMp;

    constructor() {
        this.NPC = new NpcSpawn(
            EMPLOYER_NPC.Position,
            EMPLOYER_NPC.Heading,
            EMPLOYER_NPC.Model,
            EMPLOYER_NPC.Name,
            this.interact,
            EMPLOYER_NPC.Range,
            EMPLOYER_NPC.Dimension
        );

        this.Blip = mp.blips.new(EMPLOYER_BLIP.Sprite, EMPLOYER_BLIP.Position, {
            color: EMPLOYER_BLIP.Color,
            shortRange: true,
            name: EMPLOYER_BLIP.Name
        });
    }

    interact(player: PlayerMp) {
        const exp: number = player.user.getJobExp('busman');
        CustomEvent.triggerClient(player, 'busman:employerOpen', exp);
    }
}