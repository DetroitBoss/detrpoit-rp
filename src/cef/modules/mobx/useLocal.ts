import {CustomEvent} from "../custom.event";


export const useLocalStore = (creator: any, events?: any) => {
    const store = creator;

    if (events) {
        for (let item in events) {
            CustomEvent.register(item, (...args) => events[item](store, ...args))
        }
    }

    return store;
}