<script lang="ts">
    import { selectedView } from "../stores/store";
    import type { Combo, Skill } from "../data/types";

    import Glossary from "./Glossary.svelte";
    import Keybindings from "./Keybindings.svelte";
    export let db: Skill[];
    export let combos: Combo[];

    const titles = ["Glossary", "Key Bindings"]

    function handleCloseView() {
        selectedView.set(-1);
    }
</script>

<div class="view">
    <div class="view-title">
        <h1>{titles[$selectedView]}</h1>
        <div class="view-close-button clickable" on:click={handleCloseView}>✖</div>
    </div>
    {#if $selectedView === 0}
        <Glossary db={db} combos={combos} />
    {:else if $selectedView === 1}
        <Keybindings />
    {/if}
</div>

<style>
    .view {
        position: fixed;
        padding: 1.5rem;
        top: 0;
        right: 15%;
        left: 15%;
        bottom: 0;
        z-index: 1;
        background-color: #191328;
        overflow-y: auto;
    }
    
    .view-title {
        margin-bottom: 2rem;
    }
    .view-title h1 {
        margin-top: 0;
    }

    .view-close-button {
        position: absolute;
        top: 0;
        right: 1rem;
        font-size: 3em;
    }
</style>