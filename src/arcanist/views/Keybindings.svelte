<script lang="ts">
    import { base } from '$app/paths';
    import _ from 'lodash';
    import { keyBindings, type KeyBindingConfig } from '../stores/store';
    import SkillKey from '../components/SkillKey.svelte';

    function isExistingKey(key: string) {
        return _.filter($keyBindings, kb => kb.key === key).length > 1;
    }

    function handleMoveUp(control: string) {
        const newConfig = _.clone($keyBindings);
        const curr = newConfig[control];
        const newNum = parseInt(control.slice(-1))-1
        const next = _.clone(newConfig[`skill${newNum}`]);

        console.log(curr, next);

        newConfig[`skill${newNum}`] = curr;
        newConfig[control] = next;
        keyBindings.set(newConfig as KeyBindingConfig);
    }

    function handleMoveDown(control: string) {
        const newConfig = _.clone($keyBindings);
        const curr = newConfig[control];
        const newNum = parseInt(control.slice(-1))+1
        const next = _.clone(newConfig[`skill${newNum}`]);
        newConfig[`skill${newNum}`] = curr;
        newConfig[control] = next;
        keyBindings.set(newConfig as KeyBindingConfig);
    }

    function handleKeyChange(e: Event, control: string) {
        let newConfig = _.clone($keyBindings);
        newConfig[control].key = (e.target as HTMLInputElement).value;
        keyBindings.set(newConfig as KeyBindingConfig);
    }
</script>

<div class="keybindings">
    <table class="keybindings-content">
        {#each Object.entries($keyBindings) as [control, skillKey], i}
            <tr>
                <td class="keybinding-control">{control.toUpperCase()}</td>
                <td class="keybinding-skill"><img src="{base}/arcanist/{skillKey.skillId}.webp"/></td>
                <td class="keybinding-input">
                    <input 
                        type="text" 
                        class:error={isExistingKey($keyBindings[control].key)} 
                        maxlength=1 
                        on:change={(e) => handleKeyChange(e, control)}
                        bind:value={$keyBindings[control].key} 
                    />
                </td>
                <td class="keybinding-moveup">
                    {#if i > 0 && i < 8}
                        <img class="clickable" on:click={() => handleMoveUp(control)} src="{base}/arcanist/circle-up-solid.svg"/>
                    {/if}
                </td>
                <td class="keybinding-movedown">
                    {#if i > -1 && i < 7}
                        <img class="clickable" on:click={() => handleMoveDown(control)} src="{base}/arcanist/circle-down-solid.svg"/>
                    {/if}
                </td>
            </tr>
        {/each}
    </table>
</div>


<style>
    .keybindings {
        display: flex;
        flex-flow: column;
        color: white;
    }

    .keybindings-content {
        table-layout: fixed;
        text-align: center;
    }
    td {
        width: 4rem;
    }
    td.keybinding-moveup, td.keybinding-movedown {
        width: 0.5rem;
    }
    td.keybinding-moveup img, td.keybinding-movedown img {
        width: 32px;
    }
    td.keybinding-skill img {
        width: 64px;
    }
    td.keybinding-input {
        width: 3rem;
    }
    td.keybinding-input input {
        font-weight: 700;
        width: 2rem;
    }
    td.keybinding-input input.error {
        color: red;
    }
</style>