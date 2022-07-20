<script lang="ts">
  import { base } from '$app/paths';
  import type { Combo, Skill } from '../data/types';
  import arcanistDb from '../data/arcanist.json';
  import combosDb from '../data/combos.json';
  import { uniq, filter, find, flatten, shuffle, entries } from 'lodash';
  import Index from './index.svelte';

  let activeModalContent: Skill; 
  let activeCards: { id: number, key: string }[] = [];
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

  function handleHover(id: number) {
    const skill = find((arcanistDb as Skill[]), skill => skill.id === id);
    activeModalContent = id;
  }
</script>

<svelte:head>
  <title>Arcanist</title>
</svelte:head>

<main>
  <Modal title={find(arcanistDb, skill => skill.id === activeModalContentId).name}>

  </Modal>
  <section class="cards">
    {#each combosList[currentIdx].cards as cardId, i}
      <div class="card" on:mouseover={() => handleHover(cardId)}>
        <img src={`${base}/arcanist/${cardId}.webp`} />
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
    {#each combosList[currentIdx].rotations[0] as comboSkill}
      <div class="skill-box" />
    {/each}
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
        <div class="skill-icon" on:mouseover={() => handleHover(i+1)}>
          <img src={`${base}/arcanist/${skillId}.webp`} />
          <div class="skill-key">{i+1}</div>
        </div>
      {/each}
    </div>
  </section>
</main>

<style>
  main {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: white;
  }

  section {
    display: flex;
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
  }
  .skill-icon img {
    width: 75px;
    height: auto;
  }

</style>