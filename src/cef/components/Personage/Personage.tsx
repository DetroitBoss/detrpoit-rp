import React from 'react';
import './assets/pers.less';
import personage, {colors, Ranges} from './config';
import mouser from './assets/mouser.svg';
import arrow from './assets/arrow.svg';
import random from './assets/random.svg';
import svg from './assets/*.svg';
import man from './assets/man.svg';
import woman from './assets/woman.svg';
import parents from './assets/parents/*.png';
import hairsf from './assets/hairs/female/*.jpg';
import hairsm from './assets/hairs/male/*.jpg';
import {AddSlider, sliders} from './Slider';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {CharacterCreatorDress} from '../../../shared/character';

const hairs = [hairsm, hairsf];
const facePage = [ svg["nose"], svg["forehead"], svg["eye"], svg["chin"] ];
const hairPage = [  svg["hair"], svg["brow"], svg["beard"] ];
const mainPage = [svg["parents"], svg["dnk"], svg["face"], svg["body"], svg["clothe"], svg["next"]];
 
const enum pages  {
    PAGE_PARENTS = 0,
    PAGE_FACE,
    PAGE_HAIR,
    PAGE_BODY,
    PAGE_CLOTHES
}     

const enum page_face {
    NOSE = 0,
    FOREHEAD,
    EYE,
    CHIN
}
const enum page_hair {
    HAIR = 0,
    BROWS,
    BEARD
}

const enum params {
    COLOR_EYE = 0,
    BROW,
    BROWOPACITY,
    COLOR_BROWS,
    BEARD,
    BEARDOPACITY,
    COLOR_BEARD,
    HAIR,
    COLOR_HAIR1,
    COLOR_HAIR2,
    FRECKLES,
    FRECKLESOPACITY,
    COLOR_FRECKLES    ,
    MAKEUP    ,
    MAKEUP_COLOR    ,
}

const {
    face,
    features,
    hair,
    eyebrows,
    freckles,
    beard,
    clothes,
    makeup
} = personage;

interface PlayerData {
    sex: number;
    name: string;
    family: string;
    nameError: string;
    familyError: string;
    age: number;
    focus: number
    promo: string;
}

interface PersData {
    player: PlayerData;
    page:number;
    subpage:number;
    item: number;
    floor: number;
    face: [number, number];
    skin: number;
    heredity: number;
    features: number[];
    hair: number,
    hairColor: number,
    hairColor2: number,
    eyebrows: number,
    eyebrowOpacity: number,
    eyebrowsColor: number,
    eyeColor: number,
    freckles: number,
    frecklesColor: number,
    frecklesOpacity: number,
    beard: number,
    beardColor: number,
    beardOpacity: number,
    pomade: number,
    pomadeColor: number,
    blush: number,
    blushColor: number,
    makeup: number,
    makeupColor: number;
    clothe: Array<number>;
    clotheId: Array<number>;
    dress: CharacterCreatorDress[]
}

export class Personage extends React.Component<{}, PersData> {
    constructor(props: any) {
        super(props);
        this.state = {
            dress: [],
            player: {
                sex:0,
                name: "",
                family: "",
                nameError: null,
                familyError: null,
                age: Ranges.age[0],
                focus: -1,
                promo: ''
            },
            page: pages.PAGE_PARENTS,
            subpage: 0,
            item: 0,
            floor: 0,
            face: [0, 0],
            skin: 0.5,
            heredity: 0.5,
            features: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            hair: 0,
            hairColor: 0,
            hairColor2: 0,
            eyebrows: 0,
            eyebrowOpacity: 0.5,
            eyebrowsColor: 0,
            eyeColor: 0,
            freckles: 0,
            frecklesColor: 0,
            frecklesOpacity: 0.1,
            beard: 0,
            beardColor: 0,
            beardOpacity: 0.5,
            pomade: 0,
            pomadeColor: 0,
            blush: 0,
            blushColor: 0,
            makeup: 0,
            makeupColor: 0,
            clothe: [0,0,0],
            clotheId: [0,0,0]
        }
        setTimeout(() => {
            this.loadDress();
        }, 1000)

        if (!CEF.user.name) {
            CEF.playSound('createpersonageonyx')
        }
    }

