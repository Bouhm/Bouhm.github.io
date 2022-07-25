import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"

export const showStartInfo: Writable<boolean> = writable();
export const usedSkills: Writable<number[]> = writable();
export type KeyBindingConfig = {
    [control: string]: {
        key: string,
        skillId: number
    }
}

export const defaultKeyBindings = {
    skill1: {
        key: 'q',
        skillId: 0
    },
    skill2: {
        key: 'w',
        skillId: 0,
    },
    skill3: {
        key: 'e',
        skillId: 0
    },
    skill4: {
        key: 'r',
        skillId: 0,
    },
    skill5: {
        key: 'a',
        skillId: 0,
    },
    skill6: {
        key: 's',
        skillId: 0,
    },
    skill7: {
        key: 'd',
        skillId: 0,
    },
    skill8: {
        key: 'f',
        skillId: 0,
    },
    autoattack: {
        key: 'c',
        skillId: 0,
    },
    awakening: {
        key: 'v',
        skillId: 0
    },
    special1: {
        key: 'z',
        skillId: 0
    },
    special2: {
        key: 'x',
        skillId: 0
    }
};

export const keyBindings: Writable<KeyBindingConfig> = writable(defaultKeyBindings);

if (browser) {
    showStartInfo.subscribe(val => {
        return localStorage.showStartInfo = JSON.stringify(val);
    })

    keyBindings.subscribe(val => {
        return localStorage.keyBindings = JSON.stringify(val);
    })
}
