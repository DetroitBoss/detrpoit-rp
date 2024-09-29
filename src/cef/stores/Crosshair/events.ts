import CrosshairStore from "./index";
import {ICrosshairSettings} from "../../../shared/crosshair";

export default {
    'crosshair:enable': (store: CrosshairStore) => {
        console.log(`set ${JSON.stringify(store.settings)}`)
        store.setState({
            show: true
        })
    },

    'crosshair:disable': (store: CrosshairStore) => {
        store.setState({
            show: false
        })
    },

    'crosshair:setSettings': (store: CrosshairStore, settings: ICrosshairSettings) => {
        if (!settings)
            return

        store.setState({
            settings
        });

        if (!settings.enable && store.canvas.current) {
            store.canvas.current
                .getContext("2d")
                .clearRect(0, 0, store.canvasSize[0], store.canvasSize[1]);
        }
    }
}