<script lang="ts">
  import { browser } from "$app/env"
  import { base } from '$app/paths';
  import { tweened } from 'svelte/motion';
  
  import BoardTile from "../brelshaza/components/Tile.svelte"
  import Button from "../brelshaza/components/Button.svelte"
  
  let original = 2 * 60; // TYPE NUMBER OF SECONDS HERE
	let timer = tweened(original)
  let currentHp = 100;


  setInterval(() => {
    if ($timer > 0) $timer--;
  }, 1000);

  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60)
  
  function handleBoardChange() {
    
  }

  function handleClickPush() {

  }

  function handleClickWait() {

  }

  function handleClickMeteor() {

  }

  function handleClickReset() {

  }
</script>

<svelte:head>
  <title>Brelshaza Gate 6 Practice Tool</title>
</svelte:head>

{#if browser}
  <main>
    <div class="toolbar">
      <Button onClick={handleClickPush}>Push Damage</Button>
      <Button onClick={handleClickWait}>Wait</Button>
      <Button onClick={handleClickMeteor}>Random Meteor</Button>
      <Button onClick={handleClickReset}>Reset</Button>
    </div>
    <div class="hp-hud">
      <img class="hp-bar" src={`${base}/brelshaza/hpbar.webp`} alt="hp-bar" />
      <div class="hp-number">{currentHp}x</div>
      <div class="timer">{`${minutes}m ${seconds}s`}</div>
    </div>
    <div class="board"> 
      {#each Array(9) as _}
        <BoardTile />
      {/each}
    </div>
  </main>
{:else}
  <h1>Loading...</h1>
{/if}

<style>
  .toolbar{
    position: absolute;
    right: 1rem;
  }
  
  .hp-hud {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: auto;
  }

  .hp-bar {
    position: relative;
    width: 100%;
  }

  .hp-number {
    position: relative;
    width: 100%;
    top: -4.6rem;
    text-align: center;
    color: white;
    font-size: 2rem;
  }

  .timer {
    position: relative;
    font-size: 1.4rem;
    color: white;
    left: 2.2rem;
    top: -2.4rem;
  }

  .board {
    position: absolute;
    top: -2%;
    left: 50%;
    display: grid;
    grid-template-columns: 170px 170px 170px;
    grid-template-columns: 170px 170px 170px;

    transform: rotateX(45deg) rotateY(0deg) rotateZ(-45deg) translateX(-70%);
    transform-style: preserve-3d;
  }
</style>