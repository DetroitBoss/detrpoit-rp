import {NpcSpawn} from "../../npc";
import {openJobSessionMenu} from "../../gui/jobSessions";
import {MenuConfigs} from "../../../../shared/gui/SessionJob";
import {ScaleformTextMp} from "../../scaleform.mp";
import {FireSquad, getFireSquad} from "./FireSquad";
import {Vehicle} from "../../vehicles";
import {
    FireStationParameters, FIRETRUCK_COLOR,
    FIRETRUCK_MODEL,
    MAX_PLAYERS_IN_SQUAD,
    MIN_PLAYERS_IN_SQUAD, MINIMAL_LEVEL,
    STATION_BLIP,
    STATION_BLIP_COLOR, VehicleSpawnParameters
} from "./config";
import {menu} from "../../menu";
import {systemUtil} from "../../../../shared/system";

const fireStations: FireStation[] = [];

export class FireStation {
    private static generatingId: number = 1;

    public readonly parameters: FireStationParameters;
    private readonly id: number;
    private readonly employerNpc: NpcSpawn;

    constructor(parameters: FireStationParameters) {
        this.id = FireStation.generatingId++;
        this.parameters = parameters;

        this.employerNpc = new NpcSpawn(
            parameters.EmployerNpc.Position,
            parameters.EmployerNpc.Heading,
            parameters.EmployerNpc.Model,
            parameters.EmployerNpc.Name,
            this.openJoinJobMenu.bind(this),
            parameters.EmployerNpc.Range,
            parameters.EmployerNpc.Dimension
        );

        mp.blips.new(STATION_BLIP, parameters.EmployerNpc.Position, {
            color: STATION_BLIP_COLOR,
            shortRange: true,
            name: 'Пожарная станция'
        });

        parameters.WaterSpotPositions.forEach(waterSpotPosition => {
            new ScaleformTextMp(waterSpotPosition, 'Выдача огнетушительной смеси', {
                range: 20
            });
        });

        fireStations.push(this);
    }

    private _lastVehicleSpawnPointIndex: number = 0;
    private getNextVehicleSpawnPoint(): VehicleSpawnParameters {
        const pointIndex = this._lastVehicleSpawnPointIndex++;

        if (this._lastVehicleSpawnPointIndex >= this.parameters.VehiclesSpawns.length) {
            this._lastVehicleSpawnPointIndex = 0;
        }

        return this.parameters.VehiclesSpawns[pointIndex];
    }

    private openJoinJobMenu(player: PlayerMp) {
        if (player.user.fireSquad) {
            openLeaveSquadMenu(player);
            return;
        }

        if (player.user.level < MINIMAL_LEVEL) {
            player.notify(`Для работы пожарником требуется ${MINIMAL_LEVEL} уровень`, 'error');
            return;
        }

        if (!player.user.bank_have) {
            player.notify(`Для работы вам необходимо иметь банковский счет`, 'error');
            return;
        }

        openJobSessionMenu(player, {
            Key: 'firefighter-' + this.id,
            StartHandler: this.createSquad.bind(this),
            MenuConfig: MenuConfigs.get('firefighter'),
            MaxPlayers: MAX_PLAYERS_IN_SQUAD,
            MinPlayers: MIN_PLAYERS_IN_SQUAD
        });
    }

    private createSquad(players: PlayerMp[]) {
        const spawnParams = this.getNextVehicleSpawnPoint();
        const vehicle = Vehicle.spawn(FIRETRUCK_MODEL, spawnParams.Position, spawnParams.Heading, 0, true, true);
        vehicle.setColorRGB(FIRETRUCK_COLOR.r, FIRETRUCK_COLOR.g, FIRETRUCK_COLOR.b, 0, 0, 0);

        const squad = new FireSquad(players, vehicle);
        squad.notify('Добро пожаловать на службу. Заполните служебный транспорт огнетушительной смесью, а после ожидайте поступления вызова');
    }
}

function openLeaveSquadMenu(player: PlayerMp) {
    menu.accept(player, 'Вы хотите выйти из текущего отряда?')
        .then(result => {
            if (!mp.players.exists(player) || !player.user || !player.user.fireSquad) {
                return;
            }

            if (!result) {
                return;
            }

            const squad = getFireSquad(player.user.fireSquad);
            squad.kickPlayer(player);

            player.notify('Вы покинули отряд пожарников');
        });
}

export function isWaterSpotInRange(position: Vector3Mp, range: number) {
    return fireStations
        .map(station => station.parameters.WaterSpotPositions)
        .reduce((a, b) => a.concat(b), [])
        .some(waterSpotPosition => systemUtil.distanceToPos(position, waterSpotPosition) < range);
}