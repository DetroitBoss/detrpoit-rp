export interface IFurnitureDTO {
    id: number
    cfgId: number
    placed: boolean
}


export interface IHomeMenuDTO {
    furniture: IFurnitureDTO[]
}

export interface IMyInteriorData {
    name: string
    cost: number
    isDonate: boolean
    image: string
    layoutName: string
    layoutImage: string
}