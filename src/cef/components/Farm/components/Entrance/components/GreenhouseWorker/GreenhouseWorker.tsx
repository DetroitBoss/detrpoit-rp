import React, {Component} from "react";

// @ts-ignore
import png from '../../assets/*.png'
// @ts-ignore
import svg from "../../assets/*.svg"
import { IEntranceWorkerData } from '../../Entrance'
import { systemUtil } from '../../../../../../../shared/system'
import { CustomEvent } from '../../../../../../modules/custom.event'

export class GreenhouseWorker extends Component<{
    data: IEntranceWorkerData
}, {}> {
    constructor(props: any) {
        super(props);
    }

    startWork(): void {
        CustomEvent.triggerServer('farm:work:start', this.props.data.id)
    }

    render() {
        return <div className="farm-entrance-block-content">


            <img src={png['greenhouse']} className="farm-entrance-block-content__greenhouse"  alt=""/>

            <img src={png['hat']} className="farm-entrance-block-content__hat"  alt=""/>

            <div className="farm-entrance-block-content__bigName">
                ТЕПЛИЦА
            </div>

            <div className="farm-entrance-block-content-level">
                <div className="farm-entrance-block-content-level__info">
                    <span>{ this.props.data.level }</span>
                    <img src={svg["level"]} alt=""/>
                </div>
                <div className="farm-entrance-block-content-level__name">
                    <span>Главный фермер</span>
                    <p>{ this.props.data.ownerName }</p>
                </div>
            </div>

            <div className="farm-entrance-block-content__plan">
                <img src={svg["coin"]} alt=""/>
                <span>Зарплата <br/> <div>${systemUtil.numberFormat(this.props.data.salary)} в час</div></span>
                <img src={svg["clock"]} alt=""/>
                <span>До конца аренды <br/> <div>{this.props.data.rentTime[0]} час {this.props.data.rentTime[1]} мин</div></span>
            </div>

            <div className="farm-entrance-block-content__title">
                Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности
                представляет собой интересный эксперимент проверки существенных финансовых и административных условий.
                Не следует, однако забывать, что дальнейшее развитие различных форм деятельности влечет за собой процесс
                внедрения и
            </div>

            <div className="farm-entrance-block-content__button">
                <div onClick={() => this.startWork()}>
                    Устроиться на работу
                </div>
            </div>


        </div>
    }
}