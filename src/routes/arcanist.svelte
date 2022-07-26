<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from "$app/env"
  import _ from 'lodash';

  import { showStartInfo, keyBindings, skillIds, selectedView } from '../arcanist/stores/store';
  import type { Combo, Skill } from '../arcanist/data/types';
  import arcanistDb from '../arcanist/data/arcanist.json';
  import combosDb from '../arcanist/data/combos.json';
  import Modal from '../arcanist/components/Modal.svelte';
  import ComboRow from '../arcanist/components/ComboRow.svelte';
  import SkillKey from '../arcanist/components/SkillKey.svelte';
  import Button from '../arcanist/components/Button.svelte';
  import Settings from '../arcanist/components/Settings.svelte';
  import View from '../arcanist/views/View.svelte';
  import StartInfo from '../arcanist/components/StartInfo.svelte';

  const awakeningId = 301;
  const autoattackId = 400;
  const judgmentId = 107;
  const threeHeadId = 100;
  const balanceId = 106;
  const wheelId = 111;

  const difficulties = ["NORMAL", "HARD", "INFERNO"];
  const comboData = combosDb as Combo[];
  const skillData = arcanistDb as Skill[];

  const defaultGuessState = {
    consumeStacks: true,
    cdResetNextSkill: false,
    stackOnAuto: false,
    increasedStacks: false,
    stacks: 0,
  };

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

  let combosList = _.shuffle(_.filter(comboData, combo => combo.rotations[0].length > 1)) as Combo[];
  $: roundCombo = combosList[roundIdx];
  $: roundRotation = roundCombo.rotations[0] || [];
  $: currentState = guessStates[guessStates.length-1];
  $: lastSelectedSkillId = selectedSkillIds[selectedSkillIds.length-1];
  $: selectedSkill = _.find(skillData, skill => skill.id === selectedSkillIds[selectedSkillIds.length-1]) as Skill;
  $: skillsOnCd = _.filter(selectedSkillIds, id => isOnCd(id));

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
      case 400:
        if (newState.stackOnAuto) stackInc = 1;
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
      // When Judgment is used, Ruin skills apply as 4-stacks
      newState.consumeStacks = false;
    } else if (id === balanceId) {
      // When Balance is used, autos apply stacks
      newState.stackOnAuto = true;
    } else if (id === autoattackId && newState.stackOnAuto) {
      newState.stacks++;
    } 

    if (newState.stacks > 4) newState.stacks = 4;
    guessStates = [...guessStates, newState];
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (gameStage === 2 || $showStartInfo || $selectedView > -1) return;

    let pressedSkillId = -1;
    const skillKey = _.find($keyBindings, kb => kb.key === e.key);

    if (skillKey) {
      if (skillKey.skillId > -1) {
        pressedSkillId = skillKey.skillId; 
      } else {
        pressedSkillId = roundCombo.cards[skillKey.index];
      } 
    } else {
      switch(e.key) {
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
    showStartInfo.set(false);
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

{#if browser}
  <main>
      {#if gameStage === 0 && $showStartInfo}
        <StartInfo onCloseStartInfo={startGame} onStartGame={startGame} />
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
            <Button onClick={nextRound}>Next</Button>
          </div>
        </Modal>
      {/if}
      {#if $selectedView > -1}
        <View db={skillData} combos={comboData} />
      {/if}
      <div class="controls">
        <div class="logo"></div>
        <div class="glossary-button clickable" on:click={() => selectedView.set(0)}>🕮</div>
        <div class="settings-container">
          <!-- <Settings /> -->
        </div>
      </div>
      <section class="cards">
        {#each roundCombo.cards as cardId, i}
          <SkillKey bind:id={cardId} key={$keyBindings[`special${i+1}`].key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes(cardId)} isCard={true} />
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
          <!-- Awakening -->
          <SkillKey id={awakeningId} key={$keyBindings.awakening.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes(awakeningId)} />
          <!-- Autoattack -->
          <SkillKey id={autoattackId} key={$keyBindings.autoattack.key} onClick={handleSelectSkill} />
        </div>
        <div class="normal-skills">
          <!-- I don't remember why I didn't just use an array -->
          <SkillKey id={$keyBindings.skill1.skillId} key={$keyBindings.skill1.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill1.skillId)} />
          <SkillKey id={$keyBindings.skill2.skillId} key={$keyBindings.skill2.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill2.skillId)} />
          <SkillKey id={$keyBindings.skill3.skillId} key={$keyBindings.skill3.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill3.skillId)} />
          <SkillKey id={$keyBindings.skill4.skillId} key={$keyBindings.skill4.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill4.skillId)} />
          <SkillKey id={$keyBindings.skill5.skillId} key={$keyBindings.skill5.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill5.skillId)} />
          <SkillKey id={$keyBindings.skill6.skillId} key={$keyBindings.skill6.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill6.skillId)} />
          <SkillKey id={$keyBindings.skill7.skillId} key={$keyBindings.skill7.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill7.skillId)} />
          <SkillKey id={$keyBindings.skill8.skillId} key={$keyBindings.skill8.key} onClick={handleSelectSkill} isOnCd={skillsOnCd.includes($keyBindings.skill8.skillId)} />
        </div>
        <div class="key-bindings-settings">
          <Button onClick={() => selectedView.set(1)} isIcon>
            <img class="settings-button" src="{base}/arcanist/cog-solid.svg" alt="settings"/>
          </Button>
        </div>
      </section>
  </main>
{:else}
  <h1>Loading...</h1>
{/if}

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
  .controls {
    position: fixed;
    width: 100%;
    min-height: 3rem;
    flex: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(255,255,255,0.05);
    border-bottom: 2px solid rgba(255,255,255,0.1);
  }
  .controls div {
    flex: 1;
  }
  
  section.cards {
    flex: 4;
    margin: 6rem 1rem 1rem 1rem;
  }
  section.applied-effects {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex: 2.5;
  } 
  section.input-area {
    flex: 4;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  section.skills {
    flex: 3;
    display: flex;
  }
  .start-info-actions {
    display: flex;
    justify-content: center;
  }
  .controls .glossary-button {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2em;
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
    border: 2px solid rgba(255,255,255,0.5);
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
 
  .special-skills, .normal-skills {
    display: flex;
    justify-content: center;
    height: 128px;
    margin-right: 2rem;
  }
  .normal-skills {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(4, 1fr);
  }
  .special-skills {
    flex-flow: column;
  }
  .settings-button {
      width: 32px;
      height: 32px;
  }

  .skill-detail {
    display: flex;
    flex-flow: column;
    align-items: center;
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

  @media (max-width: 600px) {
    .key-bindings-settings {
      display: none;
    }
    
    .applied-effects {
      font-size: 0.9em;
    }
    .applied-effects .stack-card{
      position: absolute;
      width: 10px;
      height: 20px;
    }
    .applied-effects .stack-card:nth-child(1){
      transform: rotate(-50deg);
      left: -23px;
      top: 7px;
    }
    .applied-effects .stack-card:nth-child(2){
      transform: rotate(-25deg);
      left: -10px;
    }
    .applied-effects .stack-card:nth-child(3){
      transform: rotate(25deg);
      left: 2px;
    }
    .applied-effects .stack-card:nth-child(4){
      transform: rotate(50deg);
      left: 13px;
      top: 7px;
    }

    .special-skills, .normal-skills {
      margin: 0;
    }

    .input-area {
      justify-content: center;
    }
    
    .input-area .input-skills .skill-box {
      width: 32px;
      height: 32px;
      margin: 0.1em;
    }
  }
</style>