<script lang="ts">
    export let onClick: ()=>void;
    export let className = "";
    export let isIcon = false;

    function handleClick() {
        onClick();
    }
</script>

<div class:asIcon={isIcon} class={`${className} button clickable`} on:click={handleClick}><slot /></div>

<style>
    .button {
        border-radius: 4px;
        width: 6rem;
        border: 2px solid white;
        padding: 0.5rem;
        text-align: center;
        margin-top: 2rem;
    }

    .button.asIcon {
        width: auto;
        margin: 0;
    }
</style>