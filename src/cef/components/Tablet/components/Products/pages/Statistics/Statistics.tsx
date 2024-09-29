import React, {Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import {IBusinessCatalogRating} from "../../../../../../../shared/tablet/business.config";

export class Statistics extends Component<{
    rating: IBusinessCatalogRating[]
}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="tp tp-statitic">
            <div className="tp-cat tp-statitic-grid tp-statitic-cat">
                <div style={{marginRight: "0.885416vw"}}>№</div>
                <div>Наименование</div>
                <div className="tp-statitic-cat__bold">Куплено:</div>
                <div>Последние покупки</div>
                <div>За неделю</div>
                <div>За месяц</div>
            </div>
            <div className="tp-list tp-statitic-list">

                {
                    this.props.rating && <>
                        {
                            this.props.rating.map((el, key) => {
                                return <div className="tp-list-block tp-statitic-grid" key={key}>
                                    <div className="tp-statitic-list__number">{key + 1}</div>
                                    <div className="tp-statitic-list__name">{el.name}</div>
                                    <div/>
                                    <div className="tp-statitic-list__day">{el.day}</div>
                                    <div className="tp-statitic-list__week">{el.week}</div>
                                    <div className="tp-statitic-list__month">{el.month}</div>
                                    <img src={svg["star"]} className="tp-statitic-list__star" alt=""/>
                                </div>
                            })
                        }
                    </>
                }

            </div>
        </div>;
    }
}