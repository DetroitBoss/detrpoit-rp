import { NoSQLbase } from "./nosql";
import { system } from "./system";
import { randomArrayElement } from "../../shared/arrays";
import { CustomEvent } from "./custom.event";
import { User } from "./user";
import { MenuClass } from "./menu";
import {WEATHERS_LIST, XMAS_ENABLE} from "../../shared/world";

let data = new NoSQLbase<{ weather: weathers, temp: number}>('weather');

setTimeout(() => {
    if (data.data.length == 0) {
        data.insert({ weather: "CLEAR", temp: 0 });
        system.debug.info('Insert new weather data')
    }

    weather.randomTimer();
    weather.setWeather(data.data[0].weather)

    setInterval(() => {
        data.save();
    }, 60000)
}, 5000)

let weathersConfig:[weathers, number][] = XMAS_ENABLE ? [['XMAS', 1]] : WEATHERS_LIST

let weathers: weathers[] = [];
weathersConfig.map(item => {
    for (let id = 0; id < item[1]; id++) weathers.push(item[0]);
})


CustomEvent.registerClient('admin:weather:control', player => {
    weather.adminMenu(player);
})

export const weather = {
    freezeWeather: false,
    halloweenEnabled: false,
    adminMenu: (player: PlayerMp) => {
        if(!player.user) return;
        const user = player.user;
        if (!user.hasPermission('admin:weather:set')) return user.notify('У вас нет доступа', "error");
        let m = new MenuClass(player, "Погода", "Управление погодой");
        // m.sprite = "admin";
        m.newItem({
            name: "Статус погоды",
            more: `${weather.freezeWeather ? 'Заморожена' : 'Динамическая смена'}`,
            onpress: () => {
                weather.freezeWeather = !weather.freezeWeather;
                user.notify(`Статус погоды: ${weather.freezeWeather ? 'Заморожена' : 'Динамическая смена'}`, "success");
            }
        })
        m.newItem({
            name: "Погода",
            type: "list",
            list: weathersConfig.map(q => {return q[0]}),
            listSelected: weathersConfig.findIndex(q => q[0] == weather.weather),
            onpress: (itm) => {
                weather.setWeather(weathersConfig[itm.listSelected][0]);
                user.notify('Погода установлена', "success");
            }
        })
        // m.newItem({
        //     name: "Часы",
        //     type: "range",
        //     rangeselect: [0, 23],
        //     listSelected: weather.hour,
        //     onpress: (itm) => {
        //         weather.hour = itm.listSelected;
        //         weather.sync();
        //         user.notify('Время установлено', "success");
        //     }
        // })
        // m.newItem({
        //     name: "Минуты",
        //     type: "range",
        //     rangeselect: [0, 59],
        //     listSelected: weather.minute,
        //     onpress: (itm) => {
        //         weather.minute = itm.listSelected;
        //         weather.sync();
        //         user.notify('Время установлено', "success");
        //     }
        // })
        m.open();
    },
    get hour(){
        const currentTime = new Date();
        return currentTime.getHours()
    },
    get minute(){
        const currentTime = new Date();
        return currentTime.getMinutes()
    },
    weather: <weathers>"CLEAR",
    getWeatherName: function (type: weathers) {
        return system.getWeatherName(type);
    },
    randomTimer: function () {
        weather.nextRandomWeather();
        setTimeout(weather.randomTimer, 2 * 1000 * 60 * 60); // 2 часа - кд смены погоды
    },

    getFullRpTime: function () {
        return `${system.digitFormat(weather.hour)}:${system.digitFormat(weather.minute)}`;
    },
    nextRandomWeather: () => {
        if (weather.freezeWeather) return;
        weather.setWeather(randomArrayElement(weathers));
    },
    setWeather: (name: weathers) => {
        if (weather.halloweenEnabled) {
            name = "HALLOWEEN"
            mp.world.weather = name;
        }

        if(XMAS_ENABLE){
            name = "XMAS"
            mp.world.weather = name;
        }
        weather.weather = name;
        User.notifyWithPictureToAll(
            `Weazel News [${weather.getFullRpTime()}]`,
            'Новости погоды',
            `${weather.getWeatherName(weather.weather)}`,
            'WEAZEL'
        );
        weather.sync();
    },
    sync: (player?: PlayerMp) => {
        const currentTime = new Date();
        if (player) CustomEvent.triggerClient(player, "weather:sync", weather.weather, 0, currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
        else CustomEvent.triggerClients("weather:sync", weather.weather, 0, currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
    }
}

const ipls = [
    { name: 'rc12b_fixed' },
    { name: 'rc12b_destroyed' },
    { name: 'rc12b_default' },
    { name: 'rc12b_hospitalinterior_lod' },
    { name: 'rc12b_hospitalinterior' },
    
    { name: 'v_refit' },
    { name: 'v_sheriff' },
    { name: 'v_sheriff2' },
];

ipls.forEach((ipl) => {
    mp.world.removeIpl(`${ipl.name}`);
});

let syncInt = setInterval(() => {
    const nowTime = system.getDate();
    if(nowTime.getSeconds() === 0){
        clearInterval(syncInt);
        system.debug.debug('Система точного отсчёта времени запущена')
        setInterval(() => {
            const date = system.getDate();
            CustomEvent.trigger('newMinute', date.getMinutes())
            if (date.getMinutes() == 0) {
                CustomEvent.trigger('newHour', date.getHours())
            }
            if (date.getHours() == 0 && date.getMinutes() == 0) {
                system.debug.info('Новый день')
                CustomEvent.trigger('newDay')
            }
        }, 60000)
    }
}, 100)




setInterval(weather.sync, 120000);