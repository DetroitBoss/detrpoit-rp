import {CustomEvent} from "../../custom.event";
import {
    COLLECT_CHECKPOINT_COLLECTED_EVENT,
    COLLECT_CHECKPOINT_DESTROY_EVENT,
    COLLECT_CHECKPOINT_INIT_EVENT
} from "../../../../shared/advancedQuests/config";
import {colshapeHandle} from "../../checkpoints";

let checkpoint: colshapeHandle;

CustomEvent.registerServer(COLLECT_CHECKPOINT_INIT_EVENT, (position, helpText) => {
    destroyCheckpoint();

    checkpoint = new colshapeHandle(position, helpText,
        (player) => {
            CustomEvent.triggerServer(COLLECT_CHECKPOINT_COLLECTED_EVENT);
            destroyCheckpoint();
        },
        {
            dimension: mp.players.local.dimension,
            type: 1,
            color: [255, 0, 0, 100]
        }
    )
});

CustomEvent.registerServer(COLLECT_CHECKPOINT_DESTROY_EVENT, () => {
    destroyCheckpoint();
});

function destroyCheckpoint() {
    if (checkpoint) {
        checkpoint.destroy();
    }

    checkpoint = null;
}
