import {LocationCategoryEnum} from "../../../../../shared/phone/locationCategories.enum";

export interface Point {
  id?: number;
  name: string;
  distance: number;
  icon: any;
  category?: LocationCategoryEnum;
}
