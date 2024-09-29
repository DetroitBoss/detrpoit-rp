import {menu} from "../menu";
import {giveFamilyQuestCargo, registerFamilyCargoVehicle} from "./quests";
import {familyCreateGUI} from "./create";
import {CargoBattleFamilyQuest} from "./quests/cargobattle";
import {Family} from "./family";
import {Vehicle} from "../vehicles";
import {DONATE_MONEY_NAMES} from "../../../shared/economy";
import {system} from "../system";
import {parking} from "../businesses/parking";
import {CONTRACT_NUM_FOR_FAMILY, FamilyReputationType} from "../../../shared/family";
import {writeSpecialLog} from "../specialLogs";


export const showFamilyAdminMenu = (player:PlayerMp) => {
    const m = menu.new(player, 'Система семей');
    m.newItem(
        {
            name: 'Выбрать автомобиль для груза (если есть возможность)',
            onpress: () => registerFamilyCargoVehicle(player)
        },
        {
            name: 'Получить груз в руки (если есть возможность)',
            onpress: () => giveFamilyQuestCargo(player)
        },
        {
            name: 'ГУИ Создания семьи',
            onpress: () => familyCreateGUI(player)
        },
        {
            name: 'Принудительно начать битву за груз',
            onpress: () => new CargoBattleFamilyQuest().start()
        },
        {
            name: 'Принудительно начать подготовку к битве за груз',
            onpress: () => new CargoBattleFamilyQuest().startReady(true).then(res => {
                player.notify('Запущено')
            }).catch(error => {
                player.notify('Не удалось запустить: '+error)
            })
        },
        {
            name: 'Принудительно остановить все битвы за груз',
            onpress: () => {
                CargoBattleFamilyQuest.stopAll()
                player.notify('Выполнено')
            }
        },
        {
            name: 'Сменить свою семью',
            onpress: () => {
                let list:string[] = ['Покинуть семью']
                Family.getAll().map(f => list.push(f.name))
                menu.selector(player, 'Выберите семью', list, true).then(id => {
                    if(!id) {
                        if(player.user.family) {
                            player.user.family = null
                            player.notify('Вы покинули семью')
                        }
                        return;
                    }
                    if(!Family.getAll()[id-1]) return;
                    player.notify('Вы изменили свою семью: '+Family.getAll()[id-1].name)
                    player.user.family = Family.getAll()[id-1]
                    player.user.familyRank = player.user.family.leaderRankID
                })
            }
        },
        {
            name: 'Сменить свой ранг в семье (если есть возможность)',
            onpress: () => {
                if(!player.user || !player.user.family) return;
                menu.selector(player, 'Выберите ранг', player.user.family.ranks.map(r => {
                    return r.name
                }), false).then(name => {
                    player.user.family.ranks.find(r => r.name == name)
                    player.user.familyRank = player.user.family.ranks.find(r => r.name == name).id || 1
                    player.notify(`Вы изменили свой ранг в семье: ${player.user.family.getRank(player.user.familyRank).name}`)
                })
            }
        },
        {
            name: 'Посмотреть/изменить информацию о своей семье',
            onpress: () => {
                if(!player.user || !player.user.family) return;
                showFamilyEditAdminMenu(player, player.user.family)
            }
        }
    )
    m.open()
}


