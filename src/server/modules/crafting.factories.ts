import {CraftItemFactoryMethod, TableData, CraftType, CRAFTING_ITEMS} from "../../shared/crafting";
import {ItemEntity} from "./typeorm/entities/inventory";
import {dress} from "./customization";
import {ARMOR_ITEM_ID} from "../../shared/inventory";
import {ArmorNames} from "../../shared/cloth";

const armorNamesByFactionId = new Map<number, string>([
    [18, ArmorNames.PurpleArmor],
    [19, ArmorNames.GreenArmor],
    [20, ArmorNames.BlueArmor],
    [21, ArmorNames.RedArmor],
    [22, ArmorNames.YellowArmor],
    [23, ArmorNames.YakuzaArmor],
    [24, ArmorNames.RMArmor],
    [25, ArmorNames.LCNArmor],
]);

const factoryMethods = new Map<CraftType, CraftItemFactoryMethod>([
    [
        'armor',
        (table, tableIndex): Partial<ItemEntity> => {
            const armorName = armorNamesByFactionId.get(table.fractions[tableIndex]);
            const dressEntity = dress.data
                .find(dressItem => dressItem.name === armorName);

            if (!dressEntity) {
                throw new Error(`Не найден объект одежды бронежилета для фракции ${table.fractions[tableIndex]}`);
            }

            return {
                item_id: ARMOR_ITEM_ID,
                advancedNumber: dressEntity.id,
                serial: dressEntity.name,
                count: 50
            }
        }
    ]
]);


CRAFTING_ITEMS
    .forEach(item => {
        if (factoryMethods.has(item.type)) {
            item.itemFactoryMethod = factoryMethods.get(item.type);
        }
    });
