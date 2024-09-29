import {CustomEvent} from "./custom.event";
import {CONSTRUCTION_HOUSES} from "../../shared/construction";
import {colshapeHandle, colshapes} from "./checkpoints";
import {playAnimationWithResult} from "./anim";
import {user} from "./user";
import {hudBar} from "./hudBar";
import {gui} from "./gui";

let current: colshapeHandle


export let inConstruction = false;

CustomEvent.registerServer('construction:set:success', (configId: number, id: number) => {
    const cfg = CONSTRUCTION_HOUSES[configId];
    if(!cfg) return;
    const item = cfg.sets[id];
    if(!item) return;
    const interior = mp.game.interior.getInteriorAtCoords(cfg.pos.x, cfg.pos.y, cfg.pos.z);
    if(interior){
        mp.game.interior.enableInteriorProp(interior, item[0]);
        mp.game.interior.refreshInterior(interior);
    }
})

CustomEvent.registerServer('construction:leave', () => {
    inConstruction = false;
})
CustomEvent.registerServer('construction:set:enter', (configId: number, enables: number[]) => {
    const cfg = CONSTRUCTION_HOUSES[configId];
    if(!cfg) return;
    inConstruction = true;
    gui.setGui(null);
    const interior = mp.game.interior.getInteriorAtCoords(cfg.pos.x, cfg.pos.y, cfg.pos.z);
    if(interior){
        cfg.sets.map((item, id) => {
            if(enables.includes(id)) mp.game.interior.enableInteriorProp(interior, item[0]);
            else mp.game.interior.disableInteriorProp(interior, item[0]);
        })
        mp.game.interior.refreshInterior(interior);
    }
})

setTimeout(() => {
    CONSTRUCTION_HOUSES.map(item => {
        item.sets.map(set => {
            colshapes.new(new mp.Vector3(set[1], set[2], set[3]), set[5], ()=>{
                mp.players.local.setHeading(set[4])


                const interior = mp.game.interior.getInteriorAtCoords(item.pos.x, item.pos.y, item.pos.z);
                if(interior){
                    mp.game.interior.enableInteriorProp(interior, set[0]);
                    mp.game.interior.refreshInterior(interior);
                    user.notify('Проп показан')
                    hudBar.timer('Проп отображён', 5);
                    setTimeout(() => {
                        mp.game.interior.disableInteriorProp(interior, set[0]);
                        mp.game.interior.refreshInterior(interior);
                        user.notify('Проп скрыт')
                    }, 5000)
                }

            }, {
                dimension: 0,
                drawStaticName: "label"
            })
        })
    })
}, 5000)

CustomEvent.registerServer('construction:set:start', (configId: number, id: number) => {
    const cfg = CONSTRUCTION_HOUSES[configId];
    if(!cfg) return;
    const item = cfg.sets[id];
    if(!item) return;
    if(current && current.exists) current.destroy();
    let ok = true;
    let block = hudBar.timer('Время на выполнение задания', cfg.setSecond + item[7]);
    user.notify('Вы взяли материалы. Отправляйтесь к метке')
    let time = setTimeout(() => {
        if(current && current.exists) current.destroy();
        current = null;
        ok = false
        user.notify('Вы не успели выполнить задание', 'error');
        if(block && block.exists) block.destroy();
    }, (cfg.setSecond) * 1000)
    let donow = false;
    current = colshapes.new(new mp.Vector3(item[1], item[2], item[3]), item[5], async () => {
        if(!current || !current.exists) return;
        if(donow) return;
        donow = true;
        ok = true;
        const scenarios = item[6].split('|');
        for(let i in scenarios){
            if(ok){
                const scenario = scenarios[i];
                CustomEvent.triggerCef('hud:flatStart', 10)
                const status = await playAnimationWithResult(scenario, 10, 'Выполнение задания', item[4])
                if(!status){
                    CustomEvent.triggerCef('hud:flatStop')
                    ok = false;
                }
                if(!current || !current.exists) ok = false;
            }
        }
        if(ok){
            if(block && block.exists) block.destroy();
            if(current && current.exists) {
                current.destroy();
                current = null;
            }
            CustomEvent.triggerServer('construction:set:ok', id)
            clearTimeout(time);
        }
        donow = false;
    }, {
        type: 27,
        dimension: -1,
        drawStaticName: 'scaleform'
    })
})