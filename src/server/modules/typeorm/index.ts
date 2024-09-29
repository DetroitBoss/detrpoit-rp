import "reflect-metadata";
/** Файл настроек подключения к базе данных */
import config from '../../../../mysql.json'
import {BaseEntity, Connection, createConnection} from "typeorm";
import {UserDatingEntity, UserEntity} from "./entities/user";
import {BlackListEntity} from "./entities/blacklist";
import {AccountEntity} from "./entities/account";
import {VehicleEntity} from "./entities/vehicle";
import {VehicleConfigsEntity} from "./entities/vehicle.configs";
import {ItemEntity} from "./entities/inventory";
import {LogEntity, LogFamilyEntity, LogItemsEntity} from "./entities/log";
import {BusinessEntity, BusinessHistoryEntity} from "./entities/business";
import {HouseEntity} from "./entities/houses";
import {DressEntity} from "./entities/dress";
import {MenuAdsEntity} from "./entities/menu_ads";
import {RpHistoryEntity} from "./entities/rp_history";
import {BankHistoryEntity} from "./entities/bank_history";
import {FractionChestEntity, FractionChestOrderEntity} from "./entities/chest";
import {FractionGarageEntity} from "./entities/fraction.garage";
import {MoneyChestEntity} from "./entities/money.chest";
import {MessagesEntity, PhoneEntity} from "./entities/phoneData";
import {RaceCategoryEntity, RaceEntity} from "./entities/race";
import {DuelRatingEntity} from "./entities/duel";
import {JobDressEntity} from "./entities/job.dress";
import {PromocodeList, PromocodeUseEntity} from "./entities/promocodes";
import {DonateEntity} from "./entities/donate";
import {system} from "../system";
import {GangWarEntity} from "./entities/gangwar";
import {FamilyEntity} from './entities/family';
import {VoteEntity, VoteList} from "./entities/vote";
import {WarehouseEntity} from "./entities/warehouse";
import {ShootingRatingEntity} from "./entities/shooting";
import {MarketItemEntity} from "./entities/marketItem";
import {MarketHistoryEntity} from "./entities/marketHistoryEntity";
import {QuestEntity} from "./entities/quest.entity";
import {Promocode1xUse, Promocodes1x} from "./entities/promocodes1x";
import { UserGiftEntity } from './entities/userGift'
import {SpecialLog} from "./entities/specialLog";
import {BattlePassEntity} from "./entities/battlePass";
import {FurnitureEntity} from "./entities/furniture";
import {IslandBattleEntity} from "./entities/islandBattle";
import {FractionsEntity} from "./entities/fractions";
import {LscConfigEntity} from "./entities/lscConfig";
import {BusinessClientsRatingEntity} from "./entities/businessClientsRating";
import {BusinessTaxLogEntity} from "./entities/businessTaxLog";


export let dbconnection: Connection;

export const initDatabaseConnection = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        createConnection({
            debug: false,
            type: config.type as any,
            host: config.host,
            port: config.port,
            username: config.db_user,
            password: config.password,
            database: config.database,
            charset: "UTF8_GENERAL_CI",
            entities: [
                UserEntity,
                AccountEntity,
                BlackListEntity,
                VehicleEntity,
                VehicleConfigsEntity,
                ItemEntity,
                BusinessEntity,
                HouseEntity,
                DressEntity,
                MenuAdsEntity,
                RpHistoryEntity,
                BankHistoryEntity,
                BusinessHistoryEntity,
                UserDatingEntity,
                FractionChestEntity,
                FractionGarageEntity,
                FractionChestOrderEntity,
                MoneyChestEntity,
                PhoneEntity,
                MessagesEntity,
                RaceEntity,
                RaceCategoryEntity,
                DuelRatingEntity,
                JobDressEntity,
                PromocodeUseEntity,
                PromocodeList,
                DonateEntity,
                GangWarEntity,
                FamilyEntity,
                VoteEntity,
                VoteList,
                WarehouseEntity,
                ShootingRatingEntity,
                MarketItemEntity,
                MarketHistoryEntity,
                QuestEntity,
                Promocodes1x,
                Promocode1xUse,
                UserGiftEntity,
                SpecialLog,
                BattlePassEntity,
                FurnitureEntity,
                IslandBattleEntity,
                FractionsEntity,
                LscConfigEntity,
                BusinessClientsRatingEntity,
                BusinessTaxLogEntity
            ],
            synchronize: true,
            logging: false
        }).then((connection) => {
            // here you can start to work with your entities
            dbconnection = connection;
            resolve(connection)
        }).catch(error => {
            console.error(error)
            reject(error)
        });
    })
}

export const saveEntity = <T extends BaseEntity>(entity: T, count = 1): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        entity.save().then(item => {
            resolve(item)
        }).catch(err => {
            if(count === 5){
                system.debug.error(err);
                system.debug.error(`Save entity failed`);
                reject(err)
            } else {
                setTimeout(async () => {
                    saveEntity(entity, count + 1).then(item => {
                        resolve(item)
                    }).catch(err => {
                        reject(err)
                    })
                }, 500)
            }
        })
    })
}
export const removeEntity = <T extends BaseEntity>(entity: T, count = 1): Promise<boolean> => {
    return new Promise(async (resolve) => {
        entity.remove().then(() => {
            resolve(true)
        }).catch(err => {
            if(count === 3){
                system.debug.error(err);
                system.debug.error(`Remove entity failed`);
                resolve(false)
            } else {
                setTimeout(async () => {
                    removeEntity(entity, count + 1).then(item => {
                        resolve(true)
                    }).catch(err => {
                        resolve(false)
                    })
                }, 500)
            }
        })
    })
}