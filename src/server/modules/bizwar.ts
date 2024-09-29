import {BusinessEntity} from "./typeorm/entities/business";
import {Family} from "./families/family";
import {system} from "./system";
import {DeathMath} from "./deadmatch";
import {User} from "./user";
import {CustomEvent} from "./custom.event";
import {
    ATTACKS_DAILY_LIMIT,
    BIZWAR_EXIT_TIMEOUT_MINUTES,
    BIZWAR_POINTS,
    BIZWAR_PREPARATION_TIME, BIZWAR_TIME, COOLDOWN_BEETWEN_BIZWARS, DEFENSES_DAILY_LIMIT,
    DIFFERENCE_BETWEEN_TEAMS_LIMIT,
    IBizWarPoint
} from "../../shared/bizwar";
import {gui} from "./gui";
import {UserEntity} from "./typeorm/entities/user";
import {MenuClass} from "./menu";
import {fraction, fractionCfg} from "./fractions/main";
import {FRACTION_RIGHTS} from "../../shared/fractions/ranks";
import {BUSINESS_SUBTYPE_NAMES} from "../../shared/business";

export enum WAR_STAGE {
    PREPARATION,
    WAR
}

export class BizWar {
    public static currentBizWars: BizWar[] = [];
    
    private _preparationStartedTime: number;
    private _preparationTimeout: number;
    private _currentStage: WAR_STAGE;
    
    // (Id фракции, кол-во атак)
    public static attacks: Map<number, number> = new Map<number, number>()   
    public static defences: Map<number, number> = new Map<number, number>()   
    
    constructor(
        public readonly business: BusinessEntity,
        public readonly pretender: number,
        private readonly _battlePoint: IBizWarPoint,
    ) {
        this.startPreparation();
    }
    
    private canPlayerJoin(user: User): boolean {
        return this._currentStage == WAR_STAGE.PREPARATION && (user.fraction == this.business.mafiaOwner || user.fraction == this.pretender)
            && user.hasPermission('fraction:bizwar:join')
    }
    
    private getDefendersCount(): number {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && p.user.fraction === this.business.mafiaOwner
                && p.user.hasPermission('fraction:bizwar:join') && system.distanceToPos2D(p.position, this._battlePoint) <= this._battlePoint.r).length;
    }
    
    private getAttackersCount(): number {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && p.user.fraction === this.pretender
                && p.user.hasPermission('fraction:bizwar:join') && system.distanceToPos2D(p.position, this._battlePoint) <= this._battlePoint.r).length;
    }
    
    private getMembers(): PlayerMp[] {
        return mp.players
            .toArray()
            .filter(p => p.user && p.user.fraction && this.canPlayerJoin(p.user));
    }
    
    /** Начать подготовку к бизвару */
    public startPreparation(): void {
        this._currentStage = WAR_STAGE.PREPARATION;
        this._preparationStartedTime = system.timestamp;
        this._battlePoint.busy = true;
        
        this.getMembers().forEach(player => {
            CustomEvent.triggerClient(player, 'family:bizWar:readyStart', `${BUSINESS_SUBTYPE_NAMES[this.business.type][this.business.sub_type]} ${this.business.id}`,
                BIZWAR_PREPARATION_TIME * 60, this._battlePoint);
        })
        
        this._preparationTimeout = setTimeout(() => {
            const attackersCount = this.getAttackersCount();
            const defendersCount = this.getDefendersCount();
            if (Math.max(defendersCount, attackersCount) / Math.min(defendersCount, attackersCount) * 100 <= DIFFERENCE_BETWEEN_TEAMS_LIMIT)
                this.startWar();
            else {
                this._battlePoint.busy = false;
                if (attackersCount > defendersCount) {
                    this.business.mafiaOwner = this.pretender;
                    this.business.save();
                    this.getMembers().forEach(m => m.notify(`${fractionCfg.getFraction(this.pretender)?.name ?? 'Неизвестно'} захватила бизнес ${this.business.name}`))
                }
                BizWar.currentBizWars.splice(BizWar.currentBizWars.indexOf(this), 1);
            }
        }, BIZWAR_PREPARATION_TIME * 60 * 1000)
    }
    
    /** Добавить игрока в подготовку к бизвару */
    public addPlayer(player: PlayerMp): void {
        if (!player.user || !this.canPlayerJoin(player.user)) return;
        CustomEvent.triggerClient(player, 'family:bizWar:readyStart', `${BUSINESS_SUBTYPE_NAMES[this.business.type][this.business.sub_type]} ${this.business.id}`,
            BIZWAR_PREPARATION_TIME * 60 - (system.timestamp - this._preparationStartedTime), this._battlePoint)
    }
    
    private startWar(): void {
        BizWar.attacks.set(this.pretender, (BizWar.attacks.get(this.pretender) ?? 0) + 1)
        BizWar.defences.set(this.business.mafiaOwner, (BizWar.attacks.get(this.business.mafiaOwner) ?? 0) + 1)

        const pos = new mp.Vector3(this._battlePoint.x, this._battlePoint.y, this._battlePoint.z);
        const targets = this.getMembers().filter(member => system.distanceToPos2D(member.position, this._battlePoint) <= this._battlePoint.r);
        
        const team1 = targets.filter(q => q.user.fraction === this.business.mafiaOwner);
        const team2 = targets.filter(q => q.user.fraction === this.pretender);
        const dm = new DeathMath(pos, this._battlePoint.r);
        team1.map(q => dm.insertPlayer(q, 1));
        team2.map(q => dm.insertPlayer(q, 2));
        dm.name = `Война за бизнес ${this.business.name}`;
        dm.team1_name = fractionCfg.getFraction(this.business.mafiaOwner)?.name ?? 'Неизвестно';
        dm.team2_name = fractionCfg.getFraction(this.pretender)?.name ?? 'Неизвестно';
        dm.team1_image = '';
        dm.team2_image = '';
        // dm.team1_start = cfg.opponentPos
        // dm.team2_start = cfg.ownerPos
        dm.exitTimeout = BIZWAR_EXIT_TIMEOUT_MINUTES * 60;
        dm.time = BIZWAR_TIME * 60
        dm.hospital = true;
        dm.wait_freeze = false;
        dm.handler((winner) => {
            winner === 1 ? this.handleWarFinish(this.business.mafiaOwner) : this.handleWarFinish(this.pretender)
        })
        dm.start()
        this._currentStage = WAR_STAGE.WAR;
    }
    
    private handleWarFinish(winner: number): void {
        this._currentStage = WAR_STAGE.PREPARATION;
        this._battlePoint.busy = false;
        if (winner === this.pretender) {
            this.business.mafiaOwner = this.pretender;
            this.business.save();
            this.getMembers().forEach(m => m.notify(`${fractionCfg.getFraction(this.pretender)?.name} завоевала бизнес ${this.business.name}`))
        } 
        else this.getMembers().forEach(m => m.notify(`${fractionCfg.getFraction(this.business.mafiaOwner)?.name} защитила бизнес ${this.business.name}`))
        BizWar.currentBizWars.splice(BizWar.currentBizWars.indexOf(this), 1);
    }
    /** Остановить бизвар */
    public stop(): void {
        if (this._preparationTimeout) clearInterval(this._preparationTimeout);
        
        if (this._currentStage === WAR_STAGE.PREPARATION) {
            this.getMembers().forEach(player => {
                CustomEvent.triggerClient(player, 'family:bizWar:readyStop');
            })
        }
        this._battlePoint.busy = false;
        //todo: дописать логику остановки для начавшегося боя
    }
}

