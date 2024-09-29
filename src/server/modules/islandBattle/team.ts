import {
    IBattleStatusDTO,
    IIslandBattleCommand,
    ISLAND_BATTLE_DIMENSION,
    ISLAND_BATTLE_MAX_COMMAND_PLAYERS,
    ISLAND_BATTLE_NOTIFY_IMAGE,
} from "../../../shared/islandBattle";

import {CustomEvent} from "../custom.event";

export class Team {

    public config: IIslandBattleCommand
    private readonly spawnPositions: Vector3Mp[]

    private readonly registrationShape: ColshapeMp = null;
    private registrationMarker: MarkerMp = null;

    private players: Map<number, PlayerMp> = new Map<number, PlayerMp>();

    constructor(spawnPositions: Vector3Mp[], config: IIslandBattleCommand) {
        this.config = config;
        this.spawnPositions = spawnPositions;

        const pos = config.preparePosition;

        this.registrationShape = mp.colshapes.newSphere(
            pos.x,
            pos.y,
            pos.z,
            10,
            0
        );

        this.registrationMarker = mp.markers.new(1, pos, 10,
            {
                color: config.color,
                dimension: 0
            });

        mp.events.add("playerEnterColshape", this.enterShapeHandler);
        mp.events.add("playerExitColshape", this.leaveShapeHandler);
        mp.events.add("playerQuit", this.playerQuitHandler);
    }

    private playerQuitHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.id) return;

        const id = player.user.id;

        if (this.players.has(id)) this.players.delete(id);
    }

    private enterShapeHandler = (player: PlayerMp, shape: ColshapeMp) => {
        if (shape !== this.registrationShape) return;
        if (!player.user || player.user.fraction !== this.config.id) return;
        if (player.vehicle) return player.notify('Выйдите из авто', 'error');

        if (this.players.size >= ISLAND_BATTLE_MAX_COMMAND_PLAYERS)
            return player.notify('К сожалению мест не осталось, попробуй подойти позже', 'error',
                ISLAND_BATTLE_NOTIFY_IMAGE);

        this.players.set(player.user.id, player);
        player.notify('Отлично, ты включен в список участников битвы за остров', 'success',
            ISLAND_BATTLE_NOTIFY_IMAGE);
    }

    private leaveShapeHandler = (player: PlayerMp, shape: ColshapeMp) => {
        if (!player.user) return;
        if (shape !== this.registrationShape) return;
        if (!this.players.has(player.user.id)) return;

        this.players.delete(player.user.id);
        player.notify('Ты покинул место сбора, возвращайся, если конечно ещё останется место для тебя',
            'warning', ISLAND_BATTLE_NOTIFY_IMAGE);
    }

    public startBattle(time: number, dto: IBattleStatusDTO[]) {

        this.players.forEach(player => {
            if (!player.user) return;

            const pos = this.spawnPositions[Math.floor(Math.random() * this.spawnPositions.length)];

            player.user.teleport(pos.x + this.getRandomForCoords(), pos.y + this.getRandomForCoords(), pos.z,
                100, ISLAND_BATTLE_DIMENSION);

            CustomEvent.triggerCef(player, 'islandBattle:setData', time, dto);
        })

        this.notifyPlayers('Битва за остров началась. Желаю удачи тебе!');

        mp.events.remove("playerEnterColshape", this.enterShapeHandler);
        mp.events.remove("playerExitColshape", this.leaveShapeHandler);
        this.registrationShape.destroy();
        this.registrationMarker.destroy();

        mp.events.add('playerDeath', this.playerDeathHandler);
    }

    public finishBattle(notifyText: string) {
        mp.events.remove('playerQuit', this.playerQuitHandler);
        mp.events.remove('playerDeath', this.playerDeathHandler);

        this.players.forEach(player => {
            if (!mp.players.exists(player) || !player.user) return;

            const pos = this.config.preparePosition;

            player.user.teleport(
                pos.x,
                pos.y,
                pos.z,
                90,
                0,
                true
            );

            CustomEvent.triggerCef(player, 'islandBattle:close');
        })

        this.notifyPlayers(notifyText);
    }

    public checkOnRegistration(player: PlayerMp) {
        if (!player.user) return;
        if (this.players.has(player.user.id)) this.players.delete(player.user.id);
    }

    private playerDeathHandler = (player: PlayerMp) => {
        if (!player.user || player.dimension !== ISLAND_BATTLE_DIMENSION) return;

        const pos = this.spawnPositions[Math.floor(Math.random() * this.spawnPositions.length)];

        player.user.teleport(pos.x + this.getRandomForCoords(), pos.y + this.getRandomForCoords(), pos.z, 100,
            ISLAND_BATTLE_DIMENSION, true);
    }

    public notifyPlayers(text: string) {
        this.players.forEach(player => {
            if (!player.user) return;
            player.notify(text, 'info', ISLAND_BATTLE_NOTIFY_IMAGE);
        })
    }

    protected getRandomForCoords() {
        const a = Number((Math.random() * (2 - 0.1) + 0.1).toFixed(4)),
            b = Math.random() > 0.5 ? 1 : -1;
        return a * b;
    }


}