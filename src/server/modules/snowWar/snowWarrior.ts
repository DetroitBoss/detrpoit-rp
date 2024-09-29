import {
    SNOW_WAR_DIMENSION,
    SNOW_WAR_DRESS_CONFIG_FEMALE_GREEN,
    SNOW_WAR_DRESS_CONFIG_FEMALE_RED,
    SNOW_WAR_DRESS_CONFIG_MALE_GREEN,
    SNOW_WAR_DRESS_CONFIG_MALE_RED,
    SNOW_WAR_FINISH_SPAWN, SNOW_WAR_FIRST_ZONE_POINT,
    SNOW_WAR_GREEN_COMMAND_SPAWN,
    SNOW_WAR_RED_COMMAND_SPAWN, SNOW_WAR_SECOND_ZONE_POINT,
    SNOW_WAR_WEAPON_HASH,
    SnowWarCommands
} from "../../../shared/snowWar/main.config";
import {WEAPON_SNOWBALL} from "../../../shared/events/newYear/snowballs.config";
import {SnowWarRating} from "../../../shared/snowWar/dtos";
import {CustomEvent} from "../custom.event";

export class SnowWarrior {

    public readonly staticId: number;
    private readonly _player: PlayerMp;
    private readonly _name: string;
    public command: SnowWarCommands;
    private health: number = 3;
    private kills: number = 0;

    constructor(player: PlayerMp) {
        this._player = player;
        this.staticId = player.user.id;
        this._name = this._player.user.name;
    }

    activateToggle(toggle: boolean): void {
        CustomEvent.triggerClient(this._player, 'snowwar:activate', toggle);
    }

    getName(): string {
        return this._name;
    }

    getKills(): number {
        return this.kills;
    }

    clearWeapons(): void {
        if (!mp.players.exists(this._player)) return;
        this._player.removeAllWeapons();
    }

    setCommand(index: number): void {
        this.command = !(index % 2) ? SnowWarCommands.RED : SnowWarCommands.GREEN;
    }

    applyShot(): boolean {
        if (this.health > 1) {
            this.health -= 1;
            return false;
        }

        this.health = 3;
        this.spawn();

        return true;
    }

    spawn(): void {
        const pos = this.command === SnowWarCommands.RED
            ?
            SNOW_WAR_RED_COMMAND_SPAWN
            :
            SNOW_WAR_GREEN_COMMAND_SPAWN;

        if (!mp.players.exists(this._player)) return;

        this._player.user.teleport(
            pos[0].x,
            pos[0].y,
            pos[0].z,
            pos[1],
            SNOW_WAR_DIMENSION
        );
    }

    setHudInterface(toggle: boolean): void {
        if (toggle) {
            this._player.user.setGui(null);
            CustomEvent.triggerCef(this._player, 'snowwar:hud:show', true);
        }else{
            CustomEvent.triggerCef(this._player, 'snowwar:hud:show', false);
        }

    }

    setTeamClothes(): void {
        this.command === SnowWarCommands.GREEN
            ?
            this._player.user.setJobDress(
                this._player.user.male ?
                    SNOW_WAR_DRESS_CONFIG_MALE_GREEN
                    :
                    SNOW_WAR_DRESS_CONFIG_FEMALE_GREEN
            )
            :
            this._player.user.setJobDress(
                this._player.user.male ?
                    SNOW_WAR_DRESS_CONFIG_MALE_RED
                    :
                    SNOW_WAR_DRESS_CONFIG_FEMALE_RED
            )
    }

    addKill(): void {
        this.kills += 1;
    }

    checkWeapons(): void {
        if (!mp.players.exists(this._player)) return;
        const weapon = this._player.weapon;
        if (weapon === SNOW_WAR_WEAPON_HASH) return;
        this._player.removeAllWeapons();
        this._player.user.giveWeapon(WEAPON_SNOWBALL, 9999, true);
    }

    checkZonePosition(): void {
        const pos = {...this._player.position};

        let a = SNOW_WAR_FIRST_ZONE_POINT,
            b = SNOW_WAR_SECOND_ZONE_POINT,
            tax, tay, tbx, tby;

        if(a.x > b.x) { tax = a.x; tbx = b.x; } else { tax = b.x; tbx = a.x; }
        if(a.y > b.y) { tay = a.y; tby = b.y; } else { tay = b.y; tby = a.y; }

        const inZone = (pos.x < tax && pos.x > tbx && pos.y < tay && pos.y > tby);

        if (!inZone) {
            this.spawn();
        }
    }

    updateHud(time: number, rating: SnowWarRating[]): void {
        if (!mp.players.exists(this._player)) return;

        this._player.callUnreliable('snowwar:update:hud', [
            {
                rating,
                time,
                health: this.health,
                kills: this.kills
            }
        ]);
    }

    notifyWin(isGreen: boolean): void {
        this._player.notify(`Выиграла команда ${isGreen ? "зелёных" : "красных"}`);
    }

    destroy(): void {
        this._player.user.setJobDress(null);

        this._player.user.teleport(
            SNOW_WAR_FINISH_SPAWN[0].x,
            SNOW_WAR_FINISH_SPAWN[0].y,
            SNOW_WAR_FINISH_SPAWN[0].z,
            SNOW_WAR_FINISH_SPAWN[1],
            0
        );

        this._player.removeAllWeapons();
    }
}