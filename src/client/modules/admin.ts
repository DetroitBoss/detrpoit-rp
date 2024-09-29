import {cursorX, cursorY, disableControlGroup, raycastTarget, registerHotkey, tempCursorStatus} from "./controls";
import {currentMenu, DialogInput, MenuClass} from "./menu";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {inventoryShared} from "../../shared/inventory";
import {gui, inputOnFocus} from "./gui";
import {system} from "./system";
import {vehicles} from "./vehicles";
import {selectItem} from "./inventory";
import {vehicleSpawnPoints} from "../../shared/npc.park.zone";
import {CAMERA_WAYPOINTS} from "../../shared/cameraWaypoints";
import {CamerasManager, drawCameraConf} from "./cameraManager";
import {DialogAccept} from "./accept";
import {GANGWAR_RADIUS, GANGWAR_ZONES} from "../../shared/gangwar";
import {ATTACH_BONES_LIST} from "../../shared/attach.system";
import {createDress} from "./cloth";
import SplineCameraGUI from "./splineCamera";

const player = mp.players.local

CustomEvent.register('admin', () => {
    adminMenu()
})

let inSp:PlayerMp;
let inSpId: number;
let spError = false;

export const inSpectatorMode = () => {
    return inSp;
}


// mp.keys.bind(0x72, false, () => { // F3
//     if(user.admin_level == 0) return;
//     if (!mp.game.recorder.isRecording()) {
//         mp.game.recorder.start(1);
//     } else {
//         mp.game.recorder.stop(true);
//     }
// });

let currentQuickAdmin = false;
mp.keys.bind(48, true, () => {
    if(!user.isAdminNow()) return;
    if(gui.currentGui) return;
    if(inputOnFocus) return;
    currentQuickAdmin = !currentQuickAdmin;
    tempCursorStatus(currentQuickAdmin)
    sendAdminPanelData();
})

mp.keys.bind(113, true, () => {
    if (!user.isAdminNow()) return;
    if (gui.currentGui) return;
    if (inputOnFocus) return;

    CustomEvent.triggerServer('mainmenu:open', true);
    setTimeout(() => {
        CustomEvent.triggerCef('ticket:selectFirstFree', true);
    }, 500)
})

setInterval(() => {
    if(!user.isAdminNow()) return;
    if(!currentQuickAdmin) return;
    sendAdminPanelData()
}, 10000)

const sendAdminPanelData = (id?: number) => {
    CustomEvent.triggerCef('admin:panel:show', currentQuickAdmin, currentQuickAdmin ? system.sortArrayObjects(mp.players.toArray().filter(player => player.getVariable('id')).map(q => {
        return {
            id: q.getVariable('id'),
            name: q.getVariable('name'),
            dist: system.distanceToPos(mp.players.local.position, q.position)
        }
    }), [
        {id: 'dist', type: 'ASC'}
    ]).map(player => {
        return [player.id, player.name]
    }) : [], id)
}

mp.events.addDataHandler("admin:freeze", async (target: VehicleMp, val: boolean) => {
    if(target.type !== "player") return;
    target.freezePosition(val)
})

mp.events.add('entityStreamIn', async (target: PlayerMp) => {
    if (target.type !== "player") return;
    if (!target.getVariable('admin:freeze')) return;
    target.freezePosition(true);
});

mp.events.add('render', () => {
    if(player.getVariable('admin:freeze')) disableControlGroup.allControls()
})

CustomEvent.registerServer('admin:sp', (pos: [number, number, number], remoteId: number, id: number) => {
    const target = mp.players.atRemoteId(remoteId);
    if(!target && !target.handle) return user.notify("Вы не можете за ним наблюдать", 'error');
    inSp = target
    inSpId = id
    spError = true;
    currentQuickAdmin = true;
    tempCursorStatus(true)
    sendAdminPanelData(id)
    player.setCoords(pos[0], pos[1], pos[2], true, true, true, true)
    setTimeout(() => {
        spError = false;
    }, 5000)
});

mp.events.add('admin:spectate:stop', (returnMe, tpHim, id) => {
    CustomEvent.triggerServer('admin:spectate:stop', returnMe, tpHim, id)
    stop();
})

const stop = () => {
    inSp = null;
    inSpId = null;
    spError = true;
    CustomEvent.triggerCef('admin:spectate:stop')
    user.notify('Наблюдение прервано', 'error');
    if(currentQuickAdmin) sendAdminPanelData();
}

mp.events.add('render', () => {
    if(!inSp) return;
    if(!user.isAdminNow()){
        stop()
        CustomEvent.triggerServer('admin:spectate:stop')
        return;
    }
    if(!spError && (!mp.players.exists(inSp) || !inSp.handle || player.position.z > 2000)){
        spError = true;
        CustomEvent.triggerServer('admin:spectate:problem', inSpId)
        return;
    }
    if(mp.players.exists(inSp) && inSp.handle){
        const pos = inSp.position;
        const h = inSp.getHeading();
        if(pos) player.setCoords(pos.x - 5, pos.y, pos.z - 10, true, true, true, true)
        if(h) player.setHeading(h);
        mp.game.invoke('0x8BBACBF51DA047A8', inSp.handle)
    }
})


export let debug = false;



let anticheatNotify = true;

