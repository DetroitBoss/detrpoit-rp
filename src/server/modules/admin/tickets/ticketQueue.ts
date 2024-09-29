import { TicketCreatorType, TicketDescription } from '../../../../shared/ticket'
import { system } from '../../system'
import { Ticket } from './ticket'

export class TicketQueue {
    private _tickets: Array<Ticket> = new Array<Ticket>()
    private idCounter: number = 0
    public get length(): number {
        return this._tickets.length
    }

    public getAllDescriptions(): Array<TicketDescription> {
        return this._tickets.map(t => t.description)
    }

    public getById(id: number): Ticket {
        return this._tickets.find(t => t.description.id === id)
    }

    public getByAdmin(adminName: string): Ticket[] {
        return this._tickets.filter(t => t.description.adminName === adminName)
    }
    
    public get lastTicket(): Ticket {
        return this._tickets[this._tickets.length - 1]
    }
    
    public addToQueue(creator: PlayerMp, message: string): void {
        this._tickets.push(new Ticket({
            description: {
                id: this.idCounter++,
                creatorId: creator.user.id,
                creatorName: creator.user.name,
                creatorType:
                    creator.user.account.isMedia ? TicketCreatorType.Media :
                        creator.user.isLeader ? TicketCreatorType.Leader
                            : TicketCreatorType.RegularPlayer,
                createTime: system.timestamp,
                message: message
            },
            answers: []
        }))
    }

    public seedTestData(): void {
        for (let i = 0; i < 400; i++) {
            this._tickets.push(new Ticket({
                description: {
                    id: this.idCounter++,
                    creatorId: 1,
                    creatorName: 'asdfasfa',
                    creatorType: TicketCreatorType.RegularPlayer,
                    createTime: system.timestamp,
                    message: 'dsfsfdsfas'
                },
                answers: []
            }))
        }
    }
    
    public clear(): void {
        this._tickets = new Array<Ticket>()
    }
    
    public remove(ticket: Ticket): void {
        this._tickets.splice(this._tickets.indexOf(ticket), 1)
    }
}