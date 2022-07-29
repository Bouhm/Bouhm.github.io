<script lang="ts">
  export let title = "";
  let isHovered = false;
  let x: number;
  let y: number;

  function mouseOver(event: MouseEvent) {
    isHovered = true;
    x = event.pageX + 10;
    y = event.pageY + 10;
  }
  function mouseMove(event: MouseEvent) {
    x = event.pageX + 10;
    y = event.pageY + 10;
  }
  function mouseLeave() {
    isHovered = false;
  }
</script>

<div
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  on:mousemove={mouseMove}
>
  <slot />
</div>

{#if isHovered}
  <div style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
  .tooltip {
    border: 1px solid #000;
    box-shadow: 1px 1px 1px #000;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    padding: 4px;
    z-index: 9;
    position: absolute;
  }
</style>
