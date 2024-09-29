import { IPetState, Pet } from '../pet'

const animationsByModel: {[k: number]: { dict: string, name: string }} = {
    [1125994524]: { dict: 'creatures@pug@amb@world_dog_sitting@base', name: 'base' },
    [2910340283]: { dict: 'creatures@pug@amb@world_dog_sitting@base', name: 'base' },
    [1126154828]: { dict: 'creatures@dog@move', name: 'sit_loop' },
    [1832265812]: { dict: 'creatures@pug@amb@world_dog_sitting@base', name: 'base' },
    [1318032802]: { dict: 'creatures@dog@move', name: 'sit_loop' },
    [351016938]: { dict: 'creatures@dog@move', name: 'sit_loop' },
}

export class PetSitState implements IPetState {
    constructor(private readonly _pet: Pet) {

    }

    public async calculateBehavior(): Promise<void> {
        let animation = animationsByModel[this._pet.model]

        if (!animation) {
            animation = { dict: 'creatures@dog@move', name: 'sit_loop' }
        }

        if (!mp.game.streaming.doesAnimDictExist(animation.dict))
            return

        mp.game.streaming.requestAnimDict(animation.dict)
        for (let index = 0; !mp.game.streaming.hasAnimDictLoaded(animation.dict) && index < 250; index++) {
            await mp.game.waitAsync(2)
        }

        this._pet.taskPlayAnim(animation.dict, animation.name)
    }
}