import {ALERTS_SETTINGS} from "../shared/alertsSettings";
import './extensions'
import './modules/'

mp.console.clear();
mp.console.logWarning('CLIENT START')
if(!mp.storage.data.alertsEnable) (mp.storage.data.alertsEnable as any) = {}
for(let key in ALERTS_SETTINGS){
    (mp.storage.data.alertsEnable as any)[key] = typeof (mp.storage.data.alertsEnable as any)[key] === "boolean" ? (mp.storage.data.alertsEnable as any)[key] : true
}

setInterval(() => {
    mp.storage.flush();
}, 60000)