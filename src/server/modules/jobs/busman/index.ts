import Employer from './employer';
import {CustomEvent} from "../../custom.event";
import {
    DRESS_CONFIG_FEMALE,
    DRESS_CONFIG_MALE,
    BUS_LEVELS,
    VEHICLE_SPAWNS,
    WORK_VEHICLE
} from "../../../../shared/jobs/busman/config";
import {Vehicle} from '../../vehicles';
import {User} from "../../user";
import {LEAVE_JOB_PLAYER_EVENT} from "../../advancedQuests/impl/MultiStepQuest/leaveFromJobQuestStep";
import { system } from '../../system';

import {JOB_TASK_MANAGER_EVENT} from "../../battlePass/tasks/jobTaskManager";

new Employer();

const coolDown = new Map<number, number>();

function CreateWorkVehicle(player: PlayerMp, type: number) {
    const spawnParams = VEHICLE_SPAWNS[Math.floor(Math.random() * VEHICLE_SPAWNS.length)];
    const vehicle = Vehicle.spawn(BUS_LEVELS[type].vehicleModel, spawnParams.Position, spawnParams.Heading, 0, false, false);
    vehicle.setVariable('busman', player.user.id);
    vehicle.setColorRGB(WORK_VEHICLE.color[0], WORK_VEHICLE.color[1], WORK_VEHICLE.color[2], WORK_VEHICLE.color[3], WORK_VEHICLE.color[4], WORK_VEHICLE.color[5]);
    player.busmanWorkVehicle = vehicle.id;
    vehicle.numberPlate = "BUS";
    return vehicle;
}

CustomEvent.registerCef('busman:startWork', (player, type: number) => {
    if (!player.user.haveActiveLicense("truck")) return player.notify("У вас отсутствует действующая лицензия на грузовой транспорт");

    player.user.setJobDress(player.user.male ? DRESS_CONFIG_MALE : DRESS_CONFIG_FEMALE);

    const veh = CreateWorkVehicle(player, type);

    CustomEvent.triggerClient(player, 'busman:startWork', type, veh.id, veh.position);
});

CustomEvent.registerClient('busman:finishWork', (player: PlayerMp) => {
    player.user.setJobDress(null);
    mp.events.call(LEAVE_JOB_PLAYER_EVENT, player, 'busman');
    if (!player.busmanWorkVehicle || !mp.vehicles.at(player.busmanWorkVehicle)) return;
    const veh = mp.vehicles.at(player.busmanWorkVehicle);
    veh.destroy();
});

CustomEvent.registerClient('busman:addEXP', (player) => {
    player.user.addJobExp('busman');
});

CustomEvent.registerClient('busman:salary', (player, index) => {

    if (coolDown.get(player.user.id) && coolDown.get(player.user.id) >= system.timestamp) return;
    coolDown.set(player.user.id, system.timestamp + 12);

    let amount = 0;

    if (index === 0) {
        amount = 195
    } else if (index === 1) {
        amount = 220
    } else if (index === 2) {
        amount = 270
    } else if (index === 3) {
        amount = 350
    } else if (index === 4) {
        amount = 500
    }

    player.user.addMoney(amount, false, "Заработал за остановку на автобуснике");
    mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'bus');
});

mp.events.add('playerQuit', (player) => {
    if (!player.busmanWorkVehicle || !mp.vehicles.at(player.busmanWorkVehicle)) return;
    const veh = mp.vehicles.at(player.busmanWorkVehicle);
    veh.destroy();
})

mp.events.add('vehicleDeath', (vehicle) => {
    const id = vehicle.getVariable('busman');
    if (!id) return;
    let player = User.get(id);
    vehicle.destroy();

    if (!player) return;
    player.user.setJobDress(null);
    CustomEvent.triggerClient(player, 'busman:finishWork');
    player.notify('Ваш транспорт был уничтожен - рабочий день окончен!');
})


