import React from "react";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import {IFractionStorageDTO} from "../../../../../../../shared/fractions/ranks";
import {inventoryShared} from "../../../../../../../shared/inventory";
import {fractionCfg} from "../../../../../../modules/fractions";
import classNames from "classnames";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class Storage extends React.Component<{
    fractionId: number
    storages: IFractionStorageDTO[]
    update: Function
}, {
    chooseRankIdStorage: number
    chooseRankId: number
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            chooseRankId: -1,
            chooseRankIdStorage: -1
        }
    }

    chooseRank(id: number, storageId: number) {
        if (this.state.chooseRankIdStorage === storageId && this.state.chooseRankId === id) return;
        this.setState({chooseRankId: id, chooseRankIdStorage: storageId});
    }

    chooseRankClose(id: number, storageId: number) {
        if (this.state.chooseRankIdStorage !== storageId && this.state.chooseRankId !== id) return;
        this.setState({chooseRankId: -1, chooseRankIdStorage: -1});
    }

    changeRank(storageId: number, itemId: number, rank: number) {
        this.setState({chooseRankId: -1, chooseRankIdStorage: -1})
        CustomEvent.callServer('tablet:setRankForItem', storageId, itemId, rank).then(res => {
            if (res) this.props.update();
        })
    }

    render() {
        return <div className="tablet-fraction-body">
            <div className="tablet-fraction-body__title">
                Склад фракции
            </div>

            <div className="tablet-fraction-storage">

                <div className="tablet-fraction-storage__description">
                    <span>Название предмета</span>
                    <span>Ранг</span>
                </div>

                <div className="tablet-fraction-storage-list">

                    {
                        this.props.storages.map((storage, storageKey) => {
                            return <React.Fragment key={storageKey}>
                                {
                                    storage.items.map((item, itemKey) => {
                                        return <div className="tablet-fraction-storage-list-block" key={itemKey}>
                                            <div className="tablet-fraction-storage-list-block__name">
                                                {inventoryShared.get(item[0]).name}
                                            </div>
                                            <div className={classNames(`tablet-fraction-storage-list-block-rank`, {
                                                'tablet-fraction-storage-list-block-rank__active': this.state.chooseRankId === itemKey && this.state.chooseRankIdStorage === storageKey
                                            })} onClick={() => this.chooseRank(itemKey, storageKey)}>
                                                <div className="tablet-fraction-storage-list-block-rank__name" onClick={() => this.chooseRankClose(itemKey, storageKey)}>
                                                    {fractionCfg.getRankName(this.props.fractionId, item[2])}
                                                    <img src={svg["back"]} alt=""/>
                                                </div>
                                                <div className="tablet-fraction-storage-list-block-rank-list">
                                                    {fractionCfg.getFraction(this.props.fractionId).ranks.map((rank, rankKey) => {
                                                        return <div key={rankKey}
                                                                    onClick={() => this.changeRank(storage.id, item[0], rankKey)}>
                                                            {rank}</div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </React.Fragment>
                        })
                    }
                </div>
            </div>
        </div>
    }
}