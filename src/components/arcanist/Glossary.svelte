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
    <div class="close-glossary" on:click={handleCloseGlossary}>✖</div>
    <div class="tabs">
        {#each tabs as tab, i}
            <div class="tab" on:click={() => handleClickTab(i)}>{tab}</div>
        {/each}
    </div>
    <table class="glossary-content">
        {#if selectedTabIdx === 0}
            {#each cards as card}
                <SkillInfo skill={card} />
            {/each}
        {:else if selectedTabIdx === 1}
            {#each skills as skill}
                <SkillInfo skill={skill} />
            {/each}
        {:else}
            {#each combos as combo}
                <tr>
                    <td class="combo-detail">
                        {#each combo.cards as cardId}
                            <div class="combo-cards">
                                <img src={`${base}/arcanist/${cardId}.webp`} />
                                <div class="card-name">{getCardName(cardId)}</div>
                            </div>
                        {/each}
                        </td>
                    <td class="combo-rotations">
                        {#each combo.rotations as rotation}
                            <ComboRow rotation={rotation} />
                        {/each}
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
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
    }
</style>