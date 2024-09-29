import './style.less';
import React, {Component} from 'react';
import $ from 'jquery';
import svgs from './images/svg/*.svg'
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {CEF} from '../../modules/CEF';
import images from '../../modules/Alert/images/*.png'
// @ts-ignore
import ProgressBar from 'progressbar.js';

export class HudAlertsClass extends Component<{}, {
    ids: number,
    style: React.CSSProperties,
    alerts: { ids: number, text: string, title: string, img: string, time: number, timeCurrent: number, type: "alert" | "info" | "warning" | "success" | "error", progress: any }[]
    requests: { id: number, text: string, time: number, timeCurrent: number, progress: any }[]
}> {
    ev: CustomEventHandler;
    ev1: CustomEventHandler;
    ev2: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            style: {},
            ids: 0,
            alerts: [],
            requests: [],
        }


        this.ev = CustomEvent.register('cef:alert:setAlert', (type: "alert" | "info" | "warning" | "success" | "error", text: string, img: string, time = 5000, title?: string) => {
            if (!CEF.id || CEF.gui.currentGui === "personage") return;

            const alerts = [...this.state.alerts];
            const old = alerts.find(q => q.text === text && q.title === title && q.type === type && q.img === img);
            if (old) {
                old.time = Math.max(old.time, time);
                old.timeCurrent = 0;
            } else {
                alerts.push({
                    type, text, img, time, title, ids: this.state.ids, timeCurrent: 0, progress: null
                });
            }
            this.setState({ ids: this.state.ids + 1, alerts });
        });

        this.ev1 = CustomEvent.register('dialog:accept', (id: number, type: "big" | "small", text: string, time: number = 5000) => {
            if (type !== "small") return;
            const requests = [...this.state.requests];
            requests.push({ id, text, time, timeCurrent: 0, progress: null })
            this.setState({requests});
        })


        setInterval(() => {
            let alerts = [...this.state.alerts]
            alerts.map((alert, ids) => {
                alert.timeCurrent += 100;
                alert.timeCurrent = Math.min(alert.timeCurrent, alert.time);
                if (!alert.progress && $(`#alert_${alert.ids}`)) {
                    alert.progress = new ProgressBar.Circle(`#alert_${alert.ids}`, {
                        strokeWidth: 16,
                        easing: 'easeInOut',
                        duration: 98,
                        color: '#ffffff',
                        trailColor: 'rgba(196, 196, 196, 0.3)',
                        trailWidth: 16,
                        svgStyle: null
                    })
                }
                alert.progress.animate(alert.timeCurrent / alert.time);
                if (alert.timeCurrent >= alert.time) {
                    alerts.splice(ids, 1);
                }
            })

            const requests = [...this.state.requests];
            requests.map((request, ids) => {
                request.timeCurrent += 100;
                request.timeCurrent = Math.min(request.timeCurrent, request.time);
                if (!request.progress && $(`#request_${request.id}`)) {
                    request.progress = new ProgressBar.Circle(`#request_${request.id}`, {
                        strokeWidth: 16,
                        easing: 'easeInOut',
                        duration: 98,
                        color: '#ffffff',
                        trailColor: 'rgba(196, 196, 196, 0.3)',
                        trailWidth: 16,
                        svgStyle: null
                    })
                }
                request.progress.animate(request.timeCurrent / request.time);
                if (request.timeCurrent >= request.time) {
                    requests.splice(ids, 1);
                    CustomEvent.triggerClient('dialog:accept:status', request.id, false)
                }
            })
            this.setState({ alerts, requests });
        }, 100)

    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.ev1) this.ev1.destroy();
        if (this.ev2) this.ev2.destroy();
    }

    render() {
        return <>
            {this.state.alerts.map(alert => {
                return <div key={`alert_${alert.ids}`} className={"hud-advice-item " + (alert.type || 'info')}>
                    <div className="hud-bg-blur-advice-item"></div>
                    {alert.img ? <div className="img-wrap"><img src={images[alert.img] || alert.img} /></div> : <></>}
                    <div className="text-wrap">
                        {alert.title ? <p className="p-title">{alert.title}</p> : <></>}
                        <p className={alert.title ? 'p-descr' : "p-title"}>{alert.text.split('br/').map((q, i,a) => {return <>{q}{a[i+1] ? <br/> : <></>}</>})}</p>
                    </div>
                    <div className="circle-wrap">
                        <div id={`alert_${alert.ids}`}></div>
                    </div>
                </div>
            })}
            {this.state.requests.map((request, id) => {
                return <div className="hud-advice-item v2 info">
                    <div className="hud-bg-blur-advice-item"></div>
                    <div className="button-wrap">
                        <button className="hud-main-btn" onClick={e => {
                            e.preventDefault();
                            const requests = [...this.state.requests];
                            const ids = requests.findIndex(q => q.id === request.id);
                            CustomEvent.triggerClient('dialog:accept:status', request.id, true)
                            requests.splice(ids, 1);
                            this.setState({ requests })
                        }}>
                            <img src={svgs['check-btn']} width="24" height="24" />
                        </button>
                        <button className="btn-white-transparent" onClick={e => {
                            e.preventDefault();
                            const requests = [...this.state.requests];
                            const ids = requests.findIndex(q => q.id === request.id);
                            CustomEvent.triggerClient('dialog:accept:status', request.id, false)
                            requests.splice(ids, 1);
                            this.setState({ requests })
                        }}>
                            <img src={svgs['cancel-btn']} width="24" height="24" />
                        </button>
                    </div>
                    <div className="text-wrap">
                        <p className="p-title">{request.text}</p>
                    </div>
                    <div className="circle-wrap">
                        <div id={`request_${request.id}`}></div>
                    </div>
                </div>
            })}

        </>
    }
};