export abstract class DropBase {
    protected constructor(public readonly dropId: number) {    }
    
    public activate(player: PlayerMp): boolean {
        return this.onDropActivated(player);
    }
    
    protected abstract onDropActivated(player: PlayerMp): boolean;
}