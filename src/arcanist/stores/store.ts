import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"
import combosDb from '../data/combos.json';
import  _ from 'lodash';
import type { Combo } from "../data/types";

export const showStartInfo: Writable<boolean> = writable();
export const usedSkills: Writable<number[]> = writable();
export const selectedView: Writable<number> = writable();
export type KeyBindingConfig = {
    [control: string]: {
        key: string,
        skillId: number
    }
}
export const skillIds: number[] = _.uniq(combosDb.reduce(
    (ids: number[], combo: Combo) => ([...ids, ..._.filter(_.flatten(combo.rotations), id => id > 199 && id < 300)]),
    [200]
));
  
export const defaultKeyBindings = {
    skill1: {
        key: 'q',
        skillId: skillIds[0]
    },
    skill2: {
        key: 'w',
        skillId: skillIds[1],
    },
    skill3: {
        key: 'e',
        skillId: skillIds[2]
    },
    skill4: {
        key: 'r',
        skillId: skillIds[3],
    },
    skill5: {
        key: 'a',
        skillId: skillIds[4],
    },
    skill6: {
        key: 's',
        skillId: skillIds[5],
    },
    skill7: {
        key: 'd',
        skillId: skillIds[6],
    },
    skill8: {
        key: 'f',
        skillId: skillIds[7],
    },
    autoattack: {
        key: 'c',
        skillId: 400,
    },
    awakening: {
        key: 'v',
        skillId: 301
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
