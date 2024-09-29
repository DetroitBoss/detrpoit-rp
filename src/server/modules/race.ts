import {colshapes} from "./checkpoints";
import {
    CHANCE_WIN_EXTRA_BONUS,
    CHANCE_WIN_EXTRA_BONUS_FIRST,
    CHANCE_WIN_MULTIPLER,
    LIMIT_CHECKPOINTS,
    MAX_RACERS,
    MIN_CHECKPOINTS,
    MIN_RACERS,
    MONEY_RAGE,
    PLAYER_MAPS_LIMIT,
    RACE_NAME,
    RACE_REGISTER_BOARD,
    RACE_REGISTER_POS,
    RACE_TYPE,
    RACE_TYPE_ARR,
    RACE_TYPE_ARR_NAME,
    WAIT_FOR_START_REGISTER,
    WAIT_REGISTER
} from "../../shared/race";
import {ScaleformTextMp} from "./scaleform.mp";
import {menu} from "./menu";
import {RaceCategoryEntity, RaceEntity} from "./typeorm/entities/race";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {IventClass} from "./invent";
import {getVehicleConfig, Vehicle} from "./vehicles";
import {getAchievConfigByType} from "../../shared/achievements";
import { getX2Param } from "./usermodule/static";

let scalforms: ScaleformTextMp[] = [];
RACE_REGISTER_BOARD.map(data => {
    scalforms.push(new ScaleformTextMp(data[0], "", {
        type: 'board',
        rotation: new mp.Vector3(0, 0, data[1]),
        range: 30
    }))
});
export let raceRegisteredPlayers:PlayerMp[] = [];
export let raceSelectedCars = new Map<number, string>();
export let raceCarsEntity = new Map<number, VehicleMp>();
let winMoney:number;
let winner:number[] = [];
let status:"timer"|"register"|"selectCar"|"race"|"end";
let current: RaceEntity;
let dimensionRace: number;

colshapes.new(RACE_REGISTER_POS, "Зона регистрации на гоночные мероприятия", player => {
    const user = player.user;
    const m = menu.new(player, "", "Центр регистрации");
    m.sprite = "racelobby"
    if (status == "register"){
        if (raceRegisteredPlayers.includes(player)) {
            m.newItem({
                name: "~r~Отказатся от участия",
                onpress: () => {
                    if (status != "register") return player.notify("Регистрация закрыта", "error");
                    raceRegisteredPlayers.splice(raceRegisteredPlayers.indexOf(player), 1);
                    player.notify("Вы успешно отказались от участия", "success");
                }
            })
        } else {
            m.newItem({
                name: "~g~Принять участие",
                onpress: () => {
                    if (status != "register") return player.notify("Регистрация закрыта", "error");
                    if (!user.bank_have) return player.notify("К сожалению без банковского счёта вы не можете принимать участие в соревнованиях. Выплата за победу начисляется на ваш банковский счёт", "error");
                    if (user.attachedToPlace) return player.notify("Вы не можете принять участие в мероприятии", "error");
                    if (raceRegisteredPlayers.length >= current.starts.length) return player.notify("Лимит участников превышен", "error");
                    raceRegisteredPlayers.push(player);
                    player.notify("Вы успешно зарегистированы", "success");
                }
            })
        }
    } else {
        m.newItem({
            name: "~r~Регистрация закрыта"
        })
        if(user.isAdminNow(6)){
            m.newItem({
                name: 'Запустить случайную трассу',
                onpress: () => {
                    generateRace();
                }
            })
        }
    }


    m.newItem({
        name: "~b~Мои трассы",
        onpress: () => {
            if (user.attachedToPlace) return player.notify("Вы не можете редактировать трассы", "error");
            mapEditorMain(player)
        }
    })
    if(user.isAdminNow(5)){
        m.newItem({
            name: "~r~Модерация трасс",
            onpress: () => {
                mapEditorMain(player, true)
            }
        })
        m.newItem({
            name: "~r~Категории ТС",
            onpress: () => {
                categoties(player);
            }
        })
    }
    m.open();
});




