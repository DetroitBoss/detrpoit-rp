import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {chatDialogMessage} from "../../shared/chat";
import {fractionCfg} from "./fractions/main";
import { getX2Param } from "./usermodule/static";

interface chatDialogData {
    /** ID Диалога */
    readonly id: string;
    /** Последние сообщения */
    messages: chatDialogMessage[];
    /** Название диалога */
    name: string;
    /** ИД пользователей, которые его видят */
    users: number[];
    /** ИД пользователей, которые его видят */
    usersTyping: [number, string][];
    /** Данный диалог - это репорт */
    isReport?: boolean;
    /** Данный диалог - это вопрос хелперам */
    isAsk?: boolean;
    /** Данный диалог для фракции */
    fraction?: number;
    /** Данный диалог для семьи */
    family?: number;
    /** Лимит хранения сообщений, по умолчанию - 50 */
    messageLimit: number;
    /** Последнее обновление чата */
    lastUpdate: number;
    /** Диалог закрыт, если это тикет или прочее */
    closed: boolean;
    /** Время создания */
    timeCreate: number;
}
let dialogId = 1;
const chatDialogs:chatDialogData[] = [];

setTimeout(() => {
    const adminChat = dialogSystem.createDialog('Админ-чат', 'admin_chat', 60);
    const adminCheat = dialogSystem.createDialog('Чит репорт', 'admin_cheat', 90);
    fractionCfg.list.map(item => {
        dialogSystem.createDialogFraction(`Чат фракции ${item.name}`, item.id, 20);
    })
    fractionCfg.list.map(item => {
        dialogSystem.createDialogFraction(`Чат фракции ${item.name}`, item.id, 20);
    })
    dialogSystem.createDialog('Чат государственных структур', 'all_faction_chat', 30);
}, 100)

CustomEvent.registerCef('dialogchat:sendmessage', (player, id: string, text: string) => {
    dialogSystem.postMessage(player, id, text);
})
CustomEvent.registerCef('dialogchat:enterchat', (player, id: string) => {
    if (!player.dialog) player.dialog = [];
    player.dialog.push(id)
    return dialogSystem.loadMessages(id);
})
CustomEvent.registerCef('dialogchat:leavechat', (player, id: string) => {
    if (!player.dialog) player.dialog = [];
    if (!player.dialog.includes(id)) return;
    if(player.dialog.findIndex(q => q === id) > -1)player.dialog.splice(player.dialog.findIndex(q => q === id), 1);
})

export const dialogSystem = {
    
    /** Создать диалог фракции, вернёт ID созданого диалога */
    createDialogFraction: (name: string, fraction?: number, messageLimit = 50) => {
        const dialog = dialogSystem.createDialog(name, `faction_${fraction}`, messageLimit)
        dialog.fraction = fraction;
        return dialog.id
    },
    /** Создать диалог фракции, вернёт ID созданого диалога */
    createDialogFamily: (name: string, family?: number, messageLimit = 50) => {
        const dialog = dialogSystem.createDialog(name, `family_${family}`, messageLimit)
        dialog.family = family;
        return dialog.id
    },
    /** Создать диалог фракции, вернёт ID созданого диалога */
    createDialog: (name: string, identity: string, messageLimit = 50) => {
        chatDialogs.push({ id: identity, name, fraction: null, isReport: false, users: [], messages: [], usersTyping: [], messageLimit, timeCreate: system.timestamp, lastUpdate: system.timestamp, closed: false});
        // system.debug.debug(`Создан диалог`, name, identity);
        return chatDialogs.find(q => q.id === identity);
    },
    removeDialog: (id: string) => {
        if(chatDialogs.findIndex(q => q.id === id) > -1) chatDialogs.splice(chatDialogs.findIndex(q => q.id === id), 1);
    },
    getDialog: (id: string) => {
        return chatDialogs.find(q => q.id === id);
    },
    myDialogs: (player: PlayerMp) => {
        return chatDialogs.filter(q => q.users.includes(player.dbid));
    },
    get allDialogs(){
        return chatDialogs
    },
    loadMessages: (id: string) => {
        const dialog = dialogSystem.getDialog(id);
        if(!dialog) return null;
        return dialog.messages;
    },
    postMessage: (player: PlayerMp, id: string, text: string, pos?:{x: number, y: number}) => {
        if (!text) return;
        const dialog = dialogSystem.getDialog(id);
        if (!dialog) return;
        if(dialog.closed) return;
        const data: chatDialogMessage = { name: player ? player.user.name : 'Система', id: player ? player.dbid : 0, text, time: system.timestamp, pos }

        if (dialog.id.includes('faction_') && player && player.user.fractionData){
            data.name = `[${player.user.fractionData.name} (${player.user.rankName})] ${data.name}`
        }
        data.name = `${system.timeStampString(system.timestamp)} ${data.name}`

        dialog.messages.push(data);
        if (dialog.messages.length > dialog.messageLimit) dialog.messages.splice(0, 1);
        if (player && !dialog.users.find(q => q === player.dbid)) dialog.users.push(player.dbid);
        dialog.lastUpdate = system.timestamp;
        mp.players.toArray().filter(q => mp.players.exists(q) && q.user && q.dialog && q.dialog.includes(id)).map(target => {
            CustomEvent.triggerCef(target, 'dialogchat:newmessage', id, data);
        })
        if (dialog.id.includes('all_faction_chat') && player) {
            mp.players.toArray().filter(q => mp.players.exists(q) && q.user && q.user.is_gos && q.user.rank >= 7 && (!q.dialog || !q.dialog.includes(id))).map(target => {
                target.notify('Новое сообщение в чате государственных структур', 'success');
                target.outputChatBox(`Новое сообщение в чате государственных структур от ${player.user.name} ${player.user.id}: ${system.filterInput(text)}`)
            })
        } else if (dialog.id.includes('faction_') && player){
            mp.players.toArray().filter(q => mp.players.exists(q) && q.user && q.user.fraction === dialog.fraction && (!q.dialog || !q.dialog.includes(id))).map(target => {
                target.notify('Новое сообщение в чате фракции', 'success');
                target.outputChatBox(`Новое сообщение в чате фракции от ${player.user.name} ${player.user.id}: ${system.filterInput(text)}`)
            })
        } else if (dialog.id.includes('family_') && player){
            mp.players.toArray().filter(q => mp.players.exists(q) && q.user && q.user.family && q.user.family.id === dialog.family && (!q.dialog || !q.dialog.includes(id))).map(target => {
                target.notify('Новое сообщение в чате семьи', 'success');
            })
        } else if (dialog.id === "admin_chat" && player){
            mp.players.toArray().filter(q => mp.players.exists(q) && q.user && q.user.admin_level && (!q.dialog || !q.dialog.includes(id))).map(target => {
                if(player) target.outputChatBox(`!{08540a}Новое сообщение в ${dialog.name} от ${player.user.name}: ${system.filterInput(text)}`)
                target.notify(`Новое сообщение в [${dialog.name}]`, 'success');
            })
        }
        //  else if (dialog.id === "admin_cheat"){
        //     mp.players.toArray().filter(q => mp.players.exists(q) && q.user && getX2Param('testserver') ? q.user.isAdminNow() : q.user.admin_level) && q.anticheatNotify !== false).map(target => {
        //         target.outputChatBox(`!{ffffff}Чит репорт: ${text}`);
        //     })
        // }
    },
}