    setSex = ( sex: number ) => {
        mp.trigger('client:user:personage:eventManager', 'floor', sex);
        this.setState({
          player: { ...this.state.player, sex: sex },
          hair: 0,
          hairColor: 0,
          hairColor2: 0,
          eyebrows: 0,
          eyebrowsColor: 0,
          eyebrowOpacity: 0.5,
          eyeColor: 0,
          freckles: 0,
          frecklesColor: 0,
          frecklesOpacity: 0.1,
          beard: 0,
          beardColor: 0,
          beardOpacity: 0.5,
          pomade: 0,
          pomadeColor: 0,
          blush: 0,
          blushColor: 0,
          makeup: 0,
          makeupColor: 0,
          clothe: [0,0,0],
          clotheId: [0,0,0],
        }, () => {
               this.loadDress() 
        });
    }
    confirm = async () => {
        if( !CEF.user.name && (this.state.player.name.length < 2 || this.state.player.family.length < 2) ) return this.setState( {...this.state, player: {...this.state.player, nameError: this.state.player.name.length<2?"Короткое имя":null, familyError:this.state.player.family.length < 2?"Короткая фамилия":null }});
        if( !CEF.user.name && 
            (this.state.player.name.charAt(0).toLowerCase() == this.state.player.name.charAt(0) 
            || this.state.player.family.charAt(0).toLowerCase() == this.state.player.family.charAt(0))) 
            return this.setState( {...this.state, player: 
                    {...this.state.player, 
                        nameError: this.state.player.name.charAt(0).toLowerCase() == this.state.player.name.charAt(0) ? 'Имя должно начинаться с большой буквы' : null, 
                        familyError:this.state.player.family.charAt(0).toLowerCase() == this.state.player.family.charAt(0) ? 'Фамилия должна начинаться с большой буквы' : null }});
        
        if (!CEF.user.name && await CustomEvent.callServer('server:user:personage:checkName', this.state.player.name, this.state.player.family)) return this.setState({ ...this.state, player: { ...this.state.player, nameError: "Имя и фамилия уже зарегистрированы", familyError: "Имя и фамилия уже зарегистрированы" } });
        mp.trigger('client:user:personage:eventManager', 'save', 0, this.state.player.name, this.state.player.family, !CEF.user.name ? this.state.player.age : 0, !CEF.user.name ? JSON.stringify(this.state.clotheId) : null, this.state.player.promo);
    }
    random = () => {
        this.setHeredity( Ranges.heredity[0] + Math.random() * (Ranges.heredity[1] - Ranges.heredity[0]) );
        this.state.features.map( ( _, index:number)=> this.setFeatures( index , Ranges.features[0] + Math.random() * (Ranges.features[1] - Ranges.features[0]), index===this.state.features.length-1 ? false:true ) );
        this.setParent(0, Ranges.face[0][0] + Math.floor( Math.random() * (Ranges.face[0][1] - Ranges.face[0][0]) ));
        this.setParent(1, Ranges.face[1][0] + Math.floor( Math.random() * (Ranges.face[1][1] - Ranges.face[1][0]) ));
        this.setParam( params.HAIR, Ranges.hair[ this.state.player.sex ][0] + Math.floor( Math.random() * (Ranges.hair[ this.state.player.sex ][1] - Ranges.hair[ this.state.player.sex ][0]) ));
        this.setParam( params.BROW, Ranges.eyebrows[0] + Math.floor( Math.random() * (Ranges.eyebrows[1] - Ranges.eyebrows[0]) ));
        this.setParam( params.BEARD, Ranges.beard[0] + Math.floor( Math.random() * (Ranges.beard[1] - Ranges.beard[0]) ));
        this.setParam( params.FRECKLES, Ranges.freckles[0] + Math.floor( Math.random() * (Ranges.freckles[1] - Ranges.freckles[0]) ));
        this.setParam( params.BROWOPACITY, Ranges.opacity[0] + Math.floor( Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]) ));
        this.setParam( params.FRECKLESOPACITY, Ranges.opacity[0] + Math.floor( Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]) ));
        this.setParam( params.BEARDOPACITY, Ranges.opacity[0] + Math.floor( Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]) ));
        this.setParam( params.COLOR_HAIR1, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
        this.setParam( params.COLOR_HAIR2, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
        this.setParam( params.COLOR_EYE, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
        this.setParam( params.COLOR_BROWS, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
        this.setParam( params.COLOR_BEARD, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
        this.setParam( params.COLOR_FRECKLES, Ranges.colors[0] + Math.floor( Math.random() * (Ranges.colors[1] - Ranges.colors[0]) ));
    }

    inputName = ( focus:number ) => 
        this.setState( {...this.state, player: {...this.state.player, focus , nameError: focus === 0 ? null:this.state.player.nameError , familyError: focus === 1 ? null:this.state.player.familyError }} );
    setName = ( type:number, e: any ) => {
        if(!e.target.value.match(/^[a-zA-Z]{0,20}$/i)) return;
        if( !type ) this.setState( { player: {...this.state.player, name:e.target.value }}  );
        else this.setState( { player: {...this.state.player, family: e.target.value }}  );
    }
    setAge = ( age:number, check = false ) => {
        if(check){
            age = Math.max(Ranges.age[0], age)
            age = Math.min(Ranges.age[1], age)
        }
        mp.trigger('client:user:personage:setAge', age );
        this.setState( { player: {...this.state.player, age }}  );
    }
    setPromo = ( promo: string ) => {
        this.setState( { player: {...this.state.player, promo: promo ? promo.toUpperCase() : promo }}  );
    }
    setPage = ( page:number ) => {
        if( mainPage.length-1 === page ) return this.confirm(); 
        this.setState({...this.state, page, subpage:0 }  );
    }
    setSubPage = ( subpage:number ) => 
        this.setState({...this.state, subpage }  );
    setItem = (item: number) => 
        this.setState({...this.state, item }  );
    setParent = (type:number, id: number) => {
        mp.trigger('client:user:personage:eventManager', type ? 'mother' : 'father', face[type][id] );
        this.setState((state) => {
           state.face[type] = id;
           return { ...state };
        });
    }
    setHeredity = (heredity: number) => {
        mp.trigger('client:user:personage:eventManager', 'heredity', heredity);
        mp.trigger('client:user:personage:eventManager', 'skin', heredity);
        this.setState(() => {
          return {
            heredity,
            skin:heredity
          };
        });
    }
    setFeatures = (id:number, value: number, no_update?: boolean) => {
        this.setState((state) => {
          state.features[id] = value;
          if(!no_update) mp.trigger('client:user:personage:eventManager', 'features', JSON.stringify(state.features));
          return { ...state };
        });
    }
    setAppearance = (type: string, value: number) => {
        mp.trigger('client:user:personage:eventManager', type, value);
    }
    loadDress(){
        CEF.getDressPersonage(this.state.player.sex ? 0 : 1).then(dress => {
            this.setState({
                dress,
                clothe: [0, 0, 0],
                clotheId: [
                    dress.find(q => q.category === clothes[0].category) ? dress.find(q => q.category === clothes[0].category).id : 0,
                    dress.find(q => q.category === clothes[1].category) ? dress.find(q => q.category === clothes[1].category).id : 0,
                    dress.find(q => q.category === clothes[2].category) ? dress.find(q => q.category === clothes[2].category).id : 0,
                ]
            }, () => {
                this.reloadDress()
            })
        })
    }
    reloadDress() {
        if (this.state.clotheId[0]){
            const conf = this.state.dress.find(q => q.id === this.state.clotheId[0]);
            CustomEvent.triggerClient('cloth:preview', JSON.stringify(conf.data));
        }
        if (this.state.clotheId[1]){
            const conf = this.state.dress.find(q => q.id === this.state.clotheId[1]);
            CustomEvent.triggerClient('cloth:preview', JSON.stringify(conf.data));
        }
        if (this.state.clotheId[2]){
            const conf = this.state.dress.find(q => q.id === this.state.clotheId[1]);
            CustomEvent.triggerClient('cloth:preview', JSON.stringify(conf.data));
        }
    }
    setClothes = (category: number, index: number, value: number, id: number) => {
        this.setState((state) => {
            state.clothe[index] = value;
            state.clotheId[index] = id;
            return state
        });
        const conf = this.state.dress.filter(q => q.category === category)[value];
        CustomEvent.triggerClient('cloth:preview', JSON.stringify(conf.data));
    }
    setParam = (type: number, value: number) => {
        switch( type ) {
            case params.HAIR: {
                this.setState( (state) => { return { ...state, hair:value } })
                return this.setAppearance( 'hair', hair[this.state.player.sex][value]);
            }
            case params.COLOR_HAIR1: {
                this.setState((state) => { return  {...state, hairColor:value }})
                return this.setAppearance( 'hairColor', value);
            }
            case params.COLOR_HAIR2: {
                this.setState((state) => { return  {...state, hairColor2:value }})
                return this.setAppearance( 'hairColor2', value);
            }
            case params.COLOR_EYE: 
                this.setState((state) => { return  {...state, eyeColor:value }})
                return this.setAppearance( 'eyeColor', value);
            case params.BROWOPACITY: {
                this.setState((state) => { return  {...state, eyebrowOpacity:value }})
                return this.setAppearance( 'eyebrowsOpacity', value);
            }    
            case params.BROW: {
                this.setState((state) => { return  {...state, eyebrows:value }})
                return this.setAppearance( 'eyebrows', value);
            }    
            case params.COLOR_BROWS: {
                this.setState((state) => { return  {...state, eyebrowsColor:value }})
                return this.setAppearance( 'eyebrowsColor', value);
            }
            case params.BEARD: {
                this.setState((state) => { return  {...state, beard:value }})
                return this.setAppearance( 'beard', value);
            }             
            case params.BEARDOPACITY: {
                this.setState((state) => { return  {...state, beardOpacity:value }})
                return this.setAppearance( 'beardOpacity', value);
            }             
            case params.COLOR_BEARD: {
                this.setState((state) => { return  {...state, beardColor:value }})
                return this.setAppearance( 'beardColor', value);
            }
            case params.FRECKLES: {
                this.setState((state) => { return  {...state, freckles:value }})
                return this.setAppearance( 'freckles', value);
            }
            case params.FRECKLESOPACITY: {
                this.setState((state) => { return  {...state, frecklesOpacity:value }})
                return this.setAppearance( 'frecklesOpacity', value);
            }
            case params.COLOR_FRECKLES: {
                this.setState((state) => { return  {...state, frecklesColor:value }})
                return this.setAppearance( 'frecklesColor', value);
            }
            case params.MAKEUP: {
                this.setState((state) => { return  {...state, makeup:value }})
                return this.setAppearance( 'makeup', value);
            }
            case params.MAKEUP_COLOR: {
                this.setState((state) => { return  {...state, makeupColor:value }})
                return this.setAppearance( 'makeupColor', value);
            }
        }
    }
    render() {
        return <div className="pers_main">
                    {PersData(this.state.player, this.setSex, this.setName, this.inputName, this.setAge, this.setPromo )}
                    <div className="pers_custom">
                        <div className="pers_random" onClick={this.random}>
                            <img src={random}/><p>Случайно</p>
                        </div>
                        <div className="pers_box">
                            <div className="pers_box_right">
                                {mainPage.map( (data:any, index:number) => {
                                    return <div onClick={()=> this.setPage(index)} key={index} className={`pers_page ${this.state.page === index ? "pers_page_select": ""} ${index === mainPage.length-1 ? "pers_page_accept" : ""}` }>
                                        <img src={data}/>
                                    </div>
                                })}
                            </div>
                            <div className="pers_box_left">
                                {PageDataParent( this.state, this.setItem, this.setParent, this.setHeredity )}
                                {PageDataFace( this.state, this.setSubPage , this.setFeatures, this.setParam )}
                                {PageDataHair( this.state, this.setSubPage , this.setParam )}
                                {PageDataBody( this.state, this.setParam )}
                                {this.PageDataClothes()}
                            </div>
                        </div>

                    </div>
              </div>;
    }
    PageDataClothes(){
        if (this.state.page != pages.PAGE_CLOTHES) return null;
        return <>
            <div className="pers_box_body">
                {clothes.map((data, index: number) => {
                    const catalogItem = this.state.dress.filter(q => q.category === data.category)
                    if (!catalogItem.length) return <></>;
                    return <div key={`dress_create_pers_${index}`}>{AddButton(`${data.name}${catalogItem[this.state.clothe[index]] ? ` (${catalogItem[this.state.clothe[index]].name})` : ''}`, catalogItem[this.state.clothe[index]] ? this.state.clothe[index] : 0, 1, 0, catalogItem.length - 1, (value: number) => {
                        this.setClothes(data.category, index, value, catalogItem[value].id)
                    })}</div>
                })}
            </div>
        </>
    }
}

const PageDataColor = ( type:Array<number>, state:PersData, setParam: (type: number, value: number) => void, value:Array<number> ) => {
    return <div className={`pers_box_color ${value.length > 1 ? "pers_box_color_ex": ""}`}>
        <div className={`pers_box_color_box ${value.length > 1 ? "pers_box_color_ex": ""}`}>
            <p>Основной цвет</p>
            {colors.map(( color:string, index:number) => {
                return <div onClick={()=> setParam(type[0], index)} key={index} className={`pers_box_color_item ${ value[0]===index?"color_item_select":""}`} style={{backgroundColor: color}}/>
            })}
        </div>
        {value.length > 1 ? 
            <div className={`pers_box_color_box ${value.length > 1 ? "pers_box_color_ex": ""}`}>
                <p>Дополнительный цвет</p>
                {colors.map(( color:string, index:number) => {
                    return <div onClick={()=> setParam(type[1], index)} key={index} className={`pers_box_color_item ${ value[1]===index?"color_item_select":""}`} style={{backgroundColor: color}}/>
                })}
            </div>: null 
        }
    </div>
}
 
const PageDataBody = ( state:PersData, setParam: (type: number, value: number) => void ) => {
    if( state.page != pages.PAGE_BODY ) return null;
    return  <>
                <div className="pers_box_body">
                    {AddButton( "Веснушки", state.freckles, 1, 0, freckles, (value:number) => setParam(params.FRECKLES, value) )}
                        <div>
                            {AddSlider( sliders.SLIDER_PARAM, state.frecklesOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => setParam(params.FRECKLESOPACITY, value) )}
                            <p className="pers_p_with_border">Интенсивность веснушек</p>                
                        </div>    
                        {PageDataColor([params.COLOR_FRECKLES], state, setParam, [state.frecklesColor])}

                </div>
            </>
}

const PageDataHair = ( state:PersData, setSubPage: (sub:number) => void, setParam: (type: number, value: number) => void  ) => {
    if( state.page != pages.PAGE_HAIR ) return null;
    return <>
        <div className="pers_box_face">
            <div className="pers_face_type"> 
                {hairPage.map( (data:any, index: number) => {
                    return <div onClick={() => setSubPage(index)} key={index} className={`pers_face_div ${state.subpage === index ? "pers_face_select" : "" }`}>
                        <img src={data}/>
                    </div>})}
            </div>
            {PageDataSubHair(state,setParam)}
        </div>
        {state.subpage === page_hair.HAIR ? PageDataColor([params.COLOR_HAIR1,params.COLOR_HAIR2], state, setParam, [state.hairColor, state.hairColor2]) : null}
    </>;
}

const PageDataFace = ( state:PersData, setSubPage: (sub:number) => void, setFeatures: (id:number, value: number) => void , setParam: (type: number, value: number) => void  ) => {
    if( state.page != pages.PAGE_FACE ) return null;
    return <>
        <div className="pers_box_face">
            <div className="pers_face_type"> 
                {facePage.map( (data:any, index: number) => {
                    return <div onClick={() => setSubPage(index)} key={index} className={`pers_face_div ${state.subpage === index ? "pers_face_select" : "" }`}>
                        <img src={data}/>
                    </div>})}
            </div>
            <div className="pers_face_subtype">
                {PageDataSubFace(state, setFeatures,setParam)}
            </div>
        </div>
          
    </>
}

const PageDataSubHair = ( state:PersData, setParam: (type: number, value: number) => void ) => {
    switch( state.subpage ) {
        case page_hair.HAIR: {
            return <div className="pers_hair_subtype">
                { hair[state.player.sex].map( (data:number, index:number )=> 
                    <img onClick={() => setParam(params.HAIR, index)} key={index} className={`${state.hair === index ? "pers_parent_select":""}`} src={`${hairs[state.player.sex][`${state.player.sex === 0 ? "m":"f"}${hair[state.player.sex][index]}`]}`}></img>
                )}
            </div>

        }
        case page_hair.BROWS: {
            return  <div className="pers_face_subtype">
                        {AddButton( "Вид бровей", state.eyebrows, 1, 0, eyebrows, (value:number) => setParam(params.BROW, value) )}
                        <div>
                            {AddSlider( sliders.SLIDER_PARAM, state.eyebrowOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => setParam(params.BROWOPACITY, value) )}
                            <p className="pers_p_with_border">Интенсивность бровей</p>                
                        </div>    
                        {PageDataColor([params.COLOR_BROWS], state, setParam, [state.eyebrowsColor])}
                    </div>

        }
        case page_hair.BEARD: {
            if( state.player.sex === 1 ) 
                return  <div className="pers_face_subtype">
                            {AddButton( "Вид макияжа", state.makeup, 1, 0, makeup, (value:number) => setParam(params.MAKEUP, value) )}
                            {PageDataColor([params.MAKEUP_COLOR], state, setParam, [state.makeupColor])}
                        </div>
            else 
                return  <div className="pers_face_subtype">
                            {AddButton( "Вид бороды", state.beard, 1, 0, beard, (value:number) => setParam(params.BEARD, value) )}
                            <div>
                                {AddSlider( sliders.SLIDER_PARAM, state.beardOpacity, 0.01, Ranges.opacity[0], Ranges.opacity[1], (value:number) => setParam(params.BEARDOPACITY, value) )}
                                <p className="pers_p_with_border">Интенсивность бороды</p>                
                            </div>    
                            {PageDataColor([params.COLOR_BEARD], state, setParam, [state.beardColor])}
                        </div>

        }
    }
};

const PageDataSubFace = ( state:PersData, setFeatures: (id:number, value: number) => void , setParam: (type: number, value: number) => void ) => {
    switch( state.subpage ) {
        case page_face.NOSE: {
            return <>
                {state.features.slice(0, 6).map((i:number, id:number) => {
                    let handler = (value:number) => setFeatures( id, value );
                    return <div key={id}>
                        {AddSlider( sliders.SLIDER_PARAM, state.features[id], 0.01, Ranges.features[0], Ranges.features[1], handler )}
                        <p className="pers_p_with_border">{features[id]}</p>
                    </div>
                }
                )}
            </>
        }
        case page_face.FOREHEAD: {
            return <>
                {state.features.slice(6, 11).map((i:number, id:number) => {
                    let handler = (value:number) => setFeatures( id+6, value );
                    return <div key={id}>
                        {AddSlider( sliders.SLIDER_PARAM, state.features[id+6], 0.01, Ranges.features[0], Ranges.features[1], handler )}
                        <p className="pers_p_with_border">{features[id+6]}</p>
                    </div>
                }
                )}
            </>
        }
        case page_face.EYE: {
            return <>
                {state.features.slice(11, 12).map((i:number, id:number) => {
                    let handler = (value:number) => setFeatures( id+11, value );
                    return <><div key={id}>
                        {AddSlider( sliders.SLIDER_PARAM, state.features[id+11], 0.01, Ranges.features[0], Ranges.features[1], handler )}
                        <p className="pers_p_with_border">{features[id+11]}</p>
                    </div>
                    {PageDataColor([params.COLOR_EYE], state, setParam, [state.eyeColor])}
                    </>
                }
                )}
                
            </>
        }
        case page_face.CHIN: {
            return <>
                {state.features.slice(12, 20).map((i:number, id:number) => {
                    let handler = (value:number) => setFeatures( id+12, value );
                    return <div key={id}>
                        {AddSlider( sliders.SLIDER_PARAM, state.features[id+12], 0.01, Ranges.features[0], Ranges.features[1], handler )}
                        <p className="pers_p_with_border">{features[id+12]}</p>
                    </div>
                }
                )}
            </>
        }
    }
}
const PageDataParent = ( state: PersData, setItem: (id:number) => void, setParent: (type:number,id:number) => void, setHeredity: (heredity:number) => void) => {
    if( state.page != pages.PAGE_PARENTS ) return null;
    return <>
        <div className="pers_box_parent"> 
            <div className="pers_parent_type"> 
                <div onClick={() => setItem(0)} className={`perent_div ${state.item === 0 ? "perent_select" : "" }`}><img src={man}/></div>
                <div className={`perent_slider`}><p>Схожесть</p>{AddSlider( sliders.SLIDER_FLOOR, state.heredity, 0.01, Ranges.heredity[0], Ranges.heredity[1], setHeredity )}</div>
                <div onClick={() => setItem(1)} className={`perent_div ${state.item === 1 ? "perent_select" : "" }`}><img src={woman}/></div>
            </div>
            <div className="pers_parent_face"> 
                { face[state.item].map( (data:number, index:number )=> 
                    <img onClick={() => setParent(state.item, index)} key={index} className={`${state.face[state.item] === index ? "pers_parent_select":""}`} src={`${parents[`${state.item === 0 ? "male":"female"}_${index}`]}`}></img>
                )}
            </div>
        </div>
    </>
};

const PersData = (player:PlayerData, setSex: (sex:number) => void, setName: (type:number, e:any) => void, inputName: (type:number) => void, setAge: (age:number) => void, setPromo: (promo: string) => void) => {
    return <>
        <div className="pers_text"><h2>Создание Персонажа</h2></div>
        <div className="pers_data">
            <div className="pers_sex">
                <div className={`pers_female ${player.sex ? "":" male_select"}`  } onClick={()=>setSex(0)}></div>
                <div className={`pers_male ${!player.sex ? "":" male_select"}` } onClick={()=>setSex(1)}></div>
            </div>
            <div className="pers_sex_text"><p>Выберите пол</p><p>вашего персонажа</p></div>
            {!CEF.user.name ? <>
                <div className={`pers_name ${player.focus == 0 ? "pers_name_select" : ""} ${player.nameError ? "pers_name_error" : ""} ${!!CEF.user.name ? 'pers_name_error' : ''}`}>
                    <p>Имя</p>
                    <input readOnly={!!CEF.user.name ? true : false} disabled={!!CEF.user.name ? true : false} onFocus={() => inputName(0)} onBlur={() => inputName(-1)} placeholder="Name" onChange={(e: any) => setName(0, e)} value={CEF.user.name ? CEF.user.name.split(' ')[0] : (player.nameError ? player.nameError : player.name)}>
                    </input>
                </div>
                <div className={`pers_family ${player.focus == 1 ? "pers_name_select" : ""} ${player.familyError ? "pers_name_error" : ""}  ${!!CEF.user.name ? 'pers_name_error' : ''}`}>
                    <p>Фамилия</p>
                    <input readOnly={!!CEF.user.name ? true : false} disabled={!!CEF.user.name ? true : false} onFocus={() => inputName(1)} onBlur={() => inputName(-1)} placeholder="Surname" onChange={(e: any) => setName(1, e)} value={CEF.user.name ? CEF.user.name.split(' ')[1] : (player.familyError ? player.familyError : player.family)}>
                    </input>
                </div>
                {/*<div className={`pers_family ${player.focus == 2 ? "pers_name_select" : ""}`}>*/}
                {/*    <p>Возраст персонажа</p>*/}
                {/*    <input readOnly={!!CEF.user.name ? true : false} disabled={!!CEF.user.name ? true : false} type={'number'}  onFocus={() => inputName(2)} min={Ranges.age[0]} max={Ranges.age[1]} onBlur={() => inputName(-1)} placeholder="Age" onChange={(e) => setAge(e.currentTarget.valueAsNumber)} value={player.age}>*/}
                {/*    </input>*/}
                {/*</div>*/}
                <div className="pers_slider" >
                    <p>Возраст персонажа</p>
                    {AddSlider(sliders.SLIDER_AGE, player.age, 1, Ranges.age[0], Ranges.age[1], setAge)}
                </div>
                <div className={`pers_family`}>
                    <p>Промокод</p>
                    <input placeholder="Promo" onChange={(e: any) => setPromo(e.currentTarget.value)} value={player.promo} />
                </div>
            </> : <></>}
            <div className="pers_help">
                <div><img src={mouser}/><img className="pers_arrow" src={arrow}/></div><p>Воспользуйтесь мышью для поворота персонажа</p>
            </div>
            {/* <div className="pers_help">
                <img src={mouse}/><p>Нажмите на колёсико, чтобы скрыть интерфейс</p>
            </div> */}
        </div>
    </>
};



const AddButton = ( name: string, value:number, step: number, min: number, max:number, handler: (newValue:number) => void  ) => {
    return <div className="pers_button_box">
        <p>{name}</p>
        <div onClick={()=>{ if(value > min ) handler( (value-step) )}} className={`pers_button_key ${value === min ? "":"pbk_active"}`}><img src={svg["btnkey"]}/></div>
        <div onClick={()=>{ if(value < max ) handler( (value+step) )}} className={`pers_button_key ${value === max ? "":"pbk_active"}`}><img src={svg["btnkey"]} style={{transform: 'rotate(180deg)'}}/></div>
    </div>    
}
 