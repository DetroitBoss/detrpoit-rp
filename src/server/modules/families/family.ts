import { FamilyEntity } from "../typeorm/entities/family";
import { UserEntity } from "../typeorm/entities/user";
import { dialogSystem } from "../chat";
import { houses } from "../houses";
import { HouseEntity } from "../typeorm/entities/houses";
import { CargoBattleFamilyQuest } from "./quests/cargobattle";
import {
  CONTRACT_NUM_FOR_FAMILY,
  FAMILY_CONTRACT_UPD_TIME,
  family_max_cargo,
  family_max_cars,
  family_max_users,
  FamilyContracts,
  FamilyContractWinTypes,
  familyMemberActions,
  FamilyPermissions,
  FamilyRankPermission,
  FamilyReputationType,
  FamilyTasks,
  FamilyTasksInterface,
  FamilyUpgrade,
  LevelInfo,
  newRankRules,
} from "../../../shared/family";
import { system } from "../system";
import { Vehicle } from "../vehicles";
import { User } from "../user";
import { LogFamilyEntity } from "../typeorm/entities/log";
import { saveEntity } from "../typeorm";
import { tablet } from "../tablet";
import { ATTACKS_DAILY_LIMIT, COOLDOWN_BEETWEN_BIZWARS, DEFENSES_DAILY_LIMIT, } from "../../../shared/bizwar";
import { AlertType } from "../../../shared/alert";
import { dbLogsConnection } from '../typeorm/logs'

let playerQuests: {
  /** Айди игрока */
  id: number;
  /** Выполненные/полученные задания за текущий час */
  quests: number[];
}[] = []; // Лежит не в классе, дабы предотвратить выполнение задания быстро перейдя в другую семью

export class Family {
  entity: FamilyEntity;
  private currentHourQuests: FamilyTasksInterface[] = [];

  static families: Family[] = [];

  lastCargoBattleWin: number = 0;
  lastCargoRequest: number = 0;
  familyChat: string;

  lastBizWar: number = 0;
  /** Сколько атак на бизаки было за день */
  dailyBizAttacks: number = 0;
  /** Сколько защит бизаков было за день */
  dailyBizDefenses: number = 0;

  public get reputationType(): FamilyReputationType {
    return this.entity.reputation_type;
  }

  public set reputationType(value: FamilyReputationType) {
    
  }
  
  /** Является ли семья ЧОП */
  public get isPSC(): boolean {
    return (
      this.level >= 4 && this.reputationType === FamilyReputationType.CIVILIAN
    );
  }

  /** Является ли семья Мафией */
  public get isMafia(): boolean {
    return (
      this.level >= 4 && this.reputationType === FamilyReputationType.CRIME
    );
  }

  /** Текст биографии семьи */
  public get biography(): string {
    return this.entity.biography;
  }

  /** Текст биографии семьи */
  public set biography(value: string) {
    this.entity.biography = value;
    this.entity.save();
  }
  
  public get canAttackBusiness(): boolean {
    return this.canFight && this.dailyBizAttacks < ATTACKS_DAILY_LIMIT; 
  }

  public get canDefendBusiness(): boolean {
    return this.canFight && this.dailyBizDefenses < DEFENSES_DAILY_LIMIT;
  }
  
  public get canFight(): boolean { 
    return (
      this.level >= 4 &&
      (system.timestamp - this.lastBizWar) / 60 > COOLDOWN_BEETWEN_BIZWARS
    );
  }
  lastContractUpdate: number = 0;
  contractUpdateTimer: NodeJS.Timeout = null;

