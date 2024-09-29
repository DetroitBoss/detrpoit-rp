import {system} from "./system";
import {DEFAULT_SCALE, ScaleformTextMpDto, ScaleformTextMpOption} from "../../shared/scaleform.mp";
import {CustomEvent} from "./custom.event";
import {user} from "./user";

const player = mp.players.local;
let ids = 0;

const freeScaleformTextMps = ['player_name_01', 'player_name_02', 'player_name_03', 'player_name_04', 'player_name_05', 'player_name_06', 'player_name_07', 'player_name_08', 'player_name_09', 'player_name_10', 'player_name_11', 'player_name_12', 'player_name_13', 'player_name_14', 'player_name_15']
let freeScaleformHandles: number[] = [];
freeScaleformTextMps.map(q => {
    freeScaleformHandles.push(mp.game.graphics.requestScaleformMovie(q))
})

const enableScaleforms = (ids: number[]) => {
    for (let id of ids) {
        const scaleform = ScaleformTextMp.atRemoteId(id);
        if (scaleform) {
            scaleform.enabled = true;
        }
    }
};

CustomEvent.registerServer('scaleforms:enable', (ids) => {
    enableScaleforms(ids);
});

CustomEvent.registerServer('scaleforms:disable', (ids: number[]) => {
    for (let id of ids) {
        const scaleform = ScaleformTextMp.atRemoteId(id);
        if (scaleform) {
            scaleform.enabled = false;
        }
    }
});

CustomEvent.registerServer('scaleforms:load', (scaleforms : ScaleformTextMpDto[], idsToEnable?: number[]) => {;
    for (let scaleform of scaleforms) {
        const { id, text, position, rotation, scale, range, dimension, type } = scaleform;
        loadScaleform(id, text, position, rotation, scale, range, dimension, type);
    }

    if (idsToEnable) {
        enableScaleforms(idsToEnable);
    }
});

CustomEvent.registerServer('scaleform:remote:remove', (id: number) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if(scale) scale.destroy()
})
CustomEvent.registerServer('scaleform:remote:update:text', (id: number, text: string) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if(scale) scale.text = text;
})
CustomEvent.registerServer('scaleform:remote:update:dimension', (id: number, val: number) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (scale) scale.dimension = val;
})
CustomEvent.registerServer('scaleform:remote:update:position', (id: number, val: any) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (scale){
        scale.position = val;
        scale.unload()
    }
})
CustomEvent.registerServer('scaleform:remote:update:rotation', (id: number, val: any) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (scale){
        scale.rotation = val;
        scale.unload()
    }
})
CustomEvent.registerServer('scaleform:remote:update:scale', (id: number, val: any) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (scale) scale.scale = val;
})
CustomEvent.registerServer('scaleform:remote:update:range', (id: number, val: any) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (scale) scale.range = val;
})
CustomEvent.registerServer('scaleform:remote:update:type', (id: number, type: any) => {
    const scale = ScaleformTextMp.atRemoteId(id);
    if (!scale) return;
    scale.type = type
    scale.unload();
})
CustomEvent.registerServer('scaleform:remote:data', (id, text, pos, rotation, scale, range, dimension, type) => {
    loadScaleform(id, text, pos, rotation, scale, range, dimension, type);
})

function loadScaleform(id: any, text: any, pos: any, rotation: any, scale: any, range: any, dimension: any, type: any) {
    const scaleform = ScaleformTextMp.atRemoteId(id);
    if(scaleform){
        scaleform.position = pos;
        scaleform.rotation = rotation;
        scaleform.scale = scale;
        scaleform.range = range;
        scaleform.dimension = dimension;
        scaleform.type = type;
        scaleform.text = text
    } else {
        let item = new ScaleformTextMp(pos, text, {
            rotation, scale, range, dimension, type
        })
        item.remoteId = id;
    }
}

export class ScaleformTextMp {
    static pool = new Map <number, ScaleformTextMp> ()
    board: ObjectMp;
    static at(id: number){
        return this.pool.get(id)
    }
    static exists(item: number | ScaleformTextMp){
        const id = typeof item === "number" ? item : item.id
        return !!this.pool.get(id)
    }
    static toArray() {
        return [...this.pool].map(q => q[1])
    }
    static atRemoteId(id: number){
        return this.toArray().find(q => q.remoteId === id);
    }
    _handle: number;
    queueCallFunction: Map<string, string[]>;
    position: Vector3Mp;
    readonly id: number;
    scaleformStr: string
    textData: string;
    dimension: number = 0;
    rotation = { x: 0, y: 0, z: 0 };
    scale = DEFAULT_SCALE;
    range: number = 10;
    type: "rotation" | "front" | "board" = "front";
    remoteId?:number;
    textWhenBoardPos: Vector3Mp;
    get text(){
        return this.textData
    }
    set text(val){
        this.textData = val;
        if (this.isLoaded) this.callFunction('SET_PLAYER_NAME', this.textData);
    }
    constructor(pos: Vector3Mp, text: string, options?: ScaleformTextMpOption) {
        this.position = pos
        this.textData = text
        this.id = ids++
        if(options){
            if (options.range) this.range = options.range
            if (options.rotation) this.rotation = options.rotation
            if (options.scale) this.scale = options.scale
            if (options.type) this.type = options.type
            if (typeof options.dimension === "number") this.dimension = options.dimension
        }
        ScaleformTextMp.pool.set(this.id, this)
    }

