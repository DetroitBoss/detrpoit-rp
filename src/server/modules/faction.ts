import {Like} from "typeorm";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {UserEntity} from "./typeorm/entities/user";
import {User} from "./user";
import {Vehicle} from "./vehicles";
import {LicenceType, LicenseName, REMOVE_LICENSE_RANK} from "../../shared/licence";
import {inventory} from "./inventory";
import {CUFFS_ITEM_ID, OWNER_TYPES, SCREWS_ITEM_ID} from "../../shared/inventory";
import {tablet} from "./tablet";
import {Family} from "./families/family";
import {gui} from "./gui";
import {invokeDispatchCode} from './dispatch'
import {fraction, fractionCfg} from "./fractions/main";
import {FRACTION_RIGHTS} from "../../shared/fractions/ranks";

CustomEvent.registerClient('cuffTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)
    
    if (!user || !target || !mp.players.exists(target)) 
        return

    if (user.cuffed) {
        return player.notify('Вы не можете использовать это в наручниках', 'error');
    }

    const firstCuffsOrScrewsInInventory = user.inventory.find(i => i.item_id == SCREWS_ITEM_ID || i.item_id == CUFFS_ITEM_ID)
    if (!firstCuffsOrScrewsInInventory)
        return player.notify('У вас нет наручников или стяжек')
    
    user.setCuffedTarget(target, firstCuffsOrScrewsInInventory)
});

CustomEvent.registerClient('uncuffTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)

    if (!user || !target || !mp.players.exists(target))
        return

    user.setUncuffedTarget(target)
});

CustomEvent.registerClient('followTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)

    if (!user || !target || !mp.players.exists(target))
        return

    if (user.cuffed) {
        return player.notify('Вы не можете использовать это в наручниках', 'error');
    }

    user.setFollowTarget(target)
});

