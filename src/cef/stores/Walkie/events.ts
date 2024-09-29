import WalkieStore from "./index";
import {CEF} from "../../modules/CEF";
import {CustomEvent} from "../../modules/custom.event";

export default {
    "radio:switchRadio": (store: WalkieStore) => {
        if (!store.opened) CEF.gui.enableCusrsor()
        else CEF.gui.disableCusrsor()
        store.setState({show: !store.opened, opened: !store.opened});
    },

    "radio:speaking": (store: WalkieStore, enabled: boolean) => {
        if (enabled === store.enabled) return;
        CustomEvent.trigger('radio:sound', enabled, 0.4);
        store.setState({show: enabled, enabled});
    },

    "radio:speakersList": (store: WalkieStore, currentSpeakers: string[]) => {
        if (store.currentSpeakers === currentSpeakers) return;
        store.setState({currentSpeakers});
    },

    "radio:setFreq": (store: WalkieStore, freq: string) => {
        if (store.freq === freq) return;
        store.setState({freq});
    }
}