function adminMenu() {
    if (!user.admin_level) return;
    let m = new MenuClass('', 'Действия');
    m.spriteName = "admin"
    m.exitProtect = true;
    m.newItem({
        name: user.enabledAdmin ? "Выключить админ-мод" : "Включить админ-мод",
        onpress: async () => {
            if(user.enabledAdmin && noClipEnabled) return user.notify('Выйдите из режима NoClip прежде чем выключить админку', 'error')
            if(user.enabledAdmin && inSpectatorMode()) return user.notify('Выйдите из режима SP прежде чем выключить админку', 'error')
            const status = !user.enabledAdmin
            if(!status && currentQuickAdmin){
                currentQuickAdmin = false;
                sendAdminPanelData()
            }
            user.enabledAdmin = !user.enabledAdmin;
            let c = 0;
            while (c < 100 && status != user.enabledAdmin) {
                await system.sleep(10)
                c++;
            }
            adminMenu()
        }
    })
    if (user.enabledAdmin){
        m.newItem({
            name: "Список игроков",
            onpress: () => {
                usersList()
            }
        })
    }
    m.newItem({
        name: "Админ-чат",
        onpress: () => {
            m.close();
            gui.setGui('adminchat');
        }
    })
    m.newItem({
        name: "Чит-репорт",
        onpress: () => {
            m.close();
            gui.setGui('admincheat');
        }
    })
    if (!user.enabledAdmin) return m.open();
    m.newItem({
        name: "Уведомления от античита",
        more: anticheatNotify ? '~g~ON' : '~r~OFF',
        desc: 'Включает или выключает уведомления об срабатывании античита в чате',
        onpress: () => {
            anticheatNotify = !anticheatNotify;
            CustomEvent.triggerServer('anticheatNotify', anticheatNotify);
            adminMenu()
        }
    })
    m.newItem({
        name: "Имя над головой",
        onpress: () => {
            DialogInput('Введите новое имя', player.getVariable('adminName') || "", 15).then(name => {
                if(!name) return;
                name = system.filterInput(name);
                if(!name) return;
                CustomEvent.triggerServer('admin:setName', name)
            })
        }
    })
    m.newItem({
        name: "ТП на метку",
        onpress: () => {
            user.teleportWaypoint();
        }
    })
    m.newItem({
        name: "Транспорт",
        onpress: () => {
            vehicleMenu()
        }
    })
    if (user.hasPermission('admin:events:system')) {
        m.newItem({
            name: "Система мероприятий",
            onpress: () => {
                CustomEvent.triggerServer('admin:events:system')
            }
        })
    }
    if (user.hasPermission('admin:global:notify')) {
        m.newItem({
            name: "Админское оповещение игрокам",
            desc: 'Все игроки (в зависимости от выбора) получат уведомление от администрации в чат',
            type: 'list',
            list: ['Всем', 'В измерении'],
            onpress: (itm) => {
                m.close();
                DialogInput('Введите текст сообщения', '', 120, 'textarea').then(text => {
                    if(!text) return;
                    CustomEvent.triggerServer('admin:global:notify', text, !!itm.listSelected)
                })
            }
        })
        m.newItem({
            name: "Оповещение (Событие) игрокам",
            desc: 'Все игроки (в зависимости от выбора) получат уведомление (Событие) в чат',
            type: 'list',
            list: ['Всем', 'В измерении'],
            onpress: (itm) => {
                m.close();
                DialogInput('Введите текст сообщения', '', 120, 'textarea').then(text => {
                    if(!text) return;
                    CustomEvent.triggerServer('admin:globalevent:notify', text, !!itm.listSelected)
                })
            }
        })
    }
    if(user.hasPermission('admin:allheal')){
        m.newItem({
            name: "Исцелить всех в радиусе 50м",
            onpress: () => {
                CustomEvent.triggerServer('admin:allheal')
            }
        })
    }
    m.newItem({
        name: "Реконнект",
        onpress: () => {
            m.close();
            CustomEvent.triggerServer('admin:reconnect')
        }
    })
    
    m.newItem({
        name: "Полное восстановление",
        onpress: () => {
            m.close();
            CustomEvent.triggerServer('admin:fullrestore')
        }
    })
    m.newItem({
        name: "Убийства рядом (100m)",
        onpress: () => {
            m.close();
            CustomEvent.triggerServer('death:log')
        }
    })
    m.newItem({
        name: "Выйти",
        onpress: () => {
            m.close();
            CustomEvent.triggerServer('admin:quit')
        }
    })
    if (user.hasPermission('admin:gamedata:menu')) {
        m.newItem({
            name: "~y~Настройки сервера",
            onpress: () => {
                Serversettings()
            }
        })
    }
    m.newItem({
        name: "~c~Данные для разработки",
        onpress: () => {
            devData();
        }
    })
    m.open();
}
function Serversettings() {
    if (!user.admin_level) return;
    let m = new MenuClass('', 'Действия');
    if (user.hasPermission('admin:vehicle:configs')) {
        m.newItem({
            name: "~g~Конфиг транспорта",
            onpress: () => {
                CustomEvent.triggerServer('admins:vehicle:config')
            }
        })
    }
    if (user.hasPermission('admin:gamedata:menu')) {
        m.newItem({
            name: "~y~Добавление нового",
            onpress: () => {
                gameMenu()
            }
        })
    }
    if (user.hasPermission('admin:1xPromocodes:manage')) {
        m.newItem({
            name: "Одноразовые промокоды",
            onpress: () => {
                CustomEvent.triggerServer('admin:onetimePromo');
            }
        });
    }
    if (user.hasPermission('admin:mainmenu:ads')) {
        m.newItem({
            name: "Реклама в системном меню",
            onpress: () => {
                m.close();
                CustomEvent.triggerServer('admin:mainmenu:ads')
            }
        })
    }
    if (user.hasPermission('admin:x2func')) {
        m.newItem({
            name: "~k~ Функции X2",
            onpress: () => {
                m.close();
                CustomEvent.triggerServer('admin:x2func')
            }
        })
    }
    if(user.hasPermission('admin:familyControl')) {
        m.newItem({
            name: "Управление семьями",
            onpress: () => {
                m.close();
                CustomEvent.triggerServer('admin:familyControl')
            }
        })
    }
    if (user.hasPermission('admin:paydayglobal')) {
        m.newItem({
            name: "Выдать всем PayDay",
            desc: 'Произойдёт всё тоже самое, что и происходит автоматически каждый час. Все игроки получат ЗП, Мафии доход и прочее. Единственное - не будут работать проверки на отыгранное время и прочее',
            onpress: () => {
                m.close();
                DialogAccept('Вы уверены?', 'big').then(status => {
                    if(!status) return;
                    CustomEvent.triggerServer('admin:paydayglobal')
                })
            }
        })
    }
    if(user.hasPermission('admin:blacklist')){
        m.newItem({
            name: "Управление BlackList",
            onpress: () => {
                CustomEvent.triggerServer('admin:blacklist')
            }
        })
    }
    if(user.test){
        m.newItem({
            name: "WhiteList тестового сервера",
            onpress: () => {
                CustomEvent.triggerServer('users:whitelist')
            }
        })
    }
    if (user.hasPermission('admin:system:reboot')) {
        m.newItem({
            name: "~r~Меню перезагрузки сервера",
            onpress: () => {
                const submenu = new MenuClass("", "Меню перезагрузки сервера");
                submenu.spriteName = "admin"
                submenu.exitProtect = true;
                submenu.newItem({
                    name: "Запустить процедуру",
                    desc: "Выберите количество минут",
                    type: "range",
                    rangeselect: [0, 120],
                    onpress: (itm) => {
                        if (!user.hasPermission('admin:system:reboot')) return;
                        let code = system.randomStr(4, "QAZXDCFGHJKLVBNMRTYHJK")
                        DialogInput("Для подтверждения напишите код - " + code, "", 120).then(reason => {
                            if (!reason) return user.notify("Отмена", "success");
                            if (reason !== code) return;
                            if (!user.hasPermission('admin:system:reboot')) return;
                            MenuClass.closeMenu();
                            CustomEvent.triggerServer('admin:system:reboot', itm.listSelected)
                        })
                    }
                })
                submenu.newItem({
                    name: "Отменить текущий перезапуск",
                    onpress: (itm) => {
                        if (!user.hasPermission('admin:system:reboot')) return;
                        CustomEvent.triggerServer('admin:system:rebootstop')
                    }
                })
                submenu.newItem({
                    name: "Запустить процедуру обновления",
                    desc: 'Данная процедура работает только на тестовом сервере',
                    onpress: (itm) => {
                        if (!user.hasPermission('admin:system:reboot')) return;
                        CustomEvent.triggerServer('admin:system:update')
                    }
                })

                submenu.open();
            }
        })
    }

    m.open();
}
let lastSpawnModel = mp.storage.data.lastVehicle || null;
const vehicleMenu = () => {
    let m = new MenuClass('', "Транспорт");
    m.onclose = () => { adminMenu(); }
    m.spriteName = "admin"
    m.newItem({
        name: "Спавн ТС",
        onpress: () => {
            const spawnMethood = ["Оказаться в ТС", "Заспавнить не садясь в ТС"];
            let spawnMethoodSelect = 0;
            let headersList:string[] = ["Угол игрока"];
            for (let id = 1; id <= 360; id++) headersList.push(`${id}`)
            let headerSelect = 0;
            const submenu = new MenuClass('', 'Выбор ТС');
            submenu.onclose = () => { vehicleMenu(); }
            submenu.newItem({
                name: "Ввести название",
                onpress: () => DialogInput('Введите модель').then(async model => {
                    if (!model) return;
                    if(noClipEnabled) return user.notify('Выйдите из режима NoClip прежде чем спавнить ТС', 'error')
                    if (!mp.game.streaming.isModelAVehicle(mp.game.joaat(model))) return user.notify("Модель указана не верно", "error");
                    CustomEvent.triggerServer('admin:spawn:vehicle', model, spawnMethoodSelect, headerSelect)
                    let c = 0;
                    while (spawnMethoodSelect && !player.vehicle && c < 100) await system.sleep(20), c++;
                    lastSpawnModel = model;
                    mp.storage.data.lastVehicle = model;
                    vehicleMenu();
                })
            })
            submenu.newItem({
                name: "Метод спавна",
                type: "list",
                list: spawnMethood,
                listSelected: spawnMethoodSelect,
                onchange: (val) => {
                    spawnMethoodSelect = val;
                }
            })
            submenu.newItem({
                name: "Угол спавна",
                desc: 'Параметр определяет угол поворота транспорта при спавне. По умолчанию ТС будет повернут в ту сторону, куда смотрит игрок, однако если вы хотите заспавнить красиво несколько ТС, то лучше выбрать определённый угол поворота, чтобы весь транспорт смотрел в одну сторону',
                type: "list",
                list: headersList,
                listSelected: headerSelect,
                onchange: (val) => {
                    headerSelect = val;
                }
            })
            if (lastSpawnModel) {
                submenu.newItem({
                    name: "Спавн последней модели",
                    more: lastSpawnModel,
                    desc: 'Это последняя модель, которую вы спавнили через админку',
                    onpress: () => {
                        if(noClipEnabled) return user.notify('Выйдите из режима NoClip прежде чем спавнить ТС', 'error')
                        CustomEvent.triggerServer('admin:spawn:vehicle', lastSpawnModel, spawnMethoodSelect, headerSelect)
                    }
                })
            }
            submenu.open();

            
        }
    })
    m.newItem({
        name: "Очистка всех тс в радиусе 20м",
        onpress: () => {
            CustomEvent.triggerServer('admins:vehicle:respawnRange')
        }
    })
    if (player.vehicle) {
        m.newItem({
            name: 'Информация о ТС',
            onpress: () => {
                CustomEvent.triggerServer('admins:vehicle:info')
            }
        })
        m.newItem({
            name: "Топливо ТС",
            desc: "Изменить параметры топлива транспорта",
            onpress: () => {
                CustomEvent.triggerServer('admins:vehicle:fuel')
            }
        })
        m.newItem({
            name: "Покрасить ТС",
            desc: "Если ТС принадлежит игроку - перекраска будет сохранена",
            onpress: () => {
                CustomEvent.triggerServer('admins:vehicle:color')
            }
        })
    }
    m.newItem({
        name: "~r~Удалить/Респавн ближайшего ТС",
        desc: "ТС игрока или фракции отправится на точку респавна, а арендованный либо админский ТС будет удалён",
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify("Поблизости нет ТС", "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer('admins:vehicle:respawn', veh.remoteId, false)
        }
    })
    m.newItem({
        name: "~b~Респавн ближайшего ТС",
        desc: "Какой бы не был ТС - произойдёт респавн",
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify("Поблизости нет ТС", "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer('admins:vehicle:respawn', veh.remoteId, true)
        }
    })
    m.newItem({
        name: "~y~Ремонт ближайшего ТС",
        desc: "Какой бы не был ТС - произойдёт полный ремонт с восстановлением топлива и прочего",
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify("Поблизости нет ТС", "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer('admins:vehicle:fullFix', veh.remoteId)
        }
    })

    m.open()
}


