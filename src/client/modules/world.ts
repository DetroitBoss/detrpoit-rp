import {system} from "./system";
import {CustomEvent} from "./custom.event"
import { user } from './user'
import { gui } from './gui'
import { voiceKeyPressed } from './voice'
import { pressFinger } from './fingerpoint'


export const MonthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export const MonthNames2 = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']


setInterval(() => {
    if(weather.weather !== "XMAS") return
    mp.game.gameplay.setWeatherTypeNow(weather.weather);
    mp.game.gameplay.setOverrideWeather(weather.weather);
}, 1000)
CustomEvent.registerServer('weather:sync', (weatherName:string, temp:number, realYear:number, realMonth:number, realDay:number, realHour:number, realMinute:number, realSecond:number) => {
    weather.weather = weatherName;
    weather.temp = temp;
    weather.realYear = realYear;
    weather.realMonth = realMonth;
    weather.realDay = realDay;
    weather.realHour = realHour;
    weather.realMinute = realMinute;
    weather.realSecond = realSecond;

    CustomEvent.triggerCef('tablet:weathersync', weatherName, temp)

    mp.game.time.setClockDate(realDay, realMonth, realYear);

    if (!weather.ignoreServerWeather) {
        if(weatherName !== "XMAS") {
            mp.game.gameplay.setWeatherTypeNow(weatherName);
            mp.game.gameplay.setWeatherTypeNowPersist(weatherName);
        }
    }
})

export const weather = {
    getFullRpTime: () => { return `${system.digitFormat(weather.realHour)}:${system.digitFormat(weather.realMinute)}`; },
    getMonthYearDate: () => {
        const dateTime = new Date();
        return `${MonthNames[dateTime.getMonth()]} ${dateTime.getFullYear()}`;
    },
    getWeatherTemp: () => { return weather.temp },
    getRealFullDateTime: () => { return `${system.digitFormat(weather.realDay)}.${system.digitFormat(weather.realMonth+1)} ${system.digitFormat(weather.realHour)}:${system.digitFormat(weather.realMinute)}` },

    weather: "",
    temp: 0,
    realYear: 0,
    realMonth: 0,
    realDay: 0,
    realHour: 0,
    realMinute: 0,
    realSecond: 0,

    ignoreServerWeather: false,
    ignoreServerTime: false,

    smoothTimeTransition: async function (fromTimeHour: number, fromTimeMinute: number, toTimeHour: number, ignoreServerTime: boolean) {
        weather.ignoreServerTime = true;

        let currentHour = fromTimeHour;
        let currentMinute = fromTimeMinute;

        while (currentHour != toTimeHour) {
            currentMinute += 3;

            if (currentMinute >= 60) {
                currentMinute = 0;
                currentHour++;
            }

            if (currentHour > 23) {
                currentHour = 0;
            }

            mp.game.time.setClockTime(currentHour, currentMinute, 0);
            await mp.game.waitAsync(30);
        }

        weather.ignoreServerTime = ignoreServerTime;
    }
}

setInterval(() => {
    weather.realSecond++;
    if (weather.realSecond >= 60) {
        weather.realSecond = 0;
        weather.realMinute++;
        if (weather.realMinute >= 60) {
            weather.realMinute = 0;
            weather.realHour++;
            if (weather.realHour >= 24) {
                weather.realHour = 0;
            }
        }
    }

    if (!weather.ignoreServerTime) {
        if (weather.weather === 'HALLOWEEN') {
            mp.game.time.setClockTime(0, 0 ,0);
            return;
        }

        mp.game.time.setClockTime(weather.realHour, weather.realMinute, weather.realSecond);
    }
}, 1000);

CustomEvent.registerServer('forceSetTime', (hours: number) => {
    mp.game.time.setClockTime(hours, 0, 0);
    weather.ignoreServerTime = true;
})

