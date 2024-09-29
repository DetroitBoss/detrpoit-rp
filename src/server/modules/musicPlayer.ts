import {ItemEntity} from "./typeorm/entities/inventory";
import {inventory} from "./inventory";
import {CustomEvent} from "./custom.event";
import {system} from "./system";

import fs from 'fs';
import {inventoryShared, OWNER_TYPES} from "../../shared/inventory";
import {
    MUSIC_GUI_SONG_TYPE,
    MUSIC_GUI_TASKS,
    MUSIC_NEW_DOWNLOAD_MIN_BLOCK,
    MUSIC_NEW_DOWNLOAD_ONE_TIME,
    MUSIC_PLACE_DISTANCE_BETWEEN,
    MUSIC_PLAYER_DIST,
    MusicGuiData
} from "../../shared/musicPlayer";
import {
    downloadSong,
    getSongData,
    getSongDuration,
    getSongExists,
    getSongPlayerUrl,
    songsBlock,
    songsData
} from "./songdownloader";
import {colshapeHandle, colshapes} from "./checkpoints";
import {gui} from "./gui";
import {SocketSyncWeb} from "./socket.sync.web";
import {NoSQLbase} from "./nosql";
import {SONG_FOLDER} from "../../shared/songdonwloader";
import {isPlayerInActiveSafeZone} from "./safezone";
import { CASINO_MAIN_DIMENSION } from '../../shared/casino/main'
import { getX2Param } from "./usermodule/static";

gui.chat.registerCommand('snd', ((player, q) => {
    CustomEvent.triggerClient(player, 'boxplayer:test', parseInt(q))
}))

let playerBlockDWN = new Map<number, boolean>()
let dwnOneTime = 0;

CustomEvent.registerClient('boombox:removeIgnore', (player, id) => {
    const user = player.user;
    if(!user) return;
    if(!user.hasPermission('admin:boomboxblock')) return;
    const indexB = songsBlock.data.findIndex(q => q == id);
    if(indexB > -1){
        songsBlock.data.splice(indexB, 1)
        songsBlock.save()
        player.notify('Песня удалена из блокировки', 'success')
    } else {
        player.notify('Песня не обнаружена в блокировочном листе', 'error')
    }
})

CustomEvent.registerCef('boombox:take', ((player, id: string) => {
    const user = player.user;
    if(!user) return;
    const item = BoxPlayer.get(id);
    if(!item || !item.isExists())
        return player.notify('Плеер уже забрали', 'error');

    item.takePlayer(player);
}))

CustomEvent.registerCef('boombox:load', (player, id: string, type: MUSIC_GUI_SONG_TYPE, url: string) => {
    return new Promise(resolve => {
        const user = player.user;
        if (!user) return resolve(false);

        const item = BoxPlayer.get(id);
        if (!item) return resolve(false);

        if (!item.isPlayerHasAccess(player)) {
            player.notify('У вас нет доступа к приватному плееру', 'error')
            return resolve(false);
        }

        if(type === 'player'){
            const idT = url.substr(1);
            if(!idT)
                return resolve(false);

            const target = BoxPlayer.get(idT);
            if(!target)
                return resolve(false);

            const playList = [...item.playList]
            let newItems = false
            target.playList.map(v => {
                if(!playList.includes(v)) {
                    playList.push(v)
                    newItems = true;
                }
            })
            if(newItems){
                item.playList = playList;
                item.syncWeb()
            }
            return resolve(true);
        } else {
            if(playerBlockDWN.has(player.dbid)){
                player.notify(`Подождите пару минут прежде загружать новую композицию`, 'error');
                return resolve(false)
            }
            if(dwnOneTime >= MUSIC_NEW_DOWNLOAD_ONE_TIME){
                player.notify(`Сейчас слишком много игроков добавляют новые песни, подождите пару минут`, 'error');
                return resolve(false)
            }
            const ids = player.dbid
            playerBlockDWN.set(ids, true)
            let q = setTimeout(() => {
                playerBlockDWN.delete(ids)
            }, MUSIC_NEW_DOWNLOAD_MIN_BLOCK * 60000)
            dwnOneTime++;
            downloadSong(url).then(result => {
                dwnOneTime--;
                if(!result) {
                    playerBlockDWN.delete(ids)
                    clearTimeout(q);
                    return resolve(false);
                }
                if(!mp.players.exists(player)) return resolve(false);
                if(!result.status){
                    player.notify(result.res, 'error');
                    return resolve(false);
                }
                if(result.new){
                    const index = songsData.data.findIndex(q => q.id === result.id);
                    if(index > -1){
                        songsData.data[index].owner = player.dbid;
                        songsData.save();
                    }
                }
                if(!item.isExists())
                    return resolve(false);

                item.loadSong(result.id, false)
                return resolve(true);
            })
        }
    })
})

