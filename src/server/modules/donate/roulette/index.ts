import { CustomEvent } from "../../custom.event";
import { RouletteManager } from "./rouletteManager";
import { gui } from "../../gui";
import { drops, raritiesByRouletteType, RarityType, SPIN_COSTS } from "../../../../shared/donate/donate-roulette/main";
import { RouletteType } from "../../../../shared/donate/donate-roulette/enums";
import { RealDropData } from '../../../../shared/donate/donate-roulette/Drops/realDrop'
import { InventoryDropData } from '../../../../shared/donate/donate-roulette/Drops/inventoryDrop'
import { DropDataBase } from '../../../../shared/donate/donate-roulette/Drops/dropBase'
import { User } from '../../user'
import { writeSpecialLog } from '../../specialLogs'

gui.chat.registerCommand("setdrop", (player, targetIdStr, dropIdStr) => {
    const user = player.user;
    if (!user) return;
    if (!user.isAdminNow(7)) return;
    const id = parseInt(targetIdStr);
    const dropId = parseInt(dropIdStr);
    
    if (isNaN(id) || id < 1 || id > 99999999) return;
    if (isNaN(dropId) || dropId < 1 || dropId > 99999999) return;
    const target = User.get(id)
    if (target) {
        writeSpecialLog(`setdrop ${dropId}`, player, target.user?.id)
        target.user.nextDonateRoulleteDrop = dropId
    }
})

CustomEvent.registerCef('donateStorage:request', (player: PlayerMp) => {
    if (!player.user) return;
    RouletteManager.sendStorageInfoToPlayer(player);
})

CustomEvent.registerCef('droulette:activateDrop', (player: PlayerMp, dropId: number) => {
    if (!player.user) return;
    RouletteManager.activateDrop(player, dropId);
    //await player.user.entity.save();
})
CustomEvent.registerCef('droulette:activateDrops', (player: PlayerMp, ids: number[]) => {
    if (!player.user) return;
    ids.forEach(id => RouletteManager.activateDrop(player, id))
    //await player.user.entity.save();
})

// Удалить дроп из хранилища без активации (функционал для админов)
CustomEvent.registerCef('droulette:removeDrop', (player: PlayerMp, dropId: number) => {
    if (!player.user) return;
    RouletteManager.deleteDrop(player, dropId);
    //await player.user.entity.save();
})

CustomEvent.registerCef('droulette:sellDrops', (player: PlayerMp, ids: number[]) => {
    if (!player.user) return;
    ids.forEach(id => RouletteManager.sellDrop(player, id))
})

CustomEvent.registerCef('droulette:request', (player: PlayerMp, type: string, count: number) => {
    if (!player.user) return;
    const totalSpinCost = SPIN_COSTS[type] * count
    if (player.user.donate_money < totalSpinCost) {
        player.notify(`Недостаточно Detroit coins для прокрутки`, 'error');
        return;
    }
    
    const randomDropIds: number[] = [];
    for (let i = 0; i < count; i++) {
        const randomDropId = RouletteManager.getRandomDrop(player, type as RouletteType)?.dropId
        randomDropIds.push(randomDropId);
        RouletteManager.addDrop(player, randomDropId);
    }

    console.log(randomDropIds)
    player.user.removeDonateMoney(totalSpinCost, 'roulette:spin');
    CustomEvent.triggerCef(player, 'mainmenu:coins', player.user.donate_money);
    CustomEvent.triggerCef(player, 'droulette:spin', randomDropIds);
})
//
// const array: Rarity[] = [];
// for (let i = 0; i < 25000; i++){
//     array.push(RouletteManager.getRandomRarity(null));
//     RouletteManager.getRandomDrop(null, RouletteType.LUXE)
// }
//
// console.log('Обычный: ', array.filter(r => r.type === RarityType.COMMON).length)
// console.log('Редкий: ', array.filter(r => r.type === RarityType.RARE).length)
// console.log('Уникальный: ', array.filter(r => r.type === RarityType.UNIQUE).length)
// console.log('Особенный: ', array.filter(r => r.type === RarityType.SPECIAL).length)
// console.log('Легендарный: ', array.filter(r => r.type === RarityType.LEGENDARY).length)