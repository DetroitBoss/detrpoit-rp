/// <reference path="rage-server.ts" />
declare interface EventMpPool {
  add(eventName: "playerJoin", callback: (player: PlayerMp) => any): void;
  add(eventName: "playerQuit", callback: (player: PlayerMp) => any): void;
  add(eventName: "playerDeath", callback: (player: PlayerMp) => any): void;
}

declare interface Vector2 {
  x: number;
  y: number;
}

interface ObjectMp {
  notifyStreaming: boolean;
  mapeditor?:boolean;
  mapeditorid?:string;
}

interface EntityMp {
  /** Объёкт необходим для миссии */
  isMission?: boolean;
  missionType?: "fractionVehicleDeliver";
  /** ID игрока, который является владельцем миссии */
  missionOwner?: number;
}

interface TextLabelMp {
  deliver: number;
  mapeditor?:boolean;
  mapeditorid?:string;
  // /** ID предмета инвентаря, если он таковой */
  // inventory_item?:number;
  /** Идентификатор элемента, который сейчас грабит игрок */
  grab_item: number;
  /** Кастомный параметр того, что эта форма была создана админом */
  admin_text: boolean;
}

interface VehicleMp {
  deliverPos: import('../shared/tasks').NPCTaskItemVehicle['returnPoint']
  mission: number;
  /** ID ТС внутри BR режима */
  brIndex: number;
  /** Владелец ТС в БР */
  brIndexUser: number;
  /** ID Временного хранилища */
  inventoryTmp: number;
  /** ТС автопарка */
  taxiCar: number;
  /** Идентификатор отряда */
  gr6Id?: number;
  /** Средства в транспорте GR6 */
  gr6Money?: number;
  /** Игрок в багажнике */
  playerInTruck: number;
  /** Данный транспорт арендованый */
  rentCar?:boolean;
  /** ТС удалён */
  deleted: boolean;
  /** Владелец арендованой ТС */
  rentCarOwner?:number;
  /** Использовался ли ТС после респавна */
  usedAfterRespawn:boolean;
  /** Это ТС NPC */
  npc?:true;
  /** Требуется ли респавн на точку спавна для данного ТС. Если не указанно - то ТС будет в случае чего просто */
  needRespawn?: true;
  /** Модель ТС символами */
  modelname:string;
  /** ID Машины игрока в базе данных */
  dbid?:number;
  /** ID фракции, если оно фракционное*/
  fraction?: number;
  /** Минимальный ранг доступа к машине */
  fractionMinRank?: number;
  /** ID гаража, если оно фракционное*/
  garage?: number;
  /** ID ТС в гараже, если оно фракционное*/
  garagecarid?: number;
  /** ID владельца транспорта */
  user?:number;
  entity?: import('../server/modules/vehicles').Vehicle;
  /** ID заказа одежды */
  dressOrder?: number;
  /** ID заказа одежды */
  fractionOrder?: [number, number][];
  /** Точка спавна ТС */
  spawnPosition?:Vector3Mp;
  /** Угол поворота при спавне ТС */
  spawnRotation?:Vector3Mp;
  /** Измерение спавна */
  spawnDimension?:number;
  /** Сколько времени ТС никто не использовал */
  afkTime?:number;
  /** Выполняемый семейный квест */
  familyQuest?:import('../shared/family').FamilyTasksInterface;
  /** ID семьи, которая выполняет квест */
  familyQuestFamilyID?:number;
  /** ID отряда пожарников */
  fireSquad?: number,
  /** Количество оставшихся баллонов с огнетушительной смесью */
  fireExtinguishingMixtureCount?: number;
  /** Груз с войны за снабжение */
  supplyWarCargo?: import('../shared/supplyWar/config').ISupplyWarItem[];
  /** Количество мусорных мешков машине **/
  trashBags?: number
}

interface ColshapeMp {
  handleClass: import('../shared/checkpoints').colshapeHandleBase;
}

interface MarkerMp {
  tmpid?:number;
  fight?:boolean;
}
interface BlipMp {
  /** ID дома */
  house?:number;
}

interface TablePlayerBetInterface {
  balance: number;
  x: number;
  y: number;
  currentChipType: number;
}

interface TablePlayerInterface {
  playerInstance: PlayerMp;
  bets: Map<string, TablePlayerBetInterface>;
  skipBets: number;
  usedChips: Set<number>;
  sitPositionId: number;
}

