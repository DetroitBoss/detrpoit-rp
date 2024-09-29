import {ISeller} from "./sellers/ISeller";
import {IViewStrategy} from "./viewStrategy/IViewStrategy";
import {colshapeHandle, colshapes} from "../checkpoints";
import {RentTimer} from "./RentTimer";
import {MarketItemEntity} from "../typeorm/entities/marketItem";
import {MarketItemDto} from "../../../shared/market/dtos/marketItemDto";
import {getItemName, inventoryShared} from "../../../shared/inventory";
import {MarketDto} from "../../../shared/market/dtos/marketDto";
import {CustomEvent} from "../custom.event";
import {MarketItemChangesDto} from "../../../shared/market/dtos/marketItemChangesDto";
import {marketItemsDb} from "./marketItemsDb";
import {ItemEntity} from "../typeorm/entities/inventory";
import {getMarketRentCompensation} from "../../../shared/market/config";
import {MarketHistoryEntity} from "../typeorm/entities/marketHistoryEntity";
import {UserEntity} from "../typeorm/entities/user";
import {MarketHistoryItemDto} from "../../../shared/market/dtos/marketHistoryItemDto";
import {BATTLE_PASS_SEASON} from "../../../shared/battlePass/main";
import {isBattlePassItem} from "../../../shared/battlePass/history-seasons";
import {donateStorage} from "../donateStorage";

export class TradeTent {
    public static pool = new Map<number, TradeTent>();
    private static _idGenerator: number = 0;

    public viewStrategy: IViewStrategy;
    public readonly id: number;
    private readonly interactColshape: colshapeHandle;

    public constructor(
        public readonly owner: PlayerMp,
        private readonly position: Vector3Mp,
        private readonly seller: ISeller,
        private readonly expandRentTimeCost: number,
        private readonly rentTimer: RentTimer,
        private readonly destroyHandler: () => void,
    ) {
        this.id = TradeTent._idGenerator++;

        const colshapePosition = new mp.Vector3(position.x, position.y, position.z - 0.95);
        this.interactColshape = colshapes.new(colshapePosition, 'Открыть список товаров', this.openMarket.bind(this), {
            type: 27,
            radius: 2
        });

        rentTimer.timeEndHandler = this.destroy.bind(this);

        TradeTent.pool.set(this.id, this);
    }

    public get timeLeftS() {
        return this.rentTimer.timeLeftS;
    }

    public get exists() {
        return TradeTent.pool.has(this.id);
    }

    public expandRentTime(addTimeS: number) {
        this.rentTimer.expandTime(addTimeS)
    }

    public callSeller(caller: PlayerMp) {
        this.seller.callToTent(caller);
    }

    public destroy(returnCompensation: boolean = false) {
        if (returnCompensation) {
            const compensation = getMarketRentCompensation(this.timeLeftS);
            this.owner.user.addMoney(compensation, false, 'Возврат за досрочное завершение аренды палатки');
        }

        this.moveItemsToStock();

        this.seller.destroy(true);
        this.interactColshape.destroy();
        this.rentTimer.destroy();

        this.destroyHandler();
        TradeTent.pool.delete(this.id);
    }

    private moveItemsToStock() {
        const items = marketItemsDb.getBySeller(this.owner);
        marketItemsDb.moveMarketItemsToStock(items);
        marketItemsDb.save(items);
    }

    public addMoney(money: number, soldItem: ItemEntity, soldItemAmount: number, buyerName: string) {
        const sellerPercents = this.seller.getSellsPercent();
        const ownerPercents = 100 - sellerPercents;

        const sellerMoney = Math.floor(money * (sellerPercents / 100));
        const ownerMoney = Math.floor(money * (ownerPercents / 100));

        this.seller.makePayment(sellerMoney);
        this.owner.user.addMoney(ownerMoney, true, 'Продажа предметов в торговой палатке');

        this.createHistoryItem(soldItem, soldItemAmount, ownerMoney, buyerName);
    }