CustomEvent.registerCef('boombox:task', (player, id: string, task: MUSIC_GUI_TASKS, ...args: any[]) => {

    const user = player.user;
    if (!user) return;

    const musicPlayer = MusicPlayer.get(id);
    if (!musicPlayer) return;
    
    if (!musicPlayer.isPlayerHasAccess(player))
        return player.notify('У вас нет доступа к приватному плееру', 'error');

    const moveSongs = (playlist: string[], index: number, nextIndex: number) => {
        const i = musicPlayer.playList[index];
        playlist[index] = musicPlayer.playList[nextIndex];
        playlist[nextIndex] = i;
        musicPlayer.playList = [...playlist];
        musicPlayer.savePlayList()
        musicPlayer.syncWeb()
    }

    if (task === 'shuffle') musicPlayer.rand = !musicPlayer.rand;
    if (task === 'repeate') musicPlayer.repeat = !musicPlayer.repeat;
    if (task === 'next') musicPlayer.nextSong()
    if (task === 'prev') musicPlayer.prevSong()
    if (task === 'paused') musicPlayer.paused = !musicPlayer.paused;
    if (task === 'moveDown') {
        const playlist = [...musicPlayer.playList]
        const id = args[0];
        let index = musicPlayer.playList.findIndex(q => q === id);
        if (index === -1) return;
        if (index >= musicPlayer.playList.length - 1) return;
        let nextIndex = index + 1;

        moveSongs(playlist, index, nextIndex);
    }
    if (task === 'moveUp') {
        const playlist = [...musicPlayer.playList]
        const id = args[0];
        let index = musicPlayer.playList.findIndex(q => q === id);
        if (index <= 0) return;
        let nextIndex = index - 1;

        moveSongs(playlist, index, nextIndex);
    }
    if (task === 'delete') {
        const id = args[0];
        let index = musicPlayer.playList.findIndex(q => q === id);
        if (index == -1) return;
        if (musicPlayer.currentSongUrl === id && musicPlayer.playList.length === 0) return;
        musicPlayer.playList.splice(index, 1)
        musicPlayer.savePlayList()
        if (musicPlayer.currentSongUrl === id) musicPlayer.nextSong()
        else musicPlayer.syncWeb()
    }
    if (task === 'load') {
        const id = args[0];
        musicPlayer.loadSong(id, !!musicPlayer.playList.find(z => z === id));
    }
    if (task === 'volume') {
        let id = args[0];
        id = Math.max(id, 0)
        id = Math.min(id, 100)
        musicPlayer.volume = id;
    }
    if (task === 'private' && musicPlayer.isPlayerHasAccess(player)) {
        musicPlayer.public = !musicPlayer.public;
    }
    if (task === 'block' && user.hasPermission('admin:boomboxblock')) {
        const id = args[0];
        const indexB = songsBlock.data.findIndex(q => q == id);
        if (indexB == -1) {
            const z = songsData.data.findIndex(v => v.id === id);
            if (z > -1) {
                songsData.data.splice(z, 1);
                songsData.save()
            }
            fs.rmdirSync(`${SONG_FOLDER}${id}.mp3`, {recursive: true});
            songsBlock.data.push(id);
            songsBlock.save()
            BoxPlayer.list.map(q => {
                let c = q.playList.findIndex(z => z == id);
                if (c > -1) {
                    q.playList.splice(c, 1)
                    q.savePlayList()
                    if (q.currentSongUrl == id) q.nextSong()
                    else q.syncWeb()
                }
            })
        }
    }
})