  constructor(entity: FamilyEntity) {
    this.entity = entity;
    Family.families.push(this);
    this.setRandomHourQuest();

    let deletedContracts = 0;
    let newContracts = {} as { [key: number]: number };
    Object.entries(this.contracts).map(([id, value]) => {
      if (FamilyContracts.find((fc) => fc.id == Number(id)))
        newContracts[Number(id)] = value;
      else ++deletedContracts;
    });
    if (deletedContracts) this.contracts = newContracts;

    this.checkContractUpdateTime();
    this.fixRanks();

    this.familyChat = dialogSystem.createDialogFamily(
      `Чат семьи ${this.name}`,
      this.id,
      20
    );
  }
  /** Получить массив всех семей */
  static getAll(): Family[] {
    return Family.families;
  }
  static new(name: string) {
    return new Promise<Family>((resolve, reject) => {
      FamilyEntity.find({ where: { name: name } }).then((result) => {
        if (result.length) {
          reject("FAMILY NAME IS EXIST (" + name + ")");
          return;
        }
        const family = new FamilyEntity();
        family.name = name;
        family
          .save()
          .then((data) => {
            resolve(new Family(data));
          })
          .catch((err) => reject(err));
      });
    });
  }

  static load() {
    console.time("Загрузка семей");
    return new Promise((resolve) => {
      FamilyEntity.find().then((f) => {
        f.map((item) => new Family(item));
        console.timeEnd("Загрузка семей");
        system.debug.success(`Загружено ${f.length} семей`);
        resolve(null);
      });
    });
  }

  static getByID(id: number) {
    return Family.families.find((family) => family.entity.id == id);
  }

  /** ID семьи */
  get id() {
    return this.entity.id;
  }

  /** Название семьи */
  get name() {
    return this.entity.name;
  }

  /** Название семьи */
  set name(val) {
    this.entity.name = val;
    saveEntity(this.entity);
  }

  /** Очки семьи */
  get points() {
    return this.entity.points;
  }

  /** Очки семьи */
  set points(value) {
    if (value < 0) this.entity.points = 0;
    else this.entity.points = value;
    saveEntity(this.entity);
  }

  addPoints(count: number, withSeason = true) {
    if (count <= 0) return;
    this.points += count;
    if (withSeason) this.seasonPoints += count;

    system.saveLogFamily('addPoints', count, `addPoints (withSeason = ${withSeason})`, this.entity);
  }

  takePoints(count: number, withSeason = true) {
    if (count <= 0) return;
    this.points -= count;
    if (withSeason) this.seasonPoints -= count;
  }

  /** Очки семьи */
  get seasonPoints() {
    return this.entity.seasonPoints;
  }

  /** Очки семьи */
  set seasonPoints(value) {
    if (value < 0) this.entity.seasonPoints = 0;
    else this.entity.seasonPoints = value;
    saveEntity(this.entity);
  }

  clearSeasonPoints(byAdmin = false) {
    this.seasonPoints = 0;

    const familyChat = dialogSystem.getDialog(this.familyChat);
    familyChat.messages.push({
      name: "Система",
      id: 0,
      time: system.timestamp,
      text: `${
        byAdmin
          ? "Сезонные очки семьи были сброшены Администратором"
          : "Сезонные очки семьи были сброшены, начался новый сезон"
      }`,
    });
  }

  /** Груз семьи */
  get cargo() {
    return this.entity.cargo;
  }

  /** Груз семьи */
  set cargo(value) {
    if (value > this.maximumCargoCount)
      this.entity.cargo = this.maximumCargoCount;
    else if (value < 0) this.entity.cargo = 0;
    else this.entity.cargo = value;
    saveEntity(this.entity);
  }

  /** Деньги семьи */
  get money() {
    return this.entity.money;
  }

  /** Деньги семьи */
  set money(value) {
    this.entity.money = value;
    saveEntity(this.entity);
  }
  /** Списание средств со счёта семьи */
  removeMoney(val: number, player?: PlayerMp, reason?: string) {
    if (typeof val !== "number") return;
    if (isNaN(val) || val < 0 || val > 999999999) return;
    system.saveLogFamily(
      "removeMoney",
      val,
      reason ? reason : "Снятие баланса",
      this.entity,
      player
    );
    this.money -= val;
  }

