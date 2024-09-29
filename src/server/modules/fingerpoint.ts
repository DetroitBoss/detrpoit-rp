import {User} from "./user";


mp.events.add('fpsync.update', (player: PlayerMp, camPitch:number, camHeading:number) => {
    User.getNearestPlayers(player, 70).map(target => {
        target.callUnreliable('fpsync.update', [player.id, camPitch, camHeading])
    })
});

mp.events.add('pointingStop', (player: PlayerMp) => {
    User.getNearestPlayers(player, 70).map(target => {
        target.callUnreliable('fpsync.stop', [player.id])
    })
});