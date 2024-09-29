import {DialogInput, MenuClass} from "./menu"
import {system} from "./system";
import { ClothData, getBoneData, getPartName, GloveClothData, partsList, partsListAdmin } from "../../shared/cloth";
import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";
import {InventoryEquipList} from "../../shared/inventory";
import {mouseMove, MouseMoveSystem} from "./controls";
import { handleCamZoom } from './camera'

const player = mp.players.local
global.require('./dress.json.js');
export let dressData: InventoryEquipList;


export let dressCfg: {
    id: number;
    name: string;
    category: number;
    male: number;
    data: ClothData[][] | GloveClothData[];
}[] = (global as any).dressstatic ? (global as any).dressstatic : [];

const chunk = <T>(arr:T[], chunkSize:number) => {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}



CustomEvent.registerServer('dressData:remove', (id: number) => {
    CustomEvent.triggerCef('dressData:remove', id)
    dressCfg.map((item, index) => {
        if (item.id === id) dressCfg.splice(index, 1);
    })
})
CustomEvent.registerServer('dressData:new', (data: {
    id: number;
    name: string;
    category: number;
    male: number;
    data: ClothData[][];
}[]) => {
    CustomEvent.triggerCef('dressData:new', JSON.stringify(data))
    data.map(item => {
        let ind = dressCfg.findIndex(q => q.id === item.id);
        if(ind > -1){
            dressCfg[ind] = { ...dressCfg[ind], ...item};
        } else {
            dressCfg.push(item);
        }
    })
})

CustomEvent.registerServer('dress:data', (data: InventoryEquipList) => {
    dressData = data;
    CustomEvent.triggerCef('dress:data', dressData);
})

export const createDress = (test = false) => {
    let m = new MenuClass("Добавление одежды", "Категория");


    const list = test ? partsListAdmin : partsList
    const id = test ? -1 : 0
    list.map(item => {
        if (item[0] == 333){
            m.newItem({
                name: item[1],
                onpress: (itm, i) => {
                    m.close();
                    editCloth(id, 0, "", [
                        [
                            { component: 3, drawable: 0, texture: 0 },
                            { component: 8, drawable: 0, texture: 0 },
                            { component: 11, drawable: 0, texture: 0 },
                            ...list.filter(q => q[0] != 333 && q[0] != 3).map(q => {
                                return { component: q[0], drawable: 0, texture: 0 }
                            })
                        ]
                    ]);
                }
            })
        } else  if (item[0] == 3){
            m.newItem({
                name: item[1],
                onpress: (itm, i) => {
                    m.close();
                    editCloth(id, 0, "", [[
                        { component: 3, drawable: 0, texture: 0 },
                        { component: 8, drawable: 0, texture: 0 },
                        { component: 11, drawable: 0, texture: 0 },
                    ]]);
                }
            })
        } else if (item[0] === 1000) {
            m.newItem({
                name: item[1],
                onpress: () => {
                    m.close();
                    editGlove(id, 0, "", [generateStandardGloveData()])
                }
            })
        } else {
            m.newItem({
                name: item[1],
                onpress: (itm, i) => {
                    m.close();
                    editCloth(id, 0, "", [[{ component: item[0], drawable: 0, texture: 0 }]]);
                }
            })
        }
    })


    m.open();
}


export let oldClothData: { component: number, drawable: number, texture: number }[] = [];
let currentCamera: CameraMp;

export const generateClothData = () => {
    oldClothData = [];
    oldClothData.push({ component: 1, drawable: player.getDrawableVariation(1), texture: player.getTextureVariation(1) });
    for(let i = 3; i < 12; i++) oldClothData.push({ component: i, drawable: player.getDrawableVariation(i), texture: player.getTextureVariation(i) });

    oldClothData.push({ component: 100, drawable: player.getPropIndex(0), texture: player.getPropTextureIndex(0) });
    oldClothData.push({ component: 101, drawable: player.getPropIndex(1), texture: player.getPropTextureIndex(1) });
    oldClothData.push({ component: 102, drawable: player.getPropIndex(2), texture: player.getPropTextureIndex(2) });
    oldClothData.push({ component: 106, drawable: player.getPropIndex(6), texture: player.getPropTextureIndex(6) });
    oldClothData.push({ component: 107, drawable: player.getPropIndex(7), texture: player.getPropTextureIndex(7) });
}

