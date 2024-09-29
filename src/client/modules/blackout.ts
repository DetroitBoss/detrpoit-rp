import {CustomEvent} from "./custom.event";

function setAllLightsState(state: boolean) {
    for (let i = 0; i < 16; i++) {
        // @ts-ignore
        mp.game.graphics.setLightsState(i, state);
    }
}

async function blinkLights(blinkTimeMs: number) {
    setAllLightsState(true);
    await mp.game.waitAsync(blinkTimeMs / 2);
    setAllLightsState(false);
    await mp.game.waitAsync(blinkTimeMs / 2);
}

async function startBlackout() {
    await blinkLights(1000);
    await mp.game.waitAsync(5000);
    await blinkLights(2000);
    await blinkLights(3000);
    await blinkLights(5000);
    await blinkLights(1000);
    await blinkLights(500);
    await blinkLights(200);
    await blinkLights(200);
    await blinkLights(200);
    await mp.game.waitAsync(1500);
    setAllLightsState(true);
}

CustomEvent.registerServer('blackout:blink', async (timeMs) => {
    await blinkLights(timeMs);
});

CustomEvent.registerServer('blackout:start', async () => {
    await startBlackout()
});

CustomEvent.registerServer('blackout:set', (state) => {
    for (let i = 0; i < 16; i++) {
        // @ts-ignore
        mp.game.graphics.setLightsState(i, state);
    }
});

