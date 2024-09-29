import HomeMenuStore from "./index";
import {IFurnitureDTO} from "../../../shared/houses/menu/menu.web";

export default {
    'homeMenu:furniture': (store: HomeMenuStore, furniture: IFurnitureDTO[]) => {
        store.setState({
            furniture: furniture
        })
    },

    'homeMenu:interior': (store: HomeMenuStore, id: number) => {
        store.setState({
            interiorId: id
        })
    },

    'homeMenu:currencies': (store: HomeMenuStore, cash: number, bank: number, coins: number) => {
        store.setState({
            cash,
            wallet: bank,
            coins
        })
    }
}