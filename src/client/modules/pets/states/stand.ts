import { IPetState, Pet } from '../pet'

export class PetStandState implements IPetState {
    constructor(private readonly _pet: Pet) {
        
    }
    
    public calculateBehavior(): void {
        this._pet.clearTasks()
    }

    public onStateStarted(): void {
        this._pet.clearTasks()
    }
}