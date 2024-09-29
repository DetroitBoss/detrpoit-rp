import {SORT_POSITIONS} from "../../../../shared/jobs/sanitation/sort";
import {system} from "../../system";
import {CustomEvent} from "../../custom.event";
import {DRESS_CONFIG_FEMALE_SORT, DRESS_CONFIG_MALE_SORT} from "../../../../shared/jobs/sanitation/uniform";

class Sort {

    public joinHandler = (player: PlayerMp) => {
        if (!player.user) return;

        if (player.user.sanitationSquad)
            return player.notify('Вы уже работаете, сперва нужно покинуть сессию', 'error');
        player.user.setGui(null);
        player.user.setJobDress(player.user.male ? DRESS_CONFIG_MALE_SORT : DRESS_CONFIG_FEMALE_SORT);

        player.user.sanitationSort = {
            position: this.getSortPosition(),
            time: system.timestamp
        }

        this.addInteraction(player);
    }

    public completedGameHandler = (player: PlayerMp) => {
        if (!player.user) return;
        if (!player.user.sanitationSort) return;

        player.user.setGui(null);

        if (system.timestamp - player.user.sanitationSort.time < 15) return;
        if (system.distanceToPos(player.user.sanitationSort.position, player.position) > 7) return;

        this.removeInteraction(player);

        player.user.sanitationSort = {
            position: this.getSortPosition(),
            time: system.timestamp
        }

        player.user.addMoney(50, true, 'Заработал на сортировке мусора');

        this.addInteraction(player);
    }

    public leaveHandler = (player: PlayerMp) => {
        if (!player.user || !player.user.sanitationSort) return;
        player.user.setGui(null);

        this.removeInteraction(player);
        player.user.setJobDress(null);

        player.user.sanitationSort = null;
    }

    protected getSortPosition(): Vector3Mp {
        return SORT_POSITIONS[Math.floor(Math.random() * SORT_POSITIONS.length)];
    }

    protected addInteraction(player: PlayerMp) {
        CustomEvent.triggerClient(player, 'sanitation:sort:addInteraction', player.user.sanitationSort.position);
    }

    protected removeInteraction(player: PlayerMp) {
        CustomEvent.triggerClient(player, 'sanitation:sort:removeInteraction');
    }
}

const sort = new Sort();

CustomEvent.registerCef('sanitation:sort:join', sort.joinHandler);
CustomEvent.registerCef('sanitation:sort:leave', sort.leaveHandler);
CustomEvent.registerCef('sanitation:sort:completedGame', sort.completedGameHandler);