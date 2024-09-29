import {
    COLLECT_PRESENT_ANIM, MAX_LOLLIPOPS_IN_PRESENT,
    Present,
    PRESENT_PROP_NAME,
    PRESENTS_COORDS,
    PRESENTS_SPAWN_COUNT, PRESENTS_START_TEXT, PRESENTS_STOP_TEXT
} from "../../../../../shared/events/newYear/presents.config";
import {colshapes} from "../../../checkpoints";
import {system} from "../../../system";

export class Presents {
    public active: boolean = false;
    private presentsList: Present[] = [];
    private lastSwitch: number = 0;

    public switcher(player: PlayerMp): void {
        if (system.timestamp - this.lastSwitch < 10)
            return player.notify('Стоит немного подождать', 'error');

        this.lastSwitch = system.timestamp;

        this.active ? this.stop() : this.start();
        player.notify(`Вы ${this.active ? 'включили' : 'выключили'} сбор подарков`, 'info');
    }

    private start(): void {
        this.active = true;

        mp.players.forEach((p) => {
            p.outputChatBox(PRESENTS_START_TEXT);
        });

        const coords = PRESENTS_COORDS[Math.floor(Math.random() * PRESENTS_COORDS.length)];

        coords.forEach((el, index) => this.presentsList.push(this.createPresent(index, el)));
    }

    private stop(): void {
        this.active = false;

        mp.players.forEach((p) => {
            p.outputChatBox(PRESENTS_STOP_TEXT);
        });

        this.presentsList.forEach((item) => {
            const obj = item.ObjectEntity;
            if (mp.objects.exists(obj)) obj.destroy();
           item.InteractionEntity.destroy();
        });

        this.presentsList = [];
    }

    private presentInteractionHandle(player: PlayerMp, id: number) {
        player.user.playAnimation([[COLLECT_PRESENT_ANIM.dictionary, COLLECT_PRESENT_ANIM.name]]);
        this.finishInteraction(player, id)
    }

    private createPresent(id: number, pos: Vector3Mp): Present {
        return {
            id,
            InteractionEntity: colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), 'Забрать подарок',
                (player) => this.presentInteractionHandle(player, id),
                {color: [0, 0, 0, 0], radius: 2.5}),

            ObjectEntity: mp.objects.new(mp.joaat(PRESENT_PROP_NAME), new mp.Vector3(pos.x, pos.y, pos.z - 1))
        }
    }

    private finishInteraction(player: PlayerMp, id: number) {
        const index = this.presentsList.findIndex(item => item.id === id);

        if (index === -1) return player.notify('Подарок уже забрал другой игрок', 'error');

        const obj = this.presentsList[index].ObjectEntity;

        if (mp.objects.exists(obj)) obj.destroy();

        this.presentsList[index].InteractionEntity.destroy();

        this.presentsList.splice(index, 1);

        const lollipops = system.getRandomInt(1, MAX_LOLLIPOPS_IN_PRESENT);

        player.notify(`Вы заработали леденцы в размере - ${lollipops}`);
        player.user.log('lollipops', `Подобрал подарок и получил леденцы в размере - ${lollipops}`);
        if (player.user.admin_level && player.user.admin_level > 0)
            player.user.log('AdminJob', `Подобрал подарок с админкой, админ мод ${player.user.isAdminNow(1) ? 'Вкл' : 'Выкл'}`);
        player.user.giveLollipops(lollipops);
    }


}
