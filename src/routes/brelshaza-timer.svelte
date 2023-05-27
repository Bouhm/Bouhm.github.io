<script lang="ts">
  import { browser } from "$app/env";
  import { base } from "$app/paths";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { filter, find, includes, sum } from "lodash";

  import BoardTile from "../brelshaza/components/Tile.svelte";
  import Button from "../brelshaza/components/Button.svelte";
  import Timer from "../brelshaza/components/Timer.svelte";
  import Checkbox from "../brelshaza/components/Checkbox.svelte";

  type RecommendedTile = { idx: number; value: number };

  const goldenMeteorHp = [188, 137, 87, 37];
  const recTiles = [
    [
      { idx: 1, value: 2 },
      { idx: 2, value: 2 },
      { idx: 5, value: 3 },
    ],
    [
      { idx: 3, value: 1 },
      { idx: 7, value: 1 },
    ],
    [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 1 },
    ],
    [{ idx: 3, value: 4 }],
    [
      { idx: 1, value: 1 },
      { idx: 2, value: 1 },
      { idx: 5, value: 1 },
    ],
    [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 2 },
    ],
    [
      { idx: 3, value: 1 },
      { idx: 6, value: 1 },
      { idx: 7, value: 1 },
    ],
  ];
  const numMeteors = [7, 2, 3, 4];
  const goldenTiles = [2, 6, 2, 6];
  const startTime = 60;
  const goldenMeteorDropLength = 12;
  const respawnLength = 100;
  const startHp = goldenMeteorHp[0];
  const meteorDropLength = 10;
  const initialBoardState = [3, 0, 0, 3, 14, 0, 3, 3, 3];
  const initialMeteorPlacements = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  enum Event {
    DropBlueMeteors = "DropBlueMeteors",
    DropGoldenMeteor = "DropGoldenMeteor",
  }

  let meteorPlacements = initialMeteorPlacements;
  let boardState = initialBoardState;
  let events: Event[] = [];
  let goldenMeteorNum = 1;
  let blueMeteorNum = 1;

  let blueTimer = startTime + 27;
  let respawnTimer = respawnLength;
  let blueDropTimer = -1;
  let goldenDropTimer = -1;
  let currentHp = startHp;
  let hasStarted = false;

  let showSuggestions = false;
  let isPlacingGoldenMeteor = false;
  let goldenMeteorTile = -1;

  let blueSpawnInterval: ReturnType<typeof setInterval>;
  let blueDropInterval: ReturnType<typeof setInterval>;
  let goldenDropInterval: ReturnType<typeof setInterval>;
  let respawnInterval: ReturnType<typeof setInterval>;

  $: currentHp = goldenMeteorHp[goldenMeteorNum];
  $: nextMeteorsNum = getNumMeteors(blueMeteorNum);
  $: currentEventLog = (ev: Event) => {
    switch (ev) {
      case Event.DropBlueMeteors:
        return "DROP BLUE METEORS" + ` (${blueDropTimer}s)`;
      case Event.DropGoldenMeteor:
        return "DROP GOLDEN METEOR" + ` (${goldenDropTimer}s)`;
      default:
        return "";
    }
  };
  $: deadTiles = boardState.map((hp) => hp === 0);

  function handleClickStart() {
    hasStarted = true;

    blueSpawnInterval = setInterval(() => {
      blueTimer--;

      if (blueTimer === 0) {
        blueTimer = startTime;
        events = [...events, Event.DropBlueMeteors];
        blueDropTimer = meteorDropLength;

        blueDropInterval = setInterval(() => {
          blueDropTimer--;

          if (blueDropTimer === 0) {
            dropBlueMeteors();
            meteorPlacements = initialMeteorPlacements;
            events = filter(events, (ev) => ev !== Event.DropBlueMeteors);
            blueMeteorNum++;
            blueDropTimer = -1;
          }
        }, 1000);

        setTimeout(
          () => clearInterval(blueDropInterval),
          (meteorDropLength + 1) * 1000
        );
      }
    }, 1000);

    respawnInterval = setInterval(() => {
      respawnTimer--;

      if (respawnTimer === 0) {
        respawnTimer = -1;
        let newBoard = [...boardState];

        for (let i = 0; i < boardState.length; i++) {
          if (newBoard[i] === 0) newBoard[i] = 3;
        }
        boardState = newBoard;
      }
    }, 1000);

    setTimeout(
      () => clearInterval(respawnInterval),
      (respawnLength + 1) * 1000
    );
  }

  function addTime(time: number) {
    blueTimer += time;
  }

  function placeGoldenMeteor(i: number) {
    addTime(18);
    goldenDropTimer = goldenMeteorDropLength;
    events = [...events, Event.DropGoldenMeteor];
    isPlacingGoldenMeteor = false;

    goldenDropInterval = setInterval(() => {
      goldenDropTimer--;

      if (goldenDropTimer === 0) {
        dropGoldenMeteor(i);
        goldenMeteorTile = -1;
        events = filter(events, (ev) => ev !== Event.DropGoldenMeteor);

        respawnTimer = respawnLength;
        goldenDropTimer = -1;
        goldenMeteorNum++;
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(goldenDropInterval);

      clearInterval(respawnInterval);
      respawnInterval = setInterval(() => {
        respawnTimer--;

        if (respawnTimer === 0) {
          respawnTimer = -1;
          let newBoard = [...boardState];

          for (let i = 0; i < boardState.length; i++) {
            if (newBoard[i] === 0) newBoard[i] = 3;
          }
          boardState = newBoard;
        }
      }, 1000);

      setTimeout(
        () => clearInterval(respawnInterval),
        (respawnLength + 1) * 1000
      );
    }, (goldenMeteorDropLength + 1) * 1000);
  }

  function handleClickGoldenMeteor(tile: number) {
    if (tile === goldenMeteorTile) {
      goldenMeteorTile = -1;
    } else {
      goldenMeteorTile = tile;
      isPlacingGoldenMeteor = true;
      placeGoldenMeteor(tile);
    }
  }

  function handleClickTile(i: number) {
    let currSum = sum(meteorPlacements);
    let newPlacements = [...meteorPlacements];

    if (boardState[i] === 0) return;

    if (currSum < nextMeteorsNum) {
      newPlacements[i]++;
    } else {
      newPlacements[i] = 0;
    }

    meteorPlacements = newPlacements;
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

    boardState = newBoard;
  }

  function dropBlueMeteors() {
    let newBoard = [...boardState];

    for (let i = 0; i < boardState.length; i++) {
      newBoard[i] = newBoard[i] - meteorPlacements[i];

      if (newBoard[i] < 0) newBoard[i] = 0;
    }

    boardState = newBoard;
  }

  function dropGoldenMeteor(tile: number) {
    let newBoard = [...boardState];

    switch (tile) {
      case 0:
        newBoard[0] = 0;
        newBoard[1] = 0;
        newBoard[3] = 0;
        break;
      case 2:
        newBoard[1] = 0;
        newBoard[2] = 0;
        newBoard[5] = 0;
        break;
      case 6:
        newBoard[3] = 0;
        newBoard[6] = 0;
        newBoard[7] = 0;
        break;
      case 8:
        newBoard[5] = 0;
        newBoard[7] = 0;
        newBoard[8] = 0;
        break;
      default:
        break;
    }

    boardState = newBoard;
  }

  function handleClickReset() {
    hasStarted = false;
    blueTimer = startTime + 27;
    currentHp = startHp;
    blueMeteorNum = 1;
    goldenMeteorNum = 1;
    goldenMeteorTile = -1;
    respawnTimer = respawnLength;
    blueDropTimer = -1;
    goldenDropTimer = -1;

    events = [];
    boardState = initialBoardState;
    meteorPlacements = initialMeteorPlacements;

    clearInterval(blueSpawnInterval);
    clearInterval(blueDropInterval);
    clearInterval(goldenDropInterval);
    clearInterval(respawnInterval);
  }

  function handleClickSkip() {
    if (blueTimer > 1) {
      blueTimer = 1;
    } else if (blueDropTimer > 1) {
      blueDropTimer = 1;
    }

    if (goldenDropTimer > 1) {
      goldenDropTimer = 1;
    } else if (respawnTimer > 1) {
      respawnTimer = 1;
    }
  }

  function handleToggleSuggestions(checked: boolean) {
    showSuggestions = checked;
  }

  function getEventLog(ev: Event) {
    switch (ev) {
      case Event.DropBlueMeteors:
        return "DROP BLUE METEORS" + ` (${blueDropTimer}s)`;
      case Event.DropGoldenMeteor:
        return "DROP GOLDEN METEOR" + ` (${goldenDropTimer}s)`;
      default:
        return "";
    }
  }

  function getNumMeteors(num: number) {
    if (num > 3) {
      return numMeteors[((num - 3) % 2) + 2];
    } else {
      return numMeteors[num];
    }
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
</script>

<svelte:head>
  <title>Brelshaza G6 Timer</title>
  <meta name="viewport" content="user-scalable=0" />
</svelte:head>

{#if browser}
  <main>
    <div class="bg" />
    <img class="planet" src="{base}/brelshaza/planet.webp" alt="planet" />
    <div class="stars" {style} />

    <div class="container">
      <div class="hud">
        <!-- <img class="hp-bar" src={`${base}/brelshaza/hpbar.webp`} alt="hp-bar" /> -->
        <!-- <div class="hp-number">{Math.round(currentHp)}x</div> -->
        <div class="timer-controls">
          <div class="blue-timer">
            <div class="timer-label">{nextMeteorsNum} blue meteors:</div>
            <div class="timer-value">
              <Timer time={blueTimer} />
            </div>
            <div class="timer-button">
              {#if hasStarted}
                <Button primary="Reset" onClick={handleClickReset} size="s" />
              {:else}
                <Button primary="Start" onClick={handleClickStart} size="s" />
              {/if}
            </div>
            <div class="skip">
              <Button
                primary="Skip"
                onClick={handleClickSkip}
                disabled={!hasStarted}
                size="s"
              />
            </div>
          </div>
          <div class="other-controls">
            <!-- <div class="suggestions-checkbox">
              <Checkbox
                label="Show suggestions"
                value={showSuggestions}
                onChange={handleToggleSuggestions}
              />
            </div> -->
            <div class="respawn-timer" class:hidden={respawnTimer < 0}>
              <div class="timer-label">Platform respawn:</div>
              <div class="respawn-value">
                <Timer time={respawnTimer} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="board-container">
        <div class="events-log">
          {#each events as ev}
            <div class="event-{ev}">
              {currentEventLog(ev)}
            </div>
          {/each}
        </div>
        <div class="board">
          {#each Array(9) as _, i}
            <BoardTile
              {i}
              hp={boardState[i]}
              meteors={meteorPlacements[i]}
              suggested={showSuggestions &&
                includes(
                  recTiles[blueMeteorNum].map((tile) => tile.idx),
                  i
                )}
              golden={i === goldenMeteorTile}
              onClick={handleClickTile}
              onRightClick={handleRightClickTile}
              disabled={!hasStarted ||
                (isPlacingGoldenMeteor && i % 2 !== 0) ||
                i == 4}
            />
          {/each}
        </div>
      </div>

      <div class="toolbar">
        <div class="golden-meteor-btns">
          <Button
            disabled={!hasStarted ||
              goldenDropTimer > -1 ||
              goldenMeteorNum >= 3 ||
              boardState[2] === 0}
            onClick={() => handleClickGoldenMeteor(2)}
            primary="Golden Meteor 12"
            secondary="+18s"
          />
          <Button
            disabled={!hasStarted ||
              goldenDropTimer > -1 ||
              goldenMeteorNum >= 3 ||
              boardState[6] === 0}
            onClick={() => handleClickGoldenMeteor(6)}
            primary="Golden Meteor 6"
            secondary="+18s"
          />
        </div>
        <div class="mech-btns">
          <Button
            disabled={!hasStarted}
            onClick={() => addTime(60 * 2 + 13)}
            primary="Worship"
            secondary="+2m 13s"
          />
          <Button
            disabled={!hasStarted}
            onClick={() => addTime(18)}
            primary="Tornado"
            secondary="+18s"
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
  }

  .timer-controls {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 2rem;
  }

  .other-controls {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .suggestions-checkbox {
    margin-bottom: 2rem;
    display: flex;
    flex-flow: column;
    align-items: center;
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
  }

  .blue-timer,
  .other-controls {
    margin: 0 4rem;
  }

  .blue-timer-meteor {
    color: royalblue;
    font-size: 2rem;
  }

  .timer-label {
    text-transform: uppercase;
    font-size: 1rem;
    text-align: center;
  }

  .timer-value {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .timer-button {
    text-align: center;
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

  .events-log {
    position: absolute;
    top: 6%;
    z-index: 2;
    margin-bottom: 1rem;
  }

  .respawn-label {
    text-transform: uppercase;
  }

  .respawn-timer.hidden {
    visibility: hidden;
  }

  @media only screen and (max-device-width: 912px) {
    .events-log {
      font-size: 2rem;
    }

    .board {
      grid-template-columns: repeat(3, 210px);
      grid-template-columns: repeat(3, 210px);
    }

    .timer-label {
      font-size: 1.8rem;
      width: 100%;
    }
  }
</style>