    public enabled: boolean = false;

    async load(){
        if (this.isLoaded) return;
        if (freeScaleformTextMps.length === 0) return;
        this.textWhenBoardPos = null;
        if(this.type === "board"){
            this.board = mp.objects.new(-1713129017, this.position, {
                dimension: this.dimension,
                rotation: new mp.Vector3(this.rotation.x, this.rotation.y, this.rotation.z)
            })
        }
        this.scaleformStr = freeScaleformTextMps[0];
        freeScaleformTextMps.splice(0, 1);
        this._handle = freeScaleformHandles[0];
        freeScaleformHandles.splice(0, 1);
        this.queueCallFunction = new Map();
        while (!this.isLoaded) await system.sleep(10);
        this.callFunction('SET_PLAYER_NAME', this.textData);
    }

    unload(){
        if (mp.objects.exists(this.board)) this.board.destroy();
        this.board = null;
        if (this.scaleformStr) freeScaleformTextMps.push(this.scaleformStr), freeScaleformHandles.push(this._handle);
        this.scaleformStr = null;
        this._handle = null;
    }

    private get isLoaded() {
        return typeof this._handle === "number" && !!this.scaleformStr && !!mp.game.graphics.hasScaleformMovieLoaded(this._handle);
    }

    private get isValid() {
        return this._handle !== 0;
    }

    render(){
        if(this.type === "front") this.renderFront();
        else this.render3D();
    }
    private render3D() {
        if (this.isLoaded && this.isValid) {
            this.onUpdate();
            const pos = this.type === "board" ? this.textWhenBoardPos : this.position
            if(!pos && this.type === "board"){
                if (!mp.objects.exists(this.board)) return;
                if(!this.board.handle) return;
                this.textWhenBoardPos = this.board.getOffsetFromInWorldCoords(0, -0.02, 0)
                return;
            }
            mp.game.graphics.drawScaleformMovie3dNonAdditive(this._handle, pos.x, pos.y, pos.z, this.rotation.x, this.rotation.y, -this.rotation.z, 2, 2, 1, this.scale.x, this.scale.y, this.scale.z, 2);
        }
    }
    private renderFront() {
        if (this.isLoaded && this.isValid) {
            this.onUpdate();
            const rot = mp.game.cam.getGameplayCamRot(0)
            mp.game.graphics.drawScaleformMovie3dNonAdditive(this._handle, this.position.x, this.position.y, this.position.z, rot.x, rot.y, rot.z, 2, 2, 1, this.scale.x, this.scale.y, this.scale.z, 2);
        }
    }

    private callFunction(strFunction: string, ...args: string[]) {
        if (this.isLoaded && this.isValid) {
            const graphics = mp.game.graphics;
            graphics.pushScaleformMovieFunction(this._handle, strFunction);
            args.forEach(arg => {
                switch (typeof arg) {
                    case 'string': {
                        graphics.pushScaleformMovieFunctionParameterString(arg);
                        break;
                    }
                    case 'boolean': {
                        graphics.pushScaleformMovieFunctionParameterBool(arg);
                        break;
                    }
                    case 'number': {
                        if (Number(arg) === arg && arg % 1 !== 0) {
                            graphics.pushScaleformMovieFunctionParameterFloat(arg);
                        } else {
                            graphics.pushScaleformMovieFunctionParameterInt(arg);
                        }
                    }
                }
            });
            graphics.popScaleformMovieFunctionVoid();
        } else {
            this.queueCallFunction.set(strFunction, args);
        }
    }

    private onUpdate() {
        if (this.isLoaded && this.isValid) {
            this.queueCallFunction.forEach((args, strFunction) => {
                this.callFunction(strFunction, ...args);
                this.queueCallFunction.delete(strFunction);
            });
        }
    }

    destroy(){
        this.range = 0;
        this.unload();
        ScaleformTextMp.pool.delete(this.id);
    }
}

let scaleformsToRender : ScaleformTextMp[] = [];
setInterval(() => {
    ScaleformTextMp.pool.forEach(item => {
        if (item.enabled && !user.dead && system.distanceToPos(item.position, player.position) <= item.range && (item.dimension === -1 || item.dimension === player.dimension)){
            if (!scaleformsToRender.includes(item)) {
                item.load();
                scaleformsToRender.push(item);
            }
        } else {
            if (scaleformsToRender.includes(item)) {
                scaleformsToRender.splice(scaleformsToRender.findIndex(s => s.id === item.id), 1);
                item.unload();
            }
        }
    })
}, 500);

mp.events.add('render', () => {
    scaleformsToRender.forEach(item => {
        item.render();
    })
});