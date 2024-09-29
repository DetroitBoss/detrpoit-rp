export enum LocationCategoryEnum {
  Weapons_Shop = "Магазины оружия",
  Clothing_Store = "Магазины одежды",
  Shop_24_7 = "Магазины",
  Banks = "Банки",
  //Jobs = "Работы",
  Refueling = "Заправки",
  //Mafia = "Мафии",
  Car_Showroom = "Автосалон",
  Gangs = "Банды",
  Car_Wash = "Автомойки",
  Rentals = "Продажа/Прокат транспорта",
  Pharmacy = "Аптеки",
  Clubs = "Клубы/Бары",
  Burgers = "Бургерные",
  ATM = "Банкоматы",
  NPC = "NPC",
  Parking = "Парковки",
  Licenses = "Лицензии",
  Los_Santos_Customs = "Автомастерские",
  Events = "События",
  //State_Structures = "Гос. структуры",
}

export interface GPSPointData {
  id: number;
  category: LocationCategoryEnum;
  type: GPSPointType;
  name: string;
  distance: number;
}

export enum GPSPointType {
  Business,
  Event
}
