<script lang="ts">
  import { base } from '$app/paths';
  import type { Combo, Skill } from '../data/types';
  import arcanistDb from '../data/arcanist.json';
  import combosDb from '../data/combos.json';
  import { uniq, filter, find, flatten, shuffle, indexOf, sum, max } from 'lodash';
  import Modal from '../components/Modal.svelte';

  const cardKeys = ["Z", "X"];
  const awakeningId = 300;
  const spacebarId = 400;
  const autoattackId = 401;
  const difficulties = ["EASY", "MEDIUM", "HARD", "INFERNO"];

  let hoveredSkill: Skill|null; 
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
  let gameState = 1;

  // All skill ids used in ALL the combos
  const skillIds: number[] = uniq((combosDb as Combo[]).reduce(
    (ids: number[], combo: Combo) => ([...ids, ...filter(flatten(combo.rotations), id => id > 199 && id < 300)]),
    []
  )).sort();
 
  const combosList: Combo[] = shuffle(combosDb as Combo[])
  let currentIdx = 0;
  $: currentCombo = combosList[currentIdx];
  $: currentRotations = currentCombo.rotations[0] || [];

  function handleKeyPress(e: KeyboardEvent) {
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
          if (selectedSkillIds.length === currentRotations.length) {
            handleSubmit();
          }
          break;
        // Remove last selected skill
        case "Backspace":
          if (selectedSkillIds.length > 0) {
            selectedSkillIds = selectedSkillIds.slice(0, selectedSkillIds.length-1);
          }
          break;
        default:
          break;
      }
    }

    if (pressedSkillId > -1 && selectedSkillIds.length < currentRotations.length) {
      selectedSkillIds = [...selectedSkillIds, pressedSkillId]
    }
  }

  function handleRemoveSkill(id: number) {
    selectedSkillIds = filter(selectedSkillIds, skillId => skillId !== id)
  }

  function handleClickCard(id: number) {
    const skill = find((arcanistDb as Skill[]), skill => skill.id === id) as Skill;
    hoveredSkill = skill;
  }

  function handleCloseModal() {
    hoveredSkill = null;
  }

  function handleSubmit() {
    // Check correctness for every rotation
    let correctedSkillsArr: number[][] = [];

    // Check every rotation
    for (let i = 0; i < currentCombo.rotations.length - 1; i++) {
      // Skip if they're not the same length (this should never be the case and combos.json needs to be fixed)
      if (currentCombo.rotations[i].length === selectedSkillIds.length) {
        for (let j = 0; j < currentCombo.rotations[i].length -1; j++) {
          const currentSkillId = currentCombo.rotations[i][j];
          const selectedSkillId = selectedSkillIds[j] ? selectedSkillIds[j] : -1;
          const selectedSkill = find(arcanistDb, skill => skill.id === selectedSkillId);
          const currentSkill = find(arcanistDb, skill => skill.id === currentSkillId);

          if (currentSkillId === selectedSkillId) {
            correctedSkillsArr[i][j] = 2;
          } else if (selectedSkill && currentSkill && selectedSkill.type === currentSkill.type) {
            correctedSkillsArr[i][j] = 1;
          } else {
            correctedSkillsArr[i][j] = 0;
          }
        }
      }
    }

    // Take the best one
    let sumArr = correctedSkillsArr.reduce((sums, curr) => [...sums, curr.reduce((sum, curr) => sum + curr, 0)], [])
    const maxCorrectness = max(sumArr);
    correctness = correctedSkillsArr[indexOf(sumArr, maxCorrectness)];
    gameState = 2;

    // 100% correct
    if (maxCorrectness === 2 * currentRotations.length) numCorrect++;

    if (currentIdx > currentRotations.length-1) {
      endGame();
    }
  }

  function handleNextRound() {
    currentIdx++;
    gameState = 2;
  }
  
  function endGame() {
    gameState = 3;
  }
</script>

<svelte:head>
  <title>Arcanist</title>
</svelte:head>
<svelte:window on:keypress={handleKeyPress}/>
<main>
  {#if hoveredSkill}
    <Modal title={hoveredSkill.name} onClose={handleCloseModal} >
      <div class="skill-detail">
        <img src={`${base}/arcanist/${hoveredSkill.id}.webp`} />
        {#if hoveredSkill.description}
          <div>{hoveredSkill.description}</div>
        {/if}
      </div>
    </Modal>
  {/if}
  <section class="cards">
    {#each currentCombo.cards as cardId, i}
      <div class="card">
        <img src={`${base}/arcanist/${cardId}.webp`} on:click={() => handleClickCard(cardId)}/>
        <div class="skill-key">{cardKeys[i]}</div>
      </div>
    {/each}
  </section>
  <section class="applied-effects">
    <div class="effects"></div>
    <div class="stacks"></div>
  </section>
  <section class="combo-answers">
    {#each currentCombo.rotations as rotation}
      <div class="skill-row">
        {#each rotation as skillId} 
          <div class="skill-box">
            <img src={`${base}/arcanist/${skillId}.webp`} />
          </div>
        {/each}
      </div>
    {/each}
  </section>
  <section class="input-area">
    <div class="input-skills">
      {#each selectedSkillIds as skillId}
        <div class="skill-box">
          <img src={`${base}/arcanist/${skillId}.webp`} />
        </div>
      {/each}
      {#if currentRotations.length > selectedSkillIds.length}
        {#each Array(currentRotations.length - selectedSkillIds.length) as _}
          <div class="skill-box" />
        {/each}
      {/if}
    </div>
    {#if gameState === 1}
      <div class="submit button" on:click={handleSubmit}>Submit</div>
    {:else if gameState === 2}
      <div class="next button" on:click={handleNextRound}>Next</div>
    {/if}
  </section>
  <section class="skills">
    <div class="special-skills">
      <!-- Spacebar -->  
      <div class="skill-icon">
        <img src={`${base}/arcanist/${spacebarId}.webp`} />
        <div class="skill-key">Spacebar</div>
      </div>
      <!-- Autoattack -->
      <div class="skill-icon">
        <img src={`${base}/arcanist/${autoattackId}.webp`} />
        <div class="skill-key">C</div>
      </div>
      <!-- Awakening -->
      <div class="skill-icon">
        <img src={`${base}/arcanist/${awakeningId}.webp`} />
        <div class="skill-key">V</div>
      </div>
    </div>
    <div class="normal-skills">
      {#each skillIds as skillId, i}
        <div class="skill-icon">
          <img src={`${base}/arcanist/${skillId}.webp`} />
          <div class="skill-key">{i+1}</div>
        </div>
      {/each}
    </div>
  </section>
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
  .skill-icon {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 0.5rem;
  }
  .skill-icon img {
    width: 64px;
    height: auto;
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