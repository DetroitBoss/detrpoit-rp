
import { ClothReward, CoinsReward, ExpReward, InventoryItemReward, LuckyWheelReward, MoneyReward, RewardRarity, VehicleReward, VipReward } from "../rewards";
import { IBattlePassSeason } from "../season";
import { FarmTaskConfig, FishingTaskConfig, HuntTaskConfig, JobTaskConfig } from "../tasks";

export const FEBRUARY_SEASON: IBattlePassSeason = {
    id: 'february-season',
    name: 'Февральский сезон',
    levelExp: 1001,
    everyDayExp: {
        time: 2,
        exp: 250
    },
    levelPrice: 500,
    endTime: 1651363200,
    battlePassCost: 4000,
    discount: {
        expires: 1644310831,
        specialPrice: 3000

    },
    rewards:[
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new InventoryItemReward("Золотой камуфляж", RewardRarity.RARE, 'camo1',  false, 1604, 1),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new ClothReward("Пиджак святой патрик", RewardRarity.RARE, 'body6_m','body6_f', true, 'Пиджак святой патрик', 'Пиджак святого патрика F', 'Зеленый', 'Зеленый'),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new InventoryItemReward("Золотой камуфляж", RewardRarity.RARE, 'camo1',  false, 1604, 1),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 25000),
        new ClothReward("Штаны святого патрика", RewardRarity.LEGENDARY, 'pants6_m','pants6_f', true, 'Штаны святой патрик', 'Штаны святого патрика F', 'Зеленый', 'Зеленый'),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 30000),
        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 7),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new ClothReward("Венок святого патрика", RewardRarity.LEGENDARY, 'head1_m','head1_f', false, 'Венок святого патрика 1', 'Венок святого патрика F', 'Зеленый', 'Зеленый'),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD1', false, 'Diamond', 7),
         new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 30000),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money1', false, 30000),
        new ClothReward("Маска Halk", RewardRarity.RARE, 'mask17_m','mask17_f', false, 'Маса Халк M', 'Маса Halk F', 'Зеленый', 'Зеленый',),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 5),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 15000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Шляпа святого патрика", RewardRarity.LEGENDARY, 'pants0_m','pants3_f', false, 'Шляпа святой патрик 1', 'Шляпа святого патрика F','Зеленый','Зеленый'),
        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 5),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 100),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 17000),
        new InventoryItemReward("Золотой камуфляж", RewardRarity.RARE, 'camo1',  false, 1604, 1),
        new ClothReward("Венок весенний", RewardRarity.LEGENDARY, 'head0_m','head0_f', false, 'Венок весенний 1', 'Весенний венок F','Розовый','Розовый'),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 50),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins1', false, 50),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new InventoryItemReward("Сумочка Gucci", RewardRarity.LEGENDARY, 'backpack1',  true, 2142, 1),
        new VipReward("Вип Sapfire", RewardRarity.COMMON, 'vipS0', false, 'Sapfire', 3),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new ClothReward("Худи Versace", RewardRarity.LEGENDARY, 'body10_m','body10_f', false, 'Худи Versace M', 'Худи Versace F','Черный','Черный'),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD1', false, 'Diamond', 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new ClothReward("Nike Luxury Shoes", RewardRarity.LEGENDARY, 'sneakers6_m','sneakers6_f', false, 'Кеды Nike Luxury', 'Кеды Nike Luxury F','Фиолетовый','Фиолетовый'),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Маска кошмар ", RewardRarity.LEGENDARY, 'mask20_m','mask20_f', false, 'Маска кошмар M', 'Маска кошмар F','Серый','Серый'),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new ClothReward("Бандитская повязка назад", RewardRarity.RARE, 'head5_m','head5_f', false, 'Бандитская повязка назад 1', 'Бандитская повязка назад F', 'Черный', 'Черный'),


        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 10000),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Бандитская повязка вперед", RewardRarity.RARE, 'head2_m','head2_f', false, 'Бандинсткая бандана на перед 1', 'Бандинсткая бандана вперед F','Белый', 'Белый'),


        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new InventoryItemReward("Феерверки", RewardRarity.RARE, 'fire1',  false, 868, 3),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 11000),
        new InventoryItemReward("Феерверки", RewardRarity.RARE, 'fire1',  false, 868, 3),
        new ClothReward("Кроссовки Balenciaga", RewardRarity.RARE, 'sneakers5_m','sneakers5_f', false, 'Гай фокс', 'Jay Fox', 'Balenciaga Speed Trainers M', 'Balenciaga Speed Trainers F'),



        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 5),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 11000),
        new MoneyReward("Деньги", RewardRarity.COMMON, 'money0', false, 11000),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Попугай на плече", RewardRarity.RARE, 'parrot_m','parrot_f', false, 'Попугай M', 'Попугай F', 'Черно желтый', 'Черно желтый'),





        new InventoryItemReward("Зелье жука броненосца", RewardRarity.RARE, 'z1',  false, 10003, 2),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 50),
        new InventoryItemReward("Зелье жука броненосца", RewardRarity.RARE, 'z2',  false, 10009, 3),
        new InventoryItemReward("Зелье жука броненосца", RewardRarity.RARE, 'z2',  false, 10009, 3),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 6),
        new ClothReward("Бандитская повязка назад", RewardRarity.RARE, 'head5_m','head5_f', false, 'Бандитская повязка назад 1', 'Бандитская повязка назад F', 'Черный', 'Черный'),






        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipD0', false, 'Diamond', 7),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 12),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 12),
        new CoinsReward("Коины", RewardRarity.COMMON, 'coins0', false, 100),
        new LuckyWheelReward("Прокрут колеса удачи", RewardRarity.COMMON, 'fortune', false),
        new ClothReward("Маска Doom", RewardRarity.LEGENDARY, 'mask18_m','mask18_f', false, 'Маска Doom M', 'Маска Doom F' ,'Черный','Черный'),





        new MoneyReward("Деньги", RewardRarity.RARE, 'money2', false, 20000),
        new MoneyReward("Деньги", RewardRarity.RARE, 'money2', false, 20000),
        new ExpReward("Exp", RewardRarity.COMMON, 'exp', false, 3),
        new VipReward("Вип Ruby", RewardRarity.COMMON, 'vipR0', false, 'Ruby', 7),
        new VipReward("Вип Diamond", RewardRarity.COMMON, 'vipR1', false, 'Diamond', 7),
        new ClothReward("Штаны Galaxy", RewardRarity.LEGENDARY, 'pants7_m','pants7_f', false, 'Штаны Galaxy', 'Штаны Galaxy F','Черно синий','Черно синий'),



        new MoneyReward("Деньги", RewardRarity.RARE, 'money3', false, 50000),
        new MoneyReward("Деньги", RewardRarity.RARE, 'money3', false, 50000),
        new ClothReward("Худи Galaxy", RewardRarity.LEGENDARY, 'body8_m','body8_f', true, 'Худи Galaxy', 'Худи Galaxy F','Черно синий','Черно синий'),
        new VehicleReward('Panamera',RewardRarity.LEGENDARY, 'Panamera', true, 'rmodbacalar' )
        
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