import {CustomEvent} from "./custom.event";
import {sound, Sound} from "./sound";
import {MUSIC_PLAYER_DIST, MUSIC_PLAYER_MAX_VOLUME_DEFAULT} from "../../shared/musicPlayer";
import {system} from "./system";

CustomEvent.registerServer('boxplayer:exit', (id: string) => {
    const item = Sound.get(`box_player_${id}`);
    if(item) item.destroy()
})

CustomEvent.registerServer('boxplayer:test', (id: number) => {
    const veh = mp.vehicles.atRemoteId(id)
    sound.playSoundEntity(`test`, veh, `http://127.0.0.1:3400/songs/0bHYVW240JigrvsuzsCCve.mp3`, 0.2, MUSIC_PLAYER_DIST)
})

mp.events.add('saveVoiceSettings', (_, value: number) => {
    mp.storage.data.boomboxSound = value;
})

CustomEvent.registerServer('boxplayer:data', (
    id: number,
    data: {
        id: number,
        remoteId: number,
        entityType: 'object' | 'vehicle',
        url: string,
        duration: number,
        current: number,
        volume: number
    }) => {

    let item = Sound.get(`box_player_${id}`);
    if(item) item.destroy()
    if(!data) return;

    const entity = getEntity(data.remoteId, data.entityType);
    if(!entity) return;

    item = sound.playSoundEntity(`box_player_${id}`, entity, data.url, (MUSIC_PLAYER_MAX_VOLUME_DEFAULT / 100) * data.volume, MUSIC_PLAYER_DIST)
    item.startpos = data.current;
    item.volume = (MUSIC_PLAYER_MAX_VOLUME_DEFAULT / 100) * data.volume
})
CustomEvent.registerServer('boxplayer:dataVolume', (id: number, volume: number) => {
    let item = Sound.get(`box_player_${id}`);
    if(item) item.volume = (MUSIC_PLAYER_MAX_VOLUME_DEFAULT / 100) * volume
})

const connectedMusicPlayers: {
    [key: string]: boolean
}  = {};
CustomEvent.registerServer('boxplayer:exit', (id: string) => {
    delete connectedMusicPlayers[id];
});
CustomEvent.registerServer('boxplayer:enter', (id: string) => {
    connectedMusicPlayers[id] = true;
});


function isVehicleSoundAlreadyEnabled(vehicle: VehicleMp): boolean {
    const id = `veh_${vehicle.getVariable('id')}`;
    return !!connectedMusicPlayers[id];
}

mp.events.add('entityStreamOut', (entity: EntityMp) => {
    if (!entity.isAVehicle()) {
        return;
    }

    if (isVehicleSoundAlreadyEnabled(<VehicleMp>entity)) {
        return;
    }

    CustomEvent.triggerServer('vehicle:sound:remove', [entity.remoteId]);
});

function checkVehiclesSounds() {
    const disableSoundVehiclesIds: number[] = [];
    const enableSoundVehiclesIds: number[] = [];

    mp.vehicles.forEachInStreamRange((vehicle) => {
        if (!vehicle.getVariable('musicPlayerEnabled')) {
            return;
        }

        const dist = system.distanceToPos(vehicle.position, mp.players.local.position);
        const soundEnabled = isVehicleSoundAlreadyEnabled(vehicle);

        if (soundEnabled && dist > MUSIC_PLAYER_DIST) {
            disableSoundVehiclesIds.push(vehicle.remoteId);
        } else if (!soundEnabled && dist <= MUSIC_PLAYER_DIST) {
            enableSoundVehiclesIds.push(vehicle.remoteId);
        }
    });

    if (enableSoundVehiclesIds.length > 0) {
        CustomEvent.triggerServer('vehicle:sound:add', enableSoundVehiclesIds);
    }

    if (disableSoundVehiclesIds.length > 0) {
        CustomEvent.triggerServer('vehicle:sound:remove', disableSoundVehiclesIds);
    }
}
setInterval(checkVehiclesSounds, 500);

function getEntity(remoteId: number, entityType: 'object' | 'vehicle'): EntityMp {
    switch (entityType) {
        case "object":
            return mp.objects.atRemoteId(remoteId);
        case "vehicle":
            return mp.vehicles.atRemoteId(remoteId);
        default:
            return null;
    }
}