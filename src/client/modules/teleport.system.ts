import {TELEPORT_CONFIG} from "../../shared/teleport.system";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {waitTimer} from "./anim";

TELEPORT_CONFIG.map((item, confid) => {
    item.points.map((q, index) => {
        const pos = new mp.Vector3(q.x, q.y, q.z)
        colshapes.new(pos, item.name, async (player) => {
            if(item.oneway && index) return;
            if (item.fraction){
                if(typeof item.fraction === "number" && item.fraction !== user.fraction) return user.notify("У вас нет доступа", "error");
                else if(item.fraction === "gang" && !user.is_gang) return user.notify("У вас нет доступа", "error");
                else if(item.fraction === "gos" && !user.is_gos) return user.notify("У вас нет доступа", "error");
            }

            if (item.family && user.family !== item.family) {
                return user.notify("У вас нет доступа", "error");
            }

            if(item.cost && user.money < item.cost) return user.notify("У вас недостаточно средств для оплаты", "error");
            if(item.oneway && item.wait && !(await waitTimer(item.wait.distance, item.wait.seconds, item.wait.text))) return;
            if (item.oneway) return CustomEvent.triggerServer('teleport:go', confid, 1);
            if(!item.onenter && !!item.onenterpress && item.points.length == 2 && !item.cost){
                const pos = item.points.findIndex((q, i) => i !== index)
                if(pos > -1){
                    return CustomEvent.triggerServer('teleport:go', confid, pos);
                }
            }
            const m = new MenuClass(item.name);
            if(item.cost) m.subtitle = `Стоимость: $${system.numberFormat(item.cost)}`
            item.points.map((pos, posindex) => {
                if(posindex === index) return;
                m.newItem({
                    name: pos.name,
                    onpress: async () => {
                        m.close();
                        if(item.wait && !(await waitTimer(item.wait.distance, item.wait.seconds, item.wait.text))) return;
                        CustomEvent.triggerServer('teleport:go', confid, posindex);
                    }
                })
            })
            m.open();
        }, {
            type: 27,
            radius: item.vehicle ? 4 : 1.5,
            onenter: !!item.onenter,
            dimension: q.d,
            drawStaticName: "scaleform"
        })
    })
})