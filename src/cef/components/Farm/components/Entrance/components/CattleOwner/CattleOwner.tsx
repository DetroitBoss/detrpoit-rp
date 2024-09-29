import React, {Component} from "react";

// @ts-ignore
import png from '../../assets/*.png'
// @ts-ignore
import svg from "../../assets/*.svg"
import { ACTIVITY_RENT_COST, ACTIVITY_RENT_TIME_IN_HOURS } from '../../../../../../../shared/farm/progress.config'
import { systemUtil } from '../../../../../../../shared/system'
import { CustomEvent } from '../../../../../../modules/custom.event'

export class CattleOwner extends Component<{id: number}, {}> {
    constructor(props: any) {
        super(props);
    }

    startRent(): void {
        CustomEvent.triggerServer('farm:rent', this.props.id)
    }

    render() {
        return <div className="farm-entrance-block-content">

            <img src={png['cow']} className="farm-entrance-block-content__cow"  alt=""/>

            <div className="farm-entrance-block-content__bigName">
                СКОТ
            </div>

            <div className="farm-entrance-block-content__name">
                <div>АРЕНДУЙ</div>
                <span>СКОТ</span>
            </div>

            <div className="farm-entrance-block-content__plan">
                <img src={svg["check"]} alt=""/>
                <span>Нанимай <br/> работников</span>
                <img src={svg["coin"]} alt=""/>
                <span>Получай <br/> прибыль</span>
            </div>

            <div className="farm-entrance-block-content__title">
                Здесь вы можете разводить скот. На данный момент доступны только коровы. Чтобы корова дала молока вам необходимо её накорммить.
                Учтите что чем дешевле корм тем больше раз вам нужно подоить корову. Корм можно найти на складе или купить в магазине.
            </div>

            <div className="farm-entrance-block-content__button">
                <div onClick={() => this.startRent()}>
                    АРЕНДОВАТЬ
                </div>
                <span>
                    $ { systemUtil.numberFormat(ACTIVITY_RENT_COST) }
                </span>
                <p>
                    / { ACTIVITY_RENT_TIME_IN_HOURS }  часов
                </p>
            </div>


        </div>
    }
}