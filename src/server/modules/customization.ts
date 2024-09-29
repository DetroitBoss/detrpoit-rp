import {CustomEvent} from "./custom.event";
import {DressEntity} from "./typeorm/entities/dress";
import {menu} from "./menu";
import {CLOTH_VARIATION_ID_MULTIPLER, ClothData, GloveClothData, partsList} from "../../shared/cloth";
import {system} from "./system";
import fs from "fs";
import {writeSpecialLog} from "./specialLogs";

CustomEvent.registerClient('dress:getDressDataById', (player, id: number) => {
    return dress.get(id)?.data as GloveClothData[]
})

CustomEvent.registerClient('admin:gamedata:dress', player => {
    const user = player.user;
    if(!user.hasPermission('admin:gamedata:dress')) return player.notify("У вас нет доступа", "success");
    dress.adminMenu(player)
})

CustomEvent.registerClient('admin:cloth:saveGlove', async (player, id: number, price: number, name: string, data: GloveClothData[]) => {
    const user = player.user;
    if (!user.hasPermission('admin:gamedata:dress'))
        return player.notify("У вас нет доступа", "success");

    let dressEntity: DressEntity = id ? dress.get(id) : new DressEntity();

    dressEntity.price = price || 0;
    dressEntity.name = name;
    dressEntity.data = data;
    dressEntity.male = user.is_male;
    dressEntity.category = 1000;
    dressEntity.edited = true;

    try {
        dressEntity = await dressEntity.save();
    } catch (err) {
        console.error(err)
        player.notify("Возникла ошибка при сохранении одежды. Подробности в консоли сервера", "error")
    }

    const idx = dress.data.findIndex(entity => entity.id === dressEntity.id);
    if (idx !== -1) {
        dress.data.splice(idx, 1);
    }

    dress.data.push(dressEntity);

    const dataDto = {
        id: dressEntity.id,
        name: dressEntity.name,
        category: dressEntity.category,
        male: dressEntity.male,
        data: dressEntity.data,
    };
    CustomEvent.triggerClients('dressData:new', [dataDto]);
});

CustomEvent.registerClient('admin:cloth:save', (player, id: number, price: number, name: string, data: { component: number, drawable: number, texture: number, name?: string }[][], page?:number) => {
    const user = player.user;
    if(!user.hasPermission('admin:gamedata:dress')) return player.notify("У вас нет доступа", "success");
    let item: DressEntity;
    if(!id){
        item = new DressEntity();
        item.price = price || 0;
        item.name = name;
        item.data = data;
        item.male = user.is_male;
        item.category = data[0][0].component;
        item.edited = true;
        item.save().then(r => {
            dress.data.push(r)
            const datasend = [r].map(d => {
                return {
                    id: d.id,
                    name: d.name,
                    category: d.category,
                    male: d.male,
                    data: d.data,
                }
            });
            CustomEvent.triggerClients('dressData:new', datasend)
            player.notify(`Одежда ${id ? "Обновлена" : "Сохранена"}`, 'success');
        }).catch(err => {
            console.error(err)
            player.notify("Возникла ошибка при сохранении одежды. Подробности в консоли сервера", "error")
        });
    } else {
        item = dress.get(id);
        if(item){
            item.price = price;
            item.name = name;
            item.data = data;
            item.edited = true;
            item.save().then(r => {
                const datasend = [r].map(d => {
                    return {
                        id: d.id,
                        name: d.name,
                        category: d.category,
                        male: d.male,
                        data: d.data,
                    }
                });
                CustomEvent.triggerClients('dressData:new', datasend)
                player.notify(`Одежда ${id ? "Обновлена" : "Сохранена"}`, 'success');
                if(typeof page === "number") dressMenuAdmin(player, item, () => {
                    dress.adminMenu(player);
                }, page)
            }).catch(err => {
                console.error(err)
                player.notify("Возникла ошибка при сохранении одежды. Подробности в консоли сервера", "error")
            });
        }
    }
})

