import {MessagesEntity, PhoneEntity} from "./typeorm/entities/phoneData";
import {CustomEvent} from "./custom.event";
import {IPhoneMessengerDialogDTO, IPhoneMessengerMessageDTO} from "../../shared/phone";
import {inventory} from "./inventory";
import {system} from "./system";
import {phone} from "./phone";

class PhoneMessenger {
    private readonly _playersMessagesBuffer: Map<number, IPhoneMessengerMessageDTO[]>

    constructor() {
        this._playersMessagesBuffer = new Map<number, IPhoneMessengerMessageDTO[]>()
        CustomEvent.registerCef('phone:messenger:getDialogs', (player: PlayerMp, phoneId: number, number: number) =>
            this.getDialogs(player, phoneId, number))
        CustomEvent.registerCef('phone:messenger:getMessages', (player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number) =>
            this.getMessages(player, myPhoneId, myNumber, targetNumber))

        CustomEvent.registerCef('phone:messenger:sendMessage',
            (player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number, text: string) =>
            this.sendMessage(player, myPhoneId, myNumber, targetNumber, text))
        CustomEvent.registerCef('phone:messenger:sendGpsMessage',
            (player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number) =>
                this.sendGpsMessage(player, myPhoneId, myNumber, targetNumber))

        CustomEvent.registerCef('phone:messenger:acceptGps',
            (player: PlayerMp, gpsCoords: [number, number]) =>
                this.acceptGps(player, gpsCoords))
    }

    public async getDialogs(player: PlayerMp, phoneId: number, number: number): Promise<IPhoneMessengerDialogDTO[]> {
        const contacts = (await PhoneEntity.findOne({ phone: phoneId })).contacts
        player.phoneReadMessage = null

        if (!this._playersMessagesBuffer.has(number))
            this._playersMessagesBuffer.set(number, [])

        // Кешируем в буффер если не кешировали до этого
        if (!this._playersMessagesBuffer.get(number).length) {
            const messagesEntities = await MessagesEntity.find({ where: [{ target: number }, { sender: number}] })
            messagesEntities.map(m => {
                const messages = this._playersMessagesBuffer.get(number)
                messages.push({
                    target: m.target,
                    sender: m.sender,
                    text: m.text,
                    time: m.timestamp,
                    gps: [m.gps_x, m.gps_y],
                    read: m.read
                })
                this._playersMessagesBuffer.set(number, messages)
            })
        }
        const dialogs: IPhoneMessengerDialogDTO[] = []

        this._playersMessagesBuffer
            .get(number)
            .sort((a, b) => b.time - a.time)
            .map(message => {
                const anotherPersonInDialogPhoneNumber = message.sender == number ? message.target : message.sender
                const anotherPersonInDialogName = contacts.some(q => q[1] === anotherPersonInDialogPhoneNumber)
                    ? contacts.find(q => q[1] === anotherPersonInDialogPhoneNumber)[0]
                    : anotherPersonInDialogPhoneNumber.toString()

                if (dialogs.find(d => d.contactName == anotherPersonInDialogName)) return

                dialogs.push({
                    contactName: anotherPersonInDialogName,
                    time: message.time,
                    unreadMessages: message.read,
                    lastMessage: message.text,
                    number: anotherPersonInDialogPhoneNumber
                })
        })

        return dialogs
    }

    public getMessages(player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number): IPhoneMessengerMessageDTO[] {
        if (!player.user) return
        player.phoneReadMessage = targetNumber

        return this._playersMessagesBuffer
            .get(myNumber)
            .filter(m => (m.target == targetNumber && m.sender == myNumber) || (m.sender == targetNumber && m.target == myNumber))
    }

    public async sendMessage(player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number, text: string, withGps?: boolean): Promise<void> {
        const user = player.user
        if (!user) return

        const targetPhone = [...inventory.data].map(q => q[1]).filter(q => q.item_id === 850).find(q => q.advancedNumber === targetNumber)
        if (!targetPhone)
            return user.notifyPhone("Сообщение", `Ошибка отправки сообщения`, `Сообщение не было доставлено. Указанный номер телефона не обслуживается`)
        const newMessage = new MessagesEntity();
        if (withGps) {
            newMessage.gps_x = player.position.x
            newMessage.gps_y = player.position.y
        }
        newMessage.sender = myNumber;
        newMessage.target = targetNumber;
        newMessage.text = text;
        newMessage.timestamp = system.timestamp
        newMessage.time = system.fullDateTime

        await newMessage.save()

        const newMessageDto: IPhoneMessengerMessageDTO = {
            target: newMessage.target,
            sender: newMessage.sender,
            text: newMessage.text,
            time: newMessage.timestamp,
            gps: [newMessage.gps_x, newMessage.gps_y],
            read: newMessage.read
        }

        this._playersMessagesBuffer.set(myNumber, [...this._playersMessagesBuffer.get(myNumber), newMessageDto])
        if (this._playersMessagesBuffer.has(targetNumber))
            this._playersMessagesBuffer.set(targetNumber, [...this._playersMessagesBuffer.get(targetNumber), newMessageDto])
        else this._playersMessagesBuffer.set(targetNumber, [newMessageDto])

        CustomEvent.triggerCef(player, "phone:messenger:insert", newMessageDto)

        const targetPlayer = mp.players.toArray().find(q => q.dbid === targetPhone.owner_id)
        if (!targetPlayer || !mp.players.exists(targetPlayer)) return

        if (targetPlayer.phoneReadMessage != myNumber)
            return targetPlayer.user.notifyPhone("Сообщение", `${(await phone.getContactName(targetPhone.id, myNumber)) || "Неизвестный"} (${myNumber})`, `${text}`)
        else CustomEvent.triggerCef(targetPlayer, "phone:messenger:insert", newMessageDto)
    }

    public async sendGpsMessage(player: PlayerMp, myPhoneId: number, myNumber: number, targetNumber: number): Promise<void> {
        return this.sendMessage(player, myPhoneId, myNumber, targetNumber, "Передача местоположения", true)
    }

    public acceptGps(player: PlayerMp, gpsCoords: [number, number]): void {
        if (!gpsCoords[0] || !gpsCoords || !player.user) return
        player.user.setWaypoint(gpsCoords[0], gpsCoords[1], null, null, true)
    }
}

export const phoneMessenger = new PhoneMessenger()