export const resetCloth = () => {
    oldClothData.map(item => {
        setComponent(item.component, item.drawable, item.texture);
    })
}

export const resetClothData = () => {
    oldClothData = [];
}

let mouseMoveBlock: MouseMoveSystem;


export const undress = () => {
    setComponent(107, -1, -1)
    setComponent(106, -1, -1)
    setComponent(102, -1, -1)
    setComponent(101, -1, -1)
    setComponent(100, -1, -1)
    setComponent(7, 0, 0)
    setComponent(1, 0, 0)
    setComponent(6, !user.isMale() ? 35 : 34, 0)
    setComponent(4, !user.isMale() ? 15 : 14, 0)
    setComponent(3, 15, 0)
    setComponent(8, !user.isMale() ? 2 : 57, 0)
    setComponent(11, 15, 0)
}

let isZoomEnabled = true;
mp.events.add('cloth:toggleCameraZoom', (enableZoom: boolean) => {
    isZoomEnabled = enableZoom;
});

CustomEvent.registerServer('clothshop:open', async (id: number, name: string, type: number, dataIds: number[], donate: number, pos: {
    x: number;
    y: number;
    z: number;
    h: number;
}) => {
    
    generateClothData();
    player.setCoords(pos.x, pos.y, pos.z, true, true, true, true);
    player.setHeading(pos.h);
    if (gui.currentGui === "clothshop") return CustomEvent.triggerCef('cef:cloth_shop:init', id, name, type, JSON.stringify(dataIds), donate);
    gui.setGui("clothshop")
    if (!mouseMoveBlock) {
        mouseMoveBlock = mouseMove((right, down, leftKey, rightKey, posX, posY) => {
            if (posX > 0.21 && posX < 0.61) {
                if (right > 0.04 || right < -0.04) {
                    player.setHeading(player.getHeading() + (right * 2.5));
                }
            }
        }, 10)
    }
    setTimeout(() => {
        if(!gui.currentGui) return;
        CustomEvent.triggerCef('cef:cloth_shop:init', id, name, type, JSON.stringify(dataIds), donate);
        if(!currentCamera){
            const pos = player.getOffsetFromInWorldCoords(0, 2.5, 0);
            currentCamera = mp.cameras.new(
                'clothshop',
                pos,
                new mp.Vector3(0, 0, 0),
                20
            );
            

            currentCamera.pointAtPedBone(player.handle, 31086, 0, 0, 0, false);
            currentCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 2000, false, false);
            cameraCategory(0);
        }
    }, 1000)
});

mp.events.add('render', () => {
    if (!isZoomEnabled) {
        return;
    }

    handleCamZoom(currentCamera)
})

const cameraCategory = (id: number) => {
    if(!currentCamera || !mp.cameras.exists(currentCamera)) return;
    if(!id) id = 3;
    const cfg = getBoneData(id);
    if(!cfg) return;
    const pos = player.getOffsetFromInWorldCoords(cfg.x, cfg.y, cfg.z);
    currentCamera.setCoord(pos.x, pos.y, pos.z);
    currentCamera.pointAtPedBone(player.handle, cfg.bone, 0, 0, 0, false);
}

mp.events.add('cloth:category', (id: number) => {
    cameraCategory(id);
})

