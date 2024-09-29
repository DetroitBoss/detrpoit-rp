import {weather} from "../../../world";

const QUEST_TIME_HOUR = 0;

export async function enableHalloweenWeather(transitionTimeS: number) {
    weather.ignoreServerWeather = true;
    mp.game.gameplay.setWeatherTypeOverTime('HALLOWEEN', transitionTimeS);

    setTimeout(() => {
        mp.game.gameplay.setWeatherTypeNow('HALLOWEEN');
        mp.game.gameplay.setWeatherTypeNowPersist('HALLOWEEN');
    }, (transitionTimeS - 1) * 1000);

    mp.game.time.pauseClock(true);
    await weather.smoothTimeTransition(weather.realHour, weather.realMinute, QUEST_TIME_HOUR, true);
}

export async function disableHalloweenWeather(transitionTimeS: number) {
    mp.game.gameplay.setWeatherTypeOverTime(weather.weather, transitionTimeS);

    setTimeout(() => {
        mp.game.gameplay.setWeatherTypeNow(weather.weather);
        mp.game.gameplay.setWeatherTypeNowPersist(weather.weather);
    }, (transitionTimeS - 1) * 1000);

    mp.game.time.pauseClock(false);
    await weather.smoothTimeTransition(QUEST_TIME_HOUR, 0, weather.realHour, false);
}