const usersList = (name?: string) => {
    if (name) name = name.toLowerCase();
    let m = new MenuClass("Список игроков")
    m.onclose = () => { adminMenu(); }
    m.newItem({
        name: 'Поиск',
        more: name,
        onpress: () => {
            DialogInput("Введите имя или ID", name ? name : "").then(val => {
                if (val === null) return usersList(name)
                else return usersList(val);
            })
        }
    })
    m.newItem({
        name: '~r~Найти игрока оффлайн',
        onpress: () => {
            DialogInput("Введите ID игрока", null, 6, 'int').then(val => {
                if (val === null) return;
                if(val <= 0) return;
                CustomEvent.triggerServer('admin:users:choice', val)
            })
        }
    })
    m.newItem({
        name: mp.players.local.getVariable('name') + " (ВЫ)",
        more: `ID: ${mp.players.local.getVariable('id')}`,
        onpress: () => {
            CustomEvent.triggerServer('admin:users:choice', mp.players.local.getVariable('id'))
        }
    })
    mp.players.toArray().filter(player => player.getVariable('id') && user.id != player.getVariable('id') && (!name || player.getVariable('name').toLowerCase().includes(name) || parseInt(name) == player.getVariable('id'))).map(player => {
        const id = player.getVariable('id')
        m.newItem({
            name: player.getVariable('name'),
            more: `ID: ${id}`,
            onpress: () => {
                CustomEvent.triggerServer('admin:users:choice', id)
            }
        })
    })
    m.open();
}


const coordDebugData: [string, number][] = [
    ["Координаты", 0],
    ["Для обычного маркера", 1],
    ["Для плоского маркера", 0.9]
]

const drawDebugCoordString = (name: string, offset: number, type: number, withHeading: boolean) => {
    const crd = player.vehicle ? player.vehicle.position : player.position
    const pos = new mp.Vector3(crd.x, crd.y, crd.z - offset);
    const res = !type ? `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}${withHeading ? `, ${Math.floor(player.getHeading())}` : ''}` : `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}${withHeading ? `, h: ${Math.floor(player.getHeading())}` : ''}`
    DialogInput(name, res)
}

let debugPointsList: [Vector3Mp, number, MarkerMp, BlipMp][] = []

const clearPoints = () => {
    debugPointsList.map(item => {
        if (mp.markers.exists(item[2])) item[2].destroy();
        if (mp.blips.exists(item[3])) item[3].destroy();
    })
    debugPointsList = [];
}

export let adminDataDrawPlayers = false;
export let adminDataDrawVehicles = false;
export let adminDataDrawRange = 1;

