import {DropSellType, RouletteType} from "./enums";
import {Rarity} from "./rarity";
import {VipDropData} from "./Drops/vipDrop";
import {DropDataBase} from "./Drops/dropBase";
import {RealDropData} from "./Drops/realDrop";
import {VehicleDropData} from "./Drops/vehicleDrop";
import {InventoryDropData} from "./Drops/inventoryDrop";
import {MoneyDropData} from "./Drops/moneyDrop";
import {XpDropData} from "./Drops/xpDrop";
import {CoinsDropData} from "./Drops/coinsDrop";
import {DressDropData} from "./Drops/dressDrop";
import {ArmorDropData} from "./Drops/armorDrop";

export const SPIN_COSTS: {[key: string]: number} = {
    "standart": 200,
    "premium": 500,
    "luxe": 1000,
}

export enum RarityType {
    LEGENDARY,// Золотой
    SPECIAL,// Красный
    UNIQUE,// Розовый
    RARE,// Фиолетовый
    COMMON,// Голубой
    CASINO// Колесо в казино
}

// Основной конфиг дропов в рулетке
export const drops: DropDataBase[] = [
    //Деньги 200
    new MoneyDropData(0, 0,25000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 25000),
    new MoneyDropData(11, 33, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(34, 32, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(36, 32, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(45, 32, 25000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 25000),
    new MoneyDropData(46, 32, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(47, 32, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(48, 32, 18000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(10000, 32, 15000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(10001, 32, 15000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(10002, 32, 15000, 'Деньги', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(4,  32,  26000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 26000),
    new MoneyDropData(54, 33, 35000, 'Деньги', RarityType.RARE,[ RouletteType.STANDART,RouletteType.PREMIUM], DropSellType.DOLLARS, 35000),
    new MoneyDropData(67, 33, 22000, 'Деньги', RarityType.RARE, [RouletteType.STANDART,RouletteType.PREMIUM], DropSellType.DOLLARS, 22000),
    new MoneyDropData(68, 33, 18000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(69, 33, 18000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(10003, 33, 20000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(10004, 33, 20000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(10005, 33, 20000, 'Деньги', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(70, 33, 18000, 'Деньги', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(71, 33, 23000, 'Деньги', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 23000),
    new MoneyDropData(72, 34, 26000, 'Деньги', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 26000),
    new MoneyDropData(73, 34, 36000, 'Деньги', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 36000),
    new MoneyDropData(74, 34, 45000, 'Деньги', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 45000),
    new MoneyDropData(75, 34, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(76, 34, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(77, 34, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(108, 33, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(109, 33, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(110, 33, 60000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(111, 33, 70000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 70000),
    new MoneyDropData(112, 33, 80000, 'Деньги', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 80000),


    //Коины 200
    new CoinsDropData(3, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(8, 3, 230, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 230),
    new CoinsDropData(12, 7, 200, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(120, 3, 240, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 240),
    new CoinsDropData(121, 3, 275, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 275),
    new CoinsDropData(122, 3, 210, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 210),
    new CoinsDropData(123, 3, 200, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(124, 3, 200, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(125, 3, 200, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(199, 3, 200, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(11000, 3, 185, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 185),
    new CoinsDropData(11001, 3, 185, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 185),
    new CoinsDropData(11002, 3, 185, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 185),
    new CoinsDropData(44, 7, 255, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(49, 7, 170, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 170),
    new CoinsDropData(53, 3, 225, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 225),
    new CoinsDropData(59, 3, 235, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 235),
    new CoinsDropData(200, 3, 270, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 270),
    new CoinsDropData(201, 3, 270, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 270),
    new CoinsDropData(202, 3, 270, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 270),
    new CoinsDropData(11003, 3, 195, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 195),
    new CoinsDropData(11004, 3, 195, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 195),
    new CoinsDropData(11005, 3, 195, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 195),
    new CoinsDropData(55, 3, 245, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 245),
    new CoinsDropData(203, 3, 270, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 270),
    new CoinsDropData(204, 3, 270, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 270),
    new CoinsDropData(205, 3, 255, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(206, 3, 255, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(207, 3, 255, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(208, 3, 255, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(209, 3, 255, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 255),
    new CoinsDropData(210, 3, 200, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new CoinsDropData(211, 3, 275, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 275),
    new CoinsDropData(212, 3, 275, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 275),
    new CoinsDropData(213, 3, 295, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 295),
    new CoinsDropData(214, 3, 295, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 295),
    new CoinsDropData(215, 3, 295, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 295),
    new CoinsDropData(216, 3, 295, 'Coins', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 295),
    new CoinsDropData(14, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(17, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(21, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(30, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(31, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(132, 3, 190, 'Coins', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(19, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(139, 3, 150, 'Coins', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new CoinsDropData(143, 3, 350, 'Coins', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 300),

    //Випки 200
    new VipDropData(1, 1, 'Sapfire', 5, 'Saphire VIP', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 220),
    new VipDropData(9, 5, 'Ruby', 2, 'Ruby VIP', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 230),
    new VipDropData(13, 1, 'Sapfire', 10, 'Sapfire VIP', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 200),
    new VipDropData(35, 1, 'Sapfire', 7, 'Saphire VIP', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 30000),
    new VipDropData(42, 1, 'Sapfire', 7, 'Saphire VIP', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 220),
    new VipDropData(5, 5, 'Ruby', 7, 'Ruby VIP', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 250),
    new VipDropData(6, 1, 'Sapfire', 7, 'Saphire VIP', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 220),
    new VipDropData(10, 5, 'Ruby', 5, 'Ruby VIP', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 220),
    new VipDropData(50, 5, 'Ruby', 10, 'Ruby VIP', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 220),
    new VipDropData(219, 5, 'Ruby', 10, 'Ruby VIP', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 250),
    new VipDropData(220, 5, 'Ruby', 14, 'Ruby VIP', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 350),
    new VipDropData(221, 6, 'Diamond', 3, 'Diamond VIP', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 400),

    //Опыт 200
    new XpDropData(2, 2, 2, 'Опыт', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 22000),
    new XpDropData(7, 2, 3, 'Опыт', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 22000),
    new XpDropData(43, 2, 2, 'Опыт', RarityType.COMMON,[RouletteType.STANDART], DropSellType.DOLLARS, 22000),

    //Броники 200
    new ArmorDropData(98, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(99, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(104, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(105, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(106, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(107, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(1250, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(126, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    new ArmorDropData(127, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(128, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(145, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(146, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(147, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(148, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(153, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new ArmorDropData(154, 52, 100, 'Бронежилет', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),

    //Эпики 200
    new InventoryDropData(97, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(129, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(130, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(131, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(149, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(150, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(151, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new InventoryDropData(152, 25, 910, 3, 'Эпинифрин', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),

    //Оружия 200
    new InventoryDropData(101, 42, 511, 1, 'Револьвер', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    new InventoryDropData(119, 42, 511, 1, 'Револьвер', RarityType.COMMON, [,RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    new InventoryDropData(1201, 42, 511, 1, 'Револьвер', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    new InventoryDropData(156, 42, 511, 1, 'Револьвер', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    new InventoryDropData(217, 42, 511, 1, 'Револьвер', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000, false, false),
    new InventoryDropData(218, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),
    new InventoryDropData(100, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),


    //Машины 200
    new VehicleDropData(135, 50, 'weevil', 'weevil', RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 30000),
    new VehicleDropData(142, 18, 'brioso', 'brioso', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 45000),
    new VehicleDropData(15, 108, 'bati2', 'bati2', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new VehicleDropData(16, 127, 'hakuchou2', 'hakuchou2', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),
    new VehicleDropData(22, 37, 'vaz2121', 'vaz2121', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 270000),
    new VehicleDropData(27, 141, 'rebla', 'rebla', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 3000),
    new VehicleDropData(133, 134, 'stalion', 'stalion', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new VehicleDropData(134, 135, 'vindicator', 'vindicator', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 70000),
    new VehicleDropData(26, 95, 'paragon', 'paragon', RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 3000),
    new VehicleDropData(28, 84, 'w140', 'w140', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 4000),
    new VehicleDropData(29, 24, 'merse63s', 'merse63s', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 5000),
    new VehicleDropData(187, 82, 'seven70', 'seven70', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 2000),
    new VehicleDropData(189, 83, 'osiris', 'osiris', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 2000),
    new VehicleDropData(190, 106, 'golfgti7', 'golfgti7', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 4000),
    new VehicleDropData(191, 130, 'bmwe34', 'bmwe34', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 4000),
    new VehicleDropData(193, 107, 'firebird77', 'firebird77', RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 4000),

    //Одежда 200
    new InventoryDropData(95, 13, 2053, 1, 'Рюкзак Adidas', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    new DressDropData(157, 57, 'Polo Christian Dior', 'Красный', 'Polo Christian Dior', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new DressDropData(159, 55, 'Широкая футболка Stone Island', 'Оранжевый', 'Широкая футболка Stone Island', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new DressDropData(163, 64, 'Лосины Adidas', 'Розовый', 'Лосины Adidas', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new DressDropData(164, 61, 'Модная футболка', 'Gucci', 'Футболка Gucci', RarityType.RARE, [RouletteType.PREMIUM, RouletteType.STANDART], DropSellType.DONATE, 200),
    new DressDropData(167, 65, 'Короткие джинсовые шорты', 'Синий', 'Короткие джинсовые шорты', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new DressDropData(170, 62, 'Худи OFF White', 'OFF White Pink', 'Худи OFF White Pink', RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 400),
    new DressDropData(173, 72, 'Модные шорты', 'Белый', 'Модные шорты', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 120),
    new DressDropData(178, 76, 'Модная узкая футболка', 'Snake supreme', 'Snake supreme', RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    new DressDropData(184, 62, 'Худи Off White', 'Pink', 'Худи Off White', RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 300),




















    //Деньги 500
    new MoneyDropData(238, 34, 50000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(239, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(240, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(241, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(242, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(37, 34, 50000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(250, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(251, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(252, 34, 70000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new MoneyDropData(6000, 33, 110000, 'Деньги', RarityType.RARE,[ RouletteType.PREMIUM], DropSellType.DOLLARS, 110000),
    new MoneyDropData(236, 34, 120000, 'Деньги', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 120000),
    new MoneyDropData(237, 34, 120000, 'Деньги', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 120000),
    new MoneyDropData(4020, 33, 50000, 'Деньги', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(4021, 33, 50000, 'Деньги', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(4022, 33, 50000, 'Деньги', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(116, 34, 150000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(117, 34, 150000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(4004, 34, 150000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(51, 34, 150000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(253, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(254, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(267, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(268, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(269, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(270, 34, 130000, 'Деньги', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(113, 34, 180000, 'Деньги', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 180000),
    new MoneyDropData(114, 34, 200000, 'Деньги', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(115, 34, 200000, 'Деньги', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(118, 34, 180000, 'Деньги', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 180000),
    new MoneyDropData(228, 34, 200000, 'Деньги', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(4005, 34, 40000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4006, 34, 40000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4007, 34, 40000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4008, 34, 30000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4009, 34, 30000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4010, 34, 30000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4011, 34, 45000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),
    new MoneyDropData(4012, 34, 45000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),
    new MoneyDropData(4013, 34, 45000, 'Деньги', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),



    //Коины 500
    new CoinsDropData(243, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(244, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(245, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(246, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(260, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(261, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(264, 3, 500, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new CoinsDropData(232, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(233, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(234, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(235, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(265, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(266, 3, 650, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 650),
    new CoinsDropData(8007, 3, 480, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 480),
    new CoinsDropData(8008, 3, 480, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 480),
    new CoinsDropData(8009, 3, 480, 'Coins', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 480),
    new CoinsDropData(224, 3, 750, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 750),
    new CoinsDropData(225, 3, 900, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 900),
    new CoinsDropData(229, 3, 700, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 700),
    new CoinsDropData(230, 3, 700, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 700),
    new CoinsDropData(231, 3, 750, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 750),
    new CoinsDropData(226, 3, 1000, 'Coins', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 1000),
    new CoinsDropData(227, 3, 1000, 'Coins', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 1000),
    new CoinsDropData(56, 3, 1500, 'Coins', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 1500),
    new CoinsDropData(58, 3, 1500, 'Coins', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 1500),
    new CoinsDropData(296, 3, 1500, 'Coins', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 1500),
    new CoinsDropData(297, 3, 2000, 'Coins', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 2000),
    new CoinsDropData(298, 3, 2500, 'Coins', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 2500),
    new CoinsDropData(262, 3, 1500, 'Coins', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 1500),
    new CoinsDropData(263, 3, 2000, 'Coins', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 2000),
    new CoinsDropData(18,  3, 800, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 800),
    new CoinsDropData(20,  3, 800, 'Coins', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 800),
    new CoinsDropData(278, 3, 550, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new CoinsDropData(271, 3, 350, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new CoinsDropData(272, 3, 350, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new CoinsDropData(273, 3, 350, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new CoinsDropData(274, 3, 350, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new CoinsDropData(8000, 3, 450, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 450),
    new CoinsDropData(8001, 3, 450, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 450),
    new CoinsDropData(8002, 3, 450, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 450),
    new CoinsDropData(8003, 3, 450, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 450),
    new CoinsDropData(8004, 3, 400, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 400),
    new CoinsDropData(8005, 3, 400, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 400),
    new CoinsDropData(8006, 3, 400, 'Coins', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 400),
    
    //Випки 500
    new VipDropData(247, 1, 'Sapfire', 30, 'Saphire VIP', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new VipDropData(248, 1, 'Sapfire', 30, 'Saphire VIP', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new VipDropData(249, 5, 'Ruby', 20, 'Ruby VIP', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 600),
    new VipDropData(52, 5, 'Ruby', 20, 'Ruby VIP', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 600),
    new VipDropData(280, 5, 'Ruby', 20, 'Ruby VIP', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 600),
    new VipDropData(281, 6, 'Diamond', 15, 'Diamond VIP', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 700),

    //Оружия 500
    new InventoryDropData(7000, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    new InventoryDropData(155, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    new InventoryDropData(255, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    new InventoryDropData(256, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    new InventoryDropData(257, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new InventoryDropData(377, 120, 573, 1, 'Клюшка', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new InventoryDropData(282, 29, 541, 1, 'Печенег', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new InventoryDropData(380, 123, 510, 1, 'Marksman Pistol', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new InventoryDropData(381, 123, 510, 1, 'Marksman Pistol', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new InventoryDropData(293, 118, 565, 1, 'Кастет', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new InventoryDropData(287, 118, 565, 1, 'Кастет', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new InventoryDropData(294, 118, 565, 1, 'Кастет', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new InventoryDropData(295, 118, 565, 1, 'Кастет', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new InventoryDropData(258, 131, 548, 1, 'm14 ebr', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new InventoryDropData(259, 131, 548, 1, 'm14 ebr', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new InventoryDropData(288, 131, 548, 1, 'm14 ebr', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new InventoryDropData(289, 115, 566, 1, 'Мачете', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 85000),
    new InventoryDropData(290, 116, 568, 1, 'Axe топор', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 75000),
    new InventoryDropData(291, 119, 561, 1, 'Розочка', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new InventoryDropData(292, 117, 567, 1, 'Трубный ключ', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 65000),





    //Машины 500
    new VehicleDropData(275, 21, 'cheburek', 'cheburek', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new VehicleDropData(276, 132, 'rebel', 'rebel', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new VehicleDropData(277, 137, 'cavalcade2', 'cavalcade2', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new VehicleDropData(279, 22, 'sentinel', 'sentinel', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new VehicleDropData(283, 45, 'sugoi', 'sugoi', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new VehicleDropData(284, 86, 'gauntlet', 'gauntlet', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new VehicleDropData(285, 88, 'tampa2', 'tampa2', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new VehicleDropData(286, 87, 'jester3', 'jester3', RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new VehicleDropData(23, 46, 'sultanrs', 'sultanrs', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 380000),
    new VehicleDropData(222, 85, 'dubsta2', 'dubsta2', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new VehicleDropData(223, 84, 'w140', 'w140', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    new VehicleDropData(136, 46, 'sultanrs', 'sultanrs', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 350000),
    new VehicleDropData(140, 96, 'comet5', 'comet5', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 400000),
    new VehicleDropData(141, 97, 'kamacho', 'kamacho', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 300000),
    new VehicleDropData(303, 138, 'bmwe36', 'bmwe36', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 1000000),
    new VehicleDropData(304, 138, 'bmwe36', 'bmwe36', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 3000),
    new VehicleDropData(103, 90, 'camry70', 'camry70', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    new VehicleDropData(194, 28, 'mersg63', 'mersg63', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 10000),
    new VehicleDropData(195, 98, 'havok_dmlz', 'Havok', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 10000),
    new VehicleDropData(196, 99, 'shotaro', 'shotaro', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(197, 24, 'merse63s', 'merse63s', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(198, 90, 'camry70', 'camry70', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    new VehicleDropData(299, 100, 'sanctus', 'sanctus', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DOLLARS, 1000000),
    new VehicleDropData(300, 110, 'ferfs90onyx', 'Ferarrisf90', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 15000),
    new VehicleDropData(301, 89, 'a45', 'a45', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(302, 90, 'camry70', 'camry70', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    new VehicleDropData(305, 91, 'lexuslfa', 'lexuslfa', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),


    //Одежда 500
    new InventoryDropData(24, 13, 2053, 1, 'Рюкзак Adidas', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    new InventoryDropData(4003, 14, 2054, 1, 'Рюкзак Gucci', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new InventoryDropData(94, 15, 871, 1, 'Плюшевый мишка', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 75000),
    new InventoryDropData(4030, 13, 2053, 1, 'Рюкзак Adidas', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    new InventoryDropData(4040, 14, 2054, 1, 'Рюкзак Gucci', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new DressDropData(158, 56, 'Лонг слив Supreme', 'Коричнево зеленый', 'Лонг слив Supreme', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 250),
    new DressDropData(160, 54, 'Элитная худи', 'Красный', 'Элитная худи', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    new DressDropData(4050, 61, 'Модная футболка', 'Gucci', 'Футболка Gucci', RarityType.RARE, [RouletteType.PREMIUM, RouletteType.STANDART], DropSellType.DONATE, 200),
    new DressDropData(165, 79, 'Кроссовки Balenciaga', 'Черный', 'Кроссовки Balenciaga', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new DressDropData(166, 59, 'Топик Nike', 'Красный', 'Топик Nike', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new DressDropData(168, 78, 'Модная куртка', 'Черный', 'Модная куртка', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 600),
    new DressDropData(175, 71, 'Яркие спортивки', 'Синий', 'Яркие спортивки', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new DressDropData(177, 70, 'Элитная худи', 'Kenzo', 'Худи Kenzo', RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new DressDropData(182, 73, 'Узкие яркие спортивки', 'Фиолетовый', 'Яркие', RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    new DressDropData(15001, 142, 'Борода 8', 'Черная', 'Борода', RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 3000),



















    //Деньги 1000
    new MoneyDropData(312, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(313, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(314, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(315, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3120, 34, 120000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 120000),
    new MoneyDropData(339, 34, 120000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 120000),
    new MoneyDropData(340, 34, 130000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 130000),
    new MoneyDropData(341, 34, 150000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new MoneyDropData(3160, 34, 155000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 155000),
    new MoneyDropData(317, 34, 160000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(318, 34, 160000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(3170, 34, 95000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(3171, 34, 95000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(3172, 34, 95000, 'Деньги', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(342, 34, 160000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(343, 34, 170000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 170000),
    new MoneyDropData(344, 34, 175000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 175000),
    new MoneyDropData(327, 34, 180000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 180000),
    new MoneyDropData(328, 34, 185000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 185000),
    new MoneyDropData(329, 34, 190000, 'Деньги', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 190000),
    new MoneyDropData(3130, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3140, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3150, 34, 90000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3160, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3161, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3162, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3163, 34, 80000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3164, 34, 70000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3165, 34, 70000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3166, 34, 70000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3167, 34, 85000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),
    new MoneyDropData(3168, 34, 85000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),
    new MoneyDropData(3169, 34, 85000, 'Деньги', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),

    //Коины 1000
    new CoinsDropData(306, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(307, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(308, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(309, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(310, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(311, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(319, 3, 1100, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(320, 3, 1200, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1100),
    new CoinsDropData(321, 3, 1300, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1200),
    new CoinsDropData(322, 3, 1450, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1350),
    new CoinsDropData(345, 3, 1500, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1400),
    new CoinsDropData(346, 3, 1600, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1400),
    new CoinsDropData(347, 3, 1750, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1750),
    new CoinsDropData(348, 3, 1750, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1750),
    new CoinsDropData(323, 3, 1750, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1750),
    new CoinsDropData(324, 3, 1450, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1450),
    new CoinsDropData(325, 3, 1450, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1450),
    new CoinsDropData(326, 3, 1450, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1450),
    new CoinsDropData(5014, 3, 950, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(5015, 3, 950, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(5016, 3, 950, 'Coins', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(331, 3, 2000, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2000),
    new CoinsDropData(332, 3, 2100, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2100),
    new CoinsDropData(333, 3, 2200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(334, 3, 2200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(335, 3, 2200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(336, 3, 2200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(337, 3, 2200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(338, 3, 2500, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2200),
    new CoinsDropData(138, 3, 1200, 'Coins', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 800),
    new CoinsDropData(4002, 3, 1200, 'Coins', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 1200),
    new CoinsDropData(352, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(354, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(330, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(4001, 3, 1000, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new CoinsDropData(5002, 3, 800, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 800),
    new CoinsDropData(5003, 3, 800, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 800),
    new CoinsDropData(5004, 3, 800, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 800),
    new CoinsDropData(5005, 3, 900, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 900),
    new CoinsDropData(5006, 3, 900, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 900),
    new CoinsDropData(5007, 3, 900, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 900),
    new CoinsDropData(5008, 3, 950, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(5009, 3, 950, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(5010, 3, 950, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 950),
    new CoinsDropData(5011, 3, 700, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new CoinsDropData(5012, 3, 700, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new CoinsDropData(5013, 3, 700, 'Coins', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 700),

    //Оружия 1000
    new InventoryDropData(353, 131, 548, 1, 'm14 ebr', RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    new InventoryDropData(358, 116, 570, 1, 'Каменный топор', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new InventoryDropData(378, 121, 572, 1, 'Perico pistol', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 200000),
    new InventoryDropData(379, 122, 515, 1, 'Navyrevolver', RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 170000),

    //Машины 1000
    new VehicleDropData(349, 124, 'bmx', 'bmx', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new VehicleDropData(350, 92, 'tribike3', 'tribike3', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new VehicleDropData(355, 94, 'blazer3', 'blazer3', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new VehicleDropData(351, 37, 'vaz2121', 'vaz2121', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 2000),
    new VehicleDropData(356, 51, 'xls', 'xls', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new VehicleDropData(357, 92, 'tribike', 'tribike', RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 1000),
    new VehicleDropData(5000, 24, 'merse63s', 'merse63s', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 5000),
    new VehicleDropData(188, 41, '2170', '2170', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 3000),
    new VehicleDropData(144, 28, 'mersg63', 'mersg63', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 10000),
    new VehicleDropData(359, 106, 'golfgti7', 'golfgti7', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 4000),
    new VehicleDropData(360, 28, 'mers4x4', 'Mers4x4', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 14000),
    new VehicleDropData(368, 101, 'rs7', 'Rs7', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 2000000),
    new VehicleDropData(367, 93, 'm4gts', 'Bmwm4gts', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1500000),
    new VehicleDropData(369, 105, 'camonyx', 'Camaro', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1900000),
    new VehicleDropData(370, 102, 'bmwm3', 'Bmwm3', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DOLLARS, 1300000),
    new VehicleDropData(371, 140, 'subwrx', 'Subaruwrxsti', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1000000),
    new VehicleDropData(372, 111, 'audir8', 'Audir8', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1000000),
    new VehicleDropData(373, 103, 'chaser', 'Chaser', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 900000),
    new VehicleDropData(361, 48, 'lambasianv12', 'Lambasianv12', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 20000),
    new VehicleDropData(362, 110, 'ferfs90onyx', 'Ferarrisf90', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 15000),
    new VehicleDropData(363, 109, 'turbo911', 'Porsche911', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 17000),
    new VehicleDropData(364, 20, 'buzzard2', 'Buzzard2', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 12000),
    new VehicleDropData(365, 35, 'maverick', 'Maverick', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 14000),
    new VehicleDropData(366, 104, 'frogger2', 'Frogger2', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 13000),
    new VehicleDropData(3670, 143, 'rmodatlantic', 'Bugatti Concept', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 25000),


    //Одежда 1000
    new DressDropData(161, 53, 'Хайповый свитшот', 'OFF White', 'Хайповый свитшот', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new DressDropData(162, 53, 'Хайповый свитшот', 'OFF White', 'Хайповый свитшот', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new DressDropData(169, 67, 'Футболка Gucci Flash', 'Gucci', 'Футболка Gucci Flash', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 800),
    new DressDropData(171, 60, 'Бомбер Gucci', 'Gucci', 'Бомбер Gucci', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 900),
    new DressDropData(176, 69, 'Гэнгста худи', 'Белый', 'Гэнгста худи', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 900),
    new DressDropData(185, 63, 'Штаны Gucci', 'Синий', 'Штаны Gucci', RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new DressDropData(186, 60, 'Бомбер Gucci', 'Gucci', 'Бомбер Gucci', RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 700),
    new InventoryDropData(25, 14, 2054, 1, 'Рюкзак Gucci', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new InventoryDropData(96, 14, 2054, 1, 'Рюкзак Gucci', RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new DressDropData(15000, 142, 'Борода 8', 'Черная', 'Борода', RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 3000),

    //реал 1000
    new RealDropData(32, 9, 'Iphone', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100, false),
    new RealDropData(33, 10, 'Laptop', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100, false),
    new InventoryDropData(102, 30, 546, 1, 'Heavy Sniper', RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 10000, false),



    // Casino
    new MoneyDropData(20000, 32, 814, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VehicleDropData(20001, 83, 'osiris', 'Osiris', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DOLLARS, 300000, false),
    new CoinsDropData(20002, 3, 50, 'Coins', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20003, 32, 10000, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VipDropData(20004, 6, 'Diamond', 14, 'Diamond VIP', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DONATE, 0, false),
    new MoneyDropData(20005, 32, 2500, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new DressDropData(20006, 60, 'Бомбер Gucci', 'Gucci', 'Бомбер Gucci', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new XpDropData(20007, 2, 1, 'Опыт', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new MoneyDropData(20008, 32, 15000, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new CoinsDropData(20009, 3, 200, 'Coins', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20010, 32, 20000, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VehicleDropData(20011, 141, 'rebla', 'Rebla', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DOLLARS, 170000, false),
    new CoinsDropData(20012, 3, 500, 'Coins', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20013, 32, 1800, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VipDropData(20014, 5, 'Ruby', 30, 'Ruby VIP', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DONATE, 0, false),
    new MoneyDropData(20015, 32, 25000, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new DressDropData(20016, 53, 'Хайповый свитшот', 'OFF White', 'Хайповый свитшот', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new XpDropData(20017, 2, 2, 'Опыт', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new MoneyDropData(20018, 32, 35000, 'Деньги', RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new CoinsDropData(20019, 3, 1000, 'Coins', RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),











    
]

/*
    Раритетности рулетки с шансом выпадения.
*/
// DEPRECATED
export const rarities: Rarity[] = [
    new Rarity(RarityType.COMMON, 'Обычный', 0.4),
    new Rarity(RarityType.RARE, 'Редкий', 0.3),
    new Rarity(RarityType.UNIQUE, 'Уникальный', 0.14),
    new Rarity(RarityType.SPECIAL, 'Особенный', 0.022),
    new Rarity(RarityType.LEGENDARY, 'Легендарный', 0.0012),
]

export const raritiesByRouletteType = new Map<RouletteType, Rarity[]>([
    [
        RouletteType.STANDART,
        [
            new Rarity(RarityType.COMMON, 'Обычный', 0.42),
            new Rarity(RarityType.RARE, 'Редкий', 0.28),
            new Rarity(RarityType.UNIQUE, 'Уникальный', 0.19),
            new Rarity(RarityType.SPECIAL, 'Особенный', 0.015),
            new Rarity(RarityType.LEGENDARY, 'Легендарный', 0.0010),
        ]
    ],
    [
        RouletteType.PREMIUM,
        [
            new Rarity(RarityType.COMMON, 'Обычный', 0.42),
            new Rarity(RarityType.RARE, 'Редкий', 0.28),
            new Rarity(RarityType.UNIQUE, 'Уникальный', 0.19),
            new Rarity(RarityType.SPECIAL, 'Особенный', 0.015),
            new Rarity(RarityType.LEGENDARY, 'Легендарный', 0.0010),
        ]
    ],
    [
        RouletteType.LUXE,
        [
            new Rarity(RarityType.COMMON, 'Обычный', 0.42),
            new Rarity(RarityType.RARE, 'Редкий', 0.28),
            new Rarity(RarityType.UNIQUE, 'Уникальный', 0.19),
            new Rarity(RarityType.SPECIAL, 'Особенный', 0.015),
            new Rarity(RarityType.LEGENDARY, 'Легендарный', 0.0010),
        ]
    ]
]);