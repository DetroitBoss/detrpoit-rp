import React, {Component} from "react";

import "./style.less";
import centerHuman from "./assets/centerHuman.svg";
import centerVehicle from "./assets/centerVehicle.svg";
import arrow from "./assets/arrow.svg";
import heart from "./assets/heart.svg";

import icons from "./assets/26/*.svg";
import {CustomEvent} from "../../modules/custom.event";
import {InteractionItem} from "../../../shared/interactions";
import {CEF} from '../../modules/CEF';


interface Category {
    key: string,
    img: string,
    title: string
}

export class Interaction extends Component<{}, {
    isVehicle: boolean,
    id: number,
    cats: Category[],
    elements: any,
    selectedCat: Category | null,
    allItems: InteractionItem[]
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            id: 0,
            isVehicle: false,
            allItems: [],
            cats: [
                {
                    key: "romantic",
                    img: "heart",
                    title: "Романтичесткое 0"
                },
                {
                    key: "romantic",
                    img: "businessSharp",
                    title: "Романтичесткое 1"
                },
                {
                    key: "romantic",
                    img: "carFront",
                    title: "Романтичесткое 2"
                },
                {
                    key: "bubble",
                    img: "carHood",
                    title: "Романтичесткое 3"
                },
                {
                    key: "romantic",
                    img: "cash",
                    title: "Романтичесткое 4"
                },
                {
                    key: "romantic",
                    img: "chatbubbles",
                    title: "Романтичесткое 5"
                },
                {
                    key: "romantic",
                    img: "documentLock",
                    title: "Романтичесткое 6"
                },
                {
                    key: "romantic",
                    img: "documentText",
                    title: "Романтичесткое 7"
                },
                {
                    key: "romantic",
                    img: "evacuation",
                    title: "Романтичесткое 8"
                },
                {
                    key: "romantic",
                    img: "fileTray",
                    title: "Романтичесткое 9"
                }
            ],
            elements: {
                "romantic": [
                    {
                        key: "kiss",
                        img: "mask",
                        title: "Поцеловать"
                    }
                ]
            },
            selectedCat: null
        };
        
        CustomEvent.register('intMenu:open', (id: number, isVehicle: boolean, items: InteractionItem[]) => {
            const categories: { key: string, img: string, title: string }[] = [];
            const elements: any = [];
            console.log(items)
            items.map(item => {
                if (!categories.find(i => i.title === item.category)) {
                    console.log('push') 
                    categories.push({ key: item.category, img: 'star', title: item.category})
                    elements[item.category] = []
                }
                //elements.push(item.category)
                elements[item.category].push({ key: item.name, img: item.icon, title: item.name })
            })
            console.log(elements)
            this.setState({
                ...this.state,
                id,
                isVehicle,
                cats: categories,
                elements,
                allItems: items
            })
        })
    }

    start(isVehicle: boolean, cats: Category[], elements: any): void {
        this.setState({...this.state, isVehicle, cats, elements, selectedCat: null});
    }

    getItems(): any {
        if (this.state.selectedCat === null) {
            return this.state.cats.filter(c => c.key != '').concat(this.state.elements['']);
        } else {
            if (!this.state.elements[this.state.selectedCat.key]) return [];
            return this.state.elements[this.state.selectedCat.key];
        }
    }

    clickItem(key: string): void {
        if (this.state.selectedCat === null && this.state.allItems.find(item => item.name == key)?.category != '') {
            for (let index in this.state.cats) {
                if (this.state.cats[index].key === key)
                    return this.setState({...this.state, selectedCat: this.state.cats[index]});
            }
        } else {
            // Call на клиент
            CustomEvent.triggerClient('interractionMenu:select', this.state.id, this.state.allItems.findIndex(item => item.name == key))
            this.setState({...this.state, selectedCat: null});
        }
    }

    render() {
        return <div className='interactionMenu'>

            <div
                className={`interactionMenu-center ${this.state.selectedCat !== null ? "interactionMenu-longDistance" : ""}`}>
                {/* interactionMenu-for5 КОГДА БЛОКОВ 5; interactionMenu-lonDistance увеличить расстояние между блоками*/}


                {
                    this.state.selectedCat === null && <div className="interactionMenu-center__homeButton" onClick={() => {
                      CEF.gui.setGui(null)  
                    }}>
                        <img src={this.state.isVehicle ? centerVehicle : centerHuman} alt=""/>
                    </div>
                }

                {
                    this.state.selectedCat !== null &&
                    <div className="interactionMenu-center__backButton" onClick={() => {
                        this.setState({...this.state, selectedCat: null});
                    }}>
                        <div className="interactionMenu-center__block">
                            <img src={arrow} alt=""/>
                            {this.state.selectedCat.title}
                        </div>
                    </div>
                }


                {
                    this.getItems().map((item: any, key: number) => {
                        if (key > 5) return <></>;

                        return <div className={`interactionMenu-center-slot interactionMenu-slot${key}
                        ${this.getItems().length === 5 && key === 1 ? "interactionMenu-for5" : ""}
                        `} key={key}
                                    onClick={() => this.clickItem(item.key)}>
                            <div className="interactionMenu-center__block">
                                <img src={icons[item.img]} alt=""/>
                                {item.title}
                            </div>
                        </div>
                    })
                }

                {
                    this.getItems().length >= 7 && <div className="interactionMenu-center-slot-top">

                        {this.getItems()[6] !== undefined &&
                        <div className="interactionMenu-center-slot interactionMenu-slot6"
                             onClick={() => this.clickItem(this.getItems()[6].key)}>
                            <div className="interactionMenu-center__block">
                                <img src={icons[this.getItems()[6].img]} alt=""/>
                                {this.getItems()[6].title}
                            </div>
                        </div>}


                        {this.getItems()[8] !== undefined &&
                        <div className="interactionMenu-center-slot interactionMenu-slot8"
                             onClick={() => this.clickItem(this.getItems()[8].key)}>
                            <div className="interactionMenu-center__block">
                                <img src={icons[this.getItems()[8].img]} alt=""/>
                                {this.getItems()[8].title}
                            </div>
                        </div>}

                    </div>
                }

                {
                    this.getItems().length >= 8 && <div className="interactionMenu-center-slot-bottom">

                        {this.getItems()[7] !== undefined &&
                        <div className="interactionMenu-center-slot interactionMenu-slot7"
                             onClick={() => this.clickItem(this.getItems()[7].key)}>
                            <div className="interactionMenu-center__block">
                                <img src={icons[this.getItems()[7].img]} alt=""/>
                                {this.getItems()[7].title}
                            </div>
                        </div>}

                        {this.getItems()[9] !== undefined &&
                        <div className="interactionMenu-center-slot interactionMenu-slot9"
                             onClick={() => this.clickItem(this.getItems()[9].key)}>
                            <div className="interactionMenu-center__block">
                                <img src={icons[this.getItems()[9].img]} alt=""/>
                                {this.getItems()[9].title}
                            </div>
                        </div>}

                    </div>
                }
            </div>
        </div>
    }
}