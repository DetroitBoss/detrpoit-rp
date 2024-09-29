import {QUEST_BOT_DATA, QUESTS_DATA} from "../../shared/quests";
import {colshapeHandle} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {npcDialog, NpcSpawn} from "./npc.dialog";
import {ScaleformTextMp} from "./scaleform.mp";
import {system} from "./system";
import {getAlertSetting} from "./mainmenu";

let createdNpc = new Map<string, NpcSpawn>();
let createdColshape = new Map<string, colshapeHandle>();
let createdScaleform = new Map<string, ScaleformTextMp>();
let createdBlip = new Map<string, BlipMp>();
let questData: [number, [boolean, number][], boolean][];
CustomEvent.registerServer('quests:data', (data: [number, [boolean, number][], boolean][]) => {
    questData = data;
    CustomEvent.triggerCef('quest:data', JSON.stringify(data.find(q => !q[2])))
})

// getAlertSetting()

setInterval(() => {
    if(!questData) return;
    let myQuests: number[] = [];
    const show = getAlertSetting('questLines')
    questData.map(quest => {
        const questid = quest[0]
        const cfg = quests.getQuest(quest[0]);
        if(!cfg) return;
        myQuests.push(questid);
        cfg.tasks.map((task, taskid) => {
            if ((quest[2] || quest[1][taskid][0]) && createdBlip.has(`${questid}_${taskid}`)) {
                const blip = createdBlip.get(`${questid}_${taskid}`);
                if (blip && mp.blips.exists(blip)) blip.destroy();
                createdBlip.delete(`${questid}_${taskid}`);
            }
            if(cfg.taskStepByStep){
                if(taskid && !quest[1][taskid - 1][0]) return;
            }
            if(quest[1][taskid][0]) return;
            if (task.type === "delivertonpc" || task.type === "gotopos") {
                if (quest[1][taskid][0] || !show) {
                    if (createdBlip.get(`${questid}_${taskid}`)) {
                        createdBlip.get(`${questid}_${taskid}`).destroy();
                        createdBlip.delete(`${questid}_${taskid}`);
                    }
                    if (quest[2]){
                        if (createdNpc.get(`${questid}_${taskid}`)) {
                            createdNpc.get(`${questid}_${taskid}`).destroy();
                            createdNpc.delete(`${questid}_${taskid}`);
                        }
                    }
                    if (createdColshape.get(`${questid}_${taskid}`)) {
                        createdColshape.get(`${questid}_${taskid}`).destroy();
                        createdColshape.delete(`${questid}_${taskid}`);
                    }
                    if (createdScaleform.get(`${questid}_${taskid}`)) {
                        createdScaleform.get(`${questid}_${taskid}`).destroy();
                        createdScaleform.delete(`${questid}_${taskid}`);
                    }
                } else {
                    if (task.type === "gotopos") {
                        if (!createdColshape.has(`${questid}_${taskid}`)) {
                            createdColshape.set(`${questid}_${taskid}`, new colshapeHandle(new mp.Vector3(task.x, task.y, task.z), task.text, () => {
                                CustomEvent.triggerServer('quest:gotopos', questid, taskid);
                                createdColshape.get(`${questid}_${taskid}`).destroy();
                                createdColshape.delete(`${questid}_${taskid}`);
                            }, {
                                radius: 2,
                                type: 27,
                                color: [255, 0, 0, 50],
                                onenter: !task.keypress
                            }))

                        }
                        if (!createdScaleform.has(`${questid}_${taskid}`)) {
                            createdScaleform.set(`${questid}_${taskid}`, new ScaleformTextMp(new mp.Vector3(task.x, task.y, task.z + 1), task.text, {
                                type: "front",
                                range: 10
                            }))
                        }
                    } else {
                        if (!createdNpc.has(`${questid}_${taskid}`)) {
                            createdNpc.set(`${questid}_${taskid}`, new NpcSpawn(new mp.Vector3(task.x, task.y, task.z), task.h, task.model, task.name, () => {
                                if (task.dialog) npcDialog.openFullDialog(task.dialog, task.name, task.role, () => {
                                    CustomEvent.triggerServer('quest:gotopos', questid, taskid);
                                })
                                else CustomEvent.triggerServer('quest:gotopos', questid, taskid);
                            }))
                        }
                    }
                }
            }
            if (!mp.players.local.dimension && !createdBlip.has(`${questid}_${taskid}`) && task.blipData && !quest[2] && !quest[1][taskid][0]) {
                const blip = system.createBlip(task.blipData.bliptype, task.blipData.blipcolor, new mp.Vector3(task.blipData.x, task.blipData.y, 0), task.blipData.text)
                createdBlip.set(`${questid}_${taskid}`, blip);
                if(task.blipData.bliproute){
                    blip.setRoute(true)
                    blip.setRouteColour(task.blipData.bliproute);
                }
            }
        })
    })
    QUESTS_DATA.filter(q => !myQuests.includes(q.id)).map(quest => {
        const questid = quest.id
        quest.tasks.map((task, taskid) => {
            if (createdBlip.get(`${questid}_${taskid}`)) {
                createdBlip.get(`${questid}_${taskid}`).destroy();
                createdBlip.delete(`${questid}_${taskid}`);
            }
            if (createdNpc.get(`${questid}_${taskid}`)) {
                createdNpc.get(`${questid}_${taskid}`).destroy();
                createdNpc.delete(`${questid}_${taskid}`);
            }
            if (createdColshape.get(`${questid}_${taskid}`)) {
                createdColshape.get(`${questid}_${taskid}`).destroy();
                createdColshape.delete(`${questid}_${taskid}`);
            }
            if (createdScaleform.get(`${questid}_${taskid}`)) {
                createdScaleform.get(`${questid}_${taskid}`).destroy();
                createdScaleform.delete(`${questid}_${taskid}`);
            }
        })
    })
}, 2000)


export const quests = {
    getQuest: (id: number) => {
        return QUESTS_DATA.find(q => q.id === id);
    },
    getBot: (id: number) => {
        return QUEST_BOT_DATA.find(q => q.id === id);
    },
}