let lastDressDataRequest: number = system.timestampMS
mp.events.add('cloth:preview', async (datas: string, id?: number) => {
    resetCloth();

    const data = JSON.parse(datas)
    if (!data) return;

    if (id == null) {
        data.map((item:any) => {
            setComponent(item.component, item.drawable, item.texture);
        })
    } else {
        if (data.hasOwnProperty('texture')) {
            const currentTorso = player.getDrawableVariation(3);

            const currentGloveId = dressData.gloves
            if (currentTorso <= 15) {
                setComponent(1000, new Map<number, number>(data.torsoMap).get(currentTorso), data.texture);
            } else {
                if (system.timestampMS - lastDressDataRequest < 150) {
                    return
                }
                // Если другие перчатки надеты, находим конфиг одежды для текущих надетых перчаток
                const response = await CustomEvent.callServer('dress:getDressDataById', currentGloveId)
                if (!response) {
                    return user.notify('Ошибка')
                }
                lastDressDataRequest = system.timestampMS

                const defaultTorsoForCurrentGloves = response[0].torsoMap.find((t: [number, number]) => t[1] == currentTorso)[0]
                const glovesTorsoForTargetGloves = new Map<number, number>(data.torsoMap).get(defaultTorsoForCurrentGloves)
                setComponent(1000, glovesTorsoForTargetGloves, data.texture);
            }
        } else {
            data.map((item:any) => {
                setComponent(item.component, item.drawable, item.texture);
            })
        }
    }
})
mp.events.add('cloth:exit', () => {
    exitCloth()
})

export const exitCloth = () => {
    gui.setGui(null);
    resetCloth();
    CustomEvent.triggerServer('cloth:exit');
    if (currentCamera){
        currentCamera.destroy();
        currentCamera = null;
    }
    mp.game.cam.renderScriptCams(false, true, 500, true, true);
    oldClothData = [];
    if (mouseMoveBlock) mouseMoveBlock.destroy();
    mouseMoveBlock = null;
}
CustomEvent.registerServer('admin:cloth:edit', (data:string, page: number) => {
    MenuClass.closeMenu();
    let [category, id, price, name, cloth] = JSON.parse(data)

    if (category === 1000) {
        editGlove(id, price, name, (cloth as GloveClothData[]).map(glove => mapGloveDataFromServer(glove)));
    } else {
        editCloth(id, price, name, cloth, 0, page);
    }
})
CustomEvent.registerServer('admin:cloth:new', () => {
    createDress();
})

export const setComponent = (component: number, drawable: number, texture: number) => {
    if (drawable === undefined || texture === undefined)
        return
    
    if (component === 1000) {
        player.setComponentVariation(3, drawable, texture, 2)
    }

    if(component >= 100){
        component -= 100;
        player.setPropIndex(component, drawable, texture, true)
    } else {
        player.setComponentVariation(component, drawable, texture, 2)
    }
}

export const getComponent = (component: number) => {
    if(component >= 100){
        component -= 100;
        return {
            drawable: player.getPropIndex(component),
            texture: player.getPropTextureIndex(component),
        }
    } else {

        return {
            drawable: player.getDrawableVariation(component),
            texture: player.getTextureVariation(component),
        }

    }
}

