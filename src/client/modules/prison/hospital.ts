import {
    PRISON_HOSPITAL_RESPAWN_POS,
    PRISON_HOSPITAL_SHAPE_POS,
    PRISON_HOSPITAL_SHAPE_RADIUS,
    PRISON_HOSPITAL_TIME
} from "../../../shared/prison/config";
import {CustomEvent} from "../custom.event";
import {user} from "../user";

export let hospitalTime: number = null;

const shape = mp.colshapes.newSphere(
    PRISON_HOSPITAL_SHAPE_POS.x,
    PRISON_HOSPITAL_SHAPE_POS.y,
    PRISON_HOSPITAL_SHAPE_POS.z,
    PRISON_HOSPITAL_SHAPE_RADIUS,
    0
);

mp.events.add("playerExitColshape", (colshape) => {
    if (shape !== colshape || hospitalTime === null) return;

    const pos = PRISON_HOSPITAL_RESPAWN_POS[Math.floor(Math.random() * PRISON_HOSPITAL_RESPAWN_POS.length)];

    user.teleport(
        pos.x,
        pos.y,
        pos.z,
        0
    ).then(() => {
        user.notify("Ожидайте когда закончится лечение");
    });
})

CustomEvent.registerServer('prison:hospital:start', () => {
    user.notify(`Вы попали в тюремный госпиталь, необходимо пройти курс лечения в течение ${PRISON_HOSPITAL_TIME} минут`, 'success');

    hospitalTime = PRISON_HOSPITAL_TIME * 60;
});


const interval = setInterval(() => {
    if (hospitalTime === null) return;

    if (hospitalTime - 1 <= 0) {
        hospitalTime = null;
        user.notify(`Вы успешно прошли курс лечения`, 'success');
    }else{
        hospitalTime -= 1;
    }
}, 1000);