  /** Зачисление средств на счёт семьи */
  addMoney(val: number, player?: PlayerMp, reason?: string) {
    if (typeof val !== "number") return;
    if (isNaN(val) || val < 0 || val > 999999999) return;
    system.saveLogFamily(
      "addMoney",
      val,
      reason ? reason : "Пополнение баланса",
      this.entity,
      player
    );
    this.money += val;
  }

  /** Списание донат средств со счёта семьи */
  removeDonateMoney(val: number, player?: PlayerMp, reason?: string) {
    if (typeof val !== "number") return;
    if (isNaN(val) || val < 0 || val > 999999999) return;
    system.saveLogFamily(
      "removeDonate",
      val,
      reason ? reason : "Снятие коинов",
      this.entity,
      player
    );
    this.donate -= val;
  }

  /** Зачисление донат средств на счёт семьи */
  addDonateMoney(val: number, player?: PlayerMp, reason?: string) {
    if (typeof val !== "number") return;
    if (isNaN(val) || val < 0 || val > 999999999) return;
    system.saveLogFamily(
      "addDonate",
      val,
      reason ? reason : "Пополнение коинов",
      this.entity,
      player
    );
    this.donate += val;
  }

  get house(): HouseEntity {
    return houses.dataArray.find((item) => item.familyId === this.id);
  }

  /** Коины семьи */
  get donate() {
    return this.entity.donate;
  }

  /** Коины семьи */
  set donate(value) {
    this.entity.donate = value;
    saveEntity(this.entity);
  }

  /** Уровень семьи */
  get level() {
    return this.entity.level;
  }

  /** Уровень семьи */
  set level(value) {
    this.entity.level = value;
    saveEntity(this.entity);
  }

  /** Выигрышей в соревнованиях семей */
  get wins() {
    return this.entity.wins;
  }

  /** Выигрышей в соревнованиях семей */
  set wins(value) {
    this.entity.wins = value;
    saveEntity(this.entity);
  }

  get extraTasks() {
    let array: { id: number; type: string; active: number; time: number }[] =
      [];
    CargoBattleFamilyQuest.all.forEach((q) => {
      array.push({
        id: q.id,
        type: "cargoBattle",
        active: q.readyStarted ? 1 : 2,
        time: q.calcTimeToStart,
      });
    });
    return array;
  }

  isCan(rank: number, task: keyof typeof FamilyPermissions) {
    if (FamilyPermissions[task] == FamilyRankPermission.FAMILY_LEADER)
      return !!this.ranks.find((r) => r.id == rank && r.isOwner);
    else if (FamilyPermissions[task] == FamilyRankPermission.FAMILY_SUBLEADER)
      return !!this.ranks.find(
        (r) => r.id == rank && (r.isOwner || r.isSoOwner)
      );
    else {
      const rankRule = newRankRules.find(
        (r) => r.id == FamilyPermissions[task]
      );
      if (!rankRule) return false;
      return this.isRankHaveRule(rank, FamilyPermissions[task]);
    }
  }

  setRandomHourQuest() {
    this.currentHourQuests = [];
    this.currentHourQuests.push(system.randomArrayElement(FamilyTasks));
  }

  get hourQuests() {
    return this.currentHourQuests;
  }

  setUpgrade(id: number, count: number) {
    let currentUpgrades = this.upgrades;
    currentUpgrades[id] = count;
    this.upgrades = currentUpgrades;
  }

  get maximumMembersCount() {
    return (
      family_max_users +
      (this.upgrades[1] || 0) *
        (FamilyUpgrade.find((fu) => fu.id == 1)?.amount || 0)
    );
  }

  get maximumCarCount() {
    return (
      family_max_cars +
      (this.upgrades[2] || 0) *
        (FamilyUpgrade.find((fu) => fu.id == 2)?.amount || 0)
    );
  }

