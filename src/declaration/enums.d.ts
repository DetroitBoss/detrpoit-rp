
declare namespace RageEnums {
  const enum LeaveVehicle {
    NORMAL = 0,
    TP_AND_CLOSE = 16,
    TP_AND_NOT_CLOSE = 256,
  }
  const enum ScreenshotType {
    JPG = 0,
    PNG = 1,
    BMP = 2
  }
  const enum HudComponent {
    HUD = 0,
    HUD_WANTED_STARS = 1,
    HUD_WEAPON_ICON = 2,
    HUD_CASH = 3,
    HUD_MP_CASH = 4,
    HUD_MP_MESSAGE = 5,
    HUD_VEHICLE_NAME = 6,
    HUD_AREA_NAME = 7,
    HUD_VEHICLE_CLASS = 8,
    HUD_STREET_NAME = 9,
    HUD_HELP_TEXT = 10,
    HUD_FLOATING_HELP_TEXT_1 = 11,
    HUD_FLOATING_HELP_TEXT_2 = 12,
    HUD_CASH_CHANGE = 13,
    HUD_RETICLE = 14,
    HUD_SUBTITLE_TEXT = 15,
    HUD_RADIO_STATIONS = 16,
    HUD_SAVING_GAME = 17,
    HUD_GAME_STREAM = 18,
    HUD_WEAPON_WHEEL = 19,
    HUD_WEAPON_WHEEL_STATS = 20,
    MAX_HUD_COMPONENTS = 21,
    MAX_HUD_WEAPONS = 22,
    MAX_SCRIPTED_HUD_COMPONENTS = 141
  }
  const enum EventKey {
    ENTITY_CREATED = 'entityCreated',
    ENTITY_DESTROYED = 'entityDestroyed',
    ENTITY_MODEL_CHANGE = 'entityModelChange',
    PLAYER_CHAT = 'playerChat',
    PLAYER_COMMAND = 'playerCommand',
    PLAYER_DAMAGE = 'playerDamage',
    PLAYER_DEATH = 'playerDeath',
    PLAYER_ENTER_CHECKPOINT = 'playerEnterCheckpoint',
    PLAYER_ENTER_COLSHAPE = 'playerEnterColshape',
    PLAYER_ENTER_VEHICLE = 'playerEnterVehicle',
    PLAYER_EXIT_CHECKPOINT = 'playerExitCheckpoint',
    PLAYER_EXIT_COLSHAPE = 'playerExitColshape',
    PLAYER_EXIT_VEHICLE = 'playerExitVehicle',
    PLAYER_JOIN = 'playerJoin',
    PLAYER_MARK_WAYPOINT = 'playerMarkWaypoint',
    PLAYER_QUIT = 'playerQuit',
    PLAYER_REACH_WAYPOINT = 'playerReachWaypoint',
    PLAYER_READY = 'playerReady',
    PLAYER_SPAWN = 'playerSpawn',
    PLAYER_START_ENTER_VEHICLE = 'playerStartEnterVehicle',
    PLAYER_START_EXIT_VEHICLE = 'playerStartExitVehicle',
    PLAYER_STREAM_IN = 'playerStreamIn',
    PLAYER_STREAM_OUT = 'playerStreamOut',
    PLAYER_WEAPON_CHANGE = 'playerWeaponChange',
    TRAILER_ATTACHED = 'trailerAttached',
    VEHICLE_DAMAGE = 'vehicleDamage',
    VEHICLE_HORN_TOGGLE = 'vehicleHornToggle',
    VEHICLE_SIREN_TOGGLE = 'vehicleSirenToggle',
    VEHICLE_STREAM_IN = 'vehicleStreamIn',
    VEHICLE_STREAM_OUT = 'vehicleStreamOut',
  }

  const enum ClothesComponent {
    HEAD = 0,
    BEARD = 1,
    HAIR = 2,
    TORSO = 3,
    LEGS = 4,
    HANDS = 5,
    FOOT = 6,
    NONE = 7,
    ACCESSORIES_1 = 8,
    ACCESSORIES_2 = 9,
    MASK = 10,
    DECALS = 11,
    AUXILIARY = 12,
  }

  const enum ColshapeType {
    CIRCLE = 'circle',
    CUBOID = 'cuboid',
    POLYGON = 'polygon',
    RECTANGLE = 'rectangle',
    SPHERE = 'sphere',
    TUBE = 'tube',
  }

  const enum EntityType {
    BLIP = 'blip',
    CHECKPOINT = 'checkpoint',
    COLSHAPE = 'colshape',
    MARKER = 'marker',
    OBJECT = 'object',
    PICKUP = 'pickup',
    PLAYER = 'player',
    VEHICLE = 'vehicle',
    PED = 'ped',
  }

  const enum HeadOverlay {
    BLEMISHES = 0,
    FACIAL_HAIR = 1,
    EYEBROWS = 2,
    AGEING = 3,
    MAKEUP = 4,
    BLUSH = 5,
    COMPLEXION = 6,
    SUN_DAMAGE = 7,
    LIPSTICK = 8,
    FRECKLES = 9,
    CHEST_HAIR = 10,
    BODY_BLEMISHES = 11,
    ADD_BODY_BLEMISHES = 12,
  }

  const enum Marker {
    UPSIDE_DOWN_CONE = 0,
    VERTICAL_CYLINDER = 1,
    THICK_CEVRON_UP = 2,
    THIN_CEVRON_UP = 3,
    CHECKERED_FLAG_RECT = 4,
    CHECKERED_FLAG_CIRCLE = 5,
    VERTICAL_CIRCLE = 6,
    PLANE_MODEL = 7,
    LOST_MC_DARK = 8,
    LOST_MC_LIGHT = 9,
    NUMBER_0 = 10,
    NUMBER_1 = 11,
    NUMBER_2 = 12,
    NUMBER_3 = 13,
    NUMBER_4 = 14,
    NUMBER_5 = 15,
    NUMBER_6 = 16,
    NUMBER_7 = 17,
    NUMBER_8 = 18,
    NUMBER_9 = 19,
    CHEVRON_UP_1 = 20,
    CHEVRON_UP_2 = 21,
    CHEVRON_UP_3 = 22,
    HORIZONTAL_CIRCLE_FLAT = 23,
    REPLAY_ICON = 24,
    HORIZONTAL_CIRCLE_SKINNY = 25,
    HORIZONTAL_CIRCLE_ARROW = 26,
    HORIZONTAL_SPLIT_ARROW_CIRCLE = 27,
    DEBUG_SPHERE = 28,
    DOLLOR_SIGN = 29,
    HORIZONTAL_BARS = 30,
    WOLF_HEAD = 31,
  }

  const enum PlayerProp {
    HELMET = 0,
    GLASSES = 1,
    EAR_ACCESSORY = 2,
  }

  const enum VehicleSeat {
    DRIVER = -1,
    PASSENGER_1 = 0,
    PASSENGER_2 = 1,
    PASSENGER_3 = 2,
  }

  const enum Weather {
    BLIZZARD = 'BLIZZARD',
    CLEAR = 'CLEAR',
    CLEARING = 'CLEARING',
    CLOUDS = 'CLOUDS',
    EXTRA_SUNNY = 'EXTRASUNNY',
    FOGGY = 'FOGGY',
    OVERCAST = 'OVERCAST',
    RAIN = 'RAIN',
    SMOG = 'SMOG',
    SNOW_LIGHT = 'SNOWLIGHT',
    THUNDER = 'THUNDER',
    XMAS = 'XMAS',
  }
}
