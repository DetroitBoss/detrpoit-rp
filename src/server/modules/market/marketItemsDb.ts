import {MarketItemEntity} from "../typeorm/entities/marketItem";
import {system} from "../system";
import {STOCK_KEEP_MAX_TIME_MINUTES} from "../../../shared/market/config";
import {ItemEntity} from "../typeorm/entities/inventory";
import {inventory} from "../inventory";

const pool: MarketItemEntity[] = [];
let initialized = false;

export const marketItemsDb = {
    getBySeller: (seller: PlayerMp): MarketItemEntity[] => {
        return pool.filter(entity =>
            entity.sellerId === seller.dbid
            && !entity.deleteStockTime);
    },

    getBySellerOnStock: (seller: PlayerMp): MarketItemEntity[] => {
        return pool.filter(entity => entity.sellerId === seller.dbid
            && entity.deleteStockTime);
    },

    getAllStockItems: () => {
        return pool.filter(entity => entity.deleteStockTime);
    },

    moveAllMarketItemsToStock: async () => {
        system.debug.info('Moving all market items to stock');
        const items = pool
            .filter(item => !item.deleteStockTime);

        items.forEach(item => {
            item.deleteStockTime = system.timestamp + STOCK_KEEP_MAX_TIME_MINUTES * 60
        });

        await MarketItemEntity.save(items);
        system.debug.success(`Moved ${items.length} market items to stock`);
    },

    moveMarketItemsToStock: (marketItems: MarketItemEntity[], keepTimeMinutes?: number) => {
        if (!keepTimeMinutes) {
            keepTimeMinutes = STOCK_KEEP_MAX_TIME_MINUTES;
        }

        marketItems.forEach(item => {
            item.deleteStockTime = system.timestamp + keepTimeMinutes * 60;
        });
    },

    create: (player: PlayerMp, item: ItemEntity, price: number): MarketItemEntity => {
        const marketItem = new MarketItemEntity();
        marketItem.item = item;

        if (item.hasId()) {
            marketItem.itemId = item.id;
        }
        marketItem.seller = player.user.entity;
        marketItem.price = price;

        pool.push(marketItem);
        return marketItem;
    },

    delete: (marketItem: MarketItemEntity) => {
        const idx = pool.findIndex(entity => entity === marketItem);
        if (idx === -1) {
            return;
        }

        pool.splice(idx, 1);
        marketItem.remove();
    },

    save: async (marketItems: MarketItemEntity[]) => {
        const nonCreatedInventoryItems = marketItems
            .filter(entity => !entity.item.hasId())
            .map(entity => entity.item);


        await ItemEntity.save(nonCreatedInventoryItems);
        marketItems.forEach(entity => entity.itemId = entity.item.id);
        await MarketItemEntity.save(marketItems);
    },

    init: async () => {
        if (initialized) {
            return;
        }

        initialized = true;

        const marketItems = await MarketItemEntity.find();
        marketItems.forEach((entity) => {
            entity.item = inventory.get(entity.itemId);
            pool.push(entity);
        });

        system.debug.success(`Loaded ${marketItems.length} market items`);
        await marketItemsDb.moveAllMarketItemsToStock();
    }
}