export const ipls = {
    setIplPropState: (interiorId: number, prop: string, state = true) => {
        if (state) mp.game.interior.enableInteriorProp(interiorId, prop);
        else mp.game.interior.disableInteriorProp(interiorId, prop);
    },
    iplMichaelDefault: () => {
        let interiorId = 166657;
        let garageId = 166401;

        ipls.setIplPropState(interiorId, 'V_Michael_bed_tidy');
        ipls.setIplPropState(interiorId, 'V_Michael_bed_Messy');
        ipls.setIplPropState(interiorId, 'Michael_premier', false);
        ipls.setIplPropState(interiorId, 'V_Michael_FameShame', false);
        ipls.setIplPropState(interiorId, 'V_Michael_plane_ticket', false);
        ipls.setIplPropState(interiorId, 'V_Michael_JewelHeist', false);
        ipls.setIplPropState(interiorId, 'burgershot_yoga', false);
        mp.game.interior.refreshInterior(interiorId);

        ipls.setIplPropState(garageId, 'V_Michael_Scuba', false);
        mp.game.interior.refreshInterior(garageId);
    },

    iplSimonDefault: () => {
        let interiorId = 7170;
        mp.game.streaming.requestIpl('shr_int');
        ipls.setIplPropState(interiorId, 'csr_beforeMission');
        ipls.setIplPropState(interiorId, 'shutter_open');
        mp.game.interior.refreshInterior(interiorId);
    },

    iplFranklinAuntDefault: () => {
        let interiorId = 197889;
        ipls.setIplPropState(interiorId, '');
        ipls.setIplPropState(interiorId, 'V_57_GangBandana', false);
        ipls.setIplPropState(interiorId, 'V_57_Safari', false);
        mp.game.interior.refreshInterior(interiorId);
    },

    iplFranklinDefault: () => {
        let interiorId = 206849;
        ipls.setIplPropState(interiorId, '');
        ipls.setIplPropState(interiorId, 'unlocked');
        ipls.setIplPropState(interiorId, 'progress_flyer', false);
        ipls.setIplPropState(interiorId, 'progress_tux', false);
        ipls.setIplPropState(interiorId, 'progress_tshirt', false);
        ipls.setIplPropState(interiorId, 'bong_and_wine', true);
        mp.game.interior.refreshInterior(interiorId);
    },

    iplFloydDefault: () => {
        let interiorId = 171777;
        ipls.setIplPropState(interiorId, 'swap_clean_apt');
        ipls.setIplPropState(interiorId, 'swap_mrJam_A');
        mp.game.interior.refreshInterior(interiorId);
    },

    iplTrevorDefault: () => {
        let interiorId = 2562;
        mp.game.streaming.requestIpl('trevorstrailertidy');
        ipls.setIplPropState(interiorId, 'V_26_Trevor_Helmet3', false);
        ipls.setIplPropState(interiorId, 'V_24_Trevor_Briefcase3', false);
        ipls.setIplPropState(interiorId, 'V_26_Michael_Stay3', false);
        mp.game.interior.refreshInterior(interiorId);
    },

    iplBankGarages: () => {
        mp.game.streaming.requestIpl('imp_dt1_11_cargarage_b');
        mp.game.streaming.requestIpl('imp_dt1_11_cargarage_a');
        mp.game.streaming.requestIpl('imp_dt1_11_cargarage_c');
    },

    iplAmmoDefault: () => {
        let ammunationsId = [
            140289, //249.8, -47.1, 70.0
            153857, //844.0, -1031.5, 28.2
            168193, //-664.0, -939.2, 21.8
            164609, //-1308.7, -391.5, 36.7
            176385, //-3170.0, 1085.0, 20.8
            175617, //-1116.0, 2694.1, 18.6
            200961, //1695.2, 3756.0, 34.7
            180481, //-328.7, 6079.0, 31.5
            178689, //2569.8, 297.8, 108.7
        ];
        let gunclubsId = [
            137729, //19.1, -1110.0, 29.8
            248065, //811.0, -2152.0, 29.6
        ];

        ammunationsId.forEach((interiorId) => {
            ipls.setIplPropState(interiorId, 'GunStoreHooks');
            ipls.setIplPropState(interiorId, 'GunClubWallHooks');
            mp.game.interior.refreshInterior(interiorId);
        });

        gunclubsId.forEach((interiorId) => {
            ipls.setIplPropState(interiorId, 'GunStoreHooks');
            ipls.setIplPropState(interiorId, 'GunClubWallHooks');
            mp.game.interior.refreshInterior(interiorId);
        });
    },

    iplLesterFactoryDefault: () => {
        let interiorId = 92674;
        ipls.setIplPropState(interiorId, 'V_53_Agency_Blueprint', false);
        ipls.setIplPropState(interiorId, 'V_35_KitBag', false);
        ipls.setIplPropState(interiorId, 'V_35_Fireman', false);
        ipls.setIplPropState(interiorId, 'V_35_Body_Armour', false);
        ipls.setIplPropState(interiorId, 'Jewel_Gasmasks', false);
        ipls.setIplPropState(interiorId, 'v_53_agency_overalls', false);
        mp.game.interior.refreshInterior(interiorId);
    },

    iplStripClubDefault: () => {
        let interiorId = 197121;
        ipls.setIplPropState(interiorId, 'V_19_Trevor_Mess', false);
        mp.game.interior.refreshInterior(interiorId);
    },
}