export abstract class MusicPlayer {
    private static readonly _pool: Map<string, MusicPlayer> = new Map<string, MusicPlayer>();

    public static get list() {
        return [...MusicPlayer._pool.values()]
    }

    public static get(id: string) {
        return MusicPlayer._pool.get(id);
    }

    abstract takePlayer(player: PlayerMp): void;
    abstract isPlayerHasAccess(player: PlayerMp): boolean;
    abstract getAttachEntityInfo(): { id: number, type: 'object' | 'vehicle' }

    public readonly id: string;

    public currentSongUrl: string;
    get currentSongName(){
        if(!this.currentSongUrl) return null
        return getSongData(this.currentSongUrl)?.name
    }

    private _playList: string[] = []
    get playList(){
        return this._playList
    }
    set playList(val){
        if(val){
            val = val.filter(q => getSongData(q))
        }
        this._playList = val;
    }

    private _volume = 100
    get volume(){
        return this._volume
    }
    set volume(val){
        this._volume = val;
        this.syncAllVolume()
    }

    private _paused = false
    get paused(){
        return this._paused
    }
    set paused(val){
        this._paused = val;
        this.syncAll()
    }

    private _repeat = false
    get repeat(){
        return this._repeat
    }
    set repeat(val){
        this._repeat = val;
        this.syncWeb()
    }

    private _rand = false
    get rand(){
        return this._rand
    }
    set rand(val){
        this._rand = val;
        this.syncWeb()
    }

    private _public = false
    get public(){
        return this._public
    }
    set public(val){
        this._public = val;
        this.syncWeb()
    }

    protected players = new Map<number, PlayerMp>();
    protected time: number;
    protected duration: number;

    private database: NoSQLbase<string>;
    private history: string[] = []

    protected constructor(databaseId: string) {
        this.id = databaseId;

        this.database = new NoSQLbase<string>(`boomboxes/${this.id}`);
        setTimeout(() => {
            this.playList = this.database.data;
            this.syncWeb()
        }, 1000)

        MusicPlayer._pool.set(this.id, this);
    }

    openForPlayer(player: PlayerMp) {
        player.user.setGui('boombox', 'boombox:init', this.getWebData(player))
    }

    isExists() {
        return MusicPlayer._pool.has(this.id);
    }

    destroy() {
        MusicPlayer._pool.delete(this.id);

        SocketSyncWeb.getfire(`boombox_${this.id}`).map(target => SocketSyncWeb.fireTarget(target, `boombox_${this.id}`, null))
        this.players.forEach((player, id) => {
            this.removePlayer(player);
        })
    }

    tick() {
        if (!this.playList.length)
            return;

        if (!this.currentSongUrl)
            return;

        if (![...this.players].length)
            return;

        if (!this.paused)
            this.time++;

        if ((this.time) >= this.duration)
            return this.nextSong()
    }

    addPlayer(player: PlayerMp) {
        const user = player.user;
        if (!user) return;
        if (!this.players.has(user.id)) {
            this.players.set(user.id, player);
            this.sync(player);

            CustomEvent.triggerClient(player, 'boxplayer:enter', this.id);
        }
    }

    removePlayer(player: PlayerMp) {
        if (!player) return;
        const user = player.user;
        if (!user) return;
        if (this.players.has(user.id)) this.players.delete(user.id);
        if (player && mp.players.exists(player)) CustomEvent.triggerClient(player, 'boxplayer:exit', this.id);
    }

