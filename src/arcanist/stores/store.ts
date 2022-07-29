import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"
import combosDb from '../data/combos.json';
import  _ from 'lodash';
import type { Combo } from "../data/types";

export type KeyBindingConfig = {
    key: string,
    skillId: number
}[]


export const skillIds: number[] = _.uniq(combosDb.reduce(
    (ids: number[], combo: Combo) => ([...ids, ..._.filter(_.flatten(combo.rotations), id => id > 199 && id < 300)]),
    [200]
));
  
// This is insanity why does it have to be like this
export const showStartInfo: Writable<boolean> = writable(browser ? (!localStorage.getItem('showStartInfo') ? true : JSON.parse(localStorage.getItem('showStartInfo')!)) : true);
export const usedSkills: Writable<number[]> = writable(skillIds);
export const selectedView: Writable<number> = writable();

export const defaultKeyBindings = [
    {
        key: 'q',
        skillId: skillIds[0],
    },
    {
        key: 'w',
        skillId: skillIds[1],
    },
    {
        key: 'e',
        skillId: skillIds[2],
    },
    {
        key: 'r',
        skillId: skillIds[3],
    },
    {
        key: 'a',
        skillId: skillIds[4],
    },
    {
        key: 's',
        skillId: skillIds[5],
    },
    {
        key: 'd',
        skillId: skillIds[6],
    },
    {
        key: 'f',
        skillId: skillIds[7],
    },
    {
        key: 'c',
        skillId: 400,
    },
    {
        key: 'v',
        skillId: 301,
    },
    {
        key: 'z',
        skillId: -1,
    },
    {
        key: 'x',
        skillId: -2,
    }
];

export const keyBindings: Writable<KeyBindingConfig> = writable(browser ? (!localStorage.getItem('keyBindingsV2') ? defaultKeyBindings : JSON.parse(localStorage.getItem('keyBindingsV2')!)) : defaultKeyBindings);

if (browser) {
    showStartInfo.subscribe(val => {
        return localStorage.setItem('showStartInfo', JSON.stringify(val));
    })

    // keyBindings.subscribe(val => {
    //     return localStorage.setItem('keyBindings', JSON.stringify(val));
    // })
}


