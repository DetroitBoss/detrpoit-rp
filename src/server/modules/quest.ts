import { npcDialog } from "./npc";
import { QUESTS_DATA, QUEST_BOT_DATA } from "../../shared/quests"
import { NpcSpawn } from "./npc";
import { system } from "./system"
import { CustomEvent } from "./custom.event";

//* Проверка дубликатов в конфиге квестов
setTimeout(() => {
    let ids: number[] = []
    QUESTS_DATA.map(q => {
        if(ids.includes(q.id)) system.debug.error(`Quest item with id ${q.id} duplicate`);
        else ids.push(q.id);
    })
    let idss: number[] = []
    QUEST_BOT_DATA.map(q => {
        if (idss.includes(q.id)) system.debug.error(`Quest npc with id ${q.id} duplicate`);
        else idss.push(q.id);
    })

    QUEST_BOT_DATA.map(q => {
        new NpcSpawn(new mp.Vector3(q.x, q.y, q.z), q.h, q.model, q.name, player => {
            const user = player.user;
            if(!user) return;
            user.questTick(true);
            const myQuestOnBot = quests.getQuestByNpc(player, q.id);
            if(!myQuestOnBot){
                if(q.freeError) player.notify(q.freeError, "error");
                return;
            }
            const cfg = quests.getQuest(myQuestOnBot[0]);
            if(!cfg) return;
            if (user.getQuestReadyToComplete(myQuestOnBot[0])){
                user.setQuestComplete(myQuestOnBot[0]);
                if (!cfg.botData) return;
                if (cfg.nextQuest)
                    npcDialog.openFullDialog(player, cfg.botData.dialogComplete, q.name, q.role);
                else user.setGui('finishinitquests');
            } else {
                if (!cfg.botData) return;
                npcDialog.openFullDialog(player, cfg.botData.dialogStart, q.name, q.role);
            }
        });
    });
    
}, 1000);

export const quests = {
    getQuestByNpc: (player: PlayerMp, id: number) => {
        return player.user.quests.find(quest => {
            if (quest[2]) return false;
            const cfg = quests.getQuest(quest[0]);
            if(!cfg.botData) return false;
            return cfg.botData.id === id;
        });
    },
    getQuest: (id: number) => {
        return QUESTS_DATA.find(q => q.id === id);
    },
    getBot: (id: number) => {
        return QUEST_BOT_DATA.find(q => q.id === id);
    },
    giveQuest: (player: PlayerMp, id: number) => {
        const user = player.user;
        if(!user) return;
        user.giveQuest(id);
    },
    setQuestComplete: (player: PlayerMp, id: number) => {
        const user = player.user;
        if (!user) return;
        user.setQuestComplete(id);
    }
}

CustomEvent.registerClient('quest:gotopos', (player, questid, taskid) => {
    const user = player.user;
    if(!user) return;
    const cfg = quests.getQuest(questid);
    if(!cfg) return;
    const task = cfg.tasks[taskid];
    if(!task) return;
    if(task.type === "delivertonpc" || task.type === "gotopos"){
        user.setQuestTaskComplete(questid, taskid);
    }
})