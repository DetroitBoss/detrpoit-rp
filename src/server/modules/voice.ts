import { CustomEvent } from "./custom.event";
import { system } from "./system";


CustomEvent.registerClient('voice:setDistAndMultiple', (player, multiple: number, dist: number) => {
    if(!multiple || !dist) player.setVariable('microphoneVolumeCustom', null)
    else player.setVariable('microphoneVolumeCustom', JSON.stringify([multiple, dist]));
})
CustomEvent.registerClient('setMicrophoneVolume', (player, value: number) => {
    player.setVariable('microphoneVolume', value)
})
CustomEvent.registerClient('worldVoiceAdd', (player, nuserid: number) => {
    const nuser = mp.players.at(nuserid);
    if (!mp.players.exists(nuser) || !mp.players.exists(player)) return;
    // system.debug.debug("enable world voice", player.user.name, nuser.user.name)
    nuser.enableVoiceTo(player);
})
CustomEvent.registerClient('worldVoiceRemove', (player, nuserid: number) => {
    const nuser = mp.players.at(nuserid);
    if (!mp.players.exists(nuser) || !mp.players.exists(player)) return;
    nuser.disableVoiceTo(player);
    // system.debug.debug("disable world voice", player.user.name, nuser.user.name)
})
CustomEvent.registerClient('worldVoiceChangeScope', (player
                                                     , playersToRemove: number[]
                                                     , playersToAdd: number[]) => {
    playersToRemove.forEach(id => {
        const remotePlayer = mp.players.at(id);
        if (!mp.players.exists(remotePlayer) || !mp.players.exists(player)) return;
        remotePlayer.disableVoiceTo(player);
    });

    playersToAdd.forEach(id => {
        const remotePlayer = mp.players.at(id);
        if (!mp.players.exists(remotePlayer) || !mp.players.exists(player)) return;
        remotePlayer.enableVoiceTo(player);
    });
})
CustomEvent.registerClient('startWorldSpeak', (player) => {
    let targets = player.user.getNearestPlayers(40);
    targets.map(target => {
        target.call('playerStartTalkingEvent', [player])
    })
})
CustomEvent.registerClient('stopWorldSpeak', (player) => {
    let targets = player.user.getNearestPlayers(40);
    targets.map(target => {
        target.call('playerStopTalkingEvent', [player])
    })
})
