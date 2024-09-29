interface EmployerNPC {
    Position: Vector3Mp,
    Heading: number,
    Model: string,
    Name: string
    Range?: number,
    Dimension?: number
}

interface EmployerBlip {
    Sprite: number,
    Color: number,
    Position: Vector3Mp,
    Name: string
}

export const EMPLOYER_NPC: EmployerNPC = {
    Position: new mp.Vector3(-206.98, 6575.16, 11.02),
    Heading: 192,
    Model: "hc_gunman",
    Name: "Водолаз с опытом",
    Range: 1,
    Dimension: 0
}

export const EMPLOYER_BLIP: EmployerBlip = {
    Sprite: 597,
    Color: 73,
    Position: EMPLOYER_NPC.Position,
    Name: "Работа водолаза"
}