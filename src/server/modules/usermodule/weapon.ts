import {UserAddonClass} from "./master";
import {User} from "../user";
import {QUESTS_DATA, TaskJobFarm} from "../../../shared/quests";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import { quests } from "../quest";
import {LicenceType} from "../../../shared/licence";
import {
    getWeaponAddonKeyByItemId,
    inventoryShared,
    InventoryWeaponPlayerData, ITEM_TYPE,
    OWNER_TYPES, WeaponAddonsItem
} from "../../../shared/inventory";
import {inventory} from "../inventory";
import {ItemEntity} from "../typeorm/entities/inventory";
import {WEAPON_ATTACH_LIST} from "../../../shared/attach.system";
export class UserWeapon extends UserAddonClass {
    public currentWeaponData: InventoryWeaponPlayerData;
    lastWeaponSyncData: string;


    private updateAttachInventoryBlock = false
    inventoryAttachSync = () => {
        if(this.updateAttachInventoryBlock) return;
        this.updateAttachInventoryBlock = true;
        setTimeout(() => {
            this.updateAttachInventoryBlock = false;
            if(!this.exists) return;
            if(!this.mp_character){
                if(this.attachList.length > 0) this.attachList = [];
                return;
            }
            inventoryShared.itemsHand.map(cfg => {
                if(this.user.hasAttachment(`item_${cfg.item_id}`) && !this.haveItem(cfg.item_id)) this.user.removeAttachment(`item_${cfg.item_id}`);
            })

            const currentWeapon = this.currentWeapon
            const attachIdsCfg = inventoryShared.itemsAttachBody
            let items: [number, number][] = [];
            this.inventory.filter(q => !currentWeapon || q.item_id !== currentWeapon.item_id).filter(q => attachIdsCfg.find(s => s.item_id === q.item_id)).map(item => {
                if(!items.find(q => q[0] === item.item_id)) items.push([item.item_id, item.id]);
            });

            let weaponAttaches: (string | [string, ...number[]])[] = [];

            for(let types in WEAPON_ATTACH_LIST){
                let type = types as keyof typeof WEAPON_ATTACH_LIST
                let max = WEAPON_ATTACH_LIST[type].length
                let count = 0;
                items.map(([id, dbid]) => {
                    if(count < max){
                        const cfg = attachIdsCfg.find(q => q.item_id === id && q.attachBody === type);
                        if(cfg) {
                            let p:(string | [string, ...number[]]) = `${type}_${id}_${count}`;
                            if(cfg.type === ITEM_TYPE.WEAPON){
                                const wcfg = inventoryShared.getWeaponConfigByItemId(cfg.item_id)
                                if(wcfg.addons){
                                    const data = inventory.getInventory(OWNER_TYPES.WEAPON_MODS, dbid)
                                    if(data && data.length > 0){
                                        let s: number[] = [];
                                        data.map(z => {
                                            const g = getWeaponAddonKeyByItemId(id, z.item_id)
                                            if (g) {
                                                s.push(mp.joaat(wcfg.addons[g]?.hash))
                                                if (wcfg.addons[g]?.hash.includes('WEAPON_TINT'))
                                                    s.push(Number.parseInt(wcfg.addons[g]?.hash.replace('WEAPON_TINT', '')))
                                            }
                                            
                                        })
                                        p = [p, ...s]
                                    }
                                }
                            }
                            weaponAttaches.push(p)
                            count++;
                        }
                    }
                })
            }

            let myOld = [...this.attachList]

            let newList:(string|[string, ...number[]])[] = [];
            let s = Object.keys(WEAPON_ATTACH_LIST).map(q => `${q}_`)
            myOld.map(item => {
                let weapon = false;
                s.map(z => {
                    if(typeof item === "string" && item.indexOf(z) === 0) weapon = true;
                    if(typeof item !== "string" && item[0].indexOf(z) === 0) weapon = true;
                })
                if(!weapon) newList.push(item);
            })

            newList.push(...weaponAttaches);
            this.attachList = [...newList];
            this.sync_bag()


        }, 200)
    }

    currentWeaponSync = () => {
        setTimeout(() => {
            this.inventoryAttachSync()
            if (!this.currentWeaponData) {
                if (this.lastWeaponSyncData) {
                    this.lastWeaponSyncData = null;
                    CustomEvent.triggerClient(this.player, 'weaponInHand', null);
                }
                return
            }
            let conf = inventoryShared.getWeaponConfigByItemId(this.currentWeaponData.item_id);
            if (!conf) {
                if (this.lastWeaponSyncData) {
                    this.lastWeaponSyncData = null;
                    CustomEvent.triggerClient(this.player, 'weaponInHand', null);
                }
                return
            }
            let data = {
                hash: mp.joaat(conf.hash),
                magazines: this.getArrayItem(conf.ammo_box).map(q => q.count),
                weapon: conf.weapon,
                maxMagazine: conf.ammo_max
            };
            if (JSON.stringify(data) === this.lastWeaponSyncData) return;
            this.lastWeaponSyncData = JSON.stringify(data);
            CustomEvent.triggerClient(this.player, 'weaponInHand', data)
        }, 100)
    }
    reloadCurrentWeapon = async (auto = true)=> {
        if(!this.exists) return;
        let currentWeapon = this.currentWeapon;
        if (!currentWeapon) {
            if(!auto) this.player.notify('У вас не экипировано оружие', "error");
            return
        }
        let conf = inventoryShared.getWeaponConfigByItemId(currentWeapon.item_id);
        if(!conf) return;
        let item: ItemEntity;
        const max = conf.ammo_max;
        const need = max - currentWeapon.ammo
        if(need <= 0) {
            //if(!auto) this.player.notify("Полный магазин", 'error');
            return;
        }
        await this.unloadAmmo();
        this.allMyItems.map(inv => {
            if (inv.item_id != conf.ammo_box) return;
            if (!inv.count) return;
            if (!item) return item = inv;
            if (item.count < inv.count) item = inv;
        })
        if (!item) {
            if(!auto) this.player.notify(`У вас нет подходящих патронов`, 'error')
            return
        }
        const useCount = Math.min(max, item.count);
        if(useCount <= 0) {
            if(!auto) this.player.notify("У вас нет подходящих патронов", 'error');
            return
        }
        item.useCount(useCount, this.player);
        this.setCurrentWeaponAmmo(useCount);
        //if(!auto) this.player.notify(`Использовано ${useCount} патронов`, 'success');
    }

