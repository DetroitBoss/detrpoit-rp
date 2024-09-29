import React, { Component } from 'react';
import './style.less';
import svg from "./assets/*.svg";
import { CEF } from '../../../../modules/CEF'
import { CustomEvent } from '../../../../modules/custom.event'
import { TicketCreatorType, TicketDescription, TicketFullData } from '../../../../../shared/ticket'
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { systemUtil } from '../../../../../shared/system'

export class AdminTickets extends Component<{}, {
    inputMessage?: string
    descriptions: Array<TicketDescription>
    openedTicket: TicketFullData
}> {
    ev1: CustomEventHandler
    ev2: CustomEventHandler
    ev3: CustomEventHandler
    ev4: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            descriptions: CEF.test ? new Array<TicketDescription>({
                adminName: 'Admin Adminov',
                message: 'Adsadaksdaksada',
                createTime: 12345679,
                creatorName: 'Test Testov',
                creatorId: 123,
                creatorType: TicketCreatorType.RegularPlayer,
                id: 12
            },
            {
                message: 'Message',
                createTime: 123456129,
                creatorName: 'Media Media',
                creatorId: 125,
                creatorType: TicketCreatorType.Media,
                id: 13
            },
            {
                message: 'Message 2',
                createTime: 12345612,
                creatorName: 'Leader Leader',
                creatorId: 126,
                creatorType: TicketCreatorType.Leader,
                id: 14
            },
            ) : [],
            openedTicket: CEF.test ? {
                description: {
                    message: 'Message',
                    createTime: 123456129,
                    creatorName: 'Media Media',
                    creatorId: 125,
                    creatorType: TicketCreatorType.Media,
                    id: 13
                },
                answers: ['Привет', 'Ответ на вопрос']
            } : null
        }
        
        this.ev1 = CustomEvent.register('ticket:updateDescr', (newData: TicketDescription) => {
            this.setState({
                descriptions: this.state.descriptions.map(el => el.id === newData.id ? {...el, adminName: newData.adminName} : el)
            })
        })
        this.ev2 = CustomEvent.register('ticket:close', (ticketId: number) => {
            const oldData = this.state.descriptions
            oldData.splice(oldData.findIndex(d => d.id === ticketId), 1)
            this.setState({
                descriptions: oldData
            })
        })
        
        this.ev3 = CustomEvent.register('ticket:selectFirstFree', () => {
            const lastTicket = this.state.descriptions.find(d => !d.adminName)
            if (lastTicket)
                this.selectTicket(lastTicket.id)
        })

        this.ev4 = CustomEvent.register('ticket:insert', (dataToInsert: Array<TicketDescription>) => {
            setTimeout(() => {
                this.setState({
                    descriptions: this.state.descriptions.concat(dataToInsert)
                })
            }, 100)
        })
    }
    
    public componentDidMount() {
        CustomEvent.triggerServer('ticket:open')
    }

    inputRef: React.RefObject<any> = React.createRef()

    sendMessage() {
        if (this.state.inputMessage === "") return CEF.alert.setAlert(
            "error",
            "Введите текст"
        )
        if (this.state.openedTicket.description.adminName != CEF.user.name) {
            return CEF.alert.setAlert(
                "error",
                "На тикет уже отвечают"
            )
        }
        CustomEvent.triggerServer('ticket:addMessage', this.state.openedTicket.description.id, systemUtil.filterInput(this.state.inputMessage))
        
        const answers = this.state.openedTicket.answers
        answers.push(this.state.inputMessage)
        
        this.setState({
            inputMessage: "",
            openedTicket: { ...this.state.openedTicket, answers }
        })
        
        this.inputRef.current.value = ""
    }

    async selectTicket(ticketId: number) {
        const fullTicketData: TicketFullData = await CustomEvent.callServer('ticket:select', ticketId)
        
        this.setState({
            openedTicket: fullTicketData
        })
    }

    closeTicket(): void {
        CustomEvent.triggerServer('ticket:close', this.state.openedTicket.description.id)
        this.setState({
            openedTicket: null
        })
    }

    tp(): void {
        CustomEvent.triggerServer('ticket:tp', this.state.openedTicket.description.id)
    }

    tpm(): void {
        CustomEvent.triggerServer('ticket:tpm', this.state.openedTicket.description.id)
    }

    freeze(): void {
        CustomEvent.triggerServer('ticket:freeze', this.state.openedTicket.description.id)
    }

    heal(): void {
        CustomEvent.triggerServer('ticket:heal', this.state.openedTicket.description.id)
    }
    
    public componentWillUnmount() {
        this.ev1?.destroy()
        this.ev2?.destroy()
        this.ev3?.destroy()
        this.ev4?.destroy()
        CustomEvent.triggerServer('ticket:closeMenu')
    }

    render() {
        return <div className="adminTickets">

            <div className="adminTickets-block">

                <div className="adminTickets-block-left">

                    <div className="adminTickets-block-left-sort">
                        Сначала новые <img src={svg["arrows"]} alt=""/>
                    </div>

                    <div className="adminTickets-block-left-scroll">
                            {
                                this.state.descriptions?.map((el) => {
                                    return <div className="adminTickets-block-left-ticket" key={el.id} onClick={() => this.selectTicket(el.id)}>
                                        <div className="adminTickets-block-left-ticket__name" style={
                                            el.creatorType === TicketCreatorType.Media
                                                ? {color: "#F2C94C"}
                                                : el.creatorType === TicketCreatorType.Leader
                                                    ? {color: "#008000"} : {}
                                        }>
                                            {`${el.creatorName} (${el.creatorId})`}
                                        </div>
                                        <div className="adminTickets-block-left-ticket__time">
                                            {el.id}
                                        </div>
                                        <div className="adminTickets-block-left-ticket__message">
                                            {el.message}
                                        </div>
                                        <div className="adminTickets-block-left-ticket-footer">
                                            <div className="adminTickets-block-left-ticket-footer__time">{systemUtil.timeStampString(el.createTime)}</div>
                                            <div className="adminTickets-block-left-ticket-footer__status"
                                                 style={!el.adminName ? {backgroundColor: "#F2C94C"} : {backgroundColor: "#EB5757"}}/>
                                            <div className="adminTickets-block-left-ticket-footer__title">{el.adminName ? `Взял ${el.adminName}` : 'Открыт'}</div>
                                        </div>
                                    </div>
                                })
                            }
                </div>
                </div>
                {this.state.openedTicket ?
                    <>
                        <div className="adminTickets-block-center">
    
                            <div className="adminTickets-block-center-input">
                                <input
                                    ref={this.inputRef}
                                    onChange={(el) => {
                                        this.setState({inputMessage: el.currentTarget.value})
                                    }}
                                    onKeyPress={(el) => {
                                        if (el.key !== "Enter") return
                                        this.sendMessage()
                                    }}
                                    type="text" placeholder="Напишите сообщение . . ."
                                />
                                <img onClick={() => {
                                    this.sendMessage()
                                }} src={svg["send"]} alt=""/>
                            </div>
    
                            <div className={`adminTickets-block-center-leftMessage showMessage`}>
                                <div className="adminTickets-block-center__name">{this.state.openedTicket.description.creatorName}</div>
                                <div className="adminTickets-block-center__message">
                                    {this.state.openedTicket.description.message}
                                </div>
                            </div>

                            {this.state.openedTicket.answers?.map((message, key) => {
                                return <div className="adminTickets-block-center-rightMessage showMessage" key={key}>
                                        <div className="adminTickets-block-center__name">
                                            <span style={{color: "#EB5757"}}>{this.state.openedTicket.description.adminName ?? 'Неизвестно'}</span>
                                        </div>
                                        <div className="adminTickets-block-center__message">
                                            {message}
                                        </div>
                                    </div>
                                })   
                            }
                            
                        </div>
    
                        <div className="adminTickets-block-right">
    
                            <div className="adminTickets-block-right-buttons">
                                <div onClick={() => this.tp()}>TP</div>
                                <div onClick={() => this.tpm()}>TPM</div>
                                <div onClick={() => this.freeze()}>FREEZE</div>
                                <div onClick={() => this.heal()}>EMS HEAL</div>
                            </div>
    
                            <div className="adminTickets-block-right-close" onClick={() => this.closeTicket()}>
                                Закрыть тикет
                            </div>
    
                            <div className="adminTickets-block-right__title">
                                Информация
                            </div>
    
                            <div className="adminTickets-block-right__information">
    
                                {this.state.openedTicket?.userInfo?.map((el, key) => {
    
                                    return <div key={key}>
                                        <span>{el[0]}:</span>
                                        {el[1]}
                                    </div>
                                })}
    
                            </div>
    
                        </div>
                    </> : null}
                
            </div>

        </div>
    }
}