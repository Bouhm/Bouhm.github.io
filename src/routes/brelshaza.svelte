<script lang="ts">
  import { browser } from "$app/env";
  import { base } from "$app/paths";
  import { sum } from "lodash";

  import BoardTile from "../brelshaza/components/Tile.svelte";
  import Button from "../brelshaza/components/Button.svelte";

  const goldenMeteorHp = [188, 137, 87, 37];

  const startHp = goldenMeteorHp[0];
  const initialBoardState = [3, 3, 3, 3, 14, 3, 3, 3, 3];
  const initialMeteorPlacements = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let meteorPlacements = initialMeteorPlacements;
  let boardState = initialBoardState;
  let goldenMeteorNum = 1;

  let currentHp = startHp;

  let goldenMeteorTile = -1;

  let mode = "Blue";

  $: currentHp = goldenMeteorHp[goldenMeteorNum];

  function handleClickTile(i: number) {
    if (mode == "Blue") {
      let currSum = sum(meteorPlacements);
      let newPlacements = [...meteorPlacements];

      if (boardState[i] === 0) return;
      if (currSum < 8) {
        newPlacements[i]++;
      } else {
        newPlacements[i] = 0;
      }
      meteorPlacements = newPlacements;
    } else if (mode == "Gold") {
      if (goldenMeteorTile == i) {
        goldenMeteorTile = -1;
      } else {
        goldenMeteorTile = i;
      }
    }
  }

  function handleRightClickTile(i: number) {
    let newBoard = [...boardState];
    newBoard[i]--;

    if (newBoard[i] < 0) {
      if (i === 4) {
        newBoard[i] = 14;
      } else {
        newBoard[i] = 3;
      }
    }

    if (newBoard[i] === 0) {
      if (meteorPlacements[i] > 0) {
        meteorPlacements[i] = 0;
      }

      if (goldenMeteorTile === i) {
        goldenMeteorTile = -1;
      }
    }

    boardState = newBoard;
  }

  function handleChangeMode(newMode: string) {
    mode = newMode;
  }

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 100;
  let style = "box-shadow: ";
  for (let i = 0; i < STAR_COUNT; i++) {
    style += `${randomNumber(-50, 50)}vw ${randomNumber(
      -50,
      50
    )}vh ${randomNumber(0, 3)}px ${randomNumber(0, 3)}px #fff`;

    if (i + 1 !== STAR_COUNT) {
      style += ",";
    } else {
      style += ";";
    }
  }

  function handleClickReset() {
    currentHp = startHp;
    goldenMeteorNum = 1;
    goldenMeteorTile = -1;

    boardState = initialBoardState;
    meteorPlacements = initialMeteorPlacements;
  }
</script>

<svelte:head>
  <title>Brelshaza G6 Sandbox</title>
  <meta name="viewport" content="user-scalable=0" />
</svelte:head>

{#if browser}
  <main>
    <div class="bg" />
    <img class="planet" src="{base}/brelshaza/planet.webp" alt="planet" />
    <div class="stars" {style} />

    <div class="container">
      <div class="hud">
        <ul>
          <li>Left-click to place meteor</li>
          <li>Right-click to cycle tile state</li>
          <li>Click repeatedly to place multiple</li>
          <li>For timer go to /brelshaza-timer</li>
        </ul>
        <Button primary="Reset" onClick={handleClickReset} size="s" />
      </div>

      <div class="board-container">
        <div class="board">
          {#each Array(9) as _, i}
            <BoardTile
              {i}
              hp={boardState[i]}
              meteors={meteorPlacements[i]}
              golden={i === goldenMeteorTile}
              onClick={handleClickTile}
              onRightClick={handleRightClickTile}
            />
          {/each}
        </div>
      </div>

      <div class="toolbar">
        <div class="golden-meteor-btns">
          <Button
            disabled={mode !== "Gold"}
            onClick={() => handleChangeMode("Gold")}
            primary="Gold Meteor"
          />
        </div>
        <div class="mech-btns">
          <Button
            disabled={mode !== "Blue"}
            onClick={() => handleChangeMode("Blue")}
            primary="Blue Meteor"
          />
        </div>
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

  .bg {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(230deg, #1f0636, #000e2c);
    background-color: #140032;
    z-index: -3;
  }

  .stars {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 1px;
    width: 1px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0.5;
    z-index: -2;
  }

  .planet {
    position: fixed;
    opacity: 0.5;
    bottom: 0;
    left: 51%;
    transform: translateX(-50%);
    z-index: -2;
    background-blend-mode: multiply;
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
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: 5;
    padding-top: 4.5rem;
  }

  .toolbar {
    display: flex;
    align-items: flex-end;
    margin: 1rem;
    width: 100%;
    flex: 1;
  }

  .golden-meteor-btns {
    align-items: flex-end;
  }
  .mech-btns {
    align-items: flex-start;
  }

  .golden-meteor-btns,
  .mech-btns {
    display: flex;
    flex-flow: column;
    width: 100%;
  }

  .hud {
    position: relative;
    width: 100%;
    height: auto;
    flex: 1;
    z-index: 2;
    display: flex;
    align-items: center;
    flex-flow: column;
  }

  .hud ul {
    margin-top: 2rem;

    text-align: left;
  }

  .hud ul li {
    width: 15rem;
  }

  .board {
    position: relative;
    box-sizing: border-box;
    outline: 2px solid black;
    display: grid;
    grid-gap: 2px;

    grid-template-columns: repeat(3, 150px);
    grid-template-columns: repeat(3, 150px);

    transform-origin: center;
    transform: rotateX(45deg) rotateY(0deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }

  @media only screen and (max-device-width: 912px) {
    .board {
      grid-template-columns: repeat(3, 210px);
      grid-template-columns: repeat(3, 210px);
    }
  }
</style>
