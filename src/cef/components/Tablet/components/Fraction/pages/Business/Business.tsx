import React from "react";
import bizImg from '../../../../images/businesses/*.png';
import {systemUtil} from "../../../../../../../shared/system";
import {familyFractionPayDayRewardPercent} from "../../../../../../../shared/economy";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE_NAMES} from "../../../../../../../shared/business";

export class Business extends React.Component<{
    mafiaData: { id: number, name: string, price: number, type: number, stype: number}[]
}, {}> {

    constructor(props: any) {
        super(props);

        this.state = {}
    }

    render() {
        return <div className="tablet-fraction-body">

            <div className="tablet-fraction-body__title">
                Бизнесы под контролем ({this.props.mafiaData.length} шт.)
            </div>

            <div className="tablet-fraction-business">
                {
                    this.props.mafiaData.map((biz, key) => {
                        return <div className="tablet-fraction-business-block" key={key}>
                            <img src={bizImg[biz.type]} alt="" className="tablet-fraction-business-block__img"/>
                            <div className="tablet-fraction-business-block__title">{biz.name} #{biz.id}</div>
                            <div className="tablet-fraction-business-block__description">{BUSINESS_TYPE_NAMES[biz.type]} ({BUSINESS_SUBTYPE_NAMES[biz.type][biz.stype]})</div>
                            <div className="tablet-fraction-business-block-flex">
                                <div className="tablet-fraction-business-block-flex__button">
                                    ${biz.price}
                                </div>
                                <div className="tablet-fraction-business-block-flex__text">
                                    Доход в час: <br/>
                                    ${systemUtil.numberFormat(Math.floor((((biz.price / 100) * familyFractionPayDayRewardPercent) / 24)))}
                                </div>
                            </div>
                        </div>
                    })
                }

            </div>

        </div>
    }
}