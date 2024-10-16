import React, {Component, createRef} from "react";
import {CustomEvent} from "./modules/custom.event";
import {CEF} from "./modules/CEF";
import './modules/fractions';
import {useLocalStore} from "./modules/mobx/useLocal";
import {guiNames} from "../shared/gui";
import {floatGUINames} from "../shared/floatGUI/names";
import "./assets/less/index.less";
import {Menu} from "./components/Menu";
import {Dialog} from "./components/Dialog/dialog";
import "./modules/Alert/";
import {AcceptBlock} from "./components/Accept";
import {ShopBlock} from "./components/Shop";
import {IdCardBlock} from "./components/IdCard";
import {UserMenuBlock} from "./components/UserMenu";
import {Autosalon} from "./components/Autosalon";
import {ClothShop} from "./components/ClothShop";
import {TattooShop} from "./components/TattooShop";
import ChestEquip from "./components/ChestEquip";
import {VehicleRegisterBlock} from "./components/VehicleRegister";
import {DrivingSchool} from "./components/DrivingSchool";
import {DocumentBlock} from "./components/Document";
import {InteractItemsBlock, Interactive} from "./components/Interact";
import {TerminalBlock} from "./components/Terminal";
import {LicenseBlock} from "./components/License/Licenses";
import {RaceEditBlock} from "./components/Race";
import {TabletClass} from "./components/Tablet";
import NewAuth from "./components/NewAuth/NewAuth";
import {LoadScreenJoin} from "./components/LoadScreen";
import {Mission} from "./components/Dialog/mission";
import {Personage} from "./components/Personage/Personage";
import {Signature} from "./components/Signature/Signature";
import {Fuel} from "./components/Fuel/Fuel";
import {HudClass} from "./components/HudBlock";

import {BarberShop} from "./components/BarberShop/BarberShop";
import {MiniGame} from "./components/MiniGame";
import {GreetingScreenClass} from "./components/StartScreen";
import {RenderChatBlockClass} from "./components/Chat/chatBlock";
import {WorkSelect} from "./components/MiniGame/WorkSelect/work";
import {SuccessScreen} from "./components/SuccessInfo";
import {SpawnScreen} from "./components/Spawn";
import {InventoryClass} from "./components/Inventory/index_new";
import {Capture, CaptureMinimal} from "./components/Capture";
import {WinTask} from "./components/Wintask";
import {UdoBlock} from "./components/Udo";
import {StorageAlertData} from "../shared/alertsSettings";
import {CreateFamily} from "./components/Family";
import {Flat} from "./components/Flat";
import {JobSessions} from "./components/SessionJob";

import {FlatRes} from "./components/Flat/flatres";
import {RadarClass} from "./components/Radar";
import {LSC} from "./components/LSCnew";
import {BuyCar} from "./components/Buycar";
import {DriftCounterScreen, DriftScreen} from "./components/Drift";
import {LogsBlock} from "./components/Logs";
import {CasinoRoulette} from "./components/CasinoRoulette";
import {Casino} from "./components/Casino";
import {CasinoDice} from "./components/CasinoRoulette/dice";
import {CasinoDiceCroupier} from "./components/CasinoRoulette/dice-croupier";
import {SlotMachine} from "./components/CasinoRoulette/slotmachine";
import {AdminPanelComponent} from "./components/AdminPanel";
import {PayBlockComponent} from "./components/PayBox";
import {Boombox} from "./components/Boombox";
import {MiningComponent} from "./components/Mining";
import {NewPhone} from "./components/new-phone";
import {Marriage} from "./components/Marriage"
import {Animations} from "./components/Animations";
import {NumberPlate} from "./components/NumberPlate";
import {BreakLock} from "./components/BreakLock";
import {Buyers} from "./components/Buyers";
import {Interaction} from "./components/Interaction";
import {Rent} from './components/Rent';
import {Bank} from './components/Bank';
import {OrderOfGoods} from "./components/OrderOfGoods";
import {CasinoEnter} from "./components/CasinoEnter";
import {FinishInitQuests} from "./components/FinishInitQuests";
import {ATM} from './components/ATM';
import {Parking} from "./components/Parking";
import {GunGame} from './components/GunGame'
import {Market} from "./components/Market";
import {Farm} from "./components/Farm";
import {Dialogues} from "./components/Dialogues";
import {Potions} from "./components/Potions";
import {Bus} from "./components/Bus";
import {Electrician} from "./components/Electrician";
import {ElectricianGames} from "./components/ElectricianGames";
import {CandyShop} from "./components/CandyShop";
import {Walkie} from "./components/Walkie";
import {AdvancedQuests} from "./components/AdvancedQuests";
import {LollipopsExchanger} from "./components/LollipopsExchanger";
import {DivingEmployer} from "./components/DivingEmployer";
import {DivingGames} from "./components/DivingGames";
import {SnowWar} from "./components/SnowWar"
import {NewYearsGift} from "./components/NewYearsGift";
import {BattlePass} from "./components/BattlePass";
import {RealEstateAgency} from "./components/RealEstateAgency";
import {FurnitureStore} from "./components/FurnitureStore";
import {InteriorControl} from "./components/InteriorControl";
import {InteriorHud} from "./components/InteriorHud";
import CollectGarbage from "./components/CollectGarbage";
import SortGarbage from "./components/SortGarbage";
import Garbage from "./components/Garbage";
import GarbageLobby from "./components/GarbageLobby";

