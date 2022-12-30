<script lang="ts">
  import { browser } from "$app/env"
  import { base } from '$app/paths'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { includes } from 'lodash'

  import BoardTile from "../brelshaza/components/Tile.svelte"
  import Button from "../brelshaza/components/Button.svelte"
  import Timer from "../brelshaza/components/Timer.svelte"
  
  let TURBO = false;

  const goldMeteorHp = [188, 137, 87, 37]
  const recTiles = [[3,6,7],[1, 2, 5],[0,7]]
  const startTime = 60
  const respawnDelay = 12
  const respawnTime = 100
  const startHp = goldMeteorHp[0]
  const meteorDropTime = 10
  const initialBoardState=[3,0,0,3,14,0,3,3,3]

  let boardState=initialBoardState
  let event = ""
  let goldMeteorNum = 0
  let blueMeteorNum = 0

	let blueTimer = startTime
  let respawnTimer = respawnTime
  let meteorDropTimer = 0
  let currentHp = startHp
  let hasStarted = false

  $: currentHp = goldMeteorHp[goldMeteorNum]
  $: suggestedTiles = boardState[2] > 1 ? recTiles[1] : boardState[6] > 1 ? recTiles[0] : recTiles[2] 
  $: deadTiles = boardState[2] === 0 ? recTiles[blueMeteorNum % 2] : recTiles[1 - blueMeteorNum % 2]
  
  setInterval(() => {
    if (hasStarted) {
      if (TURBO) blueTimer -= 10
      else blueTimer--

      if (TURBO) respawnTimer -= 10
      else respawnTimer--

      if (blueTimer < 0) blueTimer = 0
    } 

    if (meteorDropTimer >= meteorDropTime) {
      blueTimer = startTime
      event = ""
      meteorDropTimer = 0
      blueMeteorNum++
      handleDropMeteors()
    }

    if (blueTimer === 0) {
      event="SPAWN_METEOR"
      
      if (TURBO) meteorDropTimer += 10
      else meteorDropTimer++
    }

    if (respawnTimer < 0) {
      respawnTimer=respawnTime
      let newBoard = [...boardState]

      for (let i = 0; i < boardState.length; i++) {
        if (newBoard[i] === 0) newBoard[i] = 3
      }
      boardState = newBoard
    } 
  }, 1000);


  function handleBoardChange(idx: number) {
    
  }

  function handleClickStart() {
    hasStarted = true;
  }

  function handleAddTime(time: number) {
    blueTimer += time
  }

  function handleClickGoldMeteor() {
    handleAddTime(20);
    goldMeteorNum++;
    if (goldMeteorNum > goldMeteorHp.length-1) goldMeteorNum = goldMeteorHp.length-1;

    let newBoard = [...boardState]

    for (let i = 0; i < boardState.length; i++) {
      if (includes(suggestedTiles, i)) newBoard[i] = 0
    }

    boardState = newBoard
  }

  function handleDropMeteors() {
    let newBoard = [...boardState]

    for (let i = 0; i < boardState.length; i++) {
      if (includes(suggestedTiles, i)) newBoard[i] = newBoard[i]-1
    }

    boardState = newBoard
  }

  function handleClickReset() {
    hasStarted = false
    blueTimer = startTime
    currentHp = startHp
    goldMeteorNum = 0
    event=""
    boardState=initialBoardState
  }

  function handleClickTurbo() {
    TURBO = !TURBO
  }
</script>

<svelte:head>
  <title>Brelshaza G6 Thingy</title>
  <meta name="viewport" content="user-scalable=0" />
</svelte:head>

{#if browser}
  <main>
    <div class="bg" style="--bg: url({base}/brelshaza/bg.webp)"></div>
    <img class="planet" src="{base}/brelshaza/planet.webp" alt="planet"/>

    <div class="container">
      <div class="hud">
        <img class="hp-bar" src={`${base}/brelshaza/hpbar.webp`} alt="hp-bar" />
        <div class="hp-number">{Math.round(currentHp)}x</div>
        <div class="timer-controls">
          <div class="blue-timer">
            {#if event==="SPAWN_METEOR"}
              <div class="timer-meteor">
                Meteor Spawning
              </div>
            {:else}
              <div class="timer-label">Next blue meteor:</div>
              <div class="timer-value">
                <Timer time={blueTimer} size={2} />
              </div>
            {/if}
            <div class="timer-button">
              {#if hasStarted}
                <Button primary="Reset" onClick={handleClickReset}/>
              {:else}
                <Button primary="Start" onClick={handleClickStart}/>
              {/if}
            </div>
            <div class="turbo">
              <Button primary="TURBO" onClick={handleClickTurbo} active={TURBO}/>
            </div>
          </div>
      </div>
    </div>
  
      <div class="board-container">
        <div class="tile-respawn">
          Platform respawn: <br />
          <Timer time={respawnTimer} />
        </div>
        <div class="board"> 
          {#each Array(9) as _, i}
              <BoardTile i={i} hp={boardState[i]} selected={includes(suggestedTiles, i)} />
          {/each}
        </div>
      </div>
  
      <div class="toolbar">
        <Button disabled={!hasStarted} onClick={handleClickGoldMeteor} primary="Golden Meteor" secondary="+20s" />
        <Button disabled={!hasStarted} onClick={() => handleAddTime(60*2 + 15)} primary="Worship" secondary="+2m 15s" />
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
    color: white;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;  
    align-items: center;
  }

  .board-container {
    position: relative;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    flex: 5;
  } 

  .toolbar{
    display: flex;
    align-items: flex-end;
    padding-bottom: 2rem;
    flex: 1;
  }
  
  .hud {
    position: relative;
    width: 600px;
    height: auto;
    flex: 1;
    z-index: 2;
  }

  .hp-bar {
    position: relative;
    width: 100%;
  }

  .hp-number {
    position: relative;
    width: 100%;
    top: -3.6rem;
    text-align: center;
    color: white;
    font-size: 1.6rem;
  }

  .blue-timer {
    width: 20rem;
    position: absolute;
    font-size: 1.4rem;
    color: white;
    left: -6.7rem;
    top: 6rem;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .timer-meteor {
    color: royalblue;
    font-size: 2rem;
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
    position: relative;
    box-sizing: border-box;
    outline: 2px solid black;
    display: grid;
    grid-gap: 2px;
    
    grid-template-columns: repeat(3, 135px);
    grid-template-columns: repeat(3, 135px);
    max-height: 410px;

    transform-origin: center;
    transform: rotateX(45deg) rotateY(0deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }

  .tile-respawn {
    text-transform: uppercase;
    font-size: 1rem;
    margin-bottom: 0.5rem;
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