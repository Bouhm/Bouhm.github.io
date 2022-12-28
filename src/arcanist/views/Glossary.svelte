<script lang="ts">
  import { find, groupBy } from "lodash";
  import type { Combo, Skill } from "../data//types";
  import ComboRow from "../components/ComboRow.svelte";
  import SkillInfo from "../components/SkillInfo.svelte";
  import { base } from "$app/paths";
  import StartInfo from "../components/StartInfo.svelte";
  export let db: Skill[];
  export let combos: Combo[];

  const skillGroups = groupBy(db, (skill) => skill.type);
  const skills = [
    ...skillGroups.Normal,
    ...skillGroups.Stacking,
    ...skillGroups.Ruin,
  ];
  const cards = skillGroups.Card;
  const tabs = ["Cards", "Skills", "Combos", "Basics", "Sources"];
  let selectedTabIdx = 0;

  function getCardName(id: number) {
    const card = find(cards, (card) => card.id === id);
    return card ? card.name : "";
  }

  function handleClickTab(i: number) {
    selectedTabIdx = i;
  }
</script>

<div class="glossary">
  <div class="tabs">
    {#each tabs as tab, i}
      <div
        class="tab"
        class:selected={selectedTabIdx === i}
        on:click={() => handleClickTab(i)}
      >
        {tab}
      </div>
    {/each}
  </div>
  <table class="glossary-content">
    {#if selectedTabIdx === 0}
      {#each cards as card}
        <SkillInfo skill={card} width={144} />
      {/each}
    {:else if selectedTabIdx === 1}
      {#each skills as skill}
        <SkillInfo {skill} />
      {/each}
    {:else if selectedTabIdx === 2}
      {#each combos as combo}
        <tr class="combo-info">
          <td class="combo-detail">
            {#each combo.cards as cardId}
              <div class="combo-cards">
                <img src={`${base}/arcanist/${cardId}.webp`} />
                <div class="card-name">{getCardName(cardId)}</div>
              </div>
            {/each}
          </td>
          <td class="combo-description">
            <div class="combo-rotations">
              {#each combo.rotations as rotation}
                <ComboRow {rotation} />
              {/each}
            </div>
            {#if combo.notes}
              <div class="combo-notes">
                {combo.notes}
              </div>
            {/if}
          </td>
        </tr>
      {/each}
    {:else if selectedTabIdx === 3}
      <StartInfo />
    {:else}
      <h3>Combos Guide by Evv</h3>
      <div>
        <a
          href="https://docs.google.com/document/d/1ttoHy8lvfvxAosRRNsojeDoK6HditxoeMYb4e2jDrDE"
          target="_blank">Google Doc</a
        >
      </div>
      <br />
      <h3>Arcana Guide by Eruca</h3>
      <div>
        <a
          href="https://docs.google.com/document/d/1XZVOmVz-Q9KpVJS4EF-Bs2mAp4vwIMskuxoXF23xXJc"
          target="_blank">Google Doc</a
        >
      </div>
      <br />
      <h3>Translated Guide by trg1234</h3>
      <div>
        <a
          href="https://docs.google.com/document/d/1ziX4iHTMd7eKNU-mBGuxMMD-P04bJ50Swshk0wi1oWM"
          target="_blank">Google Doc</a
        >
      </div>
      <div>
        <a href="https://www.youtube.com/watch?v=-O9frNTvr_E" target="_blank"
          >Youtube (KR)</a
        >
      </div>
      <br />
      <h3>Arcana Discord</h3>
      <div>
        <a href="https://discord.gg/Xc2NYwXEGt" target="_blank">Discord</a>
      </div>
    {/if}
  </table>
</div>

<style>
  .glossary {
    display: flex;
    flex-flow: column;
  }
  .glossary-content {
    table-layout: auto;
    border-spacing: 1rem;
    border-collapse: collapse;
    margin: 1rem;
  }
  .glossary-content div {
    font-size: 1.2em;
  }
  .glossary-content h3 {
    font-size: 1.4em;
  }
  td.combo-detail {
    width: auto;
  }
  td.combo-detail .card-name {
    font-size: 0.9em;
  }

  .tabs {
    position: sticky;
    display: flex;
    top: 0;
    background-color: #201932;
    z-index: 3;
  }
  .tab {
    margin: 1rem;
    width: 5rem;
    line-height: 2rem;
    text-align: center;
  }
  .tab:hover {
    background-color: #201932;
    cursor: pointer;
  }
  .tab.selected {
    border-bottom: 2px solid white;
    background-color: #201932;
  }

  tr.combo-info {
    display: flex;
    margin: 2rem 0;
  }
  .combo-info .combo-description {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin-left: 1.4rem;
  }

  .combo-info .combo-description .combo-notes {
    font-size: 1.1em;
  }

  .combo-description .combo-notes {
    margin-bottom: 2rem;
  }
  .combo-detail {
    display: flex;
  }
  .combo-detail .combo-cards {
    text-align: center;
  }
  .combo-detail .combo-cards img {
    width: 144px;
    height: auto;
  }

  @media (max-width: 600px) {
    .glossary-content h3 {
      font-size: 1.1em;
    }

    .glossary-content div {
      font-size: 1em;
    }

    .glossary-content h3:not(:first-child) {
      margin-top: 2.5rem;
    }

    .tab {
      font-size: 0.9em;
    }
    .glossary-content tr {
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
    }
    .combo-detail .combo-cards .card-name {
      font-size: 0.9em;
    }
    .combo-detail .combo-cards img {
      width: 64px;
    }
    .combo-info {
      padding: 0 2rem;
    }
    .combo-info .combo-description {
      font-size: 0.9em;
      margin: 1rem 0 0 0;
      text-align: center;
    }
    .combo-rotations {
      display: flex;
      flex-flow: column;
      align-items: center;
      margin-bottom: 1rem;
    }
  }
</style>
