import React, {Component} from "react";
import "./style.less";
import png from './assets/*.png'
import svg from "./assets/*.svg"
import {CEF} from "../../modules/CEF";


export class CasinoEnter extends Component<{}, {
    component: number
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            component: 0
        };
    }

    close() {
        CEF.gui.close();
    }

    changeComponent() {
        if (this.state.component === 4) return;

        this.setState({...this.state, component: this.state.component + 1});
    }


    render() {
        return <div className="casino">

            <img className="casino__smoke " src={png["smoke"]} alt=""/>

            {this.state.component === 0 && <div className="casino-content">


                <div className="casino-content-slide">
                    <img src={svg['furtherButton']} className="casino-content-slide__button" alt="" onClick={() => this.changeComponent()}/>
                    <div>1 <span>/ 5</span></div>
                </div>



                <div className="casino-content-information">
                    <div className="casino-content-information__block">
                        <img src={svg["welcomeImg"]} className="casino-content-information__block-welcomeImg" alt=""/>
                    </div>
                </div>


                <div className="casino-content__line"/>

            </div>}

            {this.state.component === 1 && <div className="casino-content">


                <div className="casino-content-slide">
                    <img src={svg['furtherButton']} className="casino-content-slide__button" alt="" onClick={() => this.changeComponent()}/>
                    <div>2 <span>/ 5</span></div>
                </div>

                <div className="casino-content-information">

                    <div className="casino-content-information__name">ФИШКИ</div>

                    <div className="casino-content-information__block">
                        <img src={png["chipsImg"]} alt=""/>
                        <div>
                            Фишки - основная валюта в казино.
                            Вы можете купить их либо же обменять их на игровую валюту у NPC Аnna,
                            которая находится за стойкой CASHIER на входе.
                        </div>
                    </div>
                </div>


                <div className="casino-content__line"/>

            </div>}

            {this.state.component === 2 && <div className="casino-content">


                <div className="casino-content-slide">
                    <img src={svg['furtherButton']} className="casino-content-slide__button" alt="" onClick={() => this.changeComponent()}/>
                    <div>3 <span>/ 5</span></div>
                </div>



                <div className="casino-content-information">

                    <div className="casino-content-information__name">КОСТИ</div>

                    <div className="casino-content-information__block">
                        <img src={png["diceImg"]} alt=""/>
                        <div>
                            Основной принцип игры в кости — каждый игрок по очереди бросает некоторое количество игральных костей,
                            после чего результат броска используется для определения победителя или проигравшего.
                        </div>
                    </div>
                </div>


                <div className="casino-content__line"/>

            </div>}

            {this.state.component === 3 && <div className="casino-content">


                <div className="casino-content-slide">
                    <img src={svg['furtherButton']} className="casino-content-slide__button" alt="" onClick={() => this.changeComponent()}/>
                    <div>4 <span>/ 5</span></div>
                </div>



                <div className="casino-content-information">

                    <div className="casino-content-information__name">РУЛЕТКА</div>

                    <div className="casino-content-information__block">
                        <img src={png["rouletteImg"]} alt=""/>
                        <div>
                            Одна из самых увлекательнейших игр в нашем казино!
                            Попытай удачу на разделённом по секторам поле.
                            Здесь ты сможешь придумать множество стратегий,
                            а шарик крупье направит тебя на путь к богатой жизни.
                        </div>
                    </div>
                </div>


                <div className="casino-content__line"/>

            </div>}

            {this.state.component === 4 &&<div className="casino-content">


                <div className="casino-content-slide">
                    <img src={svg['closeButton']} className="casino-content-slide__button" alt="" onClick={() => this.close()}/>
                    <div>5 <span>/ 5</span></div>
                </div>


                <div className="casino-content-information">

                    <div className="casino-content-information__name"><span>VIP</span> КОМНАТА</div>

                    <div className="casino-content-information__block">
                        <img src={png["vipImg"]} alt=""/>
                        <div>
                            Для игры за столами комнат "High Limit" вы должны приобрести VIP "Ruby" или "Diamond" в магазине нашего сервера.
                            Приобретай доступ и играй по крупному!
                        </div>
                    </div>
                </div>


                <div className="casino-content__line"/>

            </div>}

        </div>
    }
}