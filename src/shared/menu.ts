export interface MenuItemFromClientToServer extends MenuItemBase {}

export type menuSprite = "admin" | "arcadius" | "blane" | "diamond" | "digital" | "director_editor_title" | "duels" | "fleeca" | "gr6" | "house" | "interaction_bgd" | "itali" | "japan" | "lifeinvader" | "m3" | "maze" | "maze_bank" | "mexican" | "pacific" | "profile" | "racelobby" | "rent" | "russian" | "safe" | "shooting" | "shopui_title_arenawar" | "shopui_title_barber" | "shopui_title_barber2" | "shopui_title_barber3" | "shopui_title_barber4" | "shopui_title_carmod" | "shopui_title_carmod2" | "shopui_title_casino" | "shopui_title_clubhousemod" | "shopui_title_conveniencestore" | "shopui_title_darts" | "shopui_title_exec_vechupgrade" | "shopui_title_gasstation" | "shopui_title_golfshop" | "shopui_title_graphics_franklin" | "shopui_title_graphics_michael" | "shopui_title_graphics_trevor" | "shopui_title_gr_gunmod" | "shopui_title_gunclub" | "shopui_title_heist" | "shopui_title_highendfashion" | "shopui_title_highendsalon" | "shopui_title_ie_modgarage" | "shopui_title_liquorstore" | "shopui_title_liquorstore2" | "shopui_title_liquorstore3" | "shopui_title_lowendfashion" | "shopui_title_lowendfashion2" | "shopui_title_midfashion" | "shopui_title_movie_masks" | "shopui_title_sm_hangar" | "shopui_title_supermod" | "shopui_title_tattoos" | "shopui_title_tattoos2" | "shopui_title_tattoos3" | "shopui_title_tattoos4" | "shopui_title_tattoos5" | "shopui_title_tennis" | "shopui_title_tennisstore" | "sprite1" | "suemurry_background_left" | "farm";

export interface MenuItemBaseCEF extends MenuItemBase {}

export interface MenuItemBase {
  /** Название пункта */
  name: string;
  /** Доп часть строки */
  more?: string | number;
  /** Описание */
  desc?: string;
  /** Тип блока
   * - select - Обычный пункт
   * - list - С списком для листинга влево/вправо, требуется доп.параметр list в объекте пункта
   */
  type?: "select" | "list" | "range" | "color";
  /** Список пунктов для type = list */
  rangeselect?: [number, number];
  list?: string[];
  /** Что на данный момент выбранно при type = list */
  listSelected?: number;
  /** Иконка слева */
  icon?: string
  color?: { r: number, g: number, b: number;};
}


export interface MenuInterface {
  id?: number;
  open?: boolean;
  select?: number;
  title: string;
  title_image?: string;
  subtitle?: string;
  items: MenuItemBaseCEF[];
  sprite?: menuSprite;
  hidden?: boolean;
  cursor?:boolean;
  menuX?:number;
  menuY?:number;
  countItems?:number;
  widthMultipler:number;
  fromserver:boolean;
  controlsBlocked?: boolean
}

export interface MenuItem extends MenuItemBase {
  /** Колбек, который вызывается при нажатии на пункт
   * - item - объект пункта меню
   * - index - номер пункта
   */
  onpress?: (item: MenuItem, index: number) => any;
  /** Колбек, который вызывается при нажатии на пункт
   * - index - номер выбранного пункта из массива
   * - item - объект пункта меню
   * - index - номер
   */
  onchange?: (value: number, item: MenuItem, index: number) => any;
  onchangeColor?: (value: { r: number, g: number, b: number; }, item: MenuItem, index: number) => any;
  /** Что на данный момент выбранно при type = list (Название) */
  listSelectedName?: string;
}