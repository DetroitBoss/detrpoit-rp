import "./marketItemsDb";
import "./logic/applyMarketChanges"
import "./logic/rentLogic"
import "./logic/purchaseLogic"
import "./logic/policeLogic"
import "./logic/clothesPreview"

import {MARKET_STOCK_RADIUS, MARKET_STOCKS, MARKET_TENTS} from "../../../shared/market/tentSpotsConfig";
import {TentSpot} from "./TentSpot";
import {getRandomInt} from "../../../shared/arrays";
import {MARKET_BLIP_COLOR, MARKET_BLIP_SPRITE} from "../../../shared/market/config";
import {colshapes} from "../checkpoints";
import {openMarketStock} from "./marketStock";

const tentSpots = [];
MARKET_TENTS.forEach((areaSpots) => {
    const blackMarketIndex = getRandomInt(0, areaSpots.length - 1);

    areaSpots.forEach((config, index) => {
        const isBlackMarket = blackMarketIndex === index;
        const spot = new TentSpot(config.position, config.heading, isBlackMarket);

        tentSpots.push(spot);
    });
});

MARKET_STOCKS.forEach(position => {
    mp.blips.new(MARKET_BLIP_SPRITE, position, {
        color: MARKET_BLIP_COLOR,
        dimension: 0,
        shortRange: true,
        name: 'Рынок'
    });

    colshapes.new(position, 'Склад рынка', openMarketStock, {
        type: 27,
        radius: MARKET_STOCK_RADIUS
    });
});

