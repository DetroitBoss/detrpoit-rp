import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import {BATTLE_PASS_SEASON} from "../../../../../shared/battlePass/main";
import {RatingDTO} from "../../../../../shared/battlePass/DTOs";


export class Rating extends Component<{
    rating: RatingDTO[]
}, {}> {

    constructor(props: any) {
        super(props);

    }

    render() {
        return <>
            <img src={png["background"]} alt="" className="rating__background"/>

            <div className={"rating"}>


                <div className="rating-title">
                    Рейтинг
                    <span>
                    Топ 3 игрока
                </span>
                </div>

                <div className="rating-body">

                    <div className="rating-body-left">

                        <div className="rating-body-left-categories">
                            <div className="rating-body-left-categories__number">№</div>
                            <div className="rating-body-left-categories__name">Имя</div>
                            <div className="rating-body-left-categories__level">Уровень</div>
                        </div>

                        <div className="rating-body-left-scroll">

                            {
                                this.props.rating.sort((a,b) => a.place - b.place).map((el, key) => {

                                    return <div className="rating-body-left-block"  key={key}>
                                        <div className="rating-body-left-block__number">{el.place + 1}</div>
                                        <div className="rating-body-left-block__name">{el.name} ({el.id})</div>
                                        <div className="rating-body-left-block__level">
                                            {Math.trunc(el.exp / BATTLE_PASS_SEASON.levelExp)}
                                            <img src={svg["shield"]} alt=""/>
                                        </div>
                                    </div>
                                })
                            }

                        </div>

                    </div>

                    <div className="rating-body-right">

                        {
                            this.props.rating.map((el, key) => {
                                if (key > 2) return;

                                let image = "goldStar";

                                if (key === 1) {
                                    image = "silverStar";
                                }
                                else if (key === 2) {
                                    image = "bronzeStar";
                                }

                                return <div className="rating-body-right-block" key={key}>
                                    <img src={png[image]} alt=""/>
                                    <span>№{key + 1}</span>
                                    {el.name} ({el.id})
                                </div>
                            })
                        }
                    </div>

                </div>

            </div>
        </>
    }
}