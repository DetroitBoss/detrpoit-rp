import {CustomEvent} from "../custom.event";
import {systemUtil} from "../../../shared/system";
import {SELLER_POSITION_RADIUS} from "../../../shared/market/config";
import {user} from "../user";
import {guiNames} from "../../../shared/gui";

let sellerPosition: Vector3Mp = null;
CustomEvent.registerServer('market:setSellerPosition', (position: Vector3Mp) => {
    sellerPosition = position;
});

CustomEvent.registerServer('market:calledByCop', () => {
    moveToSellerPos();
    user.notify('Администратор рынка попросил вас подойти к своей палатке', 'warning');
});

function checkPlayerPosition() {
    if (sellerPosition === null) {
        return;
    }

    const playerPos = mp.players.local.position;
    if (systemUtil.distanceToPos(playerPos, sellerPosition) < SELLER_POSITION_RADIUS) {
        return;
    }

    moveToSellerPos();
    user.notify('Вы не должны уходить далеко от палатки', 'warning');
}

function moveToSellerPos() {
    mp.players.local.taskGoStraightToCoord(sellerPosition.x, sellerPosition.y, sellerPosition.z,
        4.0, 5000, 0, 0);
}

setInterval(checkPlayerPosition, 3000);

mp.events.add('gui:menuClosed', (closedGui: guiNames) => {
    if (closedGui != 'market') {
        return;
    }

    CustomEvent.triggerServer('market:closed');
});
