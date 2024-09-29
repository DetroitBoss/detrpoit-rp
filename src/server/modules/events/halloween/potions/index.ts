import {
    COOK_POTION_EVENT,
    KETTLES_POSITIONS, PotionRecipe,
    PotionRecipeDto,
    POTIONS_RECIPES, PotionType,
    RecipeIngredientDto
} from "../../../../../shared/events/halloween.potions";
import {colshapeHandle} from "../../../checkpoints";
import {inventory} from "../../../inventory";
import {CustomEvent} from "../../../custom.event";

import './item.use.hook';

KETTLES_POSITIONS.forEach((position) => {
    new colshapeHandle(position, 'Варка зелий', openPotionsCook, {
        type: -1,
        radius: 3
    })
});

function openPotionsCook(player: PlayerMp) {
    const dtos = getPotionsDto(player);
    player.user.setGui('potions', 'halloween::potions::openList', dtos);
}

function getPotionsDto(player: PlayerMp) {
    return POTIONS_RECIPES
        .map<PotionRecipeDto>(recipe => ({
            type: recipe.type,
            ingredients: recipe.ingredients
                .map<RecipeIngredientDto>(ingredient => [
                    ingredient.itemId,
                    inventory.getItemsCountById(player, ingredient.itemId)
                ])
        }));
}

CustomEvent.registerCef('halloween::potions::finish', (
    player,
    isSuccess: boolean,
    potionType?: PotionType
) => {
    player.user.setGui(null);

    if (isSuccess) {
        const recipe = POTIONS_RECIPES.find((recipe) => recipe.type === potionType);

        if (!tryRemoveIngredientsItems(player, recipe)) {
            return player.notify('У вас не хватает ингредиентов для зелья', 'error');
        }

        player.user.giveItem({
            item_id: recipe.resultItemId,
            count: 1
        });

        mp.events.call(COOK_POTION_EVENT, player, potionType);
    } else {
        player.notify('Попробуйте снова!', 'error');
    }
});

function tryRemoveIngredientsItems(player: PlayerMp, potionRecipe: PotionRecipe): boolean {
    if (potionRecipe.ingredients.some(
        ingredient => inventory.getItemsCountById(player, ingredient.itemId) < ingredient.amount)
    ) {
        return false;
    }

    potionRecipe.ingredients.forEach(ingredient => inventory.deleteItemsById(player, ingredient.itemId, ingredient.amount));
    return true;
}

