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
            class={`skill-box c${correctness[i]}`} 
            on:click={() => handleClick(i)}
            style="background-image: url('{`${base}/arcanist/${skillId}.webp`}')"
        />
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
        position: relative;
        border-width: 2px 1px 2px 1px;
        border-color: #FFB200;
        border-style: solid;
        width: 64px;
        height: 64px;
        background-size: cover;
        background-position: left center;
    }
 
    .skill-box.c0::after, .skill-box.c1::after, .skill-box.c2::after {
        content:'';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .skill-box.c0::after {
        background-color: rgba(193, 0, 13, 0.55);
    }

    .skill-box.c1::after{
        background-color: rgba(255, 208, 0, 0.55);
    }

    .skill-box.c2::after{
        background-color: rgba(49, 188, 58, 0.55);
    }
</style>