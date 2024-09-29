export const MUSIC_PLAYER_DIST = 15;
export const MUSIC_PLAYER_MAX_VOLUME_DEFAULT = 0.7;
/** Через сколько минут можно загрузить новую песню игроку */
export const MUSIC_NEW_DOWNLOAD_MIN_BLOCK = 2;
/** На каком расстоянии можно ставить плееры между собой */
export const MUSIC_PLACE_DISTANCE_BETWEEN = 20;
/** Ограничение потоков на загрузку. Это блокировка, чтобы много игроков не могло одновременно загружать песни. Более чем 4-5 может плохо кончится */
export const MUSIC_NEW_DOWNLOAD_ONE_TIME = 4;
export type MUSIC_GUI_TASKS = 'next' | 'prev' | 'shuffle' | 'repeate' | 'moveDown' | 'moveUp' | 'load' | 'block' | 'private' | 'paused' | 'delete' | 'volume'
export type MUSIC_GUI_SONG_TYPE = 'spotify' | 'youtube' | 'player'

export interface MusicGuiData {
    id:string;
    volume:number;
    paused:boolean;
    repeate:boolean;
    rand:boolean;
    public:boolean;
    currentSong: {
        id: string,
        time: number
    };
    playList: {id: string, name: string, duration: number}[];
    playListLast: {id: string, name: string, duration: number}[];
    playListMy: {id: string, name: string, duration: number}[];
}