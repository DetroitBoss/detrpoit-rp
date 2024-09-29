import {FractionsEntity} from "../typeorm/entities/fractions";
import {CustomEvent} from "../custom.event";
import {IFractionDTO} from "../../../shared/fractions/IFractionDTO";
import {FRACTION_RIGHTS, IFractionRank} from "../../../shared/fractions/ranks";
import {Fraction} from "./Fraction";
import {system} from "../system";

class FractionsManager {
    public fractionsList: FractionsEntity[] = []
    public fractionsDTOs: IFractionDTO[] = []

    constructor() {

        setTimeout(() => {
            this.init();
        }, 5000);


        CustomEvent.registerClient("client:fractions-config:init", this.clientInit);
    }

    private clientInit = (player: PlayerMp) => {
        this.fractionsDTOs.forEach(el => {
            CustomEvent.triggerClient(player, 'client:fractions-config:load', el);
        })
    }

    private syncClients(item: IFractionDTO) {
        mp.players.forEach(player => {
            CustomEvent.triggerClient(player, 'client:fractions-config:update', item);
        })
    }

    private async init() {
        const result = await FractionsEntity.find({});

        if (!result) return;

        this.fractionsList = result;

        this.fractionsList.forEach(el => {
            const dto: IFractionDTO = {
                id: el.fractionId,
                name: el.name,
                desc: el.desc,
                icon: el.icon,
                gos: el.gos,
                police: el.police,
                government: el.government,
                mafia: el.mafia,
                gang: el.gang,
                ranks: el.ranks.map(el => el.name),
                moneybase: 400,
                salaries: el.ranks.map(el => el.salary),
                color: el.color,
                blipgangcolor: el.blipgangcolor,
                codes: el.codes,
                spawn: el.spawn,
                armour_male: el.armour_male,
                armour_female: el.armour_female,
                armour_male_small: el.armour_male_small,
                armour_female_small: el.armour_female_small,
                armorName: el.armorName
            }

            this.fractionsDTOs.push(dto);
        });

        console.log(`Загружено ${this.fractionsList.length} фракций`)
    }

    public getFractionRanks(fractionId: number): IFractionRank[] {
        const item = this.fractionsList.find(el => el.fractionId === fractionId);

        if (!item) return [];

        return item.ranks;
    }

    public setFractionRanks(fractionId: number, items: IFractionRank[]) {
        const item = this.fractionsList.find(el => el.fractionId === fractionId);
        const fractionDtoItem = this.fractionsDTOs.find(el => el.id === fractionId);

        if (!item || !fractionDtoItem) return;

        item.ranks = items;
        fractionDtoItem.ranks = items.map(el => el.name);

        item.save().then(() => {
            this.syncClients(fractionDtoItem);
        });
    }
}

/** Менеджер фракций (связка с БД) **/
const manager = new FractionsManager();
/** Объект для изъятия данных **/
export const fraction = new Fraction(manager.fractionsList);
/** Хранение таймаутов для изменения рангов во фракциях **/
const timeouts = new Map<number, number>();

CustomEvent.registerCef('fraction:getRights', (player: PlayerMp) => {
    if (!player.user || !player.user.fraction) return [];

    return fraction.getRightsForRank(player.user.fraction, player.user.rank);
})

// Старая система (гнильё)

export const fractionCfg = {
    get policeFactions() {
        return fractionCfg.list.filter(q => q.police).map(q => q.id)
    },
    get gangFactions() {
        return fractionCfg.list.filter(q => q.gang).map(q => q.id)
    },
    get mafiaFactions() {
        return fractionCfg.list.filter(q => q.mafia).map(q => q.id)
    },
    get gos() {
        return fractionCfg.list.filter(q => q.gos)
    },
    list: manager.fractionsDTOs,
    /** Поиск конфигурации фракции по её ID */
    getFraction: (fractionid: number) => {
        return manager.fractionsDTOs.find(item => item.id == fractionid)
    },
    /** Название фракции */
    getFractionName: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        return data.name
    },
    /** Цвет фракции */
    getFractionColor: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return "#fc0317";
        return data.color || "#fc0317"
    },
    /** Иконка фракции */
    getFractionIcon: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        return data.icon
    },
    /** Описание фракции */
    getFractionDesc: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        return data.desc
    },
    /** Список рангов */
    getFractionRanks: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return [];
        return data.ranks
    },
    /** Получить ранг лидера */
    getLeaderRank: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        return data.ranks.length
    },
    getRankSalary: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return 0;
        return data.salaries[rank - 1];
    },
    /** Получить ранг зама лидера */
    getSubLeaderRank: (fractionid: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        return data.ranks.length - 2
    },
    /** Является ли член фракции лидером */
    isLeader: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return false;
        return data.ranks.length <= rank
    },
    /** Является ли член фракции замом лидера */
    isSubLeader: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return false;
        return (data.ranks.length - 1) <= rank
    },
    /** Позволяет узнать, существует ли указанный ранг во фракции */
    isRankCorrect: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data || !data.ranks[rank - 1]) return false;
        return true;
    },
    /** Позволяет узнать, существует ли указанный ранг во фракции */
    getRankName: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return null;
        if (!data.ranks[rank - 1]) return null;
        return data.ranks[rank - 1];
    },
    /** Подсчёт денег, которые заработает член фракции */
    getPayDayMoney: (fractionid: number, rank: number) => {
        let data = fractionCfg.getFraction(fractionid)
        if (!data) return 0;
        return data.moneybase
        // + data.salaries * rank
    }
}

// Взаимодействия с планшетом (в основном с менеджером)

CustomEvent.registerCef('tablet:getRanks', (player: PlayerMp, fractionId: number) => {
    return manager.getFractionRanks(fractionId);
})

CustomEvent.registerCef('tablet:setRanks', (player: PlayerMp, ranks: IFractionRank[]) => {
    if (!player.user || !player.user.fraction || !fractionCfg.isLeader(player.user.fraction, player.user.rank)) return;
    if (!timeouts.has(player.user.fraction) || system.timestamp - timeouts.get(player.user.fraction) > 360) {
        timeouts.set(player.user.fraction, system.timestamp);
        manager.setFractionRanks(player.user.fraction, ranks);
        fraction.updateFractionsData(manager.fractionsList);
        player.notify('Изменения успешно сохранены', 'success');
        player.user.log("tabletFraction", `Изменил ранги во фракции ${player.user.fraction}`)

    }else{
        player.notify('Слишком часто! Можно сохранять раз в 5 минут', 'error');
    }
})

CustomEvent.registerClient('fraction:haveDoorRights', (player: PlayerMp) => {
    if (!player.user || !player.user.fraction) return false;

    const result = fraction.getRightsForRank(player.user.fraction, player.user.rank);

    return result.includes(FRACTION_RIGHTS.DOORS);
})


