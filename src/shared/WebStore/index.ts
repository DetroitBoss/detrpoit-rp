export default class WebStore {
    setState(object: any, cb?: Function) {
        for (let item in object) {
            // @ts-ignore
            this[item] = object[item];
        }

        if (cb) cb();
    }
}