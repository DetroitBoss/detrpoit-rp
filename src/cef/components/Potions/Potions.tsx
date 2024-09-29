import {List} from "./components/List"
import {Game} from "./components/Game"

import React, {Component} from "react";
import "./style.less";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"
import {CustomEvent} from "../../modules/custom.event";
import {PotionRecipe, PotionRecipeDto} from "../../../shared/events/halloween.potions";

type component = "list" | "game";

export class Potions extends Component<{}, {
    recipeDtos?: PotionRecipeDto[],
    potion?: PotionRecipe,
    component: component
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            component: null
        }

        CustomEvent.register('halloween::potions::openList', (recipeDtos: PotionRecipeDto[]) => {
            this.setState({
                recipeDtos: recipeDtos,
                component: "list",
            });
        });

        CustomEvent.register('halloween::potions::cook', (potionRecipe: PotionRecipe) => {
            this.setState({
                potion: potionRecipe,
                component: "game"
            });
        });
    }


    render() {
        return <>
            {this.state.component === "list" && <List recipeDtos={this.state.recipeDtos}/>}
            {this.state.component === "game" && <Game potionRecipe={this.state.potion}/>}
        </>
    }
}