<script lang="ts">
    export let onClick: ()=>void;
    export let className = "";

    function handleClick() {
        onClick();
    }
</script>

<div class={`${className} button clickable`} on:click={handleClick}><slot /></div>

<style>
    .button {
        border-radius: 4px;
        width: 6rem;
        border: 2px solid white;
        padding: 0.5rem;
        text-align: center;
        margin-top: 2rem;
    }
</style>