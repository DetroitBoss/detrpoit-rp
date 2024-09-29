import {CustomEvent} from "./custom.event";
import {DRIFT_DEFAULT_PARAMS} from "../../shared/drift";
import {user} from "./user";
import {system} from "./system";
import {applyConfigMaxSpeed} from "./businesses/lsc.chip";
const player = mp.players.local;
export let driftMapLoaded = false;

CustomEvent.registerServer('driftmap', (status: boolean) => {
    if(status) mp.game.streaming.requestIpl("driftmap");
    else mp.game.streaming.removeIpl("driftmap");
    driftMapLoaded = status;
    CustomEvent.triggerCef('driftmap', status);
})

let q = 0;

setInterval(() => {
    if(!driftMapLoaded) {
        q = 0;
        return;
    }
    if(mp.players.local.position.z < 400) q++;
    else q = 0;
    if(q === 3){
        CustomEvent.triggerServer('drift:fall')
    }

}, 1000)





// let driftModEnabled = false;
// setInterval(() => {
//     if(user.isDriver && player.vehicle && player.vehicle.getVariable('tuningData')) {
//         driftModEnabled = !!(player.vehicle.getVariable('tuningData') as [number, number][]).find(v => v[0] == 3004 && v[1] == 0);
//     }
//     else if(driftModEnabled) driftModEnabled = false
// }, 5000)

const rad = function (degrees:any) {
    return degrees * Math.PI / 180;
};
const deg = function (radians:any) {
    return radians * 180 / Math.PI;
};

const angle = (vehicle: VehicleMp) =>  {
    //return vehicle.angle();
    let velocity = vehicle.getVelocity();
    let vx = velocity.x;
    let vy = velocity.y;
    let vz = velocity.z;
    let modV = Math.sqrt(vx * vx + vy * vy);

    let rot = vehicle.getRotation(0);
    let rx = rot.x;
    let ry = rot.y;
    let rz = rot.z;
    let sn = -Math.sin(rad(rz));
    let cs = Math.cos(rad(rz))
    if (vehicle.getSpeed() * 3.6 < 30 && vehicle.gear == 0) return [0, modV]; // end --speed over 30 km/h

    let cosX = ((sn * vx + cs * vy) / modV);
    if (cosX > 0.966 && cosX < 0) return [0, modV];
    else return [deg(Math.acos(cosX)) * 0.5, modV];
}

let speed = 0;

mp.events.add('render', () => {
    const vehicle = player.vehicle;
    if(!vehicle) {
        return;
    }
    if(!vehicle.getVariable('driftEnable')) {
        if(speed > 0){
            applyConfigMaxSpeed(vehicle);
            speed = 0;
            if (vehicle.getVariable('multiple')) vehicle.setEngineTorqueMultiplier(vehicle.getVariable('multiple') / 100)
        }
        return;
    }
    let vehparam = angle(vehicle);
    if (!isNaN(vehparam[0]) && vehparam[0] > 2 && vehparam[1] > 10 && vehicle.gear != 0) {
        let cfg = DRIFT_DEFAULT_PARAMS
        let anglemultiple = vehicle.getVariable('driftAngle') || 0;
        let speedmultiple = vehicle.getVariable('driftSpeed') || 0;
        anglemultiple = (anglemultiple / 100) * cfg.angle;
        speedmultiple = (speedmultiple / 100) * cfg.speed;
        let angleparam = vehparam[0] * anglemultiple;
        let spparam = (70 - vehparam[1]) * speedmultiple;
        let power = ((angleparam + spparam) / 10);

        const current = vehicle.getSpeed()
        if((speed - current) > 20) speed = current;


        vehicle.setMaxSpeed(speed)
        vehicle.setEngineTorqueMultiplier(power);
    } else {
        if (vehicle.getVariable('multiple')) vehicle.setEngineTorqueMultiplier(vehicle.getVariable('multiple') / 100)
        speed = vehicle.getSpeed();
        applyConfigMaxSpeed(vehicle);
    }
})

export const driftData = {
    block: false,
    health: 0,
    time: 0,
    current: {score: 0, multiple: 0, text: <string[]>[]},
    last: {score: 0, multiple: 0, text: <string[]>[]},
    draw: function(){
        if(this.last.score != this.current.score || this.last.multiple != this.current.multiple || JSON.stringify(this.last.text) != JSON.stringify(this.current.text)){
            CustomEvent.triggerCef('drift:score', this.current.score, this.current.multiple, this.current.text);
            if(this.last.score && !this.current.score){
                if(user.isDriver) CustomEvent.triggerServer('drift:score', this.last.score)
            }
            this.last.score = this.current.score;
            this.last.multiple = this.current.multiple;
            this.last.text = this.current.text;
        }
    }
}

setInterval(() => {
    if(driftData.block) return driftData.draw();
    const vehicle = player.vehicle;
    if(!user.inDriftMap || user.afk || !vehicle || !vehicle.getVariable('driftEnable') || vehicle.isInAir()) {
        if((driftData.current.score || driftData.current.multiple) && system.timestamp - driftData.time > 3){
            driftData.current.score = 0;
            driftData.current.multiple = 0;
        }
    } else {
        let vehparam = angle(vehicle);
        if (!isNaN(vehparam[0]) && vehparam[0] > 2 && vehparam[1] > 10 && vehicle.gear != 0) {
            if(driftData.current.multiple < 1) driftData.current.multiple = 1;
            if(!driftData.health) driftData.health = vehicle.getBodyHealth();
            else if(vehicle.getBodyHealth() !== driftData.health){
                driftData.block = true;
                setTimeout(() => {
                    driftData.health = 0;
                    driftData.block = false;
                    driftData.current.score = 0;
                    driftData.current.multiple = 0;
                }, 5000)
            } else {
                driftData.current.text = [];
                let angleText = ""
                if(vehparam[0] > 15) angleText = "+ Angle";
                if(vehparam[0] > 25) angleText = "++ Angle";
                if(vehparam[0] > 30) angleText = "+++ Angle";
                if(angleText)driftData.current.text.push(angleText);
                let speedText = ""
                let speedInKmh = vehparam[1] * 3.6
                if(speedInKmh > 60) speedText = "+ Speed";
                if(speedInKmh > 90) speedText = "++ Speed";
                if(speedInKmh > 120) speedText = "+++ Speed";
                if(speedText)driftData.current.text.push(speedText);
                let addScore = Math.floor(((vehparam[0] * vehparam[1]) / 100) * driftData.current.multiple);
                driftData.current.score += addScore
                driftData.current.multiple = Math.min(driftData.current.multiple + 0.03, 10.0);
                driftData.time = system.timestamp;
                const nearestVeh = user.getNearestVehicles(6)[1];
                if(nearestVeh){
                    if(nearestVeh.getVariable('driftEnable')){
                        let vehparam2 = angle(nearestVeh);
                        if (!isNaN(vehparam2[0]) && vehparam2[0] > 2 && vehparam2[1] > 10){
                            driftData.current.score += addScore
                            driftData.current.text.push('+ Paired');
                        } else {
                            // user.notify('no drift')
                        }
                    } else {
                        // user.notify('no enabled')
                    }
                } else {
                    // user.notify('no veh')
                }

            }
        } else if((driftData.current.score || driftData.current.multiple) && system.timestamp - driftData.time > 3){
            driftData.current.score = 0;
            driftData.current.multiple = 0;
        } else if(driftData.current.multiple > 1){
            driftData.current.multiple = Math.max(driftData.current.multiple - 0.01, 1.0);
        }
    }
    driftData.draw()
}, 100)
