import {
    HALLOWEEN_ENTER_PORTAL_EVENT,
    HALLOWEEN_EXIT_PORTAL_EVENT,
    HALLOWEEN_ISLAND_PORTAL_POSITION,
    HALLOWEEN_ISLAND_ZOMBIES_POSITIONS, HALLOWEEN_PLAYER_TO_ZOMBIES_DAMAGE, HALLOWEEN_PORTAL_POSITION,
    HALLOWEEN_PORTALS_ZOMBIES_GOAL, HALLOWEEN_ZOMBIE_KILLED_EVENT,
    HALLOWEEN_ZOMBIES_MODELS
} from "../../../../../../shared/events/halloween.config";
import {getRandomInt, randomArrayElement} from "../../../../../../shared/arrays";
import {CustomEvent} from "../../../../custom.event";
import {setInterval} from "timers";
import {createDynamicPed} from "../../../../npc";

const ZOMBIES_SPAWN_INTERVAL_S = 40;

export class ZombiesDemolitionEvent {
    private readonly _zombies: { ped: PedMp, health: number }[] = [];

    private readonly _dimension: number;
    private readonly _players: PlayerMp[];
    private readonly _zombiesPerSpawnCount: number;
    private readonly _zombiesCountGoal: number;

    private _isDestroyed: boolean = false;

    constructor(players: PlayerMp[], dimension: number) {
        this._players = players;
        this._dimension = dimension;
        this._zombiesCountGoal = players.length * Math.round(HALLOWEEN_PORTALS_ZOMBIES_GOAL * 1.35);
        this._zombiesPerSpawnCount = players.length * 12;

        this.initEvents();
        this.teleportPlayersToLand();

        setTimeout(() => this.startSpawnZombies(), 10000);
    }

    startSpawnZombies() {
        this.spawnZombies();

        const interval = setInterval(() => {
            if (this._isDestroyed || this._zombies.length >= this._zombiesCountGoal) {
                clearInterval(interval);

                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }

                    this.destroy();
                }, 5 * 60 * 1000);
                return;
            }

            this.spawnZombies();
        }, ZOMBIES_SPAWN_INTERVAL_S * 1000);
    }

    spawnZombies() {
        for (let i = 0; i < this._zombiesPerSpawnCount; i++) {
            const position = randomArrayElement(HALLOWEEN_ISLAND_ZOMBIES_POSITIONS);
            position[0] = new mp.Vector3(position[0].x, position[0].y, position[0].z + 0.2);

            const model = randomArrayElement(HALLOWEEN_ZOMBIES_MODELS);

            // @ts-ignore
            const ped = createDynamicPed(position[0], position[1], model, false, this._dimension);
            ped.setVariable('halloweenZombie', true);

            this._zombies.push({ ped, health: 100 });
        }

        console.log(`[HALLOWEEN] ${this._zombiesPerSpawnCount} zombies spawned`);
    }

    initEvents() {
        mp.events.add('playerQuit', this.removePlayer);
        mp.events.add('playerDeath', this.removePlayer);

        CustomEvent.registerClient('halloween:damageZombie', this.handlePlayerDamageZombie);
        CustomEvent.registerClient('halloween:zombieDamage', this.handleZombieDamagePlayer);
    }

    handlePlayerDamageZombie = (player: PlayerMp, pedId: number) => {
        if (player.dimension !== this._dimension) {
            return;
        }

        const damagedPed = this._zombies.find((_ped) => _ped.ped.id === pedId);
        if (!damagedPed) {
            return;
        }

        damagedPed.health -= HALLOWEEN_PLAYER_TO_ZOMBIES_DAMAGE;

        if (damagedPed.health <= 0) {
            CustomEvent.triggerClient(damagedPed.ped.controller, 'halloween:killZombie', damagedPed.ped.id);
            mp.events.call(HALLOWEEN_ZOMBIE_KILLED_EVENT, player);

            if (this._zombies.length >= this._zombiesCountGoal && this._zombies.every(zombie => zombie.health <= 0)) {
                this.destroy();
            }
        }
    }

    handleZombieDamagePlayer = (player: PlayerMp, targetId: number) => {
        if (player.dimension !== this._dimension) {
            return;
        }

        const target = this._players.find(_player => _player.id === targetId);
        if (!target || !target.user) {
            return;
        }

        if (target.user.isAdminNow(1)) {
            return;
        }

        CustomEvent.triggerClient(target, 'halloween:applyDamageByZombie');
    }

    removePlayer = (player: PlayerMp) => {
        const playerIdx = this._players.findIndex(_player => _player === player);
        if (playerIdx === -1) {
            return;
        }

        this._players.splice(playerIdx, 1);

        if (this._players.length === 0) {
            this.destroy();
        }

        if (!mp.players.exists(player)) {
            return;
        }

        CustomEvent.triggerClient(player, HALLOWEEN_EXIT_PORTAL_EVENT);

        const position = this.getTeleportPosition(HALLOWEEN_PORTAL_POSITION, 5);
        player.user.teleport(position.x, position.y, position.z, 0, 0, true);

        player.setVariable('inZombiesDemolition', false);
    }

    teleportPlayersToLand() {
        for (let player of this._players) {
            const position = this.getTeleportPosition(HALLOWEEN_ISLAND_PORTAL_POSITION, 10);
            player.user.teleport(position.x, position.y, position.z, 0, this._dimension);

            mp.events.call(HALLOWEEN_ENTER_PORTAL_EVENT, player);
            CustomEvent.triggerClient(player, HALLOWEEN_ENTER_PORTAL_EVENT);

            player.setVariable('inZombiesDemolition', true);
        }
    }

    getTeleportPosition(centerPosition: Vector3Mp, radius: number): Vector3Mp {
        const xOffset = getRandomInt(0, radius);
        const yOffset = getRandomInt(0, radius);

        return new mp.Vector3(centerPosition.x + xOffset, centerPosition.y + yOffset, centerPosition.z + 1.12);
    }

    destroy() {
        if (this._isDestroyed) {
            return;
        }

        this._isDestroyed = true;

        this._zombies.forEach(zombie => {
            if (zombie.ped && mp.peds.exists(zombie.ped)) {
                zombie.ped.destroy();
            }
        });

        for (let player of [...this._players]) {
            this.removePlayer(player);
        }

        mp.events.remove('playerQuit', this.removePlayer);
        mp.events.remove('playerDeath', this.removePlayer);

        CustomEvent.unregisterClient('halloween:damageZombie', this.handlePlayerDamageZombie);
        CustomEvent.unregisterClient('halloween:zombieDamage', this.handleZombieDamagePlayer);
    }
}