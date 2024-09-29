import {drops, rarities, raritiesByRouletteType} from "../../../../shared/donate/donate-roulette/main";
import {createDropByData} from "./dropFactory";
import {DropBase} from "./dropBase";
import {Rarity} from "../../../../shared/donate/donate-roulette/rarity";
import {DropSellType, RouletteType} from "../../../../shared/donate/donate-roulette/enums";
import {CustomEvent} from "../../custom.event";
import { getRandomInt, randomArrayElement } from "../../../../shared/arrays";
import { RealDropData } from '../../../../shared/donate/donate-roulette/Drops/realDrop'
import { InventoryDropData } from '../../../../shared/donate/donate-roulette/Drops/inventoryDrop'
import { DropDataBase } from '../../../../shared/donate/donate-roulette/Drops/dropBase'

export class RouletteManager {
    
    public static activateDrop(player: PlayerMp, dropId: number): void {
        if (!player.user.entity.rouletteStorage.includes(dropId)) return;
        
        const dropData = drops.find(d => d.dropId === dropId);
        if (!dropData) return;

        player.user.log("DonateMoney", `dropUse (${dropData.dropId})`);
        const drop = createDropByData(dropData);
        if (!drop.activate(player)) {
            player.notify('Приз не может быть активирован')
            return;
        }
        
        this.deleteDrop(player, drop.dropId)
    }
    
    public static addDrop(player: PlayerMp, dropId: number): void {
        player.user.log("DonateMoney", `dropAdd (${dropId})`);
        player.user.entity.rouletteStorage = [...player.user.entity.rouletteStorage, dropId]
    }

    public static deleteDrop(player: PlayerMp, dropId: number): void {
        const old = [...player.user.entity.rouletteStorage]
        const element = old.find(i => i === dropId);

        old.splice(old.indexOf(element), 1);
        player.user.entity.rouletteStorage = old;
    }

    public static sellDrop(player: PlayerMp, dropId: number): void {
        if (!player.user.entity.rouletteStorage.includes(dropId)) return;
        
        const dropData = drops.find(d => d.dropId === dropId)
        if (!dropData) return;

        if (dropData.sellType === DropSellType.DOLLARS)
            player.user.addMoney(
                dropData.sellPrice, false, `Клиент (${player.dbid}) продал дроп с рулетки(${dropData.dropId})`
            );
        else player.user.addDonateMoney(
            dropData.sellPrice, `Клиент (${player.dbid}) продал дроп с рулетки(${dropData.dropId}) за донат`
        );
        
        this.deleteDrop(player, dropId);
        CustomEvent.triggerCef(player, 'mainmenu:coins', player.user.donate_money);
    }
    
    public static getRandomDrop(player: PlayerMp, rouletteType: RouletteType): DropBase {
        if (player.user.nextDonateRoulleteDrop) {
           const nextDrop = player.user.nextDonateRoulleteDrop
           player.user.nextDonateRoulleteDrop = undefined

           return createDropByData(drops.find(d => d.dropId == nextDrop))
        }
        const randomRarity = this.getRandomRarity(raritiesByRouletteType.get(rouletteType));
        const dropsByRarities = drops
            .filter(d => d.rarity === randomRarity.type && 
                d.roulette.includes(rouletteType) &&
                this.canDrop(d));
        
        const randomDrop = randomArrayElement(dropsByRarities);
        
        return createDropByData(randomDrop);
    }

    private static canDrop(drop: DropDataBase): boolean {
        return (drop instanceof RealDropData || drop instanceof InventoryDropData) ? drop.canDrop : true
    }
    
    public static getRandomRarity(rarities: Rarity[]): Rarity {
        let totalChance = rarities[0].dropChance;
        
        const randomNumber = Math.random();
        rarities.map(r => r.dropChance).forEach(chance => {
            if (chance >= randomNumber) {
                totalChance = chance;
                return;
            }
        })
        
        return rarities.find(r => r.dropChance === totalChance);
    }
    
    public static sendStorageInfoToPlayer(player: PlayerMp) {
        CustomEvent.triggerCef(player, 'donateStorage:set', player.user.entity.rouletteStorage)
    }
}