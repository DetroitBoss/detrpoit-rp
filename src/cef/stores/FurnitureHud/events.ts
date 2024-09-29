import FurnitureHudStore from "./index";
export default {
    'furnitureHud:direction': (store: FurnitureHudStore, direction: 'x' | 'y' | 'z') => {
        store.setState({
            direction
        })
    },

    'furnitureHud:moveType': (store: FurnitureHudStore, moveType: boolean) => {
        store.setState({
            moveType
        })
    }
}