let editVaration = 0;
const editCloth = (id: number, price: number, name: string, datas: { component: number, drawable: number, texture: number; name?: string}[][], cursor = 0, page?:number) => {
    try {
        if (oldClothData.length == 0) generateClothData();
        resetCloth();
        let submenu = new MenuClass("", "Добавление одежды");
        submenu.onclose = () => {resetCloth();}
        submenu.newItem({
            name: "СПИСОК ВАРИАЦИЙ"
        })
        datas.map((_, vars) => {
            submenu.newItem({
                name: `Вариация №${vars + 1}`,
                desc: `Номер вариации: ${vars + 1}`,
            })
            if (editVaration === vars){
                submenu.newItem({
                    name: "Выбран для предпросмотра",
                    desc: `Номер вариации: ${vars+1} | `+"Именно данный элемент будет отображатся на вас при изминениях. При редактировании остальных вариаций - на себе вы не увидите изменений"
                })
            } else {
                submenu.newItem({
                    name: "Предпросмотр",
                    desc: `Номер вариации: ${vars + 1} | ` +"Именно данный элемент будет отображатся на вас при изминениях. При редактировании остальных вариаций - на себе вы не увидите изменений",
                    onpress: (itm, i) => {
                        editVaration = vars;
                        editCloth(id, price, name, datas, i);
                    }
                })
            }
            submenu.newItem({
                name: "Название",
                more: datas[vars][0].name ? `${datas[vars][0].name}` : "~r~Необходимо указать",
                desc: `Номер вариации: ${vars + 1}`,
                onpress: (itm, i) => {
                    DialogInput("Введите значение", datas[vars][0].name, 35).then(val => {
                        if (!val) return editCloth(id, price, name, datas, i);
                        datas[vars][0].name = val;
                        editCloth(id, price, name, datas, i);
                    })
                }
            })
            submenu.newItem({
                name: `Удалить данную вариацию`,
                desc: `Номер вариации: ${vars + 1}`,
                onpress: (itm, i) => {
                    if (!vars) return user.notify("Данную вариацию удалить нельзя", "error");
                    datas.splice(vars, 1)
                    editVaration = 0;
                    editCloth(id, price, name, datas, i);
                    user.notify("Вариация удалена", "success");
                }
            })


            datas[vars].map((_, index) => {

                submenu.newItem({
                    name: `${getPartName(datas[vars][index].component)} (${datas[vars][index].component})`,
                    desc: `Номер вариации: ${vars + 1}`
                })
                submenu.newItem({
                    name: `Тип компонента (${datas[vars][index].component})`,
                    type: "range",
                    rangeselect: [0, system.biggestNumber(datas[vars][index].drawable, 999)],
                    listSelected: datas[vars][index].drawable,
                    desc: `Номер вариации: ${vars + 1}`,
                    onpress: (itm, i) => {
                        DialogInput("Введите значение", itm.listSelected, 5, "int").then(val => {
                            if (val === null || isNaN(val) || val < 0 || val > 999999999) return editCloth(id, price, name, datas, i);
                            datas[vars][index].drawable = val
                            editCloth(id, price, name, datas, i);
                        })
                    },
                    onchange: (val) => {
                        datas[vars][index].drawable = val;
                        if (editVaration === vars) setComponent(datas[vars][index].component, datas[vars][index].drawable, datas[vars][index].texture)
                    }
                })
                submenu.newItem({
                    name: `Текстура компонента (${datas[vars][index].component})`,
                    type: "range",
                    rangeselect: [0, system.biggestNumber(datas[vars][index].drawable, 999)],
                    listSelected: datas[vars][index].texture,
                    desc: `Номер вариации: ${vars + 1}`,
                    onpress: (itm, i) => {
                        DialogInput("Введите значение", itm.listSelected, 5, "int").then(val => {
                            if (val === null || isNaN(val) || val < 0 || val > 999999999) return editCloth(id, price, name, datas, i);
                            datas[vars][index].texture = val;
                            editCloth(id, price, name, datas, i);
                        })
                    },
                    onchange: (val) => {
                        datas[vars][index].texture = val;
                        if (editVaration === vars) setComponent(datas[vars][index].component, datas[vars][index].drawable, datas[vars][index].texture)
                    }
                })
            })


            
            submenu.newItem({
                name: `----------------`,
                desc: `Номер вариации: ${vars + 1}`,
            })
        })
        submenu.newItem({
            name: `~r~=== Общие параметры ===`
        })
        submenu.newItem({
            name: `Добавить вариацию`,
            onpress: (itm, i) => {
                if (datas.length >= 12) return user.notify("Не более 12 вариаций в одной шмотке", "error");
                const newitem = JSON.stringify(datas[datas.length - 1])
                datas.push(JSON.parse(newitem));
                editCloth(id, price, name, datas, i);
            }
        })
        
        submenu.newItem({
            name: "Название",
            more: name ? `${name}` : "~r~Необходимо указать",
            onpress: (itm, i) => {
                DialogInput("Введите значение", name, 35).then(val => {
                    if (!val) return editCloth(id, price, name, datas, i);
                    name = val;
                    editCloth(id, price, name, datas, i);
                })
            }
        })
        submenu.newItem({
            name: "Закупочная стоимость",
            more: price ? `${system.numberFormat(price)}` : "Нельзя будет закупать",
            onpress: (itm, i) => {
                DialogInput("Введите значение", price, 5, "int").then(val => {
                    if (val === null || isNaN(val) || val < 0 || val > 9999999) return editCloth(id, price, name, datas, i);
                    price = val;
                    editCloth(id, price, name, datas, i);
                })
            }
        })
        if(id !== -1){
            submenu.newItem({
                name: id ? "Обновить запись" : "Сохранить",
                onpress: (itm, i) => {
                    if (!name) return user.notify("Необходимо указать название одежды");
                    submenu.close();
                    resetCloth();
                    oldClothData = []
                    CustomEvent.triggerServer('admin:cloth:save', id, price, name, datas)
                }
            })
            if (id){
                submenu.newItem({
                    name: "Сохранить элемент как новый",
                    onpress: (itm, i) => {
                        if (!name) return user.notify("Необходимо указать название одежды");
                        // submenu.close();
                        // resetCloth();
                        // oldClothData = []
                        CustomEvent.triggerServer('admin:cloth:save', 0, price, name, datas, page)
                    }
                })
            }
        } else {
            submenu.newItem({
                name: "Сохранить нельзя, ибо это просто тестовый конструктор",
                desc: '',
            })
        }
        submenu.open(cursor);
        datas[editVaration].map(({ component, drawable, texture }) => {
            setComponent(component, drawable, texture)
        })
    } catch (error) {
        mp.console.logError(error)
    }
}

