import {HOUSE_STOCK_POS, interriors} from "../../shared/inrerriors"
import {inventory} from "./inventory"
import {colshapes} from "./checkpoints"
import {MenuClass} from "./menu";
import {user} from "./user";
import {OWNER_TYPES} from "../../shared/inventory";
import {HOUSES_TELEPORT_SEPARATOR, HousesTeleportsList} from "../../shared/houses";
import {CustomEvent} from "./custom.event";
import {system} from "./system";

const player = mp.players.local
colshapes.new(HOUSE_STOCK_POS, `Склад`, () => {
    const m = new MenuClass('Склад');
    m.newItem({
        name: 'Открыть',
        onpress: () => {
            inventory.open();
        }
    })
    m.newItem({
        name: 'Записи',
        onpress: () => {
            user.openLogs(`house_${OWNER_TYPES.STOCK_SAFE}_${player.dimension}`, 'Склад')
        }
    })
    m.open()

}, {
    color: [100, 203, 63, 100],
    dimension: -1,
    type: 1,
    radius: 1.5,
    drawStaticName: "scaleform"
})

let homeBlip: BlipMp;
let warehouseBlip: BlipMp;
let familyHomeBlip: BlipMp;

CustomEvent.registerServer('warehouseBlip:create', (pos: { x: number, y: number, z: number }) => {
    warehouseBlip = system.createBlip(50, 49, pos, 'Ваш склад', 0);
})
CustomEvent.registerServer('warehouseBlip:destroy', () => {
    if (warehouseBlip)
        warehouseBlip.destroy()
})
CustomEvent.registerServer('house:homeBlip:create', (positionData) => {
    const pos = JSON.parse(positionData);
    homeBlip = system.createBlip(40, 5, pos, 'Ваш дом', 0);
})
CustomEvent.registerServer('house:homeBlip:delete', () => {
    if (homeBlip) 
        homeBlip.destroy()
})

CustomEvent.registerServer('familyHome:createBlip', (positionData) => {
    const pos = JSON.parse(positionData);
    familyHomeBlip = system.createBlip(40, 51, pos, 'Семейный дом', 0);
})
CustomEvent.registerServer('familyHome:deleteBlip', (positionData) => {
    if (familyHomeBlip)
        familyHomeBlip.destroy()
})

interriors.map((item, index) => {
    if (item.type === "house") {
        if (item.stock) {
            // mp.markers.new(1, new mp.Vector3(item.stock.x, item.stock.y, item.stock.z), 1, {
            //     color: [100, 203, 63, 100],
            //     dimension: -1,
            // })
            colshapes.new(new mp.Vector3(item.stock.x, item.stock.y, item.stock.z), 'Хранилище', () => {
                const m = new MenuClass('Хранилище');
                m.newItem({
                    name: 'Открыть',
                    onpress: () => {
                        inventory.open();
                    }
                })
                m.newItem({
                    name: 'Записи',
                    onpress: () => {
                        user.openLogs(`house_${OWNER_TYPES.HOUSE}_${player.dimension}`, 'Хранилище')
                    }
                })
                m.open()

            }, {
                color: [100, 203, 63, 100],
                dimension: -1,
                radius: 1.5,
                type: 1,
                drawStaticName: "scaleform"
            })
        }
    }
    // if (item.type === "garage") {
    //     item.cars.map(crd => {
    //         mp.markers.new(27, new mp.Vector3(crd.x, crd.y, crd.z), 4, {
    //             color: [217, 153, 63, 120],
    //             dimension: -1,
    //         })
    //     })
    // }
})



HousesTeleportsList.map((item, index) => {

    colshapes.new(item.pos, item.name, player => {
        CustomEvent.triggerServer('houseteleport:houseMenu', index)
    }, {
        drawStaticName: 'scaleform',
        dimension: 0
    });

    colshapes.new(new mp.Vector3(item.carExit.x, item.carExit.y, item.carExit.z + 0.5), item.name, player => {
        CustomEvent.triggerServer('houseteleport:vehicleMenu', index)
    }, {
        drawStaticName: 'scaleform',
        dimension: 0,
        radius: 3,
        type: 36
    });

    for(let q = HOUSES_TELEPORT_SEPARATOR * (index + 1); q < HOUSES_TELEPORT_SEPARATOR * (index + 2); q++){
        colshapes.new(item.inside, item.name, player => {
            CustomEvent.triggerServer('houseteleport:houseMenu', index)
        }, {
            drawStaticName: 'scaleform',
            dimension: q
        });
    }
})