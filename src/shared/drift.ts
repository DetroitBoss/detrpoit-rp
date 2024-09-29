export const DRIFT_MAP_ENTER = {x: 4938.75, y: 1058.25, z: 457.07, h: 256}
export const DRIFT_MAP_EXIT = {x: -250.76, y: -2102.61, z: 26.72, h: 327}
export const DRIFT_DEFAULT_PARAMS = {speed: 5.0, angle: 5.0}
export const DRIFT_PARAMS = [
    "elegy",
    "coquette3",
    "brioso",
    "gtr34",
    "sultanrs",
    "sentinel",
    "gauntlet",
    "gauntlet2",
    "gauntlet4",
    "sabregt",
    "sabregt2",
    "stalion",
    "stalion2",
    "tampa",
    "tampa2",
    "vaz2121",
    "cheburek",
    "m4f82",
    "w140",
    "nisgtr",
    "drafter",
    "comet2",
    "comet3",
    "comet5",
    "flashgt",
    "feltzer2",
    "futo",
    "jester3",
    "omnis",
    "priora",
    "a80",
    "2170",
    "chaser",
    "m5e39",
    "gls21",
    "cayen20",
    "audir8",
    "m4gts",
    "a80",
    "skyline"
]

export const is_drift_model = (model:string) => {
    return DRIFT_PARAMS.includes(model)
}