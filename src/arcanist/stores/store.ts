import { writable } from "svelte/store";
import { browser } from "$app/env"

export const showStartInfo = writable(browser && JSON.parse(localStorage.getItem("showStartInfo")||"true"));
showStartInfo.subscribe(val => {
    if (browser) return (localStorage.showStartInfo = val);
})

const defaultKeyBindings = JSON.stringify(['q','w','e','r','a','s','d','f']);
export const keyBindings = writable(browser && JSON.parse(localStorage.getItem("keyBindings")||defaultKeyBindings));
showStartInfo.subscribe(val => {
    if (browser) return (localStorage.keyBindings = val);
})