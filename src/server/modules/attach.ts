import {CustomEvent} from "./custom.event";

CustomEvent.registerClient('attach:system:addLocal', (player, id: string) => {
    const user = player.user;
    if(!user) return;
    user.addAttachment(id)
})

CustomEvent.registerClient('attach:system:removeLocal', (player, id: string) => {
    const user = player.user;
    if(!user) return;
    user.removeAttachment(id)
})