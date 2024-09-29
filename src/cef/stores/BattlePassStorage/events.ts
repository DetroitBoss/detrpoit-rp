import {IBattlePassItemDTO} from "../../../shared/battlePass/storage";
import BattlePassStorageStore from "./index";

export default {
    'battlePass:storage:setData': (store: BattlePassStorageStore, inventory: IBattlePassItemDTO, storage: IBattlePassItemDTO) => {
        store.setState({
            inventory,
            storage
        })
    }
}