import { ICrosshairSettings } from '../../shared/crosshair'
import { CustomEvent } from './custom.event'
import { gui } from './gui'
import { user } from './user'
type AimType = 'world' | 'entity'

mp.events.add('crosshair:save', (settingsData: string) => {
    mp.storage.data.crosshair = JSON.parse(settingsData) as ICrosshairSettings
    mp.storage.flush()
})

let crosshairEnabled = false
let currentAimType: AimType = 'world'

mp.events.add('render', () => {
    if (gui.currentGui || !mp.storage.data.crosshair?.enable || mp.players.local.weapon == 2725352035)// hand 
        return
    
    mp.game.ui.hideHudComponentThisFrame(14);// Точка системного прицела

    if (crosshairEnabled) {
        const entityAimingAt = mp.game.player.getEntityIsFreeAimingAt()

        if (currentAimType == 'world' && typeof entityAimingAt === 'object' && entityAimingAt.type === 'player') {
            CustomEvent.triggerCef('crosshair:drawSecondaryColor')
            currentAimType = 'entity'
        } else  if ((!entityAimingAt || typeof entityAimingAt === 'number'
                || (typeof entityAimingAt === 'object' && entityAimingAt.type != 'player'))
            && currentAimType == 'entity') {
            currentAimType = 'world'
            CustomEvent.triggerCef('crosshair:rerender');
        }
    }
    
    if (mp.game.controls.isControlJustReleased(32, 25) && crosshairEnabled) {
        CustomEvent.triggerCef('crosshair:disable')
        crosshairEnabled = false
    }

    if (mp.game.controls.isControlJustPressed(32, 25) && !crosshairEnabled) {
        CustomEvent.triggerCef('crosshair:enable')
        crosshairEnabled = true
    }
})

mp.keys.bind(121, false, () => {
    CustomEvent.triggerCef('crosshair:setSettings', mp.storage.data.crosshair);
    CustomEvent.triggerCef('crosshair:rerender');
});

mp.events.add('setLogin', () => {
    CustomEvent.triggerCef('crosshair:setSettings', mp.storage.data.crosshair);
    CustomEvent.triggerCef('crosshair:rerender');
    CustomEvent.triggerCef('crosshair:disable');
})
