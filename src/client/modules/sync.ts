import {SyncShared, SyncSharedData} from "../../shared/sync";
import {CustomEvent} from "./custom.event";

export class SyncClass extends SyncShared {
    static setData(key: SyncSharedData, value: any){
        const old = this.getData(key)
        this.data.set(key, value);
        this.fireEvent(key, old)
    }
    static clearData(key: SyncSharedData){
        this.data.delete(key);
        this.fireEvent(key, null)
    }
}

CustomEvent.registerSocket('sync:key', (key: SyncSharedData, value: any) => {
    SyncClass.setData(key, value)
})
CustomEvent.registerSocket('sync:clear', (key: SyncSharedData) => {
    SyncClass.clearData(key)
})
CustomEvent.registerSocket('sync:join', (data: string) => {
    if(!data) return;
    const val:[SyncSharedData, any][] = JSON.parse(data);
    if(!val) return;
    val.map(item => SyncClass.setData(item[0], item[1]))
})