//mp.game.streaming.requestIpl("RC12B_HospitalInterior");

//Michael: -802.311, 175.056, 72.8446
ipls.iplMichaelDefault();
//Simeon: -47.16170 -1115.3327 26.5
ipls.iplSimonDefault();
//Franklin's aunt: -9.96562, -1438.54, 31.1015
ipls.iplFranklinAuntDefault();
//Franklin
ipls.iplFranklinDefault();
//Floyd: -1150.703, -1520.713, 10.633
ipls.iplFloydDefault();
//Trevor: 1985.48132, 3828.76757, 32.5
ipls.iplTrevorDefault();
ipls.iplAmmoDefault();
ipls.iplLesterFactoryDefault();
ipls.iplStripClubDefault();
ipls.iplBankGarages()

//CASINO
mp.game.streaming.requestIpl('vw_casino_main');

let cIntID = mp.game.interior.getInteriorAtCoords(1100.0, 220.0, -50.0);
mp.game.interior.enableInteriorProp(cIntID, 'casino_manager_default');
mp.game.invoke(system.natives.SET_INTERIOR_PROP_COLOR, cIntID, 'casino_manager_default', 1);
mp.game.interior.refreshInterior(cIntID);

mp.game.streaming.requestIpl('hei_dlc_windows_casino');
mp.game.streaming.requestIpl('hei_dlc_casino_aircon');
mp.game.streaming.requestIpl('vw_dlc_casino_door');
mp.game.streaming.requestIpl('hei_dlc_casino_door');
mp.game.streaming.requestIpl('hei_dlc_windows_casino﻿');
mp.game.streaming.requestIpl('vw_casino_penthouse');
mp.game.streaming.requestIpl('vw_casino_garage');

let phIntID = mp.game.interior.getInteriorAtCoords(976.636, 70.295, 115.164);
let phPropList = [
    'Set_Pent_Tint_Shell',
    'Set_Pent_Pattern_01',
    'Set_Pent_Spa_Bar_Open',
    'Set_Pent_Media_Bar_Open',
    'Set_Pent_Dealer',
    'Set_Pent_Arcade_Retro',
    'Set_Pent_Bar_Clutter',
    'Set_Pent_Clutter_01',
    'set_pent_bar_light_01',
    'set_pent_bar_party_0',
];

for (const propName of phPropList) {
    mp.game.interior.enableInteriorProp(phIntID, propName);
    mp.game.invoke(system.natives.SET_INTERIOR_PROP_COLOR, phIntID, propName, 1);
}

mp.game.interior.refreshInterior(phIntID);

//---

mp.game.streaming.requestIpl('imp_dt1_02_modgarage');

//Heist Jewel: -637.20159 -239.16250 38.1
mp.game.streaming.requestIpl('post_hiest_unload');

//Max Renda: -585.8247, -282.72, 35.45475  Работу можно намутить
mp.game.streaming.requestIpl('refit_unload');

//Heist Union Depository: 2.69689322, -667.0166, 16.1306286
mp.game.streaming.requestIpl('FINBANK');

//Morgue: 239.75195, -1360.64965, 39.53437
mp.game.streaming.requestIpl('Coroner_Int_on');

//1861.28, 2402.11, 58.53
mp.game.streaming.requestIpl('ch3_rd2_bishopschickengraffiti');
//2697.32, 3162.18, 58.1
mp.game.streaming.requestIpl('cs5_04_mazebillboardgraffiti');
//2119.12, 3058.21, 53.25
mp.game.streaming.requestIpl('cs5_roads_ronoilgraffiti');

//Cluckin Bell: -146.3837, 6161.5, 30.2062
mp.game.streaming.requestIpl('CS1_02_cf_onmission1');
mp.game.streaming.requestIpl('CS1_02_cf_onmission2');
mp.game.streaming.requestIpl('CS1_02_cf_onmission3');
mp.game.streaming.requestIpl('CS1_02_cf_onmission4');

