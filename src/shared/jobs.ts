import {MINIGAME_TYPE} from "./minigame";
import {TAXI_CONF} from "./taxi";
import {ORDER_MENU_POS} from "./order.system";
import {GR6_BASE_POS} from "./gr6";
import {LEVEL_PERMISSIONS} from "./level.permissions";
import {CONSTRUCTION_REGISTER_POS} from "./construction";

export interface IJobUserMenu {
    img: string,
    title: string,
    lvl: number,
    maxLvl: number,
    exp: number,
    maxExp: number,
}

interface jobPointTaskBase {
    /** Координата X */
    x: number;
    /** Координата Y */
    y: number;
    /** Координата Z */
    z: number;
    /** Угол поворота тела, в который станет игрок когда достигнет точки */
    h?: number;
    /** Текст уведомления, которое отобразится при достижении точки */
    entertext?: string;
    /** Текст уведомления, которое отобразится при УСПЕШНОМ завершении точки */
    successtext?: string;
    /** Сценарий, который автоматически начнёт воспроизводится при достижении точки, если не указать - то игрок будет просто стоять */
    task?: string | [string, string];
    /** Время в секундах, которое игрок проведёт на точке, по умолчанию время не указано, а значит что точка будет сразу засчитана игроку. */
    time?: number;


}
export interface jobPointTaskPointItem extends jobPointTaskBase {
    /** Текст уведомления, которое отобразится при УСПЕШНОМ завершении точки */
    successtext?: string;
    /** Текст уведомления, которое отобразится при ПРОВАЛЬНОМ завершении точки */
    failtext?: string;
    /** Название мини-игры, в которую необходимо сыграть и выиграть для того, чтобы точка была пройдена успешно */
    minigame?: MINIGAME_TYPE;

}
export interface jobPointTaskStartItem extends jobPointTaskBase {
    /** Текст уведомления, которое отобразится при ПРОВАЛЬНОМ завершении точки */
    failtext?: string;
    // /** Название мини-игры, в которую необходимо сыграть и выиграть для того, чтобы точка была пройдена успешно */
    minigame?: MINIGAME_TYPE;
}

interface TaskItemBase {
    /** Название задание */
    name: string,
    /** Необходимый уровень, если требуется 1 или выше */
    level?: 1 | 2 | 3 | 4,
    /** Описание задания */
    desc: string;
    /** Награда за одно выполненое задание */
    money: number;
    /** Количество единиц опыта, которые даються за выполнение */
    exp: number;
    /** Точки, которых необходимо достигнуть игроку */
    points: jobPointTaskPointItem[],
    /** Тип работы (0 - Просто бегать по точкам, 1 - от одной точки до другой)
     * @description 0 Подходит например для стройки, то есть просто расставленные точки, игрок по ним ходит и херачит молотком, 1 - это допустим что то отвезти, в одной точке он берёт заказ, в другую относит
     * Точки берутся случайным образом из массивов
     */
    type: 0 | 1,
}
export interface TaskItem0 extends TaskItemBase {
    type: 0,
}
export interface TaskItem1 extends TaskItemBase {
    type: 1,
    /** Точки, которые будут конечными, они необходимы при type = 1, то есть от одной точки до другой */
    pointsEnd: jobPointTaskStartItem[],
}

export interface jobData {
    /** Спрайт для меню работы */
    sprite?: string;
    /** Если нужно разместить метку на карте */
    icon?: number;
    /** Цвет иконки на карте */
    icon_color?: number;
    /** Короткий ID работы для технической обработки, а так же по нему будет  */
    id: JobId;
    /** Название работы
     * @example Стройка, Мойка окон
     */
    name: string;
    /** Местоположение, где происходит трудоустройство */
    pos: { x: number, y: number, z: number };
    /** Короткое описание работы */
    desc: string;
    /** Подробное описание работы */
    full_desc: string;
    tasks: (TaskItem0 | TaskItem1)[];
    /** Награда за 100% опыт работы */
    maxLevelReward?: number;
    /** Разрешить использовать ТС на маркере */
    allowVehicle?:boolean;
    /** Ограничение по квесту */
    quest?: {
        /** ID квеста */
        id: number,
        /** Квест должен быть завершён?
         * 0 - Должен быть активным, но не завершённым
         * 1 - Должен быть завершённым
         * 2 - Любой вариант
         */
        completed: 0 | 1 | 2
    };
    /** Гардероб работы. Применяется автоматически на персонажа */
    dressMale?:[number, number, number][];
    /** Гардероб работы. Применяется автоматически на персонажа */
    dressFemale?:[number, number, number][];
}

