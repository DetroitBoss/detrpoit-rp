import React, {Component} from 'react';
import './style.less';
import Wrap from './Wrap';
import Sex from './Sex';
import Dropdown from './Dropdown';
import RgSlider from './RegulatorSlider';
import RgButton from './RegulatorButton';
import RgGroup from './RegulatorGroup';
import {CirclePicker} from 'react-color';
import arrowRight from './images/svg/arrow-right-white.svg';
import parents from "./images/parents/*.png";
import personage from './config';

const {
  face,
  fathers,
  mothers,
  features,
  hair,
  hairColor,
  hairColor2,
  eyebrows,
  eyebrowsColor,
  eyeColor,
  freckles,
  frecklesColor,
  beard,
  beardColor,
  pomade,
  pomadeColor,
  blush,
  blushColor,
  makeup,
  makeupColor,
} = personage;

interface PersonageState {
  random: boolean;
  section: number;
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
  eyebrowsColor: number,
  eyeColor: number,
  freckles: number,
  frecklesColor: number,
  beard: number,
  beardColor: number,
  pomade: number,
  pomadeColor: number,
  blush: number,
  blushColor: number,
  makeup: number,
  makeupColor: number;
  focus: number;
  cam: string | null;
}

export class Personage extends Component<any, PersonageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      random: false,
      section: 0,
      item: 0,
      floor: 0,
      face: [0, 0],
      skin: 0.5,
      heredity: 0.5,
      features: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      hair: 0,
      hairColor: 0,
      hairColor2: 0,
      eyebrows: 0,
      eyebrowsColor: 0,
      eyeColor: 0,
      freckles: 0,
      frecklesColor: 0,
      beard: 0,
      beardColor: 0,
      pomade: 0,
      pomadeColor: 0,
      blush: 0,
      blushColor: 0,
      makeup: 0,
      makeupColor: 0,
      focus: 0,
      cam: null,
    };
  }

  drawColorPicker(title: string, param: string) {
    let colors = ["rgb(32, 31, 28)", "rgb(50, 42, 37)", "rgb(79, 58, 47)", "rgb(96, 52, 33)", "rgb(130, 63, 35)", "rgb(137, 59, 30)", "rgb(157, 82, 47)", "rgb(167, 103, 65)", "rgb(170, 113, 74)", "rgb(177, 126, 85)", "rgb(187, 139, 92)", "rgb(200, 160, 105)", "rgb(208, 171, 116)", "rgb(203, 155, 88)", "rgb(228, 186, 116)", "rgb(233, 195, 132)", "rgb(196, 146, 94)", "rgb(169, 93, 61)", "rgb(152, 56, 38)", "rgb(122, 18, 16)", "rgb(147, 21, 17)", "rgb(171, 29, 21)", "rgb(199, 51, 28)", "rgb(213, 65, 29)", "rgb(193, 87, 51)", "rgb(219, 88, 38)", "rgb(155, 129, 111)", "rgb(181, 155, 134)", "rgb(214, 191, 171)", "rgb(233, 212, 194)", "rgb(103, 69, 85)", "rgb(145, 90, 115)", "rgb(156, 62, 92)", "rgb(249, 71, 207)", "rgb(253, 71, 146)", "rgb(252, 167, 179)", "rgb(19, 165, 150)", "rgb(9, 131, 144)", "rgb(9, 75, 117)", "rgb(105, 174, 98)", "rgb(48, 140, 93)", "rgb(27, 93, 80)", "rgb(167, 180, 42)", "rgb(158, 188, 20)", "rgb(100, 175, 34)", "rgb(238, 196, 90)", "rgb(246, 199, 13)", "rgb(244, 162, 14)", "rgb(252, 141, 22)", "rgb(254, 131, 32)", "rgb(254, 116, 32)", "rgb(248, 89, 34)", "rgb(243, 49, 15)", "rgb(210, 12, 15)", "rgb(129, 10, 14)", "rgb(42, 27, 21)", "rgb(63, 36, 29)", "rgb(85, 46, 31)", "rgb(64, 34, 25)", "rgb(68, 36, 26)", "rgb(50, 33, 26)", "rgb(8, 10, 14)", "rgb(196, 162, 118)", "rgb(226, 189, 144)"]
    return <>
      <div className="regulator-wrap-in"><p>{title}</p></div>
      <div style={{ marginBottom: '30px' }}>
        <CirclePicker width="auto" color={"rgb(9, 131, 144)"} colors={colors} circleSpacing={2} circleSize={25} onChangeComplete={(e) => {
          console.log(e)
          let index = colors.indexOf(`rgb(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b})`)
          // 
          this.setAppearance(param, index)
        }} />
      </div>
    </>
  }

  componentDidMount() {
    this.random();
  }

  setItem(item: number) {
    this.setState({ item });
  }

  setFloor(floor: number) {
    mp.trigger('client:user:personage:eventManager', 'floor', floor);
    this.setState({
      floor,
      hair: 0,
      hairColor: 0,
      eyebrows: 0,
      eyebrowsColor: 0,
      eyeColor: 0,
      freckles: 0,
      frecklesColor: 0,
      beard: 0,
      beardColor: 0,
      pomade: 0,
      pomadeColor: 0,
      blush: 0,
      blushColor: 0,
      makeup: 0,
      makeupColor: 0,
    });
  }

  setParent(id: number) {
    this.setState((state) => {
      state.face[state.item] = id;
      mp.trigger(
        'client:user:personage:eventManager',
        state.item ? 'mother' : 'father',
        face[state.item][id]
      );
      return {
        ...state,
      };
    });
  }

  setHeredity(heredity: number) {
    this.setState(() => {
      mp.trigger('client:user:personage:eventManager', 'heredity', heredity);
      return {
        heredity,
      };
    });
  }

  setSkin(skin: number) {
    this.setState(() => {
      mp.trigger('client:user:personage:eventManager', 'skin', skin);
      return {
        skin,
      };
    });
  }

  setAppearance(type: string, value: number) {
    mp.trigger('client:user:personage:eventManager', type, value);
  }

  setFeatures(value: number) {
    this.setState((state) => {
      state.features[state.item] = value;
      mp.trigger('client:user:personage:eventManager', 'features', JSON.stringify(state.features));
      return {
        ...state
      };
    });
  }

  confirm(e: React.SyntheticEvent<any>) {
    e.preventDefault();
    mp.trigger('client:user:personage:eventManager', 'save');
  }

  random(e?: React.SyntheticEvent<any>) {
    if (e) e.preventDefault();
    this.setState({ random: true }, () => {
      this.setState({ random: false });
    });
  }

  setCam(type: string, value: number) {
    mp.trigger('client:user:personage:eventManager', type, value);
  }

  render() {
    return (
      <div className="personage-create-block">
        <div className="personage-shadow-overlay-create"></div>
        <p className="title-create"><span className="glyphicons glyphicons-parents"></span><br />Создание персонажа</p>
        <button className="primary-button create-this" onClick={this.confirm.bind(this)}>
          <span>
            Создать <img src={arrowRight} alt="" />
          </span>
        </button>
        <Wrap>
          <button className="random-buttom personage" onClick={this.random.bind(this)}>
            Случайно
          </button>
          <Sex setFloor={this.setFloor.bind(this)} />
          <Dropdown title="Наследственность">
            <RgButton
              title="Отец"
              count={face[0].length}
              names={fathers}
              random={this.state.random}
              handler={(key) => {
                this.setItem(0);
                this.setParent(key);
              }}
            />
            <RgButton
              title="Мать"
              count={face[1].length}
              names={mothers}
              random={this.state.random}
              handler={(key) => {
                this.setItem(1);
                this.setParent(key);
              }}
            />
            <div className="parent-preview">
              <img src={parents[`female_${this.state.face[1]}` as any]} alt="" />
              <img src={parents[`male_${this.state.face[0]}` as any]} alt="" />
            </div>
            <div className="skin-data">
              <RgSlider
                title="Цвет кожи"
                range={[0.0, 1.0]}
                random={this.state.random}
                handler={this.setSkin.bind(this)}
                features
                in
              />
              <RgSlider
                title="Сходство"
                range={[0.0, 1.0]}
                random={this.state.random}
                handler={this.setHeredity.bind(this)}
                features
                in
              />
            </div>
          </Dropdown>
          <Dropdown title="Внешность">
            <RgGroup>
              <RgButton
                title="Прическа"
                count={hair[this.state.floor].length}
                random={this.state.random}
                handler={(value) => this.setAppearance('hair', hair[this.state.floor][value])}
                in
                large
              />
              {/* <RgButton
                title="Цвет волос"
                count={hairColor}
                random={this.state.random}
                handler={(value) => this.setAppearance('hairColor', value)}
                in
              /> */}
              {this.drawColorPicker('Цвет', "hairColor")}
              {/* <RgButton
                title="Мелирование"
                count={hairColor2}
                random={this.state.random}
                handler={(value) => this.setAppearance('hairColor2', value)}
                in
              /> */}
              {this.drawColorPicker('Мелирование', "hairColor2")}
            </RgGroup>
            <RgGroup>
              <RgButton
                title="Брови"
                count={eyebrows}
                random={this.state.random}
                handler={(value) => this.setAppearance('eyebrows', value - 1)}
                in
                large
              />
              {/* <RgButton
                title="Цвет бровей"
                count={eyebrowsColor}
                random={this.state.random}
                handler={(value) => this.setAppearance('eyebrowsColor', value)}
                in
              /> */}
              {this.drawColorPicker('Цвет бровей', "eyebrowsColor")}
              <RgSlider
                title="Интенсивность бровей"
                range={[0.0, 0.9]}
                random={this.state.random}
                handler={(value) => {
                  this.setAppearance('eyebrowsOpacity', value)
                }}
                features
                in
              />
            </RgGroup>

            <RgGroup>
              <RgButton
                title="Глаза"
                count={eyeColor}
                random={this.state.random}
                handler={(value) => this.setAppearance('eyeColor', value)}
                in
              />
              <RgButton
                title="Веснушки"
                count={freckles}
                random={this.state.random}
                handler={(value) => this.setAppearance('freckles', value)}
                in
              />
              <RgSlider
                title="Интенсивность веснушек"
                range={[0.0, 0.9]}
                random={this.state.random}
                handler={(value) => {
                  this.setAppearance('frecklesOpacity', value)
                }}
                features
                in
              />
            </RgGroup>
            {!this.state.floor ? <RgGroup>
              <RgButton
                title="Борода"
                count={beard}
                random={this.state.random}
                handler={(value) => this.setAppearance('beard', value)}
                in
                large
              />
              {/* <RgButton
                title="Цвет бороды"
                count={beardColor}
                random={this.state.random}
                handler={(value) => this.setAppearance('beardColor', value)}
                in
              /> */}
              {this.drawColorPicker("Цвет бороды", "beardColor")}
              <RgSlider
                title="Интенсивность бороды"
                range={[0.0, 0.9]}
                random={this.state.random}
                handler={(value) => {
                  this.setAppearance('beardOpacity', value)
                }}
                features
                in
              />
            </RgGroup> : ''}
          </Dropdown>
          <Dropdown title="Характеристики">
            <RgGroup>
              {features.map((i, id) => (
                <RgSlider
                  key={id}
                  title={i}
                  range={[-0.5, 0.5]}
                  random={this.state.random}
                  handler={(value) => {
                    this.setItem(id), this.setFeatures(value);
                  }}
                  features
                  in
                />
              ))}
            </RgGroup>
          </Dropdown>
        </Wrap>
      </div>
    );
  }
}
