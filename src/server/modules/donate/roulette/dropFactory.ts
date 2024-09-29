import {DropDataBase} from "../../../../shared/donate/donate-roulette/Drops/dropBase";
import { RealDropData } from "../../../../shared/donate/donate-roulette/Drops/realDrop";
import { RealDrop } from "./realDrop";
import {DropBase} from "./dropBase";
import {VipDropData} from "../../../../shared/donate/donate-roulette/Drops/vipDrop";
import {VipDrop} from "./vipDrop";
import {InventoryDropData} from "../../../../shared/donate/donate-roulette/Drops/inventoryDrop";
import {InventoryDrop} from "./inventoryDrop";
import {VehicleDropData} from "../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import {VehicleDrop} from "./vehicleDrop";
import {PlateDrop} from "./plateDrop";
import {PlateDropData} from "../../../../shared/donate/donate-roulette/Drops/plateDrop";
import {MoneyDrop} from "./moneyDrop";
import {MoneyDropData} from "../../../../shared/donate/donate-roulette/Drops/moneyDrop";
import {XpDropData} from "../../../../shared/donate/donate-roulette/Drops/xpDrop";
import {ExpDrop} from "./expDrop";
import {CoinsDropData} from "../../../../shared/donate/donate-roulette/Drops/coinsDrop";
import {CoinsDrop} from "./coinsDrop";
import {DressDropData} from "../../../../shared/donate/donate-roulette/Drops/dressDrop";
import {DressDrop} from "./dressDrop";
import {ArmorDropData} from "../../../../shared/donate/donate-roulette/Drops/armorDrop";
import {ArmorDrop} from "./armorDrop";

export const createDropByData = (dropData: DropDataBase) : DropBase => {
    if (dropData instanceof RealDropData) {
        return new RealDrop(dropData)
    }
    else if (dropData instanceof VipDropData) {
        return new VipDrop(dropData)
    }
    else if (dropData instanceof InventoryDropData) {
        return new InventoryDrop(dropData)
    }
    else if (dropData instanceof VehicleDropData) {
        return new VehicleDrop(dropData)
    }
    else if (dropData instanceof PlateDropData) {
        return new PlateDrop(dropData)
    }
    else if (dropData instanceof MoneyDropData) {
        return new MoneyDrop(dropData)
    }
    else if (dropData instanceof XpDropData) {
        return new ExpDrop(dropData)
    }
    else if (dropData instanceof CoinsDropData) {
        return new CoinsDrop(dropData)
    }
    else if (dropData instanceof DressDropData) {
        return new DressDrop(dropData)
    }
    else if (dropData instanceof ArmorDropData) {
        return new ArmorDrop(dropData);
    }
}