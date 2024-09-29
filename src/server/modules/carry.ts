import {CARRY_LIST} from "../../shared/carry";
import {InterractionMenu} from "./interactions/InterractionMenu";
import {system} from "./system";
import {menu} from "./menu";
import {CustomEvent} from "./custom.event";
import {CARRY_PLAYER_EVENT} from "./advancedQuests/impl/MultiStepQuest/carryPlayerQuestStep";

interface CarryInfo {
    carryPlayer: PlayerMp,
    carriedPlayer: PlayerMp,
    carryCfgIdx: number
}

class CarrySystem {
    private _carryMap = new Map<number, CarryInfo>();

    carryTarget(player: PlayerMp, target: PlayerMp, carryCfgIdx: number) {
        if (this.isPlayerCarry(player) || this.isPlayerCarried(player)) {
            throw new Error(`Player already carry someone or have been carried by someone (dbid: ${player?.dbid})`);
        }

        if (this.isPlayerCarry(target) || this.isPlayerCarried(target)) {
            throw new Error(`Target player already carry someone or have been carried by someone (dbid: ${player?.dbid})`);
        }
        
        if (player.vehicle || target.vehicle) {
            return;
        }

        const carryInfo: CarryInfo = {
            carryPlayer: player,
            carriedPlayer: target,
            carryCfgIdx
        };

        this._carryMap.set(player.id, carryInfo);
        this._carryMap.set(target.id, carryInfo);

        mp.events.call(CARRY_PLAYER_EVENT, player);
        player.setVariable('carry:target', JSON.stringify({ targetId: target.id, carryCfgIdx: carryCfgIdx }));
    }

    resetCarry(player: PlayerMp) {
        const carryInfo = this._carryMap.get(player.id);
        if (!carryInfo) {
            return;
        }

        carryInfo.carryPlayer.setVariable('carry:target', undefined);

        this._carryMap.delete(carryInfo.carryPlayer.id);
        this._carryMap.delete(carryInfo.carriedPlayer.id);
    }

    isPlayerCarried(player: PlayerMp): boolean {
        const carryInfo = this._carryMap.get(player.id);
        return carryInfo && carryInfo.carriedPlayer === player;
    }

    isPlayerCarry(player: PlayerMp): boolean {
        const carryInfo = this._carryMap.get(player.id);
        return carryInfo && carryInfo.carryPlayer === player;
    }

    getCarriedTarget(player: PlayerMp): PlayerMp {
        return this._carryMap.get(player.id)?.carriedPlayer;
    }
    
    onPlayerQuit(player: PlayerMp): void {
        const carryInfo = this._carryMap.get(player.id);
        if (!carryInfo) {
            return;
        }

        this._carryMap.delete(carryInfo.carryPlayer.id);
        this._carryMap.delete(carryInfo.carriedPlayer.id);
    }
}

CustomEvent.register('player:teleport:start', (player: PlayerMp, x?:any, y?:any, z?:any, h?:any, d?:number) => {
    if (!Carry.isPlayerCarry(player)) {
        return;
    }

    const target = Carry.getCarriedTarget(player);
    if (!target || !mp.players.exists(target)) {
        Carry.resetCarry(player);
        return;
    }

    target.user.teleport(x, y, z, h, d);
});

mp.events.add('interaction:openPlayer', (
    player: PlayerMp,
    target: PlayerMp,
    interactionMenu: InterractionMenu
) => {
    if (target.user.dead) {
        return;
    }

    CARRY_LIST.forEach((cfg, idx) => {
        interactionMenu.add(cfg.name, 'Взять на руки', 'handcuffs', async () => {
            player.notify(`Вы предложили ${target.user.name} ${cfg.name}`);

            const isAccepted = await menu.accept(target, `${player.user.name} хочет вас ${cfg.name}`, 'small');
            if (!isAccepted) {
                return player.notify(`${target?.user?.name} отказался`, 'error');
            }

            if (system.distanceToPos(player.position, target.position) > 3) {
                player.notify(`${target?.user?.name} не смог принять`, 'error');
                target.notify('Вы отошли слишком далеко', 'error');
                return;
            }

            Carry.carryTarget(player, target, idx);
        });
    });
});

CustomEvent.registerClient('carry:endCarry', (player) => {
    Carry.resetCarry(player);
});

mp.events.add('playerQuit', (player) => {
    if (!player.user) {
        return;
    }

    Carry.onPlayerQuit(player);
});

mp.events.add('playerDeath', (player) => {
    if (!player.user) {
        return;
    }

    Carry.resetCarry(player);
});

export const Carry = new CarrySystem();