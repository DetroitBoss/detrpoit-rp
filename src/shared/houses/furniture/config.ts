export interface IFurnitureSave {
    id: number
    cfgId: number
    pos?: Vector3Mp
    rot?: Vector3Mp
}

export interface IFurnitureState {
    id: number
    object: ObjectMp
}

export interface ILoadInterior {
    interiorId: number
    position: Vector3Mp
    prop: string
}

export const INTERIORS_FOR_FURNITURE: number[] = [24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44]

export const LOAD_INTERIORS: ILoadInterior[] = [
    {
        interiorId: 24,
        position: new mp.Vector3(37, -1915, -0),
        prop: 'appartv1'
    },
    {
        interiorId: 25,
        position: new mp.Vector3(37, -1915, -0),
        prop: 'appartv2'
    },
    {
        interiorId: 26,
        position: new mp.Vector3(37, -1915, -0),
        prop: 'appartv3'
    },
    {
        interiorId: 27,
        position: new mp.Vector3(-141.72, -1040.4, -8.51915),
        prop: 'appartmedv1'
    },
    {
        interiorId: 28,
        position: new mp.Vector3(-141.72, -1040.4, -8.51915),
        prop: 'appartmedv2'
    },
    {
        interiorId: 29,
        position: new mp.Vector3(-141.72, -1040.4, -8.51915),
        prop: 'appartmedv3'
    },
    {
        interiorId: 30,
        position: new mp.Vector3(-827.6473, -723.2551, 103.7422),
        prop: 'apparthighv1'
    },
    {
        interiorId: 31,
        position: new mp.Vector3(-827.6473, -723.2551, 103.7422),
        prop: 'apparthighv2'
    },
    {
        interiorId: 32,
        position: new mp.Vector3(-827.6473, -723.2551, 103.7422),
        prop: 'apparthighv3'
    },
    {
        interiorId: 33,
        position: new mp.Vector3(-827.6473, -722.9208, 90.67331),
        prop: 'custappart2v1'
    },
    {
        interiorId: 34,
        position: new mp.Vector3(-827.6473, -722.9208, 90.67331),
        prop: 'custappart2v2'
    },
    {
        interiorId: 35,
        position: new mp.Vector3(-827.6473, -722.9208, 90.67331),
        prop: 'custappart2v3'
    },
    {
        interiorId: 36,
        position: new mp.Vector3(-822.8305, -721.5496, 83.67345),
        prop: 'custappart1v1'
    },
    {
        interiorId: 37,
        position: new mp.Vector3(-822.8305, -721.5496, 83.67345),
        prop: 'custappart1v2'
    },
    {
        interiorId: 38,
        position: new mp.Vector3(-822.8305, -721.5496, 83.67345),
        prop: 'custappart1v3'
    },
    {
        interiorId: 39,
        position: new mp.Vector3(-27.34650000, -589.85050000, 51.22781000),
        prop: 'inthighvar1'
    },
    {
        interiorId: 40,
        position: new mp.Vector3(-27.34650000, -589.85050000, 51.22781000),
        prop: 'inthighvar2'
    },
    {
        interiorId: 41,
        position: new mp.Vector3(-27.34650000, -589.85050000, 51.22781000),
        prop: 'inthighvar3'
    },
    {
        interiorId: 42,
        position: new mp.Vector3(-691.3727, 325.8996, 129.6608),
        prop: 'appartmedictowerv1'
    },
    {
        interiorId: 43,
        position: new mp.Vector3(-691.3727, 325.8996, 129.6608),
        prop: 'appartmedictowerv2'
    },
    {
        interiorId: 44,
        position: new mp.Vector3(-691.3727, 325.8996, 129.6608),
        prop: 'appartmedictowerv3'
    },

]