    private createHistoryItem(item: ItemEntity, amount: number, moneyIncome: number, buyerName: string) {
        MarketHistoryEntity.insert({
            seller: this.owner.user.entity,
            itemConfigId: item.item_id,
            itemName: getItemName(item),
            count: amount,
            moneyIncome: moneyIncome,
            buyerName: buyerName
        })
    }

    public async openMarket(player: PlayerMp) {
        if (!this.viewStrategy) {
            return;
        }

        if (player === this.owner) {
            await this.openMarketAsOwner(player);
            return;
        }

        const items = this.viewStrategy.getItemsToShow(player)
            .map(marketItem => mapMarketItemDto(marketItem));

        const marketDto: MarketDto = {
            id: this.id,
            ownerName: this.owner.user.name,
            marketItems: items,
            isPolice: player.user.fractionData?.police
        }

        player.user.setGui('market', 'market:init', marketDto);
    }

    private async openMarketAsOwner(player: PlayerMp) {
        const historyItems = await getSellerHistoryItems(player.user.entity);

        const itemsInMarket = marketItemsDb
            .getBySeller(player)
            .map<MarketItemDto>(marketItem => mapMarketItemDto(marketItem));

        player.user.inventory
            .filter(item => getItemCanBeSold(item))
            .forEach(item => {
                const itemConfig = inventoryShared.get(item.item_id);

                if (itemConfig.canSplit) {
                    const itemInMarket = itemsInMarket.find(marketItem => marketItem.itemConfigId === item.item_id);
                    if (itemInMarket) {
                        itemInMarket.inventoryCount += item.count;
                        return;
                    }
                }

                itemsInMarket.push({
                    itemId: item.id,
                    itemConfigId: item.item_id,
                    itemName: getItemName(item),
                    price: 0,
                    count: 0,
                    inventoryCount: itemConfig.canSplit ? item.count : 1
                });
            });

        const marketDto: MarketDto = {
            id: this.id,
            ownerName: this.owner.user.name,
            marketItems: itemsInMarket,
            rentTimeS: this.rentTimer.timeLeftS,
            history: historyItems,
        }

        player.user.setGui('market', 'market:init', marketDto);
    }
}

async function getSellerHistoryItems(user: UserEntity) {
    return (await MarketHistoryEntity.find({
        where: (entity: MarketHistoryEntity) => entity.sellerId === user.id,
        order: { createDate: "DESC" },
        take: 15
    }))
        .map<MarketHistoryItemDto>(entity => {
            return {
                itemConfigId: entity.itemConfigId,
                itemName: entity.itemName,
                moneyIncome: entity.moneyIncome,
                buyerName: entity.buyerName,
                amount: entity.count
            }
        })
}

function mapMarketItemDto(marketItem: MarketItemEntity): MarketItemDto {
    const itemConfig = inventoryShared.get(marketItem.item.item_id);

    return {
        itemId: marketItem.item.id,
        itemConfigId: marketItem.item.item_id,
        itemName: getItemName(marketItem.item),
        price: marketItem.price,
        count: itemConfig.canSplit ? marketItem.item.count : 1,
        inventoryCount: 0
    }
}

function getItemCanBeSold(item: ItemEntity): boolean {
    const itemConfig = inventoryShared.get(item.item_id);
    if (itemConfig.blockMove) {
        return false;
    }

    if (isBattlePassItem(item.advancedString) || item.advancedString === 'BATTLE_PASS_CLOTHES') return false;
    if (donateStorage.isDonateItem(item)) return false;

    return true;
}

export function getTentById(id: number) {
    return TradeTent.pool.get(id);
}

export function getPlayerTent(player: PlayerMp) {
    return [...TradeTent.pool.values()]
        .find(tent => tent.owner === player);
}

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player.user) {
        return;
    }

    const tent = getPlayerTent(player);
    if (!tent) {
        return;
    }

    tent.destroy(true);
});
