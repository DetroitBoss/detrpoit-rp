import {DRESS_CONFIG_FEMALE_SQUAD, DRESS_CONFIG_MALE_SQUAD} from "../../../../shared/jobs/sanitation/uniform";
import {CustomEvent} from "../../custom.event";
import {ISquadTask, SANITATION_SQUAD_POINTS} from "../../../../shared/jobs/sanitation/squadTasks";
import {system} from "../../system";
import {Vehicle} from "../../vehicles";
import {VEHICLE_SPAWN_HEADING, VEHICLE_SPAWN_POSITION} from "../../../../shared/jobs/sanitation/hiring";

export class SanitationSquad {
    private readonly id: number;
    private ownerSquad: number;
    public name: string;

    private players: PlayerMp[] = []
    public password: string | null = null;

    private task: ISquadTask;

    private readonly vehicle: VehicleMp;

    public membersLength() {
        return this.players.length;
    }

    public getPlayersNames() {
        const names: string[] = []

        this.players.forEach(target => names.push(target.user.name));

        return names;
    }

    constructor(player: PlayerMp, isPublic: boolean, id: number) {
        mp.events.add("playerQuit", this.playerQuitHandler);
        mp.events.add("sanitation:completeStep", this.completeStepHandler);
        this.generateTask();
        this.id = id;
        this.addPlayer(player);
        this.ownerSquad = player.user.id;
        this.name = player.user.name;
        if (!isPublic) this.password = Math.random().toString(36).slice(-4);

        this.vehicle = Vehicle.spawn(
            'trash2',
            VEHICLE_SPAWN_POSITION,
            VEHICLE_SPAWN_HEADING,
            0,
            false,
            false
        )

        this.vehicle.setVariable('sanitation', id);
        this.vehicle.setColorRGB(0, 0, 0, 0, 0, 0);
        this.vehicle.numberPlate = "TRASH";
        this.vehicle.trashBags = 0;
        if (this.password) player.outputChatBox(`Пароль от сессии: ${this.password}`);
    }

    public addPlayer(player: PlayerMp) {
        if (this.players.length >= 2) return;
        player.user.sanitationSquad = this.id;
        player.user.setJobDress(player.user.is_male ? DRESS_CONFIG_MALE_SQUAD : DRESS_CONFIG_FEMALE_SQUAD);
        this.players.push(player);
        this.syncStepForPlayer(player);
    }

    public removePlayer(player: PlayerMp) {
        const target = this.players.find(p => p.user.id === player.user.id);

        if (target === undefined) return;

        const index = this.players.indexOf(target);

        if (index === -1) return;

        player.user.setJobDress(null);
        player.user.sanitationSquad = null;
        this.players.splice(index, 1);
        this.deleteStep(player);
        this.onLeaveSquadPlayer(player.user.id);
    }

    private onLeaveSquadPlayer(id: number) {
        if (id !== this.ownerSquad) return;

        if (this.players.length === 0) return this.deleteSquad();
        this.ownerSquad = this.players[0].user.id;
        this.name = this.players[0].user.name;
    }

    private deleteSquad() {
        mp.events.remove('playerQuit', this.playerQuitHandler);
        CustomEvent.trigger('sanitation:deleteSquad', this.id);
        if (mp.vehicles.at(this.vehicle.id)) this.vehicle.destroy();
    }

    private playerQuitHandler = (player: PlayerMp) => {
        if (player.user.sanitationSquad !== this.id) return;
        this.removePlayer(player);
    }

    private generateTask() {
        const cfg = [...SANITATION_SQUAD_POINTS],
            points: [Vector3Mp, Vector3Mp][] = [];

        for (let i = 0; i < 6; i++) {
            const id = Math.floor(Math.random() * cfg.length);
            points.push(cfg[id]);
            cfg.splice(id, 1);
        }

        this.players.forEach(target => this.deleteStep(target));

        this.task = {
            completed: false,
            created: system.timestamp,
            completedPoints: [false, false],
            points,
            step: 0
        }
    }

    public intervalHandler() {
        if (!this.task.completed) return;

        if (system.timestamp - this.task.created < 360) return;

        this.generateTask();
        this.players.forEach(target => this.syncStepForPlayer(target));
    }

    private completeStepHandler = (player: PlayerMp, step: number, isFirst: boolean) => {
        if (!player.user || step !== this.task.step) return;
        if (!player.user.sanitationSquad || player.user.sanitationSquad !== this.id) return;



        if (step !== 5) {
            player.user.sanitationTrashBag = true;
            this.task.completedPoints[isFirst ? 0 : 1] = true;

            if (this.task.completedPoints.filter(el => el === true).length === 2) {
                this.task.step++;
                this.task.completedPoints = [false, false];

                this.players.forEach(target => {
                    if (!target.user) return;

                    target.user.addMoney(400, true, 'Заработал в сессии мусоровоза');
                })
            }

            this.syncSquad();
        }else{
            if (!player.vehicle)
                return player.notify('Вы не находитесь в машине', 'error');

            if (!player.vehicle.getVariable('sanitation') || player.vehicle.getVariable('sanitation') !== this.id)
                return player.notify('Эта машина не принадлежит вашей сессии', 'error');

            player.vehicle.trashBags = 0;
            this.task.completed = true;
            this.players.forEach(target => this.deleteStep(target));
        }
    }

    private syncSquad() {
        this.players.forEach(target => this.syncStepForPlayer(target));
    }

    private syncStepForPlayer(player: PlayerMp) {
        CustomEvent.triggerClient(
            player,
            'sanitation:syncStep',
            this.task.step,
            this.task.points[this.task.step],
            this.task.completedPoints
        );
    }

    protected deleteStep(player: PlayerMp) {
        CustomEvent.triggerClient(
            player,
            'sanitation:deleteStep'
        );
    }
}