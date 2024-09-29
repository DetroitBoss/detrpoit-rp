import {CustomEvent} from "../custom.event";
import {
    ACHIEVEMENT_LIST,
    ACHIEVEMENT_TEMP_LIST,
    AchievementItemBiz,
    AchievementItemDocument,
    AchievementItemJob,
    AchievementItemLicense,
    AchievementItemMove,
    AchievementItemUse,
    DEFAULT_USER_ACHIEV,
    getAchievConfig,
    getTempAchievConfig,
    UserAchievmentItem,
    UserAchievmentKey
} from "../../../shared/achievements";
import {UserAddonClass} from "./master";
import {system} from "../system";
import {NoSQLbase} from "../nosql";
import {User} from "../user";
import {SocketSyncWeb} from "../socket.sync.web";
import {BUSINESS_TYPE} from "../../../shared/business";
import {LicenceType} from "../../../shared/licence";
import {OWNER_TYPES} from "../../../shared/inventory";
import {JobId} from "../../../shared/jobs";
import {FamilyContractList} from "../../../shared/family";

CustomEvent.registerCef('achieveD', (player, key: UserAchievmentKey) => {
    const user = player.user;
    if(!user) return;
    user.achiev.setTempAchievComplete(key)
})

CustomEvent.registerCef('achieve', (player, key: UserAchievmentKey) => {
    const user = player.user;
    if(!user) return;
    user.achiev.setAchievComplete(key)
})

export class UserAchiev extends UserAddonClass {
    get myAchiev(){
        return this.entity.achievements
    }
    getCurrentAchievData(key: UserAchievmentKey): UserAchievmentItem {
        return this.entity.achievements[key];
    }
    setCurrentAchievData(key: UserAchievmentKey, val: UserAchievmentItem){
        const old = {...this.entity.achievements}
        old[key] = val;
        this.entity.achievements = old;
        SocketSyncWeb.fireTarget(this.player, 'achiev', JSON.stringify([this.getTempAchievDataBlock(), this.entity.achievements]));
    }
    getTempAchievDataBlockIndex() {
        let q = daylyAchiev.data.findIndex(q => q.id === this.id);
        if(q == -1) {
            let s:any = {id: this.id}
            this.myCurrentTodayAchieve.map(z => {s[z] = DEFAULT_USER_ACHIEV})
            daylyAchiev.data.push(s)
            q = daylyAchiev.data.findIndex(q => q.id === this.id);
        }
        return q
    }
    getTempAchievDataBlock() {
        return daylyAchiev.data[this.getTempAchievDataBlockIndex()]
    }
    getTempAchievData(key: UserAchievmentKey) {
        return this.getTempAchievDataBlock()[key];
    }
    setTempAchievData(key: UserAchievmentKey, val: UserAchievmentItem){
        let old = {...this.getTempAchievDataBlock()}
        old[key] = val;
        let s = [...daylyAchiev.data]
        s[this.getTempAchievDataBlockIndex()] = old;
        daylyAchiev.data = s;
        SocketSyncWeb.fireTarget(this.player, 'achiev', JSON.stringify([this.getTempAchievDataBlock(), this.entity.achievements]));
    }

    private setTempAchievTick(key: UserAchievmentKey, count = 1){
        const cfg = getTempAchievConfig(key);
        if(!cfg) return;
        let data:typeof DEFAULT_USER_ACHIEV = [...this.getTempAchievData(key)];
        if(!data) data = DEFAULT_USER_ACHIEV;
        else if(data[0] > cfg.max || data[1]) return;
        data[0] = Math.min(data[0] + count, cfg.max);
        if(data[0] === cfg.max) {
            data[1] = 1;
            this.achievTempTickByType('achieveComplete')
        }
        this.setTempAchievData(key, data);
    }