export const categoties = (player: PlayerMp) => {
    const user = player.user;
    let m = menu.new(player, "", "Категории ТС для гонок");
    m.sprite = "racelobby"
    race.categories.map(item => {
        m.newItem({
            name: item.name,
            desc: `${item.cars.length} ТС`,
            onpress: () => {
                editCat(player, item)
            }
        })
    })
    m.newItem({
        name: 'Новая категория',
        onpress: () => {
            menu.input(player, "Введите название", "").then(name => {
                if (!name) return;
                let item = new RaceCategoryEntity();
                item.name = name;
                item.save().then((r) => {
                    race.categories.push(r)
                    editCat(player, r)
                })
            })
        }
    })
    m.open();
}

const editCat = (player: PlayerMp, item: RaceCategoryEntity) => {
    const submenu = menu.new(player, item.name, "Параметры");
    submenu.onclose = () => { categoties(player) };
    submenu.newItem({
        name: "Название",
        more: item.name,
        onpress: () => {
            menu.input(player, "Введите новое название", item.name).then(name => {
                if (!name) return;
                item.name = name;
                item.save().then(() => {
                    editCat(player, item)
                })
            })
        }
    })
    submenu.newItem({
        name: "Добавить ТС",
        onpress: () => {
            menu.input(player, "Введите модель", player.vehicle ? player.vehicle.modelname : "", 15).then(name => {
                if (!name) return;
                let models = [...item.cars];
                if (models.includes(name)) return player.notify("Данная модель уже указана", "error");
                if (!getVehicleConfig(name)) return player.notify("Под данный ТС нет конфига, поэтому сначала добавьте данную модель в каталог ТС", "error");
                models.push(name);
                item.cars = models;
                item.save().then(() => {
                    editCat(player, item)
                })
            })
        }
    })
    item.cars.map(car => {
        const cfg = getVehicleConfig(car)
        submenu.newItem({
            name: cfg ? cfg.name : car,
            onpress: () => {
                menu.accept(player, "Удалить?").then(status => {
                    if(!status) return;
                    let models = [...item.cars];
                    models.splice(models.indexOf(car), 1);
                    item.cars = models;
                    item.save().then(() => {
                        editCat(player, item)
                    })
                })
            }
        })
    })
    submenu.open();
}

/** Сгенерировать гонку */
export const generateRace = (map?: RaceEntity) => {
    if (race.itemsArray.length == 0) return;
    if (current) return;
    raceRegisteredPlayers = [];
    current = map ? map : system.randomArrayElement(race.itemsArray.filter(q => q.status == 2).sort((a,b) => {
        return a.uses - b.uses
    }));
    if(!current) return;
    const pos = system.middlePoint3d(...RACE_REGISTER_POS);
    new IventClass('gps', 'Гоночное состязание (открытие регистрации)', WAIT_FOR_START_REGISTER, RACE_NAME, { x: pos.x, y: pos.y, z: pos.z, h: 0}, null, false);
    let timer = map ? 1 : WAIT_FOR_START_REGISTER;
    status = "timer"
    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = `Начало регистрации\nЧерез ${timer} мин.`
    })
    let intTm = 0;
    let int = setInterval(() => {
        intTm+=(!mp.config.announce ? 1 : 6);
        if(intTm >= 12){
            timer--;
            intTm = 0;
        }
        if(timer > 0){
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                // item.text = `Начало регистрации\nЧерез ${timer} минут`
            })
        } else {
            clearInterval(int);
            status = "register"
            new IventClass('gps', 'Гоночное состязание (регистрация открыта)', WAIT_REGISTER, RACE_NAME, { x: pos.x, y: pos.y, z: pos.z, h: 0 }, null, false);
            timer = map ? 1 : WAIT_REGISTER;
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                // item.text = `Регистрация\nКоличество: ${raceRegisteredPlayers.length} / ${current.starts.length}\nОсталось: ${timer} м`
            })
            let secIntInt = 0;
            let secInt = setInterval(() => {
                secIntInt++;
                if(secIntInt == 10){
                    timer--;
                    secIntInt = 0;
                }
                if (timer > 0){
                    scalforms.map(item => {
                        if (!ScaleformTextMp.exists(item)) return;
                        // item.text = `Регистрация\nКоличество: ${raceRegisteredPlayers.length} / ${current.starts.length}\nОсталось: ${timer} м`
                    })
                } else {
                    clearInterval(secInt);
                    status = "selectCar"
                    scalforms.map(item => {
                        if (!ScaleformTextMp.exists(item)) return;
                        // item.text = `Идёт выбор транспорта`
                    })
                    raceSelectedCars = new Map();
                    dimensionRace = system.personalDimension;
                    const cat = race.categories.find(q => q.id === current.carsId);
                    raceRegisteredPlayers.map((target, i) => {
                        if(!mp.players.exists(target)) return raceRegisteredPlayers.splice(i, 1);
                        target.dimension = dimensionRace;
                        setTimeout(() => {
                            if(!mp.players.exists(target)) return;
                            menu.selector(target, "Выберите транспорт", cat.cars, false, 'shopui_title_ie_modgarage', true).then(model => {
                                if(!model) return;
                                raceSelectedCars.set(target.dbid, model);
                                if (status == "selectCar" && [...raceSelectedCars].length === raceRegisteredPlayers.length) startRace()
                            })
                        }, 1000)
                    })
                    setTimeout(() => {
                        if (status == "selectCar") startRace();
                    }, 10000)
                }
            }, 6000)
        }
    }, 5000)
}