interface TableInterface {
  position: Vector3Mp;
  heading: number;
  players: Map<PlayerMp, TablePlayerInterface>;
  maxPlayers: number;
  lastWinTime: number;
  currentWinNumber: number;
  currentState: number;
  lastIdleTime: number;
  sits: {position: Vector3Mp, player?: PlayerMp}[]
  chipTypePrices: number[];
}

interface ThreeCardPokerTablePlayer {
  firstBet: number;
  secondBet: number;
  typeBet: string;
  hand?: any;
  applyFirstBet?: boolean;
}

interface ThreeCardPokerTable {
  position: Vector3Mp;
  heading: number;
  usedCards: Set<string>;
  currentState: number;
  players: Map<PlayerMp, ThreeCardPokerTablePlayer>,
  gameTimer: number;
  activeGame: boolean;
  firstBetActive: boolean;
  dealerHand?: any;
  usedSits: Map<PlayerMp, number>;
}

interface PlayerServer extends EntityMp {
  inCasinoDress: boolean,
  anticheatNotify: boolean
  /** Индикатор готовности к стройке */
  flatReady: boolean;
  /** Индикатор открытой страницы с тикетами */
  ticketPage: boolean;
  restoreCode: string;
  taxiNpc: number,
  npcDialogHandle: (index: number) => any;
  /** ID открытого диалога */
  dialog: string[];
  /** Индикатор того, что игрок стоит на каком то транспорте */
  isOnVeh: boolean;
  /** Временная блокировка действий */
  spamProtect: boolean;
  /** Идентификатор элемента, который сейчас грабит игрок */
  grab_item: number;

  /** Транспорт, на котором игрок сдаёт экзамен */
  licenseVehicle: VehicleMp;
  /** Index конфига, по которму игрок сдаёт экзамен */
  licenseExam: number;
  /** Index лицензии, на которую игрок сдаёт экзамен */
  licenseExamLic: number;
  /** Арендованый транспорт */
  rentCar: VehicleMp;
  /** Сессия телефонного разговора */
  phoneSession: {
    senderNumber: number;
    targetNumber: number;
    senderPlayer: PlayerMp;
    targetPlayer: PlayerMp;
    started: boolean;
    startTime?: number;
    id: number;
  };
  /** Текущий ID телефона, который открыт */
  phoneCurrent: number;
  /** Текущий дилалог, открытый в телефоне */
  phoneReadMessage: number;
  /** Индикатор открытого инвентаря */
  openInventory: string;
  /** ID Social Club, который был получен через клиент-нативку */
  realSocial: string;
  /** Аккаунт пользователя */
  account: import("../server/modules/typeorm/entities/account").AccountEntity;
  usersList: import('shared/login.state').personageLoginData[]
  /** ID Игрока из базы данных */
  dbid: number;
  /** Блок class User */
  user: import("../server/modules/user").User
  serverMenu: import("../server/modules/menu").MenuClass
  notify: (text: string, type?: import("../shared/alert").AlertType, img?: string, time?: number) => void;
  notifyWithPicture: (title: string, sender: string, message: string, notifPic: string, time?: number) => void;
  colshape: ColshapeMp;
  /** ID скупщика, которому игрок сейчас продает что-то */
  currentNpcCustomerId?: number;

  /** Данные для работы грабителя домов */
  housesCrackerData: import("../server/modules/families/jobs/houses-cracker/index").HousesCrackerData
  farmWorker: import("../server/modules/farm/models/worker").FarmWorker

  /** Рабочий транспорт электрика **/
  electricianWorkVehicle: undefined | number
  /** Рабочий транспорт автобусника **/
  busmanWorkVehicle: undefined | number
}

interface InventoryItem {
  id: number;
  label: string;
  item_id: number;
  count: number;
  prefix: number;
  number: number;
  key_id: number;
}

type weathers =
  | 'EXTRASUNNY'
  | 'CLEAR'
  | 'CLOUDS'
  | 'SMOG'
  | 'FOGGY'
  | 'OVERCAST'
  | 'RAIN'
  | 'THUNDER'
  | 'CLEARING'
  | 'SNOW'
  | 'XMAS'
  | 'HALLOWEEN'
  | 'NEUTRAL';


//! MYSQL

interface CarInstance {
  id: number;
  id_user: number;
  user_name: string;
  name: string;
  hash: number;
  price: number;
  full_fuel: number;
}
interface CarRentInstance {
  id: number;
  id_user: number;
  business_name: string;
  name: string;
  price: number;
}
