import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {OWNER_TYPES} from "../../../../shared/inventory";
import {inventory} from "../../inventory";
import {AchievementItemUse, getAchievConfigByType, getTempAchievConfigByType} from "../../../../shared/achievements";
import {colshapeHandle} from "../../checkpoints";


@Entity()
export class ItemEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    item_id: number;
    /** Тип владельца */
    @Column({ type: "int", default: 0 })
    owner_type: OWNER_TYPES;
    /** ID владельца */
    @Column({ type: "int", default: 0 })
    owner_id: number;
    /** Количество единиц */
    @Column({ type: "int", default: 1 })
    count: number;
    /** Дополнительные данные с формате Interger */
    @Column({ type: "int", default: 0 })
    advancedNumber: number;
    /** Дополнительные данные с формате String */
    @Column({ type: "varchar", length: 1024, default: "" })
    advancedString: string;

    
    /** Серийник */
    @Column({ type: "varchar", length: 1024, default: "" })
    serial:string;
    /** JSON строка с дополнительными параметрами */
    @Column({ type: "varchar", length: 1024, default: null})
    extra: string;
    // get extra():{[param:string]:any}{
    //     return JSON.parse(this.extradata);
    // }
    // set extra(value: { [param: string]: any }){
    //     this.extradata = JSON.stringify(value);
    // }


    @Column({ type: "int", default: 0 })
    create: number;
    /**
     * DB insert time.
     */
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    readonly createdAt: Date;

    /**
     * DB last update time.
     */
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    readonly updatedAt: Date;

    useCount(count: number, player?: PlayerMp){
        if(player) {
            player.user.achiev.achievTickItem(this.item_id);
        }
        this.count-=count;
        if(this.count > 0) {
            if(!this.temp) this.save()
        } else inventory.deleteItem(this);
    }

    x: number = 0;
    y: number = 0;
    z: number = 0;
    d: number = 0;
    prop?: ObjectMp;
    colshape?: colshapeHandle;
    dropped_time?:number;


    /** Предмет выдавался на время, и его надо удалить при рестарте сервера если что */
    @Column({ type: "int", default: 0 })
    temp: 0 | 1;
}
