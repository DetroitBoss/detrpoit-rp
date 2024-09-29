import {
    IBattleResult,
    IBattleStatusDTO,
    ISLAND_BATTLE_DIMENSION,
    ISLAND_BATTLE_FRACTIONS,
    ISLAND_BATTLE_NOTIFY_IMAGE,
    ISLAND_BATTLE_STATE,
    ISLAND_POINTS,
    ISLAND_SPAWN_POSITIONS,
    TICKS_FOR_BATTLE_EXTRA,
    TICKS_FOR_BATTLE_FINISH,
    TICKS_FOR_BATTLE_START
} from "../../../shared/islandBattle";
import {CustomEvent} from "../custom.event";
import {Team} from "./team";
import {Point} from "./point";
import {AlertType} from "../../../shared/alert";
import {User} from "../user";
import {IslandBattleEntity} from "../typeorm/entities/islandBattle";
import {system} from "../system";

export class IslandBattle {

    public finished = false;
    private state: ISLAND_BATTLE_STATE = ISLAND_BATTLE_STATE.PREPARE;
    private fractions: Map<number, Team> = new Map<number, Team>();
    private points: Map<number, Point> = new Map<number, Point>();
    private interval: number;
    private ticks: number = 0;

    constructor() {
        const positions = this.getPositionsForSpawn();

        ISLAND_BATTLE_FRACTIONS.forEach((fraction, key) => {
            this.fractions.set(
                fraction.id,
                new Team(positions[key], fraction)
            );
        })

        this.interval = setInterval(this.intervalHandler, 60000);

        this.notifyOnlinePlayers();

        mp.events.add('_userLoggedIn', this.playerJoinHandler);
        mp.events.add('playerDeath', this.deathHandler);
    }

    private deathHandler = (player: PlayerMp) => {
        this.fractions.forEach(el => {
            el.checkOnRegistration(player);
        })
    }

    private intervalHandler = () => {
        if (this.state === ISLAND_BATTLE_STATE.PREPARE && this.ticks >= TICKS_FOR_BATTLE_START) {
            this.state = ISLAND_BATTLE_STATE.RUNNING;
            this.ticks = 0;
            this.startBattle();
        } else if (this.state === ISLAND_BATTLE_STATE.RUNNING && this.ticks >= TICKS_FOR_BATTLE_FINISH) {
            this.tryFinishBattle();
        } else if (this.state === ISLAND_BATTLE_STATE.EXTRA && this.ticks >= TICKS_FOR_BATTLE_EXTRA) {
            this.tryFinishBattle();
        } else {
            this.ticks++;
        }

        if (this.state === ISLAND_BATTLE_STATE.PREPARE && !(this.ticks % 5)) {
            mp.players.toArray().filter(player =>
                player.user && player.user.fraction && this.getAvailableFractionsList().includes(player.user.fraction))
                .forEach(p => {
                    p.notify(
                        `До начала битвы осталось ${TICKS_FOR_BATTLE_START - this.ticks}, поторопись!`,
                        'info',
                        ISLAND_BATTLE_NOTIFY_IMAGE
                    );
                })
        }

        if (this.state === ISLAND_BATTLE_STATE.PREPARE) return;

        mp.players.toArray().filter(p => p.user && p.dimension === ISLAND_BATTLE_DIMENSION).forEach(player => {
            CustomEvent.triggerCef(player, 'islandBattle:updateTime', this.getTimeForFinish());
        })
    }

    private tryFinishBattle() {
        const winner = this.getWinner();

        if (winner.length === 1) {
            this.finishBattle();
            clearInterval(this.interval);
            this.saveData(winner[0]);
            this.fractions.forEach((fraction, key) => {
                fraction.finishBattle(
                    key === winner[0] ?
                        'Поздравляем! Твоя команда выиграла эту войну'
                        :
                        'К сожалению, твоя команда проиграла эту войну');
            })
        } else {
            this.fractions.forEach((fraction, key) => {
                if (winner.includes(fraction.config.id)) return;
                fraction.finishBattle('К сожалению, твоя команда проиграла эту войну');
                this.fractions.delete(key);
            })

            this.state = ISLAND_BATTLE_STATE.EXTRA;
            this.ticks = 0;

            this.battleNotify('Мы не смогли найти победителя, война продолжается!', 'info');
        }
    }

    protected saveData(winner: number) {
        const entity = new IslandBattleEntity();

        entity.time = system.timestamp;
        entity.lastPayment = 0;
        entity.fractionId = winner;

        entity.save();
    }

