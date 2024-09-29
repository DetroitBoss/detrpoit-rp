import {currentMenu} from "./menu";
import {CustomEvent} from "./custom.event";
import {colshapeHandleBase, colshapeHandleOptions, ColshapeMarkerDto} from "../../shared/checkpoints";
import {registerHotkey} from "./controls";
import {gui} from "./gui";
import {user} from "./user";
import {system} from "./system";
import {ScaleformTextMp} from "./scaleform.mp";
import {enterTableHandle} from "./casino/roulette";
import {enterSlots} from "./casino/slots";
import {enterDice} from "./casino/dice";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

const player = mp.players.local
export class colshapeHandle extends colshapeHandleBase {
    protected createMarker(position: Vector3Mp) {
        this.markers.forEach(m => {
            if (mp.markers.exists(m)) {
                m.destroy();
            }
        });

        let types = typeof this.type === "number" ? [this.type] : this.type
        types.map(type => {
            const marker = mp.markers.new(type, position, this.radius,
                {
                    color: this.color,
                    rotation: new mp.Vector3(this.rotation, 0, 0),
                    dimension: this.dimension
                })
            this.markers.push(marker);
        })
    }

    protected deleteMarker() {
        this.markers.forEach(m => {
            if (mp.markers.exists(m)) {
                m.destroy();
            }
        });

        this.markers = [];
    }
}

const loadedMarkers : Map<number, { marker: ColshapeMarkerDto, enabled: boolean }> = new Map<number, { marker: ColshapeMarkerDto, enabled: boolean }>();

let colshapeMarkers = new Map<number, MarkerMp[]>();
let colshapeText = new Map<number, (ScaleformTextMp | TextLabelMp)>();
let colshapeData = new Map<number, string>();

function pushMarkerToLoaded(marker: ColshapeMarkerDto) {
    if (loadedMarkers.has(marker.id)) {
        const data = loadedMarkers.get(marker.id);
        deleteMarkerForColshape(marker.id);
        loadedMarkers.set(marker.id, { marker: marker, enabled: data.enabled });
    } else {
        loadedMarkers.set(marker.id, { marker: marker, enabled: false });
    }
}

const enableColshapes = (ids: number[]) => {
    for (let id of ids) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }

        if (loadedMarkers.has(id)) {
            loadedMarkers.get(id).enabled = true;
        }
    }
};
CustomEvent.registerServer('colshapes:enableMarker', enableColshapes);

CustomEvent.registerServer('colshapes:disableMarker', (ids: number[]) => {
    for (let id of ids) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }

        if (loadedMarkers.has(id)) {
            loadedMarkers.get(id).enabled = false;
        }
    }
});

CustomEvent.registerServer('colshapes:deleteMarker', (id: number) => {
    if (loadedMarkers.has(id)) {
        deleteMarkerForColshape(id);
        loadedMarkers.delete(id);
    }
});

CustomEvent.registerServer('colshapes:createMarker', (data: string) => {
    const marker : ColshapeMarkerDto = JSON.parse(data);
    pushMarkerToLoaded(marker);
});

CustomEvent.registerServer('colshapes:createMarkers', (markers: ColshapeMarkerDto[], idsToEnable?: number[]) => {
    markers.forEach(m => pushMarkerToLoaded(m));

    if (idsToEnable) {
        enableColshapes(idsToEnable);
    }
});

setInterval(() => {
    const toKeepIds : number[] = [];

    [...loadedMarkers.values()]
        .filter(data => data.enabled
            && data.marker.t && data.marker.t !== -1
        )
        .forEach(data => {
            const marker = data.marker;

            marker.p.forEach((position, index) => {
                if (system.distanceToPos(position, player.position) > 100) {
                    return;
                }

                const id = marker.id + index;
                const positionalMarker : ColshapeMarkerDto = {
                    ...marker,
                    id: id,
                    p: [position]
                };

                createMarkerForColshape(positionalMarker);
                toKeepIds.push(positionalMarker.id);
            });
        });

    colshapeMarkers.forEach((marker, id) => {
        if(!toKeepIds.includes(id)) {
            deleteMarkerForColshape(id)
        }
    });
}, 400)

