export const MAFIA_CLEAN_WANTED_CONFIG: {
    /** Имя */
    name: string,
    /** Модель НПЦ */
    model: string,
    /** Местоположение НПЦ */
    pos: Vector3Mp,
    /** Угол поворота НПЦ */
    heading: number,
    /** Стоимость за 1 уровень розыска */
    costPerStar: number,
}[] = [
        {
            name: "Reira",
            model: "a_f_y_femaleagent",
            pos: new mp.Vector3(705.81, -966.68, 30.41),
            heading: 300,
            costPerStar: 5000,
        },
        {
            name: "Eduard",
            model: "s_m_y_devinsec_01",
            pos: new mp.Vector3(-749.69, 5589.60, 38.03),
            heading: 231,
            costPerStar: 5000,
        },
        {
            name: "Ivan",
            model: "csb_reporter",
            pos: new mp.Vector3(1702.38, 3290.27, 48.92),
            heading: 286,
            costPerStar: 5000,
        }
    ]