  get maximumCargoCount() {
    return (
      family_max_cargo +
      (this.upgrades[3] || 0) *
        (FamilyUpgrade.find((fu) => fu.id == 3)?.amount || 0)
    );
    // FamilyUpgrade.find(fu => fu.id == 3) ? (this.upgrades[3] ? user.family.upgrades[3]*FamilyUpgrade.find(fu => fu.id == 3).amount+family_max_cargo
  }

  get cars() {
    return Vehicle.getFamilyVehicles(this.id);
  }

  get canBuyMoreCar() {
    return this.cars.length < this.maximumCarCount;
  }

  get ranks() {
    return JSON.parse(this.entity.ranks) as {
      id: number;
      name: string;
      rules: number[];
      isPermament?: boolean;
      isSoOwner?: boolean;
      isOwner?: boolean;
    }[];
  }

  set ranks(
    val: {
      id: number;
      name: string;
      rules: number[];
      isPermament?: boolean;
      isSoOwner?: boolean;
      isOwner?: boolean;
    }[]
  ) {
    this.entity.ranks = JSON.stringify(val);
    this.entity.save();
  }

  get leaderRankID() {
    return this.ranks.find((r) => r.isOwner)
      ? this.ranks.find((r) => r.isOwner).id
      : 4;
  }

  private fixRanks() {
    let oldRanks = this.ranks;
    let fixed = false;
    newRankRules.map((r) => {
      let ind = this.ranks.findIndex((r) => r.isOwner);
      if (ind != -1 && !oldRanks[ind].rules.includes(r.id)) {
        oldRanks[ind].rules.push(r.id);
        fixed = true;
      }
    });
    if (fixed) this.ranks = oldRanks;
  }

  isRankHaveRule(rankId: number, rule: number) {
    const rank = this.ranks.find(
      (r) => r.id == rankId && r.rules.includes(rule)
    );
    return !!rank;
  }

  getRank(rankId: number) {
    return this.ranks.find((r) => r.id == rankId) as {
      id: number;
      name: string;
      rules: number[];
      isPermament?: boolean;
      isSoOwner?: boolean;
      isOwner?: boolean;
    };
  }

  set upgrades(val) {
    this.entity.upgrades = JSON.stringify(val);
    this.entity.save();
  }

  get upgrades(): { [key: number]: number } {
    return JSON.parse(this.entity.upgrades);
  }

  set contracts(val) {
    this.entity.contracts = JSON.stringify(val);
    this.entity.save();
  }

  get contracts(): { [key: number]: number } {
    return JSON.parse(this.entity.contracts);
  }

  setRandomContracts(contractsCount = CONTRACT_NUM_FOR_FAMILY) {
    let allContracts = [...FamilyContracts];
    let needContracts = {} as { [key: number]: number };
    for (let i = 0; i < contractsCount; i++) {
      const randContractIndex = system.randomArrayElementIndex(allContracts);
      if (randContractIndex != -1) {
        needContracts[allContracts[randContractIndex].id] = -1;
        allContracts.splice(randContractIndex, 1);
      }
    }
    this.contracts = Object.keys(needContracts).length ? needContracts : {};
  }

  setContractActive(id: number) {
    if (this.contracts[id] == undefined || this.contracts[id] != -1) return;

    let needContracts = {} as { [key: number]: number };
    needContracts[id] = 0;
    this.contracts = needContracts;

    this.lastContractUpdate = system.timestamp;
    // this.contractUpdateTimer = setTimeout(() => {
    //     this.contractUpdateTimer = null
    //     this.checkContractUpdateTime()
    // }, FAMILY_CONTRACT_UPD_TIME+60000)
  }

