import {
    agencies,
    AGENCY_BLIP_COLOR,
    AGENCY_BLIP_NAME,
    AGENCY_BLIP_SPRITE, AGENCY_NPC_MODELS, cost, IAgencyData, IAgencyHouseDTO
} from "../../../../shared/houses/agency/config";
import {colshapes} from "../../checkpoints";
import {houses} from "../../houses";
import {HouseEntity} from "../../typeorm/entities/houses";
import {system} from "../../system";
import {CustomEvent} from "../../custom.event";
import {getInteriorGarageById, getInteriorHouseById, interriors} from "../../../../shared/inrerriors";
import {HousesTeleportsList} from "../../../../shared/houses";

class Agency {
    private freeHouses: HouseEntity[] = [];

    constructor() {
        this.spawn();

        setTimeout(() => {
            setInterval(this.updateFreeHousesHandler, 3000);
        }, 2500);

        CustomEvent.registerCef('agency:setBlip', this.setBlipHandler);
    }

    protected spawn(): void {
        const positions: Vector3Mp[] = [];

        agencies.map(el => {
            positions.push(el.position);

            mp.blips.new(AGENCY_BLIP_SPRITE, el.position, {
                color: AGENCY_BLIP_COLOR,
                shortRange: true,
                name: AGENCY_BLIP_NAME,
                scale: 1.5
            });

            mp.peds.new(
                mp.joaat(AGENCY_NPC_MODELS[Math.floor(Math.random() * AGENCY_NPC_MODELS.length)]),
                el.npcPosition,
                {
                    dynamic: false,
                    frozen: true,
                    invincible: true,
                    heading: el.npcHeading,
                    dimension: 0
                }
            );
        });

        colshapes.new(positions, 'Риелторское агенство', this.interactionHandler, {
            dimension: 0,
            radius: 1,
            color: [255, 255, 255, 255],
            type: 1
        });
    }

    private setBlipHandler = (player: PlayerMp, houseId: number) => {
        if (!player.user) return;

        const house = houses.get(houseId);

        if (player.user.money < cost)
            return player.notify('У вас недостаточно денег', 'error');

        if (!house) return;

        player.user.log('houses', `Купил метку на дом - ${house.id}`);

        player.user.money = player.user.money - cost;

        let pos = new mp.Vector3(house.x, house.y, house.z);

        if (house.name.includes('Многоквартирный дом')) {
            const h = HousesTeleportsList.find(el => el.name === house.name);

            if (h !== undefined) {
                pos = h.pos;
            }
        }

        player.user.setWaypointBlips([{
            x: pos.x,
            y: pos.y,
            name: `Свободный дом`,
            shortRange: true,
            color: 2,
            type: 492,
            distDestroy: 1
        }])
    }

    private updateFreeHousesHandler = () => {
        this.freeHouses = this.getHouses();
    }

    private getHouses(): HouseEntity[] {
        const array: HouseEntity[] = [];

        houses.data.forEach(el => {
            if (el.canPurchase && !el.userId && !el.familyId)
                array.push(el);
        })

        return array;
    }

    interactionHandler = (player: PlayerMp): void => {
        if (!player.user) return;

        const agency: IAgencyData = this.getAgency(player.position),
            houses: IAgencyHouseDTO[] = [];

        this.freeHouses.map(el => {
            houses.push({
                id: el.id,
                name: el.name,
                repository: el.stock !== 0,
                garageSpaces: getInteriorGarageById(el.car_interrior).cars ?
                    getInteriorGarageById(el.car_interrior).cars.length : -1,
                stock: el.haveChest !== 0,
                interior: getInteriorHouseById(el.interrior).name,
                helicopter: el.air_x !== 0
            })
        })

        player.user.setGui('realEstateAgency');
        CustomEvent.triggerCef(player, 'agency:setData', {
            name: agency.name,
            id: agency.id,
        });

        const arr = system.chunkArray(houses, 5);

        arr.forEach(el => {
            CustomEvent.triggerCef(player, 'agency:addHouse', el);
        })
    }

    public getTimeForPurchase(): number {
        return system.timestamp + Math.floor(Math.random() * 59400 + 600)
    }

    private getAgency(pos: Vector3Mp) {
        let currentAgency: IAgencyData,
            lastDist: number = 9999;

        agencies.map(el => {
            const dist = system.distanceToPos(pos, el.position);

            if (dist < lastDist) {
                lastDist = dist;
                currentAgency = el;
            }
        })

        return currentAgency;
    }
}

export const agency = new Agency();