const startRace = () => {
    status = "race";
    winner = [];
    winMoney = system.getRandomInt(MONEY_RAGE[0], MONEY_RAGE[1])
    winMoney -= winMoney % 100;
    raceCarsEntity.forEach(item => {
        if(item && mp.vehicles.exists(item)) Vehicle.destroy(item)
    })
    raceCarsEntity = new Map();
    if(raceRegisteredPlayers.length < MIN_RACERS){
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            if(!getX2Param("testserver")){
                target.notify("Количество участников недостаточно для начала гонки", "error");
                target.user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0);
            } else {
                target.notify("Количество участников недостаточно для начала гонки, но сервер в тестовом режиме, поэтому мы гонку запустим", "error");
            }
        })
        if (!getX2Param("testserver") || !raceRegisteredPlayers.length){
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                item.text = `Ожидание следующей гонки`
            })
            raceRegisteredPlayers = [];
            status = null;
            current = null;
            return;
        }
    }
    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = `Гонка активна`
    })
    const cat = race.categories.find(q => q.id === current.carsId);
    let laps = current.type == "circle" ? system.getRandomInt(2, 4) : 1;
    raceRegisteredPlayers.map((target, position) => {
        if (!mp.players.exists(target)) return;
        menu.close(target);
        if (!raceSelectedCars.has(target.dbid)){
            target.notify("Вы не успели выбрать ТС, поэтому вам выдан случайный", "error");
            raceSelectedCars.set(target.dbid, system.randomArrayElement(cat.cars));
        }
        target.user.anticheatProtect('teleport', 30000);
        target.user.showLoadDisplay(100);
        target.user.disableAllControls(true);
        const pos = new mp.Vector3(current.starts[position].x, current.starts[position].y, current.starts[position].z);
        const veh = Vehicle.spawn(raceSelectedCars.get(target.dbid), pos, current.starts[position].h, dimensionRace, true, false, 99999);
        raceCarsEntity.set(target.dbid, veh);
        veh.numberPlate = `POS ${position+1}`;
        CustomEvent.triggerClient(target, "race:load", veh.id, current.pos, laps)
        setTimeout(() => {
            if(!mp.players.exists(target)) return;
            if(!mp.vehicles.exists(veh)) return;
            target.position = pos;
            veh.position = pos;
            setTimeout(() => {
                if(!mp.players.exists(target)) return;
                if(!mp.vehicles.exists(veh)) return;
                target.user.putIntoVehicle(veh, 0);
                target.user.hideLoadDisplay(1000);
            }, 2000)
        }, 1000)
    })

    setTimeout(async () => {
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            CustomEvent.triggerClient(target, 'race:starttimer')
        })
        await system.sleep(3000);
        await system.sleep(system.getRandomInt(2000, 5000));
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            CustomEvent.triggerClient(target, "race:start")
        })
    }, 5000);
    
}

