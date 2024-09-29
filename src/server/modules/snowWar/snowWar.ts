import {
    SNOW_WAR_BATTLE_TIME,
    SNOW_WAR_MAX_PLAYERS,
    SNOW_WAR_MIN_PLAYERS,
    SNOW_WAR_REGISTRATION_NAME,
    SNOW_WAR_REGISTRATION_OPTIONS,
    SNOW_WAR_REGISTRATION_POSITION,
    SNOW_WAR_REGISTRATION_TIME, SNOW_WAR_WEAPON_HASH,
    SnowWarCommands,
    SnowWarSteps
} from '../../../shared/snowWar/main.config';
import {CustomEvent} from "../custom.event";
import {colshapeHandle, colshapes} from "../checkpoints";
import {SnowWarrior} from "./snowWarrior";
import {SnowWarRating} from "../../../shared/snowWar/dtos";

export class SnowWar {

    private battleStarted: boolean = false;
    private players: SnowWarrior[] = [];
    private interval: number;
    private openedInterfacePlayers: PlayerMp[] = [];
    private registrationInteraction: colshapeHandle;
    private maxPlayers: number = SNOW_WAR_MAX_PLAYERS;
    private timer: number = SNOW_WAR_REGISTRATION_TIME;
    private step: number = SnowWarSteps.REGISTRATION;

    constructor() {
        this.registrationInteraction = this.createRegistrationInteraction();

        this.interval = setInterval(() => this.intervalHandle(), 1000);

        CustomEvent.registerCef('snowwar:registerPlayer',
            (player) => this.registerPlayer(player));

        CustomEvent.registerCef('snowwar:unregisterPlayer',
            (player) => this.unregisterPlayer(player));

        CustomEvent.registerCef('snowwar:registrationClose',
            (player) => this.closeRegistrationHandle(player));

        CustomEvent.registerClient('snowwar:outgoingDamage',
            (player, targetId: number) => this.registerShotHandle(player, targetId));

        mp.events.add('playerQuit',
            (player) => this.onPlayerDisconnectHandle(player));
    }

    private intervalHandle(): void {
        this.updateRegistrationInterfaces();

        this.stepManager();

        if (this.battleStarted) this.actionsInBattle();
    }

    private stepManager(): void {
        if (this.timer > 0) {
            this.timer -= 1;
        } else {
            if (this.step === SnowWarSteps.REGISTRATION) {
                this.startBattle();
            } else if (this.step === SnowWarSteps.BATTLE) {
                this.startRegistration();
            }
        }
    }

    private startBattle(): void {
        if (this.players.length < SNOW_WAR_MIN_PLAYERS) {
            this.timer = SNOW_WAR_REGISTRATION_TIME;
            this.step = SnowWarSteps.REGISTRATION;
            return;
        }
        this.step = SnowWarSteps.BATTLE;
        this.timer = SNOW_WAR_BATTLE_TIME;

        this.battleStarted = true;

        this.players.forEach((el, i) => {
            el.activateToggle(true);
            el.setCommand(i);
            el.setTeamClothes();
            el.spawn();
            el.setHudInterface(true);
            el.checkWeapons();
        });
    }

    private startRegistration(): void {
        this.battleStarted = false;

        this.step = SnowWarSteps.REGISTRATION;
        this.timer = SNOW_WAR_REGISTRATION_TIME;

        let redTeamKills = 0,
            greenTeamKills = 0;

        this.players.map(el => {
            el.command === SnowWarCommands.GREEN ?
                greenTeamKills += el.getKills()
                :
                redTeamKills += el.getKills();
        });

        this.players.forEach((el) => {
            el.activateToggle(false);
            el.clearWeapons();
            el.notifyWin(greenTeamKills > redTeamKills);
            el.destroy();
            el.setHudInterface(false);
        });

        this.players = [];
    }

    private actionsInBattle() {
        const sortedPlayersInBattleByKills = this.players.sort((a, b) => {
                if (a.getKills() < b.getKills()) {
                    return 1;
                }
                if (a.getKills() > b.getKills()) {
                    return -1;
                }
                return 0;
            }),
            rating: SnowWarRating[] = [];

        sortedPlayersInBattleByKills.forEach((el, i) => {
            if (i > 2) return;

            rating.push({
                name: el.getName(),
                kills: el.getKills()
            });
        });

        this.players.forEach((el) => {
            el.checkWeapons();
            el.checkZonePosition();
            el.updateHud(this.timer, rating)
        });
    }

