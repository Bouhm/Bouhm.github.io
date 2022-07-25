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
        src="{base}/arcanist/{id}.webp"
        width={isCard ? 128  : 64}
    />
    <div class="skill-key">{key}</div>
</div>

<style>
    .skill-icon {
        position: relative;
        display: flex;
        flex-flow: column;
        align-items: center;
        height: 64px;
        margin: 0;
    }
    .skill-icon img {
        height: auto;
    }
    .skill-icon.onCd {
        filter: grayscale(1) brightness(0.8);
    }
    div.skill-key {
        position: absolute; 
        bottom: 0;
        text-transform: uppercase;
        background: rgba(0,0,0,0.7);
        padding: 0 0.3rem;
        outline: none;
        border: none;
        color: white;
    }
</style>