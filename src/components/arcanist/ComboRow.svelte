<script lang="ts">
    import { base } from '$app/paths';
    export let rotation: number[];
    export let correctness: number[] = [];
    export let max = -1;
    export let onClick: ((idx: number)=>void) | null = null;

    function handleClick(i: number) {
        onClick && onClick(i);
    }
</script>

<div class="combo-row">
    {#each rotation as skillId, i} 
        <div 
            class={`skill-box c${correctness[i] || ''}`} 
            on:click={() => handleClick(i)}
        >
            <img src={`${base}/arcanist/${skillId}.webp`} />
        </div>
    {/each}
    <!-- Empty slots when guessing -->
    {#if max && max > rotation.length}
        {#each Array(max - rotation.length) as _}
            <div class="skill-box" />
        {/each}
    {/if}
</div>

<style>
    .combo-row {
        display: flex
    }

    .skill-box {

    }
 
    .skillbox.c0:after {
        content:'';
        background-color: rgba();
    }

    .skillbox.c1{
        content:'';
        background-color: rgba();
    }

    .skillbox.c2{
        content:'';
        background-color: rgba();
    }
</style>