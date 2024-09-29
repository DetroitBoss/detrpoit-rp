export interface AutosalonCarItem {
    name: string;
    fuel_type: 0 | 1 | 2 | 3 | 4 | 5;
    fuel_max: number;
    fuel_min: number;
    model: string;
    item: any;
    price: number;
    count: number;
    stock: number;
}