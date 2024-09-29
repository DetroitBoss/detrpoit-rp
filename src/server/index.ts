import {warehouses} from "./modules/warehouse";
import {JobDress} from "./modules/job.dress";
import fs from 'fs';
import {initDatabaseConnection} from "./modules/typeorm"
import {loadVehicleConfigs, Vehicle} from './modules/vehicles'
import {inventory} from './modules/inventory'
import {business} from './modules/business'
import {houses} from './modules/houses';
import {dress} from './modules/customization';
import {system} from './modules/system';
import './modules/'
import {fractionChest} from "./modules/chest";
import {FractionGarage} from "./modules/fraction.garages";
import {fractionChestOrder} from "./modules/chest.order";
import {MoneyChestClass} from "./modules/money.chest";
import {race} from "./modules/race";
import {duels} from "./modules/duels";
import {fetchIp} from "./modules/web";
import {loadAdsDB} from "./modules/main";
import {loadGangZone} from "./modules/gangwar";
import {Family} from './modules/families/family';
import {loadAllVotes} from "./modules/vote";
import {Logs} from "./modules/logs";
import {loadTop3Drifters} from "./modules/drift";
import {marketItemsDb} from "./modules/market/marketItemsDb";
import {promocodes1x} from "./modules/onetimePromocodes";
import { initLogsDatabaseConnection } from './modules/typeorm/logs'
import {loadConfig} from "./modules/businesses/lsc";
import { getX2Param } from "./modules/usermodule/static";

process.env.TZ = 'Europe/Moscow'
mp.events.delayInitialization = true;
system.debug.success('Загрузка модулей сервера')

initLogsDatabaseConnection()

initDatabaseConnection().then(async (q) => {
    await houses.load();
    if (fs.existsSync('./client_packages/dress.json.js')){
        system.debug.debug(`Конфиг одежды существует, удаляем`);
        fs.unlinkSync('./client_packages/dress.json.js');
    } else {
        system.debug.debug(`Конфиг одежды не существует`);
    }
    await loadConfig()
    await dress.load();
    await business.load();
    await fetchIp()
    system.debug.success('Основные модули, необходимые до инициализации загружены');
    mp.events.delayInitialization = false;
    await inventory.load();
    await loadVehicleConfigs()
    await Vehicle.spawnPlayersVehicles();
    await FractionGarage.loadAll()
    await MoneyChestClass.loadAll()
    await race.loadAll()
    await duels.loadAll()
    await JobDress.loadAll()
    await loadAdsDB()
    await Family.load();
    await fractionChest.loadAll()
    await fractionChestOrder.loadAll()
    await loadAllVotes()
    await warehouses.loadAll()
    await Logs.loadAll()
    await loadTop3Drifters()
    await marketItemsDb.init();
    await promocodes1x.load();
    loadGangZone()
    system.debug.success('Все модули загружены');
    system.debug.success('--------------------');
    mp.events.delayInitialization = false;
});