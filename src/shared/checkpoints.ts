import {GameVisualElement, UpdateAction, UserUpdatedKey} from "./GameVisualElement";


export interface colshapeHandleOptions {
    /** Измерение */
    dimension?: number,
    /** Радиус */
    radius?: number,
    rotation?: number,
    /** Тип метки */
    type?: number|number[],
    /** RGBA цвет */
    color?: RGBA,
    /** Срабатывает при входе */
    onenter?: boolean,
    /** Отрисовывать статическое имя колшейпа. Будет работать только если тип имени строка */
    drawStaticName?:"label"|"scaleform";
    /** Функция выполняемая при входе в зону */
    onEnterHandler?:(player:PlayerMp) => void,
    /** Функция выполняемая при покидании зоны */
    onExitHandler?:(player:PlayerMp) => void,
    /** Условие для отображения к конкретному персонажу и его возможности взаимодействовать с колшейпом */
    predicate?: (player: PlayerMp) => boolean
}

let ids = 0;

export interface ColshapeMarkerDto {
    s?: "label" | "scaleform",
    n?: string,
    t: number,
    p: {x: number, y: number, z: number}[],
    r: number,
    c: RGBA,
    d: number,
    id: number
}

export class colshapeHandleBase extends GameVisualElement {
    readonly radius: number = 1;
    readonly color: RGBA = [33, 150, 243, 100];
    readonly rotation: number = 0;
    readonly drawStaticName?: "label" | "scaleform"

    readonly onEnterHandler?:(player:PlayerMp) => void
    readonly onExitHandler?:(player:PlayerMp) => void

    private readonly onDestroyHandler?: () => void;

    private readonly messageData: (string | ((player: PlayerMp, index?: number) => string));
    colshapes: ColshapeMp[] = [];
    markers: MarkerMp[] = [];
    readonly type: number|number[] = 1;
    readonly onenter: boolean = false;
    handle: (player?: PlayerMp, index?:number) => void;
    onLeave?: (player: PlayerMp) => void;
    private positionData: Vector3Mp[];
    private created = true;
    readonly id: number;
    public readonly predicate: (player: PlayerMp) => boolean;

    get position(){
        return this.positionData
    }
    set position(value){
        this.positionData = value;
        if (this.recreate) this.recreate();
    }
    get message(){
        return this.messageData
    }
    set message(value){
        this.message = value;
        if (this.recreate) this.recreate();
    }
    private dimensionData: number = 0;
    get dimension(){
        return this.dimensionData
    }
    set dimension(value){
        this.dimensionData = value;
        if(this.recreate) this.recreate();
    }
    constructor(position: Vector3Mp | Vector3Mp[],
                message: (string | ((player: PlayerMp, index?:number) => string)),
                handle: (player?: PlayerMp, index?: number) => void,
                options?: colshapeHandleOptions,
                onDestroyHandler?: () => void,
                ...updatedKeys: UserUpdatedKey[]) {
        super(...updatedKeys);

        ids += 1000;
        this.id = ids;
        let positions = position instanceof Array ? position : [position];
        this.positionData = positions;
        this.messageData = message;
        this.handle = handle;
        this.onDestroyHandler = onDestroyHandler;
        if(options){
            if (options.dimension) this.dimensionData = options.dimension;
            if (options.radius) this.radius = options.radius;
            if (options.color) this.color = options.color;
            if (options.rotation) this.rotation = options.rotation;
            if (options.type) this.type = options.type;
            if (options.onenter) this.onenter = options.onenter;
            if (options.drawStaticName) this.drawStaticName = options.drawStaticName;
            if (options.onEnterHandler) this.onEnterHandler = options.onEnterHandler;
            if (options.onExitHandler) this.onExitHandler = options.onExitHandler;
            if (options.predicate) this.predicate = options.predicate;
        }
        positions.map((position, id) => {
            const colshape = mp.colshapes.newSphere(position.x, position.y, position.z+1, this.radius, this.dimension);
            colshape.handleClass = this

            if(this.type !== -1) {
                this.createMarker(position);
            }

            this.colshapes.push(colshape);
        })
    }

    protected createMarker(position: Vector3Mp): void {
        throw new Error(`shared/checkpoints.ts called abstract methods (${this.createMarker.name})`);
    }

    protected deleteMarker() {
        throw new Error(`shared/checkpoints.ts called abstract methods (${this.deleteMarker.name})`);
    }

    recreate() {

        if (!this.created) return;

        this.positionData.forEach(p => {
            if (this.type !== -1) {
                this.createMarker(p);
            }
        });

        this.colshapes.map((colshape, index) => {
            if(mp.colshapes.exists(colshape)){
                if (!mp.players.local) {
                    mp.players.toArray().filter(target => target.colshape == colshape).map(target => {
                        mp.events.call('playerExitColshape', target, colshape)
                    })
                } else {
                    mp.events.call('playerExitColshape', colshape)
                } 
                colshape.position = new mp.Vector3(this.position[index].x, this.position[index].y, this.position[index].z + 1);
                colshape.dimension = this.dimension;
            }
        })

    }
    get exists(){
        return this.created
    }
    public destroy() {

        if (!this.created) return;

        this.deleteMarker();

        this.colshapes.map((colshape, index) => {
            if (mp.colshapes.exists(colshape)) {
                if (!mp.players.local) {
                    mp.players.toArray().filter(target => target.colshape == colshape).map(target => {
                        mp.events.call('playerExitColshape', target, colshape)
                    })
                } else {
                    mp.events.call('playerExitColshape', colshape)
                }
                colshape.destroy();
            }
        })

        this.created = false;

        if (this.onDestroyHandler)
            this.onDestroyHandler();
        super.destroy();
    }

    public handleEnable(player: PlayerMp, ids: any[]) {
        throw new Error('Called an abstract method');
    }

    public handleDisable(player: PlayerMp, ids: any[]) {
        throw new Error('Called an abstract method');
    }

    public handleUpdate(player: PlayerMp): { id: any, action: UpdateAction } {
        throw new Error('Called an abstract method');
    }

    public getDto() : ColshapeMarkerDto {
        return {
            s: this.drawStaticName,
            n: typeof this.message === "string" ? this.message : null,
            t: this.type as number,
            p: this.position,
            r: this.radius,
            c: this.color,
            d: this.dimension,
            id: this.id
        }
    }
}