    syncAllVolume() {
        this.syncWeb()

        this.players.forEach((player, id) => {
            if (!mp.players.exists(player)) return this.removePlayer(player);
            CustomEvent.triggerClient(player, 'boxplayer:dataVolume', this.id, this.volume)
        })
    }

    syncAll() {
        this.syncWeb()
        this.players.forEach((player, id) => {
            if (!mp.players.exists(player)) return this.removePlayer(player);
            this.sync(player)
        })
    }

    syncWeb() {
        SocketSyncWeb.getfire(`boombox_${this.id}`).map(target => SocketSyncWeb.fireTarget(target, `boombox_${this.id}`, JSON.stringify(this.getWebData(target))))
    }

    getWebData(target: PlayerMp): MusicGuiData {
        return {
            id: this.id,
            volume: this.volume,
            public: this.public,
            paused: this.paused,
            repeate: this.repeat,
            rand: this.rand,
            currentSong: this.currentSongUrl ? {
                id: this.currentSongUrl,
                time: this.time
            } : null,
            playList: this.playList.map(q => getSongData(q)),
            playListLast: songsData.data.slice(0, 50),
            playListMy: songsData.data.filter(q => q.owner == target.dbid).slice(0, 100),
        }
    }

    sync(player: PlayerMp) {
        const data = this.currentSongUrl && !this.paused ? this.songSyncData(player) : null
        CustomEvent.triggerClient(player, 'boxplayer:data', this.id, data)
    }

    songSyncData(player: PlayerMp) {
        const info = this.getAttachEntityInfo();

        return {
            id: this.id,
            remoteId: info.id,
            entityType: info.type,
            url: getSongPlayerUrl(player, this.currentSongUrl),
            duration: this.duration,
            current: this.time,
            volume: this.volume,
        }
    }

    async loadSong(url: string, now: boolean) {
        if (!getSongExists(url)) return;
        const duration = await getSongDuration(url)
        let exists = true
        if (!this.playList.includes(url)) {
            this.playList.push(url);
            this.savePlayList()
            exists = false
        }
        if (now || !this.currentSongUrl || exists) {
            this.history.push(url)
            this.currentSongUrl = url;
            this.duration = duration;
            this.time = 0
            this.syncAll()
        } else {
            this.syncWeb()
        }
    }

    nextSong() {
        if (this.playList.length < 2) {
            this.currentSongUrl = null;
            this.syncAll()
        } else {
            let index: number;
            const currentId = this.playList.findIndex(q => q == this.currentSongUrl)
            if (this.rand) {
                while (index == currentId) index = system.randomArrayElementIndex(this.playList);
            } else {
                index = currentId + 1;
                if (index > (this.playList.length - 1) && this.repeat) index = 0;
            }
            this.loadSong(this.playList[index], true)
        }
    }

    prevSong() {
        if (this.playList.length < 2) {
            this.currentSongUrl = null;
            this.syncAll()
        } else {
            if (this.history.length > 1 && this.playList.find(q => q === this.history[this.history.length - 2])) {
                this.history.splice(-1, 1)
                this.loadSong(this.history[this.history.length - 1], true)
            } else {
                let index = this.playList.findIndex(q => q == this.currentSongUrl) - 1;
                if (index < 0) index = this.playList.length - 1;
                this.loadSong(this.playList[index], true)
            }
        }
    }

    savePlayList(){
        this.database.data = this.playList;
        this.database.save()
    }
}

export class BoxPlayer extends MusicPlayer {
    readonly item: ItemEntity;
    readonly position: Vector3Mp;
    readonly heading: number;
    readonly dimension: number;
    readonly colshape: ColshapeMp;
    readonly handleColshape: colshapeHandle;
    readonly object: ObjectMp;
    readonly label: TextLabelMp;
    readonly ownerId: number;

