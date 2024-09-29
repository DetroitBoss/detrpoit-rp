import { CustomEvent } from "./custom.event";
import {CharacterSkinData, defaultCharacterData} from "../../shared/character";
import { User} from "./user";
import { UserEntity } from "./typeorm/entities/user";
import { system } from "./system";
import {promoUseMedia} from "./usermodule/promocode";

CustomEvent.registerClient('server:user:setPlayerModel', (player, model: 'mp_m_freemode_01' | 'mp_f_freemode_01') => {
    player.model = mp.joaat(model);
})
CustomEvent.registerClient('server:user:personage:done', (player, datastring: string, name: string, family: string, age: number, dresss?: string, promo?:string) => {
    let user = User.getByPlayer(player);
    let data: CharacterSkinData = JSON.parse(datastring);
    
    // if (data === null) user.setSkinParam(defaultCharacterData)
    // else user.setSkinParam(data);
    user.setSkinParam(data);
    
    if(age) user.age = age;
    if(dresss){
        const dress: [number, number, number] = JSON.parse(dresss)
        if(dress){
            if (dress[0]) user.setDressData({ torso: dress[0]})
            if (dress[1]) user.setDressData({ leg: dress[1]})
            if (dress[2]) user.setDressData({ foot: dress[2]})
        }
    }
    if(promo){
        promoUseMedia(player, promo);
    }
    if(!user.name && name && family){
        user.name = `${name} ${family}`;
        const pos = system.getDataByQuestLine(user.entity.quest_line)
        const { x, y, z, h } = pos;
        user.teleport(x, y, z, h, 0)
        // user.afterLogin(false);
        setTimeout(() => {
            CustomEvent.triggerClient(player, 'start:textshow')
        }, 2000)
    } else {
        user.returnToOldPos()
    }
})
CustomEvent.registerCef('server:user:personage:checkName', async (player, name: string, family: string) => {
    return !!(await UserEntity.count({ rp_name: `${name} ${family}` }))
})
CustomEvent.registerClient('server:user:updateCharacterFace', (player) => {
    let user = User.getByPlayer(player);
    if(!user) return;
    user.reloadSkin();
})