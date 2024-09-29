import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FamilyEntity extends BaseEntity {

  /** ID семьи */
  @PrimaryGeneratedColumn()
  id: number;
    
  /** Название семьи */
  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  /** Очки семьи */
  @Column({ type: "int", default: 0 })
  points: number;

  /** Сезонные очки семьи */
  @Column({ type: "int", default: 0 })
  seasonPoints: number;

  /** Килограмм груза */
  @Column({ type: "int", default: 0 })
  cargo: number;
  /** Количество денег */
  @Column({ type: "int", default: 0 })
  money: number;

  /** Количество коинов */
  @Column({ type: "int", default: 0 })
  donate: number;

  /** Уровень семьи */
  @Column({ type: "int", default: 1 })
  level: number;

  /** Уровень семьи */
  @Column({ type: "int", default: 0 })
  wins: number;

  @Column({ type: "varchar", length:200, default:'{}'})
  upgrades: string;

  @Column({ type: "varchar", length:200, default:'{}'})
    contracts: string;

  @Column({ type: "varchar", length:1024, default:'[{"id":1,"name":"Участник","rules":[],"isPermament":true},{"id":2,"name":"Помощник","rules":[]},{"id":3,"name":"Заместитель","rules":[4,3,5],"isSoOwner":true},{"id":4,"name":"Владелец","rules":[1,2,3,4,5],"isOwner":true}]'})
  ranks: string;

  @Column({ type: "varchar", length: 500, default: '' })
  biography: string;

  @Column({ type: "smallint", default: 0 })
  reputation_type: number;
    
    // /** ID зоны */
    // @Column({ type: "int", default: 0 })
    // zone: number;
    // /** Владелец зоны (фракция) */
    // @Column({ type: "int", default: 0 })
    // owner: number;
}