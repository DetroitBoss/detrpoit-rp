import {IFractionDTO} from "../../shared/fractions/IFractionDTO";
import {CustomEvent} from "./custom.event";

let fractionsConfig: IFractionDTO[] = [];

if (!location.host.includes(':1234')) {
    mp.events.add('cef:fractions-config:load', (data: string) => {
        fractionsConfig.push(JSON.parse(data));
    })

    mp.events.add('cef:fractions-config:update', (dataJSON: string) => {
        let data: IFractionDTO = JSON.parse(dataJSON);

        let itemKey;
        const item = fractionsConfig.find((el, key) => {
            if (el.id === data.id) {
                itemKey = key;
                return true;
            }
        });

        if (!item || !itemKey) return;

        fractionsConfig[itemKey] = data;
    })
}


export const fractionCfg = {
    get policeFactions(){
        return fractionCfg.list.filter(q => q.police).map(q => q.id)
    },
    get gangFactions(){
        return fractionCfg.list.filter(q => q.gang).map(q => q.id)
    },
    get mafiaFactions(){
        return fractionCfg.list.filter(q => q.mafia).map(q => q.id)
    },
    get gos(){
        return fractionCfg.list.filter(q => q.gos)
    },
    list: fractionsConfig,
    /** Поиск конфигурации фракции по её ID */
    getFraction: (fractionid: number) => {
        return fractionsConfig.find(item => item.id == fractionid)
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
        if (!data) return false;
        if (!data.ranks[rank - 1]) return false;
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