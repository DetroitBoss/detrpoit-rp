import React from 'react';
import './assets/sign.less';
import './assets/signpad.less';
// @ts-ignore
import SignaturePad from 'react-signature-pad';
import close from './assets/close.svg'
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';

export class Signature extends React.Component<{}, {
    show: boolean;
    info: string;
    errorText: string;
    document: string,
    ids: number;
}> {
    ref: () => void;
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            document: "test",
            show: CEF.test ? true : false,
            info: "Распишитесь для получения кредита",
            errorText: "",
            ids: 0
        };
        this.ref = (this.refs.mySignature as any);
        this.ev = CustomEvent.register('signature:load', (info: string, document: string, ids: number) => {
            this.setState({ show: true, info, document, ids})
        })
    }
    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
    }
    closeSign = () => {
        this.setState({ ...this.state, show: false });
        CEF.gui.setGui(null);
    }
    async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
        const res: Response = await fetch(dataUrl);
        const blob: Blob = await res.blob();
        return new File([blob], fileName, { type: 'image/png' });
    }
    sendSign = () => {
        if ((this.refs.mySignature as any).isEmpty()) return 1;
        let result = (this.refs.mySignature as any).toDataURL();
        if (result.length > 35000) return this.setState({ ...this.state, errorText: "Слишком большая подпись" });
        this.dataUrlToFile(result, 'file.png').then(d => {
            CEF.saveSignature(d, this.state.document).then(status => {
                CustomEvent.triggerClient('signature:save', this.state.ids, status)
                CEF.gui.setGui(null);
            })
        })
    }
    clearSign = () => {
        (this.refs.mySignature as any).clear();
    }
    clearError = () => {
        if (this.state.errorText) {
            this.clearSign();
            this.setState({ ...this.state, errorText: "" });
            console.log((this.refs.mySignature as any).toDataURL());
        }
    }
    componentDidMount = () => {
        if (this.state.show) {
            (this.refs.mySignature as any).minWidth = 0.8;//*Math.max((window as any).devicePixelRatio || 1, 1);
            (this.refs.mySignature as any).maxWidth = 2;//*Math.max((window as any).devicePixelRatio || 1, 1);
            (this.refs.mySignature as any).onBegin = () => {
                this.clearError();
            }
        }
    }
    render() {
        if (!this.state.show) return null;
        return <>
            <div className="signature_blur" />
            <div className="signature_grid" />
            <div className="signature_main">
                <div className="signature_close"><img src={close} onClick={this.closeSign} /></div>
                <h1>Оставьте подпись</h1>
                <h2 style={this.state.errorText ? { color: "#FF6E67" } : {}}>{this.state.errorText ? this.state.errorText : this.state.info}</h2>
                <SignaturePad ref="mySignature" />
                <div className="signature_keys">
                    <div onClick={this.sendSign}>Сохранить</div>
                    <div onClick={this.clearSign}>Очистить</div>
                </div>
            </div>
        </>
    }
}