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
        <div class={`wrapper c${correctness[i]}`}>
            <div 
                class={`skill-box`} 
                on:click={() => handleClick(i)}
                style="background-image: url('{`${base}/arcanist/${skillId}.webp`}')"
            />
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
        width: 64px;
        height: 64px;
        background-size: cover;
        background-position: left center;
    }

    .wrapper {
        position: relative;
    }

    .wrapper.c0 > .skill-box, .wrapper.c1 > .skill-box, .wrapper.c2 > .skill-box {
        filter: grayscale(1);
    }

    .wrapper.c0::after, .wrapper.c1::after, .wrapper.c2::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .wrapper.c0::after {
        background-color: rgba(193,0,13,0.55);
    }

    .wrapper.c1::after{
        background-color: rgba(255,208,0,0.55);
    }

    .wrapper.c2::after{
        background-color: rgba(49,188,58,0.55);
    }
</style>