import WalkieStore from "./stores/Walkie";
import WalkieStoreEvents from "./stores/Walkie/events";
import CrosshairStore from "./stores/Crosshair";
import CrosshairStoreEvents from "./stores/Crosshair/events";
import HudGunGameStore from "./stores/HudGunGame";
import HudGunGameEvents from "./stores/HudGunGame/event";
import LicensesStore from "./stores/Licenses";
import LicensesEvents from "./stores/Licenses/event"
import LoadScreenJoinStore from "./stores/LoadScreenJoin";
import LoadScreenJoinEvents from "./stores/LoadScreenJoin/events";
import PayBlockStore from "./stores/PayBlock";
import PayBlockEvents from "./stores/PayBlock/events";
import { playAudio, setPaused, soundData, stopAudio } from './sound'
import AgencyStore from "./stores/Agency";
import AgencyEvents from "./stores/Agency/events";
import FurnitureShopStore from "./stores/FurnitureShopStore";
import FurnitureShopEvents from "./stores/FurnitureShopStore/events";
import HomeMenuStore from "./stores/HomeMenu";
import HomeMenuEvents from "./stores/HomeMenu/events";
import FurnitureHudStore from "./stores/FurnitureHud";
import FurnitureHudEvents from './stores/FurnitureHud/events';
import BattlePassStorageStore from './stores/BattlePassStorage';
import BattlePassStorageEvents from './stores/BattlePassStorage/events';
import IslandBattleStore from "./stores/IslandBattle";
import IslandBattleEvents from "./stores/IslandBattle/events";
import { CarSharing } from './components/CarSharing'
import Monopoly from "./components/Monopoly";

let init = false;
let documentIds = 0;

export const setInit = () => {
    if (!init) mp.trigger("gui:ready");
    init = true;
};

export let alertsEnable: StorageAlertData = {};

