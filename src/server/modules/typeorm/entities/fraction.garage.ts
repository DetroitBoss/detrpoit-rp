import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FractionGarageEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Название */
    @Column({ type: "varchar", length: 1024 })
    name: string;
    /** Префикс */
    @Column({ type: "varchar", length: 1024, nullable: true })
    prefix: string;
    @Column({type: 'float'})
    x: number;
    @Column({ type: 'float' })
    y: number;
    @Column({ type: 'float' })
    z: number;
    @Column()
    d: number;
    @Column()
    h: number;
    @Column()
    fraction: number;
    @Column({default: 0})
    closed: number;
    
    /** Каталог */
    @Column({ type: "text" })
    private cars_data: string;

    /** Каталог ТС */
    get cars(): [string, string, number, number, number, number, number, number, number, number, number][]{
        return JSON.parse(this.cars_data);
    }
    set cars(val){
        this.cars_data = JSON.stringify(val);
    }

}