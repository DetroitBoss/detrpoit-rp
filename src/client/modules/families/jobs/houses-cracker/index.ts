import {CustomEvent} from "../../../custom.event";
import {gui} from "../../../gui";
import {colshapeHandle, colshapes} from "../../../checkpoints";
import {getInteriorHouseById} from "../../../../../shared/inrerriors";
import { user } from '../../../user'

let leavingAreaBlip: BlipMp;
let leavingAreaColshape: colshapeHandle;
let crackingPromiseResolver : (value?: unknown) => void;
let robberyColshapes: colshapeHandle[] = [];
let crackColshape: colshapeHandle;
let crackBlip: BlipMp;

CustomEvent.registerServer('jobs:houseCracking:destroyCrackPoint', () => destroyCrackPoint());

mp.events.add('jobs::houseCracking::endMinigame', (isSuccess) => {
    gui.setGui(null);

    if (crackingPromiseResolver) {
        crackingPromiseResolver(isSuccess);
    }
});

CustomEvent.registerServer('jobs:houseCracking:createCrackpoint', (position: Vector3Mp) => {
    crackColshape = colshapes.new(position, undefined, () => {
        CustomEvent.triggerServer('jobs:houseCracking:enterCrackpoint');
    }, {
        onenter: true,
        color: [255, 0, 0, 200]
    });

    crackBlip = mp.blips.new(1, position, {
        color: 1,
        shortRange: false,
        name: 'Задание на ограбление'
    });
});

CustomEvent.registerServer('jobs:houseCracking:startMinigame', () => {
    gui.setGui('BreakLock');

    return new Promise((resolve) => {
        crackingPromiseResolver = resolve;
    })
});

CustomEvent.registerServer('jobs:houseCracking:createRobberyPoints',
    (interior: number, dimension: number) =>
{
    const points = getInteriorHouseById(interior).robberyPoints;

    points.forEach(point => {
        const colshape = colshapes.new(new mp.Vector3(point.x, point.y, point.z), 'Ограбить', () => {
            CustomEvent.triggerServer('jobs:houseCracking:rob');

            robberyColshapes.splice(robberyColshapes.indexOf(colshape), 1);
            colshape.destroy();
        }, {
            dimension: dimension,
            color: [200, 0, 0, 230]
        });

        robberyColshapes.push(colshape);
    })
});

CustomEvent.registerServer('jobs:houseCracking:createLeavingArea',
(position: Vector3Mp, areaRadius: number) =>
{
    leavingAreaBlip = mp.blips.new(4, new mp.Vector3(position.x, position.y, position.z), {
        alpha: 160,
        color: 4,
        rotation: 0,
        radius: areaRadius,
        shortRange: false
    });

    leavingAreaColshape = colshapes.new(position, undefined, undefined, {
        type: -1,
        onExitHandler: (player) => {
            if (mp.players.local.dimension !== 0) {
                return;
            }

            if (!user.cuffed) CustomEvent.triggerServer('jobs:houseCracking:leftArea');
        },
        radius: areaRadius,
        dimension: 0
    });
});

CustomEvent.registerServer('jobs:houseCracking:end', () => {
    robberyColshapes.forEach(colshape => {
       if (colshape && colshape.exists) {
           colshape.destroy();
       }
    });
    robberyColshapes = [];

    destroyCrackPoint();

    if (leavingAreaColshape && leavingAreaColshape.exists) {
        leavingAreaColshape.destroy();
    }
    leavingAreaColshape = null;

    if (mp.blips.exists(leavingAreaBlip)) {
        leavingAreaBlip.destroy();
    }
    leavingAreaBlip = null;
});

function destroyCrackPoint() {
    if (crackColshape && crackColshape.exists) {
        crackColshape.destroy();
    }
    crackColshape = null;

    if (mp.blips.exists(crackBlip)) {
        crackBlip.destroy();
    }
    crackBlip = null;
}