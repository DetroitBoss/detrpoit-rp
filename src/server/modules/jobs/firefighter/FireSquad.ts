import {
    DRESS_CONFIG_FEMALE,
    DRESS_CONFIG_MALE,
    FIRE_EXTINGUISHER_ITEM_ID,
    FIRE_EXTINGUISHER_MIXTURE_ITEM_ID,
    MIN_PLAYERS_IN_SQUAD, PAYMENT_PER_FIRESPOT
} from "./config";
import {AlertType} from "../../../../shared/alert";
import {inventory} from "../../inventory";
import {OWNER_TYPES} from "../../../../shared/inventory";
import {FireSpot} from "./firespot/FireSpot";
import {CustomEvent} from "../../custom.event";
import {JOB_TASK_MANAGER_EVENT} from "../../battlePass/tasks/jobTaskManager";

const pool = new Map<number, FireSquad>();

export class FireSquad {
    private static generatingId: number = 1;

    public readonly id: number;
    private readonly players: PlayerMp[];
    private readonly vehicle: VehicleMp;

    private _taskFireSpotId?: number;
    public get taskFireSpotId() { return this._taskFireSpotId }

    constructor(players: PlayerMp[], squadVehicle: VehicleMp) {
        this.id = FireSquad.generatingId++;

        players.forEach(player => this.startWorkForPlayer(player));
        this.players = players;

        squadVehicle.fireSquad = this.id;
        squadVehicle.fireExtinguishingMixtureCount = 0;
        this.vehicle = squadVehicle;

        pool.set(this.id, this);
    }

    public kickPlayer(player: PlayerMp) {
        const idx = this.players.findIndex(p => p === player);
        if (idx === -1) {
            return;
        }

        this.players.splice(idx, 1);
        this.endWorkForPlayer(player);

        this.notify(`${player.user.name} покинул отряд`);

        if (this.players.length < MIN_PLAYERS_IN_SQUAD) {
            this.notify('Отряд был распущен из-за недостаточного количества игроков', 'warning');
            this.disband();
        }
    }

    public notify(text: string, type?: AlertType, img?: string, time?: number) {
        this.players.forEach(player => {
            player.notify(text, type, img, time);
        });
    }

    public setExtinguishingTask(firespot: FireSpot) {
        this._taskFireSpotId = firespot.id;

        this.players.forEach(player => {
            CustomEvent.triggerClient(player, 'firefighter:setBlip', firespot.position);
        });

        this.notify('Поступило новое сообщение о возгорании. Поскорее отправляйтесь на место', 'warning');
    }

    public endExtinguishingTask(rewardPerPlayer: number) {
        this.players.forEach(player => {
            mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'firefighter')
            player.user.addBankMoney(rewardPerPlayer, true,
                `Выплата за выезд ${rewardPerPlayer}$`, 'Пожарный департамент LS.');
            CustomEvent.triggerClient(player, 'firefighter:deleteBlip');
        });

        this.notify('Вы успешно потушили пожар. Ожидайте следующего вызова');
        this._taskFireSpotId = null;
    }

    private startWorkForPlayer(player: PlayerMp) {
        player.user.fireSquad = this.id;
        player.user.setJobDress(player.user.male ? DRESS_CONFIG_MALE : DRESS_CONFIG_FEMALE);

        player.user.giveItem(FIRE_EXTINGUISHER_ITEM_ID, true, true, 1);
    }

    private endWorkForPlayer(player: PlayerMp) {
        player.user.fireSquad = null;
        player.user.setJobDress(null);

        const fireExtinguisherItem = player.user.allMyItems
            .find(i => i.item_id === FIRE_EXTINGUISHER_ITEM_ID);
        if (fireExtinguisherItem) {
            inventory.deleteItem(fireExtinguisherItem, OWNER_TYPES.PLAYER, player.user.id);
        }

        const mixtureAmount = inventory.getItemsCountById(player, FIRE_EXTINGUISHER_MIXTURE_ITEM_ID);
        inventory.deleteItemsById(player, FIRE_EXTINGUISHER_MIXTURE_ITEM_ID, mixtureAmount);

        if (this.taskFireSpotId) {
            CustomEvent.triggerClient(player, 'firefighter:deleteBlip');
        }
    }

    private disband() {
        this.vehicle.destroy();
        this.players.forEach(player => this.endWorkForPlayer(player));

        pool.delete(this.id);

        if (this._taskFireSpotId) {
            const firespot = FireSpot.get(this._taskFireSpotId);
            firespot.destroy();
        }
    }
}

mp.events.add('firesSpots:fullyExtinguished', (spot: FireSpot) => {
    const appointedSquad = [...pool.values()]
        .find(s => s.taskFireSpotId === spot.id);

    if (!appointedSquad) {
        return;
    }

    appointedSquad.endExtinguishingTask(PAYMENT_PER_FIRESPOT);
});

mp.events.add('playerQuit', (player) => {
    if (player.user?.fireSquad && pool.has(player.user.fireSquad)) {
        const squad = pool.get(player.user.fireSquad);
        squad.kickPlayer(player);
    }
});

export function getFreeSquads(): FireSquad[] {
    return [...pool.values()]
        .filter(s => !s.taskFireSpotId);
}

export function getFireSquad(id: number): FireSquad {
    return pool.get(id);
}
