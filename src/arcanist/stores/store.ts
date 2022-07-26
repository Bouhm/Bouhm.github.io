import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"
import combosDb from '../data/combos.json';
import  _ from 'lodash';
import type { Combo } from "../data/types";

export type KeyBindingConfig = {
    [control: string]: {
        key: string,
        skillId: number
    }
}

// This is insanity why does it have to be like this
export const showStartInfo: Writable<boolean> = writable(browser ? (!localStorage.getItem('showStartInfo') ? true : JSON.parse(localStorage.getItem('showStartInfo')!)) : true);
export const usedSkills: Writable<number[]> = writable();
export const selectedView: Writable<number> = writable();

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
        skillId: -1
    },
    special2: {
        key: 'x',
        skillId: -1
    }
};

export const keyBindings: Writable<KeyBindingConfig> = writable(browser ? (!localStorage.getItem('keyBindings') ? defaultKeyBindings : JSON.parse(localStorage.getItem('keyBindings')!)) : defaultKeyBindings);

if (browser) {
    showStartInfo.subscribe(val => {
        return localStorage.setItem('showStartInfo', JSON.stringify(val));
    })

    // keyBindings.subscribe(val => {
    //     return localStorage.setItem('keyBindings', JSON.stringify(val));
    // })
}


