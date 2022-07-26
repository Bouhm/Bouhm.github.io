<script lang="ts">
    import { base } from '$app/paths';
    import { selectedView } from '../stores/store';

    let showMenu = false;

    const menuOptions: { [name: string]: string }[] = [];

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
        margin: 0;
        position: relative;
        display: flex;
        flex-flow: column;
    }
    .settings-icon {
        display: flex;
        justify-content: flex-end;
    }
    .settings-button {
        margin-right: 1rem;
        width: 32px;
        height: 32px;
    }
    .settings-menu {
        position: absolute;
        top: 2.6rem;
        right: 0;
        width: 8rem;
        padding: 1rem;
        background-color: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,255,255,0.15);
    }
    .settings-menu .menu-option {
        width: 100%;
    }
</style>