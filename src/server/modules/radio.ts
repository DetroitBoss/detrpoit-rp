import { CustomEvent } from "./custom.event";

const quitFreq = (player: PlayerMp) => {
    const currentFreq = player.getVariable('radioVol');
    if (currentFreq){
        mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === currentFreq).map(target => {
            target.call('radio:targetStopSpeak', [target.id])
        });
        if(mp.players.exists(player)) player.setVariable('radioVol', "");
    }
    if (mp.players.exists(player) && player.getVariable('radioSpeak')) player.setVariable('radioSpeak', false);
}

mp.events.add('playerQuit', player => {
    quitFreq(player)
})

CustomEvent.registerClientAndCef('radio:connectToFreq', (player, freq: string, notify = true) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    quitFreq(player)
    const [start, end] = freq.split('.').map(q => parseInt(q))
    if(isNaN(start) || start < 0 || start > 999999) {
        if(notify)player.notify('Частота указана не верно', 'error');
        return
    }
    if(start >= 2000 && start <= 3000 && !user.is_gos) {
        if(notify)player.notify('Диапазон 2000-3000 закреплён за гос структурами', 'error');
        return
    }
    player.setVariable('radioVol', freq);
})


CustomEvent.registerClient('radio:enableMic', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    player.setVariable('radioSpeak', true);
    const freq = player.getVariable('radioVol');
    mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === freq).map(target => {
        target.enableVoiceTo(player)
        target.call('radio:targetStartSpeak', [target.id])
    });
})
CustomEvent.registerClient('radio:disableMic', (player) => {
    const user = player.user;
    if (!user) return;
    if (!user.haveRadio) return quitFreq(player)
    player.setVariable('radioSpeak', false);
    const freq = player.getVariable('radioVol');
    mp.players.toArray().filter(target => target.user && target.id !== player.id && target.getVariable('radioVol') === freq).map(target => {
        target.call('radio:targetStopSpeak', [target.id])
    });
})