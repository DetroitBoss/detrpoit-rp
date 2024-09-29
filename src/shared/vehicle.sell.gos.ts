
export const VEHICLE_SELL_GOS_CONFIG = {
    model: "a_m_m_prolhost_01",
    name: 'Padlo',
    pos: new mp.Vector3(-1657.18, -818.59, 10.16),
    heading: 157,
    distanceForSell: 30
}

export interface VehicleSellItemBase {
    /** Точка где будет стоять машина. Используйте координаты для плоского маркера */
    pos: Vector3Mp;
    /** Точка где будет стоять текст. Используйте обычные координаты */
    textPos: Vector3Mp;
    /** Угол поворота ТС, чтобы машины стояли ровно */
    heading: number;
}

/** Радиус маркера точки */
export const VEHICLE_SELL_POS_RADIUS = 3;
/** Насколько далеко может отойти продавец от точки продажи */
export const VEHICLE_SELL_PLAYER_RADIUS = 100;


export const VEHICLE_SELL_CONFIG: VehicleSellItemBase[] = [
    // {pos: new mp.Vector3(0,0,0), textPos: new mp.Vector3(0,0,0)}
    {pos: new mp.Vector3(-1602.67, -886.40, 8.68), textPos: new mp.Vector3(-1600.32, -882.37, 9.69), heading: 323},
    {pos: new mp.Vector3(-1607.23, -882.27, 8.64), textPos: new mp.Vector3(-1605.40, -878.11, 9.67), heading: 316},
    {pos: new mp.Vector3(-1611.81, -878.30, 8.70), textPos: new mp.Vector3(-1609.99, -873.96, 9.71), heading: 319},
    {pos: new mp.Vector3(-1616.78, -874.58, 8.68), textPos: new mp.Vector3(-1614.45, -869.80, 9.74), heading: 319},
    {pos: new mp.Vector3(-1621.30, -870.33, 8.68), textPos: new mp.Vector3(-1619.54, -866.22, 9.73), heading: 321},
    {pos: new mp.Vector3(-1626.17, -866.53, 8.68), textPos: new mp.Vector3(-1624.13, -862.16, 9.74), heading: 319},
    {pos: new mp.Vector3(-1630.99, -862.71, 8.67), textPos: new mp.Vector3(-1628.92, -858.30, 9.74), heading: 320},
    {pos: new mp.Vector3(-1636.91, -857.59, 8.67), textPos: new mp.Vector3(-1634.56, -852.74, 9.75), heading: 319},
    {pos: new mp.Vector3(-1641.63, -853.55, 8.65), textPos: new mp.Vector3(-1639.15, -848.68, 9.70), heading: 320},
    {pos: new mp.Vector3(-1646.13, -849.40, 8.62), textPos: new mp.Vector3(-1644.15, -845.01, 9.66), heading: 319},
    {pos: new mp.Vector3(-1650.85, -845.32, 8.58), textPos: new mp.Vector3(-1648.69, -840.49, 9.71), heading: 321},
    {pos: new mp.Vector3(-1655.67, -841.54, 8.65), textPos: new mp.Vector3(-1653.41, -836.78, 9.73), heading: 318},
    {pos: new mp.Vector3(-1660.07, -837.46, 8.67), textPos: new mp.Vector3(-1657.92, -832.71, 9.74), heading: 320},

    {pos: new mp.Vector3(-1608.32, -888.44, 8.50), textPos: new mp.Vector3(-1610.78, -893.35, 9.26), heading: 140},
    {pos: new mp.Vector3(-1613.43, -884.73, 8.50), textPos: new mp.Vector3(-1615.32, -889.11, 9.26), heading: 127},
    {pos: new mp.Vector3(-1617.70, -880.38, 8.54), textPos: new mp.Vector3(-1620.28, -885.56, 9.24), heading: 140},
    {pos: new mp.Vector3(-1622.69, -876.72, 8.53), textPos: new mp.Vector3(-1625.07, -881.47, 9.27), heading: 139},
    {pos: new mp.Vector3(-1627.46, -872.89, 8.53), textPos: new mp.Vector3(-1629.63, -877.46, 9.28), heading: 141},
    {pos: new mp.Vector3(-1631.87, -868.52, 8.54), textPos: new mp.Vector3(-1634.35, -873.60, 9.27), heading: 139},
    {pos: new mp.Vector3(-1638.06, -863.47, 8.54), textPos: new mp.Vector3(-1639.98, -867.95, 9.30), heading: 140},
    {pos: new mp.Vector3(-1642.60, -859.47, 8.54), textPos: new mp.Vector3(-1644.50, -863.74, 9.31), heading: 139},
    {pos: new mp.Vector3(-1647.54, -855.74, 8.52), textPos: new mp.Vector3(-1649.24, -859.89, 9.31), heading: 139},
    {pos: new mp.Vector3(-1651.98, -851.53, 8.45), textPos: new mp.Vector3(-1653.87, -855.75, 9.27), heading: 140},
    {pos: new mp.Vector3(-1656.80, -847.58, 8.47), textPos: new mp.Vector3(-1658.71, -851.92, 9.26), heading: 140},
    {pos: new mp.Vector3(-1661.39, -843.60, 8.53), textPos: new mp.Vector3(-1663.29, -847.87, 9.28), heading: 139},
    {pos: new mp.Vector3(-1666.21, -839.70, 8.52), textPos: new mp.Vector3(-1668.28, -844.13, 9.28), heading: 140},
]