CustomEvent.registerClient('race:end', (player, status: boolean) => {
    const user = player.user;
    if(!user) return;
    if (!raceRegisteredPlayers.includes(player)) return;
    if (winner.includes(user.id)) return;
    if (status || (raceRegisteredPlayers.length === 1 && winner.length == 0)){
        winner.push(user.id);
        if(winner.length === 1) player.user.achiev.achievTickByType("raceFirst");
        if(winner.length < 4){
            user.addBankMoney(winMoney / winner.length, true, `Награда за ${winner.length} место`, RACE_NAME);
            player.user.achiev.achievTickByType("raceWinPLace")
            player.user.achiev.achievTickByType("raceSum", winMoney / winner.length)
        }
        if (CHANCE_WIN_EXTRA_BONUS > 0){
            if (!CHANCE_WIN_EXTRA_BONUS_FIRST || winner.length < 4){
                let chance = system.getRandomInt(1, 100);
                if (chance <= CHANCE_WIN_EXTRA_BONUS){
                    user.addBankMoney(winMoney * CHANCE_WIN_MULTIPLER, true, `Счастливый обладатель экстра награды`, RACE_NAME);
                }
            }
        }
    }
    raceRegisteredPlayers.map(target => {
        if (!mp.players.exists(target)) return;
        target.notify(`Гонщик ${user.name} ${status ? `финиширует на ${winner.length} позиции` : `выбывает из гонки`}`, status ? 'success' : 'error');
        if (winner.length === 1) {
            target.notify('Гонка будет завершена через 60 секунд', 'success')
            setTimeout(() => {
                raceRegisteredPlayers.map(target => {
                    if (!mp.players.exists(target)) return;
                    target.notify('Гонка будет завершена через 30 секунд', 'success')
                })
            }, 30000)
        }
    })
    if (winner.length === 1) {
        setTimeout(() => {
            stopRace();
        }, 30000 + 30000)
    }
    raceRegisteredPlayers.splice(raceRegisteredPlayers.indexOf(player), 1);
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0, true);
    const ids = user.id
    setTimeout(() => {
        if (raceCarsEntity.has(ids) && mp.vehicles.exists(raceCarsEntity.get(ids))){
            Vehicle.destroy(raceCarsEntity.get(ids))
        }
        raceCarsEntity.delete(ids);
    }, 5000)
})

const stopRace = () => {
    raceRegisteredPlayers.map(target => {
        if (!mp.players.exists(target)) return;
        target.notify(`Гонка завершена`, 'error');
        const user = target.user;
        user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0);
        setTimeout(() => {
            if (raceCarsEntity.has(user.id) && mp.vehicles.exists(raceCarsEntity.get(user.id))) Vehicle.destroy(raceCarsEntity.get(user.id))
            raceCarsEntity.delete(user.id);
        }, 5000)
    })

    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = `Ожидание следующей гонки`
    })

    current = null;

}

export let race = {
    items: new Map<number, RaceEntity>(),
    categories: <RaceCategoryEntity[]>[],
    get itemsArray(): RaceEntity[]{
        return [...race.items].map(q => q[1])
    },
    loadAll: () => {
        return new Promise<void>(resolve => {
            console.time('Загрузка данных гоночных трасс завершена. Время загрузки')
            RaceCategoryEntity.find().then(cars => {
                race.categories = cars
                RaceEntity.find().then(data => {
                    data.map(item => {
                        race.items.set(item.id, item);
                    })
                    system.debug.info(`Загрузка данных гоночных трасс, количество предметов: ${data.length}`);
                    console.timeEnd('Загрузка данных гоночных трасс завершена. Время загрузки')
                    resolve()
                })
            })
        })
    }
}


