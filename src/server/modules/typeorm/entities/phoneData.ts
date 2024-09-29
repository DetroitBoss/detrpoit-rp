import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { PhoneSettings, PhoneHistory } from "../../../../shared/phone";

@Entity()
export class PhoneEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** ID предмета в инвентаре */
    @Column()
    phone: number;
    @Column({ type: "varchar", length: 1024, default: JSON.stringify({
        sound: false,
        aviamode: false,
        dark: false,
        big: false,
        background: 'default-wallpaper'
    }) })
    private settings_data: string;

    /** Настройки телефона */
    get settings(): PhoneSettings{
        return JSON.parse(this.settings_data || JSON.stringify({
            sound: false,
            aviamode: false,
            dark: false,
            big: false,
            background: 'default-wallpaper'
        }));
    }
    set settings(val){
        this.settings_data = JSON.stringify(val);
    }

    @Column({ type: "varchar", length: 5024, default: '[]' })
    private contacts_data: string;

    /** Телефонная книга */
    get contacts(): [string, number][]{
        return JSON.parse(this.contacts_data || "[]");
    }
    set contacts(val){
        this.contacts_data = JSON.stringify(val);
    }

    @Column({ type: "varchar", length: 5024, default: '[]' })
    private history_data: string;

    /** Телефонная книга */
    get history(): PhoneHistory[]{
        return JSON.parse(this.history_data || "[]");
    }
    set history(val){
        this.history_data = JSON.stringify(val);
    }

    @Column({ type: "varchar", length: 5024, default: '[]' })
    private blocked_data: string;

    /** Телефонная книга */
    get blocked(): number[]{
        return JSON.parse(this.blocked_data || "[]");
    }
    set blocked(val){
        this.blocked_data = JSON.stringify(val);
    }

}

@Entity()
export class MessagesEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Отправитель */
    @Column()
    sender: number;
    /** Получатель */
    @Column()
    target: number;
    @Column({ type: "varchar", length: 1024 })
    text: string;
    @Column({ type: "varchar", length: 100 })
    time: string;

    @Column({ default: 0 })
    gps_x: number;

    @Column({ default: 0 })
    gps_y: number;

    @Column({ default: 0 })
    read_data: number;

    get read(){
        return !!this.read_data
    }
    set read(val){
        this.read_data = val ? 1 : 0
    }

    @Column()
    timestamp: number;

}