  addContractValueIfExists(type: number, value: number) {
    // if(this.contracts[id] == undefined || this.contracts[id] == -1) return;
    const contracts = FamilyContracts.filter(
      (fc) =>
        fc.type == Number(type) &&
        this.contracts[fc.id] != undefined &&
        this.contracts[fc.id] != -1
    );
    if (!contracts.length) return;

    const contract = contracts[0];
    const id = contract.id;

    let needContracts = this.contracts as { [key: number]: number };
    needContracts[id] += value;

    if ((needContracts[id] * 100) / contract.needScore >= 100) {
      contract.win.map((win) => {
        if (win.type == FamilyContractWinTypes.MONEY)
          this.addMoney(win.amount, null, "Выполнение семейного контракта");
        if (win.type == FamilyContractWinTypes.COINS)
          this.addDonateMoney(
            win.amount,
            null,
            "Выполнение семейного контракта"
          );
        if (win.type == FamilyContractWinTypes.FAMILY_POINTS)
          this.addPoints(win.amount);
      });
      this.resetContracts();
    } else this.contracts = needContracts;

    tablet.updateFamilyData(this);
  }

  resetContracts() {
    this.contracts = {};
    this.checkContractUpdateTime();
  }

  checkContractUpdateTime() {
    if (
      (!this.lastContractUpdate ||
        system.timestamp >
          this.lastContractUpdate + FAMILY_CONTRACT_UPD_TIME) &&
      !Object.keys(this.contracts).length
    ) {
      this.setRandomContracts();
    }
  }

  /** Получить аккаунты всех членов семьи */
  getAllMembers(onlyOnline = false) {
    return new Promise<UserEntity[]>((resolve, reject) => {
      if (onlyOnline)
        return resolve(
          mp.players
            .toArray()
            .filter((p) => p.user && p.user.family == this)
            .map((p) => {
              return p.user.entity;
            }) || []
        );
      UserEntity.find({ where: { family: this.entity.id } }).then((users) => {
        resolve(users || []);
      });
    });
  }

  /** Получить игроков онлайн */
  getPlayersOnline() {
    return mp.players.toArray().filter((p) => p.user && p.user.family == this);
  }

  getMemberByID(id: number, getIfOnline = false) {
    return new Promise<UserEntity>((resolve, reject) => {
      if (getIfOnline)
        return resolve(
          mp.players
            .toArray()
            .find((p) => p.user && p.user.id == id && p.user.family == this)
            ?.user.entity || null
        );
      UserEntity.find({ where: { id: id, family: this.entity.id } }).then(
        (user) => {
          resolve(user ? user[0] : null);
        }
      );
    });
  }

  getMembersCount(onlyOnline = false) {
    return new Promise<number>(async (res) => {
      if (onlyOnline)
        return res(
          mp.players.toArray().filter((p) => p.user && p.user.family == this)
            .length || 0
        );
      else return res(await UserEntity.count({ family: this.id }));
    });
  }

  /** Сколько человек выполнил/получил заданий для семьи за текущий час */
  static getHourQuestsCount(player: PlayerMp) {
    if (!mp.players.exists(player) || !player.user) return;
    const user = player.user;
    const data = playerQuests.find((d) => d.id == user.id);
    return data ? data.quests.length : 0;
  }

  /** Полученные задания для семьи за текущий час */
  static getHourQuests(player: PlayerMp) {
    if (!mp.players.exists(player) || !player.user) return;
    const user = player.user;
    const data = playerQuests.find((d) => d.id == user.id);
    return data || null;
  }

  /** Прибавить игроку выполненные за текущий час задания для семьи */
  static addHourQuest(player: PlayerMp, questID: number) {
    if (!mp.players.exists(player) || !player.user) return;
    const user = player.user;
    const indexFind = playerQuests.findIndex((d) => d.id == user.id);
    if (indexFind == -1) playerQuests.push({ id: user.id, quests: [questID] });
    else playerQuests[indexFind].quests.push(questID);
  }

