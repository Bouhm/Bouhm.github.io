<script lang="ts">
    export let title: string;
    export let onClose: (()=>void) | null = null;

    function handleClose() {
        onClose && onClose();
    }
</script>

<div class="view">
    <div class="view-title">
        <h1>{title}</h1>
        <div class="view-close-button clickable" on:click={handleClose}>✖</div>
    </div>
    <slot />
</div>

<style>
    .view {
        position: fixed;
        padding: 1.5rem;
        top: 0;
        right: 15%;
        left: 15%;
        bottom: 0;
        z-index: 1;
        background-color: #191328;
        overflow-y: auto;
    }
    
    .view-title {
        margin-bottom: 2rem;
    }
    .view-title h1 {
        margin-top: 0;
    }

    .view-close-button {
        position: absolute;
        top: 0;
        right: 1rem;
        font-size: 3em;
    }
</style>