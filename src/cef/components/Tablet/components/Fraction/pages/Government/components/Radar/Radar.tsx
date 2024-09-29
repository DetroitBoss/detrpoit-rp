import React from "react";

import png from "../../../../assets/*.png";
import svg from "../../../../assets/*.svg";
import {IFractionData} from "../../../../../../../../../shared/fractions/ranks";
import classNames from "classnames";
import {CEF} from "../../../../../../../../modules/CEF";

export class Radar extends React.Component<{
    fractionData: IFractionData
    activateTrack: Function
}, {}> {

    constructor(props: any) {
        super(props);

    }

    getFractionMember(id: number) {
        if (!this.props.fractionData) return null;
        return this.props.fractionData.members.find(q => q.id === id)
    }

    render() {
        return <>
            <div className="government__title">
                <img src={svg["radar"]} alt=""/>
                GPS маяк
            </div>

            <div className="government-radar">
                <div className="government-radar-description">
                    <div className={classNames("government-radar-switcher", {
                        'government-radar-switcher__active': this.getFractionMember(CEF.id) && this.getFractionMember(CEF.id).tracker
                    })} onClick={() => this.props.activateTrack(0)}>
                        <div/>
                    </div>
                    <div className="government-radar-description-text">
                        <div className="government-radar-description-text__title">Маячок</div>
                        <div className="government-radar-description-text__span">
                            Показывает ваше передвижение другим участникам фракции
                        </div>
                    </div>
                </div>

                <div className="government-radar__line"/>

                <div className="government-radar-list">
                    {this.props.fractionData.members.filter(q => q.tracker && CEF.id !== q.id).map((member, id) => {
                        return <div className="government-radar-list__block" key={id}>
                            {member.name}
                            <div className={classNames("government-radar-switcher", {
                                'government-radar-switcher__active': !!member.tracking
                            })} onClick={() => this.props.activateTrack(member.id)}>
                                <div/>
                            </div>
                        </div>
                    })}
                </div>
            </div>

        </>
            ;
    }
}