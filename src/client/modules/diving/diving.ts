import {CustomEvent} from "../custom.event";
import {gui} from "../gui";
import {DiveManager} from "./diveManager";
import {DEFAULT_CHESTS, MAP_CHESTS} from "../../../shared/diving/chests.config";
import {user} from "../user";
import {colshapes} from "../checkpoints";
import {CHEST_PROP} from "../../../shared/diving/work.config";
import {system} from "../system";

CustomEvent.registerServer('diving:debug:chests', () => {
    DEFAULT_CHESTS.map(el => {
        colshapes.new(
            new mp.Vector3(
                el.chestData.position.x,
                el.chestData.position.y,
                el.chestData.position.z - 1),
            'Взломать сундук',
            () => {},
            {
                color: [255, 0, 0, 255],
                radius: 2.5
            }
        );

        mp.objects.new(CHEST_PROP, el.chestData.position, {
            rotation: el.chestData.rotation
        })

        system.createBlip(
            351,
            6,
            el.chestData.position,
            "debug chest",
            0,
            true
        )
    });
})

export class Diving {
    private isWorking: boolean = false;
    private diveManager: DiveManager | null;
    private interval: number;

    constructor() {
        mp.events.add('diving:switcher', () => this.switcherHandle());

        CustomEvent.registerServer('diving:openEmployer', () => {
            gui.setGui('divingEmployer');
            CustomEvent.triggerCef('divingEmployer:setIsWorking', this.isWorking);
        })

        CustomEvent.registerServer('diving:createMission', () => this.createMissionHandle());

        CustomEvent.registerServer('diving:useMap', (item_id: number) => {
            if (!this.isWorking) return user.notify('Необходимо устроиться на работу дайвера', 'error');
            if (this.diveManager) return user.notify('У вас уже взята работа, выполните её, и повторите снова', 'error');

            this.diveManager = new DiveManager(MAP_CHESTS[Math.floor(Math.random() * MAP_CHESTS.length)]);
            CustomEvent.triggerServer('diving:deleteMapItem', item_id);
        });

        mp.events.add('diving:clearDiveManager', () => {
            this.diveManager = undefined;
        });

        mp.events.add('diving:unfreeze', () => {
            mp.players.local.freezePosition(false);
        });

        mp.events.add('diving:startDive', () => {
            if (this.diveManager) this.diveManager.dive();
        });
        mp.events.add('diving:chestGame:finish', (success) => {
            if (this.diveManager) this.diveManager.chestGameFinishHandle(success);
        });
        mp.events.add('diving:collectGame:finish', () => {
            if (this.diveManager) this.diveManager.collectGameFinishHandle();
        });
    }

    private switcherHandle() {
        this.isWorking ? this.onFinish() : this.onStart();
    }

    private onStart() {
        user.notify('Вы устроились на работу дайвера', 'info');
        this.isWorking = true;
        CustomEvent.triggerServer('diving:canCreateChest');
        this.interval = setInterval(() => {
            if (!this.diveManager) CustomEvent.triggerServer('diving:canCreateChest');
        }, 60000);
    }

    private onFinish() {
        user.notify('Вы уволились с работы дайвера', 'info');
        clearInterval(this.interval);
        try {
            if (this.diveManager) this.diveManager.destroy();
            clearInterval(this.diveManager._interval);
            this.diveManager = undefined;
        }
        catch (e) {
            CustomEvent.triggerServer('srv:log', e);
        }
        this.isWorking = false;
    }

    private createMissionHandle() {
        if (!this.isWorking) return;
        if (this.diveManager) return;

        this.diveManager = new DiveManager(DEFAULT_CHESTS[Math.floor(Math.random() * DEFAULT_CHESTS.length)]);
    }
}