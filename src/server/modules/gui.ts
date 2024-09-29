import {CustomEvent} from "./custom.event";
import {system} from "./system";

CustomEvent.registerClient('chatMessage', (player, message: string) => {
    gui.chat.send(player, message);
})
CustomEvent.registerClient('chatCommand', (player, command: string, ...args: string[]) => {
    gui.chat.chatCommandsHandles.filter(item => item[0] == command.toLowerCase()).map(item => {
        item[2](player, ...args);
    })
})

let ids = 0;

interface registerCommandReturn {
    destroy: () => void;
    updateHandle: (handle: (player: PlayerMp, ...args: string[]) => void) => void;
}

function registerCommand(command: string, handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn;
function registerCommand(commands: string[], handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn;
function registerCommand(commands: string | string[], handle: (player: PlayerMp, ...args: string[]) => void): registerCommandReturn{
    ids++;
    const id = parseInt(`${ids}`)
    if (typeof commands === "string") commands = [commands]
    commands.map(command => {
        gui.chat.chatCommandsHandles.push([command.toLowerCase(), id, (player, ...args) => {
            if (!player.user) return;
            handle(player, ...args);
        }]);
    })
    return {
        destroy: () => {
            gui.chat.chatCommandsHandles.map((item, index) => {
                if (item[1] === id) gui.chat.chatCommandsHandles.splice(index, 1);
            })
        },
        updateHandle: (newhandle: (player: PlayerMp, ...args: string[]) => void) => {
            gui.chat.chatCommandsHandles.map((item, index) => {
                if (item[1] === id) item[2] = newhandle
            })
        }
    }
};

export const gui = {
    chat: {
        chatRange: 15,
        whisperChatRange: 3,
        getTime: function () {
            let dateTime = new Date();
            return `${system.digitFormat(dateTime.getHours())}:${system.digitFormat(dateTime.getMinutes())}:${system.digitFormat(dateTime.getSeconds())}`;
        },
        text: (args: string[]) => args.join(' '),
        chatCommandsHandles: <[string, number, (player: PlayerMp, ...args: string[]) => void][]>[
            ["me", 0, (player, ...args) => {gui.chat.sendMeCommand(player, args.join(' '))}],
            ["do", 0, (player, ...args) => {gui.chat.sendDoCommand(player, args.join(' '))}],
            ["b", 0, (player, ...args) => {gui.chat.sendBCommand(player, args.join(' '))}],
            ["try", 0, (player, ...args) => {gui.chat.sendTryCommand(player, args.join(' '))}],
            ["qweqweqwe", 0, (player, ...args) => {
                CustomEvent.triggerClientSocket(player, 'test', args.join(' '))
            }],
        ],
        registerCommand,
        sendBCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)}: !{FFFFFF}(( ${escape(text)} )) `)
            })
        },
        sendTryCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            let lucky = system.getRandomInt(1, 10) <= 5 ? '!{FF0000}Не удачно' : '!{00FF00}Удачно'
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] ${lucky} !{C2A2DA} ${nplayer.user.getChatNameString(player)}  ${escape(text)}`)
            })
        },
        sendDoCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            mp.players.forEachFast((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension) nplayer.outputChatBox(`[${gui.chat.getTime()}] !{00BFFF} (( ${escape(text)} )) ${nplayer.user.getChatNameString(player)} `)
            })
        },
        sendMeCommand: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${nplayer.user.getChatNameString(player)} ${escape(text)}`)
            })
        },
        sendMeCommandToPlayer: function (player: PlayerMp, target: PlayerMp, text: string) {
            if (!player.user || !target.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            target.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${target.user.getChatNameString(player)} ${escape(text)}`)
        },
        sendDiceCommand: function (player: PlayerMp) {
            if (!player.user) return;
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            let dice = system.getRandomInt(1, 6);
            mp.players.forEach((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] !{C2A2DA}${nplayer.user.getChatNameString(player)} бросил кости !{FF9800}(( Выпало ${dice} ))`)
            })
        },
        send: function (player: PlayerMp, text: string) {
            if (!player.user) return;
            if (player.user.dead) return player.outputChatBox(`[${gui.chat.getTime()}] Вы не в состоянии говорить`);
            if (player.user.chatMuted) return player.outputChatBox(`[${gui.chat.getTime()}] У вас блокировка текстового чата до ${system.timeStampString(player.user.chatMuted)}`);
            mp.players.forEachFast((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] !{2196F3}${nplayer.user.getChatNameString(player)} говорит:!{FFFFFF} ${escape(text)}`)
            })
        },
        sendInRange: function (player: PlayerMp, text: string) {
            if(!mp.players.exists(player)) return;
            mp.players.forEachFast((nplayer) => {
                if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension)
                    nplayer.outputChatBox(`[${gui.chat.getTime()}] ${escape(text)}`)
            })
        },
    }
}