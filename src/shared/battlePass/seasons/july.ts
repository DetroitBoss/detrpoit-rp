import {
    AnimationReward,
    ClothReward,
    CoinsReward,
    ExpReward,
    InventoryItemReward,
    LuckyWheelReward,
    MoneyReward,
    RewardRarity,
    VipReward
} from "../rewards";
import {IBattlePassSeason} from "../season";
import {FarmTaskConfig, FishingTaskConfig, HuntTaskConfig, JobTaskConfig} from "../tasks";

export const JULY_SEASON: IBattlePassSeason = {
    id: 'july-season',
    name: 'Июльский сезон',
    levelExp: 1001,
    everyDayExp: {
        time: 2,
        exp: 250
    },
    levelPrice: 500,
    endTime: 1664759700,
    battlePassCost: 4000,
    discount: {
        expires: 1659517200,
        specialPrice: 3000

    },
    rewards:[
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(1, RewardRarity.LEGENDARY, "anim", false),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new ClothReward("Nike white кофта", RewardRarity.RARE, 'Nike_1','Nike_1', false, 'Nike white кофта M', 'Nike white кофта', 'Белый', 'Белый'),

        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(2, RewardRarity.LEGENDARY, "anim", false),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 25000),
        new ClothReward("Nike white штаны", RewardRarity.LEGENDARY, 'Nike_2','Nike_2', false, 'Nike white штаны M', 'Nike white штаны', 'Белый', 'Белый'),

        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 30000),
        new ClothReward("Revenge панама", RewardRarity.LEGENDARY, 'Revenge_1','Revenge_1', true, 'Revenge панама M', 'Revenge панама', 'Зеленый', 'Зеленый'),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(3, RewardRarity.LEGENDARY, "anim", false),
        new ClothReward("Revenge кофта", RewardRarity.LEGENDARY, 'Revenge_2','Revenge_2', true, 'Revenge кофта M', 'Revenge кофта', 'Зеленый', 'Зеленый'),

        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD1', false, 'Diamond', 7),
        new ClothReward("Revenge шорты", RewardRarity.LEGENDARY, 'Revenge_3','Revenge_3', true, 'Revenge шорты M', 'Revenge шорты', 'Зеленый', 'Зеленый'),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 30000),
        new ClothReward("Revenge кеды", RewardRarity.RARE, 'Revenge_4','Revenge_4', true, 'Revenge кеды M', 'Revenge кеды', 'Зеленый', 'Зеленый',),

        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 5),
        new ClothReward("Onyx black панама", RewardRarity.RARE, 'black_1','black_1', true, 'Onyx black панама M', 'Onyx black панама', 'Black', 'Black',),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 15000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Onyx black кофта", RewardRarity.LEGENDARY, 'black_2','black_2', true, 'Onyx black кофта M', 'Onyx black кофта','Black','Black'),

        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 5),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new ClothReward("Onyx black шорты", RewardRarity.LEGENDARY, 'black_3','black_3', true, 'Onyx black шорты M', 'Onyx black шорты','Black','Black'),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 17000),
        new InventoryItemReward("Золотой камуфляж", RewardRarity.RARE, 'camo1',  false, 1604, 1),
        new ClothReward("Onyx black кеды", RewardRarity.LEGENDARY, 'black_4','black_4', true, 'Onyx black кеды M', 'Onyx black кеды','Black','Black'),

        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 50),
        new ClothReward("ZXC кофта", RewardRarity.LEGENDARY, 'ZXC_1','ZXC_1', true, 'ZXC кофта M', 'ZXC кофта','Черный','Черный'),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new ClothReward("ZXC штаны", RewardRarity.LEGENDARY, 'ZXC_2','ZXC_2', true, 'ZXC штаны M', 'ZXC штаны','Черный','Черный'),

        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 3),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new ClothReward("ZXC шорты", RewardRarity.LEGENDARY, 'ZXC_3','ZXC_3', true, 'ZXC шорты M', 'ZXC шорты','Черный','Черный'),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD1', false, 'Diamond', 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new AnimationReward(4, RewardRarity.LEGENDARY, "anim", false),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new ClothReward("Двойная бандана желтая", RewardRarity.LEGENDARY, 'ban_1','ban_1', false, 'Двойная бандана желтая M', 'Двойная бандана желтая','Желтая','Желтая'),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("LV black шарф", RewardRarity.LEGENDARY, 'scarf_1','scarf_1', false, 'LV black шарф M', 'LV black шарф','Black','Black'),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new InventoryItemReward("Рюкзак разгрузочный черный", RewardRarity.LEGENDARY, 'backpack_1',  true, 2146, 1),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new AnimationReward(5, RewardRarity.LEGENDARY, "anim", false),


        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new InventoryItemReward("Рюкзак разгрузочный белый", RewardRarity.LEGENDARY, 'backpack_2',  true, 2147, 1),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(6, RewardRarity.LEGENDARY, "anim", false),


        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new InventoryItemReward("Феерверки", RewardRarity.RARE, 'fire1',  false, 868, 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 11000),
        new InventoryItemReward("Феерверки", RewardRarity.RARE, 'fire1',  false, 868, 3),
        new AnimationReward(7, RewardRarity.LEGENDARY, "anim", false),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 5),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 11000),
        new ClothReward("Air Jordan black", RewardRarity.LEGENDARY, 'Jordan_1','Jordan_1', false, 'Air Jordan black M', 'Air Jordan black','Черный','Черный'),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(8, RewardRarity.LEGENDARY, "anim", false),





        new InventoryItemReward("Зелье жука броненосца", RewardRarity.RARE, 'z1',  false, 10003, 2),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new ClothReward("Off White black", RewardRarity.LEGENDARY, 'Off_1','Off_1', false, 'Off White black M', 'Off White black','Черный','Черный'),
        new InventoryItemReward("Зелье жука броненосца", RewardRarity.RARE, 'z2',  false, 10009, 3),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new AnimationReward(9, RewardRarity.LEGENDARY, "anim", false),






        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 7),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 12),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 12),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 100),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new AnimationReward(10, RewardRarity.LEGENDARY, "anim", false),





        new MoneyReward("Деньги", RewardRarity.RARE, 'money2', false, 20000),
        new MoneyReward("Деньги", RewardRarity.RARE, 'money2', false, 20000),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 7),
        new AnimationReward(11, RewardRarity.LEGENDARY, "anim", false),



        new MoneyReward("Деньги", RewardRarity.RARE, 'money3', false, 50000),
        new AnimationReward(12, RewardRarity.LEGENDARY, "anim", false),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 7),
        new AnimationReward(13, RewardRarity.LEGENDARY, "anim", false)
    ],
    globalTasks:[
        new JobTaskConfig(-1, 'Поработать электриком', 'Починить щитки', 2000, 1700, 'electric' ),
        new JobTaskConfig(-1, 'Поработать водителем', 'Проехать по маршруту', 700, 1700, 'bus' ),
        new FishingTaskConfig(-1, 'Поймайте рыбу', 'Поймать чебака', 150, 1700, 9210 ),
        new HuntTaskConfig(-1, 'Поохотится', 'Освеживать кабана', 80, 1700, 830 ),
        new FarmTaskConfig(-1, 'Поработайте на ферме', 'Посадить картофель', 2000, 1700, 7000, true ),
        new JobTaskConfig(-1, 'Поработать инкасстаром', 'Соберите деньги во многих местах', 500, 1700, 'collector' ),
        new JobTaskConfig(-1, 'Постройте квартиру', 'Поработайте на стройке квартиры', 1200, 1700, 'apartmentRepair' ),
        new JobTaskConfig(-1, 'Поработайте аквалангистом', 'Откройте сундуки', 100, 1700, 'diving' ),
        new FarmTaskConfig(-1, 'Поработайте на ферме', 'Соберите морковь', 2000, 1700, 7021, false ),
        new HuntTaskConfig(-1, 'Поохотится', 'Освеживать койота', 80, 1700, 831 ),
    ],
    basicTasks:[
        new JobTaskConfig(0, 'Поработать электриком', 'Починить щитки', 60, 450, 'electric' ),
        new JobTaskConfig(1, 'Поработать водителем', 'Проехать по маршруту', 30, 450, 'bus' ),
        new FishingTaskConfig(2, 'Поймайте рыбу', 'Поймать чебака', 18, 450, 9210 ),
        new HuntTaskConfig(3, 'Поохотится', 'Освеживать кабана', 5, 450, 830 ),
        new FarmTaskConfig(4, 'Поработайте на ферме', 'Посадить картофель', 40, 450, 7000, true ),
        new JobTaskConfig(5, 'Поработать таксистом', 'Выполните 10 заказов от людей', 10, 450, 'taxi' ),
        new JobTaskConfig(6, 'Поработать инкасстаром', 'Соберите деньги', 15, 450, 'collector' ),
        new JobTaskConfig(7, 'Постройте квартиру', 'Поработайте на стройке квартиры', 40, 450, 'apartmentRepair' ),
        new JobTaskConfig(8, 'Поработайте аквалангистом', 'Откройте сундук', 5, 450, 'diving' ),
        new FarmTaskConfig(9, 'Поработайте на ферме', 'Посадить морковь', 45, 450, 7001, true ),
        new FarmTaskConfig(10, 'Поработайте на ферме', 'Соберите морковь', 30, 450, 7021, false ),
        new HuntTaskConfig(11, 'Поохотится', 'Освеживать койота', 2, 450, 831 ),
        new FarmTaskConfig(12, 'Поработайте на ферме', 'Посадить помидоры', 90, 450, 7002, true ),
        new FarmTaskConfig(12, 'Поработайте на ферме', 'Собрать помидоры', 80, 450, 7022, false ),
        new FarmTaskConfig(13, 'Поработайте на ферме', 'Посадить огурцы', 60, 450, 7003, true ),
        new FarmTaskConfig(14, 'Поработайте на ферме', 'Собрать огурцы', 32, 450, 7023, false ),
        new FarmTaskConfig(15, 'Поработайте на ферме', 'Посадить редьку', 43, 450, 7004, true ),
        new FarmTaskConfig(16, 'Поработайте на ферме', 'Собрать редьку', 54, 450, 7024, false ),
        new FarmTaskConfig(17, 'Поработайте на ферме', 'Посадить лук', 58, 450, 7005, true ),
        new FarmTaskConfig(18, 'Поработайте на ферме', 'Собрать лук', 56, 450, 7025, false ),
        new FarmTaskConfig(19, 'Поработайте на ферме', 'Посадить клубнику', 55, 450, 7006, true ),
        new FarmTaskConfig(20, 'Поработайте на ферме', 'Собрать клубнику', 50, 450, 7026, false ),
        new FarmTaskConfig(21, 'Поработайте на ферме', 'Посадить арбузы', 70, 450, 7007, true ),
        new FarmTaskConfig(22, 'Поработайте на ферме', 'Собрать арбузы', 45, 450, 7027, false ),
        new FarmTaskConfig(23, 'Поработайте на ферме', 'Посадить малину', 49, 450, 7008, true ),
        new FarmTaskConfig(24, 'Поработайте на ферме', 'Собрать малину', 36, 450, 7028, false ),
        new FarmTaskConfig(25, 'Поработайте на ферме', 'Посадить чернику', 37, 450, 7010, true ),
        new FarmTaskConfig(26, 'Поработайте на ферме', 'Собрать чернику', 35, 450, 7030, false ),
        new FarmTaskConfig(27, 'Поработайте на ферме', 'Покормите корову низкосортным кормом', 40, 450, 9101, true ),
        new FarmTaskConfig(28, 'Поработайте на ферме', 'Подоите корову', 40, 450, 9000, false ),
        new HuntTaskConfig(29, 'Поохотится', 'Освеживать оленя', 2, 450, 832 ),
        new HuntTaskConfig(30, 'Поохотится', 'Освеживать курицу', 4, 450, 833 ),
        new HuntTaskConfig(31, 'Поохотится', 'Освеживать кролика', 2, 450, 834 ),
        new HuntTaskConfig(32, 'Поохотится', 'Освеживать свинью', 3, 450, 835 ),
        new HuntTaskConfig(33, 'Поохотится', 'Освеживать пуму', 2, 450, 836 ),
        new FishingTaskConfig(34, 'Поймайте рыбу', 'Поймать чебака', 18, 450, 9210 ),
        new FishingTaskConfig(35, 'Поймайте рыбу', 'Поймать окуня', 5, 450, 9212 ),
        new FishingTaskConfig(36, 'Поймайте рыбу', 'Поймать чебака', 18, 450, 9210 ),
        new FishingTaskConfig(37, 'Поймайте рыбу', 'Поймать окуня', 5, 450, 9212 ),
        new JobTaskConfig(38, 'Поработайте дальнобойщиком', 'Выполните заказы', 10, 450, 'trucker' ),
        new JobTaskConfig(39, 'Поработайте пожарником', 'Потушите пожар', 10, 450, 'firefighter' ),
        new JobTaskConfig(40, 'Поработайте в саду', 'Поработайте в саду', 40, 450, 'garden' ),
        new JobTaskConfig(41, 'Поработайте мойщиком окон', 'Помойте окна', 50, 450, 'cleaning' ),
        new JobTaskConfig(42, 'Поработайте на стройке', 'Поработайте на стройке', 40, 450, 'builder' ),
    ],
    randomExp: {
        exp: 400,
        hour: 19,
        minute: 0
    }
}