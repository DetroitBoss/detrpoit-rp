import {CustomEvent} from "../custom.event";

const UPDATE_INTERVAL_TIMEOUT_MS = 75;

class FamilyBlipTracker {
    private _intervalId: number
    private _enabled: boolean = false
    public familyId: number | null = null
    private _trackedPlayers: Array<PlayerMp> = []
    private _trackedBlips: Array<BlipMp> = []

    public get enabled() {
        return this._enabled
    }

    public startTracking(): void {
        if (this._enabled) return
        this._enabled = true
        mp.players.forEachInStreamRange(p => {
            if (!p.doesExist()) return
            if (p.remoteId === mp.players.local.remoteId) return
            if (p.getVariable("family")[0] === this.familyId) {
                this.addPlayerToTracker(p)
            }
        })
        this._intervalId = setInterval(() => this.updateBlipPositions(), UPDATE_INTERVAL_TIMEOUT_MS)
    }

    private updateBlipPositions(): void {
        this._trackedBlips.forEach((b, idx) => {
            if (this._trackedPlayers[idx]?.doesExist())
                b.setCoords(this._trackedPlayers[idx].getCoordsAutoAlive())
        })
    }

    public addPlayerToTracker(player: PlayerMp): void {
        if (this._trackedPlayers.includes(player)) return

        this._trackedPlayers.push(player)
        this._trackedBlips.push(mp.blips.new(0, player.position,
            {
                color: 0,
                rotation: player.getRotation(0).z,
                dimension: 0,
            }))
    }

    public removePlayerFromTracker(player: PlayerMp): void {
        if (this._trackedPlayers.includes(player)) {
            const idx = this._trackedPlayers.indexOf(player)
            this._trackedBlips[idx]?.destroy()
            this._trackedPlayers.splice(idx, 1)
            this._trackedBlips.splice(idx, 1)
        }
    }

    public stopTracking(): void {
        if (!this._enabled) return

        this._trackedPlayers.forEach(p => this.removePlayerFromTracker(p))

        clearInterval(this._intervalId)
        this._enabled = false
    }
}
const familyBlipTracker = new FamilyBlipTracker()

const shouldPlayerBeTracked = (player: PlayerMp) => {
    return player.type == "player"
        && mp.players.exists(player)
        && mp.players.local.remoteId !== player.remoteId
        && familyBlipTracker.familyId
        && familyBlipTracker.familyId == player.getVariable('family')[0]
}

mp.events.add('entityStreamIn', (player: PlayerMp) => {
    if (!shouldPlayerBeTracked(player)) return
    CustomEvent.triggerServer("srv:log", "addToTracker ")
    familyBlipTracker.addPlayerToTracker(player)
})

mp.events.add('entityStreamOut', (player: PlayerMp) => {
    familyBlipTracker.removePlayerFromTracker(player)
})

mp.events.addDataHandler("family", (target: PlayerMp, val: [number, number]) => {
    if (target.type != "player") return
    if (target.remoteId !== mp.players.local.remoteId) {
        familyBlipTracker.removePlayerFromTracker(target)
        if (shouldPlayerBeTracked(target))
            familyBlipTracker.addPlayerToTracker(target)
        return
    }
    CustomEvent.triggerServer("srv:log", "family " + val)
    familyBlipTracker.familyId = val[0]
});

mp.events.add('setLogin', () => {
    if (typeof mp.storage.data.renderFamilyPlayerBlips !== "boolean")
        mp.storage.data.renderFamilyPlayerBlips = false
    else {
        CustomEvent.triggerCef("enableRenderFamilyPlayerBlips", mp.storage.data.renderFamilyPlayerBlips)
    }

    if (mp.storage.data.renderFamilyPlayerBlips)
        familyBlipTracker.startTracking()
    //familyBlipTracker.addPlayerToTracker(mp.players.local)
})

mp.events.add('renderFamilyPlayerBlips', (toggle: boolean) => {
    mp.storage.data.renderFamilyPlayerBlips = toggle
    CustomEvent.triggerCef("enableRenderFamilyPlayerBlips", toggle)
    if (toggle)
        familyBlipTracker.startTracking()
    else familyBlipTracker.stopTracking()
})

