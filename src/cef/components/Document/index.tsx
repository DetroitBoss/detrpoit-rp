import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import closeIcon from '../../assets/images/svg/close.svg';
import './style.less'
import Draggable from 'react-draggable';
import {getDocumentData, getFakeSignText} from '../../../shared/documents';
// @ts-ignore
import TextSignature from 'text-signature'


export class DocumentBlock extends Component<{}, {
    items: { image: string, ids:number,  zindex: number, document: string, date: string, code: string, id: string, name: string, social: string, idCreator: string, nameCreator: string, socialCreator: string, real:string}[]
}> {
    currentZIndex = 1000;
    currentIds = 1;
    ev: import("../../../shared/custom.event").CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            items: []
        }

        // if(CEF.test){
        //     setTimeout(() => {
        //         for (let id = 0; id < 5; id++){
        //             const r = systemUtil.randomArrayElement(['true', 'false'])
        //             console.log(r);
        //             this.addItem("weapon_theory", "1595660710", "1233-SDG4-24T2-5D5H", "1", "Alexander Potolayko " + id, "123123545362366", "2", "Anton Veselcov" + id, "523523677844555", r)
        //         }
        //     }, 3000)
        // }


        CustomEvent.register("document:show", (document: string, date: string, code: string, id: string, name: string, social: string, idCreator: string, nameCreator: string, socialCreator: string, real:string) => {
            this.addItem(document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real)
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
    }

    addItem(document: string, date: string, code: string, id: string, name: string, social: string, idCreator: string, nameCreator: string, socialCreator: string, real: string){
        const ids = this.currentIds++;
        const cfg = {
            width: 400,
            height: 70,
            paddingX: 20,
            paddingY: 50,
            canvasTargetDom: ".js-canvasTargetDom",
            font: ["30px", real === "true" ? "'Homemade Apple'" : "'Seaweed Script'"],
            color: "blue",
            textString: real === "true" ? getFakeSignText(nameCreator) : nameCreator,
            customFont: real === "true" ? {
                name: "'Homemade Apple'",
                url: "http://fonts.googleapis.com/css?family=Homemade+Apple"
            } : {
                    name: "'Seaweed Script'",
                    url: "http://fonts.googleapis.com/css?family=Seaweed+Script"
            }
        }
        const textSignature = new TextSignature(cfg)
        setTimeout(() => {
            textSignature.generateImage({ ...cfg})
            console.log(textSignature)
            const items = [...this.state.items];
            const zindex = this.currentZIndex++;
            
            items.push({ image: textSignature.getImageData(), ids, zindex, document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real})
            this.setState({
                items
            })

        }, 1000)
    }


    render() {

        return (<>
            {this.state.items.map((item) => {
                const data = getDocumentData(item.document, item.date, item.code, item.id, item.name, item.social, item.idCreator, item.nameCreator, item.socialCreator, item.real);
                if(!data) return <></>
                return <Draggable key={`document_${item.ids}`} onStart={e => {
                    const zindex = item.zindex;
                    const items = [...this.state.items];
                    this.currentZIndex++;
                    items.find(q => q.ids === item.ids).zindex = this.currentZIndex;
                    this.setState({
                        items
                    })
                }}>
                    <div key={`document_block_${item.ids}`} className="document-block" style={{zIndex: item.zindex}}>
                        <button className="closebutton" onClick={e => {
                            const items = [...this.state.items];
                            items.splice(items.findIndex(q => q.ids === item.ids), 1);
                            this.setState({items})
                        }}><img src={closeIcon} alt="" /></button>
                        <div className="document-title">{data.title}</div>
                        <div className="document-text">{data.text.split('@n ').map(q => {
                            return <>{q}<br/></>
                        })}</div>
                        {item.nameCreator ? <div className="document-bottom">
                            {item.nameCreator} <img src={item.image}/>
                        </div> : <></>}
                    </div>
                </Draggable>
            })}
        </>);
    }
}