  getMoneyLog = async () => {
    return (
      await dbLogsConnection.getRepository(LogFamilyEntity).find({
        where: [
          { familyId: this.entity.id, type: "addDonate" },
          { familyId: this.entity.id, type: "removeDonate" },
          { familyId: this.entity.id, type: "addMoney" },
          { familyId: this.entity.id, type: "removeMoney" },
        ],
        cache: 30000,
        take: 50,
        order: { id: "DESC" },
      })
    ).map((log) => {
      return {
        amount: log.count > 0 ? log.count : log.count * -1,
        date: log.time,
        name: log.targetName,
        reason: log.text,
        type: log.type == "addMoney" || log.type == "removeMoney" ? 0 : 1,
      };
    }) as {
      date: number;
      amount: number;
      name: string;
      reason: string;
      type: number;
    }[];
  };

  addDonateByPlayer(player: PlayerMp, count: number, type = 0) {
    return new Promise<number>(async (resolve) => {
      if (!mp.players.exists(player) || !player.user || !player.user.family)
        return resolve(0);
      if (isNaN(count) || count <= 0) return resolve(0);
      if (player.user.level <= 1)
        return player.notify(
          "Пополнить счёт семьи может только игрок, достигший 2 уровня"
        );
      if (
        await player.user.tryPayment(
          count,
          type ? "all" : "donate",
          () => {
            return !!(
              mp.players.exists(player) &&
              player.user &&
              player.user.family
            );
          },
          `Пополнение счета семьи`,
          `Семья #${player.user.family.id}`
        )
      ) {
        player.notify(
          `Вы пополнили ${type ? "счет" : "донат-счет"} семьи на ${
            type ? "$" + count : count + " коинов"
          }`,
          "success"
        );
        if (type) this.addMoney(count, player, `Пополнение счёта`);
        else this.addDonateMoney(count, player, `Пополнение коинов`);
        return resolve(count);
      } else return resolve(0);
    });
  }

  playerKickPlayer(player: PlayerMp, id: number) {
    return new Promise<boolean>(async (resolve) => {
      if (!mp.players.exists(player) || !player.user || !player.user.family)
        return resolve(false);
      if (!player.user.family.isCan(player.user.familyRank, "kick")) {
        player.notify("У вас нет полномочий исключать члена семьи", "error");
        return resolve(false);
      }
      if (isNaN(id)) return resolve(false);

      const user = User.get(id);
      if (user) {
        player.notify(`Вы исключили из семьи игрока ${user.user.name}`, "info");
        if (user.user.family != player.user.family) {
          player.notify("Выбранный игрок не найден в семье", "error");
          return resolve(false);
        }
        user.user.family = null;
        user.user.notify(`${player.user.name} исключил Вас из семьи`, "info");
      } else {
        let member = await this.getMemberByID(id);
        if (!member) {
          player.notify("Выбранный игрок не найден в семье", "error");
          return resolve(false);
        }
        member.family = 0;
        member.familyRank = 0;
        member.save();
      }
      return resolve(true);
    });
  }

  async playerLeaveFamily(player: PlayerMp) {
    if (!mp.players.exists(player) || !player.user || !player.user.family)
      return;
    if (player.user.isFamilyLeader) {
      const family = player.user.family;
      if (family.cars.length || family.house)
        return player.notify(
          "Для удаления семьи у неё не должно быть владений (транспорта, недвижимости)"
        );
      if ((await family.getMembersCount()) > 1)
        return player.notify(
          "Для удаления семьи в ней не должно быть участников кроме Вас"
        );
      player.user.addMoney(
        family.money,
        true,
        "Оставшиеся средства на счету семьи при удалении"
      );
      player.notify("Вы удалили семью " + family.name);
      player.user.family = null;

      family.entity.remove();
      Family.families.splice(Family.families.indexOf(family), 1);

      return; // player.notify('Вы не можете покинуть семью, так как являетесь ее владельцем', 'error')
    }
    player.user.family = null;
    player.notify("Вы покинули семью");
    return;
  }