export const JOBS_ADVANCED_LIST: {
    /** Название */
    name: string,
    /** Короткое описание */
    desc: string,
    /** Полное описание */
    descFull: string,
    pos: {
        x: number,
        y: number
    }
}[] = [
        { name: 'Служба такси', desc: 'Катайте пассажиров', descFull: 'Доступна со 2 уровня персонажа.\nДля того, чтобы вам устроиться на работу таксистом - требуется :\n1. Получить права категории B в лицензионном центре.\n2. Приехать в таксопарк и устроиться на работу.\n3. Арендовать в таксопарке автомобиль и отправляться работать.\nЧтобы брать заказы откройте меню взаимодействия с авто на клавишу G. Вверху найдите список заказов и выбирайте заказ.\nЗарплата - 50$ за километр при заказе игроком, 90$ за доставку NPC.', pos: TAXI_CONF.npc.pos },
        { name: 'Грузоперевозки', desc: 'Доставляйте товары в бизнесы и получайте за это монетку', descFull: 'Доступна с 3 уровня персонажа.\nТребования для устройства на работу:\n1. Получить права грузовой категории в лицензионном центре.\n2. Приехать в службу доставки и арендовать грузовик (Работать можно только на этом транспорте).\n3. Выбрать заказ на пункте выдачи.\n4. Отправится на погрузку.\nЗаказы от бизнесов оплачивают их владельцы. Также есть случайные заказы, суммы за которые оцениваются вашим уровнем грузоперевозчика.\nРабота дальнобойщика делиться на три уровня.\nНачальный уровень - малый транспорт аренда 500$, доставки от 1350 до 2250$.\n Средний уровень - транспорт аренда 1000$, доставки от 1350 до 2250$ + надбавка. \nВысокий уровень - крупный транспорт аренда 1500$, доставки от 1350 до 2250$ + надбавка', pos: ORDER_MENU_POS[0] },
        { name: 'Gruupe Sechs', desc: 'Катайтесь по городу и собирайте монетки', descFull: `Доступна со ${LEVEL_PERMISSIONS.GR6} уровня персонажа.\nТребования для устройства на работу:\n1. Получить права грузовой категории в лицензионном центре.\n2. Приехать в службу Gruppe 6 и устроиться на работу\n3. Арендовать инкассаторский автомобиль, если вы создаете свою команду.\n3. Можно вступить в команду инкассаторов или сделать свою. Минимум 2 человека.\n4. Получаете задание и отправляетесь на маршрут.\n5. После сбора всех точек, возвращаетесь на базу для разгрузки и берете новый маршрут.`, pos: GR6_BASE_POS },
        { name: 'Ремонт квартир', desc: 'Занимайтесь ремонтными работами', descFull: `Доступна со ${LEVEL_PERMISSIONS.ROOM} уровня персонажа.\nЗовите друзей и стройте квартиру быстрее вместе с ними, зарабатывайте большие деньги, собирайте мебель, кладите плитку, красьте стены и многое другое. Выполнив всю работу, каждый участник получает зарплату в зависимости от количества сделанного.`, pos: {x: CONSTRUCTION_REGISTER_POS.x, y: CONSTRUCTION_REGISTER_POS.y} },
        { name: 'Электрик', desc: 'Ремонт электрооборудования', descFull: 'Работа доступна с 0 уровня персонажа.\nДля того, чтобы вам устроиться на работу электриком - требуется :\n  Приехать на электростанцию и выбрать доступный уровень работы.\n Зарплата зависит от уровня работы который вам доступен, а именно 50$ на первом (за одну точку), 1000$ на втором и 2000$ на третьем соответственно.', pos: {x: 726.75, y: 138.48} },
        { name: 'Водитель автобуса', desc: 'Управляйте автобусом и развозите людей по городу', descFull: 'Работа доступна с 0 уровня персонажа.\nДля того, чтобы вам устроиться на работу водителем автобуса - требуется :\n Получить лицензию на грузовой транспорт в лицензионном центре а далее приехать в автобусное депо и устроится там на работу.\n Зарплата зависит от уровня работы который вам доступен, а именно 195$ на первом уровне (за одну точку), 220$ на втором, 270$ на третьем, 350$ на четвертом и 500$ на пятом уровне.', pos: {x: 425.91, y: -621.62} },
    ]

