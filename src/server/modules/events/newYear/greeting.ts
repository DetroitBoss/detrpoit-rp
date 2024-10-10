import {User} from "../../user";
import {GREETING_COLOR} from "../../../../shared/events/newYear/main.config";

export function greeting() {
    mp.events.add('_userLoggedIn', (user: User) => {
        const player = user.player,
            date = new Date();

        if (date.getMonth() === 11) {
            if (date.getDate() === 31) {
                player.outputChatBox(`!{${GREETING_COLOR}} Поздравляем Вас с Новым ${date.getFullYear() + 1} Годом! С любовью, команда Detroit RolePlay.`,"SERVER");
            }else{
                player.outputChatBox(`!{${GREETING_COLOR}} Поздравляем Вас с наступающим Новым ${date.getFullYear() + 1} Годом! С любовью, команда Detroit RolePlay.`,"SERVER");
            }
        }

        if (date.getMonth() === 0) {
            player.outputChatBox(`!{${GREETING_COLOR}} Поздравляем Вас с наступившим Новым ${date.getFullYear()} Годом! С любовью, команда Detroit RolePlay.`,"SERVER");
        }
    });
}