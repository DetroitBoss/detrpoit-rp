import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {User} from "./user";
import {FACTION_ID} from "../../shared/fractions";
import {UserEntity} from "./typeorm/entities/user";
import {business} from "./business";
import {SocketSyncWeb} from "./socket.sync.web";
import {Vehicle} from "./vehicles";
import {houses} from "./houses";
import {Family} from "./families/family";
import {parking} from "./businesses/parking";
import {FINE_CAR_POS} from "../../shared/fine.car";
import {FAMILY_TIMEOUT_AFTER_CARGO_BATTLE} from "../../shared/family.cargobattle";
import {FamilyContracts} from "../../shared/family";
import {Dispatch} from "./dispatch";
import {BusinessHistoryEntity} from "./typeorm/entities/business";
import {OWNER_TYPES} from "../../shared/inventory";
import {getOrderListArray} from "./news";
import {inventory} from "./inventory";
import {distinctArray} from "../../shared/arrays";
import {fraction, fractionCfg} from "./fractions/main";
import {FractionGarage} from "./fraction.garages";
import {FRACTION_RIGHTS, IFractionGarageDTO, IFractionStorageDTO} from "../../shared/fractions/ranks";
import {fractionChest} from "./chest";
import {MoneyChestClass} from "./money.chest";
import {Logs} from "./logs";


function reloadFractionData(fraction: FACTION_ID):void;
function reloadFractionData(player: PlayerMp):void;
function reloadFractionData(target: FACTION_ID| PlayerMp){
    if(typeof target !== "number" && !mp.players.exists(target)) return;
    const fraction = typeof target === "number" ? target : target.user.fraction
    if(!fraction) return;
    const path = `tablet_${fraction}`;
    const list = SocketSyncWeb.getfire(path);
    list.map(async player => {
        const data = await tablet.getFractionData(player)
        SocketSyncWeb.fireTarget(player, path, JSON.stringify(data));
    })
}

CustomEvent.registerCef('tablet:loadFamily', async player => {
    if (!mp.players.exists(player) || !player.user || !player.user.family) {
        return null;
    }

    return await tablet.getFamilyData(player.user.family);
});

CustomEvent.registerCef('tablet:loadFraction', async player => {
    if (!mp.players.exists(player) || !player.user || !player.user.fraction) {
        return null;
    }

    return await tablet.getFractionData(player);
});

CustomEvent.registerCef('tablet:loadBusiness', async player => {
    if (!mp.players.exists(player) || !player.user || !player.user.business) {
        return null;
    }

    return await tablet.getBusinessData(player);
});

CustomEvent.registerClient('tablet:openTablet', async player => {
    const tabletItem = player.user.inventory.find(i => i.item_id === 856);
    if (!tabletItem) return;
    await tablet.openForPlayer(player);
});

CustomEvent.registerCef('tablet:getSuspects', player => {
    if (!player.user) return;
    return player.user.is_gos ? tablet.getGosSuspects() : [];
})


