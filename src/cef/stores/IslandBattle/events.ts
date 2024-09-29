import IslandBattleStore from "./index";
import {IBattleStatusDTO} from "../../../shared/islandBattle";

export default {
    "islandBattle:setData": (store: IslandBattleStore, time: number, dto: IBattleStatusDTO) => {
        store.setState({show: true, time, result: dto});
    },

    "islandBattle:updateTime": (store: IslandBattleStore, time: number) => {
        store.setState({show: true, time});
    },

    "islandBattle:updateStatus": (store: IslandBattleStore, dto: IBattleStatusDTO) => {
        store.setState({show: true, result: dto});
    },

    "islandBattle:close": (store: IslandBattleStore) => {
        setTimeout(() => {
            store.setState({show: false});
        }, 500)
    }
}