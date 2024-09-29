import {CustomEvent} from "../custom.event";
import {gui} from "../gui";
import {guiNames} from "../../../shared/gui";

CustomEvent.registerServer('sessions:open', (sessionsJson: string, configJson: string) => {
    const sessions = JSON.parse(sessionsJson);
    const config = JSON.parse(configJson);

    gui.setGuiWithEvent('jobSessions', 'sessions::show', sessions, config);
});

mp.events.add('gui:menuClosed', (menu: guiNames) => {
    if (menu === 'jobSessions') {
        CustomEvent.triggerServer('sessions:closeMenu');
    }
});
