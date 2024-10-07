import React from 'react';
import {Slider, withStyles} from "@material-ui/core";

export enum sliders {
    SLIDER_AGE = 1,
    SLIDER_FLOOR = 2,
    SLIDER_PARAM = 3
}
type SliderType = {
     type: number; 
     value:number;
     step: number;
     min: number;
     max:number;
     handler: (newValue:number) => void
}
//type: number, value:number, step: number, min: number, max:number, handler: (newValue:number) => void
//const AddSlider: React.FC<SliderType> = ( {type, value, step, min, max, handler} ) => {
export const AddSlider = ( type: number, value:number, step: number, min: number, max:number, handler: (newValue:number) => void ) => {
    switch( type ) {
        case sliders.SLIDER_PARAM:
        case sliders.SLIDER_AGE:{
            return (
                <AgeSlider value={value} step={step ? step : 0.01} min={min} max={max} onChange={(e:any,newValue: number) =>  handler(newValue)} 
                           valueLabelDisplay={type === sliders.SLIDER_AGE ? "on" :"off"}  />   
            )}
        case sliders.SLIDER_FLOOR: {
            return (
                <FloorSlider orientation="vertical" value={value} step={step ? step : 0.01} min={min} max={max} onChange={(e:any,newValue: number) =>  handler(newValue)} />   
            )}
    }
};
//export default AddSlider;

const AgeSlider = withStyles({
    thumb: {
      height: 16,
      width: 16,
      backgroundColor: '#E3256B',
      marginLeft: -2,
      '&:focus, &:hover, &$active': {
        boxShadow: '0px 4px 30px rgba(227, 37, 107, 0.6)'
      },
    },
    active: {},
    valueLabel: {
        left: -4,
        top: 32,
        '& *': {
          background: 'transparent',
          fontFamily: 'TT Commons',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          lineHeight: '100%',
          textAlign: 'center',
          color: '#FFFFFF'
        },
    },
    track: {
       backgroundColor: '#E3256B',
       height: 5,
       borderRadius: 4,
       marginLeft: 1
    },
    rail: {
       height: 3,
       border: '1px solid rgba(255, 255, 255, 0.3)',
       backgroundColor: 'rgba(255, 255, 255, 0.05)',
       borderRadius: 2,
    },
  })(Slider);
  

 
const FloorSlider = withStyles({
    thumb: {
      height: 16,
      width: 16,
      backgroundColor: '#E3256B',
      '&:focus, &:hover, &$active': {
        boxShadow: '0px 4px 30px rgba(227, 37, 107, 0.6)'
      },
    },
    active: {},
    valueLabel: {
        left: -4,
        top: 32,
        '& *': {
          background: 'transparent',
          fontFamily: 'TT Commons',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          lineHeight: '100%',
          textAlign: 'center',
          color: '#FFFFFF'
        },
    },
    track: {
       backgroundColor: '#00000000',
       height: 8,
       borderRadius: 4,
    },
    rail: {
       border: '1px solid rgba(255, 255, 255, 0.3)',
       backgroundColor: 'rgba(255, 255, 255, 0.05)',
       borderRadius: 2,
    },
  })(Slider);