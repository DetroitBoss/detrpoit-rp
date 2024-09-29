import {CustomEvent} from "./custom.event";
import {VEHICLE_FUEL_TYPE} from "../../shared/vehicles";
import {gui} from "./gui";
import {getVehicleMod} from "./businesses/lsc";

CustomEvent.registerServer('vehicle:sell:menu', (data:  {carModel: string, carName: string, carPlate: string, carFuel: number, carOwner: string, carTypeFuel: VEHICLE_FUEL_TYPE, carBag: number, pos: number, color: {r: number, g: number, b: number}, color2: {}, carPrice: number}, tuning: [number, number][]) => {
    // gui.setGui('vehiclesell')
    // CustomEvent.triggerCef('vehicle:sell:open', data);


    /*
    {
  name: string,
  owner: string,
  price: number,
  fuel: number,
  fuelType: VEHICLE_FUEL_TYPE,
  plate: string,
  bag: number,
  tuning: {id: number, name: string}[]
}
     */
    let tuningData = tuning.filter(t => {
        if(!mp.players.local.vehicle) return false;
        if(!getVehicleMod(t[0])) return false
        if(getVehicleMod(t[0]).target == 'bike' && mp.game.vehicle.isThisModelACar(mp.players.local.vehicle.model)) return false
        if(getVehicleMod(t[0]).target == 'car' && mp.game.vehicle.isThisModelABike(mp.players.local.vehicle.model)) return false
        return true
    }).map(t => {
        return { id: t[0], name: getVehicleMod(t[0]).name }
    })
    gui.setGui('buycar')
    CustomEvent.triggerCef('buycar:show', { name: data.carName, owner: data.carOwner, price: data.carPrice, fuel: data.carFuel, fuelType: data.carTypeFuel, plate: data.carPlate, bag: data.carBag, tuning: tuningData, pos: data.pos });
})