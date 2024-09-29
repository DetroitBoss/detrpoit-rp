
import {UserAddonClass} from "./master";
import {User} from "../user";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {MINIGAME_TYPE} from "../../../shared/minigame";
import {playAnimationWithResult} from "../../../client/modules/anim";
import {PURCHASEABLE_ANIMS} from "../../../shared/anim";

CustomEvent.registerCef('anim:getPurchased', player => {
    return player.user?.entity.purchasedAnims as number []
})

CustomEvent.registerClient('anim:stop', (player) => {
    UserAnimation.stopAnimation(player);
})

CustomEvent.registerCef('anim:changeWalkingStyle', (player, styleIndex: number) => {
    if (!player.user) {
        return;
    }

    player.user.entity.walkingStyle = styleIndex;
    player.setVariable('walkingStyle', styleIndex);
});

export class UserAnimation extends UserAddonClass {
    private playAnimationWithResultNow = false

    public get isAnyAnimationWithResultNow() {
        return this.playAnimationWithResultNow;
    }

    public static stopAnimation = (player: PlayerMp) => {
        const user = player.user;
        if (!user) return;
        User.getNearestPlayers(player, mp.config["stream-distance"]).map(target => {
            CustomEvent.triggerClient(target, 'anim:stop', player.id)
        })
    }

    playSyncAnimation = (target: PlayerMp, myAnim: [string, string], targetAnim: [string, string], distance = 0.5) => {
        if (!this.exists) return;
        if (!mp.players.exists(target)) return;
        if (!target.user) return;
        if (target.vehicle) return;
        if (this.player.vehicle) return;
        if(target.getVariable('casino:freeze')) return;
        if(this.player.getVariable('casino:freeze')) return;
        const [pos1, pos2] = system.drawPoint(this.player.position, target.position, distance)

        this.goToCoord(pos1)
        target.user.goToCoord(pos2)

        setTimeout(() => {
            if (!this.exists) return;
            if (!mp.players.exists(target)) return;
            this.turnToFace(target)
            target.user.turnToFace(this.player)
            this.playAnimation([myAnim], false, false);
            target.user.playAnimation([targetAnim], false, false);
        }, 800)
    }

    goToCoord = (pos: { x: number, y: number, z: number }, heading?: number, slide?: number) => {
        if (!this.exists) return;
        CustomEvent.triggerClient(this.player, 'goToCoord', pos.x, pos.y, pos.z, heading, slide)
    }

    turnToFace = (target: PlayerMp, duration = 1) => {
        if (!mp.players.exists(target)) return;
        CustomEvent.triggerClient(this.player, "turnToFace", target.id, duration)
    }
    playAnimationWithResult = (task: string | [string, string, boolean?], seconds: number, text: string, heading?: number, minigame?: MINIGAME_TYPE): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            if (!this.exists) return resolve(false);
            if(this.playAnimationWithResultNow) return resolve(false);
            this.playAnimationWithResultNow = true
            let resget = false;
            CustomEvent.callClient(this.player, 'playAnimationWithResult', task, seconds, text, heading, minigame).then(status => {
                if (this.exists) this.playAnimationWithResultNow = false
                if(!resget) {
                    resget = true;
                    resolve(status)
                }
            })
            setTimeout(() => {
                if(!resget) {
                    resget = true;
                    resolve(false)
                }
            }, (seconds + (minigame ? 50 : 10)) * 1000)
        })
    }

    waitTimer = (distance: number, seconds: number, text: string, anim?: [string, string, boolean?], trackEntity?: EntityMp): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            if (!this.exists) return resolve(false);
            if(this.playAnimationWithResultNow) return resolve(false);
            this.playAnimationWithResultNow = true
            let resget = false;
            CustomEvent.callClient(this.player, 'waitTimer', distance, seconds, text, anim, trackEntity ? [trackEntity.type, trackEntity.id] : null).then(status => {
                if (this.exists) this.playAnimationWithResultNow = false
                if(!resget) {
                    resget = true;
                    resolve(status)
                }
            })
            setTimeout(() => {
                if(!resget) {
                    resget = true;
                    resolve(false)
                }
            }, (seconds + 10) * 1000)
        })
    }

    playAnimation = (seq: [string, string, number?][], upper?: boolean, lopping?: boolean) => {
        if (!this.exists) return;
        CustomEvent.triggerClient(this.player, 'playAnim', this.player.id, seq, upper, lopping);
        if (upper) {
            this.getNearestPlayers(50).map(target => {
                CustomEvent.triggerClient(target, 'playAnim', this.player.id, seq, upper, lopping);
            })
        }
    }

    playScenario = (name: string, x?: number, y?: number, z?: number, h?: number, teleport?: boolean) => {
        if (!this.exists) return;
        CustomEvent.triggerClient(this.player, 'playScenario', name, x, y, z, h, teleport);
    }

    havePurchaseableAnimation = (animId: number): boolean =>
        this.entity.purchasedAnims.includes(animId)

    /** Выдать платную анимацию */
    givePurchaseableAnimation = async (animId: number) => {
        if (!this.exists) return;
        if (this.entity.purchasedAnims.includes(animId)) return
        this.entity.purchasedAnims = [...this.entity.purchasedAnims, animId]
        await this.entity.save()
    }
    /** Забрать платную анимацию */
    takePurchaseableAnimation = async (animId: number) => {
        if (!this.exists) return;
        const clone = [...this.entity.purchasedAnims]
        const idx = clone.findIndex(id => id == animId)
        if (idx < 0) return
        clone.splice(idx, 1)
        this.entity.purchasedAnims = clone
        await this.entity.save()
    }

    /** Выдать все доступные платные анимации */
    giveAllPurchaseableAnimations = async () => {
        if (!this.exists) return;
        console.log('give anims')
        this.entity.purchasedAnims = PURCHASEABLE_ANIMS.map(a => a.id)
        await this.entity.save()
    }
    constructor(user: User) {
        super(user);
    }
}
