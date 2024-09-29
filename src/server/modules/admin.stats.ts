import {NoSQLbase} from "./nosql";
import {CustomEvent} from "./custom.event";
import {
    AdminStatsData,
    REWARD_ADMIN_POINTS,
    AdminStatsDataTasks,
    HelperStatsData,
    HelperStatsDataTasks
} from "../../shared/admin.data";
import { dbLogsConnection } from './typeorm/logs'
import { AdminStatEntity } from './typeorm/entities/adminLogs'

let newday = false;
CustomEvent.register('newDay', () => {newday = true;})
let date = new Date();
let toDayHelper = new NoSQLbase<HelperStatsData>(`helper/stats/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
date.setDate(date.getDate() + 1);
let nextDayHelper = new NoSQLbase<HelperStatsData>(`helper/stats/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)

let entity: AdminStatEntity = null;
setTimeout(() => {
    entity = new AdminStatEntity()
    entity.time = Date.now() / 1000 | 0;
    entity.setData = data
    dbLogsConnection.getRepository(AdminStatEntity).insert(entity)
}, 10000)
let data: (AdminStatsData | HelperStatsData)[] = []

setInterval(async () => {
    entity.setData = data
    await dbLogsConnection.getRepository(AdminStatEntity).save(entity)
}, 3 * 60000)

export const addAdminStats = (id: number, param: keyof AdminStatsDataTasks) => {
    let addPoint = 0;
    if(param === "close") addPoint = REWARD_ADMIN_POINTS.CLOSE_TICKET;
    if(param === "message") addPoint = REWARD_ADMIN_POINTS.MESSAGE_TICKET;
    if(param === "kick") addPoint = REWARD_ADMIN_POINTS.KICK;
    if(param === "jail") addPoint = REWARD_ADMIN_POINTS.JAIL;
    if(param === "warn") addPoint = REWARD_ADMIN_POINTS.WARN;
    if(param === "ban") addPoint = REWARD_ADMIN_POINTS.BAN;
    if(param === "cmute") addPoint = REWARD_ADMIN_POINTS.CMUTE;
    if(param === "vmute") addPoint = REWARD_ADMIN_POINTS.VMUTE;
    
    let newData: AdminStatsData = { id, close: 0, points: addPoint, kick: 0, jail: 0, warn: 0, ban: 0, cmute: 0, vmute: 0, message: 0 }
    newData[param] += 1;
    
    const index = data.findIndex(q => q.id === id)
    if (index > -1) {
        data[index].points += addPoint
        if (!(data[index] as any)[param])
            (data[index] as any)[param] = 0;
        (data[index] as any)[param] += 1;
    } else {
        data.push(newData)
    }
}

export const addHelperStats = (id: number, param: keyof HelperStatsDataTasks) => {
    let addPoint = 0;
    if(param === "close") addPoint = REWARD_ADMIN_POINTS.CLOSE_TICKET;
    if(param === "message") addPoint = REWARD_ADMIN_POINTS.MESSAGE_TICKET;
    let newData:HelperStatsData = {id, close: 0, points: addPoint, message: 0}
    newData[param] += 1;
    
    const index = data.findIndex(q => q.id === id)
    if(index > -1){
        data[index].points += addPoint
        if (!data[index][param]) 
            data[index][param] = 0;
        data[index][param] += 1;
    } else {
        data.push(newData)
    }
}