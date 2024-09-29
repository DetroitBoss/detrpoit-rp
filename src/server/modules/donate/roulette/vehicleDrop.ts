import {DropBase} from "./dropBase";
import {VehicleDropData} from "../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import {Vehicle} from "../../vehicles";
import {LicenseName} from "../../../../shared/licence";
import {DropSellType} from "../../../../shared/donate/donate-roulette/enums";

export class VehicleDrop extends DropBase {
    constructor(public readonly data: VehicleDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        const user = player.user;
        const vehConf = Vehicle.getVehicleConfig(this.data.vehicleModel);
        
        if (!vehConf) {
            player.notify('Данную машину невозможно активировать. Обратитесь к администрации', 'error');
            return false;
        }
        if (vehConf.license && !user.haveActiveLicense(vehConf.license)) {
            player.notify(`Чтобы получить ${vehConf.name} необходимо иметь активную лицензию на ${LicenseName[vehConf.license]}`, "error");
            return false
        } 
        if (user.myVehicles.length >= user.current_vehicle_limit) {
                player.notify(`Вы можете иметь не более ${user.current_vehicle_limit} ТС.
             Дополнительные слоты можно приобрести в личном кабинете`, "error");
                return false;
        }
        
        Vehicle.createNewDatabaseVehicle(
            player, 
            vehConf.id, 
            {r: 0, g: 0, b: 0}, 
            {r: 0, g: 0, b: 0}, 
            new mp.Vector3(0,0,0), 
            0, 
            Vehicle.fineDimension, 
            this.data.sellPrice, 
            this.data.sellType == DropSellType.DONATE ? 1 : 0)
        player.outputChatBox(`Вы получили ${vehConf.name} из донат-рулетки. Транспорт вы можете бесплатно забрать на ближайшей штрафстоянке`);
        
        return true;
    };
}