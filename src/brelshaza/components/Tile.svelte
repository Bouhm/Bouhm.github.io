<script lang="ts">
  import { base } from '$app/paths';
  export let i: number;
  export let onClick: (i: number) => void;
  export let hp = 3;
  export let selected = false;

  // function handleClick() {
  //     onClick(id);
  // }

  function handleClick(e: Event) {
    onClick(i)
  }
</script>

<div 
  class:selected={selected} 
  class:clickable={hp>0}
  class="board-tile hp-{hp}"
  style="--bg: url({base}/brelshaza/pattern{i+1}.webp)"
  on:click={handleClick}
/>

<style>
  .board-tile {
    background-color: #354BA5;
    outline: 1px solid black;
    width: 135px;
    height: 135px;
    background-image: var(--bg);
    background-blend-mode: soft-light;
    background-size: 135px;
    z-index: 1;
  }

  .selected { 
    background-color: #15A30B;
  }

  .hp-2 {
    background-blend-mode: normal;
    z-index: 1;
  }
  
  .hp-1 {
    outline: 1px solid #ccaea4;
    box-shadow: inset 0px 0px 30px #C6A195;
    background-blend-mode: normal;
    z-index: 2;
  }

  .hp-0 {
    opacity: 0.3;
    background-color: black;
    background-image: none;
  }

  @media (max-width: 680px) {
    .board-tile {
      width: 100px;
      height: 100px;
      background-size: 100px;
    }
  }
</style>