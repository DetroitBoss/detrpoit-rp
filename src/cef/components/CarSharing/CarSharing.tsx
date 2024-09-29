import React, {Component} from 'react';

import "./style.less";

import closeIcon from './assets/closeIcon.svg'

import carBackground from './assets/carBackground.png'
import sparksBackground from './assets/sparksBackground.png'
import tireTracksBackground from './assets/tireTracksBackground.png'

import keyIcon from './assets/key.svg'
 
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";

interface rentVehicle {
    id: number
    name: string,
    cost: number
}

export class CarSharing extends Component<{}, {
    vehicles: rentVehicle[],
    rentedVehicle: rentVehicle,
}>{
    constructor(props: any) {
        super(props);
        this.state = {
            vehicles: [

            ],

            rentedVehicle: null
        }

        CustomEvent.register('carSharing:open', (availableCars: { id: number, name: string, cost: number }[], rentedCar: { id: number, name: string, cost: number }) => {
            this.setState({
                rentedVehicle: rentedCar,
                vehicles: availableCars
            })
        })
    }

    startRent(id: number) {
        CustomEvent.triggerServer('carSharing:rent', id)
    }
    
    close(): void {
        CEF.gui.setGui(null)
    }

    render() {
        return <div className='rentCar'>

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={tireTracksBackground} className="rentCar-tireTracksBackground" alt=""/>
            <img src={sparksBackground} className="rentCar-sparksBackground" alt=""/>
            <img src={carBackground} className="rentCar-carBackground" alt=""/>

            <div className="rentCar-content">
                <div className="rentCar-content__description">STORE</div>
                <div className="rentCar-content__title">CAR SHARING</div>
                <div className={`rentCar-content-cars ${this.state.rentedVehicle ? "" : "rentCar__active" }`}>

                    {
                        this.state.vehicles.map((el, key) => {
                            return <div className="rentCar-content-cars-block" key={key}>
                                <img src={CEF.getVehicleURL(el.name)} className="rentCar-content-cars-block__image" alt=""/>
                                <div className="rentCar-content-cars-block__name">{el.name}</div>
                                <div className="rentCar-content-cars-block__button"
                                     onClick={() => this.startRent(el.id)}>
                                    <img src={keyIcon} alt=""/>
                                    Арендовать
                                </div>
                                <div className="rentCar-content-cars-block__price">${el.cost}</div>
                            </div>
                        })
                    }

                </div>
            </div>

            {this.state.rentedVehicle && <div className="rentCar-notify">
                <div className="rentCar-notify__header">
                    В использовании: { this.state.rentedVehicle.name }
                </div>
                <div className="rentCar-notify__text">
                    <span>Вы арендовали автомобиль!</span><br/>
                    Вы не можете арендовать еще один автомобиль, так как у вас уже есть в аренде авто
                </div>
                <div className="rentCar-notify__btn" onClick={
                    () => CustomEvent.triggerServer('carSharing:stopRent', this.state.rentedVehicle.id)
                }>
                    Сдать
                </div>
            </div>}
        </div>
    }
}