/** Дальность работы войса по умолчанию */
export const MaxRange = 15;
/** Делитель громкости когда цель за стеной */
export const VOICE_WALL_DIVIDER = 28;
/** Делитель громкости когда один из двоих в ТС */
export const VOICE_VEH_ONE_DIVIDER = 3;
/** Делитель громкости когда оба в ТС (разных) */
export const VOICE_VEH_TWO_DIVIDER = 5;

export interface MegaphoneItem {
    /** Модель пропа/ТС, около которого необходимо стоять */
    model: string,
    /** Дистанция на которую увеличивается дальность войса */
    dist: number,
    /** Множитель громкости
     * @example
     * 2.0 - Увеличит громкость вдвое
     * 1.0 - Громкость не изменится
     * */
    multiple: number
}


/** Список микрофонов, около которых человек будет говорить громче и дальше, в зависимости от указанных параметров */
export const MICROPHONE_PROPS:MegaphoneItem[] = [
    {
        model:"v_microphone",
        dist: 40,
        multiple: 4
    },
];

/** Список моделей ТС, у которых на пассажирском сидении есть доступ к мегафону */
export const POLICE_MEGAPHONE_PROPS: MegaphoneItem[] = [
    {
        model:"police",
        dist: 60,
        multiple: 6
    },
    {
        model:"police2",
        dist: 60,
        multiple: 6
    },
    {
        model:"police3",
        dist: 60,
        multiple: 6
    },
    {
        model:"police4",
        dist: 60,
        multiple: 6
    },
    {
        model:"ford",
        dist: 60,
        multiple: 6
    },
    {
        model:"sheriff",
        dist: 60,
        multiple: 6
    },
    {
        model:"sheriff2",
        dist: 60,
        multiple: 6
    },
    {
        model:"pranger",
        dist: 60,
        multiple: 6
    },
    {
        model:"riot",
        dist: 60,
        multiple: 6
    },
    {
        model:"riot2",
        dist: 60,
        multiple: 6
    },
    {
        model:"policeb",
        dist: 60,
        multiple: 6
    },
    {
        model:"insurgent2",
        dist: 60,
        multiple: 6
    },
    {
        model:"polcorvet",
        dist: 60,
        multiple: 6
    },
    {
        model:"policet",
        dist: 60,
        multiple: 6
    },
    {
        model:"baller5",
        dist: 60,
        multiple: 6
    },
    {
        model:"dinghy4",
        dist: 60,
        multiple: 6
    },
    
];