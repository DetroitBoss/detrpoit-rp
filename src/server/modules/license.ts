import {colshapes} from "./checkpoints";
import {LICENCE_CENTER_LIST, LicenseName} from "../../shared/licence";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {Vehicle} from "./vehicles";
import {weapon_list} from "../../shared/inventory";
import {document_templates} from "../../shared/documents";
import {inventory} from "./inventory";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";

colshapes.new(LICENCE_CENTER_LIST.map(item => new mp.Vector3(item.point.x, item.point.y, item.point.z)), (player, index) => {
    return LICENCE_CENTER_LIST[index].name
}, (player, index) => {
        openLicense(player, index);
}, {
    radius: MARKERS_SETTINGS.LICENCE_CENTER.r,
    color: MARKERS_SETTINGS.LICENCE_CENTER.color
})


const openLicense = (player: PlayerMp, index: number) => {
    const user = player.user;
    if(!user) return;
    if(!user.social_number) return player.notify("Воспользоваться услугами нашего заведения можно только при наличии удостоверения личности", "error");
    if (user.currentWeapon) return player.notify("Мы не можем оказывать услуги пока вы держите в руках оружие", "error")
    const cfg = LICENCE_CENTER_LIST[index];
    const title = cfg.name
    const m = menu.new(player, title, "Доступные услуги");
    m.newItem({
        name: `Сдать экзамен на получение лицензии`,
        //desc: `Для управления большинством видов транспорта в нашем штате необходимо иметь лицензию на вождение.`,
        onpress: () => {
            const submenu = menu.new(player, title, "Получение лицензии");
            submenu.onclose = () => {openLicense(player, index)};

            cfg.license.map((lic, licid) => {
                submenu.newItem({
                    name: LicenseName[lic.id],
                    more: `$${system.numberFormat(lic.cost)}`,
                    desc: `Данная лицензия выдаётся на ${lic.time}. По завершению срока действия её необходимо продлить в данном центре. Оплата взымается по окончанию прохождения экзамена, убедитесь что у вас достаточно средств для оплаты лицензии`,
                    onpress: () => {
                        if (user.getLicense(lic.id)) return player.notify("По нашим документам у вас уже есть данная лицензия. Если она просрочена или вы потеряли документы - обратитесь в раздел восстановления", "error");
                        if (typeof player.licenseExam === "number") return player.notify("Вы уже сдаёте экзамен", "error")
                        if(user.currentWeapon) return player.notify("Мы не можем оказывать услуги пока вы держите в руках оружие", "error")
                        if(lic.need_document){
                            const haveDoc = user.inventory.find(q => q.advancedNumber === user.id && q.advancedString === lic.need_document && q.item_id === 802 && (!lic.need_document_days || (parseInt(q.serial.split('|')[1]) + lic.need_document_days * 24 * 60 * 60) > system.timestamp));
                            if (!haveDoc) return player.notify(`Для получения лицензии необходимо иметь документ (${document_templates.find(q => q.id === lic.need_document).typeShort}) оформленый на ваше имя, и он должен быть при вас`, "error")
                        }
                        submenu.close();
                        player.licenseExam = index;
                        player.licenseExamLic = licid
                        if(lic.needTheory){
                            user.setGui('drivingschool');
                            CustomEvent.triggerCef(player, 'drivingschool', lic.id)
                        } else {
                            if(lic.guns){
                                user.teleport(cfg.start.x, cfg.start.y, cfg.start.z, cfg.start.h, system.personalDimension)
                                setTimeout(() => {
                                    if(!mp.players.exists(player)) return;
                                    const weapon = system.randomArrayElement(weapon_list.filter(q => lic.guns.includes(q.weapon)).map(q => q.hash))
                                    player.user.giveWeapon(weapon, 120);
                                    CustomEvent.triggerClient(player, 'license:gun', player.licenseExam, player.licenseExamLic, weapon)
                                }, 1000)
                            } else {
                                startPractice(player, true);
                            }
                        }
                    }
                })
            })

            submenu.open();
        }
    })

    m.newItem({
        name: `Продлить/Восстановить лицензию`,
        desc: `В случае если вы ранее уже получали лицензии вам не требуется повторно сдавать экзамен. Наши специалисты за считаные наносекунды выдадут вам новые документы`,
        onpress: () => {
            const submenu = menu.new(player, title, "Продление/Восстановление лицензии");
            submenu.onclose = () => {openLicense(player, index)};

            cfg.license.map(lic => {
                submenu.newItem({
                    name: LicenseName[lic.id],
                    more: `$${system.numberFormat(lic.restore)}`,
                    desc: `Данная лицензия восстанавливается на ${lic.time}. По завершению срока действия её необходимо снова продлить в данном центре`,
                    onpress: () => {
                        if (typeof player.licenseExam === "number") return player.notify("Вы уже сдаёте экзамен", "error")
                        if (!user.getLicense(lic.id)) return player.notify("По нашим документам вы не получали данную лицензию", "error");
                        user.tryPayment(lic.restore, 'all', null, `Продление/Восстановление лицензии ${LicenseName[lic.id]}`, `Лицензионный центр`).then(status => {
                            player.dimension = 0;
                            if (!status) return openLicense(player, index);
                            user.giveLicense(lic.id, lic.time);
                            player.notify("Лицензия была успешно продлена", "success")
                            user.questTick();
                            openLicense(player, index);
                        })
                    }
                })
            })

            submenu.open();
        }
    })

    m.open();
}

