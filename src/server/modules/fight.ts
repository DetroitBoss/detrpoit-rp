import {system} from "./system";
import {menu} from "./menu";
import {User} from "./user";
import {FIGHT_LIST} from "../../shared/fight";
import {inventoryShared} from "../../shared/inventory";
import {DeathMath} from "./deadmatch";
import {fractionCfg} from "./fractions/main";

let currentIDinFight: number[] = [];

mp.events.add('playerDeath', (player => {
    if (!mp.players.exists(player)) return;
    if (!player.dbid) return;
    if (!player.dimension) return;
    const index = currentIDinFight.findIndex(q => q == player.dbid)
    if (index == -1) return;
    currentIDinFight.splice(index, 1);
    if(mp.players.exists(player)){
        player.user.adminRestore();
        player.user.returnToOldPos();
        player.user.removeWeapon();
        setTimeout(() => {
            if(!mp.players.exists(player)) return;
            player.user.adminRestore();
            player.user.removeWeapon();
        }, 1000)
    }
}))
mp.events.add('playerQuit', (player => {
    if (!player.dbid) return;
    const index = currentIDinFight.findIndex(q => q == player.dbid)
    if (index == -1) return;
    currentIDinFight.splice(index, 1);
}))

export const fight = {
    startFight: (admin: PlayerMp, blueTeam: PlayerMp[], redTeam: PlayerMp[], location = 0, weapon = 0, minutes = 10, admins: PlayerMp[]) => {
        const dimension = system.personalDimension;
        system.debug.debug('[FIGHT]', 'create fight', `dimension ${dimension}`)
        if(!mp.players.exists(admin)) return;


        const cfg = FIGHT_LIST[location];


        const dm = new DeathMath(cfg.pos, cfg.radius)
        dm.time = minutes * 60
        dm.team1_name = "Синяя команда";
        dm.team2_name = "Красная команда";

        dm.team1_start = {x: cfg.blueTeamPos.x, y: cfg.blueTeamPos.y, z: cfg.blueTeamPos.z, h: cfg.blueTeamH, r: 5}
        dm.team2_start = {x: cfg.redTeamPos.x, y: cfg.redTeamPos.y, z: cfg.redTeamPos.z, h: cfg.redTeamH, r: 5}

        admins.map(item => {
            dm.spectators.push({id: item.dbid, name: item.user.name, death: 0, score: 0, player: item, enter: {x: item.position.x, y: item.position.y, z: item.position.z, h: item.heading, d: item.dimension}})
        })

        blueTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            dm.insertPlayer(target, 1);
        });

        redTeam.map((target, id) => {
            if(!mp.players.exists(target)) return redTeam.splice(id, 1);
            dm.insertPlayer(target, 2);
        });

        let team1_fractions: number[] = dm.team1.map(q => q.player.user.fraction);
        let team1_fractions_check: number[] = dm.team1.map(q => q.player.user.fraction).filter((q, i, a) => q === a[0]);
        if(team1_fractions.length === team1_fractions_check.length){
            dm.team1_name = fractionCfg.getFractionName(team1_fractions[0])
            dm.team1_image = `f${team1_fractions[0]}`
        }

        let team2_fractions: number[] = dm.team2.map(q => q.player.user.fraction);
        let team2_fractions_check: number[] = dm.team2.map(q => q.player.user.fraction).filter((q, i, a) => q === a[0]);
        if(team2_fractions.length === team2_fractions_check.length){
            dm.team2_name = fractionCfg.getFractionName(team2_fractions[0])
            dm.team2_image = `f${team2_fractions[0]}`
        }


        const weaponCfg = inventoryShared.weapons[weapon];

        dm.weapon = weaponCfg.hash;
        dm.ammo = 480;

        dm.wait = 5;

        dm.start()

    },
    create: (player: PlayerMp, blueTeam: PlayerMp[] = [], redTeam: PlayerMp[] = [], location = 0, weapon = 0, minutes = 10, admins: PlayerMp[] = []) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, 'Создание боя', 'Список участников');

        m.newItem({
            name: "Очистить все команды",
            onpress: () => {
                blueTeam = []
                redTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: "Локация",
            type: 'list',
            list: FIGHT_LIST.map(q => q.name),
            listSelected: location,
            onchange: (val) => {
                location = val;
            }
        })
        m.newItem({
            name: "Оружие",
            type: 'list',
            list: inventoryShared.weapons.map(q => {
                return inventoryShared.getWeaponNameByHash(q.hash);
            }),
            listSelected: weapon,
            onchange: (val) => {
                weapon = val;
            }
        })
        m.newItem({
            name: "Сколько минут идёт бой",
            type: 'range',
            desc: 'Если указать 0 - бой закончится когда кто то не проиграет',
            rangeselect: [0, 120],
            listSelected: minutes,
            onchange: (val) => {
                minutes = val;
            }
        })
        m.newItem({
            name: "~g~Запустить бой",
            desc: 'Перед нажатием убедитесь что все игроки добавлены. Так же учитывайте, что из данного мероприятия телепортировать игроков нельзя, они должны умереть',
            onpress: () => {
                fight.startFight(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })

        m.newItem({name: "~b~Синяя команда"})
        m.newItem({
            name: "Очистить эту команду",
            onpress: () => {
                blueTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: "Добавить игрока по ID",
            onpress: () => {
                menu.input(player, "Введите ID игрока", user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify('Игрок не обнаружен', 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в синюю команду', 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в красную команду', 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в наблюдатели', 'error');
                    blueTeam.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        blueTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : 'Нет фракции'}`,
                onpress: () => {
                    blueTeam.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })

        m.newItem({name: "~r~Красная команда"})
        m.newItem({
            name: "Очистить эту команду",
            onpress: () => {
                redTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: "Добавить игрока по ID",
            onpress: () => {
                menu.input(player, "Введите ID игрока", user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify('Игрок не обнаружен', 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в синюю команду', 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в красную команду', 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в наблюдатели', 'error');
                    redTeam.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        redTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : 'Нет фракции'}`,
                onpress: () => {
                    redTeam.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })


        m.newItem({
            name: "~y~Наблюдатели",
            more: `${admins.find(q => q.dbid === user.id) ? 'Вы в наблюдателях' : 'Вы не в наблюдателях'}`
        })
        m.newItem({
            name: "Очистить наблюдателей",
            onpress: () => {
                admins = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: "Добавить игрока по ID",
            onpress: () => {
                menu.input(player, "Введите ID игрока", user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify('Игрок не обнаружен', 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в синюю команду', 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в красную команду', 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify('Игрок уже добавлен в наблюдатели', 'error');
                    admins.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        admins.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : 'Нет фракции'}`,
                onpress: () => {
                    admins.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })

        m.open();
    }
}
