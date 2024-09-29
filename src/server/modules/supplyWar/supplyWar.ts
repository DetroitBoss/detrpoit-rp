import {
    ISupplyWar, ISupplyWarFraction, ISupplyWarItem, SUPPLY_WAR_ALLOW_FRACTIONS, SUPPLY_WAR_ALLOW_VEHICLE_MODELS,
    SUPPLY_WAR_BLIP_COLOR,
    SUPPLY_WAR_BLIP_NAME,
    SUPPLY_WAR_BLIP_SCALE,
    SUPPLY_WAR_BLIP_SPRITE, SUPPLY_WAR_INTERACTION_MESSAGE, SUPPLY_WAR_INTERACTION_OPTIONS,
    SUPPLY_WAR_PREPARATION_TIME,
    SUPPLY_WAR_STEP
} from "../../../shared/supplyWar/config";
import {colshapeHandle, colshapes} from "../checkpoints";
import {fractionChest} from "../chest";
import {CustomEvent} from "../custom.event";
import {system} from "../system";

export class SupplyWar implements ISupplyWar {
    step: SUPPLY_WAR_STEP = SUPPLY_WAR_STEP.PREPARATION
    private _interaction: colshapeHandle
    protected _blip: BlipMp
    private readonly _pos: Vector3Mp
    private _timeout: number = null
    private vehiclesLoaded: number = 0
    private readonly maxVehiclesLoad: number
    private readonly _allowVehicleModels: string[] = SUPPLY_WAR_ALLOW_VEHICLE_MODELS;
    private readonly fractions: ISupplyWarFraction[] = SUPPLY_WAR_ALLOW_FRACTIONS;
    protected _cargoItems: ISupplyWarItem[];
    private fractionsInteractions: colshapeHandle[] = [];

    constructor(position: Vector3Mp, maxVehiclesLoad: number, items: ISupplyWarItem[]) {

        this._cargoItems = items;
        this.maxVehiclesLoad = maxVehiclesLoad + 1;
        this.createFractionsInteractions();

        this._pos = new mp.Vector3(
            position.x,
            position.y,
            position.z - 1
        );

        this._blip = mp.blips.new(
            SUPPLY_WAR_BLIP_SPRITE,
            this._pos,
            {
                color: SUPPLY_WAR_BLIP_COLOR,
                dimension: 0,
                scale: SUPPLY_WAR_BLIP_SCALE,
                shortRange: true,
                name: SUPPLY_WAR_BLIP_NAME
            }
        );

        this._timeout = setTimeout(
            this.setProcessStep,
            SUPPLY_WAR_PREPARATION_TIME * 1000
        );

        mp.events.add("supplyWar:finishLoading", this.finishLoadingHandler);
    }

    private createFractionsInteractions() {
        this.fractions.forEach(el => {
            const shape = colshapes.new(
                el.position,
                'Выгрузка',
                (player: PlayerMp) => {
                    if (!player.vehicle)
                        return player.notify('Необходимо быть в машине', 'error');

                    if (!player.vehicle.fraction || player.vehicle.fraction !== el.id)
                        return player.notify('Вы не можете здесь разгрузить данный автомобиль', 'error');

                    if (!player.vehicle.supplyWarCargo)
                        return player.notify('В машине отсутствует груз', 'error');

                    const cargo = [...player.vehicle.supplyWarCargo],
                        chest = fractionChest.getByFraction(el.id);

                    if (!chest[0]) return;


                    cargo.forEach(el => {
                        chest[0].addItem(el.itemId, el.count)
                    })

                    player.vehicle.supplyWarCargo = undefined;
                    player.notify('Вы успешно выгрузили автомобиль', 'success');
                },
                SUPPLY_WAR_INTERACTION_OPTIONS
            )

            this.fractionsInteractions.push(shape);
        })
    }

    private loadingHandle = (player: PlayerMp): void => {
        console.log(this.vehiclesLoaded)
        if (!player.user) return;

        if (!player.vehicle)
            return player.notify('Необходимо быть в машине', 'error');

        if (this.vehiclesLoaded >= this.maxVehiclesLoad)
            return player.notify('Грузов не осталось', 'warning');

        if (!player.vehicle.fraction || this.fractions.find(el => player.vehicle.fraction === el.id) === undefined)
            return player.notify('Неподходящий транспорт для погрузки', 'error');

        if (!player.vehicle.modelname || this._allowVehicleModels.find(el => player.vehicle.modelname === el) === undefined)
            return player.notify('Неподходящий транспорт для погрузки', 'error');

        if (player.vehicle.supplyWarCargo)
            return player.notify('У вас уже имеется груз', 'error');

        CustomEvent.triggerClient(player, 'supplyWar:startLoading', player.vehicle.id);
    }

    private finishLoadingHandler = (player: PlayerMp, vehId: number): void => {
        if (!player.user) return;

        if (!player.vehicle)
            return player.notify('Вы покинули автомобиль', 'error');

        if (this.vehiclesLoaded >= this.maxVehiclesLoad)
            return player.notify('Грузов не осталось', 'warning');

        if (player.vehicle.id !== vehId) return player.notify("Погрузка не удалась");

        if (system.distanceToPos(player.position, this._pos) > 3.5)
            return player.notify("Вы покинули место погрузки", "error");



        this.vehiclesLoaded += 1;
        player.vehicle.supplyWarCargo = this._cargoItems;
        player.notify('Вы успешно погрузили материалы, отвезите их на свой склад', 'success');

    }

    private setProcessStep = (): void => {
        if (this.step !== SUPPLY_WAR_STEP.PREPARATION) return;
        this._timeout = null;
        this.step = SUPPLY_WAR_STEP.PROCESS;

        this._interaction = colshapes.new(
            this._pos,
            SUPPLY_WAR_INTERACTION_MESSAGE,
            this.loadingHandle,
            SUPPLY_WAR_INTERACTION_OPTIONS
        );

        mp.players.forEach(p => {
            if (!p.user) return;
            if (p.user.fraction === 0) return;
            if (!this.fractionExistInList(p.user.fraction)) return;

            p.notify("Мероприятие ВЗС начато!", "info");
        })
    }

    private fractionExistInList(fractionId: number) {
        return this.fractions.find(el => el.id === fractionId) !== undefined
    }


    public destroy = (): void => {
        if (this._timeout !== null) clearTimeout(this._timeout)
        if (this._interaction && this._interaction.exists) this._interaction.destroy()
        this.fractionsInteractions.forEach(el => {
            if (el.exists) el.destroy();
        })
        if (mp.blips.exists(this._blip)) this._blip.destroy();
        mp.events.remove("supplyWar:finishLoading", this.finishLoadingHandler);
    }
}