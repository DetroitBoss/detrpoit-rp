import {CREATING_FIRESPOTS_TIME_S} from "./config";
import {getFreeSquads} from "./FireSquad";
import {FireSpot} from "./firespot/FireSpot";
import {FireSpotConfig, FireSpots} from "../../../../shared/jobs/firefighter/fireSpots";
import {getRandomInt} from "../../../../shared/arrays";

const timer = setInterval(createFirespotsForFreeSquads, CREATING_FIRESPOTS_TIME_S * 1000);

function createFirespotsForFreeSquads() {
    const freeSquads = getFreeSquads();
    for (let squad of freeSquads) {
        const firespot = new FireSpot(pickRandomFirespotConfig());
        squad.setExtinguishingTask(firespot);
    }
}

const occupiedFirespots: FireSpotConfig[] = [];
function pickRandomFirespotConfig(): FireSpotConfig {
    let firespotsToPick: FireSpotConfig[] = FireSpots
        .filter(f => !occupiedFirespots.includes(f));
    if (firespotsToPick.length === 0) {
        firespotsToPick = FireSpots;
    }

    const index = getRandomInt(0, firespotsToPick.length - 1);
    occupiedFirespots.push(firespotsToPick[index]);

    return firespotsToPick[index];
}

mp.events.add('firesSpots:destroyed', (spot: FireSpot) => {
    const index = occupiedFirespots.findIndex(config => config === spot.config);
    if (index !== -1) {
        occupiedFirespots.splice(index, 1);
    }
});