    static canPlace(player: PlayerMp){
        if (player.dimension == CASINO_MAIN_DIMENSION) 
            return false
        
        if (isPlayerInActiveSafeZone(player)) 
            return false
        
        const defaultBoomboxes = MusicPlayer.list
            .filter(musicPlayer => musicPlayer instanceof BoxPlayer)
            .map(musicPlayer => <BoxPlayer>musicPlayer)
        
        return !defaultBoomboxes
            .find(boxPlayer => system.distanceToPos(boxPlayer.position, player.position) < MUSIC_PLACE_DISTANCE_BETWEEN
                && boxPlayer.dimension === player.dimension)
    }

    constructor(player: PlayerMp, item: ItemEntity) {
        super(item.id.toString());

        const user = player.user;
        this.ownerId = user.id;
        inventory.updateItemOwner(item, 0, 0);
        this.position = user.dropPos;
        this.heading = player.heading;
        this.dimension = player.dimension;
        this.item = item;

        player.user.playAnimation([["anim@mp_fireworks", "place_firework_3_box"]])
        this.colshape = mp.colshapes.newSphere(this.position.x, this.position.y, this.position.z, MUSIC_PLAYER_DIST, this.dimension);
        this.handleColshape = colshapes.new(this.position, `Музыкальный центр`, player => {
            this.openForPlayer(player);
        }, {
            color: [0,0,0,0],
            dimension: this.dimension,
        })
        this.object = mp.objects.new(inventoryShared.get(894).prop, this.position, {
            rotation: new mp.Vector3(0,0,this.heading),
            dimension: this.dimension
        })
        this.label = mp.labels.new('', new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), {
            dimension: this.dimension,
            los: true,
            drawDistance: 2

        })
        this.colshape.boxPlayer = this;

    }
    get text(){
        return this.label.text
    }
    set text(val){
        if(this.label.text == val) return;
        this.label.text = val;
    }

    destroy(){
        super.destroy();

        if(this.colshape && mp.colshapes.exists(this.colshape)) this.colshape.destroy()
        if(this.object && mp.objects.exists(this.object)) this.object.destroy()
        if(this.label && mp.labels.exists(this.label)) this.label.destroy()
        if(this.handleColshape && this.handleColshape.exists) this.handleColshape.destroy()
    }

    tick() {
        super.tick();

        if (!this.playList.length)
            return this.text = 'Плейлист пустой';

        if (!this.currentSongUrl)
            return this.text = 'Ожидание композиции';

        if (![...this.players].length)
            return this.text = '';

        this.text = `Сейчас играет\n${this.currentSongName}`
    }

    takePlayer(player: PlayerMp): void {
        const user = player.user;

        if(!user.isAdminNow() && this.ownerId !== user.id)
            return player.notify('Вы не можете забрать плеер', 'error');

        inventory.updateItemOwner(this.item, OWNER_TYPES.PLAYER, user.id);
        player.user.playAnimation([["anim@mp_fireworks", "place_firework_3_box"]])
        this.destroy()
    }

    isPlayerHasAccess(player: PlayerMp): boolean {
        return player.user.isAdminNow() || this.public || this.ownerId === player.user.id
    }

    getAttachEntityInfo(): { id: number; type: 'object' | 'vehicle' } {
        return { id: this.object.id, type: 'object' };
    }
}

setInterval(() => {
    BoxPlayer.list.map(item => item.tick())
}, 1000)

mp.events.add('playerEnterColshape', (player, colshape) => {
    const item = colshape.boxPlayer
    if(!item) return;
    const user = player.user;
    if(!user) return;
    item.addPlayer(player);
})

mp.events.add('playerExitColshape', (player, colshape) => {
    const item: BoxPlayer = colshape.boxPlayer
    if(!item) return;
    const user = player.user;
    if(!user) return;
    item.removePlayer(player);
})