export const tablet = {
    openForPlayer: async (player: PlayerMp) => {
        const user = player.user;
        let houseq = user.houseEntityLive;
        let houseData: {
            carInt: number,
            name: string,
            id: number,
            owner: string,
            price: number,
            tax: number,
            tax_max: number,
            cars: { name: string, number: string }[],
            pos: { x: number, y: number }
        } = houseq ? {
            id: houseq.id,
            carInt: houseq.car_interrior,
            name: houseq.name,
            owner: user.name,
            price: houseq.price,
            tax: houseq.tax,
            tax_max: houseq.taxMax,
            cars: houses.vehiclesInHouses(houseq).map(q => {
                return {
                    name: q.entity.name,
                    model: q.entity.model,
                    number: q.entity.number,
                }
            }),
            pos: { x: houseq.x, y: houseq.y}
        } : null;

        const vehicles = distinctArray(
            [...user.myVehicles, ...Vehicle.getVehiclesByPlayerKeys(player)],
            (vehicle) => vehicle.id
        ).map<{ name: string, model: string, number: string, x: number, y: number, onSpawn: boolean, id: number }>(q => {
            let pos: { x: number, y: number };
            if (!q.exists) return null;
            if (q.vehicle.usedAfterRespawn) {
                pos = { x: q.vehicle.position.x, y: q.vehicle.position.y }
            } else if (!q.onParkingFine) {
                if (q.spawnPointType === "house") {
                    const house = houses.get(q.position.d);
                    if (house) {
                        pos = { x: house.car_x, y: house.car_y };
                    }
                } else {
                    const p = parking.getParkingFromDimension(q.position.d);
                    if (p) {
                        pos = { x: p.positions[0].x, y: p.positions[0].y };
                    }
                }
            } else {
                pos = [...FINE_CAR_POS].sort((a, b) => {
                    return system.distanceToPos(player.position, a) - system.distanceToPos(player.position, b)
                })[0];
            }
            return {
                id: q.id,
                name: q.name,
                model: q.model,
                number: q.number,
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
                onSpawn: q.onParkingFine || !q.vehicle.usedAfterRespawn
            }
        });

        let fraction = user.fraction ? true : null;

        const businessData = user.business ? true : null

// const fHouse = user.family ? user.family.house: null
        const familyData = user.family ? true : null;

        const gosSuspects = user.is_gos ? tablet.getGosSuspects() : []

        CustomEvent.triggerClient(player, "tablet:open",
            houseData,
            vehicles,
            fraction,
            inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).filter(item => item.item_id === 850 && item.advancedNumber).map(q => q.advancedNumber),
            getOrderListArray(player),
            businessData,
            familyData,
            gosSuspects
        );
    },
    getBusinessData: async (player: PlayerMp) => {
        const bizData = player.user.business;

        return bizData ? {
            name: bizData.name,
            money: bizData.money,
            cost: bizData.price,
            tax: bizData.tax,
            taxMax: bizData.taxMax,
            logs: (await BusinessHistoryEntity.find({
                where: {business: {id: bizData.id}},
                order: {id: "DESC"},
                take: 30
            })).map(q => {
                return {
                    text: system.filterInput(q.text),
                    type: q.type,
                    sum: q.sum,
                    time: q.time,
                }
            })
        } : null;
    },
    updateFamilyData: async (family: Family) => {
        SocketSyncWeb.fire(`tablet_family_${family.id}`, JSON.stringify(await tablet.getFamilyData(family)))
    },
    getFamilyData: async (family: Family) => {
        return {
            id: family.id,
            name: family.name,
            money: family.money,
            scores: family.points,
            season_scores: family.seasonPoints,
            level: family.level,
            win: family.wins,
            members: (await family.getAllMembers()).map(q => {
                const target = User.get(q.id)
                return {
                    id: q.id,
                    name: q.rp_name,
                    rank: q.familyRank,
                    lastSeen: !target ? q.online : 0,
                    tracker: !target ? false : !!target.getVariable('gpsTrack'),
                    scores: q.familyScores
                }
            }),
            bio: " ",
            ranks: family.ranks,
            changeRank: { id: -1 },
            cargoData: {
                amount: family.cargo,
                max: family.maximumCargoCount
            },
            extraTasks: family.extraTasks,
            familyTasks: family.hourQuests,
            vehicles: family.cars.map(q => {
                let pos: { x: number, y: number };
                if (!q.exists) return null;
                if (q.vehicle.usedAfterRespawn) {
                    pos = { x: q.vehicle.position.x, y: q.vehicle.position.y }
                } else if (!q.onParkingFine) {
                    if (q.spawnPointType === "house") {
                        const house = houses.get(q.position.d);
                        if (house) {
                            pos = { x: house.car_x, y: house.car_y };
                        }
                    } else {
                        const p = parking.getParkingFromDimension(q.position.d);
                        if (p) {
                            pos = { x: p.positions[0].x, y: p.positions[0].y };
                        }
                    }
                } else {
                    pos = [...FINE_CAR_POS][0]
                    // pos = [...FINE_CAR_POS].sort((a, b) => {
                    //     return system.distanceToPos(player.position, a) - system.distanceToPos(player.position, b)
                    // })[0];
                }
                return {
                    id: q.id,
                    name: q.name,
                    model: q.model,
                    number: q.number,
                    x: pos ? pos.x : 0,
                    y: pos ? pos.y : 0,
                    onSpawn: q.onParkingFine || !q.vehicle.usedAfterRespawn,
                    rank: q.fromRank
                }
            }),
            house: family.house ? {
                id: family.house.id,
                name: family.house.name,
                price: family.house.price,
                forTp: family.house.forTp,
                pos: { x: family.house.x, y: family.house.y, z: family.house.z}
            } : null,
            upgrades: family.upgrades,
            donate: family.donate,
            donateLog: await family.getMoneyLog(),
            cargoNeedTime: family.lastCargoBattleWin?(FAMILY_TIMEOUT_AFTER_CARGO_BATTLE - Math.round((system.timestamp -  family.lastCargoBattleWin)/60)):0,
            contract: (() => {
                let outputContracts = [] as {id:number, name:string, desc: string, status: number, win: { type: number, amount?: number, desc?: string}[] }[]
                Object.entries(family.contracts).map(([id, progress]) => {
                    const contract = FamilyContracts.find(fc => fc.id == Number(id))
                    if(!contract) return;
                    outputContracts.push({
                        id: contract.id,
                        name: contract.name,
                        desc: contract.desc,
                        status: progress == -1 ? progress : Math.floor(progress*100/contract.needScore),
                        win: contract.win
                    })
                })
                return outputContracts
            })()
            //     [
            //     { id: 1, name: 'Покупка чего-то там', desc: 'Описание чего-то там', status: -1, win: [{ type: FamilyContractWinTypes.MONEY, amount: 1000 }, { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 100, desc: 'Очков семьи' }]}
            // ]
        }
    },
    gosSearchData: async (id: number) => {
        const data = await User.getData(id);

        if(!data) return null;

        const house = houses.getByOwner(data.id);

        return {
            id: data.id,
            name: data.rp_name,
            bank: data.bank_number,
            social: data.social_number,
            house: house ? `${house.name} #${house.id}` : null,
            wanted_level: data.wanted_level,
            wanted_reason: data.wanted_reason,
            vehs: Vehicle.getPlayerVehicles(data.id).map(q => {
                return {
                    id: q.id,
                    model: q.model,
                    name: q.name,
                    number: q.number
                }
            }),
            licenses: data.licenses.filter(q => q[1] > system.timestamp),
            history: (await User.getRpHistory(data.id)).map(q => {
                return {
                    text: q.text,
                    time: q.time
                }
            })
        }
    },
    gosSearchDataReload: (id: number) => {
        tablet.gosSearchData(id).then(data => {
            if(!data) return;
            SocketSyncWeb.fire(`tablet_gosSearchItem_${id}`, JSON.stringify(data))
        })
    },
    gosSuspectsReload: () => {
        SocketSyncWeb.fire(`tablet_gosSuspects`, JSON.stringify(tablet.getGosSuspects()))
    },
    getGosSuspects: () => {
        return mp.players.toArray().filter(q => q.user && q.user.wanted_level).map(player => {
            return { id: player.user.id, name: player.user.name, wanted: player.user.wanted_level }
        })
    },
    getFractionData: async (player: PlayerMp) => {
        const user = player.user;

        if(!user) return null;

        const fraction = user.fraction

        if(!fraction) return null;

        return {
            id: fraction,
            members: (await UserEntity.find({fraction: fraction})).map(q => {
                const target = User.get(q.id);
                return {
                    id: q.id,
                    name: q.rp_name,
                    rank: q.rank,
                    warns: q.fraction_warns,
                    tag: system.filterInput(!target ? q.tag : target.user.tag),
                    lastSeen: !target ? q.online : 0,
                    tracker: !target ? false : !!target.getVariable('gpsTrack'),
                    tracking: !target ? false : user.hasGpsTracking(q.id)
                }
            }),
            mafiabiz: fractionCfg.getFraction(fraction)?.mafia
                ? business.data.filter(biz => biz.mafiaOwner === fraction)
                    .map(q => { return { id: q.id, name: q.name, type: q.type, stype: q.sub_type, price: q.price}})
                : null,
            alerts: Dispatch.getFactionDispatches(fraction).map(d => {
                return {
                    id: d.id,
                    name: mp.players.exists(d.fromPlayer) && d.fromPlayer.user ? d.fromPlayer.user.name : 'Неизвестно',
                    timestamp: d.timestamp,
                    type: d.type,
                    callAnswered: d.callAnsweredName ? d.callAnsweredName : null,
                    code: d.code ? d.code : 0,
                    text: d.text,
                    isGlobal: d.isGlobal,
                    pos: d.pos,
                    actual: d.isDispatchActual()
                }
            }),
            playerPosition: user.position
        }
    },
    reloadFractionData,
}

