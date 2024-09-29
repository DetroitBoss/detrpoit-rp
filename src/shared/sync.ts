export type SyncSharedData = "serverReboot"
export type SyncSharedEvent = (value: any, oldValue: any) => void
export class SyncShared {
    protected static data = new Map<SyncSharedData, any>();
    protected static events: [SyncSharedData, SyncSharedEvent][] = []
    static handle(key: SyncSharedData, handle: SyncSharedEvent){
        this.events.push([key, handle])
    }
    protected static fireEvent(key: SyncSharedData, oldValue: any){
        const val = this.getData(key);
        this.events.filter(ev => ev[0] === key).map(ev => ev[1](val, oldValue))
    }
    static getData(key: SyncSharedData){
        return this.data.get(key)
    }
}

