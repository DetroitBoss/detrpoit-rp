import {user} from "./user"

mp.events.add('gps:set', (x: number, y: number, z: number, chatNotify?:string, alert = true) => {
    user.setWaypoint(x, y, z, alert, chatNotify);
})