CustomEvent.registerCef('tablet:gpsSwitch', (player => {
    const user = player.user;
    if(!user) return;
    if(!user.fractionData) return;
    const current = !!player.getVariable('gpsTrack')
    player.setVariable('gpsTrack', !current ? `[${user.tag}] ${user.name} (${user.id})` : null)
    player.notify(`GPS Маяк ${current ? 'установлен' : 'отключён'}`, "success");
}))
CustomEvent.registerCef('tablet:sendCode', ((player, codeindex) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fractionData
    if(!fraction) return;
    if(!fraction.codes) return;
    User.notifyToFraction(user.fraction, `${fraction.name} [${user.name} (${user.id})]`, 'Получен код', fraction.codes[codeindex], 'CHAR_BRYONY', 10000)
}))
CustomEvent.registerCef('tablet:sendTextFraction', ((player, text: string) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fractionData
    if(!fraction) return;
    if(!user.isLeader) return;
    User.notifyToFraction(user.fraction, `${fraction.name} [${user.name} (${user.id})]`, `Оповещение фракции (${fractionCfg.getRankName(user.fraction, user.rank)})`, text, 'CHAR_BRYONY', 10000)
}))

CustomEvent.registerCef('tablet:getFractionGarages', (player: PlayerMp) => {
    if (!player.user || !player.user.fraction) return;

    const fractionGaragesDTOs: IFractionGarageDTO[] = []

    FractionGarage.list.forEach(el => {
        if (el.fraction === player.user.fraction) {
            fractionGaragesDTOs.push({
                id: el.id,
                cars: el.cars
            })
        }
    })

    return fractionGaragesDTOs;
});

