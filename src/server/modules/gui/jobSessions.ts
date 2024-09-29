import {CustomEvent} from "../custom.event";
import {SessionInfo, SessionJobMenuConfig, SessionPlayer} from "../../../shared/gui/SessionJob";
import {system} from "../system";
import {User} from "../user";

interface SessionType {
    Key: string,
    StartHandler: (players: PlayerMp[]) => void,
    MenuConfig: SessionJobMenuConfig,
    MaxPlayers: number,
    MinPlayers: number
}

class Session implements SessionInfo {
    private static generatingId: number = 1;

    public readonly Id: number;
    public readonly IsProtected: boolean;
    public readonly Name: string;
    public readonly Type: SessionType;

    private readonly password: string;
    private readonly players: SessionPlayer[];

    constructor(owner: PlayerMp, isProtected: boolean, type: SessionType) {
        this.Id = Session.generatingId++;
        this.IsProtected = isProtected;
        this.Name = owner.user.name;
        this.Type = type;

        if (isProtected) {
            this.password = system.randomStr(4).toUpperCase();
        }

        this.players = [{
            Id: owner.dbid,
            Name: owner.user.name,
            IsReady: false,
            IsOwner: true
        }];

        this.callMenuUpdate();
        openedSessions.push(this);
    }

    public isPlayerInSession(player: PlayerMp) {
        return this.players.some(p => p.Id === player.dbid);
    }

    public joinPlayerToSession(player: PlayerMp, password: string) {
        if (this.players.some(p => p.Id === player.dbid)) {
            return;
        }

        if (this.players.length == this.Type.MaxPlayers) {
            player.notify('Нет мест в сессии', 'error');
            return;
        }

        if (this.IsProtected && password.toUpperCase() !== this.password) {
            player.notify('Неправильный пароль', 'error');
            return;
        }

        this.players.push({
            Id: player.dbid,
            Name: player.user.name,
            IsReady: false,
            IsOwner: true
        });

        this.callMenuUpdate();
    }

    public leavePlayerFromSession(player: PlayerMp) {
        const playerIdx = this.players.findIndex(p => p.Id === player.dbid);
        if (playerIdx === -1) {
            return;
        }

        const sessionPlayer = this.players[playerIdx];
        if (sessionPlayer.IsOwner) {
            this.disband();
            return;
        }

        this.players.splice(playerIdx, 1);
        this.callMenuUpdate();
    }

    public setPlayerReady(player: PlayerMp, isReady: boolean) {
        const sessionPlayer = this.players.find(p => p.Id === player.dbid);
        if (!sessionPlayer) {
            return;
        }

        sessionPlayer.IsReady = isReady;

        this.callMenuUpdate();

        if (this.players.length >= this.Type.MinPlayers
            && this.players.every(p => p.IsReady)) {
            this.disband();
            this.Type.StartHandler(this.players.map(p => User.get(p.Id)));
        }
    }

    private disband() {
        this.players.forEach(p => {
            const player = User.get(p.Id);
            if (player) {
                player.user.setGui(null);
            }
        });

        const idx = openedSessions.findIndex(s => s === this);
        if (idx !== -1) {
            openedSessions.splice(idx, 1);
        }
    }

    private callMenuUpdate() {
        this.players.forEach(p => {
            const player = User.get(p.Id);
            if (player) {
                CustomEvent.triggerCef(player, 'sessions::showmy', this.players, this.password)
            }
        });
    }
}


CustomEvent.registerCef('sessions::create', (player, withPassword: boolean) => {
    const session = getPlayerSession(player);
    if (session) {
        player.notify('Вы не можете сейчас создать сессию', 'error');
        return;
    }

    new Session(player, withPassword, openedMenuTypesByPlayerId.get(player.id));
});

CustomEvent.registerCef('sessions::setReady', (player, isReady: boolean) => {
    const session = getPlayerSession(player);
    if (session) {
        session.setPlayerReady(player, isReady);
    }
});

CustomEvent.registerCef('sessions::join', (player, sessionId: number, password: string) => {
    const session = openedSessions.find(s => s.Id === sessionId);
    if (!session) {
        return;
    }

    session.joinPlayerToSession(player, password);
});

CustomEvent.registerClient('sessions:closeMenu', removePlayerFromSession);
mp.events.add('playerQuit', removePlayerFromSession);

function removePlayerFromSession(player: PlayerMp) {
    const session = getPlayerSession(player);
    if (session) {
        session.leavePlayerFromSession(player);
    }
}

function getPlayerSession(player: PlayerMp) {
    return openedSessions.find(s => s.isPlayerInSession(player));
}

const openedSessions: Session[] = [];
const openedMenuTypesByPlayerId = new Map<number, SessionType>();

export function openJobSessionMenu(player: PlayerMp, type: SessionType) {
    const sessions: SessionInfo[] = openedSessions
        .filter(s => s.Type.Key === type.Key)
        .map(s => { return { ...s } });


    CustomEvent.triggerClient(player, 'sessions:open',
        JSON.stringify(sessions), JSON.stringify(type.MenuConfig));
    openedMenuTypesByPlayerId.set(player.id, type);
}
