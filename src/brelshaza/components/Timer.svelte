<script lang="ts">
  export let time: number;
  export let size = 1.3;

  $: minutes = Math.floor(time / 60);
  $: seconds = Math.floor(time - minutes * 60)
</script>

{#if time > -1}
  <div class="timer" style={`font-size: ${size}rem`}>
    {#if minutes !== 0}
      {`${minutes}m`}
    {/if}
    {#if seconds !== 0 || time === 0}
      {`${seconds}s`}
    {/if}
  </div>
{/if}

<style>
  .timer {
    text-align: center;
    margin: 0.5rem 0 0.5rem 0;
    text-transform: none;
  }
</style>