const devData = () => {
    clearPoints();
    let m = new MenuClass("Блок данных")
    m.exitProtect = true;
    m.onclose = () => { adminMenu(); }
    m.newItem({ name: "Отладочные данные", onpress: () => { debug = !debug } })
    m.newItem({ name: "Данные по игрокам", desc: 'Отображает дополнительные данные о игроках', onpress: () => { adminDataDrawPlayers = !adminDataDrawPlayers } })
    m.newItem({ name: "Данные по ТС", desc: 'Отображает дополнительные данные о ТС', onpress: () => { adminDataDrawVehicles = !adminDataDrawVehicles } })
    m.newItem({ name: "Сплайн камера", desc: 'Управление сплайн камерой', onpress: SplineCameraGUI.createMenu})
    m.newItem({ name: "Множитель дистанции отрисовки", desc: 'Во сколько раз мы будем дальше показывать данные', onpress: () => {
        DialogInput('Введите множитель', adminDataDrawRange, 7, 'float').then(val => {
            if(!val) return;
            adminDataDrawRange = val;
        })
    } })

    m.newItem({ name: "~b~Раздел получения", onpress: () => { user.notify("Это не пункт, листайте ниже", "error") } });
    coordDebugData.map(([name, offset]) => {
        m.newItem({
            name: name,
            type: "list",
            list: ["Через запятую", "Объект", "Через запятую с углом", "Объект с углом"],
            onpress: (itm) => {
                if (itm.listSelected === 0) return drawDebugCoordString(name, offset, 0, false)
                if (itm.listSelected === 1) return drawDebugCoordString(name, offset, 1, false)
                if (itm.listSelected === 2) return drawDebugCoordString(name, offset, 0, true)
                if (itm.listSelected === 3) return drawDebugCoordString(name, offset, 1, true)
            }
        })
    })

    m.newItem({ name: "~b~Раздел сбора масива координат", onpress: () => { user.notify("Это не пункт, листайте ниже", "error") } });

    coordDebugData.map(([name, offset]) => {
        m.newItem({
            name: name,
            type: "list",
            list: ["Через запятую", "Объект", "Через запятую с углом", "Объект с углом"],
            onpress: (itm) => {
                const submenu = new MenuClass("Сбор коодинат", itm.listSelectedName);
                submenu.onclose = () => { devData()}
                submenu.newItem({
                    name: "Добавить точку",
                    onpress: () => {
                        const crd = player.vehicle ? player.vehicle.position : player.position
                        const pos = new mp.Vector3(crd.x, crd.y, crd.z - offset);
                        const pos2 = new mp.Vector3(crd.x, crd.y, crd.z + 1);
                        const marker = mp.markers.new(0, pos2, 2,
                            {
                                color: [255, 0, 0, 255],
                                dimension: player.dimension
                            })

                        const blip = mp.blips.new(164, pos2,
                            {
                                scale: 0.5,
                                color: 1,
                                dimension: player.dimension
                            })
                        
                        debugPointsList.push([pos, player.getHeading(), marker, blip])
                    }
                })

                submenu.newItem({
                    name: "Скопировать список",
                    onpress: () => {
                        const res = debugPointsList.map(q => {
                            let s = itm.listSelected === 0 || itm.listSelected === 2 ? [q[0].x.toFixed(2), q[0].y.toFixed(2), q[0].z.toFixed(2)] : { x: q[0].x.toFixed(2), y: q[0].y.toFixed(2), z: q[0].z.toFixed(2)}
                            if(itm.listSelected === 2 || itm.listSelected === 3){
                                if (itm.listSelected === 2) {
                                    (s as string[]).push(q[1].toFixed(0))
                                } else {
                                    (s as any).h = q[1].toFixed(0);
                                }
                            }
                            return s
                        })
                        DialogInput("Результат", JSON.stringify(res).replace(/}/g, '|').replace(/{/g, '|').replace(/\[/g, '|').replace(/]/g, '|').replace(/"/g, '').replace(/'/g, ''), 99999999, "textarea");
                        // user.notify("Данные скопированы в буфер обмена", "success")
                    }
                })

                submenu.newItem({
                    name: "Очистить список",
                    onpress: () => {
                        clearPoints();
                    }
                })


                submenu.open();
            }
        })
    })

    m.newItem({ name: "~b~Раздел специфических данных", onpress: () => { user.notify("Это не пункт, листайте ниже", "error") } });

    m.newItem({
        name: 'Конфиг для стула',
        desc: 'Данный пункт позволяет создать файл конфигурации для посадки на стул. При открытии вас попросит указать handle объёкта. Этот параметр уникален для вашего клиента, чтобы его получить - включите отладочный режим и наведите курсор на нужный объёкт. Сверху будет написан Handle выделеного объекта',
        onpress: () => {
            generateChairConfig()
        }
    })
    m.newItem({
        name: 'Конфиг для игрока в багажнике',
        desc: 'Данный пункт позволяет создать файл конфигурации для того, чтобы в багажник машины можно было закинуть игрока. Так же если машина будет прописана в этом конфиге - то можно будет просто визуально открывать и закрывать багажник',
        onpress: () => {
            generatePlayerInVehicleConfig()
        }
    })
    m.newItem({
        name: 'Конфиг атача предмета',
        desc: 'Данный пункт позволяет настроить корректное крепление предмета инвентаря к руке.',
        onpress: () => {
            generateInventoryAttach()
        }
    })
    m.newItem({
        name: 'Конфиг одежды',
        desc: 'Позволяет посмотреть как выглядит одежда',
        onpress: () => {
            createDress(true)
        }
    })
    m.newItem({
        name: 'Тест анимации',
        desc: 'Данный пункт позволяет посмотреть как будут выглядеть анимации',
        onpress: () => {
            generateAnimConfig()
        }
    })
    m.newItem({
        name: 'Тест сценария',
        desc: 'Данный пункт позволяет посмотреть как будут выглядеть сценарий',
        onpress: () => {
            generateScenarioConfig()
        }
    })
    m.newItem({
        name: 'Тест камеры',
        desc: 'Данный пункт позволяет посмотреть как будет двигаться камера',
        onpress: () => {
            const submenu = new MenuClass('Список');
            submenu.onclose = () => {
                devData();
            }

            CAMERA_WAYPOINTS.map(item => {
                submenu.newItem({
                    name: `${item.id}`,
                    onpress: () => {
                        submenu.close();
                        drawCameraConf(item);
                    }
                })
            })

            submenu.open();
        }
    })
    m.newItem({
        name: 'Угол поворота камеры',
        desc: '',
        onpress: () => {
            const rot = CamerasManager.gameplayCam.getRot(2)
            DialogInput('Скопируйте данные', `rx: ${rot.x}, ry: ${rot.y}, rz: ${rot.z}`);
        }
    })
    m.newItem({
        name: 'Хеш текущего оружия',
        desc: 'Этот хеш необходим для конфига урона',
        onpress: () => {
            DialogInput('Скопируйте данные', mp.game.invoke('0x0A6DB4965674D243', player.handle));
        }
    })
    m.newItem({
        name: 'Парковочные точки NPC',
        desc: 'Просмотр и телепорт по парковочным точкам NPC',
        onpress: () => {
            let search: string;
            const ops = () => {
                const submenu = new MenuClass("Парковочные точки");
                submenu.onclose = () => {
                    devData();
                }
                submenu.newItem({
                    name: `Поиск`,
                    more: `${search}`,
                    onpress: () => {
                        DialogInput('Введите ID для поиска', `${search}`, 5, 'text').then(res => {
                            if (res === null) return ops();
                            search = res;
                            ops();
                        })
                    }
                })
                vehicleSpawnPoints.filter(q => !search || search.includes(q.id.toString())).map(q => {
                    submenu.newItem({
                        name: `${q.id}`,
                        desc: 'Нажмите ENTER чтобы телепортироваться на точку',
                        onpress: () => {
                            user.teleport(q.x, q.y, q.z);
                        }
                    })
                })
    
                submenu.open();
            }
            ops();
        }
    })

    m.open();
}

const generateInventoryAttach = () => {
    selectItem().then(async item_id => {
        if(!item_id) return devData();
        const cfg = inventoryShared.get(item_id);
        if (!cfg) return devData();
        const m = new MenuClass("Создание конфига атача", "Параметры");
        m.exitProtect = true;


        const weaponCfg = inventoryShared.getWeaponConfigByItemId(cfg.item_id)
        const weaponHash = weaponCfg && weaponCfg.ammo_max ? weaponCfg.hash : null;
        const model = weaponHash ? mp.game.joaat(weaponHash) : mp.game.joaat(cfg.prop)

        if(weaponHash){
            let c = 0;
            mp.game.weapon.requestWeaponAsset(model, 31, 0);
            while (!mp.game.weapon.hasWeaponAssetLoaded(model) && c < 200) await system.sleep(100), c++;
        } else {
            if(!mp.game.streaming.hasModelLoaded(model)){
                let c = 0;
                mp.game.streaming.requestModel(model)
                while(!mp.game.streaming.hasModelLoaded(model) && c < 200) await system.sleep(10), c++;
            }
        }

        let objectH = !weaponHash ? mp.game.object.createObject(model, player.position.x, player.position.y, player.position.z - 10, true, true, true) : mp.game.weapon.createWeaponObject(model, 120, player.position.x, player.position.y, player.position.z + 3, true, 0, 0);

        let object = mp.objects.newWeak(objectH);

        let c = 0;
        let [x, y, z, rx, ry, rz] = cfg.propAttachParam || [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        while (c < 100 && !object.handle) await system.sleep(10), c++;
        
        m.exitProtect = true;
        m.onclose = () => { 
            devData() 
        }
        let boneId = 18905
        const attach = () => {
            object.attachTo(player.handle, player.getBoneIndex(boneId), x, y, z, rx, ry, rz, false, false, false, false, 2, true);
        }
        attach();
        let variants: number[] = []
        let variantsStr: string[] = [];
        for(let s = -2; s <= 2; s+=0.005){
            variants.push(s);
            variantsStr.push(s.toFixed(3));
        }
        let variantsR: number[] = []
        let variantsRStr: string[] = [];
        for(let s = 0; s <= 360; s++){
            variantsR.push(s);
            variantsRStr.push(s.toFixed(0));
        }
        m.newItem({
            name: 'Часть тела',
            type: 'list',
            list: ATTACH_BONES_LIST.map(q => `${q[0]} | ${q[1]}`),
            listSelected: ATTACH_BONES_LIST.findIndex(q => q[1] === boneId),
            onchange: (val) => {
                boneId = ATTACH_BONES_LIST[val][1]
                attach();
            }
        })
        m.newItem({
            name: 'X',
            type: 'list',
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= x),
            onchange: (val) => {
                let p = variants[val];
                x = p;
                attach();
            }
        })
        m.newItem({
            name: 'Y',
            type: 'list',
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= y),
            onchange: (val) => {
                let p = variants[val];
                y = p;
                attach();
            }
        })
        m.newItem({
            name: 'Z',
            type: 'list',
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= z),
            onchange: (val) => {
                let p = variants[val];
                z = p;
                attach();
            }
        })
        m.newItem({
            name: 'RX',
            type: 'list',
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= rx),
            onchange: (val) => {
                let p = variantsR[val];
                rx = p;
                attach();
            }
        })
        m.newItem({
            name: 'RY',
            type: 'list',
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= ry),
            onchange: (val) => {
                let p = variantsR[val];
                ry = p;
                attach();
            }
        })
        m.newItem({
            name: 'RZ',
            type: 'list',
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= rz),
            onchange: (val) => {
                let p = variantsR[val];
                rz = p;
                attach();
            }
        })
        m.newItem({
            name: '~g~Данные',
            onpress: () => {
                DialogInput('Скопируйте данные', `[${boneId}, ${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}, ${rx.toFixed(0)}, ${ry.toFixed(0)}, ${rz.toFixed(0)}]`)
            }
        })
        m.open();
        let int = setInterval(() => {
            if(!currentMenu || currentMenu.id !== m.id){
                object.destroy();
                clearInterval(int)
            }
        }, 1000)
    })
}