function mapGloveDataFromServer(data: GloveClothData): GloveClothDataEdit {
    return {
        name: data.name,
        texture: data.texture,
        torsoMap: new Map(data.torsoMap)
    }
}

function mapGloveDataToServer(data: GloveClothDataEdit): GloveClothData {
    return {
        name: data.name,
        texture: data.texture,
        torsoMap: Array.from(data.torsoMap.entries())
    }
}

interface GloveClothDataEdit {
    name: string,
    texture: number,
    torsoMap: Map<number, number>,
}

function generateStandardGloveData(): GloveClothDataEdit {
    return {
        name: '',
        texture: 0,
        torsoMap: new Map<number, number>(new Array(16)
            .fill(0)
            .map((value, index) => [index, null])
        )
    }
}

const editGlove = (id: number, price: number, name: string, gloveDates: GloveClothDataEdit[], cursor: number = 0, editingVariation: number = 0) => {
    const _menu = new MenuClass("", "Добавление перчаток");
    _menu.onclose = () => {
        resetCloth();
    }

    _menu.newItem({
        type: 'list',
        onchange: (value, item, index) => {
            editingVariation = index;
            editGlove(id, price, name, gloveDates, 1, editingVariation);
        },
        listSelected: editingVariation,
        list: gloveDates.map((data, index) => `${index} - ${data.name}`),
        name: 'Вариации',
    });

    _menu.newItem({
        name: '~g~Создать вариацию',
        onpress: () => {
            gloveDates.push(generateStandardGloveData())
            editingVariation = gloveDates.length - 1;
            editGlove(id, price, name, gloveDates, 0, editingVariation)
        }
    });

    _menu.newItem({
        name: 'Соотнесите торсы с перчатками',
    });

    editGloveVariationMenuBlock(_menu, gloveDates[editingVariation], (cursorIndex) => {
        editGlove(id, price, name, gloveDates, 3 + cursorIndex, editingVariation);
    });

    _menu.newItem({
        name: "Название",
        more: name ? `${name}` : "~r~Необходимо указать",
        onpress: (itm, i) => {
            DialogInput("Введите значение", name, 35).then(val => {
                if (!val)
                    return editGlove(id, price, name, gloveDates, i, editingVariation);

                name = val;
                editGlove(id, price, name, gloveDates, i, editingVariation);
            })
        }
    })

    _menu.newItem({
        name: "Закупочная стоимость",
        more: price ? `${system.numberFormat(price)}` : "Нельзя будет закупать",
        onpress: (itm, i) => {
            DialogInput("Введите значение", price, 5, "int").then(val => {
                if (val === null || isNaN(val) || val < 0 || val > 9999999)
                    return editGlove(id, price, name, gloveDates, i, editingVariation);

                price = val;
                editGlove(id, price, name, gloveDates, i, editingVariation);
            })
        }
    })

    if (id !== -1) {
        _menu.newItem({
            name: id ? "Обновить запись" : "Сохранить",
            onpress: () => {
                if (!name) return user.notify("Необходимо указать название одежды");
                _menu.close();
                resetCloth();
                oldClothData = [];
                CustomEvent.triggerServer('admin:cloth:saveGlove', id, price, name,
                    gloveDates.map(data => mapGloveDataToServer(data)));
            }
        })
    } else {
        _menu.newItem({
            name: "Сохранить нельзя, ибо это просто тестовый конструктор",
        })
    }

    _menu.open(cursor);
}

