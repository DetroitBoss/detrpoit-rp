import React, {Component} from "react";

// @ts-ignore
import png from '../../assets/*.png'
// @ts-ignore
import svg from "../../assets/*.svg"
import { ACTIVITY_RENT_COST, ACTIVITY_RENT_TIME_IN_HOURS } from '../../../../../../../shared/farm/progress.config'
import { systemUtil } from '../../../../../../../shared/system'
import { CustomEvent } from '../../../../../../modules/custom.event'

export class FieldOwner extends Component<{id: number}, {}> {
    constructor(props: any) {
        super(props);
    }

    startRent(): void {
        CustomEvent.triggerServer('farm:rent', this.props.id)
    }

    render() {
        return <div className="farm-entrance-block-content">

            <img src={png['shovel']} className="farm-entrance-block-content__shovel"  alt=""/>

            <div className="farm-entrance-block-content__bigName">
                ПОЛЕ
            </div>

            <div className="farm-entrance-block-content__name">
                <div>АРЕНДУЙ</div>
                <span>ПОЛЕ</span>
            </div>

            <div className="farm-entrance-block-content__plan">
                <img src={svg["check"]} alt=""/>
                <span>Нанимай <br/> работников</span>
                <img src={svg["coin"]} alt=""/>
                <span>Получай <br/> прибыль</span>
            </div>

            <div className="farm-entrance-block-content__title">
                Поле является местом где вы можете выращивать овощи. Здесь вы можете посадить такие растения как: картофель, морковь, помидор, огурец, редька, лук.
                Каждое из растений имеет разную стоимость семян и готового плода. Процесс выращивания состоит из: культивации, посадки и сбора. 
                Для культивации используйте один из ближайших тракторов. 
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