import React, {Component} from "react";
import "./style.less";
import png from './assets/*.png'
import svg from "./assets/*.svg"
import { getJobData, getJobName, getLevelByExp, IJobUserMenu } from "../../../../../shared/jobs";
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'
import { IUserStatsDto } from '../../../../../shared/userStats'
import { systemUtil } from '../../../../../shared/system'
import { CEF } from '../../../../modules/CEF'

export class Statistic extends Component<{}, {
    username: string,
    kills: number,
    death: number,
    regDate: string,

    playTimeTotal: number,
    playTimeMouth: number,
    playTimeToday: number,

    moneyTotal: number,
    moneyMouth: number,
    moneyToday: number,
    moneySpent: number,

    jobs: IJobUserMenu[],
    page: number
}> {
    
    constructor(props: any) {
        super(props);

        this.state = {
            username: "User Name",
            kills: 100,
            death: 50,
            regDate: "20 января 1998",

            // Отыграно всего
            playTimeTotal: 200,
            // Отыграно за месяц
            playTimeMouth: 50,
            // Отыграно сегодня
            playTimeToday: 12,

            // Заработано всего
            moneyTotal: 200000000,
            // Заработано за месяц
            moneyMouth: 50000,
            // Заработано сегодня
            moneyToday: 1000,
            // Потрачено всего
            moneySpent: 300000000,

            jobs: [
                {img: "fish", title: "Рыбалка", lvl: 2, maxLvl: 5, exp: 5000, maxExp: 10000},
                {img: "fish", title: "Электрик", lvl: 1, maxLvl: 5, exp: 4500, maxExp: 10000},
            ],

            page: 0
        };
    }

    public componentDidMount() {
        CustomEvent.callServer('userStats:get').then((response: IUserStatsDto) => {
            console.log(JSON.stringify(response))

            const jobs: IJobUserMenu[] = []
            for (let job in response.workStats) {
                const jobData = getJobData(job as any)
                if (!jobData) continue
                const exp = response.workStats[job]
                jobs.push({
                    img: jobData.name,
                    exp,
                    lvl: getLevelByExp(exp),
                    maxLvl: 5,
                    maxExp: 1000,
                    title: jobData.name
                })
            }
            
            this.setState({
                death: response.userStats?.totalDeaths ?? 0,
                kills: response.userStats?.totalKills ?? 0,
                
                moneyMouth: response.monthlyMoneyEarned,
                moneyToday: response.dailyMoneyEarned,
                
                moneySpent: response.userStats?.totalMoneySpend ?? 0,
                moneyTotal: response.userStats?.totalMoneyEarned ?? 0,
                
                playTimeToday: response.dailyOnline,
                playTimeMouth: response.monthlyOnline,
                playTimeTotal: response.userStats?.totalPlayedTime ?? 0,
                
                regDate: systemUtil.timeStampString(response.regDate, true),
                username: CEF.user.name,
                
                jobs: jobs
            })
        })
    }
    
    kd() {
        return this.state.death == 0 ? 0 : (this.state.kills / this.state.death).toFixed(2)
    }

    moneyPrettify(sum: number) {
        return sum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    get maxPage(): number {
        const num = this.state.jobs.length / 4;
        if (num < 1) return 0;
        if (Number.isInteger(num)) return num - 1;
        return Number(num.toFixed(0))
    }

    setPage(toggle: boolean): void {
        let page = this.state.page;

        if (toggle === true && this.state.page === this.maxPage) return;
        if (toggle === false && this.state.page === 0) return;

        this.setState({...this.state, page: toggle ? page + 1 : page - 1});

    }

    preRenderCheck(index: number): boolean {
        index += 1;

        const min = this.state.page * 4,
            max = min + 5;

        return index > min && index < max;
    }

    render() {
        return <div className="statistic">

            <div className="statistic__title">
                Статистика
            </div>

            <div className="statistic-row">

                <div className="statistic__username">
                    {this.state.username}
                </div>

                <div className="statistic__stats">
                    <span>Кол-во убийств</span>
                    <div>
                        <img src={svg["knives"]} alt=""/>
                        {this.state.kills}
                    </div>
                </div>

                <div className="statistic__stats">
                    <span>Кол-во смертей</span>
                    <div>
                        <img src={svg["skull"]} alt=""/>
                        {this.state.death}
                    </div>
                </div>

                <div className="statistic__stats">
                    <span>Убийства/Смерти</span>
                    <div>
                        {this.kd()}
                    </div>
                </div>

            </div>

            <div className="statistic-row statistic-information">

                <img src={svg["watch"]} className={"statistic-information__img"} alt=""/>

                <div className="statistic-block">

                    <div className="statistic-block__title">Дата регистрации</div>
                    <div className="statistic__stats">
                        <div>
                            {this.state.regDate}
                        </div>
                    </div>

                    <div className="statistic-block__title">Время в игре</div>

                    <div className="statistic-row">
                        <div className="statistic__stats">
                            <span>Всего</span>
                            <div>
                                {this.state.playTimeTotal}ч
                            </div>
                        </div>
                        <div className="statistic__stats">
                            <span>В этом месяце</span>
                            <div>
                                {this.state.playTimeMouth}ч
                            </div>
                        </div>
                        <div className="statistic__stats">
                            <span>Сегодня</span>
                            <div>
                                {this.state.playTimeToday}ч
                            </div>
                        </div>

                    </div>

                </div>

                <img src={svg["coin"]} className={"statistic-information__img"} alt=""/>

                <div className="statistic-block">

                    <div className="statistic-block__title">Потрачено</div>

                    <div className="statistic__stats">
                        <div>
                            {this.moneyPrettify(this.state.moneySpent)}$
                        </div>
                    </div>

                    <div className="statistic-block__title">Заработано</div>

                    <div className="statistic-row">
                        <div className="statistic__stats">
                            <span>Всего</span>
                            <div>
                                {this.moneyPrettify(this.state.moneyTotal)}$
                            </div>
                        </div>
                        <div className="statistic__stats">
                            <span>В этом месяце</span>
                            <div>
                                {this.moneyPrettify(this.state.moneyMouth)}$
                            </div>
                        </div>
                        <div className="statistic__stats">
                            <span>Сегодня</span>
                            <div>
                                {this.moneyPrettify(this.state.moneyToday)}$
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <img src={png["line"]} alt="" className="statistic__line"/>

            <div className="statistic-row">

                <div className="statistic-row__title">Список работ</div>

                <img src={svg["arrow"]} alt="" onClick={() => this.setPage(false)} className={`statistic-row__arrow ${this.state.page !== 0 ? "statistic-active" : null}`}/>
                <img src={svg["arrow"]} alt="" onClick={() => this.setPage(true)} className={`statistic-row__arrow ${this.state.page !== this.maxPage ? "statistic-active" : null}`}/>

            </div>

            <div className="statistic-jobs">

                {this.state.jobs
                    .sort((a, b) => b.lvl - a.lvl)
                    .map((job, index) => {
                        if (!this.preRenderCheck(index)) return null;
                        return <div className="statistic-jobs-block" key={index}>

                            <img src={png[job.img]} className="statistic-jobs-block__background" alt=""/>

                            {index === 0 && <img src={svg["plate"]} alt="" className="statistic-jobs-block__plate"/>}

                            <div className="statistic-jobs-block__title">{job.title}</div>

                            <div className="statistic-row">

                                <div className="statistic__stats">
                                    <span>Уровень</span>
                                    <div>
                                        {job.lvl + 1}/{job.maxLvl}
                                    </div>
                                </div>

                                <div className="statistic__stats">
                                    <span>Опыт</span>
                                    <div>
                                        {job.exp}/{job.maxExp}exp
                                    </div>
                                </div>

                            </div>

                            <div className="statistic-jobs-block-progress">
                                <div style={{width: job.exp / job.maxExp * 100 + "%"}}/>
                            </div>

                        </div>
                    })
                }


            </div>

        </div>
    }
}