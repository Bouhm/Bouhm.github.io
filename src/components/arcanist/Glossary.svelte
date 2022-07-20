<script lang="ts">
    import { find, groupBy } from "lodash";
    import type { Skill } from "../../data/arcanist/types";
    import ComboRow from "./ComboRow.svelte";
    import SkillInfo from "./SkillInfo.svelte";
    import { base } from '$app/paths';
    export let hideCombos = false;
    export let db: Skill[];
    export let combos: Combo[];
    export let onClose: ()=>void;

    const skillGroups = groupBy(db, skill => skill.type)
    const skills = [...skillGroups.Normal, ...skillGroups.Stack, ...skillGroups.Ruin];
    const cards = skillGroups.Card;
    
    const tabs = hideCombos ? ["Cards", "Skills"] : ["Cards", "Skills", "Combos"];
    let selectedTabIdx = 0;

    function getCardName(id: number) {
        const card = find(cards, card => card.id === id);
        return card ? card.name : ""
    }

    function handleCloseGlossary() {
        onClose();
    }
</script>

<div class="glossary">
    <div class="close-glossary" on:click={handleCloseGlossary}>✖</div>
    <div class="tabs">
        {#each tabs as tab}
            <div class="tab">{tab}</div>
        {/each}
    </div>
    <table class="glossary-content">
        {#if selectedTabIdx === 0}
            {#each skills as skill}
                <SkillInfo skill={skill} />
            {/each}
        {:else if selectedTabIdx === 1}
            {#each cards as card}
                <SkillInfo skill={card} />
            {/each}
        {:else}
            {#each combos as combo}
                <div class="combo-detail">
                    {#each combo.cards as cardId}
                        <div class="combo-cards">
                            <img src={`${base}/arcanist/${cardId}`} />
                            <div class="card-name">{getCardName(cardId)}</div>
                        </div>
                    {/each}
                </div>
                <div class="combo-rotations">
                    {#each combo.rotations as rotation}
                        <ComboRow rotation={rotation} />
                    {/each}
                </div>
            {/each}
        {/if}
    </div>
</table>


<style>

</style>