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
    modelName: string,
    showName: string,
    price: number
}

interface rented {
    active: boolean,
    name: string
}

export class Rent extends Component<{}, {
    vehicles: rentVehicle[],
    rentedVehicle: rented,
    id: number
}>{
    constructor(props: any) {
        super(props);
        this.state = {
            id: 0,
            vehicles: [
                {
                    modelName: "faggio2",
                    showName: "Faggio v2",
                    price: 5000
                },
                {
                    modelName: "faggio3",
                    showName: "Faggio v3",
                    price: 6500
                }
            ],

            rentedVehicle: {
                active: false,
                name: "Porsche 911"
            }
        }
        CustomEvent.register('rentCar:denied', (carName: string) => {
            this.setState({
                rentedVehicle: {
                    active: true,
                    name: carName
                }
            })
        })
        CustomEvent.register('rentCar:open', (id: number, availableCars: { name: string, cost: number }[]) => {
            const cars: any[] = [];
            availableCars.map(car => {
                cars.push({
                    modelName: car.name,
                    showName: car.name,
                    price: car.cost
                })
            })
            this.setState({
                vehicles: cars,
                id
            })
        })
    }
    
    changeRentedVehicle(toggle: boolean, showName: string = "") {
        this.setState({
            ...this.state,
            rentedVehicle: {
                active: toggle,
                name: showName
            }
        })
    }

    startRent(modelName: string) {
        CustomEvent.triggerServer('rentCar:rent', this.state.id, modelName)
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
                <div className="rentCar-content__title">RENT CAR</div>
                <div className={`rentCar-content-cars ${this.state.rentedVehicle.active ? "" : "rentCar__active" }`}>

                    {
                        this.state.vehicles.map((el, key) => {
                            return <div className="rentCar-content-cars-block" key={key}>
                                <img src={CEF.getVehicleURL(el.modelName)} className="rentCar-content-cars-block__image" alt=""/>
                                <div className="rentCar-content-cars-block__name">{el.showName}</div>
                                <div className="rentCar-content-cars-block__button"
                                     onClick={() => this.startRent(el.modelName)}>
                                    <img src={keyIcon} alt=""/>
                                    Арендовать
                                </div>
                                <div className="rentCar-content-cars-block__price">${el.price}</div>
                            </div>
                        })
                    }

                </div>
            </div>

            {this.state.rentedVehicle.active && <div className="rentCar-notify">
                <div className="rentCar-notify__header">
                    В использовании: { this.state.rentedVehicle.name }
                </div>
                <div className="rentCar-notify__text">
                    <span>Вы арендовали автомобиль!</span><br/>
                    Вы не можете арендовать еще один автомобиль, так как у вас уже есть в аренде авто
                </div>
                <div className="rentCar-notify__btn" onClick={
                    () => CustomEvent.triggerServer('rentCar:stopRent')
                }>
                    Сдать
                </div>
            </div>}
        </div>
    }
}