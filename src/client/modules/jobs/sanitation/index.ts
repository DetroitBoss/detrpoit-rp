import {CustomEvent} from "../../custom.event";
import {colshapes, colshapeHandle} from "../../checkpoints";
import {DUMP_POSITION} from "../../../../shared/jobs/sanitation/dump";
import './sort'
import {user} from "../../user";
import {gui} from "../../gui";
import {AttachSystem} from "../../attach";


class SyncSteps {

    private interactions: Map<number, colshapeHandle> = new Map<number, colshapeHandle>();
    private blip: BlipMp | null = null;
    public step: number = null;
    public trashBag: boolean = false;

    private getStep() {
        return this.step;
    }

    public syncStepHandler = (step: number, points: [Vector3Mp, Vector3Mp], completedPoints: [boolean, boolean]) => {
        if (this.step !== step) {
            this.deleteOldData();

            this.step = step;

            if (step !== 5) {
                completedPoints.forEach((el, key) => {
                    if (el === true) return;

                    this.interactions.set(key, colshapes.new(
                        new mp.Vector3(points[key].x, points[key].y, points[key].z - 1),
                        "Собрать мусор",
                        () => {
                            if (this.trashBag) return user.notify('Сперва уберите мусорный пакет в автомобиль', 'error');
                            gui.setGui('collectGarbage');
                            CustomEvent.triggerCef('sanitation:collectGarbage', this.step, key);
                        },
                        {
                            type: 1,
                            radius: 2,
                            color: [0, 0, 0, 255]
                        }
                    ));
                })

                this.blip = mp.blips.new(514, points[0], {
                    color: 10,
                    dimension: 0,
                    shortRange: true,
                    scale: 0.8,
                    name: "Мусорный бак"
                });

                mp.game.ui.setNewWaypoint(points[0].x, points[0].y);
            } else {
                this.interactions.set(0, colshapes.new(
                    DUMP_POSITION,
                    "Выгрузка мусора",
                    () => {
                        mp.events.callRemote("sanitation:completeStep", this.getStep(), true);
                    },
                    {
                        type: 1,
                        radius: 10,
                        color: [0, 0, 0, 255],
                    }
                ));

                this.blip = mp.blips.new(318, DUMP_POSITION, {
                    color: 31,
                    dimension: 0,
                    shortRange: true,
                    scale: 0.8,
                    name: "Свалка"
                });
            }
        } else {
            completedPoints.forEach((el, key) => {
                if (el === false) return;

                if (!this.interactions.has(key)) return;

                this.interactions.get(key).destroy();

                this.interactions.delete(key);
            })
        }
    }

    public deleteStepHandler = () => {
        if (this.step === null) return;
        this.deleteOldData();

        this.step = null;
    }

    private deleteOldData() {
        this.interactions.forEach((el, key) => {
            el.destroy();
        })

        if (this.blip && this.blip.doesExist()) this.blip.destroy();

        this.interactions = new Map<number, colshapeHandle>();
        this.blip = null;
    }
}

const syncSteps = new SyncSteps();

CustomEvent.registerServer('sanitation:syncStep', syncSteps.syncStepHandler);
CustomEvent.registerServer('sanitation:deleteStep', syncSteps.deleteStepHandler);
CustomEvent.registerServer('sanitation:deleteTrashBag', () => {
    syncSteps.trashBag = false;
    AttachSystem.removeLocal('trash_bag');
})
mp.events.add('sanitation:collectGarbage:finish', (step: number, id: number) => {
    if (step !== syncSteps.step) return;
    syncSteps.trashBag = true;
    AttachSystem.addLocal('trash_bag');
    mp.events.callRemote("sanitation:completeStep", step, id === 0);
    gui.setGui(null);
})