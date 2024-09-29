import {inventoryShared, ITEM_TYPE} from "../../shared/inventory";
import {user} from "./user";
import {gui, phoneOpened} from "./gui";
import {CustomEvent} from "./custom.event";
import {WEAPON_ATTACH_LIST} from "../../shared/attach.system";
import {system} from "./system";
import { RODS } from '../../shared/fish'

export class AttachSystem {
    static playerDataCurrent = new Map<number, (string | [string, ...number[]])[]>()
    static playerData = new Map<number, Map<string, number>>()
    static registerPositions = new Map<string, {model: string, boneId: number, position: {x: number,y: number, z: number}, rotation: {x: number, y: number, z: number}}>()
    static getConfig(id:string){
        return this.registerPositions.get(id)
    }
    static registerPosition(id: string, model: string, boneId: number, position: {x: number,y: number, z: number}, rotation: {x: number, y: number, z: number}){
        this.registerPositions.set(id, {model, boneId, position, rotation});
    }
    static tick(target: number){
        if(!this.playerDataCurrent.has(target) || !this.playerDataCurrent.get(target).length) return this.clearFor(target);
        const player = mp.players.atRemoteId(target);
        if(!player || !mp.players.exists(player) || !player.handle) return this.clearFor(target);
        if(player.handle !== mp.players.local.handle && system.distanceToPos(player.position, mp.players.local.position) > 100) return this.clearFor(target);
        const current = this.playerDataCurrent.get(target)
        const visible = player.getAlpha() > 10 && !player.vehicle
        this.playerData.get(target).forEach((data, key) => {
            if(!visible || !current || !current.find(q => (typeof q === "string" && key === q) || (typeof q !== "string" && key === q[0]))) this.removeFor(target, key)
        })
        if(visible) current.map(key => this.addFor(target, key))
    }

    private static clearFor(target: number){
        const cfg = this.playerData.get(target);
        if(!cfg || [...cfg].length == 0) return;
        cfg.forEach((object, key) => this.removeFor(target, key))
        this.playerData.set(target, new Map());
    }
    static removeFor(target: number, id: string){
        const cfg = this.playerData.get(target);
        if (!cfg || [...cfg].length == 0) return;
        if (!cfg.has(id)) return;
        let handle = cfg.get(id);
        if (!handle) return;
        if (handle) {
            //mp.game.invoke('0x539E0AE3E6634B9F', handle)
            //mp.game.invoke('0xB736A491E64A32CF', handle)
            mp.game.object.deleteObject(handle)
        }
        cfg.delete(id)
        this.playerData.set(target, cfg);
    }

