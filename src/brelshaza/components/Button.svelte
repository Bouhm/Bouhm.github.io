<script lang="ts">
  export let onClick: ()=>void
  export let className = ""
  export let primary = ""
  export let secondary = ""

  function handleClick() {
      onClick();
  }
</script>

<div class={`${className} button clickable`} on:click={handleClick}>
  <div class="primary">{primary}</div>
  <div class="secondary">{secondary}</div>
</div>

<style>
  .button {
      border-radius: 4px;
      width: 8rem;
      border: 2px solid white;
      padding: 0.5rem;
      text-align: center;
      margin: 2rem 0.5rem 0 0.5rem;
      color: white;
  }

  .secondary {
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: greenyellow;
    opacity: 0.8;
  }
</style>