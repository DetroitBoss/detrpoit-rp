// @ts-ignore

import React, {Component} from "react";
import "../../style.less";

// @ts-ignore
import png from "../../assets/*.png"
// @ts-ignore
import svg from "../../assets/*.svg"
import inventoryImages from "../../../../../shared/icons/*.png";
import {PotionRecipe, RecipeIngredient} from "../../../../../shared/events/halloween.potions";
import {systemUtil} from "../../../../../shared/system";
import _ from "lodash";
import {getBaseItemNameById} from "../../../../../shared/inventory";
import Draggable from "react-draggable";
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";

interface GameProps {
    potionRecipe: PotionRecipe
}

interface WebRecipeIngredient extends RecipeIngredient {
    isDragging?: boolean,
    isCaptured?: boolean
}

interface GameState {
    isFailed?: boolean,
    isCompleted?: boolean,
    recipe: PotionRecipe,
    ingredientsSequence: WebRecipeIngredient[],
    recipeIngredients: RecipeIngredient[],
    availableIngredients: WebRecipeIngredient[],
}

function cloneIngredient(ingr: RecipeIngredient): WebRecipeIngredient {
    return {
        itemId: ingr.itemId,
        amount: ingr.amount
    }
}

export class Game extends Component<GameProps, GameState> {
    constructor(props: any) {
        super(props);

        const recipe = this.props.potionRecipe;

        const availableIngredients = systemUtil.randomArrayElement(
            recipe.ingredients.map(cloneIngredient),
            recipe.ingredients.length < 6 ? recipe.ingredients.length : 6
        );
        const recipeIngredients = systemUtil.randomArrayElement(availableIngredients, 4);

        this.state = {
            recipe,
            availableIngredients,
            recipeIngredients,
            ingredientsSequence: []
        };
    }

    getGroupedArray<T>(array: T[], count: number) {
        const indexedArray: [T, number][] = [...array]
            .map((value, index) => [value, index]);

        return Object.values(_.groupBy(indexedArray, (element) => Math.floor(element[1] / count)));
    }

    dragStart(ingredient: WebRecipeIngredient) {
        ingredient.isDragging = true;

        this.setState({
            availableIngredients: this.state.availableIngredients
        });
    }

    dragStop(ingredient: WebRecipeIngredient) {
        ingredient.isDragging = false;

        this.setState({
            availableIngredients: this.state.availableIngredients
        });
    }

    checkForDraggableIngredient() {
        if (this.state.isFailed || this.state.isCompleted) {
            return;
        }

        const currentDragging = this.state.availableIngredients.find(ingredient => ingredient.isDragging);
        if (!currentDragging) {
            return;
        }

        currentDragging.isDragging = false;
        currentDragging.isCaptured = true;
        this.state.ingredientsSequence.push(currentDragging);

        this.setState({
            availableIngredients: this.state.availableIngredients,
            ingredientsSequence: this.state.ingredientsSequence
        });

        this.checkForRightSequence();
    }

    checkForRightSequence() {
        let isSequenceCorrect = true;

        for (let i = 0; i < this.state.ingredientsSequence.length; i++) {
            if (this.state.ingredientsSequence[i].itemId !== this.state.recipeIngredients[i].itemId) {
                isSequenceCorrect = false;
                break;
            }
        }

        if (isSequenceCorrect && this.state.ingredientsSequence.length === this.state.recipeIngredients.length) {
            setTimeout(() => {
                CustomEvent.triggerServer('halloween::potions::finish', true, this.state.recipe.type);
            }, 2500);

            this.setState({
                isCompleted: true
            })
        } else if (!isSequenceCorrect) {
            setTimeout(() => {
                CustomEvent.triggerServer('halloween::potions::finish', false);
            }, 2500);

            this.setState({
                isFailed: true
            });
        }
    }

    getKettleClass() {
        return this.state.isCompleted
            ? "kettle-active"
            : this.state.isFailed
                ? "kettle-unActive"
                : ""
    }

    render() {
        return <div className="potions potionsGame">

            <div className="exit" onClick={() => CEF.gui.close() }>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["background"]} alt="" className="potions__background"/>

            <div className="potions__title">Свари зелье</div>

            <div className="potions__text">
                Собери все компоненты в котел <br/>
                в правильной последовательности
            </div>

            <div className="potionsGame__red"/>

            <div className="potionsGame-recipe">

                <img src={png["recipe"]} alt="" className="potionsGame-recipe__background"/>

                {this.state.recipeIngredients.map((ingredient, index) => {
                    return <div className="potionsGame-recipe__item" key={index}>
                        <img src={inventoryImages["Item_" + ingredient.itemId]} alt=""/>
                    </div>
                })}

            </div>

            <div className="potionsGame-ingredients">
                {this.getGroupedArray(this.state.availableIngredients, 2)
                    .map((element, index) =>
                    {
                        return <div className="potionsGame-ingredients-shelf" key={index}>
                            <img src={png["table"]} alt="" className="potionsGame-ingredients-shelf__background"/>

                            {element.map(el => el[0])
                                .map((ingredient, index) => {

                                return <div className="potionsGame-ingredients-shelf-item" key={index}>

                                    <img src={png["pot"]} alt="" className="potionsGame-ingredients-shelf-item__pot"/>
                                    <img src={png["potFront"]} alt="" className="potionsGame-ingredients-shelf-item__potFront"/>

                                    <div className="potionsGame-ingredients-shelf-item__name">
                                        <img src={png["paper"]} alt=""/>
                                        <span>{getBaseItemNameById(ingredient.itemId)}</span>
                                    </div>

                                    {!ingredient.isCaptured &&
                                        <Draggable key={ingredient.itemId}
                                                   onStart={() => this.dragStart(ingredient)}
                                                   onStop={() => this.dragStop(ingredient)}
                                        >
                                            <img src={inventoryImages["Item_" + ingredient.itemId]} alt=""
                                                 className="potionsGame-ingredients-shelf-item__block"/>
                                        </Draggable>
                                    }
                                </div>
                            })}
                        </div>
                    }
                )}
            </div>

            <div className={`potionsGame-kettle ${this.getKettleClass()}`}>

                <img src={png["kettle"]} className="potionsGame-kettle__background" alt=""/>
                <img src={png["kettleFront"]} className="potionsGame-kettle__backgroundFront kettle-red" alt=""/>
                <img src={png["kettleFrontActive"]} className="potionsGame-kettle__backgroundFront kettle-green" alt=""/>
                <img src={png["kettleFrontKaka"]} className="potionsGame-kettle__backgroundFront kettle-kaka" alt=""/>

                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_0"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_1"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_2"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_3"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_4"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_5"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_6"/>
                <div className="potionsGame-kettle__bubble potionsGame-kettle__bubble_7"/>
            </div>

            <div className="potionsGame-kettle__drop" onPointerEnter={() => this.checkForDraggableIngredient()}/>

            {this.state.isFailed &&
                <div className="potionsGame__warning">Ты испортил зелье!</div>
            }

        </div>
    }
}