CustomEvent.registerCef('faction:tag', (player, tag: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    user.tag = tag ? system.filterInput(tag) : "";
    tablet.reloadFractionData(player)
});
CustomEvent.registerCef('faction:kick', (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.KICK)) return;
    const target = User.get(id);
    if(target){
        const data = target.user;
        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return;
        user.log('fractionKick', `Выгнал из фракции. Ранг игрока, когда выгнали: ${data.rank}`, id)
        data.fraction = 0
        data.fractionWarns = 0;
        return;
    }
    User.getData(id).then(data => {
        if(!data) return;
        if(data.fraction !== user.fraction) return;
        if(data.rank >= user.rank) return;
        user.log('fractionKick', `Выгнал из фракции. Ранг игрока, когда выгнали: ${data.rank}`, id)
        data.fraction = 0;
        data.rank = 0;
        data.fraction_warns = 0;
        data.save().then(() => {
            tablet.reloadFractionData(player)
        });
    })
})
CustomEvent.registerCef('faction:database:search', async (player, id: number, name: string, social: string, bank: string, veh: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    let data: {id: number, name: string}[] = [];
    if (id && typeof id === "number" && !isNaN(id) && id > 0 && id < 99999999){
        const dataq = await User.getData(id);
        if (!dataq) return {status: "В штате нет человека с указанным ID"};
        data = [{ id, name: dataq.rp_name}];
        return { data };
    }
    // if (veh && veh.length >= 1){
    //     data.push(...[...Vehicle.list].map(q => q[1]).filter(q => q.number.includes(veh)).map(async q => {

    //     }))
    // }

    if(name && name.length > 2){
        let q = (await UserEntity.find({ where: { rp_name: Like(`%${system.filterInput(name)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(social && social.length > 2){
        let q = (await UserEntity.find({ where: { social_number: Like(`%${system.filterInput(social)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(bank && bank.length > 2){
        let q = (await UserEntity.find({ where: { bank_number: Like(`%${system.filterInput(bank)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(data.length === 0){
        return { status: "Поиск не дал результатов" }; 
    }
    return { data };
})
CustomEvent.registerCef('faction:database:searchvehicle', async (player, number: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    number = number.toLowerCase();
    let q = 0;
    let cars = [...Vehicle.list].map(q => q[1]).filter(veh => {
        if(q > 30) return false;
        if(veh.id.toString() == number) return true;
        if(veh.number.toLowerCase().includes(number)) return true;
        if(veh.name.toLowerCase().includes(number)) return true;
    }).map(veh => {
        return  {
            name: veh.name,
            model: veh.model,
            owner: veh.owner,
            number: veh.number,
            fam: !!veh.familyOwner,
            ownername: veh.familyOwner ? Family.getByID(veh.familyOwner)?.name : ''
        }
    })
    let ownersid = cars.filter(q => !q.ownername).map(q => q.owner);
    let owners = await User.getDatas(...ownersid);
    cars.map(q => {
        if(!q.ownername){
            const owner = owners.find(z => z.id === q.owner);
            if(owner) q.ownername = owner.rp_name
        }
    })
    return cars
});
CustomEvent.registerCef('faction:database:data', async (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    return tablet.gosSearchData(id)
});
CustomEvent.registerCef('faction:setGpsTracker', (player, status: boolean) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    player.setVariable('gpsTrack', status);
    if(status){
        player.setVariable('gpsTrackPos', JSON.stringify({
            x: Math.floor(player.position.x),
            y: Math.floor(player.position.y),
            z: Math.floor(player.position.z),
            v: !!player.vehicle
        }))
    } else {
        player.setVariable('gpsTrackPos', null)
    }
    tablet.reloadFractionData(player)
})

setInterval(() => {
    mp.players.toArray().map(player => {
        if(!player.user) return
        if(player.getVariable('gpsTrack')) {
            player.setVariable('gpsTrackPos', JSON.stringify({
                x: Math.floor(player.position.x),
                y: Math.floor(player.position.y),
                z: Math.floor(player.position.z),
                v: !!player.vehicle
            }));
        }
        updateSuspectGPS(player)
    })

}, 10000)

export const updateSuspectGPS = (player: PlayerMp) => {
    if(!mp.players.exists(player) || !player.user) return;
    let setMark = false
    if(player.getVariable('suspectGPS_position')) {
        if(!player.user.wanted_level) player.setVariable('suspectGPS_position', null)
        else setMark = true
    }
    else if(player.user.wanted_level) setMark = true
    if(setMark) {
        player.setVariable('suspectGPS_position', JSON.stringify({
            x: Math.floor(player.position.x),
            y: Math.floor(player.position.y),
            z: Math.floor(player.position.z),
            v: !!player.vehicle
        }))
    }
}

CustomEvent.registerCef('faction:setGpsTrackerWatch', (player, id: number, status: boolean) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.hasGpsTracking(id) && !status) user.removeGpsTracking(id)
    else if (!user.hasGpsTracking(id) && status) user.addGpsTracking(id)
})
CustomEvent.registerCef('faction:setRank', async (player, id: number, rank: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.CHANGE_RANKS)) return;
    if (fractionCfg.isSubLeader(user.fraction, rank)) {
        const res = await UserEntity.find({
            where: {
                fraction: user.fraction,
                rank
            }
        })

        if (res.length >= 3) return player.notify("Нельзя иметь больше 3х заместителей", "error");
    }

    const target = User.get(id);
    if(target){
        const data = target.user;
        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return;
        if(user.is_police && rank >= 6 && !data.haveActiveLicense('military')) return player.notify('Для установки ранга 6 и выше член организации должен иметь военный билет', 'error')
        user.log('fractionRank', `Сменил ранг на ${rank}. Предыдущий ранг: ${data.rank}`, id)
        data.rank = rank
        return;
    } else {
        if(user.is_police && rank >= 6) return player.notify('Для установки ранга 6 и выше член организации должен быть в сети', 'error')
    }
    User.getData(id).then(data => {
        if(!data) return;
        if(data.fraction !== user.fraction) return;
        if(data.rank >= user.rank) return;
        user.log('fractionRank', `Сменил ранг на ${rank}. Предыдущий ранг: ${data.rank}`, id)
        data.rank = rank;
        data.save().then(() => {
            tablet.reloadFractionData(player)
        });
    })
})


let removeLicense = new Map<number, boolean>();


CustomEvent.registerCef('faction:removeLicense', (player, id: number, license: LicenceType) => {
    const user = player.user;
    if(!user) return;
    if(user.fraction !== 1 && !user.is_police) return;
    if(user.rank < REMOVE_LICENSE_RANK) return;
    if(removeLicense.has(user.id)) return player.notify('Лицензия не была изъята, вы недавно уже изымали лицензию', 'error')
    User.getData(id).then((data) => {
        if(!data) return;
        const q = [...data.licenses];
        if(q.findIndex(z => z[0] === license) > -1) q.splice(q.findIndex(z => z[0] === license), 1);
        data.licenses = q;

        player.user.log('gosJob', `Изъял лицензию ${LicenseName[license]}`, id);
        User.writeRpHistory(data.id, `${user.name} #${user.id} изъял лицензию ${LicenseName[license]}`)
        removeLicense.set(user.id, true)
        const ids = user.id;
        setTimeout(() => {
            removeLicense.delete(ids);
        }, 20 * 60000)
        const items = inventory.getInventory(OWNER_TYPES.PLAYER, data.id);
        if(items && items.length > 0){
            const item = items.find(itm => itm.item_id === 803 && itm.advancedNumber === data.id && itm.serial && itm.serial.split('-')[0] == license)
            if(item) inventory.deleteItem(item);
        }
        const target = User.get(data.id);
        if(target) target.notify(`${user.name} #${user.id} изъял у вас лицензию ${LicenseName[license]}`)
        data.save().then(() => {
            tablet.gosSearchDataReload(id)
        });
    })
})

gui.chat.registerCommand("m", (player) => {
    const user = player.user;
    const fraction = user?.fraction;
    if (!fractionCfg.getFraction(fraction)?.police || !player.vehicle) return;
    
    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)}: !{FFFFFF} Всем оставаться на местах, работают правоохранительные органы. В случае неподчинения вы будете задержаны.`)
    })
});

gui.chat.registerCommand("m1", (player) => {
    const user = player.user;
    const fraction = user?.fraction;
    if (!fractionCfg.getFraction(fraction)?.police || !player.vehicle) return;

    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)}: !{FFFFFF} Внимание! Остановите свой автомобиль, заглушите двигатель и держите руки на руле!`)
    })
});

gui.chat.registerCommand("wh", (player, targetIdStr: string, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;
    
    const id = parseInt(targetIdStr);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    
    const target = User.get(id)
    if (!target) return;
    
    let message = system.filterInput(escape(messagearr.join(' ')))
    if (!message) return;

    if (player.dist(target.position) > gui.chat.whisperChatRange) {
        player.notify('Игрок слишком далеко от Вас', 'error');
        return;
    }

    target.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${target.user.getChatNameString(player)} шепчет: !{FFFFFF} ${message}`)
    player.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${player.user.getChatNameString(player)} шепнул !{C2A2DA}${player.user.getChatNameString(target)}: !{FFFFFF} ${message}`)
    
    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension && nplayer != target)
            nplayer.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${nplayer.user.getChatNameString(player)} шепнул что-то игроку ${id}`)
    })
});

gui.chat.registerCommand("s", (player, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;

    let message = system.filterInput(escape(messagearr.join(' ')))
    if (!message) return;

    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)} кричит:!{FFFFFF} ${message}`)
    })
});

gui.chat.registerCommand("mark", (player, codeStr) => {
    const user = player.user;
    if (!user) return;
    if (!user.is_gos) return;
    const code = parseInt(codeStr);
    if (!code || isNaN(code)) return;
    
    invokeDispatchCode(player, code)
});

gui.chat.registerCommand("dep", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fractionId = user.fraction;
    if(!fractionId) return;
    const fractionName = fractionCfg.getFractionName(fractionId);
    if(!fractionName) return;
    if (!user.is_gos) return;
    
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;

    if (!fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.DEPARTMENT))
        return player.notify("Недостаточно прав");

    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction && q.user.is_gos).map(target =>
        target.outputChatBox(`!{666999}[Гос.волна] ${fractionName} ${user.rankName} ${user.name} (${user.dbid}): ${message}`))
});

