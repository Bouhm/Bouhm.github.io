<script lang="ts">
  import { selectedView } from "../stores/store";
  import type { Combo, Skill } from "../data/types";

  import Glossary from "./Glossary.svelte";
  import Keybindings from "./Keybindings.svelte";
  export let db: Skill[];
  export let combos: Combo[];

  const titles = ["Glossary", "Key Bindings"];

  function handleCloseView() {
    selectedView.set(-1);
  }
</script>

<div class="view">
  <div class="view-content">
    <div class="view-title">
      <h1>{titles[$selectedView]}</h1>
      <div class="view-close-button clickable" on:click={handleCloseView}>
        ✖
      </div>
    </div>
    {#if $selectedView === 0}
      <Glossary {db} {combos} />
    {:else if $selectedView === 1}
      <Keybindings />
    {/if}
  </div>
</div>

<style>
  .view {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    background-color: #191328;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .view-content {
    width: 60%;
    margin: 0 auto;
  }

  .view-title {
    position: relative;
    margin-bottom: 2rem;
  }
  .view-title h1 {
    margin-top: 1rem;
  }

  .view-close-button {
    position: absolute;
    top: -0.5rem;
    right: 1rem;
    font-size: 3em;
  }

  @media (max-width: 600px) {
    .view-content {
      width: 100%;
    }

    .view-title h1 {
      font-size: 1.6em;
      margin-left: 1rem;
    }

    .view-close-button {
      font-size: 2em;
    }
  }
</style>
