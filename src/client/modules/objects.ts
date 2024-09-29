import {ENTITY_TYPES} from "./interact";

type QueueElement = { obj: ObjectMp, handler: (object: ObjectMp) => void };
const queue: QueueElement[] = [];

mp.events.add('entityStreamIn', (entity: EntityMp) => {
    if (!entity || !entity.handle || entity.type !== ENTITY_TYPES.OBJECT) {
        return;
    }

    const idx = queue.findIndex((el) => el.obj === entity);
    if (idx === -1) {
        return;
    }

    queue[idx].handler(entity as ObjectMp);
    queue.splice(idx, 1);
});

/**
 * @param model Модель
 * @param position Позиция
 * @param handler Обработчик создания объекта
 * @param options Дополнительные параметры
 */
export function onyxCreateObject(
    model: HashOrString,
    position: Vector3Mp,
    handler: (entity: EntityMp) => void,
    options?: { alpha?: number, dimension?: number, rotation?: Vector3Mp }
): ObjectMp {
    const object = mp.objects.new(model, position, options);
    object.notifyStreaming = true;

    queue.push({ obj: object, handler });

    return object;
}