const generateScenarioConfig = (scenario?:string, name: string = "") => {
    const m = new MenuClass("Создание конфига анимаций", "Параметры");
    m.exitProtect = true;
    m.onclose = () => { devData() }
    m.newItem({
        name: "~r~Остановить сценарий",
        onpress: () => {
            user.stopAnim();
        }
    })
    m.newItem({
        name: "~g~Воспроизвести сценарий",
        onpress: () => {
            if (!scenario) return user.notify("Укажите название сценария", "error")
            user.playScenario(scenario)
        }
    })
    // m.newItem({
    //     name: "~g~Сохранить конфиг",
    //     onpress: () => {
    //         if(!dict) return user.notify("Укажите каталог анимации", "error")
    //         if (!anim) return user.notify("Укажите название анимации", "error")
    //         if (!name) return user.notify("Укажите название для конфига", "error")
    //         DialogInput("Параметры", `"${name}": [${upper}, [["${dict}", "${anim}", 1]], ${looping}]`).then(() => {
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: "Сценарий",
        more: scenario || "~r~Не указан",
        onpress: () => {
            DialogInput("Укажите сценарий", scenario, 120).then(val => {
                if (val) scenario = val
                generateScenarioConfig(scenario, name)
            })
        }
    })
    // m.newItem({
    //     name: "Название для конфига",
    //     more: name || "~r~Не указано",
    //     onpress: () => {
    //         DialogInput("Укажите название сценария", name).then(val => {
    //             if (val) name = val
    //             generateScenarioConfig(scenario, name)
    //         })
    //     }
    // })

    m.open();
}

const generateAnimConfig = (dict?:string, anim?:string, upper = false, looping = false, name: string = "") => {
    const m = new MenuClass("Создание конфига анимаций", "Параметры");
    m.onclose = () => { devData() }
    m.exitProtect = true;
    m.newItem({
        name: "~r~Остановить анимацию",
        onpress: () => {
            user.stopAnim();
        }
    })
    m.newItem({
        name: "~g~Воспроизвести анимацию",
        onpress: () => {
            if(!dict) return user.notify("Укажите каталог анимации", "error")
            if (!anim) return user.notify("Укажите название анимации", "error")
            user.playAnim([[dict, anim]], upper, looping);
        }
    })
    // m.newItem({
    //     name: "~g~Сохранить конфиг",
    //     onpress: () => {
    //         if(!dict) return user.notify("Укажите каталог анимации", "error")
    //         if (!anim) return user.notify("Укажите название анимации", "error")
    //         if (!name) return user.notify("Укажите название для конфига", "error")
    //         DialogInput("Параметры", `"${name}": [${upper}, [["${dict}", "${anim}", 1]], ${looping}]`).then(() => {
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: "Каталог",
        more: dict || "~r~Не указана",
        onpress: () => {
            DialogInput("Укажите каталог анимации", dict, 120).then(val => {
                if(val) dict = val
                generateAnimConfig(dict, anim, upper, looping, name)
            })
        }
    })
    m.newItem({
        name: "Название",
        more: anim || "~r~Не указано",
        onpress: () => {
            DialogInput("Укажите название анимации", anim, 120).then(val => {
                if (val) anim = val
                generateAnimConfig(dict, anim, upper, looping, name)
            })
        }
    })
    // m.newItem({
    //     name: "Название для конфига",
    //     more: name || "~r~Не указано",
    //     onpress: () => {
    //         DialogInput("Укажите название анимации", name).then(val => {
    //             if (val) name = val
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: "Только верхняя часть тела",
        type: 'list',
        list: ["Нет", "Да"],
        listSelected: upper ? 1 : 0,
        onchange: (val) => {
            upper = val ? true : false
        }
    })
    m.newItem({
        name: "Зациклить анимацию",
        type: 'list',
        listSelected: looping ? 1 : 0,
        list: ["Нет", "Да"],
        onchange: (val) => {
            looping = val ? true : false
        }
    })

    m.open();
}

