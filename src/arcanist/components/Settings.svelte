<script lang="ts">
    import { base } from '$app/paths';
    const menuOptions = [
        { name: "Keybindings" }
    ];
</script>

<div class="settings">
    <img class="settings-button clickable" src="${base}/arcanist/cog-solid.svg" alt="settings"/>
    <div class="settings-menu">
        {#each menuOptions as menuOption}
            <div class="menu-option">{menuOption.name}</div>
        {/each}
    </div>
</div>

<style>

</style>