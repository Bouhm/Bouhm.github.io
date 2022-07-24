<script lang="ts">
  import { base } from '$app/paths';
  import _ from 'lodash';

  import { showStartInfo, keyBindings } from '../arcanist/stores/store';
  import type { Combo, Skill } from '../arcanist/data/types';
  import arcanistDb from '../arcanist/data/arcanist.json';
  import combosDb from '../arcanist/data/combos.json';
  import Modal from '../arcanist/components/Modal.svelte';
  import ComboRow from '../arcanist/components/ComboRow.svelte';
  import SkillKey from '../arcanist/components/SkillKey.svelte';
  import Button from '../arcanist/components/Button.svelte';
  import Glossary from '../arcanist/components/Glossary.svelte';

  const cardKeys = ["Z", "X"];
  const awakeningId = 301;
  const autoattackId = 400;
  const judgmentId = 107;
  const threeHeadId = 100;
  const balanceId = 106;
  const wheelId = 111;

  const difficulties = ["NORMAL", "HARD", "INFERNO"];
  const comboData = combosDb as Combo[];
  const skillData = arcanistDb as Skill[];
  // All skill ids used in ALL the combos
  const skillIds: number[] = _.uniq(comboData.reduce(
    (ids: number[], combo: Combo) => ([...ids, ..._.filter(_.flatten(combo.rotations), id => id > 199 && id < 300)]),
    [200]
  )).sort();
  const defaultGuessState = {
    consumeStacks: true,
    cdResetNextSkill: false,
    stackOnAuto: false,
    increasedStacks: false,
    stacks: 0,
  };
  let keyBindConfig = $keyBindings;

  let showGlossary = false;
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
  let gameStage = 0;
  let guessStates = [defaultGuessState]
  let roundIdx = 0;
  let selectedSkillIds: number[] = [];
  let filteredCardIds = _.map(_.filter(skillData, skill => skill.type === "Card"), card => card.id);

  let combosList = _.shuffle(_.filter(comboData, combo => combo)) as Combo[];
  $: roundCombo = combosList[roundIdx];
  $: roundRotation = roundCombo.rotations[0] || [];
  $: currentState = guessStates[guessStates.length-1];
  $: lastSelectedSkillId = selectedSkillIds[selectedSkillIds.length-1];
  $: selectedSkill = _.find(skillData, skill => skill.id === selectedSkillIds[selectedSkillIds.length-1]) as Skill;
  $: skillsOnCd = _.filter(selectedSkillIds, id => isOnCd(id));
  $: console.log(gameStage, $showStartInfo); 

  function isOnCd(id: number, idx?: number) {
    return !(currentState && currentState.cdResetNextSkill && lastSelectedSkillId === id) &&
      id !== autoattackId &&
      selectedSkillIds.includes(id);
  }

  function getCardNames(ids: number[]) {
    return ids.map(id => {
      const card = _.find(skillData, skill => skill.id === id)
      return card ? card.name : ""
    })
  }

  function handleSelectSkill(id: number) {
    if (selectedSkillIds.length >= roundRotation.length || skillsOnCd.includes(id)) return;

    selectedSkillIds = [...selectedSkillIds, id];

    let newState = {...guessStates[guessStates.length-1]};
    let stackInc = 2;
    
    switch (id) {
      // Skills usable twice
      case 211:
        if (newState.increasedStacks) stackInc = 4;
        break;
      case 212:
        stackInc = 4;
        break;
      case 210:
      default: 
        if (newState.increasedStacks) stackInc++;
        break;
    }

    if (id > 209 && id < 220) {
      // Stacking skill used, increase stacks
      newState.stacks += stackInc;
    } else if (id > 219 && id < 230 && newState.consumeStacks) {
      // Consume stacks on Ruin skill
      newState.stacks = 0;
    } else if (id === wheelId) {
      // Next skill cd should be reset
      newState.cdResetNextSkill = true;
    } else if (id === threeHeadId) {
      // When Three-Headed Snake is used, autos apply stacks
      newState.stackOnAuto = true;
    } else if (id === judgmentId) {
      // When Three-Headed Snake is used, autos apply stacks
      newState.consumeStacks = false;
    } else if (id === autoattackId && newState.stackOnAuto) {
      newState.stacks++;
    } 

    if (newState.stacks > 4) newState.stacks = 4;
    guessStates = [...guessStates, newState];
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
          pressedSkillId = roundCombo.cards[_.indexOf(cardKeys, e.key.toUpperCase())];
          break;
        // Spacebar skill
        // case "Space":
        //   pressedSkillId = spacebarId;
        //   break;
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
          if (selectedSkillIds.length === roundRotation.length) handleSubmit();
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
    guessStates = guessStates.slice(0, guessStates.length-1);
  }

  function startGame() {
    localStorage.setItem("showStartInfo", "false");
    gameStage = 1;
  }

  function nextRound() {
    gameStage = 1;
    roundIdx++;
    selectedSkillIds = [];
    guessStates = [defaultGuessState];
  }

  function handleCloseModal() {
    nextRound();
  }

  function handleSubmit() {
    // Check correctness for every rotation
    let correctedSkillsArr = roundCombo.rotations.map((rotations) => new Array(rotations.length).fill(0));

    // Check every rotation
    for (let i = 0; i < roundCombo.rotations.length; i++) {
      for (let j = 0; j < roundCombo.rotations[i].length; j++) {
        const currentSkillId = roundCombo.rotations[i][j];
        const selectedSkillId = selectedSkillIds[j] ? selectedSkillIds[j] : -1;
        const selectedSkill = _.find(arcanistDb, skill => skill.id === selectedSkillId);
        const currentSkill = _.find(arcanistDb, skill => skill.id === currentSkillId);
        
        if (currentSkillId === selectedSkillId) {
          correctedSkillsArr[i][j] = 2;
        } else if (selectedSkill && currentSkill && selectedSkill.type === currentSkill.type) {
          correctedSkillsArr[i][j] = 1;
        } else {
          correctedSkillsArr[i][j] = 0;
        }
      }
    }

    // Take the best one
    let sumArr = correctedSkillsArr.reduce((sums, curr) => [...sums, curr.reduce((sum, curr) => sum + curr, 0)], [])
    const maxCorrectness = _.max(sumArr);
    correctness = correctedSkillsArr[_.indexOf(sumArr, maxCorrectness)];
    gameStage = 2;

    // 100% correct
    if (maxCorrectness === 2 * roundRotation.length) numCorrect++;

    if (roundIdx > roundRotation.length-1) {
      endGame();
    }
  }

  function endGame() {
    // gameStage = 3;
    combosList = _.shuffle(_.filter(comboData, combo => combo)) as Combo[];
  }
