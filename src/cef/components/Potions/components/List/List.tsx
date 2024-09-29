// @ts-ignore

import React, {Component} from "react";
import "../../style.less";

// @ts-ignore
import png from "../../assets/*.png"
// @ts-ignore
import svg from "../../assets/*.svg"
import inventoryImages from "../../../../../shared/icons/*.png";
import {PotionRecipe, PotionRecipeDto, POTIONS_RECIPES} from "../../../../../shared/events/halloween.potions";
import {CustomEvent} from "../../../../modules/custom.event";
import {getBaseItemNameById} from "../../../../../shared/inventory";
import {CEF} from "../../../../modules/CEF";

interface ListProps {
    recipeDtos: PotionRecipeDto[]
}

interface ListState {
    recipes: PotionRecipeDto[]
}

export class List extends Component<ListProps, ListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            recipes: this.props.recipeDtos
        }
    }

    getReadyPercent(recipe: PotionRecipe, recipeDto: PotionRecipeDto) {
        const ingredientsReady = recipe
            .ingredients
            .map((ingredient, index) => {
                const dto = recipeDto.ingredients[index];

                return dto[1] >= ingredient.amount
                    ? 1
                    : dto[1] / ingredient.amount;
            })
            .reduce((previousValue, nextValue) => previousValue + nextValue, 0);

        return Math.round(ingredientsReady / recipe.ingredients.length * 100)
    }

    cookPotionClick(recipe: PotionRecipe) {
        CustomEvent.trigger("halloween::potions::cook", recipe);
    }

    render() {
        return <div className="potions">

            <div className="exit" onClick={() => CEF.gui.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["background"]} alt="" className="potions__background"/>

            <div className="potions__title">Зельеварение</div>

            <div className="potions__text">Собирайте все компоненты для зелья, чтобы сварить его</div>

            <div className="potions-list">


                {this.state.recipes.map((recipeDto, key) => {
                    const recipe = POTIONS_RECIPES.find(recipe => recipe.type === recipeDto.type);
                    const readyPercent = this.getReadyPercent(recipe, recipeDto);

                    return <div className="potions-list-block" key={key}>

                        <div className="potions-list-block-flask">
                            <img src={png["table"]} alt="" className="potions-list-block-flask__table"/>
                            <img src={inventoryImages["Item_" + recipe.resultItemId]} alt=""
                                 className="potions-list-block-flask__flask"/>
                            <img src={png["plate"]} alt="" className="potions-list-block-flask__plate"/>

                            <span>{getBaseItemNameById(recipe.resultItemId)}</span>
                        </div>

                        <div className="potions-list-block-progress">
                            <div className="potions-list-block__title">Статистика</div>

                            <div className="potions-list-block-progress__percent">
                                {readyPercent}%
                            </div>
                            <span>Собрано</span>

                            <div
                                className={`potions-list-block-progress__button ${readyPercent >= 100 ? "potions-active" : ""}`}
                                onClick={() => {
                                    if (readyPercent < 100) {
                                        return;
                                    }

                                    this.cookPotionClick(recipe)
                                }}
                            >
                                <img src={svg["flaskIcon"]} alt=""/>
                                ВАРИТЬ
                            </div>
                        </div>

                        <div className="potions-list-block-ingredients">

                            <div className="potions-list-block__title">Ингредиенты</div>

                            <div className="potions-list-block-ingredients-list">
                                {recipeDto.ingredients.map((ingredientDto, key) => {
                                    const ingredient = recipe.ingredients
                                        .find(ingredient => ingredient.itemId === ingredientDto[0]);

                                    const isEnoughAmount = ingredientDto[1] >= ingredient.amount;
                                    return <div
                                        className={`potions-list-block-ingredients-list__block ${isEnoughAmount ? "potions-active" : ""}`}
                                        key={key}
                                    >
                                        <div>
                                            <img src={svg["checkmark"]} alt=""/>
                                        </div>
                                        <span>
                                                {ingredientDto[1]}/{ingredient.amount}
                                            </span>

                                        <p>{getBaseItemNameById(ingredient.itemId)}</p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                })}

            </div>
        </div>
    }
}