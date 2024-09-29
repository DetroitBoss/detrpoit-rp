import './style.less'
import React, {Component} from 'react';
import arrowLeft from './img/arrow.svg';
import {CustomEvent} from '../../modules/custom.event';
import {MenuInterface, MenuItemBase, MenuItemBaseCEF} from '../../../shared/menu';

import icons from '../../../shared/icons/*.png'
import titles from './title/*.png'
import {getFirstColor} from '../../../shared/string';
import {CEF} from '../../modules/CEF';
import Draggable from 'react-draggable';
import {CustomPicker, HSLColor, RGBColor} from 'react-color';
import i from './img/i.svg';
import {Hue, Saturation} from "react-color/lib/components/common";

let blockPress = new Map<number, boolean>();


export class Menu extends Component<any, MenuInterface> {
  canUseMouseInMenu = () => {
    if (!this.state.cursor) return false;
//    if (!!CEF.gui.currentGui) return false;
    return true;
  }
  tempHide = false
  constructor(props: any) {
    super(props);

    if(CEF.test){
      console.log('test');
      this.state = {
          fromserver: false,
          widthMultipler: 1.5,
          id: 0,
          open: false,
          hidden: false,
          cursor: true,
          select: 0,
          title: 'Название заголовка',
          subtitle: "Выбор цвета",
          controlsBlocked: false,
          items: [
              {name: "qwe \"1\"", type: "color", color: {r: 255, g: 15, b: 44}, desc: "Выберите цвет"},
          { name: "qwe \"1\"", type: "list", list: ["0", "1", "2", "3", "4", "5", "6", "7"], listSelected: 1},

          { name: "qwe 1", icon: "Item_2"},
          { name: "qwe 1", icon: "Item_3"},
          { name: "qwe 1", icon: "Item_4"},
          { name: "qwe 1", icon: "Item_5"},
          { name: "qwe 1", icon: "Item_6"},
          { name: "qwe 1", icon: "Item_7"},
          { name: "qwe 1", icon: "Item_8"},
          {name:"qwe 1"},
          {name:"qwe 1"},
          // { name:"qwe 2 gadgsdddddddddddddddddddddddddddddddg",more:"gadgsdddddddddddddddddddddddddddddddg",type:"select",desc:"gasgasgasg"},
          { name: "qwe 3", more: "gadddddg", type: "select", desc:"gsdgd fgs 5g dftrg dsr5g xftj gsdgd fgs 5g dftrg dsr5g xftj gsdgd fgs 5g dftrg dsr5g xftj gsdg dfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj gsdgdfgs 5g dftrg dsr5g xftj "},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 1",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 2",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 3",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 1",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 2",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 3",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 1",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 2",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 3",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 4",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 5",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 6",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 7",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 8",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 9",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 10",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 11",more:"gadg",type:"select",desc:"gasgasgasg"},
          {name:"qwe 12",more:"gadg",type:"select",desc:"gasgasgasg"},
          { name: "qwe \"1\"", icon: "Item_1", type: "color", color: { r: 15, g: 1, b: 17 } },
        ],
        sprite: "sprite1",
        menuX: 0,
        menuY: 0,
      }
    } else {
      this.state = {
          fromserver: false,
          widthMultipler: 1,
          id: 0,
          open: false,
          hidden: false,
          select: 0,
          title: '',
          subtitle: "",
          items: [],
          menuX: 0,
          menuY: 0,
          controlsBlocked: false
      }
    }
    


    CustomEvent.register('menu:hide', (status:boolean) => {
      this.tempHide = status;
      setTimeout(() => {
        this.setState({ hidden: this.tempHide});
      }, status ? 1 : 200)
    })
    
    CustomEvent.register('menu:open', (data: MenuInterface) => {
      this.openMenu(data);
    })

    CustomEvent.register('menu:updateItem', (index: number, itemDto: MenuItemBase) => {
        const items = this.state.items;
        items[index] = itemDto;

        this.setState({ items });
    });

    CustomEvent.register('menu:loadDefaultPos', (x: number, y: number, countItems: number) => {
      this.setState({
        menuX: x,
        menuY: y,
        countItems
      })
    })
    CustomEvent.register('menu:setItemsOnPage', (countItems: number) => {
      this.setState({
        countItems
      })
    })
    CustomEvent.register('menu:addItems', (...items: MenuItemBase[]) => {
      this.setState({ items: [...this.state.items, ...items] });
    })
    CustomEvent.register('menu:close', () => {
      this.setState({
        id: 0,
        open: false,
        select: 0,
        title: '',
        subtitle: "",
        items: []
      });
    })
    CustomEvent.register('setCursorState', (status: boolean) => {
      // CEF.alert.setAlert('error', `Cursor ${status}`)
      this.setState({ cursor: status })
    })
      CustomEvent.register('dialog:accept', (id: number, type: "big" | "small", text: string, time: number = 5000, accept: string = "Да", cancel: string = "Нет") => {
          if(type !== "big") return;
          this.setState({controlsBlocked: true})
      })
      CustomEvent.register('dialog:accept:closed', () => {
          this.setState({controlsBlocked: false})
      })
  }

