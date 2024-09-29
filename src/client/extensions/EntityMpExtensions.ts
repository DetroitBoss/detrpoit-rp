// @ts-ignore
const entitiesPrototypes = [
    // @ts-ignore
    mp.Checkpoint.prototype,
    // @ts-ignore
    mp.Colshape.prototype,
    // @ts-ignore
    mp.Marker.prototype,
    // @ts-ignore
    mp.Object.prototype,
    // @ts-ignore
    mp.Ped.prototype,
    // @ts-ignore
    mp.Pickup.prototype,
    // @ts-ignore
    mp.Player.prototype,
    // @ts-ignore
    mp.TextLabel.prototype,
    // @ts-ignore
    mp.Vehicle.prototype,
    // @ts-ignore
    mp.DummyEntity.prototype
]

function extendEntity(key: string, func: (...args: any[]) => any) {
    for (let prototype of entitiesPrototypes) {
        prototype[key] = func;
    }
}

extendEntity('getCoordsAutoAlive', function(this: EntityMp): Vector3Mp {
    return this.getCoords(this.getHealth() > 0);
});
