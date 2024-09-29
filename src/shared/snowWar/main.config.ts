import {colshapeHandleOptions} from "../checkpoints";
import {Vector3WithHeading} from "../system";

export const SNOW_WAR_IS_ACTIVE: boolean = false;
export const SNOW_WAR_MAX_PLAYERS: number = 50;
export const SNOW_WAR_MIN_PLAYERS: number = 4; // 4

export const SNOW_WAR_REGISTRATION_POSITION: Vector3Mp = new mp.Vector3(-245.59, -2003.67, 29.15);
export const SNOW_WAR_REGISTRATION_NAME: string = 'Битва снежками';
export const SNOW_WAR_REGISTRATION_OPTIONS: colshapeHandleOptions = {

}

export const SNOW_WAR_REGISTRATION_TIME = 600; // 600
export const SNOW_WAR_BATTLE_TIME = 600;

export enum SnowWarSteps {
    REGISTRATION,
    BATTLE
}

export enum SnowWarCommands {
    RED,
    GREEN
}

export const SNOW_WAR_FIRST_ZONE_POINT: Vector3Mp = new mp.Vector3(1156.50,3571.01,34.24);
export const SNOW_WAR_SECOND_ZONE_POINT: Vector3Mp = new mp.Vector3(1249.83,3626.13,33.34);

export const SNOW_WAR_DIMENSION: number = 1500;

export const SNOW_WAR_RED_COMMAND_SPAWN: Vector3WithHeading = [new mp.Vector3(1173.10,3591.88,33.66), 277];
export const SNOW_WAR_GREEN_COMMAND_SPAWN: Vector3WithHeading = [new mp.Vector3(1237.91,3595.27,33.94), 94];

export const SNOW_WAR_FINISH_SPAWN: Vector3WithHeading = [new mp.Vector3(-229.77, -1997.54, 29.95), 40];

export const SNOW_WAR_WEAPON_HASH: number = 126349499;

export const SNOW_WAR_DRESS_CONFIG_MALE_GREEN: [number, number, number][] = [
    [4, 58, 4],
    [6, 6, 0],
    [11, 245, 6],
    [1, 31, 0],
    [8, 15, 0],
];

export const SNOW_WAR_DRESS_CONFIG_FEMALE_GREEN: [number, number, number][] = [
    [8, 2, 0],
    [11, 253, 6],
    [1, 31, 0],
    [4, 60, 4],
    [6, 17, 0]
];

export const SNOW_WAR_DRESS_CONFIG_MALE_RED: [number, number, number][] = [
    [8, 15, 0],
    [11, 245, 9],
    [1, 77, 0],
    [4, 58, 6],
    [6, 6, 0]
];

export const SNOW_WAR_DRESS_CONFIG_FEMALE_RED: [number, number, number][] = [
    [8, 2, 0],
    [11, 253, 9],
    [1, 77, 0],
    [6, 46, 3],
    [4, 60, 6],
];