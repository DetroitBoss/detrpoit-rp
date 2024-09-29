import { CustomEvent } from '../../custom.event'
import { ticketManager } from './ticketManager'
import { gui } from '../../gui'

CustomEvent.registerCef('ticket:create', (creator: PlayerMp, message: string) => ticketManager.create(creator, message))
CustomEvent.registerCef('ticket:open', (admin: PlayerMp) => ticketManager.onAdminOpened(admin))
CustomEvent.registerCef('ticket:select', (admin: PlayerMp, ticketId: number) => ticketManager.getTicketData(admin, ticketId))
CustomEvent.registerCef('ticket:addMessage', (admin: PlayerMp, ticketId: number, message: string) => ticketManager.addMessage(admin, ticketId, message))
CustomEvent.registerCef('ticket:close', (admin: PlayerMp, ticketId: number) => ticketManager.close(admin, ticketId))
CustomEvent.registerCef('ticket:closeMenu', (admin: PlayerMp) => ticketManager.onMenuClosed(admin))

CustomEvent.registerCef('ticket:tp', (player, ticketId: number) => ticketManager.tp(player, ticketId))
CustomEvent.registerCef('ticket:tpm', (player, ticketId: number) => ticketManager.tpm(player, ticketId))
CustomEvent.registerCef('ticket:freeze', (player, ticketId: number) => ticketManager.freeze(player, ticketId))
CustomEvent.registerCef('ticket:heal', (player, ticketId: number) => ticketManager.heal(player, ticketId))

gui.chat.registerCommand('report', (player, ...args) => {
    if (!player.user) return
    const message = args.join(' ');
    ticketManager.create(player, message)
})

gui.chat.registerCommand('cleartickets', (player) => {
    if (!player.user || !player.user.isAdminNow(5)) return
    
    ticketManager.clearAllTickets(player)
})

mp.events.add('playerQuit', player => ticketManager.onPlayerLeave(player))