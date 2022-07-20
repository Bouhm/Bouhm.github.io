export type Combo = {
    id: number,
    cards: number[],
    rotations: number[][],
    notes?: string
}

export type Skill = {
    id: number,
    name: string,
    effects?: string[],
    type: SkillType,
    description?: string
}

export enum SkillType {
    CARD = "Card",
    NORMAL = "Normal",
    STACK = "Stack",
    RUIN = "Ruin",
    AWAKENING = "Awakening",
    SPACEBAR = "Spacebar",
    AUTOATTACK = "Autoattack"
}