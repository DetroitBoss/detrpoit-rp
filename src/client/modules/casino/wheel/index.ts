import {Wheel} from "./wheel";
import {CustomEvent} from "../../custom.event";
import {user} from "../../user";
import {
    WHEEL_ANIM_DICT_MALE,
    WHEEL_ANIM_DICT_FEMALE,
    WHEEL_ANIMATIONS,
    WHEEL_POSITION
} from "../../../../shared/casino/wheel";
import {system} from "../../system";
import {gui} from "../../gui";


class LuckyWheel {
    wheel: Wheel
    player: PlayerMp

    constructor() {
        this.wheel = new Wheel();
        this.player = mp.players.local;

        this.loadAnimDict();

        CustomEvent.registerServer("casino:wheel:towheel", async () => {
            await this.comeToWheel();
        });

        CustomEvent.registerServer("casino:wheel:spin", (prize: number, isOwner: boolean) => {
            this.spin(prize, isOwner).then(() => {
                if (isOwner) CustomEvent.triggerServer('casino:wheel:prize', prize, this.wheel.entity.getRotation(1).y);
            });
        });

        CustomEvent.registerServer("casino:wheel:finishSpin", (rot: number) => {
            this.wheel.setFinishRot(rot);
        });
    }

    get dictionary(): string {
        return user.getSex() === "M" ? WHEEL_ANIM_DICT_MALE : WHEEL_ANIM_DICT_FEMALE;
    }

    async spin(prize: number, isOwner: boolean) {
        let spins = 320,
            maxSpeed = 2.25,
            speed = maxSpeed / (320 * 2 + (prize + this.wheel.entity.getRotation(1).y / 18) * 16 + 1);

        this.wheel.playStartSpinSound(WHEEL_POSITION);

        this.wheel.isSpinning = true;

        while (true)
        {
            if (!this.wheel.entity.doesExist()) break;
            if (this.wheel.stopNow) {
                this.wheel.stopNow = false;
                break;
            }

            if (spins <= 0)
            {
                maxSpeed -= speed;
                this.wheel.entity.setRotation(0, this.wheel.entity.getRotation(1).y - maxSpeed, 0, 2, true);
                if (maxSpeed <= 0)
                {
                    this.wheel.entity.setRotation(0, Math.round(this.wheel.entity.getRotation(1).y), 0, 2, true);
                    this.wheel.playerWinSound(WHEEL_POSITION);
                    if (isOwner)
                    {
                        this.player.taskPlayAnim(this.dictionary, WHEEL_ANIMATIONS[3], 4, -1000, -1, 1048576, 0, false, true, false);
                        while (true)
                        {
                            if (this.player.isPlayingAnim(this.dictionary, WHEEL_ANIMATIONS[3], 3) && this.player.getAnimCurrentTime(this.dictionary, WHEEL_ANIMATIONS[3]) > 0.75)
                            {
                                this.player.clearTasks();
                                break;
                            }
                            await mp.game.waitAsync(0);
                        }
                    }
                    break;
                }
            }
            else
            {
                spins--;
                this.wheel.entity.setRotation(0, this.wheel.entity.getRotation(1).y - maxSpeed, 0, 2, true);
            }

            await mp.game.waitAsync(5);
        }

        this.wheel.isSpinning = false;
    }

    loadAnimDict(isMale: boolean | null = null) {
        if (isMale !== null) {
            const dict = isMale ? WHEEL_ANIM_DICT_MALE : WHEEL_ANIM_DICT_FEMALE;
            if (!mp.game.streaming.hasAnimDictLoaded(dict))
                mp.game.streaming.requestAnimDict(dict);
        }else{
            if (!mp.game.streaming.hasAnimDictLoaded(WHEEL_ANIM_DICT_MALE))
                mp.game.streaming.requestAnimDict(WHEEL_ANIM_DICT_MALE);

            if (!mp.game.streaming.hasAnimDictLoaded(WHEEL_ANIM_DICT_FEMALE))
                mp.game.streaming.requestAnimDict(WHEEL_ANIM_DICT_FEMALE);
        }
    }

    private async comeToWheel() {
        this.loadAnimDict(user.getSex() === "M");

        if (this.player.getScriptTaskStatus(2106541073) === 1
            || this.player.getScriptTaskStatus(2106541073) === 0) return;

        const offset = mp.game.ped.getAnimInitialOffsetPosition(
            this.dictionary,
            WHEEL_ANIMATIONS[0],
            1111.052,
            229.8492,
            -50.6409,
            0,
            0,
            0,
            0,
            2
        );

        this.player.taskGoStraightToCoord(
            offset.x,
            offset.y,
            offset.z,
            1,
            8000,
            317,
            0.001
        );

        while (!(
            this.player.getScriptTaskStatus(2106541073) == 7
            ||
            this.player.isAtCoord(
                offset.x,
                offset.y,
                offset.z,
                0.1,
                0.0,
                0.0,
                false,
                true,
                0)))
        {
            await mp.game.waitAsync(0);
        }

        this.player.taskPlayAnim(
            this.dictionary,
            WHEEL_ANIMATIONS[0],
            4, -1000,
            -1,
            1048576,
            0,
            false,
            true,
            false
        );

        let isGoing: boolean;

        while (true) {
            if (this.player.isPlayingAnim(this.dictionary, WHEEL_ANIMATIONS[0], 3) && this.player.getAnimCurrentTime(this.dictionary, WHEEL_ANIMATIONS[0]) > 0.97)
            {
                this.player.taskPlayAnim(this.dictionary, WHEEL_ANIMATIONS[1], 4, -1000, -1, 1048576, 0, false, true, false);
            }
            if (this.player.isPlayingAnim(this.dictionary, WHEEL_ANIMATIONS[1], 3))
            {
                if (!isGoing && this.player.getAnimCurrentTime(this.dictionary, WHEEL_ANIMATIONS[1]) > 0.04)
                {
                    isGoing = true;
                    CustomEvent.triggerServer('casino:wheel:readyForSpin');
                }
                if (this.player.getAnimCurrentTime(this.dictionary, WHEEL_ANIMATIONS[1]) > 0.8)
                {
                    this.player.taskPlayAnim(this.dictionary, WHEEL_ANIMATIONS[2], 8.0, 1.0, -1, 1, 1.0, false, false, false);
                    break;
                }
            }
            await mp.game.waitAsync(0);
        }
    }
}

new LuckyWheel();