//Grapeseed's farm: 2447.9, 4973.4, 47.7
mp.game.streaming.requestIpl('farm');
mp.game.streaming.requestIpl('farmint');
mp.game.streaming.requestIpl('farm_lod');
mp.game.streaming.requestIpl('farm_props');
mp.game.streaming.requestIpl('des_farmhouse');

//FIB lobby: 105.4557, -745.4835, 44.7548
mp.game.streaming.requestIpl('FIBlobby');
mp.game.streaming.requestIpl('dt1_05_fib2_normal');

mp.game.streaming.removeIpl('hei_bi_hw1_13_door');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_v_comedy_milo_');
mp.game.streaming.requestIpl('apa_ss1_11_interior_v_rockclub_milo_');
mp.game.streaming.requestIpl('ferris_finale_Anim');
mp.game.streaming.requestIpl('gr_case6_bunkerclosed');

//Billboard: iFruit
mp.game.streaming.requestIpl('FruitBB');
mp.game.streaming.requestIpl('sc1_01_newbill');
mp.game.streaming.requestIpl('hw1_02_newbill');
mp.game.streaming.requestIpl('hw1_emissive_newbill');
mp.game.streaming.requestIpl('sc1_14_newbill');
mp.game.streaming.requestIpl('dt1_17_newbill');

//Lester's factory: 716.84, -962.05, 31.59
mp.game.streaming.requestIpl('id2_14_during_door');
mp.game.streaming.requestIpl('id2_14_during1');

//Life Invader lobby: -1047.9, -233.0, 39.0
mp.game.streaming.requestIpl('facelobby');

//Авианосец
mp.game.streaming.requestIpl('hei_carrier');
mp.game.streaming.requestIpl('hei_carrier_distantlights');
mp.game.streaming.requestIpl('hei_carrier_int1');
mp.game.streaming.requestIpl('hei_carrier_int1_lod');
mp.game.streaming.requestIpl('hei_carrier_int2');
mp.game.streaming.requestIpl('hei_carrier_int2_lod');
mp.game.streaming.requestIpl('hei_carrier_int3');
mp.game.streaming.requestIpl('hei_carrier_int3_lod');
mp.game.streaming.requestIpl('hei_carrier_int4');
mp.game.streaming.requestIpl('hei_carrier_int4_lod');
mp.game.streaming.requestIpl('hei_carrier_int5');
mp.game.streaming.requestIpl('hei_carrier_int5_lod');
mp.game.streaming.requestIpl('hei_carrier_int6');
mp.game.streaming.requestIpl('hei_carrier_lod');
mp.game.streaming.requestIpl('hei_carrier_lodlights');
mp.game.streaming.requestIpl('hei_carrier_slod');

//Яхта
mp.game.streaming.requestIpl('hei_yacht_heist');
mp.game.streaming.requestIpl('hei_yacht_heist_enginrm');
mp.game.streaming.requestIpl('hei_yacht_heist_Lounge');
mp.game.streaming.requestIpl('hei_yacht_heist_Bridge');
mp.game.streaming.requestIpl('hei_yacht_heist_Bar');
mp.game.streaming.requestIpl('hei_yacht_heist_Bedrm');
mp.game.streaming.requestIpl('hei_yacht_heist_DistantLights');
mp.game.streaming.requestIpl('hei_yacht_heist_LODLights');

//Яхта2
mp.game.streaming.requestIpl('gr_heist_yacht2');
mp.game.streaming.requestIpl('gr_heist_yacht2_bar');
mp.game.streaming.requestIpl('gr_heist_yacht2_bedrm');
mp.game.streaming.requestIpl('gr_heist_yacht2_bridge');
mp.game.streaming.requestIpl('gr_heist_yacht2_enginrm');
mp.game.streaming.requestIpl('gr_heist_yacht2_lounge');
mp.game.streaming.requestIpl('gr_grdlc_interior_placement_interior_0_grdlc_int_01_milo_');

//Tunnels
mp.game.streaming.requestIpl('v_tunnel_hole');

//Carwash: 55.7, -1391.3, 30.5
mp.game.streaming.requestIpl('Carwash_with_spinners');

//Stadium "Fame or Shame": -248.49159240722656, -2010.509033203125, 34.57429885864258
mp.game.streaming.requestIpl('sp1_10_real_interior');
mp.game.streaming.requestIpl('sp1_10_real_interior_lod');

//House in Banham Canyon: -3086.428, 339.2523, 6.3717
mp.game.streaming.requestIpl('ch1_02_open');

