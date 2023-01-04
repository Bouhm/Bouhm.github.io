<script lang="ts">
  import { base } from "$app/paths";
  export let i: number;
  export let onClick: (i: number) => void;
  export let onRightClick: (i: number) => void;
  export let hp = 3;
  export let meteors = 0;
  export let golden = false;
  export let suggested = false;
  export let disabled = false;

  // function handleClick() {
  //     onClick(id);
  // }

  function handleClick(e: Event) {
    if (hp > 0) onClick(i);
  }

  function handleRightClick(e: Event) {
    e.preventDefault();
    onRightClick(i);
  }
</script>

<div
  class:suggested
  class="board-tile clickable hp-{hp}"
  class:disabled
  style="--bg: url({base}/brelshaza/pattern{i + 1}.webp)"
  on:click={handleClick}
  on:contextmenu={handleRightClick}
>
  <div class="tile-meteors">
    {#each Array(meteors) as meteor}
      <div class="tile-meteor" />
    {/each}
    {#if golden}
      <div class="tile-meteor golden" />
    {/if}
  </div>
</div>

<style>
  .board-tile {
    background-color: #354ba5;
    outline: 1px solid black;
    width: 150px;
    height: 150px;
    background-image: var(--bg);
    background-blend-mode: soft-light;
    background-size: 150px;
    z-index: 1;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tile-meteors {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    max-width: 60px;
    max-height: 60px;
  }

  .board-tile.disabled {
    pointer-events: none;
  }

  .tile-meteor {
    width: 20px;
    height: 20px;
    background-color: royalblue;
    border: 2px solid black;
    border-radius: 50%;
    margin: 0.05rem;
  }

  .tile-meteor.golden {
    background-color: gold;
  }

  .suggested {
    background-color: #15a30b;
  }

  .hp-2 {
    background-blend-mode: normal;
    z-index: 1;
  }

  .hp-1 {
    outline: 1px solid #ccaea4;
    box-shadow: inset 0px 0px 30px #c6a195;
    background-blend-mode: normal;
    z-index: 2;
  }

  .hp-0 {
    opacity: 0.3;
    background-color: black;
    background-image: none;
  }

  @media only screen and (max-device-width: 912px) {
    .board-tile {
      width: 210px;
      height: 210px;
      background-size: 210px;
    }

    .tile-meteor {
      border: 4px solid black;
      width: 40px;
      height: 40px;
    }
  }
</style>
