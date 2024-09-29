import React, {Component} from "react";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"
import { CEF } from '../../../../modules/CEF'
import { CustomEvent } from '../../../../modules/custom.event'
import { IFarmOwnerData } from '../../../../../shared/farm/dtos'
import { ACTIVITY_RENT_TIME_IN_HOURS } from '../../../../../shared/farm/progress.config'
import { systemUtil } from '../../../../../shared/system'

interface ratingPerson {
    money: number,
    name: string,
    level: number,
    percent: number
}

export class Rating extends Component<{}, {
    id: number
    rentTime: [number, number]
    authorizedCapital: number,
    paidOut: number,
    rating: ratingPerson[],
    attentionShow: boolean,
    amountRef: React.RefObject<any>
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            id: 1,
            rentTime: [0, 0],
            authorizedCapital: 40000,
            paidOut: 2000,
            rating: [
                {
                    money: 300,
                    name: "Borz Borz",
                    level: 40,
                    percent: 30
                },
                {
                    money: 300,
                    name: "Borz Borz",
                    level: 40,
                    percent: 30
                },
                {
                    money: 300,
                    name: "Borz Borz",
                    level: 40,
                    percent: 30
                },
                {
                    money: 300,
                    name: "Borz Borz",
                    level: 40,
                    percent: 30
                },
            ],
            attentionShow: false,
            amountRef: React.createRef()
        }
        
        CustomEvent.register('farm:owner', (data: IFarmOwnerData) => {
            let maxEarned = 0
            data.workers.forEach(worker => {
                if (worker.money > maxEarned) maxEarned = worker.money
            })
            
            this.setState({
                id: data.id,
                authorizedCapital: data.capital,
                paidOut: data.totalPaid,
                rentTime: [Math.floor(((data.rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) / 3600),
                    Math.floor(((data.rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) % 3600 / 60)],
                rating: data.workers.map(worker => {
                    return {
                        name: worker.name,
                        level: worker.level,
                        money: worker.money,
                        percent: worker.money / maxEarned * 100
                    }
                })
            })
        })
    }

    close() {
        CEF.gui.setGui(null)
    }

    closeAttention() {
        this.setState({...this.state, attentionShow: false});
    }

    addCapital() {
        this.setState({...this.state, attentionShow: !this.state.attentionShow});
    }

    stopRent() {
        CustomEvent.triggerServer('farm:rent:stop', this.state.id)
    }

    spaceNumber(value: number) {
        return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
    }

    enterAttention() {
        const value = Number(systemUtil.filterInput(this.state.amountRef.current.value))

        if (isNaN(value) || value <= 0 || value > 999999)
            return CEF.alert.setAlert('error', 'Сумма введена неверно')

        CustomEvent.triggerServer('farm:capital:add', value)
    }

    render() {
        return <div className="farm-rating">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["logo"]} className="farm-entrance__logo" alt=""/>
            <img src={png["dot"]} className="farm-entrance__dot" alt=""/>

            <img src={svg["block"]} alt="" className="farm-statistic__block"/>
            <img src={png["shovel"]} alt="" className="farm-statistic__shovel"/>

            {this.state.attentionShow && <div className="farm-rating-attention">
                <div className="farm-rating-attention-body">
                    <img src={svg["close"]} className="farm-rating-attention-body__close" alt=""
                         onClick={() => this.closeAttention()}/>

                    <div className="farm-rating-attention-body__title">
                        Добавить уставной капитал
                    </div>

                    <div className="farm-rating-attention-body__input">
                        <div>$</div>
                        <input ref={this.state.amountRef} type="number" placeholder="Введите сумму"/>
                    </div>

                    <div className="farm-rating-attention-body-buttons">
                        <div onClick={() => this.enterAttention()}>ДОБАВИТЬ</div>
                        <div onClick={() => this.closeAttention()}>ОТМЕНА</div>
                    </div>
                </div>
            </div>}


            <div className="farm-rating-body">

                <div className="farm-rating-body__buttons">
                    <div className="farm-rating-body__button" onClick={() => this.addCapital()}>
                        <img src={svg["coin"]} alt=""/>
                        ДОБАВИТЬ КАПИТАЛ
                    </div>

                    <div className="farm-rating-body__button" onClick={() => this.stopRent()}>
                        <img src={svg["closeIcon"]} alt=""/>
                        ОТМЕНИТЬ АРЕНДУ
                    </div>
                </div>
                

                <div className="farm-statistic-body-information">
                    <div>
                        <span>Уставной капитал</span>
                        <p>{this.spaceNumber(this.state.authorizedCapital)} $</p>
                    </div>
                    <hr/>
                    <div>
                        <span>Выплачено</span>
                        <p>{this.spaceNumber(this.state.paidOut)} $</p>
                    </div>
                    <div>
                        <span>Время до конца аренды</span>
                        <p>{this.state.rentTime[0]} час {this.state.rentTime[1]} мин</p>
                    </div>
                </div>


                <div className="farm-rating-body-content">

                    {
                        this.state.rating.map((el, key) => {


                            return <div className="farm-rating-body-content-block" key={key}>
                                <div className="farm-rating-body-content-block__money">
                                    {this.spaceNumber(el.money)}$
                                </div>
                                <div className="farm-rating-body-content-block__column"
                                     style={{height: `${el.percent}%`}}/>
                                <div className="farm-rating-body-content-block__name">
                                    {el.name}
                                </div>
                                <div className="farm-rating-body-content-block__lvl">
                                    {el.level} lvl
                                </div>
                            </div>
                        })
                    }

                </div>

            </div>

        </div>
    }
}