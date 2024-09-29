import {exec} from "child_process";
import fs from 'fs';
import YoutubeMp3Downloader from 'youtube-mp3-downloader'
// @ts-ignore
import youtubeDuration from 'youtube-duration'
import fetch from 'node-fetch';
import {app, getIp} from "./web";
import express from 'express';
import { WEB_DATA_PORT_EXTERNAL } from "../../shared/web";
import {system} from "./system";
import {SONG_FOLDER, SONG_FOLDER_NAME, YOUTUBE_LIMIT_ACCESS} from "../../shared/songdonwloader";
import {NoSQLbase} from "./nosql";
export const youtubeKey = 'AIzaSyD0esQbj0Em7yLi_gq3gFiYiYoe7Q9-Yds';
import {getAudioDurationInSeconds} from 'get-audio-duration'
export const downloadSong = (url: string): Promise<{status: boolean, res: string, id?: string, new: boolean}> => {
    if(url.includes('spotify')) return downloadSpotifySong(url);
    if(url.includes('youtube.com') || url.includes('youtu.be')) return downloadYoutubeSong(url);
    return new Promise(resolve => {resolve({status: false, res: 'Поддерживаются ссылки с Spotify и YouTube', new: false})});
}

export let songsBlock = new NoSQLbase<string>('songsBlock')
export let songsData = new NoSQLbase<{id: string, name: string, duration: number, owner?: number}>('songsData')

interface YouTubeVideoDataFull {
    "kind": string,
    "etag": string,
    "items": YouTubeVideoData[],
    "pageInfo": {
        "totalResults": number,
        "resultsPerPage": number
    }
}

interface YouTubeVideoData {
    "kind": string,
    "etag": string,
    "id": string,
    "snippet": {
        "publishedAt": string,
        "channelId": string,
        "title": string,
        "description": string,
        "thumbnails": {
            [key: string]: {
                "url": string,
                "width": number,
                "height": number
            }
        },
        "channelTitle": string,
        "tags": string[],
        "categoryId": string,
        "liveBroadcastContent": string,
        "localized": {
            "title": string,
            "description": string
        }
    },
    "contentDetails": {
        "duration": string,
        "dimension": string,
        "definition": string,
        "caption": "true" | "false",
        "licensedContent": boolean,
        "contentRating": {},
        "projection": string
    },
    "statistics": {
        "viewCount": string,
        "likeCount": string,
        "dislikeCount": string,
        "favoriteCount": string,
        "commentCount": string
    }
}

interface YouTubeVideoInfo {
    id: string,
    duration: number,
    likes: number,
    views: number,
    dislikes: number,
    comments: number,
    title: string
}

let lastVideoData = new Map<string, YouTubeVideoInfo>()

export const getSongDuration = (id: string): Promise<number> => getAudioDurationInSeconds(`${SONG_FOLDER}${id}.mp3`)
export const getSongData = (id: string) => {
    const item = songsData.data.find(q => q.id === id)
    if(!item) return null
    return {...item, name: system.filterInput(item.name)};
}
export const getSongExists = (id: string): boolean => fs.existsSync(`${SONG_FOLDER}${id}.mp3`);
export const getSongUrl = (id: string) => `http://${getIp()}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${id}.mp3`;
export const getSongPlayerUrl = (player: PlayerMp, id: string) => `http://${player.ip !== "127.0.0.1" ? getIp() : '127.0.0.1'}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${id}.mp3`;