CustomEvent.registerCef('tablet:getFractionStorages', (player: PlayerMp) => {
    if (!player.user || !player.user.fraction) return;

    const fractionStoragesDTOs: IFractionStorageDTO[] = []

    fractionChest.list.forEach(el => {
        if (el.fraction === player.user.fraction) {
            fractionStoragesDTOs.push({
                id: el.id,
                items: el.items
            })
        }
    })

    return fractionStoragesDTOs;
})

CustomEvent.registerCef('tablet:setRankForItem', (player: PlayerMp, storageId: number, itemId: number, rank: number) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.STORAGE)) return;

    const chest = fractionChest.list.get(storageId);

    if (!chest) return false;

    const items = [...chest.items];

    items.find((el) => itemId === el[0])[2] = rank + 1;

    chest.items = items;

    player.user.log("tabletFraction", `Изменил права на взятие предметов для ранга со склада фракции ${player.user.fraction}`);

    return true;
})

CustomEvent.registerCef('tablet:setRankForCar', (player: PlayerMp, garageId: number, carId: number, rank: number) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.VEHICLES)) return;

    const garage = FractionGarage.list.get(garageId);

    if (!garage) return false;

    const vehicles = [...garage.cars];

    vehicles.find((el, key) => key === carId)[3] = rank + 1;

    garage.cars = vehicles;

    return true;
})

CustomEvent.registerCef('tablet:getFractionMoneyChest', (player: PlayerMp) => {
    if (!player.user || !player.user.fraction) return;

    const chest = MoneyChestClass.getByFraction(player.user.fraction);

    if (!chest) return [];

    const storageLog = Logs.get(`money_${chest.id}`);

    return storageLog.slice(-50);
});

CustomEvent.registerCef('tablet:getBackCar', (player: PlayerMp, garageId: number, car: [string, string, number, number, number, number, number, number, number, number, number]) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.BACK_CAR)) return;

    const garage = FractionGarage.list.get(garageId);

    if (!garage) return;

    const used = garage.usedVehicles.get(car[2]);

    if (used) {

        const veh = Vehicle
            .toArray()
            .find(v => v.fraction === garage.fraction && v.garage === garage.id && v.garagecarid == car[2]);

        if (veh) {
            if (veh.getOccupants().length === 0) {
                Vehicle.destroy(veh)
                player.user.log("tabletFraction", `Вернул фракционное авто в гараж ${player.user.fraction} ${Vehicle.name}`);
                player.notify("Машина возвращена в гараж", 'success');
            }else{
                player.notify("В данный момент машина кем-то занята", 'error');
            }
        }
    }else{
        player.notify("Транспорт уже в гараже", 'success');
    }
})

CustomEvent.registerCef('tablet:removeFractionWarn', (player: PlayerMp, id: number) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.WARNS)) return;

    const user = player.user;

    const target = User.get(id);

    if(target){
        const data = target.user;

        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return player.notify('Нельзя выдавать выговоры игрокам, которые равны или выше вас по рангу');

        if (data.fractionWarns === 0) return player.notify('У игрока отсутствуют выговоры', 'error');

        data.fractionWarns = data.fractionWarns - 1;

        player.notify('Выговор успешно снят с игрока', 'success');

        player.user.log("tabletFraction", `Снял выговор с игрока ${data.id} во фракции ${data.fraction}`)
        return;
    }else {
        User.getData(id).then(data => {
            if (!data) return;
            if (data.fraction !== user.fraction) return;
            if (data.rank >= user.rank) return player.notify('Нельзя выдавать выговоры игрокам, которые равны или выше вас по рангу');

            if (data.fraction_warns === 0) return player.notify('У игрока отсутствуют выговоры', 'error');

            data.fraction_warns  = data.fraction_warns - 1;

            player.notify('Выговор успешно снят с игрока', 'success');
            player.user.log("tabletFraction", `Снял выговор с игрока ${data.id} во фракции ${data.fraction}`)
            data.save().then(() => {
                tablet.reloadFractionData(player)
            });
        })
    }
})