export class App extends Component<{},
    {
        driftData?: { ids: number; status: boolean; angle: number; speed: number };
        unitpayLink?: string;
        login?: boolean;
        gui: guiNames;
        enableRenderFamilyPlayerBlips: boolean;
        floatGUI: floatGUINames;
        documents: {
            level: number;
            id: number;
            userid: number;
            house: string;
            number: string;
            name: string;
            male: number;
            partner: string;
            age: number;
        }[];
        audioEnable: StorageAlertData;
    }> {
    video: React.RefObject<HTMLVideoElement>;
    introAudio: React.RefObject<HTMLAudioElement>;
    audioInt: any;
    enableRenderFamilyPlayerBlips: false;
    stores: {
        Walkie: WalkieStore,
        Crosshair: CrosshairStore,
        HudGunGame: HudGunGameStore,
        Licenses: LicensesStore,
        LoadScreenJoin: LoadScreenJoinStore,
        PayBlock: PayBlockStore,
        Agency: AgencyStore,
        FurnitureShop: FurnitureShopStore,
        HomeMenu: HomeMenuStore,
        FurnitureHud: FurnitureHudStore,
        BattlePassStorage: BattlePassStorageStore,
        IslandBattle: IslandBattleStore,
    };

    constructor(props: any) {
        super(props);

        this.state = {
            enableRenderFamilyPlayerBlips: true,
            gui: 'init',
            floatGUI: null,
            documents: [],
            audioEnable: {}
        };

        CustomEvent.clearRegisterAll();

        this.stores = {
            Walkie: useLocalStore(new WalkieStore(), WalkieStoreEvents),
            Crosshair: useLocalStore(new CrosshairStore(), CrosshairStoreEvents),
            HudGunGame: useLocalStore(new HudGunGameStore(), HudGunGameEvents),
            Licenses: useLocalStore(new LicensesStore(), LicensesEvents),
            LoadScreenJoin: useLocalStore(new LoadScreenJoinStore(), LoadScreenJoinEvents),
            PayBlock: useLocalStore(new PayBlockStore(), PayBlockEvents),
            Agency: useLocalStore(new AgencyStore(), AgencyEvents),
            FurnitureShop: useLocalStore(new FurnitureShopStore(), FurnitureShopEvents),
            HomeMenu: useLocalStore(new HomeMenuStore(), HomeMenuEvents),
            FurnitureHud: useLocalStore(new FurnitureHudStore(), FurnitureHudEvents),
            BattlePassStorage: useLocalStore(new BattlePassStorageStore(), BattlePassStorageEvents),
            IslandBattle: useLocalStore(new IslandBattleStore(), IslandBattleEvents),
        }
        CustomEvent.register("setGui", (gui: guiNames) => {
            CustomEvent.triggerClient("cef:setGui", gui);
            this.setGui(gui);
        });

        CustomEvent.register("setFloatGUI", (name: floatGUINames) => {
            this.setFloatGUI(name);
        });

        CustomEvent.register("enableRenderFamilyPlayerBlips", (toggle: boolean) => {
            this.setState({
                enableRenderFamilyPlayerBlips: toggle
            })
        });

        CustomEvent.register("notify:doomsdayNight", () => {
            CEF.playSound('thepurgeonyx', 0.7)
        });
        CustomEvent.register(
            "cef:idcard:new",
            (data: {
                level: number;
                house: string;
                number: string;
                name: string;
                male: number;
                partner: string;
                age: number;
                id: number;
            }) => {
                let d = [...this.state.documents];
                let ind = d.findIndex((q) => q.number === data.number);
                if (ind > -1) {
                    d[ind] = {...d[ind], ...data};
                    return this.setState({documents: d});
                }
                documentIds++;
                this.setState({
                    documents: [
                        ...this.state.documents,
                        {...data, id: parseInt(`${documentIds}`), userid: data.id},
                    ],
                });
            }
        );
        CustomEvent.register("user:name", (name) => {
            CEF.user.name = name;
        });

        CustomEvent.register("sound:data", (str: {id: string, pan: number, volume: number}[]) => {
            soundData(str)
        });
        CustomEvent.register("sound:play", (id: string, url: string, pos = 0, volume = 1, pan: number = 0) => {
            playAudio(id, url, pos, volume, pan)
        });
        CustomEvent.register("sound:stop", (id: string) => {
            stopAudio(id)
        });
        CustomEvent.register("sound:setPaused", (id: string, val: boolean) => {
            setPaused(id, val)
        });

        CustomEvent.register("playSound", (url: string, volume = 0.08) => {
            return CEF.playSound(url, volume);
        });

        CustomEvent.register("alerts:enable", (audioEnable: StorageAlertData) => {
            this.setState({audioEnable});
            alertsEnable = audioEnable;
        });
        CustomEvent.triggerClient("alerts:load");

        this.video = createRef();
        this.introAudio = createRef();
        this.audioInt = setInterval(() => {
            if (["init"].includes(this.state.gui)) return;
            this.checkSound();
        }, 1000);

    }

    componentDidMount() {
        setTimeout(() => {
            if (!CEF.test) CEF.gui.setGui("init");
            // if (CEF.test) CEF.gui.setGui("tablet");
        }, 100);
    }

    componentWillUnmount() {
        if (this.audioInt) clearInterval(this.audioInt);
    }

    checkSound() {
        if (!this.state.audioEnable.background)
            return this.introAudio.current.pause();
        this.introAudio.current.volume = CEF.test ? 0.0 : 0.05;
        if (["init", "reg", "login", "personage"].includes(this.state.gui))
            return this.introAudio.current.play();
        else return this.introAudio.current.pause();
    }

    setFloatGUI(name: floatGUINames) {
        this.setState({floatGUI: name});
    }

    setGui(name: guiNames) {
        this.setState({gui: name}, () => {
            this.checkSound();
        });
        CustomEvent.trigger("menu:hide", !!name);
    }

    render() {

        return (
            <>
                <AdminPanelComponent/>
                <PayBlockComponent store={this.stores.PayBlock}/>
                <SuccessScreen/>
                <DriftCounterScreen/>
                <RadarClass/>
                <audio
                    src={
                        "https://s3.timeweb.com/390a2851-onyx/attachments/loadmusic.mp3"
                    }
                    loop={true}
                    ref={this.introAudio}
                />
                {(["reg", "login"] as guiNames[]).includes(this.state.gui) ? (
                    <NewAuth/>
                ) : (
                    ""
                )}
                <Capture/>
                <CaptureMinimal/>
                {this.state.gui == "mining" ? <MiningComponent/> : ""}
                {this.state.gui == "wintask" ? <WinTask/> : ""}
                {this.state.gui == "spawn" ? <SpawnScreen/> : ""}
                {this.state.gui == "family" ? <CreateFamily/> : ""}
                {this.state.gui == "barber" ? <BarberShop/> : ""}
                {this.state.gui == "logs" ? <LogsBlock/> : ""}
                {this.state.gui == "fuel" ? <Fuel/> : ""}
                {this.state.gui == "greeting" ? <GreetingScreenClass/> : ""}
                {this.state.gui == "adminchat" ? (
                    <RenderChatBlockClass id={"admin_chat"}/>
                ) : (
                    ""
                )}
                {this.state.gui == "admincheat" ? (
                    <RenderChatBlockClass id={"admin_cheat"}/>
                ) : (
                    ""
                )}
                {this.state.gui == "personage" ? <Personage/> : ""}
                {this.state.gui == "inventory" ? <InventoryClass/> : ""}
                {this.state.gui == "dialog" ? <Dialog/> : ""}
                {this.state.gui == "shop" ? <ShopBlock/> : ""}
                {/* {this.state.gui == "idcard" ? <IdCardBlock />: ""} */}
                {this.state.gui == "mainmenu" ? <UserMenuBlock CrosshairStore={this.stores.Crosshair}/> : ""}
                {this.state.gui == "autosalon" ? <Autosalon/> : ""}
                {this.state.gui == "clothshop" ? <ClothShop/> : ""}
                {this.state.gui == "tattooshop" ? <TattooShop/> : ""}
                {this.state.gui == "chest" ? <ChestEquip/> : ""}
                {this.state.gui == "vehicleregister" ? <VehicleRegisterBlock/> : ""}
                {this.state.gui == "drivingschool" ? <DrivingSchool/> : ""}
                {this.state.gui == "interaction" ? <Interactive/> : ""}
                {this.state.gui == "tablet" ? <TabletClass enableRenderFamilyPlayerBlips={this.state.enableRenderFamilyPlayerBlips}/> : ""}
                {this.state.gui == "npcdialog" ? <Mission/> : ""}
                {this.state.gui == "signature" ? <Signature/> : ""}
                {this.state.gui == "workselect" ? <WorkSelect/> : ""}
                {this.state.gui == "lsc" ? <LSC/> : ""}
                {this.state.gui == "flat" ? <Flat/> : ""}
                {this.state.gui == "flatres" ? <FlatRes/> : ""}
                {this.state.gui == "casino" ? <Casino/> : ""}
                {this.state.gui == "casinoroulette" ? <CasinoRoulette/> : ""}
                {this.state.gui == "buycar" ? <BuyCar/> : ""}
                {this.state.gui == "casinodice" ? <CasinoDice/> : ""}
                {this.state.gui == "casinodicecroupier" ? <CasinoDiceCroupier/> : ""}
                {this.state.gui == "boombox" ? <Boombox/> : ""}
                {this.state.gui == "marriage" ? <Marriage/> : ""}
                {this.state.gui == "animations" ? <Animations/> : ""}
                {this.state.gui == "numberplate" ? <NumberPlate/> : ""}
                {this.state.gui == "jobSessions" ? <JobSessions/> : ""}
                {this.state.gui == "buyers" ? <Buyers/> : ""}
                {this.state.gui == "BreakLock" ? <BreakLock/> : ""}
                {this.state.gui == "interact" ? <Interaction/> : ""}
                {this.state.gui == "rent" ? <Rent/> : ""}
                {this.state.gui == "bank" ? <Bank/> : ""}
                {this.state.gui == "orderofgoods" ? <OrderOfGoods/> : ""}
                {this.state.gui == "casinoenter" ? <CasinoEnter/> : ""}
                {this.state.gui == "finishinitquests" ? <FinishInitQuests/> : ""}
                {this.state.gui == "atm" ? <ATM/> : ""}
                {this.state.gui == "gungame" ? <GunGame/> : ""}
                {this.state.gui == "market" ? <Market/> : ""}
                {this.state.gui == "farm" ? <Farm/> : ""}
                {this.state.gui == "busman" ? <Bus/> : ""}
                {this.state.gui == "electrician" ? <Electrician/> : ""}
                {this.state.gui == "electriciangames" ? <ElectricianGames/> : ""}
                {this.state.gui == "dialogs" ? <Dialogues/> : ""}
                {this.state.gui == "potions" ? <Potions/> : ""}
                {this.state.gui == "candyShop" ? <CandyShop/> : ""}
                {this.state.gui == "parking" ? <Parking /> : ""}

                {this.state.gui == "advancedQuests" ? <AdvancedQuests /> : ""}
                {this.state.gui == "lollipopsExchanger" ? <LollipopsExchanger /> : ""}
                {this.state.gui == "newYearsGift" ? <NewYearsGift /> : ""}
                {this.state.gui == "divingEmployer" ? <DivingEmployer /> : ""}
                {this.state.gui == "divingGames" ? <DivingGames /> : ""}
                {this.state.gui == "snowWar" ? <SnowWar /> : ""}
                {this.state.gui == "battlePass" ? <BattlePass storageStore={this.stores.BattlePassStorage}/> : ""}
                {this.state.gui == "realEstateAgency" ? <RealEstateAgency store={this.stores.Agency} /> : ""}
                {this.state.gui == "furnitureStore" ? <FurnitureStore store={this.stores.FurnitureShop}/> : ""}
                {this.state.gui == "interiorControl" ? <InteriorControl store={this.stores.HomeMenu}/> : ""}
                {this.state.gui == "interiorHud" ? <InteriorHud store={this.stores.FurnitureHud}/> : ""}
                {this.state.gui == "collectGarbage" ? <CollectGarbage/> : ""}
                {this.state.gui == "sortGarbage" ? <SortGarbage/> : ""}
                {this.state.gui == "garbage" ? <Garbage/> : ""}
                {this.state.gui == "garbageLobby" ? <GarbageLobby/> : ""}
                {this.state.gui == "carSharing" ? <CarSharing /> : ""}
                {this.state.gui == "monopoly" ? <Monopoly /> : ""}

                <SlotMachine/>

                {this.state.gui == "init"
                    ? <LoadScreenJoin LoadScreenJoinStore={this.stores.LoadScreenJoin} />
                    : ""
                }
                <DriftScreen/>
                {this.state.documents.map((item) => {
                    return (
                        <IdCardBlock
                            userid={item.userid}
                            level={item.level}
                            age={item.age}
                            key={`bl_${item.id}`}
                            id={item.id}
                            house={item.house}
                            serial={item.number}
                            name={item.name}
                            male={!!item.male}
                            partner={item.partner}
                            onClose={(i) => {
                                let docs = [...this.state.documents];
                                docs.splice(
                                    docs.findIndex((q) => q.id === i),
                                    1
                                );
                                this.setState({documents: docs});
                            }}
                        />
                    );
                })}
                <Menu/>
                <HudClass alertsData={alertsEnable} CrosshairStore={this.stores.Crosshair} HudGunGameStore={this.stores.HudGunGame}
                IslandBattleStore={this.stores.IslandBattle}/>
                <AcceptBlock/>
                {this.stores.Walkie.show && <Walkie store={this.stores.Walkie}/>}
                <DocumentBlock/>
                <InteractItemsBlock/>
                <TerminalBlock/>
                <LicenseBlock store={this.stores.Licenses}/>
                <UdoBlock/>
                <RaceEditBlock/>
                <MiniGame/>
                <NewPhone/>

                <div className="alert-wrapper"/>
                <div className="hud-alert-wrapper"/>
            </>
        );
    }
}