export const getYoutubeVideoData = (id: string): Promise<YouTubeVideoInfo> => {
    return new Promise(resolve => {
        if(lastVideoData.get(id)) return resolve(lastVideoData.get(id))
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${youtubeKey}&part=contentDetails,statistics,snippet`).then(q => {
            q.json().then((data: YouTubeVideoDataFull) => {
                if(!data || !data.items || data.items.length == 0) {
                    lastVideoData.set(id, null);
                    setTimeout(() => {
                        lastVideoData.delete(id);
                    }, 120 * 60000)
                    return resolve(null)
                }
                const item = data.items[0]
                const stats = item.statistics
                let res: YouTubeVideoInfo = {
                    duration: youtubeDuration.toSecond(item.contentDetails.duration),
                    id: id,
                    likes: parseInt(stats.likeCount),
                    dislikes: parseInt(stats.dislikeCount),
                    comments: parseInt(stats.commentCount),
                    views: parseInt(stats.viewCount),
                    title: item.snippet.title
                }

                lastVideoData.set(id, res);
                setTimeout(() => {
                    lastVideoData.delete(id);
                }, 120 * 60000)
                return resolve(res)
            }).catch((error => {
                console.log(error)
                lastVideoData.set(id, null);
                setTimeout(() => {
                    lastVideoData.delete(id);
                }, 120 * 60000)
            }))
        })
    })
}
export const testSong = `spotify:track:0bHYVW240JigrvsuzsCCve`
// setTimeout(() => {
//     downloadSong(testSong).then(url => {
//         console.log(`Song URL -> ${url.res}`)
//     })
// }, 1000)

function youtube_parser(url: string){
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : null;
}
let blockId = new Map<string, boolean>();
export const downloadYoutubeSong = (url: string): Promise<{status: boolean, res: string, id?: string, new: boolean}> => {
    return new Promise(async (resolve) => {

        url = youtube_parser(url);

        if(songsBlock.data.find(q => q.toLowerCase() == url.toLowerCase())) return resolve({status: false,res: 'Эта ссылка заблокирована администрацией проекта', new: false});

        if(blockId.has(url)) return resolve({status: false,res: 'Песня уже загружена другим проигрывателем, пожалуйста, подождите', new: false})

        let resFilename = `${url}.mp3`

        const data = await getYoutubeVideoData(url);
        if(!data) return resolve({status: false,res: 'Youtube Не удается получить данные с сервера. Проверьте ссылку', new: false});
        if(data.views < YOUTUBE_LIMIT_ACCESS.viewsCount) return resolve({status: false, res: `Нужно хотя бы ${YOUTUBE_LIMIT_ACCESS.viewsCount} cмотреть`, new: false});
        if(data.duration < YOUTUBE_LIMIT_ACCESS.durationMinSeconds) return resolve({status: false, res: `Ролик должен длится минимум ${system.secondsToString(YOUTUBE_LIMIT_ACCESS.durationMinSeconds)}`, new: false});
        if(data.duration > YOUTUBE_LIMIT_ACCESS.durationMaxSeconds) return resolve({status: false, res: `Ролик должен длится максимум ${system.secondsToString(YOUTUBE_LIMIT_ACCESS.durationMaxSeconds)}`, new: false});
        if(data.likes < YOUTUBE_LIMIT_ACCESS.likesCount) return resolve({status: false, res: `Нужно хотя бы ${YOUTUBE_LIMIT_ACCESS.likesCount} нравится`, new: false});
        if((((data.likes + data.dislikes) / 100) * data.dislikes) < YOUTUBE_LIMIT_ACCESS.dislikePercent) return resolve({status: false, res: `Допускается не более ${YOUTUBE_LIMIT_ACCESS.dislikePercent}% дизлайков`, new: false});

        if(fs.existsSync(`${SONG_FOLDER}${url}.mp3`) && getSongData(url)) return resolve({status: true, res: `http://${getIp()}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${url}.mp3`, id: url, new: false})

        //Configure YoutubeMp3Downloader with your settings
        let YD = new YoutubeMp3Downloader({
            
            "ffmpegPath": "C:\\ffmpeg\\bin\\ffmpeg.exe",      // FFmpeg binary location
            "outputPath": SONG_FOLDER,    // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 1000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });

//Download video and save as MP3 file
        blockId.set(url, true)
        YD.download(url, resFilename);

        YD.on("finished", function(err, data) {
            blockId.delete(url)
            if(err){
                system.debug.error(`Ошибка при загрузке музыки ${err}`)
                return resolve({status: false, res: `Произошла ошибка загрузки`, new: false});
            }
            let q = songsData.data.findIndex(z => z.id === url);
            let c: typeof songsData.data[number] = {id: url, duration: data.duration, name: system.filterInput(data.title)}
            if(q > -1) songsData.data[q] = c;
            else songsData.data.push(c)
            songsData.save()
            return resolve({status: true, res: `http://${getIp()}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${resFilename}`, id: url, new: true})
        });

        YD.on("error", function(error) {
            system.debug.error(`Ошибка при загрузке музыки ${error}`)
            return resolve({status: false, res: `Произошла ошибка загрузки`, new: false});
        });

    })
}


export const downloadSpotifySong = (url: string): Promise<{status: boolean, res: string, id?: string, new: boolean}> => {
    return new Promise((resolve) => {
        if (!fs.existsSync(SONG_FOLDER)) fs.mkdirSync(SONG_FOLDER);
        if(!url.includes('spotify.com')){
            let data = url.split(':');
            if(data.length !== 3) return resolve({status: false, res: 'Недействительная ссылка на Spotify', new: false});
            if(data[0] !== 'spotify') return resolve({status: false, res: 'Недействительная ссылка на Spotify', new: false});
            if(data[1] !== 'track') return resolve({status: false, res: 'Недействительная ссылка на Spotify', new: false});
            url = `https://open.spotify.com/track/${url.split(':')[2]}`;
        } else {
            if(url.indexOf('https://open.spotify.com/track/') !== 0) return resolve({status: false, res: 'Недействительная ссылка на Spotify', new: false});
        }
        url = url.split('?')[0];
        let id = url.split(`/track/`)[1];
        if(blockId.has(id)) return resolve({status: false, res: 'Эта песня уже загружена другим плеером, пожалуйста, подождите', new: false})
        if(songsBlock.data.find(q => q.toLowerCase() == id.toLowerCase())) return resolve({status: false,res: 'Эта ссылка заблокирована администрацией проекта', new: false});
        if(fs.existsSync(`${SONG_FOLDER}${id}.mp3`) && getSongData(id)) return resolve({status: true, res: `http://${getIp()}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${id}.mp3`, id, new: false})
        const targetDir = `${SONG_FOLDER}${id}`
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        blockId.set(id, true)
        exec(`spotifydl ${url} -o ${targetDir}`, async (err, out, res) => {
            console.log(`error: ${err}`)
            console.log(`out: ${out}`)
            console.log(`res: ${res}`)
            blockId.delete(id)
            let str = res.split('\n')
            let r = str.find(q => q.includes('Song: '));
            if(!r) return resolve({status: false,res: 'Неверные данные, полученные при загрузке', new: false});
            let name = r.split(' Song: ')[1].replace(/\\/g, '');
            if(!name) return resolve({status: false,res: 'Информация не может быть получена при загрузке', new: false});
            
            let fileName = name+'.mp3';
            console.log(`filename: ${fileName}`)
            let newFilename = `${id}.mp3`
            console.log(`newfilename: ${newFilename}`)
            const resRenFilename = fs.readdirSync(targetDir)[0];
            console.log(`resRenFilename: ${resRenFilename}`)
            if(!resRenFilename) return resolve({status: false, res: 'Произошла ошибка, пожалуйста, повторите попытку', new: false})
            console.log(`rename from ${targetDir}/${resRenFilename} to ${SONG_FOLDER}${newFilename}`)
            
            fs.rename(`${targetDir}/${resRenFilename}`, `${SONG_FOLDER}${newFilename}`, async function(err) {
                setTimeout(() => {
                    fs.rmdirSync(targetDir, { recursive: true });
                }, 100)
                if(err) {
                    system.debug.error(err);
                    return resolve({status: false, res: 'Произошла ошибка, пожалуйста, повторите попытку', new: false})
                }
                let q = songsData.data.findIndex(z => z.id === id);
                let c: typeof songsData.data[number] = {id, duration: await getSongDuration(id), name: system.filterInput(name)}
                if(q > -1){
                    songsData.data[q] = c;
                } else {
                    songsData.data.push(c)
                }
                songsData.save()
                return resolve({status: true, res: `http://${getIp()}:${WEB_DATA_PORT_EXTERNAL}/${SONG_FOLDER_NAME}/${targetDir}/${fileName}`, id, new: true})
            });

        })
    })

}

app.use('/'+SONG_FOLDER_NAME, express.static(SONG_FOLDER, {
    setHeaders: (req, res) => {
        req.setHeader('Access-Control-Allow-Origin', '*');
    }
}));