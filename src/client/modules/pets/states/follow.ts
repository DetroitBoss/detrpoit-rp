import { IPetState, Pet } from '../pet'

export class PetFollowState implements IPetState {
    constructor(private readonly _pet: Pet) {

    }

    public calculateBehavior(): void {
        this._pet.followOwner()
    }

    public onStateStarted(): void {
        this._pet.clearTasks()
    }
}