export type JobId = "builder" | "garden" | "cleaning" | "marihuana" | "electrician" | "busman" | "fisher"

export const jobsList: jobData[] = [
    {
        icon: 566, icon_color: 0, id: "builder", name: "Стройка",
        dressMale:
        [   [3,0,0],
            [8,1,0],
            [11,1,1],
            [1,0,0],
            [4,90,2],
            [6,24,0],
        ],
        dressFemale: [
            [3,0,0],
            [8,1,1],
            [11,88,0],
            [1,0,0],
            [4,93,1],
            [6,66,0],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ]
        , pos: { x: -510.23, y: -1002.15, z: 22.55 }, desc: "Занимайтесь строительными работами", full_desc: "Занимайтесь строительными работами на начальном уровне персонажа. Зарплата варьируется от 60 до 100$ за 1 выполненную точку в зависимости от вашего уровня данной работы.", tasks: [
            {
                name: "Забивать гвозди", level: 2, desc: "Берите в руки в молоток, поднимайтесь на крышу и забивайте гвозди туда, куда укажут", money: 100, type: 0, points: [
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -444.91, y: -911.71, z: 46.98, h: 176, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -442.60, y: -914.41, z: 46.98, h: 2, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -443.35, y: -947.16, z: 46.98, h: 271, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -441.94, y: -958.93, z: 46.98, h: 186, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -441.96, y: -950.26, z: 46.98, h: 359, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -441.84, y: -943.23, z: 46.98, h: 181, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -457.85, y: -934.86, z: 46.98, h: 276, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'loop'], x: -454.49, y: -953.39, z: 46.98, h: 93, minigame: MINIGAME_TYPE.HAMMER },
                ], exp: 1
            },
            {
                name: "Упаковка коробок", desc: "Упакуйте коробку и заклейте ее скотчем.", money: 60, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.26, y: -967.70, z: 24.90, h: 277, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -469.23, y: -957.04, z: 28.39, h: 87, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -470.11, y: -926.19, z: 28.39, h: 70, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -469.33, y: -957.05, z: 37.68, h: 79, minigame: MINIGAME_TYPE.BOX }
                ], exp: 1
            },
            {
                name: "Сверление дырок", level: 1, desc: "Сверлите дырки", money: 80, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -444.26, y: -959.21, z: 46.98, h: 191, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.56, y: -914.43, z: 46.98, h: 359, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.56, y: -914.43, z: 46.98, h: 359, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -468.42, y: -931.28, z: 37.68, h: 91, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -460.90, y: -944.20, z: 37.69, h: 88, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.86, y: -952.68, z: 37.68, h: 270, minigame: MINIGAME_TYPE.DRILL }
                ], exp: 1
            },
            {
                name: "Сварка", desc: "Сварите 2 металлических листа", money: 70, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -459.80, y: -947.70, z: 28.39, h: 28, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -458.70, y: -909.92, z: 28.39, h: 97, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -471.68, y: -954.96, z: 46.83, h: 18, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -471.79, y: -952.09, z: 46.83, h: 180, minigame: MINIGAME_TYPE.SVARKA },
                ], exp: 1
            },
            {
                name: "Чинить проводку", level: 3, desc: "Чините проводку в разных зданиях", money: 100, type: 0, points: [
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'floyd_fellpackage_endidle_dockworker1'], x: -490.35, y: -1020.24, z: 28.13, h: 95, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'floyd_fellpackage_endidle_dockworker1'], x: -482.00, y: -1039.10, z: 28.13, h: 146, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'floyd_fellpackage_endidle_dockworker1'], x: -456.90, y: -954.85, z: 28.39, h: 357, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'floyd_fellpackage_endidle_dockworker1'], x: -447.36, y: -895.61, z: 28.39, h: 5, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ['missheistdockssetup1ig_4@end_idle', 'floyd_fellpackage_endidle_dockworker1'], x: -448.45, y: -889.57, z: 28.39, h: 182, minigame: MINIGAME_TYPE.WIRES },
                ], exp: 1
            },

        ]
    },
    {
        icon: 486, icon_color: 81,
        dressMale:
        [
            [3,0,0],
            [8,5,0],
            [11,135,4],
            [1,0,0],
            [4,27,7],
            [6,1,11],
            
        ],
        dressFemale: [
            [3,0,0],
            [8,2,0],
            [11,17,0],
            [4,74,4],
            [6,1,8],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ],
         id: "garden", name: "Сад", pos: { x: 2411.83, y: 4997.15, z: 45.58 }, desc: "Обрезайте листья на кустах, собирайте апельсины на деревьях", full_desc: "Обрезайте деревья или собирайте апельсины .Зарплата варьируется от 55 до 65$ за 1 выполненную точку в зависимости от вашего уровня данной работы.", tasks: [
            {
                name: "Сбор апельсинов", desc: "Идите куда укажут метки и срывайте апельсины", money: 55, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.ORANGE },
                ], exp: 1
            },
            {
                name: "Обрезать листья", level:1,  desc: "Идите куда укажут метки и обрезайте листья на кустах", money: 65, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.SCISSORS },
                ], exp: 1
            },
            {
                name: "Поливать дерево", level: 1, desc: "Идите куда укажут метки и поливайте деревья", money: 60, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.WATERPOT },
                ], exp: 1
            },


        ]
    },
    {
        icon: 537, icon_color: 38,
        dressMale:
        [
            [3,0,0],
            [8,15,0],
            [11,9,10],
            [4,7,2],
            [6,8,0],
                        
        ],
        dressFemale: [
            [3,14,0],
            [8,2,0],
            [11,14,14],
            [4,11,7],
            [6,4,2],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ],
         id: "cleaning", name: "Клининговая компания", pos: { x: -1534.21, y: -452.88, z: 34.888 }, desc: "Мойте окна", full_desc: "Мойте окна.Зарплата 50$ за 1 выполненную точку в зависимости от вашего уровня данной работы.", tasks: [
            {
                name: "Мойка окон", desc: "Подойдите к окну и начните мыть его.", money: 100, type: 0, points: [
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1536.07, y: -457.72, z: 39.52, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1538.97, y: -455.77, z: 39.52, h: 135, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1541.56, y: -453.25, z: 39.52, h: 129, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1544.90, y: -450.59, z: 39.52, h: 129, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1551.37, y: -448.14, z: 39.52, h: 137, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1555.72, y: -444.26, z: 39.52, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1551.55, y: -438.94, z: 39.52, h: 42, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1547.47, y: -434.68, z: 34.88, h: 46, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1548.89, y: -436.27, z: 34.88, h: 64, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1550.50, y: -438.00, z: 34.88, h: 49, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1543.59, y: -444.94, z: 34.88, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1538.21, y: -449.19, z: 34.88, h: 136, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1536.21, y: -451.25, z: 34.88, h: 139, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1530.74, y: -455.80, z: 34.88, h: 136, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1533.02, y: -461.35, z: 34.41, h: 25, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1534.67, y: -463.12, z: 34.41, h: 35, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ['amb@world_human_maid_clean@', 'base'], x: -1538.46, y: -465.82, z: 34.41, h: 32, minigame: MINIGAME_TYPE.WINDOW },
                ], exp: 1
            },
        ]
    },
    {
        icon: 140, icon_color: 11,
        dressMale:
        [
            [3,4,0],
            [8,15,0],
            [11,65,1],
            [4,38,1],
            [6,14,0],
            [100,11,0],
            [102,33,0],
            [106,2,0],
                        
        ],
        dressFemale: [
            [3,3,0],
            [8,2,0],
            [11,59,1],
            [4,38,1],
            [6,66,4],
            [100,120,0],
            [101,5,0],
        ],
         id: "marihuana", name: "Гараж Тони", pos: { x: 1966.38, y: 5184.26, z: 46.95 }, desc: "Помогите местному авторитету", full_desc: "Помогите местному авторитету. Зарплата варьируется от 45 до 60$ за 1 выполненную точку в зависимости от вашего уровня данной работы.", tasks: [
            {
                name: "Обработка марихуаны", desc: "Обработайте кустарники марихуаны", money: 50, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.76, y: 5175.07, z: 47.00, h: 88, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.75, y: 5176.46, z: 47.00, h: 91, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.65, y: 5177.78, z: 47.00, h: 91, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.60, y: 5179.11, z: 47.00, h: 92, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.55, y: 5180.86, z: 47.00, h: 92, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.44, y: 5182.25, z: 47.00, h: 76, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1938.21, y: 5184.05, z: 47.00, h: 80, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1940.52, y: 5183.99, z: 47.00, h: 359, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1939.30, y: 5184.02, z: 47.00, h: 9, minigame: MINIGAME_TYPE.GRASS },
                ], exp: 1
            },
            {
                name: "Сбор марихуаны", level: 1,  desc: "Соберите марихуаны с кустов и отнесите", money: 60, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'],x: 1994.96, y: 5128.82, z: 43.16, h: 226, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1996.32, y: 5130.33, z: 43.42, h: 243, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1998.28, y: 5132.49, z: 43.82, h: 235, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1998.28, y: 5132.49, z: 43.82, h: 235, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2001.56, y: 5136.09, z: 44.42, h: 232, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2003.37, y: 5137.75, z: 44.72, h: 229, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2004.78, y: 5139.40, z: 44.98, h: 239, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2006.44, y: 5140.96, z: 45.21, h: 249, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 2009.94, y: 5144.05, z: 45.65, h: 277, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                ], exp: 1
            },
            {
                name: "Упаковка марихуаны", desc: "Упаковывайте марихуаны", money: 45, type: 0, points: [
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1944.76, y: 5178.13, z: 47.00, h: 0, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1947.15, y: 5177.98, z: 47.00, h: 359, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1950.39, y: 5178.00, z: 47.00, h: 1, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1952.98, y: 5178.04, z: 47.00, h: 0, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1952.73, y: 5183.04, z: 47.00, h: 179, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1950.33, y: 5183.08, z: 47.00, h: 180, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1947.02, y: 5183.03, z: 47.00, h: 180, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ['amb@code_human_wander_texting@male@base', 'static'], x: 1944.37, y: 5182.98, z: 47.00, h: 181, minigame: MINIGAME_TYPE.BOX_GRASS },
                ], exp: 1
            },
        ]
    }
]

export const getJobData = (id: JobId) => {
    return jobsList.find(q => q.id === id);
}


export function getJobName(jobId: JobId): string;
export function getJobName(job: jobData): string;
export function getJobName(item: jobData | JobId) {
    const data = typeof item === "string" ? getJobData(item) : item;
    if (!data) return null;
    return data.name
}

export const JOB_MAX_EXP = 1000;


export const getLevelByExp = (exp: number) => {
    if (typeof exp !== "number") return 0;
    if (exp == 1000) return 4;
    if (exp >= 300) return 3;
    if (exp >= 200) return 2;
    if (exp >= 100) return 1;
    return 0;
}