import { IPetFullData, PetState } from '../../../shared/pets'
import { PetSitState } from './states/sit'
import { PetFollowState } from './states/follow'
import { PetStandState } from './states/stand'
import { CustomEvent } from '../custom.event'

export class Pet {
    private _ped: PedMp
    private _sitState: PetSitState
    private _followState: PetFollowState
    private _standState: PetStandState
    public lastVehicleSeat: number = 0
        
    public data: IPetFullData
    
    public get coords(): Vector3Mp {
        return this._ped.getCoordsAutoAlive()
    }
    public set coords(pos: Vector3Mp) {
        this._ped.setCoords(pos.x, pos.y, pos.z, true, true, true, true)
    }
    public get model(): number {
        return this._ped.model
    }
    public get heading(): number {
        return this._ped.getHeading()
    }
    public get vehicle(): number {
        return this._ped.getVehicleIsIn(false)
    }
    
    constructor(data: IPetFullData) {
        this.data = data
        
        this._sitState = new PetSitState(this)
        this._followState = new PetFollowState(this)
        this._standState = new PetStandState(this)
    }

    public async create(): Promise<void> {
        this._ped = mp.peds.new(this.data.model, this.data.position, 0, 0)
        
        if (!mp.game.streaming.isModelValid(this.data.model))
            return CustomEvent.triggerServer('srv:log', `Неверная модель собаки ${this.data.model}`)
        
        while (!this.exist()) {
            await mp.game.waitAsync(5)
        }

        this._ped.freezePosition(false)
    }
    
    public handleCurrentState(): void {
        if (!this.exist())
            return

        this._ped.freezePosition(false)

        switch (this.data.currentState) {
            case PetState.Sit:
                this._sitState.calculateBehavior()
                break;
            case PetState.Stand:
                this._standState.calculateBehavior()
                break;
            case PetState.Follow:
                this._followState.calculateBehavior()
                break;
        }
    }
    
    public changeCurrentState(stateToChange: PetState): void {
        if (!this.exist())
            return
        
        this.data.currentState = stateToChange
        
        switch (this.data.currentState) {
            case PetState.Stand:
                this._standState.onStateStarted()
                break;
            case PetState.Follow:
                this._followState.onStateStarted()
                break;
        }
        
        if (mp.players.local.remoteId === this.data.controllerId) {
            CustomEvent.triggerServer('pet:changeState', this.data.id, stateToChange)
        }
        
        this.handleCurrentState()
    }
    
    public putIntoAVehicle(vehicle: VehicleMp, seat: number): void {
        if (!this.exist())
            return
        
        if (!vehicle.isSeatFree(seat))
            return

        if (mp.players.local.remoteId === this.data.controllerId) {
            CustomEvent.triggerServer('pet:setIntoVehicle', this.data, vehicle.remoteId, seat)
        }
        
        this.lastVehicleSeat = seat
        mp.game.invoke('0x9A7D091411C5F684', this._ped.handle, vehicle.handle, seat)
    }
    
    public kickFromVehicle(vehicle: VehicleMp): void {
        if (mp.game.invoke('0xA3EE4A07279BB9DB', this._ped.handle, vehicle.handle, false)) {
            this._ped.clearTasksImmediately()
            mp.game.invoke('0xD3DBCE61A490BE02', this._ped.handle, vehicle.handle, 0)
            this.handleCurrentState()
            if (mp.players.local.remoteId === this.data.controllerId) {
                CustomEvent.triggerServer('pet:kickFromVehicle', this.data, vehicle.remoteId)
            }
        }
    }
    
    public clearTasks(): void {
        this._ped.clearTasks()
    }
    
    public exist(): boolean {
        return this._ped?.handle != 0 && mp.peds.exists(this._ped)
    }
    
    public taskPlayAnim(animDict: string, animName: string): void {
        this._ped.taskPlayAnim(animDict, animName,  8.0, 1.0, -1, 1, 1.0, false, false, false)
    }
    
    public followOwner(): void {
        
        const targetPlayer = mp.players.toArray().find(p => p.remoteId == this.data.controllerId)
        
        if (!targetPlayer)
            return
        
        this._ped.taskFollowToOffsetOf(targetPlayer.handle, 0, 0, 0, 3.0, -1, 1.5, true)
        //this._ped.taskGoStraightToCoord(pos.x, pos.y, pos.z, 3, -1, heading, 0)
    }

    public followEntity(entity: EntityMp): void {
        this._ped.taskFollowToOffsetOf(entity.handle, 0, 0, 0, 3.0, -1, 1.5, true)
    }
    
    public destroy(): void {
        this._ped.destroy()
    }
}

export interface IPetState {
    /**
     * Метод срабатывает как только состояние изменилось на класс, реализующий интерфейс.
     * Сработает только для игроков для которых собака существует (в её стриме).
     */
    onStateStarted?: () => void | Promise<void>
    /**
     * Метод просчитывает поведение собаки в состоянии, реализующем интерфейс.
     * Сработает при попадании игрока в стрим.
     */
    calculateBehavior: () => void | Promise<void>
}