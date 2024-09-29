import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AccountEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Мой промокод, если я медиа */
    @Column({ type: "varchar",length: 100, default: null})
    promocode_my: string;
    /** Какую награду я сейчас должен получить */
    @Column({ type: "int", default: 0})
    promocode_my_reward: number;
    /** Возможность создать семью бесплатно */
    @Column({ type: "int", default: 0})
    freeFamily: number;
    /** Введённый промокод */
    @Column({ type: "varchar", length: 100, default: null})
    promocode: string;
    /** E-Mail учётной записи */
    @Column({ type: "varchar",length: 100})
    email: string;
    /** SocialClub Name */
    @Column({ type: "varchar",length: 100})
    social_name: string;
    /** SocialClub ID */
    @Column({ type: "varchar",length: 100})
    social_id: string;
    /** SocialClub ID, полученый от клиента нативкой */
    @Column({ type: "varchar",length: 100})
    social_id_real: string;
    /** SocialClub Name при регистрации */
    @Column({ type: "varchar",length: 100})
    social_name_register: string;
    /** SocialClub ID при регистрации */
    @Column({ type: "varchar",length: 100})
    social_id_register: string;
    /** SocialClub ID, полученый от клиента нативкой при регистрации */
    @Column({ type: "varchar",length: 100})
    social_id_real_register: string;
    /** IP */
    @Column({ type: "varchar", length: 100})
    ip: string;
    /** IP Во время регистрации */
    @Column({ type: "varchar", length: 100})
    ip_register: string;
    /** Железо устройства */
    @Column({ type: "varchar", length: 200})
    hash: string;
    /** Железо устройства при регистрации */
    @Column({ type: "varchar", length: 200})
    hash_register: string;
    @Column({ type: "varchar", length: 100})
    login: string;
    @Column({ type: "varchar", length: 400})
    password: string;
    /** Сумма донат валюты */
    @Column({ default: 0 })
    donate:number;


    /** Время истечение бана */
    @Column({ type: 'int', default: 0 })
    ban_end: number;
    /** Админ, который выдал бан */
    @Column({ type: 'int', default: 0 })
    ban_admin: number;
    /** Время истечение бана */
    @Column({ type: "varchar", length: 500, nullable: true })
    ban_reason: string;

    /** Отметка о получении купона на ТС */
    @Column({ default: 0 })
    playtimecar:0|1;

    @Column({type: "boolean", nullable: false, default: false})
    media: boolean;
    get isMedia(): boolean {
        return this.media;
    }
    set isMedia(value) {
        this.media = value;
    }

    @Column({default: 0})
    lucky_wheel: number;
}