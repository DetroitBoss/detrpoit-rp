import React from "react";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import {IFractionStorageLog} from "../../../../../../../shared/fractions/ranks";

export class Safe extends React.Component<{
    logs: IFractionStorageLog[]
}, {}> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="tablet-fraction-body">
            <div className="tablet-fraction-body__title">
                Сейф
            </div>
            <div className="tablet-fraction-safe">

                <div className="tablet-fraction-safe__description">
                    <span>История взаимодействия</span>
                </div>

                <div className="tablet-fraction-safe-list">

                    {
                        this.props.logs.map((log, key) => {
                            return <div className="tablet-fraction-safe-list-block" key={key}>
                                <div>{log.who}</div>
                                <div className="tablet-fraction-safe-list-block__red">{log.text}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    }
}