</script>

<svelte:head>
  <title>Arcanist Combos</title>
</svelte:head>
<svelte:window on:keyup={handleKeyPress}/>
<main>
  {#if gameStage === 0 && $showStartInfo}
    <Modal title="Before you begin..." onClose={handleCloseModal} >
      <div class="start-content">
        <h3>
          These are combos for intended for 332 (3 Stack skills, 3 Ruin skills, 2 Normal skills) Empress Arcanist.
        </h3>
        <h3>General Stacking</h3>
        <div> 
          Use Scratch Dealer + Quadra Accelerate or Spiral Edge twice (chain skill) to gain 4 stacks. 
          A tripod in Scratch Dealer provides attack speed to help land all Quadra Accelerate hits so it is used first.
        </div>
        
        <h3>Ruin Skill Priority</h3>
        <div>
          Although Secret Garden has the highest Damage Per Cooldown (DPC), it is difficult to manage optimal rotations off cooldowns. 
          Celestial Rain is realistically better as its longer range makes it easier to land.
          Serendipity is inefficient to use in most cases due to its long cooldown but can be used when
          either Secret Garden or Celestial Rain are halfway or more through their cooldowns.
        </div>

        <h3>Basic Rotation Pattern</h3>
        <div>
          The bread-and-butter combo is 4 stacks → Return → Ruin skill → 4 stacks → Ruin skill. 
          The two Ruin skills should be used during the duration of Return's buff.
        </div>
        <div>
          Refer to the Glossary for help if you need to review Arcanist skills.
        </div>
        <div class="start-info-actions">
          <Button onClick={startGame}>Start</Button>
        </div>
      </div>
    </Modal>
  {/if}
  {#if gameStage === 2}
    <Modal title={`${getCardNames(roundCombo.cards).join(' + ')} Combos`} onClose={handleCloseModal} >
      <div class="combo-answers">
        <div class="correct-rotations">
          <h3>{"Rotation(s):"}</h3>
          {#each roundCombo.rotations as rotation, i}
            <ComboRow rotation={rotation} centered />
            {#if roundCombo.rotations.length > 1 && i < roundCombo.rotations.length-1}
              <div class="rotation-divider">OR</div>
            {/if}
          {/each}
        </div>
        <h3>Input:</h3>
        <ComboRow rotation={selectedSkillIds} correctness={correctness} />
        {#if roundCombo.notes}
          <div class="correct-notes">{roundCombo.notes}</div>
        {/if}
        <div class="next-button clickable" on:click={nextRound}>Next</div>
      </div>
    </Modal>
  {/if}
  {#if showGlossary}
    <Glossary db={skillData} combos={comboData} onClose={() => showGlossary = false} />
  {/if}
  <div class="glossary-button clickable" on:click={() => showGlossary = true}>🕮</div>
  <section class="cards">
    {#each roundCombo.cards as cardId, i}
      <SkillKey bind:id={cardId} key={cardKeys[i]} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes(cardId)} isCard={true} />
    {/each}
  </section>
  <section class="applied-effects">
      <ul class="effects">
        {#if selectedSkill && selectedSkill.effects}
          {#each selectedSkill.effects as effect}
            <li>{effect}</li>
          {/each}
        {/if}
      </ul>
    <div class="stacks">
      {#each Array(currentState.stacks || 0) as _}
        <div class="stack-card" />
      {/each}
    </div>
  </section>
  <section class="input-area">
    <div class="input-skills">
      {#each selectedSkillIds as skillId, i} 
        <div 
            class={`skill-box ${i === selectedSkillIds.length - 1 ? 'clickable' : ''}`} 
            style="background-image: url('{`${base}/arcanist/${skillId}.webp`}')"
            on:click={handleRemoveSkill}
        />
      {/each}
      <!-- Empty slots when guessing -->
      {#if roundRotation.length > selectedSkillIds.length}
          {#each Array(roundRotation.length - selectedSkillIds.length) as _}
              <div class="skill-box" />
          {/each}
      {/if}
    </div>
    {#if gameStage === 1}
      <Button onClick={handleSubmit}>Submit</Button>
    {/if}
  </section>
  <section class="skills">
    <div class="special-skills">
      <!-- Autoattack -->
      <SkillKey id={autoattackId} key="C" onClick={handleSelectSkill} />
      <!-- Awakening -->
      <SkillKey id={awakeningId} key="V" onClick={handleSelectSkill} isOnCd={skillsOnCd.includes(awakeningId)} />
    </div>
    <div class="normal-skills">
      {#each skillIds as skillId, i}
        <SkillKey id={skillId} key={(i+1)+""} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes(skillId)} />
      {/each}
    </div>
  </section>
</main>

<style>
  :global(body) {
    background-color: #150F23;
    box-sizing: border-box;
  }

  main {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: white;
    height: 95vh;
  }

  section {
    display: flex;
  }
  section.cards {
    flex: 2;
    margin: 1rem;
  }
  section.applied-effects {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex: 1.5;
  } 
  section.input-area {
    flex: 2;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  section.skills {
    flex: 1;
  }
  
  .start-info-actions {
    display: flex;
    justify-content: center;
  }
  .glossary-button {
    font-size: 2em;
  }

  .card img {
    width: 140px;
    height: auto;
  }

  .applied-effects .effects {
    display: block;
    min-height: 4rem;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 20px;
  }
  .applied-effects .stacks{
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
    left: -40px;
    top: 10px;
  }
  .applied-effects .stack-card:nth-child(2){
    transform: rotate(-25deg);
    left: -20px;
  }
  .applied-effects .stack-card:nth-child(3){
    transform: rotate(25deg);
    left: 0px;
  }
  .applied-effects .stack-card:nth-child(4){
    transform: rotate(45deg);
    left: 20px;
    top: 10px;
  }

  .input-area .input-skills {
    display: flex;
  }
  .input-area .input-skills .skill-box {
    width: 64px;
    height: 64px;
    border-bottom: 2px solid white;
    background-size: cover;
    background-position: left center;
    margin: 0.2em;
  }
  .input-area .input-skills .skill-box:first-child {
    border-width: 2px 1px 2px 2px;
  }
  .input-area .input-skills .skill-box:last-child {
    border-width: 2px 2px 2px 1px;
  }
 
  .skills {
    display: flex;
  }
  .special-skills, .normal-skills {
    display: flex;
    justify-content: center;
  }
  .special-skills .skill-icon, .normal-skills .skill-icon {
    border-width: 2px 1px 2px 1px;
    border-color: #FFB200;
    border-style: solid;
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
    width: 120px;
    height: auto;
    margin-bottom: 1rem;
  }

  .combo-answers {
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: left;
  }
  .combo-answers .rotation-divider {
    text-align: center;
    margin: 0.5rem;
    font-size: 0.8em;
  }
  .correct-rotations {
    margin-bottom: 2rem;
  }
  .combo-answers h3 {
    text-align: center;
    margin: 0.5rem;
  }
  .combo-answers .correct-notes {
    margin-top: 1.5rem;
  }
</style>