const generatePlayerInVehicleConfig = (cfg?: { offset: { x: number, y: number, z: number }, rot: { x: number, y: number, z: number }, place: { x: number, y: number, z: number }}) => {
    cfg = {
        offset: {x: 0, y: 0, z: 0},
        rot: {x: 0, y: 0, z: 0},
        place: {x: 0, y: 0, z: 0},
    }
    let veh: VehicleMp;
    mp.vehicles.forEachInStreamRange(vehicle => {
        if (veh && system.distanceToPos(player.position, veh.position) < system.distanceToPos(player.position, vehicle.position)) return;
        if (system.distanceToPos(player.position, vehicle.position) > 5) return;
        veh = vehicle;
    })
    if(!veh) return user.notify("Поблизости должен быть ТС, для которого будете создавать конфиг", "error")
    const handle = veh.handle;
    if (!handle) return devData();
    if (veh.getBoneIndexByName('boot') == -1) return user.notify("У данного ТС нет багажника", "error");
    if (veh.getBoneIndexByName('engine') == -1) return user.notify("Для данного ТС нельзя сделать закидку в багажник", "error");
    const m = new MenuClass("Создание конфига багажника", "Настройки");
    m.exitProtect = true;
    m.onclose = () => {
        user.stopAnim();
        player.resetAlpha();
        player.detach(false, false)
        devData();
    }
    const fix = () => {
        if(!mp.vehicles.exists(veh)) return;
        user.playAnim([["amb@world_human_bum_slumped@male@laying_on_right_side@idle_a", "idle_a"]], false, true);
        player.attachTo(handle, veh.getBoneIndexByName('engine'), cfg.offset.x, cfg.offset.y, cfg.offset.z, cfg.rot.x, cfg.rot.y, cfg.rot.z, true, true, false, true, 1, true)
        const pos = veh.getOffsetFromGivenWorldCoords(cfg.place.x, cfg.place.y, cfg.place.z)
    }

    fix();

    m.onclose = () => { devData() }
    m.newItem({
        name: "Открыть/Закрыть багажник",
        onpress: () => {
            if (veh.getDoorAngleRatio(5) === 0){
                veh.setDoorOpen(5, false, true)
            } else {
                veh.setDoorShut(5, false)
            }
        }
    })
    m.newItem({
        name: "ТС",
        more: veh.getVariable('modelname')
    })
    let coords: string[] =[]
    let coordsN: number[] =[]
    for (let id = -5; id <= 5; id += 0.02) coords.push(`${id.toFixed(2)}`), coordsN.push(id)
    let rots: string[] =[]
    let rotsN: number[] =[]
    for (let id = -360; id <= 360; id += 1) rots.push(`${id.toFixed(0)}`), rotsN.push(id)
    m.newItem({
        name: "Координата X",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.x = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Координата Y",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.y = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Координата Z",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.z = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Угол X",
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.x = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Угол Y",
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.y = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Угол Z",
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.z = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Координата рядом X",
        desc: "Эта координата нужна для определения точки около которой можно юзать багажник",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.x = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Координата рядом Y",
        desc: "Эта координата нужна для определения точки около которой можно юзать багажник",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.y = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "Координата рядом Z",
        desc: "Эта координата нужна для определения точки около которой можно юзать багажник",
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.z = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: "~g~Сохранить",
        onpress: () => {
            DialogInput('Вот параметры', `x: ${cfg.offset.x.toFixed(2)}, y: ${cfg.offset.y.toFixed(2)}, z: ${cfg.offset.z.toFixed(2)}, model: ${veh.getVariable('modelname')}, rot_x: ${cfg.rot.x.toFixed(2)}, rot_y: ${cfg.rot.y.toFixed(2)}, rot_z: ${cfg.rot.z.toFixed(2)}, place_x: ${cfg.place.x.toFixed(2)}, place_y: ${cfg.place.y.toFixed(2)}, place_z: ${cfg.place.z.toFixed(2)}`)
        }
    })
    m.open();
    
}

const generateChairConfig = (handle?:number, cfg?:{heading: number, offset: {x: number, y: number, z: number}, needTp: number}) => {
    cfg = {
        heading: 180,
        offset: {x: 0, y: 0, z: 0},
        needTp: 0,
    }
    let dict = '';
    let anim = '';
    DialogInput("Handle объёкта", handle, 40, "int").then(handle => {
        if (!handle) return devData();
        const m = new MenuClass("Создание конфига посадки", "Настройки");
        m.onclose = () => {
            user.stopAnim();
            devData();
        }
        m.exitProtect = true;
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        const model = mp.game.invoke('0x9F47B058362C84B5', handle)

        const fix = () => {
            let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, cfg.offset.x, cfg.offset.y, cfg.offset.z);
            if(dict && anim){
                player.setCoordsNoOffset(posres.x, posres.y, posres.z, true, true, true);
                player.setHeading(heading.x + cfg.heading);
                user.playAnim([[dict, anim]], false, true);
            } else {
                user.playScenario("PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", posres.x, posres.y, posres.z, heading.x + cfg.heading, true)
            }
        }

        fix();

        m.onclose = () => { devData() }
        m.newItem({
            name: "Handle объёкта",
            more: handle
        })
        m.newItem({
            name: "Model объёкта",
            more: model
        })
        m.newItem({
            name: "Угол",
            type: "range",
            rangeselect: [0, 359],
            listSelected: 180,
            onchange: (val) => {
                cfg.heading = val;
                fix();
            }
        })
        let coords: string[] =[]
        let coordsN: number[] =[]
        for (let id = -5; id <= 5; id += 0.02) coords.push(`${id}`), coordsN.push(id)
        m.newItem({
            name: "Координата X",
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.x = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: "Координата Y",
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.y = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: "Координата Z",
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.z = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: "Нужен телепорт",
            type: "list",
            list: ["Не нужен", "Нужен"],
            desc: "При включении этого параметра игрок будет мгновенно телепортирован к пропу вместо того, чтобы спокойно к нему подойти",
            onchange: (val) => {
                cfg.needTp = val
                fix();
            }
        })
        m.newItem({
            name: "Категория анимации",
            desc: "Указывайте если нужна",
            onpress: (val) => {
                DialogInput('Введите папку', dict, 240, 'textarea').then(val => {
                    if(typeof val !== 'string') return;
                    dict = val;
                })
            }
        })
        m.newItem({
            name: "Название анимации",
            desc: "Указывайте если нужна",
            onpress: (val) => {
                DialogInput('Введите название', anim, 240, 'textarea').then(val => {
                    if(typeof val !== 'string') return;
                    anim = val;
                })
            }
        })
        m.newItem({
            name: "~g~Сохранить",
            onpress: () => {
                DialogInput('Вот параметры', `x: ${cfg.offset.x.toFixed(2)}, y: ${cfg.offset.y.toFixed(2)}, z: ${cfg.offset.z.toFixed(2)}, h: ${cfg.heading}, model: ${model}, needTp: ${cfg.needTp ? 'true' : 'false'}`)
            }
        })
        m.open();
    })
}


