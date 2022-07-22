<script lang="ts">
  import { base } from '$app/paths';
  import type { Combo, Skill } from '../data/arcanist/types';
  import arcanistDb from '../data/arcanist/arcanist.json';
  import combosDb from '../data/arcanist/combos.json';
  import { clone, uniq, filter, find, flatten, shuffle, indexOf, map, max } from 'lodash';
  import Modal from '../components/arcanist/Modal.svelte';
  import ComboRow from '../components/arcanist/ComboRow.svelte';
  import SkillKey from '../components/arcanist/SkillKey.svelte';
  import Glossary from '../components/arcanist/Glossary.svelte';

  const cardKeys = ["Z", "X"];
  const awakeningId = 300;
  const spacebarId = 400;
  const autoattackId = 401;
  const difficulties = ["EASY", "MEDIUM", "HARD", "INFERNO"];
  const comboData = combosDb as Combo[];
  const skillData = arcanistDb as Skill[];
  const defaultGuessState = {
    cdResetNextSkill: false,
    shouldAutosStack: false,
    stacks: 0,
    stackInc: 2,
  };

  let selectedSkillIds: number[] = [];
  // Used to display correctness of each skill where
  // 0 = wrong 
  // 1 = wrong skill but correct skill type
  // 2 = correct skill
  let correctness: number[] = [];
  // Track how many the player got completely correct
  let numCorrect = 0;
  // 0 = Start (pick difficulty)
  // 1 = Round (guessing)
  // 2 = Round Submitted (self-explanatory)
  // 3 = Ended (all rounds completed)
  let gameStage = 1;
  let showGlossary = false;
  let guessIdx = 0;
  let guessStates = [defaultGuessState]

  // All skill ids used in ALL the combos
  const skillIds: number[] = uniq(comboData.reduce(
    (ids: number[], combo: Combo) => ([...ids, ...filter(flatten(combo.rotations), id => id > 199 && id < 300)]),
    []
  )).sort();
 
  let filteredCardIds = map(filter(skillData, skill => skill.type === "Card"), card => card.id);
  $: combosList = shuffle(filter(comboData, combo => combo)) as Combo[];

  let currentIdx = 0;
  $: currentCombo = combosList[currentIdx];
  $: currentRotations = currentCombo.rotations[0] || [];
  $: currentState = guessStates[guessIdx];

  function handleSelectSkill(id: number) {
    if (selectedSkillIds.length >= currentRotations.length) return;
    let newState = clone(guessStates[guessIdx]);
    selectedSkillIds = [...selectedSkillIds, id];

    if (id > 209 && id < 220) {
      // Stacking skill used, increase stacks
      newState.stacks += newState.stackInc;
    } else if (id === ) {
      // Next skill cd should be reset
    
    } else if (id === 100) {
      // When Three-Headed Snake is used, autos apply stacks
      newState.shouldAutosStack = true;
    } else if (id === autoattackId && newState.shouldAutosStack) {
      newState.stacks++;
    }

    guessStates.push(newState);
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (gameStage === 2) return;

    let pressedSkillId = -1;

    if (parseInt(e.key)) {
      pressedSkillId = skillIds[parseInt(e.key)-1];
    } else {
      switch(e.code) {
        // Card skill
        case "KeyZ":
        case "KeyX":
          pressedSkillId = currentCombo.cards[indexOf(cardKeys, e.key.toUpperCase())];
          break;
        // Spacebar skill
        case "Space":
          pressedSkillId = spacebarId;
          break;
        // Autoattack
        case "KeyC":
          pressedSkillId = autoattackId;
          break;
        // Awakening
        case "KeyV":
          pressedSkillId = awakeningId;
          break;
        // Submit
        case "Enter":
          if (selectedSkillIds.length === currentRotations.length) handleSubmit();
          break;
        // Remove last selected skill
        case "Backspace":
          if (selectedSkillIds.length > 0) handleRemoveSkill();
          break;
        default:
          break;
      }
    }

    if (pressedSkillId > -1) handleSelectSkill(pressedSkillId);
  }

  function handleRemoveSkill() {
    selectedSkillIds = selectedSkillIds.slice(0, selectedSkillIds.length-1);
    guessIdx--;
  }

  function nextRound() {
    gameStage = 1;
    currentIdx++;
    selectedSkillIds = [];
    guessStates = [defaultGuessState];
  }

  function handleCloseModal() {
    nextRound();
  }

  function handleSubmit() {
    // Check correctness for every rotation
    let correctedSkillsArr = currentCombo.rotations.map((rotations) => new Array(rotations.length).fill(0));

    // Check every rotation
    for (let i = 0; i < currentCombo.rotations.length; i++) {
      for (let j = 0; j < currentCombo.rotations[i].length; j++) {
        const currentSkillId = currentCombo.rotations[i][j];
        const selectedSkillId = selectedSkillIds[j] ? selectedSkillIds[j] : -1;
        const selectedSkill = find(arcanistDb, skill => skill.id === selectedSkillId);
        const currentSkill = find(arcanistDb, skill => skill.id === currentSkillId);
        
        if (currentSkillId === selectedSkillId) {
          console.log(2)
          correctedSkillsArr[i][j] = 2;
        } else if (selectedSkill && currentSkill && selectedSkill.type === currentSkill.type) {
          console.log(1)
          correctedSkillsArr[i][j] = 1;
        } else {
          console.log(0)
          correctedSkillsArr[i][j] = 0;
        }
      }
    }

    // Take the best one
    let sumArr = correctedSkillsArr.reduce((sums, curr) => [...sums, curr.reduce((sum, curr) => sum + curr, 0)], [])
    const maxCorrectness = max(sumArr);
    correctness = correctedSkillsArr[indexOf(sumArr, maxCorrectness)];
    gameStage = 2;

    // 100% correct
    if (maxCorrectness === 2 * currentRotations.length) numCorrect++;

    if (currentIdx > currentRotations.length-1) {
      endGame();
    }
  }

  function handleNextRound() {
    currentIdx++;
    gameStage = 2;
  }
  
  function endGame() {
    gameStage = 3;
  }

  // $: console.log("selected=", selectedSkillIds)
  $: console.log('c',correctness)
