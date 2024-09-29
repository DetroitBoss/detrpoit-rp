import {BATTLE_PASS_SEASON} from "../../../shared/battlePass/main";
import {
    AnimationReward,
    ClothReward,
    CoinsReward,
    ExpReward,
    InventoryItemReward,
    MoneyReward,
    RewardType,
    VehicleReward,
    VipReward
} from "../../../shared/battlePass/rewards";
import {User} from "../user";
import {system} from "../system";
import {Vehicle} from "../vehicles";
import {LicenseName} from "../../../shared/licence";
import {dress} from "../customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../../shared/cloth";
import {VipId} from "../../../shared/vip";
import {CustomEvent} from "../custom.event";
import {battlePassStorage} from "./storage";
import {PURCHASEABLE_ANIMS} from "../../../shared/anim";

const dressConfigCategoryToItemId = new Map<number, number>([
    [107, 959],
    [106, 957],
    [102, 956],
    [101, 955],
    [100, 954],
    [7, 958],
    [6, 953],
    [4, 952],
    [3, 951],
    [1, 950]
]);

export class RewardManager {
    public static give(user: User, level: number): void {
        const reward = BATTLE_PASS_SEASON.rewards[level];

        if (!reward) return user.notify('Произошла ошибка при выдаче приза');

        if (reward.type === RewardType.COINS) {
            this.coins(user, level, reward as CoinsReward);
        } else if (reward.type === RewardType.MONEY) {
            this.money(user, level, reward as MoneyReward);
        } else if (reward.type === RewardType.LUCKY_WHEEL) {
            this.luckyWheel(user, level);
        } else if (reward.type === RewardType.VEHICLE) {
            this.vehicle(user, level, reward as VehicleReward);
        } else if (reward.type === RewardType.CLOTH) {
            this.cloth(user, level, reward as ClothReward);
        } else if (reward.type === RewardType.VIP) {
            this.vip(user, level, reward as VipReward);
        } else if (reward.type === RewardType.EXP) {
            this.exp(user, level, reward as ExpReward);
        } else if (reward.type === RewardType.INVENTORY_ITEM) {
            this.inventoryItem(user, level, reward as InventoryItemReward)
        } else if (reward.type === RewardType.ANIMATION) {
            this.animation(user, level, reward as AnimationReward);
        } else {
            user.notify('Произошла ошибка при выдаче приза');
        }
    }

    private static dropReceived(user: User, level: number) {
        const arr = user.battlePass.battlePassEntity.receiveRewards;
        arr.push(level);
        user.battlePass.battlePassEntity.receiveRewards = arr;
        CustomEvent.triggerCef(user.player, 'battlePass:updateReceivedRewards',
            user.battlePass.battlePassEntity.receiveRewards);

        battlePassStorage.updatePlayerStorage(user.player);
        user.notify(`Приз получен - ${BATTLE_PASS_SEASON.rewards[level].name}`, 'success');
        user.player.outputChatBox(`Вы получили приз - ${BATTLE_PASS_SEASON.rewards[level].name}`);

        user.battlePass.battlePassEntity.save();
    }

    private static coins(user: User, level: number, reward: CoinsReward): void {
        user.addDonateMoney(reward.count, 'coinsFromBattlePass');
        this.dropReceived(user, level);
    }

    private static money(user: User, level: number, reward: MoneyReward): void {
        user.addMoney(reward.count, true, 'moneyFromBattlePass');
        this.dropReceived(user, level);
    }

    private static luckyWheel(user: User, level: number): void {
        if (system.timestamp - user.account.lucky_wheel > 86400)
            return user.notify('У вас уже имеется прокрут колеса');

        user.account.lucky_wheel = 0;
        user.account.save();
        this.dropReceived(user, level);
    }

    private static vehicle(user: User, level: number, reward: VehicleReward): void {
        const player = user.player,
            vehConf = Vehicle.getVehicleConfig(reward.vehicleModel);

        if (!vehConf) {
            player.notify('Данную машину невозможно активировать. Обратитесь к администрации', 'error');
            return;
        }
        if (vehConf.license && !user.haveActiveLicense(vehConf.license)) {
            player.notify(`Чтобы получить ${vehConf.name} необходимо иметь активную лицензию на ${LicenseName[vehConf.license]}`, "error");
            return;
        }
        if (user.myVehicles.length >= user.current_vehicle_limit) {
            player.notify(`Вы можете иметь не более ${user.current_vehicle_limit} ТС.
             Дополнительные слоты можно приобрести в личном кабинете`, "error");
            return;
        }

        Vehicle.createNewDatabaseVehicle(
            player,
            vehConf.id,
            {r: 0, g: 0, b: 0},
            {r: 0, g: 0, b: 0},
            new mp.Vector3(0, 0, 0),
            0,
            Vehicle.fineDimension,
            vehConf.cost,
            1)

        this.dropReceived(user, level);
    }

    private static cloth(user: User, level: number, reward: ClothReward): void {
        let player = user.player,
            clothName = user.male ? reward.maleClothName : reward.femaleClothName,
            clothComponentName: string | string[] = user.male ? reward.maleClothComponentName : reward.femaleClothComponentName;
        
        let dressCfgs = dress.data.filter(q => q.name === clothName);
        if (!dressCfgs) return;

        if (dressCfgs.length > 1 && dressCfgs.some(dress => dress.male === user.is_male)) {
            dressCfgs = dressCfgs.filter(dress => dress.male === user.is_male);
        }

        if (typeof clothComponentName !== "string")
            clothComponentName = clothComponentName[Math.floor(Math.random() * clothComponentName.length)];


        const dressCfg = dressCfgs[0];
        // @ts-ignore
        const variationIndex = dressCfg.data.findIndex(dressComponents => dressComponents.some(component => component.name === clothComponentName));
        const variation = (variationIndex === -1) ? 0 : variationIndex;
        const advancedNumber = dressCfg.id + variation * CLOTH_VARIATION_ID_MULTIPLER;

        player.user.giveItem({
            item_id: dressConfigCategoryToItemId.get(dressCfg.category),
            serial: dressCfg.name,
            advancedNumber: advancedNumber,
            advancedString: BATTLE_PASS_SEASON.id
        }, true);

        this.dropReceived(user, level);
    }

    private static vip(user: User, level: number, reward: VipReward): void {
        if (user.vip && user.vip !== reward.vipType && system.timestamp < user.vip_end) {
            user.notify(`У вас уже есть VIP другого уровня`, "error")
            return;
        }
        user.giveVip(reward.vipType as VipId, reward.vipDays);
        user.save();
        this.dropReceived(user, level);
    }

    private static exp(user: User, level: number, reward: ExpReward): void {
        user.giveExp(reward.count);
        this.dropReceived(user, level);
    }

    /*
    private static discordRole(): void {

    }
     */

    private static inventoryItem(user: User, level: number, reward: InventoryItemReward): void {
        user.giveItem({
            item_id: reward.itemId,
            count: reward.count,
            advancedString: BATTLE_PASS_SEASON.id
        }, true);

        this.dropReceived(user, level);
    }

    private static async animation(user: User, level: number, reward: AnimationReward): Promise<void> {
        const anim = PURCHASEABLE_ANIMS.find(a => a.id == reward.animationId)
        if (!anim) {
            user.notify("Недоступная анимация. Обратитесь к администрации", "error")
            return
        }
        await user.animation.givePurchaseableAnimation(reward.animationId)
        user.notify(`Вы получили анимацию ${anim.name}`, "success")
        this.dropReceived(user, level);
    }
}