import React from "react";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {
    ALL_FRACTION_RIGHTS,
    FRACTION_RIGHTS,
    getRightName, GOV_RIGHTS,
    IFractionRank, MAFIA_RIGHTS
} from "../../../../../../../shared/fractions/ranks";
import {fractionCfg} from "../../../../../../modules/fractions";

export class Rangs extends React.Component<{
    fractionId: number
}, {
    subMenuItem: number | null
    changeMenuItem: number | null
    ranks: IFractionRank[]
    isGos: boolean
    isMafia: boolean
}> {

    nameRef: React.RefObject<HTMLInputElement> = React.createRef();
    awardRef: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            subMenuItem: null,
            changeMenuItem: null,
            ranks: [],
            isGos: false,
            isMafia: false
        }
    }

    async componentDidMount() {
        const res = await CustomEvent.callServer('tablet:getRanks', this.props.fractionId);
        if (res) this.setState({ranks: res, isGos: fractionCfg.getFraction(this.props.fractionId).gos,
        isMafia: fractionCfg.getFraction(this.props.fractionId).mafia});
    }

    changeRank(key: number) {
        this.setState({changeMenuItem: key}, () => {
            this.nameRef.current.value = this.getRank().name;
            this.awardRef.current.value = `${this.getRank().award}`;
        });
    }

    getRank() {
        return this.state.ranks[this.state.changeMenuItem];
    }

    changeRight(right: FRACTION_RIGHTS) {
        const ranks = [...this.state.ranks];

        if (ranks[this.state.changeMenuItem].rights.includes(right)) {
            const index = ranks[this.state.changeMenuItem].rights.indexOf(right);

            if (index === -1) return;

            ranks[this.state.changeMenuItem].rights.splice(index, 1);
        } else {
            ranks[this.state.changeMenuItem].rights.push(right);
        }

        this.setState({ranks});
    }

    saveRank() {
        const name = this.nameRef.current.value;
        const award = this.awardRef.current.value;
        const ranks = [...this.state.ranks];

        if (this.getRank().name !== name && name.length < 30) {
            ranks[this.state.changeMenuItem].name = name;
        }

        if (this.getRank().award !== parseInt(award) && award.length < 7) {
            ranks[this.state.changeMenuItem].award = parseInt(award);
        }

        this.setState({
            ranks,
            changeMenuItem: null
        })
    }

    moveRank(key: number, toUp: boolean) {
        const ranks = [...this.state.ranks];

        if (toUp) {
            const rankCopy = {...ranks[key + 1]};

            ranks[key + 1] = ranks[key];
            ranks[key] = rankCopy;
        } else {
            const rankCopy = {...ranks[key - 1]};

            ranks[key - 1] = ranks[key];
            ranks[key] = rankCopy;
        }

        this.setState({ranks});
    }

    openSubMenu(key: number) {
        if (key === this.state.subMenuItem) return;
        this.setState({subMenuItem: key})
    }

    saveChanges() {
        CustomEvent.triggerServer('tablet:setRanks', this.state.ranks);
    }

    closeChangeMenu() {
        this.setState({changeMenuItem: null})
    }

    render() {
        return <>
            {this.state.changeMenuItem !== null && <div className="tablet-fraction-rang-editor">

                <img src={svg["close"]} alt="" className="tablet-fraction-rang-editor__close" onClick={() => this.closeChangeMenu()}/>

                <div className="tablet-fraction-rang-editor__id"># {this.state.changeMenuItem + 1}</div>

                <div className="tablet-fraction-rang-editor-name">
                    <div className="tablet-fraction-rang-editor-name__text">
                        Название
                    </div>
                    <input type="text" ref={this.nameRef}/>
                </div>

                <div className="tablet-fraction-rang-editor-name">
                    <div className="tablet-fraction-rang-editor-name__text">
                        Размер премии
                    </div>
                    <input type="number" ref={this.awardRef}/>
                </div>


                <div className="tablet-fraction-rang-editor-list">
                    {!fractionCfg.isLeader(this.props.fractionId, this.state.changeMenuItem + 1) && <>{
                        ALL_FRACTION_RIGHTS.map((el, key) => {
                            if (!this.state.isGos && GOV_RIGHTS.includes(el)) return null;
                            if (!this.state.isMafia && MAFIA_RIGHTS.includes(el)) return null;
                            return <div className="tablet-fraction-rang-editor-switcher" key={key}>
                                <div className="tablet-fraction-rang-editor-switcher__text">
                                    {getRightName(el)}
                                </div>
                                <div className={classNames("tablet-fraction-rang-editor-switcher-button", {
                                    'tablet-fraction-rang-editor-switcher-button__active': this.getRank().rights.includes(el)
                                })} onClick={() => this.changeRight(el)}>
                                    <div/>
                                </div>
                            </div>
                        })
                    }</>}
                </div>

                <div className="tablet-fraction-rang-editor__save" onClick={() => this.saveRank()}>
                    Сохранить
                </div>
            </div>}

            <div className="tablet-fraction-body">


                <div className="tablet-fraction-body__title">
                    Создание и управление рангами
                </div>

                <div className="tablet-fraction-rang">
                    <div className="tablet-fraction-rang-description">
                        <div className="tablet-fraction-rang-description__text">
                            Список рангов
                        </div>
                        {/* <div className="tablet-fraction-rang-description-button">
                            + Добавить ранг
                        </div> */}
                    </div>
                    <div className="tablet-fraction-rang-list">
                        {this.state.ranks.map((rank, key) => {
                            return <div className="tablet-fraction-rang-list-block" key={key}>
                                <div className="tablet-fraction-rang-list-block__id">{key + 1}</div>
                                <div className="tablet-fraction-rang-list-block__name">{rank.name}</div>
                                <div className="tablet-fraction-rang-list-block__button"
                                     onClick={() => this.changeRank(key)}>Изменить
                                </div>

                                <div className="tablet-fraction-rang-list-block-more">
                                    <img src={svg["ellipsis-vertical"]} alt="" onClick={() => this.openSubMenu(key)}/>

                                    {(this.state.subMenuItem === key && !fractionCfg.isLeader(this.props.fractionId, key + 1)) &&
                                        <div className="tablet-fraction-rang-list-block-more__list">
                                            {/*{(key !== this.state.ranks.length - 1 && key !== this.state.ranks.length - 2) &&*/}
                                            {/*    <div onClick={() => this.moveRank(key, true)}>Поднять звание по*/}
                                            {/*        списку</div>}*/}
                                            {/*{(key !== 0 && key !== this.state.ranks.length - 1) &&*/}
                                            {/*    <div onClick={() => this.moveRank(key, false)}>Опустить звание по*/}
                                            {/*        списку</div>}*/}
                                        </div>}
                                </div>
                            </div>
                        })}
                    </div>
                    {<div className="tablet-fraction-rang-save" onClick={() => this.saveChanges()}>
                        <div className="tablet-fraction-rang-save__text">
                            Примените изменения, иначе ваши <br/> действия не сохранятся
                        </div>
                        <div className="tablet-fraction-rang-save__button">Применить изменения</div>
                    </div>}
                </div>

            </div>
        </>
    }
}