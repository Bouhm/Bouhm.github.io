import { writable } from "svelte/store";
import { browser } from "$app/env"

export const showStartInfo = writable(browser && JSON.parse(localStorage.getItem("showStartInfo")||"true"));

showStartInfo.subscribe(val => {
    if (browser) return (localStorage.showStartInfo = val);
})