</script>

<svelte:head>
  <title>Arcanist</title>
</svelte:head>
<svelte:window on:keyup={handleKeyPress}/>
<main>
  {#if !combosList.length}
    <div>Loading...</div> 
  {:else}
    {#if gameStage === 2}
      <Modal title={`${currentCombo.cards.join(' + ')} Combos`} onClose={handleCloseModal} >
        <div class="combo-answers">
          {#each currentCombo.rotations as rotation}
            <ComboRow rotation={rotation} />
          {/each}
        </div>
        <ComboRow rotation={selectedSkillIds} correctness={correctness} />
      </Modal>
    {/if}
    {#if showGlossary}
      <Glossary db={skillData} combos={comboData} onClose={() => showGlossary = false} />
    {/if}
    <div class="glossary-button" onClick={() => showGlossary = true}>i</div>
    <section class="cards">
      {#each currentCombo.cards as cardId, i}
        <SkillKey id={cardId} key={cardKeys[i]} onClick={handleSelectSkill} />
      {/each}
    </section>
    <section class="applied-effects">
      <div class="effects"></div>
      <div class="stacks">
        {#each Array(currentState.stacks) as _}
          <div class="stack-card" />
        {/each}
      </div>
    </section>
    <section class="input-area">
      <ComboRow rotation={selectedSkillIds} max={currentRotations.length} />
      {#if gameStage === 1}
        <div class="submit button" on:click={handleSubmit}>Submit</div>
      {:else if gameStage === 2}
        <div class="next button" on:click={handleNextRound}>Next</div>
      {/if}
    </section>
    <section class="skills">
      <div class="special-skills">
        <!-- Spacebar -->  
        <SkillKey id={spacebarId} key="Spacebar" onClick={handleSelectSkill} />
        <!-- Autoattack -->
        <SkillKey id={autoattackId} key="C" onClick={handleSelectSkill} />
        <!-- Awakening -->
        <SkillKey id={awakeningId} key="V" onClick={handleSelectSkill} />
      </div>
      <div class="normal-skills">
        {#each skillIds as skillId, i}
          <SkillKey id={skillId} key={(i+1)+""} onClick={handleSelectSkill} />
        {/each}
      </div>
    </section>
  {/if}
</main>

<style>
  :global(body) {
    background-color: #110C1C;
  }

  main {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: white;
  }

  section {
    display: flex;
  }

  .card img {
    width: 140px;
    height: auto;
  }
  .card img:hover {
    cursor: pointer;
  }

  .applied-effects {
    position: relative;
  }
  
  .applied-effects .stack-card{
    position: absolute;
    width: 20px;
    height: 30px;
    background-color: purple;
    border: 2px solid black;
  }

  .applied-effects .stack-card:nth-child(1){
    transform: rotate(-45deg);
    left: 0;
    top: 10px;
  }
  .applied-effects .stack-card:nth-child(2){
    transform: rotate(-25deg);
    left: 20px;
  }
  .applied-effects .stack-card:nth-child(3){
    transform: rotate(25deg);
    left: 40px;
  }
  .applied-effects .stack-card:nth-child(4){
    transform: rotate(45deg);
    left: 60px;
    top: 10px;
  }

  .skills {
    display: flex;
  }
  .special-skills, .normal-skills {
    display: flex;
    justify-content: center;
  }
  .special-skills {
    margin-right: 2rem;
  }
 
  .skill-detail {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  .skill-detail img {
    width: 200px;
    height: auto;
    margin-bottom: 1rem;
  }

</style>