import React, { Component, createRef } from 'react';
import './inventory.less';
import {
    CONTAINERS_DATA,
    convertInventoryItemArrayToObject,
    convertInventoryItemObjectToArray,
    ExchangeData,
    ExchangeReadyStatus,
    getItemDesc,
    getItemName,
    getItemWeight,
    InventoryChoiseItemData,
    InventoryDataCef,
    InventoryEquipList,
    InventoryItemCef,
    inventoryShared,
    InventoryWeaponPlayerData,
    ITEM_TYPE,
    OWNER_TYPES,
    PLAYER_INVENTORY_MAX_LEVEL
} from "../../../shared/inventory";
import { CEF } from "../../modules/CEF";
import svg from "./images/svg/*.svg"
import images from "./images/*.png"
import iconsItems from '../../../shared/icons/*.png';
import { system } from "../../modules/system";
import { systemUtil } from "../../../shared/system";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { DraggableCore } from "react-draggable";
// import DragDropContainer from "../../modules/DragDropContainer";
// import DropTarget from "../../modules/DropTarget";
//import './assets/style.less'
import ellipse from './../Dialog/assets/ellipse.svg';
import { createStyles, Slider, withStyles } from '@material-ui/core';
import { DONATE_MONEY_NAMES, getDonateItemConfig } from "../../../shared/economy";

const generateTestInventory = (count = 15) => {
    let items = inventoryShared.items.map((item, index) => {
        return convertInventoryItemObjectToArray({
            id: index + 1,
            item_id: item.item_id,
            count: item.default_count || 1,
            serial: "test",
            extra: '{}'
        })
    });
    let res: InventoryItemCef[] = [];
    for (let id = 0; id < count; id++) {
        res.push(systemUtil.randomArrayElement(items))
    }
    return res
}

interface InventoryMainData extends InventoryEquipList {
    equip: InventoryEquipList;
    weapons: InventoryWeaponPlayerData;
    blocks: InventoryDataCef[];
    hotkeys: [number | null, number | null, number | null, number | null, number | null];
    open: boolean,
    addModal?: boolean,
    containerType: OWNER_TYPES,
    containerNumber: number,
    current?: [ OWNER_TYPES, number],
    inv_level?:number,
    isExchangeOpened?: boolean,
    exchangeData?: ExchangeData,
    mouseOnItem: { x: number, y: number, itemName: string },
}

interface ItemDrawProps {
    inventory: InventoryClass,
    item: InventoryItemCef,
    owner_type: OWNER_TYPES,
    owner_id: number,
    keyName: any,
    isDraggable?: { x: number, y: number },
    ishotkey?: boolean
}

interface ItemDrawState {
    rightClick?: boolean,
    left?: number,
    top?: number,
    position?:[number,number],
    clickPress?: boolean,
    split?:number
}

