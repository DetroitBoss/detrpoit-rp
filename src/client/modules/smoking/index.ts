import {CustomEvent} from "../custom.event";
import {playAnimationWithResult} from "../anim";
import {system} from "../system";
import {
    ISmokingEffect,
    SMOKE_ASSET_NAME,
    SMOKE_EFFECT_NAME, SMOKE_EFFECT_SCALE, SMOKE_EFFECT_TIME_MS, SMOKE_VAPE_ANIM_DICT, SMOKE_VAPE_ANIM_NAME,
    SMOKING_SCREEN_EFFECTS
} from "../../../shared/smoking/effect";
import {AttachSystem} from "../attach";

class Smoking {
    vapeInHand: boolean = false;
    isUsing: boolean = false;

    effect: ISmokingEffect = {
        count: 0,
        last: 0
    }

    effectTime: number = null;
    effectInterval: number = null;
    smokes: Map<number, number> = new Map<number, number>();

    constructor() {
        CustomEvent.registerServer('smoking:vapeInHandToggle', this.setVapeInHand);
        CustomEvent.registerServer('smoking:useVape', this.useVapeHandle);
        CustomEvent.registerServer('smoking:addSmoke', this.addSmokeHandle)
        CustomEvent.registerServer('smoking:useHookah', this.useHookahHandler);
        CustomEvent.registerServer('smoking:useBong', this.useBongHandler);

        mp.keys.bind(17, false, () => {
            if (this.isUsing) return;
            if (this.vapeInHand) this.startUseVape()
        })
    }

    useBongHandler = () => {
        this.isUsing = true;

        this.sendSmoke();
        AttachSystem.addLocal("bong");

        playAnimationWithResult(
            ["anim@safehouse@bong", "bong_stage4"],
            5,
            'Затягиваемся'
        ).then(res => {
            AttachSystem.removeLocal("bong");
            this.isUsing = false;
            if (!res) return;
            this.useEffect();
        });
    }

    useHookahHandler = () => {

        this.sendSmoke();

        playAnimationWithResult(
            [SMOKE_VAPE_ANIM_DICT, SMOKE_VAPE_ANIM_NAME],
            5,
            'Затягиваемся'
        ).then(res => {
            if (!res) return;
            this.useEffect();
        });
    }

    setVapeInHand = (toggle: boolean) => {
        this.vapeInHand = toggle;
        if (toggle )
        {
            AttachSystem.addLocal('vape')
        }
        else 
        {
            AttachSystem.removeLocal('vape')
        }
    }

    addSmokeHandle = (pos: Vector3Mp) => {
        if (!mp.game.streaming.hasNamedPtfxAssetLoaded(SMOKE_ASSET_NAME)) {
            mp.game.streaming.requestNamedPtfxAsset(SMOKE_ASSET_NAME);
        }

        mp.game.graphics.setPtfxAssetNextCall(SMOKE_ASSET_NAME);

        const key = system.timestampMS;

        this.smokes.set(key, mp.game.graphics.startParticleFxLoopedAtCoord(
            SMOKE_EFFECT_NAME, pos.x, pos.y, pos.z, 0, 0, 0,
            SMOKE_EFFECT_SCALE, false, false, false, true
        ));

        setTimeout(() => {
            const handle = this.smokes.get(key);
            if (handle === undefined) return;
            mp.game.graphics.stopParticleFxLooped(handle, true);
            this.smokes.delete(key);
        }, SMOKE_EFFECT_TIME_MS);
    }

    startUseVape = () => {
        CustomEvent.triggerServer('smoking:startUseVape');
    }

    useVapeHandle = () => {
        this.isUsing = true;
        this.sendSmoke();
        playAnimationWithResult(
            [SMOKE_VAPE_ANIM_DICT, SMOKE_VAPE_ANIM_NAME],
            5,
            'Затягиваемся'
        ).then(res => {
            this.isUsing = false;
            if (!res) return;
            this.useEffect();
        });
    }

    startEffect() {
        if (this.effectTime === null) {
            this.effectTime = system.timestamp + 20;

            const effect: string = SMOKING_SCREEN_EFFECTS[Math.floor(SMOKING_SCREEN_EFFECTS.length * Math.random())];
            mp.game.graphics.startScreenEffect(effect, 0x800, true);

            this.effectInterval = setInterval(() => {
                if (system.timestamp >= this.effectTime) {
                    clearInterval(this.effectInterval);
                    this.effectTime = null;
                    mp.game.graphics.stopScreenEffect(effect);
                }
            }, 500)
        }else{
            this.effectTime += 10;
        }
    }

    useEffect() {
        if (system.timestamp - this.effect.last < 30) {
            if (this.effect.count >= 3) {
                this.startEffect()
                this.effect = {
                    last: system.timestamp,
                    count: 1
                }
            }else{
                this.effect.count += 1;
                this.effect.last = system.timestamp;
            }
        }else{
            this.effect = {
                last: system.timestamp,
                count: 1
            }
        }
    }

    sendSmoke() {
        let pos = mp.players.local.getBoneCoords(12844, 0, 0, 0)
            /*
            forward = mp.players.local.getForwardVector();

        pos.x += forward.x * 0.3;
        pos.y += forward.x * 0.3;

             */

        CustomEvent.triggerServer('smoking:sendSmoke', pos);
    }
}

new Smoking();