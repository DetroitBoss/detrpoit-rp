import ip from 'ip';
import express from 'express';
import { WEB_DATA_PORT_EXTERNAL, WEB_DATA_PORT_INTERNAL } from '../../shared/web';
import {system} from './system';
import fetch from 'node-fetch';
import {business, businessDefaultCostItem} from './business';
import {NoSQLbase} from './nosql';
import {dress} from './customization';
import {CharacterCreatorDress} from '../../shared/character';
import session from "express-session"
import {ClothData} from "../../shared/cloth";
import { FetchedData, ServerData } from '../../shared/log'
import { UserEntity } from './typeorm/entities/user'
import { Between, MoreThan } from 'typeorm'
import cors from 'cors';
import { getX2Param } from './usermodule/static';

let ip_address = ip.address();
export const getIp = () => {
    return ip_address
}

export let app = express();
app.set('trust proxy', 1)
app.use(express.json())

app.use(session({
    secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

let ipStorage = new NoSQLbase<{ ip: string, time: number }>('ip');
export const fetchIp = async () => {
    if (ipStorage.data[0]){
        if (system.timestamp < ipStorage.data[0].time){
            ip_address = ipStorage.data[0].ip;
            system.debug.info("Внешний IP, хранимый в файлах", ip_address)
            return;
        }
    }
    fetch('https://api.ipify.org?format=json').then(q => {
        q.json().then((data: { ip: string }) => {
            if (ipStorage.data[0]){
                ipStorage.data[0].ip = data.ip;
                ipStorage.data[0].time = system.timestamp + 48 * 60 * 60;
            } else {
                ipStorage.insert({ ip: data.ip, time: system.timestamp + 48 * 60 * 60})
            }
            ipStorage.save();
            ip_address = data.ip
            system.debug.info("Получен внешний IP", ip_address)
        }).catch((error => {
            system.debug.error(error);
            system.debug.error('Повторная попытка получения внешнего IP');
            setTimeout(() => {
                fetchIp();
            }, 1000)
        }))
    })
}


let regToday = 0;
let authToday = 0;
let regYesterday = 0;
let authYesterday = 0;

let maxplayers = 0;

export const incrementAuthCounter = () => {
    authToday++
}

let serverData: ServerData = { online: 0, maxplayers: 0, masterposition: 0, allservers: 0, peak: 0, name: "NoName" };
const updateOnline = async () => {
    regToday = await UserEntity.count({ where: { date_reg: MoreThan(methoods.startOfDay()) } })
    regYesterday = await UserEntity.count({ where: {
            date_reg: Between(methoods.startOfYesterday(), methoods.startOfDay())
        } })
    authYesterday = 0
    let online = mp.players.toArray().length;
    if(online > maxplayers) maxplayers = online;
    let allservers = 0;
    let masterposition = -1;
    let name = "Тестовый сервер";
    let peak = -1;
    
    serverData = { online, maxplayers, masterposition, allservers, peak, name }

    if (serverData.peak < online) serverData.peak = online;
    serverData.maxplayers = mp.config.maxplayers;
    serverData.name = mp.config.name;
}

const methoods = {
    startOfDay: (start?: string) => {
        let now = start ? new Date(start) : new Date();
        let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // @ts-ignore
        return startOfDay / 1000 || 0;
    },
    startOfYesterday: (start?: string) => {
        let now = start ? new Date(start) : new Date();
        let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        // @ts-ignore
        return startOfDay / 1000 || 0;
    },
    startOfTommorrow: (start?: string) => {
        let now = start ? new Date(start) : new Date();
        let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        // @ts-ignore
        return startOfDay / 1000 || 0;
    }
}

setInterval(async () => {
    updateOnline();
}, 60000)
setTimeout(async () => {
    updateOnline();
}, 5000)

app.get('/api/fetchdata', cors({
    origin: 'https://admin.onyx-gta.ru',
}), async (req, res) => {
    let result: FetchedData = {
        regToday,
        authToday,
        regYesterday,
        authYesterday,
        serverData
    }

    res.send({ status: "ok", data: result })
})

app.get("/business/catalog", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    const biz = business.get(parseInt(req.query.id as any))
    if(!biz) return res.send(null);
    return res.send(biz.catalog.map(q => {
        const price = q.count > 0 ? q.price : businessDefaultCostItem(biz, q.item)
        return {...q, price}
    }))
})
app.get("/personage/dress", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    let data: CharacterCreatorDress[] = dress.data
        .filter(q => q.forCreate && q.male === parseInt(req.query.male as any)).map(item => {
            return  {
                name: item.name,
                data: item.data[0] as ClothData,
                category: item.category,
                id: item.id
            }
        })
    return res.send(data)
})
app.get("/dress/data", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    return res.send([...dress.data].map(q => {
        let z = { ...q, data: q.data};
        delete z.datas
        return z;
    }))
})

app.use('/editor', express.static('./editor'));
app.use('/declaration', express.static('./src/declaration'));

app.listen(!mp.config.announce ? WEB_DATA_PORT_INTERNAL : WEB_DATA_PORT_EXTERNAL, function () {
    console.log(`Web Express Server started at port ${WEB_DATA_PORT_INTERNAL}. Public port: ${WEB_DATA_PORT_EXTERNAL}`);
});