class ItemDraw extends Component<ItemDrawProps, ItemDrawState> {
    div: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.div = createRef()
        this.state = {
            position: [0,0],
            split: 0
        }
    }

    get item() {
        return convertInventoryItemArrayToObject(this.props.item);
    }

    get itemCfg() {
        return inventoryShared.get(this.item.item_id)
    }

    get weaponCfg() {
        const cfg = this.itemCfg
        if(cfg.type !== ITEM_TYPE.WEAPON) return;
        return inventoryShared.getWeaponConfigByItemId(this.item.item_id)
    }

    get owner_type() {
        return this.props.owner_type
    }

    get owner_id() {
        return this.props.owner_id
    }

    get blocks() {
        return this.props.inventory.state.blocks
    }

    get inventory() {
        return this.props.inventory
    }


    transfer(target_type: OWNER_TYPES, target_id: number) {
        if(target_type === OWNER_TYPES.WORLD) return this.dropItem();
        if (this.owner_type === OWNER_TYPES.WORLD && (target_type !== OWNER_TYPES.PLAYER || target_id !== CEF.id)) return;
        this.setState({rightClick: false}, () => {
            this.choiceItem({task: 'transfer', target_type, target_id})
            CEF.playSound('up-inventory', 0.05);
        })
    }


    useItem(e: React.MouseEvent<any, MouseEvent>) {
        const inv = !this.weaponCfg ? CONTAINERS_DATA.find(c => c.item_id === this.item.item_id) : null;
        if (!inv && this.owner_type != OWNER_TYPES.PLAYER) return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
        if (!inv && this.owner_id != CEF.id) return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
        if (!this.canUse) return;
        if(inv) this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
        this.setState({rightClick: false}, () => {
            if(!inv) this.choiceItem({task: 'useItem'})
            CEF.playSound('up-inventory', 0.05);
        })
    }
    weaponMods(e: React.MouseEvent<any, MouseEvent>) {
        const inv = CONTAINERS_DATA.find(c => c.item_id === this.item.item_id);
        if (!inv) return this.useItem(e);
        this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
        this.setState({rightClick: false}, () => {
            CEF.playSound('up-inventory', 0.05);
        })
    }

    split( amount: number ) {
        // if(!this.isMyInventory) return;
        if(this.item.count < 2 || amount < 1 || amount > this.item.count-1 ) return;
        // TODO добавить выбор количества, перменная amount - это количество, сколько будет перекинуто в новый пердмет

        if(this.item.count - amount < 1) return;
        this.setState({rightClick: false, split: 0}, () => {
            this.choiceItem({task: 'split', target_id: amount})
            CEF.playSound('up-inventory', 0.05);
        })
    }

    dropItem() {
        if (this.owner_type === OWNER_TYPES.WORLD) return;
        this.setState({rightClick: false}, () => {
            this.choiceItem({task: 'drop'})
            CEF.playSound('drop-inventory', 0.05);
        })
    }

    addToExchange() {
        const itemConfig = inventoryShared.get(this.item.item_id);
        if (itemConfig.blockMove) {
            return;
        }

        CustomEvent.triggerServer('inventory::exchange::add', this.props.item[0]);
    }

    selectToDisplay() {
        if (this.itemCfg.type === ITEM_TYPE.BAGS)
            CustomEvent.triggerServer('inventory:bag:selectDisplay', this.item.id);
    }

    private choiceItem(data: Partial<InventoryChoiseItemData>) {
        this.setState({rightClick: false}, () => {
            CustomEvent.triggerServer('inventory:choiceItem', {
                item: {
                    id: this.item.id
                },
                owner_type: this.owner_type,
                owner_id: this.owner_id,
                ...data
            })
        })
    }

    get canUse() {
        const cfg = this.itemCfg;
        const inv = CONTAINERS_DATA.find(c => c.item_id === this.item.item_id);
        if(inv) return true;
        return cfg.use && this.isMyInventory
    }

    get isMyInventory() {
        return this.owner_type === OWNER_TYPES.PLAYER && this.owner_id === CEF.id;
    }

    get hotkeys() {
        return this.props.inventory.state.hotkeys
    }

    get id() {
        return this.item.id
    }

    get hotkeySlot() {
        return this.hotkeys.findIndex(q => q === this.id)
    }


    get drawEquipHotkeyChoice() {
        let items: JSX.Element[] = [];
        if (this.hotkeys.find(q => q === this.id)) {
            items.push(<li key={`equip_hotkey_li_unload`} onClick={e => {
                e.preventDefault();
                this.choiceItem({task: 'unload_hotkey', owner_id: this.hotkeySlot})
            }}>
                <img tabIndex={-1} src={svg["use"]} width="24" height="24" alt={''}/>
                <p tabIndex={-1} className="p-14px fw500 dark">Очистить хоткей {this.hotkeySlot + 1}</p>
            </li>)
        } else {
            for (let id = 0; id < 5; id++) {
                items.push(<li onClick={e => {
                    e.preventDefault();
                    this.choiceItem({task: 'load_hotkey', owner_id: id})
                }} key={`equip_hotkey_li_${id}`}>
                    <img tabIndex={-1} src={svg["keyboard"]} width="24" height="24" alt={''}/>
                    <p tabIndex={-1} className="p-14px fw500 dark">Назначить на {id + 1} слот быстрого доступа</p>
                </li>)
            }
        }

        return items;
    }
    modalResponse = (key:number) => {
        let split = this.state.split;
        this.setState( {...this.state, split: 0 })
        if( key !== 0 ) return;
        // if(!this.isMyInventory) return;
        if(this.item.count < 2) return;
        this.split( split );
    }
    modal = () => {
        if( !this.state.split ) return;
        return (
            <div tabIndex={-1} className="dialog_main_wrap" style={{zIndex: 20000, position: 'absolute'}}>
            <div tabIndex={-1} className={`dialog_main`} style={{position: 'fixed', left: 0, top: 0}}>
              <div tabIndex={-1} className="dialog_blur" />
              <div tabIndex={-1} className="dialog_grid" />
              <img tabIndex={-1} className="dialog_ellipse" src={ellipse} />
              <div tabIndex={-1} className="dialog_box">
                <h1>Разделение</h1>
                <p>Выберите количество, которое хотите отделить</p>
                <div tabIndex={-1} className="dialog_info">
                    {this.addSlider( this.state.split, this.item.count-1 , (value:number) => { this.setState( { ...this.state, split: value })})}
                </div>
                <h5>{this.state.split}/{this.item.count-this.state.split}</h5>
                <div tabIndex={-1} className="dialog_button">
                  <div tabIndex={-1} className="dialog_key" onClick={() => this.modalResponse(0)} >Далее</div>
                  <div tabIndex={-1} className="dialog_key" onClick={() => this.modalResponse(1)} >Отмена</div>
                </div>
              </div>
            </div>
            </div>
          );
    }

    addSlider = (value: number, max:number, onChange: ( val: number) => void) => {
        return <div tabIndex={-1} style={{width:"80%"}}>
            <NewSliderStyles min={1} max={max} step={1} value={value}
                             valueLabelDisplay="off"
                             getAriaValueText={(value: number) => {
                                 return `${value}%`
                             }} onChange={(_, val:number) => onChange( val )}/>
        </div>;
    }

    get drawTooltip() {
        let pos = this.positionTooltip;
        const cfg = this.itemCfg;
        const canUse = this.canUse;
        let obj = document.getElementById(`item_continer_draggable_${this.props.owner_type}_${this.props.owner_id}`);
        let posX = 0, posY = 0;
        if( obj && this.props.isDraggable ) {
              posX = obj.offsetLeft-obj.offsetWidth/2;
              posY = obj.offsetTop-obj.offsetHeight;
              pos.left -= posX;
              pos.top -= posY;
        }

        const desc = !this.props.ishotkey ? getItemDesc(cfg.item_id) : null

        return <div tabIndex={-1} className="mini-modal-menu-inventory-body">
            <div tabIndex={-1} className="mini-modal-menu-inventory-background" onClick={e => {
                e.preventDefault();
                this.setState({rightClick: false})
            }} onContextMenu={e => {
                e.preventDefault();
                this.setState({rightClick: false})
            }}/>
            {/*@ts-ignore*/}
            <div tabIndex={-1} className="mini-modal-menu-inventory" style={ {...pos, transform: (window.innerHeight / 2) > pos.top ? '' : `translateY(-22vw)`} } onClick={e => {
                e.preventDefault();
            }}>
                <div tabIndex={-1} className="descr-wrap br4">
                    <p tabIndex={-1} className="p-16px fw500 dark">{getItemName(this.item)}</p>
                    <div tabIndex={-1} className="space-backpack">
                        {/*<p tabIndex={-1} className="p-12px fw500 dark-04">x{this.item.count}</p>*/}
                        <div tabIndex={-1} className="weight-backpack">
                            <img tabIndex={-1} src={svg["backpack-dark-04"]} alt={''}/>
                            <p tabIndex={-1} className="p-12px fw500 dark-04">{(getItemWeight(this.item.item_id, this.item.count) / 1000).toFixed(3)} кг</p>
                        </div>
                    </div>
                    {desc ? <div tabIndex={-1} className="text-wrap">
                        <p tabIndex={-1} className="p-14px fw400 dark lh120" style={{whiteSpace: 'pre-line'}}>{desc}</p>
                    </div> : <></>}
                </div>
                <ul className="mini-modal-menu-wrap br4">
                    {/**/}
                    {this.owner_type === OWNER_TYPES.WORLD ?
                    <>
                        <li onClick={e => {
                            e.preventDefault();
                            this.transfer(OWNER_TYPES.PLAYER, CEF.id)
                        }}>
                            <img tabIndex={-1} src={svg["pat-pass"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">Поднять</p>
                        </li>
                        {this.itemCfg.canSplit && this.item.count > 1 &&
                            <li onClick={e => {
                                e.preventDefault();
                                if(this.item.count < 2) return;
                                this.setState({ ...this.state,rightClick: false, split: 1 });
                            }}>
                                <img tabIndex={-1} src={svg["divide"]} width="24" height="24" alt=""/>
                                <p tabIndex={-1} className="p-14px fw500 dark">Разделить</p>
                            </li>
                        }
                    </>
                        :
                    <>
                        {this.inventory.state.isExchangeOpened &&
                            <li onClick={e => {
                                e.preventDefault();
                                this.addToExchange()
                            }}>
                                <img tabIndex={-1} src={svg["throw-away"]} width="24" height="24" alt=""/>
                                <p tabIndex={-1} className="p-14px fw500 dark">Добавить в обмен</p>
                            </li>
                        }
                        <li onClick={e => {
                            e.preventDefault();
                            this.dropItem()
                        }}>
                            <img tabIndex={-1} src={svg["throw-away"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">Выбросить</p>
                        </li>
                        {this.itemCfg.type === ITEM_TYPE.BAGS && CONTAINERS_DATA.find(d => d.item_id === this.item.item_id)?.bag_sync &&
                        <li onClick={e => {
                            e.preventDefault();
                            this.selectToDisplay()
                        }}>
                            <img tabIndex={-1} src={svg["throw-away"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">Отображать сумку</p>
                        </li>
                        }
                        {canUse ? <li onClick={e => {
                            e.preventDefault();
                            if (!canUse) return;
                            this.useItem(e)
                        }}>
                            <img tabIndex={-1} src={svg["use"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">{this.inventory.state.weapons && this.inventory.state.weapons.id === this.id ? 'Снять с экипировки' : (this.itemCfg.inHand ? 'Взять в руки' : 'Использовать')}</p>
                        </li> : <></>}
                        {canUse && this.itemCfg.type === ITEM_TYPE.WEAPON && this.weaponCfg && this.weaponCfg.addons ? <li onClick={e => {
                            e.preventDefault();
                            if (!canUse) return;
                            this.weaponMods(e)
                        }}>
                            <img tabIndex={-1} src={svg["use"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">Модификации</p>
                        </li> : <></>}
                        {this.itemCfg.canSplit && this.item.count > 1 ? <li onClick={e => {
                            e.preventDefault();
                            if(this.item.count < 2) return;
                            this.setState({ ...this.state,rightClick: false, split: 1 });
//                            this.split()
                        }}>
                            <img tabIndex={-1} src={svg["divide"]} width="24" height="24" alt=""/>
                            <p tabIndex={-1} className="p-14px fw500 dark">Разделить</p>
                        </li> : <></>}

                        {this.blocks.filter(q => q.owner_type !== OWNER_TYPES.WORLD && !(q.owner_type === this.owner_type && q.owner_id === this.owner_id)).map(target => {
                            return <li onClick={e => {
                                e.preventDefault();
                                this.transfer(target.owner_type, target.owner_id)
                            }} key={`item_choice_${target.owner_type}_${target.owner_id}`}>
                                <img tabIndex={-1} src={svg["pat-pass"]} width="24" height="24" alt=""/>
                                {target.owner_type === OWNER_TYPES.PLAYER && target.owner_id === CEF.id ?
                                    <p tabIndex={-1} className="p-14px fw500 dark">Взять</p> :
                                    <p tabIndex={-1} className="p-14px fw500 dark">{target.owner_type === OWNER_TYPES.PLAYER ? 'Передать игроку' : ([OWNER_TYPES.VEHICLE, OWNER_TYPES.VEHICLE_TEMP].includes(target.owner_type) ? 'Положить в багажник' : 'Положить в')} {target.name} {target.desc}</p>}

                            </li>
                        })}

                        {this.isMyInventory ? this.drawEquipHotkeyChoice : <></>}
                    </>}

                    {/*<li className="lock">*/}
                    {/*    <img tabIndex=-1 src={svg["pat-pass"]} width="24" height="24" alt="" />*/}
                    {/*    <p tabIndex={-1} className="p-14px fw500 dark">Передать игроку ID 230423</p>*/}
                    {/*</li>*/}
                </ul>
            </div>
        </div>
    }

    get positionTooltip() {
        return {
            left: this.state.left + 10,
            top: this.state.top + 10,
        }
    }
    startDrag = (data:any) => {
        this.setState( {...this.state, position: [0.0,0.0]});
//        this.inventory.currentItem( this.props.owner_type, this.props.owner_id );
    }
    stopDrag = (e:any,data:any) => {
        // e.preventDefault();
        this.setState( {...this.state, position: [0.0,0.0]});
        switch( this.inventory.state.containerType )
        {
            case -1:
                break;
            case OWNER_TYPES.HOTKEY: {
                if(this.props.ishotkey) break;
                this.choiceItem({task: 'load_hotkey', owner_id: this.inventory.state.containerNumber})
                // в хоткей
                break;
            }
            case OWNER_TYPES.CLOTHES: {
                this.useItem(e)
                break;
            }
            default: {
                if(this.inventory.state.containerType === this.owner_type && this.inventory.state.containerNumber === this.owner_id) return;
                this.transfer(this.inventory.state.containerType, this.inventory.state.containerNumber);
                break;
            }
        }
        this.inventory.currentItem( -1, -1 );
    }
    onDrag = ( e:MouseEvent, data:any) => {
        if( this.props.owner_type != this.inventory.state.current[0] && this.props.owner_id != this.inventory.state.current[1])
            this.inventory.currentItem( this.props.owner_type, this.props.owner_id );
        this.setState( {...this.state, rightClick:false,position: [ e.clientX/document.documentElement.clientWidth *100 , e.clientY / document.documentElement.clientHeight *100]});
    }
    render() {
        if (!this.item) return <></>;
        let obj = document.getElementById(`item_continer_draggable_${this.props.owner_type}_${this.props.owner_id}`);
        let posX = 0, posY = 0;
        if( obj && this.props.isDraggable ) {
              posX = obj.offsetLeft-obj.offsetWidth/2;
              posY = obj.offsetTop-obj.offsetHeight;
        }
        return <>
            { this.modal()}
            <DraggableCore disabled={this.state.rightClick} key={`${this.props.owner_type}_${this.props.owner_id}_${this.item.id}_${this.props.keyName}`}
                                        grid = { [ 0.5 ,  0.5 ] }
                                        onStart={(e: MouseEvent, data: Object) => this.startDrag(data )}
                                        onDrag={(e: MouseEvent, data: Object) => this.onDrag( e, data )}
                                        onStop={(e: MouseEvent, data: Object) => this.stopDrag(e,data )}>
            <div tabIndex={-1}>
                {this.state.rightClick ? this.drawTooltip : <></>}
                <div tabIndex={-1} className="inventory-item-main-drag"
                    style={{ position: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ?  'static' : 'relative',
                            zIndex: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ? 10006:10004,
                            pointerEvents: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ?  'none' : 'auto'}}>
                <div tabIndex={-1} className="inventory-item-main-wrap br4"
                    onContextMenu={e => {
                    e.preventDefault();
                    console.log(e.pageY)
                    this.setState({rightClick: true, left: e.pageX, top: e.pageY})
                }} ref={this.div}
                    key={`${this.props.owner_type}_${this.props.owner_id}_${this.item.id}_${this.props.keyName}`}
                    onClick={e => {
                        e.preventDefault();
                        if(!this.state.clickPress){
                            this.setState({clickPress: true}, () => {
                                setTimeout(() => {
                                    this.setState({clickPress: false});
                                }, 550)
                            })
                            return;
                        }
                        this.useItem(e)
                    }}
                    style={{
                        transition: 'none',
                        top: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ? `calc( ${this.props.isDraggable != undefined ? '-2.08vw' : "-2.08vw"} + ${this.state.position[1]}vh - ${posY}px)`: `auto`,
                        zIndex: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ? 10006:10004,
                        left: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0 ) ?  `calc( ${this.props.isDraggable != undefined ? '-2.08vw' : "-2.08vw"} + ${this.state.position[0]}vw - ${posX}px)`: `auto`,
                        position: `absolute`,
                        boxShadow: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0) ? "24px 24px 24px rgba(0, 0, 0, 0.4)":null,
                        transform: ( this.state.position[1] != 0.0 && this.state.position[0] != 0.0) ? "rotate(15deg)" : null}}>
                    <div tabIndex={-1} className="in-inventory-item-main-wrap br4">
                        <div tabIndex={-1} className="img-wrap">
                            <img tabIndex={-1} src={`http://cloud.detroitgta-5.ru/items/Item_${this.item.item_id}.png`} alt="" draggable="false"/>
                        </div>
                        {!this.props.ishotkey ? <i tabIndex={-1} className="count p-14px fw700 upper">{this.item.count}</i> : <></>}
                    </div>
                </div>
                </div>
            </div>
            </DraggableCore>
        </>
    }
}

export class InventoryClass extends Component<{}, InventoryMainData> {
    openExchangeEv: CustomEventHandler;
    updateExchangeEv: CustomEventHandler;
    openInventoryEv: CustomEventHandler;
    updateInventoryEv: CustomEventHandler;
    dressEv: CustomEventHandler;

    constructor(props: any) {
        super(props);
        // @ts-ignore
        this.state = {
            hotkeys: [null, null, null, null, null],
            equip: {},
            containerType: -1,
            containerNumber: -1,
            current: [ -1, -1]
        }

        this.openExchangeEv = CustomEvent.register(
            'inventory:exchange',
            (
                myInventory: InventoryDataCef,
                exchange: ExchangeData,
                equip: InventoryEquipList,
                weapons: InventoryWeaponPlayerData,
                hotkeys: [number, number, number, number, number],
                inv_level: number,
            ) => {
                this.openExchangeMenu(myInventory, exchange, equip, weapons, hotkeys, inv_level);
            }
        );

        this.updateExchangeEv = CustomEvent.register(
            'inventory:exchange:update',
            (
                exchangeData: ExchangeData
            ) => {
                this.setState({
                    exchangeData
                })
            }
        );

        this.openInventoryEv = CustomEvent.register(
            'inventory:open',
            (
                blocks: InventoryDataCef[],
                equip: InventoryEquipList,
                weapons: InventoryWeaponPlayerData,
                hotkeys: [number, number, number, number, number],
                inv_level: number,
            ) => {
                this.openInventory(blocks, equip, weapons, hotkeys, inv_level);
            }
        );
        this.dressEv = CustomEvent.register(
            'dress:data',
            (
                equip: InventoryEquipList
            ) => {
                this.setState({equip});
            }
        );

        CustomEvent.register('inventory:updateSelfBlock', (myInventoryBlock: InventoryDataCef) => {
            const blocks = this.state.blocks || [];
            const existingMyBlockIdx = blocks.findIndex(block => block.owner_type == OWNER_TYPES.PLAYER && block.owner_id == CEF.id);
            if (existingMyBlockIdx !== -1) {
                blocks.splice(existingMyBlockIdx, 1);
            }

            blocks.push(myInventoryBlock);

            this.setState({
                blocks
            });
        });

        this.updateInventoryEv = CustomEvent.register(
            'inventory:update',
            (
                blocks: InventoryDataCef[],
                allNearest: { owner_type: number; owner_id: number; have_access: boolean; }[],
                weapons: InventoryWeaponPlayerData,
                hotkeys: [number, number, number, number, number],
                inv_level: number
            ) => {
                let blocksDataOpen:any[] = (this.state.blocks || []).filter(q => q.show).map(q => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
                let updatedBlocks = this.state.blocks || [];
                blocks.map(block => {
                    let fnd = updatedBlocks.findIndex(q => q.owner_type == block.owner_type && q.owner_id == block.owner_id);
                    if (fnd > -1) {
                        if (block.owner_type == OWNER_TYPES.PLAYER && block.owner_id == CEF.id) {
                            updatedBlocks[fnd].items = block.items;
                            // updatedBlocks[fnd].weight = block.weight;
                            updatedBlocks[fnd].weight_max = block.weight_max;
                        } else {
                            updatedBlocks[fnd] = block;
                        }
                    } else updatedBlocks.push(block);
                })
                updatedBlocks.map((block, index) => {
                    if (block.owner_type == OWNER_TYPES.PLAYER && block.owner_id == CEF.id) return;
                    if (block.owner_type == OWNER_TYPES.WORLD) return;
                    if (allNearest.find(q => q.owner_type == block.owner_type && q.owner_id == block.owner_id)) return;
                    updatedBlocks.splice(index, 1);
                })
                this.setState({blocks: updatedBlocks, weapons, hotkeys, inv_level}, () => {
                    this.setState({blocks: this.state.blocks.map(q => {
                            const show = blocksDataOpen.find(s => s[0] === q.owner_type && s[1] === q.owner_id);
                            if(show){
                                return {...q, show: true, left: show[2], top: show[3], drag: show[4]}
                            } else {
                                return q
                            }
                        })})
                });
            }
        );

    }

    showBlocks(owner_type: OWNER_TYPES, owner_id: number, left: number, top: number){
        const blocks = [...this.state.blocks];
        let item = blocks.findIndex(q => q.owner_type === owner_type && q.owner_id === owner_id);
        if(item > -1){
            blocks[item].show = true;
            blocks[item].left = left;
            blocks[item].top = top;
            this.setState({blocks});
            this.updateDragPos( owner_type, owner_id, {x:0, y:0} )
            this.currentItem( -1, -1 );
        }
    }

    openExchangeMenu(
        myInventory: InventoryDataCef,
        exchangeData: ExchangeData,
        equip: InventoryEquipList,
        weapons: InventoryWeaponPlayerData,
        hotkeys: [number, number, number, number, number],
        inv_level: number
    ) {
        this.setState({
            open: true,
            isExchangeOpened: true,
            equip, weapons, hotkeys, inv_level, exchangeData,
            blocks: [myInventory],
        });
    }

    openInventory(
        blocks: InventoryDataCef[],
        equip: InventoryEquipList,
        weapons: InventoryWeaponPlayerData,
        hotkeys: [number, number, number, number, number],
        inv_level: number
    ) {
        let blocksDataOpen:any[] = (this.state.blocks || []).filter(q => q.show).map(q => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
        this.setState({open: true, equip, blocks, weapons, hotkeys, inv_level}, () => {
            this.setState({blocks: this.state.blocks.map(q => {
                const show = blocksDataOpen.find(s => s[0] === q.owner_type && s[1] === q.owner_id);
                if(show){
                    return {...q, show: true, left: show[2], top: show[3], drag: show[4]}
                } else {
                    return q
                }
            })})
        });
    }

    componentWillMount() {
        if (CEF.test) {
            this.renderTestBlock();
            setTimeout(() => {
                this.open = true;
            }, 100)
        }
    }

    componentWillUnmount() {
        if (this.openInventoryEv) this.openInventoryEv.destroy();
        if (this.updateInventoryEv) this.updateInventoryEv.destroy();
        if (this.dressEv) this.dressEv.destroy();
        if (this.updateExchangeEv) this.updateExchangeEv.destroy();
        if (this.openExchangeEv) this.openExchangeEv.destroy();
    }

    set open(open) {
        this.setState({open})
    }

    get open() {
        return this.state.open
    }

    getHotkeyItemSlot(slot: number) {
        if (!this.state.hotkeys) return null;
        const id = this.state.hotkeys[slot];
        if (!id) return null;
        return this.myInventory.items.find(q => q[0] === id)
    }

    renderTestBlock(count = 10) {
        let data: InventoryDataCef[] = [];
        const myItems = [convertInventoryItemObjectToArray({
            item_id: 861,
            id: 121,
            count: 1,
            serial: "123123",
            extra: null
        }), convertInventoryItemObjectToArray({
            item_id: 500,
            id: 120,
            count: 1,
            serial: "123123",
            extra: null
        }), ...generateTestInventory(system.getRandomInt(1, 2))];

        myItems.filter(q => CONTAINERS_DATA.find(s => s.item_id === q[1])).map(item => {
            data.push({
                owner_id: item[0],
                owner_type: CONTAINERS_DATA.find(s => s.item_id === item[1]).owner_type,
                items: myItems,
                weight_max: 80000,
                name: 'Динамический инвентарь',
                desc: `#${item[0]}`
            })
        })

        data.push({
            owner_id: CEF.id,
            owner_type: OWNER_TYPES.PLAYER,
            items: myItems,
            // items: [],
            weight_max: 80000,
            name: 'Мой инвентарь',
            desc: ''
        })
        data.push({
            owner_id: 0,
            owner_type: OWNER_TYPES.WORLD,
            items: generateTestInventory(system.getRandomInt(10, 30)),
            // items: [],
            weight_max: 80000,
            name: 'Предметы на земле',
            desc: ''
        })
        for (let q = 0; q < count; q++) {
            const id = system.getRandomInt(1000, 10000);
            const items = generateTestInventory(system.getRandomInt(20, 30));
            data.push({
                owner_id: id,
                owner_type: OWNER_TYPES.PLAYER,
                items,
                weight_max: 80000,
                name: 'Инвентарь игрока',
                desc: `#${id}`
            })
        }
        let hotkeys: any = [];
        for (let q = 0; q < 5; q++) {
            if (system.getRandomInt(1, 100) < 50) {
                hotkeys.push(null);
            } else {
                let item = system.randomArrayElement(myItems);
                hotkeys.push(item[0]);
            }
        }
        this.setState({
            blocks: data, hotkeys, weapons: {
                item_id: 500,
                id: 120,
                ammo: 120,
                serial: "aqsasd",
                max_ammo: 100
            },
            exchangeData: {
                myData: {
                    playerName: 'My',
                    money: 0,
                    items: generateTestInventory(system.getRandomInt(1, 5)),
                    readyStatus: ExchangeReadyStatus.NOT_READY
                },
                targetData: {
                    playerName: 'Player',
                    money: 0,
                    items: generateTestInventory(system.getRandomInt(6, 8)),
                    readyStatus: ExchangeReadyStatus.NOT_READY
                },
            },
            isExchangeOpened: true
        });
        // this.setState({blocks: data, hotkeys});
    }


    get myInventory() {
        const items = this.state.blocks.find(block => block.owner_type === OWNER_TYPES.PLAYER && block.owner_id == CEF.id);
        let weight = 0;
        items.items.map(itemCef => {
            const item = convertInventoryItemArrayToObject(itemCef);
            weight += getItemWeight(item.item_id, item.count);
        })

        return {...items, weight}
    }

    drawEmptyItem( key?: any, slot?: number) {
        if (key) return <div tabIndex={-1} className={`${ ( this.isDragToHotkey() && slot != undefined  )? `in-inventory-item-main-wrap` : ``} inventory-item-main-wrap br4`} key={key}
                            onMouseEnter={() => slot != undefined ? this.enterContainer(OWNER_TYPES.HOTKEY,slot) : null }
                            style={{zIndex:10004}}
                            onMouseLeave={() => slot != undefined  ?  this.enterContainer(-1,-1) : null}/>;
        else return <div tabIndex={-1} className={`${( this.isDragToHotkey() && slot != undefined  )? `in-inventory-item-main-wrap` : ``} inventory-item-main-wrap br4`}
                         style={{zIndex:10004}}
                         onMouseEnter={() => slot != undefined ? this.enterContainer(OWNER_TYPES.HOTKEY,slot) : null }
                         onMouseLeave={() => slot != undefined ?  this.enterContainer(-1,-1) : null}/>;
    }

    drawEmptyString(count = 7, key?: any) {
        let items: JSX.Element[] = [];
        for (let q = 0; q < count; q++) {
            items.push(this.drawEmptyItem(`${key}_${q}`))
        }
        return items;
    }
    isDragToHotkey = () => {
        return (this.state.current[0] === OWNER_TYPES.PLAYER && CEF.id === this.state.current[1]);
    }
    currentItem = ( owner_type: OWNER_TYPES, owner_id: number ) => {
        this.setState( { ...this.state, current: [ owner_type, owner_id ]});
    }
    enterContainer = ( owner_type: OWNER_TYPES, owner_id?: number ) => {
        this.setState({...this.state, containerType: owner_type, containerNumber: owner_id? owner_id:0 });
    }
    drawInventoryContainerItems(owner_type: OWNER_TYPES, owner_id: number, items: InventoryItemCef[], line: 7 | 5 = 7, mini: boolean, isDraggable?: { x:number, y: number} ) {
        let count = items.length;
        while (count >= line) count -= line;
        return <div tabIndex={-1} style={{zIndex:10003}}
            onMouseEnter={() => this.enterContainer(owner_type,owner_id)}
            onMouseLeave={() => this.enterContainer(-1,-1)}
            className={`inventory-item-main-grid fr${line} ${owner_type === OWNER_TYPES.PLAYER && CEF.id === owner_id ? 'h432' : `h256`}`}>
            {items.map((item, key) => {
                return <div tabIndex={-1} key={key}><ItemDraw inventory={this} item={item} owner_type={owner_type} owner_id={owner_id} keyName={key} isDraggable={isDraggable ? isDraggable : null} /></div>
            })}
            {count ? this.drawEmptyString(line - count) : this.drawEmptyString(line)}
            {owner_type == OWNER_TYPES.PLAYER && CEF.id == owner_id ? <>
                {items.length < line * 4 ? this.drawEmptyString(line) : <></>}
                {items.length < line * 3 ? this.drawEmptyString(line) : <></>}
                {items.length < line * 2 ? this.drawEmptyString(line) : <></>}
                {items.length < line * 1 ? this.drawEmptyString(line) : <></>}
            </> : <></>}
        </div>
    }

    drawExchangeItems(items: InventoryItemCef[], blockInteractions: boolean) {
        const MAX_ITEMS_IN_EXCHANGE = 10;

        const itemsToDraw = items.concat();
        const fillAmount = MAX_ITEMS_IN_EXCHANGE - items.length;
        for (let i = 0; i < fillAmount; i++)
            itemsToDraw.push(null);

        return itemsToDraw.map((item, key) => {
            if (item === null) {
                return <div tabIndex={-1} key={key} />
            }

            let doubleClickTime: number = null;
            const itemId = item[0];
            return <div tabIndex={-1} key={key} className={blockInteractions ? '' : 'allow-interactions'}
                onMouseEnter={(e) => {
                    const dom = e.currentTarget.getBoundingClientRect();

                    this.setState({
                        mouseOnItem: {
                            y: dom.top,
                            x: dom.left,
                            itemName: getItemName(convertInventoryItemArrayToObject(item))
                        }
                    })
                }}

                onMouseLeave={() => {
                    this.setState({ mouseOnItem: null });
                }}

                onClick={blockInteractions ? () => { } : () => {
                    if (doubleClickTime === null || system.timestampMS > doubleClickTime) {
                        doubleClickTime = system.timestampMS + 700;
                        return;
                    }

                    doubleClickTime = null;
                    CustomEvent.triggerServer('inventory::exchange::delete', itemId);
                }}>
                <img tabIndex={-1} src={iconsItems[`Item_${item[1]}`]} alt="" />
                <span tabIndex={-1}>{item[2]}</span>
            </div>
        })
    }

    drawInventoryContainer(owner_type: OWNER_TYPES, owner_id: number, name: string, desc: string, items: InventoryItemCef[], max_weight: number, line: 7 | 5 = 7, close = false, draggable?: { left: number, top: number }, drag?: {x: number, y:number}) {

        if(owner_type === OWNER_TYPES.WORLD && items.length === 0){
            return <div tabIndex={-1} className="objects-around-wrapper dashed-border absence br4" onMouseEnter={() => this.enterContainer(owner_type,owner_id)}
                        onMouseLeave={() => this.enterContainer(-1,-1)}>
                <div tabIndex={-1} className="absence-wrap">
                    <img tabIndex={-1} src={svg["hands-around"]} width="24" height="24" alt=""/>
                    <div tabIndex={-1} className="text-wrap">
                        <p tabIndex={-1} className="p-16px fw700 ls-01 upper">Предметы вокруг вас</p>
                        <p tabIndex={-1} className="p-16px fw500 ls-01 upper fff-06">Радиус 5 метров</p>
                    </div>
                </div>
            </div>
        }

        let weight = 0;
        items.map(itemCef => {
            const item = convertInventoryItemArrayToObject(itemCef);
            weight += getItemWeight(item.item_id, item.count);
        })
            return <div tabIndex={-1} style={draggable ? { position:'absolute', zIndex: 10005, transform: `translate(-50%, -100%)`, left: draggable.left, top: draggable.top}: {}}
                    className={draggable ? `storage-wrap noborder-darkbg extra-inventory-item-main-wrap br4` : `${line == 5 ? `storage-wrap noborder-darkbg extra-inventory-item-main-wrap br4` : `storage-wrap solid-border ${close ? 'storage-close' : ''} br4`}`}
                    key={`item_continer_${owner_type}_${owner_id}`}
                    id={`item_continer_${draggable ? "draggable":""}_${owner_type}_${owner_id}`}>
            <div tabIndex={-1} className="topline-storage">
                {owner_type === OWNER_TYPES.WORLD ? <>
                    <div tabIndex={-1} className="leftside">
                        <p tabIndex={-1} className="p-16px w700 ls-01 upper">Предметы вокруг вас</p>
                    </div>
                    <div tabIndex={-1} className="rightside">
                        <p tabIndex={-1} className="p p-16px fw500 ls-01 upper fff-06">Радиус 5 метров</p>
                    </div>
                </> : (draggable ? <>
                    <div tabIndex={-1} className="leftside-row">
                        <p tabIndex={-1} className="p-16px w700 ls-01 upper">{name}</p>
                        <p tabIndex={-1} className="p-16px fw500 ls-01 upper fff-06">{desc}</p>
                    </div>
                    <div tabIndex={-1} className="rightside-row">
                        <p tabIndex={-1} className="p-16px fw700 ls-01 upper fff-04">{(weight / 1000).toFixed(1)} кг</p>
                        <p tabIndex={-1} className="p-16px fw500 ls-01 upper fff-02">из {(max_weight / 1000).toFixed(1)} кг <span tabIndex={-1} onClick={e => {
                            e.preventDefault();
                            const blocks = [...this.state.blocks];
                            const index = blocks.findIndex(q => q.owner_type === owner_type && q.owner_id === owner_id);
                            if(index > -1){
                                blocks[index].show = false;
                                this.setState({blocks})
                            }
                        }}>[X]</span></p>
                    </div>
                </> : <>
                    <div tabIndex={-1} className="leftside">
                        <p tabIndex={-1} className="p-16px w700 ls-01 upper">{name}</p>
                        <p tabIndex={-1} className="p-16px fw500 ls-01 upper fff-06">{desc}</p>
                    </div>
                    <div tabIndex={-1} className="mini-backpack-level">
                        <div tabIndex={-1} className="text-wrap">
                            <p tabIndex={-1} className="p-16px fw700 ls-01 upper fff-04">{(weight / 1000).toFixed(1)} кг</p>
                            <p tabIndex={-1} className="p-16px fw500 ls-01 upper fff-02">из {(max_weight / 1000).toFixed(1)} кг</p>
                        </div>
                        <div tabIndex={-1} className="miniLevelBackpack br4">
                            <span tabIndex={-1} style={{height: `${Math.min(100, (weight / max_weight) * 100)}%`}} className="br4"/>
                        </div>
                    </div>
                </>)}
            </div>
            {!close ? this.drawInventoryContainerItems(owner_type, owner_id, items, line, owner_type === OWNER_TYPES.WORLD,  draggable ? drag : null) : <></>}
        </div>
    }

    updateBlock(data: InventoryDataCef) {
        this.setState({blocks: [...this.state.blocks, data]})
    }

    removeBlock(owner_type: OWNER_TYPES, owner_id: number) {
        const blocks = [...this.state.blocks];
        blocks.splice(blocks.findIndex(q => q.owner_type === owner_type && q.owner_id === owner_id), 1);
        this.setState({blocks});
    }

    closeInventory() {
        CustomEvent.triggerServer('inventory:close');
        CEF.gui.setGui(null);
    }

    updateDragPos = ( owner_type: OWNER_TYPES, owner_id: number, data: {x:number, y:number} ) => {
        if( this.state.current[0] != -1 ) return;
        const blocks = [...this.state.blocks];
        const index = blocks.findIndex(q => q.owner_type === owner_type && q.owner_id === owner_id);
        if(index > -1){
            blocks[index].drag = { x: (blocks[index].drag ? blocks[index].drag.x : 0) + data.x, y: (blocks[index].drag ? blocks[index].drag.y : 0) + data.y }
            this.setState({blocks})
        }
    }

    setExchangeMyMoney(value: number) {
        const exchangeData = this.state.exchangeData;
        exchangeData.myData.money = value;

        this.setState({
            exchangeData
        });
    }

    _exchangeInputTimer: number = null;
    handleExchangeInput(value: string) {
        const parsedValue = Number.parseInt(value);
        if (Number.isNaN(parsedValue)) {
            this.setExchangeMyMoney(0);
        } else {
            this.setExchangeMyMoney(parsedValue);
        }

        if (!this._exchangeInputTimer) {
            this._exchangeInputTimer = setTimeout(() => {
                CustomEvent.triggerServer('inventory::exchange::moneyChange', this.state.exchangeData.myData.money);
                this._exchangeInputTimer = null;
            }, 1000);
        }
    }

    getExchangeReadyButtonClass(): string {
        const exchangeData = this.state.exchangeData;
        if (exchangeData.myData.readyStatus === ExchangeReadyStatus.NOT_READY
            || exchangeData.targetData.readyStatus === ExchangeReadyStatus.NOT_READY) {
            return 'exchange-forReady';
        } else {
            return 'exchange-forConfirm';
        }
    }

    getExchangeReadyButtonImg(): string {
        const exchangeData = this.state.exchangeData;
        if (exchangeData.myData.readyStatus > exchangeData.targetData.readyStatus) {
            return 'loading';
        } else {
            return 'mark';
        }
    }

    render() {
        const help_offst = document.getElementById(`inventory-main-wrap`) ? document.getElementById(`inventory-main-wrap`).offsetLeft : -1;
//        if( document.getElementById(`inventory-main-wrap`))
//            console.log( `${document.getElementById(`inventory-main-wrap`).offsetLeft}` );
        if (!this.open) return <></>;
        return <div tabIndex={-1} className="body-inventory" id="body-inventory">

            {this.state.mouseOnItem &&
            <div tabIndex={-1}
                 style={{
                     position: 'absolute',
                     zIndex: 10006,
                     left: this.state.mouseOnItem.x,
                     top: this.state.mouseOnItem.y - 10,
                 }}>
                { this.state.mouseOnItem.itemName }
            </div>}

            <div tabIndex={-1} className="overflow">

                <div tabIndex={-1} className="bg-dark"/>

                <div tabIndex={-1} className="flydet flydet-inventory-man"/>

                <div tabIndex={-1} className={this.state.isExchangeOpened ? 'inventory-main-wrapper inventory-justify-canceler' : 'inventory-main-wrapper'}>
                    <div tabIndex={-1} className="inventory-main-wrap" id="inventory-main-wrap">
                        <div tabIndex={-1} className="help-buttons-wrapper" style={{ display: help_offst !== -1 ? 'flex':'none', right: `${help_offst}px` }}>
                        <div tabIndex={-1} className="help-item">
                            <img tabIndex={-1} src={svg['mouse-LKM']} alt=""/>
                            <p><span tabIndex={-1}>Левая кнопка мыши</span>cнять одежду</p>
                        </div>
                        <div tabIndex={-1} className="help-item">
                            <img tabIndex={-1} src={svg['mouse-RKM']} alt=""/>
                            <p><span tabIndex={-1}>Правая кнопка мыши</span>убрать из быстрого доступа</p>
                        </div>
                    </div>

                        { !this.state.isExchangeOpened && <div tabIndex={-1} className="storage">
                            {this.state.blocks ? this.state.blocks
                                .filter(q => !(q.owner_type === OWNER_TYPES.PLAYER && q.owner_id === CEF.id) && (!q.show && !CONTAINERS_DATA.find(s => s.owner_type === q.owner_type)))
                                .map((block, index) => {
                                    return this.drawInventoryContainer(block.owner_type, block.owner_id, block.name, block.desc, block.items, block.weight_max, 7, block.closed, block.show ? {
                                        left: block.left,
                                        top: block.top
                                    } : null)
                                }) : <></>}
                        </div> }


                        {this.state.isExchangeOpened &&
                            <>
                            <div tabIndex={-1} className="exchange-left">
                                <img tabIndex={-1} src={images["boxesTop"]} className="exchange-left__boxesTop" alt=""/>
                                <img tabIndex={-1} src={images["boxesBottom"]} className="exchange-left__boxesBottom" alt=""/>

                                <img tabIndex={-1} src={svg["exchangeImage"]} className="exchange-left__exchangeImage" alt=""/>

                                <div tabIndex={-1} className="exchange-left-buttons">

                                    <div tabIndex={-1} className={`exchange-left-buttons__accept ${this.getExchangeReadyButtonClass()}`} onClick={() => {
                                        CustomEvent.triggerServer('inventory::exchange::confirm')
                                    }}>
                                        <img tabIndex={-1} src={svg[this.getExchangeReadyButtonImg()]} alt=""/>
                                        <span tabIndex={-1}>Подтвердить обмен</span>
                                        <p>Готово</p>
                                    </div>

                                    <div tabIndex={-1} className="exchange-left-buttons__cancel" onClick={() => {
                                        CustomEvent.triggerServer('inventory::exchange::decline')
                                    }}>
                                        <img tabIndex={-1} src={svg["close"]} alt=""/>
                                        Отказаться
                                    </div>

                                </div>

                                <div tabIndex={-1} className="exchange-left__h1">
                                    Обмен с {this.state.exchangeData.targetData.playerName}
                                </div>

                                <div tabIndex={-1} className="exchange-left__title">
                                    Вы отдаете
                                </div>

                                <div tabIndex={-1} className="exchange-left-slots">
                                    {this.drawExchangeItems(this.state.exchangeData.myData.items,
                                        this.state.exchangeData.myData.readyStatus !== ExchangeReadyStatus.NOT_READY)}
                                </div>

                                <div tabIndex={-1} className="exchange-left-input">
                                    <img tabIndex={-1} src={svg["coin"]} alt=""/>
                                    <input type="number"
                                           placeholder="Введите сумму"
                                           disabled={this.state.exchangeData.myData.readyStatus !== ExchangeReadyStatus.NOT_READY}
                                           onChange={(event) => this.handleExchangeInput(event.currentTarget.value)}
                                           value={this.state.exchangeData.myData.money} />
                                </div>

                                <div tabIndex={-1} className="exchange-left__title">
                                    Вы получаете
                                </div>

                                <div tabIndex={-1} className="exchange-left-slots">
                                    {this.drawExchangeItems(this.state.exchangeData.targetData.items, true)}
                                </div>

                                <div tabIndex={-1} className="exchange-left-input">
                                    <img tabIndex={-1} src={svg["coin"]} alt=""/>
                                    <span tabIndex={-1}>{this.state.exchangeData.targetData.money}</span>
                                </div>

                            </div>
                            </>
                        }
                        {!this.state.isExchangeOpened && this.state.blocks ? this.state.blocks.filter(q => !(q.owner_type === OWNER_TYPES.PLAYER && q.owner_id === CEF.id) && (q.show)).map((block, index) => {
                            return <><DraggableCore
                                //handle=".topline-storage"
    //                                                positionOffset={{x:0, y:0}}
    //                                                position={block.drag ? {x:block.drag.x, y:block.drag.y} : {x:0, y:0}}
                                                key={`${block.owner_type}_${block.owner_id}`}
                                                grid = { [ 0.5 ,  0.5 ] }
                                                onDrag={(e: MouseEvent, data: any) => this.updateDragPos( block.owner_type, block.owner_id, {x:data.deltaX, y:data.deltaY} )}
                                                onStop={(e: MouseEvent, data: any) => this.updateDragPos( block.owner_type, block.owner_id,  {x:data.deltaX, y:data.deltaY} )}>
                                    {this.drawInventoryContainer(block.owner_type, block.owner_id, block.name, block.desc, block.items, block.weight_max, 7, block.closed, block.show ? {
                                left: ( block.drag ? block.drag.x : 0 ) + block.left,
                                top: (block.drag ? block.drag.y : 0 ) + block.top
                            } : null, block.drag)}</DraggableCore></>
                        }) : <></>}


                        <div tabIndex={-1} className="inventory-wrapper">
                            <div tabIndex={-1} className="storage-wrap br4">
                                <p tabIndex={-1} className="db p-16px fw500 ls-01 upper fff-06 tc">Ваш инвентарь</p>
                                {this.drawInventoryContainerItems(OWNER_TYPES.PLAYER, CEF.id, this.myInventory.items, 5, false)}
                            </div>

                            <div tabIndex={-1} className="inventory-battlePass" onClick={() => {
                                this.closeInventory();
                                CustomEvent.triggerServer('battlePass:openInterface')
                            }}>
                                <img tabIndex={-1} src={images["battlePass"]} alt=""/>
                                <div tabIndex={-1} className="inventory-battlePass__title">Battle Pass</div>
                                <div tabIndex={-1} className="inventory-battlePass__text">SUMMER EDITION!</div>
                            </div>

                            {this.state.hotkeys ? <>
                                <div tabIndex={-1} className="storage-wrap inventory-quick-access br4">
                                    <p tabIndex={-1} className="db p-16px fw500 ls-01 upper fff-06 tc">Быстрый доступ</p>
                                    <div tabIndex={-1} className="inventory-item-main-grid fr5 h80">
                                        {this.state.hotkeys.map((id, slot) => {
                                            if (!id) return this.drawEmptyItem(`hotkey_${slot}`, slot)
                                            let item = this.getHotkeyItemSlot(slot);
                                            if (!item) return this.drawEmptyItem(`hotkey_${slot}`, slot)
                                            return <div tabIndex={-1} key={`hotkey_${slot}`}
                                                        onMouseEnter={() => this.enterContainer(OWNER_TYPES.HOTKEY,slot)}
                                                        onMouseLeave={() => this.enterContainer(-1,-1)}>
                                                   <ItemDraw keyName={`hotkey_${slot}`} owner_type={OWNER_TYPES.PLAYER} owner_id={CEF.id} item={item} inventory={this} ishotkey={true} />
                                            </div>
                                        })}
                                    </div>
                                    <div tabIndex={-1} className="keys-quick-access">
                                        {this.state.hotkeys.map((id, slot) => {
                                            let active = !!id && !!this.getHotkeyItemSlot(slot)
                                            return <div tabIndex={-1}
                                                className={"keys-quick-access-item " + (active ? 'active' : '')} key={`hotkey_${slot}`}>
                                                <span tabIndex={-1} className="br4">
                                                    <i tabIndex={-1} className="br4">
                                                        <p tabIndex={-1} className="p-16px fw700 dark ls-01 upper tc">{slot + 1}</p>
                                                    </i>
                                                </span>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </> : <></>}

                        </div>

                        <div tabIndex={-1} className="capacity-backpack">
                            <div tabIndex={-1} className="progress-capacity-backpack br4">
                                <span tabIndex={-1} className="br4"
                                      style={{height: `${Math.min(100, (this.myInventory.weight / this.myInventory.weight_max) * 100)}%`}}/>
                            </div>
                            <div tabIndex={-1} className="num-capacity">
                                <p tabIndex={-1} className="p-18px fw700 fff-04 ls-01 upper">{(this.myInventory.weight / 1000).toFixed(2)}</p>
                                <p tabIndex={-1} className="p-18px fw700 fff-04 ls-01 upper">{(this.myInventory.weight_max / 1000).toFixed(0)} кг</p>
                            </div>
                            <div tabIndex={-1} className="icon-backpack">
                                <img tabIndex={-1} src={svg["backpack"]} width="24" height="24" alt=""/>
                            </div>
                            {!(this.state.inv_level && this.state.inv_level >= PLAYER_INVENTORY_MAX_LEVEL) ? <button tabIndex={-1} className="increase-capacity-backpack br4" onClick={e => {
                                e.preventDefault();
                                this.setState({addModal: true})
                            }}>
                                <img tabIndex={-1} src={svg["add"]} width="24" height="24" alt=""/>
                            </button> : <></>}
                        </div>

                        <div tabIndex={-1} className="menu-inventory-wrap" onMouseEnter={() => this.enterContainer(OWNER_TYPES.CLOTHES, CEF.id )}
                             onMouseLeave={() => this.enterContainer(-1,-1)}>

                            {this.state.weapons ? <>
                                <ItemDraw
                                    keyName={`weapon_${0}`}
                                    owner_type={OWNER_TYPES.PLAYER}
                                    owner_id={CEF.id}
                                    item={this.myInventory.items.find(q => q[0] === this.state.weapons.id)}
                                    inventory={this}
                                    ishotkey={true}
                                />
                                <div tabIndex={-1} className="inventory-item-main-wrap br4" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerServer('inventory:reload:weapon');
                                    this.closeInventory();
                                }}>
                                    <div tabIndex={-1} className="in-inventory-item-main-wrap br4">
                                        <div tabIndex={-1} className="img-wrap">
                                            <img tabIndex={-1} src={`http://cloud.detroitgta-5.ru/items/Item_${inventoryShared.getWeaponConfigByItemId(this.state.weapons.item_id).ammo_box}.png`} alt=""
                                                 draggable="false"/>
                                        </div>
                                        <i tabIndex={-1} className="count p-14px fw700 upper">{this.state.weapons.ammo}</i>
                                    </div>
                                </div>
                            </> : <>
                                <div tabIndex={-1} className="menu-inventory-item br4">
                                    <img tabIndex={-1} src={svg["gun"]} alt=""/>
                                </div>
                                <div tabIndex={-1} className="menu-inventory-item br4">
                                    <img tabIndex={-1} src={svg["magazine"]} alt=""/>
                                </div>
                            </>}

                            {this.drawEquipmentItem('armor', 960, 'body-armor')}
                            {this.drawEquipmentItem('gloves', 949, 'gloves')}

                            <div tabIndex={-1} className="menu-inventory-item br4 empty"/>
                            <div tabIndex={-1} className="menu-inventory-item br4 empty"/>
                            {this.drawEquipmentItem('hat', 954, 'hat')}
                            {this.drawEquipmentItem('glasses', 955, 'glasses')}
                            {this.drawEquipmentItem('ear', 956, 'earrings')}
                            {this.drawEquipmentItem('accessorie', 958, 'tie')}
                            {this.drawEquipmentItem('mask', 950, 'mask')}
                            {this.drawEquipmentItem('torso', 951, 'clothes')}
                            {this.drawEquipmentItem('bracelet', 959, 'bracelet')}
                            {this.drawEquipmentItem('leg', 952, 'pants')}
                            {this.drawEquipmentItem('watch', 957, 'watch')}
                            {this.drawEquipmentItem('foot', 953, 'shoes')}
                        </div>

                    </div>
                </div>

                {this.state.addModal ? <div tabIndex={-1} className="modal-increasing-capacity-inventory-wrapper active">
                    <div tabIndex={-1} className="modal-increasing-capacity-inventory-wrap br4">
                        <div tabIndex={-1} className="close" onClick={e => {
                            e.preventDefault();
                            this.setState({addModal: false})
                        }}>
                            <img tabIndex={-1} src={svg["close"]} width="24" height="24" alt=""/>
                        </div>
                        <div tabIndex={-1} className="img-wrap">
                            <img tabIndex={-1} src={images['bag']} alt="" draggable="false"/>
                        </div>
                        <div tabIndex={-1} className="text-wrap">
                            <p tabIndex={-1} className="p-44px fw800 fsi upper">{getDonateItemConfig(7).name}</p>
                            <p tabIndex={-1} className="p-18px fw400 lh180">{getDonateItemConfig(7).desc}</p>
                            <button tabIndex={-1} className="br4" disabled={(this.state.inv_level && this.state.inv_level >= PLAYER_INVENTORY_MAX_LEVEL)}  onClick={e => {
                                e.preventDefault();
                                this.setState({addModal: false}, () => {
                                    CustomEvent.triggerServer('mainmenu:buyShop', 7)
                                })
                            }}>
                                <img tabIndex={-1} src={svg["shopping-cart"]} width="24"
                                     height="24" alt=""/>
                                <p tabIndex={-1} className="p-16px fw800 upper">{system.numberFormat(getDonateItemConfig(7).price)} {DONATE_MONEY_NAMES[2]}</p>
                            </button>
                        </div>
                    </div>
                </div> : <></>}


            </div>


        </div>
    }

    drawEquipmentItem(item: (keyof InventoryEquipList), id: number, icon: string) {
        const equip = !!(this.state.equip as any)[item as any];
        return <div tabIndex={-1} className="menu-inventory-item br4"
            onClick={e => {
                e.preventDefault();
                if (!equip) return;
                CustomEvent.triggerServer('inventory:unequip_item', id);
            }}
        >
            <img tabIndex={-1} src={equip? iconsItems[`Item_${id}`] : svg[icon]} alt=""/>
        </div>
    }
}



const SliderStyles = createStyles({
    colorPrimary: {
        color: "#000000"
    },
    root: {
        marginTop: 5,
        color: '#C4C4C4',
        height: 16
    },
    markLabel: {
        color: "#FFFFFFaa",
        fontSize: "0.7vw"
    },
    markLabelActive: {
        color: "#FFFFFFee",
    },
    thumb: {
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: '#E3256B',
        marginTop: -7,//-3,
        '&:focus, &:hover': {
            boxShadow: '0px 0px 30px #E3256B'
        }
    },
    track: {
        backgroundColor: '#E3256B',
        boxShadow: '0px 0px 3px #E3256B'
    }
});
const NewSliderStyles = withStyles(SliderStyles)(Slider);