gui.chat.registerCommand("gov", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fractionId = user.fraction;
    if(!fractionId) return;
    const fractionName = fractionCfg.getFractionName(fractionId);
    if(!fractionName) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;

    if (!user.is_gos) return;

    if (!fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.GOVERNMENT))
        return player.notify("Нет доступа");

    mp.players.toArray().filter(q => q.user && q.user.exists).map(target =>
        target.outputChatBox(`!{8498D9}${fractionName} ${user.name} (${user.dbid}): ${message}`))
});

gui.chat.registerCommand("f", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fraction;
    if(!fraction) return;
    const name = fractionCfg.getFractionName(fraction);
    if(!name) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;
    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction === fraction).map(target =>
        target.outputChatBox(`!{2196F3}[Рация ${name}] ${user.rankName} ${user.name} (${user.id}): ${message}`))

    gui.chat.sendMeCommand(player, "сказал что-то в рацию");
})


gui.chat.registerCommand("fb", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fraction;
    if(!fraction) return;
    const name = fractionCfg.getFractionName(fraction);
    if(!name) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;
    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction === fraction).map(target =>
        target.outputChatBox(`!{2196F3}[Рация ${name}] ${user.rankName} ${user.name} (${user.id}): (( ${message} ))`))
        //target.outputChatBox(`[Рация ${name}] ${user.name}: (( ${message} ))`))
})