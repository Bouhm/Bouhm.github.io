<script lang="ts">
  export let onClick: ()=>void
  export let className = ""
  export let primary = ""
  export let secondary = ""
  export let disabled = false
  export let active = false

  function handleClick() {
      onClick();
  }
</script>

<div class:active={active} class:disabled={disabled} class={`${className} button clickable`} on:click={handleClick}>
  <div class="primary">{primary}</div>
  {#if secondary}<div class="secondary">{secondary}</div>{/if}
</div>

<style>
  .button {
      border-radius: 4px;
      width: 8rem;
      border: 2px solid white;
      padding: 0.5rem;
      text-align: center;
      margin: 1rem 0.5rem 0 0.5rem;
      color: white;
  }

  .button.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .secondary {
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: greenyellow;
    opacity: 0.8;
  }

  .active {
    background-color: rgba(255,255,255,0.8);
    color: black;
  }

  @media (max-width: 680px) {
    .button {
      width: 12rem;
      border: 2px solid white;
      margin: 1rem 0.3rem 0 0.3rem;
    }

    .primary {
      font-size: 1.2rem
    }

    .secondary {
      font-size: 1rem;
    }
  }
</style>