    private getWinner() {
        let data: IBattleResult[] = []

        this.fractions.forEach(fraction => {
            data.push({
                id: fraction.config.id,
                points: 0
            })
        })

        this.points.forEach(point => {
            const fraction = data.find(el => el.id === point.owner);
            if (!fraction) return;
            const index = data.indexOf(fraction);
            if (index === -1) return;

            data[index].points += 1;
        });

        data = data.sort((a, b) => b.points - a.points);

        const maxValue = data[0].points;

        data = data.filter(el => el.points >= maxValue);

        const result: number[] = [];

        data.forEach(el => result.push(el.id));

        return result;
    }

    private getDTO(): IBattleStatusDTO[] {
        const data: Map<number, IBattleStatusDTO> = new Map<number, IBattleStatusDTO>();
        this.fractions.forEach(el => {
            data.set(el.config.id, {
                name: el.config.name,
                points: 0
            })
        })

        this.points.forEach(el => {
            if (el.owner === null || !data.get(el.owner)) return;

            const obj = {...data.get(el.owner)};
            obj.points += 1;
            data.set(el.owner, obj);
        })

        return [...data.values()];
    }

    private playerJoinHandler = (user: User) => {
        if (
            !user.fraction ||
            !this.getAvailableFractionsList().includes(user.fraction) ||
            this.state !== ISLAND_BATTLE_STATE.PREPARE
        ) return;

        this.notifyPlayer(user.player);
    }

    public onChangeOwner = (fractionId: number, id: number) => {
        const cfg = this.getCommandConfigById(fractionId);

        if (!cfg) return;

        const dto = this.getDTO();

        mp.players.toArray().filter(p => p.user && p.dimension === ISLAND_BATTLE_DIMENSION).forEach(player => {
            CustomEvent.triggerCef(player, 'islandBattle:updateStatus', dto);
        })

        this.battleNotify(`${cfg.fullName} захватили точку ${id}`, 'info');
    }

    public onPointInteract = (fractionId: number, id: number) => {
        const cfg = this.getCommandConfigById(fractionId);

        if (!cfg) return;

        this.battleNotify(`${cfg.fullName} начали захват точки ${id}`, 'warning');
    }

    private startBattle() {
        mp.events.remove('playerDeath', this.deathHandler);
        mp.events.remove('playerJoin', this.playerJoinHandler);

        mp.players.forEach(player => {
            if (!player.user) return;
            CustomEvent.triggerClient(player, 'islandBattle:destroyPrepareBlip');
        })

        ISLAND_POINTS.forEach((el, key) => {
            this.points.set(key, new Point(key, el, this.onChangeOwner, this.onPointInteract));
        })

        this.fractions.forEach(el => el.startBattle(this.getTimeForFinish(), this.getDTO()));
    }

    private getTimeForFinish() {
        if (this.state === ISLAND_BATTLE_STATE.RUNNING)
            return TICKS_FOR_BATTLE_FINISH - this.ticks;
        if (this.state === ISLAND_BATTLE_STATE.EXTRA)
            return TICKS_FOR_BATTLE_EXTRA - this.ticks;
    }

    private finishBattle() {
        this.points.forEach(el => el.destroy())
        this.finished = true;
    }

    private getAvailableFractionsList() {
        const fractionsList: number[] = [];

        ISLAND_BATTLE_FRACTIONS.forEach(el => {
            fractionsList.push(el.id)
        });

        return fractionsList;
    }

    private getCommandConfigById(id: number) {
        return ISLAND_BATTLE_FRACTIONS.find(fraction => fraction.id === id);
    }

    private battleNotify(text: string, type: AlertType) {
        mp.players.toArray().filter(player => player.user && player.dimension === ISLAND_BATTLE_DIMENSION).forEach(player => {
            player.notify(text, type, ISLAND_BATTLE_NOTIFY_IMAGE);
        })
    }

    private notifyOnlinePlayers() {
        let players = mp.players.toArray().filter(player =>
            player.user && player.user.fraction && this.getAvailableFractionsList().includes(player.user.fraction));

        players.forEach(player => this.notifyPlayer(player));
    }

    protected getPositionsForSpawn() {
        return [...ISLAND_SPAWN_POSITIONS]
    }

    protected notifyPlayer(player: PlayerMp) {
        player.notify('Скоро начнётся битва за остров, лови метку и направляйся на подготовку!',
            'info', ISLAND_BATTLE_NOTIFY_IMAGE);

        const cfg = this.getCommandConfigById(player.user.fraction);

        if (!cfg) return;

        CustomEvent.triggerClient(player, 'islandBattle:createPrepareBlip', cfg.preparePosition);
    }
}