const mapEditStatus = ['В разработке или Отклонена', 'На модерации', 'Одобрена'];

const mapEditorMain = (player: PlayerMp, admin = false) => {
    const user = player.user;
    let m = menu.new(player, "Управление каталогом гоночных трасс");
    let c = 0;
    race.items.forEach(item => {
        if (admin){
            if(!item.status) return;
        } else {
            if (item.userId !== user.id) return;
        }
        c++;
        m.newItem({
            name: item.name,
            more: `${RACE_TYPE_ARR_NAME[RACE_TYPE_ARR.indexOf(item.type)]} (${mapEditStatus[item.status]})`,
            onpress: () => {
                mapEdit(player, item, admin);
            }
        })
    })
    if (!admin){
        m.newItem({
            name: "Новая трасса",
            more: `${c} / ${PLAYER_MAPS_LIMIT}`,
            onpress: () => {
                if (c >= PLAYER_MAPS_LIMIT) return player.notify("Вы больше не можете создавать трассы.", 'error');
                menu.input(player, "Введите название", '', 15, 'text').then(name => {
                    if(!name) return;
                    if(race.itemsArray.find(q => q.name === name)) return player.notify("Трасса с таким названием уже зарегистрирована", "error");
                    let map = new RaceEntity();
                    let cat = system.randomArrayElement(race.categories);
                    if(cat) map.carsId = cat.id
                    map.userId = user.id;
                    map.name = name;
                    map.save().then(s => {
                        race.items.set(s.id, s);
                        player.notify("Пустой шаблон успешно создан")
                        mapEdit(player, s);
                    })
                })
            }
        })
    }
    m.open();
}

