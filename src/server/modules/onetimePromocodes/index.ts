import {CustomEvent} from "../custom.event";
import {openPromocodesAdminMenu} from "./adminMenu";
import {Promocode1xUse, Promocodes1x} from "../typeorm/entities/promocodes1x";
import {system} from "../system";
import {promocodeBonuses} from "./bonuses";
import {User} from "../user";
import {gui} from "../gui";

export interface BonusData {
    type: string,
    data: any
}

gui.chat.registerCommand('promocode', (player, promocode: string) => {
    promocodes1x.activate(player, promocode);
});

CustomEvent.registerClient('admin:onetimePromo', (player) => {
    if (!player.user.hasPermission('admin:1xPromocodes:manage')) {
        return;
    }

    openPromocodesAdminMenu(player);
});

const promocodeActivations: Map<number, Promocode1xUse[]> = new Map<number, Promocode1xUse[]>();

mp.events.add('_userLoggedIn', async (user: User) => {
    const userActivations = await Promocode1xUse.find({
        where: {
            userId: user.account.id
        }
    });

    promocodeActivations.set(user.account.id, userActivations);
});

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player || !player.user) {
        return;
    }

    promocodeActivations.delete(player.user.account.id);
});

const promocodesPool: Promocodes1x[] = [];

/** Одноразовые промокоды */
export const promocodes1x = {
    load: async () => {
        const promocodes = await Promocodes1x.find();
        promocodesPool.push(...promocodes);
    },

    create: async (name: string, expirationTimeHours: number, bonuses: BonusData[]) => {
        name = name.toLowerCase();

        if (promocodesPool.some(promocode => promocode.name === name && promocode.expiredAt > system.timestamp)) {
            return 'Промокод с таким названием уже существует';
        }

        const promocode = Promocodes1x.create({
            name: name,
            expiredAt: system.timestamp + expirationTimeHours * 60 * 60,
            bonuses: JSON.stringify(bonuses)
        });

        await promocode.save();
        promocodesPool.push(promocode);
    },

    delete: (promocodeId: number) => {
        const promocodeIdx = promocodesPool.findIndex(promocode => promocode.id === promocodeId);
        if (promocodeIdx === -1) {
            return;
        }

        const promocode = promocodesPool[promocodeIdx];
        Promocodes1x.delete(promocode.id);

        promocodesPool.splice(promocodeIdx, 1);
    },

    isActive: (promocodeName: string): boolean => {
        return promocodesPool.some(promocode => promocode.name === promocodeName && promocode.expiredAt > system.timestamp);
    },

    activate: (player: PlayerMp, promocodeName: string) => {
        promocodeName = promocodeName.toLowerCase();

        if (!promocodes1x.isActive(promocodeName)) {
            return player.notify('Промокод недействителен', 'error');
        }

        if (!promocodeActivations.has(player.user.account.id)) {
            return player.notify('Попробуйте позже', 'error');
        }

        const promocode = promocodesPool.find(promocode => promocode.name === promocodeName && promocode.expiredAt > system.timestamp);

        const activatedPromocodes = promocodeActivations.get(player.user.account.id);
        if (activatedPromocodes.some(promocodeActivation => promocodeActivation.promocodeId === promocode.id)) {
            return player.notify('Вы уже использовали этот промокод', 'error');
        }

        const bonusesData: BonusData[] = JSON.parse(promocode.bonuses);

        bonusesData.forEach(bonusData => {
            const bonus = promocodeBonuses.types.find(bonus => bonus.type === bonusData.type).bonus;
            if (!bonus) {
                return system.debug.error(`Attempt to activate not existing promocode bonus (${promocodeName}, ${bonusData.type})`);
            }

            bonus.activate(player, promocodeName, bonusData.data);
        });

        const promocodeActivation = Promocode1xUse.create({
            userId: player.user.account.id,
            promocodeId: promocode.id
        });

        activatedPromocodes.push(promocodeActivation);
        promocodeActivation.save();

        player.notify(`Вы активировали промокод ${promocodeName.toUpperCase()}`);
    },

    getAll: () => {
        return [...promocodesPool]
    }
}
