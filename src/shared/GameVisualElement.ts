const userUpdatedKeys : UserUpdatedKey[] = [
    'fraction',
    'houseKey',
    'admin',
    'job'
];
export type UserUpdatedKey =
    'fraction' |
    'houseKey' |
    'admin' |
    'job';

export type UpdateAction = 'enable' | 'disable' | 'none';

/**
 *
 */
export abstract class GameVisualElement {
    public readonly registeredUpdatedKeys : UserUpdatedKey[];

    protected constructor(...updatedKeys: UserUpdatedKey[]) {
        this.registeredUpdatedKeys = updatedKeys;
        pushElement(this);
    }

    public destroy(): void {
        this.handleBeforeDestroy();
    }

    private handleBeforeDestroy(): void {
        for (let updatedKey of this.registeredUpdatedKeys) {
            const array = elements.get(updatedKey).get(this.constructor.name);

            const idx = array.findIndex(e => e === this);
            if (idx !== -1) {
                array.splice(idx);
            }
        }
    }

    public abstract handleEnable(player: PlayerMp, ids: any[]): void;

    public abstract handleDisable(player: PlayerMp, ids: any[]): void;

    public abstract handleUpdate(player: PlayerMp): { id: any, action: UpdateAction };
}

const elements : Map<UserUpdatedKey, Map<string, GameVisualElement[]>>
    = new Map<UserUpdatedKey, Map<string, GameVisualElement[]>>();

for (let updatedKey of userUpdatedKeys) {
    elements.set(updatedKey, new Map<string, GameVisualElement[]>());
    const key = updatedKey;
    mp.events.add('_userUpdated_' + key, (p) => handleUserUpdated(p, key));
}

function pushElement(element: GameVisualElement) {
    const updatesKeys = element.registeredUpdatedKeys;
    for (let updateKey of updatesKeys) {
        const updateHandlersMap = elements.get(updateKey);
        if (!updateHandlersMap.has(element.constructor.name)) {
            updateHandlersMap.set(element.constructor.name, []);
        }

        updateHandlersMap.get(element.constructor.name).push(element);
    }
}

function handleUserUpdated(player: PlayerMp, key :UserUpdatedKey) {
    const mapOfClassesHandler = elements.get(key);
    for (let className of [...mapOfClassesHandler.keys()]) {
        const enableIds : any[] = [];
        const disableIds : any[] = [];

        const gameElements = mapOfClassesHandler.get(className);
        for (let element of gameElements) {
            const result = element.handleUpdate(player);
            if (result.action === 'enable') {
                enableIds.push(result.id);
            } else if (result.action === 'disable') {
                disableIds.push(result.id);
            }
        }

        const firstElement = gameElements[0];
        if (firstElement) {
            firstElement.handleEnable(player, enableIds);
            firstElement.handleDisable(player, disableIds);
        }
    }
}

export const SendUpdate = (player: PlayerMp, type: UserUpdatedKey) => {
    mp.events.call('_userUpdated_' + type, player);
}