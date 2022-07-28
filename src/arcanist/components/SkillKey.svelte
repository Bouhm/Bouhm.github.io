<script lang="ts">
  import { base } from "$app/paths";
  export let id: number;
  export let key: string;
  export let onClick: (id: number) => void;
  export let isOnCd = false;
  export let isCard = false;
  export let className = "";

  function handleClick() {
    onClick(id);
  }
</script>

<div
  class:onCd={isOnCd}
  class="skill-icon clickable {className}"
  on:click={handleClick}
>
  <img class:asCard={isCard} src="{base}/arcanist/{id}.webp" />
  <div class="skill-key">{key}</div>
</div>

<style>
  .skill-icon {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 100%;
    margin: 0;
  }
  .skill-icon img {
    height: auto;
    width: 64px;
  }
  .skill-icon img.asCard {
    width: 128px;
  }
  .skill-icon.onCd {
    filter: grayscale(1) brightness(0.8);
  }
  div.skill-key {
    position: absolute;
    top: 0;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.7);
    padding: 0 0.3rem;
    outline: none;
    border: none;
    color: white;
  }

  @media (max-width: 600px) {
    .skill-icon img {
      max-width: 96px;
    }

    .skill-key {
      display: none;
    }
  }
</style>
