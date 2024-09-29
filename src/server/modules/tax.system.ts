import {business} from "./business";
import {SELL_GOS_TAX_PERCENT} from "../../shared/economy";
import {houses} from "./houses";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {User} from "./user";
import {saveEntity} from "./typeorm";
import {Family} from "./families/family";
import {DAYLY_ADD_MONEY} from "../../shared/business";
import {warehouses} from "./warehouse";
import {WarehouseEntity} from "./typeorm/entities/warehouse";
import {BusinessEntity} from "./typeorm/entities/business";
import {agency} from "./houses/agency";


export const taxRun = async () => {
    await system.sleep(10000);

    if(!User.x2func.data[0].taxes) return;

    system.debug.info('----------------')
    system.debug.info('Списание налогов')

    let resultSum = 0;
    const businessToSave = business.data.map(businessEntity => {
        if (!businessEntity.userId) return;
        if (!businessEntity.price) return;

        const taxSum = businessEntity.taxDay
        resultSum += taxSum;
        if (taxSum * DAYLY_ADD_MONEY > 0)
            business.addMoney(businessEntity, taxSum * DAYLY_ADD_MONEY, `Прочие доходы`, false, true, false, false)

        businessEntity.tax -= taxSum;

        if (businessEntity.tax <= 0) {
            const returnSum = (businessEntity.price - ((businessEntity.price / 100) * SELL_GOS_TAX_PERCENT));

            const player = User.get(businessEntity.userId);
            if (player) {
                const user = player.user;
                user.addBankMoney(returnSum, true, `Изъятие бизнеса #${businessEntity.id} за неоплаченные налоги`, 'Налоговая служба', true)
                player.notify(`Ваш бизнес был изъят в пользу государства поскольку вы не оплатили налоги вовремя`, 'success')
            } else {
                User.addBankMoney(businessEntity.userId, returnSum, `Изъятие бизнеса ${businessEntity.id} за неоплаченные налоги`, 'Налоговая служба')
            }

            business.setOwner(businessEntity, null);
        }

        return businessEntity;
    })
        .filter(businessEntity => !!businessEntity);

    if (businessToSave.length > 0) {
        await Promise.all(businessToSave.map(biz => saveEntity(biz)))
    }

    system.debug.info(`Бизнесам выписаны налоги на сумму $${system.numberFormat(resultSum)}`)

    resultSum = 0
    houses.data.forEach(async (house) => {
        if (!house.userId) return;
        if (!house.price || house.price < 100) return;
        // UKRANIANS LAST JOIN
        const user = await User.getData(house.userId);
        if (user && user.online < 1645812000) return;
        //

        const taxSum = house.taxDay;
        resultSum += taxSum;
        house.tax -= taxSum;
        if (house.tax <= 0) {
            const returnSum = (house.price - ((house.price / 100) * SELL_GOS_TAX_PERCENT) - house.tax);

            if (house.forFamily) {
                const fam = Family.getByID(house.familyId)
                if (fam) {
                    fam.addMoney(returnSum, null, `Изъятие дома ${house.name} ${house.id} за неоплаченные налоги`)
                }
            } else {
                User.addBankMoney(house.userId, returnSum, `Изъятие дома ${house.name} ${house.id} за неоплаченные налоги`, 'Налоговая служба')
            }

            house.timeForPurchase = agency.getTimeForPurchase();
            houses.setOwner(house, null, false, true);
        } else {
            saveEntity(house);
        }
    })
    system.debug.info(`Домам выписаны налоги на сумму $${system.numberFormat(resultSum)}`)
    resultSum = 0

    const warehousesToSave = warehouses.list.map(warehouse => {
        if (warehouse.onSell) return;
        if (!warehouse.taxDay) return;

        warehouse.tax -= warehouse.taxDay;
        if (warehouse.tax <= 0)
            warehouse.sellToGos()

        return warehouse;
    })

    if(warehousesToSave.length > 0)
        await WarehouseEntity.save(warehousesToSave)
    
    system.debug.info('----------------')
}


CustomEvent.register('newDay', () => {
    taxRun();
})

CustomEvent.registerClient('tax:admin', (player) => {
    const user =  player.user;
    if(!user) return;
    if(!user.isAdminNow(6)) return;
    taxRun();
})