import {CustomEvent} from "../../custom.event";
import {Vector3WithHeading} from "../../../../shared/system";
import {
    FIND_OBJECT_QUEST_STEP_COLLECT_EVENT,
    FIND_OBJECT_QUEST_STEP_DESTROY_EVENT,
    FIND_OBJECT_QUEST_STEP_INIT_EVENT
} from "../../../../shared/advancedQuests/config";
import {colshapeHandle} from "../../checkpoints";

let questItems: { obj: ObjectMp, colshape: colshapeHandle }[] = [];

CustomEvent.registerServer(FIND_OBJECT_QUEST_STEP_INIT_EVENT, (
    objectModel: string,
    positions: Vector3WithHeading[]
) => {
    for (let position of positions) {
        const object = mp.objects.new(
            objectModel,
            position[0],
            {
                alpha: 255,
                dimension: mp.players.local.dimension,
                rotation: new mp.Vector3(0, 0, position[1])
            }
        );

        const colshape = new colshapeHandle(
            position[0],
            'Подобрать предмет',
            (player) => {
                CustomEvent.triggerServer(FIND_OBJECT_QUEST_STEP_COLLECT_EVENT);
                colshape.destroy();
                object.destroy();
            },
            {
                dimension: mp.players.local.dimension,
                radius: 2,
                type: -1
            }
        )

        questItems.push({ obj: object, colshape: colshape });
    }
});

CustomEvent.registerServer(FIND_OBJECT_QUEST_STEP_DESTROY_EVENT, () => {
    for (let object of questItems) {
        if (object.obj && object.obj.handle) {
            object.obj.destroy();
        }

        if (object.colshape && object.colshape.handle) {
            object.colshape.destroy();
        }
    }

    questItems = [];
});