import HudGunGameStore from "./index";
import {IGunGamePlayerScore, IGunGamePlayerScores} from "../../../shared/hudgungame";

export default {
    "HudGunGame:show": (store: HudGunGameStore, payload: IGunGamePlayerScores) => {
        store.setState({
            show: true,
            topPlayers: payload.topPlayers,
            myKills: payload.myKills
        })
    },

    "HudGunGame:hide": (store: HudGunGameStore) => {
        store.setState({
            show: false,
        })
    },
}
