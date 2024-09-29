import {systemUtil} from "../../shared/system";

export class Raycast {
    static get(){
        let objectRes = mp.game.graphics.getScreenActiveResolution(1, 1);
        return this.getByScreenCoord(objectRes.x / 2, objectRes.y / 2)
    }
    static getByScreenCoord(x: number, y: number){
        // return this.getByWorldCoord(mp.game.graphics.screen2dToWorld3d([x, y], useRaycast))
        return entityAt2dPosition(x,y);
    }
    static getByWorldCoord(pos3d: Vector3Mp){
        let pos = mp.game.graphics.world3dToScreen2d(pos3d.x, pos3d.y, pos3d.z);
        if(!pos) return null;
        return this.getByScreenCoord(pos.x, pos.y)
    }
    static getByCursor(){
        return this.getByScreenCoord(mp.gui.cursor.position[0], mp.gui.cursor.position[1])
    }
    static getFront(maxDistance = 2.0){
        return mp.raycasting.testCapsule(mp.players.local.getOffsetFromInWorldCoords(0.0, 1.0, 0.0), mp.players.local.getOffsetFromInWorldCoords(0.0, maxDistance, 0.0), 0.2, player.handle, [2, 4, 8, 16]);
    }
    static getEntityLookAt(maxDistance = 5) {
        const {
            x: screenX,
            y: screenY
        } = mp.game.graphics.getScreenActiveResolution(0, 0);

        const raycastResult = entityAt2dPositionFromHead(screenX / 2, screenY / 2);
        if (!raycastResult) {
            return null;
        }

        if (!raycastResult.entity) {
            return null;
        }

        if (systemUtil.distanceToPos(raycastResult.position, mp.players.local.position) > maxDistance) {
            return null;
        }

        return raycastResult.entity;
    }

    static getPositionLookAt() {
        const {
            x: screenX,
            y: screenY
        } = mp.game.graphics.getScreenActiveResolution(0, 0);

        const {
            x: rX,
            y: rY
        } = processCoordinates(screenX / 2, screenY / 2);

        const camPos = cameras.getCoord();
        return s2w(camPos, rX, rY);
    }
}







let cef = null;
let camera = null;
const player = mp.players.local;




const cameras = mp.cameras.new("gameplay");

function entityAt2dPosition(absoluteX: number, absoluteY: number) {
    const camPos = cameras.getCoord();
    const {
        x: rX,
        y: rY
    } = processCoordinates(absoluteX, absoluteY);
    const target = s2w(camPos, rX, rY);

    const dir = sub(target, camPos);
    const from = add(camPos, mulNumber(dir, 0.0));
    const to = add(camPos, mulNumber(dir, 300));

    // @ts-ignore
    const ray = mp.raycasting.testCapsule(from, to, 0.1, player, [2, 4, 8, 16]);

    return ray === undefined ? undefined : ray;
}

function entityAt2dPositionFromHead(absoluteX: number, absoluteY: number) {
    const {
        x: rX,
        y: rY
    } = processCoordinates(absoluteX, absoluteY);

    const headPosition = player.getBoneCoords(31086, 0, 0 ,0);
    const target = s2w(headPosition, rX, rY);


    const dir = sub(target, headPosition);
    const from = add(headPosition, mulNumber(dir, 0.0));
    const to = add(headPosition, mulNumber(dir, 300));

    // @ts-ignore
    const ray = mp.raycasting.testPointToPoint(from, to, player, [2, 4, 8, 12, 16]);

    return ray === undefined ? undefined : ray;
}

function screen2dToWorld3d(absoluteX: number, absoluteY: number) {
    const camPos = cameras.getCoord();
    const {
        x: rX,
        y: rY
    } = processCoordinates(absoluteX, absoluteY);
    const target = s2w(camPos, rX, rY);

    const dir = sub(target, camPos);
    const from = add(camPos, mulNumber(dir, 0.0));
    const to = add(camPos, mulNumber(dir, 300));

    const ray = mp.raycasting.testPointToPoint(from, to, [player.handle], [2, 4, 8, 16]);

    return ray === undefined ? undefined : ray.position;
}

