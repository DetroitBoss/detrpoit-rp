import {LogItemsEntity} from "./typeorm/entities/log";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import { ItemEntity } from './typeorm/entities/inventory'
import { InventoryLogEntity } from './typeorm/entities/inventoryLog'
import { dbLogsConnection } from './typeorm/logs'
import { SocketSyncWeb } from './socket.sync.web'
import { inventoryShared } from '../../shared/inventory'

CustomEvent.registerClient('logs:open', (player, ids: string, name: string) => Logs.open(player, ids, name))

let manyList:{ids: string, who: string, text: string, count: number, time: number}[] = [];

export const Logs = {
    data: new Map<string, {who: string, time: number, text: string}[]>(),
    
    inventoryLogsBuffer: new Array<InventoryLogEntity>(),
    
    loadAll: () => {
        return new Promise(resolve => {
            dbLogsConnection.getRepository(LogItemsEntity).find().then(data => {
                data.map(item => {
                    let q = Logs.data.has(item.ids) ? Logs.data.get(item.ids) : []
                    q = [{who: item.who, time: item.time, text: item.text}, ...q]
                    q.splice(200)
                    Logs.data.set(item.ids, q);
                })
                resolve(null);
            })
        })
    },
    newMany: (ids: string, who: string, text: string) => {
        let item = manyList.find(q => q.ids === ids && q.who === who && q.text === text);
        if(item) return item.count++;
        manyList.push({ids, who, text, count: 1, time: system.timestamp})
        setTimeout(() => {
            let index = manyList.findIndex(q => q.ids === ids && q.who === who && q.text === text);
            if(index == -1) return;
            const item = manyList[index];
            if(!item) return;
            Logs.new(ids, who, `${item.count > 1 ? `x${item.count} ` : ''}${text}`, item.time)
            manyList.splice(index, 1)
        }, 30000)
    },
    new: async (ids: string, who: string, text: string, time?: number) => {
        const q = new LogItemsEntity();
        q.time = time ? time : system.timestamp;
        q.text = text;
        q.ids = ids;
        q.who = who;
        await dbLogsConnection.getRepository(LogItemsEntity).insert(q)
        let z = Logs.get(ids);
        z = [{who, time: q.time, text}, ...z]
        z.splice(200)
        Logs.data.set(ids, z);
        Logs.reload(ids, z);
    },
    reload: (ids: string, data?:{who: string, time: number, text: string}[]) => {
        SocketSyncWeb.fire(`log_${ids}`, JSON.stringify(data ? data : Logs.get(ids)));
    },
    insertInventoryLog: (itemEntity: ItemEntity, actorId: number, targetId: number, action: string, text: string) => {
        const newLog = new InventoryLogEntity()
        newLog.targetId = targetId
        newLog.actorId = actorId
        newLog.itemId = itemEntity.item_id
        newLog.itemName = inventoryShared.get(itemEntity.item_id).name
        newLog.text = text
        newLog.serial = itemEntity.serial
        newLog.action = action
        newLog.time = system.timestamp
        
        Logs.inventoryLogsBuffer.push(newLog)
    },
    /** Метод делает insert записей с кеша в бд методом Bulk insert для оптимизации */
    flushInventoryLogs: async () => {
        await dbLogsConnection
            .createQueryBuilder()
            .insert()
            .into(InventoryLogEntity)
            .values(Logs.inventoryLogsBuffer)
            .execute()
        
        Logs.inventoryLogsBuffer = []
    },
    get: (id: string) => {
        if(!Logs.data.has(id)) Logs.data.set(id, []);
        return Logs.data.get(id)
    },
    open: (player: PlayerMp, ids: string, name: string, data?:{who: string, time: number, text: string}[]) => {
        const user = player.user;
        if(!user) return;
        user.setGui('logs', 'logs:open', ids, name, data ? data : Logs.get(ids))
    }
}

const INVENTORY_LOGS_FLUSH_INTERVAL = 1 * 1000 * 60
setInterval(async () => {
    await Logs.flushInventoryLogs()
}, INVENTORY_LOGS_FLUSH_INTERVAL)