export const startPractice = (player: PlayerMp, status: boolean) => {
    const user = player.user;
    if (!user) return;
    const cfg = LICENCE_CENTER_LIST[player.licenseExam];
    if (!status || !cfg) {
        player.licenseExam = null;
        player.licenseExamLic = null;
        return;
    }
    const dimension = system.personalDimension
    player.licenseVehicle = Vehicle.spawn(system.randomArrayElement(cfg.license[player.licenseExamLic].models), new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z), cfg.start.h, dimension, true, false);
    player.dimension = dimension;
    user.teleportVisible(cfg.start.h, new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z));
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        if (!mp.vehicles.exists(player.licenseVehicle)) return;
        player.user.antiBlockEnterVehicle = true;
        player.user.putIntoVehicle(player.licenseVehicle, 0);
        CustomEvent.triggerClient(player, "autoschool:practice", player.licenseExam, player.licenseExamLic, player.licenseVehicle.id);
    }, system.TELEPORT_TIME + 100)

    setTimeout(() => {
        player.user.antiBlockEnterVehicle = false;
    }, 10000);
}

CustomEvent.registerCef('client:autoschool:theory', (player, status: boolean) => {
    startPractice(player, status);
})

CustomEvent.registerClient('autoschool:practice:result', (player, result: boolean) => {
    practiceResult(player, result)
})

CustomEvent.registerClient('licese:weapon:result', (player, result: boolean) => {
    player.user.removeWeapon();
    practiceResult(player, result)
})

const practiceResult = (player: PlayerMp, result: boolean) => {
    const user = player.user;
    if (!user) return;
    const cfg = LICENCE_CENTER_LIST[player.licenseExam];
    const license = LICENCE_CENTER_LIST[player.licenseExam].license[player.licenseExamLic];
    user.teleport(cfg.point.x, cfg.point.y, cfg.point.z, null);
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        destroyVeh(player)
        player.licenseExam = null
        player.licenseExamLic = null
        const haveDoc = user.inventory.find(q => q.advancedNumber === user.id && q.advancedString === license.need_document && q.item_id === 802 && (!license.need_document_days || (parseInt(q.serial.split('|')[1]) + license.need_document_days * 24 * 60 * 60) > system.timestamp));
        if (license.need_document) {
            if (!haveDoc) return player.notify(`Для получения лицензии необходимо иметь документ (${document_templates.find(q => q.id === license.need_document).typeShort}) оформленый на ваше имя, и он должен быть при вас`, "error")
        }
        if (!result) return player.notify("К сожалению вы не справились с практической частью. Вы можете попробовать снова", "error"), player.dimension = 0;
        user.tryPayment(license.cost, "all", () => {
            return !user.getLicense(license.id)
        }, `Получении лицензии ${LicenseName[license.id]}`, `Лицензионный центр`).then(status => {
            player.dimension = 0;
            if (!status) return;
            if (haveDoc && license.need_document_remove) inventory.deleteItem(haveDoc);
            user.giveLicense(license.id, license.time);
            player.notify("Лицензия была успешно получена", "success")
            user.questTick();
        })
    }, 5000)
}

const destroyVeh = (player: PlayerMp) => {
    if (player.licenseVehicle && mp.vehicles.exists(player.licenseVehicle)) {
        Vehicle.destroy(player.licenseVehicle);
    }
    player.licenseVehicle = null;
}

mp.events.add('playerQuit', player => {
    destroyVeh(player)
})