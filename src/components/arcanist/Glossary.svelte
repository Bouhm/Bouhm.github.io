<script lang="ts">
    import { find, groupBy } from "lodash";
    import type { Combo, Skill } from "../../data/arcanist/types";
    import ComboRow from "./ComboRow.svelte";
    import SkillInfo from "./SkillInfo.svelte";
    import { base } from '$app/paths';
    export let hideCombos = false;
    export let db: Skill[];
    export let combos: Combo[];
    export let onClose: ()=>void;

    const skillGroups = groupBy(db, skill => skill.type)
    const skills = [...skillGroups.Normal, ...skillGroups.Stacking, ...skillGroups.Ruin];
    const cards = skillGroups.Card;
    const tabs = hideCombos ? ["Cards", "Skills"] : ["Cards", "Skills", "Combos"];
    let selectedTabIdx = 0;

    function getCardName(id: number) {
        const card = find(cards, card => card.id === id);
        return card ? card.name : ""
    }

    function handleClickTab(i: number) {
        selectedTabIdx = i;
    }

    function handleCloseGlossary() {
        onClose();
    }
</script>

<div class="glossary">
    <div class="glossary-close-button" on:click={handleCloseGlossary}>✖</div>
    <div class="tabs">
        {#each tabs as tab, i}
            <div class="tab" class:selected={selectedTabIdx === i} on:click={() => handleClickTab(i)}>{tab}</div>
        {/each}
    </div>
    <table class="glossary-content">
        {#if selectedTabIdx === 0}
            {#each cards as card}
                <SkillInfo skill={card} width={144} />
            {/each}
        {:else if selectedTabIdx === 1}
            {#each skills as skill}
                <SkillInfo skill={skill} />
            {/each}
        {:else}
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
                                <ComboRow rotation={rotation} />
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
        {/if}
    </table>
</div>


<style>
    .glossary {
        position: absolute;
        top: 0;
        right: 20rem;
        left: 20rem;
        bottom: 0;
        z-index: 1;
        background-color: #191328;
        overflow-y: auto;

        display: flex;
        flex-flow: column;
    }
    .glossary-content { 
        table-layout: auto;
        width: 100%;
        border-spacing: 1rem;
        border-collapse: collapse;
    }
    td.combo-detail {
        width: auto;
    }

    .glossary-content {
    }

    .tabs {
        display: flex;
    }
    .tab {
        margin: 2rem 1rem;
    }
    .tab:hover {
        background-color: #201932;
        cursor: pointer;
    }
    .tab.selected {
        border-bottom: 2px solid white;
        background-color: #201932;
    }

    .glossary-close-button {
        position: absolute;
        top: 0;
        right: 1rem;
        font-size: 3em;
    }
    .glossary-close-button:hover {
        cursor: pointer;
    }

    tr.combo-info {
        display: flex;
        margin: 2rem 0;
    }
    .combo-info .combo-description {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        font-size: 1.2em;
        margin-left: 1.4rem;
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
</style>