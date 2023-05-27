<script lang="ts">
  export let onClick: () => void;
  export let className = "";
  export let primary = "";
  export let secondary = "";
  export let disabled = false;
  export let active = false;
  export let size = "m";

  function handleClick() {
    onClick();
  }
</script>

<div
  class:active
  class:disabled
  class:small={size === "s"}
  class={`${className} button clickable`}
  on:click={handleClick}
>
  <div class="primary">{primary}</div>
  {#if secondary}<div class="secondary">{secondary}</div>{/if}
</div>

<style>
  .button {
    border-radius: 4px;
    min-width: 10rem;
    max-width: 10rem;
    border: 2px solid white;
    padding: 0.5rem;
    text-align: center;
    margin: 1rem 0.5rem 0 0.5rem;
    color: white;
    font-size: 1.2rem;
  }

  .button.disabled {
    opacity: 0.5;
    /* pointer-events: none; */
  }

  .secondary {
    margin-top: 0.2rem;
    font-size: 1rem;
    color: greenyellow;
    opacity: 0.8;
  }

  .active {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
  }

  .active .secondary {
    color: darkolivegreen;
  }

  @media only screen and (max-device-width: 912px) {
    .button {
      border: 5px solid white;
      border-radius: 8px;
      padding: 1rem;
      width: 88%;
      max-width: none;
    }

    .primary {
      font-size: 3rem;
    }

    .secondary {
      font-size: 2rem;
    }

    .button.small {
      width: 60%;
    }

    .small .primary {
      font-size: 2.2rem;
    }
  }
</style>
