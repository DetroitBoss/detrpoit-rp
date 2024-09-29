import {UserAddonClass} from "./master";
import {User} from "../user";
import {QUESTS_DATA, TaskJobFarm} from "../../../shared/quests";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import { quests } from "../quest";
import {npcDialog} from "../npc";
export class UserQuest extends UserAddonClass {


    get quests() {
        if (this.entity.quests.find(q => !QUESTS_DATA.find(z => q[0] === z.id))) {
            let z = [...this.entity.quests];
            z.map((q, i) => {
                if (!QUESTS_DATA.find(z => q[0] === z.id)) z.splice(i, 1);
            })
            this.entity.quests = z;
        }
        return this.entity.quests.filter(q => QUESTS_DATA.find(z => q[0] === z.id))
    }

    set quests(val) {
        this.entity.quests = val;
        this.sendClientQuestsData();
    }

    haveQuest = (id: number) => {
        return this.quests.find(q => q[0] === id);
    }

    giveQuest = (id: number) => {
        if (this.haveQuest(id)) return;
        let q = [...this.quests];
        const cfg = quests.getQuest(id);
        if (!cfg) return;
        let t: [boolean, number][] = [];
        for (let s = 0; s < cfg.tasks.length; s++) t.push([false, 0]);
        q.push([id, t, false]);
        this.quests = q;
    }

    getQuestTaskComplete = (id: number, task: number) => {
        if (!this.haveQuest(id)) return;
        const cfg = quests.getQuest(id);
        if (!cfg) return;
        let q = [...this.quests];
        let s = q.find(q => q && q[0] === id);
        if (!s) return false;
        if (!s[1]) return false;
        if (!s[1]) return false;
        if (!s[1][task]) return false;
        return s[1][task][0];
    }

    getQuestReadyToComplete = (id: number) => {
        const quest = this.haveQuest(id);
        if (!quest) return false;
        return !quest[1].find(q => !q[0])
    }

    setQuestTaskComplete = (id: number, task: number) => {
        if (!this.haveQuest(id)) return;
        const cfg = quests.getQuest(id);
        if (!cfg) return;
        let q = [...this.quests];
        let s = q.find(q => q[0] === id);
        if (!s) return;
        if (s[1][task][0]) return;
        if (task && cfg.taskStepByStep && !s[1][task - 1][0]) return;
        s[1][task][0] = true;
        if (cfg.onTaskComplete) {
            let z = cfg.onTaskComplete(task);
            if (z) this.notify(z);
        }
        this.quests = q;
        if (!s[1].find(h => !h) && !cfg.botData) this.setQuestComplete(id);
    }

    addQuestTaskVal = (id: number, task: number, val: number) => {
        if (!this.haveQuest(id)) return;
        const cfg = quests.getQuest(id);
        if (!cfg) return;
        let q = [...this.quests];
        let s = q.find(q => q[0] === id);
        if (!s) return;
        if (s[1][task][0]) return;
        if (task && cfg.taskStepByStep && !s[1][task - 1][0]) return;
        s[1][task][1] += val;
        this.quests = q;
        if (cfg.tasks[task].type === "jobFarm") {
            if ((cfg.tasks[task] as TaskJobFarm).amount <= s[1][task][1]) this.setQuestTaskComplete(id, task);
        }
    }

    sendClientQuestsData = () => {
        if (!this.exists) return;
        let ids: number[] = [];
        let questes = [...this.quests]
        questes.map((quest, index) => {
            if (!quest[2]) {
                const cfg = quests.getQuest(quest[0]);
                if (!cfg || cfg.tasks.length !== quest[1].length) {
                    ids.push(cfg.id);
                    questes.splice(index, 1);
                    system.debug.debug(`${this.name} #${this.id} имел битый квест ${quest[0]} ${JSON.stringify(quest)}`)
                }
            }
        })
        ids.map(id => {
            this.giveQuest(id);
        })
        this.entity.quests = questes;
        CustomEvent.triggerClient(this.player, 'quests:data', this.quests);
    }

    questTick = (speakNpc = false) => {
        this.quests.map(quest => {
            if (quest[2]) return;
            const qcfg = quests.getQuest(quest[0]);
            if (!qcfg) return;
            qcfg.tasks.map((task, taskindex) => {
                if (this.getQuestTaskComplete(quest[0], taskindex)) return;
                if (qcfg.taskStepByStep) {
                    if (taskindex && !quest[1][taskindex - 1][0]) return;
                }
                if (task.type == "itemHave") {
                    if (task.item_id == 851) {
                        if (task.item_id && !this.haveItem(task.item_id)) {
                            if (!this.getArrayItem(850).filter(q => q.advancedString).length) return;
                        }
                    } else if (task.item_id == 801) {
                        if (!this.bank_have || !this.haveItem(task.item_id)) return;
                    } else {
                        if (task.item_id && !this.haveItem(task.item_id)) return;
                    }
                    this.setQuestTaskComplete(quest[0], taskindex);
                } else if (task.type === "licenseHave") {
                    if (task.ignoreExpired) {
                        if (!!this.getLicense(task.license)) this.setQuestTaskComplete(quest[0], taskindex);
                    } else {
                        if (!!this.haveActiveLicense(task.license)) this.setQuestTaskComplete(quest[0], taskindex);
                    }
                } else if (task.type === "questBotSpeak" && speakNpc) {
                    this.setQuestTaskComplete(quest[0], taskindex);
                }
            })
        })
    }

    setQuestComplete = (id: number) => {
        if (!this.haveQuest(id)) return;
        const cfg = quests.getQuest(id);
        if (!cfg) return;
        let q = [...this.quests];
        let s = q.find(q => q[0] === id);
        if (!s) return;
        if (s[2]) return;
        s[2] = true;
        this.quests = q;
        if (!cfg.botData) this.player.notify(`Квест ${cfg.name} выполнен`, 'success');
        cfg.reward.map(reward => {
            if (reward.type === "exp") this.giveExp(reward.value);
            else if (reward.type === "cash") this.addMoney(reward.value, true, `Награда за выполнение квеста ${cfg.name} #${cfg.id}`);
            else if (reward.type === "bank") this.addBankMoney(reward.value, true, `Награда за выполнение квеста ${cfg.name} #${cfg.id}`, cfg.botData ? quests.getBot(cfg.botData.id).name : `Квест ${cfg.name}`);
            else if (reward.type === "item") this.giveItem(reward.value, true);
            else if (reward.type === "license") this.giveLicense(reward.licenseType, reward.value);
        })

        if (cfg.nextQuest) {
            this.giveQuest(cfg.nextQuest);
        }

        if (this.quests.every(quest => quest[2])) {
            this.user.setGui('finishinitquests');
        }
    }

    constructor(user: User) {
        super(user);
    }
}