function s2w(camPos: Vector3Mp, relX: number, relY: number) {
    const camRot = cameras.getRot(0);
    const camForward = rotationToDirection(camRot);
    const rotUp = add(camRot, new mp.Vector3(10, 0, 0));
    const rotDown = add(camRot, new mp.Vector3(-10, 0, 0));
    const rotLeft = add(camRot, new mp.Vector3(0, 0, -10));
    const rotRight = add(camRot, new mp.Vector3(0, 0, 10));

    const camRight = sub(rotationToDirection(rotRight), rotationToDirection(rotLeft));
    const camUp = sub(rotationToDirection(rotUp), rotationToDirection(rotDown));

    const rollRad = -degToRad(camRot.y);

    const camRightRoll = sub(mulNumber(camRight, Math.cos(rollRad)), mulNumber(camUp, Math.sin(rollRad)));
    const camUpRoll = add(mulNumber(camRight, Math.sin(rollRad)), mulNumber(camUp, Math.cos(rollRad)));

    const point3D = add(
        add(
            add(camPos, mulNumber(camForward, 10.0)),
            camRightRoll
        ),
        camUpRoll);

    const point2D = w2s(point3D);

    if (point2D === undefined) {
        return add(camPos, mulNumber(camForward, 10.0));
    }

    const point3DZero = add(camPos, mulNumber(camForward, 10.0));
    const point2DZero = w2s(point3DZero);

    if (point2DZero === undefined) {
        return add(camPos, mulNumber(camForward, 10.0));
    }

    const eps = 0.001;

    if (Math.abs(point2D.x - point2DZero.x) < eps || Math.abs(point2D.y - point2DZero.y) < eps) {
        return add(camPos, mulNumber(camForward, 10.0));
    }

    const scaleX = (relX - point2DZero.x) / (point2D.x - point2DZero.x);
    const scaleY = (relY - point2DZero.y) / (point2D.y - point2DZero.y);
    const point3Dret = add(
        add(
            add(camPos, mulNumber(camForward, 10.0)),
            mulNumber(camRightRoll, scaleX)
        ),
        mulNumber(camUpRoll, scaleY));

    return point3Dret;
}

function processCoordinates(x: number, y: number) {
    const {
        x: screenX,
        y: screenY
    } = mp.game.graphics.getScreenActiveResolution(0, 0);

    let relativeX = (1 - ((x / screenX) * 1.0) * 2);
    let relativeY = (1 - ((y / screenY) * 1.0) * 2);

    if (relativeX > 0.0) {
        relativeX = -relativeX;
    } else {
        relativeX = Math.abs(relativeX);
    }

    if (relativeY > 0.0) {
        relativeY = -relativeY;
    } else {
        relativeY = Math.abs(relativeY);
    }

    return {
        x: relativeX,
        y: relativeY
    };
}

function w2s(position: Vector3Mp) {
    const result = mp.game.graphics.world3dToScreen2d(position.x, position.y, position.z);

    if (result === undefined) {
        return undefined;
    }

    return new mp.Vector3((result.x - 0.5) * 2, (result.y - 0.5) * 2, 0);
}

function rotationToDirection(rotation: Vector3Mp) {
    const z = degToRad(rotation.z);
    const x = degToRad(rotation.x);
    const num = Math.abs(Math.cos(x));

    return new mp.Vector3((-Math.sin(z) * num), (Math.cos(z) * num), Math.sin(x));
}

function degToRad(deg: number) {
    return deg * Math.PI / 180.0;
}

function add(vector1: Vector3Mp, vector2: Vector3Mp) {
    return new mp.Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
}

function sub(vector1: Vector3Mp, vector2: Vector3Mp) {
    return new mp.Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
}

function mulNumber(vector1: Vector3Mp, value: number) {
    return new mp.Vector3(vector1.x * value, vector1.y * value, vector1.z * value);
}