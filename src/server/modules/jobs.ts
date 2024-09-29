import {getJobData, getLevelByExp, jobData, JobId, jobsList} from "../../shared/jobs";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {quests} from "./quest";
import {QUESTS_DATA} from "../../shared/quests";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {AchievementItemJob, getAchievConfigByType} from "../../shared/achievements";
import {JOB_MONEY_PER_HOUR_MULTIPLE, PAYDAY_MONEY_PER_HOUR_MULTIPLE} from "../../shared/economy";
import {getX2Param} from "./usermodule/static";
import {getVipConfig} from "../../shared/vip";
import {JOB_TASK_MANAGER_EVENT} from "./battlePass/tasks/jobTaskManager";


CustomEvent.registerClient('job:success', (player, key: string) => {
    const user = player.user;
    if (!user) return;
    if (!key) return;
    if (!user.job) return;
    if (typeof user.jobtask !== "number") return;
    if (user.jobkey !== key) return;
    const job = getJobData(user.job);
    if(!job) return;
    const task = job.tasks[user.jobtask];
    if(!task) return;
    const level = getLevelByExp(user.getJobExp(user.job));
    if(task.level && level < task.level){
        system.debug.error(`${user.id} ${user.name} try run task without level`);
        player.notify("Вы не можете выполнять задания такого уровня", "error");
        return;
    }
    const mon = task.money;
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if(task.type === "jobFarm" && (!task.job || task.job === job.id)){
                user.addQuestTaskVal(quest[0], taskindex, mon)
            }
        })
    })
    let sum = getX2Param('job') ? task.money * 2 : task.money
    const tm = user.getDaylyOnline
    if(tm && JOB_MONEY_PER_HOUR_MULTIPLE[tm]) sum = sum * JOB_MONEY_PER_HOUR_MULTIPLE[tm]

    const vipPaymentMultiplier = getVipConfig(user.vip)?.jobPaymentMultiplier ?? 1;
    sum *= vipPaymentMultiplier;

    user.addMoney(sum, true, 'Выполнение задания ' + task.name + ' работы ' + job.name);
    if (job.id === 'builder') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'builder');
    if (job.id === 'cleaning') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'cleaning');
    if (job.id === 'garden') mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'garden');

    let exp = task.exp || 1;
    if (getX2Param('job')) exp *= 2;
    user.achiev.achievTickJob('jobexp', job.id, exp)
    user.achiev.achievTickJob('jobmoney', job.id, sum)
    user.addJobExp(job.id, exp)
})

CustomEvent.registerCef('job:task:stop', (player) => {
    const user = player.user;
    if(!user) return;
    user.jobkey = null;
    user.jobtask = null;
    user.setJobDress(null);
    CustomEvent.triggerClient(player, 'job:stop')
})

CustomEvent.registerCef('job:task', (player, jobid: JobId, taskid: number) => {
    const user = player.user;
    if(!user) return;
    const item = getJobData(jobid);
    if(!item) return;
    const task = item.tasks[taskid];
    if(!task) return;
    const level = getLevelByExp(user.getJobExp(item.id))
    const dress = user.male ? item.dressMale : item.dressFemale
    if(dress) user.setJobDress(dress);
    if (task.level && level < task.level) return player.notify(`Внимание!!! Для данного задания требуется уровень ${task.level}. Наберитесь опыта на заданиях попроще`, "error", 'CHAR_MP_BIKER_BOSS');
    player.notify(`Вы успешно взяли задание, в вашем навигаторе отмечена точка назначения`, "success", 'CHAR_MP_BIKER_BOSS');
    user.jobkey = system.randomStr(5)
    user.jobtask = taskid
    CustomEvent.triggerClient(player, 'job:start', item.id, taskid, user.jobkey)
})

CustomEvent.registerCef('job:join', (player, job: JobId) => {
    if(!player.user.mp_character) return player.notify('Вы не можете работать пока используется не стандартный скин', 'error')

    if (player.user.jobtask != null) {
        player.notify('Вы не можете устроиться на работу, пока не закончили текущее задание');
        return;
    }

    player.user.job = job;
    player.notify(`Вы успешно устроились на работу. В зависимости от вашего опыта вы можете выполнять различные задания`, 'error', 'CHAR_MP_BIKER_BOSS', 15000);
})

CustomEvent.registerCef('job:leave', (player, job: JobId) => {
    const user = player.user;
    if(!user) return;
    user.job = null;
    user.jobkey = null;
    user.jobtask = null;
    user.setJobDress(null);
    player.notify(`Вы успешно уволились`, 'error', 'CHAR_MP_BIKER_BOSS');
    CustomEvent.triggerClient(player, 'job:stop')
})



jobsList.map(item => {
    const pos = new mp.Vector3(item.pos.x, item.pos.y, item.pos.z)
    colshapes.new(pos, item.name, player => {
        reloadJobCef(player, item);
    }, {
        radius: MARKERS_SETTINGS.JOBS.r,
        color: MARKERS_SETTINGS.JOBS.color
    })
})


const reloadJobCef = (player: PlayerMp, item: jobData) => {
    const user = player.user;
    if(!user) return;
    if (item.quest && user.job !== item.id){
        const qwcfg = QUESTS_DATA.find(q => q.id)
        const qw = user.quests.find(q => q[0] === item.quest.id);
        if (!qw) return player.notify(`У вас отсутствует квест ${qwcfg.name}`, "error", 'CHAR_MP_BIKER_BOSS');
        if(item.quest.completed != 2){
            if (item.quest.completed === 0 && qw[2]) return player.notify(`Для данной работы квест ${qwcfg.name} должен быть не завершённым`, "error", 'CHAR_MP_BIKER_BOSS');
            if (item.quest.completed === 1 && !qw[2]) return player.notify(`Для данной работы квест ${qwcfg.name} должен быть завершённым`, "error", 'CHAR_MP_BIKER_BOSS');
        }
    }
    CustomEvent.triggerClient(player, 'job:data', item.id, user.job, user.job === item.id ? user.jobtask : null, user.getJobExp(item.id), false, false)
}
