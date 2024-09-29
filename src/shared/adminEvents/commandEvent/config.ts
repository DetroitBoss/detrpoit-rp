export const ADMIN_LEVEL_EVENT_ACCESS: number = 4;
export const COMMAND_EVENT_DIMENSION: number = 77007;
export const COMMAND_EVENT_CHAT_COLOR: string = '#F5C542';

export interface ICommandEventState {
    name: string,
    spawnPosition: Vector3Mp,
    returnPosition: Vector3Mp,
    maxPlayers: number,
    teleportActive?: boolean,
    players?: number[],
    adminName?: string,
}