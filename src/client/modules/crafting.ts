import {CRAFTING_TABLES} from "../../shared/crafting";
import {system} from "./system";

CRAFTING_TABLES.map((table, tableid) => {
    if (table.blipid) {
        setTimeout(() => {
            table.pos.map((q, i) => {
                system.createDynamicBlip(`crafting_${tableid}_${i}`, table.blipid, table.blipcolor, q, table.name, {
                    fraction: table.fractions
                })
            })
        }, 1000)
    }
});