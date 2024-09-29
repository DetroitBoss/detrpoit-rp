import {UserAddonClass} from "./master";
import {User} from "../user";
import {QUESTS_DATA, TaskJobFarm} from "../../../shared/quests";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import { quests } from "../quest";
import {LicenceType} from "../../../shared/licence";
import {OWNER_TYPES} from "../../../shared/inventory";
import {inventory} from "../inventory";
import {
    AchievementItemDocument,
    AchievementItemLicense,
    AchievementItemUse,
    getAchievConfigByType
} from "../../../shared/achievements";
export class UserLicense extends UserAddonClass {

    /** Данные по лицензиям игрока */
    get licenses() {
        return this.entity.licenses || []
    }

    set licenses(val) {
        this.entity.licenses = val;
    }

    /** Проверка на наличие активной лицензии */
    haveActiveLicenseQ = (lic: LicenceType) => {
        return this.licenses.find(q => q[0] === lic && q[1] > system.timestamp);
    }

    /** Проверка на наличие активной лицензии */
    getLicenseQ = (lic: LicenceType) => {
        return this.licenses.find(q => q[0] === lic);
    }

    /** Выдача лицензии на определённый срок в днях */
    giveLicenseQ = (lic: LicenceType, days: number) => {
        const allLic = [...this.licenses];
        const itm = allLic.find(q => q[0] === lic);
        const newTimestamp = system.timestamp + (days * 24 * 60 * 60)
        const newTransaction = system.generateTransaction(3, 3)

        if (itm) itm[1] = newTimestamp, itm[2] = newTransaction
        else allLic.push([lic, newTimestamp, newTransaction]);
        this.licenses = allLic;

        const oldLic = this.getArrayItem(803).filter(q => q.serial && q.serial.indexOf(lic) === 0 && (q.serial + 'qqqqqqq').includes(`-${this.id}qqqqqqq`));
        inventory.deleteItems(...oldLic);
        this.user.achiev.achievTickLicense(lic)
        inventory.createItem({
            item_id: 803,
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: this.id,
            advancedNumber: this.id,
            advancedString: newTransaction,
            serial: `${lic}-${this.user.social_number}-${newTransaction}-${newTimestamp}-${this.id}`
        })
    }

    /** Изъять лицензию у игрока */
    removeLicense = (lic: LicenceType) => {
        const allLic = [...this.licenses];
        const itm = allLic.findIndex(q => q[0] === lic);
        if (itm > -1) allLic.splice(itm, 1)
        this.licenses = allLic;
    }

    giveDocument = (id: string, creator: PlayerMp) => {
        if (!mp.players.exists(creator)) return;
        this.giveDocumentData(id, creator.user.id, creator.user.name, creator.user.social_number, true)
    }

    giveFakeDocument = (id: string, fakeid: string | number, fake_name: string, fake_social_number: string | number) => {
        this.giveDocumentData(id, fakeid, fake_name, fake_social_number, false)
    }

    giveDocumentData = (document: string, id: string | number, name: string, social_number: string | number, real: boolean) => {
        this.user.achiev.achievTickDocument(document)
        let serial = `${document}|${system.timestamp}|${system.generateTransaction(4, 4, '1234567890')}|${this.id}|${this.name}|${this.user.social_number}|${id}|${name}|${social_number}|${real ? "true" : "false"}`;
        inventory.createItem({
            item_id: 802,
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: this.id,
            advancedNumber: this.id,
            advancedString: document,
            serial
        })
    }

    constructor(user: User) {
        super(user);
    }
}