    syncAddonsWeapon = ()=> {
        if(!this.exists) return;
        const param = this.currentWeapon;
        if(!param) return;
        let conf = inventoryShared.getWeaponConfigByItemId(param.item_id);
        if(!conf) return;
        const addons = inventory.getInventory(OWNER_TYPES.WEAPON_MODS, param.id).map(item => item.item_id).filter(item => getWeaponAddonKeyByItemId(conf.weapon, item)).map(item => getWeaponAddonKeyByItemId(conf.weapon, item))
        if(this.player.getVariable('currentWeaponAddons') || addons) this.player.setVariable('currentWeaponAddons', addons && addons.length > 0 ? [conf.hash, addons] : null)
    }

    get currentWeapon(): InventoryWeaponPlayerData {
        if (!this.currentWeaponData) return null;
        let conf = inventoryShared.getWeaponConfigByItemId(this.currentWeaponData.item_id);
        if (!conf) return null;
        let ammo = this.exists ? this.player.getWeaponAmmo(mp.joaat(conf.hash)) : this.currentWeaponData.ammo;
        if(ammo == 65535) ammo = 0;
        return {
            ...this.currentWeaponData,
            ammo,
            max_ammo: conf.ammo_max
        }
    }

    set currentWeapon(param: InventoryWeaponPlayerData) {
        if (!this.exists) return;
        this.removeCurrentWeapon();
        if (!param) {
            this.currentWeaponSync()
            return;
        }
        let conf = inventoryShared.getWeaponConfigByItemId(param.item_id);
        if (!conf) {
            this.currentWeaponSync();
            return;
        }
        const addons = inventory.getInventory(OWNER_TYPES.WEAPON_MODS, param.id).map(item => item.item_id).filter(item => getWeaponAddonKeyByItemId(conf.weapon, item)).map(item => getWeaponAddonKeyByItemId(conf.weapon, item))
        this.giveWeapon(conf.hash, 0, true, addons)
        this.currentWeaponData = param;
        this.reloadCurrentWeapon();
        this.currentWeaponSync();
    }

    giveWeapon = (weapon: string, ammo: number, equipNow = true, addons?: (keyof WeaponAddonsItem)[])=> {
        if(!this.exists) return;
        this.player.setVariables({currentWeapon: weapon, flashlightWeapon: false})
        this.player.giveWeapon(weapon, ammo, equipNow);
        this.inventoryAttachSync()
        CustomEvent.triggerClient(this.player, 'user:giveWeapon', weapon, ammo, equipNow);
        if(this.player.getVariable('currentWeaponAddons') || addons) this.player.setVariable('currentWeaponAddons', addons && addons.length > 0 ? [weapon, addons] : null)
    }

    removeCurrentWeapon = (dead = false, protect = false) => {
        if (!this.currentWeapon) return;
        let conf = inventoryShared.getWeaponConfigByItemId(this.currentWeapon.item_id);
        if (!conf) return;
        if (dead || this.dead) {
            if(!protect){
                const weaponItem = this.inventory.find(q => q.id === this.currentWeapon.id)
                if (weaponItem) inventory.placeItemOnGround(weaponItem, this.dropPos, this.player.heading, this.player.dimension, false)
            }
        } else {
            this.unloadAmmo();
        }
        if (!this.currentWeapon) return;
        this.currentWeaponData = null;
        if (this.exists) this.removeWeapon()
    }

    removeWeapon = (weapon?:HashOrString)=> {
        if(!this.exists) return;
        this.player.setVariable('currentWeapon', null);
        CustomEvent.triggerClient(this.player, 'user:removeWeapon', weapon)
    }

    unloadAmmo = async () => {
        if (!this.currentWeapon) return;
        if(this.currentWeapon.unloaded) return;
        let conf = inventoryShared.getWeaponConfigByItemId(this.currentWeapon.item_id);
        if (!conf) return;
        const ammo = this.currentWeapon.max_ammo ? Math.min(this.currentWeapon.ammo, this.currentWeapon.max_ammo) : 0
        if(ammo){
            inventory.createItem({
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: this.id,
                item_id: conf.ammo_box,
                count: ammo,
                temp: 0
            });
        }

        this.currentWeaponData = {...this.currentWeaponData, unloaded: true}
        this.setCurrentWeaponAmmo(0);
        this.currentWeaponSync();
    }

    setCurrentWeaponAmmo = (ammo: number) => {
        if (!this.exists) return;
        if (!this.currentWeapon) return;
        let conf = inventoryShared.getWeaponConfigByItemId(this.currentWeapon.item_id);
        if (!conf) return;
        if(ammo) this.currentWeaponData = {...this.currentWeaponData, unloaded: false}
        this.player.giveWeapon(mp.joaat(conf.hash), ammo, true)
        this.player.setWeaponAmmo(mp.joaat(conf.hash), ammo)
    }

    constructor(user: User) {
        super(user);
    }
}

