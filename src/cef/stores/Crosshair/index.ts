import {action, makeObservable, observable} from "mobx";
import WebStore from "../../../shared/WebStore";
import React from "react";
import {ICrosshairSettings} from "../../../shared/crosshair";
import {CEF} from "../../modules/CEF";

export default class CrosshairStore extends WebStore {
    show: boolean = CEF.test;
    canvas: React.RefObject<any> = React.createRef();
    ctx: any = null
    settings: ICrosshairSettings = {
        width: 3,
        length: 20,
        alpha: 1,
        gap: 5,
        color: { r: 255, g: 255, b: 0 },
        enable: true,
        aimColor: { r: 0, g: 255, b: 0 },
    }
    canvasSize: [number, number] = [100, 100];

    constructor() {
        super();
        makeObservable(this, {
            show: observable,
            canvas: observable,
            ctx: observable,
            settings: observable,
            canvasSize: observable,
            setState: action.bound
        })
    }
}