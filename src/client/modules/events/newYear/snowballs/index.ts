import {CustomEvent} from "../../../custom.event";
import {user} from "../../../user";
import {
    SNOWBALL_ANIMATION,
    WEAPON_SNOWBALL_HASH
} from "../../../../../shared/events/newYear/snowballs.config";

export class Snowballs {

    inHand: boolean = false;
    player = mp.players.local;
    weapon: number = 2725352035;

    constructor() {
        CustomEvent.register('snowball', () => this.createHandle());

        CustomEvent.registerServer('snowballs:weaponChange',
            (oldWeapon: number, newWeapon: number) => this.weaponChangeHandle(oldWeapon, newWeapon));
        mp.events.add('playerWeaponShot', () => this.weaponShotHandle());
    }

    weaponShotHandle() {
        if (this.inHand) {
            this.inHand = false;
            CustomEvent.triggerServer('snowballs:reset');
            this.weapon = 2725352035;
        }
    }

    async createHandle() {
        if (this.inHand) return user.notify('У вас уже есть снежок', 'error');
        if (this.player.vehicle) return user.notify('Выйдите из машины, чтобы слепить снежок', 'error');
        if (mp.raycasting.testPointToPoint(this.player.position,
            new mp.Vector3(
                this.player.position.x,
                this.player.position.y,
                797), null, 1))
            return user.notify('Чтобы слепить снежок, необходимо находиться под открытым небом', 'error');

        if (this.weapon !== 2725352035)
            return user.notify('Уберите оружие из рук, чтобы слепить снежок', 'error');

        user.playAnim([[SNOWBALL_ANIMATION.dictionary, SNOWBALL_ANIMATION.name]], false, false);

        while (true) {
            if (this.player.isPlayingAnim(SNOWBALL_ANIMATION.dictionary, SNOWBALL_ANIMATION.name, 3) &&
                this.player.getAnimCurrentTime(SNOWBALL_ANIMATION.dictionary, SNOWBALL_ANIMATION.name) > 0.75) {
                CustomEvent.triggerServer('snowballs:give');
                this.inHand = true;
                break;
            }

            await mp.game.waitAsync(0)
        }
    }

    weaponChangeHandle(oldWeapon: number, newWeapon: number): void {
        this.weapon = newWeapon;
        if (oldWeapon === WEAPON_SNOWBALL_HASH && this.inHand) this.inHand = false;
    }
}