  playerSetRankPlayer(player: PlayerMp, id: number, rank: number) {
    return new Promise<boolean>(async (resolve) => {
      if (!mp.players.exists(player) || !player.user || !player.user.family)
        return resolve(false);
      if (!player.user.family.isCan(player.user.familyRank, "setRank")) {
        player.notify(
          "У вас нет полномочий изменять ранг члена семьи",
          "error"
        );
        return resolve(false);
      }
      if (isNaN(id)) return resolve(false);
      const newRank = player.user.family.getRank(rank);

      if (
        !newRank ||
        newRank.isOwner ||
        (!player.user.isFamilyLeader && newRank.isSoOwner)
      )
        return resolve(false);

      const user = User.get(id);
      if (user) {
        player.notify(
          `Вы изменили ранг члену семьи ${user.user.name} на ${newRank.name}`,
          "info"
        );
        if (user.user.family != player.user.family) {
          player.notify("Выбранный игрок не найден в семье", "error");
          return resolve(false);
        }
        user.user.familyRank = rank;
        user.user.notify(
          `${player.user.name} изменил ваш ранг в семье на ${newRank.name}`,
          "info"
        );
      } else {
        let member = await this.getMemberByID(id);
        if (!member) {
          player.notify("Выбранный игрок не найден в семье", "error");
          return resolve(false);
        }
        member.familyRank = rank;
        member.save();
      }
      return resolve(true);
    });
  }

  get getFamilyCanHouseClass() {
    let returnValues = {
      inMultiHouse: false,
      inCustomHouse: false,
      inHouseWithAir: false,
    };
    const levelInfo = LevelInfo[this.level - 1];
    if (levelInfo) {
      if (levelInfo.canBuyMultiHouse) returnValues.inMultiHouse = true;
      if (levelInfo.canBuyCustomHouse) returnValues.inCustomHouse = true;
      if (levelInfo.canBuyAirHouse) returnValues.inHouseWithAir = true;
    }
    return returnValues;
  }

  tryLevelUp(player: PlayerMp, type: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      if (!mp.players.exists(player) || !player.user || !player.user.family)
        return resolve(false);
      if (!player.user.family.isCan(player.user.familyRank, "level_up")) {
        player.notify("У вас нет полномочий повысить уровень семьи", "error");
        return resolve(false);
      }
      const requires = LevelInfo[this.level];
      if (!type) {
        if (this.level >= LevelInfo.length) {
          player.notify("У вашей семьи максимальный уровень", "error");
          return resolve(false);
        }
        const membersCount = await this.getMembersCount();
        if (
          membersCount < requires.members ||
          this.wins < requires.wins ||
          this.points < requires.scores
        ) {
          player.notify(
            "Ваша семья не достигла требований для повышения уровня",
            "error"
          );
          return resolve(false);
        }
      } else {
        if (
          !player.user.tryRemoveDonateMoney(
            requires.coin,
            true,
            "Повышение уровня семьи"
          )
        )
          return resolve(false);
        // if(this.donate < requires.coin) {
        //     player.notify('На семейном счете недостаточно коинов для пропуска уровня', 'error')
        //     return resolve(false)
        // }
        // this.donate -= requires.coin
        // system.saveLogFamily('removeDonate', 'Повышение уровня семьи', this.entity, player.user.id, player.user.name)
      }
      player.notify("Уровень семьи повышен", "success");
      this.level += 1;
      return resolve(true);
    });
  }

  sendNotificationToMembers(text: string, type?: AlertType, img?: string, time?: number) {
    const players = this.getPlayersOnline();
    for (const player of players) {
      player.notify(text, type, img, time);
    }
  }

  static getFamilyTop() {
    let num = 1;
    return Family.getAll()
      .sort((fOne, fTwo) => {
        return fTwo.seasonPoints - fOne.seasonPoints;
      })
      .map((f) => {
        return [num++, f.name, f.seasonPoints];
      });
  }
}

// Сделать проверку при перетаскивании ящика в инвентарь машины на проверку близости точек..
