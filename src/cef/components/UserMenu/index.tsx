import React, {Component} from "react";
// import './style.less';
import "./assets/main-menu.less";
import "./assets/partner.less";
import "./assets/aim.less";
import svg from "./assets/svg/*.svg";
import svgInventory from "../Inventory/icons/*.svg";
import svgPackets from "../../../shared/packets/*.svg";
import png from "./assets/png/*.png";
import iconsItems from "../../../shared/icons/*.png";
import achievepng from "./assets/achievements/*.png";
import partnerimg from "./assets/partner/*.png";
import achievementsLogo from "../../../shared/AchievImage/*.png";
import achievesvg from "./assets/achievements/*.svg";
import adspng from "../../../shared/UserMenuAdsSlider/*.png";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import {helpInfo, ruleItem, rules} from "../../../shared/rules";
import {
    defaultHotkeys,
    generateHotkeysButtonsArray,
    getHotkeysName,
    getHotkeysNeedHold, hotkeyCategories,
} from "../../../shared/hotkeys";
import {createStyles, withStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import {Statistic} from "./components/Statistic"
import DonateStorage from "./components/DonateStorage"

import {
    getJobData,
    JobId,
    JOBS_ADVANCED_LIST,
    jobsList,
} from "../../../shared/jobs";
import {systemUtil} from "../../../shared/system";
import {getVipConfig, PACKETS, VIP_TARIFS, VipId} from "../../../shared/vip";
import {Circle} from "rc-progress";
import {
    COINS_FOR_ONE_ROUBLE,
    Donate_Items,
    DONATE_MONEY_NAMES,
    MEDIA_PROMOCODE,
    PLAYTIME_MONEY,
    PLAYTIME_TIME,
    PLAYTIME_TYPE,
} from "../../../shared/economy";
import {ChatDialogClass} from "../Chat/chatBlock";
import {CustomEventHandler} from "../../../shared/custom.event";
import {BUSINESS_SUBTYPE_NAMES} from "../../../shared/business";
import {LicensesData} from "../../../shared/licence";
import {getMaxExpLevel} from "../../../shared/payday";
import {system} from "../../modules/system";
import {getBaseItemNameById} from "../../../shared/inventory";
import {
    ALERTS_SETTINGS,
    StorageAlertData,
} from "../../../shared/alertsSettings";
import carbonus from "./assets/car-action.jpg";
import {
    CAR_NAME_FOR_CEF_FOR_PLAY_REWARD_MAX,
    MINUTES_FOR_PLAY_REWARD_MAX,
} from "../../../shared/reward.time";
import {
    getAchievConfig,
    getTempAchievConfig,
    UserAchievmentData,
    UserAchievmentKey,
} from "../../../shared/achievements";
import {SocketSync} from "../SocketSync";
import {TooltipClass} from "../Tooltip";
import {DonateRoulette} from "./components/donate-roulette";
import {CustomPicker, HSLColor, RGBColor} from "react-color";
import {Hue, Saturation} from "react-color/lib/components/common";
import {ColorPicker} from '../LSCnew'
import {ICrosshairSettings} from '../../../shared/crosshair'
import {HudCrosshair} from '../HudBlock/crosshair/crosshair'
import CrosshairStore from '../../stores/Crosshair'
import { AdminTickets } from './components/AdminTickets'
import { Tickets } from './components/Tickets'

const ColorPickerWrapped = CustomPicker(ColorPicker);

const pages = [
    ["profile", "Профиль", "smile"],
    ["achiev", "Достижения", "achieve-tab"],
    ["players", "Игроки", "menu-dots"],
    ["vip", "Магазин", "cart"],
    ["binder", "Биндер", "terminal"],
    ["help", "Помощь", "toy-horse"],
    ["rules", "Правила", "book"],
    ["settings", "Кабинет", "user"],
    ["statistic", "Статистика", "stats"],
    ["donateStorage", "Хранилище", "storage"],
    ["ticket", "Жалобы", "bell"],
];

let volumeStepsDraw = [{value: 0, label: "OFF"}];
for (let id = 10; id <= 100; id += 10)
    volumeStepsDraw.push({value: id, label: id + "%"});

export class UserMenuBlock extends Component<{
    CrosshairStore: CrosshairStore
},
    {
        loaded: boolean;
        page?: typeof pages[number][0];
        rp_name?: string;
        food?: number;
        water?: number;
        man?: boolean;
        exp?: number;
        level?: number;
        wanted_level?: number;
        warns?: number;
        bans?: number;
        work?: JobId;
        fraction?: string;
        rank?: string;
        house?: string;
        business?: string;
        players?: [number, string, number][];
        newplayers: number;
        hotkeys: {
            [task: string]: number;
        };
        shopPay: number;
        shopPage: number;
        hotkeyEdit?: string;
        hotkeyOpen?: string;
        selectedKey?: number;
        helpSection: number;
        voiceData: [number, number, number];
        boomboxSound: number;
        alertsData: Partial<StorageAlertData>;
        menuItems: number;
        wanted_reason?: string;
        selectJob?: number;
        ads: {
            title: string;
            text: string;
            pic: string;
            button: string;
            pos?: {
                x: number;
                y: number;
                z: number;
            };
        }[];
        curAd: number;
        vipId?: VipId;
        vipEnd?: number;
        donate: number;
        buyVip: number;
        buyVipTime: number;
        buyModal: number;
        buyCoin: number;
        buyName: string;
        showPass: Array<boolean>;
        passData: Array<string>;
        google: boolean;
        googleInput: string;
        promo: string;
        ask: {
            helper?: boolean;
            /** Текущий тикет */
            select: string;
            /** id игрока для фильтрации */
            id: number;
            /** Фильтры */
            filter: Array<boolean>;
            input: string;
        };
        donateShops: {
            x: number;
            y: number;
            name: string;
            type: number;
            sub_type: number;
        }[];
        bankNumber?: number;
        bankPos?: { x: number; y: number };
        donateX: boolean;
        donateX3: boolean;
        chatSort: [boolean, boolean];
        playersType: number;
        online?: number;
        total?: number;
        bonus?: number;
        carbonus?: number;
        achieve: UserAchievmentData;
        achieveDaily: UserAchievmentData;
        promocodeMy?: string;
        promocodeMyInput?: string;
        promocodeMyCount?: number;
        promocodeMyRewardGived?: number;
        usersVoice?: [number, number][];
        voiceLevel: number;
        lodDistPlayers: number;
        lodDistVehs: number;
        crosshairSettings: ICrosshairSettings;
        currentCrosshairColor: { r: number, g: number, b: number }
    }> {
    ev: CustomEventHandler;
    evAsk: CustomEventHandler;
    evDonateCoins: CustomEventHandler;
    evCrosshair: CustomEventHandler;
    adsTime: any;

    constructor(props: any) {
        super(props);
        this.state = {
            boomboxSound: 100,
            lodDistPlayers: 100,
            lodDistVehs: 100,
            voiceLevel: 1,
            usersVoice: CEF.test
                ? new Array(20)
                    .fill([system.getRandomInt(1, 100000), system.getRandomInt(0, 200)])
                    .map((q) => [
                        system.getRandomInt(1, 100000),
                        system.getRandomInt(0, 200),
                    ])
                : [],
            achieve: {},
            achieveDaily: {},
            donateShops: [],
            wanted_reason: "",
            loaded: CEF.test,
            currentCrosshairColor: {r: 0, g: 0, b: 0},
            page: "profile",
            rp_name: "Test Name",
            food: 320,
            crosshairSettings: {
                width: 3,
                length: 20,
                alpha: 1,
                gap: 5,
                color: {r: 255, g: 255, b: 0},
                enable: true,
                aimColor: { r: 255, g: 255, b: 0 }
            },
            water: 720,
            man: true,
            exp: 111,
            level: 320,
            wanted_level: 2,
            warns: 1,
            bans: 0,
            work: null,
            fraction: null,
            rank: null,
            players: [],
            newplayers: 0,
            hotkeys: {...defaultHotkeys},
            helpSection: 0,
            voiceData: [100, 100, 100],
            alertsData: {},
            menuItems: 6,
            vipId: "Sapfire",
            vipEnd: 11111111111,
            ads: [
                {
                    title: "Покупай машины ограниченной серии",
                    text: "Управляй уникальным экземпляром каждый день",
                    pic: "car-slider",
                    button: "поставить метку автосалона",
                    pos: {x: 1, y: 1, z: 1},
                },
                {
                    title: "Покупай машины ограниченной серии",
                    text: "Управляй уникальным экземпляром каждый день",
                    pic: "car-slider-2",
                    button: "поставить метку автосалона",
                    pos: {x: 1, y: 1, z: 1},
                },
                {
                    title: "Покупай машины ограниченной серии",
                    text: "Управляй уникальным экземпляром каждый день",
                    pic: "car-slider-3",
                    button: "поставить метку автосалона",
                    pos: {x: 1, y: 1, z: 1},
                },
                {
                    title: "Покупай машины ограниченной серии",
                    text: "Управляй уникальным экземпляром каждый день",
                    pic: "car-slider-4",
                    button: "поставить метку автосалона",
                    pos: {x: 1, y: 1, z: 1},
                },
            ],
            curAd: 0,
            shopPay: null,
            shopPage: 0,
            donate: 9999,
            buyVip: 0,
            buyVipTime: 0,
            buyCoin: 0,
            buyName: "",
            buyModal: 0,
            showPass: [false, false, false],
            passData: ["", "", ""],
            google: false,
            googleInput: "",
            promo: "",
            ask: {
                select: null,
                filter: [false, false],
                id: CEF.id,
                items: [],
                // messages: [
                //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
                //     {id: 2, time: 12345, name:"Test Name2", text: "Привет привет привет привет пакет"},
                //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
                //     {id: 4, time: 12345, name:"Test Name4", text: "Привет привет привет привет пакет"},
                //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"},
                //     {id: 1, time: 12345, name:"Test Name", text: "Привет привет привет привет пакет"}
                // ],
                input: "",
            },
            bankNumber: 123456,
            bankPos: {x: 0, y: 0},
            donateX: false,
            donateX3: false,
            chatSort: [false, false],
            playersType: 0,
            bonus: 265,
            carbonus: 100,
        };
        this.ev = CustomEvent.register(
            "mainmenu:data",
            (
                rp_name: string,
                food: number,
                water: number,
                man: boolean,
                exp: number,
                level: number,
                wanted_level: number,
                wanted_reason: string,
                warns: number,
                bans: number,
                work: JobId,
                fraction: string,
                rank: string,
                house: string,
                business: string,
                players: [number, string, number][],
                hotkeys: {
                    [task: string]: number;
                },
                voiceData: [number, number, number],
                menuItems: number,
                ads: {
                    title: string;
                    text: string;
                    pic: string;
                    button: string;
                    pos: {
                        x: number;
                        y: number;
                        z: number;
                    };
                }[],
                vipId: VipId,
                vipEnd: number,
                donate_money: number,
                donateShops: any,
                bankNumber: number,
                bankPos: any,
                donateX,
                donateX3,
                online,
                total,
                bonus,
                alertsData: StorageAlertData,
                carbonus,
                achieve,
                achieveDaily,
                promocodeMy,
                promocodeMyCount,
                promocodeMyRewardGived,
                usersVoice,
                voiceLevel,
                lodDistPlayers,
                lodDistVehs,
                boomboxSound,
                report
            ) => {
                this.setState(
                    {
                        achieve,
                        achieveDaily,
                        donateX,
                        donateX3,
                        bankPos,
                        bankNumber,
                        donateShops,
                        loaded: true,
                        rp_name,
                        food,
                        water,
                        man,
                        exp,
                        level,
                        wanted_level,
                        wanted_reason,
                        warns,
                        bans,
                        work,
                        fraction,
                        rank,
                        house,
                        business,
                        players,
                        hotkeys,
                        voiceData,
                        menuItems,
                        ads,
                        vipId,
                        vipEnd,
                        donate: donate_money,
                        online,
                        total,
                        bonus,
                        alertsData,
                        carbonus,
                        promocodeMy,
                        promocodeMyCount,
                        promocodeMyRewardGived,
                        usersVoice,
                        voiceLevel,
                        lodDistPlayers,
                        lodDistVehs,
                        boomboxSound,
                    },
                    () => {
                        if (report) {
                            this.setPage("ticket");
                        }
                    }
                );
            }
        );
        
        this.evDonateCoins = CustomEvent.register(
            "mainmenu:coins",
            (coins: number) => {
                this.setState({donate: coins});
            }
        );
        this.evCrosshair = CustomEvent.register(
            "mainmenu:setCrosshairSettings",
            (settings: ICrosshairSettings) => {
                if (!settings)
                    return
                this.setState({
                    crosshairSettings: settings
                });
            }
        );

        this.closeRoulette = this.closeRoulette.bind(this);
    }

    closeRoulette() {
        this.setState({...this.state, shopPage: 0});
    }

    componentDidMount = () => {
        this.adsTime = setInterval(() => {
            if (this.state.page === "profile") this.adsPage(1);
        }, 5000);
    };

    get achievCount() {
        return Object.keys(this.state.achieve).length;
    }

    get achievCompleteCount() {
        return Object.values(this.state.achieve).filter((q) => q[1]).length;
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        
        if (this.evAsk) this.evAsk.destroy();
        if (this.evDonateCoins) this.evDonateCoins.destroy();
        if (this.adsTime) clearInterval(this.adsTime);
    }

    setPage = async (url: string) => {
        if (this.state.page === "ask")
            CustomEvent.triggerServer("ask:close");
        else if (url === "players" && this.state.page !== "players" && !CEF.test) {
            return CustomEvent.callServer("mainmenu:getOnline").then((players) => {
                this.setState({playersType: 0, players, page: url});
            });
        }
        this.setState({...this.state, page: url});
        if (url == 'aim') {
            setTimeout(() => {
                CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                CustomEvent.trigger('crosshair:enable')
                CustomEvent.trigger('crosshair:rerender')
            }, 15)// todo: fix
        }
    };
    renderWantedLevel = () => {
        let itms: JSX.Element[] = [];
        for (let id = 1; id <= 5; id++)
            itms.push(
                <div
                    key={id}
                    className={
                        "rating-item" + (this.state.wanted_level >= id ? " active" : "")
                    }
                >
                    <img src={svg["star"]} alt=""/>
                </div>
            );
        return itms;
    };
    inputPromo = () => {
        // Ввод промо this.state.promo
        CEF.enterPromocode(this.state.promo);
    };
    changePassword = () => {
        let old_password = this.state.passData[0]
            .replace(/"/g, "'")
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "");
        let password = this.state.passData[1]
            .replace(/"/g, "'")
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "");
        let password2 = this.state.passData[2]
            .replace(/"/g, "'")
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "");

        if (password.length < 6 || old_password.length < 6)
            return CEF.alert.setAlert(
                "error",
                "Длина пароль должна быть не меньше 6 символов"
            );
        if (password != password2) {
            return CEF.alert.setAlert("error", "Пароли не совпадают");
        }

        CustomEvent.callServer(
            "mainmenu:changePassword",
            old_password,
            password
        ).then((status: boolean) => {
            if (status) {
                this.setState({...this.state, passData: ["", "", ""]});
                CEF.alert.setAlert("success", "Пароль успешно изменён");
            } else {
                CEF.alert.setAlert("error", "Старый пароль указан не верно");
            }
        });
    };

    renderHotkeys(): JSX.Element[] {
        if (!this.state.hotkeys) return [];
        let draw: JSX.Element[] = [];
        draw.push(
            <div className="binder-grid-item binder-grid-item-primary">
                <p className="name">Сбросить настройки по умолчанию</p>
                <div className="downline">
                    <button
                        className="binder-btn"
                        onClick={(e) => {
                            let k = this.state.hotkeys;
                            for (let task in this.state.hotkeys) {
                                if (k[task] != (defaultHotkeys as any)[task]) {
                                    k[task] = (defaultHotkeys as any)[task];
                                    CustomEvent.triggerClient(
                                        "hotkeys:set",
                                        task,
                                        (defaultHotkeys as any)[task],
                                        false
                                    );
                                }
                            }
                            this.setState({hotkeyEdit: null, hotkeys: defaultHotkeys});
                            CEF.alert.setAlert("success", "Клавиши установлены по умолчанию");
                        }}
                    >
                        <p>Сбросить</p>
                    </button>
                </div>
            </div>
        );

        for (let catIndex in hotkeyCategories) {
            const cat = hotkeyCategories[catIndex];
            draw.push(<p className={"binder-category__title"}>{cat.name}</p>);
            cat.keys.forEach(el => {
                draw.push(this.drawItem(el));
            })
        }

        return draw;
    }
    drawItem(task: any) {
        return <div key={task} className="binder-grid-item">
            <p className="name">
                {getHotkeysName(task)}
                {getHotkeysNeedHold(task) ? (
                    <span style={{color: "#388bd6", marginLeft: 10}}>
                (Удержание)
              </span>
                ) : (
                    ``
                )}
            </p>
            <div className="downline">
                <div
                    className={`select-wrapper${
                        this.state.hotkeyOpen === task ? " active" : ""
                    } visible`}
                >
                    <div
                        className="select-dropdown active"
                        onClick={() =>
                            this.setState({
                                ...this.state,
                                selectedKey: null,
                                hotkeyOpen: this.state.hotkeyOpen === task ? null : task,
                            })
                        }
                    >
                        <p>
                            Клавиша{" "}
                            {
                                generateHotkeysButtonsArray().filter(
                                    (hotkey) =>
                                        hotkey[0] ==
                                        (this.state.selectedKey &&
                                        this.state.hotkeyEdit === task
                                            ? this.state.selectedKey
                                            : this.state.hotkeys[task])
                                )[0][1]
                            }
                        </p>
                        <span className="arrow-wrap">
                  <img src={svg["arrow-select"]} width="24" height="24"/>
                </span>
                    </div>
                    <ul className="list-dropdown-wrap">
                        {generateHotkeysButtonsArray().map((hotkey) => {
                            return (
                                <li
                                    key={hotkey[0]}
                                    onClick={() => {
                                        this.setState({
                                            ...this.state,
                                            hotkeyOpen: null,
                                            hotkeyEdit: task,
                                            selectedKey: hotkey[0],
                                        });
                                    }}
                                    className={`list-dropdown-item${
                                        hotkey[0] == this.state.hotkeys[task] ? " active" : ""
                                    }`}
                                >
                                    <p>Клавиша {hotkey[1].toString()}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {this.state.selectedKey && this.state.hotkeyEdit === task ? (
                    <>
                        <button
                            className="btn-binder-small cancel"
                            onClick={(e) => {
                                this.setState({
                                    ...this.state,
                                    hotkeyEdit: null,
                                    selectedKey: null,
                                });
                            }}
                        >
                            <img src={svg["cancel"]} width="24" height="24"/>
                        </button>
                        <button
                            className="btn-binder-small accept"
                            onClick={(e) => {
                                if (!this.state.selectedKey)
                                    return CEF.alert.setAlert(
                                        "error",
                                        "Выберите новую клавишу"
                                    );
                                if (this.state.selectedKey == this.state.hotkeys[task])
                                    return CEF.alert.setAlert(
                                        "error",
                                        "Вы пытаетесь назначить ту клавишу, которая уже была назначена"
                                    );
                                let k = this.state.hotkeys;
                                k[task] = parseInt(this.state.selectedKey as any);
                                this.setState({hotkeyEdit: null, hotkeys: k});
                                CustomEvent.triggerClient(
                                    "hotkeys:set",
                                    task,
                                    parseInt(this.state.selectedKey as any)
                                );
                            }}
                        >
                            <img src={svg["check"]} width="24" height="24"/>
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    }

    drawRule(rule: ruleItem) {
        let n = "";
        let d = "";
        switch (rule[2]) {
            case "ban":
                n = "Бан";
                break;
            case "jail":
                n = "Тюрьма";
                break;
            case "kick":
                n = "Кик";
                break;
            case "mute":
                n = "Блокировка чата";
                break;
            case "warn":
                n = "Предупреждение";
                break;
        }
        switch (rule[3]) {
            case "d":
                d = "Дней";
                break;
            case "m":
                d = "Минут";
                break;
            case "h":
                d = "Часов";
                break;
        }
        return (
            <p key={rule[0]}>
                {rule[0]}. {rule[1]}{" "}
                <strong>
                    | {n} на {rule[4]} {d}
                </strong>
            </p>
        );
    }

    getMaxExpLevel = (level: number) => {
        return getMaxExpLevel(level);
    };
    inputPay = (value: number) => {
        this.setState({shopPay: value});
    };
    pay = () => {
        /** Пополнить счет */
        if (!this.state.shopPay) return;
        CustomEvent.callServer("donate:add", this.state.shopPay).then((link) => {
            if (!link)
                return CEF.alert.setAlert("error", "Донаты временно отключены");
            CustomEvent.triggerClient("donate:add", link);
        });
    };
    buyVip = (id: string) => {
        /** Купить vip */
        this.setState({...this.state, buyVip: 0});
        console.log("buy vip ", id, this.state.buyVipTime);
        CustomEvent.triggerServer("mainmenu:buyVip", id, this.state.buyVipTime);
    };
    buyShop = (id: number, value?: number | string) => {
        console.log(id, value);
        /** купить донат услуги */
        CustomEvent.triggerServer("mainmenu:buyShop", id, value);
    };
    buyPacket = (id: number) => {
        console.log(id);
        /** купить пакет услун */
        CustomEvent.triggerServer("mainmenu:buyPacket", id);
    };
    selectVip = (id: number) => {
        this.setState({...this.state, buyVip: id, buyVipTime: 1});
    };

    adsPage = (page: number) => {
        let _newpage = this.state.curAd + page;
        if (_newpage >= this.state.ads.length) _newpage = 0;
        if (_newpage < 0) _newpage = this.state.ads.length - 1;
        this.setState({...this.state, curAd: _newpage});
    };

    get currentAsk() {
        if (!this.state.ask.select) return null;
        return this.state.ask.items.find(
            (item) => item.id === this.state.ask.select
        );
    }

    selectAsk = (id: string) => {
        /* Добавить получение сообщений */
        this.setState({ask: {...this.state.ask, select: id}});
    };

    render() {
        if (!this.state.loaded) return <></>;
        if (!this.state.page) return <></>;
        return (
            <>
                <div className="main-menu">
                    <div className="grid-img">
                        <img src={svg["grid-img"]} width="24" height="24"></img>
                    </div>
                    <div className="bg-radial-main-menu"></div>
                    <div className="main-menu-wrapper">
                        {this.state.buyVip > 0 || this.state.buyModal > 0 ? (
                            <div className="modal-exchange-coins v1">
                                <div
                                    className={`modal-exchange-coins-wrap${
                                        this.state.buyModal > 0 ? " active" : ""
                                    }`}
                                >
                                    <div className="close">
                                        <img
                                            src={svg["close-dark"]}
                                            onClick={() =>
                                                this.setState({...this.state, buyModal: 0})
                                            }
                                            width="32"
                                            height="32"
                                        />
                                    </div>
                                    <div className="form-wrap">
                                        {this.state.buyModal === 4 ? (
                                            <p className="mini-title">
                                                Обмен коинов <br/>
                                                на вирт
                                            </p>
                                        ) : null}
                                        {this.state.buyModal === 1 ? (
                                            <p className="mini-title">Смена имени</p>
                                        ) : null}
                                        {this.state.buyModal === 5 ? (
                                            <p className="mini-title">Смена возраста</p>
                                        ) : null}
                                        <div className="input-coins-wrap">
                                            <div className="input-item">
                                                <input
                                                    type={this.state.buyModal !== 1 ? "number" : "text"}
                                                    placeholder={
                                                        this.state.buyModal === 4
                                                            ? "Сумма коинов"
                                                            : this.state.buyModal === 1
                                                                ? "Новое имя"
                                                                : "Новый возраст"
                                                    }
                                                    value={
                                                        this.state.buyModal === 1
                                                            ? this.state.buyName.length > 0
                                                                ? this.state.buyName
                                                                : ""
                                                            : this.state.buyCoin > 0
                                                                ? this.state.buyCoin
                                                                : ""
                                                    }
                                                    maxLength={
                                                        this.state.buyModal === 4
                                                            ? 5
                                                            : this.state.buyModal === 1
                                                                ? 24
                                                                : 3
                                                    }
                                                    onChange={(e) => {
                                                        switch (this.state.buyModal) {
                                                            case 4: {
                                                                if (
                                                                    parseInt(e.target.value) < 1 ||
                                                                    parseInt(e.target.value) > 99999
                                                                )
                                                                    return;
                                                                this.setState({
                                                                    ...this.state,
                                                                    buyCoin: parseInt(e.target.value),
                                                                });
                                                                return;
                                                            }
                                                            case 5: {
                                                                if (
                                                                    parseInt(e.target.value) < 1 ||
                                                                    parseInt(e.target.value) > 99
                                                                )
                                                                    return;
                                                                this.setState({
                                                                    ...this.state,
                                                                    buyCoin: parseInt(e.target.value),
                                                                });
                                                                return;
                                                            }
                                                            case 1: {
                                                                if (
                                                                    e.target.value.match(
                                                                        /^[ a-zA-Z0-9_-]{0,24}$/i
                                                                    )
                                                                )
                                                                    this.setState({
                                                                        ...this.state,
                                                                        buyName: e.target.value,
                                                                    });
                                                                return;
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <button
                                                className="mm-primary-btn mm-primary-btn-mini orange"
                                                onClick={() => {
                                                    this.buyShop(
                                                        this.state.buyModal,
                                                        this.state.buyModal == 1
                                                            ? this.state.buyName
                                                            : this.state.buyCoin
                                                    );
                                                    this.setState({...this.state, buyModal: 0});
                                                }}
                                            >
                                                <img src={svg["wallet"]} width="24" height="24"/>
                                                <p>
                                                    {this.state.buyModal === 4 ? "Обменять" : "Сменить"}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                    {this.state.buyModal > 0 ? (
                                        <div className="img-wrap">
                                            <img
                                                src={
                                                    png[
                                                        Donate_Items.find(
                                                            (data) => data.id == this.state.buyModal
                                                        ).pic
                                                        ]
                                                }
                                                alt=""
                                            />
                                            {/* <img src={png['d-virt']} alt=""/> */}
                                        </div>
                                    ) : null}
                                </div>
                                {this.state.buyVip > 0 ? (
                                    <div
                                        className={`modal-exchange-coins-wrap${
                                            this.state.buyVip > 0 ? " active" : ""
                                        }`}
                                    >
                                        <div className="close">
                                            <img
                                                src={svg["close-dark"]}
                                                onClick={() =>
                                                    this.setState({...this.state, buyVip: 0})
                                                }
                                                width="32"
                                                height="32"
                                            />
                                        </div>
                                        <div className="form-wrap">
                                            <p className="mini-title">
                                                Выберите срок
                                                <br/>
                                                {
                                                    VIP_TARIFS.filter((q) => q.cost)[
                                                    this.state.buyVip - 1
                                                        ].name
                                                }{" "}
                                                VIP
                                            </p>
                                            <div className="input-coins-wrap input-coins-term-wrap">
                                                <div className="input-term-wrap">
                                                    <div className="input-term-item">
                                                        <input
                                                            type="radio"
                                                            id="term1"
                                                            name="rate"
                                                            className={`rates-item active`}
                                                            onClick={() =>
                                                                this.setState({...this.state, buyVipTime: 1})
                                                            }
                                                            checked={
                                                                this.state.buyVipTime === 1 ? true : false
                                                            }
                                                            readOnly
                                                        />
                                                        <label htmlFor="term1">
                                                            <p className="small">1 месяц</p>
                                                            <p className="big">
                                                                {
                                                                    VIP_TARIFS.filter((q) => q.cost)[
                                                                    this.state.buyVip - 1
                                                                        ].cost
                                                                }{" "}
                                                                ₽
                                                            </p>
                                                        </label>
                                                    </div>

                                                    <div className="input-term-item">
                                                        <input
                                                            id="term2"
                                                            type="radio"
                                                            name="rate"
                                                            className={`rates-item active`}
                                                            onClick={() =>
                                                                this.setState({...this.state, buyVipTime: 2})
                                                            }
                                                            checked={
                                                                this.state.buyVipTime === 2 ? true : false
                                                            }
                                                            readOnly
                                                        />
                                                        <label htmlFor="term2">
                                                            <p className="small">2 месяца</p>
                                                            <p className="big">
                                                                {VIP_TARIFS.filter((q) => q.cost)[
                                                                this.state.buyVip - 1
                                                                    ].cost * 2}{" "}
                                                                ₽
                                                            </p>
                                                        </label>
                                                    </div>

                                                    <div className="input-term-item">
                                                        <input
                                                            id="term3"
                                                            type="radio"
                                                            name="rate"
                                                            className={`rates-item active`}
                                                            onClick={() =>
                                                                this.setState({...this.state, buyVipTime: 3})
                                                            }
                                                            checked={
                                                                this.state.buyVipTime === 3 ? true : false
                                                            }
                                                            readOnly
                                                        />
                                                        <label htmlFor="term3">
                                                            <p className="small">3 месяца</p>
                                                            <p className="big">
                                                                {VIP_TARIFS.filter((q) => q.cost)[
                                                                this.state.buyVip - 1
                                                                    ].cost * 3}{" "}
                                                                ₽
                                                            </p>
                                                        </label>
                                                    </div>
                                                </div>
                                                <button
                                                    style={{marginTop: "2vh"}}
                                                    onClick={() =>
                                                        this.buyVip(
                                                            VIP_TARIFS.filter((q) => q.cost)[
                                                            this.state.buyVip - 1
                                                                ].id
                                                        )
                                                    }
                                                    className="mm-primary-btn mm-primary-btn-mini orange"
                                                >
                                                    <img src={svg["check"]} width="24" height="24"/>
                                                    <p>Купить</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="tabs-main-menu">
                            <ul className="tabs__caption">
                                {pages.map((item, id) => {
                                    return (
                                        <li
                                            key={id}
                                            className={
                                                this.state.page === item[0] ||
                                                ([
                                                        "settings",
                                                        "settings_auth",
                                                        "settings_voice",
                                                        "settings_promo",
                                                        "settings_aim",
                                                        "settings_alert",
                                                    ].includes(this.state.page) &&
                                                    item[0] == "settings")
                                                    ? "active"
                                                    : id == 3
                                                        ? "bg-li-favourite"
                                                        : ""
                                            }
                                            onClick={() => this.setPage(item[0])}
                                        >
                                            <div className="icon-wrap">
                                                <img src={svg[item[2]]} width="32" height="32"></img>
                                            </div>
                                            <p>{item[1]}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            {this.state.shopPage === 4 && this.state.page === "vip" ? (
                                <DonateRoulette
                                    close={this.closeRoulette}
                                    coins={this.state.donate}
                                    dollars={CEF.user.money}
                                />
                            ) : (
                                <div className="tabs__content-wrap">
                                    <div className="tabs__content">
                                        {this.state.page === "achiev" ? (
                                            <SocketSync
                                                path={"achiev"}
                                                data={(d) => {
                                                    const q = JSON.parse(d as any);
                                                    this.setState({achieve: q[1], achieveDaily: q[0]});
                                                }}
                                            >
                                                <div className="achieve-wrapper">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="achieve-left">
                                                        <i className="ach-bg-left-img">
                                                            <img src={achievepng["bg-achievements"]} alt=""/>
                                                        </i>
                                                        <img src={achievesvg["win"]} alt=""/>
                                                        <div>
                                                            <p className="ach-your">ваши</p>
                                                            <p className="ach-title">Достижения</p>
                                                        </div>
                                                        <div className="ach-left-progress-line">
                                                            <p>
                                                                {this.achievCompleteCount}{" "}
                                                                <span>/ {this.achievCount}</span>
                                                            </p>
                                                            <div className="ach-progress">
                                                                <i
                                                                    style={{
                                                                        width: `${
                                                                            (this.achievCount / 100) *
                                                                            this.achievCompleteCount
                                                                        }%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="achieve-right-oveflow">
                                                        <div className="achieve-right">
                                                            <div className="achieve-grid">
                                                                {Object.keys(this.state.achieveDaily).map(
                                                                    (key: UserAchievmentKey, i) => {
                                                                        const cfg = getTempAchievConfig(key);
                                                                        if (!cfg) return <></>;
                                                                        const val = this.state.achieveDaily[key];
                                                                        return (
                                                                            <div
                                                                                className={
                                                                                    "achieve-item " +
                                                                                    (val[1]
                                                                                        ? val[1] === 1
                                                                                            ? "take-achieve"
                                                                                            : "success"
                                                                                        : "")
                                                                                }
                                                                                key={`achieve_d_${i}`}
                                                                                onClick={(e) => {
                                                                                    if (val[1] !== 1) return;
                                                                                    e.preventDefault();
                                                                                    this.state.achieveDaily[key][1] = 2;
                                                                                    this.setState({
                                                                                        achieveDaily: this.state
                                                                                            .achieveDaily,
                                                                                    });
                                                                                    CustomEvent.triggerServer(
                                                                                        "achieveD",
                                                                                        key
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="ach-top">
                                                                                    <div className="ach-everyday">
                                                                                        <img
                                                                                            src={achievesvg["clipboard"]}
                                                                                            alt=""
                                                                                        />{" "}
                                                                                        Ежедневное
                                                                                    </div>
                                                                                    <img
                                                                                        src={
                                                                                            achievementsLogo[cfg.key] ||
                                                                                            achievementsLogo["img-achieve"]
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                                <div className="ach-item-content">
                                                                                    <div className="ach-item-count">
                                                                                        <div
                                                                                            className="ach-progress-vertical">
                                                                                            <i
                                                                                                style={{
                                                                                                    height: `${
                                                                                                        (val[0] / cfg.max) * 100
                                                                                                    }%`,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <p>
                                                                                            <strong>
                                                                                                {system.numberFormat(val[0])}
                                                                                            </strong>{" "}
                                                                                            / {system.numberFormat(cfg.max)}
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="ach-item-title">
                                                                                        {cfg.name}
                                                                                    </p>
                                                                                    <p className="ach-item-text">
                                                                                        {cfg.desc}
                                                                                    </p>
                                                                                    {cfg.reward ? (
                                                                                        <div
                                                                                            className="ach-item-gift-line">
                                                                                            {cfg.reward.exp ? (
                                                                                                <div>+{cfg.reward.exp} EXP</div>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}
                                                                                            {cfg.reward.money ? (
                                                                                                <div>
                                                                                                    +$
                                                                                                    {system.numberFormat(
                                                                                                        cfg.reward.money
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}

                                                                                            {cfg.reward.item
                                                                                                ? cfg.reward.item.map(
                                                                                                    (item, rid) => {
                                                                                                        return (
                                                                                                            <TooltipClass
                                                                                                                text={getBaseItemNameById(
                                                                                                                    item
                                                                                                                )}
                                                                                                            >
                                                                                                                <div
                                                                                                                    className="ach-object"
                                                                                                                    key={`ach_d_${i}_${rid}`}
                                                                                                                >
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            iconsItems[
                                                                                                                            "Item_" + item
                                                                                                                                ]
                                                                                                                        }
                                                                                                                        alt=""
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </TooltipClass>
                                                                                                        );
                                                                                                    }
                                                                                                )
                                                                                                : ""}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <></>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}

                                                                {Object.keys(this.state.achieve).map(
                                                                    (key: UserAchievmentKey, i) => {
                                                                        const cfg = getAchievConfig(key);
                                                                        if (!cfg) return <></>;
                                                                        const val = this.state.achieve[key];
                                                                        return (
                                                                            <div
                                                                                className={
                                                                                    "achieve-item " +
                                                                                    (val[1]
                                                                                        ? val[1] === 1
                                                                                            ? "take-achieve"
                                                                                            : "success"
                                                                                        : "")
                                                                                }
                                                                                key={`achieve_${i}`}
                                                                                onClick={(e) => {
                                                                                    if (val[1] !== 1) return;
                                                                                    e.preventDefault();
                                                                                    this.state.achieve[key][1] = 2;
                                                                                    this.setState({
                                                                                        achieve: this.state.achieve,
                                                                                    });
                                                                                    CustomEvent.triggerServer(
                                                                                        "achieve",
                                                                                        key
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="ach-top">
                                                                                    <img
                                                                                        src={
                                                                                            achievementsLogo[cfg.key] ||
                                                                                            achievementsLogo["img-achieve"]
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                                <div className="ach-item-content">
                                                                                    <div className="ach-item-count">
                                                                                        <div
                                                                                            className="ach-progress-vertical">
                                                                                            <i
                                                                                                style={{
                                                                                                    height: `${
                                                                                                        (val[0] / cfg.max) * 100
                                                                                                    }%`,
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <p>
                                                                                            <strong>
                                                                                                {system.numberFormat(val[0])}
                                                                                            </strong>{" "}
                                                                                            / {system.numberFormat(cfg.max)}
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="ach-item-title">
                                                                                        {cfg.name}
                                                                                    </p>
                                                                                    <p className="ach-item-text">
                                                                                        {cfg.desc}
                                                                                    </p>
                                                                                    {cfg.reward ? (
                                                                                        <div
                                                                                            className="ach-item-gift-line">
                                                                                            {cfg.reward.exp ? (
                                                                                                <div>+{cfg.reward.exp} EXP</div>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}
                                                                                            {cfg.reward.money ? (
                                                                                                <div>
                                                                                                    +$
                                                                                                    {system.numberFormat(
                                                                                                        cfg.reward.money
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}

                                                                                            {cfg.reward.item
                                                                                                ? cfg.reward.item.map(
                                                                                                    (item, rid) => {
                                                                                                        return (
                                                                                                            <TooltipClass
                                                                                                                text={getBaseItemNameById(
                                                                                                                    item
                                                                                                                )}
                                                                                                            >
                                                                                                                <div
                                                                                                                    className="ach-object"
                                                                                                                    key={`ach_${i}_${rid}`}
                                                                                                                >
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            iconsItems[
                                                                                                                            "Item_" + item
                                                                                                                                ]
                                                                                                                        }
                                                                                                                        alt=""
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </TooltipClass>
                                                                                                        );
                                                                                                    }
                                                                                                )
                                                                                                : ""}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <></>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SocketSync>
                                        ) : (
                                            <></>
                                        )}
                                        {this.state.page === "profile" ? (
                                            <>
                                                <div className="mm-tab-in">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="leftside leftside-dark">
                                                        <div className="topline">
                                                            <p className="middle-title">
                                                                {this.state.rp_name}
                                                            </p>
                                                            <div className="mm-progressbar-wrap">
                                                                <div
                                                                    className="mm-progressbar-item mm-progressbar-item-level">
                                                                    <div className="circle-wrap">
                                                                        <Circle
                                                                            percent={
                                                                                (this.state.exp /
                                                                                    this.getMaxExpLevel(
                                                                                        this.state.level
                                                                                    )) *
                                                                                100
                                                                            }
                                                                            strokeWidth={4}
                                                                            trailWidth={4}
                                                                            strokeColor="#ffffff"
                                                                            trailColor="rgba(196, 196, 196, 0.2)"
                                                                        />
                                                                        <div className="text-wrap">
                                                                            <p className="big-value">
                                                                                {this.state.level}
                                                                            </p>
                                                                            <p>
                                                                                {this.state.exp}/
                                                                                {this.getMaxExpLevel(this.state.level)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="descr">Уровень</p>
                                                                </div>
                                                                <div className="mm-progressbar-item">
                                                                    <div className="circle-wrap">
                                                                        <Circle
                                                                            percent={Math.floor(this.state.food / 10)}
                                                                            strokeWidth={4}
                                                                            trailWidth={4}
                                                                            strokeColor="#E3256B"
                                                                            trailColor="rgba(196, 196, 196, 0.2)"
                                                                        />
                                                                        <div className="text-wrap">
                                                                            <p className="big-value">
                                                                                {Math.floor(this.state.food / 10)}%
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="descr">Голод</p>
                                                                </div>
                                                                <div className="mm-progressbar-item">
                                                                    <div className="circle-wrap">
                                                                        <Circle
                                                                            percent={Math.floor(
                                                                                this.state.water / 10
                                                                            )}
                                                                            strokeWidth={4}
                                                                            trailWidth={4}
                                                                            strokeColor="#2D9CDB"
                                                                            trailColor="rgba(196, 196, 196, 0.2)"
                                                                        />
                                                                        <div className="text-wrap">
                                                                            <p className="big-value">
                                                                                {Math.floor(this.state.water / 10)}%
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="descr">Жажда</p>
                                                                </div>
                                                            </div>
                                                            <div className="extra-info-wrap">
                                                                <div
                                                                    className={
                                                                        "sex-wrap" +
                                                                        (this.state.man === true
                                                                            ? " male"
                                                                            : " female")
                                                                    }
                                                                >
                                                                    <div className="sex-male">
                                                                        <img
                                                                            src={svg["male"]}
                                                                            width="24"
                                                                            height="24"
                                                                        />
                                                                    </div>
                                                                    <div className="sex-female">
                                                                        <img
                                                                            src={svg["female"]}
                                                                            width="24"
                                                                            height="24"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="rating-wrap">
                                                                    {this.renderWantedLevel()}
                                                                </div>
                                                            </div>
                                                            <div className="vip-wrap">
                                                                {this.state.vipId ? (
                                                                    <svg
                                                                        width="18"
                                                                        height="18"
                                                                        viewBox="0 0 20 20"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M10 3C9.14252 3 8.43478 3.70334 8.43478 4.55556C8.43478 4.92531 8.56851 5.26544 8.7894 5.53385L6.44769 9.25868L3.7269 8.0434C3.73492 7.98415 3.73913 7.92237 3.73913 7.86111C3.73913 7.11629 3.11901 6.5 2.36957 6.5C1.62012 6.5 1 7.11629 1 7.86111C1 8.37317 1.29475 8.82609 1.72147 9.05816L3.93478 14.1927V16.4167C3.93482 16.7221 4.21441 17 4.52174 17H15.4783C15.7856 17 16.0652 16.7221 16.0652 16.4167V14.1927L18.2785 9.05816C18.7052 8.82609 19 8.37317 19 7.86111C19 7.11629 18.3799 6.5 17.6304 6.5C16.881 6.5 16.2609 7.11629 16.2609 7.86111C16.2609 7.92237 16.2651 7.98415 16.2731 8.0434L13.5523 9.25868L11.2106 5.53385C11.4316 5.26544 11.5652 4.9253 11.5652 4.55556C11.5652 3.70335 10.8575 3 10 3ZM10 4.16667C10.223 4.16667 10.3913 4.33388 10.3913 4.55556C10.3913 4.77723 10.223 4.94444 10 4.94444C9.77698 4.94444 9.6087 4.77722 9.6087 4.55556C9.6087 4.33389 9.77698 4.16667 10 4.16667ZM9.81046 6.09896C9.87293 6.10666 9.93563 6.11111 10 6.11111C10.0644 6.11111 10.1271 6.10666 10.1895 6.09896L12.8308 10.3038C12.9788 10.5389 13.3091 10.6401 13.5645 10.5286L16.9273 9.0217C16.9519 9.03656 16.9752 9.05698 17.0007 9.07031L15.0931 13.5H4.90693L2.99932 9.07031C3.02479 9.05697 3.04814 9.03655 3.07269 9.0217L6.43546 10.5286C6.69089 10.6401 7.02124 10.5389 7.16916 10.3038L9.81046 6.09896ZM2.36957 7.66667C2.48455 7.66667 2.56522 7.74683 2.56522 7.86111C2.56522 7.9754 2.48455 8.05556 2.36957 8.05556C2.25458 8.05556 2.17391 7.9754 2.17391 7.86111C2.17391 7.74683 2.25458 7.66667 2.36957 7.66667ZM17.6304 7.66667C17.7454 7.66667 17.8261 7.74683 17.8261 7.86111C17.8261 7.9754 17.7454 8.05556 17.6304 8.05556C17.5154 8.05556 17.4348 7.9754 17.4348 7.86111C17.4348 7.74683 17.5154 7.66667 17.6304 7.66667ZM5.1087 14.6667H14.8913V15.8333H5.1087V14.6667Z"
                                                                            fill={
                                                                                this.state.vipId &&
                                                                                getVipConfig(this.state.vipId)
                                                                                    ? getVipConfig(this.state.vipId).color
                                                                                    : "#ffffff"
                                                                            }
                                                                        />
                                                                    </svg>
                                                                ) : null}
                                                                <p
                                                                    style={{
                                                                        color: getVipConfig(this.state.vipId)
                                                                            ? getVipConfig(this.state.vipId).color
                                                                            : null,
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    {this.state.vipId &&
                                                                    getVipConfig(this.state.vipId) &&
                                                                    systemUtil.timestamp < this.state.vipEnd &&
                                                                    getVipConfig(this.state.vipId) ? (
                                                                        <>
                                                                            {getVipConfig(this.state.vipId).name} до{" "}
                                                                            {systemUtil.timeStampString(
                                                                                this.state.vipEnd
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>VIP отсутствует</>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="downline">
                                                            {this.state.carbonus ? (
                                                                <div className="time-gaming-wrapper">
                                                                    <div className="time-gaming-wrapper-gift">
                                                                        <img src={carbonus}/>
                                                                    </div>
                                                                    <p>
                                                                        <strong>
                                                                            ОТЫГРАЙТЕ{" "}
                                                                            {Math.floor(
                                                                                MINUTES_FOR_PLAY_REWARD_MAX / 60
                                                                            )}{" "}
                                                                            ЧАСОВ
                                                                            <br/>И ПОЛУЧИТЕ{" "}
                                                                            {CAR_NAME_FOR_CEF_FOR_PLAY_REWARD_MAX}
                                                                        </strong>
                                                                        <br/>
                                                                        <span>ОСТАЛОСЬ</span>{" "}
                                                                        {system.secondsToString(
                                                                            MINUTES_FOR_PLAY_REWARD_MAX -
                                                                            this.state.carbonus
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            ) : null}
                                                            {this.state.bonus ? (
                                                                <div className="time-gaming-wrapper">
                                                                    <div className="time-gaming-wrapper-gift">
                                                                        <img src={png["200coins"]}/>
                                                                    </div>
                                                                    {this.state.bonus >= PLAYTIME_TIME * 60 ? (
                                                                        <p>
                                                                            <strong>
                                                                                ВЫ ОТЫГРАЛИ {PLAYTIME_TIME} ЧАСОВ
                                                                            </strong>
                                                                            <br/>
                                                                            <span>ПРИЗ НАЧИСЛЕН</span>
                                                                        </p>
                                                                    ) : (
                                                                        <p>
                                                                            <strong>
                                                                                ОТЫГРАЙТЕ {PLAYTIME_TIME} ЧАСОВ
                                                                                <br/>И ПОЛУЧИТЕ{" "}
                                                                                {PLAYTIME_TYPE === "donate" ? "" : `$`}
                                                                                {systemUtil.numberFormat(
                                                                                    PLAYTIME_MONEY
                                                                                )}{" "}
                                                                                {PLAYTIME_TYPE === "donate"
                                                                                    ? DONATE_MONEY_NAMES[2]
                                                                                    : ``}
                                                                            </strong>
                                                                            <br/>
                                                                            <span>ОСТАЛОСЬ</span>{" "}
                                                                            {system.secondsToString(
                                                                                PLAYTIME_TIME * 60 - this.state.bonus
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                            {this.state.bankNumber ? (
                                                                <div className="mm-bank-info">
                                                                    <img
                                                                        src={svg["ccard"]}
                                                                        width="24"
                                                                        height="24"
                                                                    />
                                                                    <div>
                                                                        <p style={{opacity: 0.5}}>
                                                                            №{this.state.bankNumber}
                                                                        </p>
                                                                        <p>${CEF.user.bank}</p>
                                                                    </div>
                                                                    <button
                                                                        className="placemark"
                                                                        onClick={() => {
                                                                            CEF.setGPS(
                                                                                this.state.bankPos.x,
                                                                                this.state.bankPos.y
                                                                            );
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={svg["route"]}
                                                                            width="24"
                                                                            height="24"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ) : null}
                                                            <div className="block-and-warn-info">
                                                                {/* <p>{this.state.bans} блокировок</p> */}
                                                                <p className="active">
                                                                    {this.state.warns} предупреждения
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-main-wrap profile-tab-main-wrap">
                                                        <div className="profile-location-grid">
                                                            <div className="profile-location-grid-item">
                                                                <div className="topline">
                                                                    <p className="mini-title">
                                                                        {this.state.house ||
                                                                        "Вы нигде не проживаете"}
                                                                    </p>
                                                                </div>
                                                                <div className="descr-wrap">
                                                                    <img
                                                                        src={svg["home"]}
                                                                        width="24"
                                                                        height="24"
                                                                    />
                                                                    <p>Место жительства</p>
                                                                </div>
                                                            </div>
                                                            <div className="profile-location-grid-item">
                                                                <div className="topline">
                                                                    <p className="mini-title">
                                                                        {this.state.business ||
                                                                        "Вы не владеете бизнесом"}
                                                                    </p>
                                                                </div>
                                                                <div className="descr-wrap">
                                                                    <img
                                                                        src={svg["presentation"]}
                                                                        width="24"
                                                                        height="24"
                                                                    />
                                                                    <p>Бизнес</p>
                                                                </div>
                                                            </div>
                                                            <div className="profile-location-grid-item">
                                                                <div className="topline">
                                                                    <p className="mini-title">Место работы</p>
                                                                    <p className="descr">
                                                                        {this.state.work &&
                                                                        getJobData(this.state.work)
                                                                            ? getJobData(this.state.work).name
                                                                            : "Вы не работаете"}
                                                                    </p>
                                                                    <button
                                                                        className="btn-find-job"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                ...this.state,
                                                                                page: "jobs",
                                                                                selectJob: 0,
                                                                            })
                                                                        }
                                                                    >
                                                                        <p>найти работу</p>
                                                                    </button>
                                                                </div>
                                                                <div className="descr-wrap">
                                                                    <img
                                                                        src={svg["glasses"]}
                                                                        width="24"
                                                                        height="24"
                                                                    />
                                                                    <p>Работа</p>
                                                                </div>
                                                            </div>
                                                            <div className="profile-location-grid-item">
                                                                <div className="topline">
                                                                    <p className="mini-title">
                                                                        {this.state.fraction ||
                                                                        "Вы не числитесь в организации"}
                                                                    </p>
                                                                    <p className="descr">
                                                                        {this.state.rank
                                                                            ? `(${this.state.rank})`
                                                                            : ""}
                                                                    </p>
                                                                </div>
                                                                <div className="descr-wrap">
                                                                    <img
                                                                        src={svg["case"]}
                                                                        width="24"
                                                                        height="24"
                                                                    />
                                                                    <p>Организация</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="slider">
                                                            <div className="profile-slider">
                                                                <div className="profile-slider-wrapper">
                                                                    <div
                                                                        className="slider-item"
                                                                        style={{height: "100%"}}
                                                                    >
                                                                        <div
                                                                            className="profile-slider-wrap mm-slider-profile">
                                                                            {this.state.ads.map((data, id) => {
                                                                                return (
                                                                                    <div
                                                                                        key={id}
                                                                                        className="in-slider-item"
                                                                                        style={{
                                                                                            position: "absolute",
                                                                                            left:
                                                                                                id !== this.state.curAd
                                                                                                    ? `${
                                                                                                        (id - this.state.curAd) *
                                                                                                        19.625
                                                                                                    }vw`
                                                                                                    : `0.5vw`,
                                                                                        }}
                                                                                    >
                                                                                        <div className="topline">
                                                                                            <p className="mini-title">
                                                                                                {data.title}
                                                                                            </p>
                                                                                            <p className="descr">
                                                                                                {data.text}
                                                                                            </p>
                                                                                        </div>
                                                                                        {data.pic ? (
                                                                                            <div className="img-wrap">
                                                                                                <img
                                                                                                    src={adspng[data.pic]}
                                                                                                    alt=""
                                                                                                />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <></>
                                                                                        )}
                                                                                        {data.pos && data.button ? (
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.preventDefault();
                                                                                                    CEF.setGPS(
                                                                                                        data.pos.x,
                                                                                                        data.pos.y
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                {data.button}
                                                                                            </button>
                                                                                        ) : (
                                                                                            <></>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="control-slider-wrap">
                                                                <div className="arrow-wrap-slider">
                                                                    <div
                                                                        className="prev"
                                                                        onClick={() => this.adsPage(-1)}
                                                                    >
                                                                        <img
                                                                            src={svg["arrow-left"]}
                                                                            width="24"
                                                                            height="24"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="next"
                                                                        onClick={() => this.adsPage(1)}
                                                                    >
                                                                        <img
                                                                            src={svg["arrow-right"]}
                                                                            width="24"
                                                                            height="24"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="dots-wrap-slider"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "jobs" ? (
                                            <>
                                                <div className="mm-tab-in" style={{opacity: 0}}></div>
                                                <div className={`mm-list-work active`}>
                                                    <div
                                                        className="close"
                                                        onClick={() => {
                                                            console.log("test");
                                                            this.setState({...this.state, page: "profile"});
                                                        }}
                                                    >
                                                        <img src={svg["close"]} width="32" height="32"/>
                                                    </div>
                                                    <div
                                                        className="tabs__caption-mmlistwork-wrap tabs__caption-primary-wrap">
                                                        <ul className="tabs__caption-mmlistwork tabs__caption-primary">
                                                            {jobsList.map((item, index) => {
                                                                return (
                                                                    <li
                                                                        key={`job` + index}
                                                                        onClick={() =>
                                                                            this.setState({selectJob: index})
                                                                        }
                                                                        className={
                                                                            this.state.selectJob === index
                                                                                ? "active"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <p className="name">{item.name}</p>
                                                                        <p className="descr">{item.desc}</p>
                                                                    </li>
                                                                );
                                                            })}
                                                            {JOBS_ADVANCED_LIST.map((item, index) => {
                                                                return (
                                                                    <li
                                                                        key={`jobadvanced` + index}
                                                                        onClick={() =>
                                                                            this.setState({selectJob: index + 1000})
                                                                        }
                                                                        className={
                                                                            this.state.selectJob === index + 1000
                                                                                ? "active"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        <p className="name">{item.name}</p>
                                                                        <p className="descr">{item.desc}</p>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className="tabs__content-wrap-mmlistwork tabs__content-wrap-primary">
                                                        <div
                                                            className="tabs__content-mmlistwork  tabs__content-primary active">
                                                            {this.state.selectJob >= 1000 ? (
                                                                <div className="mm-text-wrapper">
                                                                    <div className="topline">
                                                                        <p className="name">
                                                                            {
                                                                                JOBS_ADVANCED_LIST[
                                                                                this.state.selectJob - 1000
                                                                                    ].name
                                                                            }
                                                                        </p>
                                                                        <button
                                                                            className="placemark"
                                                                            onClick={() => {
                                                                                CEF.setGPS(
                                                                                    JOBS_ADVANCED_LIST[
                                                                                    this.state.selectJob - 1000
                                                                                        ].pos.x,
                                                                                    JOBS_ADVANCED_LIST[
                                                                                    this.state.selectJob - 1000
                                                                                        ].pos.y
                                                                                );
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={svg["route"]}
                                                                                width="24"
                                                                                height="24"
                                                                            />
                                                                        </button>
                                                                        <p className="descr">Поставить метку</p>
                                                                    </div>
                                                                    <div className="text-wrap">
                                                                        <p style={{whiteSpace: "pre-line"}}>
                                                                            {
                                                                                JOBS_ADVANCED_LIST[
                                                                                this.state.selectJob - 1000
                                                                                    ].descFull
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="mm-text-wrapper">
                                                                    <div className="topline">
                                                                        <p className="name">
                                                                            {jobsList[this.state.selectJob].name}
                                                                        </p>
                                                                        <button
                                                                            className="placemark"
                                                                            onClick={() => {
                                                                                CEF.setGPS(
                                                                                    jobsList[this.state.selectJob].pos.x,
                                                                                    jobsList[this.state.selectJob].pos.y,
                                                                                    jobsList[this.state.selectJob].pos.z
                                                                                );
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={svg["route"]}
                                                                                width="24"
                                                                                height="24"
                                                                            />
                                                                        </button>
                                                                        <p className="descr">Поставить метку</p>
                                                                    </div>
                                                                    <div className="text-wrap">
                                                                        {jobsList[this.state.selectJob].tasks.map(
                                                                            (data, index) => {
                                                                                return (
                                                                                    <p
                                                                                        style={{
                                                                                            whiteSpace: "pre-line",
                                                                                            marginBottom: "1vw",
                                                                                        }}
                                                                                        key={index}
                                                                                    >
                                                                                        {data.desc}
                                                                                    </p>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "players" ? (
                                            <>
                                                <div className="mm-tab-in">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="leftside leftside-dark">
                                                        <div className="topline">
                                                            <p className="middle-title">Список игроков</p>
                                                            <ul className="tabs__caption-toplistdesign">
                                                                <li
                                                                    className={
                                                                        this.state.playersType === 0 ? `active` : ``
                                                                    }
                                                                    onClick={() => {
                                                                        if (this.state.playersType === 0) return;
                                                                        CustomEvent.callServer(
                                                                            "mainmenu:getOnline"
                                                                        ).then((players) => {
                                                                            this.setState({
                                                                                playersType: 0,
                                                                                players,
                                                                            });
                                                                        });
                                                                    }}
                                                                >
                                                                    <p className="name">Список игроков</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.playersType === 1 ? `active` : ``
                                                                    }
                                                                    onClick={() => {
                                                                        if (this.state.playersType === 1) return;
                                                                        CustomEvent.callServer(
                                                                            "mainmenu:getRich"
                                                                        ).then((players) => {
                                                                            this.setState({
                                                                                playersType: 1,
                                                                                players,
                                                                            });
                                                                        });
                                                                    }}
                                                                >
                                                                    <p className="name">Самые богатые</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.playersType === 2 ? `active` : ``
                                                                    }
                                                                    onClick={() => {
                                                                        if (this.state.playersType === 2) return;
                                                                        CustomEvent.callServer(
                                                                            "mainmenu:getActive"
                                                                        ).then((players) => {
                                                                            this.setState({
                                                                                playersType: 2,
                                                                                players,
                                                                            });
                                                                        });
                                                                    }}
                                                                >
                                                                    <p className="name">Самые активные</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.playersType === 3 ? `active` : ``
                                                                    }
                                                                    onClick={() => {
                                                                        if (this.state.playersType === 3) return;
                                                                        CustomEvent.callServer(
                                                                            "mainmenu:getBanlist"
                                                                        ).then((players) => {
                                                                            this.setState({
                                                                                playersType: 3,
                                                                                players,
                                                                            });
                                                                        });
                                                                    }}
                                                                >
                                                                    <p className="name">Банлист</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.playersType === 4 ? `active` : ``
                                                                    }
                                                                    onClick={() => {
                                                                        if (this.state.playersType === 4) return;
                                                                        CustomEvent.callServer(
                                                                            "mainmenu:getFamilies"
                                                                        ).then((players) => {
                                                                            this.setState({
                                                                                playersType: 4,
                                                                                players,
                                                                            });
                                                                        });
                                                                    }}
                                                                >
                                                                    <p className="name">Семьи</p>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="downline">
                                                            <div className="user-count-online-item">
                                                                <p className="middle-title">
                                                                    {this.state.online}
                                                                </p>
                                                                <p className="descr">Всего онлайн</p>
                                                            </div>
                                                            <div className="user-count-online-item">
                                                                <p className="middle-title">
                                                                    {this.state.total}
                                                                </p>
                                                                <p className="descr">Всего игроков</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-main-wrap">
                                                        <ul className="mm-players-list">
                                                            {this.state.players
                                                                ? this.state.players.map((item) => {
                                                                    return (
                                                                        <li key={item[0]}>
                                                                            <div className="id-player">
                                                                                <p>#{item[0]}</p>
                                                                            </div>
                                                                            <div className="name">
                                                                                <p>{item[1]}</p>
                                                                            </div>
                                                                            <div className="level-player">
                                                                                <p>{item[2]}</p>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                })
                                                                : null}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "vip" ? (
                                            <>
                                                <div className="mm-tab-in">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="mm-shop-leftside">
                                                        <div className="girl-img">
                                                            <img src={png["girl"]} alt=""/>
                                                        </div>
                                                        <div className="donat-wrapp">
                                                            <div className="donat-wrapper">
                                                                <h4>Пополнение счета</h4>
                                                                <p>
                                                                    Чтобы пополнить счет посетите наш сайт onyx-gta.ru
                                                                </p>
                                                                <span>1 руб. = {COINS_FOR_ONE_ROUBLE} коин</span>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="mm-shop-wrapper">
                                                        <div className="topline">
                                                            <p className="p-title">Магазин</p>
                                                            <div className="mm-balance-wrapper">
                                                                <p className="descr">Баланс</p>
                                                                <div className="sum-wrap">
                                                                    <img
                                                                        src={svg["player-stop-white"]}
                                                                        width="32"
                                                                        height="32"
                                                                    />
                                                                    <p className="mini-title">
                                                                        {systemUtil.numberFormat(this.state.donate)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ul className="tabs__caption-mmshop">
                                                            <li
                                                                className={
                                                                    this.state.shopPage === 0 ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    this.setState({...this.state, shopPage: 0})
                                                                }
                                                            >
                                                                <p>Общее</p>
                                                            </li>
                                                            <li
                                                                className={
                                                                    this.state.shopPage === 1 ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    this.setState({...this.state, shopPage: 1})
                                                                }
                                                            >
                                                                <p>VIP</p>
                                                            </li>
                                                            <li
                                                                className={
                                                                    this.state.shopPage === 2 ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    this.setState({...this.state, shopPage: 2})
                                                                }
                                                            >
                                                                <p>Магазины</p>
                                                            </li>
                                                            <li
                                                                className={
                                                                    this.state.shopPage === 3 ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    this.setState({...this.state, shopPage: 3})
                                                                }
                                                            >
                                                                <p>Выгодные предложения</p>
                                                            </li>
                                                            <li
                                                                className={
                                                                    this.state.shopPage === 4 ? "active" : ""
                                                                }
                                                                onClick={() =>
                                                                    this.setState({...this.state, shopPage: 4})
                                                                }
                                                            >
                                                                <p>Рулетка</p>
                                                            </li>
                                                        </ul>

                                                        <div className={`tabs__content-wrap-mmshop`}>
                                                            <div
                                                                className={`tabs__content-mmshop${
                                                                    this.state.shopPage === 0 ? " active" : ""
                                                                }`}
                                                            >
                                                                <div className="mm-shop-general-wrap">
                                                                    {Donate_Items.map((item, index) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className="mm-shop-general-item"
                                                                            >
                                                                                <div className="general-main-wrap">
                                                                                    <div className="text-wrap">
                                                                                        <p className="p-title">
                                                                                            {item.name}
                                                                                        </p>
                                                                                        <p className="p-descr">
                                                                                            {item.desc}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="downline">
                                                                                        <button
                                                                                            className="mm-primary-btn mm-primary-btn-maxi orange"
                                                                                            onClick={() => {
                                                                                                if (
                                                                                                    [4, 1, 5].includes(item.id)
                                                                                                ) {
                                                                                                    return this.setState({
                                                                                                        ...this.state,
                                                                                                        buyModal: item.id,
                                                                                                        buyCoin: 0,
                                                                                                        buyName: "",
                                                                                                    });
                                                                                                }
                                                                                                this.buyShop(item.id);
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                src={svg["cart"]}
                                                                                                width="32"
                                                                                                height="32"
                                                                                            />
                                                                                            <p>Купить</p>
                                                                                        </button>
                                                                                        <div className="sum-wrap">
                                                                                            <img
                                                                                                src={svg["player-stop-white"]}
                                                                                                width="32"
                                                                                                height="32"
                                                                                            />
                                                                                            <p className="mini-title">
                                                                                                {item.id == 4 ? 1 : item.price}
                                                                                            </p>
                                                                                            {item.id == 4 ? (
                                                                                                <>
                                                                                                    <p
                                                                                                        className="mini-title"
                                                                                                        style={{
                                                                                                            marginLeft: "0.3vw",
                                                                                                        }}
                                                                                                    >
                                                                                                        {" "}
                                                                                                        ={" "}
                                                                                                        {this.state.donateX3
                                                                                                            ? item.price * 3
                                                                                                            : this.state.donateX
                                                                                                                ? item.price * 2
                                                                                                                : item.price}
                                                                                                    </p>
                                                                                                    <p
                                                                                                        className="mini-title"
                                                                                                        style={{
                                                                                                            marginLeft: "0.2vw",
                                                                                                        }}
                                                                                                    >
                                                                                                        $
                                                                                                    </p>
                                                                                                </>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="img-wrap">
                                                                                    <img src={png[item.pic]} alt=""/>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`tabs__content-mmshop${
                                                                    this.state.shopPage === 1 ? " active" : ""
                                                                }`}
                                                            >
                                                                <div className="mm-vip-wrap" id="yourDiv">
                                                                    <div
                                                                        className="mm-vip-items"
                                                                        onWheel={(e) => {
                                                                            e.currentTarget.scrollLeft +=
                                                                                e.deltaY / 3;
                                                                        }}
                                                                    >
                                                                        {VIP_TARIFS.filter((q) => q.cost).map(
                                                                            (item, id) => {
                                                                                return (
                                                                                    <div
                                                                                        key={id}
                                                                                        className={
                                                                                            "mm-vip-item " +
                                                                                            item.id.toLowerCase()
                                                                                        }
                                                                                        // style={{
                                                                                        //     background: `linear-gradient(180deg, ${item.color}bb 0%, ${item.color}00 100%)`,
                                                                                        // }}
                                                                                    >
                                                                                        <div className="content-wrap">
                                                                                            <div className="title-wrap">
                                                                                                <img
                                                                                                    className={item.id.toLowerCase()}
                                                                                                    src={png[item.id]}
                                                                                                />
                                                                                            </div>
                                                                                            <ul className="mm-vip-adv-wrap">
                                                                                                {item.payday_donate ? (
                                                                                                    <li>
                                                                                                        <p>
                                                      <span>
                                                        +
                                                          {systemUtil.numberFormat(
                                                              item.payday_donate
                                                          )}
                                                      </span>{" "}
                                                                                                            донат валюты
                                                                                                            в час
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.payday_money ? (
                                                                                                    <li>
                                                                                                        <p>
                                                      <span>
                                                        +
                                                          {systemUtil.numberFormat(
                                                              item.payday_money
                                                          )}
                                                          $
                                                      </span>{" "}
                                                                                                            к зарплате в
                                                                                                            час
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.payday_exp ? (
                                                                                                    <li>
                                                                                                        <p>
                                                      <span>
                                                        +{item.payday_exp}
                                                      </span>{" "}
                                                                                                            бонусного
                                                                                                            опыта в час
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.job_skill_multipler ? (
                                                                                                    <li>
                                                                                                        <p>
                                                      <span>
                                                        +
                                                          {
                                                              item.job_skill_multipler
                                                          }
                                                          %
                                                      </span>{" "}
                                                                                                            опыта на
                                                                                                            начальных
                                                                                                            работах
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.healmultipler ? (
                                                                                                    <li>
                                                                                                        <p>
                                                                                                            Скорость
                                                                                                            лечения в
                                                                                                            больнице
                                                                                                            увеличена в
                                                                                                            2
                                                                                                            раза
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.afkminutes ? (
                                                                                                    <li>
                                                                                                        <p>
                                                                                                            Возможность
                                                                                                            стоять{" "}
                                                                                                            <span>
                                                        {item.afkminutes}
                                                      </span>{" "}
                                                                                                            минут без
                                                                                                            статуса AFK
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.sitepay ? (
                                                                                                    <li>
                                                                                                        <p>
                                                                                                            Оплата
                                                                                                            налогов
                                                                                                            через сайт
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.vipuninvite ? (
                                                                                                    <li>
                                                                                                        <p>
                                                                                                            Доступ к
                                                                                                            команде
                                                                                                            /vipuninvite
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.casino ? (
                                                                                                    <li>
                                                                                                        <p>VIP доступ в
                                                                                                            казино</p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.taxPropertyMaxDays ? (
                                                                                                    <li>
                                                                                                        <p>Увеличение
                                                                                                            максимальной
                                                                                                            оплаты
                                                                                                            налогов
                                                                                                            до <span>{item.taxPropertyMaxDays}</span> дней
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.jobPaymentMultiplier ? (
                                                                                                    <li>
                                                                                                        <p>Увеличение
                                                                                                            зарплаты на
                                                                                                            работах
                                                                                                            в <span>{item.jobPaymentMultiplier}</span> раза
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                                {item.deathScreenTime ? (
                                                                                                    <li>
                                                                                                        <p>Уменьшение
                                                                                                            времени
                                                                                                            ожидания
                                                                                                            смерти
                                                                                                            до <span>{item.deathScreenTime / 1000}</span> секунд
                                                                                                        </p>
                                                                                                    </li>
                                                                                                ) : (
                                                                                                    <></>
                                                                                                )}
                                                                                            </ul>
                                                                                        </div>
                                                                                        <div
                                                                                            className="mm-vip-buy-wrap">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    this.selectVip(id + 1)
                                                                                                }
                                                                                                className="mm-primary-btn mm-primary-btn-mini mm-primary-btn-noicon semi-bold vip-buy-btn"
                                                                                            >
                                                                                                <p>Купить</p>
                                                                                            </button>
                                                                                            <div
                                                                                                className="mm-vip-cost">
                                                                                                <svg
                                                                                                    width="22"
                                                                                                    height="22"
                                                                                                    viewBox="0 0 22 22"
                                                                                                    fill="none"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                >
                                                                                                    <path
                                                                                                        fillRule="evenodd"
                                                                                                        clipRule="evenodd"
                                                                                                        d="M0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11ZM20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM14 6C15.1046 6 16 6.89543 16 8V14C16 15.1046 15.1046 16 14 16H8C6.89543 16 6 15.1046 6 14V8C6 6.89543 6.89543 6 8 6H14ZM8 14V8H14V14H8Z"
                                                                                                        fill="white"
                                                                                                    />
                                                                                                </svg>
                                                                                                {item.cost}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`tabs__content-mmshop${
                                                                    this.state.shopPage === 3 ? " active" : ""
                                                                }`}
                                                            >
                                                                <div
                                                                    className="mm-great-offer-wrap"
                                                                    id="yourDiv2"
                                                                    onWheel={(e) =>
                                                                        (e.currentTarget.scrollLeft += e.deltaY / 3)
                                                                    }
                                                                >
                                                                    {PACKETS.map((data, id) => {
                                                                        return (
                                                                            <div
                                                                                className={`mm-great-offer-item ${
                                                                                    data.class
                                                                                } ${data.popular ? "popular" : ""}`}
                                                                            >
                                                                                <div className="icon-wrap">
                                                                                    <img
                                                                                        src={
                                                                                            svgPackets[
                                                                                                `great-offer-${data.class}`
                                                                                                ]
                                                                                        }
                                                                                        width="24"
                                                                                        height="24"
                                                                                    />
                                                                                </div>
                                                                                <p className="p-title">{data.name}</p>
                                                                                <div
                                                                                    className="bage-great-offer-wrapper">
                                                                                    <div
                                                                                        className="bage-great-offer-wrap">
                                                                                        {data.items.vip ? (
                                                                                            <div
                                                                                                className="bage-great-offer-item">
                                                                                                <p>
                                                                                                    VIP{" "}
                                                                                                    {
                                                                                                        getVipConfig(
                                                                                                            data.items.vip.type
                                                                                                        ).name
                                                                                                    }{" "}
                                                                                                    на {data.items.vip.time} месяц
                                                                                                </p>
                                                                                            </div>
                                                                                        ) : null}
                                                                                        {data.items.money ? (
                                                                                            <div
                                                                                                className="bage-great-offer-item">
                                                                                                <p>
                                                                                                    $
                                                                                                    {system.numberFormat(
                                                                                                        data.items.money
                                                                                                    )}
                                                                                                </p>
                                                                                            </div>
                                                                                        ) : null}
                                                                                        {data.items.licenses &&
                                                                                        data.items.licenses.map((lic) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className="bage-great-offer-item">
                                                                                                    <p>
                                                                                                        Лицензия{" "}
                                                                                                        {
                                                                                                            LicensesData.find(
                                                                                                                (q) => q.id === lic.id
                                                                                                            ).name
                                                                                                        }{" "}
                                                                                                        на {lic.days} дней
                                                                                                    </p>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                        {data.items.items ? (
                                                                                            data.items.items.map(
                                                                                                (item, i) => {
                                                                                                    return (
                                                                                                        <div
                                                                                                            key={`packet_${data.id}_${i}`}
                                                                                                            className="bage-great-offer-item"
                                                                                                        >
                                                                                                            <p>
                                                                                                                {getBaseItemNameById(
                                                                                                                    item
                                                                                                                )}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                            )
                                                                                        ) : (
                                                                                            <></>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="downline">
                                                                                    <button
                                                                                        className="mm-primary-btn mm-primary-btn-mini mm-primary-btn-noicon white bold"
                                                                                        onClick={() =>
                                                                                            this.buyPacket(data.id)
                                                                                        }
                                                                                    >
                                                                                        <p>Купить</p>
                                                                                    </button>
                                                                                    <div className="sum-wrap">
                                                                                        <img
                                                                                            src={svg["player-stop-white"]}
                                                                                            width="32"
                                                                                            height="32"
                                                                                        />
                                                                                        <p className="mini-title">
                                                                                            {data.price}
                                                                                            <i>{data.full_price}</i>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`tabs__content-mmshop${
                                                                    this.state.shopPage === 2 ? " active" : ""
                                                                }`}
                                                            >
                                                                <div className="mm-shop-general-wrap">
                                                                    {this.state.donateShops.map((item, index) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className="mm-shop-general-item"
                                                                            >
                                                                                <div className="general-main-wrap">
                                                                                    <div className="text-wrap">
                                                                                        <p className="p-title">
                                                                                            {
                                                                                                BUSINESS_SUBTYPE_NAMES[
                                                                                                    item.type
                                                                                                    ][item.sub_type]
                                                                                            }
                                                                                        </p>
                                                                                        <p className="p-descr">
                                                                                            {item.name}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="downline">
                                                                                        <button
                                                                                            className="mm-primary-btn mm-primary-btn-maxi orange"
                                                                                            onClick={() => {
                                                                                                CEF.setGPS(item.x, item.y);
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                src={svg["cart"]}
                                                                                                width="32"
                                                                                                height="32"
                                                                                            />
                                                                                            <p>В магазин</p>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="img-wrap">
                                                                                    <img
                                                                                        src={
                                                                                            png[`shop_${item.type}`] ||
                                                                                            png["d-face"]
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "binder" ? (
                                            <>
                                                <div className="mm-tab-in mm-notab">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="tab-main-wrap">
                                                        <div className="binder-grid-wrap">
                                                            {this.renderHotkeys()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "rules" ? (
                                            <>
                                                <div className="mm-tab-in mm-tab-in-nosize">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="mm-only-text-wrap">
                                                        <p className="middle-title">Правила</p>
                                                        <div className="text-wrap">
                                                            {rules.map((rule) => {
                                                                return (
                                                                    <p style={{whiteSpace: "pre-line"}}>
                                                                        {rule}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "help" ? (
                                            <>
                                                <div className="mm-list-help active">
                                                    <div
                                                        className="tabs__caption-mmlisthelp-wrap tabs__caption-primary-wrap">
                                                        <ul className="tabs__caption-mmlisthelp tabs__caption-primary">
                                                            {helpInfo.map(([title, text], index) => {
                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        onClick={(e) => {
                                                                            this.setState({helpSection: index});
                                                                        }}
                                                                        className={`${
                                                                            this.state.helpSection == index
                                                                                ? "active"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {title}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className="tabs__content-wrap-mmlisthelp tabs__content-wrap-primary">
                                                        <div
                                                            className="tabs__content-mmlisthelp tabs__content-primary active">
                                                            <div className="mm-text-wrapper">
                                                                <div className="topline">
                                                                    <p className="name">
                                                                        {helpInfo[this.state.helpSection][0]}
                                                                    </p>
                                                                </div>
                                                                <div className="text-wrap">
                                                                    <p style={{whiteSpace: "pre-line"}}>
                                                                        {helpInfo[this.state.helpSection][1]}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {[
                                            "settings",
                                            "mypromo",
                                            "settings_auth",
                                            "settings_voice",
                                            "voiceBlance",
                                            "settings_promo",
                                            "settings_aim",
                                            "settings_alert",
                                        ].includes(this.state.page) ? (
                                            <>
                                                <div className="mm-tab-in mm-tab-in-nosize">
                                                    <div className="bg-radial-mm-profile"></div>
                                                    <div className="mm-account-wrapper">
                                                        {/* <p className="middle-title">Кабинет</p> */}
                                                        <div className="tabs__caption-mmaccount-wrap">
                                                            <ul className="tabs__caption-mmaccount">
                                                                <li
                                                                    className={
                                                                        this.state.page == "settings"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("settings")}
                                                                >
                                                                    <p>Смена пароля</p>
                                                                </li>
                                                                {/*<li className={this.state.page == "settings_auth" ? "active":""} onClick={()=>this.setPage("settings_auth")}>*/}
                                                                {/*    <p>Google Authenticator</p>*/}
                                                                {/*</li>*/}
                                                                <li
                                                                    className={
                                                                        this.state.page == "settings_voice"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("settings_voice")}
                                                                >
                                                                    <p>Громкость</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.page == "voiceBlance"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("voiceBlance")}
                                                                >
                                                                    <p>Громкость игроков</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.page == "settings_promo"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("settings_promo")}
                                                                >
                                                                    <p>Промокод</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.page == "mypromo" ? "active" : ""
                                                                    }
                                                                    onClick={() => this.setPage("mypromo")}
                                                                >
                                                                    <p>Партнёрка</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.page == "settings_aim"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("aim")}
                                                                >
                                                                    <p>Прицел</p>
                                                                </li>
                                                                <li
                                                                    className={
                                                                        this.state.page == "settings_alert"
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => this.setPage("settings_alert")}
                                                                >
                                                                    <p>Настройки</p>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="tabs__content-wrap-mmaccount">
                                                            {this.state.page === "mypromo" ? (
                                                                <div className="promosystem-modal active">
                                                                    <div className="promo-user-add-info">
                                                                        <p className="strong-in ln-1-4">
                                                                            <strong>
                                        <span className="upper">
                                          Ваш промокод даёт:
                                        </span>
                                                                            </strong>
                                                                            <br/>+ <strong>$5 000</strong> сразу же
                                                                            <br/>+ <strong>$25 000</strong> на 3-ем
                                                                            уровне
                                                                            <br/>+ <strong>Saphire VIP</strong> на 7
                                                                            дней (+1 EXP в PayDay, скорость лечения в
                                                                            больнице х2)
                                                                        </p>
                                                                    </div>
                                                                    <SocketSync
                                                                        path={"mymediapromo"}
                                                                        data={(e) => {
                                                                            let {
                                                                                promocodeMy,
                                                                                promocodeMyCount,
                                                                                promocodeMyRewardGived,
                                                                            } = JSON.parse(e);
                                                                            this.setState({
                                                                                promocodeMy,
                                                                                promocodeMyCount,
                                                                                promocodeMyRewardGived,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <button
                                                                            className="promosystem-close"
                                                                            onClick={() => this.setPage("settings")}
                                                                        >
                                                                            <div>
                                                                                <img
                                                                                    src={svgInventory["close"]}
                                                                                    alt=""
                                                                                />
                                                                            </div>
                                                                        </button>
                                                                        <i className="fly-promosystem-girl">
                                                                            <img src={partnerimg["art"]} alt=""/>
                                                                        </i>
                                                                        <div className="promosystem-width-wrap">
                                                                            <div>
                                                                                <div
                                                                                    className="flex-line left mb40 title-partner">
                                                                                    <p className="font40 fontw600 mr24">
                                                                                        Партнерская
                                                                                        <br/>
                                                                                        программа
                                                                                    </p>
                                                                                    {!this.state.promocodeMy ? (
                                                                                        <p className="font16 fontw400 ln-1-4 strong-in">
                                                                                            Создайте промокод,
                                                                                            приглашайте
                                                                                            друзей и получайте бонусы!
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p className="font16 fontw400 ln-1-4 strong-in">
                                                                                            Вы пригласили
                                                                                            <br/>
                                                                                            <strong>
                                                <span className="font24">
                                                  {system.numberFormat(
                                                      this.state.promocodeMyCount
                                                  )}
                                                </span>
                                                                                            </strong>
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                <p className="font14 fontw600 upper mb24">
                                                                                    Призы за приглашенных
                                                                                </p>
                                                                                <ul className="promosystem-list">
                                                                                    {MEDIA_PROMOCODE.REWARD_STAGE_LIST.map(
                                                                                        (q, key) => {
                                                                                            return (
                                                                                                <li
                                                                                                    key={`media_reward_${key}`}
                                                                                                    className={
                                                                                                        this.state
                                                                                                            .promocodeMyCount >=
                                                                                                        q.count &&
                                                                                                        this.state
                                                                                                            .promocodeMyRewardGived >
                                                                                                        key
                                                                                                            ? "success"
                                                                                                            : ""
                                                                                                    }
                                                                                                >
                                                                                                    {this.state
                                                                                                        .promocodeMyCount >=
                                                                                                    q.count &&
                                                                                                    this.state
                                                                                                        .promocodeMyRewardGived ===
                                                                                                    key ? (
                                                                                                        <button
                                                                                                            onClick={(e) => {
                                                                                                                e.preventDefault();
                                                                                                                CustomEvent.triggerServer(
                                                                                                                    "mediapromo:takereward",
                                                                                                                    key
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            Получить
                                                                                                        </button>
                                                                                                    ) : (
                                                                                                        <></>
                                                                                                    )}
                                                                                                    <div
                                                                                                        className="promosystem-count">
                                                                                                        {q.count}
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p
                                                                                                            className={q.class}
                                                                                                            dangerouslySetInnerHTML={{
                                                                                                                __html: q.name,
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </li>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </ul>
                                                                            </div>

                                                                            <div
                                                                                className="flex-line left form-partner">
                                                                                <div
                                                                                    className="input-wrap input-labelin">
                                                                                    <p>
                                                                                        {this.state.promocodeMy
                                                                                            ? `Мой промокод`
                                                                                            : "Назовите промокод"}
                                                                                    </p>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="******"
                                                                                        value={
                                                                                            this.state.promocodeMy ||
                                                                                            this.state.promocodeMyInput ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(e) => {
                                                                                            e.preventDefault();
                                                                                            if (this.state.promocodeMy)
                                                                                                return;
                                                                                            this.setState({
                                                                                                promocodeMyInput: system.filterInput(
                                                                                                    e.currentTarget.value || ""
                                                                                                ),
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                {this.state.promocodeMy ? (
                                                                                    <button
                                                                                        className="hud-main-btn easy"
                                                                                        onClick={() => {
                                                                                            CEF.copy(this.state.promocodeMy);
                                                                                        }}
                                                                                    >
                                                                                        <p>Скопировать</p>
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        className="hud-main-btn"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            if (this.state.promocodeMy)
                                                                                                return;
                                                                                            if (!this.state.promocodeMyInput)
                                                                                                return;
                                                                                            CustomEvent.triggerServer(
                                                                                                "mediapromo:create",
                                                                                                this.state.promocodeMyInput
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <p>Создать</p>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </SocketSync>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="tabs__content-mmaccount voice-size-gamers-tab active">
                                                                    {this.state.page === "voiceBlance" ? (
                                                                        <>
                                                                            <div className="voice-settings-item">
                                                                                <div>
                                                                                    <p className="font16 fontw600">
                                                                                        Минимальный уровень игрока для
                                                                                        войса
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className="slider-xanderwp-suda">
                                                                                        {addSlider(
                                                                                            this.state.voiceLevel,
                                                                                            (e, val) => {
                                                                                                this.setState({
                                                                                                    voiceLevel: val,
                                                                                                });
                                                                                                CustomEvent.triggerClient(
                                                                                                    "voiceUser:voiceLevel",
                                                                                                    val
                                                                                                );
                                                                                            },
                                                                                            1,
                                                                                            10,
                                                                                            1,
                                                                                            " LVL"
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <h2 className="mb24 fontw600 font16">
                                                                                Громкость игроков вокруг
                                                                            </h2>
                                                                            <div className="overflow-voicesize">
                                                                                <div
                                                                                    className="voice-settings-overflow mb16">
                                                                                    {this.state.usersVoice.map(
                                                                                        ([id, val]) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className="voice-settings-item"
                                                                                                    key={`voice_user_item_${id}`}
                                                                                                >
                                                                                                    <div>
                                                                                                        <p className="font16 fontw600">
                                                      <span className="op4">
                                                        ID
                                                      </span>{" "}
                                                                                                            {id}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <div
                                                                                                            className="slider-xanderwp-suda">
                                                                                                            {addSlider(
                                                                                                                val,
                                                                                                                (e, val) => {
                                                                                                                    let usersVoice = [
                                                                                                                        ...this.state
                                                                                                                            .usersVoice,
                                                                                                                    ];
                                                                                                                    usersVoice.find(
                                                                                                                        (q) => q[0] === id
                                                                                                                    )[1] = val;
                                                                                                                    this.setState({
                                                                                                                        usersVoice,
                                                                                                                    });
                                                                                                                    CustomEvent.triggerClient(
                                                                                                                        "voiceUser:set",
                                                                                                                        id,
                                                                                                                        val
                                                                                                                    );
                                                                                                                },
                                                                                                                0,
                                                                                                                200,
                                                                                                                1
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    {this.state.page === "settings" ? (
                                                                        <>
                                                                            <div className="input-wrapper">
                                                                                <div className="topline">
                                                                                    <p>Изменить пароль</p>
                                                                                </div>
                                                                                <div
                                                                                    className="input-wrap input-labelin change-pincode">
                                                                                    <p>Введите старый пароль</p>
                                                                                    <input
                                                                                        type={
                                                                                            this.state.showPass[0] === true
                                                                                                ? "text"
                                                                                                : "password"
                                                                                        }
                                                                                        placeholder="************"
                                                                                        value={this.state.passData[0]}
                                                                                        onChange={(e) => {
                                                                                            let passData = this.state
                                                                                                .passData;
                                                                                            passData[0] = e.target.value;
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                passData: passData,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                    <button
                                                                                        className={`eyepass${
                                                                                            this.state.showPass[0] === true
                                                                                                ? " active"
                                                                                                : ""
                                                                                        }`}
                                                                                        onClick={() => {
                                                                                            let showPass = this.state
                                                                                                .showPass;
                                                                                            showPass[0] = !showPass[0];
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                showPass: showPass,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="input-wrap input-labelin change-pincode">
                                                                                    <p>Новый пароль</p>
                                                                                    <input
                                                                                        type={
                                                                                            this.state.showPass[1] === true
                                                                                                ? "text"
                                                                                                : "password"
                                                                                        }
                                                                                        placeholder="************"
                                                                                        value={this.state.passData[1]}
                                                                                        onChange={(e) => {
                                                                                            let passData = this.state
                                                                                                .passData;
                                                                                            passData[1] = e.target.value;
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                passData: passData,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                    <button
                                                                                        className={`eyepass${
                                                                                            this.state.showPass[1] === true
                                                                                                ? " active"
                                                                                                : ""
                                                                                        }`}
                                                                                        onClick={() => {
                                                                                            let showPass = this.state
                                                                                                .showPass;
                                                                                            showPass[1] = !showPass[1];
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                showPass: showPass,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="input-wrap input-labelin change-pincode">
                                                                                    <p>Повторите новый пароль</p>
                                                                                    <input
                                                                                        type={
                                                                                            this.state.showPass[2] === true
                                                                                                ? "text"
                                                                                                : "password"
                                                                                        }
                                                                                        placeholder="************"
                                                                                        value={this.state.passData[2]}
                                                                                        onChange={(e) => {
                                                                                            let passData = this.state
                                                                                                .passData;
                                                                                            passData[2] = e.target.value;
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                passData: passData,
                                                                                            });
                                                                                        }}
                                                                                    />

                                                                                    <button
                                                                                        className={`eyepass${
                                                                                            this.state.showPass[2] === true
                                                                                                ? " active"
                                                                                                : ""
                                                                                        }`}
                                                                                        onClick={() => {
                                                                                            let showPass = this.state
                                                                                                .showPass;
                                                                                            showPass[2] = !showPass[2];
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                showPass: showPass,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    className="hud-main-btn"
                                                                                    onClick={this.changePassword}
                                                                                >
                                                                                    <p>Сохранить</p>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    ) : null}
                                                                    {this.state.page === "settings_auth" ? (
                                                                        <>
                                                                            {this.state.google === true ? (
                                                                                <div
                                                                                    className="authenticator-v1 active">
                                                                                    <div className="topline">
                                                                                        <p>Отключить</p>
                                                                                    </div>
                                                                                    <p className="p-descr">
                                                                                        Вы можете отлючить Google
                                                                                        Authenticator
                                                                                    </p>
                                                                                    <button
                                                                                        className="hud-main-btn"
                                                                                        style={{maxWidth: "12vw"}}
                                                                                        onClick={() => {
                                                                                            //отключить гугл
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                google: false,
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <p>Отключить</p>
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    className="authenticator-v2 active">
                                                                                    <div className="topline">
                                                                                        <p>Отсканируйте QR-code</p>
                                                                                    </div>
                                                                                    <div className="qr-wrap">
                                                                                        <img src={png["qr-code"]}
                                                                                             alt=""/>
                                                                                    </div>
                                                                                    <div
                                                                                        className="input-wrap change-pincode input-tc input-labelin">
                                                                                        <p>Введите код</p>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="******"
                                                                                            onChange={(e) => {
                                                                                                this.setState({
                                                                                                    ...this.state,
                                                                                                    googleInput: e.target.value,
                                                                                                });
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <button
                                                                                        className="hud-main-btn"
                                                                                        onClick={() => {
                                                                                            //Отправить гугл код
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                google: true,
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <p>Сохранить</p>
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : null}
                                                                    {this.state.page === "settings_voice" ? (
                                                                        <>
                                                                            <div className="tick-slider">
                                                                                <div
                                                                                    id="tick-slider-header-1"
                                                                                    className="tick-slider-header"
                                                                                >
                                                                                    <h5>Громкость вашего микрофона</h5>
                                                                                </div>
                                                                                {addSlider(
                                                                                    this.state.voiceData[0] / 1.5,
                                                                                    (e, val) =>
                                                                                        this.setState({
                                                                                            voiceData: [
                                                                                                (val as number) * 1.5,
                                                                                                this.state.voiceData[1],
                                                                                                this.state.voiceData[2],
                                                                                            ],
                                                                                        })
                                                                                )}
                                                                            </div>
                                                                            <div className="tick-slider">
                                                                                <div
                                                                                    id="tick-slider-header-1"
                                                                                    className="tick-slider-header"
                                                                                >
                                                                                    <h5>Громкость окружающих
                                                                                        голосов</h5>
                                                                                </div>
                                                                                {addSlider(
                                                                                    this.state.voiceData[1] / 1.5,
                                                                                    (e, val) =>
                                                                                        this.setState({
                                                                                            voiceData: [
                                                                                                this.state.voiceData[0],
                                                                                                (val as number) * 1.5,
                                                                                                this.state.voiceData[2],
                                                                                            ],
                                                                                        })
                                                                                )}
                                                                            </div>
                                                                            <div className="tick-slider">
                                                                                <div
                                                                                    id="tick-slider-header-1"
                                                                                    className="tick-slider-header"
                                                                                >
                                                                                    <h5>Громкость рации и телефона</h5>
                                                                                </div>
                                                                                {addSlider(
                                                                                    this.state.voiceData[2] / 1.5,
                                                                                    (e, val) =>
                                                                                        this.setState({
                                                                                            voiceData: [
                                                                                                this.state.voiceData[0],
                                                                                                this.state.voiceData[1],
                                                                                                (val as number) * 1.5,
                                                                                            ],
                                                                                        })
                                                                                )}
                                                                            </div>

                                                                            <div className="tick-slider">
                                                                                <div
                                                                                    id="tick-slider-header-1"
                                                                                    className="tick-slider-header"
                                                                                >
                                                                                    <h5>Громкость музыкального
                                                                                        плеера</h5>
                                                                                </div>
                                                                                {addSlider(
                                                                                    this.state.boomboxSound,
                                                                                    (e, val) =>
                                                                                        this.setState({
                                                                                            boomboxSound: val,
                                                                                        }),
                                                                                    0,
                                                                                    100,
                                                                                    1
                                                                                )}
                                                                            </div>

                                                                            <button
                                                                                className="hud-main-btn"
                                                                                style={{
                                                                                    marginLeft: "25%",
                                                                                    width: "50%",
                                                                                }}
                                                                                onClick={() => {
                                                                                    CustomEvent.triggerClient(
                                                                                        "saveVoiceSettings",
                                                                                        JSON.stringify(
                                                                                            this.state.voiceData
                                                                                        ),
                                                                                        this.state.boomboxSound
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <p>Сохранить</p>
                                                                            </button>
                                                                        </>
                                                                    ) : null}
                                                                    {this.state.page === "settings_promo" ? (
                                                                        <>
                                                                            <div
                                                                                className="input-wrapper"
                                                                                style={{marginTop: "4vw"}}
                                                                            >
                                                                                <div className="topline">
                                                                                    <p>Ввести промокод</p>
                                                                                </div>
                                                                                <div
                                                                                    className="input-wrap input-labelin change-pincode">
                                                                                    <p>Введите промокод</p>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder=""
                                                                                        value={this.state.promo}
                                                                                        onChange={(e) => {
                                                                                            this.setState({
                                                                                                ...this.state,
                                                                                                promo: e.target.value,
                                                                                            });
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    className="hud-main-btn"
                                                                                    onClick={this.inputPromo}
                                                                                >
                                                                                    <p>Использовать</p>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    ) : null}
                                                                    {this.state.page === "settings_alert" ? (
                                                                        <>
                                                                            <div className="voice-settings-item">
                                                                                <div>
                                                                                    <p className="font16 fontw600">
                                                                                        Дальность прорисовки игроков
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className="slider-xanderwp-suda">
                                                                                        {addSlider(
                                                                                            this.state.lodDistPlayers,
                                                                                            (e, val) => {
                                                                                                this.setState({
                                                                                                    lodDistPlayers: val,
                                                                                                });
                                                                                                CustomEvent.triggerClient(
                                                                                                    "setLod:players",
                                                                                                    val
                                                                                                );
                                                                                            },
                                                                                            1,
                                                                                            400,
                                                                                            20,
                                                                                            " m"
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="voice-settings-item">
                                                                                <div>
                                                                                    <p className="font16 fontw600">
                                                                                        Дальность прорисовки ТС
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        className="slider-xanderwp-suda">
                                                                                        {addSlider(
                                                                                            this.state.lodDistVehs,
                                                                                            (e, val) => {
                                                                                                this.setState({
                                                                                                    lodDistVehs: val,
                                                                                                });
                                                                                                CustomEvent.triggerClient(
                                                                                                    "setLod:vehs",
                                                                                                    val
                                                                                                );
                                                                                            },
                                                                                            1,
                                                                                            400,
                                                                                            20,
                                                                                            " m"
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {Object.keys(this.state.alertsData).map(
                                                                                (key) => {
                                                                                    const value = (this.state
                                                                                        .alertsData as any)[key];
                                                                                    return (
                                                                                        <div
                                                                                            key={`alert_settings_${key}`}
                                                                                            className="mm-switch-item"
                                                                                        >
                                                                                            <div
                                                                                                className="switch-wrap">
                                                                                                <input
                                                                                                    checked={!!value}
                                                                                                    type="checkbox"
                                                                                                    id={`alert_settings_label_${key}`}
                                                                                                    onChange={() => {
                                                                                                        let alertsData = this.state
                                                                                                            .alertsData as any;
                                                                                                        alertsData[
                                                                                                            key
                                                                                                            ] = !alertsData[key];
                                                                                                        this.setState({
                                                                                                            ...this.state,
                                                                                                            alertsData,
                                                                                                        });
                                                                                                        CustomEvent.triggerClient(
                                                                                                            "saveAlertSettings",
                                                                                                            JSON.stringify(
                                                                                                                this.state.alertsData
                                                                                                            )
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                <label
                                                                                                    htmlFor={`alert_settings_label_${key}`}
                                                                                                />
                                                                                            </div>
                                                                                            <label
                                                                                                htmlFor={`alert_settings_label_${key}`}
                                                                                                className="label-p"
                                                                                            >
                                                                                                {(ALERTS_SETTINGS as any)[key]}
                                                                                            </label>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </>
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "ticket" 
                                            ? CEF.admin ? <AdminTickets /> : <Tickets /> 
                                            : <></>}
                                        {this.state.page === "aim" ? (
                                            <>
                                                <div className="aim">
                                                    <div className="aim__title">
                                                        Настройки прицела
                                                    </div>

                                                    <div className="aim-row">

                                                        <div className="aim-row__title">
                                                            Основные настройки
                                                        </div>

                                                        <div className="aim-row-slider">

                                                            <div className="aim-row-slider__title">
                                                                <div>Длина прицела</div>
                                                                <div>30 <span>px</span></div>
                                                            </div>

                                                            {addSliderAim(
                                                                this.state.crosshairSettings.length,
                                                                (e, val) => {
                                                                    this.setState({
                                                                        crosshairSettings: {
                                                                            ...this.state.crosshairSettings,
                                                                            length: val
                                                                        }
                                                                    });
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    CustomEvent.trigger('crosshair:rerender')
                                                                },
                                                                1,
                                                                30,
                                                                1
                                                            )}

                                                        </div>

                                                        <div className="aim-row-slider">

                                                            <div className="aim-row-slider__title">
                                                                <div>Ширина прицела</div>
                                                                <div>30 <span>px</span></div>
                                                            </div>

                                                            {addSliderAim(
                                                                this.state.crosshairSettings.width,
                                                                (e, val) => {
                                                                    this.setState({
                                                                        crosshairSettings: {
                                                                            ...this.state.crosshairSettings,
                                                                            width: val
                                                                        }
                                                                    });
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    CustomEvent.trigger('crosshair:rerender')
                                                                },
                                                                1,
                                                                30,
                                                                1
                                                            )}

                                                        </div>

                                                        <div className="aim-row-slider">

                                                            <div className="aim-row-slider__title">
                                                                <div>Зазор</div>
                                                                <div>10 <span>px</span></div>
                                                            </div>

                                                            {addSliderAim(
                                                                this.state.crosshairSettings.gap,
                                                                (e, val) => {
                                                                    this.setState({
                                                                        crosshairSettings: {
                                                                            ...this.state.crosshairSettings,
                                                                            gap: val
                                                                        }
                                                                    });
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    CustomEvent.trigger('crosshair:rerender')
                                                                },
                                                                1,
                                                                10,
                                                                1
                                                            )}

                                                        </div>

                                                        <div className="aim-row-slider">

                                                            <div className="aim-row-slider__title">
                                                                <div>Прозрачность</div>
                                                                <div>100 <span>%</span></div>
                                                            </div>

                                                            {addSliderAim(
                                                                this.state.crosshairSettings.alpha,
                                                                (e, val) => {
                                                                    this.setState({
                                                                        crosshairSettings: {
                                                                            ...this.state.crosshairSettings,
                                                                            alpha: val
                                                                        }
                                                                    });
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    CustomEvent.trigger('crosshair:rerender')
                                                                },
                                                                0,
                                                                1,
                                                                0.1
                                                            )}

                                                        </div>
                                                    </div>

                                                    <div className="aim-row">

                                                        <div className="aim-row__title">
                                                            Внешний вид
                                                        </div>

                                                        <div className="aim-row__name">
                                                            Цвет прицела
                                                        </div>

                                                        <ColorPickerWrapped color={this.state.crosshairSettings.color}
                                                                            onChange={(e: any) => {
                                                                                this.setState({
                                                                                    crosshairSettings: {
                                                                                        ...this.state.crosshairSettings,
                                                                                        color: e.rgb
                                                                                    }
                                                                                })
                                                                                CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                                CustomEvent.trigger('crosshair:rerender')
                                                                            }}
                                                                            onChangeComplete={(e: any) => {
                                                                            }}/>

                                                        <div className="aim-row__name">
                                                            Цвет при наведении
                                                        </div>

                                                        <ColorPickerWrapped
                                                            color={this.state.crosshairSettings.aimColor}
                                                            onChange={(e: any) => {
                                                                this.setState({
                                                                    crosshairSettings: {
                                                                        ...this.state.crosshairSettings,
                                                                        aimColor: e.rgb
                                                                    }
                                                                })
                                                                CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                            }}
                                                            onChangeComplete={(e: any) => {
                                                            }}/>

                                                        <div className="aim-row__name">
                                                            Тип прицела
                                                        </div>

                                                        <div className="aim-row-buttons">
                                                            <div
                                                                className={this.state.crosshairSettings.enable ? `aim-active` : ``}
                                                                onClick={() => {
                                                                    const s = this.state.crosshairSettings
                                                                    s.enable = true
                                                                    this.setState({
                                                                        crosshairSettings: s
                                                                    })
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    CustomEvent.trigger('crosshair:rerender')
                                                                }}>Пользовательский
                                                            </div>
                                                            <div
                                                                className={!this.state.crosshairSettings.enable ? `aim-active` : ``}
                                                                onClick={() => {
                                                                    const s = this.state.crosshairSettings
                                                                    s.enable = false
                                                                    this.setState({
                                                                        crosshairSettings: s
                                                                    })
                                                                    CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                    //CustomEvent.trigger('crosshair:rerender')
                                                                }}>Системный
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="aim-row">

                                                        <div className="aim-row__title">
                                                            Предпросмотр
                                                        </div>

                                                        <div className="aim-row-preview">
                                                            <img src={png["gamePreview"]} alt=""/>
                                                            <HudCrosshair store={this.props.CrosshairStore} />
                                                        </div>

                                                        <div className="aim-row-save">
                                                            <div onClick={() => {
                                                                CustomEvent.triggerClient('crosshair:save', JSON.stringify(this.state.crosshairSettings))
                                                                CustomEvent.trigger('crosshair:setSettings', this.state.crosshairSettings)
                                                                CustomEvent.trigger('crosshair:rerender')
                                                            }}>Сохранить
                                                            </div>
                                                            <div onClick={() => this.setPage("settings")}>Отменить</div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </>
                                        ) : null}
                                        {this.state.page === "statistic" ? (<Statistic/>                                        ) : null}
                                        {this.state.page === "donateStorage" ? (<DonateStorage/>) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const addSlider = (
    value: number,
    onChange: (e: any, val: any) => void,
    min = 0,
    max = 100,
    step = 1,
    addText = "%",
    zeroText = "OFF"
) => {
    let volumeStepsDraw = [{value: 0, label: zeroText}];
    for (let id = max / 10; id <= max; id += max / 10)
        volumeStepsDraw.push({value: id, label: id + addText});
    return (
        <div>
            <NewSliderStyles
                min={min}
                max={max}
                step={step}
                value={value}
                valueLabelDisplay="off"
                marks={volumeStepsDraw}
                getAriaValueText={(value: number) => {
                    return `${value}${addText}`;
                }}
                onChange={(e, val) => {
                    if (val == value) return;
                    onChange(e, val);
                }}
            />
        </div>
    );
};

const addSliderAim = (
    value: number,
    onChange: (e: any, val: any) => void,
    min = 0,
    max = 100,
    step = 1,
    addText = "",
    zeroText = ""
) => {
    let volumeStepsDraw = [{value: 0, label: zeroText}];
    for (let id = max; id <= max; id += max)
        volumeStepsDraw.push({value: id, label: id + addText});
    return (
        <div>
            <NewSliderAimStyles
                min={min}
                max={max}
                step={step}
                value={value}
                valueLabelDisplay="off"
                marks={volumeStepsDraw}
                getAriaValueText={(value: number) => {
                    return `${value}${addText}`;
                }}
                onChange={(e, val) => {
                    if (val == value) return;
                    onChange(e, val);
                }}
            />
        </div>
    );
};

const SliderStyles = createStyles({
    colorPrimary: {
        color: "#000000",
    },
    root: {
        marginTop: 5,
        color: "#C4C4C4",
        height: 16,
        "&$vertical": {
            width: 8,
        },
    },
    markLabel: {
        color: "#FFFFFFaa",
        fontSize: "0.7vw",
    },
    markLabelActive: {
        color: "#FFFFFFee",
    },
    thumb: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#E3256B",
        marginTop: -3,
        "&:focus, &:hover, &$active": {
            boxShadow: "0px 0px 30px #E3256B",
        },
    },
    track: {
        backgroundColor: "#E3256B",
        boxShadow: "0px 0px 3px #E3256B",
    },
});

const SliderAimStyles = createStyles({
    colorPrimary: {
        color: "#000000",
    },
    root: {
        marginTop: "2vw",
        color: "#C4C4C4",
        height: "0.83vw",
        "&$vertical": {
            width: "0.41vw",
        },
    },
    markLabel: {
        color: "#FFFFFFaa",
        fontSize: "0.7vw",
        display: "flex",
    },
    markLabelActive: {
        color: "#FFFFFFee",
    },
    thumb: {
        height: "0.83vw",
        width: "0.2vw",
        left: 0,
        borderRadius: "0.2vw",
        backgroundColor: "#E3256B",
        marginTop: "-0.41vw",
        "&:focus, &:hover, &$active": {
            boxShadow: "0px 0px 30px #E3256B",
        },
    },
    track: {
        backgroundColor: "#E3256B",
        boxShadow: "0px 0px 3px #E3256B",
    },
});

const NewSliderStyles = withStyles(SliderStyles)(Slider);
const NewSliderAimStyles = withStyles(SliderAimStyles)(Slider);
