import {CustomEvent} from "../../custom.event";
import {
    ENTER_VEHICLE_STEP_DESTROY_MARKER,
    ENTER_VEHICLE_STEP_MARK_VEHICLE
} from "../../../../shared/advancedQuests/config";

let markedVehicleRemoteId: number = null;
let markedVehicle: VehicleMp = null;

setInterval(() => {
    if (!markedVehicleRemoteId) {
        return;
    }

    const vehicle = mp.vehicles.atRemoteId(markedVehicleRemoteId);
    if (!vehicle || !vehicle.handle) {
        return;
    }

    markedVehicle = vehicle;
}, 500);

mp.events.add('render', () => {
    if (!markedVehicle) {
        return;
    }

    const position = markedVehicle.position;

    mp.game.graphics.drawMarker(0,
        position.x, position.y, position.z + 1.5,
        0, 0, 0,
        0, 0, 0,
        1, 1, 0.5,
        139, 0, 255, 220,
        false, false, 2,
        false, null, null, false
    );
});

CustomEvent.registerServer(ENTER_VEHICLE_STEP_MARK_VEHICLE, (vehicleRemoteId: number) => {
    markedVehicleRemoteId = vehicleRemoteId;
});

CustomEvent.registerServer(ENTER_VEHICLE_STEP_DESTROY_MARKER, () => {
    markedVehicleRemoteId = null;
    markedVehicle = null;
});
