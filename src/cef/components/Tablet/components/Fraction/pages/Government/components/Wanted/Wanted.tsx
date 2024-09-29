import {CustomEvent} from "../../../../../../../../modules/custom.event";
import {CEF} from "../../../../../../../../modules/CEF";
import svgs from "*.svg";
import React, {Component} from "react";
import {LicenceType} from "../../../../../../../../../shared/licence"
import "../../../../../../style.less"

export class Wanted extends Component<{}, {
    gosSuspects?: { id: number, name: string, wanted: number }[],
    gosSuspectSearch?: string;
    trackSuspect?: number,
    gosSearchItem?: {
        id: number, name: string, bank: string, social: string, house: string, vehs: {
            id: number;
            model: string;
            name: string;
            number: string;
        }[],
        wanted_level?: number;
        wanted_level_new?: number;
        wanted_reason?: string;
        wanted_reason_new?: string;
        licenses?: [LicenceType, number, string][],
        history?: { text: string, time: number }[]
    },
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            gosSuspects: [
            ],
            gosSuspectSearch: '',
            trackSuspect: 1,
        }
        CustomEvent.callServer("tablet:getSuspects").then(suspects => {
            console.log(JSON.stringify(suspects))
            this.setState({
                gosSuspects: suspects
            }, () => CustomEvent.callClient('tablet:getTrackSuspect').then(suspectId => {
                this.setState({trackSuspect: suspectId})
            }))
        })

    }

    getSuspectsPage = () => {
        if (!this.state.gosSuspects?.length) return <></>
        const gosSuspects = this.state.gosSuspects.filter(suspect => {
            return suspect.name.toLowerCase().indexOf(this.state.gosSuspectSearch) != -1 || String(suspect.id).indexOf(this.state.gosSuspectSearch) != -1
        })
        console.log(JSON.stringify(gosSuspects))
        return <div className="member-list-wrap plrb30 wanteds-users">
                <div className="online-size mb24">
                <p className="font40 fontw300 mr12">{gosSuspects.length}</p>
            <p className="op4 font16">
                человек
                <br />
                {this.state.gosSuspectSearch.length ? 'найдено' : 'разыскиваются'}
            </p>
        </div>

        {gosSuspects.map(suspect => {
            return <div className="item-wanted-wrapper">
                <button className={`easy-button mini ${suspect.id == this.state.trackSuspect ? 'green' : ''}`}
                        onClick={e => {
                            CustomEvent.triggerClient('tablet:suspect:track', suspect.id == this.state.trackSuspect ? -1 : suspect.id)
                            this.setState({trackSuspect: suspect.id == this.state.trackSuspect ? -1 : suspect.id})
                        }}>
                    <p>{suspect.id == this.state.trackSuspect ? 'Прекратить слежку' : 'Начать слежку'}</p>
                </button>
                <div key={`suspect_${suspect.id}`} className="member-list-item item-wanted"
                     onClick={e => {
                         if (CEF.test) {
                             this.setState({
                                 gosSearchItem: {
                                     id: 1,
                                     name: "Xander Test",
                                     bank: "QWEQWEQWE",
                                     social: "QWEQWE",
                                     house: "QWEQWEQWE",
                                     vehs: [
                                         {id: 1, model: 'xa21', name: 'xa21', number: 'xa21'}
                                     ],
                                     wanted_level: 4,
                                     wanted_reason: "asfasfas",
                                 }
                             })
                             return;
                         }
                         CustomEvent.callServer('faction:database:data', suspect.id).then(status => {
                             if (!status) return;
                             this.setState({gosSearchItem: status})
                         })
                     }}>
                    <div className="leftside">
                        <p className="num fixwidth">{suspect.id}</p>
                        <div className="r-stars-size mr12">
                            {
                                [1, 2, 3, 4, 5].map(w => {
                                    return <img
                                        src={suspect.wanted >= w ? svgs['fill-star_on'] : svgs['fill-star_off']}
                                        alt=""/>
                                })
                            }
                        </div>
                        <p className="name">{suspect.name}</p>
                    </div>
                    <div className="rightside">
                    </div>
                </div>
            </div>
        })}
        </div>
    }

    render() {
        return <div className="tabs-submittedads-content-item active">
            <div className="tablet-search-wrap fam-size police-search-padding">
                <input
                    type="text"
                    placeholder="Введите имя или ID для поиска"
                    value={this.state.gosSuspectSearch}
                    onChange={(e) => {
                        e.preventDefault();
                        this.setState({
                            gosSuspectSearch: e.currentTarget.value?.toLowerCase(),
                        });
                    }}
                />
                <button className="search-icon fam-size">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.6668 21C6.51217 21 2.3335 16.8213 2.3335 11.6666C2.3335 6.51199 6.51217 2.33331 11.6668 2.33331C16.8215 2.33331 21.0002 6.51199 21.0002 11.6666C21.0002 13.8235 20.2686 15.8094 19.04 17.3899L25.3251 23.675L23.6752 25.3249L17.3901 19.0398C15.8096 20.2684 13.8237 21 11.6668 21ZM18.6668 11.6666C18.6668 15.5326 15.5328 18.6666 11.6668 18.6666C7.80084 18.6666 4.66683 15.5326 4.66683 11.6666C4.66683 7.80065 7.80084 4.66665 11.6668 4.66665C15.5328 4.66665 18.6668 7.80065 18.6668 11.6666Z"
                            fill="white"
                        />
                    </svg>
                </button>
            </div>
            {
                this.getSuspectsPage()
            }
        </div>
    }
}