/** Начать войну за бизнес между семьями
 * @param {BusinessEntity} business - Бизнес за который начать войну
 * @param creator - Игрок запускающий бизвар
 * @param forceStart - Запустить войну без проверок на лимиты */
export const startBizWar = (business: BusinessEntity, pretender: User, creator: User, forceStart: boolean = false): void => {
    if (BizWar.currentBizWars.find(b => b.business.id === business.id)) return creator.notify('За этот бизнес уже идет война', 'error');
    if (business.price <= 0) return creator.notify('На данный бизнес нельзя напасть', 'error');
    if (!pretender.fractionData?.mafia) return
    
    const owner = fractionCfg.getFraction(business.mafiaOwner)
    if (!owner) {
        if (BizWar.attacks.has(pretender.fractionData.id) && BizWar.attacks.get(pretender.fractionData.id) >= ATTACKS_DAILY_LIMIT)
            return creator.notify('У вас сегодня больше нет атак', 'error');
        
        business.mafiaOwner = pretender.fractionData.id;
        BizWar.attacks.set(pretender.fractionData.id, (BizWar.attacks.get(pretender.fractionData.id) ?? 0) + 1)
        business.save();
        creator.notify('Вы завоевали бизнес без войны');
        return;
    }
    
    if (owner.id === pretender.fraction) return creator.notify('Вы не можете напасть на свой бизнес', 'error');

    if (BizWar.currentBizWars.find(b => b.pretender == pretender.fraction || b.business.mafiaOwner == pretender.fraction
        || b.pretender == business.mafiaOwner || b.business.mafiaOwner == business.mafiaOwner))
        return creator.notify('Враги уже готовятся к другой битве за бизнес', 'error');
    
    if (canAttack(pretender.fraction) && canDefend(owner.id)) {
        const bizWarPoint = getRandomFreeBizWarPoint();
        if (!bizWarPoint) return creator.notify('Все места для проведения войны заняты', 'error');
        
        BizWar.currentBizWars.push(new BizWar(business, pretender.fraction, bizWarPoint));
    }
    else return creator.notify('Одна из сторон не может начать битву за бизнес', 'error');
}

const canAttack = (fractionId: number) => {
    return !BizWar.attacks.has(fractionId) || (BizWar.attacks.has(fractionId) && BizWar.attacks.get(fractionId) < ATTACKS_DAILY_LIMIT)
}

const canDefend = (fractionId: number) => {
    return !BizWar.defences.has(fractionId) || (BizWar.defences.has(fractionId) && BizWar.defences.get(fractionId) < DEFENSES_DAILY_LIMIT)
}

gui.chat.registerCommand("bizwar", async (player, str) => {
    if (!player.user) return;
    if (!player.user.isAdminNow()) return;
    let id = parseInt(str);
    const business = await BusinessEntity.findOne(id);
    
    startBizWar(business, player.user, player.user, true);
})

const getRandomFreeBizWarPoint = (): IBizWarPoint => {
    return BIZWAR_POINTS.filter(b => !b.busy)[system.getRandomInt(0, BIZWAR_POINTS.length - 1)];
}

/** Добавить пункт с началом бизвара в существующее меню управления бизнесом */
export const createBizMenuBizWarItem = (user: User, menu: MenuClass, biz: BusinessEntity) => {
    if (canUserStartBizWar) {
        menu.newItem({
            name: '~r~Начать войну за бизнес',
            onpress: () => {
                startBizWar(biz, user, user);
            }
        })
    }
}

export const canUserStartBizWar = (user: User) =>
    fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.BIZWAR)