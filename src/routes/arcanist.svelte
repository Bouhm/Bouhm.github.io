<script lang="ts">
  import { base } from '$app/paths';
  import type { Combo, Skill } from '../data/types';
  import arcanistDb from '../data/arcanist.json';
  import combosDb from '../data/combos.json';
  import { uniq, filter, find, flatten, shuffle, indexOf } from 'lodash';
  import Modal from '../components/Modal.svelte';

  let hoveredSkill: Skill|null; 
  let selectedSkills: number[] = [];
  const cardKeys = ["Z", "X"];
  const awakeningId = 300;
  const spacebarId = 400;
  const autoattackId = 401;

  // All skill ids used in ALL the combos
  const skillIds: number[] = uniq((combosDb as Combo[]).reduce(
    (ids: number[], combo: Combo) => ([...ids, ...filter(flatten(combo.rotations), id => id > 199 && id < 300)]),
    []
  )).sort();
 
  const combosList: Combo[] = shuffle(combosDb as Combo[])
  let currentIdx = 0;

  function handleKeyPress(e: KeyboardEvent) {
    let pressedSkillId = -1;

    if (parseInt(e.key)) {
      pressedSkillId = skillIds[parseInt(e.key)-1];
    } else {
      switch(e.code) {
        case "KeyZ":
        case "KeyX":
          pressedSkillId = combosList[currentIdx].cards[indexOf(cardKeys, e.key.toUpperCase())];
          break;
        case "Space":
          pressedSkillId = spacebarId;
          break;
        case "KeyC":
          pressedSkillId = autoattackId;
          break;
        case "KeyV":
          pressedSkillId = awakeningId;
          break;
        case "Backspace":
          if (selectedSkills.length > 0) {
            selectedSkills = selectedSkills.slice(0, selectedSkills.length-1);
          }
          break;
        default:
          break;
      }
    }

    if (pressedSkillId > -1) {
      selectedSkills = [...selectedSkills, pressedSkillId]
    }
  }

  function handleRemoveSkill(id: number) {
    selectedSkills = filter(selectedSkills, skillId => skillId !== id)
  }

  function handleClickCard(id: number) {
    const skill = find((arcanistDb as Skill[]), skill => skill.id === id) as Skill;
    hoveredSkill = skill;
  }

  function handleCloseModal() {
    hoveredSkill = null;
  }
</script>

<svelte:head>
  <title>Arcanist</title>
</svelte:head>
<svelte:window on:keydown={handleKeyPress}/>
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
    {#each combosList[currentIdx].cards as cardId, i}
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
  </section>
  <section class="input-area">
    {#each selectedSkills as skillId}
      <div class="skill-box">
        <div class="skill-box-close" on:click={() => handleRemoveSkill(skillId)}>✖</div>
        <img src={`${base}/arcanist/${skillId}.webp`} />
      </div>
    {/each}
    {#if combosList[currentIdx].rotations[0].length > selectedSkills.length}
      {#each Array(combosList[currentIdx].rotations[0].length - selectedSkills.length) as _}
        <div class="skill-box" />
      {/each}
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