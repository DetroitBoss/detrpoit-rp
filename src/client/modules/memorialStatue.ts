import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {ScaleformTextMp} from "./scaleform.mp";
import {defaultCharacterData} from "../../shared/character";

let ped: PedMp = null
let scaleForm: ScaleformTextMp = null
// @ts-ignore
global.form = scaleForm

const createScaleForm = () => {
    scaleForm = new ScaleformTextMp(
        new mp.Vector3(435.70, -997.76, 30.1),
        "Alex Ford\nLeader LSPD\n10.10.2021 - 10.01.2022",
        {
            rotation: { x: 0, y: 0, z: 220 },
            type: "rotation",
        }
    )
    scaleForm.enabled = true

}
createScaleForm()

colshapes.new(new mp.Vector3(435.85, -998.02, 31.19), null, null, {
    type: -1,
    radius: 50,
    onEnterHandler: player => {
        if (player.remoteId === mp.players.local.remoteId) {
            spawnFordPed()
        }
    },
    onExitHandler: player => {
        if (player.remoteId === mp.players.local.remoteId) {
            ped?.destroy()
            ped = null
        }
    }
})



const setDefaultCustomization = (ped: PedMp) => {
    ped.setHeadBlendData(
        defaultCharacterData['SHAPE_THRID_ID'],
        defaultCharacterData['SHAPE_SECOND_ID'],
        0,
        defaultCharacterData['SKIN_THRID_ID'],
        defaultCharacterData['SKIN_SECOND_ID'],
        0,
        defaultCharacterData['SHAPE_MIX'],
        defaultCharacterData['SKIN_MIX'],
        0,
        true
    );

    let features = defaultCharacterData['FACE_SPECIFICATIONS'];

    if (features) {
        features.forEach((item, id) => {
            ped.setFaceFeature(id, item);
        });
    }

        ped.setComponentVariation(2, defaultCharacterData['HAIR'], 0, 2);
        ped.setHeadOverlay(
        2,
        defaultCharacterData['EYEBROWS'],
        defaultCharacterData['EYEBROWS_OPACITY'],
        defaultCharacterData['EYEBROWS_COLOR'],
        0
    );

        ped.setHairColor(defaultCharacterData['HAIR_COLOR'], defaultCharacterData['HAIR_COLOR2']);
        ped.setEyeColor(defaultCharacterData['EYE_COLOR']);

        ped.setHeadOverlay(
        9,
        defaultCharacterData['OVERLAY9'],
        defaultCharacterData['OVERLAY9_OPACITY'],
        defaultCharacterData['OVERLAY9_COLOR'],
        0
    );

        if (defaultCharacterData['OVERLAY10'] != -1)
            ped.setHeadOverlay(
                10,
                defaultCharacterData['OVERLAY10'],
                1.0,
                defaultCharacterData['OVERLAY10_COLOR'],
                0
            );
        ped.setHeadOverlay(
            1,
            defaultCharacterData['OVERLAY'],
            defaultCharacterData['OVERLAY_OPACITY'],
            61,
            61)
        if (defaultCharacterData['OVERLAY5'] != -1)
            ped.setHeadOverlay(
                5,
                defaultCharacterData['OVERLAY5'],
                1.0,
                defaultCharacterData['OVERLAY5_COLOR'],
                0
            );
        if (defaultCharacterData['OVERLAY8'] != -1)
            ped.setHeadOverlay(
                8,
                defaultCharacterData['OVERLAY8'],
                1.0,
                defaultCharacterData['OVERLAY8_COLOR'],
                0
            );
        if (defaultCharacterData['BLUSH']){
            ped.setHeadOverlay(
                5,
                defaultCharacterData['BLUSH'],
                defaultCharacterData['BLUSH_OPACITY'] || 0.0,
                defaultCharacterData['BLUSH_COLOR'] || 0,
                0
            );
        }
    }

    if (defaultCharacterData['LIPS']){
        ped.setHeadOverlay(
            8,
            defaultCharacterData['LIPS'],
            defaultCharacterData['LIPS_OPACITY'] || 0.0,
            defaultCharacterData['LIPS_COLOR'] || 0,
            0
        );
    }


const spawnFordPed = async () => {//todo: generic function
    if (ped && mp.peds.exists(ped)) ped.destroy()

    ped = mp.peds.new(mp.game.joaat("mp_m_freemode_01"), new mp.Vector3(435.85, -998.02, 31.19), 45)

    while (!ped.doesExist()) await mp.game.waitAsync(2)

    setDefaultCustomization(ped)
    
    ped.setEyeColor(0);

    ped.setHeadOverlay(
        9,
        0,
        1,
        0.10000000149011612,
        0
    );

    ped.setComponentVariation(2, 21, 0, 2);
    ped.setHairColor(61, 61);

    ped.setHeadOverlay(
        1,
        6,
        1,
        61,
        61
    )

    ped.setComponentVariation(3, 30, 0, 2)
    ped.setComponentVariation(8, 58, 0, 2)
    ped.setComponentVariation(11, 447, 0, 2)
    ped.setComponentVariation(1, 0, 0, 2)
    ped.setComponentVariation(4, 28, 0, 2)
    ped.setComponentVariation(6, 10, 0, 2)
    ped.setComponentVariation(7, 128, 0, 2)
    ped.setComponentVariation(7, 128, 0, 2)

    ped.setPropIndex(0, 8, 0, true)
    ped.setPropIndex(1, 8, 0, true)
    ped.setPropIndex(2, 999, 0, true)
    ped.setPropIndex(6, 999, 0, true)
    ped.setPropIndex(7, 999, 0, true)

    ped.setHeadOverlayColor(1, 1, 61, 61)
    ped.setHeadOverlayColor(2, 1, 61, 61)

    while (!mp.game.streaming.hasAnimDictLoaded('switch@franklin@lamar_tagging_wall')) {
        mp.game.streaming.requestAnimDict('switch@franklin@lamar_tagging_wall');
        mp.game.wait(10);
    }

    ped.taskPlayAnim(
        "switch@franklin@lamar_tagging_wall",
        "lamar_tagging_wall_loop_franklin",
        1.0,
        1,
        -1,
        2,
        0,
        false,
        false,
        false
    )

    mp.game.invoke('0xFFC24B988B938B38', ped.handle, "pose_aiming_1", 0);
}