    private static async addFor(target: number, data: string | [string, ...number[]]){
        let cfg = this.playerData.get(target);
        if(!cfg || [...cfg].length == 0) cfg = new Map()
        const id = typeof data === "string" ? data : data[0];
        if(cfg.has(id)) return;
        let handle = cfg.get(id);
        const player = mp.players.atRemoteId(target);
        if(!player || !player.handle) return;
        const attInfo = this.getConfig(id);
        if(!attInfo) return mp.console.logError(`attach non exists config ${id}`);
        
        if(handle) {
            if(!handle) return;
            if(!mp.game.invoke(system.natives.IS_ENTITY_ATTACHED, handle)) {
                mp.game.invoke(system.natives.ATTACH_ENTITY_TO_ENTITY,
                    handle, player.handle, player.getBoneIndex(attInfo.boneId),
                    attInfo.position.x, attInfo.position.y, attInfo.position.z,
                    attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z,
                    false, false, false, false, 2, true)
            }


            return;
        }
        const inv = inventoryShared.items.find(q => q.prop === attInfo.model)
        const weaponCfg = inv ? inventoryShared.getWeaponConfigByItemId(inv.item_id) : null
        const isWeapon = !!weaponCfg && !!weaponCfg.ammo_max
        const modelname = !isWeapon ? attInfo.model : weaponCfg.hash;
        const model = mp.game.joaat(modelname)
        let c = 0;
        if (isWeapon){
            //if (!mp.game.streaming.isModelValid(model)) return;
            mp.game.weapon.requestWeaponAsset(model, 31, 0);
            //while (!mp.game.weapon.hasWeaponAssetLoaded(model) && c < 200) await system.sleep(10), c++;
            while (!mp.game.weapon.hasWeaponAssetLoaded(model)) {
                await mp.game.waitAsync(0);
                c++;
                if (c >= 200) return;
            }
        } else {
            if (!mp.game.streaming.hasModelLoaded(model)) {
                mp.game.streaming.requestModel(model)
                //while(!mp.game.streaming.hasModelLoaded(model)) await system.sleep(10)
                while (!mp.game.streaming.hasModelLoaded(model)) {
                    await mp.game.waitAsync(0);
                    c++;
                    if (c >= 200) return;
                }
            }
        }
        if(!player || !mp.players.exists(player) || !player.handle) return;

        let object = !isWeapon 
            ? mp.game.object.createObject(model, player.position.x, player.position.y, player.position.z - 10, true, true, true) 
            : mp.game.weapon.createWeaponObject(model, 120, player.position.x, player.position.y, player.position.z - 10, true, 0, 0);
        //let objectS = mp.objects.atHandle(object);
        //if(!objectS) return mp.game.object.deleteObject(object);

        //objectS.attachBody = player.remoteId;
        let count = 0;
        const set = () => {
            count++;
            if (count > 200) {
                if (object && mp.objects.exists(object)) {
                    //mp.game.invoke('0xADBE4809F19F927A', object)
                    //mp.game.invoke('0x539E0AE3E6634B9F', object)
                    mp.game.object.deleteObject(object)
                }
                return clearInterval(int);
            }
            if(!player || !mp.players.exists(player) || !player.handle) return clearInterval(int);
            if(!object) return;
            //if(!objectS) return;
            //if(!mp.objects.exists(object)) return;
            //if(!objectS.handle) return;
            mp.game.invoke(system.natives.ATTACH_ENTITY_TO_ENTITY, object, player.handle, player.getBoneIndex(attInfo.boneId),
                attInfo.position.x + 0.00001, attInfo.position.y + 0.00001, attInfo.position.z + 0.00001,
                attInfo.rotation.x + 0.00001, attInfo.rotation.y + 0.00001, attInfo.rotation.z + 0.00001, true, false, false, false, 2, true)
            
            // objectS.attachTo(player.handle, player.getBoneIndex(attInfo.boneId),
            //     attInfo.position.x, attInfo.position.y, attInfo.position.z,
            //     attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z, false, false, false, false, 2, true);
            mp.game.invoke(system.natives.PROCESS_ENTITY_ATTACHMENTS, object)
            mp.game.invoke(system.natives.SET_ENTITY_NO_COLLISION_ENTITY, object, mp.players.local.handle, false)
            mp.game.invoke(system.natives.SET_ENTITY_NO_COLLISION_ENTITY, mp.players.local.handle, object, false)

            mp.game.invoke(system.natives.SET_ENTITY_NO_COLLISION_ENTITY, object, player.handle, false)
            mp.game.invoke(system.natives.SET_ENTITY_NO_COLLISION_ENTITY, player.handle, object, false)

            if(typeof data !== "string"){
                data.map(async q => {
                    if(typeof q === "string") return;
                    if (q <= 32) {// Здесь костыль сработает потому что во всех иных случаях q будет равно хешу, т.е числу явно больше 32
                        mp.game.invoke(system.natives.SET_WEAPON_OBJECT_TINT_INDEX, object, q)
                    } else {
                        const model = mp.game.weapon.getWeaponComponentTypeModel(q)
                        if(!model) return mp.console.logError('model incorrect')
                        if(!mp.game.streaming.hasModelLoaded(model)){
                            mp.game.streaming.requestModel(model)
                            while(!mp.game.streaming.hasModelLoaded(model)) await system.sleep(10)
                        }
                        mp.game.weapon.giveWeaponComponentToWeaponObject(object, q);
                        // mp.game.streaming.setModelAsNoLongerNeeded(model)
                        // mp.game.weapon.giveWeaponComponentToWeaponObject(object.handle, q);
                    }
                })
            }
            clearInterval(int)
        }
        let int = setInterval(() => {
            set()
        }, 100)
        cfg.set(id, object)
        this.playerData.set(target, cfg);
    }

    static addLocal(id: string){
        const attInfo = this.getConfig(id);
        if(!attInfo) return;

        if(!AttachSystem.playerData.has(mp.players.local.remoteId)) AttachSystem.playerData.set(mp.players.local.remoteId, new Map())
        let data = AttachSystem.playerDataCurrent.get(mp.players.local.remoteId) || [];
        if(data.includes(id)) return;
        AttachSystem.playerDataCurrent.set(mp.players.local.remoteId, [...data, id])
        this.tick(mp.players.local.remoteId)
        CustomEvent.triggerServer('attach:system:addLocal', id)
    }
    static removeLocal(id: string){
        const attInfo = this.getConfig(id);
        if(!attInfo) return;
        let data = AttachSystem.playerDataCurrent.get(mp.players.local.remoteId) || [];
        if(!data.includes(id)) return;
        data.splice(data.findIndex(q => q === id), 1)
        AttachSystem.playerDataCurrent.set(mp.players.local.remoteId, [...data])
        this.tick(mp.players.local.remoteId)
        CustomEvent.triggerServer('attach:system:removeLocal', id)
    }
    static tickLocal(){
        this.clearFor(mp.players.local.remoteId)
        this.tick(mp.players.local.remoteId)
    }

}

let lastD = 0;
setInterval(() => {
    if (!user.login) return;

    if(lastD !== mp.players.local.dimension){
        lastD = mp.players.local.dimension;
        AttachSystem.tickLocal()
    }

    if (phoneOpened || mp.players.local.getVariable('call')) {
        AttachSystem.addLocal('phone')
        mp.game.invoke("0x0725a4ccfded9a70", mp.players.local.handle, 0, 1, 1, 1);
    } else AttachSystem.removeLocal('phone');

}, 100)