const editGloveVariationMenuBlock = (menu: MenuClass, gloveData: GloveClothDataEdit, updateMenu: (cursorIndex: number) => void) => {
    menu.newItem({
        name: 'Название вариации',
        more: gloveData.name ? gloveData.name : '~r~Укажите',
        onpress: async () => {
            const nameValue = await DialogInput("Введите значение", gloveData.name, 35);
            if (nameValue) {
                gloveData.name = nameValue;
            }

            updateMenu(0);
        }
    });

    menu.newItem({
        name: 'Текстура',
        type: 'range',
        rangeselect: [0, 999],
        listSelected: gloveData.texture,
        onpress: async () => {
            const texture = await DialogInput("Введите значение", gloveData.texture, 3, 'int');
            if (!isNaN(texture)) {
                gloveData.texture = texture;
            }

            updateMenu(1);
        },
        onchange: (texture) => {
            gloveData.texture = texture;
        }
    });

    gloveData.torsoMap.forEach((value, key, map) => {
        menu.newItem({
            type: 'range',
            name: `Торс ${key}`,
            rangeselect: [0, 999],
            listSelected: value == null ? 0 : value,
            onpress: async () => {
                const drawable = await DialogInput("Введите значение", value, 3, 'int');
                if (!isNaN(drawable)) {
                    map.set(key, drawable);
                }

                updateMenu(2 + key);
            },
            onchange: (drawable) => {
                map.set(key, drawable);
                player.setComponentVariation(3, drawable, gloveData.texture, 2)
            }
        })
    });
}

const damageCheckData = {
    health: 100,
    armor: 100
}
mp.events.add('render', () => {
    const currentHealth = mp.players.local.getHealth();
    const currentArmor = mp.players.local.getArmour();

    const healthLoss = damageCheckData.health - currentHealth;
    const armorLoss = damageCheckData.armor - currentArmor;

    if (healthLoss !== 0 || armorLoss !== 0) {
        damageCheckData.health = currentHealth;
        damageCheckData.armor = currentArmor;
    }

    if (healthLoss <= 0 && armorLoss <= 0) {
        return;
    }
    
    CustomEvent.triggerServer('playerDamage', healthLoss, armorLoss, currentHealth, currentArmor);
})