    private setAchievTick(key: UserAchievmentKey, count = 1){
        const cfg = getAchievConfig(key);
        if(!cfg) return;
        let data = this.getCurrentAchievData(key);
        if(!data) data = DEFAULT_USER_ACHIEV;
        else if(data[0] >= cfg.max || data[1]) return;
        data[0] = Math.min(data[0] + count, cfg.max);
        if(data[0] === cfg.max) {
            data[1] = 1;
            this.setCurrentAchievData(key, data);
            this.achievMainTickByType('achieveComplete')
        } else {
            this.setCurrentAchievData(key, data);
        }
    }


    private achievMainTickByType(type: typeof ACHIEVEMENT_LIST[number]['type'], count = 1){
        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key);
            if(cfg && cfg.type === type) this.setAchievTick(key, count);
        })
    }

    private achievTempTickByType(type: typeof ACHIEVEMENT_LIST[number]['type'], count = 1){
        this.myCurrentTodayAchieve.map(key => {
            const cfg = getTempAchievConfig(key);
            if(cfg && cfg.type === type) this.setTempAchievTick(key, count);
        })
    }

    public setAchievTickBiz(type: BUSINESS_TYPE, subtype: number, count = 1){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemBiz;
            if(cfg && cfg.type === 'buyShopSum' && (!cfg.typeBiz || cfg.typeBiz === type) && (!cfg.subtypeBiz || cfg.subtypeBiz === subtype)) this.setTempAchievTick(key, count);
        })

        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemBiz;
            if(cfg && cfg.type === 'buyShopSum' && (!cfg.typeBiz || cfg.typeBiz === type) && (!cfg.subtypeBiz || cfg.subtypeBiz === subtype)) this.setAchievTick(key, count);
        })
    }

    public achievTickItem(item_id: number, count = 1){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemUse;
            if(cfg && cfg.type === 'useItem' && (!cfg.item_id || cfg.item_id.includes(item_id))) this.setTempAchievTick(key, count);
        })
        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemUse;
            if(cfg && cfg.type === 'useItem' && (!cfg.item_id || cfg.item_id.includes(item_id))) this.setAchievTick(key, count);
        })
    }

    public achievTickJob(type: typeof ACHIEVEMENT_LIST[number]['type'], job: JobId, count = 1){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemJob;
            if(cfg && ['jobmoney', 'jobexp'].includes(cfg.type) && (!cfg.jobId || cfg.jobId.includes(job))) this.setTempAchievTick(key, count);
        })

        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemJob;
            if(cfg && ['jobmoney', 'jobexp'].includes(cfg.type) && (!cfg.jobId || cfg.jobId.includes(job))) this.setAchievTick(key, count);
        })

        if(this.user.familyId) {
            let familyAchieveID = -1
            if(type == 'jobmoney' && job == 'garden') familyAchieveID = FamilyContractList.garders
            if(type == 'jobmoney' && job == 'marihuana') familyAchieveID = FamilyContractList.helpers
            if(type == 'jobmoney' && job == 'cleaning') familyAchieveID = FamilyContractList.cleaners

            if(familyAchieveID != -1) this.user.family.addContractValueIfExists(familyAchieveID, count)
        }
    }

    public achievTickItemOwner(owner_type?: OWNER_TYPES){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemMove;
            if(cfg && cfg.type === 'itemMove' && (!cfg.owner_types || cfg.owner_types.includes(owner_type))) this.setTempAchievTick(key, 1);
        })

        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemMove;
            if(cfg && cfg.type === 'itemMove' && (!cfg.owner_types || cfg.owner_types.includes(owner_type))) this.setAchievTick(key, 1);
        })
    }

    public achievTickLicense(license: LicenceType){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemLicense;
            if(cfg && cfg.type === 'giveLicense' && (!cfg.license || cfg.license.includes(license))) this.setTempAchievTick(key, 1);
        })

        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemLicense;
            if(cfg && cfg.type === 'giveLicense' && (!cfg.license || cfg.license.includes(license))) this.setAchievTick(key, 1);
        })
    }

    public achievTickDocument(document: string){
        this.myCurrentTodayAchieve.map((key: UserAchievmentKey) => {
            const cfg = getTempAchievConfig(key) as AchievementItemDocument;
            if(cfg && cfg.type === 'giveDocument' && (!cfg.document || cfg.document.includes(document))) this.setTempAchievTick(key, 1);
        })

        Object.keys(this.myAchiev).map((key: UserAchievmentKey) => {
            const cfg = getAchievConfig(key) as AchievementItemDocument;
            if(cfg && cfg.type === 'giveDocument' && (!cfg.document || cfg.document.includes(document))) this.setAchievTick(key, 1);
        })
    }

    public achievTickByType(type: typeof ACHIEVEMENT_LIST[number]['type'], count = 1){
        this.achievTempTickByType(type, count)
        this.achievMainTickByType(type, count)

        if(this.user.familyId) {
            let familyAchieveID = -1
            if(type == 'deliverCount') familyAchieveID = FamilyContractList.delivers
            if(type == 'taxiDriverCount') familyAchieveID = FamilyContractList.taxists
            if(type == 'flatCount') familyAchieveID = FamilyContractList.builders
            if(type == 'fishCount') familyAchieveID = FamilyContractList.fishers
            if(type == 'driftPoints') familyAchieveID = FamilyContractList.drifters

            if(familyAchieveID != -1) this.user.family.addContractValueIfExists(familyAchieveID, count)
        }
    }

    setTempAchievComplete(key: UserAchievmentKey){
        const cfg = getTempAchievConfig(key);
        if(!cfg) return;
        let data:[number, number] = [...this.getTempAchievData(key)];
        if(!data) return;
        else if(data[1] != 1) return;
        data[1] = 2;
        const reward = cfg.reward
        if(reward){
            if(reward.exp) this.user.giveExp(reward.exp)
            if(reward.money) this.user.addMoney(reward.money, true, 'Награда за достижение');
            if(reward.item) reward.item.map(item => this.user.giveItem(item, false))
        }
        this.setTempAchievData(key, data);
    }

    setAchievComplete(key: UserAchievmentKey){
        const cfg = getAchievConfig(key);
        if(!cfg) return;
        let data:[number, number] = [...this.getCurrentAchievData(key)];
        if(!data) return;
        else if(data[1] != 1) return;
        data[1] = 2;
        const reward = cfg.reward
        if(reward){
            if(reward.exp) this.user.giveExp(reward.exp)
            if(reward.money) this.user.addMoney(reward.money, true, 'Награда за достижение');
            if(reward.item) reward.item.map(item => this.user.giveItem(item, false))
        }
        this.setCurrentAchievData(key, data);
    }

    setAchievSuccess(key: UserAchievmentKey){
        const cfg = getAchievConfig(key);
        if(!cfg) return;
        let data = this.getCurrentAchievData(key);
        if(!data) return;
        else if(data[1] !== 1) return;
        data[1] = 1;
        this.setCurrentAchievData(key, data);
    }
    get myCurrentTodayAchieve(){
        if(!todayUserAchieve.has(this.id)) todayUserAchieve.set(this.id, [
            system.randomArrayElement(ACHIEVEMENT_TEMP_LIST),
            system.randomArrayElement(ACHIEVEMENT_TEMP_LIST),
            system.randomArrayElement(ACHIEVEMENT_TEMP_LIST),
        ].map(q => q.key))
        return todayUserAchieve.get(this.id)
    }

    constructor(user: User) {
        super(user);
        this.user.afterLoginEvents.push(() => {
            [...ACHIEVEMENT_LIST, ...this.myCurrentTodayAchieve.map(q => {return{key: q}})].map(item => this.setAchievTick(item.key, 0))
        })
    }
}

const todayUserAchieve = new Map<number, UserAchievmentKey[]>();



type daylyAchiev = {id: number} & {
    [param in UserAchievmentKey]?: [number, number]
}

export let daylyAchiev = new NoSQLbase<daylyAchiev>();
