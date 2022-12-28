import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"
import  _ from 'lodash';

export const boardState: boolean[] = [false,false,false,false,false,false,false,false]
  
// This is insanity why does it have to be like this
export const showStartInfo: Writable<boolean> = writable(browser ? (!localStorage.getItem('showStartInfo') ? true : JSON.parse(localStorage.getItem('showStartInfo')!)) : true);

if (browser) {
    showStartInfo.subscribe(val => {
        return localStorage.setItem('showStartInfo', JSON.stringify(val));
    })

    // keyBindings.subscribe(val => {
    //     return localStorage.setItem('keyBindings', JSON.stringify(val));
    // })
}


