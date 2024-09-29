import { Connection, createConnection } from 'typeorm'
import config from '../../../../mysql.json'
import { LogEntity, LogFamilyEntity, LogItemsEntity } from './entities/log'
import { InventoryLogEntity } from './entities/inventoryLog'
import { system } from '../system'
import { Logs } from '../logs'
import { AdminDialogEntity, AdminStatEntity } from './entities/adminLogs'

export let dbLogsConnection: Connection;

export const initLogsDatabaseConnection = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        createConnection({
            name: 'logs',
            debug: false,
            type: config.logs_type as any,
            host: config.logs_host,
            port: config.logs_port,
            username: config.logs_db_user,
            password: config.logs_password,
            database: config.logs_database,
            charset: "UTF8_GENERAL_CI",
            entities: [
                LogEntity,
                InventoryLogEntity,
                LogItemsEntity,
                LogFamilyEntity,
                AdminDialogEntity,
                AdminStatEntity,
            ],
            synchronize: true,
            logging: false
        }).then((connection) => {
            system.debug.success('Connection with logs database established')
            dbLogsConnection = connection;
            resolve(connection)
        }).catch(error => {
            console.error(error)
            reject(error)
        });
    })
}