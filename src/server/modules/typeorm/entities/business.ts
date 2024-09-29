import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {UserEntity} from "./user";
import {business} from "../../business";
import {BUSINESS_TYPE} from "../../../../shared/business";
import {BANK_TAX, BUSINESS_MAX_TAX_DAYS_DEFAULT} from "../../../../shared/economy";
import {getVipConfig} from "../../../../shared/vip";

@Entity()
export class BusinessEntity extends BaseEntity {
    /** Уникальный ID */
    @PrimaryGeneratedColumn()
    id: number;
    /** Название бизнеса */
    @Column({ type: "varchar", length: 100 })
    name: string;

    /** Семья, которая контроллирует бизнес */
    @Column({ type: "int", default: 0 })
    mafiaOwner: number
    
    /** Тип бизнеса */
    @Column({ type: "int", default: 0 })
    type: BUSINESS_TYPE;
    /** ПодТип бизнеса */
    @Column({ type: "int", default: 0 })
    sub_type:number;

    /** Измерение бизнеса */
    @Column({ type: "int", default: 0 })
    dimension:number;

    @ManyToOne(type => UserEntity, { eager: true })
    @JoinColumn()
    user: UserEntity;

    @RelationId((post: BusinessEntity) => post.user) // you need to specify target relation
    userId: number;

    /** Баланс бизнеса */
    @Column({ type: "int", default: 0 })
    money: number
    /** Резерный баланс бизнеса, для операций, которые могут отменится. */
    @Column({ type: "int", default: 0 })
    reserve_money: number

    /** Неоплаченный налог */
    @Column({ type: "int", default: 0 })
    tax: number;


    get taxDay(){
        return (this.price / 100) * BANK_TAX.DAY_TAX_PERCENT
    }

    get taxMax(){
        const maxDays = getVipConfig(this.user?.vip)?.taxPropertyMaxDays ?? BUSINESS_MAX_TAX_DAYS_DEFAULT;
        return this.taxDay * maxDays;
    }

    /** Стоимость покупки */
    @Column({ type: "int", default: 0 })
    price: number;

    /** Уровень бизнеса */
    @Column({ type: "int", default: 0 })
    upgrade: number;


    /** Первый кастомный параметр */
    @Column({ type: "int", default: 0 })
    param1: number;


    /** Данный магазин для доната */
    @Column({ type: "int", default: 0 })
    donate: number;

    /** Максимальный доступный множитель цены */
    @Column({ type: "int", default: 2 })
    multiple_price: number;
    /** Максимальный доход в сутки */
    @Column({ type: "int", default: 0 })
    max_per_day: number;

    /** Доход за текущий день */
    current_day = 0;

    /** Стоимость покупки */
    @Column({ type: "varchar", length: 2048, default: "[]" })
    private positions_data: string;

    get positions(): { x: number, y: number, z: number, h?: number }[] {
        return JSON.parse(this.positions_data)
    }
    set positions(val: { x: number, y: number, z: number, h?:number }[]) {
        this.positions_data =  JSON.stringify(val);
    }
    
    /** ID обслуживающего банка */
    @Column({ type: "int", default: 0 })
    bankId: number;

    get bank() {
        if (!this.bankId) return null;
        return business.get(this.bankId);
    }
    set bank(val: BusinessEntity) {
        if(!val) this.bankId = 0;
        this.bankId = val.id;
    }


    /** Каталог товаров */
    @Column({ type: "text" })
    private catalog_data: string;

    get catalog(): { item: number, price: number, count: number, max_count: number }[] {
        const data = JSON.parse(this.catalog_data || "[]") as { item: number, price: number, count: number, max_count: number, i: number, p: number, c: number, m: number }[];
        data.map(item => {
            item.item = item.item || item.i;
            item.price = item.price || item.p;
            item.count = item.count || item.c;
            item.max_count = item.max_count || item.m;
            delete item.i;
            delete item.p;
            delete item.c;
            delete item.m;
        })
        return data;
    }
    set catalog(val) {
        val.map((q:any) => {
            q.i = q.item;
            q.p = q.price;
            q.c = q.count;
            q.m = q.max_count;
            delete q.item;
            delete q.price;
            delete q.count;
            delete q.max_count;
        })
        this.catalog_data = JSON.stringify(val);
    }


    setItemPrice(id:number, price: number){
        let data = [...this.catalog];
        data[id].price = price;
        this.catalog = data;
    }
    setItemCount(id:number, count: number){
        let data = [...this.catalog];
        data[id].count = count;
        this.catalog = data;
    }
    removeItemCount(id:number, count: number){
        let data = [...this.catalog];
        data[id].count = Math.max(0, data[id].count - count);
        this.catalog = data;
    }
    setItemMaxCount(id:number, count: number){
        let data = [...this.catalog];
        data[id].max_count = count;
        this.catalog = data;
    }
    addItemCount(id:number, count: number){
        let data = [...this.catalog];
        data[id].count += count;
        this.catalog = data;
    }
    addItemCountByItemId(id:number, count: number){
        let index = this.catalog.findIndex(q => q.item === id);
        this.addItemCount(index, count);
    }
    setItemPriceByItemId(id:number, price: number){
        let index = this.catalog.findIndex(q => q.item === id);
        this.setItemPrice(index, price);
    }
    setItemCountByItemId(id:number, count: number){
        let index = this.catalog.findIndex(q => q.item === id);
        this.setItemCount(index, count);
    }
    removeItemCountByItemId(id:number, count: number){
        let index = this.catalog.findIndex(q => q.item === id);
        if(index == -1) return;
        this.setItemCount(index, this.catalog[index].count - count);
    }

    /** Отметить для сохранения */
    mark_for_save = false;
}



@Entity()
export class BusinessHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024 })
    text: string;

    /** Тип операции */
    @Column({ type: "varchar", length: 30 })
    type: "add" | "remove";
    
    /** Сумма операции */
    @Column()
    sum: number;

    /** Кому лог принадлежит */
    @ManyToOne(type => BusinessEntity, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn()
    business: BusinessEntity;
    @RelationId((post: BusinessHistoryEntity) => post.business) // you need to specify target relation
    businessId: number;


    /** Время лога в формате UNIX TIMESTAMP */
    @Column({type: "int", default: 0})
    time: number;
}