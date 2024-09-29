import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {QUESTS_DATA} from '../../../shared/quests';
import {CustomEvent} from '../../modules/custom.event';
import {StorageAlertData} from "../../../shared/alertsSettings";
import {alertsEnable} from "../App";
import {QuestDto, QuestStepDto} from "../../../shared/advancedQuests/dtos";

export class HudQuestClass extends Component<{
    alertsData: StorageAlertData
}, {
    data?: [number, [boolean, number][], boolean],
    advancedQuests: QuestDto[],
    inpubg?: boolean,
    display: boolean
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            display: true,
            advancedQuests: []
        }

        CustomEvent.register('quest:data', (data: string) => {
            this.setState({ data: JSON.parse(data)})
        })

        CustomEvent.register('advancedQuests::updateQuest', (data: QuestDto) => {
            const quest = this.state.advancedQuests.find(quest => quest.questName === data.questName);
            if (quest) {
                quest.steps = data.steps
            } else {
                this.state.advancedQuests.push(data);
            }

            this.setState({ advancedQuests: this.state.advancedQuests })
        });

        CustomEvent.register('advancedQuests::deleteQuest', (questName: string) => {
            const questIdx = this.state.advancedQuests.findIndex(quest => quest.questName === questName);
            if (questIdx === -1) {
                return;
            }

            this.state.advancedQuests.splice(questIdx, 1);
            this.setState({
                advancedQuests: this.state.advancedQuests
            });
        });

        CustomEvent.register('hud:pubg', () => {
            this.setState({inpubg: true});
        })
        CustomEvent.register('hud:pubghide', () => {
            this.setState({inpubg: false});
        })
        // CustomEvent.register('alerts:enable', (data: StorageAlertData) => {
        //     this.setState({display: !!data.questLines});
        // })
    }
    get questData() {
        if (!this.state.data) return null;
        return QUESTS_DATA.find(q => q.id === this.state.data[0]);
    }
    get firstUnfinishedTask(){
        return this.state.data[1].findIndex(q => !q[0]);
    }

    getStepsToRender(quest: QuestDto): QuestStepDto[] {
        const steps: QuestStepDto[] = [];

        for (let step of quest.steps) {
            if (step.completed && step.notShowIfCompleted) {
                continue;
            }

            steps.push(step);

            if (!step.completed) {
                break;
            }
        }

        return steps;
    }

    render() {
        if (this.state.inpubg) return <></>;
        if (!!this.props.alertsData.questLines) return <></>;
        return <>
            { this.questData &&
                <div className="hud-quest-line-wrapper">
                    <div className="title-row">
                        <p className="p-title">{this.questData.name}</p>
                        <div className="icon-wrap">
                            <img src={svgs['target']} width="24" height="24"/>
                        </div>
                    </div>
                    <div className="hud-quest-line-wrap">
                        {this.questData.tasks.map((task, taskid) => {
                            // if (!this.state.data[1][taskid]) return <></>;
                            return <div
                                className={"hud-quest-line-item " + (this.state.data[1][taskid][0] ? 'done' : 'not-executed')}>
                                <div className="hud-quest-line-row">
                                    <p className="p-title">{task.nameTask}</p>
                                    <div className="icon-wrap">
                                        <img src={svgs['target']} width="24" height="24"/>
                                    </div>
                                </div>
                                {this.firstUnfinishedTask === taskid && task.descTask ? <div className="hud-quest-line-row">
                                    <div className="hint-text">
                                        <p>{task.descTask}</p>
                                    </div>
                                    <div className="icon-wrap"></div>
                                </div> : <></>}
                            </div>
                        })}

                    </div>
                </div>
            }

            { this.state.advancedQuests &&
                this.state.advancedQuests.map(quest => {
                    return <div className="hud-quest-line-wrapper">
                        <div className="title-row">
                            <p className="p-title">{quest.questName}</p>
                            <div className="icon-wrap">
                                <img src={svgs['target']} width="24" height="24"/>
                            </div>
                        </div>

                        <div className="hud-quest-line-wrap">
                            {this.getStepsToRender(quest).map(step => {
                                return <div className={"hud-quest-line-item " + (step.completed ? 'done' : 'not-executed')}>
                                    <div className="hud-quest-line-row">
                                        <p className="p-title">{step.name}</p>

                                        {!step.completed && step.count != null && step.countGoal != null &&
                                        <div className="hud-quest-count-wrap">
                                            <p>{ step.count } / { step.countGoal }</p>
                                        </div>
                                        }
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                })
            }
        </>
    }
};