import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {UserEntity} from "./user";
import {IBasicTasksSave, ITaskSave} from "../../../../shared/battlePass/tasks";

@Entity()
export class BattlePassEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", default: 0 })
    exp: number;

    @ManyToOne(type => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: UserEntity;

    @RelationId((entity: BattlePassEntity) => entity.user)
    userId: number;

    @Column({ type: 'varchar', length: 50 })
    battlePassId: string;

    @Column({ type: 'varchar', length: 1024 })
    receivedRewards: string;

    set receiveRewards(arr: number[]) {
        this.receivedRewards = JSON.stringify(arr);
    }

    get receiveRewards() {
        return JSON.parse(this.receivedRewards);
    }

    @Column({ type: 'varchar', length: 512 })
    globalTaskProgress: string;

    get globalTask(): ITaskSave {
        return JSON.parse(this.globalTaskProgress);
    }

    set globalTask(data) {
        this.globalTaskProgress = JSON.stringify(data);
    }

    @Column({ type: 'varchar', length: 1024 })
    basicTasksProgress: string;

    set basicTasks(data) {
        this.basicTasksProgress = JSON.stringify(data);
    }

    get basicTasks(): IBasicTasksSave {
        return JSON.parse(this.basicTasksProgress);
    }

    @Column({ type: "int", default: 0 })
    expReward: number;
}