import {PURCHASEABLE_ANIMS} from "../anim";

export enum RewardType {
    COINS,
    MONEY,
    LUCKY_WHEEL,
    VEHICLE,
    CLOTH,
    VIP,
    EXP,
    DISCORD_ROLE,
    INVENTORY_ITEM,
    ANIMATION
}

export enum RewardRarity {
    COMMON,
    RARE,
    LEGENDARY
}

export abstract class BaseReward {
    type: RewardType
    rarity: RewardRarity
    image: string
    isSuperPrize: boolean
    name: string

    protected constructor(name: string, rarity: RewardRarity, type: RewardType, image: string, isSuperPrize: boolean) {
        this.name = name;
        this.rarity = rarity;
        this.type = type;
        this.image = image;
        this.isSuperPrize = isSuperPrize;
    }
}

export class CoinsReward extends BaseReward {
    public count: number

    constructor(name: string, rarity: RewardRarity, image: string, isSuperPrize: boolean, count: number) {
        super(name, rarity, RewardType.COINS, image, isSuperPrize);
        this.count = count;
    }
}

export class MoneyReward extends BaseReward {
    public count: number

    constructor(name: string, rarity: RewardRarity, image: string, isSuperPrize: boolean, count: number) {
        super(name, rarity, RewardType.MONEY, image, isSuperPrize);
        this.count = count;
    }
}

export class LuckyWheelReward extends BaseReward {
    constructor(name: string, rarity: RewardRarity, image: string, isSuperPrize: boolean) {
        super(name, rarity, RewardType.LUCKY_WHEEL, image, isSuperPrize);
    }
}

export class VehicleReward extends BaseReward {
    public vehicleModel: string;

    constructor(
        name: string,
        rarity: RewardRarity,
        image: string,
        isSuperPrize: boolean,
        vehicleModel: string
    ) {
        super(name, rarity, RewardType.VEHICLE, image, isSuperPrize);
        this.vehicleModel = vehicleModel;
    }
}

export class ClothReward extends BaseReward {
    public maleClothName: string
    public femaleClothName: string
    public maleClothComponentName: string | string[]
    public femaleClothComponentName: string | string[]
    public maleImage: string
    public femaleImage: string

    constructor(
        name: string,
        rarity: RewardRarity,
        maleImage: string,
        femaleImage: string,
        isSuperPrize: boolean,
        maleClothName: string,
        femaleClothName: string,
        maleClothComponentName: string | string[],
        femaleClothComponentName: string | string[]
    ) {
        super(name, rarity, RewardType.CLOTH, maleImage, isSuperPrize);

        this.maleClothName = maleClothName;
        this.femaleClothName = femaleClothName;
        this.maleClothComponentName = maleClothComponentName;
        this.femaleClothComponentName = femaleClothComponentName;
        this.maleImage = maleImage;
        this.femaleImage = femaleImage;
    }
}

export class VipReward extends BaseReward {
    public vipType: string
    public vipDays: number

    constructor(
        name: string,
        rarity: RewardRarity,
        image: string,
        isSuperPrize: boolean,
        vipType: string,
        vipDays: number
    ) {
        super(name, rarity, RewardType.VIP, image, isSuperPrize);

        this.vipType = vipType;
        this.vipDays = vipDays;
    }
}

export class ExpReward extends BaseReward {
    public count: number

    constructor(
        name: string,
        rarity: RewardRarity,
        image: string,
        isSuperPrize: boolean,
        count: number
    ) {
        super(name, rarity, RewardType.EXP, image, isSuperPrize);

        this.count = count;
    }
}

export class InventoryItemReward extends BaseReward {
    public itemId: number
    public count: number

    constructor(
        name: string,
        rarity: RewardRarity,
        image: string,
        isSuperPrize: boolean,
        itemId: number,
        count: number
    ) {
        super(name, rarity, RewardType.INVENTORY_ITEM, image, isSuperPrize);
        this.itemId = itemId;
        this.count = count;
    }
}

export class AnimationReward extends BaseReward {
    /** ID анимации из PURCHASEABLE_ANIMS */
    public animationId: number

    constructor(
        animationId: number,
        rarity: RewardRarity,
        image: string,
        isSuperPrize: boolean,
    ) {

        super(PURCHASEABLE_ANIMS.find(a => a.id === animationId)?.name ?? "!!!Неверный ID!!!", rarity, RewardType.ANIMATION, image, isSuperPrize);
        this.animationId = animationId
    }
}