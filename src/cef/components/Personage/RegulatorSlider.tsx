import React, {Component} from 'react';
import {Slider} from '@material-ui/core';

interface RegulatorSliderProps {
  title: string;
  random?: boolean;
  range: [number, number];
  in?: boolean;
  features?: boolean;
  step?: number;
  handler(value: number): void;
}

class RegulatorSlider extends Component<RegulatorSliderProps, { value: number}> {

  componentDidUpdate() {
    if (this.props.random) {
      let value = this.props.range[0] + Math.random() * (this.props.range[1] - this.props.range[0]);
      this.props.handler(value);
      this.setState({value})
    }
  }

  render() {
    return (
      <div className={'regulator-wrap' + (this.props.in ? '-in' : '')} style={{ marginBottom: this.props.features ? 20 : 0 }}>
        <p>{this.props.title}</p>
        <Slider value={this.state.value} step={this.props.step ? this.props.step : 0.01} min={this.props.range[0]} max={this.props.range[1]} onChange={(e, value) => {
          this.props.handler(value as number);
          this.setState({ value: value as number })
        }} />
        {/* <div
          className={'regulator' + (!this.props.in ? '-in' : '')}
          ref={(el) => (this.el = el)}
        ></div> */}
      </div>
    );
  }

  constructor(s: any){
    super(s);
    this.state = {
      value: (this.props.range[0] + this.props.range[1]) / 2
    }
  }
}

export default RegulatorSlider;
