import {ItemEntity} from "../typeorm/entities/inventory";
import {colshapeHandle, colshapes} from "../checkpoints";
import {MAX_PUFFS, PROP_NAME, PUFFS_IN_ONE_FILL} from "../../../shared/smoking/hookah";
import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {HOOKAH_CHARCOAL, HOOKAH_ITEM_ID, HOOKAH_TOBACCO} from "../../../shared/smoking/items";
import {MenuClass} from "../menu";
import {CustomEvent} from "../custom.event";
import {system} from "../system";

export class Hookah {

    position: Vector3Mp
    dimension: number
    ownerId: number

    prop: ObjectMp
    interaction: colshapeHandle
    puffs: number = 0


    constructor(owner: PlayerMp, item: ItemEntity) {
        this.position = new mp.Vector3(
            owner.position.x,
            owner.position.y,
            owner.position.z - 1
        );

        this.dimension = owner.dimension;
        this.ownerId = owner.user.id;

        this.puffs = item.advancedNumber;

        inventory.deleteItem(item, OWNER_TYPES.PLAYER, owner.user.id, true);

        this.prop = mp.objects.new(
            mp.joaat(PROP_NAME),
            this.position,
            {
                dimension: this.dimension
            }
        );

        this.interaction = colshapes.new(this.position, 'Кальян', this.interactionHandler, {
            dimension: this.dimension,
            radius: 1.5,
            type: -1
        })
    }

    interactionHandler = (player: PlayerMp) => {
        const menu = new MenuClass(player, 'Кальян');

        menu.newItem({
            name: 'Сделать затяг',
            onpress: () => {
                this.use(player)
            }
        })

        menu.newItem({
            name: 'Заправить кальян',
            more: `${this.puffs}`,
            onpress: () => {
                this.fill(player);
            }
        })

        if (player.user.isAdminNow() || player.user.id === this.ownerId) {
            menu.newItem({
                name: '~r~Забрать кальян',
                onpress: () => {
                    this.remove(player);
                }
            })
        }

        menu.open();
    }

    use (player: PlayerMp) {
        if (system.timestamp - player.user.lastSmoke < 5)
            return player.notify('Слишком быстро', 'error');

        if (this.puffs === 0)
            return player.notify('Сперва необходимо заправить кальян');
        this.puffs -= 1;

        player.user.lastSmoke = system.timestamp;
        CustomEvent.triggerClient(player, 'smoking:useHookah');
    }

    fill (player: PlayerMp) {
        if (this.puffs + PUFFS_IN_ONE_FILL > MAX_PUFFS)
            return player.notify('В кальян больше не помещается', 'error');

        const items: ItemEntity[] = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id);

        const charcoal: boolean = items.find(el => el.item_id === HOOKAH_CHARCOAL) !== undefined;

        if (!charcoal)
            return player.notify('У вас нет угля', 'error');

        const tobacco = items.find(el => HOOKAH_TOBACCO.includes(el.item_id));

        if (!tobacco)
            return player.notify('У вас нет табака', 'error');

        inventory.deleteItemsById(player, tobacco.item_id, 1);
        inventory.deleteItemsById(player, HOOKAH_CHARCOAL, 1);

        this.puffs += PUFFS_IN_ONE_FILL;
        player.notify('Кальян успешно заправлен', 'success');
    }

    remove(player: PlayerMp) {
        if (player.user.id !== this.ownerId && !player.user.isAdminNow())
            return player.notify('Нет доступа', 'error');

        this.interaction.destroy();
        this.prop.destroy();

        inventory.createItem({
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: player.user.id,
            item_id: HOOKAH_ITEM_ID,
            advancedNumber: this.puffs
        })
    }
}