export const showFamilyEditAdminMenu = (player:PlayerMp, family:Family) => {
    return new Promise<void>(async () => {
        if(!family && !family.id) return;
        if(!player.user || !player.user.hasPermission('admin:familyControl')) return;

        const allMembers = await family.getAllMembers()
        const membersOnline = allMembers.filter(u => u.is_online)

        const m = menu.new(player, 'Система семей');
        m.newItem(
            {
                name: 'ID семьи',
                more: family.id
            },
            {
                name: 'Количество членов семьи',
                more: `Всего: ${allMembers.length}`,
                desc: `Онлайн: ${membersOnline.length}`
            },
            {
                name: 'Название',
                more: family.name,
                onpress: () => menu.input(player, 'Введите новое название', family.name, 24).then(newName => {
                    if(newName.length < 3) player.notify('Название должно содержать хотя-бы 3 символа')
                    if (!newName || ! /^[a-zA-Z_-]{0,15}$/i.test(newName)) {
                        player.notify('Название содержит лишние символы', "error")
                    }
                    else if (Family.getAll().find(f => f.name == newName)) {
                        player.notify('Семья с таким названием уже существует', "error")
                        return false;
                    }
                    else family.name = newName
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: 'Количество очков',
                more: family.points,
                onpress: () => menu.input(player, 'Введите количество очков', family.points, 20, 'int').then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                    else family.points = newVal
                    player.user.log('AdminJob', `Установил количество очков ${family.seasonPoints} семье ${family.name}`, family.id)
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: 'Количество очков в сезоне',
                more: family.seasonPoints,
                onpress: () => menu.input(player, 'Введите количество очков', family.seasonPoints, 20, 'int').then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                    else family.seasonPoints = newVal
                    player.user.log('AdminJob', `Установил количество сезонных очков ${family.seasonPoints} семье ${family.name}`, family.id)
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: 'Количество груза',
                more: family.cargo,
                onpress: () => menu.input(player, 'Введите количество груза', family.cargo, 20, 'int').then(newVal => {
                    const lastValue = family.cargo;
                    if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                    else family.cargo = newVal
                    writeSpecialLog(`Изменил количество груза с ${lastValue} на ${newVal} | ${family.name}`, player, 0);
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: 'Уровень семьи',
                more: family.level,
                onpress: () => menu.input(player, 'Введите уровень семьи', family.level, 20, 'int').then(newVal => {
                    const lastValue = family.level;
                    if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                    else family.level = newVal
                    writeSpecialLog(`Изменил уровень семьи с ${lastValue} на ${newVal} | ${family.name}`, player, 0);
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: 'Побед в соревнованиях',
                more: family.wins,
                onpress: () => menu.input(player, 'Введите количество побед в соревнованиях', family.wins, 20, 'int').then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                    else family.wins = newVal
                    showFamilyEditAdminMenu(player, family)
                })
            },
            // {
            //     name: '~r~Сброс сезонных очков',
            //     onpress: () => {
            //         menu.accept(player).then(status => {
            //             if(!status) return;
            //             family.clearSeasonPoints(true)
            //             player.notify('Готово', 'success');
            //         })
            //     }
            // }

            {
                name: '~r~Заменить доступные контракты',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        family.setRandomContracts(CONTRACT_NUM_FOR_FAMILY)
                        player.notify('Готово', 'success');
                    })
                }
            }
        );
        if (player.user.hasPermission('admin:familyBank')) {
            m.newItem(
                {
                    name: 'Количество денег',
                    more: family.money,
                    onpress: () => menu.input(player, 'Введите количество денег', family.money, 20, 'int').then(newVal => {
                        const lastValue = family.money;
                        if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                        else family.money = newVal
                        writeSpecialLog(`Изменил количество денег семьи с ${lastValue} на ${newVal}  | ${family.name}`, player, 0);
                        showFamilyEditAdminMenu(player, family)
                    })
                },
                {
                    name: 'Количество доната',
                    more: family.donate,
                    onpress: () => menu.input(player, 'Введите количество доната', family.donate, 20, 'int').then(newVal => {
                        const lastValue = family.donate;
                        if(isNaN(newVal) || newVal < 0) player.notify('Количество не может быть меньше 0')
                        else family.donate = newVal
                        writeSpecialLog(`Изменил количество доната семьи с ${lastValue} на ${newVal}  | ${family.name}`, player, 0);
                        showFamilyEditAdminMenu(player, family)
                    })
            })
        }
        
        m.newItem({
            name: `Дом`,
            more: !!family.house?`${family.house.name} #${family.house.id}`:`Отсутствует`,
            onpress: () => {
                if(!!family.house) player.user.teleport(family.house.x, family.house.y, family.house.z, family.house.h, family.house.d)
            }
        })

        const targetVehs = Vehicle.getFamilyVehicles(family.id)
        if(!targetVehs || !targetVehs.length){
            m.newItem({
                name: "~r~ТС семьи",
                more: "~r~У семьи нет ТС",
            })
        } else {
            m.newItem({
                name: "ТС семьи",
                more: `x${targetVehs.length}`,
                onpress: () => {
                    let submenu = menu.new(player, "ТС семьи "+family.name);
                    submenu.onclose = () => {
                        showFamilyEditAdminMenu(player, family)
                    }
                    targetVehs.map(veh => {
                        submenu.newItem({
                            name: `#${veh.id} ${veh.name}`,
                            more: `${veh.number}`,
                            desc: `Стоимость покупки: ${veh.isDonate ? DONATE_MONEY_NAMES[2] : '$'} ${system.numberFormat(veh.data.cost)}. ${veh.onParkingFine ? 'На штрафстоянке $' + system.numberFormat(veh.fine) : `На точке спавна - ${veh.inSpawnPoint ? 'Да' : 'Нет'}, Место парковки - ${parking.allVehsInAllParking().find(q => q.entity.id === veh.id) ? 'Парковка' : `Дом`}`}`,
                            onpress: () => {
                                let submenu2 = menu.new(player, "Действия над ТС");
                                submenu.onclose = () => {
                                    showFamilyEditAdminMenu(player, family)
                                }
                                submenu2.newItem({
                                    name: "Респавн",
                                    onpress: () => {
                                        veh.respawn();
                                    }
                                })
                                submenu2.newItem({
                                    name: "Телепортировать ТС ко мне",
                                    onpress: () => {
                                        Vehicle.teleport(veh.vehicle, player.position, player.heading, player.dimension);
                                    }
                                })
                                submenu2.newItem({
                                    name: "Телепортироваться к ТС",
                                    onpress: () => {
                                        if (veh.exists) player.user.teleport(veh.vehicle.position.x, veh.vehicle.position.y, veh.vehicle.position.z, 0, veh.vehicle.dimension)
                                    }
                                })
                                submenu2.newItem({
                                    name: "Телепортироваться на точку парковки",
                                    onpress: () => {
                                        player.user.teleport(veh.position.x, veh.position.y, veh.position.z, veh.position.h, veh.position.d)
                                    }
                                })
                                if(player.user.isAdminNow(6)){
                                    submenu2.newItem({
                                        name: "~r~Удалить ТС",
                                        onpress: () => {
                                            menu.accept(player).then(status => {
                                                if(!status) return;
                                                veh.deleteFromDatabase()
                                                showFamilyEditAdminMenu(player, family)
                                                player.notify('Готово', 'success');
                                            })
                                        }
                                    })
                                }
                                submenu2.open();
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }


        if(player.user.family != family) {
            m.newItem({
                name: 'Вступить в семью',
                onpress: () => {
                    player.notify('Вы изменили свою семью: '+family.name)
                    player.user.family = family
                    player.user.familyRank = player.user.family.leaderRankID
                }
            })
        }
        m.open()
    })
}