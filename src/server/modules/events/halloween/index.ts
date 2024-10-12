import {NoSQLbase} from "../../nosql";

interface HalloweenNoSQlData {
    enabled?: boolean
}

// TODO: set file 'halloweenData'
const halloweenData = new NoSQLbase<HalloweenNoSQlData>(':memory:', () => {
    if (halloweenData.data.length === 0) {
        halloweenData.insert({
            enabled: false
        });
    }
});

export const isHalloweenEnabled = (): boolean => {
    return halloweenData.data[0].enabled;
}

//  import './sweetsCollecting';
//  import './quests';
//  import './npcs';
//  import './potions';
import './potions/item.use.hook';
import './exchange';
