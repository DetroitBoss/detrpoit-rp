import AgencyStore from "./index";
import {IAgencyDTO, IAgencyHouseDTO} from "../../../shared/houses/agency/config";


export default {
    'agency:setData': (store: AgencyStore, DTO: IAgencyDTO) => {
        store.setState({
            id: DTO.id,
            name: DTO.name,
            houses: []
        })
    },

    'agency:addHouse': (store: AgencyStore, houses: IAgencyHouseDTO[]) => {
        setTimeout(() => {
            store.setState({
                houses: store.houses.concat(houses)
            })
        }, 100)
    }
}