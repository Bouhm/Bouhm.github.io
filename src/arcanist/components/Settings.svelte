<script lang="ts">
    import { base } from '$app/paths';
    import Keybindings from '../views/Keybindings.svelte';
    import View from '../views/View.svelte';

    let showMenu = false;
    let selectedMenuOption = -1;

    const menuOptions = [
        { name: "Keybindings" }
    ];

    function clickOutside(el: HTMLDivElement, callback: ()=>void) {
		function onClick(event: Event) {
			if (!el.contains(event.target as HTMLDivElement)) {
				callback();
			}
		}
		
		document.body.addEventListener('click', onClick);
		
		return {
			update(newCallback: ()=>void) {
				callback = newCallback;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		}
	}

    function handleClick() {
        showMenu = !showMenu;
    }

    function handleCloseMenu() {
        showMenu = false;
    }

    function handleSelectMenuOption(i: number) {
        selectedMenuOption = i;
        showMenu = false;
    }
</script>

<div class="settings" use:clickOutside={handleCloseMenu}>
    <img on:blur={handleCloseMenu} on:click={handleClick} class="settings-button clickable" src="${base}/arcanist/cog-solid.svg" alt="settings"/>
    {#if showMenu}
        <div class="settings-menu">
            {#each menuOptions as menuOption, i}
                <div on:click={() => handleSelectMenuOption(i)} class="menu-option clickable">{menuOption.name}</div>
            {/each}
        </div>
    {/if}
</div>
{#if selectedMenuOption > -1}
    <View title="Key Bindings">
        {#if selectedMenuOption === 0}
            <Keybindings />
        {/if}
    </View>
{/if}

<style>

</style>