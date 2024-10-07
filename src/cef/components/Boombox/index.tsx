import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CEF} from '../../modules/CEF';
import {CustomEventHandler} from "../../../shared/custom.event";
import {system} from "../../modules/system";
import svg from "./images/*.svg";
import gif from "./images/*.gif";
import close from '../HudBlock/images/svg/close.svg';
import {SocketSync} from "../SocketSync";
import {MUSIC_GUI_SONG_TYPE, MUSIC_GUI_TASKS, MusicGuiData} from "../../../shared/musicPlayer";
import {createStyles, withStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

export const genRandArray = (len: number) => {
    let q: {id: string, name: string, duration: number}[] = [];
    for(let z = 0; z < len; z++){
        const z = system.randomStr(7)
        q.push({id: z, name: z, duration: system.getRandomInt(120, 250)})
    }
    return q;
}

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class Boombox extends Component<{}, {
    /** Определяет статус отображения. Полезно если для отображения компонента необходимо не только его включить, а так же и получить какие то данные от клиента или сервера */
    show: boolean,
    id: string,
    right?: number,
    loading: boolean,
    url: string,
    playList: { id: string, name: string, duration: number }[],
    currentSong: {
        id: string,
        time: number
    },
    volumeTimer: number
} & MusicGuiData> {
    /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
    private ev: CustomEventHandler;
    private int: any;
    constructor(props: any) {
        let qpl = genRandArray(15)
        super(props);
        this.state = {
            volumeTimer: 0,
            volume: 100,
            public: false,
            paused: false,
            repeate: false,
            rand: false,
            url: '',
            loading: false,
            /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
            show: CEF.test,
            id: CEF.test ? `123223` : `0`,
            currentSong: CEF.test ? {
                id: system.randomArrayElement(qpl).id,
                time: 10
            } : null,
            playList: CEF.test ? qpl : [],
            playListLast: CEF.test ? genRandArray(55) : [],
            playListMy: CEF.test ? genRandArray(55) : [],
        }
        // Если необходимо - можно объявить ивент для получения данных от клиента или сервера.
        this.ev = CustomEvent.register('boombox:init', (data: MusicGuiData) => {
            this.loadData(data);
        })

        this.int = setInterval(() => {
            if(this.state.volumeTimer > 0) {
                if(this.state.volumeTimer === 100) this.sendTask('volume', this.state.volume)
                this.setState({volumeTimer: this.state.volumeTimer - 100})
            }
            if(!this.currentSongData) return;
            if(this.state.paused) return;
            this.setState({
                currentSong: {...this.state.currentSong, time: Math.min(this.currentSongData.duration, this.state.currentSong.time + 0.1)}
            })
        }, 100)
    }

    setVolume(val: number){
        this.setState({volume: val, volumeTimer: 600})
    }

    loadData(e: MusicGuiData){
        this.setState({
            show: true,
            ...e
        })
    }

    componentWillUnmount(){
        // Удаляем ивент при выгрузке компонента, при новом вызове этого компонента ивент будет создан повторно
        if(this.ev) this.ev.destroy()
        if(this.int) clearInterval(this.int)
    }

    get currentInputSongType(): MUSIC_GUI_SONG_TYPE {
        if(!this.state.url) return null;
        if(!this.state.url.includes('spotify') && (this.state.url.includes('youtube') || this.state.url.includes('youtu.be'))) return 'spotify'
        if(this.state.url.includes('spotify') && !this.state.url.includes('youtube') && !this.state.url.includes('youtu.be')) return 'youtube'
        if(this.state.url.toLowerCase().indexOf('w') == 0) {
            let q = String(this.state.url);
            let id = parseInt(q.substr(1));
            if(id && !isNaN(id) && id > 0 && id < 9999999999) return 'player'
        }
        return null
    }

    get currentSongData(){
        if(!this.state.currentSong) return null
        return this.state.playList.find(q => q.id === this.state.currentSong.id)
    }

    // get playState(){
    //     if(!this.currentSongData) return false;
    // }

    sendTask(task: MUSIC_GUI_TASKS, ...args: any[]){
        CustomEvent.triggerServer('boombox:task', this.state.id, task, ...args)
    }

    render() {
        // Пока мы не получили данные через ивент (либо мы не тестируем интерфейс через браузер) мы не будем отображать интерфейс
        if(!this.state.show) return <></>;
        // Тут уже идёт return самого интерфейса (с примером некоторых данных об игроке, которые уже хранятся в интерфейсах без необходимости их дополнительного получения через ивенты)
        return <section className="boombox-section">
            <SocketSync path={`boombox_${this.state.id}`} data={e => {
                if(!e) return CEF.gui.setGui(null);
                this.loadData(JSON.parse(e))
            }}>
                <button className="all-close" onClick={e => {
                    CEF.gui.setGui(null);
                }}>
                    <div><img src={close} alt=""/></div>
                    <p>Закрыть</p>
                </button>
                <div className="boombox-wrapper">
                    <button className="boombox-take" onClick={e => {
                        e.preventDefault();
                        CEF.gui.setGui(null);
                        CustomEvent.triggerServer('boombox:take', this.state.id)
                    }}><p>Забрать плеер</p></button>
                    <div className="boom-topline">
                        <div className="boom-input">
                            <i className="boom-faq"><img src={svg["question"]} alt=""/></i>

                            <div className="boom-music-icons">
                                <i className={`${this.currentInputSongType == 'spotify' || this.currentInputSongType == 'player' ? (this.state.loading ? 'disabled' : 'hide') : ''}`}><img src={svg["spotify"]} alt=""/></i>
                                <i className={`${this.currentInputSongType == 'youtube' || this.currentInputSongType == 'player' ? (this.state.loading ? 'disabled' : 'hide') : ''}`}><img src={svg["youtube"]} alt=""/></i>
                                <i className={`${!this.state.loading ? 'disabled' : ''}`}><img src={gif["load"]} alt=""/></i>
                            </div>

                            {this.state.loading ? <>
                                <input type="text" disabled value="Загрузка вашей композиции . . ." />
                            </> : <>
                                <input type="text" placeholder="URL композиции в Spotify, Youtube или ID плейлиста" value={this.state.url} onChange={e => {
                                    e.preventDefault()
                                    this.setState({url: e.currentTarget.value})
                                }} />
                            </>}

                        </div>
                        <button disabled={this.state.loading || !this.currentInputSongType} onClick={e => {
                            e.preventDefault()
                            if(this.state.loading) return;
                            if(!this.currentInputSongType) return;
                            if(this.currentInputSongType === 'player' && this.state.url.substr(1) === this.state.id.toString()) return CEF.alert.setAlert('error', 'Указанный ID совпадает с текущим')
                            this.setState({loading: true});
                            CustomEvent.callServer('boombox:load', this.state.id, this.currentInputSongType, this.state.url).then(status => this.setState({loading: false}))
                        }}>{!this.state.loading ? <img src={svg["add"]} alt=""/> : ''}<p>{!this.state.loading ? 'Добавить' : 'Загрузка'}</p></button>
                    </div>
                    <div className="boom-playlist">
                        <div className="boom-playlist-shadow"></div>
                        {/* <div className="boom-playlist-clear disabled">
                        <img src={svg["musical_notes"]} alt=""/>
                        <p>Добавьте в плейлист композиции,<br />чтобы воспроизвести их</p>
                    </div> */}
                        <div className="boom-playlist-list-wrapper">
                            <div className="boom-playlist-id">
                                <div>
                                    <p>ID Плеера</p>
                                    <p className="bp-id"><strong>W{this.state.id}</strong></p>
                                </div>
                                <button onClick={e => {
                                    e.preventDefault()
                                    CEF.alert.setAlert('info', `ID Плеера скопирован`)
                                    CEF.copy(`W${this.state.id}`)
                                }}>
                                    <img src={svg["copy"]} alt=""/>
                                </button>
                            </div>
                            <div className="boom-playlist-list">
                                {this.state.playList.map((item, itemid) => {
                                    return <div className={"bp-item-wrap "+(this.state.currentSong && this.state.currentSong.id === item.id ? 'play-item' : '')} key={`playlist_play_${itemid}`}>
                                        <div className="bp-item" onContextMenu={e => {
                                            e.preventDefault();
                                            this.setState({right: itemid})
                                        }} onClick={e => {
                                            e.preventDefault();
                                            this.setState({right: null})
                                            this.sendTask('load', item.id)
                                        }}>
                                            <div>
                                                <p className="bp-item-name">{item.name}</p>
                                                <p className="bp-item-time">{system.secondsToString(item.duration)}</p>
                                            </div>
                                        </div>
                                        <div className="bp-item-manage">
                                            <div
                                                className={"bp-delete " + (this.state.right !== itemid ? 'disabled' : '')}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.setState({right: null});
                                                    this.sendTask('delete', item.id)
                                                }}>
                                                <button><img src={svg["trash"]} alt=""/></button>
                                            </div>
                                            <div
                                                className={"bp-position " + (this.state.right === itemid ? 'disabled' : '')}>
                                                <button disabled={itemid == 0} onClick={e => {
                                                    e.preventDefault()
                                                    this.sendTask('moveUp', item.id)
                                                }}><img src={svg["up"]} alt=""/></button>
                                                <button disabled={itemid >= this.state.playList.length - 1} onClick={e => {
                                                    e.preventDefault()
                                                    this.sendTask('moveDown', item.id)
                                                }}><img src={svg["down"]} alt=""/></button>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="boom-content">
                        <div className="boom-main-list-wrapper">
                            <p className="boom-mini-title">Последние композиции</p>
                            {/* У админов будет сколько угодно (есть скролл) */}
                            <div className="boom-main-list">
                                {this.state.playListLast.map((item, id) => {
                                    return <div className="bp-item mini" key={`playlist_last_${id}`}>
                                        <div>
                                            <p className="bp-item-name">{item.name}</p>
                                            <p className="bp-item-time">{system.secondsToString(item.duration)}</p>
                                        </div>
                                        <div className="bp-item-buttons">
                                            <button className="bp-add" onClick={e => {
                                                e.preventDefault()
                                                this.sendTask('load', item.id)
                                            }}><img src={svg["add"]} alt=""/></button>
                                            {CEF.admin ? <button className="red" onClick={e => {
                                                e.preventDefault()
                                                this.sendTask('block', item.id)
                                            }}><img src={svg["trash"]} alt=""/></button> : <></>}

                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="boom-main-list-wrapper add-composition-list">
                            <p className="boom-mini-title">Мои композиции</p>
                            {/* У админов будет сколько угодно (есть скролл) */}
                            <div className="boom-main-list">
                                {this.state.playListMy.map((item, id) => {
                                    return <div className="bp-item mini" key={`playlist_lastmy_${id}`}>
                                        <div>
                                            <p className="bp-item-name">{item.name}</p>
                                            <p className="bp-item-time">{system.secondsToString(item.duration)}</p>
                                        </div>
                                        <div className="bp-item-buttons">
                                            <button className="bp-add" onClick={e => {
                                                e.preventDefault()
                                                this.sendTask('load', item.id)
                                            }}><img src={svg["add"]} alt=""/></button>
                                            {CEF.admin ? <button className="red" onClick={e => {
                                                e.preventDefault()
                                                this.sendTask('block', item.id)
                                            }}><img src={svg["trash"]} alt=""/></button> : <></>}

                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="boom-botline">
                        <div className="centered"></div>
                        {this.currentSongData ? <div className="composition-progress">
                            <i style={{width: `${Math.min(100, (this.state.currentSong.time / this.currentSongData.duration) * 100)}%`}} />
                        </div> : <></>}

                        {this.state.currentSong && this.currentSongData ? <div className="bbp-comp-name">
                            <p>{this.currentSongData.name}</p>
                            <p className="bbp-comp-time">{system.secondsToString(this.state.currentSong.time)} / {system.secondsToString(this.currentSongData.duration)}</p>
                        </div> : <></>}

                        <div className="bbp-management">
                            <button onClick={e => {e.preventDefault();this.sendTask('shuffle')}} className={"bbp-button "+(!this.state.rand ? 'off' : '')}><img src={svg["shuffle"]} alt=""/></button>
                            <button onClick={e => {e.preventDefault();this.sendTask('prev')}} className="bbp-button"><img src={svg["previous_track"]} alt=""/></button>
                            <button className="bbp-button bbp-play" onClick={e => {
                                e.preventDefault()
                                if(!this.currentSongData) return;
                                this.sendTask('paused')
                            }}>
                                 <img src={svg[this.state.paused || !this.currentSongData ? 'play' : 'pause']} alt=""/>
                            </button>
                            <button onClick={e => {e.preventDefault();this.sendTask('next')}} className="bbp-button"><img src={svg["next_track"]} alt=""/></button>
                            <button onClick={e => {e.preventDefault();this.sendTask('repeate')}} className={"bbp-button "+(!this.state.repeate ? 'off' : '')}><img src={svg["cycle_arrows"]} alt=""/></button>
                            <button onClick={e => {e.preventDefault();this.sendTask('private')}} className={"bbp-button "+(this.state.public ? 'off' : '')}><img src={svg["locked"]} alt=""/></button>
                            <div className="volume">
                                {addSlider(this.state.volume, (e, val) => {
                                    this.setVolume(val)
                                }, 0, 100, 1)}
                                <img src={svg["sound"]} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </SocketSync>
        </section>;
    }
}

// <div className="volume-size">
//                                     <i></i>
//                                 </div>


const addSlider = (value: number, onChange: (e: any, val: any) => void, min = 0, max = 100, step = 1, addText = '%', zeroText = 'OFF') => {

    return (
        <NewSliderStyles
            className={'volume-size'}
            min={min}
            max={max}
            step={step}
            value={value}
            valueLabelDisplay="off"
            onChange={(e, val) => {
                if(val == value) return;
                onChange(e, val);
            }}
        />
    );
};

const SliderStyles = createStyles({
    colorPrimary: {
        color: "#000000",
    },
    rail: {
      color: '#151a1d'
    },
    root: {
        // marginTop: 5,
        color: "#C4C4C4",
        height: 26,
        padding: 0
    },
    markLabel: {
        color: "#FFFFFFaa",
        fontSize: "0.7vw",
    },
    markLabelActive: {
        color: "#FFFFFFee",
    },
    thumb: {
        height: '0.625vw',
        width: '0.625vw',
        borderRadius: '20px',
        backgroundColor: "#E3256B",
        marginTop: -3,
        "&:focus, &:hover, &$active": {
            boxShadow: "0px 0px 30px #E3256B",
        },
    },
    track: {
        height: '0.3125vw',
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 0px 3px #FFFFFF",
    },
});
const NewSliderStyles = withStyles(SliderStyles)(Slider);