const deleteMarkerForColshape = (id: number) => {
    if(colshapeMarkers.has(id)){
        let m = colshapeMarkers.get(id);
        m.map(marker => {
            if(mp.markers.exists(marker)) marker.destroy()
        })
    }
    if (colshapeText.has(id)){
        let m = colshapeText.get(id);
        if(m instanceof ScaleformTextMp){
            if (ScaleformTextMp.exists(m)) m.destroy();
        } else {
            if(mp.labels.exists(m)) m.destroy();
        }
    }
    colshapeMarkers.delete(id)
    colshapeText.delete(id)
    colshapeData.delete(id)
}
const createMarkerForColshape = (data: ColshapeMarkerDto) => {
    const datastring = JSON.stringify(data);
    if(!colshapeData.has(data.id) || colshapeData.get(data.id) != datastring){
        deleteMarkerForColshape(data.id);
        let markers: MarkerMp[] = [];
        let types = typeof data.t === "number" ? [data.t] : data.t;
        types.map(type => {
            let r = data.r
            if(type === 27 && types.includes(1)) r += 0.25
            markers.push(mp.markers.new(type, new mp.Vector3(data.p[0].x, data.p[0].y, data.p[0].z), r,
                {
                    color: data.c,
                    dimension: data.d || 0
                }))
        })
        colshapeMarkers.set(data.id, markers)
        colshapeData.set(data.id, datastring)
        if (data.s && data.n){
            if(data.s === "scaleform"){
                colshapeText.set(data.id, new ScaleformTextMp(new mp.Vector3(data.p[0].x, data.p[0].y, data.p[0].z + 1), data.n, {
                    dimension: data.d || 0,
                    range: 10,
                    type: 'front'
                }))
            } else {
                colshapeText.set(data.id, mp.labels.new(data.n, new mp.Vector3(data.p[0].x, data.p[0].y, data.p[0].z + 1), {
                    dimension: data.d || 0,
                    drawDistance: 10,
                }))
            }
        }
    }
}


export const colshapes = {
    new: (position: Vector3Mp | Vector3Mp[], message: (string | ((player: PlayerMp, index?:number) => string)), handle: (player?: PlayerMp, index?: number) => void, options?: colshapeHandleOptions) => new colshapeHandle(position, message, handle, options)
}

let sendEevent = false;
registerHotkey(69, () => {
    if (sendEevent) return;
    if (gui.cursor) return;
    if (gui.is_block_keys) return;
    if (player.getVariable('cuffed')) return;
    if(!inColshape && enterTableHandle()) return;
    if(!inColshape && enterSlots()) return;
    if(!inColshape && enterDice()) return;
    if (!inColshape) return;
    if (currentColshape && currentColshape.handleClass){
        currentColshape.handleClass.handle(player);
        return;
    }
    sendEevent = true;
    setTimeout(() => {
        sendEevent = false;
    }, 1000)
    CustomEvent.triggerServer('sendkey:69')
})


let inColshape:boolean;
export let currentColshape:ColshapeMp;
mp.events.add('playerEnterColshape', (shape:ColshapeMp) => {
    inColshape = true;
    currentColshape = shape
    if (!currentColshape) return;

    if (!currentColshape.handleClass) return;

    if (currentColshape.handleClass.predicate && !currentColshape.handleClass.predicate(player)) {
        return;
    }

    if (currentColshape.handleClass.onEnterHandler) {
        currentColshape.handleClass.onEnterHandler(player)
    }
    if (!currentColshape.handleClass.onenter){
        let text = currentColshape.handleClass.message;
        let mes = "";
        if (text) {
            if (typeof currentColshape.handleClass.message === "string") {
                mes = currentColshape.handleClass.message
            } else {
                const index = currentColshape.handleClass.colshapes.findIndex(col => col && mp.colshapes.exists(col) && col.id === currentColshape.id);
                mes = currentColshape.handleClass.message(player, index)
            }
            if (mes) user.setHelpKey('E', mes);
        }
        return;
    }
    currentColshape.handleClass.handle(player);
})
mp.events.add('playerExitColshape', (colshape: ColshapeMp) => {
    inColshape = false;
    currentColshape = null;
    user.removeHelpKey();
    if (currentMenu){
        if (!currentMenu.exitProtect){
            currentMenu.close();
        }
    }
    if (colshape && colshape.handleClass && colshape.handleClass.onExitHandler) {
        colshape.handleClass.onExitHandler(player)
    }
})
setInterval(() => {
    if(player.getVariable('inColshape')) return;
    if (!currentColshape) return user.removeHelpKey();
    if (!currentColshape.handleClass) return user.removeHelpKey();
    if (!system.isPointInPoints(player.position, currentColshape.handleClass.position, currentColshape.handleClass.radius * 1.5)) return playerExitColshape();
}, 3000)
mp.events.add('playerExitColshapeRecreate', (shape: ColshapeMp) => {
    if (currentColshape === shape) return mp.events.call('playerExitColshape', shape);
})

export const playerExitColshape = () => {
    mp.events.call('playerExitColshape');
}