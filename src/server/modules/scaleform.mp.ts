import {system} from "./system";
import {DEFAULT_SCALE, ScaleformTextMpDto, ScaleformTextMpOption} from "../../shared/scaleform.mp";
import {CustomEvent} from "./custom.event";
import {menu} from "./menu";
import {GameVisualElement, UpdateAction, UserUpdatedKey} from "../../shared/GameVisualElement";
import {User} from "./user";

let ids = 0;
export class ScaleformTextMp extends GameVisualElement {
    /** Кастомный параметр того, что эта форма для таймера установленной взрывчатки по ограбе */
    grab_item?: number;
    /** Кастомный параметр того, что эта форма была создана админом */
    admin_text?: boolean;
    readonly id: number;
    static at(id: number) {
        return this.pool.get(id)
    }
    static exists(id: number | ScaleformTextMp) {
        if(typeof id !== "number" && !id) return false;
        return !!this.pool.get(typeof id === "number" ? id : id.id)
    }
    static toArray(){
        return [...this.pool].map(q => q[1])
    }
    private positionData: Vector3Mp;
    private textData: string;
    private typeData: "rotation" | "front" | "board" = "front";
    private dimensionData: number = 0;
    private rotationData = { x: 0, y: 0, z: 0 };
    private scaleData = DEFAULT_SCALE;
    private rangeData: number = 10;
    private readonly _predicate: (player: PlayerMp) => boolean;
    static pool = new Map <number, ScaleformTextMp>();
    get predicate(): (player: PlayerMp) => boolean {
        return this._predicate;
    }
    get type() {
        return this.typeData
    }
    set type(val) {
        this.typeData = val;
        this.sendNewData('type', val)
    }
    get text() {
        return this.textData
    }
    set text(val) {
        this.textData = val;
        this.sendNewData('text', val)
    }
    get dimension() {
        return this.dimensionData
    }
    set dimension(val) {
        this.dimensionData = val;
        this.sendNewData('dimension', val)
    }
    get position() {
        return this.positionData
    }
    set position(val) {
        this.positionData = val;
        this.sendNewData('position', val)
    }
    get rotation() {
        return this.rotationData
    }
    set rotation(val) {
        this.rotationData = val;
        this.sendNewData('rotation', val)
    }
    get scale() {
        return this.scaleData
    }
    set scale(val) {
        this.scaleData = val;
        this.sendNewData('scale', val)
    }
    get range() {
        return this.rangeData
    }
    set range(val) {
        this.rangeData = val;
        this.sendNewData('range', val)
    }
    constructor(position: Vector3Mp,
                text: string,
                options?: ScaleformTextMpOption,
                predict?: (player: PlayerMp) => boolean,
                ...updatedKeys: UserUpdatedKey[]
    ) {
        super(...updatedKeys);

        this._predicate = predict;
        this.position = position
        this.textData = text
        ids++
        this.id = parseInt(`${ids}`)
        if (options) {
            if (options.range) this.rangeData = options.range
            if (options.rotation) this.rotationData = options.rotation
            if (options.scale) this.scaleData = options.scale
            if (options.type) this.typeData = options.type
            if (typeof options.dimension === "number") this.dimensionData = options.dimension
        }
        ScaleformTextMp.pool.set(this.id, this)

        const dto = {
            id: this.id,
            text: this.text,
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
            range: this.range,
            dimension: this.dimension,
            type: this.type
        }

        CustomEvent.triggerClients('scaleforms:load', [dto]);
        mp.players.toArray()
            .filter(player => player.user && (!this.predicate || this.predicate(player)))
            .forEach(player => {
                this.addPlayer(player);
                this.handleEnable(player, [this.id]);
            });
    }
    sendNewData(param: string, val: any){
        CustomEvent.triggerClients('scaleform:remote:update:'+param, this.id, val);
    }
    sendData(player: PlayerMp){
        CustomEvent.triggerClient(player, "scaleform:remote:data", this.id, this.text, this.position, this.rotation, this.scale, this.range, this.dimension, this.type)
    }
    public destroy(): void {
        ScaleformTextMp.pool.delete(this.id);

        CustomEvent.triggerClients("scaleform:remote:remove", this.id);
        super.destroy();
    }
    addPlayer(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        this.players.push(player.id)
    }
    removePlayer(player: PlayerMp){
        if(this.players.findIndex(q => q === player.id) > -1) this.players.splice(this.players.findIndex(q => q === player.id), 1);
    }
    players: number[] = [];

    public handleEnable(player: PlayerMp, ids: any[]) {
        CustomEvent.triggerClient(player, 'scaleforms:enable', ids);
    }

    public handleDisable(player: PlayerMp, ids: any[]) {
        CustomEvent.triggerClient(player, 'scaleforms:disable', ids);
    }

    public handleUpdate(player: PlayerMp): { id: any, action: UpdateAction } {
        if (!this._predicate) {
            return { id: this.id, action: 'none' };
        }

        const isPredict = this._predicate(player);
        if (isPredict && !this.players.includes(player.id)) {
            this.addPlayer(player);
            return { id: this.id, action: 'enable' };
        }
        else if (!isPredict && this.players.includes(player.id)) {
            this.removePlayer(player);
            return { id: this.id, action: 'disable' };
        }

        return { id: this.id, action: 'none' };
    }
}

mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    if (!player) return;

    const scaleforms : ScaleformTextMpDto[] = [...ScaleformTextMp.pool.values()]
        .map(s => {
            return {
                id: s.id,
                text: s.text,
                position: s.position,
                rotation: s.rotation,
                scale: s.scale,
                range: s.range,
                dimension: s.dimension,
                type: s.type
            }
        });

    const idsToEnable = [...ScaleformTextMp.pool.values()]
        .filter(s => !s.predicate || s.predicate(player))
        .map(s => {
            s.addPlayer(player)
            return s.id;
        });
    CustomEvent.triggerClient(player, 'scaleforms:load', scaleforms, idsToEnable);
});

CustomEvent.registerClient('admin:gamedata:textworld', player => {
    textWorldMain(player)
})

const textWorldMain = (player: PlayerMp) => {
    const user = player.user;
    if (!user.hasPermission('admin:gamedata:textworld')) return player.notify("У вас нет доступа", "error")
    const m = menu.new(player, "Отрисовка текста");
    [...mp.labels.toArray().filter(label => label.admin_text), ...ScaleformTextMp.toArray().filter(label => label.admin_text)].map(item => {
        m.newItem({
            name: item.text,
            onpress: () => {
                menu.accept(player, "Удалить?").then(status => {
                    if (!status) return;
                    item.destroy();
                })
            }
        })
    })
    m.newItem({
        name: "Новая отрисовка",
        onpress: () => {
            textWorld(player);
        }
    })
    m.open();
}

const textWorld = (player: PlayerMp) => {
    const user = player.user;
    if (!user.hasPermission('admin:gamedata:textworld')) return player.notify("У вас нет доступа", "error")
    let entity: ScaleformTextMp | TextLabelMp;
    let type = 0;
    let text = "INSERT_TEXT";
    let pos = player.position;
    let scale = DEFAULT_SCALE;
    let rotation = new mp.Vector3(0,0,player.heading);
    const recreate = () => {
        if (entity) entity.destroy();
        if(type){
            let typetext:any[] = ["", "front", "rotation", "board"]
            entity = new ScaleformTextMp(pos, text, {
                dimension: player.dimension,
                type: typetext[type],
                rotation,

            })
        } else {
            entity = mp.labels.new(text, pos, {
                dimension: player.dimension
            })
        }
        entity.admin_text = true
    }
    const openMenu = () => {
        if (!user.hasPermission('admin:gamedata:textworld')) return player.notify("У вас нет доступа", "error");
        recreate();
        const m = menu.new(player, "Отрисовка текста");
        m.onclose = () => {
            if (entity) entity.destroy();
            textWorldMain(player)
        }
        m.newItem({
            name: "Тип текста",
            type: 'list',
            listSelected: type,
            list: ['Обычный текст', "Скейлформа направленная", "Скейлформа статичная", "Скейлформа с доской"],
            onchange: (val) => {
                type = val;
                openMenu();
            }
        })
        m.newItem({
            name: "Текст",
            desc: text,
            onpress: () => {
                menu.input(player, "Введите текст", text, 400, "text").then(val => {
                    text = val
                })
                openMenu();
            }
        })
        m.newItem({
            name: "Местоположение",
            more: `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}`,
            onpress: () => {
                pos = player.position;
                player.notify("Текст переехал на новое место", "success")
                openMenu();
            }
        })
        if(!type){
            m.newItem({
                name: "Scale X",
                more: `${scale.x}`,
                onpress: () => {
                    menu.input(player, "Введите значение", scale.x, 3, 'int').then(sum => {
                        if(typeof sum !== "number") return;
                        if(sum < 0 || sum > 360) return;
                        scale.x = sum;
                        openMenu();
                    })
                }
            })
            m.newItem({
                name: "Scale Y",
                more: `${scale.y}`,
                onpress: () => {
                    menu.input(player, "Введите значение", scale.y, 3, 'int').then(sum => {
                        if(typeof sum !== "number") return;
                        if(sum < 0 || sum > 360) return;
                        scale.y = sum;
                        openMenu();
                    })
                }
            })
            m.newItem({
                name: "Scale Z",
                more: `${scale.z}`,
                onpress: () => {
                    menu.input(player, "Введите значение", scale.z, 3, 'int').then(sum => {
                        if(typeof sum !== "number") return;
                        if(sum < 0 || sum > 360) return;
                        scale.z = sum;
                        openMenu();
                    })
                }
            })
        }
        if(type >= 2){
            m.newItem({
                name: "Угол поворота",
                more: `${Math.floor(rotation.z)}`,
                onpress: () => {
                    menu.input(player, "Введите угол (0-360)", rotation.z, 3, 'int').then(sum => {
                        if(typeof sum !== "number") return;
                        if(sum < 0 || sum > 360) return;
                        rotation.z = sum;
                        openMenu();
                    })
                }
            })
        }
        m.newItem({
            name: "Опубликовать",
            onpress: () => {
                if(entity) entity.destroy();
                if (type) {
                    let typetext: any[] = ["", "front", "rotation", "board"]
                    new ScaleformTextMp(pos, text, {
                        dimension: player.dimension,
                        type: typetext[type],
                        rotation,

                    }).admin_text = true
                } else {
                    mp.labels.new(text, pos, {
                        dimension: player.dimension
                    }).admin_text = true
                }
                textWorldMain(player);
            }
        })

        m.open();
    }
    openMenu();
}