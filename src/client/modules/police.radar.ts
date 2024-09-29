import {gui} from "./gui";
import {CustomEvent} from "./custom.event";

const player = mp.players.local;


interface RadarData {

}

export class PoliceRadar {
    static shown = false;
    static freeze = false;
    static info = {
        s: 0,
        p: "",
        t: 0,
    };
    static info2 = {
        s: 0,
        p: "",
        t: 0,
    };
    static minSpeed = 5.0;
    static maxSpeed = 75.0;
    static frontRadar: RadarData
    static rearRadar: RadarData
    static drawAdvancedText(x: number, y: number, w: number, h: number, sc: number, text: string, r: number, g: number, b: number, a: number, font: number, jus: 0 | 1 | 2){
        gui.drawText(text, x - 0.1 + w, y - 0.02 + h, sc, r, g, b, a, font, jus, true, true)
    }
    static get inPoliceVehicle(){
        return player.isInAnyPoliceVehicle() && !player.isInAnyHeli()
    }
    static get canGetData(){
        return this.shown && this.inPoliceVehicle
    }
    static getVehicleData(veh: VehicleMp) {
        const veh2 = player.vehicle;
        if(!veh2) return;
        if(veh2.id === veh.id) return;
        let name: string = veh.getVariable('name');
        if (!name) name = mp.game.vehicle.getDisplayNameFromVehicleModel(veh.getModel())
        let speed = Math.floor(veh.getSpeed() * 3.6);
        let plate = veh.getNumberPlateText();
        let plateType = veh.getNumberPlateTextIndex();
        return  { name, speed, plate, plateType }
    }
    static getData(){
        if(!this.canGetData) return;
        if(this.freeze) return;
        const veh = player.vehicle;
        if(!veh) return;
        const coordA = veh.getOffsetFromInWorldCoords(0.0, 5.0, 1.0);
        const coordB = veh.getOffsetFromInWorldCoords(0.0, 70.0, 0.0);
        const frontcar = mp.raycasting.testCapsule(coordA, coordB, 5.0, [veh.handle], [10]);

        if(frontcar && frontcar.entity && typeof frontcar.entity === "object" && frontcar.entity.type == "vehicle"){
            const data = this.getVehicleData(frontcar.entity as VehicleMp);
            if(data){
                this.info = {
                    s: data.speed,
                    p: data.plate,
                    t: data.plateType,
                }
            }
        }

        const rcoordA = veh.getOffsetFromInWorldCoords(0.0, -5.0, 1.0);
        const rcoordB = veh.getOffsetFromInWorldCoords(0.0, -70.0, 0.0);
        const rearcar = mp.raycasting.testCapsule(rcoordA, rcoordB, 4.0, [veh.handle], [10]);

        if(rearcar && rearcar.entity && typeof rearcar.entity === "object" && rearcar.entity.type == "vehicle"){
            const data = this.getVehicleData(rearcar.entity as VehicleMp);
            if(data){
                this.info2 = {
                    s: data.speed,
                    p: data.plate,
                    t: data.plateType,
                }
            }
        }
    }
    static draw(){
        this.getData();
        if(!this.canGetData){
            this.info = {
                s: 0,
                t: 0,
                p: "",
            }
            this.info2 = {
                s: 0,
                t: 0,
                p: "",
            }
            return;
        }
        CustomEvent.triggerCef('radar:data', this.info.s, this.info.p, this.info2.s, this.info2.p, this.info.t, this.info2.t)
    }
}


setInterval(() => {
    if(!PoliceRadar.shown) return;
    if(!PoliceRadar.inPoliceVehicle){
        if(PoliceRadar.shown) CustomEvent.triggerCef('radar:show', false);
        PoliceRadar.shown = false;
        return;
    }
    PoliceRadar.draw()
}, 200)

CustomEvent.register('radarEnable', () => {
    if(!PoliceRadar.inPoliceVehicle){
        if(PoliceRadar.shown) CustomEvent.triggerCef('radar:show', false);
        PoliceRadar.shown = false;
        return;
    }
    PoliceRadar.shown = !PoliceRadar.shown
    CustomEvent.triggerCef('radar:show', PoliceRadar.shown);
})

// CustomEvent.register('radarFreeze', () => {
//     if(!PoliceRadar.inPoliceVehicle){
//         PoliceRadar.shown = false;
//         return;
//     }
//     PoliceRadar.freeze = !PoliceRadar.freeze
// })

