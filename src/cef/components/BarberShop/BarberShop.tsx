import React from 'react';
import './assets/style.less';
import './../Personage/assets/pers.less';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import exitsvg from './../IdCard/assets/exit.svg';
import check from './../ClothShop/assets/check.svg';
import svg from './../Personage/assets/*.svg';
import personage, {colors, Ranges} from './../Personage/config';
import {AddSlider, sliders} from '../Personage/Slider';
import hairsf from './../Personage/assets/hairs/female/*.jpg';
import hairsm from './../Personage/assets/hairs/male/*.jpg';
import {BarberData, getComponentCost, nailsConfig} from "../../../shared/barbershop";
import nailsPictures from './assets/nails/*.png';

const hairs = [hairsm, hairsf];

const enum params {
    BROW,
    BROWOPACITY,
    COLOR_BROWS,
    BEARD,
    BEARDOPACITY,
    COLOR_BEARD,
    HAIR,
    COLOR_HAIR1,
    COLOR_HAIR2,
    EYE_COLOR,
    LIPS,
    LIPS_OPACITY,
    LIPS_COLOR,
    MAKEUP,
    MAKEUP_OPACITY,
    MAKEUP_COLOR,
    BLUSH,
    BLUSH_OPACITY,
    BLUSH_COLOR,
    NAILS,
}
const enum page_hair {
    HAIR = 0,
    BROWS,
    BEARD,
    LIPS,
    NAILS,
}

export const defaultParam = {
    lips: 0,
    lipsOpacity: 0,
    lipsColor: 0,
    makeup: 0,
    makeupOpacity: 0,
    makeupColor: 0,
    subpage: 0,
    hair: 0,
    hairColor: 0,
    hairColor2: 0,
    eyebrows: 0,
    eyecolor: 0,
    eyebrowsColor: 0,
    eyebrowOpacity: 0.5,
    beard: 0,
    beardColor: 0,
    beardOpacity: 0.5,
    blush: 0,
    blushOpacity: 0.0,
    blushColor: 0.0,
    nails: -1
}