  openMenu = (data:MenuInterface) => {
      blockPress = new Map();
    data.open = true;
    data.select = data.select ? data.select : 0;
    data.items.forEach(item => {
        item.name = item.name || "";
        item.more = item.more || "";
        item.type = item.type || "select";
      if(!item.listSelected) item.listSelected = 0;
      if(item.type == "range"){
        let arr:string[] = []
        for(let i = item.rangeselect[0]; i <= item.rangeselect[1]; i++) arr.push(i.toString())
        item.type = "list";
        item.list = arr;
      }

        if(["range", "list"].includes(item.type)){
            item.list.map(s => {
                s = s || ""
            })
        }

    })
    this.setState({...data})
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick = () => {
    if (blockPress.has(13)) return;
      blockPress.set(13, true)
    setTimeout(() => {
        blockPress.delete(13)
    }, 1000)
    if( this.state.hidden || !this.state.open || this.state.select < 0 ) return;
    mp.trigger('menu:select', this.state.id, this.state.select);
  } 
  handleList = () => {
    if( this.state.hidden || !this.state.open || this.state.select < 0 ) return;
    let selected = this.state.items[this.state.select]
    if(selected && (selected.type == "range" || selected.type == "list")){
      mp.trigger('menu:onchange', this.state.id, this.state.select, this.state.items[this.state.select].listSelected);
    }
  }

  

  handleKeyDown = (e?: any, keyCode?:number) => {
      if (this.state.controlsBlocked) return;
      const key: number = typeof keyCode === 'number' && keyCode ? keyCode : e.keyCode;
      if (key !== 13){
        if (blockPress.has(key) && ![38, 40].includes(key)) return;
          blockPress.set(key, true)
          setTimeout(() => {
              blockPress.delete(key)
          }, [38, 40].includes(key) || !this.state.fromserver ? 10 : 350)

      }
      if (![38, 40, 13, 27, 8, 37, 39].includes(key)) return;
      if (this.state.hidden || !this.state.open ) return;
      e.preventDefault();
      if (key == 38) {
          let select = this.state.select - 1;
          if (this.state.select == null) select = this.state.items.length - 1;
          if (select < 0) select = this.state.items.length - 1;
          if (select > this.state.items.length - 1) select = 0;
          this.setState({ select });
          mp.trigger('menu:setindex', this.state.id, select);
          document
          .querySelector('.menu_items div.menu_item.active')
          .scrollIntoView({ block: 'center' });
        } else if (key == 40) {
          let select = this.state.select + 1;
          if (this.state.select == null) select = 0;
          if (select < 0) select = this.state.items.length - 1;
          if (select > this.state.items.length - 1) select = 0;
          this.setState({ select });
          mp.trigger('menu:setindex', this.state.id, select);
          document
          .querySelector('.menu_items div.menu_item.active')
          .scrollIntoView({ block: 'center' });
        } else if (key == 13) {
          this.handleClick();
      }
      if (key == 8) {
          mp.trigger("menu:close")
          this.setState({open: false});
      }
      // Move Left
      if (key == 37) {
          let current = this.state.items[this.state.select];
          let selected = current.listSelected;
          if(current.type == "list"){
            if(selected == 0) selected = current.list.length - 1;
            else selected--;
          }
          const news = this.state.items;
          news[this.state.select].listSelected = selected;
          this.setState({items:news})
          this.handleList()
      }
      // Move Right
      if (key == 39) {
          let current = this.state.items[this.state.select];
          let selected = current.listSelected;
          if(current.type == "list"){
            if(selected == current.list.length - 1) selected = 0;
            else selected++;
          }
          const news = this.state.items;
          news[this.state.select].listSelected = selected;
          this.setState({items:news})
          this.handleList()
      }
  }

  changeColor = (e:any,type:number) => {
      console.log(e.rgb);
      const itms = this.state.items;
      itms[this.state.select].color = e.rgb
      this.setState({ items: itms })
      CustomEvent.triggerClient( type > 0 ? 'menu:colorChange':'menu:colorChangeFast', this.state.select, JSON.stringify({ ...e.rgb }))
  }
  render() {
      if (this.state.hidden) return <></>;
      if(!this.state.open) return <></>;
      let title = getFirstColor(this.state.title),
          subtitle = getFirstColor(this.state.subtitle),
          desc = this.state.items.length > 0 && this.state.items[this.state.select].desc ? getFirstColor(this.state.items[this.state.select].desc) : null;

      return (
        <div className="test_menu">
          <Draggable handle=".menu_header" onStop={(e, data) => {
            CustomEvent.triggerClient('menu:setDefaultPos', data.lastX, data.lastY)
            this.setState({
              menuX: data.lastX,
              menuY: data.lastY,
            })
          }} position={{x: this.state.menuX, y: this.state.menuY}}>
            <div className="popup-menu">
              <div className="menu_header">
                <img className="menu_title" src={titles[this.state.sprite]}/>
               <h1>{title.string}</h1>
               <h2>{subtitle.string}</h2>
               <div className="menu_items">
                {this.state.items.map((item, key) => {
                    if(!item) return <></>;
                    return (
                      <div
                        key={key}
                        className={(this.state.select == key ? 'active ' : '') + "menu_item"}
                        onClick={(e) => {
                          if (!this.canUseMouseInMenu()) return;
                          e.preventDefault();
                          if (this.state.select !== key){
                            this.setState({ select: key });
                            mp.trigger('menu:setindex', this.state.id, key)
                            return;
                          }
                          this.handleClick();
                        }}
                      >
                          {this.itemKey(item, this.state.select, key, this.canUseMouseInMenu, this.handleKeyDown)}
                      </div>)
                })}
              </div>
              </div>
                {desc || this.state.items[this.state.select].type === "color" ? 
                  <div className="menu_item_desc">
                    {desc ? 
                      <div className="menu_item_desc_text">
                        <img src={i}/>
                        <div className="menu_desc_text">
                          <p>{desc.string}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.items[this.state.select].type === "color" ? 
                      <ColorPickerWrapped color={this.state.items[this.state.select].color as (string & RGBColor)}
                                          onChange={(e: any) => this.changeColor(e, 0)}
                                          onChangeComplete={(e: any) => this.changeColor(e, 1)}/>
                        : null}
                  </div>
                    : null
                }
            </div>
          </Draggable>
        </div>
      );
  }

    itemKey(item: MenuItemBaseCEF, select: number, key: number, canuse: () => void, handleKeyDown: (e?: any, keyCode?: number) => void) {
        let name = getFirstColor(item.name),
            type = item.type,
            icon = item.icon ? icons[item.icon] : null,
            more = item.more ? getFirstColor(String(item.more)) : null;
        switch (type) {
            case "color":
                return <>
                    <p style={{color: name.color && select != key ? name.color : null}}>
                        {icon ? <img src={icon} style={{verticalAlign: "middle"}}/> : ""}
                        {name.string}
                    </p>
                    <div className="menu_color" style={{backgroundColor: `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})`}}/>
                </>
            case "list":
            case "range":
                return <>
                    <p style={{color: name.color && select != key ? name.color : null, marginTop: icon ? 0 : "5px"}}>
                        {icon ? <img src={icon} style={{verticalAlign: "middle"}}/> : ""}
                        {name.string}
                    </p>
                    <div className="menu_range">
                        <div onClick={e => {
                            if (canuse) return handleKeyDown(e, 37);
                        }}><img src={arrowLeft}/></div>
                        <div className="menu_list_select">{item.list[item.listSelected]}</div>
                        <div onClick={e => {
                            if (canuse) return handleKeyDown(e, 39);
                        }}><img src={arrowLeft}/></div>
                    </div>
                </>
            case "select":
                return <>
                    <p style={{color: name.color && select != key ? name.color : null}}>
                        {icon ? <img src={icon} style={{verticalAlign: "middle"}}/> : ""}
                        {name.string}
                    </p>
                    {item.more ? <span
                        style={{color: more.color && select != key ? more.color : null}}>{more.string}</span> : null}
                </>
            default:
                return <>
                    <p style={{color: name.color && select != key ? name.color : null}}>
                        {icon ? <img src={icon} style={{verticalAlign: "middle"}}/> : ""}
                        {name.string}
                    </p>
                </>
        }
    }
}

class ColorPicker extends React.Component< { hex?:string, hsl?:HSLColor, rgb?:RGBColor, onChange: (e:any) => void } > {
  // handleChange = (data:ColorResult) => {};
  render() {
    return (
      <div className="menu_colorpick">
        <div className="menu_colorbox">
          <Saturation
            {...this.props}
            onChange={this.props.onChange}
            pointer={()=>Picker(0)}
            color={this.props.rgb}
          />
        </div>
        <div className="menu_colorhui" >
          <Hue {...this.props} color={this.props.rgb} onChange={this.props.onChange} pointer={()=>Picker(1)} direction="vertical"/>
        </div>
      </div>
    );
  }
}

const ColorPickerWrapped = CustomPicker(ColorPicker);

const Picker = ( type:number ) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        width: '1vw',
        height: '1vw',
        borderRadius: '1vw',
        background: "rgba(255,255,255,0.2)",
        border: "1px solid white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        boxSizing: "border-box",
        marginTop: '-0.5vw',
        marginLeft: type != 1 ? '-0.5vw' : 0
      }}
    />
  );
}

