import {
    DRESS_CONFIG_FEMALE,
    DRESS_CONFIG_MALE,
    EMPLOYER_BLIP,
    EMPLOYER_NPC,
    VEHICLE_SPAWN_POSITIONS,
    WORK_TYPE,
    WORK_VEHICLE_MODEL
} from "../../../../shared/jobs/electrician/config";
import {NpcSpawn} from "../../npc";
import {CustomEvent} from "../../custom.event";
import {Vehicle} from "../../vehicles";
import {User} from "../../user";
import {JOB_PLAYER_EVENT} from "../../advancedQuests/impl/MultiStepQuest/jobQuestStep";
import {system} from "../../system";
import {writeSpecialLog} from "../../specialLogs";
import {JOB_TASK_MANAGER_EVENT} from "../../battlePass/tasks/jobTaskManager";

export default class Job {
    private readonly NPC: NpcSpawn;
    private readonly Blip: BlipMp;

    constructor() {
        this.NPC = new NpcSpawn(
            EMPLOYER_NPC.Position,
            EMPLOYER_NPC.Heading,
            EMPLOYER_NPC.Model,
            EMPLOYER_NPC.Name,
            Job.interact,
            EMPLOYER_NPC.Range,
            EMPLOYER_NPC.Dimension
        );

        this.Blip = mp.blips.new(EMPLOYER_BLIP.Sprite, EMPLOYER_BLIP.Position, {
            color: EMPLOYER_BLIP.Color,
            shortRange: true,
            name: EMPLOYER_BLIP.Name
        });
    }

    private static interact(player: PlayerMp): void {
        const exp: number = player.user.getJobExp('electrician');
        CustomEvent.triggerClient(player, 'electrician:openEmployer', exp);
    }

    public static CreateWorkVehicle(player: PlayerMp): VehicleMp {
        const spawnParams = VEHICLE_SPAWN_POSITIONS[Math.floor(Math.random()*VEHICLE_SPAWN_POSITIONS.length)]
        const vehicle = Vehicle.spawn(WORK_VEHICLE_MODEL, spawnParams.Position, spawnParams.Heading, 0, false, false);
        vehicle.setVariable('electrician', player.user.id);
        vehicle.setColorRGB(0, 0, 0, 0, 0, 0);
        vehicle.numberPlate = "ELECTRIC";
        player.electricianWorkVehicle = vehicle.id;

        return vehicle;
    }
}

const coolDown = new Map<number, number>();

mp.events.add('playerQuit', (player) => {
    if (!player.electricianWorkVehicle || !mp.vehicles.at(player.electricianWorkVehicle)) return;
    const veh = mp.vehicles.at(player.electricianWorkVehicle);
    veh.destroy();
})

mp.events.add('vehicleDeath', (vehicle) => {
    const id = vehicle.getVariable('electrician');
    if (!id) return;
    let player = User.get(id);
    vehicle.destroy();

    if (!player) return;
    player.user.setJobDress(null);
    CustomEvent.triggerClient(player, 'electrician:finish');
    player.notify('Ваш транспорт был уничтожен - рабочий день окончен!');
})

function getSalaryCode(type: WORK_TYPE): string {
    if (type === WORK_TYPE.station) {
        return `7010`;
    }
    else if (type === WORK_TYPE.large) {
        return `7020`;
    }
    else if (type === WORK_TYPE.houses) {
        return `7030`;
    }
}

CustomEvent.registerCef('electrician:check', (player: PlayerMp, type: WORK_TYPE) => {
    let veh: null | VehicleMp;
    if (type === WORK_TYPE.houses || type === WORK_TYPE.large){
        if (!player.user.haveActiveLicense("car")) return player.notify("У вас отсутствует действующая лицензия");
        veh = Job.CreateWorkVehicle(player);
    }

    if (!veh) {
        CustomEvent.triggerClient(player, 'electrician:start', type, getSalaryCode(type));
    }else{
        CustomEvent.triggerClient(player, 'electrician:start', type, getSalaryCode(type), veh.id, veh.position);
    }

    player.user.setJobDress(player.user.male ? DRESS_CONFIG_MALE : DRESS_CONFIG_FEMALE);
});

CustomEvent.registerClient('electrician:finishWork', (player) => {
    player.user.setJobDress(null);
    if (!player.electricianWorkVehicle || !mp.vehicles.at(player.electricianWorkVehicle)) return;
    const veh = mp.vehicles.at(player.electricianWorkVehicle);
    veh.destroy();
});

CustomEvent.registerClient('electrician:addExp', (player) => {
    player.user.addJobExp('electrician');
});

CustomEvent.registerClient('electrician:damage', (player) => {
   player.user.health -= 10;
});

CustomEvent.registerClient('electrician:payment', (player, index: string) => {
    if (coolDown.get(player.user.id) && coolDown.get(player.user.id) >= system.timestamp) return;
    coolDown.set(player.user.id, system.timestamp + 12);

    mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'electric');
    mp.events.call(JOB_PLAYER_EVENT, player, 'electrician');
    let amount = 0;
    if (index === `7010`) {
        amount = 50;
    }
    else if (index === `7020`) {
        amount = 1000;
    }
    else if (index === `7030`) {
        amount = 2250;
    }

    if (amount === 0)
        writeSpecialLog(`Обман электрик ${index}`, player);

    player.user.addMoney(amount, false, "Заработал на электриках, починил щиток");
});