//Garage in La Mesa (autoshop): 970.27453, -1826.56982, 31.11477
mp.game.streaming.requestIpl('bkr_bi_id1_23_door');

//Hill Valley church - Grave: -282.46380000, 2835.84500000, 55.91446000
mp.game.streaming.requestIpl('lr_cs6_08_grave_closed');

//Lost's trailer park: 49.49379000, 3744.47200000, 46.38629000
mp.game.streaming.requestIpl('methtrailer_grp1');

//Lost safehouse: 984.1552, -95.3662, 74.50
mp.game.streaming.requestIpl('bkr_bi_hw1_13_int');

//Raton Canyon river: -1652.83, 4445.28, 2.52
mp.game.streaming.requestIpl('CanyonRvrShallow');

//Zancudo Gates (GTAO like): -1600.30100000, 2806.73100000, 18.79683000
//mp.game.streaming.requestIpl('CS3_07_MPGates');

//Pillbox hospital:
mp.game.streaming.requestIpl('rc12b_default');

//mp.game.streaming.removeIpl("rc12b_default");
//mp.game.streaming.requestIpl("rc12b_hospitalinterior");

//Josh's house: -1117.1632080078, 303.090698, 66.52217
mp.game.streaming.requestIpl('bh1_47_joshhse_unburnt');
mp.game.streaming.requestIpl('bh1_47_joshhse_unburnt_lod');

mp.game.streaming.removeIpl('sunkcargoship');
mp.game.streaming.requestIpl('cargoship');

mp.game.streaming.requestIpl('ex_sm_13_office_02b'); //АШ

//mp.game.streaming.requestIpl("ex_dt1_02_office_02a"); // Бизнес Центр - old ex_dt1_02_office_03a

mp.game.streaming.requestIpl('ex_dt1_02_office_02b');

mp.game.streaming.requestIpl('ex_sm_15_office_01a'); // Meria - old ex_dt1_02_office_03a

mp.game.streaming.requestIpl('ex_dt1_11_office_01b'); //Maze Bank Office

//Bahama Mamas: -1388.0013, -618.41967, 30.819599
mp.game.streaming.requestIpl('hei_sm_16_interior_v_bahama_milo_');

mp.game.streaming.requestIpl('apa_v_mp_h_01_a');
mp.game.streaming.requestIpl('apa_v_mp_h_02_b');
mp.game.streaming.requestIpl('apa_v_mp_h_08_c');

mp.game.streaming.requestIpl('hei_hw1_blimp_interior_v_studio_lo_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_v_apart_midspaz_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_32_dlc_apart_high2_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_10_dlc_apart_high_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_28_dlc_apart_high2_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_27_dlc_apart_high_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_29_dlc_apart_high2_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_30_dlc_apart_high2_new_milo_');
mp.game.streaming.requestIpl('hei_hw1_blimp_interior_31_dlc_apart_high2_new_milo_');
mp.game.streaming.requestIpl('apa_ch2_05e_interior_0_v_mp_stilts_b_milo_');
mp.game.streaming.requestIpl('apa_ch2_04_interior_0_v_mp_stilts_b_milo_');
mp.game.streaming.requestIpl('apa_ch2_04_interior_1_v_mp_stilts_a_milo_');
mp.game.streaming.requestIpl('apa_ch2_09c_interior_2_v_mp_stilts_b_milo_');
mp.game.streaming.requestIpl('apa_ch2_09b_interior_1_v_mp_stilts_b_milo_');
mp.game.streaming.requestIpl('apa_ch2_09b_interior_0_v_mp_stilts_a_milo_');
mp.game.streaming.requestIpl('apa_ch2_05c_interior_1_v_mp_stilts_a_milo_');
mp.game.streaming.requestIpl('apa_ch2_12b_interior_0_v_mp_stilts_a_milo_');

//Galaxy
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_clubname_01');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_Style02');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_style02_podium');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_equipment_setup');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_equipment_upgrade');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_security_upgrade');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_dj01');
mp.game.interior.enableInteriorProp(271617, 'DJ_03_Lights_02');
mp.game.interior.enableInteriorProp(271617, 'DJ_04_Lights_01');
mp.game.interior.enableInteriorProp(271617, 'DJ_03_Lights_03');
mp.game.interior.enableInteriorProp(271617, 'DJ_04_Lights_04');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_bar_content');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_booze_01');
mp.game.interior.enableInteriorProp(271617, 'Int01_ba_dry_ice');
mp.game.interior.refreshInterior(271617);