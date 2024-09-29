/** Сколько времени будет активен варн за выход из игры в наручниках */
export const CUFF_LEAVE_WARN_DAYS = 10
/** Сколько времени jail за выход из игры в наручниках */
export const CUFF_LEAVE_JAIL_MINUTES = 180

/** Количество минут за одну звезду розыска */
export const JAIL_MINUTES_PER_STAR = 12
/** Максимальный уровень розыска */
export const MAX_WANTED_LEVEL = 5;
/** Координаты админской тюрьмы */
export const ADMIN_PRISON_COORD = new mp.Vector3(1641.21, 2570.45, 45.56)
/** Радиус админской тюрьмы */
export const ADMIN_PRISON_RADIUS = 30
/** Данные обычной тюрьмы */
export const PRISON_DATA: [Vector3Mp, number, Vector3Mp] = [new mp.Vector3(1686.48, 2515.00, 45.56), 310, new mp.Vector3(1849.25, 2585.41, 44.67)];
/** Местоположение всех ПК для ареста игрока */
export const JAIL_PC_COORDS:Vector3Mp[] = [new mp.Vector3(1690.71, 2593.26, 44.58), new mp.Vector3(472.11, -974.96, 22.31), new mp.Vector3(2510.00, -354.03, 104.69), new mp.Vector3(1857.34, 3685.44, 29.26), new mp.Vector3(-441.60, 6012.94, 26.99)]

/** Минимальная сумма за минуту*/
export const ADV_JAIL_FREE_COST_MIN = 400;
/** Максимальная сумма за минуту*/
export const ADV_JAIL_FREE_COST_MIN_MORE = 700;
/** Сколько минут осталось чтобы считать по максималке*/
export const ADV_JAIL_FREE_COST_MIN_MORE_TIME = 45;

/** Сколько процентов от суммы будет капать на руки адвокату */
export const ADV_MONEY_PERCENT_TO_USER = 20;

/** Сколько минут добавляется при попытке побега */
export const TRY_RUN_ADD_TIME = 5;

/** Сколько максимально минут администратор может выдать наказание. На админов 5-6 ЛВЛ это не расспространяется */
export const JAIL_ADMIN_MAX_MIN = 500;