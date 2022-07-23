<script lang="ts">
    import { base } from '$app/paths';
    export let id: number;
    export let key: string;
    export let onClick: (id: number) => void;
    export let isOnCd = false;
    export let isCard = false;

    function handleClick() {
        onClick(id);
    }
</script>

<div class:onCd={isOnCd} class="skill-icon clickable" on:click={handleClick}>
    <img 
        src={`${base}/arcanist/${id}.webp`} 
        width={isCard ? 128  : 64}
    />
    <div class="skill-key">{key}</div>
</div>

<style>
    .skill-icon {
        display: flex;
        flex-flow: column;
        align-items: center;
        margin: 1rem 0.3rem 1rem 0.3rem;
    }
    .skill-icon img {
        height: auto;
    }
    .skill-icon.onCd {
        filter: grayscale(1) brightness(0.8);
    }
</style>