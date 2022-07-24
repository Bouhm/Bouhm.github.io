import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"

export const showStartInfo = writable(browser && JSON.parse(localStorage.getItem("showStartInfo")||"true"));
showStartInfo.subscribe(val => {
    if (browser) return (localStorage.showStartInfo = val);
})

export const usedSkills: Writable<number[]> = writable([]);

export const defaultKeyBindings = {
    skill1: 'q',
    skill2: 'w',
    skill3: 'e',
    skill4: 'r',
    skill5: 'a',
    skill6: 's',
    skill7: 'd',
    skill8: 'f',
    auto: 'c',
    awakening: 'v',
    special1: 'z',
    special2: 'x'
};

export const keyBindings = writable(browser && JSON.parse(localStorage.getItem("keyBindings")||JSON.stringify(defaultKeyBindings)));
showStartInfo.subscribe(val => {
    if (browser) return (localStorage.keyBindings = val);
})