const mapEdit = (player: PlayerMp, map: RaceEntity, admin = false) => {
    const user = player.user;
    let m = menu.new(player, `${map.name}`, "Действия");
    m.newItem({
        name: "~r~Удалить",
        onpress: () => {
            if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
            menu.accept(player).then(status => {
                if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
                if(!status) return;
                race.items.delete(map.id)
                map.remove();
                mapEditorMain(player)
                player.notify("Трасса успешно удалена", "success");
            })
        }
    })
    m.newItem({
        name: "~y~Сделать копию трассы",
        onpress: () => {
            if (race.itemsArray.filter(q => q.userId === user.id).length >= PLAYER_MAPS_LIMIT) return player.notify("Вы больше не можете создавать трассы.", 'error');
            menu.input(player, "Введите название", '', 15, 'text').then(name => {
                if (!name) return;
                if (race.itemsArray.find(q => q.name === name)) return player.notify("Трасса с таким названием уже зарегистрирована", "error");
                let newmap = new RaceEntity();
                newmap.userId = user.id;
                newmap.name = name;
                newmap.pos = map.pos;
                newmap.starts = map.starts;
                newmap.save().then(s => {
                    race.items.set(s.id, s);
                    player.notify("Копия трассы успешно создана");
                    mapEdit(player, s);
                })
            })
        }
    })
    const cat = race.categories.find(q => q.id === map.carsId);
    if(!cat){
        map.carsId = 0;
    }
    m.newItem({
        name: "Количество чекпоинтов",
        more: map.pos.length
    })
    m.newItem({
        name: "Количество стартов",
        more: map.starts.length
    })
    m.newItem({
        name: "Категория транспорта",
        more: cat ? cat.name : "~r~Необходимо выбрать",
        onpress: () => {
            if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
            menu.selector(player, "Выберите категорию", race.categories.map(q => q.name), true).then(val => {
                if(typeof val !== "number") return;
                let cat = race.categories[val];
                if(!cat) return;
                map.carsId = cat.id
                map.save().then(() => {
                    mapEdit(player, map);
                })
            })
        }
    })
    if (!map.status){
        m.newItem({
            name: "~g~Отправить на модерацию",
            onpress: () => {
                menu.accept(player).then(status => {
                    if(!status) return;
                    if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
                    if (!cat) return player.notify("Укажите категорию транспорта", 'error');
                    if (map.starts.length < MIN_RACERS) return player.notify(`Допускаются гонки с минимальным количеством точек старта ${MIN_RACERS}`, "error");
                    if (map.starts.length > MAX_RACERS) return player.notify(`Допускаются гонки с максимальным количеством точек старта ${MAX_RACERS}`, "error");
                    if (map.pos.length > LIMIT_CHECKPOINTS) return player.notify(`Допускаются гонки с максимальным количеством чекпоинтов ${LIMIT_CHECKPOINTS}`, "error");
                    if (map.pos.length < MIN_CHECKPOINTS) return player.notify(`Допускаются гонки с минимальным количеством чекпоинтов ${MIN_CHECKPOINTS}`, "error");
                    map.status = 1;
                    map.save();
                    player.notify("Карта успешно отправлена на модерацию", "success");
                    mapEdit(player, map);
                })
            }
        })
    } else {
        m.newItem({
            name: "~y~Статус трассы",
            more: mapEditStatus[map.status],
        }) 
        if (admin){
            if (map.status != 0){
                m.newItem({
                    name: "~r~Отклонить трассу",
                    onpress: () => {
                        map.status = 0;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status != 1){
                m.newItem({
                    name: "~r~Отправить на модерацию трассу",
                    onpress: () => {
                        map.status = 1;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status != 2){
                m.newItem({
                    name: "~r~Одобрить трассу",
                    onpress: () => {
                        map.status = 2;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status == 2){
                m.newItem({
                    name: "~r~Создать гонку на основании этой трассы",
                    onpress: () => {
                        generateRace(map)
                    }
                }) 
            }
        }
    }
    m.newItem({
        name: "~g~Тестовый заезд",
        onpress: () => {
            menu.selector(player, "Выберите транспорт", cat.cars).then(model => {
                if(!model) return;
                const testD = system.personalDimension;
                player.dimension = testD;
                let laps = map.type == "circle" ? 2 : 1
                CustomEvent.triggerClient(player, 'race:test', model, map.pos, map.starts[0], laps)
            })
        }
    })
    m.newItem({
        name: "~g~Открыть редактор",
        onpress: () => {
            if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
            CustomEvent.triggerClient(player, "race:editmap", map.id, map.name, map.pos, map.starts, map.type, cat.cars);
            player.dimension = system.personalDimension
        }
    })
    m.open();
}

CustomEvent.registerClient('raceedit:save', (player, id: number, pos: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], starts: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], type: RACE_TYPE) => {
    const user = player.user;
    if(!user) return;
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0)
    const map = race.items.get(id);
    if(!map) return player.notify("Карта не обнаружена", "error");
    if(map.userId !== user.id) return player.notify("Карта не принадлежит вам", "error")
    if (map.status) return player.notify("Трасса на модерации или уже одобрена", 'error');
    if(typeof pos !== "object"){
        system.saveLog('codeInjection', `${user.name} ${user.id} Попытался подделать позиции гонки`)
        return player.notify("Данные некорректны", 'error');
    }
    if (typeof starts !== "object"){
        system.saveLog('codeInjection', `${user.name} ${user.id} Попытался подделать стартовые точки гонки`)
        return player.notify("Данные некорректны", 'error');
    }
    if (!RACE_TYPE_ARR.includes(type)){
        system.saveLog('codeInjection', `${user.name} ${user.id} Попытался подделать тип гонки`)
        return player.notify("Тип трассы некорректный", 'error');
    }
    map.type = type;
    map.pos = pos;
    map.starts = starts
    map.save().then(() => {
        player.notify("Трасса сохранена", "success");
    }).catch(err => {
        player.notify("Возникла ошибка", "error");
        system.debug.error(`Возникла ошибка при сохранении карты #${map.id} игроком ${user.name} ${user.id}`);
        system.debug.error(err);
    });
    
})
CustomEvent.registerClient('raceedit:exit', (player) => {
    const user = player.user;
    if(!user) return;
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0)
})