export interface BarberType extends BarberData {
    id: number,
    show: boolean,
    subpage: number,
    old_params: Partial<BarberData>,
    old_data: [params, number][],
    data: {item: number, price: number, count: number, max_count: number}[]
}
export class BarberShop extends React.Component<{}, BarberType> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
            id: 0,
            show: true,
            sex: 0,
            ...defaultParam,
            old_params: {},
            old_data: []
        };
        this.ev = CustomEvent.register('barbershop:load', (data: BarberData, dataCatalog: any, id: number) => {
            this.setState({...this.state, ...data, old_params: data, id, data: dataCatalog});
        })
        if(CEF.test){
            setTimeout(() => {
                this.setState({old_params: {
                        hair: 0,
                        hairColor: 0,
                        hairColor2: 0,
                        eyebrows: 0,
                        eyecolor: 0,
                        eyebrowsColor: 0,
                        eyebrowOpacity: 0.5,
                        beard: 0,
                        beardColor: 0,
                        beardOpacity: 0.5,
                    }});
            }, 500)
        }
    }

    get male(){
        return this.state.sex === 0
    }
    get female(){
        return !this.male
    }

    getOldParamValue(key: keyof BarberData){
        return this.state.old_params[key]
    }
    get changedData(){
        let ret:Partial<BarberData> = {};
        for(let keys in defaultParam){
            let key: keyof typeof defaultParam = keys as any;
            if(this.state[key] != this.getOldParamValue(key as keyof BarberData)) ret[key as keyof BarberData] = this.state[key];
        }

        return ret;
    }
    get finalySum(){
        const changed = this.changedData;
        let sum = 0;
        for(let key in changed){
            if (key != 'subpage')
                sum += getComponentCost(key as keyof BarberData, this.state.data);
        }
        return sum;
    }


    clickBuy = () => {
        const data = this.changedData;
        CustomEvent.triggerServer('barbershop:buy', data, this.state.id)
    }
    componentWillUnmount = () => {
        if(this.ev) this.ev.destroy();
    }
    componentDidMount = () => {
    }
    closeMenu = () => {
        this.setState({...this.state, show:false });
    }
    setAppearance = (type: string, value: number) => {
        mp.trigger('client:user:personage:eventManager', type, value);
        console.log("type:",type);
        console.log("value:",value);
    }
    getName = ( type:page_hair) => {
        // добавить получение стоимость
        switch( type ) {
            case page_hair.HAIR: return "Новая прическа";
            case page_hair.BROWS: return "Новые брови";
            case page_hair.BEARD: return "Новая борода";
        }
    }

    setOldParam(type: params, value: number){
        if(this.state.old_data.find(q => q[0] === type)) return;
        this.setState({old_data: [...this.state.old_data, [type, value]]})
    }


    setParam = (type: params, value: number) => {
        switch( type ) {
            case params.EYE_COLOR: {
                this.setOldParam(type, this.state.old_params.eyecolor);
                this.setState( (state) => { return { ...state, eyecolor:value } })
                return this.setAppearance( 'eyeColor', value);
            }
            case params.HAIR: {
                this.setOldParam(type, this.state.old_params.hair);
                this.setState( (state) => { return { ...state, hair:value } })
                this.setAppearance( 'hair', value)
                this.setAppearance( 'hairColor', this.state.hairColor);
                this.setAppearance( 'hairColor2', this.state.hairColor2);
                return;
            }
            case params.COLOR_HAIR1: {
                this.setOldParam(type, this.state.old_params.hairColor);
                this.setState((state) => { return  {...state, hairColor:value }})
                return this.setAppearance( 'hairColor', value);
            }
            case params.COLOR_HAIR2: {
                this.setOldParam(type, this.state.old_params.hairColor2);
                this.setState((state) => { return  {...state, hairColor2:value }})
                return this.setAppearance( 'hairColor2', value);
            }
            case params.BROWOPACITY: {
                this.setOldParam(type, this.state.old_params.eyebrowOpacity);
                this.setState((state) => { return  {...state, eyebrowOpacity:value }})
                return this.setAppearance( 'eyebrowsOpacity', value);
            }    
            case params.BROW: {
                this.setOldParam(type, this.state.old_params.eyebrows);
                this.setState((state) => { return  {...state, eyebrows:value }})
                return this.setAppearance( 'eyebrows', value);
            }    
            case params.COLOR_BROWS: {
                this.setOldParam(type, this.state.old_params.eyebrowsColor);
                this.setState((state) => { return  {...state, eyebrowsColor:value }})
                return this.setAppearance( 'eyebrowsColor', value);
            }
            case params.BEARD: {
                this.setOldParam(type, this.state.old_params.beard);
                this.setState((state) => { return  {...state, beard:value }})
                return this.setAppearance( 'beard', value);
            }             
            case params.BEARDOPACITY: {
                this.setOldParam(type, this.state.old_params.beardOpacity);
                this.setState((state) => { return  {...state, beardOpacity:value }})
                return this.setAppearance( 'beardOpacity', value);
            }             
            case params.COLOR_BEARD: {
                this.setOldParam(type, this.state.old_params.beardColor);
                this.setState((state) => { return  {...state, beardColor:value }});
                return this.setAppearance( 'beardColor', value);
            }
            case params.LIPS: {
                this.setOldParam(type, this.state.old_params.lips);
                this.setState((state) => { return  {...state, lips:value }});
                return this.setAppearance( 'lips', value);
            }
            case params.LIPS_OPACITY: {
                this.setOldParam(type, this.state.old_params.lipsOpacity);
                this.setState((state) => { return  {...state, lipsOpacity:value }});
                return this.setAppearance( 'lipsOpacity', value);
            }
            case params.LIPS_COLOR: {
                this.setOldParam(type, this.state.old_params.lipsColor);
                this.setState((state) => { return  {...state, lipsColor:value }});
                return this.setAppearance( 'lipsColor', value);
            }

            case params.MAKEUP: {
                this.setOldParam(type, this.state.old_params.makeup);
                this.setState((state) => { return  {...state, makeup:value }});
                return this.setAppearance( 'makeup', value);
            }
            case params.MAKEUP_OPACITY: {
                this.setOldParam(type, this.state.old_params.makeupOpacity);
                this.setState((state) => { return  {...state, makeupOpacity:value }});
                return this.setAppearance( 'makeupOpacity', value);
            }
            case params.MAKEUP_COLOR: {
                this.setOldParam(type, this.state.old_params.makeupColor);
                this.setState((state) => { return  {...state, makeupColor:value }});
                return this.setAppearance( 'makeupColor', value);
            }


            case params.BLUSH: {
                this.setOldParam(type, this.state.old_params.blush);
                this.setState((state) => { return  {...state, blush:value }});
                return this.setAppearance( 'blush', value);
            }
            case params.BLUSH_OPACITY: {
                this.setOldParam(type, this.state.old_params.blushOpacity);
                this.setState((state) => { return  {...state, blushOpacity:value }});
                return this.setAppearance( 'blushOpacity', value);
            }
            case params.BLUSH_COLOR: {
                this.setOldParam(type, this.state.old_params.blushColor);
                this.setState((state) => { return  {...state, blushColor:value }});
                return this.setAppearance( 'blushColor', value);
            }

            case params.NAILS: {
                this.setOldParam(type, this.state.old_params.nails);
                this.setState((state) => { return  {...state, nails:value }});
                return this.setAppearance( 'nails', value);
            }
        }
    }
    setSubPage = ( subpage:number ) => {
        this.setState({...this.state, subpage});
        mp.trigger('barbershop::subPageChanged', subpage);
    }

    render() {
        const changed = !!this.finalySum
        return <>
            <div className="barbershop_main">
                <div className="barbershop_box">
                    <div className="pers_box_left">
                        {this.PageDataHair()}
                    </div>
                    <div className="barbershop_info">
                        <div>
                            <h1>${this.finalySum}</h1>
                            <h2>Финальная сумма</h2>
                        </div>
                        {changed ? <>
                            <div className="barbershop_key reset" onClick={e => {
                                e.preventDefault();
                                const d = [...this.state.old_data];
                                d.map(([type, value]) => {
                                    this.setParam(type, value);
                                })
                                this.setState({old_data: []});
                            }}>
                                <img src={exitsvg}/>Сброс
                            </div>
                            <div className="barbershop_key" onClick={this.clickBuy}>
                            <img src={check}/>Купить
                        </div></> : <></>}

                    </div>
                </div>    
            </div>
        </>
    }

    get hairPage(){
        const pages = [  svg["hair"], svg["brow"], svg[this.male ? "beard" : "make-up"], svg["lips"] ];

        if (this.female) {
            pages.push(svg["nails"]);
        }

        return pages;
    }

    PageDataHair = () => {
        return <>
            <div className="pers_box_face">
                <div className="pers_face_type">
                    {this.hairPage.map( (data:any, index: number) => {
                        return <div onClick={() => this.setSubPage(index)} key={index} className={`pers_face_div ${this.state.subpage === index ? "pers_face_select" : "" }`}>
                            <img src={data}/>
                        </div>})}
                </div>
                {this.PageDataSubHair()}
            </div>
            {this.state.subpage === page_hair.HAIR ? this.PageDataColor([params.COLOR_HAIR1,params.COLOR_HAIR2], [this.state.hairColor, this.state.hairColor2]) : null}
        </>;
    }

    PageDataSubHair = () => {
        switch( this.state.subpage ) {
            case page_hair.HAIR: {
                return <div className="pers_hair_subtype">
                    { personage.hair[this.state.sex].map( (data:number, index:number )=>
                        <img
                            onClick={() => this.setParam(params.HAIR, data)}
                            key={index}
                            className={`${this.state.hair === data ? "pers_parent_select":""}`}
                            src={`${hairs[this.state.sex][`${this.state.sex === 0 ? "m":"f"}${personage.hair[this.state.sex][index]}`]}`}>
                        </img>
                    )}
                </div>

            }
            case page_hair.BROWS: {
                return  <div className="pers_face_subtype">
                    {this.AddButton( "Вид бровей", this.state.eyebrows, 1, 0, personage.eyebrows, (value:number) => this.setParam(params.BROW, value) )}
                    {this.AddButton( "Глаза", this.state.eyecolor, 1, 0, personage.eyeColor, (value:number) => this.setParam(params.EYE_COLOR, value) )}
                    <div>
                        {AddSlider( sliders.SLIDER_PARAM, this.state.eyebrowOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => this.setParam(params.BROWOPACITY, value) )}
                        <p className="pers_p_with_border">Интенсивность бровей</p>
                    </div>
                    {this.PageDataColor([params.COLOR_BROWS], [this.state.eyebrowsColor])}
                </div>

            }
            case page_hair.BEARD: {
                return  <div className="pers_face_subtype">
                    {this.female ? <>
                        {this.AddButton( "Макияж", this.state.makeup, 1, 0, personage.makeup, (value:number) => this.setParam(params.MAKEUP, value) )}
                        <div>
                            {AddSlider( sliders.SLIDER_PARAM, this.state.makeupOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => this.setParam(params.MAKEUP_OPACITY, value) )}
                            <p className="pers_p_with_border">Интенсивность макияжа</p>
                        </div>
                        {this.PageDataColor([params.MAKEUP_COLOR], [this.state.makeupColor])}
                    </> : <>
                        {this.AddButton( "Вид бороды", this.state.beard, 1, 0, personage.beard, (value:number) => this.setParam(params.BEARD, value) )}
                        <div>
                            {AddSlider( sliders.SLIDER_PARAM, this.state.beardOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => this.setParam(params.BEARDOPACITY, value) )}
                            <p className="pers_p_with_border">Интенсивность бороды</p>
                        </div>
                        {this.PageDataColor([params.COLOR_BEARD], [this.state.beardColor])}
                    </>}

                </div>

            }
            case page_hair.LIPS: {
                return  <div className="pers_face_subtype">
                    {this.AddButton( "Губы", this.state.lips, 1, 0, personage.lips, (value:number) => this.setParam(params.LIPS, value) )}
                    <div>
                        {AddSlider( sliders.SLIDER_PARAM, this.state.lipsOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => this.setParam(params.LIPS_OPACITY, value) )}
                        <p className="pers_p_with_border">Интенсивность губ</p>
                    </div>
                    {this.PageDataColor([params.LIPS_COLOR], [this.state.lipsColor])}

                </div>

            }
            case page_hair.NAILS: {
                return  <div className="pers_hair_subtype">
                    { nailsConfig.map((nailsData, index) =>
                        <img
                            onClick={() => this.setParam(params.NAILS, nailsData.Id)}
                            key={index}
                            className={`${this.state.nails === nailsData.Id ? "pers_parent_select":""}`}
                            src={`${nailsPictures[nailsData.Id]}`}>
                        </img>
                    )}
                </div>
            }
        }
    }

    AddButton = ( name: string, value:number, step: number, min: number, max:number, handler: (newValue:number) => void  ) => {
        return <div className="pers_button_box">
            <p>{name}</p>
            <div onClick={()=>{ if(value > min ) handler( (value-=step) )}} className={`pers_button_key ${value === min ? "":"pbk_active"}`}><img src={svg["btnkey"]}/></div>
            <div onClick={()=>{ if(value < max ) handler( (value+=step) )}} className={`pers_button_key ${value === max ? "":"pbk_active"}`}><img src={svg["btnkey"]} style={{transform: 'rotate(180deg)'}}/></div>
        </div>
    }

    PageDataColor = ( type:Array<number>, value:Array<number> ) => {
        return <div className={`pers_box_color ${value.length > 1 ? "pers_box_color_ex": ""}`}>
            <div className={`pers_box_color_box ${value.length > 1 ? "pers_box_color_ex": ""}`}>
                <p>Основной цвет</p>
                {colors.map(( color:string, index:number) => {
                    return <div onClick={()=> this.setParam(type[0], index)} key={index} className={`pers_box_color_item ${ value[0]===index?"color_item_select":""}`} style={{backgroundColor: color}}/>
                })}
            </div>
            {value.length > 1 ?
                <div className={`pers_box_color_box ${value.length > 1 ? "pers_box_color_ex": ""}`}>
                    <p>Дополнительный цвет</p>
                    {colors.map(( color:string, index:number) => {
                        return <div onClick={()=> this.setParam(type[1], index)} key={index} className={`pers_box_color_item ${ value[1]===index?"color_item_select":""}`} style={{backgroundColor: color}}/>
                    })}
                </div>: null
            }
        </div>
    }
}
