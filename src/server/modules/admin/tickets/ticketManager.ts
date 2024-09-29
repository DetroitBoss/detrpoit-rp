import { system } from '../../system'
import { TicketDescription, TicketFullData } from '../../../../shared/ticket'
import { TicketQueue } from './ticketQueue'
import { User } from '../../user'
import { CustomEvent } from '../../custom.event'

const TICKET_CREATE_COOLDOWN = 1 * 60

class TicketManager {
    public queue: TicketQueue
    private _cooldowns: Map<PlayerMp, number>

    constructor() {
        this.queue = new TicketQueue()
        
        this._cooldowns = new Map<PlayerMp, number>()
    }

    public create(creator: PlayerMp, message: string): void {
        if (!creator.user || !message) return
        if (this._cooldowns.has(creator)) {
            const timeSinceCreateLastTicket = system.timestamp - this._cooldowns.get(creator)
            if (timeSinceCreateLastTicket >= TICKET_CREATE_COOLDOWN) {
                this._cooldowns.delete(creator)
            } else return creator.notify(`Вы можете создать тикет только через ${system.formatTime(TICKET_CREATE_COOLDOWN - timeSinceCreateLastTicket)}`, 'warning')
        }

        this.queue.addToQueue(creator, message)
        this._cooldowns.set(creator, system.timestamp)

        creator.user.setGui(null)
        creator.notify(`Ваш тикет в очереди ${this.queue.length}, ожидайте рассмотрения`, 'success')
        
        mp.players.toArray()
            .filter(p => p.user && p.user.isAdminNow())
            .forEach(p => {
                p.notify(`Поступил новый репорт, открой F6!`, 'info')
                CustomEvent.triggerCef(p, 'playSound', 'succ')
                if (p.ticketPage) {
                    CustomEvent.triggerCef(p, 'ticket:insert', [this.queue.lastTicket.description])
                }
            });
    }

    public getTicketData(admin: PlayerMp, ticketId: number): TicketFullData {
        if (!admin.user?.isAdminNow()) return

        const ticket = this.queue.getById(ticketId)
        if (!ticket) {
            admin.notify('Тикет был закрыт или удален', 'warning')
            return null
        }
        if (!ticket.description.adminName)
            ticket.takeByAdmin(admin)

        return ticket.getFulldata()
    }

    public clearAllTickets(admin: PlayerMp): void {
        if (!admin.user?.isAdminNow()) return
        
        this.queue.clear()
    }

    public addMessage(admin: PlayerMp, ticketId: number, message: string): void {
        if (!admin.user?.isAdminNow()) return

        const ticket = this.queue.getById(ticketId)
        if (!ticket) {
            admin.notify('Тикет был закрыт или удален', 'warning')
            return null
        }

        ticket.addAnswer(message)

        mp.players.toArray()
            .filter(p => p.user && p.user.isAdminNow())
            .forEach(p => p.outputChatBox(`!{3CB371}${admin.user.name}[${admin.user.admin_level}] to ${ticket.description.creatorName}[${ticket.description.creatorId}]: ${message}`));
    }

    public async close(admin: PlayerMp, ticketId: number): Promise<void> {
        if (!admin.user?.isAdminNow()) return

        const ticket = this.queue.getById(ticketId)
        await ticket.close()

        this.queue.remove(ticket)
    }

    public onMenuClosed(admin: PlayerMp): void {
        if (!admin.user?.isAdminNow()) return

        admin.ticketPage = false
    }

    public onAdminOpened(admin: PlayerMp): void {
        if (!admin.user?.isAdminNow()) return
        admin.ticketPage = true

        const chunks = system.chunkArray(this.queue.getAllDescriptions(), 20)
        chunks.forEach(chunk => {
            CustomEvent.triggerCef(admin, 'ticket:insert', chunk)
        })
    }

    public onPlayerLeave(player: PlayerMp): void {
        if (!player.user || player.user.admin_level < 1) return
        const tickets = this.queue.getByAdmin(player.user?.name)
        if (tickets) {
            tickets.map(t => t.resetAdmin())
        }
    }

    public tp(admin: PlayerMp, ticketId: number): void {
        if (!admin.user?.isAdminNow()) return
        const ticket = this.queue.getById(ticketId)
        
        const target = User.get(ticket.description.creatorId)
        if (!target) return
        
        admin.user.teleport(target.position.x, target.position.y, target.position.z, target.heading, target.dimension)
    }

    public tpm(admin: PlayerMp, ticketId: number): void {
        if (!admin.user?.isAdminNow()) return
        const ticket = this.queue.getById(ticketId)

        const target = User.get(ticket.description.creatorId)
        if (!target) return
        
        target.user.teleport(admin.position.x, admin.position.y, admin.position.z, admin.heading, admin.dimension)
    }

    public freeze(admin: PlayerMp, ticketId: number): void {
        if (!admin.user?.isAdminNow()) return
        const ticket = this.queue.getById(ticketId)

        const target = User.get(ticket.description.creatorId)
        if (!target) return
        
        const current = target.getVariable('admin:freeze')
        target.setVariable('admin:freeze', !current)
    }

    public heal(admin: PlayerMp, ticketId: number): void {
        if (!admin.user?.isAdminNow()) return
        const ticket = this.queue.getById(ticketId)

        const target = User.get(ticket.description.creatorId)
        if (!target) return

        target.user.health = 100
    }
}

export const ticketManager = new TicketManager()