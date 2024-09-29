mp.events.add('setLod:vehs', (val => {
    mp.storage.data.lodDistVehs = val;
    reload();
}))
mp.events.add('setLod:players', (val => {
    mp.storage.data.lodDistPlayers = val;
    reload();
}))

const tick = (target: EntityMp) => {
    if(!target.handle) return;
    const vehVal = mp.storage.data.lodDistVehs || 200
    const plVal = mp.storage.data.lodDistPlayers || 200
    const isVeh = target.type === 'vehicle';
    const val = isVeh ? vehVal : plVal;
    mp.game.invoke('0x5927F96A78577363', target.handle, val);
}

const reload = () => {
    [...mp.vehicles.toArray(), ...mp.players.toArray()].filter(q => q.handle).map((entity) => tick(entity));
}

mp.events.add('entityStreamIn', async (target: EntityMp) => {
    if (["player", "vehicle"].includes(target.type)) tick(target)
});