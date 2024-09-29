export const PERSONAGE_POS_HEADING = 303;
export const PERSONAGE_POS = new mp.Vector3(-156.40, -597.06, 167.00);
export const PERSONAGE_CAMERA_POS = new mp.Vector3(-154.64, -595.80, 167.62);
export const PERSONAGE_CAMERA_POS_POINT = new mp.Vector3(-156.40, -597.06, 167.62);


export interface CharacterCreatorDress {
    name: string;
    data: { component: number, drawable: number, texture: number, name?: string }[];
    category: number;
    id: number;
}
export interface DressCefItem {
    name: string;
    data: { component: number, drawable: number, texture: number, name?: string }[][];
    category: number;
    id: number;
    male: number;
    forCreate: number;
}


export const defaultCharacterData = {
    SEX: 0,
    SHAPE_THRID_ID: 0,
    SKIN_THRID_ID: 0,
    SHAPE_SECOND_ID: 0,
    SKIN_SECOND_ID: 0,
    SHAPE_MIX: 0,
    SKIN_MIX: 0,
    HAIR: 0,
    HAIR_COLOR: 1,
    HAIR_COLOR2: 1,
    EYE_COLOR: 0,
    EYEBROWS_OPACITY: 1.0,
    EYEBROWS: 0,
    EYEBROWS_COLOR: 1,
    OVERLAY: 0,
    OVERLAY_COLOR: 1,
    OVERLAY_OPACITY: 1.0,
    OVERLAY9: 0,
    OVERLAY9_COLOR: 1,
    OVERLAY9_OPACITY: 1.0,
    OVERLAY8: -1,
    OVERLAY8_COLOR: 1,
    OVERLAY5: -1,
    OVERLAY5_COLOR: 1,
    OVERLAY4: -1,
    OVERLAY4_COLOR: 1,
    OVERLAY4_OPACITY: 1,
    OVERLAY10: -1,
    OVERLAY10_COLOR: 1,

    LIPS: 0,
    LIPS_OPACITY: 0,
    LIPS_COLOR: 0,

    BLUSH: 0,
    BLUSH_OPACITY: 0.0,
    BLUSH_COLOR: 0,

    NAILS: -1,


    FACE_SPECIFICATIONS:
        <[number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]>[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
}

export type CharacterSkinData = typeof defaultCharacterData