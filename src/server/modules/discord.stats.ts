import Discord from 'discord.js';
import { getX2Param } from './usermodule/static';

const client = new Discord.Client();

function getCorrectOnline() {
    return { online: mp.players.toArray().length, maxplayers: mp.config.maxplayers };
}

const needOnline = 10;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    try {
        // Получаем гильдию (сервер)
        const guild = await client.guilds.fetch('829503748732616795');

        // Проверяем существование канала для обновления названия онлайн
        const onlineChannel = guild.channels.resolve('1289581105204297748');
        if (!onlineChannel) {
            console.log('Online channel not found!');
            return;
        }
        console.log('Online channel found:', onlineChannel.name);

        // Проверяем существование канала для уведомлений администраторов
        const adminNotifyChannel = guild.channels.resolve('1289543207541149809'); // Замените на реальный ID канала
        if (!adminNotifyChannel) {
            console.log('Admin notification channel not found!');
            return;
        }
        console.log('Admin notification channel found:', adminNotifyChannel.name);

        let lastOnline = 0;

        const setName = async () => {
            const data = getCorrectOnline();

            // Обновляем название канала, если изменилось количество игроков
            if (data.online !== lastOnline) {
                lastOnline = data.online;
                try {
                    await onlineChannel.setName(`📜 Online: ${data.online}`);
                    console.log(`Channel name updated: ${data.online}`);
                } catch (error) {
                    console.error('Failed to update channel name:', error);
                }
            }

            // Проверяем онлайн игроков и наличие администраторов
            const players = data.online;
            if (players >= needOnline) {
                const admins = mp.players.toArray().filter(q => q.user && !q.user.afk && q.user.admin_level > 0 && q.user.admin_level < 6).length;
                if (admins === 0) {
                    try {
                        // Отправляем сообщение в указанный канал для администраторов
                        await adminNotifyChannel.send(`@here Внимание! На сервере ${players} игроков, администраторов при этом нет на сервере. Просим зайти.`);
                        console.log('Admin notification sent');
                    } catch (error) {
                        console.error('Failed to send admin notification:', error);
                    }
                }
            }
        };

        // Первый запуск
        setName();

        // Повторяем с интервалом в 30 секунд
        setInterval(setName, 30 * 1000);

    } catch (error) {
        console.error('Error fetching guild or updating channels:', error);
    }
});

// Логинимся ботом с токеном
client.login('MTIzMTY3NTcwNzczODgxNjY2Mg.GKFEFO.V8s3sT3ka7FBviLzZUGsR9nZaRuj2UayQfp4hA');
