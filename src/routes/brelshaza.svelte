<script lang="ts">
  import { browser } from "$app/env"
  import { base } from '$app/paths'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { filter, find, includes, map, pull } from 'lodash'

  import BoardTile from "../brelshaza/components/Tile.svelte"
  import Button from "../brelshaza/components/Button.svelte"
  import Timer from "../brelshaza/components/Timer.svelte"
  
  let TURBO = false;

  type RecommendedTile = { idx: number, value: number }

  const goldenMeteorHp = [188, 137, 87, 37]
  const recTiles = [
    [
      { idx: 3, value: 1 },
      { idx: 7, value: 1 }  
    ],
    [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 1 }    
    ],
    [
      { idx: 3, value: 4 }
    ],
    [
      { idx: 1, value: 1 },
      { idx: 2, value: 1 },
      { idx: 5, value: 1 }    
    ],
    [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 2 }    
    ],
        [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 1 }    
    ],
  ]
  const goldenTiles = [6,2,6]
  const startTime = 60
  const goldenMeteorDropLength = 12
  const respawnLength = 100
  const startHp = goldenMeteorHp[0]
  const meteorDropLength = 10
  const initialBoardState=[3,0,0,3,14,0,3,3,3]

  enum Event {
    DropBlueMeteors = "DropBlueMeteors",
    DropGoldenMeteor = "DropGoldenMeteor"
  }

  let boardState=initialBoardState
  let events: Event[] = []
  let goldenMeteorNum = 0
  let blueMeteorNum = 0

	let blueTimer = startTime
  let respawnTimer = respawnLength
  let meteorDropTimer = -1
  let goldenMeteorDropTimer = -1
  let currentHp = startHp
  let hasStarted = false

  let blueSpawnInterval: ReturnType<typeof setInterval>
  let blueDropInterval: ReturnType<typeof setInterval>
  let goldenDropInterval: ReturnType<typeof setInterval>
  let respawnInterval: ReturnType<typeof setInterval>

  $: currentHp = goldenMeteorHp[goldenMeteorNum]
  $: deadTiles = map(boardState, hp => hp === 0)

  function getEventLog(ev: Event) {
    switch (ev) {
      case Event.DropBlueMeteors:
        return "Drop Blue Meteors"
      case Event.DropGoldenMeteor:
        return "Drop Golden Meteor"
      default:
        return ""
    }
  }

  function handleClickStart() {
    hasStarted = true;

    blueSpawnInterval = setInterval(() => {
      if (TURBO) blueTimer -= 10
      else blueTimer--

      if (blueTimer === 0) {
        events = [...events, Event.DropBlueMeteors]
        meteorDropTimer = meteorDropLength

        blueDropInterval = setInterval(() => {
          if (TURBO) meteorDropTimer -= meteorDropLength
          else meteorDropTimer--

          if (meteorDropTimer === 0) {
            handleDropBlueMeteors(recTiles[blueMeteorNum])
            events = filter(events, ev => ev !== Event.DropBlueMeteors)
            blueTimer = startTime
            blueMeteorNum++
            meteorDropTimer = -1
          }
        }, 1000)

        setTimeout(() => clearInterval(blueDropInterval), TURBO ? 2000 : (meteorDropLength+1) * 1000)
      }
    }, 1000);
  
    respawnInterval = setInterval(() => {
        if (TURBO) respawnTimer -= 10       
        else respawnTimer--

        if (respawnTimer === 0) { 
          respawnTimer = -1
          let newBoard = [...boardState]

          for (let i = 0; i < boardState.length; i++) {
            if (newBoard[i] === 0) newBoard[i] = 3
          }
          boardState = newBoard
        } 
      }, 1000)

      setTimeout(() => clearInterval(respawnInterval), TURBO ? (respawnLength/10 + 1) * 1000 : (respawnLength + 1) * 1000)
  }

  function handleAddTime(time: number) {
    blueTimer += time
  }

  function handleClickGoldenMeteor() {
    handleAddTime(20);
    goldenMeteorDropTimer = goldenMeteorDropLength 
    events = [...events, Event.DropGoldenMeteor]

    goldenDropInterval = setInterval(() => {
      if (TURBO) goldenMeteorDropTimer -= goldenMeteorDropLength
      else goldenMeteorDropTimer--

      if (goldenMeteorDropTimer === 0) {
        handleDropGoldenMeteor(goldenTiles[goldenMeteorNum])
        events = filter(events, ev => ev !== Event.DropGoldenMeteor)

        respawnTimer = respawnLength
        goldenMeteorDropTimer=-1
        goldenMeteorNum++
      }

    }, 1000)

    setTimeout(() => {
      clearInterval(goldenDropInterval)
      
      respawnInterval = setInterval(() => {
        if (TURBO) respawnTimer -= 10       
        else respawnTimer--

        if (respawnTimer === 0) { 
          respawnTimer = -1
          let newBoard = [...boardState]

          for (let i = 0; i < boardState.length; i++) {
            if (newBoard[i] === 0) newBoard[i] = 3
          }
          boardState = newBoard
        } 
      }, 1000)

      setTimeout(() => clearInterval(respawnInterval), TURBO ? (respawnLength/10 + 1) * 1000 : (respawnLength + 1) * 1000)
    }, TURBO ? 2000 : (goldenMeteorDropLength+1) * 1000);
  }

  function handleDropBlueMeteors(tiles: RecommendedTile[]) {
    let newBoard = [...boardState]
    let tileIdxs = map(tiles, tile => tile.idx)

    for (let i = 0; i < boardState.length; i++) {
      if (includes(tileIdxs, i)) newBoard[i] = newBoard[i]-find(tiles,tile=>tile.idx===i)!.value
    }

    boardState = newBoard
  }

  function handleDropGoldenMeteor(tile: number) {
    let newBoard = [...boardState]

    if (tile === 2) {
      newBoard[1] = 0
      newBoard[2] = 0
      newBoard[5] = 0
    } else if (tile === 6) {
      newBoard[3] = 0
      newBoard[6] = 0
      newBoard[7] = 0
    }

    boardState = newBoard
  }

  function handleClickReset() {
    hasStarted = false
    blueTimer = startTime
    currentHp = startHp
    blueMeteorNum = 0
    goldenMeteorNum = 0
    respawnTimer = respawnLength
    meteorDropTimer = -1
    goldenMeteorDropTimer = -1

    events=[]
    boardState=initialBoardState

    clearInterval(blueSpawnInterval)
    clearInterval(blueDropInterval)
    clearInterval(goldenDropInterval)
    clearInterval(respawnInterval)
  }

  function handleClickTurbo() {
    TURBO = !TURBO
    handleClickReset()
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
            <div class="timer-label">Next blue meteors:</div>
            <div class="timer-value">
              <Timer time={blueTimer} size={3} />
            </div>
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
          <div class="respawn-timer">
            {#if respawnTimer > 0}
              <div class="respawn-label">Platform respawn:</div>
              <div class="respawn-value">
                <Timer time={respawnTimer} size={1.4} />
              </div>
            {/if}
          </div>
      </div>
    </div>
  
      <div class="board-container">
        <div class="events-log">
          {#each events as ev}
            <div class="event-{ev}">
              {getEventLog(ev)}
            </div>
          {/each}
        </div>
        <div class="board"> 
          {#each Array(9) as _, i}
              <BoardTile i={i} hp={boardState[i]} selected={includes(map(recTiles[blueMeteorNum], tile => tile.idx), i)}/>
          {/each}
        </div>
      </div>
  
      <div class="toolbar">
        <Button disabled={!hasStarted || goldenMeteorDropTimer > -1 || goldenMeteorNum >= 3} onClick={handleClickGoldenMeteor} primary="Golden Meteor" secondary="+20s" />
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

  .timer-controls {
    position: absolute;
    display: flex;
    width: 100%;
    left: -2rem;
    top: 6rem;
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
    font-size: 1.4rem;
    color: white;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-right: 6rem;
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

  .events-log {
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .respawn-label {
    text-transform: uppercase;
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