setInterval(() => {
    if(!user.login) return;
    AttachSystem.tick(mp.players.local.remoteId);
    mp.players.forEachInStreamRange(target => {
        AttachSystem.tick(target.remoteId)
    })
}, 500)

setInterval(() => {
    if(!user.login) return;
    mp.objects.toArray().filter(q => typeof q.attachBody === "number").map(object => {
        const id = object.attachBody;
        const data = AttachSystem.playerData.get(id);
        if(!data) return object.destroy();
        const arr = [...data].map(q => q[1]).filter(q => mp.objects.exists(q));
        if(!arr.find(q => q === object.handle)) object.destroy();
    })
}, 5000)

mp.events.addDataHandler("attachObjects", async (target: PlayerMp, current: string[]) => {
    if(target.type !== "player") return;
    const id = target.remoteId
    if(!AttachSystem.playerData.has(id)) AttachSystem.playerData.set(id, new Map())
    const old = AttachSystem.playerDataCurrent.get(id)
    if(current) current.map(q => {
        if(old && typeof q !== "string" && !old.find(s => typeof s !== "string" && JSON.stringify(s) == JSON.stringify(q)))  AttachSystem.removeFor(id, q[0])
    })
    if(old) old.map(q => {
        if(current && typeof q !== "string" && !current.find(s => typeof s !== "string" && JSON.stringify(s) == JSON.stringify(q)))  AttachSystem.removeFor(id, q[0])
    })
    AttachSystem.playerDataCurrent.set(id, current || [])
    AttachSystem.tick(id)
})

mp.events.add('entityStreamIn', async (target: PlayerMp) => {
    if (target.type !== "player") return;
    const id = target.remoteId
    if(!AttachSystem.playerData.has(id)) AttachSystem.playerData.set(id, new Map())
    AttachSystem.playerDataCurrent.set(id, target.getVariable('attachObjects') || [])
    AttachSystem.tick(id)
});

mp.events.add('entityStreamOut', async (target: PlayerMp) => {
    if (target.type !== "player") return;
    const id = target.remoteId
    if(!AttachSystem.playerData.has(id)) AttachSystem.playerData.set(id, new Map())
    AttachSystem.playerDataCurrent.set(id, [])
    AttachSystem.tick(id)
});


inventoryShared.items.map(item => {
    const pos = item.type === ITEM_TYPE.WATER ? new mp.Vector3(0.05, 0.01, 0.051301) : new mp.Vector3(0.15, 0.038, 0.051)
    const rot = item.type === ITEM_TYPE.WATER ? new mp.Vector3(120.0, 20.0, 120.0) : new mp.Vector3(20.0, 120.0, 0.0)
    AttachSystem.registerPosition("item_" + item.item_id, item.prop, 18905, item.propAttachParam ? new mp.Vector3(item.propAttachParam[0], item.propAttachParam[1], item.propAttachParam[2]) : pos, item.propAttachParam ? new mp.Vector3(item.propAttachParam[3], item.propAttachParam[4], item.propAttachParam[5]) : rot);
})

AttachSystem.registerPosition("mining", "prop_tool_jackham", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("drinking_1", "prop_ld_can_01", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("drinking_2", "prop_ecola_can", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("drinking_3", "prop_ld_flow_bottle", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("char_creator_1", "prop_beggers_sign_04", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("handcuff", "p_cs_cuffs_02_s", 28422, new mp.Vector3(-0.01, 0.06, -0.02), new mp.Vector3(62.0, -6.0, 66.0));
AttachSystem.registerPosition("phone", "prop_npc_phone_02", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
AttachSystem.registerPosition("tablet", "hei_prop_dlc_tablet", 28422, new mp.Vector3(-0.09, -0.025, 0), new mp.Vector3(0, 90, 15));
AttachSystem.registerPosition("bong", "prop_bong_01", 26611, new mp.Vector3(0.020, -0.105, -0.285), new mp.Vector3(347, 360, 345));
AttachSystem.registerPosition("vape", "vape", 26612, new mp.Vector3(0.060, -0.025, -0.030), new mp.Vector3(360, 350, 360));
AttachSystem.registerPosition("trash_bag", "p_rub_binbag_test", 26612, new mp.Vector3(0.245, 0.255, -0.045), new mp.Vector3(229, 237, 11));
AttachSystem.registerPosition("heal_902", "prop_ld_health_pack", 57005, new mp.Vector3(0.175, -0.010, -0.130), new mp.Vector3(319, 46, 58));
AttachSystem.registerPosition("heal_908", "prop_ld_health_pack2", 57005, new mp.Vector3(0.175, -0.010, -0.130), new mp.Vector3(319, 46, 58));


inventoryShared.itemsAttachBody.map(item => WEAPON_ATTACH_LIST[item.attachBody].map((q, i) => AttachSystem.registerPosition(`${item.attachBody}_${item.item_id}_${i}`, item.prop, q[0], new mp.Vector3(q[1], q[2], q[3]), new mp.Vector3(q[4], q[5], q[6]))))

CustomEvent.registerServer('attach:removeLocal', (id: string) => {
    AttachSystem.removeLocal(id);
})
