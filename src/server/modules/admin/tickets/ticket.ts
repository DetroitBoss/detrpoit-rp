import { TicketDescription, TicketFullData } from '../../../../shared/ticket'
import { AdminDialogEntity } from '../../typeorm/entities/adminLogs'
import { dbLogsConnection } from '../../typeorm/logs'
import { CustomEvent } from '../../custom.event'
import { User } from '../../user'
import { Family } from '../../families/family'
import { system } from '../../system'
import { cmute, vmute } from '../../admin'
import {fractionCfg} from "../../fractions/main";
import {IPrisonData} from "../../../../shared/prison/IPrisonData";

export class Ticket {
    private readonly _data: TicketFullData
    public get description(): TicketDescription {
        return this._data.description
    }

    constructor(data: TicketFullData) {
        this._data = data
    }

    public takeByAdmin(admin: PlayerMp): void {
        this._data.description.adminName = admin.user.name

        this.triggerUpdate()
    }
    
    public resetAdmin(): void {
        this._data.description.adminName = null

        this.triggerUpdate()
    }

    public async close(): Promise<void> {
        this.triggerClose()

        const log = new AdminDialogEntity()
        log.name = `Тикет ${this.description.creatorName}. Админ ${this.description.adminName ?? '-'}`
        log.time = this.description.createTime
        log.byAdmin = true
        log.messages = JSON.stringify([this._data.description.message, ...this._data.answers])
        log.creator = this.description.creatorId

        await dbLogsConnection.getRepository(AdminDialogEntity).insert(log)
    }

    private triggerClose(): void {
        mp.players.toArray().filter(q => q.user && q.ticketPage && q.user.isAdminNow()).map(target => {
            CustomEvent.triggerCef(target, 'ticket:close', this.description.id)
        })
    }

    private triggerUpdate(): void {
        mp.players.toArray().filter(q => q.user && q.ticketPage && q.user.isAdminNow()).map(target => {
            CustomEvent.triggerCef(target, 'ticket:updateDescr', this.description)
        })
    }

    public addAnswer(message: string): void {
        this._data.answers.push(message)

        const player = User.get(this.description.creatorId)

        if (player?.user) {
            player.outputChatBox(`!{3CB371}${this._data.description.adminName}: ${message}`)

            player.notify(`Администратор ответил на Ваш репорт, посмотрите ответ в чате.`, 'info')
            CustomEvent.triggerCef(player, 'playSound', 'admans')
        }
    }

    public getFulldata(): TicketFullData {
        let userInfo: [string, any][] = [];
        const target = User.get(this.description.creatorId);

        if (target?.user) {
            const data = target.user.entity
            const prison: IPrisonData = data.prison ? JSON.parse(data.prison) : null;

            userInfo.push(['Имя', data.rp_name]);
            userInfo.push(['Уровень', data.level]);
            userInfo.push(['Фракция', `${data.fraction ? `${fractionCfg.getFractionName(data.fraction)} (${data.rank} ранг)` : 'НЕТ'}`]);
            userInfo.push(['Семья', `${data.family ? `${Family.getByID(data.family)?.name} (ID: ${data.family})` : 'НЕТ'}`]);
            userInfo.push(['Наличные', `$${system.numberFormat(data.money)}`]);
            userInfo.push(['Банк', `$${system.numberFormat(data.bank_money)}`]);
            userInfo.push(['Фишки', `${system.numberFormat(data.chips)}`]);
            userInfo.push(['Тюрьма', `${prison ? `${Math.floor(prison.time / 60)} мин.${prison.byAdmin ? ' [A]' : ''}` : 'НЕТ'}`]);
            userInfo.push(['Бан', `${data.ban_end && data.ban_end > system.timestamp ? `До ${system.timeStampString(data.ban_end)}` : 'НЕТ'}`]);
            userInfo.push(['Варны', `${data.warns.length}`]);
            userInfo.push(['CMute', `${cmute.get(this.description.creatorId) ? system.timeStampString(cmute.get(this.description.creatorId)) : 'НЕТ'}`]);
            userInfo.push(['VMute', `${vmute.get(this.description.creatorId) ? system.timeStampString(vmute.get(this.description.creatorId)) : 'НЕТ'}`]);
            if (target) {
                userInfo.push(['ХП', `${target.user.health.toFixed(0)}`]);
                userInfo.push(['AP', `${target.armour.toFixed(0)}`]);
                userInfo.push(['Пинг', `${target.ping}`]);
                userInfo.push(['Потери', `${target.packetLoss}`]);
            }
        } else userInfo.push(['В игре', 'НЕТ']);

        return {
            description: this._data.description,
            answers: this._data.answers,
            userInfo: userInfo
        }
    }
}