CustomEvent.registerCef('tablet:giveFractionWarn', (player: PlayerMp, id: number) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.WARNS)) return;

    const user = player.user;

    const target = User.get(id);

    if (target) {
        const data = target.user;

        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return player.notify('Нельзя выдавать выговоры игрокам, которые равны или выше вас по рангу');

        if (data.fractionWarns + 1 >= 3) {
            data.fraction = 0;
            data.fractionWarns = 0;

            player.notify('Игрок получил 3 выговора и был уволен', 'success');
            player.user.log("tabletFraction", `Выдал последний выговор игроку ${data.id} во фракции ${data.fraction}`)
        }else{
            data.fractionWarns = data.fractionWarns + 1;

            player.notify('Выговор успешно выдан игроку', 'success');
            player.user.log("tabletFraction", `Выдал выговор игроку ${data.id} во фракции ${data.fraction}`)
        }

    }else{
        User.getData(id).then(data => {
            if (!data) return;
            if (data.fraction !== user.fraction) return;
            if (data.rank >= user.rank) return player.notify('Нельзя выдавать выговоры игрокам, которые равны или выше вас по рангу');

            if (data.fraction_warns + 1 >= 3) {
                data.fraction = 0;
                data.rank = 0;
                data.fraction_warns = 0;

                player.notify('Игрок получил 3 выговора и был уволен', 'success');
                player.user.log("tabletFraction", `Выдал последний выговор игроку ${data.id} во фракции ${data.fraction}`)
            }else{
                data.fraction_warns = data.fraction_warns + 1;

                player.notify('Выговор успешно выдан игроку', 'success');
                player.user.log("tabletFraction", `Выдал выговор игроку ${data.id} во фракции ${data.fraction}`)
            }

            data.save().then(() => {
                tablet.reloadFractionData(player)
            });
        })
    }
})

CustomEvent.registerCef('tablet:giveAward', (player: PlayerMp, id: number) => {
    if (!player.user || !player.user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.AWARDS)) return;

    const user = player.user;

    const target = User.get(id);

    const chest = MoneyChestClass.getByFraction(player.user.fraction);

    if (!chest) return player.notify("В вашей фракции отсутствует денежный сейф");


    if (target) {
        const data = target.user;

        if (data.fraction !== user.fraction) return;

        if (chest.money < fraction.getAwardCount(target.user.fraction, target.user.rank))
            return player.notify("В денежном сейфе недостаточно денег");

        chest.money = chest.money - fraction.getAwardCount(target.user.fraction, target.user.rank);

        target.user.addBankMoney(
            fraction.getAwardCount(target.user.fraction, target.user.rank),
            true,
            `премия во фракции ${target.user.fraction} на ранг ${target.user.rank}`,
            ""
        )
        player.notify("Премия успешно выдана", 'success');
        player.user.log("tabletFraction", `Выдал премию игроку ${data.id}  во фракции ${data.fraction} на ранге ${data.rank}`);
        chest.addLog(player, `[${system.timeStampString(system.timestamp, true)}] Выписал премию ${data.name} в размере $${fraction.getAwardCount(target.user.fraction, target.user.rank)}`)
    }else{
        User.getData(id).then(data => {
            if (!data) return;
            if (data.fraction !== user.fraction) return;

            if (chest.money < fraction.getAwardCount(data.fraction, data.rank))
                return player.notify("В денежном сейфе недостаточно денег");

            chest.money = chest.money - fraction.getAwardCount(data.fraction, data.rank);

            data.bank_money = data.bank_money + fraction.getAwardCount(data.fraction, data.rank);

            player.notify("Премия успешно выдана", 'success')
            player.user.log("tabletFraction", `Выдал премию игроку ${data.id} во фракции ${data.fraction} на ранге ${data.rank}`);
            chest.addLog(player, `[${system.timeStampString(system.timestamp, true)}] Выписал премию ${data.rp_name} в размере $${fraction.getAwardCount(data.fraction, data.rank)}`)
            data.save().then(() => {
                tablet.reloadFractionData(player)
            });
        })
    }
})