const gameMenu = () => {
    if (!user.hasPermission('admin:gamedata:menu')) return user.notify('У вас нет доступа', "error");
    let m = new MenuClass("Игровые данные")
    m.onclose = () => { adminMenu(); }
    m.exitProtect = true;
    if (user.hasPermission('admin:weather:set')) m.newItem({ name: "Управление временем", onpress: () => { m.close(); CustomEvent.triggerServer('admin:weather:control') } })
    if (user.hasPermission('admin:gamedata:createbiz')) m.newItem({ name: "Бизнес", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:createbiz') } })
    if (user.hasPermission('admin:gamedata:newhouse')) m.newItem({ name: "Новый дом", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:newhouse') } })
    if (user.hasPermission('admin:gamedata:newwarehouse')) m.newItem({ name: "Новый склад для игроков", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:newwarehouse') } })
    if (user.hasPermission('admin:gamedata:dress')) m.newItem({ name: "~y~Каталог одежды", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:dress') } })
    if (user.hasPermission('admin:gamedata:lsc')) m.newItem({ name: "Конфиг ЛСК", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:lsc') } })
    if (user.hasPermission('admin:chest:accessRemote')) m.newItem({ name: "Каталог фракционных складов", onpress: () => { m.close(); CustomEvent.triggerServer('admin:chest:accessRemote') } })
    if (user.hasPermission('admin:garage:accessRemote')) m.newItem({ name: "Каталог фракционных гаражей", onpress: () => { m.close(); CustomEvent.triggerServer('admin:fraction:garage') } })
    if (user.hasPermission('admin:chestorder:access')) m.newItem({ name: "Каталог складов для заказа", desc: "Это склады, из которых фракция заказывает себе товары в свой склад", onpress: () => { m.close(); CustomEvent.triggerServer('admin:chestorder:access') } })
    if (user.hasPermission('admin:moneychest:access')) m.newItem({ name: "Каталог сейфов", onpress: () => { m.close(); CustomEvent.triggerServer('admin:moneychest:access') } })
    if (user.hasPermission('admin:safezones')) m.newItem({ name: "Переключение ЗЗ", onpress: () => { m.close(); CustomEvent.triggerServer('admin:safezone') } })
    if (user.hasPermission('admin:gamedata:restoregrab')) m.newItem({ name: "Управление точками ограбления", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:restoregrab') } })
    if (user.hasPermission('admin:gamedata:textworld')) m.newItem({ name: "Отрисовка текста в мире", onpress: () => { m.close(); CustomEvent.triggerServer('admin:gamedata:textworld') } })
    if (user.hasPermission('admin:jobdress')) m.newItem({ name: "Создать новый гардероб", onpress: () => { m.close(); CustomEvent.triggerServer('garderob:new') } })
    if (user.hasPermission('admin:boomboxblock')) m.newItem({ name: "Удалить песню из игнора", desc:'Необходимо указать идентификатор песни', onpress: () => {
            DialogInput('Укажите ID', ``, 10).then(val => {
                if(!val) return;
                CustomEvent.triggerServer('boombox:removeIgnore', val)
            })
        }})
    if(user.isAdminNow(6)){
        m.newItem({ name: "Запустить списание налогов", desc:'', onpress: () => {
                DialogAccept('Вы уверены?', `big`).then(val => {
                    if(!val) return;
                    CustomEvent.triggerServer('tax:admin')
                })
            }})
    }
    m.open();
}


const controlsIds = {
    F5: 74,
    W: 32,
    S: 33,
    A: 34,
    D: 35,
    Space: 321,
    Shift: 21,
    LCtrl: 326,
    SpeedUP: 38,
    SpeedDOWN: 44,
};

mp.events.addDataHandler("alpha", (entity: PlayerMp, value: number, oldValue) => {
    if (entity.type != "player") return;
    entity.setAlpha(value)
});
mp.events.add('entityStreamIn', (entity: PlayerMp) => {
    if (entity.type != "player") return;
    if (entity.getVariable('alpha')) entity.setAlpha(entity.getVariable('alpha'));
});

const fly = {
    flying: false,
    lockZ: false,
    f: 2.0,
    w: 2.0,
    h: 2.0,
};
const gameplayCam = mp.cameras.new('gameplay');

function switchFly(status: boolean) {
    if (status && mp.players.local.vehicle) return user.notify("Покиньте транспорт");
    fly.flying = !fly.flying;

    const player = mp.players.local;

    player.freezePosition(fly.flying);
    mp.players.local.setMaxSpeed(fly.flying ? 0 : 99999);
    if (!fly.flying && !mp.game.controls.isControlPressed(0, controlsIds.Space)) {
        let position = mp.players.local.position;
        position.z = mp.game.gameplay.getGroundZFor3dCoord(
            position.x,
            position.y,
            position.z,
            0.0,
            false
        );
        mp.players.local.setCoordsNoOffset(
            position.x,
            position.y,
            position.z,
            false,
            false,
            false
        );
        mp.game.streaming.requestCollisionAtCoord(position.x, position.y, position.z);
    }

    if (fly.flying) {
        user.notify(`Включён`, 'success', null, 2000, 'FLY Mode');
    }
    CustomEvent.triggerServer('flyMode', fly.flying);
}

setInterval(() => {
    if (fly.flying && !user.enabledAdmin) switchFly(false);
}, 1000)


//X
mp.keys.bind(0x58, true, function () {
    if (!user.login) return;
    if (!fly.flying) return;
    if (!user.enabledAdmin) return;
    fly.lockZ = !fly.lockZ
    user.notify(`Ось Z: ${fly.lockZ ? 'Зафиксирована' : 'Снята с фиксации'}`, fly.lockZ ? 'success' : 'error', null, 1000, 'FLY Mode');
});

mp.events.add('render', () => {
    if (!user.login) return;
    if (user.enabledAdmin) {
        if (mp.game.controls.isControlJustPressed(0, controlsIds.F5)) switchFly(!fly.flying);
    }
    if (user.login && fly.flying) {
        let controls = mp.game.controls;
        const direction = gameplayCam.getDirection();

        let updated = false;
        let position = mp.players.local.position;
        if (controls.isControlPressed(0, controlsIds.SpeedUP)) fly.f += 0.01;
        if (controls.isDisabledControlPressed(0, controlsIds.SpeedDOWN)) fly.f -= 0.01;

        if (fly.f < 0.1) fly.f = 0.1;
        if (fly.f > 20.0) fly.f = 20.0;

        const speed = controls.isControlPressed(0, controlsIds.Shift) ? fly.f * 3 : fly.f;

        if (controls.isControlPressed(0, controlsIds.W)) {
            position.x += direction.x * speed;
            position.y += direction.y * speed;
            if (!fly.lockZ) position.z += direction.z * speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.S)) {
            position.x -= direction.x * speed;
            position.y -= direction.y * speed;
            if (!fly.lockZ) position.z -= direction.z * speed;
            updated = true;
        }

        if (controls.isControlPressed(0, controlsIds.A)) {
            position.x += -direction.y * speed;
            position.y += direction.x * speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.D)) {
            position.x -= -direction.y * speed;
            position.y -= direction.x * speed;
            updated = true;
        }

        if (controls.isControlPressed(0, controlsIds.Space)) {
            position.z += speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
            position.z -= speed;
            updated = true;
        }

        if (updated) {
            mp.players.local.setMaxSpeed(99999999);
            mp.players.local.setCoordsNoOffset(
                position.x,
                position.y,
                position.z,
                false,
                false,
                false
            );
        } else {
            mp.players.local.setMaxSpeed(0);
        }
    }
});









let noClipEnabled = false;
let noClipSpeed = 1;
let noClipSpeedNames = ["Die", "Slow", "Medium", "Fast", "Very Fast", "Extremely Fast", "Snail Speed!"];

export const noClipSwitch = function () {
    noClip(!noClipEnabled);
}

export const noClip = function (enable: boolean) {
    if(inSpectatorMode()) return;
    noClipEnabled = enable;
    if (noClipEnabled)
        user.notify(`~b~Нажмите ~s~H~b~ чтобы выключить No Clip`);
};

export const isNoClipEnable = function () {
    return noClipEnabled;
};

export const getNoClipSpeedName = function () {
    return noClipSpeedNames[noClipSpeed];
};


registerHotkey(103, () => {
    if (!debug) return;
    if (!raycastTarget || !raycastTarget.entity) return user.notify("Выделите объект мышкой", "error");
    const entity = raycastTarget.entity
    const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", typeof entity === "number" ? entity : entity.handle)
    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', typeof entity === "number" ? entity : entity.handle, true)
    const model = typeof entity === "number" ? mp.game.invoke('0x9F47B058362C84B5', entity) : entity.model;

    const m = new MenuClass("Отладка объекта", "Информация по объекту");
    m.exitProtect = true;
    m.newItem({
        name: "Тип объекта",
        more: typeof entity === "number" ? "Игровой обычный" : "Сетевой "+entity.type
    })
    m.newItem({
        name: "Handle",
        desc: "Идентификатор объёкта в игровом мире, уникальный для вашего клиента",
        more: typeof entity === "number" ? entity : entity.handle,
        onpress: () => {
            DialogInput("", typeof entity === "number" ? entity : entity.handle)
        }
    })
    m.newItem({
        name: "Модель",
        desc: "Модель объекта",
        more: model,
        onpress: () => {
            DialogInput("", model)
        }
    })
    m.newItem({
        name: "Угол поворота",
        more: heading.x,
        onpress: () => {
            DialogInput("", heading.x)
        }
    })
    m.newItem({
        name: "Координаты",
        more: `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}`
    })
    m.newItem({
        name: "Скопировать",
        type: "list",
        list: ["Через запятую", "Объект", "Через запятую с углом", "Объект с углом"],
        onpress: (itm) => {
            let text = "";
            if (itm.listSelected == 0) text = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`
            if (itm.listSelected == 1) text = `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}`
            if (itm.listSelected == 2) text = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)} ${heading.x.toFixed(0)}`
            if (itm.listSelected == 3) text = `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}, h: ${heading.x.toFixed(0)}`
            DialogInput("Скопировать координаты", text)
        }
    })
    m.newItem({
        name: 'Конфиг для стула',
        desc: 'Данный пункт позволяет создать файл конфигурации для посадки на стул. При открытии вас попросит указать handle объёкта. Этот параметр уникален для вашего клиента, чтобы его получить - включите отладочный режим и наведите курсор на нужный объёкт. Сверху будет написан Handle выделеного объекта',
        onpress: () => {
            generateChairConfig(typeof entity === "number" ? entity : entity.handle)
        }
    })

    m.open();
})

mp.events.add('render', () => {
    if (debug) {
        let hitRaycast: number | ObjectMp;
        if (raycastTarget && raycastTarget.entity) {
            const entity = raycastTarget.entity;
            if (mp.gui.cursor.visible && !gui.currentGui) {
                gui.drawText3D(`${typeof entity === "number" ? entity : `${entity.type} ${entity.id}`} ${raycastTarget.position.x.toFixed(2)} ${raycastTarget.position.y.toFixed(2)} ${raycastTarget.position.z.toFixed(2)}`, raycastTarget.position.x, raycastTarget.position.y, raycastTarget.position.z);
                const dist = system.distanceToPos(mp.players.local.position, raycastTarget.position)
                if(dist < 10){
                    const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", typeof entity === "number" ? entity : entity.handle)
                    const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', typeof entity === "number" ? entity : entity.handle, true)
                    const model = typeof entity === "number" ? mp.game.invoke('0x9F47B058362C84B5', entity) : entity.model
                    gui.drawText(`SELECTED OBJECT HANDLE ${typeof entity === "number" ? entity : entity.handle} \nPOS ${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(2)}\nH ${heading.x.toFixed(2)} ${heading.y.toFixed(2)} ${heading.z.toFixed(2)}\nM: ${model}\nNum 7 - Info`, 0.5, 0.02, 0.2)
                }
                if (dist > 2) {
                    const middle = system.middlePoint3d(mp.players.local.position, raycastTarget.position);
                    gui.drawText3D(`${dist.toFixed(1)}m`, middle.x, middle.y, middle.z);
                }
                mp.game.graphics.drawLine(player.position.x, player.position.y, player.position.z, raycastTarget.position.x, raycastTarget.position.y, raycastTarget.position.z, 255, 0, 0, 255);
            }
            hitRaycast = entity as any;
        }
        const zoneGang = GANGWAR_ZONES.find(q => system.distanceToPos(player.position, q) < GANGWAR_RADIUS)
        gui.drawText(`POS ${player.position.x.toFixed(1)} ${player.position.y.toFixed(1)} ${player.position.z.toFixed(1)}\nH: ${Math.floor(player.getHeading())} | D ${player.dimension} Int ${user.interrior} In ${user.inInterrior}\nC ${mp.gui.cursor.visible} X ${cursorX.toFixed(2)} Y ${cursorY.toFixed(2)} ${hitRaycast ? `H ${hitRaycast}` : ''}${zoneGang ? ` | CAPT ${zoneGang.id}` : ''}`, 0.07, 0.5, 0.2)
    }
    if (noClipEnabled) {
        if(!user.isAdminNow()) return noClipEnabled = false;
        let noClipEntity = mp.players.local.isSittingInAnyVehicle() ? mp.players.local.vehicle : mp.players.local;

        noClipEntity.freezePosition(true);

        mp.game.controls.disableControlAction(0, 31, true);
        mp.game.controls.disableControlAction(0, 32, true);
        mp.game.controls.disableControlAction(0, 33, true);
        mp.game.controls.disableControlAction(0, 34, true);
        mp.game.controls.disableControlAction(0, 35, true);
        mp.game.controls.disableControlAction(0, 36, true);
        mp.game.controls.disableControlAction(0, 266, true);
        mp.game.controls.disableControlAction(0, 267, true);
        mp.game.controls.disableControlAction(0, 268, true);
        mp.game.controls.disableControlAction(0, 269, true);
        mp.game.controls.disableControlAction(0, 44, true);
        mp.game.controls.disableControlAction(0, 20, true);
        mp.game.controls.disableControlAction(0, 47, true);

        let yoff = 0.0;
        let zoff = 0.0;

        if (mp.game.controls.isControlJustPressed(0, 22)) {
            noClipSpeed++;
            if (noClipSpeed >= noClipSpeedNames.length)
                noClipSpeed = 0;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 32)) {
            yoff = 0.5;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 33)) {
            yoff = -0.5;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 34)) {
            noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z + 3, 0, true);
        }

        if (mp.game.controls.isDisabledControlPressed(0, 35)) {
            noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z - 3, 0, true);
        }

        if (mp.game.controls.isDisabledControlPressed(0, 44)) {
            zoff = 0.21;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 20)) {
            zoff = -0.21;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 74)) {
            if (!noClipEntity.getVariable('isTyping')) {
                noClipEnabled = false;
            }
        }

        let newPos = noClipEntity.getOffsetFromInWorldCoords(0, yoff * (noClipSpeed * 0.7), zoff * (noClipSpeed * 0.7));
        let heading = noClipEntity.getRotation(0).z;

        noClipEntity.setVelocity(0, 0, 0);
        noClipEntity.setRotation(0, 0, heading, 0, false);
        noClipEntity.setCollision(false, false);
        noClipEntity.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);

        noClipEntity.freezePosition(false);
        noClipEntity.setInvincible(false);
        noClipEntity.setCollision(true, true);
    }
});
