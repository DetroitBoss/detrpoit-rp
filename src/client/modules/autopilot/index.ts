import {CustomEvent} from "../custom.event";
import {AUTOPILOT_DRIVING_MODE, AUTOPILOT_SPEED, NATIVES} from "../../../shared/autopilot";
import {user} from "../user";

class Autopilot {

    private isActive: boolean = false;
    private player: PlayerMp = mp.players.local;
    private point: Vector3Mp | null = null;
    private interval: number | null = null;

    constructor() {
        CustomEvent.register('autopilot', () => this.clickHandle());
        CustomEvent.registerServer('autopilot:toggle', () => this.toggleHandle());
    }

    clickHandle(): void {
        if (!this.player.vehicle) return;
        CustomEvent.triggerServer('autopilot:isInstalled');
    }

    toggleHandle(): void {
        this.isActive ? this.deactivate() : this.activate();
    }

    activate(): void {
        const waypointActive = mp.game.invoke(NATIVES.IsWaypointActive),
            num = mp.game.invoke(NATIVES.GetWaypointBlipEnumId),
            firstBlipId = mp.game.invoke(NATIVES.GetFirstBlipInfoId, num),
            nextBlipId = mp.game.invoke(NATIVES.GetNextBlipInfoId, num);

        for (let a = firstBlipId; mp.game.invoke(NATIVES.DoesBlipExist, a); a = nextBlipId) {
            if (4 === mp.game.invoke(NATIVES.GetBlipInfoIdType, a) && !!waypointActive) {
                this.point = mp.game.ui.getBlipInfoIdCoord(a);
                break;
            }
        }

        if (!this.point) {
            this.point = null;
            return user.notify('Необходимо установить точку на карте для активации автопилота', 'error');
        } else {
            user.notify('Маршрут построен, начинаем движение', 'info');

            this.isActive = true;
            this.player.taskVehicleDriveToCoord(
                this.player.vehicle.handle,
                this.point.x,
                this.point.y,
                this.point.z,
                AUTOPILOT_SPEED,
                1,
                1,
                AUTOPILOT_DRIVING_MODE,
                30,
                1
            );
            this.interval = setInterval(() => {
                if (!this.isActive) {
                    clearInterval(this.interval);
                    this.isActive = false;
                    this.point = null;
                    this.player.clearTasks();
                    return;
                }
                const veh = this.player.vehicle;
                if (!veh) {
                    clearInterval(this.interval);
                    this.isActive = false;
                    this.point = null;
                    this.player.clearTasks();
                    this.player.taskVehicleTempAction(veh.handle, 27, 10000);
                    return;
                }
                if (!veh.getIsEngineRunning()) {
                    clearInterval(this.interval);
                    this.isActive = false;
                    this.point = null;
                    this.player.clearTasks();
                    this.player.taskVehicleTempAction(veh.handle, 27, 10000);
                    user.notify('Двигатель заглушён, автопилот остановлен', 'info');
                    return;
                }

                // Метод изменился, а тайпы - нет
                // @ts-ignore
                const finishPosition = mp.game.pathfind.getClosestVehicleNode(this.point.x, this.point.y, this.point.z, 1, 3.0, 0);

                if (mp.game.system.vdist(
                    veh.position.x,
                    veh.position.y,
                    veh.position.z,
                    finishPosition.x,
                    finishPosition.y,
                    finishPosition.z) < 15) {

                    clearInterval(this.interval);
                    this.isActive = false;
                    this.point = null;
                    this.player.clearTasks();
                    this.player.taskVehicleTempAction(veh.handle, 27, 10000);
                    user.notify('Вы достигли точки назначения', 'info');
                }
            }, 300);
        }
    }


    deactivate(): void {
        const veh = this.player.vehicle;

        if (!veh) return;

        this.isActive = false;
        this.point = null;
        this.player.clearTasks();
        this.player.taskVehicleTempAction(veh.handle, 27, 10000);
    }
}

new Autopilot();