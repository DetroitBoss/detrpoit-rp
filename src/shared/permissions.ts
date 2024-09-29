export const permissions: PermissionConfigPool = {
    // Выполнить аррест игрока
    "gos:arrest": { gos: true},
    // Доступ к меню заказов
    "fraction:chestorder:access": { rank: 5 },
    // Доступ полному редактированию фракционного гаража игроком (настройка доступа, рангов и прочего)
    "fraction:garage:accessEdit": { rankLast: 2 },
    // Доступ к самому складу
    "fraction:chest:access": { rank: 2 },
    // Доступ полному редактированию фракционного склада игроком (настройка доступа, рангов и прочего)
    "fraction:chest:accessEdit": { rankLast: 2 },
    // Управление одноразовыми промокодами
    "admin:1xPromocodes:manage": { admin_level: 6 },
    // Доступ к меню создания и управления админскими мероприятиями
    "admin:events:system": { admin_level: 2 },
    // Доступ к началу мероприятия "Отвезти сумку" в меню управления мероприятиями
    "admin:boxGameStart:system": { admin_level: 5 },
    // Доступ к меню заказов
    "admin:chestorder:access": {admin_level: 5},
    // Дистанционный доступ к складам через админское меню (Без него не получится выполнить перенос склада в другое место)
    "admin:chest:accessRemote": {admin_level: 5},
    // Полный доступ к гаражам через админское меню
    "admin:garage:accessRemote": {admin_level: 5},
    // Доступ к фракционному складу без нахождения во фракции
    "admin:chest:access": {admin_level: 4},
    // Доступ к фракционному сейфу с деньгами
    "admin:moneychest:access": {admin_level: 6},
    // Доступ полному редактированию фракционного склада, вплоть до удаления
    "admin:chest:accessEdit": {admin_level: 5},
    // С какого уровня можно управлять рабочим гардеробом
    "admin:jobdress": {admin_level: 4},
    // Управление блокировкой бумбокса
    "admin:boomboxblock": {admin_level: 2},
    // Доступ к созданию фракционного склада
    "admin:chest:accessCreate": {admin_level: 5},
    // Перезагрузка сервера
    "admin:system:reboot": {admin_level: 7},
    // Вставить рекламу в главное меню
    "admin:mainmenu:ads": {admin_level: 6},
    // Оповещение всем игрокам в чат
    "admin:global:notify": {admin_level: 2},
    // Восстановление точек ограбления
    "admin:gamedata:restoregrab": {admin_level: 7},
    // Отрисовка текста в мире
    "admin:gamedata:textworld": {admin_level: 6},
    // Управление каталогом одежды
    "admin:gamedata:dress": {admin_level: 7},
    // Управление каталогом ЛСК
    "admin:gamedata:lsc": {admin_level: 7},
    // Создание нового бизнеса
    "admin:gamedata:createbiz": {admin_level: 6},
    // Создание нового дома
    "admin:gamedata:newhouse": {admin_level: 6},
    // Управление созданым домом
    "admin:gamedata:edithouse": {admin_level: 6},
    // Создание нового склада
    "admin:gamedata:newwarehouse": {admin_level: 6},
    // Посадить игрока в админский джаил
    "admin:useredit:jail": {admin_level: 1},
    // Выдать розыск
    "admin:useredit:wanted": {admin_level: 2},
    // Выдать документ/справку
    "admin:useredit:givedocument": {admin_level: 6},
    // Настройка опыта игрока на работах
    "admin:useredit:jobskill": {admin_level: 5},
    // Отправить игрока в редактор персонажа
    "admin:useredit:editor": {admin_level: 5},
    // Выдавать/Снимать хелперку
    "admin:useredit:helper": {admin_level: 5},
    // Выдавать медиа-промокод
    "admin:useredit:mediapromo": {admin_level: 6},
    // Изменить игроку количество армора
    "admin:useredit:armour": {admin_level: 5},
    // Изменить игроку скин (временно)
    "admin:useredit:skin": {admin_level: 4},
    // Выдать игроку фракцию и ранг фракции
    "admin:useredit:fraction": {admin_level: 3},
    // Выдать/Снять бан персонажа
    "admin:useredit:banuser": {admin_level: 2},
    // Выдать/Снять войс мут
    "admin:useredit:vmute": {admin_level: 1},
    // Выдать/Снять текстовый мут
    "admin:useredit:cmute": {admin_level: 1},
    // Выдать варн
    "admin:useredit:givewarn": {admin_level: 2},
    // Снять варн
    "admin:useredit:unwarn": {admin_level: 4},
    // Выдать/Снять бан аккаунта
    "admin:useredit:banaccount": {admin_level: 2},
    // Изменить игроку количество коинов
    "admin:useredit:coins": {admin_level: 6},
    // Изменить игроку количество фишек казино
    "admin:useredit:chips": {admin_level: 6},
    // Управление випкой игрока
    "admin:useredit:vipcontrol": {admin_level: 5},
    // Вылечить игроков в радиусе
    "admin:allheal": {admin_level: 1},
    // Изменить игроку количество налички
    "admin:useredit:money": {admin_level: 5},
    // Изменить игроку уровень
    "admin:useredit:level": {admin_level: 5},
    // Выдать игроку ТС
    "admin:vehicle:givetoplayer": {admin_level: 6},
    // Редактор конфигов ТС
    "admin:vehicle:configs": {admin_level: 7},
    // Открыть любой ТС не имея базового доступа
    "admin:vehicle:unlock": {admin_level: 5},
    // Выдать любой предмет
    "admin:inventory:create": {admin_level: 5},
    // Доступ к меню Игровые данные в админ разделе
    "admin:gamedata:menu": {admin_level: 6},
    // Настройки сервера
    "admin:serversetting:menu": {admin_level: 7},
    // Смена времени и погоды в режиме реального времени
    "admin:weather:set": {admin_level: 5},
    // Управление дверьми дома
    "admin:houses:door": {admin_level: 5},
    // Управление метками гаража, входа
    "admin:houses:editmarks": {admin_level: 7},
    // Доступ к инвентарю
    "admin:inventory:accessplayer": {admin_level: 5},
    // Создание промокода
    "admin:promocode": {admin_level: 6},
    // Управление голосованием
    "admin:vote": {admin_level: 5},
    // Настройки функций x2
    "admin:x2func": {admin_level: 7},
    // Выдача PayDay всем игрокам
    "admin:paydayglobal": { admin_level: 6 },
    // Удалить персонажа
    "admin:deletepersonage": { admin_level: 7 },
    // Очистить персонажа
    "admin:celarpersonage": { admin_level: 7 },
    // Сменить ID персонажа
    "admin:changeidpersonage": { admin_level: 7 },
    // Выдать PayDay
    "admin:useredit:payday": { admin_level: 6 },
    // Управление семьями
    "admin:familyControl": { admin_level: 4 },
    // Управление балансом семьи
    "admin:familyBank": { admin_level: 5 },
    // Изменить игроку ранг семьи
    "admin:useredit:familyRank": {admin_level: 4},
    // Управление чёрным списком Social
    "admin:blacklist": {admin_level: 5},
    // Управление переключением ЗЗ
    "admin:safezones": {admin_level: 4},
    // Управление медиа-статусом
    "admin:setmedia": {admin_level: 6},
    // Смены имени игроку
    "admin:setusername": {admin_level: 5},
    // Сбросить пароль
    "admin:resetpassword": {admin_level: 5},
    // Перекрасить зону капта
    "admin:changeCaptZone": {admin_level: 4},
    // Начать бизвар
    "fraction:bizwar:start": { rankLast: 1 },
    // Участвовать в бизваре
    "fraction:bizwar:join": { rank: 4 },
    // Выдавать / забирать платные анимации
    "admin:animation:set": { rank: 6 },
}

export interface PermissionConfigPool {
    [name: string]: PermissionConfig;
}
export interface PermissionConfig {
    admin_level?: number;
    fractions?: number[];
    /** Минимальный ранг для доступа */
    rank?: number;
    /** Минимальный ранг для доступа с конца
     * @example 2 - при 14 рангах даст доступ только 14 и 13 рангу
     */
    rankLast?: number;
    /** Доступ только лидеру */
    leader?: true;
    /** Доступ только гос структурам */
    gos?: true;
}