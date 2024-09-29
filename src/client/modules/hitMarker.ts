import {CustomEvent} from "./custom.event";

class HitEntity {
    amount: number;
    position: Vector3Mp;
    count: number = 0;
    kill?: boolean

    constructor(amount: number, position: Vector3Mp, kill?: boolean) {
        this.amount = amount;
        this.position = position;
        if (kill) this.kill = true;
    }
}

class PersonalHitEntity {
    amount: number;
    count: number = 0;

    constructor(amount: number) {
        this.amount = amount;
    }
}

class HitClass {

    constructor() {
        mp.events.add('render', this.render);
        mp.events.add('render', this.personalRender);
    }
    private list: HitEntity[] = [];
    private personalList: PersonalHitEntity[] = [];

    add(amount: number, position: Vector3Mp, kill?: boolean) {
        if (!mp.storage.data.alertsEnable?.hitMaker) return;
        this.list.push(new HitEntity(amount, position, kill));
    }

    addPersonal(amount: number) {
        if (!mp.storage.data.alertsEnable?.personalHitMarker) return;
        this.personalList.push(new PersonalHitEntity(amount));
    }

    private render = () => {
        this.list.forEach((element: HitEntity) => {

            const coords = mp.game.graphics.world3dToScreen2d(
                element.position.x,
                element.position.y,
                element.position.z + 1.4
            );

            if (!coords || isNaN(coords.x)) {
                let find = this.list.findIndex(el => el == element);

                this.list.splice(find, 1);

                return;
            }

            mp.game.graphics.drawText(
                element.kill ? "dead" : element.amount.toString(),
                [coords.x + (0.01 * element.count / 15), coords.y],
                {
                    font: 2,
                    centre: true,
                    color: element.kill ? [255, 0, 0, 155 - element.count] : [255, 255, 255, 155 - element.count],
                    scale: [0.4, 0.4],
                    outline: true
                }
            );

            element.count += 1;
            element.position.z += 0.01;

            if (element.count > 155) {
                let find = this.list.findIndex(el => el == element);

                this.list.splice(find, 1);
            }
        });
    }

    private personalRender = () => {
        this.personalList.forEach((el: PersonalHitEntity) => {
            mp.game.graphics.drawText(
                el.amount.toString(),
                [0.5 + (0.01 * el.count / 12), 0.95],
                {
                    font: 2,
                    centre: true,
                    color: [255, 255, 255, 155],
                    scale: [0.4, 0.4],
                    outline: true
                }
            );

            el.count += 1;

            if (el.count > 155) {
                let find = this.personalList.findIndex(element => el == element);

                this.personalList.splice(find, 1);
            }
        })
    }
}

export const hitmarker = new HitClass();

CustomEvent.registerServer('hitmarker:add', (position: Vector3Mp, damage: number) => {
    hitmarker.add(damage, position);
})

CustomEvent.registerServer('hitmarker:kill', (pos: Vector3Mp) => {
    hitmarker.add(0, pos, true);
})