let staticDress: {
    id: number;
    name: string;
    category: number;
    male: number;
    data: {
        component: number;
        drawable: number;
        texture: number;
        name?: string;
    }[][] | GloveClothData[];
}[] = [];
export const dress = {
    getIdVariation: (multipliedId: number) => {
        let id = multipliedId;
        let variation = 0;
        if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
            variation = Math.floor(id / CLOTH_VARIATION_ID_MULTIPLER);
            id = id % CLOTH_VARIATION_ID_MULTIPLER;
        }

        return { id, variation };
    },

    getTorsoComponent: (torsoId: number) => {
        const { id } = dress.getIdVariation(torsoId);
        return (dress.get(id)?.data[0] as ClothData)?.find(cloth => cloth.component === 3)?.drawable;
    },

    get staticConfig(){
        return staticDress
    },
    get dynamicConfig(){
        return [...dress.data].filter(q => q.edited).map(d => {
            return {
                id: d.id,
                name: d.name,
                category: d.category,
                male: d.male,
                data: d.data,
            }
        })
    },
    get sendingConfig(){
        const staticConfig = dress.staticConfig;
        let dyn = dress.dynamicConfig;
        dyn.map((item, i) => {
            const old = staticConfig.find(q => q.id === item.id);
            if(!old) return;
            if (JSON.stringify(old) == JSON.stringify(item)) dyn.splice(i, 1);
        })
        return dyn;
    },
    data: <DressEntity[]> [],
    get: (id: number) => {
        if(!id) return null;
        if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
            id = id % CLOTH_VARIATION_ID_MULTIPLER;
        }
        return dress.data.find(q => q.id === id);
    },
    getMany: (ids: number[]) => {
        ids.map((id, index) => {
            if(!id) return null;
            if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
                id = id % CLOTH_VARIATION_ID_MULTIPLER;
            }
            ids[index] = id;
        })
        return dress.data.filter(q => ids.includes(q.id));
    },
    delete: (id: number) => {
        let index = dress.data.findIndex(d => d.id === id);
        if (index >= 0){
            CustomEvent.triggerClients('dressData:remove', id)
            dress.data[index].remove();
            dress.data.splice(index, 1);
        }
    },
    load: () => {
        system.debug.info('------------------------')
        console.time("Загрузка одежды")
        console.time("Время загрузки одежды")
        return new Promise((resolve, reject) => {
            DressEntity.find().then(data => {
                // data.map(item => {
                //     const newName = item.name.replace(/[^\da-zA-Zа-яА-Яё #()]/g, '');
                //     if(item.name !== newName) {
                //         debug.error("ERROR "+item.id, item.name, newName)
                //         item.name = newName
                //     }
                // })
                dress.data = data;
                system.debug.info('Количество элементов одежды', data.length);
                console.timeEnd("Время загрузки одежды")
                system.debug.info('------------------------')
                staticDress = dress.dynamicConfig;
                fs.writeFileSync('./client_packages/dress.json.js', `global.dressstatic = ${JSON.stringify(dress.dynamicConfig)}`);
                system.debug.debug(`Конфиг одежды сохранён`);
                resolve(null);
            })
        })
    },
    adminMenu: (player: PlayerMp, filter?:string) => {
        let m = menu.new(player, "", "Список одежды")
        const user = player.user;
        m.newItem({
            name: "~g~Новый элемент",
            onpress: () => {
                CustomEvent.triggerClient(player, "admin:cloth:new");
            }
        })
        m.newItem({
            name: "Поиск по названию",
            more: filter || "",
            onpress: () => {
                menu.input(player, 'Введите ID или название для поиска').then(search => {
                    if(!search) return dress.adminMenu(player);
                    dress.adminMenu(player, search);
                })
            }
        })
        if(filter){
            dress.data.filter(q => q.id === parseInt(filter) || q.name.toLowerCase().includes(filter.toLowerCase())).map(item => {
                m.newItem({
                    name: `#${item.id} | ${item.name}`,
                    desc: `${item.male ? "Мужская" : "Женская"} одежда.`,
                    more: `$${system.numberFormat(item.price)}`,
                    onpress: () => {
                        dressMenuAdmin(player, item, () => {
                            dress.adminMenu(player, filter)
                        }, 0);
                    }
                })

            })
        } else {
            partsList.map(category => {
                let items: DressEntity[] = [];

                switch (category[0]) {
                    case 333:
                        items = dress.data.filter(q => q.category == category[0]);
                        break;
                    case 1000:
                        items = dress.data.filter(q => q.category === 1000);
                        break;
                    default:
                        items = dress.data.filter(q => q.category === category[0] && (q.data as ClothData[])[0].length >= (partsList.length - 2))
                        break;
                }

                m.newItem({
                    name: category[1],
                    more: `x${items.length}`,
                    onpress: () => {
                        const pageItems = 100;
                        let page = 0;
                        let pageMax = Math.ceil(items.length / pageItems);
                        const vq = () => {
                            items = dress.data.filter(q => q.category == category[0])
                            pageMax = Math.ceil(items.length / pageItems);
                            let submenu = menu.new(player, "", category[1]);
                            submenu.onclose = () => { dress.adminMenu(player) };
                            if (page < pageMax) {
                                submenu.newItem({
                                    name: "Следующая страница",
                                    onpress: () => {
                                        page++;
                                        vq();
                                    }
                                })
                            }
                            if (page){
                                submenu.newItem({
                                    name: "Предыдущая страница",
                                    onpress: () => {
                                        page--;
                                        vq();
                                    }
                                })
                            }
                            submenu.newItem({
                                name: "Текущая страница",
                                more: `${page+1} / ${pageMax+1}`
                            })
                            items.map((item, index) => {
                                if (index < page * pageItems || index > (page + 1) * pageItems) return;
                                submenu.newItem({
                                    name: `#${item.id} | ${item.name}`,
                                    desc: `${item.male ? "Мужская" : "Женская"} одежда.`,
                                    more: `$${system.numberFormat(item.price)}`,
                                    onpress: () => {
                                        dressMenuAdmin(player, item, vq, page);
                                    }
                                })
                            })


                            submenu.open();
                        }
                        vq();
                    }
                })
            })
        }
        m.open();
    }
}

