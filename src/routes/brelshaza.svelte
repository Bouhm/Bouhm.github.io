<script lang="ts">
  import { browser } from "$app/env"
  import { base } from '$app/paths'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing';
  
  import BoardTile from "../brelshaza/components/Tile.svelte"
  import Button from "../brelshaza/components/Button.svelte"
  
  let startTime = 60
  let startHp = 188
	let blueTimer = startTime
  let currentHp = startHp
  let hasStarted = false

  const damageValue = 15
  const damageTime = 5
  const waitTime = 15

  setInterval(() => {
    if (blueTimer > 0 && hasStarted) blueTimer--;
  }, 1000);

  $: minutes = Math.floor(blueTimer / 60);
  $: seconds = Math.floor(blueTimer - minutes * 60)
  
  function handleBoardChange(idx: number) {
    
  }

  function handleClickStart() {
    hasStarted = true;
  }

  function handleAddTime(time: number) {
    blueTimer += time
  }


  function handleClickReset() {
    hasStarted = false
    blueTimer = startTime
  }
</script>

<svelte:head>
  <title>Brelshaza Gate 6 Practice Tool</title>
  <meta name="viewport" content="user-scalable=0" />
</svelte:head>

{#if browser}
  <main>
    <div class="bg" style="--bg: url({base}/brelshaza/bg.webp)"></div>
    <img class="planet" src="{base}/brelshaza/planet.webp" alt="planet"/>

    <div class="container">
      <div class="hp-hud">
        <img class="hp-bar" src={`${base}/brelshaza/hpbar.webp`} alt="hp-bar" />
        <div class="hp-number">{Math.round(currentHp)}x</div>
        <div class="timer">
          <div class="timer-label">Next blue meteor:</div>
          <div class="timer-value">
            {#if minutes !== 0}
              {`${minutes}m`}
            {/if}
            {#if seconds !== 0}
              {`${seconds}s`}
            {/if}
          </div>
          <div class="timer-button">
            {#if hasStarted}
              <Button primary="Reset" onClick={handleClickReset}/>
            {:else}
              <Button primary="Start" onClick={handleClickStart}/>
            {/if}
          </div>
        </div>
      </div>
  
      <div class="board-container">
        <div class="board"> 
          {#each Array(9) as _, i}
              <BoardTile>
                {#if i == 4}
                  <img class="brel" src="{base}/brelshaza/brel.webp" alt="brel"/>
                {/if}
              </BoardTile>
          {/each}
        </div>
      </div>
  
      <div class="toolbar">
        <Button disabled={!hasStarted} onClick={() => handleAddTime(20)} primary="Golden Meteor" secondary="+20s" />
        <Button disabled={!hasStarted} nClick={() => handleAddTime(60*2 + 15)} primary="Worship" secondary="+2m 15s" />
        <Button disabled={!hasStarted} onClick={() => handleAddTime(20)} primary="Tornado" secondary="+20s" />
      </div>
    </div>
  </main>
{:else}
  <h1>Loading...</h1>
{/if}

<style>
  main {
    overflow-y: hidden;
    height: 100vh;
    width: 100%;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;  
    align-items: center;
  }

  .board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 3;
  } 

  .toolbar{
    display: flex;
    align-items: flex-end;
    padding-bottom: 2rem;
    flex: 1;
  }
  
  .hp-hud {
    position: relative;
    width: 800px;
    height: auto;
    flex: 1;
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
    position: absolute;
    font-size: 1.4rem;
    color: white;
    left: -1rem;
    top: 7.5rem;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .timer-label {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .timer-value {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .timer > div {
    text-align: center;
  }

  .timer-button {
    text-align: center;
    font-size: 1rem;
  }

  .board {
    display: grid;
    border: 2px solid black;
    grid-gap: 1px;
    grid-template-columns: repeat(3, 135px);
    grid-template-columns: repeat(3, 135px);
    max-height: 410px;

    transform-origin: center;
    transform: rotateX(45deg) rotateY(0deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }

  .bg {
    background: var(--bg);
    background-repeat: no-repeat;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -3;
  }

  .planet {
    position: fixed;
    opacity: 0.5;
    bottom: 0;
    left: 51%;
    transform: translateX(-50%);
    z-index: -2;
  }
</style>