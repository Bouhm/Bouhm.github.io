<script lang="ts">
    import { base } from '$app/paths';
import { selectedView } from '../stores/store';

    let showMenu = false;

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
        selectedView.set(i+1);
        showMenu = false;
    }
</script>

<div class="settings" use:clickOutside={handleCloseMenu}>
    <div class="settings-icon">
        <img on:click={handleClick} class="settings-button clickable" src="{base}/arcanist/cog-solid.svg" alt="settings"/>
    </div>
    {#if showMenu}
        <div class="settings-menu">
            {#each menuOptions as menuOption, i}
                <div on:click={() => handleSelectMenuOption(i)} class="menu-option clickable">{menuOption.name}</div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .settings {
        position: relative;
        display: flex;
        flex-flow: column;
    }
    .settings-icon {
        display: flex;
        justify-content: flex-end;
    }
    .settings-button {
        width: 32px;
    }
    .settings-menu {
        width: 8rem;
        background-color: rgba(255,255,255,0.1);
    }
    .settings-menu .menu-option {
        width: 100%;
        padding: 0.5rem;
    }
</style>