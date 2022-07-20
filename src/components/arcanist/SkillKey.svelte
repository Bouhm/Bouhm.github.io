<script lang="ts">
    import { base } from '$app/paths';
    export let id: number;
    export let key: string;
    export let onClick: (id: number) => void;

    function handleClick() {
        onClick(id);
    }
</script>

<div class="skill-icon" on:click={handleClick}>
    <img src={`${base}/arcanist/${id}.webp`} />
    <div class="skill-key">{key}</div>
</div>

<style>
    .skill-icon {
        display: flex;
        flex-flow: column;
        align-items: center;
        margin: 0.5rem;
    }
    .skill-icon img {
        width: 64px;
        height: auto;
    }
</style>