export const dressMenuAdmin = (player: PlayerMp, item: DressEntity, onclose: () => void, page: number) => {
    const user = player.user;
    let choice = menu.new(player, "", "Действие")
    choice.onclose = () => {
        onclose();
    }
    choice.newItem({
        name: "Редактировать",
        onpress: () => {
            if (user.is_male != item.male) return player.notify("Данная одежда не предназначена для вашего персонажа", "error");
            CustomEvent.triggerClient(player, "admin:cloth:edit", JSON.stringify([item.category, item.id, item.price, item.name, item.data]), page);
        }
    })
    choice.newItem({
        name: "Редактировать цену",
        more: `${system.numberFormat(item.price)}`,
        onpress: () => {
            menu.input(player, 'Введите цену', item.price, 6, 'int').then(val => {
                if(typeof val !== "number") return;
                if(isNaN(val)) return;
                if(val < 0) return;
                if(val > 99999999) return;
                item.price = val || 0;
                item.save().then(() => {
                    dressMenuAdmin(player, item, onclose, page);
                })
            })
        }
    })
    if ([3, 4, 6].includes(item.category)){
        choice.newItem({
            name: "Для создания персонажа",
            more: `${item.forCreate ? 'Да' : 'Нет'}`,
            desc: 'Если включить - то эту одежду можно будет выбрать при создании персонажа',
            onpress: () => {
                item.forCreate = item.forCreate ? 0 : 1
                item.save().then(() => {
                    dressMenuAdmin(player, item, onclose, page);
                })
            }
        })
    }
    choice.newItem({
        name: "Для коробки",
        more: `${item.forBox ? 'Да' : 'Нет'}`,
        desc: 'Если включить - то эту одежду можно будет получить из коробки',
        onpress: () => {
            item.forBox = item.forBox ? 0 : 1
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    if (item.category !== 1000) {
        const data = item.data as ClothData[];

        choice.newItem({
            name: "Для медиа",
            desc: 'Данная одежда будет выдана медиа по достижению определённого количества активаций промокода',
            more: `${item.forMedia === -1 ? 'Нет' : item.name}`,
            onpress: () => {
                menu.selector(player, 'Выберите значение', ['Нет', ...(data).map(q => q[0].name)], true, null, true, item.forMedia+1).then(val => {
                    if(typeof val !== "number") return;
                    item.forMedia = val - 1;
                    item.save().then(() => {
                        dressMenuAdmin(player, item, onclose, page);
                    })
                })
            }
        })
    }

    choice.newItem({
        name: "Для боевого пропуска",
        desc: 'Данная одежда будет использоваться только для боевого пропуска',
        more: `${item.forBattlePass ? 'Да' : 'Нет'}`,
        onpress: () => {
            item.forBattlePass = !item.forBattlePass
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    choice.newItem({
        name: "Донатная вещь",
        desc: 'Данная одежда будет запрещена для передачи',
        more: `${item.donateBlock ? 'Да' : 'Нет'}`,
        onpress: () => {
            item.donateBlock = !item.donateBlock
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    choice.newItem({
        name: "Переименовать",
        more: item.name,
        onpress: () => {
            menu.input(player, "Введите название", item.name, 35).then(name => {
                if(!name) return;
                item.name = name;
                item.edited = true;
                item.save().then(() => {
                    player.notify("Название сохранено", "error")
                    const datasend = [item].map(d => {
                        return {
                            name: d.name
                        }
                    });
                    CustomEvent.triggerClients('dressData:new', datasend)
                })
            })
        }
    })
    choice.newItem({
        name: "Одеть",
        type: 'range',
        rangeselect: [0, item.data.length - 1],
        onpress: (itm) => {
            if (user.is_male != item.male) return player.notify("Данная одежда не предназначена для вашего персонажа", "error");
            writeSpecialLog(`Выдал одежду - ${item.id + itm.listSelected * CLOTH_VARIATION_ID_MULTIPLER}`, player, 0);
            user.setDressValueById(item.inventoryIcon, item.id + itm.listSelected * CLOTH_VARIATION_ID_MULTIPLER);
        }
    })
    choice.newItem({
        name: "~r~Удалить",
        onpress: () => {
            menu.accept(player).then(async status => {
                if (status) dress.delete(item.id);
                dress.adminMenu(player);
            })
        }
    })
    choice.open()
}