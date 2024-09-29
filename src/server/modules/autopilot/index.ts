import { CustomEvent } from "../custom.event";

CustomEvent.registerClient('autopilot:isInstalled', (player) => {
    if (!player.vehicle)
        return player.notify('Для активации автопилота необходимо находиться в машине', 'error');

    if (player.seat !== 0)
        return player.notify('Для активации автопилота необходимо находиться на водительском месте', 'error');

    if (!player.vehicle.engine)
        return player.notify('Нельзя использовать автопилот, когда двигатель заглушен', 'error');

    if (!player.vehicle?.entity?.data)
        return player.notify('В машине отсутствует автопилот', 'error');

    if (!player.vehicle.entity.data.isAutopilotInstalled)
        return player.notify('В машине отсутствует автопилот', 'error');

    CustomEvent.triggerClient(player, 'autopilot:toggle');
});