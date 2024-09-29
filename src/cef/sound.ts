import sounds from './assets/sounds/*.ogg'
import soundswv from './assets/sounds/*.wav'
import soundsmps3 from "./assets/sounds/*.mp3";

let activeAudios: {
    [param: string]: AudioItem
} = {};

class AudioItem {
    audio: HTMLAudioElement;
    audioCtx: AudioContext;
    source: MediaElementAudioSourceNode;
    panNode: StereoPannerNode;
    id: string;
    url: string;
    constructor(id: string, url: string, pos = 0, volume = 1, pan: number = 0) {
        this.id = id;
        this.url = url;

        this.audioCtx = new AudioContext();
        this.audio = new Audio(url)
        this.audio.crossOrigin = "anonymous";
        this.source = this.audioCtx.createMediaElementSource(this.audio)
        this.panNode = this.audioCtx.createStereoPanner();
        this.source.connect(this.panNode);
        this.panNode.connect(this.audioCtx.destination);
        this.panNode.pan.value = pan;
        this.audio.volume = volume;
        this.pos = pos;
        this.pan = pan;
        this.audio.play()
    }

    unload(){
        this.audio.remove()
    }

    stop(){
        this.pause = true
    }



    get pan(){ return this.panNode.pan.value }
    set pan(val){ this.panNode.pan.value = val; }

    get volume(){ return this.audio.volume }
    set volume(val){ this.audio.volume = val; }

    get pause(){ return this.audio.paused }
    set pause(val){ val ? this.audio.pause() : this.audio.play() }

    get pos(){ return this.audio.currentTime }
    set pos(val){ this.audio.currentTime = val; }
}



const urlExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;


export const getUrl = (url: string): string => {
    let soundList:{[path:string]:string} = sounds as any,
        soundswvList:{[path:string]:string} = soundswv as any;

    return soundList[url] || soundswvList[url] || soundsmps3[url] || url;
}

export function playAudio(id: string, url: string, pos = 0, volume = 1, pan: number = 0) {
    if(activeAudios[id]) stopAudio(id);
    activeAudios[id] = new AudioItem(id, getUrl(url), pos, volume, pan)
}

export function get(id: string){
    return activeAudios[id]
}

export function stopAudio(id: string) {
    if (activeAudios[id]) {
        activeAudios[id].stop();
        activeAudios[id].unload();
        activeAudios[id] = null;
    }
}

export function setVolume(id: string, volume: number, pan = 0) {
    const item = activeAudios[id]
    if (item) {
        volume = Math.max(0, volume);
        volume = Math.min(1, volume);
        item.volume = volume;
        item.pan = pan;
    }
}

export function setPaused(id: string, paused = true) {
    if (activeAudios[id]) activeAudios[id].pause = paused;
}

export function soundData(data: { id: string, pan: number, volume: number }[]) {
    data.map(item =>
        setVolume(item.id, item.volume, item.pan));
}

if (location.host.includes(':1237')) {
    var mp = {
        trigger: (eventName: string, ...args: any[]) => {
            console.log('[TRIGGER]', eventName, ...args)
        },
        invoke: (eventName: string, ...args: any[]) => {
            console.log('[INVOKE]', eventName, ...args)
        }
    } as Mp;
}

var sound = {
    get,
    playAudio,
    stopAudio,
    setVolume,
    setPaused,
    soundData,
}

// @ts-ignore
global.sound = sound