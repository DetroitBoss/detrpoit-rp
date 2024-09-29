// @ts-ignore

import React, {Component} from "react";
import "./style.less";

// @ts-ignore
import png from "./assets/*.png"
// @ts-ignore
import svg from "./assets/*.svg"
import {CloseButton} from "../../CloseButton";
import {CEF} from "../../../modules/CEF";
import items from "./assets/items/*.png"
import Draggable from "react-draggable";

interface CookingItem {
    id: number
    img: string
}

const products: CookingItem[] = [
    {
        id: 0,
        img: "Cabbage",
    },
    {
        id: 1,
        img: "Carrot",
    },
    {
        id: 2,
        img: "Cereal",
    },
    {
        id: 3,
        img: "Cereal2",
    },
    {
        id: 4,
        img: "Chicken",
    },
    {
        id: 5,
        img: "Cucumbers",
    },
    {
        id: 6,
        img: "Greens",
    },
    {
        id: 7,
        img: "Greens2",
    },
    {
        id: 8,
        img: "Meat",
    },
    {
        id: 9,
        img: "Meat2",
    },
    {
        id: 10,
        img: "Meat3",
    },
    {
        id: 11,
        img: "Mushrooms",
    },
    {
        id: 12,
        img: "Mushrooms2",
    },
    {
        id: 13,
        img: "Mushrooms3",
    },
    {
        id: 14,
        img: "Mushrooms4",
    },
    {
        id: 15,
        img: "Onion",
    },
    {
        id: 16,
        img: "Pasta",
    },
    {
        id: 17,
        img: "Pepper",
    },
    {
        id: 18,
        img: "Pumpkin",
    },
    {
        id: 19,
        img: "Radish",
    },
    {
        id: 20,
        img: "Tomatoes",
    },
]

export class JailCooking extends Component<{
    status: (status: boolean) => void;
}, {
    recipe: CookingItem[],
    products: CookingItem[]
    dragItem: number | null
    onPot: boolean
    step: number
}> {
    constructor(props: any) {
        super(props);

        const productsCopy = [...JSON.parse(JSON.stringify(products))];

        productsCopy.sort(() => Math.random() - 0.5);

        const recipe = this.getRecipe();
        this.state = {
            recipe,
            products: productsCopy,
            dragItem: null,
            onPot: false,
            step: 0
        }
    }

    getRecipe() {
        const recipe: CookingItem[] = [];

        for (let i = 0; i < 5; i++) {
            const product = products[Math.floor(Math.random() * products.length)];

            if (recipe.find(el => el.id === product.id) === undefined) {
                recipe.push(product);
            } else {
                i--;
            }
        }

        return recipe;
    }

    close = () => {
        CEF.gui.setGui(null);
    }

    pointerEnter() {
        this.setState({onPot: true})
    }

    pointerLeave() {
        this.setState({onPot: false})
    }

    startDrag(key: number) {
        this.setState({dragItem: key})
    }

    finish() {
        this.props.status(true);
    }

    stopDrag() {
        const products = [...this.state.products];
        let step = this.state.step;

        if (this.state.onPot && this.state.dragItem === this.state.recipe[this.state.step].id) {
            if (this.state.step + 1 === this.state.recipe.length) {
                this.finish()
            } else {
                let key;
                products.find((el, i) => {
                    if (el.id === this.state.dragItem) {
                        key = i;
                        return true;
                    }

                    return false;
                })

                step++;

                if (key != undefined) products.splice(key, 1);
            }
        }
        this.setState({dragItem: null, products, step})
    }


    render() {
        return <div className="jailCooking jailCookingGame">

            <CloseButton onClickAction={this.close} isRightPosition={true}/>

            <img src={png["background"]} alt="" className="jailCooking__background"/>

            <div className="jailCookingGame-left">
                <div className="jailCookingGame-left__title">
                    <h1>Свари</h1>
                    <h2>съедобное</h2>
                </div>

                <div className="jailCookingGame-left__text">
                    Собери все компоненты в кастрюлю <br/>
                    в правильной последовательности
                </div>

                <div className="jailCookingGame-left-ingredients">
                    <div className="jailCookingGame-left-ingredients__title">
                        Ингредиенты
                        <div><img src={svg["star"]} alt=""/>1 уровень</div>
                    </div>
                    <div className="jailCookingGame-left-ingredients-items">
                        {
                            this.state.products.map((el, key) => {
                                return <div className="jailCookingGame-left-ingredients-items__block" key={key}>
                                    <Draggable
                                        position={{x: 0, y: 0}}
                                        onStart={() => this.startDrag(el.id)}
                                        onStop={() => this.stopDrag()}
                                    >
                                        <div>
                                            <img src={items[el.img]} alt=""/>
                                        </div>
                                    </Draggable></div>
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="jailCookingGame-recipe">

                <img src={png["recipe"]} alt="" className="jailCookingGame-recipe__background"/>

                {
                    this.state.recipe.map((el, key) => {
                        return <img key={key} src={items[el.img]} alt=""
                                    className={`jailCookingGame-recipe__item jailCookingGame-recipe__item-${key}`}/>
                    })
                }

            </div>


            <div className={`jailCookingGame-pot`}>

                <img src={png["pot"]} className="jailCookingGame-pot__background" alt=""/>

                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_0"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_1"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_2"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_3"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_4"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_5"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_6"/>
                <div className="jailCookingGame-pot__bubble jailCookingGame-pot__bubble_7"/>
                <img src={png["potFron"]} className="jailCookingGame-pot__backgroundFront" alt=""/>
            </div>

            <div className="jailCookingGame-pot__drop" onPointerEnter={() => this.pointerEnter()}
                 onPointerLeave={() => this.pointerLeave()}/>

        </div>
    }
}