    private updateRegistrationInterfaces(): void {
        this.openedInterfacePlayers.map((player, i) => {
            this.updateRegistrationInterface(player, i);
        });
    }

    private updateRegistrationInterface(player: PlayerMp, index: number): void {
        if (!mp.players.exists(player)) {
            this.openedInterfacePlayers.splice(index, 1);
            return;
        }

        player.callUnreliable('snowwar:update:registration', [
            {
                battleInProgress: this.battleStarted,
                playersQueueLength: this.players.length,
                timer: this.timer
            }
        ]);
    }

    private createRegistrationInteraction(): colshapeHandle {
        return colshapes.new(
            SNOW_WAR_REGISTRATION_POSITION,
            SNOW_WAR_REGISTRATION_NAME,
            (player) => this.openRegistrationHandle(player),
            SNOW_WAR_REGISTRATION_OPTIONS
        );
    }

    private alreadyExistInOpenedInterfacePlayers(staticId: number): boolean {
        return this.openedInterfacePlayers.filter(p => p.user?.id === staticId).length !== 0;
    }

    private getPlayerSnowWarrior(player: PlayerMp): SnowWarrior | null {
        const arr = this.players.filter(snowWarrior => snowWarrior.staticId === player.user.id);

        if (arr.length === 0) return null;

        return arr[0];
    }

    private openRegistrationHandle(player: PlayerMp): void {
        player.user.setGui(
            'snowWar',
            'snowwar:registration:setJoined',
            this.getPlayerSnowWarrior(player) !== null
        );
        this.updateRegistrationInterface(player, this.openedInterfacePlayers.indexOf(player));

        if (!this.alreadyExistInOpenedInterfacePlayers(player.user.id))
            this.openedInterfacePlayers.push(player);
    }

    private closeRegistrationHandle(player: PlayerMp): void {
        const index = this.openedInterfacePlayers.indexOf(player);
        if (index === -1) return;
        this.openedInterfacePlayers.splice(index, 1);
    }

    private registerPlayer(player: PlayerMp): void {
        if (this.battleStarted) return player.user.notify('Битва уже началась', 'error');
        if (this.players.length >= this.maxPlayers)
            return player.notify('Все места заняты', 'error');
        if (this.getPlayerSnowWarrior(player) !== null) return;

        this.players.push(new SnowWarrior(player));

        this.updateRegistrationInterface(player, this.openedInterfacePlayers.indexOf(player));

        CustomEvent.triggerCef(
            player,
            'snowwar:registration:setJoined',
            this.getPlayerSnowWarrior(player) !== null
        );
    }

    private unregisterPlayer(player: PlayerMp): void {
        const warrior = this.getPlayerSnowWarrior(player),
            index = this.players.indexOf(warrior);
        if (warrior === null || index === -1) return;

        this.players.splice(index, 1);

        this.updateRegistrationInterface(player, this.openedInterfacePlayers.indexOf(player));
        CustomEvent.triggerCef(
            player,
            'snowwar:registration:setJoined',
            this.getPlayerSnowWarrior(player) !== null
        );
    }

    private registerShotHandle(player: PlayerMp, targetId: number) {
        if (!this.battleStarted) return;
        if (player.weapon !== SNOW_WAR_WEAPON_HASH) return;

        const target = mp.players.at(targetId);

        if (!mp.players.exists(target) && !target.user) return;

        const snowWarriorTarget = this.getPlayerSnowWarrior(target),
            snowWarriorPlayer = this.getPlayerSnowWarrior(player);

        if (snowWarriorPlayer === null || snowWarriorTarget === null) return;

        const isKill: boolean = snowWarriorTarget.applyShot();

        if (isKill) snowWarriorPlayer.addKill();
    }

    private onPlayerDisconnectHandle(player: PlayerMp) {
        const snowWarrior = this.getPlayerSnowWarrior(player),
            index = this.players.indexOf(snowWarrior);

        if (index === -1) return;

        this.players.splice(index, 1);
    }
}


